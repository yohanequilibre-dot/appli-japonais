/* Kotoba — comparaison de la prononciation entendue avec la lecture du mot. */
(function (root, factory) {
var api = factory(root);
if (root && root.Kotoba) root.Kotoba.Pronunciation = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
'use strict';
function toHiragana(value) {
return String(value || '').replace(/[ァ-ヶ]/g, function (ch) {
return String.fromCharCode(ch.charCodeAt(0) - 0x60);
});
}
function stripNoise(value) {
return toHiragana(value)
.replace(/[ \t\n\r　、。！？!?.,・「」『』（）()［］\[\]…‥〜~—–-]/g, '')
.replace(/を/g, 'お');
}
var LONG_VOWELS = {
'あ': 'あ', 'か': 'あ', 'さ': 'あ', 'た': 'あ', 'な': 'あ', 'は': 'あ', 'ま': 'あ', 'や': 'あ', 'ら': 'あ', 'わ': 'あ', 'ぁ': 'あ',
'い': 'い', 'き': 'い', 'し': 'い', 'ち': 'い', 'に': 'い', 'ひ': 'い', 'み': 'い', 'り': 'い', 'ゐ': 'い', 'ぃ': 'い',
'う': 'う', 'く': 'う', 'す': 'う', 'つ': 'う', 'ぬ': 'う', 'ふ': 'う', 'む': 'う', 'ゆ': 'う', 'る': 'う', 'ゔ': 'う', 'ぅ': 'う',
'え': 'え', 'け': 'え', 'せ': 'え', 'て': 'え', 'ね': 'え', 'へ': 'え', 'め': 'え', 'れ': 'え', 'ゑ': 'え', 'ぇ': 'え',
'お': 'お', 'こ': 'お', 'そ': 'お', 'と': 'お', 'の': 'お', 'ほ': 'お', 'も': 'お', 'よ': 'お', 'ろ': 'お', 'を': 'お', 'ぉ': 'お'
};
function expandLongVowels(value) {
var out = '';
for (var i = 0; i < value.length; i++) {
var ch = value.charAt(i);
if (ch === 'ー') {
var vowel = LONG_VOWELS[out.charAt(out.length - 1)];
if (vowel) out += vowel;
} else {
out += ch;
}
}
return out;
}
function basePhonetic(value) {
return expandLongVowels(stripNoise(value));
}
function particlePhonetic(value) {
return basePhonetic(value)
.replace(/こんにちは/g, 'こんにちわ')
.replace(/こんばんは/g, 'こんばんわ')
.replace(/(私|僕|俺|あなた|彼女|彼|これ|それ|あれ|どこ|ここ|そこ|今日|明日|昨日|田中さん|花さん|学校|日本|東京|水|ご飯|友達|学生|先生|会社員|日本人|フランス人|わたし|ぼく|おれ|かれ|かのじょ|きょう|あした|きのう|たなかさん|はなさん|がっこう|にほん|とうきょう|みず|ごはん|ともだち|がくせい|せんせい|かいしゃいん|にほんじん|ふらんすじん)は/g, '$1わ')
.replace(/へ(?=(行|来|帰|向|入|出|着|飛|歩|走|車|電車|バス|駅|学校|日本|東京|家|部屋))/g, 'え')
.replace(/へ$/, 'え');
}
function uniqueVariants(text, readingOf) {
var raws = [String(text || '')];
if (readingOf) {
try {
var kana = readingOf(raws[0]);
if (kana && String(kana) !== raws[0]) raws.push(String(kana));
} catch (e) { /* lecture facultative */ }
}
var out = [];
var seen = {};
raws.forEach(function (raw) {
var base = basePhonetic(raw);
var particles = particlePhonetic(raw);
[base, particles].forEach(function (value, index) {
if (!value || seen[value]) return;
seen[value] = true;
out.push({ value: value, variant: index === 1 && particles !== base, raw: raw, kana: !/[一-鿿]/.test(value) });
});
});
return out;
}
function levenshtein(a, b) {
var m = a.length;
var n = b.length;
if (!m) return n;
if (!n) return m;
var previous = [];
var current = [];
var i;
var j;
for (j = 0; j <= n; j++) previous[j] = j;
for (i = 1; i <= m; i++) {
current[0] = i;
for (j = 1; j <= n; j++) {
var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
}
for (j = 0; j <= n; j++) previous[j] = current[j];
}
return previous[n];
}
function similarity(a, b) {
if (a === b) return 1;
if (!a || !b) return 0;
var max = Math.max(a.length, b.length);
return 1 - levenshtein(a, b) / max;
}
function align(expected, heard) {
var m = expected.length;
var n = heard.length;
if (!m && !n) return [];
var dp = [];
var i;
var j;
for (i = 0; i <= m; i++) {
dp[i] = [];
dp[i][0] = i;
}
for (j = 0; j <= n; j++) dp[0][j] = j;
for (i = 1; i <= m; i++) {
for (j = 1; j <= n; j++) {
var cost = expected.charAt(i - 1) === heard.charAt(j - 1) ? 0 : 1;
dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
}
}
var ops = [];
i = m;
j = n;
while (i > 0 || j > 0) {
if (i > 0 && j > 0 && expected.charAt(i - 1) === heard.charAt(j - 1)) {
ops.push({ type: 'same', expected: expected.charAt(i - 1), heard: heard.charAt(j - 1) });
i--;
j--;
} else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
ops.push({ type: 'sub', expected: expected.charAt(i - 1), heard: heard.charAt(j - 1) });
i--;
j--;
} else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
ops.push({ type: 'del', expected: expected.charAt(i - 1), heard: '' });
i--;
} else {
ops.push({ type: 'ins', expected: '', heard: heard.charAt(j - 1) });
j--;
}
}
return ops.reverse();
}
function plainKana(value) {
return toHiragana(String(value || ''))
.replace(/[ \t\n\r　、。！？!?.,・「」『』（）()［］\[\]…‥〜~—–-]/g, '')
.replace(/を/g, 'お');
}
function occurrences(value, needle) {
var count = 0;
var text = String(value || '');
var at = 0;
while ((at = text.indexOf(needle, at)) >= 0) { count++; at += needle.length; }
return count;
}
function longVowelCues(value) {
var text = plainKana(value);
var count = occurrences(text, 'ー');
['おう', 'えい', 'おお'].forEach(function (pattern) {
count += occurrences(text, pattern);
});
return count;
}
function rhythmReport(expectedRaw, heardRaw) {
var expected = plainKana(expectedRaw);
var heard = plainKana(heardRaw);
var expectedPhonetic = basePhonetic(expectedRaw);
var heardPhonetic = basePhonetic(heardRaw);
var expectedSokuon = occurrences(expected, 'っ');
var heardSokuon = occurrences(heard, 'っ');
var expectedLong = longVowelCues(expected);
var heardLong = longVowelCues(heard);
return {
expectedSokuon: expectedSokuon,
heardSokuon: heardSokuon,
missingSokuon: expectedSokuon > heardSokuon,
expectedLongVowels: expectedLong,
heardLongVowels: heardLong,
missingLongVowel: expectedLong > heardLong && heardPhonetic.length < expectedPhonetic.length
};
}
function advice(rawTarget, expected, heard, score, variant, rhythm) {
if (!heard) return 'Aucun son reconnu. Rapproche-toi du micro et réessaie.';
if (variant) return 'Les particules は, を et へ se prononcent wa, o et e : vérifie qu’elles sont bien détachées.';
if (score >= 95) return 'Très proche du modèle. Continue au même rythme.';
if (rhythm && rhythm.missingSokuon) return 'Marque la petite pause du っ avant la consonne suivante : elle change le rythme du mot.';
if (rhythm && rhythm.missingLongVowel) return 'Tiens la voyelle longue : elle dure environ deux temps, comme dans コーヒー.';
if (String(rawTarget || '').indexOf('ー') >= 0 && score < 100) return 'Tiens la voyelle longue : le ー allonge la syllabe précédente.';
if (String(rawTarget || '').indexOf('ん') >= 0 && heard.indexOf('ん') < 0) return 'Le ん doit s’entendre, même s’il est court.';
if (score >= 75) return 'Bien, quelques sons à préciser. Réécoute le modèle puis répète.';
return 'Réécoute le modèle, puis répète lentement en articulant.';
}
function compare(transcript, entry, options) {
var opts = options || {};
var raw = String(transcript || '').trim();
var targets = [];
function addTarget(value, alternative, label) {
var text = String(value || '').trim();
if (!text || targets.some(function (item) { return item.value === text; })) return;
targets.push({ value: text, alternative: !!alternative, label: String(label || text) });
}
addTarget(entry && entry.reading, false, entry && entry.jp);
addTarget(entry && entry.jp, false, entry && entry.jp);
(Array.isArray(entry && entry.alternatives) ? entry.alternatives : []).forEach(function (alt) {
addTarget(alt && (alt.reading || alt.jp), true, alt && (alt.jp || alt.reading));
addTarget(alt && alt.jp, true, alt && (alt.jp || alt.reading));
});
var heardVariants = uniqueVariants(raw, opts.readingOf);
var expectedVariants = [];
targets.forEach(function (target) {
uniqueVariants(target.value, null).forEach(function (variant) {
variant.alternative = target.alternative;
variant.label = target.label;
expectedVariants.push(variant);
});
});
var best = {
score: 0,
target: targets[0] ? targets[0].value : '',
expectedRaw: targets[0] ? targets[0].value : '',
expected: '',
heard: '',
variant: false,
alternative: false,
alternativeLabel: '',
kanaPair: false,
diff: []
};
heardVariants.forEach(function (heardItem) {
expectedVariants.forEach(function (expectedItem) {
var sim = similarity(heardItem.value, expectedItem.value);
if (raw && raw === expectedItem.raw) sim = 1;
var usedVariant = heardItem.variant || expectedItem.variant;
var preferKana = heardItem.kana && expectedItem.kana;
if (sim > best.score + 1e-9 ||
(Math.abs(sim - best.score) < 1e-9 && preferKana && !best.kanaPair) ||
(Math.abs(sim - best.score) < 1e-9 && best.variant && !usedVariant && !(best.kanaPair && !preferKana))) {
best = {
score: sim,
target: expectedItem.raw,
expectedRaw: expectedItem.raw,
expected: expectedItem.value,
heard: heardItem.value,
variant: usedVariant,
alternative: expectedItem.alternative,
alternativeLabel: expectedItem.label || '',
kanaPair: preferKana,
diff: align(expectedItem.value, heardItem.value)
};
}
});
});
var rhythm = rhythmReport(best.target || '', raw);
var score = Math.round(best.score * 100);
if (rhythm.missingSokuon) score -= 10;
if (rhythm.missingLongVowel) score -= 8;
score = Math.max(0, Math.min(100, score));
return {
transcript: raw,
target: best.target || (targets[0] && targets[0].value) || '',
expected: best.expected,
heard: best.heard,
score: score,
good: score >= 75,
close: score >= 60,
rhythm: rhythm,
variant: !!best.variant,
alternative: !!best.alternative,
alternativeLabel: best.alternativeLabel || '',
diff: best.diff || [],
tip: advice(best.expectedRaw || best.target || '', best.expected, best.heard, score, best.variant, rhythm)
};
}
function best(transcripts, entry, options) {
var out = null;
(transcripts || []).forEach(function (transcript) {
var result = compare(transcript, entry, options);
if (!out || result.score > out.score || (result.score === out.score && result.diff.length < out.diff.length)) out = result;
});
return out || compare('', entry, options);
}
function supported() {
return !!(root && (root.SpeechRecognition || root.webkitSpeechRecognition));
}
return {
compare: compare,
best: best,
supported: supported,
phonetic: basePhonetic,
similarity: similarity,
align: align,
rhythm: rhythmReport
};
});
