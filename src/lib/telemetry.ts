/**
 * Client-side telemetry helper for alphabet.ether.paris.
 * Captures user visits, letter clicks, audio plays, and practice events,
 * and sends them to the server telemetry endpoint for ingestion into OpenObserve (O2).
 */

import { i18n } from "$lib/stores/i18n.svelte";

let sessionId = "";

export function getSessionId(): string {
  if (sessionId) return sessionId;
  if (typeof window === "undefined") return "";

  try {
    const existing = localStorage.getItem("alphabet_sid");
    if (existing) {
      sessionId = existing;
      return sessionId;
    }

    sessionId = "s_" + Math.random().toString(36).slice(2, 10) + "_" + Date.now().toString(36);
    localStorage.setItem("alphabet_sid", sessionId);
    document.cookie = `alphabet_sid=${sessionId}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    sessionId = "s_anon_" + Date.now();
  }

  return sessionId;
}

export function isClientBot(): boolean {
  if (typeof window === "undefined") return false;
  // Headless browser and automation flags
  if (navigator.webdriver) return true;
  const w = window as any;
  if (w.__nightmare || w._phantom || w.callPhantom || w.__selenium_unwrapped) return true;
  const ua = navigator.userAgent || "";
  if (!ua || /(?:bot|crawler|spider|slurp|headlesschrome|lighthouse|phantomjs|selenium|puppeteer|playwright)/i.test(ua)) {
    return true;
  }
  return false;
}

export function trackEvent(event: string, details: Record<string, any> = {}): void {
  if (typeof window === "undefined") return;
  if (isClientBot()) return;

  const sid = getSessionId();
  const payload = {
    event,
    sessionId: sid,
    uiLang: i18n.currentLang,
    details: {
      ...details,
      url: window.location.href,
      path: window.location.pathname
    }
  };

  const bodyStr = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([bodyStr], { type: "application/json" });
    const queued = navigator.sendBeacon("/api/telemetry", blob);
    if (queued) return;
  }

  fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: bodyStr,
    keepalive: true
  }).catch(() => {});
}

let initialized = false;

export function initClientTelemetry(): void {
  if (typeof window === "undefined" || initialized) return;
  if (isClientBot()) return;
  initialized = true;

  getSessionId();

  // Track initial session arrival with device viewport details
  trackEvent("client_session_start", {
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || "unknown",
    device_pixel_ratio: window.devicePixelRatio || 1,
    referrer: document.referrer || "direct"
  });
}
