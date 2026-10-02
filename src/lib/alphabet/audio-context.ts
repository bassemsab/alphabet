import { PCM_WORKLET_SOURCE } from "./pcm-worklet-source";

let ctx: AudioContext | null = null;
let workletReady: Promise<void> | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    ctx = new AudioCtxClass();
  }
  return ctx;
}

export function ensurePcmWorklet(context: AudioContext = getAudioContext()): Promise<void> {
  if (!workletReady) {
    const url = URL.createObjectURL(new Blob([PCM_WORKLET_SOURCE], { type: "application/javascript" }));
    workletReady = context.audioWorklet
      .addModule(url)
      .finally(() => URL.revokeObjectURL(url));
    workletReady.catch(() => {
      workletReady = null;
    });
  }
  return workletReady;
}

export function pcmChunksToWav(chunks: Int16Array[], sampleRate: number): Blob {
  const samples = chunks.reduce((n, c) => n + c.length, 0);
  const dataSize = samples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  const pcm = new Int16Array(buffer, 44, samples);
  let offset = 0;
  for (const chunk of chunks) {
    pcm.set(chunk, offset);
    offset += chunk.length;
  }
  return new Blob([buffer], { type: "audio/wav" });
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result as string;
      const base64 = res.split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
