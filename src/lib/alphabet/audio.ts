let sharedAudioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentAudioEl: HTMLAudioElement | null = null;
const decodedBufferCache = new Map<string, AudioBuffer>();

/**
 * Get the shared AudioContext (native device sample rate).
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass();
    }
  }
  return sharedAudioCtx;
}

/**
 * Unlock mobile audio playback during a user gesture (e.g. click "Entrer en Plein Écran").
 * Mobile Safari blocks subsequent audio if not primed during a touch/click gesture.
 */
export async function unlockAudio(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      await ctx.resume().catch(() => {});
    }
    // Play a 1-sample silent sound through Web Audio to lift the iOS autoplay restriction
    if (ctx) {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }
  } catch (e) {
    console.warn("[audio] Unlock warning:", e);
  }
}

/**
 * Stop any running audio playback.
 */
export function stopAlphabetAudio() {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch {}
    currentSource = null;
  }
  if (currentAudioEl) {
    try {
      currentAudioEl.pause();
      currentAudioEl.currentTime = 0;
    } catch {}
    currentAudioEl = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Fallback to browser SpeechSynthesis if network/audio is completely unavailable.
 */
function playLocalSpeech(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.9;

      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find((v) => v.lang.startsWith("fr") || v.lang.replace("_", "-").startsWith("fr"));
      if (frVoice) utterance.voice = frVoice;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

/**
 * Play French audio clip using Gemini TTS (Aoede voice) via Web Audio API.
 * Web Audio ensures reliable, low-latency playback on iOS Safari, Android, and desktop.
 */
export async function playFrenchAudio(
  text: string,
  onPlayStateChange?: (playing: boolean) => void
): Promise<boolean> {
  stopAlphabetAudio();
  onPlayStateChange?.(true);

  const cleanText = text.trim();
  if (!cleanText) {
    onPlayStateChange?.(false);
    return false;
  }

  const normalized = cleanText.toLowerCase();

  try {
    const ctx = getAudioContext();
    if (ctx) {
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {});
      }

      // Check in-memory decoded buffer cache for zero-latency repeat playback
      let audioBuffer = decodedBufferCache.get(normalized);

      if (!audioBuffer) {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: cleanText })
        });

        if (!res.ok) throw new Error(`TTS server returned ${res.status}`);

        const arrayBuf = await res.arrayBuffer();
        // ctx.decodeAudioData detaches the arrayBuffer, so pass a slice if needed
        audioBuffer = await ctx.decodeAudioData(arrayBuf);
        if (decodedBufferCache.size < 200) {
          decodedBufferCache.set(normalized, audioBuffer);
        }
      }

      return new Promise<boolean>((resolve) => {
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer!;
        source.connect(ctx.destination);
        currentSource = source;

        source.onended = () => {
          if (currentSource === source) {
            currentSource = null;
          }
          onPlayStateChange?.(false);
          resolve(true);
        };

        source.start(0);
      });
    }

    // Fallback: HTML5 Audio
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: cleanText })
    });

    if (res.ok) {
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      return new Promise<boolean>((resolve) => {
        const audio = new Audio(audioUrl);
        currentAudioEl = audio;

        audio.onended = () => {
          currentAudioEl = null;
          URL.revokeObjectURL(audioUrl);
          onPlayStateChange?.(false);
          resolve(true);
        };

        audio.onerror = async () => {
          currentAudioEl = null;
          URL.revokeObjectURL(audioUrl);
          await playLocalSpeech(cleanText);
          onPlayStateChange?.(false);
          resolve(true);
        };

        audio.play().catch(async () => {
          currentAudioEl = null;
          URL.revokeObjectURL(audioUrl);
          await playLocalSpeech(cleanText);
          onPlayStateChange?.(false);
          resolve(true);
        });
      });
    }

    await playLocalSpeech(cleanText);
    onPlayStateChange?.(false);
    return true;
  } catch (err) {
    console.warn("[audio] Play error:", err);
    await playLocalSpeech(cleanText);
    onPlayStateChange?.(false);
    return true;
  }
}
