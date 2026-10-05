import type { AlphabetLetter } from './types';

/**
 * Curated French Alphabet and Contextual Phonics curriculum.
 * Every letter and sound variant has:
 * - Letter name and IPA
 * - Clear contextual pronunciation rule
 * - High quality example words with exact substring highlights, IPA, full UI translations,
 *   and verified photo URLs.
 */
export const FRENCH_ALPHABET_DATA: AlphabetLetter[] = [
  {
    "letter": "A",
    "lower": "a",
    "name": "a",
    "nameIpa": "/a/",
    "category": "vowel",
    "variants": [
      {
        "id": "a-standard",
        "soundIpa": "/a/",
        "soundName": {
          "fr": "A standard (/a/)",
          "en": "Standard A (/a/)",
          "es": "A estándar (/a/)",
          "de": "Standard A (/a/)",
          "it": "A standard (/a/)",
          "pt": "A padrão (/a/)",
          "ar": "صوت A القياسي (/a/)",
          "zh": "标准 A (/a/)",
          "nl": "Standaard A (/a/)",
          "prs": "صوت A معمولی (/a/)",
          "uk": "Стандартний A (/a/)",
          "ps": "معیاري A غږ (/a/)",
          "sq": "A standarde (/a/)",
          "ka": "სტანდარტული A (/a/)"
        },
        "rule": {
          "fr": "Son ouvert et net, produit bouche bien ouverte.",
          "en": "Open and clear vowel sound, pronounced with an open mouth.",
          "es": "Sonido abierto y claro, pronunciado con la boca bien abierta.",
          "de": "Offener und klarer Vokal, mit weit geöffnetem Mund ausgesprochen.",
          "it": "Suono aperto e chiaro, pronunciato con la bocca ben aperta.",
          "pt": "Som aberto e claro, pronunciado com a boca bem aberta.",
          "ar": "صوت حرف علة مفتوح وواضح مع فتح الفم جيداً.",
          "zh": "清晰开阔的元音，张大嘴发音。",
          "nl": "Open en heldere klinker, uitgesproken met open mond.",
          "prs": "صدای باز و شفاف که با دهان کاملاً باز تلفظ می‌شود.",
          "uk": "Відкритий і чистий голосний звук, вимовляється з широко відкритим ротом.",
          "ps": "یو پرانیستی او روښانه غږ چې په بشپړ پرانیستې خوله تلفظ کېږي.",
          "sq": "Tingull i hapur dhe i qartë, shqiptohet me gojën hapur mirë.",
          "ka": "ღია და მკაფიო ხმოვანი, წარმოითქმის კარგად დაღებული პირით."
        },
        "words": [
          {
            "word": "avion",
            "highlight": "a",
            "ipa": "/a.vjɔ̃/",
            "gloss": {
              "en": "airplane",
              "fr": "avion",
              "es": "avión",
              "de": "Flugzeug",
              "it": "aereo",
              "pt": "avião",
              "ar": "طائرة",
              "zh": "飞机",
              "nl": "vliegtuig",
              "prs": "طیاره",
              "uk": "літак",
              "ps": "الوتکه",
              "sq": "aeroplan",
              "ka": "თვითმფრინავი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "arbre",
            "highlight": "a",
            "ipa": "/aʁbʁ/",
            "gloss": {
              "en": "tree",
              "fr": "arbre",
              "es": "árbol",
              "de": "Baum",
              "it": "albero",
              "pt": "árvore",
              "ar": "شجرة",
              "zh": "树",
              "nl": "boom",
              "prs": "درخت",
              "uk": "дерево",
              "ps": "ونه",
              "sq": "pemë",
              "ka": "ხე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "ananas",
            "highlight": "a",
            "ipa": "/a.na.na/",
            "gloss": {
              "en": "pineapple",
              "fr": "ananas",
              "es": "piña",
              "de": "Ananas",
              "it": "ananas",
              "pt": "abacaxi",
              "ar": "أناناس",
              "zh": "菠萝",
              "nl": "ananas",
              "prs": "آناناس",
              "uk": "ананас",
              "ps": "اناناس",
              "sq": "ananas",
              "ka": "ანანასი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "B",
    "lower": "b",
    "name": "bé",
    "nameIpa": "/be/",
    "category": "consonant",
    "variants": [
      {
        "id": "b-standard",
        "soundIpa": "/b/",
        "soundName": {
          "fr": "B bilabial (/b/)",
          "en": "B sound (/b/)",
          "es": "Sonido B (/b/)",
          "de": "B-Laut (/b/)",
          "it": "Suono B (/b/)",
          "pt": "Som B (/b/)",
          "ar": "صوت B الشفوي (/b/)",
          "zh": "双唇音 B (/b/)",
          "nl": "B-klank (/b/)",
          "prs": "صوت B (/b/)",
          "uk": "Звук B (/b/)",
          "ps": "دوه شونډیز B (/b/)",
          "sq": "B bilabiale (/b/)",
          "ka": "ბაგისმიერი B (/b/)"
        },
        "rule": {
          "fr": "Consonne sonore fermée avec les deux lèvres.",
          "en": "Voiced consonant made by closing both lips.",
          "es": "Consonante sonora que se produce juntando ambos labios.",
          "de": "Stimmhafter Konsonant, gebildet mit beiden Lippen.",
          "it": "Consonante sonora prodotta unendo entrambe le labbra.",
          "pt": "Consoante sonora produzida fechando ambos os lábios.",
          "ar": "صوت مجهور ينتج بإطباق الشفتين معاً.",
          "zh": "双唇紧闭发出的浊辅音。",
          "nl": "Stemhebbende medeklinker gevormd door beide lippen te sluiten.",
          "prs": "با بستن هر دو لب و رها کردن سریع همراه با ارتعاش تار‌های صوتی ایجاد می‌شود.",
          "uk": "Губний дзвінкий вибуховий звук, вимовляється обома губами.",
          "ps": "یو غږ لرونکی بند غږ چې د دواړو شونډو په یوځای کولو ویل کېږي.",
          "sq": "Bashkëtingëllore e zëshme e mbyllur me të dyja buzët.",
          "ka": "მჟღერი თანხმოვანი, რომელიც წარმოითქმის ორივე ტუჩის შეერთებით."
        },
        "words": [
          {
            "word": "bateau",
            "highlight": "b",
            "ipa": "/ba.to/",
            "gloss": {
              "en": "boat",
              "fr": "bateau",
              "es": "barco",
              "de": "Boot",
              "it": "barca",
              "pt": "barco",
              "ar": "قارب",
              "zh": "船",
              "nl": "boot",
              "prs": "قایق / کشتی",
              "uk": "човен",
              "ps": "کښتۍ",
              "sq": "varkë / anije",
              "ka": "ნავი / გემი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1546214755-c5d22447b43b?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "banane",
            "highlight": "b",
            "ipa": "/ba.nan/",
            "gloss": {
              "en": "banana",
              "fr": "banane",
              "es": "plátano",
              "de": "Banane",
              "it": "banana",
              "pt": "banana",
              "ar": "موز",
              "zh": "香蕉",
              "nl": "banaan",
              "prs": "کیله (موز)",
              "uk": "банан",
              "ps": "کیله",
              "sq": "banane",
              "ka": "ბანანი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "ballon",
            "highlight": "b",
            "ipa": "/ba.lɔ̃/",
            "gloss": {
              "en": "ball / balloon",
              "fr": "ballon",
              "es": "balón",
              "de": "Ball / Ballon",
              "it": "pallone",
              "pt": "balão",
              "ar": "كرة / بالون",
              "zh": "球 / 气球",
              "nl": "bal / ballon",
              "prs": "توپ / بالون",
              "uk": "м’яч / кулька",
              "ps": "توپ / بالون",
              "sq": "top / balonë",
              "ka": "ბურთი / ბუშტი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "C",
    "lower": "c",
    "name": "cé",
    "nameIpa": "/se/",
    "category": "consonant",
    "variants": [
      {
        "id": "c-soft",
        "soundIpa": "/s/",
        "soundName": {
          "fr": "C doux (/s/)",
          "en": "Soft C (/s/)",
          "es": "C suave (/s/)",
          "de": "Weiches C (/s/)",
          "it": "C dolce (/s/)",
          "pt": "C suave (/s/)",
          "ar": "C اللينة (/s/)",
          "zh": "软 C 读作 (/s/)",
          "nl": "Zachte C (/s/)",
          "prs": "C نرم (/s/)",
          "uk": "М'який C (/s/)",
          "ps": "نرم C (/s/)",
          "sq": "C e butë (/s/)",
          "ka": "რბილი C (/s/)"
        },
        "rule": {
          "fr": "Se prononce /s/ devant les voyelles E, I, Y.",
          "en": "Pronounced /s/ when followed by vowels E, I, Y.",
          "es": "Se pronuncia /s/ delante de las vocales E, I, Y.",
          "de": "Wird vor den Vokalen E, I, Y wie /s/ ausgesprochen.",
          "it": "Si pronuncia /s/ davanti alle vocali E, I, Y.",
          "pt": "Pronuncia-se /s/ antes das vogais E, I, Y.",
          "ar": "تُنطق /s/ قبل حروف العلة E و I و Y.",
          "zh": "在元音 E、I、Y 前发音为 /s/。",
          "nl": "Wordt uitgesproken als /s/ voor de klinkers E, I, Y.",
          "prs": "قبل از حروف صدادار E، I، Y دقیقاً مانند S تلفظ می‌شود.",
          "uk": "Перед голосними E, I, Y вимовляється як /s/.",
          "ps": "د E، I، Y غږلرونکو حروفو مخکې د /s/ غږ کوي.",
          "sq": "Shqiptohet /s/ përpara zanoreve E, I, Y.",
          "ka": "წარმოითქმის როგორც /s/ ხმოვნების E, I, Y წინ."
        },
        "words": [
          {
            "word": "cerise",
            "highlight": "c",
            "ipa": "/sə.ʁiz/",
            "gloss": {
              "en": "cherry",
              "fr": "cerise",
              "es": "cereza",
              "de": "Kirsche",
              "it": "ciliegia",
              "pt": "cereja",
              "ar": "كرز",
              "zh": "樱桃",
              "nl": "kers",
              "prs": "گیلاس",
              "uk": "вишня",
              "ps": "ګیلاس",
              "sq": "qershi",
              "ka": "ალუბალი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1528821154947-1aa3d1b74941?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "citron",
            "highlight": "c",
            "ipa": "/si.tʁɔ̃/",
            "gloss": {
              "en": "lemon",
              "fr": "citron",
              "es": "limón",
              "de": "Zitrone",
              "it": "limone",
              "pt": "limão",
              "ar": "ليمون",
              "zh": "柠檬",
              "nl": "citroen",
              "prs": "لیمو",
              "uk": "лимон",
              "ps": "لیمو",
              "sq": "limon",
              "ka": "ლიმონი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "cygne",
            "highlight": "c",
            "ipa": "/siɲ/",
            "gloss": {
              "en": "swan",
              "fr": "cygne",
              "es": "cisne",
              "de": "Schwan",
              "it": "cigno",
              "pt": "cisne",
              "ar": "بجعة",
              "zh": "天鹅",
              "nl": "zwaan",
              "prs": "قو",
              "uk": "лебідь",
              "ps": "قو",
              "sq": "mjellmë",
              "ka": "გედი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1504804385370-70f5663af917?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        "id": "c-hard",
        "soundIpa": "/k/",
        "soundName": {
          "fr": "C dur (/k/)",
          "en": "Hard C (/k/)",
          "es": "C fuerte (/k/)",
          "de": "Hartes C (/k/)",
          "it": "C dura (/k/)",
          "pt": "C forte (/k/)",
          "ar": "C القوية (/k/)",
          "zh": "硬 C 读作 (/k/)",
          "nl": "Harde C (/k/)",
          "prs": "C سخت (/k/)",
          "uk": "Твердий C (/k/)",
          "ps": "سخت C (/k/)",
          "sq": "C e fortë (/k/)",
          "ka": "მყარი C (/k/)"
        },
        "rule": {
          "fr": "Se prononce /k/ devant A, O, U ou une consonne.",
          "en": "Pronounced /k/ before A, O, U or any consonant.",
          "es": "Se pronuncia /k/ delante de A, O, U o una consonante.",
          "de": "Wird vor A, O, U oder Konsonanten wie /k/ ausgesprochen.",
          "it": "Si pronuncia /k/ davanti ad A, O, U o a una consonante.",
          "pt": "Pronuncia-se /k/ antes de A, O, U ou consoante.",
          "ar": "تُنطق /k/ قبل A أو O أو U أو أي حرف ساكن.",
          "zh": "在 A、O、U 或辅音前发音为 /k/。",
          "nl": "Wordt uitgesproken als /k/ voor A, O, U of een medeklinker.",
          "prs": "قبل از حروف صدادار A، O، U یا در انتهای کلمه مانند K تلفظ می‌شود.",
          "uk": "Перед A, O, U або перед приголосними вимовляється як /k/.",
          "ps": "د A، O، U یا کوم بل بې‌غږه توري مخکې د /k/ غږ کوي.",
          "sq": "Shqiptohet /k/ përpara A, O, U ose një bashkëtingëlloreje.",
          "ka": "წარმოითქმის როგორც /k/ ასოების A, O, U ან თანხმოვნის წინ."
        },
        "words": [
          {
            "word": "café",
            "highlight": "c",
            "ipa": "/ka.fe/",
            "gloss": {
              "en": "coffee",
              "fr": "café",
              "es": "café",
              "de": "Kaffee",
              "it": "caffè",
              "pt": "café",
              "ar": "قهوة",
              "zh": "咖啡",
              "nl": "koffie",
              "prs": "قهوه",
              "uk": "кава",
              "ps": "قهوه",
              "sq": "kafe",
              "ka": "ყავა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "cube",
            "highlight": "c",
            "ipa": "/kyb/",
            "gloss": {
              "en": "cube",
              "fr": "cube",
              "es": "cubo",
              "de": "Würfel",
              "it": "cubo",
              "pt": "cubo",
              "ar": "مكعب",
              "zh": "立方体",
              "nl": "kubus",
              "prs": "مکعب",
              "uk": "куб",
              "ps": "مکعب",
              "sq": "kub",
              "ka": "კუბი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "carotte",
            "highlight": "c",
            "ipa": "/ka.ʁɔt/",
            "gloss": {
              "en": "carrot",
              "fr": "carotte",
              "es": "zanahoria",
              "de": "Karotte",
              "it": "carota",
              "pt": "cenoura",
              "ar": "جزر",
              "zh": "胡萝卜",
              "nl": "wortel",
              "prs": "زردک (هویج)",
              "uk": "морква",
              "ps": "ګازره",
              "sq": "karotë",
              "ka": "სტაფილო"
            },
            "imageUrl": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        "id": "c-cedille",
        "soundIpa": "/s/",
        "soundName": {
          "fr": "Cédille Ç (/s/)",
          "en": "Cedilla Ç (/s/)",
          "es": "Cedilla Ç (/s/)",
          "de": "Cedille Ç (/s/)",
          "it": "Cediglia Ç (/s/)",
          "pt": "Cedilha Ç (/s/)",
          "ar": "الفاصلة السفلية Ç (/s/)",
          "zh": "软音符 Ç (/s/)",
          "nl": "Cedille Ç (/s/)",
          "prs": "Ç با سدیل (/s/)",
          "uk": "Ç із седилем (/s/)",
          "ps": "سیدیلا Ç (/s/)",
          "sq": "Ç me sedilë (/s/)",
          "ka": "სედილიანი Ç (/s/)"
        },
        "rule": {
          "fr": "Avec la cédille, Ç se prononce toujours /s/, même devant A, O, U.",
          "en": "With a cedilla, Ç always makes the /s/ sound, even before A, O, U.",
          "es": "Con cedilla, Ç siempre suena /s/, incluso delante de A, O, U.",
          "de": "Mit Cedille wird Ç immer wie /s/ ausgesprochen, auch vor A, O, U.",
          "it": "Con la cediglia, Ç si pronuncia sempre /s/, anche davanti ad A, O, U.",
          "pt": "Com cedilha, Ç sempre tem som de /s/, mesmo antes de A, O, U.",
          "ar": "مع الفاصلة السفلية تُنطق Ç دائماً /s/ حتى قبل A و O و U.",
          "zh": "带有软音符的 Ç 始终读作 /s/，即使在 A、O、U 前。",
          "nl": "Met een cedille klinkt Ç altijd als /s/, zelfs voor A, O, U.",
          "prs": "علامت زیر Ç همیشه باعث می‌شود قبل از A، O، U صدای /s/ بدهد.",
          "uk": "Значок під Ç завжди змушує його звучати як /s/ навіть перед A, O, U.",
          "ps": "د سیدیلا سره، Ç تل /s/ تلفظ کېږي، حتی د A، O، U مخکې هم.",
          "sq": "Me sedilën, Ç shqiptohet gjithmonë /s/, edhe para A, O, U.",
          "ka": "სედილით Ç ყოველთვის წარმოითქმის როგორც /s/, A, O, U-ს წინაც კი."
        },
        "words": [
          {
            "word": "garçon",
            "highlight": "ç",
            "ipa": "/ɡaʁ.sɔ̃/",
            "gloss": {
              "en": "boy",
              "fr": "garçon",
              "es": "chico",
              "de": "Junge",
              "it": "ragazzo",
              "pt": "menino",
              "ar": "ولد",
              "zh": "男孩",
              "nl": "jongen",
              "prs": "بچه (پسر)",
              "uk": "хлопчик",
              "ps": "هلک",
              "sq": "djalë",
              "ka": "ბიჭი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "français",
            "highlight": "ç",
            "ipa": "/fʁɑ̃.sɛ/",
            "gloss": {
              "en": "French",
              "fr": "français",
              "es": "francés",
              "de": "Französisch",
              "it": "francese",
              "pt": "francês",
              "ar": "فرنسي",
              "zh": "法语",
              "nl": "Frans",
              "prs": "فرانسوی",
              "uk": "французька",
              "ps": "فرانسوي",
              "sq": "frëngjisht",
              "ka": "ფრანგული"
            },
            "imageUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "D",
    "lower": "d",
    "name": "dé",
    "nameIpa": "/de/",
    "category": "consonant",
    "variants": [
      {
        "id": "d-standard",
        "soundIpa": "/d/",
        "soundName": {
          "fr": "D dental (/d/)",
          "en": "D sound (/d/)",
          "es": "Sonido D (/d/)",
          "de": "D-Laut (/d/)",
          "it": "Suono D (/d/)",
          "pt": "Som D (/d/)",
          "ar": "صوت D السني (/d/)",
          "zh": "齿音 D (/d/)",
          "nl": "D-klank (/d/)",
          "prs": "صوت D (/d/)",
          "uk": "Звук D (/d/)",
          "ps": "غاښیز D (/d/)",
          "sq": "D dentale (/d/)",
          "ka": "კბილისმიერი D (/d/)"
        },
        "rule": {
          "fr": "La langue touche la face arrière des dents du haut.",
          "en": "The tongue touches the back of upper teeth.",
          "es": "La lengua toca la parte posterior de los dientes superiores.",
          "de": "Die Zunge berührt die Rückseite der oberen Zähne.",
          "it": "La lingua tocca la parte posteriore dei denti superiori.",
          "pt": "A língua toca a parte de trás dos dentes superiores.",
          "ar": "يلامس اللسان الجزء الخلفي من الأسنان العلوية.",
          "zh": "舌尖轻触上齿背发出清晰浊音。",
          "nl": "De tong raakt de achterkant van de boventanden.",
          "prs": "نوک زبان پشت دندان‌های بالا قرار می‌گیرد و با صدا رها می‌شود.",
          "uk": "Дзвінкий звук, кінчик язика торкається верхніх зубів.",
          "ps": "د ژبې سر د پورتنیو غاښونو شاته لګېږي.",
          "sq": "Maja e gjuhës prek pjesën e pasme të dhëmbëve të sipërm.",
          "ka": "ენის წვერი ეხება ზედა კბილების უკანა მხარეს."
        },
        "words": [
          {
            "word": "dauphin",
            "highlight": "d",
            "ipa": "/do.fɛ̃/",
            "gloss": {
              "en": "dolphin",
              "fr": "dauphin",
              "es": "delfín",
              "de": "Delfin",
              "it": "delfino",
              "pt": "golfinho",
              "ar": "دلفين",
              "zh": "海豚",
              "nl": "dolfijn",
              "prs": "دلفین",
              "uk": "дельфін",
              "ps": "ډولفین",
              "sq": "delfin",
              "ka": "დელფინი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "doigt",
            "highlight": "d",
            "ipa": "/dwa/",
            "gloss": {
              "en": "finger",
              "fr": "doigt",
              "es": "dedo",
              "de": "Finger",
              "it": "dito",
              "pt": "dedo",
              "ar": "إصبع",
              "zh": "手指",
              "nl": "vinger",
              "prs": "انگشت",
              "uk": "палець",
              "ps": "ګوته",
              "sq": "gisht",
              "ka": "თითი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1520006507663-f34ed4a17b4c?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "dent",
            "highlight": "d",
            "ipa": "/dɑ̃/",
            "gloss": {
              "en": "tooth",
              "fr": "dent",
              "es": "diente",
              "de": "Zahn",
              "it": "dente",
              "pt": "dente",
              "ar": "سن",
              "zh": "牙齿",
              "nl": "tand",
              "prs": "دندان",
              "uk": "зуб",
              "ps": "غاښ",
              "sq": "dhëmb",
              "ka": "კბილი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "E",
    "lower": "e",
    "name": "e",
    "nameIpa": "/ə/",
    "category": "vowel",
    "variants": [
      {
        "id": "e-aigu",
        "soundIpa": "/e/",
        "soundName": {
          "fr": "É fermé (/e/)",
          "en": "Closed É (/e/)",
          "es": "É cerrada (/e/)",
          "de": "Geschlossenes É (/e/)",
          "it": "É chiusa (/e/)",
          "pt": "É fechado (/e/)",
          "ar": "É المغلقة (/e/)",
          "zh": "闭口 É (/e/)",
          "nl": "Gesloten É (/e/)",
          "prs": "É با اکسان اگو (/e/)",
          "uk": "É закритий (/e/)",
          "ps": "تړلی É (/e/)",
          "sq": "É e mbyllur (/e/)",
          "ka": "დახურული É (/e/)"
        },
        "rule": {
          "fr": "Accent aigu : bouche souriante, son fermé et énergique.",
          "en": "Acute accent: smiling lips, closed and bright vowel sound.",
          "es": "Acento agudo: boca sonriente, sonido cerrado y enérgico.",
          "de": "Akut-Akzent: Mund wie beim Lächeln, geschlossener Vokal.",
          "it": "Accento acuto: labbra allungate, suono chiuso e brillante.",
          "pt": "Acento agudo: lábios sorridentes, som fechado e brilhante.",
          "ar": "حرف E مع النبرة الحادة (aigu): شفاه متبسمة وصوت مغلق ومشرق.",
          "zh": "尖音符 É：嘴角像微笑般拉开，发出闭口音。",
          "nl": "Accent aigu: glimlachende mond, gesloten en heldere klank.",
          "prs": "صدای «اِ» بسته و کوتاه، با لب‌های کشیده مانند حالت لبخند.",
          "uk": "Закритий і чіткий звук, губи розтягнуті в легкій усмішці.",
          "ps": "تېز اکسیان: په موسکا شونډو، تړل شوی او ځواکمن غږ.",
          "sq": "Theksi akut: buzë të qeshura, tingull i mbyllur dhe energjik.",
          "ka": "მახვილით (accent aigu): მომღიმარი ტუჩები, დახურული და ენერგიული ბგერა."
        },
        "words": [
          {
            "word": "étoile",
            "highlight": "é",
            "ipa": "/e.twal/",
            "gloss": {
              "en": "star",
              "fr": "étoile",
              "es": "estrella",
              "de": "Stern",
              "it": "stella",
              "pt": "estrela",
              "ar": "نجم",
              "zh": "星星",
              "nl": "ster",
              "prs": "ستاره",
              "uk": "зірка",
              "ps": "ستوری",
              "sq": "yll",
              "ka": "ვარსკვლავი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1547521420-4328f6f9b272?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "éléphant",
            "highlight": "é",
            "ipa": "/e.le.fɑ̃/",
            "gloss": {
              "en": "elephant",
              "fr": "éléphant",
              "es": "elefante",
              "de": "Elefant",
              "it": "elefante",
              "pt": "elefante",
              "ar": "فيل",
              "zh": "大象",
              "nl": "olifant",
              "prs": "فیل",
              "uk": "слон",
              "ps": "فیل",
              "sq": "elefant",
              "ka": "სპილო"
            },
            "imageUrl": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "école",
            "highlight": "é",
            "ipa": "/e.kɔl/",
            "gloss": {
              "en": "school",
              "fr": "école",
              "es": "escuela",
              "de": "Schule",
              "it": "scuola",
              "pt": "escola",
              "ar": "مدرسة",
              "zh": "学校",
              "nl": "school",
              "prs": "مکتب (مدرسه)",
              "uk": "школа",
              "ps": "ښوونځی",
              "sq": "shkollë",
              "ka": "სკოლა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        "id": "e-grave",
        "soundIpa": "/ɛ/",
        "soundName": {
          "fr": "È / Ê ouvert (/ɛ/)",
          "en": "Open È / Ê (/ɛ/)",
          "es": "È / Ê abierta (/ɛ/)",
          "de": "Offenes È / Ê (/ɛ/)",
          "it": "È / Ê aperta (/ɛ/)",
          "pt": "È / Ê aberto (/ɛ/)",
          "ar": "È / Ê المفتوحة (/ɛ/)",
          "zh": "开口 È / Ê (/ɛ/)",
          "nl": "Open È / Ê (/ɛ/)",
          "prs": "È / Ê باز (/ɛ/)",
          "uk": "È / Ê відкритий (/ɛ/)",
          "ps": "پرانیستی È / Ê (/ɛ/)",
          "sq": "È / Ê e hapur (/ɛ/)",
          "ka": "ღია È / Ê (/ɛ/)"
        },
        "rule": {
          "fr": "Accent grave ou circonflexe : son ouvert, bouche relâchée.",
          "en": "Grave or circumflex: open vowel sound with relaxed jaw.",
          "es": "Acento grave o circunflejo: sonido abierto, mandíbula relajada.",
          "de": "Gravis oder Zirkumflex: offener Vokal mit entspanntem Kiefer.",
          "it": "Accento grave o circonflesso: suono aperto, mascella rilassata.",
          "pt": "Acento grave ou circunflexo: som aberto com mandíbula relaxada.",
          "ar": "النبرة الهابطة أو الدائرية: صوت علة مفتوح مع استرخاء الفك.",
          "zh": "钝音符或折音符：下巴放松发出开口元音。",
          "nl": "Grave of circumflex: open klank met ontspannen kaak.",
          "prs": "صدای «اِ» بازتر با پایین آوردن ملایم فک.",
          "uk": "Відкритий звук /ɛ/, щелепа трохи опущена.",
          "ps": "ګراو یا سیرکونفلیکس اکسیان: پرانیستی غږ، ارامه خوله.",
          "sq": "Theks i rëndë ose cirkumfleks: tingull i hapur, gojë e relaksuar.",
          "ka": "ღია ბგერა, თავისუფალი და მოშვებული პირით."
        },
        "words": [
          {
            "word": "zèbre",
            "highlight": "è",
            "ipa": "/zɛbʁ/",
            "gloss": {
              "en": "zebra",
              "fr": "zèbre",
              "es": "cebra",
              "de": "Zebra",
              "it": "zebra",
              "pt": "zebra",
              "ar": "حمار وحشي",
              "zh": "斑马",
              "nl": "zebra",
              "prs": "گورخر",
              "uk": "зебра",
              "ps": "زیبرا",
              "sq": "sebrë",
              "ka": "ზებრა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1501706362039-c06b2d715385?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "fenêtre",
            "highlight": "ê",
            "ipa": "/fə.nɛtʁ/",
            "gloss": {
              "en": "window",
              "fr": "fenêtre",
              "es": "ventana",
              "de": "Fenster",
              "it": "finestra",
              "pt": "janela",
              "ar": "نافذة",
              "zh": "窗户",
              "nl": "raam",
              "prs": "کلکین (پنجره)",
              "uk": "вікно",
              "ps": "کړکۍ",
              "sq": "dritare",
              "ka": "ფანჯარა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "fête",
            "highlight": "ê",
            "ipa": "/fɛt/",
            "gloss": {
              "en": "party / celebration",
              "fr": "fête",
              "es": "fiesta",
              "de": "Feier / Fest",
              "it": "festa",
              "pt": "festa",
              "ar": "حفلة",
              "zh": "节日 / 派对",
              "nl": "feest",
              "prs": "جشن",
              "uk": "свято",
              "ps": "جشن / مېله",
              "sq": "festë",
              "ka": "დღესასწაული"
            },
            "imageUrl": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        "id": "e-caduc",
        "soundIpa": "/ə/",
        "soundName": {
          "fr": "E muet / caduc (/ə/)",
          "en": "Mute / Silent E (/ə/)",
          "es": "E muda / caduca (/ə/)",
          "de": "Schwa / Stummes E (/ə/)",
          "it": "E muta / debole (/ə/)",
          "pt": "E mudo / fraco (/ə/)",
          "ar": "E الصامتة أو الضعيفة (/ə/)",
          "zh": "弱化或不发音的 E (/ə/)",
          "nl": "Doffe / Stomme E (/ə/)",
          "prs": "E بی‌صدا یا کوتاه (/ə/)",
          "uk": "E німий або слабкий (/ə/)",
          "ps": "خاموش E (/ə/)",
          "sq": "E pa zë / e rënë (/ə/)",
          "ka": "ყრუ E (/ə/)"
        },
        "rule": {
          "fr": "Souvent discret en milieu de mot (cheval) et muet en fin de mot (table).",
          "en": "Subtle inside a word (cheval) and completely silent at word endings (table).",
          "es": "Sutil dentro de la palabra (cheval) y totalmente mudo al final (table).",
          "de": "Schwach im Wortinneren (cheval) und am Wortende stumm (table).",
          "it": "Discreto all'interno della parola (cheval) e muto alla fine (table).",
          "pt": "Discreto no meio da palavra (cheval) e mudo no fim (table).",
          "ar": "خفيف في وسط الكلمة (cheval) وصامت تماماً في نهاية الكلمة (table).",
          "zh": "在词中弱化发音，词尾通常完全不发音。",
          "nl": "Zacht binnen een woord en vaak stom aan het einde.",
          "prs": "در انتهای کلمات معمولاً ناخوانا و ساکت است.",
          "uk": "У кінці слів зазвичай не читається, у середині — слабкий звук /ə/.",
          "ps": "د کلمې په منځ کې ډېر نرم اورېدل کېږي او د کلمې په پای کې بې غږه وي.",
          "sq": "Shpesh diskrete në mes të fjalës dhe pa zë në fund të fjalës.",
          "ka": "სიტყვის შუაში ხშირად შეუმჩნეველია, ხოლო სიტყვის ბოლოს არ გამოითქმის."
        },
        "words": [
          {
            "word": "cheval",
            "highlight": "e",
            "ipa": "/ʃə.val/",
            "gloss": {
              "en": "horse",
              "fr": "cheval",
              "es": "caballo",
              "de": "Pferd",
              "it": "cavallo",
              "pt": "cavalo",
              "ar": "حصان",
              "zh": "马",
              "nl": "paard",
              "prs": "اسپ",
              "uk": "кінь",
              "ps": "آس",
              "sq": "kalë",
              "ka": "ცხენი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "table",
            "highlight": "e",
            "ipa": "/tabl/",
            "gloss": {
              "en": "table (final E is silent)",
              "fr": "table (E final muet)",
              "es": "mesa (E final muda)",
              "de": "Tisch (E am Ende stumm)",
              "it": "tavolo (E finale muta)",
              "pt": "mesa (E final mudo)",
              "ar": "طاولة (حرف E الأخير صامت)",
              "zh": "桌子（结尾 E 不发音）",
              "nl": "tafel (einde E is stom)",
              "prs": "میز",
              "uk": "стіл",
              "ps": "مېز",
              "sq": "tavolinë",
              "ka": "მაგიდა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "F",
    "lower": "f",
    "name": "effe",
    "nameIpa": "/ɛf/",
    "category": "consonant",
    "variants": [
      {
        "id": "f-standard",
        "soundIpa": "/f/",
        "soundName": {
          "fr": "F fricatif (/f/)",
          "en": "F sound (/f/)",
          "es": "Sonido F (/f/)",
          "de": "F-Laut (/f/)",
          "it": "Suono F (/f/)",
          "pt": "Som F (/f/)",
          "ar": "صوت F الاحتكاكي (/f/)",
          "zh": "唇齿摩擦音 F (/f/)",
          "nl": "F-klank (/f/)",
          "prs": "صوت F (/f/)",
          "uk": "Звук F (/f/)",
          "ps": "اصطکاکي F (/f/)",
          "sq": "F fërkuese (/f/)",
          "ka": "ნაპრალოვანი F (/f/)"
        },
        "rule": {
          "fr": "Les dents du haut se posent sur la lèvre inférieure.",
          "en": "Upper teeth rest against the bottom lip.",
          "es": "Los dientes superiores se apoyan en el labio inferior.",
          "de": "Die oberen Zähne berühren die Unterlippe.",
          "it": "I denti superiori si appoggiano sul labbro inferiore.",
          "pt": "Os dentes superiores apoiam-se no lábio inferior.",
          "ar": "تستند الأسنان العلوية على الشفة السفلية.",
          "zh": "上齿触碰下唇发出摩擦音。",
          "nl": "De boventanden rusten op de onderlip.",
          "prs": "دندان‌های بالا روی لب پایین قرار می‌گیرند و هوا خارج می‌شود.",
          "uk": "Глухий звук, верхні зуби торкаються нижньої губи.",
          "ps": "پورتني غاښونه په لاندنۍ شونډه اېښودل کېږي.",
          "sq": "Dhëmbët e sipërm vendosen mbi buzën e poshtme.",
          "ka": "ზედა კბილები ედება ქვედა ტუჩს."
        },
        "words": [
          {
            "word": "fleur",
            "highlight": "f",
            "ipa": "/flœʁ/",
            "gloss": {
              "en": "flower",
              "fr": "fleur",
              "es": "flor",
              "de": "Blume",
              "it": "fiore",
              "pt": "flor",
              "ar": "زهرة",
              "zh": "花",
              "nl": "bloem",
              "prs": "گل",
              "uk": "квітка",
              "ps": "ګل",
              "sq": "lule",
              "ka": "ყვავილი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "fromage",
            "highlight": "f",
            "ipa": "/fʁɔ.maʒ/",
            "gloss": {
              "en": "cheese",
              "fr": "fromage",
              "es": "queso",
              "de": "Käse",
              "it": "formaggio",
              "pt": "queijo",
              "ar": "جبن",
              "zh": "奶酪",
              "nl": "kaas",
              "prs": "پنیر",
              "uk": "сир",
              "ps": "پنیر",
              "sq": "djathë",
              "ka": "ყველი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "forêt",
            "highlight": "f",
            "ipa": "/fɔ.ʁɛ/",
            "gloss": {
              "en": "forest",
              "fr": "forêt",
              "es": "bosque",
              "de": "Wald",
              "it": "foresta",
              "pt": "floresta",
              "ar": "غابة",
              "zh": "森林",
              "nl": "bos",
              "prs": "جنگل",
              "uk": "ліс",
              "ps": "ځنګل",
              "sq": "pyll",
              "ka": "ტყე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "G",
    "lower": "g",
    "name": "gé",
    "nameIpa": "/ʒe/",
    "category": "consonant",
    "variants": [
      {
        "id": "g-soft",
        "soundIpa": "/ʒ/",
        "soundName": {
          "fr": "G doux (/ʒ/)",
          "en": "Soft G (/ʒ/)",
          "es": "G suave (/ʒ/)",
          "de": "Weiches G (/ʒ/)",
          "it": "G dolce (/ʒ/)",
          "pt": "G suave (/ʒ/)",
          "ar": "G اللينة (/ʒ/)",
          "zh": "软 G 读作 (/ʒ/)",
          "nl": "Zachte G (/ʒ/)",
          "prs": "G نرم (/ʒ/)",
          "uk": "М'який G (/ʒ/)",
          "ps": "نرم G (/ʒ/)",
          "sq": "G e butë (/ʒ/)",
          "ka": "რბილი G (/ʒ/)"
        },
        "rule": {
          "fr": "Se prononce /ʒ/ (comme un \"j\") devant les voyelles E, I, Y.",
          "en": "Pronounced /ʒ/ (like French \"j\") when followed by E, I, Y.",
          "es": "Se pronuncia /ʒ/ (como una \"j\" francesa) delante de E, I, Y.",
          "de": "Wird vor E, I, Y wie /ʒ/ (französisches \"j\") ausgesprochen.",
          "it": "Si pronuncia /ʒ/ (come \"j\") davanti ad E, I, Y.",
          "pt": "Pronuncia-se /ʒ/ antes de E, I, Y.",
          "ar": "تُنطق /ʒ/ (مثل حرف J) قبل E و I و Y.",
          "zh": "在元音 E、I、Y 前发音为 /ʒ/。",
          "nl": "Klinkt als /ʒ/ voor E, I, Y.",
          "prs": "قبل از حروف E، I، Y مانند «ژ» تلفظ می‌شود.",
          "uk": "Перед E, I, Y вимовляється як м'який звук /ʒ/ (як ж).",
          "ps": "د E، I، Y غږلرونکو حروفو مخکې د /ʒ/ (ژ) غږ کوي.",
          "sq": "Shqiptohet /ʒ/ (si \"zh\") përpara zanoreve E, I, Y.",
          "ka": "წარმოითქმის როგორც /ʒ/ (ჟ) ასოების E, I, Y წინ."
        },
        "words": [
          {
            "word": "girafe",
            "highlight": "g",
            "ipa": "/ʒi.ʁaf/",
            "gloss": {
              "en": "giraffe",
              "fr": "girafe",
              "es": "jirafa",
              "de": "Giraffe",
              "it": "giraffa",
              "pt": "girafa",
              "ar": "زرافة",
              "zh": "长颈鹿",
              "nl": "giraffe",
              "prs": "زرافه",
              "uk": "жираф",
              "ps": "زرافه",
              "sq": "xhirafë",
              "ka": "ჟირაფი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "genou",
            "highlight": "g",
            "ipa": "/ʒə.nu/",
            "gloss": {
              "en": "knee",
              "fr": "genou",
              "es": "rodilla",
              "de": "Knie",
              "it": "ginocchio",
              "pt": "joelho",
              "ar": "ركبة",
              "zh": "膝盖",
              "nl": "knie",
              "prs": "زانو",
              "uk": "коліно",
              "ps": "زنګون",
              "sq": "gju",
              "ka": "მუხლი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1782766835676-11f373bc5c45?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "orange",
            "highlight": "g",
            "ipa": "/ɔ.ʁɑ̃ʒ/",
            "gloss": {
              "en": "orange",
              "fr": "orange",
              "es": "naranja",
              "de": "Orange",
              "it": "arancia",
              "pt": "laranja",
              "ar": "برتقال",
              "zh": "橙子",
              "nl": "sinaasappel",
              "prs": "مالته (پرتقال)",
              "uk": "апельсин",
              "ps": "مالټه",
              "sq": "portokall",
              "ka": "ფორთოხალი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        "id": "g-hard",
        "soundIpa": "/g/",
        "soundName": {
          "fr": "G dur (/ɡ/)",
          "en": "Hard G (/ɡ/)",
          "es": "G fuerte (/ɡ/)",
          "de": "Hartes G (/ɡ/)",
          "it": "G dura (/ɡ/)",
          "pt": "G forte (/ɡ/)",
          "ar": "G القوية (/ɡ/)",
          "zh": "硬 G 读作 (/ɡ/)",
          "nl": "Harde G (/ɡ/)",
          "prs": "G سخت (/g/)",
          "uk": "Твердий G (/g/)",
          "ps": "سخت G (/ɡ/)",
          "sq": "G e fortë (/ɡ/)",
          "ka": "მყარი G (/ɡ/)"
        },
        "rule": {
          "fr": "Se prononce /ɡ/ devant A, O, U ou une consonne (ou gu-).",
          "en": "Pronounced /ɡ/ before A, O, U, consonants, or in \"gu-\".",
          "es": "Se pronuncia /ɡ/ delante de A, O, U, consonantes o en \"gu-\".",
          "de": "Wird vor A, O, U, Konsonanten oder in \"gu-\" wie /ɡ/ ausgesprochen.",
          "it": "Si pronuncia /ɡ/ davanti ad A, O, U, consonanti o in \"gu-\".",
          "pt": "Pronuncia-se /ɡ/ antes de A, O, U, consoantes ou \"gu-\".",
          "ar": "تُنطق /ɡ/ قبل A و O و U أو أي حرف ساكن.",
          "zh": "在 A、O、U 或辅音前发硬音 /ɡ/。",
          "nl": "Klinkt als /ɡ/ voor A, O, U of medeklinkers.",
          "prs": "قبل از A، O، U مانند «گ» تلفظ می‌شود.",
          "uk": "Перед A, O, U або приголосними вимовляється твердо як /g/.",
          "ps": "د A، O، U یا کوم بې‌غږه توري مخکې د /ɡ/ (ګ) غږ کوي.",
          "sq": "Shqiptohet /ɡ/ përpara A, O, U ose një bashkëtingëlloreje.",
          "ka": "წარმოითქმის როგორც /ɡ/ (გ) ასოების A, O, U ან თანხმოვნის წინ."
        },
        "words": [
          {
            "word": "gare",
            "highlight": "g",
            "ipa": "/ɡaʁ/",
            "gloss": {
              "en": "train station",
              "fr": "gare",
              "es": "estación",
              "de": "Bahnhof",
              "it": "stazione",
              "pt": "estação",
              "ar": "محطة قطار",
              "zh": "火车站",
              "nl": "station",
              "prs": "ایستگاه قطار",
              "uk": "вокзал",
              "ps": "د ریل تمځای",
              "sq": "stacion treni",
              "ka": "რკინიგზის სადგური"
            },
            "imageUrl": "https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "gâteau",
            "highlight": "g",
            "ipa": "/ɡa.to/",
            "gloss": {
              "en": "cake",
              "fr": "gâteau",
              "es": "pastel",
              "de": "Kuchen",
              "it": "torta",
              "pt": "bolo",
              "ar": "كعكة",
              "zh": "蛋糕",
              "nl": "taart",
              "prs": "کیک",
              "uk": "торт",
              "ps": "کیک",
              "sq": "tortë / kek",
              "ka": "ნამცხვარი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "guitare",
            "highlight": "gu",
            "ipa": "/ɡi.taʁ/",
            "gloss": {
              "en": "guitar",
              "fr": "guitare",
              "es": "guitarra",
              "de": "Gitarre",
              "it": "chitarra",
              "pt": "violão",
              "ar": "غيتار",
              "zh": "吉他",
              "nl": "gitaar",
              "prs": "گیتار",
              "uk": "гітара",
              "ps": "ګیتار",
              "sq": "kitarë",
              "ka": "გიტარა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        "id": "g-gn",
        "soundIpa": "/ɲ/",
        "soundName": {
          "fr": "GN nasalisé (/ɲ/)",
          "en": "GN sound (/ɲ/)",
          "es": "Sonido GN (/ɲ/)",
          "de": "GN-Laut (/ɲ/)",
          "it": "Suono GN (/ɲ/)",
          "pt": "Som GN (/ɲ/)",
          "ar": "صوت GN الأنفي (/ɲ/)",
          "zh": "鼻音 GN (/ɲ/)",
          "nl": "GN-klank (/ɲ/)",
          "prs": "GN صدادار (/ɲ/)",
          "uk": "Звук GN (/ɲ/)",
          "ps": "پوزیز GN (/ɲ/)",
          "sq": "GN hundore (/ɲ/)",
          "ka": "ცხვირისმიერი GN (/ɲ/)"
        },
        "rule": {
          "fr": "La combinaison GN produit le son /ɲ/ (comme le \"ñ\" espagnol).",
          "en": "The combination GN produces /ɲ/ (like Spanish \"ñ\" or Italian \"gn\").",
          "es": "La combinación GN produce el sonido /ɲ/ (como la \"ñ\").",
          "de": "Die Kombination GN klingt wie /ɲ/ (wie spanisches \"ñ\").",
          "it": "La combinazione GN produce il suono /ɲ/ (come \"gn\" in gnomo).",
          "pt": "A combinação GN produz o som /ɲ/ (como \"nh\").",
          "ar": "يُنتج الحرفان GN معاً الصوت /ɲ/ (شبيهاً بـ ñ).",
          "zh": "组合 GN 发音如同西班牙语 ñ 或意大利语 gn (/ɲ/)。",
          "nl": "De combinatie GN klinkt als /ɲ/ (als Spaanse ñ).",
          "prs": "ترکیب GN مانند «نی» نرم و تودماغی تلفظ می‌شود.",
          "uk": "Буквосполучення GN читається як м'яке нь (/ɲ/).",
          "ps": "د GN ترکیب د /ɲ/ غږ جوړوي (لکه \"نی\").",
          "sq": "Kombinimi GN prodhon tingullin /ɲ/ (si \"nj\").",
          "ka": "GN კომბინაცია წარმოქმნის /ɲ/ ბგერას (როგორც რბილი \"ნი\")."
        },
        "words": [
          {
            "word": "montagne",
            "highlight": "gn",
            "ipa": "/mɔ̃.taɲ/",
            "gloss": {
              "en": "mountain",
              "fr": "montagne",
              "es": "montaña",
              "de": "Berg",
              "it": "montagna",
              "pt": "montanha",
              "ar": "جبل",
              "zh": "山",
              "nl": "berg",
              "prs": "کوه",
              "uk": "гора",
              "ps": "غر",
              "sq": "mal",
              "ka": "მთა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "champignon",
            "highlight": "gn",
            "ipa": "/ʃɑ̃.pi.ɲɔ̃/",
            "gloss": {
              "en": "mushroom",
              "fr": "champignon",
              "es": "champiñón",
              "de": "Pilz",
              "it": "fungo",
              "pt": "cogumelo",
              "ar": "فطر",
              "zh": "蘑菇",
              "nl": "paddenstoel",
              "prs": "سمارق (قارچ)",
              "uk": "гриб",
              "ps": "مرخیړی",
              "sq": "kërpudhë",
              "ka": "სოკო"
            },
            "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "H",
    "lower": "h",
    "name": "hache",
    "nameIpa": "/aʃ/",
    "category": "consonant",
    "variants": [
      {
        "id": "h-silent",
        "soundIpa": "Ø",
        "soundName": {
          "fr": "H muet (silencieux)",
          "en": "Silent H",
          "es": "H muda",
          "de": "Stummes H",
          "it": "H muta",
          "pt": "H mudo",
          "ar": "H الصامتة",
          "zh": "不发音的 H",
          "nl": "Stomme H",
          "prs": "H ناخوانا (ساکت)",
          "uk": "H німий (без звуку)",
          "ps": "بې غږه H (خاموش)",
          "sq": "H pa zë (e heshtur)",
          "ka": "მუნჯი H (გამოუთქმელი)"
        },
        "rule": {
          "fr": "En français, le H ne se prononce jamais seul (l'homme, un hôpital).",
          "en": "In French, H is never pronounced as an aspirated breath (l'homme, un hôpital).",
          "es": "En francés, la H nunca se pronuncia (l'homme, un hôpital).",
          "de": "Im Französischen wird das H nie gehaucht gesprochen (l'homme).",
          "it": "In francese l'H non si pronuncia mai (l'homme).",
          "pt": "Em francês, o H nunca é pronunciado (l'homme).",
          "ar": "في الفرنسية، لا يُنطق حرف H إطلاقاً (l'homme).",
          "zh": "法语中的 H 从不独立发音，完全静音。",
          "nl": "In het Frans wordt de H nooit uitgesproken.",
          "prs": "حرف H در زبان فرانسوی هیچ‌وقت تلفظ نمی‌شود.",
          "uk": "У французькій мові літера H ніколи не вимовляється.",
          "ps": "په فرانسوي کې، H هیڅکله یوازې نه تلفظ کېږي.",
          "sq": "Në frëngjisht, H nuk shqiptohet kurrë vetëm.",
          "ka": "ფრანგულში H არასოდეს გამოითქმის."
        },
        "words": [
          {
            "word": "homme",
            "highlight": "h",
            "ipa": "/ɔm/",
            "gloss": {
              "en": "man",
              "fr": "homme",
              "es": "hombre",
              "de": "Mann",
              "it": "uomo",
              "pt": "homem",
              "ar": "رجل",
              "zh": "男人",
              "nl": "man",
              "prs": "مرد",
              "uk": "чоловік",
              "ps": "سړی",
              "sq": "burrë",
              "ka": "კაცი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "hélicoptère",
            "highlight": "h",
            "ipa": "/e.li.kɔp.tɛʁ/",
            "gloss": {
              "en": "helicopter",
              "fr": "hélicoptère",
              "es": "helicóptero",
              "de": "Hubschrauber",
              "it": "elicottero",
              "pt": "helicóptero",
              "ar": "مروحية",
              "zh": "直升机",
              "nl": "helikopter",
              "prs": "هلیکوپتر",
              "uk": "гелікоптер",
              "ps": "ورزشپره (هلیکوپتر)",
              "sq": "helikopter",
              "ka": "ვერტმფრენი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1557818673-effec50525e1?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "hibou",
            "highlight": "h",
            "ipa": "/i.bu/",
            "gloss": {
              "en": "owl",
              "fr": "hibou",
              "es": "búho",
              "de": "Eule",
              "it": "gufo",
              "pt": "coruja",
              "ar": "بومة",
              "zh": "猫头鹰",
              "nl": "uil",
              "prs": "بوم",
              "uk": "сова",
              "ps": "بوم",
              "sq": "buf",
              "ka": "ბუ"
            },
            "imageUrl": "https://images.unsplash.com/photo-1553383086-22402abaa93a?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "I",
    "lower": "i",
    "name": "i",
    "nameIpa": "/i/",
    "category": "vowel",
    "variants": [
      {
        "id": "i-standard",
        "soundIpa": "/i/",
        "soundName": {
          "fr": "I tendu (/i/)",
          "en": "I sound (/i/)",
          "es": "Sonido I (/i/)",
          "de": "I-Laut (/i/)",
          "it": "Suono I (/i/)",
          "pt": "Som I (/i/)",
          "ar": "صوت I الحاد (/i/)",
          "zh": "清晰 I (/i/)",
          "nl": "I-klank (/i/)",
          "prs": "صوت I (/i/)",
          "uk": "Звук I (/i/)",
          "ps": "کش شوی I (/i/)",
          "sq": "I e tendosur (/i/)",
          "ka": "დაძაბული I (/i/)"
        },
        "rule": {
          "fr": "Son aigu et très tendu, les coins des lèvres bien tirés en arrière.",
          "en": "High and tense vowel, lips pulled back like smiling.",
          "es": "Sonido agudo y tenso, labios estirados hacia atrás.",
          "de": "Heller und gespannter Vokal, Lippen wie beim Lächeln.",
          "it": "Suono acuto e teso, con le labbra ben tirate indietro.",
          "pt": "Som agudo e tenso, com lábios esticados.",
          "ar": "صوت حاد وضيق مع سحب زوايا الشفاه للخلف كالمبتسم.",
          "zh": "高而紧的元音，嘴角向后拉起。",
          "nl": "Hoge en strakke klinker, lippen naar achteren getrokken.",
          "prs": "صدای «ای» واضح و لبخندزده.",
          "uk": "Чистий і чіткий голосний /i/, куточки рота розтягнуті.",
          "ps": "یو لوړ او کش شوی غږ، چې د شونډو کونجونه شاته کش کېږي.",
          "sq": "Tingull i mprehtë dhe i tendosur, cepat e buzëve të tërhequra prapa.",
          "ka": "მაღალი და დაძაბული ბგერა, ტუჩის კუთხეები უკანაა გაწეული."
        },
        "words": [
          {
            "word": "igloo",
            "highlight": "i",
            "ipa": "/i.ɡlu/",
            "gloss": {
              "en": "igloo",
              "fr": "igloo",
              "es": "iglú",
              "de": "Iglu",
              "it": "igloo",
              "pt": "iglú",
              "ar": "كوخ إسكيمو",
              "zh": "雪屋",
              "nl": "iglo",
              "prs": "ایگلو (خانه یخی)",
              "uk": "іглу",
              "ps": "ایګلو",
              "sq": "iglu",
              "ka": "იგლუ"
            },
            "imageUrl": "https://images.unsplash.com/photo-1548278651-843b1d7431a9?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "île",
            "highlight": "î",
            "ipa": "/il/",
            "gloss": {
              "en": "island",
              "fr": "île",
              "es": "isla",
              "de": "Insel",
              "it": "isola",
              "pt": "ilha",
              "ar": "جزيرة",
              "zh": "岛屿",
              "nl": "eiland",
              "prs": "جزیره",
              "uk": "острів",
              "ps": "ټاپو",
              "sq": "ishull",
              "ka": "კუნძული"
            },
            "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "image",
            "highlight": "i",
            "ipa": "/i.maʒ/",
            "gloss": {
              "en": "picture / image",
              "fr": "image",
              "es": "imagen",
              "de": "Bild",
              "it": "immagine",
              "pt": "imagem",
              "ar": "صورة",
              "zh": "图片",
              "nl": "afbeelding",
              "prs": "تصویر",
              "uk": "зображення",
              "ps": "انځور",
              "sq": "figurë / imazh",
              "ka": "სურათი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1530634962287-1aa57a5e70fe?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "midi",
            "highlight": "i",
            "ipa": "/mi.di/",
            "gloss": {
              "en": "midday / noon",
              "fr": "midi",
              "es": "mediodía",
              "de": "Mittag",
              "it": "mezzogiorno",
              "pt": "meio-dia",
              "ar": "منتصف النهار / ظهر",
              "zh": "中午",
              "nl": "middag",
              "prs": "ظهر",
              "uk": "полудень",
              "ps": "غرمه",
              "sq": "mesditë",
              "ka": "შუადღე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "chimie",
            "highlight": "i",
            "ipa": "/ʃi.mi/",
            "gloss": {
              "en": "chemistry",
              "fr": "chimie",
              "es": "química",
              "de": "Chemie",
              "it": "chimica",
              "pt": "química",
              "ar": "كيمياء",
              "zh": "化学",
              "nl": "chemie",
              "prs": "کیمیا",
              "uk": "хімія",
              "ps": "کیمیا",
              "sq": "kimi",
              "ka": "ქიმია"
            },
            "imageUrl": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "J",
    "lower": "j",
    "name": "ji",
    "nameIpa": "/ʒi/",
    "category": "consonant",
    "variants": [
      {
        "id": "j-standard",
        "soundIpa": "/ʒ/",
        "soundName": {
          "fr": "J chuintant (/ʒ/)",
          "en": "J sound (/ʒ/)",
          "es": "Sonido J (/ʒ/)",
          "de": "J-Laut (/ʒ/)",
          "it": "Suono J (/ʒ/)",
          "pt": "Som J (/ʒ/)",
          "ar": "صوت J الفرنسي (/ʒ/)",
          "zh": "浊辅音 J (/ʒ/)",
          "nl": "Franse J-klank (/ʒ/)",
          "prs": "صوت J (/ʒ/)",
          "uk": "Звук J (/ʒ/)",
          "ps": "لړزېدونکی J (/ʒ/)",
          "sq": "J fërkuese (/ʒ/)",
          "ka": "შიშინა J (/ʒ/)"
        },
        "rule": {
          "fr": "Toujours prononcé /ʒ/ (vibrant, comme dans \"vision\").",
          "en": "Always pronounced /ʒ/ (voiced, like the \"s\" in \"measure\").",
          "es": "Siempre se pronuncia /ʒ/ (como la \"s\" inglesa en \"measure\").",
          "de": "Immer wie /ʒ/ ausgesprochen (wie das \"g\" in \"Garage\").",
          "it": "Sempre pronunciato /ʒ/ (come la \"j\" francese).",
          "pt": "Sempre pronunciado /ʒ/ (como o \"j\" português em \"jogo\").",
          "ar": "يُنطق دائماً كالجيم المعطشة /ʒ/ (مثل s في كلمة measure).",
          "zh": "始终发浊音 /ʒ/，如同英语 measure 中的 s。",
          "nl": "Altijd uitgesproken als /ʒ/ zoals in \"journaal\".",
          "prs": "همیشه در فرانسوی مانند «ژ» تلفظ می‌شود.",
          "uk": "Завжди вимовляється дзвінко як /ʒ/ (як ж).",
          "ps": "تل د /ʒ/ (ژ) په څېر تلفظ کېږي.",
          "sq": "Shqiptohet gjithmonë /ʒ/ (si \"zh\").",
          "ka": "ყოველთვის გამოითქმის როგორც /ʒ/ (ჟ)."
        },
        "words": [
          {
            "word": "jardin",
            "highlight": "j",
            "ipa": "/ʒaʁ.dɛ̃/",
            "gloss": {
              "en": "garden",
              "fr": "jardin",
              "es": "jardín",
              "de": "Garten",
              "it": "giardino",
              "pt": "jardim",
              "ar": "حديقة",
              "zh": "花园",
              "nl": "tuin",
              "prs": "باغ",
              "uk": "сад",
              "ps": "باغ",
              "sq": "kopsht",
              "ka": "ბაღი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "jupe",
            "highlight": "j",
            "ipa": "/ʒyp/",
            "gloss": {
              "en": "skirt",
              "fr": "jupe",
              "es": "falda",
              "de": "Rock",
              "it": "gonna",
              "pt": "saia",
              "ar": "تنورة",
              "zh": "裙子",
              "nl": "rok",
              "prs": "دامن",
              "uk": "спідниця",
              "ps": "سکرټ",
              "sq": "fund",
              "ka": "ქვედაბოლო"
            },
            "imageUrl": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "jouet",
            "highlight": "j",
            "ipa": "/ʒwɛ/",
            "gloss": {
              "en": "toy",
              "fr": "jouet",
              "es": "juguete",
              "de": "Spielzeug",
              "it": "giocattolo",
              "pt": "brinquedo",
              "ar": "لعبة",
              "zh": "玩具",
              "nl": "speelgoed",
              "prs": "اسباب‌بازی",
              "uk": "іграшка",
              "ps": "لوبتکه",
              "sq": "lodër",
              "ka": "სათამაშო"
            },
            "imageUrl": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "K",
    "lower": "k",
    "name": "ka",
    "nameIpa": "/ka/",
    "category": "consonant",
    "variants": [
      {
        "id": "k-standard",
        "soundIpa": "/k/",
        "soundName": {
          "fr": "K net (/k/)",
          "en": "K sound (/k/)",
          "es": "Sonido K (/k/)",
          "de": "K-Laut (/k/)",
          "it": "Suono K (/k/)",
          "pt": "Som K (/k/)",
          "ar": "صوت K الصامت (/k/)",
          "zh": "清辅音 K (/k/)",
          "nl": "K-klank (/k/)",
          "prs": "صوت K (/k/)",
          "uk": "Звук K (/k/)",
          "ps": "روښانه K (/k/)",
          "sq": "K e qartë (/k/)",
          "ka": "მკვეთრი K (/k/)"
        },
        "rule": {
          "fr": "Très net et non aspiré, présent dans les mots empruntés.",
          "en": "Crisp and unaspirated, common in loanwords.",
          "es": "Muy claro y sin aspiración, común en préstamos lingüísticos.",
          "de": "Klar und kaum behaucht, häufig in Fremdwörtern.",
          "it": "Chiaro e non aspirato, comune nei prestiti linguistici.",
          "pt": "Nítido e não aspirado, frequente em palavras de empréstimo.",
          "ar": "واضح وغير منفوخ بالهواء، شائع في الكلمات الدخيلة.",
          "zh": "清晰而不带送气的清辅音，常见于外来词。",
          "nl": "Helder en ongeaspireerd, veelal in leenwoorden.",
          "prs": "صدای «ک» واضح و خشک، در کلمات قرضی.",
          "uk": "Чіткий звук /k/, часто зустрічається в запозичених словах.",
          "ps": "ډېر روښانه او بې له هوا ایستلو، په پوروړو کلمو کې راځي.",
          "sq": "Shumë e pastër dhe pa frymëmarrje, e pranishme në fjalë të huazuara.",
          "ka": "მკვეთრი და არაასპირირებული, გვხვდება ნასესხებ სიტყვებში."
        },
        "words": [
          {
            "word": "kiwi",
            "highlight": "k",
            "ipa": "/ki.wi/",
            "gloss": {
              "en": "kiwi",
              "fr": "kiwi",
              "es": "kiwi",
              "de": "Kiwi",
              "it": "kiwi",
              "pt": "kiwi",
              "ar": "كيوي",
              "zh": "奇异果",
              "nl": "kiwi",
              "prs": "کیوی",
              "uk": "ківі",
              "ps": "کیوي",
              "sq": "kivi",
              "ka": "კივი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "kangourou",
            "highlight": "k",
            "ipa": "/kɑ̃.ɡu.ʁu/",
            "gloss": {
              "en": "kangaroo",
              "fr": "kangourou",
              "es": "canguro",
              "de": "Känguru",
              "it": "canguro",
              "pt": "canguru",
              "ar": "كنغر",
              "zh": "袋鼠",
              "nl": "kangoeroe",
              "prs": "کانگورو",
              "uk": "кенгуру",
              "ps": "کینګرو",
              "sq": "kangur",
              "ka": "კენგურუ"
            },
            "imageUrl": "https://images.unsplash.com/photo-1575699914911-0027c7b95fb6?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "L",
    "lower": "l",
    "name": "elle",
    "nameIpa": "/ɛl/",
    "category": "consonant",
    "variants": [
      {
        "id": "l-standard",
        "soundIpa": "/l/",
        "soundName": {
          "fr": "L clair (/l/)",
          "en": "L sound (/l/)",
          "es": "Sonido L (/l/)",
          "de": "L-Laut (/l/)",
          "it": "Suono L (/l/)",
          "pt": "Som L (/l/)",
          "ar": "صوت L الواضح (/l/)",
          "zh": "舌边音 L (/l/)",
          "nl": "L-klank (/l/)",
          "prs": "صوت L (/l/)",
          "uk": "Звук L (/l/)",
          "ps": "روښانه L (/l/)",
          "sq": "L e qartë (/l/)",
          "ka": "ნათელი L (/l/)"
        },
        "rule": {
          "fr": "L \"clair\" : la pointe de la langue touche fermement les alvéoles supérieures.",
          "en": "Clear French L: tongue tip touches the upper tooth ridge without hollow throat sound.",
          "es": "L clara: la punta de la lengua toca firmemente los alvéolos superiores.",
          "de": "Helles französisches L: Zungenspitze berührt den oberen Zahndamm.",
          "it": "L chiara: la punta della lingua tocca gli alveoli superiori.",
          "pt": "L claro: a ponta da língua toca os alvéolos superiores.",
          "ar": "صوت L مرقق: يلامس طرف اللسان سقف الحنك خلف الأسنان العلوية.",
          "zh": "清晰明亮，舌尖贴紧上齿龈发音。",
          "nl": "Heldere L: tongpunt raakt stevig het boventandvlees.",
          "prs": "صدای «ل» شفاف با تماس نوک زبان با پشت دندان‌های بالا.",
          "uk": "Світлий звук /l/, кінчик язика торкається верхніх ясен.",
          "ps": "د ژبې سر د پورتنیو اوریو برخه کلک لمس کوي.",
          "sq": "Maja e gjuhës prek fort pjesën e sipërme të gojës.",
          "ka": "ენის წვერი მყარად ეხება ზედა ალვეოლებს."
        },
        "words": [
          {
            "word": "lune",
            "highlight": "l",
            "ipa": "/lyn/",
            "gloss": {
              "en": "moon",
              "fr": "lune",
              "es": "luna",
              "de": "Mond",
              "it": "luna",
              "pt": "lua",
              "ar": "قمر",
              "zh": "月亮",
              "nl": "maan",
              "prs": "مهتاب (ماه)",
              "uk": "місяць",
              "ps": "سپوږمۍ",
              "sq": "hënë",
              "ka": "მთვარე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "lion",
            "highlight": "l",
            "ipa": "/ljɔ̃/",
            "gloss": {
              "en": "lion",
              "fr": "lion",
              "es": "león",
              "de": "Löwe",
              "it": "leone",
              "pt": "leão",
              "ar": "أسد",
              "zh": "狮子",
              "nl": "leeuw",
              "prs": "شیر",
              "uk": "лев",
              "ps": "زمری",
              "sq": "luan",
              "ka": "ლომი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "livre",
            "highlight": "l",
            "ipa": "/livʁ/",
            "gloss": {
              "en": "book",
              "fr": "livre",
              "es": "libro",
              "de": "Buch",
              "it": "libro",
              "pt": "livro",
              "ar": "كتاب",
              "zh": "书",
              "nl": "boek",
              "prs": "کتاب",
              "uk": "книга",
              "ps": "کتاب",
              "sq": "libër",
              "ka": "წიგნი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "M",
    "lower": "m",
    "name": "emme",
    "nameIpa": "/ɛm/",
    "category": "consonant",
    "variants": [
      {
        "id": "m-standard",
        "soundIpa": "/m/",
        "soundName": {
          "fr": "M bilabial (/m/)",
          "en": "M sound (/m/)",
          "es": "Sonido M (/m/)",
          "de": "M-Laut (/m/)",
          "it": "Suono M (/m/)",
          "pt": "Som M (/m/)",
          "ar": "صوت M الشفوي (/m/)",
          "zh": "双唇鼻音 M (/m/)",
          "nl": "M-klank (/m/)",
          "prs": "صوت M (/m/)",
          "uk": "Звук M (/m/)",
          "ps": "دوه شونډیز M (/m/)",
          "sq": "M bilabiale (/m/)",
          "ka": "ბაგისმიერი M (/m/)"
        },
        "rule": {
          "fr": "Les deux lèvres sont jointes et l'air sort par le nez.",
          "en": "Both lips closed with sound resonating through nasal passage.",
          "es": "Ambos labios juntos y el aire resuena por la nariz.",
          "de": "Beide Lippen geschlossen, Resonanz durch die Nase.",
          "it": "Entrambe le labbra chiuse e l'aria esce dal naso.",
          "pt": "Ambos os lábios unidos com ressonância nasal.",
          "ar": "تنطبق الشفتان ويخرج الهواء برنين من الأنف.",
          "zh": "闭起双唇，气流由鼻腔透出的鼻音。",
          "nl": "Beide lippen gesloten met resonantie door de neus.",
          "prs": "با بستن دو لب و عبور هوا از بینی تلفظ می‌شود.",
          "uk": "Носовий губний звук /m/, губи щільно зімкнені.",
          "ps": "دواړه شونډې یوځای کېږي او هوا د پوزې له لارې وځي.",
          "sq": "Të dyja buzët bashkohen dhe ajri del përmes hundës.",
          "ka": "ორივე ტუჩი შეერთებულია და ჰაერი გამოდის ცხვირით."
        },
        "words": [
          {
            "word": "maison",
            "highlight": "m",
            "ipa": "/mɛ.zɔ̃/",
            "gloss": {
              "en": "house",
              "fr": "maison",
              "es": "casa",
              "de": "Haus",
              "it": "casa",
              "pt": "casa",
              "ar": "منزل",
              "zh": "房屋",
              "nl": "huis",
              "prs": "خانه",
              "uk": "будинок",
              "ps": "کور",
              "sq": "shtëpi",
              "ka": "სახლი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "mouton",
            "highlight": "m",
            "ipa": "/mu.tɔ̃/",
            "gloss": {
              "en": "sheep",
              "fr": "mouton",
              "es": "oveja",
              "de": "Schaf",
              "it": "pecora",
              "pt": "ovelha",
              "ar": "خروف",
              "zh": "绵羊",
              "nl": "schaap",
              "prs": "گوسفند",
              "uk": "вівця",
              "ps": "پسه",
              "sq": "dele",
              "ka": "ცხვარი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1588057078850-c7853b9188f8?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "N",
    "lower": "n",
    "name": "enne",
    "nameIpa": "/ɛn/",
    "category": "consonant",
    "variants": [
      {
        "id": "n-standard",
        "soundIpa": "/n/",
        "soundName": {
          "fr": "N alvéolaire (/n/)",
          "en": "N sound (/n/)",
          "es": "Sonido N (/n/)",
          "de": "N-Laut (/n/)",
          "it": "Suono N (/n/)",
          "pt": "Som N (/n/)",
          "ar": "صوت N السنخي (/n/)",
          "zh": "齿龈鼻音 N (/n/)",
          "nl": "N-klank (/n/)",
          "prs": "صوت N (/n/)",
          "uk": "Звук N (/n/)",
          "ps": "اورۍ N (/n/)",
          "sq": "N alveolare (/n/)",
          "ka": "ალვეოლარული N (/n/)"
        },
        "rule": {
          "fr": "Devant une voyelle, la langue bloque les dents du haut.",
          "en": "Before a vowel, tongue blocks upper teeth ridge.",
          "es": "Delante de una vocal, la lengua toca los alvéolos superiores.",
          "de": "Vor Vokalen berührt die Zunge den oberen Zahndamm.",
          "it": "Davanti a una vocale, la lingua tocca gli alveoli superiori.",
          "pt": "Antes de uma vogal, a língua toca os alvéolos superiores.",
          "ar": "قبل حرف العلة، يحجب اللسان الهواء عند أصول الثنايا العليا.",
          "zh": "在元音前，舌尖抵住上齿龈发出鼻音。",
          "nl": "Voor een klinker sluit de tong de boventandwal af.",
          "prs": "قبل از حروف صدادار، نوک زبان پشت دندان‌های بالا قرار می‌گیرد.",
          "uk": "Перед голосними вимовляється як чистий звук /n/.",
          "ps": "د غږلرونکي توري مخکې، ژبه پورتني غاښونه بندوي.",
          "sq": "Përpara një zanoreje, gjuha bllokon dhëmbët e sipërm.",
          "ka": "ხმოვნის წინ ენა ეხება ზედა კბილებს."
        },
        "words": [
          {
            "word": "nuage",
            "highlight": "n",
            "ipa": "/nɥaʒ/",
            "gloss": {
              "en": "cloud",
              "fr": "nuage",
              "es": "nube",
              "de": "Wolke",
              "it": "nuvola",
              "pt": "nuvem",
              "ar": "سحابة",
              "zh": "云",
              "nl": "wolk",
              "prs": "ابر",
              "uk": "хмара",
              "ps": "ورېځ",
              "sq": "re",
              "ka": "ღრუბელი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "nid",
            "highlight": "n",
            "ipa": "/ni/",
            "gloss": {
              "en": "nest",
              "fr": "nid",
              "es": "nido",
              "de": "Nest",
              "it": "nido",
              "pt": "ninho",
              "ar": "عش",
              "zh": "鸟巢",
              "nl": "nest",
              "prs": "لانه",
              "uk": "гніздо",
              "ps": "ځاله",
              "sq": "fole",
              "ka": "ბუდე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1495863367063-b9ac3e6394f7?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "nez",
            "highlight": "n",
            "ipa": "/ne/",
            "gloss": {
              "en": "nose",
              "fr": "nez",
              "es": "nariz",
              "de": "Nase",
              "it": "naso",
              "pt": "nariz",
              "ar": "أنف",
              "zh": "鼻子",
              "nl": "neus",
              "prs": "بینی",
              "uk": "ніс",
              "ps": "پوزه",
              "sq": "hundë",
              "ka": "ცხვირი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1531399975357-08f7f873bac3?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "O",
    "lower": "o",
    "name": "o",
    "nameIpa": "/o/",
    "category": "vowel",
    "variants": [
      {
        "id": "o-standard",
        "soundIpa": "/o/ ou /ɔ/",
        "soundName": {
          "fr": "O rond (/o/ ou /ɔ/)",
          "en": "O sound (/o/ or /ɔ/)",
          "es": "Sonido O (/o/ o /ɔ/)",
          "de": "O-Laut (/o/ oder /ɔ/)",
          "it": "Suono O (/o/ o /ɔ/)",
          "pt": "Som O (/o/ ou /ɔ/)",
          "ar": "صوت O الدائري (/o/ أو /ɔ/)",
          "zh": "圆唇音 O (/o/ 或 /ɔ/)",
          "nl": "O-klank (/o/ of /ɔ/)",
          "prs": "صوت O (/o/ یا /ɔ/)",
          "uk": "Звук O (/o/ або /ɔ/)",
          "ps": "ګرد O (/o/ یا /ɔ/)",
          "sq": "O e rrumbullakosur (/o/ ose /ɔ/)",
          "ka": "მრგვალი O (/o/ ან /ɔ/)"
        },
        "rule": {
          "fr": "Les lèvres sont très arrondies pour former le son O.",
          "en": "Lips are rounded and projected forward.",
          "es": "Los labios están muy redondeados hacia adelante.",
          "de": "Die Lippen sind stark gerundet und vorgestülpt.",
          "it": "Le labbra sono ben arrotondate e protese in avanti.",
          "pt": "Lábios bem arredondados projetados para a frente.",
          "ar": "تستدير الشفاه جيداً لإخراج الصوت O بوضوح.",
          "zh": "双唇向前圆拢发出的圆唇元音。",
          "nl": "Lippen zijn sterk gerond.",
          "prs": "لب‌ها کاملاً گرد و به جلو رانده می‌شوند.",
          "uk": "Круглий голосний звук, губи округлені вперед.",
          "ps": "شونډې خورا ګردېږي ترڅو د O غږ جوړ کړي.",
          "sq": "Buzët janë shumë të rrumbullakosura për të formuar tingullin O.",
          "ka": "ტუჩები მკვეთრად მომრგვალებულია O ბგერის წარმოსაქმნელად."
        },
        "words": [
          {
            "word": "orange",
            "highlight": "o",
            "ipa": "/ɔ.ʁɑ̃ʒ/",
            "gloss": {
              "en": "orange",
              "fr": "orange",
              "es": "naranja",
              "de": "Orange",
              "it": "arancia",
              "pt": "laranja",
              "ar": "برتقال",
              "zh": "橙子",
              "nl": "sinaasappel",
              "prs": "مالته (پرتقال)",
              "uk": "апельсин",
              "ps": "مالټه",
              "sq": "portokall",
              "ka": "ფორთოხალი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "ordinateur",
            "highlight": "o",
            "ipa": "/ɔʁ.di.na.tœʁ/",
            "gloss": {
              "en": "computer",
              "fr": "ordinateur",
              "es": "ordenador",
              "de": "Computer",
              "it": "computer",
              "pt": "computador",
              "ar": "حاسوب",
              "zh": "电脑",
              "nl": "computer",
              "prs": "کمپیوتر",
              "uk": "комп’ютер",
              "ps": "کمپیوټر",
              "sq": "kompjuter",
              "ka": "კომპიუტერი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "olive",
            "highlight": "o",
            "ipa": "/ɔ.liv/",
            "gloss": {
              "en": "olive",
              "fr": "olive",
              "es": "aceituna",
              "de": "Olive",
              "it": "oliva",
              "pt": "azeitona",
              "ar": "زيتون",
              "zh": "橄榄",
              "nl": "olijf",
              "prs": "زیتون",
              "uk": "оливка",
              "ps": "ښوون (زیتون)",
              "sq": "ulliri",
              "ka": "ზეთისხილი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1622341357129-c460d41da93d?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "P",
    "lower": "p",
    "name": "pé",
    "nameIpa": "/pe/",
    "category": "consonant",
    "variants": [
      {
        "id": "p-standard",
        "soundIpa": "/p/",
        "soundName": {
          "fr": "P sec (/p/)",
          "en": "P sound (/p/)",
          "es": "Sonido P (/p/)",
          "de": "P-Laut (/p/)",
          "it": "Suono P (/p/)",
          "pt": "Som P (/p/)",
          "ar": "صوت P الانفجاري (/p/)",
          "zh": "不送气 P (/p/)",
          "nl": "P-klank (/p/)",
          "prs": "صوت P (/p/)",
          "uk": "Звук P (/p/)",
          "ps": "وچ P (/p/)",
          "sq": "P e thatë (/p/)",
          "ka": "მშრალი P (/p/)"
        },
        "rule": {
          "fr": "Explosif et sec sans souffle d'air (non aspiré).",
          "en": "Clean, crisp and unaspirated burst of sound with both lips.",
          "es": "Limpio, seco y sin soplo de aire añadido.",
          "de": "Klarer, trockener Verschlusslaut ohne starken Hauch.",
          "it": "Pulito, secco e non aspirato con entrambe le labbra.",
          "pt": "Limpo, seco e não aspirado.",
          "ar": "انفجاري وجاف بدون نفخة هواء مصاحبة.",
          "zh": "双唇紧闭后突然爆破，清脆且不带多余气流。",
          "nl": "Zuivere, droge plofklank zonder sterke adem.",
          "prs": "صدای «پ» خشک و بدون نفس اضافی با هر دو لب.",
          "uk": "Глухий губний звук /p/, без видиху.",
          "ps": "چاودیدونکی او وچ، پرته له اضافي هوا.",
          "sq": "Shpërthyese dhe e thatë pa frymë ajri (jo e aspiruar).",
          "ka": "მკვეთრი და მშრალი, ჰაერის ამოსუნთქვის გარეშე."
        },
        "words": [
          {
            "word": "pomme",
            "highlight": "p",
            "ipa": "/pɔm/",
            "gloss": {
              "en": "apple",
              "fr": "pomme",
              "es": "manzana",
              "de": "Apfel",
              "it": "mela",
              "pt": "maçã",
              "ar": "تفاحة",
              "zh": "苹果",
              "nl": "appel",
              "prs": "سیب",
              "uk": "яблуко",
              "ps": "مڼه",
              "sq": "mollë",
              "ka": "ვაშლი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "poisson",
            "highlight": "p",
            "ipa": "/pwa.sɔ̃/",
            "gloss": {
              "en": "fish",
              "fr": "poisson",
              "es": "pez",
              "de": "Fisch",
              "it": "pesce",
              "pt": "peixe",
              "ar": "سمك",
              "zh": "鱼",
              "nl": "vis",
              "prs": "ماهی",
              "uk": "риба",
              "ps": "کب",
              "sq": "peshk",
              "ka": "თევზი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "Q",
    "lower": "q",
    "name": "qu",
    "nameIpa": "/ky/",
    "category": "consonant",
    "variants": [
      {
        "id": "qu-standard",
        "soundIpa": "/k/",
        "soundName": {
          "fr": "QU (/k/)",
          "en": "QU sound (/k/)",
          "es": "Sonido QU (/k/)",
          "de": "QU-Laut (/k/)",
          "it": "Suono QU (/k/)",
          "pt": "Som QU (/k/)",
          "ar": "صوت QU (/k/)",
          "zh": "QU 读作 (/k/)",
          "nl": "QU-klank (/k/)",
          "prs": "صوت QU (/k/)",
          "uk": "Звук QU (/k/)",
          "ps": "د QU غږ (/k/)",
          "sq": "QU (/k/)",
          "ka": "QU (/k/)"
        },
        "rule": {
          "fr": "Le U qui suit le Q est presque toujours muet en français (QU = /k/).",
          "en": "The U following Q is usually silent in French (QU = /k/).",
          "es": "La U tras la Q es casi siempre muda en francés (QU = /k/).",
          "de": "Das U nach dem Q ist im Französischen meist stumm (QU = /k/).",
          "it": "La U dopo la Q è solitamente muta in francese (QU = /k/).",
          "pt": "O U após o Q é quase sempre mudo em francês (QU = /k/).",
          "ar": "حرف U الذي يلي Q يكون صامتاً عادة (تُنطق QU كـ /k/).",
          "zh": "Q 后的 U 通常不发音，QU 整体读作 /k/。",
          "nl": "De U na Q is in het Frans bijna altijd stom (QU = /k/).",
          "prs": "حرف U بعد از Q در فرانسوی تقریباً همیشه ساکت است (QU = /k/).",
          "uk": "Літера U після Q у французькій зазвичай не читається (QU = /k/).",
          "ps": "هغه U چې د Q وروسته راځي نږدې تل په فرانسوي کې بې غږه وي (QU = /k/).",
          "sq": "Shkronja U që pason Q-në është pothuajse gjithmonë pa zë (QU = /k/).",
          "ka": "ასო U, რომელიც მოსდევს Q-ს, თითქმის ყოველთვის უხმოა (QU = /k/)."
        },
        "words": [
          {
            "word": "quatre",
            "highlight": "qu",
            "ipa": "/katʁ/",
            "gloss": {
              "en": "four",
              "fr": "quatre",
              "es": "cuatro",
              "de": "vier",
              "it": "quattro",
              "pt": "quatro",
              "ar": "أربعة",
              "zh": "四",
              "nl": "vier",
              "prs": "چهار",
              "uk": "чотири",
              "ps": "څلور",
              "sq": "katër",
              "ka": "ოთხი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1746291645282-a17fc9c3b0b9?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "queue",
            "highlight": "qu",
            "ipa": "/kø/",
            "gloss": {
              "en": "tail / line",
              "fr": "queue",
              "es": "cola",
              "de": "Schwanz / Schlange",
              "it": "coda",
              "pt": "cauda / fila",
              "ar": "ذيل / طابور",
              "zh": "尾巴 / 排队",
              "nl": "staart / rij",
              "prs": "دم / قطار",
              "uk": "хвіст / черга",
              "ps": "لکۍ / قطار",
              "sq": "bisht / radhë",
              "ka": "კუდი / რიგი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1663786056091-fcb790594901?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "R",
    "lower": "r",
    "name": "erre",
    "nameIpa": "/ɛʁ/",
    "category": "consonant",
    "variants": [
      {
        "id": "r-standard",
        "soundIpa": "/ʁ/",
        "soundName": {
          "fr": "R uvulaire (/ʁ/)",
          "en": "French R (/ʁ/)",
          "es": "R uvular francesa (/ʁ/)",
          "de": "Französisches R (/ʁ/)",
          "it": "R uvulare francese (/ʁ/)",
          "pt": "R uvular francês (/ʁ/)",
          "ar": "الراء الفرنسية الحلقية (/ʁ/)",
          "zh": "小舌小颤音 R (/ʁ/)",
          "nl": "Franse huig-R (/ʁ/)",
          "prs": "R فرانسوی (/ʁ/)",
          "uk": "Французький R (/ʁ/)",
          "ps": "مرۍ R (/ʁ/)",
          "sq": "R uvulare (/ʁ/)",
          "ka": "ხორხისმიერი R (/ʁ/)"
        },
        "rule": {
          "fr": "Produit au fond de la gorge par le frottement de la luette.",
          "en": "Produced at the back of the throat through uvular friction.",
          "es": "Producido al fondo de la garganta por la vibración de la úvula.",
          "de": "Wird hinten im Rachen durch Reibung des Gaumenzäpfchens gebildet.",
          "it": "Prodotto in fondo alla gola mediante la vibrazione dell'ugola.",
          "pt": "Produzido no fundo da garganta com atrito da úvula.",
          "ar": "يخرج من أقصى الحلق بالقرب من اللهاة بنعومة.",
          "zh": "在喉咙深处、小舌附近摩擦振动发出的独特音。",
          "nl": "Gevormd achterin de keel door wrijving van de huig.",
          "prs": "از انتهای گلو و به صورت لرزش ملایم تلفظ می‌شود.",
          "uk": "Горловий звук /ʁ/, утворюється в задній частині піднебіння.",
          "ps": "د ستوني په پای کې د وړې ژبې په لړزېدو سره رامنځته کېږي.",
          "sq": "Prodhohet në thellësi të fytit nga fërkimi i uvulës.",
          "ka": "წარმოიქმნება ყელის სიღრმეში ნაქის ვიბრაციით."
        },
        "words": [
          {
            "word": "rouge",
            "highlight": "r",
            "ipa": "/ʁuʒ/",
            "gloss": {
              "en": "red",
              "fr": "rouge",
              "es": "rojo",
              "de": "rot",
              "it": "rosso",
              "pt": "vermelho",
              "ar": "أحمر",
              "zh": "红色",
              "nl": "rood",
              "prs": "سرخ",
              "uk": "червоний",
              "ps": "سور",
              "sq": "e kuqe",
              "ka": "წითელი"
            },
            "imageUrl": "https://images.unsplash.com/flagged/photo-1593005510509-d05b264f1c9c?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "robot",
            "highlight": "r",
            "ipa": "/ʁɔ.bo/",
            "gloss": {
              "en": "robot",
              "fr": "robot",
              "es": "robot",
              "de": "Roboter",
              "it": "robot",
              "pt": "robô",
              "ar": "روبوت",
              "zh": "机器人",
              "nl": "robot",
              "prs": "روبات",
              "uk": "робот",
              "ps": "روټ",
              "sq": "robot",
              "ka": "რობოტი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "raisin",
            "highlight": "r",
            "ipa": "/ʁɛ.zɛ̃/",
            "gloss": {
              "en": "grape",
              "fr": "raisin",
              "es": "uva",
              "de": "Weintraube",
              "it": "uva",
              "pt": "uva",
              "ar": "عنب",
              "zh": "葡萄",
              "nl": "druif",
              "prs": "انگور",
              "uk": "виноград",
              "ps": "انګور",
              "sq": "rrush",
              "ka": "ყურძენი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "S",
    "lower": "s",
    "name": "esse",
    "nameIpa": "/ɛs/",
    "category": "consonant",
    "variants": [
      {
        "id": "s-voiceless",
        "soundIpa": "/s/",
        "soundName": {
          "fr": "S sifflant (/s/)",
          "en": "S sound (/s/)",
          "es": "S sorda (/s/)",
          "de": "Stimmloses S (/s/)",
          "it": "S sorda (/s/)",
          "pt": "S surdo (/s/)",
          "ar": "S المهموسة (/s/)",
          "zh": "清音 S (/s/)",
          "nl": "Stemloze S (/s/)",
          "prs": "صوت S (/s/)",
          "uk": "Глухий S (/s/)",
          "ps": "شپیلیږونکی S (/s/)",
          "sq": "S fërkuese e shurdhët (/s/)",
          "ka": "სისინა S (/s/)"
        },
        "rule": {
          "fr": "Se prononce /s/ en début de mot, après une consonne, ou en double SS.",
          "en": "Pronounced /s/ at the beginning of a word, after a consonant, or as double SS.",
          "es": "Se pronuncia /s/ al inicio de palabra, tras consonante o con doble SS.",
          "de": "Wird am Wortanfang, nach Konsonant oder als Doppel-SS wie /s/ gesprochen.",
          "it": "Si pronuncia /s/ a inizio parola, dopo una consonante o come doppia SS.",
          "pt": "Pronuncia-se /s/ no início da palavra, após consoante ou como SS duplo.",
          "ar": "تُنطق /s/ في بداية الكلمة أو بعد حرف ساكن أو عند تكرارها SS.",
          "zh": "在词首、辅音后或双写 SS 时读清音 /s/。",
          "nl": "Klinkt als /s/ aan het begin van een woord, na een medeklinker of als dubbele SS.",
          "prs": "در ابتدای کلمه، بعد از حرف بی‌صدا یا با دو تا SS صدای «س» می‌دهد.",
          "uk": "На початку слова, після приголосного або подвійне SS звучить як /s/.",
          "ps": "د کلمې په سر کې، د بې‌غږه توري وروسته، یا په دوه برابره SS کې /s/ تلفظ کېږي.",
          "sq": "Shqiptohet /s/ në fillim të fjalës, pas një bashkëtingëlloreje, ose si SS e dyfishtë.",
          "ka": "წარმოითქმის როგორც /s/ სიტყვის დასაწყისში, თანხმოვნის შემდეგ ან გაორმაგებულ SS-ში."
        },
        "words": [
          {
            "word": "soleil",
            "highlight": "s",
            "ipa": "/sɔ.lɛj/",
            "gloss": {
              "en": "sun",
              "fr": "soleil",
              "es": "sol",
              "de": "Sonne",
              "it": "sole",
              "pt": "sol",
              "ar": "شمس",
              "zh": "太阳",
              "nl": "zon",
              "prs": "آفتاب",
              "uk": "сонце",
              "ps": "لمر",
              "sq": "diell",
              "ka": "მზე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1622278647429-71bc97e904e8?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "poisson",
            "highlight": "ss",
            "ipa": "/pwa.sɔ̃/",
            "gloss": {
              "en": "fish (double SS = /s/)",
              "fr": "poisson (double SS = /s/)",
              "es": "pez (doble SS = /s/)",
              "de": "Fisch (Doppel-SS = /s/)",
              "it": "pesce (doppia SS = /s/)",
              "pt": "peixe (SS duplo = /s/)",
              "ar": "سمك (تكرار SS يعطي صوت /s/)",
              "zh": "鱼（双写 SS 读 /s/）",
              "nl": "vis (dubbele SS = /s/)",
              "prs": "ماهی",
              "uk": "риба",
              "ps": "کب",
              "sq": "peshk",
              "ka": "თევზი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "sac",
            "highlight": "s",
            "ipa": "/sak/",
            "gloss": {
              "en": "bag",
              "fr": "sac",
              "es": "bolso",
              "de": "Tasche",
              "it": "borsa",
              "pt": "bolsa",
              "ar": "حقيبة",
              "zh": "包",
              "nl": "tas",
              "prs": "بیک (کیف)",
              "uk": "сумка",
              "ps": "بکس / کڅوړه",
              "sq": "çantë",
              "ka": "ჩანთა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        "id": "s-voiced",
        "soundIpa": "/z/",
        "soundName": {
          "fr": "S entre voyelles (/z/)",
          "en": "Intervocalic S (/z/)",
          "es": "S entre vocales (/z/)",
          "de": "Stimmhaftes S (/z/)",
          "it": "S tra vocali (/z/)",
          "pt": "S entre vogais (/z/)",
          "ar": "S بين حرفي علة (/z/)",
          "zh": "元音间的 S 读作 (/z/)",
          "nl": "S tussen klinkers (/z/)",
          "prs": "S میان دو حرف صدادار (/z/)",
          "uk": "Дзвінкий S між голосними (/z/)",
          "ps": "د غږلرونکو تر منځ S (/z/)",
          "sq": "S midis zanoreve (/z/)",
          "ka": "S ხმოვნებს შორის (/z/)"
        },
        "rule": {
          "fr": "Un S unique placé entre deux voyelles se prononce toujours /z/ (comme un zèbre).",
          "en": "A single S between two vowels is always voiced and sounds like /z/.",
          "es": "Una sola S entre dos vocales siempre suena /z/ (como en cebra).",
          "de": "Ein einzelnes S zwischen zwei Vokalen wird immer stimmhaft wie /z/ gesprochen.",
          "it": "Una singola S tra due vocali si pronuncia sempre /z/.",
          "pt": "Um único S entre duas vogais soa sempre como /z/.",
          "ar": "حرف S المفرد الواقع بين حرفي علة يُنطق دائماً كصوت الزاي /z/.",
          "zh": "单个 S 夹在两个元音之间时，始终发浊音 /z/。",
          "nl": "Een enkele S tussen twee klinkers klinkt altijd als /z/.",
          "prs": "یک S در میان دو حرف صدادار همیشه صدای «ز» می‌دهد.",
          "uk": "Одинарна літера S між двома голосними завжди звучить як /z/.",
          "ps": "یو واحد S چې د دوو غږلرونکو حروفو ترمنځ وي تل د /z/ (ز) په توګه تلفظ کېږي.",
          "sq": "Një S e vetme midis dy zanoreve shqiptohet gjithmonë /z/.",
          "ka": "ერთი S ორ ხმოვანს შორის ყოველთვის წარმოითქმის როგორც /z/ (ზ)."
        },
        "words": [
          {
            "word": "maison",
            "highlight": "s",
            "ipa": "/mɛ.zɔ̃/",
            "gloss": {
              "en": "house (S = /z/)",
              "fr": "maison (S = /z/)",
              "es": "casa (S = /z/)",
              "de": "Haus (S = /z/)",
              "it": "casa (S = /z/)",
              "pt": "casa (S = /z/)",
              "ar": "منزل (حرف S يُنطق /z/)",
              "zh": "房子（S 读作 /z/）",
              "nl": "huis (S = /z/)",
              "prs": "خانه",
              "uk": "будинок",
              "ps": "کور",
              "sq": "shtëpi",
              "ka": "სახლი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "rose",
            "highlight": "s",
            "ipa": "/ʁoz/",
            "gloss": {
              "en": "rose / pink",
              "fr": "rose",
              "es": "rosa",
              "de": "Rose / rosa",
              "it": "rosa",
              "pt": "rosa",
              "ar": "وردة / وردي",
              "zh": "玫瑰 / 粉色",
              "nl": "roos / roze",
              "prs": "گل گلاب / صورتی",
              "uk": "троянда / рожевий",
              "ps": "ګلاب",
              "sq": "trëndafil",
              "ka": "ვარდი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "valise",
            "highlight": "s",
            "ipa": "/va.liz/",
            "gloss": {
              "en": "suitcase",
              "fr": "valise",
              "es": "maleta",
              "de": "Koffer",
              "it": "valigia",
              "pt": "mala",
              "ar": "حقيبة سفر",
              "zh": "行李箱",
              "nl": "koffer",
              "prs": "بکس سفر (چمدان)",
              "uk": "валіса",
              "ps": "بکس",
              "sq": "valixhe",
              "ka": "ჩემოდანი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "T",
    "lower": "t",
    "name": "té",
    "nameIpa": "/te/",
    "category": "consonant",
    "variants": [
      {
        "id": "t-standard",
        "soundIpa": "/t/",
        "soundName": {
          "fr": "T dental (/t/)",
          "en": "T sound (/t/)",
          "es": "Sonido T (/t/)",
          "de": "T-Laut (/t/)",
          "it": "Suono T (/t/)",
          "pt": "Som T (/t/)",
          "ar": "صوت T السني (/t/)",
          "zh": "齿音 T (/t/)",
          "nl": "T-klank (/t/)",
          "prs": "صوت T (/t/)",
          "uk": "Звук T (/t/)",
          "ps": "غاښیز T (/t/)",
          "sq": "T dentale (/t/)",
          "ka": "კბილისმიერი T (/t/)"
        },
        "rule": {
          "fr": "La pointe de la langue frappe les dents supérieures, sec et non aspiré.",
          "en": "Clean, crisp and unaspirated dental strike behind upper teeth.",
          "es": "La punta de la lengua golpea los dientes superiores, seco y sin aire.",
          "de": "Sauberer Verschlusslaut hinter den oberen Zähnen ohne Hauch.",
          "it": "La punta della lingua tocca i denti superiori, secco e pulito.",
          "pt": "A ponta da língua toca os dentes superiores, seco e limpo.",
          "ar": "يضرب طرف اللسان خلف الأسنان العلوية بدقة ونقاء.",
          "zh": "舌尖敲击上齿背发出的清脆齿音，不带多余送气。",
          "nl": "Zuivere slag achter de boventanden zonder ademstoot.",
          "prs": "صدای «ت» خشک با نوک زبان روی دندان‌های بالا.",
          "uk": "Чіткий зубний звук /t/, кінчик язика торкається верхніх зубів.",
          "ps": "د ژبې سر پورتني غاښونه وهي، وچ او بې هوا.",
          "sq": "Maja e gjuhës godet dhëmbët e sipërm, e thatë dhe pa aspirim.",
          "ka": "ენის წვერი ეხება ზედა კბილებს, მკვეთრი და არაასპირირებული."
        },
        "words": [
          {
            "word": "tigre",
            "highlight": "t",
            "ipa": "/tiɡʁ/",
            "gloss": {
              "en": "tiger",
              "fr": "tigre",
              "es": "tigre",
              "de": "Tiger",
              "it": "tigre",
              "pt": "tigre",
              "ar": "نمر",
              "zh": "老虎",
              "nl": "tijger",
              "prs": "پلنگ / ببر",
              "uk": "тигр",
              "ps": "پړانګ (ببر)",
              "sq": "tigër",
              "ka": "ვეფხვი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "tomate",
            "highlight": "t",
            "ipa": "/tɔ.mat/",
            "gloss": {
              "en": "tomato",
              "fr": "tomate",
              "es": "tomate",
              "de": "Tomate",
              "it": "pomodoro",
              "pt": "tomate",
              "ar": "طماطم",
              "zh": "西红柿",
              "nl": "tomaat",
              "prs": "بادنجان رومی (گوجه)",
              "uk": "помідор",
              "ps": "بانجان",
              "sq": "domate",
              "ka": "პომიდორი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "tortue",
            "highlight": "t",
            "ipa": "/tɔʁ.ty/",
            "gloss": {
              "en": "turtle / tortoise",
              "fr": "tortue",
              "es": "tortuga",
              "de": "Schildkröte",
              "it": "tartaruga",
              "pt": "tartaruga",
              "ar": "سلحفاة",
              "zh": "乌龟",
              "nl": "schildpad",
              "prs": "سنگ‌پشت (لاک‌پشت)",
              "uk": "черепаха",
              "ps": "شپېلۍ (کیشپ)",
              "sq": "breshkë",
              "ka": "კუ"
            },
            "imageUrl": "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "U",
    "lower": "u",
    "name": "u",
    "nameIpa": "/y/",
    "category": "vowel",
    "variants": [
      {
        "id": "u-standard",
        "soundIpa": "/y/",
        "soundName": {
          "fr": "U français (/y/)",
          "en": "French U (/y/)",
          "es": "U francesa (/y/)",
          "de": "Französisches U (/y/)",
          "it": "U francese (/y/)",
          "pt": "U francês (/y/)",
          "ar": "صوت U الفرنسي (/y/)",
          "zh": "法国特色 U (/y/)",
          "nl": "Franse U-klank (/y/)",
          "prs": "U فرانسوی (/y/)",
          "uk": "Французький U (/y/)",
          "ps": "فرانسوي U (/y/)",
          "sq": "U frënge (/y/)",
          "ka": "ფრანგული U (/y/)"
        },
        "rule": {
          "fr": "Dites \"i\" avec la langue, mais arrondissez les lèvres comme pour siffler.",
          "en": "Position tongue as for \"ee\", but round lips tightly forward as if whistling.",
          "es": "Coloca la lengua para decir \"i\", pero redondea bien los labios hacia adelante.",
          "de": "Sprechposition von \"i\", aber Lippen eng runden wie bei deutschem \"ü\".",
          "it": "Pronuncia \"i\" con la lingua, ma arrotonda bene le labbra in avanti.",
          "pt": "Posicione a língua para \"i\", mas arredonde os lábios para a frente.",
          "ar": "ضع اللسان كما في نطق الياء، لكن زم الشفتين للأمام كالتصفير.",
          "zh": "发“一”的舌位，同时将双唇紧缩圆拢（类似汉语拼音 ü）。",
          "nl": "Tongpositie van \"ie\", maar lippen ronden zoals bij \"uu\".",
          "prs": "زبان در حالت گفتن «ای»، ولی لب‌ها کاملاً گرد مانند سوت زدن.",
          "uk": "Язик як для звуку «і», але губи витягнуті вперед, ніби свистите.",
          "ps": "په خپله ژبه \"ای\" ووایاست، مګر خپلې شونډې د سیټي وهلو په څېر ګردې کړئ.",
          "sq": "Thoni \"i\" me gjuhë, por rrumbullakosni buzët si për të fishkëllyer.",
          "ka": "ენით თქვით \"ი\", მაგრამ ტუჩები მოამრგვალეთ თითქოს სტვენთ."
        },
        "words": [
          {
            "word": "lune",
            "highlight": "u",
            "ipa": "/lyn/",
            "gloss": {
              "en": "moon",
              "fr": "lune",
              "es": "luna",
              "de": "Mond",
              "it": "luna",
              "pt": "lua",
              "ar": "قمر",
              "zh": "月亮",
              "nl": "maan",
              "prs": "مهتاب (ماه)",
              "uk": "місяць",
              "ps": "سپوږمۍ",
              "sq": "hënë",
              "ka": "მთვარე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "usine",
            "highlight": "u",
            "ipa": "/y.zin/",
            "gloss": {
              "en": "factory",
              "fr": "usine",
              "es": "fábrica",
              "de": "Fabrik",
              "it": "fabbrica",
              "pt": "fábrica",
              "ar": "مصنع",
              "zh": "工厂",
              "nl": "fabriek",
              "prs": "فابریکه (کارخانه)",
              "uk": "фабрика",
              "ps": "فابریکه",
              "sq": "fabrikë",
              "ka": "ქარხანა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "uniforme",
            "highlight": "u",
            "ipa": "/y.ni.fɔʁm/",
            "gloss": {
              "en": "uniform",
              "fr": "uniforme",
              "es": "uniforme",
              "de": "Uniform",
              "it": "uniforme",
              "pt": "uniforme",
              "ar": "زي موحد",
              "zh": "制服",
              "nl": "uniform",
              "prs": "لباس یکنواخت",
              "uk": "форма",
              "ps": "یونیفورم",
              "sq": "uniformë",
              "ka": "უნიფორმა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "flûte",
            "highlight": "u",
            "ipa": "/flyt/",
            "gloss": {
              "en": "flute",
              "fr": "flûte",
              "es": "flauta",
              "de": "Flöte",
              "it": "flauto",
              "pt": "flauta",
              "ar": "ناي / فلوت",
              "zh": "长笛",
              "nl": "fluit",
              "prs": "فلوت",
              "uk": "флейта",
              "ps": "شپېلۍ",
              "sq": "flautë",
              "ka": "ფლეიტა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1771923654517-9be42eb0e516?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "V",
    "lower": "v",
    "name": "vé",
    "nameIpa": "/ve/",
    "category": "consonant",
    "variants": [
      {
        "id": "v-standard",
        "soundIpa": "/v/",
        "soundName": {
          "fr": "V voisé (/v/)",
          "en": "V sound (/v/)",
          "es": "Sonido V (/v/)",
          "de": "V-Laut (/v/)",
          "it": "Suono V (/v/)",
          "pt": "Som V (/v/)",
          "ar": "صوت V المجهور (/v/)",
          "zh": "浊唇齿音 V (/v/)",
          "nl": "V-klank (/v/)",
          "prs": "صوت V (/v/)",
          "uk": "Звук V (/v/)",
          "ps": "غږلرونکی V (/v/)",
          "sq": "V e zëshme (/v/)",
          "ka": "მჟღერი V (/v/)"
        },
        "rule": {
          "fr": "Les dents supérieures vibrent sur la lèvre inférieure avec la voix.",
          "en": "Upper teeth vibrate against bottom lip with voice active.",
          "es": "Los dientes superiores vibran sobre el labio inferior con voz.",
          "de": "Die oberen Zähne vibrieren stimmhaft auf der Unterlippe.",
          "it": "I denti superiori vibrano sul labbro inferiore con voce.",
          "pt": "Dentes superiores vibram no lábio inferior com voz.",
          "ar": "تهتز الأسنان العلوية على الشفة السفلية مع خروج الصوت.",
          "zh": "上齿轻触下唇，声带振动发出浊音。",
          "nl": "Boventanden trillen met stem op de onderlip.",
          "prs": "دندان‌های بالا روی لب پایین با ارتعاش تار‌های صوتی.",
          "uk": "Дзвінкий звук /v/, верхні зуби притискаються до нижньої губи.",
          "ps": "پورتني غاښونه د غږ سره په لاندنۍ شونډه لړزېږي.",
          "sq": "Dhëmbët e sipërm dridhen mbi buzën e poshtme me zë.",
          "ka": "ზედა კბილები ხმით ვიბრირებს ქვედა ტუჩზე."
        },
        "words": [
          {
            "word": "vélo",
            "highlight": "v",
            "ipa": "/ve.lo/",
            "gloss": {
              "en": "bicycle",
              "fr": "vélo",
              "es": "bicicleta",
              "de": "Fahrrad",
              "it": "bicicletta",
              "pt": "bicicleta",
              "ar": "دراجة",
              "zh": "自行车",
              "nl": "fiets",
              "prs": "بایسکل (دوچرخه)",
              "uk": "велосипед",
              "ps": "بایسکل",
              "sq": "biçikletë",
              "ka": "ველოსიპედი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "vache",
            "highlight": "v",
            "ipa": "/vaʃ/",
            "gloss": {
              "en": "cow",
              "fr": "vache",
              "es": "vaca",
              "de": "Kuh",
              "it": "mucca",
              "pt": "vaca",
              "ar": "بقرة",
              "zh": "奶牛",
              "nl": "koe",
              "prs": "گاو",
              "uk": "корова",
              "ps": "غوا",
              "sq": "lopë",
              "ka": "ძროხა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "voiture",
            "highlight": "v",
            "ipa": "/vwa.tyʁ/",
            "gloss": {
              "en": "car",
              "fr": "voiture",
              "es": "coche",
              "de": "Auto",
              "it": "macchina",
              "pt": "carro",
              "ar": "سيارة",
              "zh": "汽车",
              "nl": "auto",
              "prs": "موتر (خودرو)",
              "uk": "автомобіль",
              "ps": "موټر",
              "sq": "makinë",
              "ka": "მანქანა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "W",
    "lower": "w",
    "name": "double vé",
    "nameIpa": "/dublə.ve/",
    "category": "consonant",
    "variants": [
      {
        "id": "w-standard",
        "soundIpa": "/w/ ou /v/",
        "soundName": {
          "fr": "W (/w/ ou /v/)",
          "en": "W sound (/w/ or /v/)",
          "es": "Sonido W (/w/ o /v/)",
          "de": "W-Laut (/w/ oder /v/)",
          "it": "Suono W (/w/ o /v/)",
          "pt": "Som W (/w/ ou /v/)",
          "ar": "صوت W (/w/ أو /v/)",
          "zh": "W 读作 (/w/ 或 /v/)",
          "nl": "W-klank (/w/ of /v/)",
          "prs": "صوت W (/w/ یا /v/)",
          "uk": "Звук W (/w/ або /v/)",
          "ps": "W (/w/ یا /v/)",
          "sq": "W (/w/ ose /v/)",
          "ka": "W (/w/ ან /v/)"
        },
        "rule": {
          "fr": "Se prononce /w/ dans les mots anglais (web) et parfois /v/ dans les mots germaniques (wagon).",
          "en": "Sounds like /w/ in English loans (web) and /v/ in German loans (wagon).",
          "es": "Suena como /w/ en préstamos del inglés y /v/ en los de origen germánico.",
          "de": "Wird in englischen Wörtern wie /w/ und in deutschen wie /v/ gesprochen.",
          "it": "Si pronuncia /w/ nelle parole inglesi e /v/ in quelle germaniche.",
          "pt": "Soa /w/ em palavras inglesas e /v/ nas de origem alemã.",
          "ar": "يُنطق كـ /w/ في الكلمات الإنجليزية وكـ /v/ في بعض الكلمات الجرمانية.",
          "zh": "在源自英语的词中发 /w/，在源自德语的词中发 /v/。",
          "nl": "Klinkt als /w/ in Engelse leenwoorden en als /v/ in Duitse.",
          "prs": "در کلمات انگلیسی صدای «و» و در کلمات آلمانی صدای «و / ف» می‌دهد.",
          "uk": "У словах англійського походження звучить як /w/, німецького — /v/.",
          "ps": "په انګلیسي کلمو کې /w/ او ځینې وختونه په جرمني کلمو کې /v/ ویل کېږي.",
          "sq": "Shqiptohet /w/ në fjalë angleze dhe ndonjëherë /v/ në fjalë gjermanike.",
          "ka": "ინგლისურ სიტყვებში წარმოითქმის როგორც /w/, ხოლო გერმანულში როგორც /v/."
        },
        "words": [
          {
            "word": "wagon",
            "highlight": "w",
            "ipa": "/va.ɡɔ̃/",
            "gloss": {
              "en": "train carriage",
              "fr": "wagon",
              "es": "vagón",
              "de": "Waggon",
              "it": "vagone",
              "pt": "vagão",
              "ar": "عربة قطار",
              "zh": "车厢",
              "nl": "wagon",
              "prs": "واگن قطار",
              "uk": "вагон",
              "ps": "واګون (ګاډۍ)",
              "sq": "vagon",
              "ka": "ვაგონი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1612527670286-1912f78763f2?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "web",
            "highlight": "w",
            "ipa": "/wɛb/",
            "gloss": {
              "en": "web / internet",
              "fr": "web",
              "es": "web",
              "de": "Web",
              "it": "web",
              "pt": "web",
              "ar": "شبكة الإنترنت",
              "zh": "互联网",
              "nl": "web",
              "prs": "وب / انترنت",
              "uk": "веб / інтернет",
              "ps": "انټرنیټ / وېب",
              "sq": "internet",
              "ka": "ინტერნეტი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "X",
    "lower": "x",
    "name": "ixe",
    "nameIpa": "/iks/",
    "category": "consonant",
    "variants": [
      {
        "id": "x-ks",
        "soundIpa": "/ks/",
        "soundName": {
          "fr": "X sourd (/ks/)",
          "en": "X as /ks/",
          "es": "X como /ks/",
          "de": "X als /ks/",
          "it": "X come /ks/",
          "pt": "X como /ks/",
          "ar": "X كـ /ks/",
          "zh": "X 发 /ks/",
          "nl": "X als /ks/",
          "prs": "X به صورت /ks/",
          "uk": "X як /ks/",
          "ps": "بې غږه X (/ks/)",
          "sq": "X e shurdhët (/ks/)",
          "ka": "ყრუ X (/ks/)"
        },
        "rule": {
          "fr": "Prononcé /ks/ dans la plupart des mots courants (taxi, boxe).",
          "en": "Pronounced /ks/ in most common words like taxi or boxe.",
          "es": "Pronunciado /ks/ en la mayoría de palabras cotidianas.",
          "de": "Wird in den meisten Wörtern wie /ks/ gesprochen (Taxi).",
          "it": "Pronunciato /ks/ nella maggior parte delle parole comuni.",
          "pt": "Pronunciado /ks/ na maioria das palavras comuns.",
          "ar": "يُنطق /ks/ في معظم الكلمات الشائعة مثل taxi.",
          "zh": "在大多数常见词中发 /ks/。",
          "nl": "In de meeste woorden uitgesproken als /ks/.",
          "prs": "در بیشتر کلمات معمول مانند taxi یا boxe به صورت «کس» تلفظ می‌شود.",
          "uk": "Вимовляється як /ks/ у більшості слів (такі як taxi, boxe).",
          "ps": "په ډېرو عامو کلمو کې د /ks/ په توګه تلفظ کېږي.",
          "sq": "Shqiptohet /ks/ në shumicën e fjalëve të zakonshme.",
          "ka": "უმეტეს გავრცელებულ სიტყვებში წარმოითქმის როგორც /ks/."
        },
        "words": [
          {
            "word": "taxi",
            "highlight": "x",
            "ipa": "/tak.si/",
            "gloss": {
              "en": "taxi",
              "fr": "taxi",
              "es": "taxi",
              "de": "Taxi",
              "it": "taxi",
              "pt": "táxi",
              "ar": "تاكسي",
              "zh": "出租车",
              "nl": "taxi",
              "prs": "تکسی",
              "uk": "таксі",
              "ps": "ټیکسي",
              "sq": "taksi",
              "ka": "ტაქსი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1572013343866-dfdb9b416810?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "boxe",
            "highlight": "x",
            "ipa": "/bɔks/",
            "gloss": {
              "en": "boxing",
              "fr": "boxe",
              "es": "boxeo",
              "de": "Boxen",
              "it": "pugilato",
              "pt": "boxe",
              "ar": "ملاكمة",
              "zh": "拳击",
              "nl": "boksen",
              "prs": "بوکس",
              "uk": "бокс",
              "ps": "بوکس",
              "sq": "boks",
              "ka": "ბოქსი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        "id": "x-gz",
        "soundIpa": "/ɡz/",
        "soundName": {
          "fr": "X sonore (/ɡz/)",
          "en": "X as /ɡz/",
          "es": "X sonora (/ɡz/)",
          "de": "Stimmhaftes X (/ɡz/)",
          "it": "X sonora (/ɡz/)",
          "pt": "X sonoro (/ɡz/)",
          "ar": "X المجهورة (/ɡz/)",
          "zh": "X 发浊音 /ɡz/",
          "nl": "Stemhebbende X (/ɡz/)",
          "prs": "X به صورت /ɡz/",
          "uk": "X як /ɡz/",
          "ps": "غږلرونکی X (/ɡz/)",
          "sq": "X e zëshme (/ɡz/)",
          "ka": "მჟღერი X (/ɡz/)"
        },
        "rule": {
          "fr": "Dans le préfixe \"ex-\" suivi d'une voyelle, X se prononce /ɡz/.",
          "en": "In prefix \"ex-\" before a vowel, X sounds like /ɡz/.",
          "es": "En el prefijo \"ex-\" seguido de vocal, suena /ɡz/.",
          "de": "In der Vorsilbe \"ex-\" vor Vokal wird es wie /ɡz/ gesprochen.",
          "it": "Nel prefisso \"ex-\" seguito da vocale, si pronuncia /ɡz/.",
          "pt": "No prefixo \"ex-\" antes de vogal, soa como /ɡz/.",
          "ar": "في البادئة ex- المتبوعة بحرف علة، يُنطق كـ /ɡz/.",
          "zh": "在元音前的 ex- 前缀中，X 发浊音 /ɡz/。",
          "nl": "In het voorvoegsel \"ex-\" voor een klinker klinkt het als /ɡz/.",
          "prs": "در پیشوند -ex قبل از حرف صدادار به صورت «گز» تلفظ می‌شود.",
          "uk": "У префіксі «ex-» перед голосними вимовляється як /ɡz/.",
          "ps": "د \"ex-\" په پیل کې چې غږلرونکی توری ورپسې وي، X د /ɡz/ غږ کوي.",
          "sq": "Në parashtesën \"ex-\" e ndjekur nga një zanore, X shqiptohet /ɡz/.",
          "ka": "პრეფიქსში \"ex-\", რომელსაც მოსდევს ხმოვანი, X წარმოითქმის როგორც /ɡz/."
        },
        "words": [
          {
            "word": "exercice",
            "highlight": "x",
            "ipa": "/ɛɡ.zɛʁ.sis/",
            "gloss": {
              "en": "exercise",
              "fr": "exercice",
              "es": "ejercicio",
              "de": "Übung",
              "it": "esercizio",
              "pt": "exercício",
              "ar": "تمرين",
              "zh": "练习",
              "nl": "oefening",
              "prs": "تمرین",
              "uk": "вправа",
              "ps": "تمرین",
              "sq": "ushtrim",
              "ka": "ვარჯიში"
            },
            "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "examen",
            "highlight": "x",
            "ipa": "/ɛɡ.za.mɛ̃/",
            "gloss": {
              "en": "exam",
              "fr": "examen",
              "es": "examen",
              "de": "Prüfung",
              "it": "esame",
              "pt": "exame",
              "ar": "امتحان",
              "zh": "考试",
              "nl": "examen",
              "prs": "امتحان",
              "uk": "іспит",
              "ps": "ازموینه",
              "sq": "provim",
              "ka": "გამოცდა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "Y",
    "lower": "y",
    "name": "i grec",
    "nameIpa": "/i.ɡʁɛk/",
    "category": "vowel",
    "variants": [
      {
        "id": "y-standard",
        "soundIpa": "/i/ ou /j/",
        "soundName": {
          "fr": "Y grec (/i/ ou /j/)",
          "en": "Y sound (/i/ or /j/)",
          "es": "Sonido Y (/i/ o /j/)",
          "de": "Y-Laut (/i/ oder /j/)",
          "it": "Suono Y (/i/ o /j/)",
          "pt": "Som Y (/i/ ou /j/)",
          "ar": "صوت Y اليوناني (/i/ أو /j/)",
          "zh": "Y 读作 (/i/ 或 /j/)",
          "nl": "Y-klank (/i/ of /j/)",
          "prs": "صوت Y (/i/ یا /j/)",
          "uk": "Звук Y (/i/ або /j/)",
          "ps": "یوناني Y (/i/ یا /j/)",
          "sq": "Y greke (/i/ ose /j/)",
          "ka": "ბერძნული Y (/i/ ან /j/)"
        },
        "rule": {
          "fr": "Comme voyelle = /i/ (stylo). Comme semi-voyelle devant voyelle = /j/ (yeux).",
          "en": "Acts as vowel /i/ (stylo) or semi-vowel /j/ (yeux).",
          "es": "Funciona como vocal /i/ (stylo) o semivocal /j/ (yeux).",
          "de": "Wirkt als Vokal /i/ (stylo) oder Halbvokal /j/ (yeux).",
          "it": "Funziona come vocale /i/ (stylo) o semivocale /j/ (yeux).",
          "pt": "Funciona como vogal /i/ (stylo) ou semivogal /j/ (yeux).",
          "ar": "يعمل كحرف علة /i/ (stylo) أو شبه علة /j/ (yeux).",
          "zh": "单独作元音读 /i/，在元音前作半元音读 /j/。",
          "nl": "Werkt als klinker /i/ of halfklinker /j/.",
          "prs": "به عنوان حرف صدادار = «ای»، قبل از حرف صدادار = «ی».",
          "uk": "Як голосний звучить як /i/, перед іншим голосним — як /j/ (й).",
          "ps": "د غږلرونکي په توګه = /i/، د غږلرونکي مخکې د نیم غږلرونکي په توګه = /j/ (ی).",
          "sq": "Si zanore = /i/. Si gjysmë-zanore para një zanoreje = /j/.",
          "ka": "როგორც ხმოვანი = /i/, ხმოვნის წინ როგორც ნახევარხმოვანი = /j/."
        },
        "words": [
          {
            "word": "stylo",
            "highlight": "y",
            "ipa": "/sti.lo/",
            "gloss": {
              "en": "pen",
              "fr": "stylo",
              "es": "bolígrafo",
              "de": "Stift",
              "it": "penna",
              "pt": "caneta",
              "ar": "قلم",
              "zh": "钢笔",
              "nl": "pen",
              "prs": "قلم",
              "uk": "ручка",
              "ps": "قلم",
              "sq": "stilolaps",
              "ka": "კალამი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "yeux",
            "highlight": "y",
            "ipa": "/jø/",
            "gloss": {
              "en": "eyes",
              "fr": "yeux",
              "es": "ojos",
              "de": "Augen",
              "it": "occhi",
              "pt": "olhos",
              "ar": "عيون",
              "zh": "眼睛",
              "nl": "ogen",
              "prs": "چشم‌ها",
              "uk": "очі",
              "ps": "سترګې",
              "sq": "sy",
              "ka": "თვალები"
            },
            "imageUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "loyer",
            "highlight": "y",
            "ipa": "/lwa.je/",
            "gloss": {
              "en": "rent",
              "fr": "loyer",
              "es": "alquiler",
              "de": "Miete",
              "it": "affitto",
              "pt": "aluguel",
              "ar": "إيجار",
              "zh": "房租",
              "nl": "huur",
              "prs": "کرایه",
              "uk": "оренда",
              "ps": "کرایه",
              "sq": "qira",
              "ka": "ქირა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "Z",
    "lower": "z",
    "name": "zède",
    "nameIpa": "/zɛd/",
    "category": "consonant",
    "variants": [
      {
        "id": "z-standard",
        "soundIpa": "/z/",
        "soundName": {
          "fr": "Z vibrant (/z/)",
          "en": "Z sound (/z/)",
          "es": "Sonido Z (/z/)",
          "de": "Z-Laut (/z/)",
          "it": "Suono Z (/z/)",
          "pt": "Som Z (/z/)",
          "ar": "صوت Z الصوتي (/z/)",
          "zh": "浊齿音 Z (/z/)",
          "nl": "Z-klank (/z/)",
          "prs": "صوت Z (/z/)",
          "uk": "Звук Z (/z/)",
          "ps": "لړزېدونکی Z (/z/)",
          "sq": "Z vibrante (/z/)",
          "ka": "მჟღერი Z (/z/)"
        },
        "rule": {
          "fr": "Consonne voisée, vibration continue de la voix.",
          "en": "Voiced buzzing sound with steady vocal vibration.",
          "es": "Consonante sonora con zumbido continuo de la voz.",
          "de": "Stimmhafter Laut mit kontinuierlicher Vibration der Stimmbänder.",
          "it": "Consonante sonora con vibrazione continua della voce.",
          "pt": "Consoante sonora com vibração contínua da voz.",
          "ar": "صوت مجهور مع طنين واهتزاز مستمر للحبال الصوتية.",
          "zh": "声带持续振动发出的清脆蜂鸣浊音。",
          "nl": "Stemhebbende zoemende klank.",
          "prs": "صدای «ز» همراه با لرزش پیوسته تار‌های صوتی.",
          "uk": "Дзвінкий приголосний /z/ з безперервною вібрацією голосу.",
          "ps": "غږلرونکی توری، د غږ دوامداره لړزېدل.",
          "sq": "Bashkëtingëllore e zëshme, dridhje e vazhdueshme e zërit.",
          "ka": "მჟღერი თანხმოვანი, უწყვეტი ვიბრაციით."
        },
        "words": [
          {
            "word": "zèbre",
            "highlight": "z",
            "ipa": "/zɛbʁ/",
            "gloss": {
              "en": "zebra",
              "fr": "zèbre",
              "es": "cebra",
              "de": "Zebra",
              "it": "zebra",
              "pt": "zebra",
              "ar": "حمار وحشي",
              "zh": "斑马",
              "nl": "zebra",
              "prs": "گورخر",
              "uk": "зебра",
              "ps": "زیبرا",
              "sq": "sebrë",
              "ka": "ზებრა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1501706362039-c06b2d715385?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "zoo",
            "highlight": "z",
            "ipa": "/zo.o/",
            "gloss": {
              "en": "zoo",
              "fr": "zoo",
              "es": "zoo",
              "de": "Zoo",
              "it": "zoo",
              "pt": "zoológico",
              "ar": "حديقة حيوان",
              "zh": "动物园",
              "nl": "dierentuin",
              "prs": "باغ وحش",
              "uk": "зоопарк",
              "ps": "ژوبڼ",
              "sq": "kopsht zoologjik",
              "ka": "ზოოპარკი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "zéro",
            "highlight": "z",
            "ipa": "/ze.ʁo/",
            "gloss": {
              "en": "zero",
              "fr": "zéro",
              "es": "cero",
              "de": "Null",
              "it": "zero",
              "pt": "zero",
              "ar": "صفر",
              "zh": "零",
              "nl": "nul",
              "prs": "صفر",
              "uk": "нуль",
              "ps": "صفر",
              "sq": "zero",
              "ka": "ნული"
            },
            "imageUrl": "https://images.unsplash.com/photo-1520413766594-6e635f8d9908?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "CH",
    "lower": "ch",
    "name": "che",
    "nameIpa": "/ʃ/",
    "category": "digraph",
    "variants": [
      {
        "id": "ch-standard",
        "soundIpa": "/ʃ/",
        "soundName": {
          "fr": "Son CH (/ʃ/)",
          "en": "CH sound (/ʃ/)",
          "es": "Sonido CH (/ʃ/)",
          "de": "CH-Laut (/ʃ/)",
          "it": "Suono CH (/ʃ/)",
          "pt": "Som CH (/ʃ/)",
          "ar": "صوت CH الشيني (/ʃ/)",
          "zh": "组合 CH (/ʃ/)",
          "nl": "CH-klank (/ʃ/)",
          "prs": "صوت CH (/ʃ/)",
          "uk": "Звук CH (/ʃ/)",
          "ps": "د CH غږ (/ʃ/)",
          "sq": "Tingulli CH (/ʃ/)",
          "ka": "CH ბგერა (/ʃ/)"
        },
        "rule": {
          "fr": "En français, CH produit toujours le son \"ch\" doux (comme \"sh\" en anglais).",
          "en": "In French, CH always makes the soft \"sh\" sound (/ʃ/).",
          "es": "En francés, CH siempre suena como la \"sh\" inglesa (/ʃ/).",
          "de": "Im Französischen klingt CH wie \"sch\" (/ʃ/).",
          "it": "In francese CH produce sempre il suono \"sc\" dolce (/ʃ/).",
          "pt": "Em francês, CH sempre soa como \"ch\" em chave (/ʃ/).",
          "ar": "في الفرنسية، يُنطق CH دائماً كحرف الشين /ʃ/.",
          "zh": "在法语中，CH 始终发轻柔的 /ʃ/ 音（如同英语 sh）。",
          "nl": "In het Frans klinkt CH altijd als \"sj\" (/ʃ/).",
          "prs": "در فرانسوی ترکیب CH همیشه صدای «ش» می‌دهد.",
          "uk": "У французькій мові CH завжди позначає м'який звук /ʃ/ (як ш).",
          "ps": "په فرانسوي کې، CH تل نرم \"ش\" غږ جوړوي.",
          "sq": "Në frëngjisht, CH prodhon gjithmonë tingullin e butë \"sh\".",
          "ka": "ფრანგულში CH ყოველთვის წარმოქმნის რბილ \"შ\" ბგერას."
        },
        "words": [
          {
            "word": "chat",
            "highlight": "ch",
            "ipa": "/ʃa/",
            "gloss": {
              "en": "cat",
              "fr": "chat",
              "es": "gato",
              "de": "Katze",
              "it": "gatto",
              "pt": "gato",
              "ar": "قط",
              "zh": "猫",
              "nl": "kat",
              "prs": "پشک (گربه)",
              "uk": "кіт",
              "ps": "پیشو",
              "sq": "mace",
              "ka": "კატა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "chocolat",
            "highlight": "ch",
            "ipa": "/ʃɔ.kɔ.la/",
            "gloss": {
              "en": "chocolate",
              "fr": "chocolat",
              "es": "chocolate",
              "de": "Schokolade",
              "it": "cioccolato",
              "pt": "chocolate",
              "ar": "شوكولاتة",
              "zh": "巧克力",
              "nl": "chocolade",
              "prs": "چاکلیت",
              "uk": "шоколад",
              "ps": "چاکلېټ",
              "sq": "çokollatë",
              "ka": "შოკოლადი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "château",
            "highlight": "ch",
            "ipa": "/ʃa.to/",
            "gloss": {
              "en": "castle",
              "fr": "château",
              "es": "castillo",
              "de": "Schloss",
              "it": "castello",
              "pt": "castelo",
              "ar": "قلعة",
              "zh": "城堡",
              "nl": "kasteel",
              "prs": "قلعه",
              "uk": "замок",
              "ps": "کلا / ماڼۍ",
              "sq": "kështjellë",
              "ka": "ციხესიმაგრე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1571301092535-61a418b457dd?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "OU",
    "lower": "ou",
    "name": "ou",
    "nameIpa": "/u/",
    "category": "digraph",
    "variants": [
      {
        "id": "ou-standard",
        "soundIpa": "/u/",
        "soundName": {
          "fr": "Son OU (/u/)",
          "en": "OU sound (/u/)",
          "es": "Sonido OU (/u/)",
          "de": "OU-Laut (/u/)",
          "it": "Suono OU (/u/)",
          "pt": "Som OU (/u/)",
          "ar": "صوت OU المدود (/u/)",
          "zh": "组合 OU (/u/)",
          "nl": "OU-klank (/u/)",
          "prs": "صوت OU (/u/)",
          "uk": "Звук OU (/u/)",
          "ps": "د OU غږ (/u/)",
          "sq": "Tingulli OU (/u/)",
          "ka": "OU ბგერა (/u/)"
        },
        "rule": {
          "fr": "La combinaison OU donne le son \"ou\" profond (comme \"u\" en espagnol ou \"oo\" en anglais).",
          "en": "The combination OU produces a deep \"oo\" sound (/u/).",
          "es": "La combinación OU produce el sonido \"u\" (/u/).",
          "de": "Die Kombination OU klingt wie ein deutsches langes \"u\" (/u/).",
          "it": "La combinazione OU si pronuncia come la \"u\" italiana (/u/).",
          "pt": "A combinação OU tem som de \"u\" (/u/).",
          "ar": "يعطي الحرفان OU صوت الواو الممدودة /u/.",
          "zh": "组合 OU 发深厚的圆唇音 /u/（类似汉语拼音“乌”）。",
          "nl": "De combinatie OU klinkt als \"oe\" (/u/).",
          "prs": "ترکیب OU صدای «او» عمیق و پر می‌دهد.",
          "uk": "Буквосполучення OU завжди звучить як глибоке /u/ (як у).",
          "ps": "د OU ترکیب ژور \"او\" غږ ورکوي.",
          "sq": "Kombinimi OU jep tingullin e thellë \"u\".",
          "ka": "OU კომბინაცია იძლევა ღრმა \"უ\" ბგერას."
        },
        "words": [
          {
            "word": "ours",
            "highlight": "ou",
            "ipa": "/uʁs/",
            "gloss": {
              "en": "bear",
              "fr": "ours",
              "es": "oso",
              "de": "Bär",
              "it": "orso",
              "pt": "urso",
              "ar": "دب",
              "zh": "熊",
              "nl": "beer",
              "prs": "خرس",
              "uk": "ведмідь",
              "ps": "ایږه",
              "sq": "arushë",
              "ka": "დათვი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "soupe",
            "highlight": "ou",
            "ipa": "/sup/",
            "gloss": {
              "en": "soup",
              "fr": "soupe",
              "es": "sopa",
              "de": "Suppe",
              "it": "zuppa",
              "pt": "sopa",
              "ar": "حساء",
              "zh": "汤",
              "nl": "soep",
              "prs": "شوربا (سوپ)",
              "uk": "суп",
              "ps": "ښوروا",
              "sq": "supë",
              "ka": "წვნიანი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "genou",
            "highlight": "ou",
            "ipa": "/ʒə.nu/",
            "gloss": {
              "en": "knee",
              "fr": "genou",
              "es": "rodilla",
              "de": "Knie",
              "it": "ginocchio",
              "pt": "joelho",
              "ar": "ركبة",
              "zh": "膝盖",
              "nl": "knie",
              "prs": "زانو",
              "uk": "коліно",
              "ps": "زنګون",
              "sq": "gju",
              "ka": "მუხლი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1782766835676-11f373bc5c45?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "ON",
    "lower": "on",
    "name": "on / om",
    "nameIpa": "/ɔ̃/",
    "category": "digraph",
    "variants": [
      {
        "id": "on-nasal",
        "soundIpa": "/ɔ̃/",
        "soundName": {
          "fr": "ON nasal (/ɔ̃/)",
          "en": "Nasal ON (/ɔ̃/)",
          "es": "ON nasal (/ɔ̃/)",
          "de": "Nasales ON (/ɔ̃/)",
          "it": "ON nasale (/ɔ̃/)",
          "pt": "ON nasal (/ɔ̃/)",
          "ar": "صوت ON الأنفي (/ɔ̃/)",
          "zh": "鼻元音 ON (/ɔ̃/)",
          "nl": "Nasale ON (/ɔ̃/)",
          "prs": "ON تودماغی (/ɔ̃/)",
          "uk": "Носовий ON (/ɔ̃/)",
          "ps": "پوزیز ON (/ɔ̃/)",
          "sq": "ON hundore (/ɔ̃/)",
          "ka": "ცხვირისმიერი ON (/ɔ̃/)"
        },
        "rule": {
          "fr": "Voyelle nasale : l'air passe simultanément par la bouche et le nez, lèvres arrondies.",
          "en": "Nasal vowel: rounded lips while air flows through mouth and nose simultaneously.",
          "es": "Vocal nasal: labios redondeados mientras el aire pasa por boca y nariz.",
          "de": "Nasaler Vokal: Lippen gerundet, Luft strömt durch Mund und Nase.",
          "it": "Vocale nasale: labbra arrotondate, l'aria passa da bocca e naso.",
          "pt": "Vogal nasal: lábios arredondados com ar ressoando pelo nariz.",
          "ar": "حرف علة أنفي مستدير يمر فيه الهواء من الفم والأنف معاً.",
          "zh": "圆唇发音，气流同时通过口腔与鼻腔共鸣的鼻化元音。",
          "nl": "Nasale klinker met ronde lippen.",
          "prs": "حرف صدادار تودماغی: لب‌ها گرد و خروج هوا همزمان از دهان و بینی.",
          "uk": "Носовий голосний: повітря виходить одночасно через рот і ніс.",
          "ps": "پوزیز غږ: هوا په ورته وخت کې د خولې او پوزې له لارې وځي، شونډې ګردې وي.",
          "sq": "Zanore hundore: ajri kalon njëkohësisht përmes gojës dhe hundës.",
          "ka": "ცხვირისმიერი ხმოვანი: ჰაერი ერთდროულად გამოდის პირიდან და ცხვირიდან."
        },
        "words": [
          {
            "word": "ballon",
            "highlight": "on",
            "ipa": "/ba.lɔ̃/",
            "gloss": {
              "en": "balloon / ball",
              "fr": "ballon",
              "es": "globo / balón",
              "de": "Ballon / Ball",
              "it": "pallone",
              "pt": "balão",
              "ar": "بالون",
              "zh": "气球",
              "nl": "ballon",
              "prs": "توپ / بالون",
              "uk": "м’яч / кулька",
              "ps": "توپ / بالون",
              "sq": "top / balonë",
              "ka": "ბურთი / ბუშტი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "pont",
            "highlight": "on",
            "ipa": "/pɔ̃/",
            "gloss": {
              "en": "bridge",
              "fr": "pont",
              "es": "puente",
              "de": "Brücke",
              "it": "ponte",
              "pt": "ponte",
              "ar": "جسر",
              "zh": "桥",
              "nl": "brug",
              "prs": "پل",
              "uk": "міст",
              "ps": "پل",
              "sq": "urë",
              "ka": "ხიდი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "maison",
            "highlight": "on",
            "ipa": "/mɛ.zɔ̃/",
            "gloss": {
              "en": "house",
              "fr": "maison",
              "es": "casa",
              "de": "Haus",
              "it": "casa",
              "pt": "casa",
              "ar": "منزل",
              "zh": "房子",
              "nl": "huis",
              "prs": "خانه",
              "uk": "будинок",
              "ps": "کور",
              "sq": "shtëpi",
              "ka": "სახლი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "OI",
    "lower": "oi",
    "name": "oi",
    "nameIpa": "/wa/",
    "category": "digraph",
    "variants": [
      {
        "id": "oi-standard",
        "soundIpa": "/wa/",
        "soundName": {
          "fr": "Son OI (/wa/)",
          "en": "OI sound (/wa/)",
          "es": "Sonido OI (/wa/)",
          "de": "OI-Laut (/wa/)",
          "it": "Suono OI (/wa/)",
          "pt": "Som OI (/wa/)",
          "ar": "صوت OI الدائري (/wa/)",
          "zh": "组合 OI (/wa/)",
          "nl": "OI-klank (/wa/)",
          "prs": "صوت OI (/wa/)",
          "uk": "Звук OI (/wa/)",
          "ps": "د OI غږ (/wa/)",
          "sq": "Tingulli OI (/wa/)",
          "ka": "OI ბგერა (/wa/)"
        },
        "rule": {
          "fr": "En français, la combinaison OI se prononce toujours \"oua\" (/wa/).",
          "en": "In French, the combination OI always sounds like \"wa\" (/wa/).",
          "es": "En francés, OI siempre se pronuncia como \"ua\" (/wa/).",
          "de": "Im Französischen klingt OI wie \"wa\" (/wa/).",
          "it": "In francese OI si pronuncia sempre \"ua\" (/wa/).",
          "pt": "Em francês, OI soa sempre como \"ua\" (/wa/).",
          "ar": "في الفرنسية، يُنطق الحرفان OI دائماً كـ \"وا\" (/wa/).",
          "zh": "在法语中，组合 OI 始终读作 /wa/（类似“哇”）。",
          "nl": "In het Frans klinkt OI altijd als \"wa\" (/wa/).",
          "prs": "ترکیب OI در فرانسوی همیشه صدای «وا» می‌دهد.",
          "uk": "Буквосполучення OI завжди читається як «уа» (/wa/).",
          "ps": "په فرانسوي کې، د OI ترکیب تل \"وا\" (/wa/) تلفظ کېږي.",
          "sq": "Në frëngjisht, kombinimi OI shqiptohet gjithmonë \"ua\" (/wa/).",
          "ka": "ფრანგულში OI კომბინაცია ყოველთვის წარმოითქმის როგორც \"უა\" (/wa/)."
        },
        "words": [
          {
            "word": "oiseau",
            "highlight": "oi",
            "ipa": "/wa.zo/",
            "gloss": {
              "en": "bird",
              "fr": "oiseau",
              "es": "pájaro",
              "de": "Vogel",
              "it": "uccello",
              "pt": "pássaro",
              "ar": "طائر",
              "zh": "鸟",
              "nl": "vogel",
              "prs": "پرنده",
              "uk": "птах",
              "ps": "مرغۍ",
              "sq": "zog",
              "ka": "ჩიტი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "poisson",
            "highlight": "oi",
            "ipa": "/pwa.sɔ̃/",
            "gloss": {
              "en": "fish",
              "fr": "poisson",
              "es": "pez",
              "de": "Fisch",
              "it": "pesce",
              "pt": "peixe",
              "ar": "سمك",
              "zh": "鱼",
              "nl": "vis",
              "prs": "ماهی",
              "uk": "риба",
              "ps": "کب",
              "sq": "peshk",
              "ka": "თევზი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "boîte",
            "highlight": "oi",
            "ipa": "/bwat/",
            "gloss": {
              "en": "box",
              "fr": "boîte",
              "es": "caja",
              "de": "Kiste / Schachtel",
              "it": "scatola",
              "pt": "caixa",
              "ar": "صندوق / علبة",
              "zh": "盒子 / 箱子",
              "nl": "doos",
              "prs": "جعبه",
              "uk": "коробка",
              "ps": "بکس",
              "sq": "kuti",
              "ka": "ყუთი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "noir",
            "highlight": "oi",
            "ipa": "/nwaʁ/",
            "gloss": {
              "en": "black",
              "fr": "noir",
              "es": "negro",
              "de": "schwarz",
              "it": "nero",
              "pt": "preto",
              "ar": "أسود",
              "zh": "黑色",
              "nl": "zwart",
              "prs": "سیاه",
              "uk": "чорний",
              "ps": "تور",
              "sq": "i zi",
              "ka": "შავი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1751699413631-bf89bc43f54d?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "EU = e",
    "lower": "eu",
    "name": "eu",
    "nameIpa": "/ø/",
    "category": "digraph",
    "variants": [
      {
        "id": "eu-standard",
        "soundIpa": "/ø/",
        "soundName": {
          "fr": "Son EU = e (/ø/)",
          "en": "EU = e sound (/ø/)",
          "es": "Sonido EU = e (/ø/)",
          "de": "EU = e-Laut (/ø/)",
          "it": "Suono EU = e (/ø/)",
          "pt": "Som EU = e (/ø/)",
          "ar": "صوت EU = e (/ø/)",
          "zh": "EU = e 组合 (/ø/)",
          "nl": "EU = e-klank (/ø/)",
          "prs": "صوت EU = e (/ø/)",
          "uk": "Звук EU = e (/ø/)",
          "ps": "د EU = e غږ (/ø/)",
          "sq": "Tingulli EU = e (/ø/)",
          "ka": "EU = e ბგერა (/ø/)"
        },
        "rule": {
          "fr": "La combinaison EU se prononce généralement /ø/ (comme un « e » fermé, comme dans « cheveu »).",
          "en": "The combination EU is generally pronounced /ø/ (a closed 'e' sound, as in \"cheveu\").",
          "es": "La combinación EU suele pronunciarse /ø/ (como una 'e' cerrada, como en «cheveu»).",
          "de": "Die Kombination EU wird meist als /ø/ gesprochen (wie in «cheveu»).",
          "it": "La combinazione EU si pronuncia generalmente /ø/ (come una 'e' chiusa, come in «cheveu»).",
          "pt": "A combinação EU pronuncia-se geralmente /ø/ (como um 'e' fechado, como em «cheveu»).",
          "ar": "التركيبة EU تُنطق كصوت e مغلق /ø/ (كما في كلمة « cheveu »).",
          "zh": "组合 EU 通常读作圆唇闭元音 /ø/（如 \"cheveu\"）。",
          "nl": "De combinatie EU klinkt meestal als /ø/ (zoals in «cheveu»).",
          "prs": "ترکیب EU صدای e بسته /ø/ می‌دهد (مانند «cheveu»).",
          "uk": "Буквосполучення EU зазвичай читається як /ø/ (як у «cheveu»).",
          "ps": "د EU ترکیب د تړلي e /ø/ په څېر تلفظ کېږي (لکه په «cheveu» کې).",
          "sq": "Kombinimi EU shqiptohet përgjithësisht /ø/ (si te «cheveu»).",
          "ka": "EU კომბინაცია წარმოითქმის როგორც /ø/ (როგორც «cheveu»-ში)."
        },
        "words": [
          {
            "word": "cheveu",
            "highlight": "eu",
            "ipa": "/ʃə.vø/",
            "gloss": {
              "en": "hair",
              "fr": "cheveu",
              "es": "cabello / pelo",
              "de": "Haar",
              "it": "capello",
              "pt": "cabelo",
              "ar": "شعر",
              "zh": "头发",
              "nl": "haar",
              "prs": "مو",
              "uk": "волосся",
              "ps": "ویښته",
              "sq": "flokë",
              "ka": "თმა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1620939391250-eb822ac0818a?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "EUR",
    "lower": "eur",
    "name": "eur",
    "nameIpa": "/œʁ/",
    "category": "digraph",
    "variants": [
      {
        "id": "eur-standard",
        "soundIpa": "/œʁ/",
        "soundName": {
          "fr": "Son EUR (/œʁ/)",
          "en": "EUR sound (/œʁ/)",
          "es": "Sonido EUR (/œʁ/)",
          "de": "EUR-Laut (/œʁ/)",
          "it": "Suono EUR (/œʁ/)",
          "pt": "Som EUR (/œʁ/)",
          "ar": "صوت EUR (/œʁ/)",
          "zh": "EUR 组合 (/œʁ/)",
          "nl": "EUR-klank (/œʁ/)",
          "prs": "صوت EUR (/œʁ/)",
          "uk": "Звук EUR (/œʁ/)",
          "ps": "د EUR غږ (/œʁ/)",
          "sq": "Tingulli EUR (/œʁ/)",
          "ka": "EUR ბგერა (/œʁ/)"
        },
        "rule": {
          "fr": "La terminaison EUR se prononce /œʁ/ (comme dans « facteur »).",
          "en": "The ending EUR is pronounced /œʁ/ (as in \"facteur\").",
          "es": "La terminación EUR se pronuncia /œʁ/ (como en «facteur»).",
          "de": "Die Endung EUR wird als /œʁ/ gesprochen (wie in «facteur»).",
          "it": "La desinenza EUR si pronuncia /œʁ/ (come in «facteur»).",
          "pt": "A terminação EUR pronuncia-se /œʁ/ (como em «facteur»).",
          "ar": "اللاحقة EUR تُنطق /œʁ/ (كما في « facteur »).",
          "zh": "词尾 EUR 读作 /œʁ/（如 \"facteur\"）。",
          "nl": "De uitgang EUR klinkt als /œʁ/ (zoals in «facteur»).",
          "prs": "پسوند EUR صدای /œʁ/ می‌دهد (مانند «facteur»).",
          "uk": "Закінчення EUR вимовляється як /œʁ/ (як у «facteur»).",
          "ps": "د EUR پای د /œʁ/ په توګه تلفظ کېږي (لکه په «facteur» کې).",
          "sq": "Prapashtesa EUR shqiptohet /œʁ/ (si te «facteur»).",
          "ka": "EUR დაბოლოება წარმოითქმის როგორც /œʁ/ (როგორც «facteur»-ში)."
        },
        "words": [
          {
            "word": "facteur",
            "highlight": "eur",
            "ipa": "/fak.tœʁ/",
            "gloss": {
              "en": "mail carrier",
              "fr": "facteur",
              "es": "cartero",
              "de": "Briefträger",
              "it": "postino",
              "pt": "carteiro",
              "ar": "ساعي البريد",
              "zh": "邮递员",
              "nl": "postbode",
              "prs": "پسته‌رسان",
              "uk": "листоноша",
              "ps": "پوسته رسوونکی",
              "sq": "postier",
              "ka": "ფოსტალიონი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1745968358029-39659409d1ce?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "IN = UN",
    "lower": "in / un",
    "name": "in",
    "nameIpa": "/ɛ̃/",
    "category": "digraph",
    "variants": [
      {
        "id": "in-un-nasal",
        "soundIpa": "/ɛ̃/",
        "soundName": {
          "fr": "Son IN = UN (/ɛ̃/)",
          "en": "IN = UN sound (/ɛ̃/)",
          "es": "Sonido IN = UN (/ɛ̃/)",
          "de": "IN = UN-Laut (/ɛ̃/)",
          "it": "Suono IN = UN (/ɛ̃/)",
          "pt": "Som IN = UN (/ɛ̃/)",
          "ar": "صوت IN = UN الأنفي (/ɛ̃/)",
          "zh": "IN = UN 鼻元音 (/ɛ̃/)",
          "nl": "IN = UN-klank (/ɛ̃/)",
          "prs": "صوت IN = UN تودماغی (/ɛ̃/)",
          "uk": "Носовий звук IN = UN (/ɛ̃/)",
          "ps": "د IN = UN پوزیز غږ (/ɛ̃/)",
          "sq": "Tingulli IN = UN (/ɛ̃/)",
          "ka": "IN = UN ბგერა (/ɛ̃/)"
        },
        "rule": {
          "fr": "Les graphies IN et UN produisent le même son nasal /ɛ̃/ (comme dans « lapin » et « un »).",
          "en": "The spellings IN and UN produce the same nasal sound /ɛ̃/ (as in \"lapin\" and \"un\").",
          "es": "Las grafías IN y UN producen el mismo sonido nasal /ɛ̃/.",
          "de": "Die Schreibweisen IN und UN erzeugen denselben nasalen Laut /ɛ̃/.",
          "it": "Le grafie IN e UN producono lo stesso suono nasale /ɛ̃/.",
          "pt": "As grafias IN e UN produzem o mesmo som nasal /ɛ̃/.",
          "ar": "الرسمان IN و UN يعطيان نفس الصوت الأنفي /ɛ̃/ (كما في « lapin » و « un »).",
          "zh": "拼写 IN 和 UN 发相同的鼻元音 /ɛ̃/（如 \"lapin\" 和 \"un\"）。",
          "nl": "IN en UN produceren dezelfde nasale klank /ɛ̃/.",
          "prs": "نوشتار IN و UN هر دو صدای تودماغی /ɛ̃/ تولید می‌کنند.",
          "uk": "Буквосполучення IN та UN утворюють однаковий носовий звук /ɛ̃/.",
          "ps": "د IN او UN لیکنه یو شان پوزیز غږ /ɛ̃/ رامنځته کوي.",
          "sq": "Shkronjat IN dhe UN prodhojnë të njëjtin tingull hundor /ɛ̃/.",
          "ka": "IN და UN იძლევა ერთსა და იმავე ცხვირისმიერ ბგერას /ɛ̃/."
        },
        "words": [
          {
            "word": "lapin",
            "highlight": "in",
            "ipa": "/la.pɛ̃/",
            "gloss": {
              "en": "rabbit",
              "fr": "lapin",
              "es": "conejo",
              "de": "Hase",
              "it": "coniglio",
              "pt": "coelho",
              "ar": "أرنب",
              "zh": "兔子",
              "nl": "konijn",
              "prs": "خرگوش",
              "uk": "кролик",
              "ps": "سوی",
              "sq": "lepuri",
              "ka": "კურდღელი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "un",
            "highlight": "un",
            "ipa": "/œ̃/",
            "gloss": {
              "en": "one (1)",
              "fr": "un",
              "es": "uno (1)",
              "de": "eins (1)",
              "it": "uno (1)",
              "pt": "um (1)",
              "ar": "واحد (١)",
              "zh": "一 (1)",
              "nl": "één (1)",
              "prs": "یک (۱)",
              "uk": "один (1)",
              "ps": "یو (۱)",
              "sq": "një (1)",
              "ka": "ერთი (1)"
            },
            "imageUrl": "https://images.unsplash.com/photo-1621440318464-72633426377b?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "AN / EN",
    "lower": "an / en",
    "name": "an",
    "nameIpa": "/ɑ̃/",
    "category": "digraph",
    "variants": [
      {
        "id": "an-en-nasal",
        "soundIpa": "/ɑ̃/",
        "soundName": {
          "fr": "Son AN / EN (/ɑ̃/)",
          "en": "AN / EN sound (/ɑ̃/)",
          "es": "Sonido AN / EN (/ɑ̃/)",
          "de": "AN / EN-Laut (/ɑ̃/)",
          "it": "Suono AN / EN (/ɑ̃/)",
          "pt": "Som AN / EN (/ɑ̃/)",
          "ar": "صوت AN / EN الأنفي (/ɑ̃/)",
          "zh": "AN / EN 鼻元音 (/ɑ̃/)",
          "nl": "AN / EN-klank (/ɑ̃/)",
          "prs": "صوت AN / EN تودماغی (/ɑ̃/)",
          "uk": "Носовий звук AN / EN (/ɑ̃/)",
          "ps": "د AN / EN پوزیز غږ (/ɑ̃/)",
          "sq": "Tingulli AN / EN (/ɑ̃/)",
          "ka": "AN / EN ბგერა (/ɑ̃/)"
        },
        "rule": {
          "fr": "Les graphies AN et EN produisent le même son nasal ouvert /ɑ̃/ (comme dans « enfants »).",
          "en": "The spellings AN and EN make the same open nasal vowel /ɑ̃/ (as in \"enfants\").",
          "es": "Las grafías AN y EN producen el mismo sonido nasal abierto /ɑ̃/.",
          "de": "Die Schreibweisen AN und EN erzeugen denselben offenen Nasallaut /ɑ̃/.",
          "it": "Le grafie AN e EN producono lo stesso suono nasale aperto /ɑ̃/.",
          "pt": "As grafias AN e EN produzem o mesmo som nasal aberto /ɑ̃/.",
          "ar": "الحرفان AN و EN يُنطقان بنفس الصوت الأنفي المفتوح /ɑ̃/ (كما في « enfants »).",
          "zh": "拼写 AN 和 EN 发相同的开鼻元音 /ɑ̃/（如 \"enfants\" 中）。",
          "nl": "AN en EN produceren dezelfde open nasale klank /ɑ̃/.",
          "prs": "ترکیب‌های AN و EN هر دو صدای تودماغی باز /ɑ̃/ تولید می‌کنند.",
          "uk": "Буквосполучення AN та EN вимовляються однаково як відкритий носовий звук /ɑ̃/.",
          "ps": "د AN او EN ترکیبونه یو شان پرانیستی پوزیز غږ /ɑ̃/ جوړوي.",
          "sq": "Kombinimet AN dhe EN prodhojnë të njëjtin tingull hundor /ɑ̃/.",
          "ka": "AN და EN იძლევა ერთსა და იმავე ღია ცხვირისმიერ ბგერას /ɑ̃/."
        },
        "words": [
          {
            "word": "enfants",
            "highlight": "en",
            "ipa": "/ɑ̃.fɑ̃/",
            "gloss": {
              "en": "children",
              "fr": "enfants",
              "es": "niños",
              "de": "Kinder",
              "it": "bambini",
              "pt": "crianças",
              "ar": "أطفال",
              "zh": "孩子们",
              "nl": "kinderen",
              "prs": "کودکان",
              "uk": "діти",
              "ps": "ماشومان",
              "sq": "fëmijët",
              "ka": "ბავშვები"
            },
            "imageUrl": "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "EUIL / EUILLE",
    "lower": "euil / euille",
    "name": "euil",
    "nameIpa": "/œj/",
    "category": "digraph",
    "variants": [
      {
        "id": "euil-standard",
        "soundIpa": "/œj/",
        "soundName": {
          "fr": "Son EUIL / EUILLE (/œj/)",
          "en": "EUIL / EUILLE sound (/œj/)",
          "es": "Sonido EUIL / EUILLE (/œj/)",
          "de": "EUIL / EUILLE-Laut (/œj/)",
          "it": "Suono EUIL / EUILLE (/œj/)",
          "pt": "Som EUIL / EUILLE (/œj/)",
          "ar": "صوت EUIL / EUILLE (/œj/)",
          "zh": "EUIL / EUILLE 组合 (/œj/)",
          "nl": "EUIL / EUILLE-klank (/œj/)",
          "prs": "صوت EUIL / EUILLE (/œj/)",
          "uk": "Звук EUIL / EUILLE (/œj/)",
          "ps": "د EUIL / EUILLE غږ (/œj/)",
          "sq": "Tingulli EUIL / EUILLE (/œj/)",
          "ka": "EUIL / EUILLE ბგერა (/œj/)"
        },
        "rule": {
          "fr": "Au masculin « euil », au féminin « euille », ce groupe produit le son /œj/ (comme dans « fauteuil » et « feuille »).",
          "en": "Masculine \"euil\", feminine \"euille\", pronounced /œj/ (as in \"fauteuil\" and \"feuille\").",
          "es": "En masculino «euil», en femenino «euille», suena /œj/.",
          "de": "Männlich «euil», weiblich «euille», wird /œj/ gesprochen.",
          "it": "Al maschile «euil», al femminile «euille», si pronuncia /œj/.",
          "pt": "No masculino «euil», no feminino «euille», soa /œj/.",
          "ar": "يُنطق /œj/ (بالمذكر « euil » والمؤنث « euille » كما في « fauteuil » و « feuille »).",
          "zh": "阳性写作 \"euil\"，阴性写作 \"euille\"，发音为 /œj/。",
          "nl": "Mannelijk «euil», vrouwelijk «euille», klinkt als /œj/.",
          "prs": "در مذکر «euil» و در مؤنث «euille»، صدای /œj/ می‌دهد.",
          "uk": "У чоловічому роді «euil», у жіночому «euille», вимовляється як /œj/.",
          "ps": "په مذکر کې «euil» او په مؤنث کې «euille»، د /œj/ غږ جوړوي.",
          "sq": "Në mashkullore «euil», në femërore «euille», shqiptohet /œj/.",
          "ka": "მამრობითში «euil», მდედრობითში «euille», წარმოითქმის როგორც /œj/."
        },
        "words": [
          {
            "word": "fauteuil",
            "highlight": "euil",
            "ipa": "/fo.tœj/",
            "gloss": {
              "en": "armchair",
              "fr": "fauteuil",
              "es": "sillón",
              "de": "Sessel",
              "it": "poltrona",
              "pt": "poltrona",
              "ar": "كرسي بذراعين",
              "zh": "扶手椅",
              "nl": "leunstoel",
              "prs": "مبل راحتی",
              "uk": "крісло",
              "ps": "ارام څوکۍ",
              "sq": "kolltuk",
              "ka": "სავარძელი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "feuille",
            "highlight": "euille",
            "ipa": "/fœj/",
            "gloss": {
              "en": "leaf",
              "fr": "feuille",
              "es": "hoja",
              "de": "Blatt",
              "it": "foglia",
              "pt": "folha",
              "ar": "ورقة شجر",
              "zh": "树叶",
              "nl": "blad",
              "prs": "برگ",
              "uk": "листок",
              "ps": "پاڼه",
              "sq": "gjethe",
              "ka": "ფოთოლი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "AIL",
    "lower": "ail",
    "name": "ail",
    "nameIpa": "/aj/",
    "category": "digraph",
    "variants": [
      {
        "id": "ail-standard",
        "soundIpa": "/aj/",
        "soundName": {
          "fr": "Son AIL (/aj/)",
          "en": "AIL sound (/aj/)",
          "es": "Sonido AIL (/aj/)",
          "de": "AIL-Laut (/aj/)",
          "it": "Suono AIL (/aj/)",
          "pt": "Som AIL (/aj/)",
          "ar": "صوت AIL (/aj/)",
          "zh": "AIL 组合 (/aj/)",
          "nl": "AIL-klank (/aj/)",
          "prs": "صوت AIL (/aj/)",
          "uk": "Звук AIL (/aj/)",
          "ps": "د AIL غږ (/aj/)",
          "sq": "Tingulli AIL (/aj/)",
          "ka": "AIL ბგერა (/aj/)"
        },
        "rule": {
          "fr": "La combinaison AIL (ou AILLE) se prononce /aj/ (comme dans « portail »).",
          "en": "The combination AIL (or AILLE) is pronounced /aj/ (as in \"portail\").",
          "es": "La combinación AIL se pronuncia /aj/ (como en «portail»).",
          "de": "Die Verbindung AIL wird als /aj/ gesprochen (wie in «portail»).",
          "it": "La combinazione AIL si pronuncia /aj/ (come in «portail»).",
          "pt": "A combinação AIL pronuncia-se /aj/ (como em «portail»).",
          "ar": "التركيبة AIL تُنطق /aj/ (كما في « portail »).",
          "zh": "组合 AIL 读作 /aj/（如 \"portail\"）。",
          "nl": "De combinatie AIL klinkt als /aj/ (zoals in «portail»).",
          "prs": "ترکیب AIL صدای /aj/ می‌دهد (مانند «portail»).",
          "uk": "Буквосполучення AIL вимовляється як /aj/ (як у «portail»).",
          "ps": "د AIL ترکیب د /aj/ غږ جوړوي (لکه په «portail» کې).",
          "sq": "Kombinimi AIL shqiptohet /aj/ (si te «portail»).",
          "ka": "AIL კომბინაცია წარმოითქმის როგორც /aj/ (როგორც «portail»-ში)."
        },
        "words": [
          {
            "word": "portail",
            "highlight": "ail",
            "ipa": "/pɔʁ.taj/",
            "gloss": {
              "en": "gate",
              "fr": "portail",
              "es": "portal / verja",
              "de": "Tor / Portal",
              "it": "cancello",
              "pt": "portão",
              "ar": "بوابة",
              "zh": "大门",
              "nl": "poort",
              "prs": "دروازه بزرگ",
              "uk": "ворота",
              "ps": "لویه دروازه",
              "sq": "portë",
              "ka": "ჭიშკარი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1559871753-75a00941f6b2?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "EIL / EILLE",
    "lower": "eil / eille",
    "name": "eil",
    "nameIpa": "/ɛj/",
    "category": "digraph",
    "variants": [
      {
        "id": "eil-standard",
        "soundIpa": "/ɛj/",
        "soundName": {
          "fr": "Son EIL / EILLE (/ɛj/)",
          "en": "EIL / EILLE sound (/ɛj/)",
          "es": "Sonido EIL / EILLE (/ɛj/)",
          "de": "EIL / EILLE-Laut (/ɛj/)",
          "it": "Suono EIL / EILLE (/ɛj/)",
          "pt": "Som EIL / EILLE (/ɛj/)",
          "ar": "صوت EIL / EILLE (/ɛj/)",
          "zh": "EIL / EILLE 组合 (/ɛj/)",
          "nl": "EIL / EILLE-klank (/ɛj/)",
          "prs": "صوت EIL / EILLE (/ɛj/)",
          "uk": "Звук EIL / EILLE (/ɛj/)",
          "ps": "د EIL / EILLE غږ (/ɛj/)",
          "sq": "Tingulli EIL / EILLE (/ɛj/)",
          "ka": "EIL / EILLE ბგერა (/ɛj/)"
        },
        "rule": {
          "fr": "Au masculin « eil », au féminin « eille », ce groupe se prononce /ɛj/ (comme dans « soleil » et « abeille »).",
          "en": "Masculine \"eil\", feminine \"eille\", pronounced /ɛj/ (as in \"soleil\" and \"abeille\").",
          "es": "En masculino «eil», en femenino «eille», suena /ɛj/.",
          "de": "Männlich «eil», weiblich «eille», wird /ɛj/ gesprochen.",
          "it": "Al maschile «eil», al femminile «eille», si pronuncia /ɛj/.",
          "pt": "No masculino «eil», no feminino «eille», soa /ɛj/.",
          "ar": "يُنطق /ɛj/ (بالمذكر « eil » والمؤنث « eille » كما في « soleil » و « abeille »).",
          "zh": "阳性写作 \"eil\"，阴性写作 \"eille\"，读作 /ɛj/。",
          "nl": "Mannelijk «eil», vrouwelijk «eille», klinkt als /ɛj/.",
          "prs": "در مذکر «eil» و در مؤنث «eille»، صدای /ɛj/ می‌دهد.",
          "uk": "У чоловічому роді «eil», у жіночому «eille», вимовляється як /ɛj/.",
          "ps": "په مذکر کې «eil» او په مؤنث کې «eille»، د /ɛj/ غږ جوړوي.",
          "sq": "Në mashkullore «eil», në femërore «eille», shqiptohet /ɛj/.",
          "ka": "მამრობითში «eil», მდედრობითში «eille», წარმოითქმის როგორც /ɛj/."
        },
        "words": [
          {
            "word": "soleil",
            "highlight": "eil",
            "ipa": "/sɔ.lɛj/",
            "gloss": {
              "en": "sun",
              "fr": "soleil",
              "es": "sol",
              "de": "Sonne",
              "it": "sole",
              "pt": "sol",
              "ar": "شمس",
              "zh": "太阳",
              "nl": "zon",
              "prs": "خورشید",
              "uk": "сонце",
              "ps": "لمر",
              "sq": "diell",
              "ka": "მზე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1622278647429-71bc97e904e8?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "abeille",
            "highlight": "eille",
            "ipa": "/a.bɛj/",
            "gloss": {
              "en": "bee",
              "fr": "abeille",
              "es": "abeja",
              "de": "Biene",
              "it": "ape",
              "pt": "abelha",
              "ar": "نحلة",
              "zh": "蜜蜂",
              "nl": "bij",
              "prs": "زنبور عسل",
              "uk": "бджола",
              "ps": "مچۍ",
              "sq": "bletë",
              "ka": "ფუტკარი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1539313373344-88bbfb9ac83f?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "AIN = UN",
    "lower": "ain",
    "name": "ain",
    "nameIpa": "/ɛ̃/",
    "category": "digraph",
    "variants": [
      {
        "id": "ain-standard",
        "soundIpa": "/ɛ̃/",
        "soundName": {
          "fr": "Son AIN (/ɛ̃/)",
          "en": "AIN sound (/ɛ̃/)",
          "es": "Sonido AIN (/ɛ̃/)",
          "de": "AIN-Laut (/ɛ̃/)",
          "it": "Suono AIN (/ɛ̃/)",
          "pt": "Som AIN (/ɛ̃/)",
          "ar": "صوت AIN الأنفي (/ɛ̃/)",
          "zh": "AIN 鼻元音 (/ɛ̃/)",
          "nl": "AIN-klank (/ɛ̃/)",
          "prs": "صوت AIN تودماغی (/ɛ̃/)",
          "uk": "Звук AIN (/ɛ̃/)",
          "ps": "د AIN پوزیز غږ (/ɛ̃/)",
          "sq": "Tingulli AIN (/ɛ̃/)",
          "ka": "AIN ბგერა (/ɛ̃/)"
        },
        "rule": {
          "fr": "La combinaison AIN produit le son nasal /ɛ̃/ (comme dans « pain »).",
          "en": "The combination AIN produces the nasal sound /ɛ̃/ (as in \"pain\").",
          "es": "La combinación AIN produce el sonido nasal /ɛ̃/ (como en «pain»).",
          "de": "Die Verbindung AIN erzeugt den Nasallaut /ɛ̃/ (wie in «pain»).",
          "it": "La combinazione AIN produce il suono nasale /ɛ̃/ (come in «pain»).",
          "pt": "A combinação AIN produz o som nasal /ɛ̃/ (como em «pain»).",
          "ar": "التركيبة AIN تنتج الصوت الأنفي /ɛ̃/ (كما في « pain »).",
          "zh": "组合 AIN 发鼻元音 /ɛ̃/（如 \"pain\"）。",
          "nl": "De combinatie AIN klinkt als de nasale /ɛ̃/ (zoals in «pain»).",
          "prs": "ترکیب AIN صدای تودماغی /ɛ̃/ می‌دهد (مانند «pain»).",
          "uk": "Буквосполучення AIN утворює носовий звук /ɛ̃/ (як у «pain»).",
          "ps": "د AIN ترکیب پوزیز غږ /ɛ̃/ رامنځته کوي (لکه په «pain» کې).",
          "sq": "Kombinimi AIN prodhon tingullin hundor /ɛ̃/ (si te «pain»).",
          "ka": "AIN კომბინაცია იძლევა ცხვირისმიერ ბგერას /ɛ̃/ (როგორც «pain»-ში)."
        },
        "words": [
          {
            "word": "pain",
            "highlight": "ain",
            "ipa": "/pɛ̃/",
            "gloss": {
              "en": "bread",
              "fr": "pain",
              "es": "pan",
              "de": "Brot",
              "it": "pane",
              "pt": "pão",
              "ar": "خبز",
              "zh": "面包",
              "nl": "brood",
              "prs": "نان",
              "uk": "хліб",
              "ps": "ډوډۍ",
              "sq": "bukë",
              "ka": "პური"
            },
            "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "EIN",
    "lower": "ein",
    "name": "ein",
    "nameIpa": "/ɛ̃/",
    "category": "digraph",
    "variants": [
      {
        "id": "ein-standard",
        "soundIpa": "/ɛ̃/",
        "soundName": {
          "fr": "Son EIN (/ɛ̃/)",
          "en": "EIN sound (/ɛ̃/)",
          "es": "Sonido EIN (/ɛ̃/)",
          "de": "EIN-Laut (/ɛ̃/)",
          "it": "Suono EIN (/ɛ̃/)",
          "pt": "Som EIN (/ɛ̃/)",
          "ar": "صوت EIN الأنفي (/ɛ̃/)",
          "zh": "EIN 鼻元音 (/ɛ̃/)",
          "nl": "EIN-klank (/ɛ̃/)",
          "prs": "صوت EIN تودماغی (/ɛ̃/)",
          "uk": "Звук EIN (/ɛ̃/)",
          "ps": "د EIN پوزیز غږ (/ɛ̃/)",
          "sq": "Tingulli EIN (/ɛ̃/)",
          "ka": "EIN ბგერა (/ɛ̃/)"
        },
        "rule": {
          "fr": "La combinaison EIN produit le son nasal /ɛ̃/ (comme dans « peintre »).",
          "en": "The combination EIN produces the nasal sound /ɛ̃/ (as in \"peintre\").",
          "es": "La combinación EIN produce el sonido nasal /ɛ̃/ (como en «peintre»).",
          "de": "Die Verbindung EIN erzeugt den Nasallaut /ɛ̃/ (wie in «peintre»).",
          "it": "La combinazione EIN produce il suono nasale /ɛ̃/ (come in «peintre»).",
          "pt": "A combinação EIN produz o som nasal /ɛ̃/ (como em «peintre»).",
          "ar": "التركيبة EIN تنتج الصوت الأنفي /ɛ̃/ (كما في « peintre »).",
          "zh": "组合 EIN 发鼻元音 /ɛ̃/（如 \"peintre\"）。",
          "nl": "De combinatie EIN klinkt als de nasale /ɛ̃/ (zoals in «peintre»).",
          "prs": "ترکیب EIN صدای تودماغی /ɛ̃/ می‌دهد (مانند «peintre»).",
          "uk": "Буквосполучення EIN утворює носовий звук /ɛ̃/ (як у «peintre»).",
          "ps": "د EIN ترکیب پوزیز غږ /ɛ̃/ رامنځته کوي (لکه په «peintre» کې).",
          "sq": "Kombinimi EIN prodhon tingullin hundor /ɛ̃/ (si te «peintre»).",
          "ka": "EIN კომბინაცია იძლევა ცხვირისმიერ ბგერას /ɛ̃/ (როგორც «peintre»-ში)."
        },
        "words": [
          {
            "word": "peintre",
            "highlight": "ein",
            "ipa": "/pɛ̃tʁ/",
            "gloss": {
              "en": "painter",
              "fr": "peintre",
              "es": "pintor",
              "de": "Maler",
              "it": "pittore",
              "pt": "pintor",
              "ar": "رسام",
              "zh": "画家",
              "nl": "schilder",
              "prs": "نقاش",
              "uk": "художник",
              "ps": "انځورګر",
              "sq": "piktor",
              "ka": "მხატვარი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "TION",
    "lower": "tion",
    "name": "tion",
    "nameIpa": "/sjɔ̃/",
    "category": "digraph",
    "variants": [
      {
        "id": "tion-standard",
        "soundIpa": "/sjɔ̃/",
        "soundName": {
          "fr": "Son TION (/sjɔ̃/)",
          "en": "TION sound (/sjɔ̃/)",
          "es": "Sonido TION (/sjɔ̃/)",
          "de": "TION-Laut (/sjɔ̃/)",
          "it": "Suono TION (/sjɔ̃/)",
          "pt": "Som TION (/sjɔ̃/)",
          "ar": "صوت TION (/sjɔ̃/)",
          "zh": "TION 后缀 (/sjɔ̃/)",
          "nl": "TION-klank (/sjɔ̃/)",
          "prs": "صوت TION (/sjɔ̃/)",
          "uk": "Звук TION (/sjɔ̃/)",
          "ps": "د TION غږ (/sjɔ̃/)",
          "sq": "Tingulli TION (/sjɔ̃/)",
          "ka": "TION ბგერა (/sjɔ̃/)"
        },
        "rule": {
          "fr": "Le suffixe TION se prononce généralement /sjɔ̃/ (comme dans « émotion »).",
          "en": "The suffix TION is pronounced /sjɔ̃/ (as in \"émotion\").",
          "es": "El sufijo TION se pronuncia /sjɔ̃/ (como en «émotion»).",
          "de": "Die Endung TION wird als /sjɔ̃/ ausgesprochen (wie in «émotion»).",
          "it": "Il suffisso TION si pronuncia /sjɔ̃/ (come in «émotion»).",
          "pt": "O sufixo TION pronuncia-se /sjɔ̃/ (como em «émotion»).",
          "ar": "اللاحقة TION تُنطق /sjɔ̃/ (كما في « émotion »).",
          "zh": "后缀 TION 通常读作 /sjɔ̃/（如 \"émotion\"）。",
          "nl": "Het achtervoegsel TION klinkt als /sjɔ̃/ (zoals in «émotion»).",
          "prs": "پسوند TION صدای /sjɔ̃/ می‌دهد (مانند «émotion»).",
          "uk": "Суфікс TION вимовляється як /sjɔ̃/ (як у «émotion»).",
          "ps": "د TION وروستاړی د /sjɔ̃/ په توګه تلفظ کېږي (لکه په «émotion» کې).",
          "sq": "Prapashtesa TION shqiptohet /sjɔ̃/ (si te «émotion»).",
          "ka": "TION სუფიქსი წარმოითქმის როგორც /sjɔ̃/ (როგორც «émotion»-ში)."
        },
        "words": [
          {
            "word": "émotion",
            "highlight": "tion",
            "ipa": "/e.mo.sjɔ̃/",
            "gloss": {
              "en": "emotion",
              "fr": "émotion",
              "es": "emoción",
              "de": "Emotion / Gefühl",
              "it": "emozione",
              "pt": "emoção",
              "ar": "عاطفة / شعور",
              "zh": "情感",
              "nl": "emotie",
              "prs": "احساس",
              "uk": "емоція",
              "ps": "احساس",
              "sq": "emocion",
              "ka": "ემოცია"
            },
            "imageUrl": "https://images.unsplash.com/photo-1556011068-970d91076c37?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "SION",
    "lower": "sion",
    "name": "sion",
    "nameIpa": "/sjɔ̃/",
    "category": "digraph",
    "variants": [
      {
        "id": "sion-standard",
        "soundIpa": "/sjɔ̃/",
        "soundName": {
          "fr": "Son SION (/sjɔ̃/)",
          "en": "SION sound (/sjɔ̃/)",
          "es": "Sonido SION (/sjɔ̃/)",
          "de": "SION-Laut (/sjɔ̃/)",
          "it": "Suono SION (/sjɔ̃/)",
          "pt": "Som SION (/sjɔ̃/)",
          "ar": "صوت SION (/sjɔ̃/)",
          "zh": "SION 后缀 (/sjɔ̃/)",
          "nl": "SION-klank (/sjɔ̃/)",
          "prs": "صوت SION (/sjɔ̃/)",
          "uk": "Звук SION (/sjɔ̃/)",
          "ps": "د SION غږ (/sjɔ̃/)",
          "sq": "Tingulli SION (/sjɔ̃/)",
          "ka": "SION ბგერა (/sjɔ̃/)"
        },
        "rule": {
          "fr": "Le suffixe SION après consonne se prononce /sjɔ̃/ (comme dans « tension »).",
          "en": "The suffix SION after a consonant is pronounced /sjɔ̃/ (as in \"tension\").",
          "es": "El sufijo SION tras consonante se pronuncia /sjɔ̃/ (como en «tensión»).",
          "de": "Die Endung SION nach Konsonant wird /sjɔ̃/ gesprochen.",
          "it": "Il suffisso SION dopo consonante si pronuncia /sjɔ̃/.",
          "pt": "O sufixo SION após consoante pronuncia-se /sjɔ̃/.",
          "ar": "اللاحقة SION بعد حرف ساكن تُنطق /sjɔ̃/ (كما في « tension »).",
          "zh": "辅音后的后缀 SION 读作 /sjɔ̃/（如 \"tension\"）。",
          "nl": "Het achtervoegsel SION klinkt na een medeklinker als /sjɔ̃/.",
          "prs": "پسوند SION پس از حرف بی‌صدا، صدای /sjɔ̃/ می‌دهد.",
          "uk": "Суфікс SION після приголосного вимовляється як /sjɔ̃/.",
          "ps": "د SION وروستاړی له بې‌غږه توري وروسته /sjɔ̃/ تلفظ کېږي.",
          "sq": "Prapashtesa SION pas një bashkëtingëlloreje shqiptohet /sjɔ̃/.",
          "ka": "SION სუფიქსი თანხმოვნის შემდეგ წარმოითქმის როგორც /sjɔ̃/."
        },
        "words": [
          {
            "word": "tension",
            "highlight": "sion",
            "ipa": "/tɑ̃.sjɔ̃/",
            "gloss": {
              "en": "tension",
              "fr": "tension",
              "es": "tensión",
              "de": "Spannung",
              "it": "tensione",
              "pt": "tensão",
              "ar": "ضغط / توتر",
              "zh": "压力 / 张力",
              "nl": "spanning",
              "prs": "تنش / فشار",
              "uk": "напруга",
              "ps": "فشار",
              "sq": "tension",
              "ka": "დაძაბულობა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1513827574967-e763dd0bc329?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "ETTE",
    "lower": "ette",
    "name": "ette",
    "nameIpa": "/ɛt/",
    "category": "digraph",
    "variants": [
      {
        "id": "ette-standard",
        "soundIpa": "/ɛt/",
        "soundName": {
          "fr": "Son ETTE (/ɛt/)",
          "en": "ETTE sound (/ɛt/)",
          "es": "Sonido ETTE (/ɛt/)",
          "de": "ETTE-Laut (/ɛt/)",
          "it": "Suono ETTE (/ɛt/)",
          "pt": "Som ETTE (/ɛt/)",
          "ar": "صوت ETTE (/ɛt/)",
          "zh": "ETTE 词尾 (/ɛt/)",
          "nl": "ETTE-klank (/ɛt/)",
          "prs": "صوت ETTE (/ɛt/)",
          "uk": "Звук ETTE (/ɛt/)",
          "ps": "د ETTE غږ (/ɛt/)",
          "sq": "Tingulli ETTE (/ɛt/)",
          "ka": "ETTE ბგერა (/ɛt/)"
        },
        "rule": {
          "fr": "La terminaison ETTE se prononce /ɛt/ (comme dans « lunettes » et « fillette »).",
          "en": "The ending ETTE is pronounced /ɛt/ (as in \"lunettes\" and \"fillette\").",
          "es": "La terminación ETTE se pronuncia /ɛt/ (como en «lunettes» y «fillette»).",
          "de": "Die Endung ETTE wird als /ɛt/ gesprochen (wie in «lunettes» und «fillette»).",
          "it": "La desinenza ETTE si pronuncia /ɛt/ (come in «lunettes» e «fillette»).",
          "pt": "A terminação ETTE pronuncia-se /ɛt/ (como em «lunettes» e «fillette»).",
          "ar": "اللاحقة ETTE تُنطق /ɛt/ (كما في « lunettes » و « fillette »).",
          "zh": "词尾 ETTE 读作 /ɛt/（如 \"lunettes\" 和 \"fillette\"）。",
          "nl": "De uitgang ETTE klinkt als /ɛt/ (zoals in «lunettes» en «fillette»).",
          "prs": "پایانه ETTE صدای /ɛt/ می‌دهد (مانند «lunettes» و «fillette»).",
          "uk": "Закінчення ETTE вимовляється як /ɛt/ (як у «lunettes» та «fillette»).",
          "ps": "د ETTE پای د /ɛt/ په توګه تلفظ کېږي (لکه په «lunettes» او «fillette» کې).",
          "sq": "Mbarimi ETTE shqiptohet /ɛt/ (si te «lunettes» dhe «fillette»).",
          "ka": "ETTE დაბოლოება წარმოითქმის როგორც /ɛt/ (როგორც «lunettes» და «fillette»)."
        },
        "words": [
          {
            "word": "lunettes",
            "highlight": "ette",
            "ipa": "/ly.nɛt/",
            "gloss": {
              "en": "glasses",
              "fr": "lunettes",
              "es": "gafas",
              "de": "Brille",
              "it": "occhiali",
              "pt": "óculos",
              "ar": "نظارات",
              "zh": "眼镜",
              "nl": "bril",
              "prs": "عینک",
              "uk": "окуляри",
              "ps": "عینکې",
              "sq": "syze",
              "ka": "სათვალე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "fillette",
            "highlight": "ette",
            "ipa": "/fi.jɛt/",
            "gloss": {
              "en": "little girl",
              "fr": "fillette",
              "es": "niña pequeña",
              "de": "kleines Mädchen",
              "it": "bambina",
              "pt": "menininha",
              "ar": "طفلة صغيرة",
              "zh": "小女孩",
              "nl": "meisje",
              "prs": "دختر کوچک",
              "uk": "маленька дівчинка",
              "ps": "کوچنۍ نجلۍ",
              "sq": "vajzë e vogël",
              "ka": "პატარა გოგონა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "ILLE",
    "lower": "ille",
    "name": "ille",
    "nameIpa": "/ij/",
    "category": "digraph",
    "variants": [
      {
        "id": "ille-standard",
        "soundIpa": "/ij/",
        "soundName": {
          "fr": "Son ILLE (/ij/)",
          "en": "ILLE sound (/ij/)",
          "es": "Sonido ILLE (/ij/)",
          "de": "ILLE-Laut (/ij/)",
          "it": "Suono ILLE (/ij/)",
          "pt": "Som ILLE (/ij/)",
          "ar": "صوت ILLE (/ij/)",
          "zh": "ILLE 组合 (/ij/)",
          "nl": "ILLE-klank (/ij/)",
          "prs": "صوت ILLE (/ij/)",
          "uk": "Звук ILLE (/ij/)",
          "ps": "د ILLE غږ (/ij/)",
          "sq": "Tingulli ILLE (/ij/)",
          "ka": "ILLE ბგერა (/ij/)"
        },
        "rule": {
          "fr": "La graphie ILLE produit généralement le son /ij/ (comme dans « famille »).",
          "en": "The spelling ILLE generally produces the /ij/ sound (as in \"famille\").",
          "es": "La grafía ILLE generalmente produce el sonido /ij/ (como en «famille»).",
          "de": "Die Gruppe ILLE wird meist als /ij/ gesprochen (wie in «famille»).",
          "it": "La grafia ILLE produce generalmente il suono /ij/ (come in «famille»).",
          "pt": "A grafia ILLE produz geralmente o som /ij/ (como em «famille»).",
          "ar": "التركيبة ILLE تُنطق عموماً /ij/ (كما في « famille »).",
          "zh": "拼写 ILLE 通常发 /ij/ 音（如 \"famille\" 中）。",
          "nl": "De spelling ILLE klinkt meestal als /ij/ (zoals in «famille»).",
          "prs": "ترکیب ILLE معمولاً صدای /ij/ می‌دهد (مانند «famille»).",
          "uk": "Буквосполучення ILLE зазвичай читається як /ij/ (як у «famille»).",
          "ps": "د ILLE لیکنه عموماً د /ij/ غږ رامنځته کوي (لکه په «famille» کې).",
          "sq": "Grupi ILLE përgjithësisht shqiptohet /ij/ (si te «famille»).",
          "ka": "ILLE კომბინაცია ჩვეულებრივ წარმოითქმის როგორც /ij/ (როგორც «famille»-ში)."
        },
        "words": [
          {
            "word": "famille",
            "highlight": "ille",
            "ipa": "/fa.mij/",
            "gloss": {
              "en": "family",
              "fr": "famille",
              "es": "familia",
              "de": "Familie",
              "it": "famiglia",
              "pt": "família",
              "ar": "عائلة",
              "zh": "家庭 / 家人",
              "nl": "gezin / familie",
              "prs": "خانواده",
              "uk": "родина",
              "ps": "کورنۍ",
              "sq": "familje",
              "ka": "ოჯახი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1628705250580-80b96d4657f6?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "OIN",
    "lower": "oin",
    "name": "oin",
    "nameIpa": "/wɛ̃/",
    "category": "digraph",
    "variants": [
      {
        "id": "oin-standard",
        "soundIpa": "/wɛ̃/",
        "soundName": {
          "fr": "Son OIN (/wɛ̃/)",
          "en": "OIN sound (/wɛ̃/)",
          "es": "Sonido OIN (/wɛ̃/)",
          "de": "OIN-Laut (/wɛ̃/)",
          "it": "Suono OIN (/wɛ̃/)",
          "pt": "Som OIN (/wɛ̃/)",
          "ar": "صوت OIN الأنفي (/wɛ̃/)",
          "zh": "OIN 组合 (/wɛ̃/)",
          "nl": "OIN-klank (/wɛ̃/)",
          "prs": "صوت OIN تودماغی (/wɛ̃/)",
          "uk": "Звук OIN (/wɛ̃/)",
          "ps": "د OIN پوزیز غږ (/wɛ̃/)",
          "sq": "Tingulli OIN (/wɛ̃/)",
          "ka": "OIN ბგერა (/wɛ̃/)"
        },
        "rule": {
          "fr": "La combinaison OIN se prononce en une seule syllabe nasale /wɛ̃/ (comme dans « coin »).",
          "en": "The combination OIN is pronounced as a single nasal syllable /wɛ̃/ (as in \"coin\").",
          "es": "La combinación OIN se pronuncia en una sola sílaba nasal /wɛ̃/ (como en «coin»).",
          "de": "Die Verbindung OIN wird als eine einzige nasale Silbe /wɛ̃/ gesprochen.",
          "it": "La combinazione OIN si pronuncia in un'unica sillaba nasale /wɛ̃/.",
          "pt": "A combinação OIN pronuncia-se como uma única sílaba nasal /wɛ̃/.",
          "ar": "التركيبة OIN تُنطق كمقطع أنفي واحد /wɛ̃/ (كما في « coin »).",
          "zh": "组合 OIN 作为一个鼻化音节读作 /wɛ̃/（如 \"coin\"）。",
          "nl": "De combinatie OIN klinkt als één nasale lettergreep /wɛ̃/.",
          "prs": "ترکیب OIN به صورت یک هجای تودماغی /wɛ̃/ تلفظ می‌شود (مانند «coin»).",
          "uk": "Буквосполучення OIN вимовляється як один носовий склад /wɛ̃/.",
          "ps": "د OIN ترکیب د یوه پوزیز سیلاب /wɛ̃/ په توګه تلفظ کېږي.",
          "sq": "Kombinimi OIN shqiptohet si një rrokje e vetme hundore /wɛ̃/.",
          "ka": "OIN კომბინაცია წარმოითქმის როგორც ერთი ცხვირისმიერი მარცვალი /wɛ̃/."
        },
        "words": [
          {
            "word": "coin",
            "highlight": "oin",
            "ipa": "/kwɛ̃/",
            "gloss": {
              "en": "corner",
              "fr": "coin",
              "es": "esquina",
              "de": "Ecke",
              "it": "angolo",
              "pt": "canto / esquina",
              "ar": "زاوية / ركن",
              "zh": "角落 / 拐角",
              "nl": "hoek",
              "prs": "گوشه / کنج",
              "uk": "кут",
              "ps": "کونج",
              "sq": "kënd",
              "ka": "კუთხე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1775293192966-db69ddac3562?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "GN",
    "lower": "gn",
    "name": "gn",
    "nameIpa": "/ɲ/",
    "category": "digraph",
    "variants": [
      {
        "id": "gn-standard",
        "soundIpa": "/ɲ/",
        "soundName": {
          "fr": "Son GN (/ɲ/)",
          "en": "GN sound (/ɲ/)",
          "es": "Sonido GN (/ɲ/)",
          "de": "GN-Laut (/ɲ/)",
          "it": "Suono GN (/ɲ/)",
          "pt": "Som GN (/ɲ/)",
          "ar": "صوت GN الحلقي (/ɲ/)",
          "zh": "GN 组合 (/ɲ/)",
          "nl": "GN-klank (/ɲ/)",
          "prs": "صوت GN (/ɲ/)",
          "uk": "Звук GN (/ɲ/)",
          "ps": "د GN غږ (/ɲ/)",
          "sq": "Tingulli GN (/ɲ/)",
          "ka": "GN ბგერა (/ɲ/)"
        },
        "rule": {
          "fr": "La combinaison GN produit le son /ɲ/ (comme dans « montagne »).",
          "en": "The combination GN makes the /ɲ/ sound (like Spanish 'ñ', as in \"montagne\").",
          "es": "La combinación GN produce el sonido /ɲ/ (como la 'ñ', en «montagne»).",
          "de": "Die Verbindung GN erzeugt den Laut /ɲ/ (in «montagne»).",
          "it": "La combinazione GN produce il suono /ɲ/ (come 'gn' in «montagne»).",
          "pt": "A combinação GN produz o som /ɲ/ (como 'nh' em «montagne»).",
          "ar": "التركيبة GN تنتج الصوت /ɲ/ (مثل ñ الإسبانية، كما في « montagne »).",
          "zh": "组合 GN 发硬腭鼻音 /ɲ/（如 \"montagne\"）。",
          "nl": "De combinatie GN klinkt als /ɲ/ (zoals in «montagne»).",
          "prs": "ترکیب GN صدای /ɲ/ تولید می‌کند (در «montagne»).",
          "uk": "Буквосполучення GN вимовляється як м’який носовий /ɲ/ (як у «montagne»).",
          "ps": "د GN ترکیب د /ɲ/ غږ تولیدوي (لکه په «montagne» کې).",
          "sq": "Kombinimi GN prodhon tingullin /ɲ/ (si te «montagne»).",
          "ka": "GN კომბინაცია იძლევა /ɲ/ ბგერას (როგორც «montagne»-ში)."
        },
        "words": [
          {
            "word": "montagne",
            "highlight": "gn",
            "ipa": "/mɔ̃.taɲ/",
            "gloss": {
              "en": "mountain",
              "fr": "montagne",
              "es": "montaña",
              "de": "Berg",
              "it": "montagna",
              "pt": "montanha",
              "ar": "جبل",
              "zh": "山峰",
              "nl": "berg",
              "prs": "کوه",
              "uk": "гора",
              "ps": "غر",
              "sq": "mal",
              "ka": "მთა"
            },
            "imageUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "AI = é",
    "lower": "ai",
    "name": "ai",
    "nameIpa": "/ɛ/",
    "category": "digraph",
    "variants": [
      {
        "id": "ai-standard",
        "soundIpa": "/ɛ/",
        "soundName": {
          "fr": "Son AI = é (/ɛ/)",
          "en": "AI = é sound (/ɛ/)",
          "es": "Sonido AI = é (/ɛ/)",
          "de": "AI = é-Laut (/ɛ/)",
          "it": "Suono AI = é (/ɛ/)",
          "pt": "Som AI = é (/ɛ/)",
          "ar": "صوت AI = é (/ɛ/)",
          "zh": "AI = é 组合 (/ɛ/)",
          "nl": "AI = é-klank (/ɛ/)",
          "prs": "صوت AI = é (/ɛ/)",
          "uk": "Звук AI = é (/ɛ/)",
          "ps": "د AI = é غږ (/ɛ/)",
          "sq": "Tingulli AI = é (/ɛ/)",
          "ka": "AI = é ბგერა (/ɛ/)"
        },
        "rule": {
          "fr": "La combinaison AI se prononce comme un « è » ou « é » ouvert /ɛ/ (comme dans « lait »).",
          "en": "The combination AI is pronounced like an open 'è' or 'é' /ɛ/ (as in \"lait\").",
          "es": "La combinación AI se pronuncia como una 'e' abierta /ɛ/ (como en «lait»).",
          "de": "Die Verbindung AI wird wie ein offenes 'è' /ɛ/ gesprochen (wie in «lait»).",
          "it": "La combinazione AI si pronuncia come una 'è' aperta /ɛ/ (come in «lait»).",
          "pt": "A combinação AI pronuncia-se como um 'e' aberto /ɛ/ (como em «lait»).",
          "ar": "التركيبة AI تُنطق كـ « è » أو « é » مفتوح /ɛ/ (كما في « lait »).",
          "zh": "组合 AI 读作开前不圆唇元音 /ɛ/（如 \"lait\"）。",
          "nl": "De combinatie AI klinkt als een open 'è' /ɛ/ (zoals in «lait»).",
          "prs": "ترکیب AI مانند یک «è» یا «é» باز تلفظ می‌شود (مانند «lait»).",
          "uk": "Буквосполучення AI вимовляється як відкритий звук «е» /ɛ/ (як у «lait»).",
          "ps": "د AI ترکیب لکه یو پرانیستی 'è' یا 'é' /ɛ/ تلفظ کېږي.",
          "sq": "Kombinimi AI shqiptohet si një 'è' e hapur /ɛ/ (si te «lait»).",
          "ka": "AI კომბინაცია წარმოითქმის როგორც ღია 'è' ან 'é' /ɛ/ (როგორც «lait»-ში)."
        },
        "words": [
          {
            "word": "lait",
            "highlight": "ai",
            "ipa": "/lɛ/",
            "gloss": {
              "en": "milk",
              "fr": "lait",
              "es": "leche",
              "de": "Milch",
              "it": "latte",
              "pt": "leite",
              "ar": "حليب",
              "zh": "牛奶",
              "nl": "melk",
              "prs": "شیر",
              "uk": "молоко",
              "ps": "شیدې",
              "sq": "qumësht",
              "ka": "რძე"
            },
            "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "EL / ELLE",
    "lower": "el / elle",
    "name": "elle",
    "nameIpa": "/ɛl/",
    "category": "digraph",
    "variants": [
      {
        "id": "el-elle-standard",
        "soundIpa": "/ɛl/",
        "soundName": {
          "fr": "Son EL / ELLE (/ɛl/)",
          "en": "EL / ELLE sound (/ɛl/)",
          "es": "Sonido EL / ELLE (/ɛl/)",
          "de": "EL / ELLE-Laut (/ɛl/)",
          "it": "Suono EL / ELLE (/ɛl/)",
          "pt": "Som EL / ELLE (/ɛl/)",
          "ar": "صوت EL / ELLE (/ɛl/)",
          "zh": "EL / ELLE 组合 (/ɛl/)",
          "nl": "EL / ELLE-klank (/ɛl/)",
          "prs": "صوت EL / ELLE (/ɛl/)",
          "uk": "Звук EL / ELLE (/ɛl/)",
          "ps": "د EL / ELLE غږ (/ɛl/)",
          "sq": "Tingulli EL / ELLE (/ɛl/)",
          "ka": "EL / ELLE ბგერა (/ɛl/)"
        },
        "rule": {
          "fr": "Les graphies EL et ELLE se prononcent /ɛl/ (comme dans « caramel » et « belle »).",
          "en": "The spellings EL and ELLE are pronounced /ɛl/ (as in \"caramel\" and \"belle\").",
          "es": "Las grafías EL y ELLE se pronuncian /ɛl/ (como en «caramel» y «belle»).",
          "de": "Die Schreibweisen EL und ELLE werden /ɛl/ gesprochen.",
          "it": "Le grafie EL e ELLE si pronunciano /ɛl/.",
          "pt": "As grafias EL e ELLE pronunciam-se /ɛl/.",
          "ar": "الرسمان EL و ELLE يُنطقان /ɛl/ (كما في « caramel » و « belle »).",
          "zh": "拼写 EL 和 ELLE 读作 /ɛl/（如 \"caramel\" 和 \"belle\"）。",
          "nl": "EL en ELLE klinken als /ɛl/ (zoals in «caramel» en «belle»).",
          "prs": "نوشتارهای EL و ELLE هر دو صدای /ɛl/ می‌دهند (مانند «caramel» و «belle»).",
          "uk": "Буквосполучення EL та ELLE вимовляються як /ɛl/.",
          "ps": "د EL او ELLE لیکنې د /ɛl/ په توګه تلفظ کېږي.",
          "sq": "Shkronjat EL dhe ELLE shqiptohen /ɛl/ (si te «caramel» dhe «belle»).",
          "ka": "EL და ELLE წარმოითქმის როგორც /ɛl/ (როგორც «caramel» და «belle»)."
        },
        "words": [
          {
            "word": "caramel",
            "highlight": "el",
            "ipa": "/ka.ʁa.mɛl/",
            "gloss": {
              "en": "caramel",
              "fr": "caramel",
              "es": "caramelo",
              "de": "Karamell",
              "it": "caramello",
              "pt": "caramelo",
              "ar": "كراميل",
              "zh": "焦糖",
              "nl": "karamel",
              "prs": "کارامل",
              "uk": "карамель",
              "ps": "کارامیل",
              "sq": "karamel",
              "ka": "კარამელი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "belle",
            "highlight": "elle",
            "ipa": "/bɛl/",
            "gloss": {
              "en": "beautiful",
              "fr": "belle",
              "es": "bella / hermosa",
              "de": "schön",
              "it": "bella",
              "pt": "bela",
              "ar": "جميلة",
              "zh": "美丽",
              "nl": "mooi",
              "prs": "زیبا",
              "uk": "красива",
              "ps": "ښکلې",
              "sq": "e bukur",
              "ka": "ლამაზი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "AU = EAU = O",
    "lower": "au / eau",
    "name": "eau",
    "nameIpa": "/o/",
    "category": "digraph",
    "variants": [
      {
        "id": "au-eau-standard",
        "soundIpa": "/o/",
        "soundName": {
          "fr": "Son AU = EAU = O (/o/)",
          "en": "AU = EAU = O sound (/o/)",
          "es": "Sonido AU = EAU = O (/o/)",
          "de": "AU = EAU = O-Laut (/o/)",
          "it": "Suono AU = EAU = O (/o/)",
          "pt": "Som AU = EAU = O (/o/)",
          "ar": "صوت AU = EAU = O (/o/)",
          "zh": "AU = EAU = O 组合 (/o/)",
          "nl": "AU = EAU = O-klank (/o/)",
          "prs": "صوت AU = EAU = O (/o/)",
          "uk": "Звук AU = EAU = O (/o/)",
          "ps": "د AU = EAU = O غږ (/o/)",
          "sq": "Tingulli AU = EAU = O (/o/)",
          "ka": "AU = EAU = O ბგერა (/o/)"
        },
        "rule": {
          "fr": "Les graphies AU et EAU se prononcent toutes les deux /o/ (comme dans « chevaux » et « eau »).",
          "en": "The spellings AU and EAU are both pronounced /o/ (as in \"chevaux\" and \"eau\").",
          "es": "Las grafías AU y EAU se pronuncian ambas como /o/.",
          "de": "Die Schreibweisen AU und EAU werden beide als /o/ gesprochen.",
          "it": "Le grafie AU ed EAU si pronunciano entrambe /o/.",
          "pt": "As grafias AU e EAU pronunciam-se ambas como /o/.",
          "ar": "الرسمان AU و EAU يُنطقان كلاهما كصوت /o/ (كما في « chevaux » و « eau »).",
          "zh": "拼写 AU 和 EAU 都读作闭后圆唇元音 /o/（如 \"chevaux\" 和 \"eau\"）。",
          "nl": "AU en EAU klinken beide als /o/.",
          "prs": "نوشتارهای AU و EAU هر دو صدای /o/ می‌دهند.",
          "uk": "Буквосполучення AU та EAU вимовляються як /o/.",
          "ps": "د AU او EAU لیکنې دواړه د /o/ په توګه تلفظ کېږي.",
          "sq": "Shkronjat AU dhe EAU shqiptohen të dyja /o/.",
          "ka": "AU და EAU ორივე წარმოითქმის როგორც /o/."
        },
        "words": [
          {
            "word": "chevaux",
            "highlight": "au",
            "ipa": "/ʃə.vo/",
            "gloss": {
              "en": "horses",
              "fr": "chevaux",
              "es": "caballos",
              "de": "Pferde",
              "it": "cavalli",
              "pt": "cavalos",
              "ar": "خيول",
              "zh": "马匹",
              "nl": "paarden",
              "prs": "اسب‌ها",
              "uk": "коні",
              "ps": "اسونه",
              "sq": "kuaj",
              "ka": "ცხენები"
            },
            "imageUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "eau",
            "highlight": "eau",
            "ipa": "/o/",
            "gloss": {
              "en": "water",
              "fr": "eau",
              "es": "agua",
              "de": "Wasser",
              "it": "acqua",
              "pt": "água",
              "ar": "ماء",
              "zh": "水",
              "nl": "water",
              "prs": "آب",
              "uk": "вода",
              "ps": "اوبه",
              "sq": "ujë",
              "ka": "წყალი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1534616042650-80f5c9b61f09?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  },
  {
    "letter": "IEN",
    "lower": "ien",
    "name": "ien",
    "nameIpa": "/jɛ̃/",
    "category": "digraph",
    "variants": [
      {
        "id": "ien-standard",
        "soundIpa": "/jɛ̃/",
        "soundName": {
          "fr": "Son IEN (/jɛ̃/)",
          "en": "IEN sound (/jɛ̃/)",
          "es": "Sonido IEN (/jɛ̃/)",
          "de": "IEN-Laut (/jɛ̃/)",
          "it": "Suono IEN (/jɛ̃/)",
          "pt": "Som IEN (/jɛ̃/)",
          "ar": "صوت IEN الأنفي (/jɛ̃/)",
          "zh": "IEN 组合 (/jɛ̃/)",
          "nl": "IEN-klank (/jɛ̃/)",
          "prs": "صوت IEN تودماغی (/jɛ̃/)",
          "uk": "Звук IEN (/jɛ̃/)",
          "ps": "د IEN پوزیز غږ (/jɛ̃/)",
          "sq": "Tingulli IEN (/jɛ̃/)",
          "ka": "IEN ბგერა (/jɛ̃/)"
        },
        "rule": {
          "fr": "La combinaison IEN se prononce /jɛ̃/ (comme dans « chien » et « mien »).",
          "en": "The combination IEN is pronounced /jɛ̃/ (as in \"chien\" and \"mien\").",
          "es": "La combinación IEN se pronuncia /jɛ̃/ (como en «chien» y «mien»).",
          "de": "Die Verbindung IEN wird als /jɛ̃/ gesprochen (wie in «chien» und «mien»).",
          "it": "La combinazione IEN si pronuncia /jɛ̃/ (come in «chien» e «mien»).",
          "pt": "A combinação IEN pronuncia-se /jɛ̃/ (como em «chien» e «mien»).",
          "ar": "التركيبة IEN تُنطق /jɛ̃/ (كما في « chien » و « mien »).",
          "zh": "组合 IEN 读作 /jɛ̃/（如 \"chien\" 和 \"mien\"）。",
          "nl": "De combinatie IEN klinkt als /jɛ̃/ (zoals in «chien» en «mien»).",
          "prs": "ترکیب IEN صدای /jɛ̃/ می‌دهد (مانند «chien» و «mien»).",
          "uk": "Буквосполучення IEN вимовляється як /jɛ̃/ (як у «chien» та «mien»).",
          "ps": "د IEN ترکیب د /jɛ̃/ غږ جوړوي (لکه په «chien» او «mien» کې).",
          "sq": "Kombinimi IEN shqiptohet /jɛ̃/ (si te «chien» dhe «mien»).",
          "ka": "IEN კომბინაცია წარმოითქმის როგორც /jɛ̃/ (როგორც «chien» და «mien»)."
        },
        "words": [
          {
            "word": "chien",
            "highlight": "ien",
            "ipa": "/ʃjɛ̃/",
            "gloss": {
              "en": "dog",
              "fr": "chien",
              "es": "perro",
              "de": "Hund",
              "it": "cane",
              "pt": "cão / cachorro",
              "ar": "كلب",
              "zh": "狗",
              "nl": "hond",
              "prs": "سگ",
              "uk": "собака",
              "ps": "سپى",
              "sq": "qen",
              "ka": "ძაღლი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"
          },
          {
            "word": "mien",
            "highlight": "ien",
            "ipa": "/mjɛ̃/",
            "gloss": {
              "en": "mine",
              "fr": "mien",
              "es": "mío",
              "de": "meins",
              "it": "mio",
              "pt": "meu",
              "ar": "لي / ملكي",
              "zh": "我的",
              "nl": "het mijne",
              "prs": "مال من",
              "uk": "моє",
              "ps": "زما",
              "sq": "imja",
              "ka": "ჩემი"
            },
            "imageUrl": "https://images.unsplash.com/photo-1747263717426-d434c9f1fb3d?auto=format&fit=crop&w=600&q=80"
          }
        ]
      }
    ]
  }
];
