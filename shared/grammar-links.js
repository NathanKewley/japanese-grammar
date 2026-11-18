// Links between grammar points (by Grammar Library id) and the other apps,
// written by hand. tools/tests/run.py checks every id exists and every label
// matches the library's pattern.
//
// Pages other than the library and the grammar course don't load the grammar
// data, so each linked point's pattern is kept here for link text.

/** Each linked point's pattern, as the library has it. */
export const GRAMMAR_LABELS = {
  'n5-masu': '～ます', 'n5-mashou': '～ましょう', 'n5-plain-form': '普通形', 'n5-te-kudasai': '～てください',
  'n5-tai': '～たい', 'n5-naide-kudasai': '～ないでください', 'n5-i-adj': 'い-adjectives', 'n5-na-adj': 'な-adjectives',
  'n5-desu': 'です', 'n5-janai': 'じゃない / ではない', 'n4-potential': '～られる / ～れる', 'n4-volitional': '意向形 (～よう / ～おう)',
  'n4-you-to-omou': '～ようと思う', 'n4-ba-form': '～ば', 'n4-nara-conditional': '～なら', 'n5-tara': '～たら',
  'n5-teiru': '～ている', 'n4-te-shimau': '～てしまう', 'n4-passive': '～される / ～られる', 'n4-causative': '～させる / ～せられる',
  'n4-causative-passive': '～させられる', 'n4-sou-da-looks': '～そうだ（様態）', 'n4-sou-da-hearsay': '～そうだ（伝聞）',
  'n4-sugiru': '～すぎる', 'n4-yasuikui': '～やすい / ～にくい', 'n4-naru': '～になる', 'n4-keigo-sonkeigo': '尊敬語 (お～になる / 特殊形)',
  'n4-keigo-kenjougo': '謙譲語 (お～する / 特殊形)', 'n5-nakereba': '～なければならない', 'n4-naku-te-mo-ii': '～なくてもいい',
  'n5-te-mo-ii': '～てもいい', 'n5-te-wa-ikenai': '～てはいけない', 'n4-temo': '～ても', 'n5-tari-tari': '～たり～たりする',
  'n5-nagara': '～ながら', 'n3-zu-ni': '～ずに', 'n4-te-oku': '～ておく', 'n4-tearu': '～てある', 'n4-te-miru': '～てみる',
  'n3-to-suru': '～とする', 'n3-ba-hodo': '～ば～ほど', 'n4-rashii': '～らしい', 'n4-youdes': '～ようだ / ～ようです',
  'n4-mitai': '～みたい', 'n4-pukai': '～はずだ', 'n4-sa-nominalizer': '～さ', 'n4-garu': '～がる',
  'n2-ni-kanarazu': '～ざるを得ない', 'n2-zu-ni-wa-irarenai': '～ずにはいられない', 'n2-kabon': '～かねる', 'n2-kanenai': '～かねない',
  'n2-eru-uru': '～得る / ～得ない', 'n3-panashi': '～っぱなし', 'n3-gachi': '～がち', 'n2-poi-koto': '～っこない',
  'n2-yo-ga-nai': '～ようがない / ～ようもない', 'n3-gatai': '～がたい', 'n3-beki': '～べき / ～べきではない', 'n2-mai': '～まい / ～んじゃないか',
  'n2-nebanaranai': '～ねばならない', 'n1-nn-bakari-ni': '～んばかりに', 'n1-beku': '～べく', 'n2-mono-nara': '～ものなら',
  'n4-te-kureru': '～てくれる', 'n4-te-morau': '～てもらう', 'n4-te-ikukuru': '～ていく / ～てくる',
};

/** The grammar points behind each Conjugation lesson, by lesson number. */
export const CONJUGATION_LESSONS = {
  2: ['n5-masu'],
  3: ['n5-masu', 'n5-mashou'],
  5: ['n5-plain-form'],
  6: ['n5-te-kudasai'],
  8: ['n5-plain-form'],
  9: ['n5-tai', 'n5-naide-kudasai'],
  12: ['n5-i-adj'],
  13: ['n5-i-adj'],
  14: ['n5-na-adj', 'n5-desu', 'n5-janai'],
  15: ['n5-na-adj', 'n5-desu'],
  16: ['n5-i-adj', 'n5-na-adj'],
  17: ['n5-i-adj', 'n5-na-adj'],
  19: ['n4-potential'],
  20: ['n4-volitional', 'n4-you-to-omou'],
  22: ['n4-ba-form', 'n4-nara-conditional'],
  23: ['n5-tara'],
  24: ['n5-teiru', 'n4-te-shimau'],
  25: ['n4-passive'],
  26: ['n4-causative'],
  27: ['n4-causative-passive'],
  28: ['n4-sou-da-looks', 'n4-sugiru'],
  29: ['n4-yasuikui', 'n4-naru'],
  31: ['n4-keigo-sonkeigo'],
  32: ['n4-keigo-kenjougo'],
  33: ['n4-keigo-sonkeigo', 'n4-keigo-kenjougo'],
  34: ['n4-keigo-sonkeigo', 'n4-keigo-kenjougo'],
  36: ['n5-nakereba', 'n4-naku-te-mo-ii', 'n5-te-mo-ii', 'n5-te-wa-ikenai'],
  37: ['n4-temo', 'n5-tari-tari'],
  38: ['n5-nagara', 'n3-zu-ni'],
  39: ['n4-te-oku', 'n4-tearu', 'n4-te-miru'],
  40: ['n4-potential', 'n4-passive', 'n4-causative'],
  41: ['n3-to-suru', 'n3-ba-hodo'],
  42: ['n4-rashii', 'n4-youdes', 'n4-mitai'],
  43: ['n4-pukai'],
  44: ['n4-sa-nominalizer', 'n4-garu'],
  45: ['n4-keigo-sonkeigo', 'n4-keigo-kenjougo'],
  47: ['n2-ni-kanarazu', 'n2-zu-ni-wa-irarenai'],
  48: ['n2-kabon', 'n2-kanenai', 'n2-eru-uru'],
  49: ['n3-panashi', 'n3-gachi'],
  50: ['n2-poi-koto', 'n2-yo-ga-nai', 'n3-gatai'],
  51: ['n3-beki', 'n2-mai'],
  55: ['n2-nebanaranai'],
  56: ['n1-nn-bakari-ni', 'n1-beku'],
  57: ['n2-mono-nara'],
};

/**
 * The grammar points behind each part of a form label in Reading and
 * Listening ("て-form, ongoing (ている), polite"). Plain parts like "past" and
 * "て-form" have no single grammar point, so they aren't linked.
 */
export const PASSAGE_FORMS = {
  'polite': ['n5-masu'],
  'plain': ['n5-plain-form'],
  'ongoing (ている)': ['n5-teiru'],
  'done (てある)': ['n4-tearu'],
  'passive': ['n4-passive'],
  'passive or potential': ['n4-passive', 'n4-potential'],
  'causative': ['n4-causative'],
  'conditional (ば)': ['n4-ba-form'],
  'conditional (たら)': ['n5-tara'],
  'done for you': ['n4-te-kureru'],
  'done for you (てくれる)': ['n4-te-kureru'],
  'polite (てくださる)': ['n4-te-kureru'],
  'have done for you': ['n4-te-morau'],
  'have done for you (てもらう)': ['n4-te-morau'],
  'humble (ていただく)': ['n4-te-morau'],
  'completely (てしまう)': ['n4-te-shimau'],
  'want to': ['n5-tai'],
  'while (ながら)': ['n5-nagara'],
  'and so on (たり)': ['n5-tari-tari'],
  'coming (てくる)': ['n4-te-ikukuru'],
  'going (ていく)': ['n4-te-ikukuru'],
  'looks like (そうだ)': ['n4-sou-da-looks'],
  'I hear (そうだ)': ['n4-sou-da-hearsay'],
  'in advance (ておく)': ['n4-te-oku'],
  'try (てみる)': ['n4-te-miru'],
  'too much (すぎる)': ['n4-sugiru'],
  'apparently': ['n4-rashii'],
};

/**
 * The grammar points in a passage word's form label, in order, once each.
 * [text] is the word as written: "polite" is です after a noun or adjective
 * (円です), and ます after a verb.
 */
export function grammarInForm(label, text = '') {
  const out = [];
  for (const part of String(label || '').split(', ')) {
    const ids = part === 'polite' && /で(す|し)/.test(text) ? ['n5-desu'] : PASSAGE_FORMS[part] || [];
    for (const id of ids) if (!out.includes(id)) out.push(id);
  }
  return out;
}

/** For the grammar course: the Conjugation lessons behind each grammar point. */
export const CONJUGATION_FOR_GRAMMAR = (() => {
  const out = {};
  for (const [lesson, ids] of Object.entries(CONJUGATION_LESSONS)) {
    for (const id of ids) (out[id] ||= []).push({ lesson: Number(lesson), section: `l${lesson}.learn` });
  }
  return out;
})();

/** A link to a grammar point in the library, from a page one folder down. */
export const libraryHref = (id) => `../grammar/index.html#${id}`;
