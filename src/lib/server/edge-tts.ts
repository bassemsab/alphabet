import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

/**
 * Synthesize French speech using Microsoft Edge Neural TTS.
 * High quality neural French voice: fr-FR-DeniseNeural or fr-FR-HenriNeural.
 */
export async function synthesizeFrench(text: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("fr-FR-DeniseNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const stream = tts.toStream(text);

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", (err: Error) => {
      reject(err);
    });
  });
}
