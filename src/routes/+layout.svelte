<script lang="ts">
  import "../app.css";
  import { i18n, LANGUAGE_OPTIONS, type SupportedLanguage } from "$lib/stores/i18n.svelte";
  import { progress } from "$lib/stores/progress.svelte";
  import { FRENCH_ALPHABET_DATA } from "$lib/alphabet/data";
  import { onMount } from "svelte";

  let { children } = $props();

  let isDark = $state(false);
  let showLangMenu = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains("dark");
  });

  function toggleTheme() {
    isDark = !isDark;
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("alphabet-theme", isDark ? "dark" : "light");
    } catch {}
  }

  function selectLanguage(lang: SupportedLanguage) {
    i18n.setLang(lang);
    showLangMenu = false;
  }

  const currentOption = $derived(
    LANGUAGE_OPTIONS.find((opt) => opt.code === i18n.currentLang) || LANGUAGE_OPTIONS[0]
  );

  const masteredCount = $derived(progress.masteredLetters.size);
  const totalLetters = FRENCH_ALPHABET_DATA.length;
  const progressPercent = $derived(Math.round((masteredCount / totalLetters) * 100));
</script>

<svelte:window onclick={(e) => {
  const target = e.target as HTMLElement;
  if (!target.closest("#lang-dropdown-container")) {
    showLangMenu = false;
  }
}} />

<div class="min-h-full flex flex-col bg-surface-base text-slate-800 dark:text-slate-100 transition-colors">
  <!-- Top Global Header -->
  <header class="h-16 px-4 sm:px-8 border-b border-slate-200/80 dark:border-white/5 bg-surface-chrome backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
    <!-- Brand / Title -->
    <div class="flex items-center gap-3">
      <img src="/icon-192.png" alt="Ami Logo" class="w-10 h-10 rounded-2xl shadow-xs object-cover" />
      <div>
        <h1 class="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {i18n.t("alphabet_title")}
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
          alphabet.ether.paris
        </p>
      </div>
    </div>

    <!-- Right Controls: Progress, Language Selector, Dark Mode -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Mastery Counter -->
      <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
        <span>★ {masteredCount} / {totalLetters}</span>
        <div class="w-12 h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500 rounded-full transition-all" style="width: {progressPercent}%"></div>
        </div>
      </div>

      <!-- Language Dropdown -->
      <div class="relative" id="lang-dropdown-container">
        <button
          onclick={() => (showLangMenu = !showLangMenu)}
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-surface-elevated text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-all shadow-xs cursor-pointer"
          title="Changer de langue / Change language"
        >
          <span>{currentOption.flag}</span>
          <span class="hidden sm:inline">{currentOption.label}</span>
          <svg class="w-3 h-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        {#if showLangMenu}
          <div class="absolute right-0 mt-2 w-48 max-h-80 overflow-y-auto rounded-2xl bg-surface-elevated border border-slate-200 dark:border-white/10 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {#each LANGUAGE_OPTIONS as opt}
              <button
                onclick={() => selectLanguage(opt.code)}
                class="w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors {i18n.currentLang === opt.code ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'}"
              >
                <div class="flex items-center gap-2">
                  <span>{opt.flag}</span>
                  <span>{opt.label}</span>
                </div>
                {#if i18n.currentLang === opt.code}
                  <span>✓</span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Dark / Light Theme Toggle -->
      <button
        onclick={toggleTheme}
        class="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-surface-elevated text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 transition-all shadow-xs cursor-pointer"
        title="Basculer le thème clair/sombre"
      >
        {#if isDark}
          <!-- Sun -->
          <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        {:else}
          <!-- Moon -->
          <svg class="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        {/if}
      </button>
    </div>
  </header>

  <!-- Page Content -->
  <div class="flex-1 flex flex-col">
    {@render children()}
  </div>
</div>
