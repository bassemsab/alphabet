<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { KitchenStage } from "$lib/3d/KitchenStage";

  // Step definitions
  const Step = {
    SPOKEN_COMPREHENSION: 0,
    WRITTEN_COMPREHENSION: 1,
    WRITTEN_CREATION: 2,
    SPOKEN_CREATION: 3
  } as const;
  type Step = typeof Step[keyof typeof Step];

  interface Card {
    id: string;
    title: string;
    category: string;
    phonetic: string;
    audio: string;
    stars: number;
  }

  interface Challenge {
    cardId: string;
    cardName: string;
    npcSpeech: string;
    npcAudio: string;
    writtenClue: string;
    targetWord: string;
    spokenTargetPhrase: string;
  }

  const challenges: Challenge[] = [
    {
      cardId: "pain",
      cardName: "Le Pain",
      npcSpeech: "Bonjour ! Peux-tu me passer le pain s'il te plaît ?",
      npcAudio: "/audio/fatima_intro.wav",
      writtenClue: "Sur le mot du frigo : 'Il manque du p _ _ n frais'.",
      targetWord: "le pain",
      spokenTargetPhrase: "Bonjour, voici le pain."
    },
    {
      cardId: "lait",
      cardName: "Le Lait",
      npcSpeech: "Merci ! Et peux-tu aussi me donner le lait pour les enfants ?",
      npcAudio: "/audio/lait.wav",
      writtenClue: "Sur la brique : 'L _ _ t entier pasteurisé'.",
      targetWord: "le lait",
      spokenTargetPhrase: "Voici le lait frais."
    }
  ];

  let cards = $state<Card[]>([
    { id: "pain", title: "Le Pain", category: "NOM", phonetic: "[pɛ̃]", audio: "/audio/pain.wav", stars: 0 },
    { id: "lait", title: "Le Lait", category: "NOM", phonetic: "[lɛ]", audio: "/audio/lait.wav", stars: 0 },
    { id: "bonjour", title: "Bonjour", category: "POLITESSE", phonetic: "[bɔ̃.ʒuʁ]", audio: "/audio/bonjour.wav", stars: 0 }
  ]);

  let currentChallengeIndex = $state(0);
  let currentStep = $state<Step>(Step.SPOKEN_COMPREHENSION);
  let currentChallenge = $derived(challenges[currentChallengeIndex]);

  // Three.js Canvas Container & Pointer Lock
  let canvasContainer = $state<HTMLDivElement | null>(null);
  let stage: KitchenStage | null = null;
  let isPointerLocked = $state(false);
  let hoveredObject = $state<string | null>(null);

  // Slate (Ardoise) state
  let placedCards = $state<Card[]>([]);
  let slateStatus = $state("Touchez une carte en bas pour la placer sur l'ardoise.");
  let slateStatusColor = $state("text-slate-400");

  // Audio / Mic state
  let isRecording = $state(false);
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let isEvaluating = $state(false);
  let geminiResult = $state<{
    score?: number;
    feedback_encouraging?: string;
    scaffolding_tip?: string;
    is_correct?: boolean;
  } | null>(null);

  // Victory Modal
  let showVictoryModal = $state(false);
  let toastMessage = $state<string | null>(null);
  let toastTimeout: any = null;

  function showToast(msg: string) {
    toastMessage = msg;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastMessage = null;
    }, 2800);
  }

  function playAudio(src: string) {
    if (!src) return;
    const a = new Audio(src);
    a.play().catch(() => {});
  }

  function speakFatima() {
    if (stage) {
      stage.speakGesture(3.5);
    }
    playAudio(currentChallenge.npcAudio);
    showToast(`Fatima : « ${currentChallenge.npcSpeech} »`);
  }

  onMount(() => {
    if (canvasContainer) {
      stage = new KitchenStage(
        canvasContainer,
        handle3DObjectClick,
        (hovered) => {
          hoveredObject = hovered;
        },
        (locked) => {
          isPointerLocked = locked;
        }
      );
    }
    setTimeout(() => {
      speakFatima();
    }, 600);
  });

  onDestroy(() => {
    if (stage) {
      stage.destroy();
    }
  });

  function handle3DObjectClick(objectId: string) {
    if (objectId === "fatima") {
      speakFatima();
      return;
    }

    if (currentStep === Step.SPOKEN_COMPREHENSION) {
      if (objectId === currentChallenge.cardId) {
        showToast(`✓ Bravo ! Vous avez bien identifié ${currentChallenge.cardName} sur la table.`);
        playAudio(`/audio/${objectId}.wav`);
        setTimeout(() => {
          currentStep = Step.WRITTEN_COMPREHENSION;
          if (stage) stage.exitLock();
        }, 1200);
      } else {
        showToast("Ce n'est pas cet aliment. Écoutez bien la demande de Fatima.");
      }
    }
  }

  function handleCardClick(card: Card) {
    if (currentStep === Step.WRITTEN_COMPREHENSION) {
      if (card.id === currentChallenge.cardId) {
        showToast(`✓ Excellente lecture ! Carte « ${card.title} » validée.`);
        playAudio(card.audio);
        setTimeout(() => {
          currentStep = Step.WRITTEN_CREATION;
          placedCards = [];
        }, 1200);
      } else {
        showToast(`Regardez bien les lettres : cherchez ${currentChallenge.cardName}.`);
      }
    } else if (currentStep === Step.WRITTEN_CREATION) {
      if (!placedCards.find((c) => c.id === card.id)) {
        placedCards = [...placedCards, card];
      }
    }
  }

  function validateSlate() {
    if (placedCards.length === 0) {
      slateStatus = "Veuillez d'abord placer une carte sur l'ardoise.";
      slateStatusColor = "text-rose-400";
      return;
    }

    const assembled = placedCards.map((c) => c.title.toLowerCase()).join(" ");
    if (assembled.includes(currentChallenge.targetWord)) {
      slateStatus = "✓ Exact ! Orthographe validée.";
      slateStatusColor = "text-emerald-400";
      showToast("✓ Écriture validée ! Passons à l'expression orale.");
      setTimeout(() => {
        currentStep = Step.SPOKEN_CREATION;
        geminiResult = null;
      }, 1000);
    } else {
      slateStatus = "✗ Pas tout à fait. Vérifiez le mot demandé.";
      slateStatusColor = "text-rose-400";
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      mediaRecorder.start();
      isRecording = true;
      geminiResult = null;
    } catch (err) {
      console.error("Microphone error:", err);
      showToast("Microphone inaccessible. Veuillez autoriser l'accès micro dans le navigateur.");
    }
  }

  async function stopRecording() {
    if (!mediaRecorder || !isRecording) return;
    isRecording = false;

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        await submitVoiceToGemini(base64Audio);
      };
    };
    mediaRecorder.stop();
  }

  async function submitVoiceToGemini(base64Audio: string) {
    isEvaluating = true;
    try {
      const res = await fetch("/api/gemini-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: base64Audio,
          target: currentChallenge.spokenTargetPhrase,
          cardId: currentChallenge.cardId
        })
      });
      const data = await res.json();
      geminiResult = data;

      if (data.is_correct) {
        cards = cards.map((c) => (c.id === currentChallenge.cardId ? { ...c, stars: 3 } : c));
        setTimeout(() => {
          showVictoryModal = true;
          if (stage) stage.exitLock();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'évaluation vocale.");
    } finally {
      isEvaluating = false;
    }
  }

  function nextChallenge() {
    showVictoryModal = false;
    if (currentChallengeIndex + 1 < challenges.length) {
      currentChallengeIndex += 1;
      currentStep = Step.SPOKEN_COMPREHENSION;
      placedCards = [];
      geminiResult = null;
      setTimeout(() => speakFatima(), 500);
    } else {
      showToast("🎉 Félicitations ! Toutes les leçons de la cuisine sont maîtrisées !");
    }
  }

  // Mobile virtual joystick touch handling
  function handleJoystickTouch(e: TouchEvent) {
    const touch = e.targetTouches[0];
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (touch.clientX - centerX) / (rect.width / 2);
    const dy = (touch.clientY - centerY) / (rect.height / 2);

    if (stage) {
      stage.joystickMove = {
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, dy))
      };
    }
  }

  function resetJoystick() {
    if (stage) {
      stage.joystickMove = { x: 0, y: 0 };
    }
  }
</script>

<div class="relative w-full h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 select-none">
  <!-- 3D Three.js WebGL Canvas Container -->
  <div bind:this={canvasContainer} class="absolute inset-0 cursor-crosshair"></div>

  <!-- FPS Crosshair & Interaction Target Prompt in Center -->
  <div class="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
    <div class="relative flex items-center justify-center">
      <div class="w-6 h-6 rounded-full border-2 transition-all duration-150 {hoveredObject ? 'border-emerald-400 scale-125 bg-emerald-500/20 shadow-lg shadow-emerald-500/50' : 'border-white/40'}"></div>
      <div class="absolute w-1 h-1 rounded-full {hoveredObject ? 'bg-emerald-300' : 'bg-white/80'}"></div>

      <!-- Target Hover Prompt -->
      {#if hoveredObject}
        <div class="absolute -top-10 px-3 py-1 rounded-full bg-slate-950/95 border border-emerald-500/60 text-emerald-300 font-extrabold text-xs tracking-wide shadow-2xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-150">
          {#if hoveredObject === "pain"}
            [ Clic / Espace ] Le Pain 🥖
          {:else if hoveredObject === "lait"}
            [ Clic / Espace ] Le Lait 🥛
          {:else if hoveredObject === "fatima"}
            [ Clic / Espace ] Écouter Fatima 🗣
          {:else}
            [ Clic / Espace ] Interagir
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Top Domain & Step Header -->
  <div class="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
    <div class="px-4 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
      <span class="text-xs sm:text-sm font-bold text-slate-100">Domaine 1 : Maison & Famille</span>
    </div>

    <!-- Step Badge -->
    <div class="px-4 py-2 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
      <span class="text-xs sm:text-sm font-semibold text-emerald-400">
        Étape {currentStep + 1}/4 :
        {#if currentStep === Step.SPOKEN_COMPREHENSION}
          Écoute Orale
        {:else if currentStep === Step.WRITTEN_COMPREHENSION}
          Lecture & Indice
        {:else if currentStep === Step.WRITTEN_CREATION}
          L'Ardoise
        {:else}
          Voix & Gemini IA
        {/if}
      </span>
    </div>
  </div>

  <!-- FPS Pointer Lock Status Banner (Desktop hint) -->
  <div class="absolute top-16 left-4 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-[11px] text-slate-300 pointer-events-none z-10">
    {#if isPointerLocked}
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      <span>Regard verrouillé sur la souris • Touche <kbd class="px-1.5 py-0.5 rounded bg-white/10 font-bold text-white">Échap</kbd> pour libérer</span>
    {:else}
      <span>👉 <strong>Cliquez sur la scène</strong> pour diriger le regard à la souris • <kbd class="px-1.5 py-0.5 rounded bg-white/10 font-bold text-white">Échap</kbd> pour libérer</span>
    {/if}
  </div>

  <!-- Fatima Speaking Banner (Step 1 & 2) -->
  {#if currentStep === Step.SPOKEN_COMPREHENSION || currentStep === Step.WRITTEN_COMPREHENSION}
    <div class="absolute top-26 left-4 right-4 sm:max-w-md mx-auto z-10 animate-in fade-in slide-in-from-top-3 duration-200">
      <div class="p-4 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 shadow-2xl flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            🗣 Fatima <span class="text-slate-400 font-normal">(La Cuisine)</span>
          </span>
          <button
            onclick={speakFatima}
            class="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            🔊 Réécouter
          </button>
        </div>

        {#if currentStep === Step.SPOKEN_COMPREHENSION}
          <p class="text-sm sm:text-base font-medium text-white leading-relaxed">
            « {currentChallenge.npcSpeech} »
          </p>
          <p class="text-xs text-slate-400 italic">
            👉 Avancez avec [W/A/S/D] et visez l'aliment avec le réticule pour cliquer dessus !
          </p>
        {:else}
          <div class="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            {currentChallenge.writtenClue}
          </div>
          <p class="text-xs text-slate-400 italic">
            👉 Appuyez sur [Échap] si besoin puis choisissez la bonne carte en bas.
          </p>
        {/if}
      </div>
    </div>
  {/if}

  <!-- L'Ardoise (Step 3) -->
  {#if currentStep === Step.WRITTEN_CREATION}
    <div class="absolute top-26 left-4 right-4 sm:max-w-lg mx-auto z-10 animate-in zoom-in-95 duration-200">
      <div class="p-5 rounded-3xl bg-slate-900/95 backdrop-blur-md border border-blue-500/30 shadow-2xl flex flex-col gap-3">
        <div class="flex items-center justify-between border-b border-white/10 pb-2">
          <span class="text-xs font-bold tracking-wider uppercase text-blue-400">L'Ardoise d'Écriture</span>
          <button onclick={() => (placedCards = [])} class="text-xs text-slate-400 hover:text-white cursor-pointer">
            Effacer
          </button>
        </div>

        <p class="text-sm font-semibold text-slate-200">
          Complétez la commande : « {currentChallenge.targetWord} »
        </p>

        <!-- Slots Container -->
        <div class="min-h-16 p-2 rounded-2xl bg-slate-950/70 border border-dashed border-white/20 flex items-center justify-center gap-2 flex-wrap">
          {#if placedCards.length === 0}
            <span class="text-xs text-slate-500">[ Touchez une carte en bas pour la déposer ]</span>
          {:else}
            {#each placedCards as card}
              <span class="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md animate-in fade-in scale-95 duration-100">
                {card.title}
              </span>
            {/each}
          {/if}
        </div>

        <p class="text-xs {slateStatusColor}">{slateStatus}</p>

        <button
          onclick={validateSlate}
          class="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
        >
          Valider l'Écrit
        </button>
      </div>
    </div>
  {/if}

  <!-- Voice & Gemini Evaluation Widget (Step 4) -->
  {#if currentStep === Step.SPOKEN_CREATION}
    <div class="absolute top-26 left-4 right-4 sm:max-w-md mx-auto z-10 animate-in zoom-in-95 duration-200">
      <div class="p-5 rounded-3xl bg-slate-900/95 backdrop-blur-md border border-purple-500/30 shadow-2xl flex flex-col items-center gap-4 text-center">
        <div>
          <span class="text-xs font-bold tracking-wider uppercase text-purple-400">Évaluation Vocale Google Gemini</span>
          <p class="text-sm sm:text-base font-bold text-white mt-1">
            « {currentChallenge.spokenTargetPhrase} »
          </p>
        </div>

        <!-- Mic Button -->
        <button
          onmousedown={startRecording}
          onmouseup={stopRecording}
          ontouchstart={startRecording}
          ontouchend={stopRecording}
          class="w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all cursor-pointer {isRecording ? 'bg-rose-500 scale-110 shadow-rose-500/50 animate-pulse' : 'bg-purple-600 hover:bg-purple-500'}"
        >
          {isRecording ? "🔴" : "🎙"}
        </button>

        <p class="text-xs text-slate-300">
          {#if isRecording}
            <span class="text-rose-400 font-bold">Enregistrement... Relâchez pour envoyer !</span>
          {:else if isEvaluating}
            <span class="text-purple-400 font-bold animate-pulse">Analyse phonétique par Gemini 2.5 Flash...</span>
          {:else}
            Maintenez le micro appuyé et parlez distinctement.
          {/if}
        </p>

        <!-- Gemini Feedback Card -->
        {#if geminiResult}
          <div class="w-full p-4 rounded-2xl bg-purple-950/50 border border-purple-500/20 text-start flex flex-col gap-1.5 animate-in fade-in duration-150">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-purple-300">Résultat IA</span>
              <span class="text-xs font-extrabold px-2 py-0.5 rounded-full {geminiResult.score && geminiResult.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
                {geminiResult.score || 85} / 100
              </span>
            </div>
            <p class="text-xs text-white leading-relaxed">{geminiResult.feedback_encouraging}</p>
            {#if geminiResult.scaffolding_tip}
              <p class="text-xs text-amber-300/90 font-medium">💡 {geminiResult.scaffolding_tip}</p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Mobile On-Screen Virtual Joystick (touch devices) -->
  <div
    role="toolbar"
    aria-label="Contrôle de déplacement virtuel"
    ontouchmove={handleJoystickTouch}
    ontouchend={resetJoystick}
    class="absolute bottom-28 left-6 w-24 h-24 rounded-full bg-slate-900/60 border border-white/20 backdrop-blur-md flex items-center justify-center pointer-events-auto sm:hidden z-20"
  >
    <div class="w-10 h-10 rounded-full bg-emerald-500/80 shadow-md flex items-center justify-center text-xs text-slate-950 font-bold">
      🕹
    </div>
  </div>

  <!-- Bottom Card Deck -->
  <div class="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-2 pointer-events-none">
    <span class="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-1">
      Vos Cartes de Vocabulaire
    </span>

    <div class="flex items-center gap-3 overflow-x-auto pb-1 pointer-events-auto">
      {#each cards as card}
        <div
          role="button"
          tabindex="0"
          onclick={() => handleCardClick(card)}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(card); }}
          class="flex-shrink-0 w-36 sm:w-44 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 shadow-xl text-start transition-all hover:scale-105 active:scale-95 cursor-pointer flex flex-col gap-1.5"
        >
          <div class="flex items-center justify-between text-[10px] font-bold">
            <span class="text-emerald-400">{card.category}</span>
            <div class="flex items-center text-amber-400">
              {"★".repeat(card.stars)}{"☆".repeat(3 - card.stars)}
            </div>
          </div>

          <span class="text-sm sm:text-base font-extrabold text-white">{card.title}</span>
          <span class="text-xs text-slate-400">{card.phonetic}</span>

          <div class="mt-1 flex items-center justify-between">
            <button
              type="button"
              onclick={(e) => {
                e.stopPropagation();
                playAudio(card.audio);
              }}
              class="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] text-slate-200 font-semibold cursor-pointer"
            >
              🔊 Écouter
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Toast Notification -->
  {#if toastMessage}
    <div class="absolute bottom-28 left-4 right-4 sm:max-w-md mx-auto pointer-events-none z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div class="px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold shadow-2xl text-center">
        {toastMessage}
      </div>
    </div>
  {/if}

  <!-- Victory Modal -->
  {#if showVictoryModal}
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div class="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
        <span class="text-4xl">🎉</span>
        <div>
          <h2 class="text-xl font-extrabold text-white">Félicitations !</h2>
          <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Vous avez brillamment validé la carte <span class="font-bold text-emerald-400">« {currentChallenge.cardName} »</span> aux 4 piliers d'apprentissage !
          </p>
        </div>

        <div class="text-amber-400 text-2xl tracking-widest">★★★</div>

        <button
          onclick={nextChallenge}
          class="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all cursor-pointer"
        >
          {#if currentChallengeIndex + 1 < challenges.length}
            Leçon Suivante : {challenges[currentChallengeIndex + 1].cardName} →
          {:else}
            Terminer la Session ✓
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>
