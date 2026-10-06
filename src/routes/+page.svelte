<script lang="ts">
  import AlphabetCard from "$lib/components/alphabet/AlphabetCard.svelte";
  import { FRENCH_ALPHABET_DATA } from "$lib/alphabet/data";
  import type { AlphabetLetter, LetterCategory } from "$lib/alphabet/types";
  import { i18n } from "$lib/stores/i18n.svelte";
  import { progress } from "$lib/stores/progress.svelte";
  import { settings } from "$lib/stores/settings.svelte";
  import { trackEvent } from "$lib/telemetry";

  type FilterCategory = "all" | LetterCategory;
  type ViewMode = "cards" | "grid";

  let currentCategory = $state<FilterCategory>("all");
  let viewMode = $state<ViewMode>("cards");
  let currentIndex = $state(0);
  let searchQuery = $state("");

  const filteredLetters = $derived.by<AlphabetLetter[]>(() => {
    let list = FRENCH_ALPHABET_DATA;
    if (currentCategory !== "all") {
      list = list.filter((l) => l.category === currentCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((l) =>
        l.letter.toLowerCase().includes(q) ||
        l.lower.includes(q) ||
        l.variants.some((v) =>
          v.soundIpa.toLowerCase().includes(q) ||
          v.words.some((w) => w.word.toLowerCase().includes(q))
        )
      );
    }
    return list;
  });

  $effect(() => {
    if (currentIndex >= filteredLetters.length) {
      currentIndex = Math.max(0, filteredLetters.length - 1);
    }
  });

  // Preload neighboring letters' images so card flips are instantaneous and never show old images
  $effect(() => {
    if (typeof window === "undefined") return;
    const letters = filteredLetters;
    const preloadIndices = [
      currentIndex,
      currentIndex + 1,
      currentIndex + 2,
      currentIndex + 3,
      currentIndex - 1
    ];
    for (const idx of preloadIndices) {
      if (idx >= 0 && idx < letters.length) {
        const item = letters[idx];
        for (const variant of item.variants) {
          for (const word of variant.words) {
            if (word.imageUrl) {
              const img = new Image();
              img.src = word.imageUrl;
            }
          }
        }
      }
    }
  });

  const currentLetter = $derived<AlphabetLetter>(filteredLetters[currentIndex] || FRENCH_ALPHABET_DATA[0]);

  function nextLetter() {
    const letters = filteredLetters;
    if (currentIndex < letters.length - 1) {
      currentIndex++;
      trackEvent("carousel_nav", {
        direction: "next",
        letter: letters[currentIndex]?.letter,
        index: currentIndex
      });
    }
  }

  function prevLetter() {
    if (currentIndex > 0) {
      currentIndex--;
      trackEvent("carousel_nav", {
        direction: "prev",
        letter: filteredLetters[currentIndex]?.letter,
        index: currentIndex
      });
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (viewMode !== "cards") return;
    if (event.key === "ArrowRight") nextLetter();
    if (event.key === "ArrowLeft") prevLetter();
  }

  // Touch swipe gesture navigation
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let swipeOffsetX = $state(0);
  let isSwiping = $state(false);

  function handleTouchStart(e: TouchEvent) {
    if (viewMode !== "cards") return;
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
    isSwiping = false;
  }

  function handleTouchMove(e: TouchEvent) {
    if (viewMode !== "cards") return;
    const touch = e.touches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (!isSwiping) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        isSwiping = true;
      }
    }

    if (isSwiping) {
      swipeOffsetX = Math.max(-90, Math.min(90, dx * 0.45));
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    if (viewMode !== "cards") return;
    const touch = e.changedTouches[0];
    if (touch) {
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const elapsed = Date.now() - touchStartTime;

      if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.2 && elapsed < 800) {
        if (i18n.isRtl) {
          if (dx < 0) prevLetter();
          else nextLetter();
        } else {
          if (dx < 0) nextLetter();
          else prevLetter();
        }
      }
    }
    swipeOffsetX = 0;
    isSwiping = false;
  }

  const categoryLabels = $derived<Record<FilterCategory, string>>({
    all: i18n.t("alphabet_filter_all"),
    vowel: i18n.t("alphabet_filter_vowels"),
    consonant: i18n.t("alphabet_filter_consonants"),
    digraph: i18n.t("alphabet_filter_digraphs"),
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex-1 flex flex-col">
  <!-- Controls Bar: Category Filter, View Mode, Search -->
  <div class="px-4 sm:px-8 py-3.5 bg-surface-elevated/70 border-b border-slate-200/60 dark:border-white/5 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
    <!-- Category Pills -->
    <div class="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
      {#each (['all', 'vowel', 'consonant', 'digraph'] as FilterCategory[]) as cat}
        <button
          onclick={() => {
            currentCategory = cat;
            currentIndex = 0;
            trackEvent("category_filter", { category: cat });
          }}
          class="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer {currentCategory === cat ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-white/10'}"
        >
          {categoryLabels[cat]}
        </button>
      {/each}
    </div>

    <!-- View Mode Switcher, Search, Strict Mode Toggle -->
    <div class="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap sm:flex-nowrap">
      <!-- Strict Mode Toggle -->
      <button
        onclick={() => {
          settings.toggleStrictMode();
          trackEvent("strict_mode_toggled", { enabled: settings.strictMode });
        }}
        class="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none {settings.strictMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold shadow-xs' : 'bg-surface-elevated border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}"
        title={settings.strictMode ? i18n.t("strict_mode_hint_on") : i18n.t("strict_mode_hint_off")}
      >
        <span>{settings.strictMode ? "🎯" : "🌱"}</span>
        <span>{settings.strictMode ? i18n.t("strict_mode_label") : i18n.t("relaxed_mode_label")}</span>
      </button>

      <!-- Search Input -->
      <div class="relative max-w-[150px] sm:max-w-[190px] w-full">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={i18n.t("alphabet_search_placeholder")}
          class="w-full ps-8 pe-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-surface-elevated text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <svg class="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <!-- Mode Switcher -->
      <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl shrink-0">
        <button
          onclick={() => {
            viewMode = 'cards';
            trackEvent("view_mode", { mode: 'cards' });
          }}
          class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer {viewMode === 'cards' ? 'bg-white dark:bg-surface-elevated text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}"
          title={i18n.t('alphabet_tab_cards')}
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          <span class="hidden sm:inline">{i18n.t('alphabet_tab_cards')}</span>
        </button>

        <button
          onclick={() => {
            viewMode = 'grid';
            trackEvent("view_mode", { mode: 'grid' });
          }}
          class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer {viewMode === 'grid' ? 'bg-white dark:bg-surface-elevated text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}"
          title={i18n.t('alphabet_tab_grid')}
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="hidden sm:inline">{i18n.t('alphabet_tab_grid')}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Main Content Area -->
  <main class="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-20 flex flex-col gap-6">
    {#if filteredLetters.length === 0}
      <div class="text-center py-20 bg-surface-elevated rounded-3xl border border-slate-200 dark:border-white/5">
        <p class="text-slate-500 dark:text-slate-400 font-medium">
          {i18n.t("alphabet_no_letters_found")} "{searchQuery}".
        </p>
      </div>
    {:else if viewMode === 'cards'}
      <!-- Letter Selector Carousel -->
      <div class="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
        {#each filteredLetters as item, i}
          {@const isItemMastered = progress.isMastered(item.letter)}
          <button
            onclick={() => {
              currentIndex = i;
              trackEvent("letter_selected", { letter: item.letter, index: i });
            }}
            class="relative min-w-11 h-11 px-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap shrink-0 flex items-center justify-center transition-all cursor-pointer {currentIndex === i ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400' : 'bg-surface-elevated border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-500'}"
          >
            {item.letter}
            {#if isItemMastered}
              <span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[8px] text-white">
                ★
              </span>
            {/if}
          </button>
        {/each}
      </div>

      <!-- Current Letter Card with Swipe Gestures -->
      <div
        role="region"
        aria-label="Lettre active"
        class="touch-pan-y transition-transform duration-150 ease-out will-change-transform relative"
        style={swipeOffsetX !== 0 ? `transform: translateX(${swipeOffsetX}px)` : ''}
        ontouchstart={handleTouchStart}
        ontouchmove={handleTouchMove}
        ontouchend={handleTouchEnd}
        ontouchcancel={handleTouchEnd}
      >
        {#if currentLetter}
          {#key currentLetter.letter}
            <AlphabetCard letter={currentLetter} />
          {/key}
        {/if}
      </div>

      <!-- Mobile Swipe Hint -->
      <div class="text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 sm:hidden select-none -mt-3">
        {i18n.t('swipe_hint')}
      </div>

      <!-- Bottom Navigation Footer -->
      <div class="flex items-center justify-between gap-4 pt-2">
        <button
          onclick={prevLetter}
          disabled={currentIndex === 0}
          class="px-5 py-2.5 rounded-2xl bg-surface-elevated border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-white/5 transition-all shadow-xs cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>{i18n.t('alphabet_prev')}</span>
        </button>

        <!-- Progress Indicator -->
        <div class="flex items-center gap-3 max-w-xs w-full">
          <div class="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style="width: {((currentIndex + 1) / filteredLetters.length) * 100}%"
            ></div>
          </div>
          <span class="text-xs font-mono font-bold text-slate-400 shrink-0">
            {currentIndex + 1} / {filteredLetters.length}
          </span>
        </div>

        <button
          onclick={nextLetter}
          disabled={currentIndex === filteredLetters.length - 1}
          class="px-5 py-2.5 rounded-2xl bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          <span>{i18n.t('alphabet_next')}</span>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

    {:else}
      <!-- Grid Mode: Show all filtered letters -->
      <div class="flex flex-col gap-6">
        {#each filteredLetters as letterItem (letterItem.letter)}
          <AlphabetCard letter={letterItem} />
        {/each}
      </div>
    {/if}
  </main>
</div>
