import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { synthesizeGemini, TTS_MIME } from "$lib/server/gemini-tts";

// In-memory cache for synthesized audio clips (letters, frequent words)
interface CachedAudio {
  buffer: Buffer;
  mime: string;
}

const audioCache = new Map<string, CachedAudio>();
const MAX_CACHE_ITEMS = 500;

export const GET: RequestHandler = async ({ url }) => {
  const text = url.searchParams.get("text")?.trim();
  if (!text) throw error(400, "Missing 'text' parameter");
  if (text.length > 200) throw error(400, "Text too long");

  const normalized = text.toLowerCase();
  let cached = audioCache.get(normalized);

  if (!cached) {
    try {
      const res = await synthesizeGemini(text);
      cached = { buffer: res.buffer, mime: res.mime };
      if (audioCache.size >= MAX_CACHE_ITEMS) {
        const firstKey = audioCache.keys().next().value;
        if (firstKey) audioCache.delete(firstKey);
      }
      audioCache.set(normalized, cached);
    } catch (err: any) {
      console.error("[api/tts] Synthesis error:", err);
      throw error(500, "TTS synthesis failed");
    }
  }

  return new Response(new Uint8Array(cached.buffer), {
    headers: {
      "Content-Type": cached.mime,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Content-Length": cached.buffer.length.toString()
    }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  const text = (body?.text || "").trim();
  if (!text) throw error(400, "Missing 'text' in JSON body");
  if (text.length > 200) throw error(400, "Text too long");

  const normalized = text.toLowerCase();
  let cached = audioCache.get(normalized);

  if (!cached) {
    try {
      const res = await synthesizeGemini(text);
      cached = { buffer: res.buffer, mime: res.mime };
      if (audioCache.size >= MAX_CACHE_ITEMS) {
        const firstKey = audioCache.keys().next().value;
        if (firstKey) audioCache.delete(firstKey);
      }
      audioCache.set(normalized, cached);
    } catch (err: any) {
      console.error("[api/tts] Synthesis error:", err);
      throw error(500, "TTS synthesis failed");
    }
  }

  return new Response(new Uint8Array(cached.buffer), {
    headers: {
      "Content-Type": cached.mime,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Content-Length": cached.buffer.length.toString()
    }
  });
};
