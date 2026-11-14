// The kana practised in the first four lessons, as rows of [kana, romaji].

function row(name, kana, romaji) {
  const letters = [...kana];
  const sounds = romaji.split(' ');
  return { name, kana: letters.map((k, i) => [k, sounds[i]]) };
}

const hiraganaBasic = [
  row('Vowels', 'あいうえお', 'a i u e o'),
  row('K row', 'かきくけこ', 'ka ki ku ke ko'),
  row('S row', 'さしすせそ', 'sa shi su se so'),
  row('T row', 'たちつてと', 'ta chi tsu te to'),
  row('N row', 'なにぬねの', 'na ni nu ne no'),
  row('H row', 'はひふへほ', 'ha hi fu he ho'),
  row('M row', 'まみむめも', 'ma mi mu me mo'),
  row('Y row', 'やゆよ', 'ya yu yo'),
  row('R row', 'らりるれろ', 'ra ri ru re ro'),
  row('W row and N', 'わをん', 'wa wo n'),
];

const hiraganaExtra = [
  row('G row', 'がぎぐげご', 'ga gi gu ge go'),
  row('Z row', 'ざじずぜぞ', 'za ji zu ze zo'),
  row('D row', 'だぢづでど', 'da ji zu de do'),
  row('B row', 'ばびぶべぼ', 'ba bi bu be bo'),
  row('P row', 'ぱぴぷぺぽ', 'pa pi pu pe po'),
  row('Small kana', 'ゃゅょっ', 'ya yu yo (pause)'),
  row('Lookalikes 1', 'ぬめ', 'nu me'),
  row('Lookalikes 2', 'われね', 'wa re ne'),
  row('Lookalikes 3', 'はほ', 'ha ho'),
  row('Lookalikes 4', 'るろ', 'ru ro'),
  row('Lookalikes 5', 'さきち', 'sa ki chi'),
];

const katakanaBasic = [
  row('Vowels', 'アイウエオ', 'a i u e o'),
  row('K row', 'カキクケコ', 'ka ki ku ke ko'),
  row('S row', 'サシスセソ', 'sa shi su se so'),
  row('T row', 'タチツテト', 'ta chi tsu te to'),
  row('N row', 'ナニヌネノ', 'na ni nu ne no'),
  row('H row', 'ハヒフヘホ', 'ha hi fu he ho'),
  row('M row', 'マミムメモ', 'ma mi mu me mo'),
  row('Y row', 'ヤユヨ', 'ya yu yo'),
  row('R row', 'ラリルレロ', 'ra ri ru re ro'),
  row('W row and N', 'ワヲン', 'wa wo n'),
];

const katakanaExtra = [
  row('G and Z rows', 'ガギグゲゴザジズゼゾ', 'ga gi gu ge go za ji zu ze zo'),
  row('D and B rows', 'ダヂヅデドバビブベボ', 'da ji zu de do ba bi bu be bo'),
  row('P row and long vowel', 'パピプペポー', 'pa pi pu pe po (long)'),
  row('Small kana', 'ャュョッ', 'ya yu yo (pause)'),
  row('Lookalikes: shi and tsu', 'シツ', 'shi tsu'),
  row('Lookalikes: so and n', 'ソン', 'so n'),
  row('Lookalikes: ku, ke and ta', 'クケタ', 'ku ke ta'),
  row('Lookalikes: u, wa and fu', 'ウワフ', 'u wa fu'),
  row('Lookalikes: nu and su', 'ヌス', 'nu su'),
  row('Lookalikes: a and ma', 'アマ', 'a ma'),
];

/** Katakana words to write, as [katakana, meaning]. */
const katakanaWords = [
  ['コーヒー', 'coffee'],
  ['ホテル', 'hotel'],
  ['タクシー', 'taxi'],
  ['スーツケース', 'suitcase'],
  ['ラーメン', 'ramen'],
  ['コンビニ', 'convenience store'],
  ['チケット', 'ticket'],
  ['パスポート', 'passport'],
];

/** Kana sets by the name used in the course content. */
export const KANA_SETS = {
  'hiragana-basic': { title: 'Hiragana', rows: hiraganaBasic, words: [] },
  'hiragana-extra': { title: 'Hiragana: sounds and lookalikes', rows: hiraganaExtra, words: [] },
  'katakana-basic': { title: 'Katakana', rows: katakanaBasic, words: [] },
  'katakana-extra': { title: 'Katakana: sounds, lookalikes and words', rows: katakanaExtra, words: katakanaWords },
};
