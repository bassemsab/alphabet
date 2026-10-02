import type { LocalizedText } from "$lib/alphabet/types";

export type SupportedLanguage = "en" | "fr" | "ar" | "es" | "de" | "it" | "pt" | "nl" | "zh" | "prs" | "uk";

export const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "prs", label: "فارسی / دری", flag: "🇦🇫" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
];

const UI_STRINGS: Record<string, Record<SupportedLanguage, string>> = {
  alphabet_title: {
    fr: "Alphabet & Sons Français",
    en: "French Alphabet & Phonics",
    ar: "الأبجدية والصوتيات الفرنسية",
    es: "Alfabeto y Fonética Francesa",
    de: "Französisches Alphabet & Phonetik",
    it: "Alfabeto e Fonetica Francese",
    pt: "Alfabeto e Fonética Francesa",
    nl: "Frans Alfabet & Fonetiek",
    zh: "法语字母与发音",
    prs: "الفبا و فونتیک فرانسوی",
    uk: "Французький алфавіт та фонетика",
  },
  alphabet_subtitle: {
    fr: "Apprenez les lettres, écoutez les sons et entraînez-vous à haute voix avec l'IA.",
    en: "Learn letters, listen to authentic sounds, and practice speaking aloud with AI.",
    ar: "تعلم الحروف، استمع إلى الأصوات الأصلية، وتدرب على النطق بصوت عالٍ مع الذكاء الاصطناعي.",
    es: "Aprende las letras, escucha los sonidos y practica en voz alta con IA.",
    de: "Lerne Buchstaben, höre authentische Laute und übe das Sprechen mit KI.",
    it: "Impara le lettere, ascolta i suoni ed esercitati a voce alta con l'IA.",
    pt: "Aprenda as letras, ouça os sons e pratique em voz alta com IA.",
    nl: "Leer letters, luister naar klanken en oefen hardop met AI.",
    zh: "学习字母，聆听地道发音，并通过 AI 实时练习口语。",
    prs: "حروف را بیاموزید، صداهای دقیق را بشنوید و با کمک هوش مصنوعی تمرین تلفظ کنید.",
    uk: "Вивчайте літери, слухайте автентичні звуки та тренуйте вимову за допомогою ШІ.",
  },
  alphabet_filter_all: {
    fr: "Tous les sons",
    en: "All sounds",
    ar: "جميع الأصوات",
    es: "Todos los sonidos",
    de: "Alle Laute",
    it: "Tutti i suoni",
    pt: "Todos os sons",
    nl: "Alle klanken",
    zh: "全部发音",
    prs: "همه صداها",
    uk: "Всі звуки",
  },
  alphabet_filter_vowels: {
    fr: "Voyelles",
    en: "Vowels",
    ar: "حروف العلة",
    es: "Vocales",
    de: "Vokale",
    it: "Vocali",
    pt: "Vogais",
    nl: "Klinkers",
    zh: "元音",
    prs: "حروف صدادار",
    uk: "Голосні",
  },
  alphabet_filter_consonants: {
    fr: "Consonnes",
    en: "Consonants",
    ar: "حروف صامتة",
    es: "Consonantes",
    de: "Konsonanten",
    it: "Consonanti",
    pt: "Consoantes",
    nl: "Medeklinkers",
    zh: "辅音",
    prs: "حروف بی‌صدا",
    uk: "Приголосні",
  },
  alphabet_filter_digraphs: {
    fr: "Combinaisons (CH, OU...)",
    en: "Letter blends (CH, OU...)",
    ar: "التركيبات الصوتية (CH, OU...)",
    es: "Dígrafos (CH, OU...)",
    de: "Buchstabenverbindungen",
    it: "Combinazioni di lettere",
    pt: "Dígrafos (CH, OU...)",
    nl: "Klankcombinaties",
    zh: "复合字母组合",
    prs: "ترکیب حروف (CH, OU...)",
    uk: "Буквосполучення",
  },
  alphabet_tab_cards: {
    fr: "Cartes",
    en: "Flashcards",
    ar: "بطاقات",
    es: "Tarjetas",
    de: "Karten",
    it: "Schede",
    pt: "Cartões",
    nl: "Kaarten",
    zh: "卡片模式",
    prs: "کارت‌ها",
    uk: "Картки",
  },
  alphabet_tab_grid: {
    fr: "Grille complète",
    en: "Overview grid",
    ar: "جدول كامل",
    es: "Cuadrícula",
    de: "Übersicht",
    it: "Griglia",
    pt: "Grelha",
    nl: "Overzicht",
    zh: "全览网格",
    prs: "نمای جدولی",
    uk: "Таблиця",
  },
  alphabet_prev: {
    fr: "Précédent",
    en: "Previous",
    ar: "السابق",
    es: "Anterior",
    de: "Zurück",
    it: "Precedente",
    pt: "Anterior",
    nl: "Vorige",
    zh: "上一张",
    prs: "قبلی",
    uk: "Назад",
  },
  alphabet_next: {
    fr: "Suivant",
    en: "Next",
    ar: "التالي",
    es: "Siguiente",
    de: "Weiter",
    it: "Successivo",
    pt: "Seguinte",
    nl: "Volgende",
    zh: "下一张",
    prs: "بعدی",
    uk: "Далі",
  },
  alphabet_listen: {
    fr: "Écouter",
    en: "Listen",
    ar: "استمع",
    es: "Escuchar",
    de: "Anhören",
    it: "Ascolta",
    pt: "Ouvir",
    nl: "Luisteren",
    zh: "聆听",
    prs: "شنیدن",
    uk: "Слухати",
  },
  alphabet_practice: {
    fr: "Prononcer",
    en: "Pronounce",
    ar: "تحدث",
    es: "Pronunciar",
    de: "Sprechen",
    it: "Pronuncia",
    pt: "Pronunciar",
    nl: "Uitspreken",
    zh: "练读",
    prs: "تلفظ کردن",
    uk: "Вимовити",
  },
  alphabet_stop: {
    fr: "Arrêter",
    en: "Stop",
    ar: "إيقاف",
    es: "Detener",
    de: "Stopp",
    it: "Stop",
    pt: "Parar",
    nl: "Stoppen",
    zh: "停止",
    prs: "توقف",
    uk: "Зупинити",
  },
  alphabet_evaluating: {
    fr: "Analyse en cours...",
    en: "Evaluating...",
    ar: "جارٍ التحليل...",
    es: "Evaluando...",
    de: "Auswertung...",
    it: "Valutazione...",
    pt: "A avaliar...",
    nl: "Beoordelen...",
    zh: "评估中...",
    prs: "در حال بررسی...",
    uk: "Оцінювання...",
  },
  alphabet_rule: {
    fr: "Règle de prononciation",
    en: "Pronunciation rule",
    ar: "قاعدة النطق",
    es: "Regla de pronunciación",
    de: "Ausspracheregel",
    it: "Regola di pronuncia",
    pt: "Regra de pronúncia",
    nl: "Uitspraakregel",
    zh: "发音规则",
    prs: "قاعده تلفظ",
    uk: "Правило вимови",
  },
  alphabet_examples: {
    fr: "Mots d'exemple",
    en: "Example words",
    ar: "أمثلة الكلمات",
    es: "Palabras de ejemplo",
    de: "Beispielwörter",
    it: "Parole di esempio",
    pt: "Palavras de exemplo",
    nl: "Voorbeeldwoorden",
    zh: "例词示范",
    prs: "کلمات نمونه",
    uk: "Приклади слів",
  },
  alphabet_mastered: {
    fr: "Maîtrisé",
    en: "Mastered",
    ar: "مُتقَن",
    es: "Dominado",
    de: "Gemeistert",
    it: "Completato",
    pt: "Dominado",
    nl: "Beheerst",
    zh: "已掌握",
    prs: "تسلط یافته",
    uk: "Опановано",
  },
  alphabet_mark_mastered: {
    fr: "Marquer comme maîtrisé",
    en: "Mark as mastered",
    ar: "وضع علامة الإتقان",
    es: "Marcar como dominado",
    de: "Als gemeistert markieren",
    it: "Segna come completato",
    pt: "Marcar como dominado",
    nl: "Markeer als beheerst",
    zh: "标记为已掌握",
    prs: "ثبت به عنوان تسلط‌یافته",
    uk: "Позначити як опановане",
  },
};

class I18nStore {
  currentLang = $state<SupportedLanguage>("fr");

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("alphabet-lang") as SupportedLanguage;
      if (stored && LANGUAGE_OPTIONS.some((opt) => opt.code === stored)) {
        this.currentLang = stored;
      } else {
        const browser = navigator.language.split("-")[0] as SupportedLanguage;
        if (browser && LANGUAGE_OPTIONS.some((opt) => opt.code === browser)) {
          this.currentLang = browser;
        } else {
          this.currentLang = "en";
        }
      }
    }
  }

  setLang(lang: SupportedLanguage) {
    this.currentLang = lang;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("alphabet-lang", lang);
      } catch {}
    }
  }

  t(key: string, fallback?: string): string {
    const entry = UI_STRINGS[key];
    if (entry) {
      return entry[this.currentLang] || entry.en || entry.fr || fallback || key;
    }
    return fallback || key;
  }

  resolveText(textObj: LocalizedText | undefined): string {
    if (!textObj) return "";
    const l = this.currentLang;
    return (textObj as any)[l] || textObj.fr || textObj.en || "";
  }
}

export const i18n = new I18nStore();
