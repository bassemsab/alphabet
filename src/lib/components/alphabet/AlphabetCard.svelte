<script lang="ts">
  import type { AlphabetLetter, AlphabetSoundVariant, AlphabetExampleWord, PronunciationVerdict, LocalizedText } from "$lib/alphabet/types";
  import { playFrenchAudio, stopAlphabetAudio } from "$lib/alphabet/audio";
  import { recordAndJudgeSpeech, type SpeechSession } from "$lib/alphabet/speech";
  import { i18n } from "$lib/stores/i18n.svelte";
  import { progress } from "$lib/stores/progress.svelte";
  import { trackEvent } from "$lib/telemetry";
  import { onDestroy } from "svelte";

  interface Props {
    letter: AlphabetLetter;
    currentVariantId?: string;
    onSelectVariant?: (variantId: string) => void;
  }

  let { letter, currentVariantId, onSelectVariant }: Props = $props();

  let activeVariantId = $state<string>(currentVariantId || letter.variants[0]?.id || "");

  $effect(() => {
    if (currentVariantId) {
      activeVariantId = currentVariantId;
    } else if (!letter.variants.some((v) => v.id === activeVariantId)) {
      activeVariantId = letter.variants[0]?.id || "";
    }
  });

  const activeVariant = $derived<AlphabetSoundVariant>(
    letter.variants.find((v) => v.id === activeVariantId) || letter.variants[0]
  );

  let playingWord = $state<string | null>(null);
  let listeningWord = $state<string | null>(null);
  let evaluatingWord = $state<string | null>(null);
  let wordVerdicts = $state<Record<string, PronunciationVerdict>>({});
  let imageLoaded = $state<Record<string, boolean>>({});

  let currentSpeechSession: SpeechSession | null = null;

  onDestroy(() => {
    stopAlphabetAudio();
    currentSpeechSession?.cancel();
  });

  function getTranslation(textObj: LocalizedText | undefined): string {
    return i18n.resolveText(textObj);
  }

  function splitHighlight(word: string, highlight: string) {
    if (!highlight) return [{ text: word, isMatch: false }];
    const lowerWord = word.toLowerCase();
    const lowerHigh = highlight.toLowerCase();
    const index = lowerWord.indexOf(lowerHigh);
    if (index === -1) return [{ text: word, isMatch: false }];

    return [
      { text: word.slice(0, index), isMatch: false },
      { text: word.slice(index, index + highlight.length), isMatch: true },
      { text: word.slice(index + highlight.length), isMatch: false },
    ];
  }

  async function handlePlayLetterName() {
    trackEvent("audio_play_letter", { letter: letter.letter, name: letter.name });
    await playFrenchAudio(letter.name, (playing) => {
      playingWord = playing ? `letter-${letter.letter}` : null;
    });
  }

  async function handlePlayWord(word: string) {
    trackEvent("audio_play_word", { word, letter: letter.letter });
    await playFrenchAudio(word, (playing) => {
      playingWord = playing ? word : null;
    });
  }

  function handlePracticeWord(word: string) {
    if (listeningWord === word) {
      currentSpeechSession?.stop();
      return;
    }

    currentSpeechSession?.cancel();
    listeningWord = word;
    evaluatingWord = null;
    trackEvent("speech_practice_started", { word, letter: letter.letter });

    currentSpeechSession = recordAndJudgeSpeech(
      word,
      i18n.currentLang,
      (state) => {
        if (state === "listening") {
          listeningWord = word;
          evaluatingWord = null;
        } else if (state === "evaluating") {
          listeningWord = null;
          evaluatingWord = word;
        } else {
          listeningWord = null;
          evaluatingWord = null;
        }
      },
      (verdict) => {
        wordVerdicts = { ...wordVerdicts, [word]: verdict };
        progress.recordAttempt(word, verdict.correct);
        if (verdict.correct && !progress.isMastered(letter.letter)) {
          progress.toggleMastered(letter.letter);
        }
        trackEvent("speech_practice_result", {
          word,
          letter: letter.letter,
          correct: verdict.correct,
          heard: verdict.heard
        });
        listeningWord = null;
        evaluatingWord = null;
      }
    );
  }

  const isMastered = $derived(progress.isMastered(letter.letter));
</script>

<div class="rounded-3xl border border-slate-200 dark:border-white/10 bg-surface-card p-5 sm:p-6 shadow-sm flex flex-col gap-6 transition-all duration-300 {isMastered ? 'ring-2 ring-emerald-500/30' : ''}">
  <!-- Header: Letter name, Sound, Variant Tabs, Mastery Check -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-white/5 pb-5">
    <div class="flex items-center gap-4 min-w-0">
      <button
        onclick={handlePlayLetterName}
        class="min-w-[5.5rem] min-h-[5.5rem] sm:min-w-[6.5rem] sm:min-h-[6.5rem] px-2.5 py-2 shrink-0 rounded-2xl sm:rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 dark:border-emerald-500/30 flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-300 transition-transform active:scale-95 group hover:border-emerald-400 select-none shadow-xs cursor-pointer text-center"
        title={i18n.t("alphabet_listen_letter")}
      >
        <span class="{letter.letter.length > 7 ? 'text-base sm:text-lg' : letter.letter.length > 3 ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'} font-black tracking-tight leading-tight pt-0.5 text-center">
          {#if letter.letter.length <= 2}
            {letter.letter} {letter.lower}
          {:else}
            {letter.letter}
          {/if}
        </span>
        <span class="text-xs font-mono font-semibold text-emerald-600/90 dark:text-emerald-400/90 mt-1">
          {playingWord === `letter-${letter.letter}` ? '🔊 ...' : letter.nameIpa}
        </span>
      </button>

      <div>
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">
            {getTranslation(activeVariant.soundName)}
          </h3>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
            {activeVariant.soundIpa}
          </span>
          {#if isMastered}
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              ✓ {i18n.t('alphabet_mastered')}
            </span>
          {/if}
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {getTranslation(activeVariant.rule)}
        </p>
      </div>
    </div>

    <!-- Right Controls: Variant Tabs & Mastery Toggle -->
    <div class="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end flex-wrap">
      {#if letter.variants.length > 1}
        <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl overflow-x-auto">
          {#each letter.variants as variant}
            <button
              onclick={() => {
                activeVariantId = variant.id;
                onSelectVariant?.(variant.id);
                trackEvent("variant_selected", { letter: letter.letter, variant_id: variant.id, sound_ipa: variant.soundIpa });
              }}
              class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer {activeVariantId === variant.id ? 'bg-white dark:bg-surface-elevated text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}"
            >
              {variant.soundIpa}
            </button>
          {/each}
        </div>
      {/if}

      <button
        onclick={() => {
          const nextMastered = !isMastered;
          progress.toggleMastered(letter.letter);
          trackEvent("mastery_toggled", { letter: letter.letter, mastered: nextMastered });
        }}
        class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer {isMastered ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}"
        title={i18n.t('alphabet_mark_mastered')}
      >
        <span class="text-sm">{isMastered ? '★' : '☆'}</span>
        <span>{isMastered ? i18n.t('alphabet_mastered') : i18n.t('alphabet_mark_mastered')}</span>
      </button>
    </div>
  </div>

  <!-- Example Words Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {#each activeVariant.words as ex}
      {@const verdict = wordVerdicts[ex.word]}
      {@const isPlaying = playingWord === ex.word}
      {@const isListening = listeningWord === ex.word}
      {@const isEvaluating = evaluatingWord === ex.word}

      <div class="rounded-2xl border border-slate-200/80 dark:border-white/5 bg-surface-elevated overflow-hidden flex flex-col group hover:shadow-md transition-all">
        <!-- Photo Container -->
        {#key ex.word}
          <div class="relative w-full h-44 bg-slate-200 dark:bg-slate-800/80 overflow-hidden">
            {#if !imageLoaded[ex.word]}
              <div class="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            {/if}
            <img
              src={ex.imageUrl}
              alt={ex.word}
              loading="eager"
              decoding="async"
              onload={() => { imageLoaded[ex.word] = true; }}
              class="w-full h-full {ex.word === 'stylo' ? 'object-contain p-2 bg-slate-100 dark:bg-slate-900' : 'object-cover'} object-center transition-all duration-300 group-hover:scale-105 {imageLoaded[ex.word] ? 'opacity-100' : 'opacity-0'}"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            <!-- Highlighted Word Overlay -->
            <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <div class="text-2xl font-black text-white tracking-wide drop-shadow-sm">
                  {#each splitHighlight(ex.word, ex.highlight) as part}
                    {#if part.isMatch}
                      <span class="text-emerald-400 underline decoration-emerald-300 decoration-4 underline-offset-4">{part.text}</span>
                    {:else}
                      <span>{part.text}</span>
                    {/if}
                  {/each}
                </div>
                <div class="text-xs font-mono text-white/80 drop-shadow-xs">
                  {ex.ipa}
                </div>
              </div>

              <!-- Speaker Action Button on Image -->
              <button
                onclick={() => handlePlayWord(ex.word)}
                class="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 flex items-center justify-center shadow-md transition-transform active:scale-95 hover:bg-white cursor-pointer"
                title={i18n.t("alphabet_listen_word")}
              >
                {#if isPlaying}
                  <svg class="w-5 h-5 text-emerald-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3v18l-6-5H2V8h4l6-5zm4.5 4.5a7 7 0 0 1 0 9M19 5a10 10 0 0 1 0 14" />
                  </svg>
                {:else}
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                {/if}
              </button>
            </div>
          </div>
        {/key}

        <!-- Word Info & Pronunciation Practice -->
        <div class="p-4 flex flex-col gap-3 flex-1 justify-between">
          <!-- Meaning / Gloss -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-600 dark:text-slate-300">
              {getTranslation(ex.gloss)}
            </span>
            <span class="text-xs text-slate-400">
              {i18n.t('alphabet_sound')} <strong class="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{activeVariant.soundIpa}</strong>
            </span>
          </div>

          <!-- Pronunciation Practice Strip -->
          <div class="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {i18n.t('alphabet_oral_practice')}
              </span>

              <button
                onclick={() => handlePracticeWord(ex.word)}
                class="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer {isListening ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/20' : isEvaluating ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600'}"
              >
                {#if isListening}
                  <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>{i18n.t('alphabet_stop')}</span>
                {:else if isEvaluating}
                  <span>{i18n.t('alphabet_evaluating')}</span>
                {:else}
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                  <span>{i18n.t('alphabet_practice')}</span>
                {/if}
              </button>
            </div>

            <!-- Verdict Feedback Banner -->
            {#if verdict}
              <div
                class="text-xs p-2.5 rounded-xl flex items-start gap-2 {verdict.correct ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200' : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200'}"
              >
                {#if verdict.correct}
                  <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                {:else}
                  <svg class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                {/if}
                <div class="flex-1">
                  <div class="font-bold">
                    {verdict.correct ? i18n.t('alphabet_bravo') : i18n.t('alphabet_almost')}
                  </div>
                  <div class="text-[11px] opacity-90 mt-0.5">
                    {verdict.feedback}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
