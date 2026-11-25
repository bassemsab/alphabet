import { GoogleGenAI } from "@google/genai";
import { synthesizeFrench as synthesizeEdge } from "./edge-tts";

export const VOICE_NAME = process.env.GEMINI_VOICE_NAME || "Aoede";
export const TTS_MODEL = process.env.GEMINI_TTS_MODEL || "gemini-3.1-flash-tts-preview";
export const TTS_SAMPLE_RATE = 24000;
export const TTS_MIME = "audio/wav";

/**
 * Normalizes spoken text for natural French TTS prosody and avoids Gemini
 * rejecting isolated all-caps words (e.g. "AVOCAT" -> "Avocat.").
 */
export function prepareTtsText(raw: string): string {
  let t = raw.trim();
  // If the word or phrase is entirely uppercase, convert to Title/Sentence case
  if (t === t.toUpperCase() && /[A-Z]/.test(t)) {
    t = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  }
  // Ensure ending punctuation for clean cadence & intonation
  if (!/[.!?]$/.test(t)) {
    t += ".";
  }
  return t;
}

/**
 * Wrap raw mono PCM16 in a 44-byte canonical WAV header.
 * Gemini TTS returns 24kHz 16-bit mono PCM.
 */
export function pcmToWav(pcm: Buffer, sampleRate = TTS_SAMPLE_RATE): Buffer {
  const channels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

/**
 * Synthesize speech in Gemini's Aoede voice (same as ether-frontend / ami-frontend).
 */
export async function synthesizeGemini(
  text: string,
  voice = VOICE_NAME
): Promise<{ buffer: Buffer; mime: string }> {
  const spokenText = prepareTtsText(text);
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("[gemini-tts] No GOOGLE_API_KEY found, falling back to edge-tts");
    const edgeBuffer = await synthesizeEdge(spokenText);
    return { buffer: edgeBuffer, mime: "audio/mpeg" };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const stream = await ai.models.generateContentStream({
      model: TTS_MODEL,
      contents: [{ role: "user", parts: [{ text: spokenText }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
          languageCode: "fr-FR"
        }
      }
    });

    const pcmChunks: Buffer[] = [];
    for await (const chunk of stream) {
      const parts = (chunk as any).candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (part?.inlineData?.data) {
          pcmChunks.push(Buffer.from(part.inlineData.data, "base64"));
        }
      }
    }

    if (pcmChunks.length === 0) {
      throw new Error(`Gemini TTS returned no audio chunks for "${spokenText}"`);
    }

    const wavBuffer = pcmToWav(Buffer.concat(pcmChunks));
    return { buffer: wavBuffer, mime: TTS_MIME };
  } catch (err: any) {
    console.error("[gemini-tts] Error synthesizing with Gemini:", err?.message || err);
    console.log("[gemini-tts] Falling back to Edge TTS...");
    try {
      const edgeBuffer = await synthesizeEdge(spokenText);
      return { buffer: edgeBuffer, mime: "audio/mpeg" };
    } catch (edgeErr: any) {
      console.error("[gemini-tts] Edge TTS fallback failed:", edgeErr?.message || edgeErr);
      throw err;
    }
  }
}
