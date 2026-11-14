// Romaji to hiragana, for typing answers on a keyboard without a Japanese
// input method. Accepts Hepburn and the usual keyboard spellings (si, tu, zi…).

const TABLE = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  sa: 'さ', si: 'し', shi: 'し', su: 'す', se: 'せ', so: 'そ',
  za: 'ざ', zi: 'じ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  ta: 'た', ti: 'ち', chi: 'ち', tu: 'つ', tsu: 'つ', te: 'て', to: 'と',
  da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', hu: 'ふ', fu: 'ふ', he: 'へ', ho: 'ほ',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wi: 'うぃ', we: 'うぇ', wo: 'を',
  "n'": 'ん', xn: 'ん',
  fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ',
  va: 'ゔぁ', vi: 'ゔぃ', vu: 'ゔ', ve: 'ゔぇ', vo: 'ゔぉ',
  je: 'じぇ', che: 'ちぇ', she: 'しぇ', thi: 'てぃ', dhi: 'でぃ',
  xa: 'ぁ', xi: 'ぃ', xu: 'ぅ', xe: 'ぇ', xo: 'ぉ', la: 'ぁ', li: 'ぃ', lu: 'ぅ', le: 'ぇ', lo: 'ぉ',
  xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ', lya: 'ゃ', lyu: 'ゅ', lyo: 'ょ',
  xtu: 'っ', xtsu: 'っ', ltu: 'っ', ltsu: 'っ', xwa: 'ゎ',
  '-': 'ー',
};

// The y-combinations: kya, sha, cho, ...
const Y_ROWS = { k: 'き', g: 'ぎ', n: 'に', h: 'ひ', b: 'び', p: 'ぴ', m: 'み', r: 'り', s: 'し', z: 'じ', j: 'じ', t: 'ち', c: 'ち', d: 'ぢ' };
for (const [c, kana] of Object.entries(Y_ROWS)) {
  TABLE[`${c}ya`] = `${kana}ゃ`;
  TABLE[`${c}yu`] = `${kana}ゅ`;
  TABLE[`${c}yo`] = `${kana}ょ`;
}
Object.assign(TABLE, { sha: 'しゃ', shu: 'しゅ', sho: 'しょ', cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', ja: 'じゃ', ju: 'じゅ', jo: 'じょ' });

const LONGEST = 4;
const VOWELS = 'aiueo';

/** Converts romaji in [text] to hiragana, leaving anything else as it is. */
export function toHiragana(text) {
  const s = text.toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    // A doubled consonant is a small っ: kitte, matcha.
    if (c === s[i + 1] && /[bcdfghjkmpqrstvwxyz]/.test(c)) {
      out += 'っ';
      i++;
      continue;
    }
    if (c === 't' && s[i + 1] === 'c' && s[i + 2] === 'h') {
      out += 'っ';
      i++;
      continue;
    }
    // nn is ん; before a vowel it's ん plus the next kana (onna, konnichiwa).
    if (c === 'n' && s[i + 1] === 'n') {
      out += 'ん';
      i += VOWELS.includes(s[i + 2] || '') || s[i + 2] === 'y' ? 1 : 2;
      continue;
    }
    let matched = false;
    for (let len = LONGEST; len >= 1; len--) {
      const chunk = s.slice(i, i + len);
      if (chunk.length === len && TABLE[chunk] && !(chunk === 'n' && len === 1)) {
        out += TABLE[chunk];
        i += len;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    // A lone n before a consonant (or at the end) is ん.
    if (c === 'n' && (i + 1 === s.length || (!VOWELS.includes(s[i + 1]) && s[i + 1] !== 'y'))) {
      out += 'ん';
      i++;
      continue;
    }
    out += text[i];
    i++;
  }
  return out;
}

/** Whether [text] has any Latin letters worth converting. */
export function hasRomaji(text) {
  return /[a-z]/i.test(text);
}

/** Converts romaji answers to kana; Japanese input is left as it is. */
export function normaliseTyped(text) {
  return hasRomaji(text) ? toHiragana(text) : text;
}
