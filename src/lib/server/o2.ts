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

export const BOT_REGEX = /(?:bot|crawler|spider|slurp|curl|wget|python|urllib|requests|httpx|aiohttp|go-http-client|java|perl|ruby|php|libwww|okhttp|apache-httpclient|winhttp|node-fetch|axios|undici|postman|insomnia|k6|jmeter|locust|artillery|uptimerobot|pingdom|statuscake|site24x7|datadog|newrelic|sensu|nagios|zabbix|check_http|kube-probe|healthcheck|envoy|consul|googlebot|bingbot|yandex|baiduspider|duckduckbot|sogou|exabot|facebot|ia_archiver|twitterbot|facebookexternalhit|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator|telegrambot|applebot|whatsapp|flipboard|discordbot|bytespider|petalbot|claudebot|gptbot|ccbot|anthropic|openai|cohere|serpstat|ahrefs|semrush|dotbot|mj12bot|rogerbot|screaming frog|headlesschrome|phantomjs|selenium|puppeteer|playwright|prerender|lighthouse|inspect|scanner|nessus|sqlmap|nmap|nikto)/i;

export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua || !ua.trim()) return true; // Missing or empty UA is almost always automated
  return BOT_REGEX.test(ua);
}

export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  if (!ua || !ua.trim()) {
    return { browser: "Unknown", os: "Unknown", deviceType: "bot", isBot: true };
  }

  const isBot = isBotUserAgent(ua);
  if (isBot) {
    return { browser: "Bot", os: "Bot", deviceType: "bot", isBot: true };
  }

  const lower = ua.toLowerCase();
  let deviceType: "mobile" | "tablet" | "desktop" | "bot" = "desktop";
  if (/ipad|tablet|(android(?!.*mobile))/i.test(lower)) {
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

  return { browser, os, deviceType, isBot: false };
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
  // Never log bots, crawlers, scrapers, or automated tools
  if (event.is_bot) {
    return;
  }
  if (typeof event.user_agent === "string" && isBotUserAgent(event.user_agent)) {
    return;
  }

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
