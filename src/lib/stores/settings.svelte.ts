export class SettingsStore {
  strictMode = $state<boolean>(true);

  constructor() {
    this.strictMode = true;
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("alphabet-strict-mode");
      } catch {}
    }
  }

  toggleStrictMode() {
    // Strict mode is enforced on
    this.strictMode = true;
  }

  setStrictMode(_val: boolean) {
    this.strictMode = true;
  }
}

export const settings = new SettingsStore();
