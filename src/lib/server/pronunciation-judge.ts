export interface PronunciationVerdict {
  heard: boolean;
  transcript: string | null;
  correct: boolean;
  feedback: string | null;
  targetIpa: string | null;
}

const OPENROUTER_MODELS = [
  "thinkingmachines/inkling-small:free",
  "thinkingmachines/inkling:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"
];

const LANGUAGE_NAMES: Record<string, string> = {
  fr: "French",
  en: "English",
  ar: "Arabic",
  prs: "Dari (Afghan Persian)",
  ps: "Pashto (Afghan language)",
  sq: "Albanian",
  ka: "Georgian",
  es: "Spanish",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  zh: "Simplified Chinese",
  uk: "Ukrainian",
};

const DEFAULT_FEEDBACK_CORRECT: Record<string, string> = {
  fr: "Bravo ! Bonne prononciation.",
  en: "Great job! Accurate pronunciation.",
  ar: "أحسنت! نطق صحيح.",
  prs: "آفرین! تلفظ دقیق و عالی است.",
  ps: "ښه کار! تلفظ مو ډېر سم او ښه دی.",
  sq: "Të lumtë! Shqiptim shumë i mirë.",
  ka: "ყოჩაღ! ზუსტი და კარგი გამოთქმა.",
  es: "¡Bravo! Buena pronunciación.",
  de: "Bravo! Gute Aussprache.",
  it: "Bravo! Buona pronuncia.",
  pt: "Bravo! Boa pronúncia.",
  nl: "Goed gedaan! Goede uitspraak.",
  zh: "太棒了！发音很准确。",
  uk: "Чудово! Точна та гарна вимова.",
};

const DEFAULT_FEEDBACK_RETRY: Record<string, string> = {
  fr: "Réessayez en articulant bien.",
  en: "Try again, articulating clearly.",
  ar: "أعد المحاولة مع نطق الحروف بوضوح.",
  prs: "لطفاً دوباره با دقت و وضوح تلفظ کنید.",
  ps: "مهرباني وکړئ بیا په روښانه توګه تکرار کړئ.",
  sq: "Provoni përsëri duke artikuluar qartë.",
  ka: "სცადეთ ხელახლა, მკაფიოდ გამოთქვით.",
  es: "Inténtalo de nuevo articulando con claridad.",
  de: "Versuche es noch einmal und sprich deutlich.",
  it: "Riprova scandendo bene le parole.",
  pt: "Tente novamente articulando com clareza.",
  nl: "Probeer het opnieuw en spreek duidelijk uit.",
  zh: "请注意发音清晰，再次尝试。",
  uk: "Спробуйте ще раз, чітко артикулюючи.",
};

const DEFAULT_FEEDBACK_SILENCE: Record<string, string> = {
  fr: "Aucun son clair détecté. Rapprochez-vous du micro.",
  en: "No clear speech detected. Please speak closer to the microphone.",
  ar: "لم يتم التقاط صوت واضح. يرجى الاقتراب من الميكروفون.",
  prs: "صدای واضحی شناسایی نشد. لطفاً به مایکروفون نزدیک‌تر شوید.",
  ps: "روښانه غږ ونه موندل شو. مهرباني وکړئ مایکروفون ته نږدې شئ.",
  sq: "Nuk u dëgjua zë i qartë. Flisni më afër mikrofonit.",
  ka: "გარკვევით ხმა არ ისმის. გთხოვთ, მიუახლოვდეთ მიკროფონს.",
  es: "No se detectó un sonido claro. Acércate más al micrófono.",
  de: "Kein klarer Ton erkannt. Bitte näher an das Mikrofon sprechen.",
  it: "Nessun suono chiaro rilevato. Avvicinati al microfono.",
  pt: "Nenhum som clair detectado. Aproxime-se do microfone.",
  nl: "Geen duidelijk geluid gedetecteerd. Spreek dichter bij de microfoon.",
  zh: "未检测到清晰声音。请靠近麦克风后重试。",
  uk: "Чіткого звуку не виявлено. Будь ласка, говоріть ближче до мікрофона.",
};

const DEFAULT_FEEDBACK_ERROR: Record<string, string> = {
  fr: "Service d'évaluation temporairement indisponible. Veuillez réessayer.",
  en: "Evaluation service temporarily unavailable. Please try again.",
  ar: "خدمة التقييم غير متوفرة حالياً. يرجى إعادة المحاولة.",
  prs: "سرویس ارزیابی فعلاً در دسترس نیست. لطفاً بعداً دوباره امتحان کنید.",
  ps: "د ارزونې خدمت د لنډ وخت لپاره شتون نلري. مهرباني وکړئ بیا هڅه وکړئ.",
  sq: "Shërbimi i vlerësimit përkohësisht nuk është i disponueshëm. Provoni përsëri.",
  ka: "შეფასების სერვისი დროებით მიუწვდომელია. გთხოვთ სცადოთ მოგვიანებით.",
  es: "Servicio de evaluación temporalmente no disponible. Inténtalo de nuevo.",
  de: "Bewertungsdienst vorübergehend nicht verfügbar. Bitte erneut versuchen.",
  it: "Servizio di valutazione temporaneamente non disponibile. Riprova.",
  pt: "Serviço de avaliação temporariamente indisponível. Tente novamente.",
  nl: "Beoordelingsdienst tijdelijk niet beschikbaar. Probeer het opnieuw.",
  zh: "评估服务暂时不可用，请稍后重试。",
  uk: "Сервіс оцінювання тимчасово недоступний. Спробуйте пізніше.",
};

function formatHeardFeedback(transcript: string, uiLang: string): string {
  switch (uiLang) {
    case "ar":
      return `سمعت: "${transcript}". حاول مرة أخرى مع نطق الحروف بوضوح.`;
    case "prs":
      return `شنیده شد: "${transcript}". لطفاً دوباره با دقت و وضوح تلفظ کنید.`;
    case "ps":
      return `واورېدل شول: "${transcript}". مهرباني وکړئ په روښانه توګه بیا هڅه وکړئ.`;
    case "sq":
      return `U dëgjua: "${transcript}". Provoni përsëri duke artikuluar qartë.`;
    case "ka":
      return `გაისმა: "${transcript}". სცადეთ ხელახლა, მკაფიოდ გამოთქვით.`;
    case "en":
      return `Heard: "${transcript}". Try again, articulating clearly.`;
    case "es":
      return `Escuchado: "${transcript}". Inténtalo de nuevo articulando con claridad.`;
    case "de":
      return `Gehört: "${transcript}". Versuche es noch einmal und sprich deutlich.`;
    case "it":
      return `Ascoltato: "${transcript}". Riprova scandendo bene le parole.`;
    case "pt":
      return `Ouvido: "${transcript}". Tente novamente articulando com clareza.`;
    case "nl":
      return `Gehoord: "${transcript}". Probeer het opnieuw en spreek duidelijk uit.`;
    case "zh":
      return `听到：“${transcript}”。请注意清晰发音并重试。`;
    case "uk":
      return `Почуто: "${transcript}". Спробуйте ще раз, чітко артикулюючи.`;
    case "fr":
    default:
      return `Entendu : "${transcript}". Réessayez en articulant clairement.`;
  }
}

/**
 * Natural language evaluation prompt — letting the model's audio capabilities
 * judge English vs. French directly without manual phonetic transcriptions.
 */
function buildJudgePrompt(
  expected: string,
  uiLang: string,
  strict: boolean
): string {
  const langName = LANGUAGE_NAMES[uiLang] || "French";

  if (strict) {
    return `Évaluez la prononciation dans l'extrait audio pour le mot ou la lettre cible en français : "${expected}".
Langue de l'interface de l'apprenant : ${langName} (${uiLang}).

Consignes d'évaluation stricte :
1. Détection de la parole : "heard": true si une voix humaine est détectée, false si seulement silence ou bruit de fond.
2. Respect de la phonétique française : La prononciation DOIT être authentiquement française. Si le mot est prononcé en anglais (notamment pour les mots identiques ou proches en anglais comme les cognates), marquez impérativement "correct": false et expliquez en ${langName} (${uiLang}) que le mot a été prononcé en anglais et non en français.
3. Résultat : "correct": true uniquement si la prononciation est authentiquement française.
4. Donnez un retour court et constructif en ${langName} (${uiLang}).
5. Répondez au format JSON avec les clés : heard, transcript, correct, feedback, targetIpa.`;
  }

  // Mode détendu pour débutants
  return `Évaluez la prononciation dans l'extrait audio pour le mot ou la lettre cible en français : "${expected}".
Langue de l'interface de l'apprenant : ${langName} (${uiLang}).

Consignes d'évaluation débutant :
1. Détection de la parole : "heard": true si une voix humaine est détectée, false si silence ou bruit.
2. Tolérance : Acceptez les tentatives reconnaissables de "${expected}". Ne marquez "correct": false que si le mot est totalement erroné ou inaudible.
3. Donnez un bref encouragement en ${langName} (${uiLang}).
4. Répondez au format JSON avec les clés : heard, transcript, correct, feedback, targetIpa.`;
}


/**
 * OpenRouter Chat Completion API schema for multimodal audio models
 */
interface OpenRouterAudioContent {
  type: "input_audio";
  input_audio: {
    data: string;
    format: "wav";
  };
}

interface OpenRouterTextContent {
  type: "text";
  text: string;
}

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: (OpenRouterTextContent | OpenRouterAudioContent)[];
}

interface OpenRouterTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

interface OpenRouterChatRequest {
  model: string;
  messages: OpenRouterMessage[];
  tools?: OpenRouterTool[];
  plugins?: { id: string }[];
  temperature?: number;
  max_tokens?: number;
  include_reasoning?: boolean;
}

interface OpenRouterChatResponse {
  id?: string;
  choices?: Array<{
    message?: {
      role?: string;
      content?: string | null;
      reasoning?: string | null;
      tool_calls?: Array<{
        id: string;
        type: "function";
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
    finish_reason?: string;
  }>;
  error?: {
    code?: number | string;
    message?: string;
  };
}

function buildVerdictTool(strict: boolean): OpenRouterTool {
  return {
    type: "function",
    function: {
      name: "evaluate_pronunciation",
      description: "Soumettre le verdict d'évaluation de prononciation pour l'audio de l'apprenant.",
      parameters: {
        type: "object",
        properties: {
          heard: {
            type: "boolean",
            description: "true si une voix humaine est détectée, false si silence ou bruit de fond"
          },
          transcript: {
            type: "string",
            description: "ce que l'apprenant a dit, ou NO_SPEECH si silence"
          },
          correct: {
            type: "boolean",
            description: strict
              ? "true si prononcé en français authentique, false si prononcé en anglais ou mot erroné"
              : "true si tentative reconnaissable du mot cible, false si totalement faux ou silence"
          },
          feedback: {
            type: "string",
            description: "court retour encourageant ou explicatif dans la langue d'interface de l'apprenant"
          },
          targetIpa: {
            type: "string",
            description: "transcription API (alphabet phonétique international) du mot cible en français"
          }
        },
        required: ["heard", "correct"]
      }
    }
  };
}

/**
 * Evaluation using OpenRouter Multimodal Audio Models.
 */
async function judgeWithOpenRouter(
  wavBase64: string,
  expected: string,
  uiLang: string,
  strict: boolean,
  modelId: string,
  apiKey: string
): Promise<PronunciationVerdict | null> {
  const promptText = buildJudgePrompt(expected, uiLang, strict);
  const cleanWavBase64 = wavBase64.replace(/^data:audio\/\w+;base64,/, "").trim();

  const requestPayload: OpenRouterChatRequest = {
    model: modelId,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: promptText },
          {
            type: "input_audio",
            input_audio: {
              data: cleanWavBase64,
              format: "wav"
            }
          }
        ]
      }
    ],
    tools: [buildVerdictTool(strict)],
    plugins: [{ id: "response-healing" }],
    temperature: 0.1,
    max_tokens: 600,
    include_reasoning: false
  };

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cursor.com",
        "X-Title": "Cursor",
        "User-Agent": "Cursor/0.45.0"
      },
      body: JSON.stringify(requestPayload)
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[openrouter] Model ${modelId} returned ${res.status}: ${errText.slice(0, 150)}`);
      return null;
    }

    const data = (await res.json()) as OpenRouterChatResponse;
    const choice = data?.choices?.[0];
    const toolCall = choice?.message?.tool_calls?.[0];

    let parsed: any = null;

    if (toolCall?.function?.arguments) {
      try {
        parsed = typeof toolCall.function.arguments === "string"
          ? JSON.parse(toolCall.function.arguments)
          : toolCall.function.arguments;
      } catch (e) {
        console.warn(`[openrouter] Failed to parse tool arguments from ${modelId}:`, e);
      }
    }

    if (!parsed && choice?.message?.content) {
      const rawContent = choice.message.content.trim();
      const strippedContent = rawContent
        .replace(/<(?:think|thought)>[\s\S]*?<\/(?:think|thought)>/gi, "")
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const jsonMatch = strippedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {}
      }
    }

    if (!parsed || typeof parsed.heard !== "boolean" || typeof parsed.correct !== "boolean") {
      console.warn(`[openrouter] Model ${modelId} did not return a valid verdict object`);
      return null;
    }

    const heard = parsed.heard !== false && parsed.transcript !== "NO_SPEECH";
    const transcript = heard ? (parsed.transcript || null) : null;
    const isCorrect = heard && Boolean(parsed.correct);

    return {
      heard,
      transcript,
      correct: isCorrect,
      feedback:
        parsed.feedback ||
        (isCorrect
          ? (DEFAULT_FEEDBACK_CORRECT[uiLang] || DEFAULT_FEEDBACK_CORRECT.fr)
          : transcript
          ? formatHeardFeedback(transcript, uiLang)
          : (DEFAULT_FEEDBACK_RETRY[uiLang] || DEFAULT_FEEDBACK_RETRY.fr)),
      targetIpa: parsed.targetIpa || null
    };
  } catch (err: any) {
    console.warn(`[openrouter] Error calling ${modelId}:`, err.message);
    return null;
  }
}

/**
 * Pronunciation evaluation using OpenRouter free multimodal audio models:
 * - thinkingmachines/inkling-small:free
 * - thinkingmachines/inkling:free
 * - nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free
 *
 * No external fallbacks (Gemini and Whisper are disabled).
 */
export async function evaluatePronunciation(
  wavBase64: string,
  expected: string,
  uiLang: string = "fr",
  strict: boolean = true
): Promise<PronunciationVerdict> {
  const openRouterKey = process.env.OPENROUTER_API_KEY || "";

  // Evaluate using OpenRouter configured free models
  if (openRouterKey) {
    for (const modelId of OPENROUTER_MODELS) {
      const verdict = await judgeWithOpenRouter(wavBase64, expected, uiLang, strict, modelId, openRouterKey);
      if (verdict !== null) {
        return verdict;
      }
    }
  }

  // Graceful fallback if no model responded
  return {
    heard: false,
    transcript: null,
    correct: false,
    feedback: DEFAULT_FEEDBACK_ERROR[uiLang] || DEFAULT_FEEDBACK_ERROR.fr,
    targetIpa: null
  };
}
