export class SettingsStore {
  strictMode = $state<boolean>(true);

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("alphabet-strict-mode");
        if (saved !== null) {
          this.strictMode = saved === "true";
        }
      } catch {}
    }
  }

  toggleStrictMode() {
    this.strictMode = !this.strictMode;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("alphabet-strict-mode", String(this.strictMode));
      } catch {}
    }
  }

  setStrictMode(val: boolean) {
    this.strictMode = val;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("alphabet-strict-mode", String(val));
      } catch {}
    }
  }
}

export const settings = new SettingsStore();
