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
function phonetic(value) {
return toHiragana(value)
.replace(/[ \t\n\r　、。！？!?.,・「」『』（）()]/g, '')
.replace(/は$/, 'わ')
.replace(/を$/, 'お')
.replace(/へ$/, 'え')
.replace(/ー/g, '');
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
function compare(transcript, entry) {
var raw = String(transcript || '').trim();
var targets = [entry && entry.reading, entry && entry.jp].filter(Boolean);
var heard = phonetic(raw);
var best = 0;
targets.forEach(function (target) {
var expected = phonetic(target);
var score = similarity(heard, expected);
if (raw === String(target)) score = 1;
if (score > best) best = score;
});
var score = Math.round(best * 100);
return {
transcript: raw,
target: String(targets[0] || ''),
score: score,
good: score >= 75,
close: score >= 60
};
}
function best(transcripts, entry) {
var out = null;
(transcripts || []).forEach(function (transcript) {
var result = compare(transcript, entry);
if (!out || result.score > out.score) out = result;
});
return out || compare('', entry);
}
function supported() {
return !!(root && (root.SpeechRecognition || root.webkitSpeechRecognition));
}
return {
compare: compare,
best: best,
supported: supported,
phonetic: phonetic,
similarity: similarity
};
});
