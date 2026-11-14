// Reference articles: longer-form, denser explainers on Japanese mechanics
// (kana, conjugation systems, word types, etc.) that sit underneath the
// pattern-level grammar entries in grammar-data.js. Loaded as a top-level
// `const` the same way grammar-data.js is — see index.html's script order.
//
// Schema for one article:
// {
//   id: "ref-kana",        // required, unique, "ref-" prefixed
//   title: "Kana Charts",  // required
//   short: "...",          // required, one-line summary shown in the list
//   related: [],           // optional, ids of grammar entries this connects to
//   blocks: [ ... ]         // required, see block types below
// }
//
// Block types:
//   { type: "paragraph", text: "..." }
//   { type: "table", title: "...", headers: [...], rows: [[...], ...] }
//     — generic table, string cells
//   { type: "kana-table", title: "...", headers: [...], rows: [[cell, ...], ...] }
//     — cell is either null (no such sound) or { hira, kata, romaji }
//   { type: "note", text: "..." }

const REFERENCE_ARTICLES = [
  {
    id: "ref-kana",
    title: "Kana Charts",
    short: "Hiragana and katakana at a glance, plus the contracted (拗音) sounds.",
    related: [],
    blocks: [
      {
        type: "paragraph",
        text: "Hiragana and katakana are two phonetic syllabaries that each represent the exact same set of sounds — the difference is when each is used, not how they're pronounced. Hiragana is used for native Japanese grammar (particles, verb endings) and native vocabulary that isn't written in kanji. Katakana is mainly used for loanwords borrowed from other languages, foreign names, onomatopoeia, and for emphasis (similar to italics in English)."
      },
      {
        type: "kana-table",
        title: "Gojūon (五十音) — the base 46 sounds",
        headers: ["A", "I", "U", "E", "O"],
        rows: [
          [{ hira: "あ", kata: "ア", romaji: "a" }, { hira: "い", kata: "イ", romaji: "i" }, { hira: "う", kata: "ウ", romaji: "u" }, { hira: "え", kata: "エ", romaji: "e" }, { hira: "お", kata: "オ", romaji: "o" }],
          [{ hira: "か", kata: "カ", romaji: "ka" }, { hira: "き", kata: "キ", romaji: "ki" }, { hira: "く", kata: "ク", romaji: "ku" }, { hira: "け", kata: "ケ", romaji: "ke" }, { hira: "こ", kata: "コ", romaji: "ko" }],
          [{ hira: "さ", kata: "サ", romaji: "sa" }, { hira: "し", kata: "シ", romaji: "shi" }, { hira: "す", kata: "ス", romaji: "su" }, { hira: "せ", kata: "セ", romaji: "se" }, { hira: "そ", kata: "ソ", romaji: "so" }],
          [{ hira: "た", kata: "タ", romaji: "ta" }, { hira: "ち", kata: "チ", romaji: "chi" }, { hira: "つ", kata: "ツ", romaji: "tsu" }, { hira: "て", kata: "テ", romaji: "te" }, { hira: "と", kata: "ト", romaji: "to" }],
          [{ hira: "な", kata: "ナ", romaji: "na" }, { hira: "に", kata: "ニ", romaji: "ni" }, { hira: "ぬ", kata: "ヌ", romaji: "nu" }, { hira: "ね", kata: "ネ", romaji: "ne" }, { hira: "の", kata: "ノ", romaji: "no" }],
          [{ hira: "は", kata: "ハ", romaji: "ha" }, { hira: "ひ", kata: "ヒ", romaji: "hi" }, { hira: "ふ", kata: "フ", romaji: "fu" }, { hira: "へ", kata: "ヘ", romaji: "he" }, { hira: "ほ", kata: "ホ", romaji: "ho" }],
          [{ hira: "ま", kata: "マ", romaji: "ma" }, { hira: "み", kata: "ミ", romaji: "mi" }, { hira: "む", kata: "ム", romaji: "mu" }, { hira: "め", kata: "メ", romaji: "me" }, { hira: "も", kata: "モ", romaji: "mo" }],
          [{ hira: "や", kata: "ヤ", romaji: "ya" }, null, { hira: "ゆ", kata: "ユ", romaji: "yu" }, null, { hira: "よ", kata: "ヨ", romaji: "yo" }],
          [{ hira: "ら", kata: "ラ", romaji: "ra" }, { hira: "り", kata: "リ", romaji: "ri" }, { hira: "る", kata: "ル", romaji: "ru" }, { hira: "れ", kata: "レ", romaji: "re" }, { hira: "ろ", kata: "ロ", romaji: "ro" }],
          [{ hira: "わ", kata: "ワ", romaji: "wa" }, null, null, null, { hira: "を", kata: "ヲ", romaji: "wo" }],
          [{ hira: "ん", kata: "ン", romaji: "n" }, null, null, null, null]
        ]
      },
      {
        type: "note",
        text: "を is romanized \"wo\" for historical reasons, but in modern spoken Japanese it's pronounced exactly like お (\"o\"). It only ever appears as the object-marking particle — never as part of a word's own reading — so if you see を, you can be confident it's marking a direct object."
      },
      {
        type: "kana-table",
        title: "Dakuten (濁音) — voiced sounds",
        headers: ["A", "I", "U", "E", "O"],
        rows: [
          [{ hira: "が", kata: "ガ", romaji: "ga" }, { hira: "ぎ", kata: "ギ", romaji: "gi" }, { hira: "ぐ", kata: "グ", romaji: "gu" }, { hira: "げ", kata: "ゲ", romaji: "ge" }, { hira: "ご", kata: "ゴ", romaji: "go" }],
          [{ hira: "ざ", kata: "ザ", romaji: "za" }, { hira: "じ", kata: "ジ", romaji: "ji" }, { hira: "ず", kata: "ズ", romaji: "zu" }, { hira: "ぜ", kata: "ゼ", romaji: "ze" }, { hira: "ぞ", kata: "ゾ", romaji: "zo" }],
          [{ hira: "だ", kata: "ダ", romaji: "da" }, { hira: "ぢ", kata: "ヂ", romaji: "ji" }, { hira: "づ", kata: "ヅ", romaji: "zu" }, { hira: "で", kata: "デ", romaji: "de" }, { hira: "ど", kata: "ド", romaji: "do" }],
          [{ hira: "ば", kata: "バ", romaji: "ba" }, { hira: "び", kata: "ビ", romaji: "bi" }, { hira: "ぶ", kata: "ブ", romaji: "bu" }, { hira: "べ", kata: "ベ", romaji: "be" }, { hira: "ぼ", kata: "ボ", romaji: "bo" }]
        ]
      },
      {
        type: "note",
        text: "じ and ぢ are pronounced identically (\"ji\"), as are ず and づ (\"zu\"). Which one a word uses is just a spelling convention — づ and ぢ mostly show up when they preserve a visible link to a related word (縮む → ちぢむ, つづく from つづ+く), and are far rarer overall than じ/ず."
      },
      {
        type: "kana-table",
        title: "Handakuten (半濁音) — the P-sounds",
        headers: ["A", "I", "U", "E", "O"],
        rows: [
          [{ hira: "ぱ", kata: "パ", romaji: "pa" }, { hira: "ぴ", kata: "ピ", romaji: "pi" }, { hira: "ぷ", kata: "プ", romaji: "pu" }, { hira: "ぺ", kata: "ペ", romaji: "pe" }, { hira: "ぽ", kata: "ポ", romaji: "po" }]
        ]
      },
      {
        type: "kana-table",
        title: "Yōon (拗音) — contracted sounds",
        headers: ["YA", "YU", "YO"],
        rows: [
          [{ hira: "きゃ", kata: "キャ", romaji: "kya" }, { hira: "きゅ", kata: "キュ", romaji: "kyu" }, { hira: "きょ", kata: "キョ", romaji: "kyo" }],
          [{ hira: "ぎゃ", kata: "ギャ", romaji: "gya" }, { hira: "ぎゅ", kata: "ギュ", romaji: "gyu" }, { hira: "ぎょ", kata: "ギョ", romaji: "gyo" }],
          [{ hira: "しゃ", kata: "シャ", romaji: "sha" }, { hira: "しゅ", kata: "シュ", romaji: "shu" }, { hira: "しょ", kata: "ショ", romaji: "sho" }],
          [{ hira: "じゃ", kata: "ジャ", romaji: "ja" }, { hira: "じゅ", kata: "ジュ", romaji: "ju" }, { hira: "じょ", kata: "ジョ", romaji: "jo" }],
          [{ hira: "ちゃ", kata: "チャ", romaji: "cha" }, { hira: "ちゅ", kata: "チュ", romaji: "chu" }, { hira: "ちょ", kata: "チョ", romaji: "cho" }],
          [{ hira: "にゃ", kata: "ニャ", romaji: "nya" }, { hira: "にゅ", kata: "ニュ", romaji: "nyu" }, { hira: "にょ", kata: "ニョ", romaji: "nyo" }],
          [{ hira: "ひゃ", kata: "ヒャ", romaji: "hya" }, { hira: "ひゅ", kata: "ヒュ", romaji: "hyu" }, { hira: "ひょ", kata: "ヒョ", romaji: "hyo" }],
          [{ hira: "びゃ", kata: "ビャ", romaji: "bya" }, { hira: "びゅ", kata: "ビュ", romaji: "byu" }, { hira: "びょ", kata: "ビョ", romaji: "byo" }],
          [{ hira: "ぴゃ", kata: "ピャ", romaji: "pya" }, { hira: "ぴゅ", kata: "ピュ", romaji: "pyu" }, { hira: "ぴょ", kata: "ピョ", romaji: "pyo" }],
          [{ hira: "みゃ", kata: "ミャ", romaji: "mya" }, { hira: "みゅ", kata: "ミュ", romaji: "myu" }, { hira: "みょ", kata: "ミョ", romaji: "myo" }],
          [{ hira: "りゃ", kata: "リャ", romaji: "rya" }, { hira: "りゅ", kata: "リュ", romaji: "ryu" }, { hira: "りょ", kata: "リョ", romaji: "ryo" }]
        ]
      },
      {
        type: "note",
        text: "Yōon combine a consonant's い-column kana (き, し, ち, に...) with a small ゃ/ゅ/ょ to make a single contracted syllable — きゃ is one beat (kya), not two (ki-ya). The small size of the ゃ/ゅ/ょ is what signals the contraction; written full-size, きや would instead be read as two separate syllables, ki-ya."
      }
    ]
  },
  {
    id: "ref-particles",
    title: "Particles at a Glance",
    short: "Every core particle side by side — what it marks and a quick example.",
    related: ["n5-wa","n5-ga","n5-o","n5-ni","n5-de","n5-to","n5-mo","n5-no","n5-e","n5-ya","n5-dake","n4-shika-nai","n3-bakari","n5-made","n3-koso"],
    blocks: [
      { type: "paragraph", text: "Japanese word order is fairly flexible because particles — small words attached directly after a noun, verb, or clause — do the job that word order does in English: marking which noun is the subject, which is the object, where something happens, and so on. Getting comfortable with particles matters more than getting comfortable with word order." },
      {
        type: "table",
        title: "Core case particles",
        headers: ["Particle","Marks","Example"],
        rows: [
          ["は", "The topic of the sentence (what it's about)", "私は学生です。(As for me, I'm a student.)"],
          ["が", "The grammatical subject, often new information", "猫が来ました。(A cat came.)"],
          ["を", "The direct object of a transitive verb", "水を飲みます。(I drink water.)"],
          ["に", "A destination, a point in time, an indirect object, or existence", "学校に行きます。(I go to school.)"],
          ["で", "Where an action happens, or the means used", "図書館で勉強します。(I study at the library.)"],
          ["と", "\"With\" (a companion), or an exhaustive \"and\"", "友達と話す。(I talk with a friend.)"],
          ["も", "\"Also/too\" — replaces は or が for the same meaning applied to another item", "私も学生です。(I'm also a student.)"],
          ["の", "Possession/modification (\"'s\" or \"of\"), or standing in for an omitted noun", "私の本。(My book.)"],
          ["へ", "Direction of movement (close to に for destinations)", "東京へ行く。(I'm headed to Tokyo.)"],
          ["や", "\"And\" listing a partial, non-exhaustive sample", "りんごやバナナ。(Things like apples and bananas.)"],
          ["か", "Turns a sentence into a question", "行きますか。(Are you going?)"]
        ]
      },
      { type: "note", text: "は vs が is the single most asked-about particle distinction. は sets up what the sentence is going to comment on, often something already known or contrasted; が introduces or highlights the subject itself, often as new information. 私は学生です simply states the topic; 私が学生です emphasizes that I, specifically, am the student (as opposed to someone else)." },
      {
        type: "table",
        title: "Sentence-final particles",
        headers: ["Particle","Function","Example"],
        rows: [
          ["ね", "Seeks agreement or shared feeling — \"right?\"", "いい天気ですね。(Nice weather, isn't it?)"],
          ["よ", "Emphasizes new information for the listener", "もう五時ですよ。(It's already five, you know.)"]
        ]
      },
      {
        type: "table",
        title: "Limiting and emphasis particles",
        headers: ["Particle","Meaning","Example"],
        rows: [
          ["だけ", "\"Only/just\" — neutral", "水だけ飲みました。(I only drank water.)"],
          ["しか〜ない", "\"Only\" — requires a negative verb, slightly stronger \"nothing but\" feel", "百円しかない。(I only have 100 yen.)"],
          ["ばかり", "\"Only/nothing but\", or \"just did X\" after a た-form verb", "ゲームばかりしている。(All he does is play games.)"],
          ["くらい／ぐらい", "\"About/approximately\" (with quantities)", "十分くらい待った。(I waited about ten minutes.)"],
          ["こそ", "Emphasizes the preceding word — \"precisely/exactly\"", "今年こそ頑張ります。(This year, of all years, I'll do my best.)"],
          ["さえ", "\"Even\" — highlights an extreme example", "漢字さえ読めない。(I can't even read kanji.)"],
          ["など", "\"Etc./and so on\" — softens a list into examples", "果物などが好きです。(I like things like fruit.)"]
        ]
      },
      {
        type: "table",
        title: "Range particles",
        headers: ["Particle","Meaning","Example"],
        rows: [
          ["から", "\"From\" (a starting point), or \"because\" (a reason)", "九時から。(From nine o'clock.)"],
          ["まで", "\"Until/to\" (an ending point)", "五時まで。(Until five o'clock.)"],
          ["ずつ", "\"X each\" — an even distribution", "二個ずつ。(Two each.)"]
        ]
      }
    ]
  },
  {
    id: "ref-counters",
    title: "Counters (助数詞)",
    short: "Which counter word to use for what, and the sound changes that trip people up.",
    related: [],
    blocks: [
      { type: "paragraph", text: "Japanese can't just say \"three books\" the way English does — a counter word attaches to the number, and which counter to use depends on the shape or category of what's being counted. There's a generic counter that works for small objects in a pinch when you don't know or can't recall the specific one, but native speakers reach for the specific counter whenever one applies." },
      {
        type: "table",
        title: "The generic counter (つ) — for when nothing more specific fits",
        headers: ["Count","Reading"],
        rows: [
          ["1", "ひとつ"],
          ["2", "ふたつ"],
          ["3", "みっつ"],
          ["4", "よっつ"],
          ["5", "いつつ"],
          ["6", "むっつ"],
          ["7", "ななつ"],
          ["8", "やっつ"],
          ["9", "ここのつ"],
          ["10", "とお"]
        ]
      },
      { type: "note", text: "This つ-counter sequence is the native (Yamato) Japanese counting system, distinct from the borrowed Chinese-derived いち・に・さん system used for most specific counters below. It only goes cleanly to 10 — beyond that, the いち・に・さん numbers take over even when nothing more specific than \"things\" is being counted." },
      {
        type: "table",
        title: "Common counters and what they count",
        headers: ["Counter","Used for","Regularity"],
        rows: [
          ["人 (にん)", "People", "Irregular at 1 and 2 (see below), regular from 3 on"],
          ["本 (ほん)", "Long, thin objects — pens, bottles, trees", "Sound changes at 1, 3, 6, 8, 10 (see below)"],
          ["匹 (ひき)", "Small animals — cats, dogs, insects, fish", "Sound changes at 1, 3, 6, 8, 10 (see below)"],
          ["歳 (さい)", "Age", "Sound changes at 1, 8, 10; 20 is a special word (see below)"],
          ["回 (かい)", "Number of times/occurrences", "Small doubling at 1, 6, 8, 10, otherwise regular"],
          ["枚 (まい)", "Flat, thin objects — paper, plates, shirts", "Fully regular: いちまい, にまい, さんまい..."],
          ["個 (こ)", "Small, roughly round or generic objects", "Fully regular: いっこ, にこ, さんこ... (only 1 doubles slightly)"],
          ["冊 (さつ)", "Bound objects — books, magazines", "Mostly regular; small doubling at 1 and 8"],
          ["台 (だい)", "Machines and vehicles — cars, computers, TVs", "Fully regular: いちだい, にだい, さんだい..."],
          ["階 (かい)", "Floors of a building", "Same sound changes as 回 (1, 6, 8, 10)"]
        ]
      },
      {
        type: "table",
        title: "人 (people) — irregular at the start",
        headers: ["Count","Reading","Notes"],
        rows: [
          ["1", "ひとり", "Irregular — not いちにん"],
          ["2", "ふたり", "Irregular — not ににん"],
          ["3", "さんにん", "Regular from here on"],
          ["4", "よにん", "Uses よ, not よん"],
          ["5", "ごにん", ""],
          ["10", "じゅうにん", ""],
          ["?", "なんにん", "\"How many people?\""]
        ]
      },
      {
        type: "table",
        title: "本 (long thin objects) — the classic sound-change counter",
        headers: ["Count","Reading"],
        rows: [
          ["1", "いっぽん"],
          ["2", "にほん"],
          ["3", "さんぼん"],
          ["4", "よんほん"],
          ["5", "ごほん"],
          ["6", "ろっぽん"],
          ["7", "ななほん"],
          ["8", "はっぽん"],
          ["9", "きゅうほん"],
          ["10", "じゅっぽん／じっぽん"]
        ]
      },
      {
        type: "table",
        title: "匹 (small animals) — the same pattern as 本",
        headers: ["Count","Reading"],
        rows: [
          ["1", "いっぴき"],
          ["2", "にひき"],
          ["3", "さんびき"],
          ["4", "よんひき"],
          ["5", "ごひき"],
          ["6", "ろっぴき"],
          ["7", "ななひき"],
          ["8", "はっぴき"],
          ["9", "きゅうひき"],
          ["10", "じゅっぴき／じっぴき"]
        ]
      },
      { type: "note", text: "本 and 匹 both start with an は-row sound (ほ/ひ), and both follow the same pattern: 1, 6, and 8 trigger a small つ plus a shift to the half-voiced ぱ/ぴ/ぽ sound, while 3 shifts to the fully-voiced ば/び/ぼ sound instead. This は→ぱ／ば alternation is common across counters that start with an は-row kana — 杯 (cups: いっぱい, さんばい, ろっぱい) follows the identical pattern." },
      {
        type: "table",
        title: "歳 (age) — regular except for one very common word",
        headers: ["Count","Reading","Notes"],
        rows: [
          ["1", "いっさい", ""],
          ["2", "にさい", ""],
          ["3", "さんさい", ""],
          ["8", "はっさい", ""],
          ["10", "じゅっさい／じっさい", ""],
          ["20", "はたち", "Irregular — its own word, not にじゅっさい"]
        ]
      }
    ]
  },
  {
    id: "ref-numbers-dates",
    title: "Numbers & Dates",
    short: "The two number systems, and the day-of-month readings that don't follow any rule.",
    related: [],
    blocks: [
      { type: "paragraph", text: "Japanese has two overlapping number systems: native (Yamato) numbers, which only really survive for 1–10 today and are mostly used with the generic つ counter, and the borrowed Sino-Japanese numbers (いち, に, さん...), which are used for everything else — counting with specific counters, telephone numbers, math, and all numbers above 10." },
      {
        type: "table",
        title: "Sino-Japanese numbers 1–10",
        headers: ["Number","Reading","Notes"],
        rows: [
          ["1", "いち", ""],
          ["2", "に", ""],
          ["3", "さん", ""],
          ["4", "し／よん", "し sounds like 死 (death) and is avoided in many contexts — よん is the safer, more common default"],
          ["5", "ご", ""],
          ["6", "ろく", ""],
          ["7", "しち／なな", "Both are used, but なな is often preferred to avoid confusion with 一 (いち) over the phone"],
          ["8", "はち", ""],
          ["9", "きゅう／く", "く sounds like 苦 (suffering) and is avoided in some contexts — きゅう is the safer default"],
          ["10", "じゅう", ""]
        ]
      },
      {
        type: "table",
        title: "Beyond 10",
        headers: ["Number","Reading"],
        rows: [
          ["11–19", "じゅう + digit (十一 じゅういち, 十二 じゅうに...)"],
          ["20, 30... 90", "digit + じゅう (二十 にじゅう, 三十 さんじゅう...)"],
          ["100", "ひゃく"],
          ["300 / 600 / 800", "さんびゃく／ろっぴゃく／はっぴゃく — voicing/doubling shifts, same pattern as は-row counters"],
          ["1,000", "せん"],
          ["3,000 / 8,000", "さんぜん／はっせん — せん voices to ぜん after さん, and doubles after はち"],
          ["10,000", "まん — Japanese groups digits in units of 10,000, not 1,000, so 100,000 is 十万 (じゅうまん), not \"a hundred thousand\""]
        ]
      },
      {
        type: "table",
        title: "Native counting sequence 1–10 (used with the つ counter)",
        headers: ["Count","Reading"],
        rows: [
          ["1", "ひとつ"],
          ["2", "ふたつ"],
          ["3", "みっつ"],
          ["4", "よっつ"],
          ["5", "いつつ"],
          ["6", "むっつ"],
          ["7", "ななつ"],
          ["8", "やっつ"],
          ["9", "ここのつ"],
          ["10", "とお"]
        ]
      },
      { type: "paragraph", text: "Days of the month (X日) are where Japanese numbers stop following any predictable rule at all. Days 1 through 10, plus 14, 20, and 24, use their own historical readings that have to be memorized individually — everything else follows the regular Sino-Japanese number + にち pattern." },
      {
        type: "table",
        title: "Days of the month 1–10 — irregular, memorize individually",
        headers: ["Day","Reading"],
        rows: [
          ["1st", "ついたち"],
          ["2nd", "ふつか"],
          ["3rd", "みっか"],
          ["4th", "よっか"],
          ["5th", "いつか"],
          ["6th", "むいか"],
          ["7th", "なのか"],
          ["8th", "ようか"],
          ["9th", "ここのか"],
          ["10th", "とおか"]
        ]
      },
      {
        type: "table",
        title: "Other irregular days",
        headers: ["Day","Reading","Notes"],
        rows: [
          ["14th", "じゅうよっか", "Not じゅうよんにち"],
          ["20th", "はつか", "Completely irregular, its own word"],
          ["24th", "にじゅうよっか", "Follows the same pattern as 14th"]
        ]
      },
      { type: "note", text: "Every other day of the month (11–13, 15–19, 21–23, 25–31) is regular: Sino-Japanese number + にち — 十一日 じゅういちにち, 十五日 じゅうごにち, 二十五日 にじゅうごにち, and so on." },
      { type: "note", text: "一日 is genuinely two different words depending on context: as the 1st of the month it's ついたち, but as a duration (\"one day\") it's いちにち. Months (月) are simpler — 一月 through 十二月 are all regular Sino-Japanese number + がつ (一月 いちがつ, 十二月 じゅうにがつ) — but note がつ, not げつ; げつ shows up instead in duration words like 一ヶ月 (いっかげつ, \"one month\")." }
    ]
  },
  {
    id: "ref-kanji-readings",
    title: "Kanji Readings: Onyomi & Kunyomi",
    short: "Why the same kanji can be read several completely different ways.",
    related: [],
    blocks: [
      { type: "paragraph", text: "Most kanji have at least two kinds of reading. Onyomi (音読み, \"sound reading\") is an approximation of how the character was pronounced in Chinese around the time it was borrowed into Japanese, centuries ago — it's mainly used when a kanji is combined with other kanji to form a compound word. Kunyomi (訓読み, \"meaning reading\") is a native Japanese word that was already in use and got attached to the kanji because it matched that kanji's meaning — it's mainly used when a kanji appears on its own, often followed by okurigana (trailing hiragana that carries the conjugation)." },
      {
        type: "table",
        title: "The same kanji, two different jobs",
        headers: ["Kanji","Onyomi (in compounds)","Kunyomi (standalone / with okurigana)"],
        rows: [
          ["水", "すい (水曜日 すいようび, Wednesday)", "みず (水 みず, water)"],
          ["火", "か (火曜日 かようび, Tuesday)", "ひ (火 ひ, fire)"],
          ["人", "じん／にん (日本人 にほんじん, 三人 さんにん)", "ひと (人 ひと, a person)"],
          ["見", "けん (意見 いけん, opinion)", "み (見る みる, to see)"],
          ["食", "しょく (食事 しょくじ, a meal)", "た／く (食べる たべる, to eat)"],
          ["生", "せい／しょう (学生 がくせい, 一生 いっしょう)", "い／う／なま／は (生きる いきる, 生まれる うまれる, 生 なま raw, 生える はえる)"]
        ]
      },
      { type: "note", text: "生 is the textbook example of a kanji with an unusually large reading list — the same character covers \"life/living,\" \"birth,\" \"raw,\" and \"to grow (of plants),\" each with its own kunyomi, plus two separate onyomi depending on the compound. Most kanji aren't nearly this extreme, but it's a useful reminder that a kanji's reading always depends on the specific word it's part of, not the character in isolation." },
      { type: "paragraph", text: "\"Compounds use onyomi, standalone words use kunyomi\" is a genuinely useful rule of thumb, not an absolute law. 手紙 (てがみ, letter/mail) is a two-kanji compound that uses kunyomi for both characters (手 て, 紙 かみ→がみ) instead of the expected onyomi. Compounds that mix an onyomi reading for one kanji with a kunyomi reading for another also exist (湯桶読み/重箱読み, if you ever see those terms) — they're a recognized minority pattern, not an error." },
      { type: "note", text: "Some kanji are common in compounds but rarely or never stand alone with a kunyomi (愛 あい, love, has no everyday standalone kunyomi verb/noun outside its onyomi-based compounds); others are the reverse, appearing constantly on their own but almost never in onyomi compounds. Dictionaries list every attested reading, but usage frequency varies enormously — the readings worth memorizing first are the ones that show up in words you're actually learning, not the full list for a given character." }
    ]
  },
  {
    id: "ref-keigo-irregular",
    title: "Keigo: The Irregular Verbs",
    short: "The respectful and humble verbs that don't follow the お〜になる／お〜する pattern.",
    related: ["n4-keigo-sonkeigo","n4-keigo-kenjougo"],
    blocks: [
      { type: "paragraph", text: "尊敬語 (sonkeigo, respectful language) elevates the person being talked about, and 謙譲語 (kenjougo, humble language) lowers the speaker's own actions — both create the same relative distance of respect, just from opposite directions. The productive patterns for building these (お + verb stem + になる for sonkeigo, お + verb stem + する for kenjougo) are covered as their own grammar points. A small set of very common verbs skip that pattern entirely and use their own dedicated irregular forms instead, and those have to be memorized individually." },
      {
        type: "table",
        title: "Irregular sonkeigo (elevating someone else)",
        headers: ["Plain verb","Sonkeigo","Meaning"],
        rows: [
          ["いる／行く／来る", "いらっしゃる", "to be / to go / to come"],
          ["言う", "おっしゃる", "to say"],
          ["する", "なさる", "to do"],
          ["食べる／飲む", "召し上がる", "to eat / to drink"],
          ["見る", "ご覧になる", "to see/look"],
          ["くれる", "くださる", "to give (to me/us)"],
          ["知っている", "ご存知だ", "to know"],
          ["寝る", "お休みになる", "to sleep"]
        ]
      },
      {
        type: "table",
        title: "Irregular kenjougo (humbling yourself)",
        headers: ["Plain verb","Kenjougo","Meaning"],
        rows: [
          ["いる", "おる", "to be"],
          ["行く／来る", "まいる", "to go / to come"],
          ["言う", "申す／申し上げる", "to say"],
          ["する", "いたす", "to do"],
          ["もらう／食べる／飲む", "いただく", "to receive / to eat / to drink"],
          ["見る", "拝見する", "to see/look"],
          ["会う", "お目にかかる", "to meet"],
          ["行く／来る／聞く", "伺う", "to go / to come / to ask, hear"],
          ["知っている／思う", "存じる", "to know / to think"]
        ]
      },
      { type: "note", text: "いらっしゃる and おっしゃる conjugate slightly irregularly themselves: their ます-form is いらっしゃいます and おっしゃいます (not いらっしゃります／おっしゃります), because the り drops before ます. This is one of the few genuinely irregular conjugation patterns in modern Japanese verb grammar." },
      { type: "note", text: "行く／来る／いる all share the single sonkeigo form いらっしゃる and, separately, share different kenjougo forms depending on which meaning is intended (まいる for go/come, おる for be) — context tells them apart, the same way context (not the verb form itself) tells plain いる (to exist) apart from いる as part of ている." }
    ]
  },
  {
    id: "ref-conjugations",
    title: "Conjugation Reference Tables",
    short: "Every adjective and verb form side by side — the mechanical \"how\", not the meaning.",
    related: ["n5-i-adj","n5-na-adj","n4-passive","n4-causative","n4-causative-passive","n4-potential","n4-volitional"],
    blocks: [
      { type: "paragraph", text: "This is a lookup table, not an explainer — it shows how to mechanically build each conjugated form for い-adjectives, な-adjectives, ichidan verbs, and godan verbs, side by side. For what each form actually means and when to use it, see the individual grammar entries (many are linked below); for how to tell which category a word falls into in the first place, see the い-adjective/な-adjective and Ichidan/Godan/Irregular verb-type articles." },
      {
        type: "table",
        title: "Adjective conjugations — い vs な",
        headers: ["Form","い-Adjective rule","高い (\"expensive/tall\")","な-Adjective rule","静か (\"quiet\")"],
        rows: [
          ["Dictionary (plain)", "base form", "高い", "stem + だ", "静かだ"],
          ["Polite", "+ です", "高いです", "だ → です", "静かです"],
          ["Negative", "い → くない", "高くない", "だ → じゃない", "静かじゃない"],
          ["Negative (formal)", "い → くありません", "高くありません", "だ → ではありません", "静かではありません"],
          ["Past", "い → かった", "高かった", "だ → だった", "静かだった"],
          ["Past (polite)", "い → かったです", "高かったです", "だ → でした", "静かでした"],
          ["Negative past", "い → くなかった", "高くなかった", "だ → じゃなかった", "静かじゃなかった"],
          ["Negative past (formal)", "い → くありませんでした", "高くありませんでした", "だ → ではありませんでした", "静かではありませんでした"],
          ["て-form", "い → くて", "高くて", "だ → で", "静かで"],
          ["Negative て-form", "い → くなくて", "高くなくて", "だ → じゃなくて", "静かじゃなくて"],
          ["Conditional (ば)", "い → ければ", "高ければ", "+ なら(ば)", "静かなら(ば)"],
          ["Adverb", "い → く", "高く", "+ に", "静かに"],
          ["Looks like (様態)", "い → そう", "高そう", "+ そう", "静かそう"],
          ["Apparently (伝聞)", "+ らしい", "高いらしい", "+ らしい", "静からしい"],
          ["Excessive (すぎる)", "い → すぎる", "高すぎる", "+ すぎる", "静かすぎる"],
          ["Become (なる)", "い → くなる", "高くなる", "+ になる", "静かになる"],
          ["Because (から)", "+ から", "高いから", "+ だから", "静かだから"],
          ["Although (けど)", "+ けど", "高いけど", "+ だけど", "静かだけど"],
          ["Modifying a noun", "directly before the noun", "高い山", "+ な before the noun", "静かな部屋"],
          ["Nominalized (の)", "+ の", "高いの", "+ なの", "静かなの"],
          ["Guess (だろう)", "+ だろう", "高いだろう", "+ だろう", "静かだろう"],
          ["Guess, polite (でしょう)", "+ でしょう", "高いでしょう", "+ でしょう", "静かでしょう"],
          ["Too... to... (すぎて)", "い → すぎて", "高すぎて買えない (too expensive to buy)", "+ すぎて", "静かすぎて眠れない (too quiet to sleep)"]
        ]
      },
      {
        type: "table",
        title: "Godan verbs: て-form and た-form by dictionary ending",
        headers: ["Dictionary ending","て-form","た-form"],
        rows: [
          ["う, つ, る", "って", "った"],
          ["ぬ, ぶ, む", "んで", "んだ"],
          ["す", "して", "した"],
          ["く", "いて", "いた"],
          ["ぐ", "いで", "いだ"]
        ]
      },
      { type: "note", text: "行く is the one well-known exception to this table: its て/た-forms are 行って／行った, following the う・つ・る pattern, not the く pattern its own ending would predict (行いて／行いた are not real words)." },
      { type: "note", text: "Ichidan verbs don't need a table at all here — just drop る and attach て or た directly: 食べる → 食べて／食べた, 見る → 見て／見た." },
      {
        type: "table",
        title: "Verb conjugations — Ichidan vs Godan",
        headers: ["Form","Ichidan rule","食べる (\"to eat\")","Godan rule","話す (\"to talk\")"],
        rows: [
          ["Dictionary", "base form", "食べる", "base form", "話す"],
          ["Polite (ます)", "る → ます", "食べます", "final kana → い column + ます", "話します"],
          ["Negative (ない)", "る → ない", "食べない", "final kana → あ column + ない", "話さない"],
          ["Want to (たい)", "る → たい", "食べたい", "final kana → い column + たい", "話したい"],
          ["Looks like (そう)", "る → そう", "食べそう", "final kana → い column + そう", "話しそう"],
          ["Easy to (やすい)", "る → やすい", "食べやすい", "final kana → い column + やすい", "話しやすい"],
          ["Hard to (にくい)", "る → にくい", "食べにくい", "final kana → い column + にくい", "話しにくい"],
          ["Command (なさい)", "る → なさい", "食べなさい", "final kana → い column + なさい", "話しなさい"],
          ["Do things like (たり)", "た + り", "食べたり", "た + り", "話したり"],
          ["Potential (can do)", "る → られる", "食べられる", "final kana → え column + る", "話せる"],
          ["Passive", "る → られる", "食べられる", "final kana → あ column + れる", "話される"],
          ["Causative", "る → させる", "食べさせる", "final kana → あ column + せる", "話させる"],
          ["Causative-passive", "る → させられる", "食べさせられる", "final kana → あ column + せられる", "話させられる"],
          ["Conditional (ば)", "る → れば", "食べれば", "final kana → え column + ば", "話せば"],
          ["Volitional (let's)", "る → よう", "食べよう", "final kana → お column + う", "話そう"],
          ["Imperative (command)", "る → ろ／よ", "食べろ", "final kana → え column", "話せ"],
          ["Prohibition (don't)", "+ な", "食べるな", "+ な", "話すな"]
        ]
      },
      { type: "paragraph", text: "\"Final kana → [column] + ending\" means: take the godan verb's last kana, find its row in the kana chart, and swap it for the kana in the target column of that same row (す is in the さ row, so its い-column form is し, giving 話します). The table below spells out every dictionary ending's full set of shifted forms directly, so there's no need to hunt through the full gojūon chart." },
      {
        type: "table",
        title: "Godan stem shifts by dictionary ending",
        headers: ["Ending","あ column (ない-form)","い column (ます-stem)","え column (ば／potential)","お column (volitional)"],
        rows: [
          ["う", "わ (買わない)", "い (買います)", "え (買えば)", "お (買おう)"],
          ["く", "か (書かない)", "き (書きます)", "け (書けば)", "こ (書こう)"],
          ["ぐ", "が (泳がない)", "ぎ (泳ぎます)", "げ (泳げば)", "ご (泳ごう)"],
          ["す", "さ (話さない)", "し (話します)", "せ (話せば)", "そ (話そう)"],
          ["つ", "た (待たない)", "ち (待ちます)", "て (待てば)", "と (待とう)"],
          ["ぬ", "な (死なない)", "に (死にます)", "ね (死ねば)", "の (死のう)"],
          ["ぶ", "ば (遊ばない)", "び (遊びます)", "べ (遊べば)", "ぼ (遊ぼう)"],
          ["む", "ま (読まない)", "み (読みます)", "め (読めば)", "も (読もう)"],
          ["る", "ら (取らない)", "り (取ります)", "れ (取れば)", "ろ (取ろう)"]
        ]
      },
      { type: "note", text: "う-ending verbs are the one row where the shifted kana doesn't visually match its own ending: the あ-column form uses わ, not あ (買う → 買わない, never 買あない). Every other ending shifts to a kana that's more obviously \"the same row\" — this is worth remembering as the single most common spelling mistake for this part of verb conjugation." }
    ]
  }
];
