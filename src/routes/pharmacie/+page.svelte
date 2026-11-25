<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { PharmacyStage } from "$lib/3d/PharmacyStage";
  import {
    PHARMACY_ITEMS,
    PHARMACY_STEP_META,
    type PharmacyItem,
    type PharmacyStageStep
  } from "$lib/pharmacie/data";
  import LetterTracer from "$lib/components/pharmacie/LetterTracer.svelte";
  import { playFrenchAudio, stopAlphabetAudio, unlockAudio } from "$lib/alphabet/audio";
  import { getAudioContext, ensurePcmWorklet, pcmChunksToWav } from "$lib/alphabet/audio-context";
  import { i18n } from "$lib/stores/i18n.svelte";
  import { progress } from "$lib/stores/progress.svelte";

  let canvasContainer = $state<HTMLDivElement | null>(null);
  let stage: PharmacyStage | null = null;

  let hasEntered = $state(false);
  let isLoadingModels = $state(true);
  let currentStep = $state<PharmacyStageStep>("discover");
  let hoveredId = $state<string | null>(null);
  let showNotebook = $state(false);
  let toastMessage = $state<string | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  // Step 1: Discover state
  let discoveredIds = $state<Set<string>>(new Set());
  let selectedDiscoverItem = $state<PharmacyItem | null>(null);

  // Step 2: Listen & Tap comprehension state
  let listenOrder = $state<PharmacyItem[]>([...PHARMACY_ITEMS]);
  let listenIndex = $state(0);
  let listenSolvedIds = $state<Set<string>>(new Set());
  let showListenHint = $state(false);
  let listenSuccessFlash = $state(false);
  let currentListenItem = $derived(listenOrder[listenIndex] || PHARMACY_ITEMS[0]);

  // Step 3: Speak state
  let speakIndex = $state(0);
  let spokenIds = $state<Set<string>>(new Set());
  let currentSpeakItem = $derived(PHARMACY_ITEMS[speakIndex] || PHARMACY_ITEMS[0]);
  let isRequestingMic = $state(false);
  let isListening = $state(false);
  let isEvaluating = $state(false);
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

  // Step 4: Letter Tracing state
  let traceIndex = $state(0);
  let tracedIds = $state<Set<string>>(new Set());
  let currentTraceItem = $derived(PHARMACY_ITEMS[traceIndex] || PHARMACY_ITEMS[0]);

  // Saved episode progress (persisted in localStorage)
  let savedMastered = $state<Set<string>>(new Set());

  function persistMastered(id: string) {
    const next = new Set(savedMastered);
    next.add(id);
    savedMastered = next;
    try {
      localStorage.setItem("pharmacie-mastered-ids", JSON.stringify(Array.from(next)));
    } catch {}
  }

  function showToast(msg: string, duration = 2400) {
    toastMessage = msg;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage = null;
    }, duration);
  }

  function playSuccessChime() {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5 - E5 - G5 cheerful triad
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.075);
        gain.gain.setValueAtTime(0.001, now + i * 0.075);
        gain.gain.linearRampToValueAtTime(0.16, now + i * 0.075 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.075 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.075);
        osc.stop(now + i * 0.075 + 0.3);
      });
    } catch {}
  }

  function playGentleBuzz() {
    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(190, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    } catch {}
  }

  function syncItemRings() {
    if (!stage) return;
    for (const item of PHARMACY_ITEMS) {
      if (currentStep === "discover") {
        if (selectedDiscoverItem?.id === item.id) {
          stage.setItemState(item.id, "active");
        } else if (discoveredIds.has(item.id)) {
          stage.setItemState(item.id, "done");
        } else {
          stage.setItemState(item.id, "idle");
        }
      } else if (currentStep === "listen") {
        // Keep targets unrevealed until solved!
        stage.setItemState(item.id, listenSolvedIds.has(item.id) ? "done" : "idle");
      } else if (currentStep === "speak") {
        if (currentSpeakItem.id === item.id) {
          stage.setItemState(item.id, "active");
        } else if (spokenIds.has(item.id)) {
          stage.setItemState(item.id, "done");
        } else {
          stage.setItemState(item.id, "idle");
        }
      } else if (currentStep === "trace") {
        if (currentTraceItem.id === item.id) {
          stage.setItemState(item.id, "active");
        } else if (tracedIds.has(item.id)) {
          stage.setItemState(item.id, "done");
        } else {
          stage.setItemState(item.id, "idle");
        }
      } else {
        stage.setItemState(item.id, "done");
      }
    }
  }

  function fatimaSay(text: string, gestureSec = 2.6) {
    stage?.setListening(false);
    stage?.speakGesture(gestureSec);
    playFrenchAudio(text);
  }

  async function enterPharmacy() {
    await unlockAudio();
    hasEntered = true;
    goToStep("discover");
  }

  function goToStep(step: PharmacyStageStep) {
    cleanupAudioCapture();
    isRequestingMic = false;
    isListening = false;
    isEvaluating = false;
    currentStep = step;
    showListenHint = false;
    listenSuccessFlash = false;

    if (step === "discover") {
      stage?.focusObject(null);
      syncItemRings();
      const intro = PHARMACY_STEP_META.find((s) => s.id === "discover")!.voiceIntro;
      fatimaSay(intro, 3.2);
    } else if (step === "listen") {
      // Shuffle listening order for a real challenge
      listenOrder = [...PHARMACY_ITEMS].sort(() => Math.random() - 0.5);
      listenIndex = 0;
      listenSolvedIds = new Set();
      stage?.focusObject(null);
      syncItemRings();
      setTimeout(() => {
        fatimaSay(listenOrder[0].requestSpeech, 3.0);
      }, 250);
    } else if (step === "speak") {
      speakIndex = 0;
      spokenIds = new Set();
      stage?.focusObject(PHARMACY_ITEMS[0].id);
      syncItemRings();
      setTimeout(() => {
        fatimaSay(PHARMACY_ITEMS[0].discoverSpeech, 2.2);
      }, 300);
    } else if (step === "trace") {
      traceIndex = 0;
      tracedIds = new Set();
      stage?.focusObject(PHARMACY_ITEMS[0].id);
      syncItemRings();
      setTimeout(() => {
        fatimaSay(`${PHARMACY_ITEMS[0].letter}, comme ${PHARMACY_ITEMS[0].word}.`, 2.4);
      }, 250);
    } else if (step === "complete") {
      stage?.focusObject(null);
      syncItemRings();
      playSuccessChime();
      fatimaSay("Bravo ! Tu connais maintenant les mots de la pharmacie !", 3.2);
    }
  }

  function handleSceneSelect(objectId: string) {
    unlockAudio();
    if (!hasEntered) return;

    // Tapping Fatima always replays the current audio cue
    if (objectId === "fatima") {
      replayCurrentPrompt();
      return;
    }

    const item = PHARMACY_ITEMS.find((it) => it.id === objectId);
    if (!item) return;

    if (currentStep === "discover") {
      selectDiscoverItem(item);
    } else if (currentStep === "listen") {
      handleListenGuess(item);
    } else if (currentStep === "speak") {
      if (item.id === currentSpeakItem.id) {
        fatimaSay(item.discoverSpeech, 2.0);
      } else {
        const idx = PHARMACY_ITEMS.findIndex((x) => x.id === item.id);
        if (idx !== -1 && !isListening && !isEvaluating) {
          speakIndex = idx;
          stage?.focusObject(item.id);
          syncItemRings();
          fatimaSay(item.discoverSpeech, 2.0);
        }
      }
    }
  }

  function selectDiscoverItem(item: PharmacyItem) {
    selectedDiscoverItem = item;
    const next = new Set(discoveredIds);
    next.add(item.id);
    discoveredIds = next;
    stage?.focusObject(item.id);
    stage?.animateBounce(item.id);
    syncItemRings();
    fatimaSay(item.discoverSpeech, 2.2);
  }

  function handleListenGuess(item: PharmacyItem) {
    if (listenSuccessFlash) return;
    const target = currentListenItem;

    if (item.id === target.id) {
      listenSuccessFlash = true;
      const next = new Set(listenSolvedIds);
      next.add(target.id);
      listenSolvedIds = next;
      persistMastered(target.id);
      stage?.focusObject(target.id);
      stage?.animateBounce(target.id);
      syncItemRings();
      playSuccessChime();
      fatimaSay(`Bravo ! C'est bien ${target.article} ${target.word} !`, 2.2);
      showToast(`✓ ${target.displayLabel} ${target.icon}`, 1900);

      setTimeout(() => {
        listenSuccessFlash = false;
        showListenHint = false;
        if (listenIndex + 1 < listenOrder.length) {
          listenIndex += 1;
          stage?.focusObject(null);
          syncItemRings();
          fatimaSay(listenOrder[listenIndex].requestSpeech, 3.0);
        } else {
          goToStep("speak");
        }
      }, 2000);
    } else {
      stage?.animateShake(item.id);
      playGentleBuzz();
      showToast(`Écoute encore…`, 1800);
      fatimaSay(target.discoverSpeech, 2.0);
    }
  }

  function replayCurrentPrompt() {
    unlockAudio();
    if (currentStep === "discover") {
      if (selectedDiscoverItem) {
        fatimaSay(selectedDiscoverItem.discoverSpeech, 2.2);
      } else {
        fatimaSay(PHARMACY_STEP_META[0].voiceIntro, 3.0);
      }
    } else if (currentStep === "listen") {
      fatimaSay(currentListenItem.requestSpeech, 3.0);
    } else if (currentStep === "speak") {
      fatimaSay(currentSpeakItem.discoverSpeech, 2.2);
    } else if (currentStep === "trace") {
      fatimaSay(`${currentTraceItem.letter}, comme ${currentTraceItem.word}.`, 2.2);
    }
  }

  // --- Reliable PCM WAV Voice Capture (Step 3: Speak) ---

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

  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || "");
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function toggleSpeakRecording() {
    await unlockAudio();
    if (isListening) {
      await stopAndEvaluateSpeech();
      return;
    }
    if (isRequestingMic || isEvaluating) return;

    isRequestingMic = true;
    pcmChunks = [];
    pcmMaxPeak = 0;
    fallbackChunks = [];
    stage?.setListening(true);

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
      } catch {}

      if (!startedWorklet) {
        fallbackMime =
          typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
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
      recordTimer = setTimeout(() => {
        stopAndEvaluateSpeech();
      }, 3200);
    } catch {
      isRequestingMic = false;
      isListening = false;
      cleanupAudioCapture();
      stage?.setListening(false);
      showToast("Veuillez autoriser l'accès au microphone.");
    }
  }

  async function stopAndEvaluateSpeech() {
    if (!isListening || isEvaluating) return;
    isListening = false;
    isEvaluating = true;
    if (recordTimer) {
      clearTimeout(recordTimer);
      recordTimer = null;
    }

    const item = currentSpeakItem;
    const usedWorklet = captureNode !== null;
    const captured = [...pcmChunks];
    const peak = pcmMaxPeak;
    const rec = fallbackRecorder;

    let dataUrl = "";
    if (usedWorklet) {
      cleanupAudioCapture();
      if (captured.length === 0 || peak < 450) {
        isEvaluating = false;
        stage?.setListening(false);
        playGentleBuzz();
        showToast("🔇 Aucun son détecté — parlez près du micro");
        return;
      }
      const wavBlob = pcmChunksToWav(captured, getAudioContext().sampleRate);
      dataUrl = await blobToDataUrl(wavBlob);
    } else {
      if (rec && rec.state !== "inactive") {
        await new Promise<void>((resolve) => {
          rec.onstop = () => resolve();
          try { rec.stop(); } catch { resolve(); }
        });
      }
      cleanupAudioCapture();
      if (fallbackChunks.length === 0) {
        isEvaluating = false;
        stage?.setListening(false);
        playGentleBuzz();
        showToast("🔇 Aucun son détecté");
        return;
      }
      dataUrl = await blobToDataUrl(new Blob(fallbackChunks, { type: fallbackMime || "audio/webm" }));
    }

    try {
      const res = await fetch("/api/gemini-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: dataUrl,
          target: item.word,
          cardId: item.id
        })
      });
      const data = await res.json();
      const score = typeof data.score === "number" ? data.score : 0;

      if (data.is_correct && score >= 65) {
        progress.recordAttempt(item.word, true);
        persistMastered(item.id);
        const next = new Set(spokenIds);
        next.add(item.id);
        spokenIds = next;
        stage?.setListening(false);
        stage?.animateBounce(item.id);
        syncItemRings();
        playSuccessChime();
        fatimaSay(`Très bien ! ${item.discoverSpeech}`, 2.0);
        showToast(`✓ Bravo ! « ${item.word} » (${score}/100) ★★★`, 2200);

        setTimeout(() => {
          advanceSpeakItem();
        }, 1800);
      } else {
        progress.recordAttempt(item.word, false);
        stage?.setListening(false);
        playGentleBuzz();
        showToast("Essaie encore ! Écoute et répète.", 2200);
      }
    } catch {
      stage?.setListening(false);
      playGentleBuzz();
      showToast("Erreur d'analyse vocale — réessaie.");
    } finally {
      isEvaluating = false;
    }
  }

  function advanceSpeakItem() {
    if (speakIndex + 1 < PHARMACY_ITEMS.length) {
      speakIndex += 1;
      const nextItem = PHARMACY_ITEMS[speakIndex];
      stage?.focusObject(nextItem.id);
      syncItemRings();
      fatimaSay(nextItem.discoverSpeech, 2.2);
    } else {
      goToStep("trace");
    }
  }

  function handleTraceComplete() {
    const item = currentTraceItem;
    const next = new Set(tracedIds);
    next.add(item.id);
    tracedIds = next;
    persistMastered(item.id);
    syncItemRings();
    playSuccessChime();
    fatimaSay(`Bravo ! ${item.letter} comme ${item.word} !`, 2.2);
    if (!progress.isMastered(item.letter)) {
      progress.toggleMastered(item.letter);
    }
  }

  function nextTraceItem() {
    if (traceIndex + 1 < PHARMACY_ITEMS.length) {
      traceIndex += 1;
      const nextItem = PHARMACY_ITEMS[traceIndex];
      stage?.focusObject(nextItem.id);
      syncItemRings();
      fatimaSay(`${nextItem.letter}, comme ${nextItem.word}.`, 2.2);
    } else {
      goToStep("complete");
    }
  }

  onMount(() => {
    try {
      const raw = localStorage.getItem("pharmacie-mastered-ids");
      if (raw) savedMastered = new Set(JSON.parse(raw));
    } catch {}

    if (canvasContainer) {
      stage = new PharmacyStage(
        canvasContainer,
        handleSceneSelect,
        (id) => { hoveredId = id; },
        (loading) => { isLoadingModels = loading; }
      );
    }
  });

  onDestroy(() => {
    cleanupAudioCapture();
    stage?.destroy();
    stopAlphabetAudio();
    if (toastTimer) clearTimeout(toastTimer);
  });

  const hoveredItem = $derived(PHARMACY_ITEMS.find((it) => it.id === hoveredId) || null);
</script>

<div class="relative w-full h-[calc(100dvh-4rem)] overflow-hidden bg-[#dbece5] select-none touch-none">
  <!-- Non-FPS Direct-Tap 3D Pharmacy Diorama Canvas -->
  <div bind:this={canvasContainer} class="absolute inset-0"></div>

  <!-- Subtle Loading Indicator -->
  {#if isLoadingModels}
    <div class="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <div class="px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-emerald-400/30 text-xs font-bold text-emerald-100 flex items-center gap-2 shadow-xl">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Ouverture de la pharmacie…</span>
      </div>
    </div>
  {/if}

  <!-- Desktop Hover Floating Label (only when not in listening test!) -->
  {#if hasEntered && hoveredId && currentStep !== "trace" && currentStep !== "complete"}
    <div class="hidden sm:flex absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div class="px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-emerald-400/50 text-emerald-200 font-black text-xs shadow-2xl flex items-center gap-2">
        {#if hoveredId === "fatima"}
          <span>🗣️</span>
          <span>Fatima — Cliquer pour réécouter</span>
        {:else if hoveredItem}
          <span>{hoveredItem.icon}</span>
          {#if currentStep === "listen" && !listenSolvedIds.has(hoveredItem.id)}
            <span>Toucher cet objet</span>
          {:else}
            <span>{hoveredItem.displayLabel}</span>
          {/if}
        {/if}
      </div>
    </div>
  {/if}

  <!-- Top Episode Bar (Step Switcher + Carnet de révision) -->
  {#if hasEntered}
    <div class="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
      <!-- Visual Step Progress Tabs -->
      <div class="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/15 shadow-xl pointer-events-auto overflow-x-auto scrollbar-none">
        {#each PHARMACY_STEP_META as step}
          <button
            onclick={() => goToStep(step.id)}
            class="px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap {
              currentStep === step.id
                ? 'bg-emerald-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }"
            title={step.label}
          >
            <span>{step.icon}</span>
            <span class="hidden sm:inline">{step.label}</span>
          </button>
        {/each}
      </div>

      <!-- Right Actions: Audio Replay + Carnet (Audiovisual Dictionary) -->
      <div class="flex items-center gap-1.5 pointer-events-auto shrink-0">
        <button
          onclick={replayCurrentPrompt}
          class="w-10 h-10 rounded-2xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-white/15 text-amber-300 flex items-center justify-center shadow-xl cursor-pointer active:scale-95 transition-all"
          title="Réécouter Fatima"
        >
          🔊
        </button>
        <button
          onclick={() => (showNotebook = !showNotebook)}
          class="px-3 h-10 rounded-2xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-emerald-400/40 text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 shadow-xl cursor-pointer active:scale-95 transition-all"
          title="Ouvrir le carnet de vocabulaire"
        >
          <span>📖</span>
          <span class="hidden sm:inline">Carnet</span>
          <span class="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-[10px]">{savedMastered.size}/{PHARMACY_ITEMS.length}</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- Toast Feedback -->
  {#if toastMessage}
    <div class="absolute top-18 left-4 right-4 max-w-sm mx-auto z-30 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-150">
      <div class="px-4 py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-emerald-400/50 text-emerald-200 font-bold text-xs sm:text-sm text-center shadow-2xl">
        {toastMessage}
      </div>
    </div>
  {/if}

  <!-- Bottom Interactive Lesson Dock (Adapts to the active J'apprends mini-game) -->
  {#if hasEntered && currentStep !== "trace" && currentStep !== "complete"}
    <div
      class="absolute left-3 right-3 sm:max-w-xl mx-auto z-20 pointer-events-auto"
      style="bottom: max(env(safe-area-inset-bottom, 0px), 14px);"
    >
      {#if currentStep === "discover"}
        <!-- STEP 1: DISCOVER (Tap objects directly on the 3D counter OR tap quick icons) -->
        <div class="p-3.5 sm:p-4 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/15 shadow-2xl text-white flex flex-col gap-3">
          {#if selectedDiscoverItem}
            {@const gloss = i18n.resolveText(selectedDiscoverItem.gloss)}
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <button
                  onclick={() => fatimaSay(selectedDiscoverItem!.discoverSpeech, 2.2)}
                  class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shrink-0 cursor-pointer active:scale-95"
                  title="Réécouter"
                >
                  {selectedDiscoverItem.icon}
                </button>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-xs font-bold text-slate-400">{selectedDiscoverItem.article}</span>
                    <span class="text-lg sm:text-xl font-black tracking-tight flex items-center">
                      {#each selectedDiscoverItem.syllables as syl, sIdx}
                        <span class={sIdx % 2 === 0 ? "text-amber-300" : "text-emerald-300"}>{syl}</span>
                        {#if sIdx < selectedDiscoverItem.syllables.length - 1}
                          <span class="text-white/30 mx-0.5">·</span>
                        {/if}
                      {/each}
                    </span>
                    <span class="text-[11px] font-mono text-slate-400">{selectedDiscoverItem.ipa}</span>
                  </div>
                  {#if i18n.currentLang !== "fr" && gloss}
                    <p class="text-xs font-semibold text-emerald-300/90 truncate">{gloss}</p>
                  {:else}
                    <p class="text-xs text-slate-300 truncate">« {selectedDiscoverItem.contextPhrase} »</p>
                  {/if}
                </div>
              </div>

              <button
                onclick={() => fatimaSay(selectedDiscoverItem!.discoverSpeech, 2.2)}
                class="w-11 h-11 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow-lg cursor-pointer active:scale-95"
                title="Écouter"
              >
                🔈
              </button>
            </div>
          {:else}
            <div class="flex items-center gap-3">
              <span class="text-2xl">👆</span>
              <p class="text-xs sm:text-sm font-bold text-slate-200">
                Touche un objet sur le comptoir pour écouter son nom.
              </p>
            </div>
          {/if}

          <!-- Quick Discovery Pills + Next Step CTA -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              {#each PHARMACY_ITEMS as it}
                <button
                  onclick={() => selectDiscoverItem(it)}
                  class="px-2.5 py-1.5 rounded-xl border text-sm transition-all cursor-pointer flex items-center gap-1 active:scale-95 {
                    selectedDiscoverItem?.id === it.id
                      ? 'bg-amber-400/25 border-amber-400 text-amber-200 scale-105'
                      : discoveredIds.has(it.id)
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }"
                  title={it.displayLabel}
                >
                  <span>{it.icon}</span>
                  {#if discoveredIds.has(it.id)}
                    <span class="text-[10px] font-black text-emerald-300">✓</span>
                  {/if}
                </button>
              {/each}
            </div>

            <button
              onclick={() => goToStep("listen")}
              class="px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 {
                discoveredIds.size >= PHARMACY_ITEMS.length
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/30 animate-pulse'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200'
              }"
            >
              <span>Jeu : Trouver</span>
              <span>→</span>
            </button>
          </div>
        </div>

      {:else if currentStep === "listen"}
        <!-- STEP 2: LISTEN & TAP (Audio-first comprehension — no reading needed!) -->
        <div class="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-xl border-2 {listenSuccessFlash ? 'border-emerald-400' : 'border-amber-400/50'} shadow-2xl text-white flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <button
              onclick={() => fatimaSay(currentListenItem.requestSpeech, 3.0)}
              class="w-14 h-14 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-2xl flex items-center justify-center shrink-0 shadow-lg cursor-pointer active:scale-95 transition-transform"
              title="Réécouter la demande"
            >
              🔊
            </button>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-black uppercase tracking-wider text-amber-300">
                  Écoute & touche ({listenIndex + 1}/{listenOrder.length})
                </span>
              </div>
              {#if listenSuccessFlash}
                <p class="text-base font-black text-emerald-300">
                  ✓ {currentListenItem.displayLabel} {currentListenItem.icon}
                </p>
              {:else if showListenHint}
                <p class="text-xs sm:text-sm font-bold text-white leading-snug">
                  « {currentListenItem.requestSpeech} »
                </p>
              {:else}
                <p class="text-xs sm:text-sm font-bold text-slate-200">
                  Touche le bon objet sur le comptoir !
                </p>
              {/if}
            </div>
          </div>

          <button
            onclick={() => (showListenHint = !showListenHint)}
            class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs shrink-0 cursor-pointer"
            title="Afficher le texte de la phrase"
          >
            {showListenHint ? "🙈" : "💬"}
          </button>
        </div>

      {:else if currentStep === "speak"}
        <!-- STEP 3: SPEAK TO THE PHARMACIST -->
        {@const gloss = i18n.resolveText(currentSpeakItem.gloss)}
        <div class="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-xl border-2 {isListening ? 'border-rose-400' : 'border-emerald-400/40'} shadow-2xl text-white flex flex-col gap-3">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-3xl">{currentSpeakItem.icon}</span>
              <div class="min-w-0">
                <span class="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Parler ({speakIndex + 1}/{PHARMACY_ITEMS.length})
                </span>
                <p class="text-lg font-black text-white leading-tight truncate">
                  {currentSpeakItem.displayLabel}
                </p>
                {#if i18n.currentLang !== "fr" && gloss}
                  <p class="text-xs text-slate-300 truncate">{gloss}</p>
                {/if}
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <button
                onclick={() => fatimaSay(currentSpeakItem.discoverSpeech, 2.2)}
                class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 flex items-center justify-center cursor-pointer"
                title="Réécouter"
              >
                🔈
              </button>
              <button
                onclick={advanceSpeakItem}
                class="px-3 h-10 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs cursor-pointer"
                title="Passer au mot suivant"
              >
                Passer →
              </button>
            </div>
          </div>

          <button
            onclick={toggleSpeakRecording}
            disabled={isRequestingMic || isEvaluating}
            class="w-full py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 {
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : isEvaluating
                  ? 'bg-purple-500/80 text-white'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950'
            }"
          >
            {#if isRequestingMic}
              <span>⏳</span>
              <span>Activation du micro…</span>
            {:else if isListening}
              <span>⏹</span>
              <span>Fatima écoute… (Appuyer pour valider)</span>
            {:else if isEvaluating}
              <span class="animate-spin">⏳</span>
              <span>Analyse de votre prononciation…</span>
            {:else}
              <span class="text-lg">🎤</span>
              <span>Appuyer et dire « {currentSpeakItem.word} »</span>
            {/if}
          </button>
        </div>
      {/if}
    </div>
  {/if}

  <!-- STEP 4 OVERLAY: MAGIC SLATE LETTER TRACING (J'apprends Writing Mini-Game) -->
  {#if hasEntered && currentStep === "trace"}
    <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-30 flex items-center justify-center p-4 pt-16 overflow-y-auto">
      <div class="w-full max-w-sm p-5 rounded-3xl bg-slate-900/95 border border-emerald-400/40 shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        <div class="w-full flex items-center justify-between">
          <div>
            <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Ardoise magique ({traceIndex + 1}/{PHARMACY_ITEMS.length})
            </span>
            <h2 class="text-base font-black text-white">Trace la lettre « {currentTraceItem.letter} »</h2>
          </div>

          <div class="flex items-center gap-1">
            {#each PHARMACY_ITEMS as it, idx}
              <button
                onclick={() => { traceIndex = idx; stage?.focusObject(it.id); syncItemRings(); }}
                class="w-7 h-7 rounded-lg font-black text-xs transition-all cursor-pointer {
                  traceIndex === idx
                    ? 'bg-amber-400 text-slate-950'
                    : tracedIds.has(it.id)
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40'
                      : 'bg-white/10 text-slate-400'
                }"
              >
                {it.letter}
              </button>
            {/each}
          </div>
        </div>

        <LetterTracer
          letter={currentTraceItem.letter}
          word={currentTraceItem.word}
          icon={currentTraceItem.icon}
          onComplete={handleTraceComplete}
          onPlaySound={() => fatimaSay(`${currentTraceItem.letter}, comme ${currentTraceItem.word}.`, 2.2)}
        />

        <button
          onclick={nextTraceItem}
          class="w-full py-3 rounded-2xl font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 {
            tracedIds.has(currentTraceItem.id)
              ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 shadow-lg'
              : 'bg-white/10 hover:bg-white/15 text-slate-200'
          }"
        >
          <span>{traceIndex + 1 < PHARMACY_ITEMS.length ? "Lettre suivante →" : "Terminer l'épisode 🏆"}</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- EPISODE COMPLETE MODAL -->
  {#if hasEntered && currentStep === "complete"}
    <div class="absolute inset-0 bg-slate-950/65 backdrop-blur-md z-30 flex items-center justify-center p-4">
      <div class="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-emerald-400/40 shadow-2xl text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        <span class="text-5xl">🏆</span>
        <div>
          <span class="text-xs font-black uppercase tracking-wider text-emerald-400">Épisode 1 Validé</span>
          <h2 class="text-xl font-black text-white mt-0.5">Bravo ! À la Pharmacie</h2>
          <p class="text-xs text-slate-300 mt-1">Tu as écouté, trouvé, prononcé et tracé les 4 mots essentiels :</p>
        </div>

        <div class="grid grid-cols-2 gap-2 w-full">
          {#each PHARMACY_ITEMS as it}
            <button
              onclick={() => fatimaSay(it.discoverSpeech, 2.0)}
              class="p-2.5 rounded-2xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-400 flex items-center gap-2 text-start cursor-pointer transition-all active:scale-95"
            >
              <span class="text-2xl">{it.icon}</span>
              <div class="min-w-0">
                <p class="text-xs font-extrabold text-white truncate">{it.word}</p>
                <p class="text-[10px] text-amber-400">★★★ 🔈</p>
              </div>
            </button>
          {/each}
        </div>

        <div class="w-full flex flex-col gap-2 pt-1">
          <button
            onclick={() => (showNotebook = true)}
            class="w-full py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm shadow-lg cursor-pointer"
          >
            📖 Ouvrir mon Carnet de révision
          </button>
          <button
            onclick={() => goToStep("discover")}
            class="w-full py-2.5 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-200 font-bold text-xs cursor-pointer"
          >
            ↺ Rejouer l'épisode
          </button>
          <a
            href="/monde"
            class="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center"
          >
            🍳 Aller à la Cuisine 3D (Alphabet A-B-C)
          </a>
        </div>
      </div>
    </div>
  {/if}

  <!-- AUDIOVISUAL NOTEBOOK DRAWER (Carnet de la Pharmacie — inspired by J'apprends) -->
  {#if showNotebook}
    <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-40 flex items-center justify-center p-4">
      <div class="w-full max-w-md max-h-[85dvh] overflow-y-auto p-5 rounded-3xl bg-slate-900 border border-emerald-400/40 shadow-2xl text-white flex flex-col gap-4 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400">Dictionnaire audiovisuel</span>
            <h3 class="text-lg font-black text-white">📖 Carnet — À la Pharmacie</h3>
          </div>
          <button
            onclick={() => (showNotebook = false)}
            class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="flex flex-col gap-2.5">
          {#each PHARMACY_ITEMS as it}
            {@const gloss = i18n.resolveText(it.gloss)}
            <div class="p-3.5 rounded-2xl bg-slate-950/90 border border-white/10 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-2xl shrink-0">
                  {it.icon}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-black text-[11px]">{it.letter}</span>
                    <span class="font-black text-sm text-white">
                      {it.article} {it.syllables.join("·")}
                    </span>
                    {#if savedMastered.has(it.id)}
                      <span class="text-emerald-400 text-xs font-black">✓</span>
                    {/if}
                  </div>
                  <p class="text-[11px] text-slate-400 mt-0.5">« {it.contextPhrase} »</p>
                  {#if i18n.currentLang !== "fr" && gloss}
                    <p class="text-xs font-semibold text-emerald-300 mt-0.5">{gloss}</p>
                  {/if}
                </div>
              </div>

              <button
                onclick={() => { unlockAudio(); playFrenchAudio(it.requestSpeech); }}
                class="w-10 h-10 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
                title="Écouter la phrase complète"
              >
                🔈
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- INITIAL WELCOME CARD (Audio-first entry, no FPS instructions!) -->
  {#if !hasEntered}
    <div class="absolute inset-0 bg-slate-950/75 backdrop-blur-md z-40 flex items-center justify-center p-4">
      <div class="w-full max-w-sm p-6 sm:p-7 rounded-3xl bg-slate-900 border border-emerald-400/40 shadow-2xl text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        <div class="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/20">
          💊
        </div>
        <div>
          <span class="text-xs font-black uppercase tracking-wider text-emerald-400">Épisode 1 • Mode Tactile</span>
          <h2 class="text-2xl font-black text-white mt-1">À la Pharmacie</h2>
          <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Fatima vous accompagne à la pharmacie. Touchez directement les objets sur le comptoir : écoutez, trouvez, parlez et tracez les lettres.
          </p>
        </div>

        <div class="grid grid-cols-4 gap-2 w-full">
          {#each PHARMACY_STEP_META as step}
            <div class="p-2 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col items-center gap-1">
              <span class="text-xl">{step.icon}</span>
              <span class="text-[10px] font-bold text-slate-300">{step.label}</span>
            </div>
          {/each}
        </div>

        <button
          onclick={enterPharmacy}
          class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-sm shadow-xl transition-all cursor-pointer active:scale-95"
        >
          Entrer dans la pharmacie →
        </button>
      </div>
    </div>
  {/if}
</div>
