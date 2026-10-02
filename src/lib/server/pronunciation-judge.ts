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
  pt: "Nenhum som claro detectado. Aproxime-se do microfone.",
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

function normalizeSpoken(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[.,!?;:"'()«»“”‘’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesSpoken(heardText: string, expectedText: string): boolean {
  const heard = normalizeSpoken(heardText);
  const want = normalizeSpoken(expectedText);
  if (!heard || !want) return false;
  if (heard === want) return true;
  if (heard.includes(want) || want.includes(heard)) return true;
  const heardTokens = heard.split(" ");
  const wantTokens = want.split(" ");
  return wantTokens.every((w) => heardTokens.includes(w));
}

/**
 * Attempt evaluation using OpenRouter Multimodal Audio Models.
 */
async function judgeWithOpenRouter(
  wavBase64: string,
  expected: string,
  uiLang: string,
  modelId: string,
  apiKey: string
): Promise<PronunciationVerdict | null> {
  const langName = LANGUAGE_NAMES[uiLang] || "French";
  const promptText = `The attached audio is a French learner attempting to say "${expected}".
Their user interface language is ${langName} (${uiLang}).
Listen carefully to the audio clip and respond ONLY with a JSON object in this exact schema:
{
  "heard": boolean (false if silence or only background noise, true if speech is heard),
  "transcript": string or null (phonetic or actual words heard, or "NO_SPEECH" if silent),
  "correct": boolean (true if recognizable attempt at "${expected}", false if wrong word or serious phonetic substitution),
  "feedback": string or null (short, encouraging feedback written entirely in ${langName} (${uiLang}) explaining how to improve if incorrect, or praise in ${langName} if correct),
  "targetIpa": string or null (IPA transcription of "${expected}")
}`;

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
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: promptText },
              {
                type: "input_audio",
                input_audio: {
                  data: wavBase64,
                  format: "wav"
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[openrouter] Model ${modelId} returned ${res.status}: ${errText.slice(0, 150)}`);
      return null;
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const heard = parsed.heard !== false && parsed.transcript !== "NO_SPEECH";
    return {
      heard,
      transcript: heard ? (parsed.transcript || null) : null,
      correct: heard && !!parsed.correct,
      feedback:
        parsed.feedback ||
        (parsed.correct
          ? (DEFAULT_FEEDBACK_CORRECT[uiLang] || DEFAULT_FEEDBACK_CORRECT.fr)
          : parsed.transcript
          ? formatHeardFeedback(parsed.transcript, uiLang)
          : (DEFAULT_FEEDBACK_RETRY[uiLang] || DEFAULT_FEEDBACK_RETRY.fr)),
      targetIpa: parsed.targetIpa || null
    };
  } catch (err: any) {
    console.warn(`[openrouter] Error calling ${modelId}:`, err.message);
    return null;
  }
}

/**
 * Fallback transcription via Groq Whisper when OpenRouter requires account balance.
 */
async function judgeWithGroq(
  wavBase64: string,
  expected: string,
  uiLang: string,
  apiKey: string
): Promise<PronunciationVerdict | null> {
  try {
    const bytes = Buffer.from(wavBase64, "base64");
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: "audio/wav" }), "audio.wav");
    form.append("model", "whisper-large-v3-turbo");
    form.append("language", "fr");
    form.append("prompt", expected);

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form
    });

    if (!res.ok) {
      console.warn(`[groq] Whisper returned ${res.status}`);
      return null;
    }

    const data = (await res.json()) as { text?: string };
    const transcript = (data?.text || "").trim();
    if (!transcript) {
      return {
        heard: false,
        transcript: null,
        correct: false,
        feedback: DEFAULT_FEEDBACK_SILENCE[uiLang] || DEFAULT_FEEDBACK_SILENCE.fr,
        targetIpa: null
      };
    }

    const isCorrect = matchesSpoken(transcript, expected);
    return {
      heard: true,
      transcript,
      correct: isCorrect,
      feedback: isCorrect
        ? (DEFAULT_FEEDBACK_CORRECT[uiLang] || DEFAULT_FEEDBACK_CORRECT.fr)
        : formatHeardFeedback(transcript, uiLang),
      targetIpa: null
    };
  } catch (err: any) {
    console.warn("[groq] Transcribe error:", err.message);
    return null;
  }
}

/**
 * Main pronunciation judgment function with model waterfall:
 * 1. OpenRouter (thinkingmachines/inkling-small:free)
 * 2. OpenRouter (thinkingmachines/inkling:free)
 * 3. OpenRouter (nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free)
 * 4. Groq Whisper (free fallback)
 */
export async function evaluatePronunciation(
  wavBase64: string,
  expected: string,
  uiLang: string = "fr"
): Promise<PronunciationVerdict> {
  const openRouterKey = process.env.OPENROUTER_API_KEY || "";
  const groqKey = process.env.GROQ_API_KEY || "";

  // 1. Try OpenRouter free models in sequence
  if (openRouterKey) {
    for (const modelId of OPENROUTER_MODELS) {
      const verdict = await judgeWithOpenRouter(wavBase64, expected, uiLang, modelId, openRouterKey);
      if (verdict !== null) {
        return verdict;
      }
    }
  }

  // 2. Try Groq Whisper fallback
  if (groqKey) {
    const groqVerdict = await judgeWithGroq(wavBase64, expected, uiLang, groqKey);
    if (groqVerdict !== null) {
      return groqVerdict;
    }
  }

  // 3. Graceful fallback if no external API responded
  return {
    heard: false,
    transcript: null,
    correct: false,
    feedback: DEFAULT_FEEDBACK_ERROR[uiLang] || DEFAULT_FEEDBACK_ERROR.fr,
    targetIpa: null
  };
}
