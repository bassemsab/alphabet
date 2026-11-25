<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { KitchenStage } from "$lib/3d/KitchenStage";
  import { playFrenchAudio, stopAlphabetAudio, unlockAudio } from "$lib/alphabet/audio";
  import { getAudioContext, ensurePcmWorklet, pcmChunksToWav } from "$lib/alphabet/audio-context";
  import { progress } from "$lib/stores/progress.svelte";

  interface Challenge {
    id: string;
    name: string;
    icon: string;
    targetWord: string;
  }

  interface LevelConfig {
    levelNumber: number;
    letter: string;
    title: string;
    subtitle: string;
    description: string;
    challenges: Challenge[];
  }

  const LEVELS: LevelConfig[] = [
    {
      levelNumber: 1,
      letter: "A",
      title: "Niveau 1 : La Lettre A",
      subtitle: "La Cuisine de Fatima",
      description: "Fatima vous montre les objets de la lettre A : Avion, Arbre et Ananas.",
      challenges: [
        { id: "avion", name: "AVION", icon: "✈️", targetWord: "avion" },
        { id: "arbre", name: "ARBRE", icon: "🌳", targetWord: "arbre" },
        { id: "ananas", name: "ANANAS", icon: "🍍", targetWord: "ananas" }
      ]
    },
    {
      levelNumber: 2,
      letter: "B",
      title: "Niveau 2 : La Lettre B",
      subtitle: "Le Buffet de Fatima",
      description: "Fatima vous présente les objets de la lettre B : Bateau, Banane et Ballon.",
      challenges: [
        { id: "bateau", name: "BATEAU", icon: "⛵", targetWord: "bateau" },
        { id: "banane", name: "BANANE", icon: "🍌", targetWord: "banane" },
        { id: "ballon", name: "BALLON", icon: "⚽", targetWord: "ballon" }
      ]
    },
    {
      levelNumber: 3,
      letter: "C",
      title: "Niveau 3 : La Lettre C",
      subtitle: "Le Comptoir de Fatima",
      description: "Fatima vous montre les objets de la lettre C : Cerise, Citron et Carotte.",
      challenges: [
        { id: "cerise", name: "CERISE", icon: "🍒", targetWord: "cerise" },
        { id: "citron", name: "CITRON", icon: "🍋", targetWord: "citron" },
        { id: "carotte", name: "CAROTTE", icon: "🥕", targetWord: "carotte" }
      ]
    }
  ];

  let hasStarted = $state(false);
  let currentLevelIndex = $state(0);
  let currentLevel = $derived(LEVELS[currentLevelIndex]);
  let currentChallengeIndex = $state(0);
  let currentChallenge = $derived(currentLevel.challenges[currentChallengeIndex]);

  // Full Screen & Escape Mode State
  let isEscaped = $state(false);
  let isPointerLocked = $state(false);
  let isLoadingModels = $state(true);

  // 3D Canvas & Raycasting
  let canvasContainer = $state<HTMLDivElement | null>(null);
  let stage: KitchenStage | null = null;
  let hoveredObject = $state<string | null>(null);

  // Voice Recording & Listening State (race-safe PCM WAV + MediaRecorder fallback)
  let isRequestingMic = $state(false);
  let isListening = $state(false);
  let isEvaluating = $state(false);
  let recordingStartedAt = 0;
  let audioStream: MediaStream | null = null;
  let pcmChunks: Int16Array[] = [];
  let pcmMaxPeak = 0;
  let captureSource: MediaStreamAudioSourceNode | null = null;
  let captureNode: AudioWorkletNode | null = null;
  let captureId = 0;
  let fallbackRecorder: MediaRecorder | null = null;
  let fallbackChunks: Blob[] = [];
  let fallbackMime = "audio/webm";
  let recordTimer: ReturnType<typeof setTimeout> | null = null;
  let lastScore = $state<number | null>(null);

  // Level Complete & Toast State
  let isLevelComplete = $state(false);
  let toastMessage = $state<string | null>(null);
  let toastTimeout: ReturnType<typeof setTimeout> | null = null;

  // Mobile Virtual Joystick & Fire Button State
  let isTouchDevice = $state(false);
  let forceMobileControls = $state(false);
  let joystickActive = $state(false);
  let joystickPos = $state({ x: 0, y: 0 });
  let joystickBaseEl = $state<HTMLDivElement | null>(null);
  let activeJoystickPointerId: number | null = null;
  const JOYSTICK_RADIUS = 46;

  function handleJoystickPointerDown(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (activeJoystickPointerId !== null) return;
    activeJoystickPointerId = e.pointerId;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    joystickActive = true;
    updateJoystickFromPointer(e);
  }

  function handleJoystickPointerMove(e: PointerEvent) {
    if (activeJoystickPointerId !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    updateJoystickFromPointer(e);
  }

  function handleJoystickPointerUp(e: PointerEvent) {
    if (activeJoystickPointerId !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    activeJoystickPointerId = null;
    joystickActive = false;
    joystickPos = { x: 0, y: 0 };
    if (stage) {
      stage.joystickMove.x = 0;
      stage.joystickMove.y = 0;
    }
  }

  function updateJoystickFromPointer(e: PointerEvent) {
    if (!joystickBaseEl) return;
    const rect = joystickBaseEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > JOYSTICK_RADIUS) {
      dx = (dx / dist) * JOYSTICK_RADIUS;
      dy = (dy / dist) * JOYSTICK_RADIUS;
    }

    joystickPos = { x: dx, y: dy };

    if (stage) {
      stage.joystickMove.x = dx / JOYSTICK_RADIUS;
      stage.joystickMove.y = dy / JOYSTICK_RADIUS;
    }
  }

  function handleFirePointerDown(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    unlockAudio();

    if (isListening && Date.now() - recordingStartedAt > 250) {
      stopListeningAndEvaluate();
      return;
    }

    if (stage) {
      stage.triggerCenterInteraction();
    }
  }

  function showToast(msg: string, duration: number = 2800) {
    toastMessage = msg;
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastMessage = null;
    }, duration);
  }

  function fatimaSpeakAndPoint() {
    if (stage) {
      stage.setListening(false);
      stage.pointAtObject(currentChallenge.id);
      stage.speakGesture(2.5);
    }
    playFrenchAudio(currentChallenge.targetWord);
  }

  async function enterGame() {
    await unlockAudio();
    hasStarted = true;
    isEscaped = false;
    if (stage) {
      stage.pointAtObject(currentChallenge.id);
      stage.requestLock();
    }
    setTimeout(() => {
      fatimaSpeakAndPoint();
    }, 400);
  }

  function resumeFullscreen() {
    isEscaped = false;
    if (stage && !isLevelComplete) {
      stage.requestLock();
    }
  }

  function cleanupAudioCapture() {
    if (recordTimer) {
      clearTimeout(recordTimer);
      recordTimer = null;
    }
    if (captureNode) {
      try { captureNode.port.postMessage({ type: "stop", id: captureId }); } catch {}
      captureNode.port.onmessage = null;
    }
    try { captureSource?.disconnect(); } catch {}
    try { captureNode?.disconnect(); } catch {}
    captureSource = null;
    captureNode = null;
    if (fallbackRecorder && fallbackRecorder.state !== "inactive") {
      try { fallbackRecorder.stop(); } catch {}
    }
    fallbackRecorder = null;
    if (audioStream) {
      audioStream.getTracks().forEach((t) => t.stop());
      audioStream = null;
    }
  }

  onMount(() => {
    const updateTouch = () => {
      isTouchDevice =
        typeof window !== "undefined" &&
        (window.matchMedia("(pointer: coarse)").matches ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0);
    };
    updateTouch();
    window.addEventListener("resize", updateTouch);

    if (canvasContainer) {
      stage = new KitchenStage(
        canvasContainer,
        handle3DObjectClick,
        (hovered) => {
          hoveredObject = hovered;
        },
        (locked) => {
          isPointerLocked = locked;
        },
        (loading) => {
          isLoadingModels = loading;
        }
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        isEscaped = true;
        if (stage) stage.exitLock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Disable mobile Safari gesture & double-tap zoom
    const preventGesture = (e: Event) => e.preventDefault();
    window.addEventListener("gesturestart" as any, preventGesture, { passive: false });
    window.addEventListener("gesturechange" as any, preventGesture, { passive: false });
    window.addEventListener("gestureend" as any, preventGesture, { passive: false });

    const preventMultiTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    window.addEventListener("touchmove", preventMultiTouch, { passive: false });

    let lastTouchEnd = 0;
    const preventDoubleTap = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    };
    window.addEventListener("touchend", preventDoubleTap, { passive: false });

    return () => {
      window.removeEventListener("resize", updateTouch);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("gesturestart" as any, preventGesture);
      window.removeEventListener("gesturechange" as any, preventGesture);
      window.removeEventListener("gestureend" as any, preventGesture);
      window.removeEventListener("touchmove", preventMultiTouch);
      window.removeEventListener("touchend", preventDoubleTap);
    };
  });

  onDestroy(() => {
    cleanupAudioCapture();
    if (stage) stage.destroy();
    stopAlphabetAudio();
    if (toastTimeout) clearTimeout(toastTimeout);
  });

  function handle3DObjectClick(objectId: string) {
    if (isListening && Date.now() - recordingStartedAt > 250) {
      stopListeningAndEvaluate();
      return;
    }

    if (objectId === "fatima") {
      fatimaSpeakAndPoint();
      return;
    }

    if (objectId === currentChallenge.id && !isRequestingMic && !isListening && !isEvaluating) {
      startImmediateListening();
    } else if (objectId && objectId !== currentChallenge.id && !isListening) {
      showToast(`Regardez ${currentChallenge.name} (${currentChallenge.icon}) pointé par Fatima !`);
    }
  }

  function playErrorBuzz() {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {}
  }

  async function startImmediateListening() {
    if (isRequestingMic || isListening || isEvaluating) return;
    isRequestingMic = true;
    lastScore = null;
    pcmChunks = [];
    pcmMaxPeak = 0;
    fallbackChunks = [];

    if (stage) {
      stage.setListening(true);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      audioStream = stream;

      // Prefer crisp 16-bit PCM WAV capture (reliable across iOS Safari, Chrome, Firefox)
      let startedWorklet = false;
      try {
        const ctx = getAudioContext();
        if (ctx.state === "suspended") await ctx.resume().catch(() => {});
        await ensurePcmWorklet(ctx);

        captureSource = ctx.createMediaStreamSource(stream);
        captureNode = new AudioWorkletNode(ctx, "pcm-recorder");
        const sink = ctx.createMediaStreamDestination();
        captureSource.connect(captureNode);
        captureNode.connect(sink);

        const id = ++captureId;
        captureNode.port.onmessage = (event) => {
          const msg = event.data;
          if (!msg || msg.id !== id || msg.type !== "chunk" || !isListening) return;
          const chunk = msg.pcm as Int16Array;
          pcmChunks.push(chunk);
          for (let i = 0; i < chunk.length; i += 8) {
            const abs = Math.abs(chunk[i]);
            if (abs > pcmMaxPeak) pcmMaxPeak = abs;
          }
        };
        captureNode.port.postMessage({ type: "start", id });
        startedWorklet = true;
      } catch (workletErr) {
        console.warn("[monde] PCM Worklet unavailable, falling back to MediaRecorder:", workletErr);
      }

      if (!startedWorklet) {
        fallbackMime =
          typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm")
              ? "audio/webm"
              : typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/mp4")
                ? "audio/mp4"
                : "";

        fallbackRecorder = fallbackMime
          ? new MediaRecorder(stream, { mimeType: fallbackMime })
          : new MediaRecorder(stream);

        fallbackRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) fallbackChunks.push(e.data);
        };
        fallbackRecorder.start(100);
      }

      isRequestingMic = false;
      isListening = true;
      recordingStartedAt = Date.now();

      recordTimer = setTimeout(() => {
        stopListeningAndEvaluate();
      }, 3000);
    } catch (err) {
      console.error("Microphone error:", err);
      isRequestingMic = false;
      isListening = false;
      cleanupAudioCapture();
      if (stage) stage.setListening(false);
      showToast("Veuillez autoriser l'accès micro dans votre navigateur.");
    }
  }

  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || "");
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function stopListeningAndEvaluate() {
    if (!isListening || isEvaluating) return;
    isListening = false;
    isEvaluating = true;

    if (recordTimer) {
      clearTimeout(recordTimer);
      recordTimer = null;
    }

    const usedWorklet = captureNode !== null;
    const capturedPcm = [...pcmChunks];
    const peak = pcmMaxPeak;
    const recorderRef = fallbackRecorder;

    if (usedWorklet) {
      cleanupAudioCapture();

      // Client-side silence gate (Int16 max is 32768; < 450 is effectively silence)
      if (capturedPcm.length === 0 || peak < 450) {
        isEvaluating = false;
        if (stage) {
          stage.setListening(false);
          stage.pointAtObject(currentChallenge.id);
        }
        playErrorBuzz();
        showToast("🔇 Aucun son détecté", 2000);
        return;
      }

      const wavBlob = pcmChunksToWav(capturedPcm, getAudioContext().sampleRate);
      const dataUrl = await blobToDataUrl(wavBlob);
      await evaluateVoice(dataUrl);
      return;
    }

    // Fallback MediaRecorder path
    if (recorderRef && recorderRef.state !== "inactive") {
      await new Promise<void>((resolve) => {
        recorderRef.onstop = () => resolve();
        try { recorderRef.stop(); } catch { resolve(); }
      });
    }
    cleanupAudioCapture();

    if (fallbackChunks.length === 0) {
      isEvaluating = false;
      if (stage) {
        stage.setListening(false);
        stage.pointAtObject(currentChallenge.id);
      }
      playErrorBuzz();
      showToast("🔇 Aucun son détecté", 2000);
      return;
    }

    const blob = new Blob(fallbackChunks, { type: fallbackMime || "audio/webm" });
    const dataUrl = await blobToDataUrl(blob);
    await evaluateVoice(dataUrl);
  }

  async function evaluateVoice(base64Audio: string) {
    const challengeSnapshot = currentChallenge;
    try {
      const res = await fetch("/api/gemini-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: base64Audio,
          target: challengeSnapshot.targetWord,
          cardId: challengeSnapshot.id
        })
      });

      const data = await res.json();
      const score = typeof data.score === "number" ? data.score : 0;
      lastScore = score;

      if (data.is_correct && score >= 70) {
        progress.recordAttempt(challengeSnapshot.targetWord, true);
        if (stage) {
          stage.setListening(false);
          stage.speakGesture(2.5);
        }
        showToast(`✓ Bravo ! « ${challengeSnapshot.name} » validé (${score}/100) ★★★`, 2800);
        // Use lowercase targetWord so TTS pronounces naturally instead of spelling uppercase
        playFrenchAudio(`Bravo ! C'est bien ${challengeSnapshot.targetWord} !`);

        setTimeout(() => {
          advanceToNext();
        }, 1800);
      } else {
        progress.recordAttempt(challengeSnapshot.targetWord, false);
        if (stage) {
          stage.setListening(false);
          stage.pointAtObject(challengeSnapshot.id);
        }
        playErrorBuzz();
        showToast("❌ Réessayez", 2000);
      }
    } catch (err) {
      console.error(err);
      if (stage) {
        stage.setListening(false);
        stage.pointAtObject(challengeSnapshot.id);
      }
      playErrorBuzz();
      showToast("❌ Réessayez", 2000);
    } finally {
      isEvaluating = false;
    }
  }

  function advanceToNext() {
    if (currentChallengeIndex + 1 < currentLevel.challenges.length) {
      currentChallengeIndex += 1;
      lastScore = null;
      fatimaSpeakAndPoint();
    } else {
      isLevelComplete = true;
      // Sync letter mastery with global 2D/3D progress store
      if (!progress.isMastered(currentLevel.letter)) {
        progress.toggleMastered(currentLevel.letter);
      }
      if (stage) {
        // Release pointer lock so desktop players can click Next Level immediately!
        stage.exitLock();
        stage.setListening(false);
        stage.speakGesture(3.0);
      }
    }
  }

  async function changeLevel(newLevelIndex: number) {
    if (newLevelIndex < 0 || newLevelIndex >= LEVELS.length) return;
    cleanupAudioCapture();
    isRequestingMic = false;
    isListening = false;
    isEvaluating = false;
    await unlockAudio();
    currentLevelIndex = newLevelIndex;
    currentChallengeIndex = 0;
    isLevelComplete = false;
    lastScore = null;
    isEscaped = false;

    if (stage) {
      stage.loadLevel(currentLevel.levelNumber);
      stage.pointAtObject(currentChallenge.id);
      stage.requestLock();
    }

    setTimeout(() => {
      fatimaSpeakAndPoint();
    }, 450);
  }

  function proceedToNextLevel() {
    if (currentLevelIndex + 1 < LEVELS.length) {
      changeLevel(currentLevelIndex + 1);
    }
  }

  function restartLevel() {
    cleanupAudioCapture();
    isLevelComplete = false;
    currentChallengeIndex = 0;
    lastScore = null;
    isEscaped = false;
    if (stage) {
      stage.loadLevel(currentLevel.levelNumber);
      stage.pointAtObject(currentChallenge.id);
      stage.requestLock();
    }
    setTimeout(() => {
      fatimaSpeakAndPoint();
    }, 400);
  }
</script>

<!-- Full-Screen Edge-to-Edge Canvas Container (Unless Escape is pressed) -->
<div
  class="{!isEscaped ? 'fixed inset-0 w-screen h-screen z-50' : 'relative w-full h-[calc(100vh-4rem)]'} overflow-hidden bg-slate-950 select-none no-zoom touch-none transition-all duration-300"
>
  <!-- 3D Three.js WebGL Canvas -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={canvasContainer}
    class="absolute inset-0 cursor-crosshair touch-none select-none"
    onclick={() => {
      unlockAudio();
      if (hasStarted && !isListening && !isLevelComplete && !isTouchDevice) {
        resumeFullscreen();
      }
    }}
  ></div>

  <!-- Model Loading Indicator -->
  {#if isLoadingModels}
    <div class="absolute top-18 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div class="px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-xl">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
        <span>Chargement de la scène 3D…</span>
      </div>
    </div>
  {/if}

  <!-- FPS Center Crosshair & Interactive Tooltip -->
  {#if hasStarted && !isLevelComplete}
    <div class="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      <div class="relative flex items-center justify-center">
        <div class="w-6 h-6 rounded-full border-2 transition-all duration-150 {hoveredObject ? 'border-amber-400 scale-125 bg-amber-500/20 shadow-lg shadow-amber-500/50' : 'border-white/40'}"></div>
        <div class="absolute w-1 h-1 rounded-full {hoveredObject ? 'bg-amber-300' : 'bg-white/80'}"></div>

        {#if hoveredObject}
          <div class="absolute -top-11 px-3.5 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-amber-500/60 text-amber-300 font-black text-xs tracking-wide shadow-2xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-150">
            {#if hoveredObject === "fatima"}
              FATIMA 🗣
            {:else}
              {@const hoveredItem = currentLevel.challenges.find((c) => c.id === hoveredObject)}
              {#if hoveredItem}
                {hoveredItem.name} {hoveredItem.icon}
              {:else}
                {hoveredObject.toUpperCase()}
              {/if}
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Responsive Top HUD Bar (never collides on narrow mobile screens) -->
  {#if hasStarted}
    <div
      class="absolute top-0 left-0 right-0 px-3 sm:px-4 flex items-center justify-between gap-2 pointer-events-none z-20"
      style="padding-top: max(env(safe-area-inset-top, 0px), 12px);"
    >
      <!-- Top-Left Controls Pill -->
      <div class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-xs text-slate-300 pointer-events-auto shadow-lg min-w-0">
        <!-- Desktop PointerLock Notice (hidden on touch/narrow mobile) -->
        {#if !isTouchDevice}
          <div class="hidden md:flex items-center gap-2 pr-2 border-r border-white/20">
            {#if !isEscaped && isPointerLocked}
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Plein écran • <kbd class="px-1.5 py-0.5 rounded bg-white/15 font-bold text-white text-[10px]">Échap</kbd></span>
            {:else}
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <button onclick={resumeFullscreen} class="hover:text-white cursor-pointer font-bold text-amber-300">
                Reprendre
              </button>
            {/if}
          </div>
        {/if}

        <!-- Level Switcher (A | B | C) -->
        <div class="flex items-center gap-1">
          {#each LEVELS as lvl, idx}
            <button
              onclick={() => changeLevel(idx)}
              class="px-2 py-0.5 rounded-lg font-black text-[11px] transition-all cursor-pointer {
                currentLevelIndex === idx
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-white/65 hover:text-white hover:bg-white/10'
              }"
              title="Jouer {lvl.title}"
            >
              {lvl.letter}
            </button>
          {/each}
        </div>

        <!-- Quick Link to Room 2 (Pharmacy) -->
        <a
          href="/pharmacie"
          class="px-2 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/30 text-emerald-300 font-bold text-[11px] transition-colors whitespace-nowrap"
          title="Essayer la Salle 2 : À la Pharmacie (sans FPS)"
        >
          💊<span class="hidden sm:inline ml-1">Pharmacie</span>
        </a>

        <a
          href="/"
          class="text-white/65 hover:text-white pl-1.5 border-l border-white/20 transition-colors font-bold text-[11px] whitespace-nowrap"
          title="Retourner aux Cartes 2D"
        >
          ✕
        </a>

        {#if !isTouchDevice}
          <button
            onclick={() => (forceMobileControls = !forceMobileControls)}
            class="hidden lg:inline text-white/50 hover:text-amber-300 pl-2 border-l border-white/20 transition-colors cursor-pointer text-[11px]"
            title="Afficher/masquer les boutons tactiles sur PC pour tester"
          >
            {forceMobileControls ? '🎮 Masquer tactile' : '📱 Simuler tactile'}
          </button>
        {/if}
      </div>

      <!-- Top-Right Current Item Indicator (Clickable to replay audio) -->
      <button
        onclick={fatimaSpeakAndPoint}
        class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800/90 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
        title="Cliquer pour réécouter Fatima"
      >
        <span class="text-sm sm:text-base">{currentChallenge.icon}</span>
        <span class="text-[11px] sm:text-sm font-bold text-amber-300 whitespace-nowrap">
          {currentChallenge.name} <span class="text-white/60">({currentChallengeIndex + 1}/{currentLevel.challenges.length})</span>
        </span>
        <span class="text-xs text-white/60">🔈</span>
      </button>
    </div>
  {/if}

  <!-- In-Game Listening HUD Pill -->
  {#if isListening}
    <div
      class="absolute left-4 right-4 sm:max-w-md mx-auto z-30 animate-in fade-in slide-in-from-bottom-3 duration-200"
      style="bottom: calc(max(env(safe-area-inset-bottom, 0px), 16px) + 12.5rem);"
    >
      <div class="p-4 rounded-3xl bg-rose-500/20 backdrop-blur-xl border-2 border-rose-400 shadow-2xl flex items-center justify-between gap-3 text-white">
        <div class="flex items-center gap-3">
          <span class="text-3xl animate-bounce">👂</span>
          <div>
            <p class="text-xs font-bold text-rose-300 uppercase tracking-wider">Fatima vous écoute...</p>
            <p class="text-sm sm:text-base font-extrabold text-white">Prononcez : « {currentChallenge.name} »</p>
          </div>
        </div>

        <button
          onclick={stopListeningAndEvaluate}
          class="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>⏹</span>
          <span>Valider</span>
        </button>
      </div>
    </div>
  {:else if isEvaluating}
    <div
      class="absolute left-4 right-4 sm:max-w-sm mx-auto z-30 animate-in fade-in duration-150"
      style="bottom: calc(max(env(safe-area-inset-bottom, 0px), 16px) + 12.5rem);"
    >
      <div class="p-4 rounded-3xl bg-purple-500/20 backdrop-blur-xl border border-purple-400 shadow-2xl flex items-center justify-center gap-3 text-white">
        <span class="text-2xl animate-spin">⏳</span>
        <span class="text-xs sm:text-sm font-bold text-purple-200">Fatima analyse votre voix...</span>
      </div>
    </div>
  {/if}

  <!-- Mobile On-Screen Controls: Virtual Joystick & Action Button -->
  {#if hasStarted && !isLevelComplete && (isTouchDevice || forceMobileControls)}
    <div class="mobile-only-controls {forceMobileControls ? 'force-show' : ''}">
      <!-- Movement Virtual Joystick (Bottom Left with Safe Space) -->
      <div
        class="absolute left-6 sm:left-10 z-30 select-none touch-none pointer-events-auto flex flex-col items-center gap-1"
        style="bottom: calc(max(env(safe-area-inset-bottom, 0px), 16px) + 2.75rem); touch-action: none;"
      >
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          bind:this={joystickBaseEl}
          role="group"
          aria-label="Joystick de déplacement"
          onpointerdown={handleJoystickPointerDown}
          onpointermove={handleJoystickPointerMove}
          onpointerup={handleJoystickPointerUp}
          onpointercancel={handleJoystickPointerUp}
          class="relative w-32 h-32 rounded-full bg-slate-900/60 backdrop-blur-md border-2 {joystickActive ? 'border-amber-400 bg-slate-900/80 shadow-amber-500/30' : 'border-white/20'} shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors duration-150"
        >
          <span class="absolute top-2 text-[10px] font-bold text-white/30 pointer-events-none">▲</span>
          <span class="absolute bottom-2 text-[10px] font-bold text-white/30 pointer-events-none">▼</span>
          <span class="absolute left-2.5 text-[10px] font-bold text-white/30 pointer-events-none">◄</span>
          <span class="absolute right-2.5 text-[10px] font-bold text-white/30 pointer-events-none">►</span>

          <div
            class="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-white/60 shadow-lg shadow-amber-500/40 flex items-center justify-center pointer-events-none transition-transform {joystickActive ? 'scale-95' : ''}"
            style="transform: translate({joystickPos.x}px, {joystickPos.y}px); transition: {joystickActive ? 'none' : 'transform 0.15s ease-out'};"
          >
            <div class="w-4 h-4 rounded-full bg-white/60"></div>
          </div>
        </div>
        <span class="text-[10px] font-extrabold uppercase tracking-widest text-white/50 pointer-events-none">
          Déplacer
        </span>
      </div>

      <!-- Action / Fire Button (Bottom Right with Safe Space) -->
      <div
        class="absolute right-6 sm:right-10 z-30 select-none touch-none pointer-events-auto flex flex-col items-center gap-1"
        style="bottom: calc(max(env(safe-area-inset-bottom, 0px), 16px) + 2.75rem); touch-action: none;"
      >
        <button
          onpointerdown={handleFirePointerDown}
          class="relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 shadow-2xl {
            isListening
              ? 'bg-rose-500 border-2 border-rose-200 text-white shadow-rose-500/50 animate-pulse'
              : hoveredObject
                ? 'bg-gradient-to-tr from-amber-400 to-amber-500 border-2 border-amber-200 text-slate-950 shadow-amber-500/50 scale-105'
                : 'bg-slate-900/80 backdrop-blur-md border-2 border-white/30 text-white hover:border-amber-400'
          }"
          title="Bouton Action"
        >
          {#if isListening}
            <div class="flex flex-col items-center pointer-events-none">
              <span class="text-2xl leading-none">⏹</span>
              <span class="text-[9px] font-black uppercase tracking-wider mt-1 text-white">Valider</span>
            </div>
          {:else if hoveredObject === "fatima"}
            <div class="flex flex-col items-center pointer-events-none">
              <span class="text-3xl leading-none animate-bounce">🗣️</span>
              <span class="text-[9px] font-black uppercase tracking-wider mt-0.5 text-slate-950 font-bold">Fatima</span>
            </div>
          {:else if hoveredObject}
            {@const hoveredItem = currentLevel.challenges.find((c) => c.id === hoveredObject)}
            <div class="flex flex-col items-center pointer-events-none">
              <span class="text-3xl leading-none animate-bounce">{hoveredItem?.icon || '🔍'}</span>
              <span class="text-[9px] font-black uppercase tracking-wider mt-0.5 text-slate-950 font-bold">Parler</span>
            </div>
          {:else}
            <div class="flex flex-col items-center pointer-events-none">
              <svg class="w-8 h-8 opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 3v3m0 12v3M3 12h3m12 0h3"></path>
                <circle cx="12" cy="12" r="2.5" fill="currentColor"></circle>
              </svg>
              <span class="text-[9px] font-black uppercase tracking-wider mt-0.5 text-white/90">Action</span>
            </div>
          {/if}
        </button>
        <span class="text-[10px] font-extrabold uppercase tracking-widest text-white/50 pointer-events-none">
          {hoveredObject ? 'Interagir' : 'Viser'}
        </span>
      </div>
    </div>
  {/if}

  <!-- Toast Notification -->
  {#if toastMessage}
    <div
      class="absolute left-4 right-4 sm:max-w-md mx-auto pointer-events-none z-40 animate-in fade-in slide-in-from-bottom-2 duration-150"
      style="bottom: calc(max(env(safe-area-inset-bottom, 0px), 16px) + 12.5rem);"
    >
      <div class="px-5 py-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-bold shadow-2xl text-center">
        {toastMessage}
      </div>
    </div>
  {/if}

  <!-- Level Completed Floating Card -->
  {#if isLevelComplete}
    <div class="absolute inset-0 bg-black/60 backdrop-blur-md z-40 flex items-center justify-center p-4">
      <div class="w-full max-w-sm p-6 sm:p-7 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        <span class="text-5xl">🏆</span>
        <div>
          <h2 class="text-xl font-black text-white">{currentLevel.title} Validé !</h2>
          <p class="text-xs text-slate-300 mt-1">Vous avez maîtrisé la prononciation des 3 objets :</p>
        </div>

        <div class="grid grid-cols-3 gap-2 w-full">
          {#each currentLevel.challenges as item}
            <div class="p-2.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col items-center gap-0.5">
              <span class="text-2xl">{item.icon}</span>
              <span class="text-xs font-bold text-white">{item.name}</span>
              <span class="text-[10px] text-amber-400">★★★</span>
            </div>
          {/each}
        </div>

        <div class="w-full flex flex-col gap-2 pt-2">
          {#if currentLevelIndex + 1 < LEVELS.length}
            <button
              onclick={proceedToNextLevel}
              class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Passer au {LEVELS[currentLevelIndex + 1].title}</span>
              <span class="text-base">→</span>
            </button>
          {:else}
            <a
              href="/pharmacie"
              class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>💊 Essayer la Salle 2 : À la Pharmacie</span>
              <span class="text-base">→</span>
            </a>
          {/if}

          <button
            onclick={restartLevel}
            class="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xl transition-all cursor-pointer"
          >
            Rejouer ce Niveau ({currentLevel.letter}) ↺
          </button>
          <a
            href="/"
            class="w-full py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all text-center"
          >
            Retourner aux Cartes 2D
          </a>
        </div>
      </div>
    </div>
  {/if}

  <!-- Initial Start Screen Overlay -->
  {#if !hasStarted}
    <div class="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-sm p-6 sm:p-7 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        <span class="text-5xl">{currentLevel.challenges[0].icon}</span>
        <div>
          <span class="text-xs font-bold text-amber-400 uppercase tracking-wider">{currentLevel.title}</span>
          <h2 class="text-xl font-black text-white mt-1">{currentLevel.subtitle}</h2>
          <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {currentLevel.description}
          </p>
        </div>

        <button
          onclick={enterGame}
          class="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl transition-all cursor-pointer active:scale-95"
        >
          Commencer la leçon →
        </button>

        <a
          href="/pharmacie"
          class="w-full py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
        >
          <span>💊</span>
          <span>Ou essayer la Salle 2 : À la Pharmacie (tactile)</span>
        </a>

        <div class="p-3 rounded-2xl bg-slate-950/70 border border-white/10 text-[11px] text-slate-400 text-start flex flex-col gap-1.5 w-full">
          <div>👉 <strong>Fatima pointe :</strong> elle montre l'objet et dit son nom</div>
          <div>👂 <strong>Interagir :</strong> Fatima écoute votre prononciation</div>
          {#if isTouchDevice}
            <div>📱 <strong>Sur mobile :</strong> Joystick à gauche pour marcher, bouton Action à droite !</div>
          {:else}
            <div>⌨️ <strong>Sur PC :</strong> ZQSD / WASD pour marcher, clic souris pour interagir !</div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
