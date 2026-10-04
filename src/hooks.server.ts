import type { Handle, HandleServerError } from "@sveltejs/kit";
import { logToO2, parseUserAgent, extractClientIp, extractCountry } from "$lib/server/o2";

const STATIC_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|css|js|map)$/i;

export const handle: Handle = async ({ event, resolve }) => {
  const start = performance.now();
  const path = event.url.pathname;

  // Don't log static file assets or internal health check noise
  const isStaticAsset = STATIC_EXTENSIONS.test(path);
  const isHealthCheck = path === "/healthz" || path === "/up";

  const response = await resolve(event);
  const durationMs = Math.round(performance.now() - start);

  if (isStaticAsset || isHealthCheck) {
    return response;
  }

  const headers = event.request.headers;
  const rawUa = headers.get("user-agent") || "";
  const uaInfo = parseUserAgent(rawUa);

  // Do not log web bots, crawlers, or automated scripts
  if (uaInfo.isBot) {
    return response;
  }

  const clientIp = extractClientIp(headers);
  const country = extractCountry(headers);
  const referer = headers.get("referer") || null;
  const acceptLanguage = headers.get("accept-language") || null;

  // Check for session ID in cookies or request headers
  const sessionId = event.cookies.get("alphabet_sid") || headers.get("x-session-id") || null;

  // Fire and forget log to O2
  logToO2({
    event: path.startsWith("/api") ? "api_request" : "page_view",
    path,
    method: event.request.method,
    status: response.status,
    duration_ms: durationMs,
    client_ip: clientIp,
    country,
    user_agent: rawUa,
    browser: uaInfo.browser,
    os: uaInfo.os,
    device_type: uaInfo.deviceType,
    referer,
    accept_language: acceptLanguage,
    session_id: sessionId
  }).catch(() => {});

  return response;
};

export const handleError: HandleServerError = async ({ error, event }) => {
  const headers = event.request.headers;
  const rawUa = headers.get("user-agent") || "";
  const uaInfo = parseUserAgent(rawUa);

  // Do not log errors triggered by web bots or scanner probes
  if (uaInfo.isBot) {
    return {
      message: "Une erreur inattendue est survenue."
    };
  }

  logToO2({
    event: "server_error",
    level: "error",
    path: event.url.pathname,
    method: event.request.method,
    error_message: message,
    stacktrace: stack,
    client_ip: extractClientIp(headers),
    country: extractCountry(headers),
    user_agent: rawUa,
    browser: uaInfo.browser,
    os: uaInfo.os,
    device_type: uaInfo.deviceType
  }).catch(() => {});

  return {
    message: "Une erreur inattendue est survenue."
  };
};
