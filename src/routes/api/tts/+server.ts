import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { synthesizeFrench } from "$lib/server/edge-tts";

// In-memory cache for synthesized audio clips (letters, frequent words)
const audioCache = new Map<string, Buffer>();
const MAX_CACHE_ITEMS = 500;

export const GET: RequestHandler = async ({ url }) => {
  const text = url.searchParams.get("text")?.trim();
  if (!text) throw error(400, "Missing 'text' parameter");
  if (text.length > 100) throw error(400, "Text too long");

  const normalized = text.toLowerCase();
  let buffer = audioCache.get(normalized);

  if (!buffer) {
    try {
      buffer = await synthesizeFrench(text);
      if (audioCache.size >= MAX_CACHE_ITEMS) {
        const firstKey = audioCache.keys().next().value;
        if (firstKey) audioCache.delete(firstKey);
      }
      audioCache.set(normalized, buffer);
    } catch (err: any) {
      console.error("[api/tts] Synthesis error:", err);
      throw error(500, "TTS synthesis failed");
    }
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Content-Length": buffer.length.toString()
    }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => ({}));
  const text = (body?.text || "").trim();
  if (!text) throw error(400, "Missing 'text' in JSON body");
  if (text.length > 100) throw error(400, "Text too long");

  const normalized = text.toLowerCase();
  let buffer = audioCache.get(normalized);

  if (!buffer) {
    try {
      buffer = await synthesizeFrench(text);
      if (audioCache.size >= MAX_CACHE_ITEMS) {
        const firstKey = audioCache.keys().next().value;
        if (firstKey) audioCache.delete(firstKey);
      }
      audioCache.set(normalized, buffer);
    } catch (err: any) {
      console.error("[api/tts] Synthesis error:", err);
      throw error(500, "TTS synthesis failed");
    }
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Content-Length": buffer.length.toString()
    }
  });
};
