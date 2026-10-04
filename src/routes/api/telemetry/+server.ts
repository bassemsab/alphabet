import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { logToO2, parseUserAgent, extractClientIp, extractCountry } from "$lib/server/o2";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json({ ok: false }, { status: 400 });
  }

  const eventName = typeof body.event === "string" ? body.event : "client_event";
  const details = typeof body.details === "object" && body.details ? body.details : {};
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : cookies.get("alphabet_sid") || null;
  const uiLang = typeof body.uiLang === "string" ? body.uiLang : null;

  // Set or refresh session cookie if provided
  if (sessionId && !cookies.get("alphabet_sid")) {
    cookies.set("alphabet_sid", sessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      sameSite: "lax"
    });
  }

  const headers = request.headers;
  const rawUa = headers.get("user-agent") || "";
  const uaInfo = parseUserAgent(rawUa);

  // Do not log events from bots or crawlers
  if (uaInfo.isBot) {
    return json({ ok: true });
  }

  const clientIp = extractClientIp(headers);
  const country = extractCountry(headers);
  const referer = headers.get("referer") || null;

  logToO2({
    event: eventName,
    session_id: sessionId,
    ui_lang: uiLang,
    client_ip: clientIp,
    country,
    user_agent: rawUa,
    browser: uaInfo.browser,
    os: uaInfo.os,
    device_type: uaInfo.deviceType,
    is_bot: uaInfo.isBot,
    referer,
    ...details
  }).catch(() => {});

  return json({ ok: true });
};
