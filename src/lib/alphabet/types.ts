export interface LocalizedText {
  en: string;
  ar: string;
  fr?: string;
  prs?: string;
  uk?: string;
  es?: string;
  de?: string;
  it?: string;
  pt?: string;
  zh?: string;
  nl?: string;
}

export interface SpeechSession {
  stop: () => void;
  cancel: () => void;
}

export interface AlphabetExampleWord {
  /** The full French word, e.g. "cerise" */
  word: string;
  /** Substring in the word to highlight, e.g. "c" or "ch" */
  highlight: string;
  /** International Phonetic Alphabet transcription, e.g. "/sə.ʁiz/" */
  ipa: string;
  /** Translation in supported UI languages */
  gloss: LocalizedText;
  /** High-quality visual image URL */
  imageUrl: string;
  /** Optional image description or alt text */
  imageAlt?: string;
}

export interface AlphabetSoundVariant {
  /** Unique variant id, e.g. "c-soft" */
  id: string;
  /** IPA representation of this specific sound, e.g. "/s/" */
  soundIpa: string;
  /** Human-readable title for this sound, e.g. "C doux (/s/)" */
  soundName: LocalizedText;
  /** Contextual rule explanation, e.g. "Devant les voyelles E, I, Y" */
  rule: LocalizedText;
  /** Curated example words illustrating this sound */
  words: AlphabetExampleWord[];
}

export type LetterCategory = 'vowel' | 'consonant' | 'digraph';

export interface AlphabetLetter {
  /** Uppercase letter or digraph, e.g. "C" or "CH" */
  letter: string;
  /** Lowercase letter, e.g. "c" */
  lower: string;
  /** Spoken name of the letter in French, e.g. "cé" */
  name: string;
  /** IPA of the letter name, e.g. "/se/" */
  nameIpa: string;
  /** Broad category for filtering */
  category: LetterCategory;
  /** Pronunciation variants based on spelling context */
  variants: AlphabetSoundVariant[];
}

export interface PronunciationVerdict {
  correct: boolean;
  heard: boolean;
  transcript: string | null;
  feedback: string | null;
  confidence?: number;
}
