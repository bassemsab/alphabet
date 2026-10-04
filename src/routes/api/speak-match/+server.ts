import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { evaluatePronunciation } from "$lib/server/pronunciation-judge";
import { logToO2, parseUserAgent, extractClientIp, extractCountry } from "$lib/server/o2";

const MAX_AUDIO_BASE64_LENGTH = 2_000_000;

export const POST: RequestHandler = async ({ request, cookies }) => {
  const start = performance.now();
  const body = await request.json().catch(() => null);
  const audio = typeof body?.audio === "string" ? body.audio : null;
  const expected = typeof body?.expected === "string" ? body.expected.trim() : null;
  const uiLang = typeof body?.uiLang === "string" ? body.uiLang : "fr";
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : cookies.get("alphabet_sid") || null;

  if (!audio || audio.length > MAX_AUDIO_BASE64_LENGTH) {
    throw error(400, "Un extrait audio court est requis.");
  }
  if (!expected) {
    throw error(400, "Le mot ou la lettre attendu est requis.");
  }

  const verdict = await evaluatePronunciation(audio, expected, uiLang);
  const durationMs = Math.round(performance.now() - start);

  const headers = request.headers;
  const rawUa = headers.get("user-agent") || "";
  const uaInfo = parseUserAgent(rawUa);

  if (!uaInfo.isBot) {
    logToO2({
      event: "speech_evaluation",
      session_id: sessionId,
      expected_word: expected,
      correct: verdict.correct,
      heard: verdict.heard,
      transcript: verdict.transcript,
      feedback: verdict.feedback,
      target_ipa: verdict.targetIpa,
      ui_lang: uiLang,
      duration_ms: durationMs,
      client_ip: extractClientIp(headers),
      country: extractCountry(headers),
      user_agent: rawUa,
      browser: uaInfo.browser,
      os: uaInfo.os,
      device_type: uaInfo.deviceType
    }).catch(() => {});
  }

  return json(verdict);
};
