import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

/**
 * Synthesize French speech using Microsoft Edge Neural TTS.
 * High quality neural French voice: fr-FR-DeniseNeural or fr-FR-HenriNeural.
 */
export async function synthesizeFrench(text: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("fr-FR-DeniseNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    audioStream.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    audioStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    audioStream.on("error", (err: Error) => {
      reject(err);
    });
  });
}
