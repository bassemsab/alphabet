let currentAudio: HTMLAudioElement | null = null;

export function stopAlphabetAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

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

export async function playFrenchAudio(text: string, onPlayStateChange?: (playing: boolean) => void): Promise<boolean> {
  stopAlphabetAudio();
  onPlayStateChange?.(true);

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    }).catch(() => null);

    if (res && res.ok) {
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      return new Promise<boolean>((resolve) => {
        const audio = new Audio(audioUrl);
        currentAudio = audio;

        audio.onended = () => {
          currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          onPlayStateChange?.(false);
          resolve(true);
        };

        audio.onerror = async () => {
          currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          await playLocalSpeech(text);
          onPlayStateChange?.(false);
          resolve(true);
        };

        audio.play().catch(async () => {
          currentAudio = null;
          URL.revokeObjectURL(audioUrl);
          await playLocalSpeech(text);
          onPlayStateChange?.(false);
          resolve(true);
        });
      });
    }

    await playLocalSpeech(text);
    onPlayStateChange?.(false);
    return true;
  } catch {
    await playLocalSpeech(text);
    onPlayStateChange?.(false);
    return true;
  }
}
