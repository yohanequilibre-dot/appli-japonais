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
function addPoliteForms(map) {
var Pol = root.Kotoba && root.Kotoba.Polite;
if (!Pol || !Pol.variants) return;
function addEntry(entry) {
var forms = Pol.variants(entry) || [];
forms.forEach(function (form) {
if (form && form.jp) add(map, form.jp, form.ruby, form.reading);
});
}
var Lex = root.Kotoba && root.Kotoba.Lexicon;
if (Lex && Lex.entries) Lex.entries.forEach(addEntry);
(root.UNITS_DATA || []).forEach(function (unit) {
(unit.words || []).forEach(addEntry);
});
}
function dictionary() {
if (cache) return cache;
var map = new Map();
var Lex = root.Kotoba && root.Kotoba.Lexicon;
if (Lex && Lex.entries) {
Lex.entries.forEach(function (e) { add(map, e.jp, e.ruby, e.reading); });
}
(root.UNITS_DATA || []).forEach(function (unit) {
(unit.words || []).forEach(function (word) {
if (Array.isArray(word)) add(map, word[0], word[1], word[1]);
else if (word && word.jp) add(map, word.jp, word.ruby, word.reading);
});
});
EXTRA.forEach(function (pair) {
if (!map.has(pair[0])) map.set(pair[0], pair[1]);
});
addPoliteForms(map);
cache = {
map: map,
keys: Array.from(map.keys()).sort(function (a, b) { return b.length - a.length; })
};
return cache;
}
function isJapanese(value) {
return /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\u3005]/.test(String(value || ''));
}
function rubyChar(base, reading, override) {
var text = String(base == null ? '' : base);
if (!text) return '';
var romaji = override != null ? String(override) : (P && P.kanaToRomaji ? P.kanaToRomaji(reading || text) : '');
if (!romaji) return esc(text);
return '<ruby>' + esc(text) + '<rt><span class="rt-romaji">' + esc(romaji) + '</span></rt></ruby>';
}
var particleSegmenter = null;
function particleOverrides(value) {
var text = String(value || '');
var overrides = {};
if (!text || typeof Intl === 'undefined' || !Intl.Segmenter) return overrides;
try {
if (!particleSegmenter) particleSegmenter = new Intl.Segmenter('ja', { granularity: 'word' });
Array.from(particleSegmenter.segment(text)).forEach(function (item) {
if (item.segment === 'こんにちは' || item.segment === 'こんばんは') {
overrides[item.index + item.segment.length - 1] = 'wa';
return;
}
if (item.segment !== 'は' && item.segment !== 'へ' && item.segment !== 'を') return;
var next = text.charAt(item.index + 1);
if (item.index === 0 && /[\u3040-\u30ff\u3400-\u9fff]/.test(next)) return;
overrides[item.index] = item.segment === 'は' ? 'wa' : (item.segment === 'へ' ? 'e' : 'o');
});
} catch (e) { /* La segmentation est facultative. */ }
return overrides;
}
var SPECIAL_PRONUNCIATION = {
'は': 'wa',
'へ': 'e',
'を': 'o',
'こんにちは': 'konnichiwa',
'こんばんは': 'konbanwa'
};
function pronunciation(value) {
var raw = strip(value).replace(/^[\s　。、！？!?.,・…「」『』（）()]+|[\s　。、！？!?.,・…「」『』（）()]+$/g, '');
if (!raw) return '';
if (SPECIAL_PRONUNCIATION[raw]) return SPECIAL_PRONUNCIATION[raw];
if (!P || !P.kanaToRomaji) return '';
var kana = reading(raw);
if (!kana || hasKanji(kana)) return '';
return P.kanaToRomaji(kana) || '';
}
function romajiRubyHtml(annotated, context) {
var s = String(annotated || '');
if (!s) return '';
var out = '';
var last = 0;
var re = /([^\s\[\]]+?)\[([^\]]+)\]/g;
var m;
var overrides = context && context.overrides ? context.overrides : particleOverrides(strip(s));
var cursor = context && context.offset != null ? Number(context.offset) || 0 : 0;
function plain(value) {
var i = 0;
while (i < value.length) {
var ch = value.charAt(i);
if (!isJapanese(ch)) {
var j = i + 1;
while (j < value.length && !isJapanese(value.charAt(j))) j++;
out += esc(value.slice(i, j));
cursor += j - i;
i = j;
} else if (/[\u3040-\u30ff]/.test(ch)) {
var j2 = i + 1;
while (j2 < value.length && /[\u3040-\u30ff]/.test(value.charAt(j2))) j2++;
kanaUnits(value.slice(i, j2)).forEach(function (unit) {
var override = (unit === 'は' || unit === 'へ' || unit === 'を') ? overrides[cursor] : '';
out += rubyChar(unit, unit, override || undefined);
cursor += unit.length;
});
i = j2;
} else {
out += esc(ch);
cursor++;
i++;
}
}
}
function annotation(base, reading) {
var match = String(base || '').match(/^([\u3040-\u30ff]+)([\s\S]+)$/);
if (match && /[\u3400-\u9fff]/.test(match[2]) && String(reading || '').indexOf(match[1]) !== 0) {
plain(match[1]);
var prefixOverride = (match[2] === 'は' || match[2] === 'へ' || match[2] === 'を') ? overrides[cursor] : '';
out += rubyChar(match[2], reading, prefixOverride || undefined);
cursor += String(match[2] || '').length;
return;
}
var directOverride = (String(base || '') === 'は' || String(base || '') === 'へ' || String(base || '') === 'を') ? overrides[cursor] : '';
out += rubyChar(base, reading, directOverride || undefined);
cursor += String(base || '').length;
}
while ((m = re.exec(s))) {
plain(s.slice(last, m.index));
annotation(m[1], m[2]);
last = re.lastIndex;
}
plain(s.slice(last));
return out;
}
function rubyHtml(annotated) { return romajiRubyHtml(annotated); }
function tokenize(text, context) {
var d = dictionary();
var out = '';
var i = 0;
var plainStart = 0;
var baseOffset = context && context.offset != null ? Number(context.offset) || 0 : 0;
var overrides = context && context.overrides ? context.overrides : particleOverrides(text);
function hitAt(pos) {
for (var k = 0; k < d.keys.length; k++) {
if (text.startsWith(d.keys[k], pos)) return d.keys[k];
}
return '';
}
while (i < text.length) {
var hit = hitAt(i);
if (!hit) { i++; continue; }
if (i > plainStart) out += romajiRubyHtml(text.slice(plainStart, i), { overrides: overrides, offset: baseOffset + plainStart });
out += romajiRubyHtml(d.map.get(hit), { overrides: overrides, offset: baseOffset + i });
i += hit.length;
plainStart = i;
}
if (plainStart < text.length) out += romajiRubyHtml(text.slice(plainStart), { overrides: overrides, offset: baseOffset + plainStart });
return out;
}
function splitTarget(text, target) {
var out = [];
var i = 0;
while (i < text.length) {
var idx = text.indexOf(target, i);
if (idx < 0) { out.push({ text: text.slice(i), target: false, offset: i }); break; }
if (idx > i) out.push({ text: text.slice(i, idx), target: false, offset: i });
out.push({ text: target, target: true, offset: idx });
i = idx + target.length;
}
return out;
}
function annotate(text, highlight, showFurigana, targetRuby) {
var s = String(text || '').trim();
if (!s) return '';
var target = String(highlight || '').trim();
var useFuri = showFurigana !== false;
if (!target || s.indexOf(target) < 0) return useFuri ? tokenize(s) : esc(s);
var overrides = particleOverrides(s);
return splitTarget(s, target).map(function (part) {
var inner = !useFuri
? esc(part.text)
: (part.target && targetRuby
? romajiRubyHtml(targetRuby, { overrides: overrides, offset: part.offset })
: tokenize(part.text, { overrides: overrides, offset: part.offset }));
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
return rubyChar(unit, unit, romaji);
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
pronunciation: pronunciation,
kanaReading: kanaReading,
kanaUnits: kanaUnits,
romajiRubyHtml: romajiRubyHtml,
dictionary: dictionary
};
});
