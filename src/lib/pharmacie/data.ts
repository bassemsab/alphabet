import type { LocalizedText } from "$lib/alphabet/types";

export interface PharmacyItem {
  id: "medicament" | "pansement" | "ordonnance" | "trousse";
  word: string;
  article: "un" | "une";
  displayLabel: string;
  syllables: string[];
  letter: "M" | "P" | "O" | "T";
  ipa: string;
  icon: string;
  modelUrl: string;
  /** Natural French sentence Fatima says during the Discover step */
  discoverSpeech: string;
  /** Natural French pharmacy request Fatima says during the Listen & Tap step */
  requestSpeech: string;
  /** Useful short everyday phrase shown as context */
  contextPhrase: string;
  gloss: LocalizedText;
}

export const PHARMACY_ITEMS: PharmacyItem[] = [
  {
    id: "medicament",
    word: "médicament",
    article: "un",
    displayLabel: "Un médicament",
    syllables: ["mé", "di", "ca", "ment"],
    letter: "M",
    ipa: "/me.di.ka.mɑ̃/",
    icon: "💊",
    modelUrl: "/models/medicament.glb",
    discoverSpeech: "Un médicament.",
    requestSpeech: "Bonjour ! Je voudrais un médicament, s'il vous plaît.",
    contextPhrase: "Je voudrais un médicament.",
    gloss: {
      fr: "médicament",
      en: "medicine",
      ar: "دواء",
      prs: "دوا",
      ps: "درمل",
      sq: "ilaç",
      ka: "წამალი",
      es: "medicamento",
      de: "Medikament",
      it: "medicina",
      pt: "remédio",
      nl: "medicijn",
      zh: "药物",
      uk: "ліки",
    },
  },
  {
    id: "pansement",
    word: "pansement",
    article: "un",
    displayLabel: "Un pansement",
    syllables: ["pan", "se", "ment"],
    letter: "P",
    ipa: "/pɑ̃s.mɑ̃/",
    icon: "🩹",
    modelUrl: "/models/pansement.glb",
    discoverSpeech: "Un pansement.",
    requestSpeech: "Bonjour ! J'ai besoin d'un pansement, s'il vous plaît.",
    contextPhrase: "J'ai besoin d'un pansement.",
    gloss: {
      fr: "pansement",
      en: "bandage",
      ar: "ضمادة",
      prs: "پانسمان / چسب زخم",
      ps: "پټۍ",
      sq: "fashë",
      ka: "სახვევი / პლასტირი",
      es: "tirita / vendaje",
      de: "Pflaster",
      it: "cerotto",
      pt: "curativo",
      nl: "pleister",
      zh: "创可贴",
      uk: "пластир",
    },
  },
  {
    id: "ordonnance",
    word: "ordonnance",
    article: "une",
    displayLabel: "Une ordonnance",
    syllables: ["or", "don", "nance"],
    letter: "O",
    ipa: "/ɔʁ.dɔ.nɑ̃s/",
    icon: "📋",
    modelUrl: "/models/ordonnance.glb",
    discoverSpeech: "Une ordonnance.",
    requestSpeech: "Bonjour ! Voici mon ordonnance, s'il vous plaît.",
    contextPhrase: "Voici mon ordonnance.",
    gloss: {
      fr: "ordonnance",
      en: "prescription",
      ar: "وصفة طبية",
      prs: "نسخه داکتر",
      ps: "د ډاکټر نسخه",
      sq: "recetë mjekësore",
      ka: "რეცეპტი",
      es: "receta médica",
      de: "Rezept",
      it: "ricetta medica",
      pt: "receita médica",
      nl: "recept",
      zh: "处方",
      uk: "рецепт",
    },
  },
  {
    id: "trousse",
    word: "trousse",
    article: "une",
    displayLabel: "Une trousse",
    syllables: ["trousse"],
    letter: "T",
    ipa: "/tʁus/",
    icon: "🧰",
    modelUrl: "/models/trousse.glb",
    discoverSpeech: "Une trousse de secours.",
    requestSpeech: "Bonjour ! Je cherche une trousse de secours, s'il vous plaît.",
    contextPhrase: "Je cherche une trousse.",
    gloss: {
      fr: "trousse de secours",
      en: "first aid kit",
      ar: "حقيبة إسعافات أولية",
      prs: "بکس کمک‌های اولیه",
      ps: "د لومړنیو مرستو بکس",
      sq: "çanta e ndihmës së parë",
      ka: "პირველადი დახმარების ნაკრები",
      es: "botiquín",
      de: "Erste-Hilfe-Kasten",
      it: "kit di pronto soccorso",
      pt: "kit de primeiros socorros",
      nl: "EHBO-doos",
      zh: "急救箱",
      uk: "аптечка",
    },
  },
];

export type PharmacyStageStep = "discover" | "listen" | "speak" | "trace" | "complete";

export const PHARMACY_STEP_META: {
  id: Exclude<PharmacyStageStep, "complete">;
  icon: string;
  label: string;
  voiceIntro: string;
}[] = [
  {
    id: "discover",
    icon: "👆",
    label: "Découvrir",
    voiceIntro: "Bienvenue à la pharmacie ! Touche chaque objet sur le comptoir pour écouter son nom.",
  },
  {
    id: "listen",
    icon: "👂",
    label: "Trouver",
    voiceIntro: "Écoute bien et touche le bon objet sur le comptoir.",
  },
  {
    id: "speak",
    icon: "🎤",
    label: "Parler",
    voiceIntro: "À toi de parler ! Répète le mot à voix haute.",
  },
  {
    id: "trace",
    icon: "✍️",
    label: "Tracer",
    voiceIntro: "Dessine la première lettre de chaque mot avec ton doigt.",
  },
];
