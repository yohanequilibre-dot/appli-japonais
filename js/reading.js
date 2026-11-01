/* Kotoba — lectures et furigana automatiques pour les mots et les phrases. */
(function (root, factory) {
var api = factory(root);
if (root && root.Kotoba) root.Kotoba.Reading = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
'use strict';
var P = root.Kotoba && root.Kotoba.Parser;
var EXTRA = [
['東京', '東京[とうきょう]'],
['花', '花[はな]'],
['田中', '田中[たなか]'],
['夜', '夜[よる]'],
['元気', '元気[げんき]'],
['夏', '夏[なつ]'],
['冬', '冬[ふゆ]'],
['料理', '料理[りょうり]'],
['大学生', '大学生[だいがくせい]'],
['五階', '五階[ごかい]'],
['三時', '三時[さんじ]'],
['九時', '九時[くじ]'],
['六歳', '六歳[ろくさい]'],
['二人', '二人[ふたり]'],
['四人', '四人[よにん]'],
['八時', '八時[はちじ]'],
['十一時', '十一時[じゅういちじ]'],
['六時', '六時[ろくじ]'],
['五時', '五時[ごじ]'],
['一杯', '一杯[いっぱい]'],
['二つ', '二つ[ふたつ]'],
['三回', '三回[さんかい]'],
['一日', '一日[いちにち]'],
['一本', '一本[いっぽん]'],
['二枚', '二枚[にまい]'],
['一人', '一人[ひとり]'],
['半分', '半分[はんぶん]'],
['毎朝', '毎朝[まいあさ]'],
['毎晩', '毎晩[まいばん]'],
['今月', '今月[こんげつ]'],
['今年', '今年[ことし]'],
['来週', '来週[らいしゅう]'],
['日本料理', '日本料理[にほんりょうり]'],
['夏祭り', '夏祭り[なつまつり]'],
['お元気', 'お元気[おげんき]'],
['お名前', 'お名前[おなまえ]'],
['お会計', 'お会計[おかいけい]'],
['下さい', '下さい[ください]']
];
var DIGRAPHS = new Set([
'きゃ', 'きゅ', 'きょ', 'しゃ', 'しゅ', 'しょ', 'ちゃ', 'ちゅ', 'ちょ',
'にゃ', 'にゅ', 'にょ', 'ひゃ', 'ひゅ', 'ひょ', 'みゃ', 'みゅ', 'みょ',
'りゃ', 'りゅ', 'りょ', 'ぎゃ', 'ぎゅ', 'ぎょ', 'じゃ', 'じゅ', 'じょ',
'びゃ', 'びゅ', 'びょ', 'ぴゃ', 'ぴゅ', 'ぴょ',
'キャ', 'キュ', 'キョ', 'シャ', 'シュ', 'ショ', 'チャ', 'チュ', 'チョ',
'ニャ', 'ニュ', 'ニョ', 'ヒャ', 'ヒュ', 'ヒョ', 'ミャ', 'ミュ', 'ミョ',
'リャ', 'リュ', 'リョ', 'ギャ', 'ギュ', 'ギョ', 'ジャ', 'ジュ', 'ジョ',
'ビャ', 'ビュ', 'ビョ', 'ピャ', 'ピュ', 'ピョ'
]);
var cache = null;
function esc(value) {
return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
});
}
function strip(value) {
return P ? P.stripAnnotations(String(value || '')) : String(value || '');
}
function hasKanji(value) {
var s = String(value || '');
if (P && P.hasKanji) return P.hasKanji(s);
return Array.from(s).some(function (ch) {
var c = ch.codePointAt(0);
return c >= 0x3400 && c <= 0x9fff;
});
}
function add(map, jp, ruby, reading) {
var base = strip(jp);
if (!base || !hasKanji(base)) return;
var annotated = '';
if (ruby && String(ruby).indexOf('[') >= 0 && strip(ruby) === base) {
annotated = String(ruby);
} else if (reading) {
var rd = strip(reading);
if (rd && !hasKanji(rd) && P) {
try { annotated = P.annotate(base, rd); } catch (e) { annotated = ''; }
}
}
if (!annotated || annotated === base || annotated.indexOf('[') < 0) return;
if (!map.has(base)) map.set(base, annotated);
}
function dictionary() {
if (cache) return cache;
var map = new Map();
var Lex = root.Kotoba && root.Kotoba.Lexicon;
if (Lex && Lex.entries) {
Lex.entries.forEach(function (e) { add(map, e.jp, e.ruby, e.reading); });
}
(root.UNITS_DATA || []).forEach(function (unit) {
(unit.words || []).forEach(function (word) { add(map, word[0], word[1], word[1]); });
});
EXTRA.forEach(function (pair) {
if (!map.has(pair[0])) map.set(pair[0], pair[1]);
});
cache = {
map: map,
keys: Array.from(map.keys()).sort(function (a, b) { return b.length - a.length; })
};
return cache;
}
function rtHtml(reading) {
var romaji = P && P.kanaToRomaji ? P.kanaToRomaji(reading) : '';
return '<rt>' +
(romaji ? '<span class="rt-romaji">' + esc(romaji) + '</span>' : '') +
'<span class="rt-kana">' + esc(reading) + '</span>' +
'</rt>';
}
function rubyHtml(annotated) {
var s = String(annotated || '');
var out = '';
var last = 0;
var re = /([^\s\[\]]+?)\[([^\]]+)\]/g;
var m;
while ((m = re.exec(s))) {
out += esc(s.slice(last, m.index));
out += '<ruby>' + esc(m[1]) + rtHtml(m[2]) + '</ruby>';
last = re.lastIndex;
}
out += esc(s.slice(last));
return out;
}
function tokenize(text) {
var d = dictionary();
var out = '';
var i = 0;
while (i < text.length) {
var hit = '';
for (var k = 0; k < d.keys.length; k++) {
if (text.startsWith(d.keys[k], i)) { hit = d.keys[k]; break; }
}
if (hit) {
out += rubyHtml(d.map.get(hit));
i += hit.length;
} else {
out += esc(text.charAt(i));
i++;
}
}
return out;
}
function splitTarget(text, target) {
var out = [];
var i = 0;
while (i < text.length) {
var idx = text.indexOf(target, i);
if (idx < 0) { out.push({ text: text.slice(i), target: false }); break; }
if (idx > i) out.push({ text: text.slice(i, idx), target: false });
out.push({ text: target, target: true });
i = idx + target.length;
}
return out;
}
function annotate(text, highlight, showFurigana) {
var s = String(text || '').trim();
if (!s) return '';
var target = String(highlight || '').trim();
var useFuri = showFurigana !== false;
if (!target || s.indexOf(target) < 0) return useFuri ? tokenize(s) : esc(s);
return splitTarget(s, target).map(function (part) {
var inner = useFuri ? tokenize(part.text) : esc(part.text);
return part.target ? '<mark>' + inner + '</mark>' : inner;
}).join('');
}
function kanaUnits(value) {
var chars = Array.from(String(value || ''));
var out = [];
for (var i = 0; i < chars.length; i++) {
var unit = chars[i];
if (unit === 'ー' && out.length) { out[out.length - 1] += unit; continue; }
if ((unit === 'っ' || unit === 'ッ') && i + 1 < chars.length) {
unit += chars[i + 1];
i++;
if (i + 1 < chars.length && DIGRAPHS.has(chars[i] + chars[i + 1])) {
unit += chars[i + 1];
i++;
}
} else if (i + 1 < chars.length && DIGRAPHS.has(unit + chars[i + 1])) {
unit += chars[i + 1];
i++;
if (i + 1 < chars.length && chars[i + 1] === 'ー') {
unit += chars[i + 1];
i++;
}
} else if (i + 1 < chars.length && chars[i + 1] === 'ー') {
unit += chars[i + 1];
i++;
}
out.push(unit);
}
return out;
}
function kanaReading(entry) {
if (!entry) return '';
var reading = strip(entry.reading || entry.jp);
if (!reading || hasKanji(reading)) return '';
var units = kanaUnits(reading);
var lastIndex = units.length - 1;
var wordRomaji = String(entry.romaji || '').toLowerCase();
return units.map(function (unit, index) {
var romaji = P ? P.kanaToRomaji(unit) : '';
if (index === lastIndex && unit === 'は' && /wa$/.test(wordRomaji)) romaji = 'wa';
if (index === lastIndex && unit === 'へ' && /e$/.test(wordRomaji)) romaji = 'e';
return '<ruby>' + esc(unit) + '<rt class="rt-romaji">' + esc(romaji) + '</rt></ruby>';
}).join('');
}
function reading(text) {
var d = dictionary();
var s = String(text || '');
var out = '';
var i = 0;
while (i < s.length) {
var hit = '';
for (var k = 0; k < d.keys.length; k++) {
if (s.startsWith(d.keys[k], i)) { hit = d.keys[k]; break; }
}
if (hit) {
out += String(d.map.get(hit)).replace(/([^\s\[\]]+?)\[([^\]]+)\]/g, '$2');
i += hit.length;
} else {
out += s.charAt(i);
i++;
}
}
return out;
}
return {
annotate: annotate,
reading: reading,
kanaReading: kanaReading,
kanaUnits: kanaUnits,
dictionary: dictionary
};
});
