/* Kotoba — furigana automatiques sur les exemples de grammaire. */
(function () {
'use strict';
var R = window.Kotoba && window.Kotoba.Reading;
if (!R) return;
var EXTRA = [
['私', '私[わたし]'],
['水', '水[みず]'],
['飲みます', '飲みます[のみます]'],
['飲んでください', '飲んでください[のんでください]'],
['日本語', '日本語[にほんご]'],
['勉強します', '勉強します[べんきょうします]'],
['勉強しています', '勉強しています[べんきょうしています]'],
['学生', '学生[がくせい]'],
['今日', '今日[きょう]'],
['暑い', '暑い[あつい]'],
['猫', '猫[ねこ]'],
['学校', '学校[がっこう]'],
['行きます', '行きます[いきます]'],
['行く', '行く[いく]'],
['行きません', '行きません[いきません]'],
['行かない', '行かない[いかない]'],
['行きました', '行きました[いきました]'],
['行った', '行った[いった]'],
['行って', '行って[いって]'],
['行きたい', '行きたい[いきたい]'],
['行きたいです', '行きたいです[いきたいです]'],
['電車', '電車[でんしゃ]'],
['日本', '日本[にほん]'],
['友達', '友達[ともだち]'],
['話します', '話します[はなします]'],
['本', '本[ほん]'],
['明日', '明日[あした]'],
['東京', '東京[とうきょう]'],
['映画', '映画[えいが]'],
['見ます', '見ます[みます]'],
['食べます', '食べます[たべます]'],
['食べて', '食べて[たべて]'],
['何', '何[なに]'],
['人', '人[ひと]'],
['誰', '誰[だれ]'],
['駅', '駅[えき]'],
['来ます', '来ます[きます]'],
['調子', '調子[ちょうし]'],
['二つ', '二つ[ふたつ]'],
['三人', '三人[さんにん]'],
['切符', '切符[きっぷ]'],
['二枚', '二枚[にまい]'],
['買います', '買います[かいます]'],
['一本', '一本[いっぽん]'],
['貸してください', '貸してください[かしてください]'],
['一杯', '一杯[いっぱい]'],
['一日', '一日[いちにち]'],
['三回', '三回[さんかい]'],
['妹', '妹[いもうと]'],
['六歳', '六歳[ろくさい]'],
['写真', '写真[しゃしん]'],
['撮ってもいいですか', '撮ってもいいですか[とってもいいですか]'],
['撮ります', '撮ります[とります]'],
['好き', '好き[すき]'],
['毎朝', '毎朝[まいあさ]'],
['台所', '台所[だいどころ]'],
['彼', '彼[かれ]'],
['会社', '会社[かいしゃ]'],
['公園', '公園[こうえん]'],
['田中', '田中[たなか]']
];
function esc(value) {
return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
});
}
function mergeDictionary() {
var d = R.dictionary();
EXTRA.forEach(function (pair) {
if (!d.map.has(pair[0])) d.map.set(pair[0], pair[1]);
});
d.keys = Array.from(d.map.keys()).sort(function (a, b) { return b.length - a.length; });
}
function showFurigana() {
try {
var raw = window.localStorage.getItem('kotoba.v3');
if (!raw) return true;
var saved = JSON.parse(raw);
return !saved || !saved.settings || saved.settings.furigana !== false;
} catch (e) { return true; }
}
function original(el) {
if (!el.hasAttribute('data-grammar-jp')) el.setAttribute('data-grammar-jp', el.textContent || '');
return el.getAttribute('data-grammar-jp') || '';
}
function annotate(text, show) {
if (!show) return esc(text);
return R.annotate(text, '', true);
}
function renderText(el) {
var show = showFurigana();
var text = original(el);
var parts = text.split(' / ');
if (parts.length > 1) {
var jp = parts.shift();
el.innerHTML = annotate(jp, show) + ' / ' + esc(parts.join(' / '));
return;
}
el.innerHTML = annotate(text, show);
}
function apply() {
mergeDictionary();
Array.prototype.slice.call(document.querySelectorAll('.grammar-jp, .grammar-table td')).forEach(renderText);
}
function schedule() { setTimeout(apply, 0); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
else schedule();
window.addEventListener('hashchange', schedule);
document.addEventListener('change', function (event) {
if (event.target && event.target.matches && event.target.matches('[data-setting="furigana"]')) schedule();
});
var view = document.getElementById('view-grammar');
if (view && window.MutationObserver) {
new MutationObserver(function () { if (!view.hidden) schedule(); }).observe(view, { attributes: true, attributeFilter: ['hidden'] });
}
})();
