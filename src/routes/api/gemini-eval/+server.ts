import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const rawAudio = typeof body?.audio === "string" ? body.audio : null;
  const targetPhrase = typeof body?.target === "string" ? body.target.trim() : "";

  if (!targetPhrase) {
    throw error(400, "Phrase cible requise.");
  }

  if (!rawAudio || rawAudio.length < 100) {
    return json({
      is_correct: false,
      score: 0,
      transcription: "",
      feedback_encouraging: "Aucun son détecté. Parlez bien dans votre microphone !",
      scaffolding_tip: `Prononcez clairement : ${targetPhrase}`
    });
  }

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({
      is_correct: false,
      score: 0,
      transcription: "",
      feedback_encouraging: "Clé API non configurée.",
      scaffolding_tip: "Configurez GOOGLE_API_KEY."
    });
  }

  // Parse MIME type & base64 content
  let mimeType = "audio/webm";
  let cleanBase64 = rawAudio;
  if (rawAudio.startsWith("data:")) {
    const match = rawAudio.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      cleanBase64 = match[2];
    } else if (rawAudio.includes(",")) {
      cleanBase64 = rawAudio.split(",")[1];
    }
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

    const prompt = `Tu es un évaluateur phonétique pour un jeu d'alphabétisation d'adultes en français.
L'utilisateur doit prononcer le mot cible : "${targetPhrase}".

CONSIGNES STRICTES :
1. VÉRIFIE D'ABORD LA PRÉSENCE DE VOIX :
   - Si l'audio est SILENCIEUX, ou ne contient aucun mot compréhensible (uniquement souffle, clic, frottement, ou silence complet) :
     Réponds STRICTEMENT :
     {
       "is_correct": false,
       "score": 0,
       "transcription": "",
       "feedback_encouraging": "Aucune voix détectée. Parlez bien en face de votre micro !",
       "scaffolding_tip": "Dites à voix haute : ${targetPhrase}"
     }

2. SI UN MOT DIFFÉRENT EST PRONONCÉ :
   - Réponds :
     {
       "is_correct": false,
       "score": 30,
       "transcription": "mot transcrit",
       "feedback_encouraging": "Ce n'est pas le mot demandé.",
       "scaffolding_tip": "Essayez de répéter : ${targetPhrase}"
     }

3. SI LE MOT "${targetPhrase}" EST PRONONCÉ (même avec accent étranger ou hésitation) :
   - Sois chaleureux et encourageant :
     {
       "is_correct": true,
       "score": 92,
       "transcription": "${targetPhrase}",
       "feedback_encouraging": "Bravo ! Très bonne prononciation !",
       "scaffolding_tip": "Continuez ainsi !"
     }

Réponds STRICTEMENT en JSON conforme à cette structure.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: cleanBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.0,
        response_mime_type: "application/json",
        thinkingConfig: { thinkingBudget: 0 }
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("[Gemini API Error]", res.status, errText);
      return json({
        is_correct: false,
        score: 0,
        transcription: "",
        feedback_encouraging: "Erreur de transmission audio. Veuillez réessayer.",
        scaffolding_tip: "Répétez bien en face de votre micro."
      });
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidateText) {
      const parsed = JSON.parse(candidateText);
      return json(parsed);
    }

    throw new Error("Invalid response format from Gemini");
  } catch (err: any) {
    console.error("[Gemini API Error]", err);
    return json({
      is_correct: false,
      score: 0,
      transcription: "",
      feedback_encouraging: "Impossible d'analyser votre voix. Réessayez !",
      scaffolding_tip: `Prononcez clairement : ${targetPhrase}`
    });
  }
};
