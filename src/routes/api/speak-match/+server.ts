import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { evaluatePronunciation } from "$lib/server/pronunciation-judge";

const MAX_AUDIO_BASE64_LENGTH = 2_000_000;

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const audio = typeof body?.audio === "string" ? body.audio : null;
  const expected = typeof body?.expected === "string" ? body.expected.trim() : null;

  if (!audio || audio.length > MAX_AUDIO_BASE64_LENGTH) {
    throw error(400, "Un extrait audio court est requis.");
  }
  if (!expected) {
    throw error(400, "Le mot ou la lettre attendu est requis.");
  }

  const verdict = await evaluatePronunciation(audio, expected);
  return json(verdict);
};
