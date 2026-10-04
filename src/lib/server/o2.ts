/**
 * OpenObserve (O2) logging pipeline for alphabet.ether.paris.
 * Sends rich structured events (visitor details, user agent, IP, country, actions)
 * directly into OpenObserve via the cluster's internal endpoint or configured URL.
 */

interface OpenObserveConfig {
  endpoint: string;
  org: string;
  stream: string;
  auth: string;
}

function getConfig(): OpenObserveConfig | null {
  const endpoint = (process.env.OPENOBSERVE_ENDPOINT || "http://openobserve.ether-shared.svc.cluster.local:5080").replace(/\/+$/, "");
  const org = process.env.OPENOBSERVE_ORG || "3GlJ6SL7OxrCVJR5Cyvw89gKBTg";
  const stream = process.env.OPENOBSERVE_STREAM || "alphabet";
  const auth = process.env.OPENOBSERVE_AUTH;

  if (!auth) {
    return null;
  }

  return { endpoint, org, stream, auth };
}

export interface ParsedUserAgent {
  browser: string;
  os: string;
  deviceType: "mobile" | "tablet" | "desktop" | "bot";
  isBot: boolean;
}

export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  if (!ua) {
    return { browser: "Unknown", os: "Unknown", deviceType: "desktop", isBot: false };
  }

  const lower = ua.toLowerCase();

  const isBot = /bot|crawl|spider|slurp|curl|wget|python|httpclient|postman|uptimerobot|k8s|probe|uptime/i.test(lower);
  let deviceType: "mobile" | "tablet" | "desktop" | "bot" = "desktop";
  if (isBot) {
    deviceType = "bot";
  } else if (/ipad|tablet|(android(?!.*mobile))/i.test(lower)) {
    deviceType = "tablet";
  } else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(lower)) {
    deviceType = "mobile";
  }

  let os = "Other";
  if (/iphone|ipad|ipod/i.test(lower)) os = "iOS";
  else if (/android/i.test(lower)) os = "Android";
  else if (/macintosh|mac os x/i.test(lower)) os = "macOS";
  else if (/windows/i.test(lower)) os = "Windows";
  else if (/linux/i.test(lower)) os = "Linux";

  let browser = "Other";
  if (/edg\//i.test(lower)) browser = "Edge";
  else if (/opr\/|opera/i.test(lower)) browser = "Opera";
  else if (/chrome|crios/i.test(lower)) browser = "Chrome";
  else if (/firefox|fxios/i.test(lower)) browser = "Firefox";
  else if (/safari/i.test(lower)) browser = "Safari";

  return { browser, os, deviceType, isBot };
}

export function extractClientIp(headers: Headers): string {
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export function extractCountry(headers: Headers): string {
  return (headers.get("cf-ipcountry") || "unknown").toUpperCase();
}

/**
 * Send an event record to OpenObserve asynchronously (non-blocking).
 */
export async function logToO2(event: Record<string, any>): Promise<void> {
  const cfg = getConfig();
  if (!cfg) {
    // If not configured (e.g. local test without secrets), log locally
    if (process.env.NODE_ENV !== "production") {
      console.log("[O2 dev log]", event);
    }
    return;
  }

  const payload = [
    {
      _timestamp: Date.now() * 1000, // microsecond precision
      service: "alphabet",
      stream: cfg.stream,
      ...event
    }
  ];

  const url = `${cfg.endpoint}/api/${encodeURIComponent(cfg.org)}/${encodeURIComponent(cfg.stream)}/_json`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: cfg.auth,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      // @ts-expect-error keepalive is supported in Node/Bun fetch
      keepalive: true
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.warn(`[o2] Ingestion returned ${res.status}: ${err.slice(0, 100)}`);
    }
  } catch (err: any) {
    console.warn("[o2] Failed to send log:", err.message);
  }
}
