import { getAudioContext, ensurePcmWorklet, pcmChunksToWav, blobToBase64 } from "./audio-context";
import type { PronunciationVerdict, SpeechSession } from "./types";

export type { SpeechSession };

export function recordAndJudgeSpeech(
  expectedWord: string,
  uiLang: string,
  onStateChange: (state: "listening" | "evaluating" | "idle") => void,
  onResult: (verdict: PronunciationVerdict) => void
): SpeechSession {
  if (typeof window === "undefined") {
    onResult({
      correct: false,
      heard: false,
      transcript: null,
      feedback: "Speech recognition is only supported in browser environments."
    });
    return { stop: () => {}, cancel: () => {} };
  }

  let stopped = false;
  let cancelled = false;
  let autoStopTimer: ReturnType<typeof setTimeout> | null = null;
  let stream: MediaStream | null = null;
  let captureSource: MediaStreamAudioSourceNode | null = null;
  let captureNode: AudioWorkletNode | null = null;
  let captureSink: MediaStreamAudioDestinationNode | null = null;
  const chunks: Int16Array[] = [];
  let captureId = Date.now();

  function cleanup() {
    if (captureNode) {
      try { captureNode.port.postMessage({ type: "stop", id: captureId }); } catch {}
      captureNode.port.onmessage = null;
    }
    try { captureSource?.disconnect(); } catch {}
    try { captureNode?.disconnect(); } catch {}
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    captureSource = null;
    captureNode = null;
    captureSink = null;
    chunks.length = 0;
  }

  async function finishAndEvaluate() {
    if (stopped || cancelled) return;
    stopped = true;
    if (autoStopTimer) {
      clearTimeout(autoStopTimer);
      autoStopTimer = null;
    }
    onStateChange("evaluating");

    const ctx = getAudioContext();
    const sampleRate = ctx.sampleRate;
    const recordedChunks = [...chunks];
    cleanup();

    if (recordedChunks.length === 0) {
      onStateChange("idle");
      onResult({
        correct: false,
        heard: false,
        transcript: null,
        feedback: "Aucun son détecté. Veuillez réessayer."
      });
      return;
    }

    try {
      const wavBlob = pcmChunksToWav(recordedChunks, sampleRate);
      const audioBase64 = await blobToBase64(wavBlob);

      const res = await fetch("/api/speak-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: audioBase64,
          expected: expectedWord,
          uiLang
        })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      onStateChange("idle");
      onResult({
        correct: !!data.correct,
        heard: !!data.heard,
        transcript: data.transcript || null,
        feedback: data.feedback || (data.correct ? "Bravo ! Bonne prononciation." : "Réessayez en articulant bien.")
      });
    } catch (err: any) {
      console.error("[alphabet/speech] evaluation error:", err);
      onStateChange("idle");
      onResult({
        correct: false,
        heard: false,
        transcript: null,
        feedback: "Erreur de connexion au serveur d'évaluation vocale."
      });
    }
  }

  function cancel() {
    cancelled = true;
    stopped = true;
    if (autoStopTimer) {
      clearTimeout(autoStopTimer);
      autoStopTimer = null;
    }
    cleanup();
    onStateChange("idle");
  }

  async function start() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {});
      }

      await ensurePcmWorklet(ctx);
      if (cancelled) {
        cleanup();
        return;
      }

      captureSource = ctx.createMediaStreamSource(stream);
      captureNode = new AudioWorkletNode(ctx, "pcm-recorder");
      captureSink = ctx.createMediaStreamDestination();

      captureSource.connect(captureNode);
      captureNode.connect(captureSink);

      const id = ++captureId;
      captureNode.port.onmessage = (event) => {
        const msg = event.data;
        if (!msg || msg.id !== id || msg.type !== "chunk" || stopped || cancelled) return;
        const chunk = msg.pcm as Int16Array;
        chunks.push(chunk);
      };

      captureNode.port.postMessage({ type: "start", id });
      onStateChange("listening");

      // Auto-stop after 5 seconds max if the user forgets to tap stop
      autoStopTimer = setTimeout(() => {
        if (!stopped && !cancelled) {
          finishAndEvaluate();
        }
      }, 5000);
    } catch (err: any) {
      console.error("[alphabet/speech] Microphone access error:", err);
      cleanup();
      onStateChange("idle");
      onResult({
        correct: false,
        heard: false,
        transcript: null,
        feedback: "Impossible d'accéder au microphone. Veuillez autoriser l'accès."
      });
    }
  }

  start();

  return {
    stop: finishAndEvaluate,
    cancel
  };
}
