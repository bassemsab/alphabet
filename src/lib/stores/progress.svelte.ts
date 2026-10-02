class ProgressStore {
  masteredLetters = $state<Set<string>>(new Set());
  wordScores = $state<Record<string, { correct: number; total: number }>>({});

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const rawLetters = localStorage.getItem("alphabet-mastered-letters");
        if (rawLetters) {
          this.masteredLetters = new Set(JSON.parse(rawLetters));
        }
        const rawScores = localStorage.getItem("alphabet-word-scores");
        if (rawScores) {
          this.wordScores = JSON.parse(rawScores);
        }
      } catch (e) {
        console.warn("Failed to load alphabet progress from localStorage:", e);
      }
    }
  }

  toggleMastered(letter: string) {
    const next = new Set(this.masteredLetters);
    if (next.has(letter)) {
      next.delete(letter);
    } else {
      next.add(letter);
    }
    this.masteredLetters = next;
    this.save();
  }

  isMastered(letter: string): boolean {
    return this.masteredLetters.has(letter);
  }

  recordAttempt(word: string, correct: boolean) {
    const prev = this.wordScores[word] || { correct: 0, total: 0 };
    this.wordScores = {
      ...this.wordScores,
      [word]: {
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1
      }
    };
    this.save();
  }

  private save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("alphabet-mastered-letters", JSON.stringify(Array.from(this.masteredLetters)));
      localStorage.setItem("alphabet-word-scores", JSON.stringify(this.wordScores));
    } catch (e) {
      console.warn("Failed to save alphabet progress:", e);
    }
  }
}

export const progress = new ProgressStore();
