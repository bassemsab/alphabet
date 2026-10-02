export interface PronunciationVerdict {
  heard: boolean;
  transcript: string | null;
  correct: boolean;
  feedback: string | null;
  targetIpa: string | null;
}

const OPENROUTER_MODELS = [
  "thinkingmachines/inkling-small:free",
  "thinkingmachines/inkling:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
];

function normalizeSpoken(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[.,!?;:"'()«»“”‘’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesSpoken(heardText: string, expectedText: string): boolean {
  const heard = normalizeSpoken(heardText);
  const want = normalizeSpoken(expectedText);
  if (!heard || !want) return false;
  if (heard === want) return true;
  if (heard.includes(want) || want.includes(heard)) return true;
  const heardTokens = heard.split(" ");
  const wantTokens = want.split(" ");
  return wantTokens.every((w) => heardTokens.includes(w));
}

/**
 * Attempt evaluation using OpenRouter Multimodal Audio Models.
 */
async function judgeWithOpenRouter(
  wavBase64: string,
  expected: string,
  modelId: string,
  apiKey: string
): Promise<PronunciationVerdict | null> {
  const promptText = `The attached audio is a French learner attempting to say "${expected}".
Listen to the audio clip and respond ONLY with a JSON object in this exact schema:
{
  "heard": boolean (false if silence or only background noise, true if speech is heard),
  "transcript": string or null (phonetic or actual words heard, or "NO_SPEECH" if silent),
  "correct": boolean (true if recognizable attempt at "${expected}", false if wrong word or serious phonetic substitution),
  "feedback": string or null (short encouraging tip in French if incorrect, or null if correct),
  "targetIpa": string or null (IPA transcription of "${expected}")
}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cursor.com",
        "X-Title": "Cursor",
        "User-Agent": "Cursor/0.45.0"
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: promptText },
              {
                type: "input_audio",
                input_audio: {
                  data: wavBase64,
                  format: "wav"
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[openrouter] Model ${modelId} returned ${res.status}: ${errText.slice(0, 150)}`);
      return null;
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const heard = parsed.heard !== false && parsed.transcript !== "NO_SPEECH";
    return {
      heard,
      transcript: heard ? (parsed.transcript || null) : null,
      correct: heard && !!parsed.correct,
      feedback: parsed.feedback || (parsed.correct ? "Excellent ! Bonne prononciation." : "Réessayez en articulant bien."),
      targetIpa: parsed.targetIpa || null
    };
  } catch (err: any) {
    console.warn(`[openrouter] Error calling ${modelId}:`, err.message);
    return null;
  }
}

/**
 * Fallback transcription via Groq Whisper when OpenRouter requires account balance.
 */
async function judgeWithGroq(wavBase64: string, expected: string, apiKey: string): Promise<PronunciationVerdict | null> {
  try {
    const bytes = Buffer.from(wavBase64, "base64");
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: "audio/wav" }), "audio.wav");
    form.append("model", "whisper-large-v3-turbo");
    form.append("language", "fr");
    form.append("prompt", expected);

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form
    });

    if (!res.ok) {
      console.warn(`[groq] Whisper returned ${res.status}`);
      return null;
    }

    const data = (await res.json()) as { text?: string };
    const transcript = (data?.text || "").trim();
    if (!transcript) {
      return {
        heard: false,
        transcript: null,
        correct: false,
        feedback: "Aucun son clair détecté. Rapprochez-vous du micro.",
        targetIpa: null
      };
    }

    const isCorrect = matchesSpoken(transcript, expected);
    return {
      heard: true,
      transcript,
      correct: isCorrect,
      feedback: isCorrect
        ? "Bravo ! Bonne prononciation."
        : `Entendu : "${transcript}". Réessayez en articulant clairement.`,
      targetIpa: null
    };
  } catch (err: any) {
    console.warn("[groq] Transcribe error:", err.message);
    return null;
  }
}

/**
 * Main pronunciation judgment function with model waterfall:
 * 1. OpenRouter (thinkingmachines/inkling-small:free)
 * 2. OpenRouter (thinkingmachines/inkling:free)
 * 3. OpenRouter (nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free)
 * 4. Groq Whisper (free fallback)
 */
export async function evaluatePronunciation(wavBase64: string, expected: string): Promise<PronunciationVerdict> {
  const openRouterKey = process.env.OPENROUTER_API_KEY || "";
  const groqKey = process.env.GROQ_API_KEY || "";

  // 1. Try OpenRouter free models in sequence
  if (openRouterKey) {
    for (const modelId of OPENROUTER_MODELS) {
      const verdict = await judgeWithOpenRouter(wavBase64, expected, modelId, openRouterKey);
      if (verdict !== null) {
        return verdict;
      }
    }
  }

  // 2. Try Groq Whisper fallback
  if (groqKey) {
    const groqVerdict = await judgeWithGroq(wavBase64, expected, groqKey);
    if (groqVerdict !== null) {
      return groqVerdict;
    }
  }

  // 3. Graceful fallback if no external API responded
  return {
    heard: false,
    transcript: null,
    correct: false,
    feedback: "Service d'évaluation temporairement indisponible. Veuillez rééssayer.",
    targetIpa: null
  };
}
