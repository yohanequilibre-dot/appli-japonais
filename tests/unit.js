"use strict";

const assert = require("assert");
const Lex = require("../js/lexicon.js");
const Store = require("../js/srs.js");
const Mistakes = require("../js/mistakes.js");
const GrammarTrack = require("../js/grammar-track.js");
const Parser = require("../js/parser.js");
const Polite = require("../js/polite.js");
const Reading = require("../js/reading.js");
const Pron = require("../js/pronunciation.js");
const Phrase = require("../js/phrase.js");
const Conversation = require("../js/conversation.js");
const Immersion = require("../js/immersion.js");
const Sync = require("../js/sync.js");

let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log("✓ " + name);
  } catch (e) {
    failed++;
    console.error("✗ " + name);
    console.error("  " + (e && e.message));
  }
}

function entryOf(text) {
  const r = Parser.parseText(text);
  assert.equal(r.errors.length, 0, "erreurs inattendues : " + JSON.stringify(r.errors));
  assert.equal(r.entries.length, 1, "nombre d'entrées : " + r.entries.length);
  return r.entries[0];
}

test("le lexique accepte les romaji détachés", function () {
  assert.equal(Lex.lookup({ romaji: "kon-ni-chi-wa" }).jp, "こんにちは");
  assert.equal(Lex.lookup({ romaji: "o-ha-yo-u" }).jp, "おはよう");
  assert.equal(Lex.lookup({ romaji: "arigatou" }).jp, "ありがとう");
});

test("lecture latine : une unité au-dessus de chaque caractère", function () {
  const html = Reading.romajiRubyHtml("お願[ねが]いします");
  const rt = Array.from(html.matchAll(/<rt><span class="rt-romaji">([^<]+)<\/span><\/rt>/g)).map(function (m) { return m[1]; });
  assert.deepEqual(rt, ["o", "nega", "i", "shi", "ma", "su"]);
  assert.equal(html.indexOf("rt-kana"), -1);
});

test("lecture latine : les groupes de kanji restent lisibles", function () {
  const html = Reading.romajiRubyHtml("日本[にほん]語[ご]");
  const rt = Array.from(html.matchAll(/<rt><span class="rt-romaji">([^<]+)<\/span><\/rt>/g)).map(function (m) { return m[1]; });
  assert.deepEqual(rt, ["nihon", "go"]);
});

test("lecture latine : la particule は se lit wa", function () {
  const readings = function (html) {
    return Array.from(html.matchAll(/<rt><span class="rt-romaji">([^<]+)<\/span><\/rt>/g)).map(function (m) { return m[1]; });
  };
  const sentence = readings(Reading.romajiRubyHtml("私は学生です。"));
  assert.ok(sentence.includes("wa"), "la particule は doit être lue wa");
  assert.equal(sentence.includes("ha"), false, "aucun ha pour la particule");
  const annotated = readings(Reading.annotate("私は学生です。", "私", true, "私[わたし]"));
  assert.ok(annotated.includes("wa"), "la particule reste wa dans un contexte surligné");
  const name = readings(Reading.annotate("お名前は何ですか。", "", true));
  assert.ok(name.includes("wa"), "お名前は doit lire は wa");
  assert.equal(name.includes("ha"), false, "aucun ha dans お名前は");
  const targetedName = readings(Reading.annotate("お名前は何ですか。", "名前", true, "名前[なまえ]"));
  assert.ok(targetedName.includes("wa"), "la particule reste wa quand 名前 est surligné");
  assert.equal(targetedName.includes("ha"), false, "aucun ha dans le contexte ciblé");
  const namePronunciation = Reading.pronunciation("お名前は何ですか");
  assert.ok(namePronunciation.indexOf("onamaewa") === 0, "お名前は doit commencer par onamaewa");
  assert.equal(namePronunciation.includes("ha"), false, "aucun ha dans la prononciation de お名前は");
  const greeting = readings(Reading.romajiRubyHtml("こんにちは。"));
  assert.ok(greeting.includes("wa"));
  assert.equal(greeting.includes("ha"), false);
  const hai = readings(Reading.romajiRubyHtml("はい。"));
  assert.ok(hai.includes("ha"), "はい garde bien ha");
  assert.equal(hai.includes("wa"), false);
  const ohayou = readings(Reading.romajiRubyHtml("おはよう。"));
  assert.ok(ohayou.includes("ha"), "おはよう garde bien ha");
  assert.equal(ohayou.includes("wa"), false);
  const hana = readings(Reading.romajiRubyHtml("はなです。"));
  assert.ok(hana.includes("ha"), "はな garde bien ha");
  assert.equal(hana.includes("wa"), false);
  const school = readings(Reading.romajiRubyHtml("学校へ行きます。"));
  assert.ok(school.includes("e"), "la particule へ doit être lue e");
  assert.equal(school.includes("he"), false, "aucun he pour la particule へ");
  const water = readings(Reading.romajiRubyHtml("水を飲みます。"));
  assert.ok(water.includes("o"), "la particule を doit être lue o");
  assert.equal(water.includes("wo"), false, "aucun wo pour la particule を");
  const room = readings(Reading.romajiRubyHtml("へや。"));
  assert.ok(room.includes("he"), "へや garde bien he");
  assert.equal(room.includes("e"), false);
  const prohibition = readings(Reading.romajiRubyHtml("ここで食べてはいけません。"));
  assert.ok(prohibition.includes("wa"), "てはいけません doit lire は wa");
  assert.equal(prohibition.includes("ha"), false, "aucun ha dans てはいけません");
  const copula = readings(Reading.romajiRubyHtml("ではありません。"));
  assert.ok(copula.includes("wa"), "ではありません doit lire は wa");
  assert.equal(copula.includes("ha"), false, "aucun ha dans ではありません");
  const yes = readings(Reading.romajiRubyHtml("杯 (はい)"));
  assert.ok(yes.includes("ha"), "杯 (はい) garde bien ha");
  assert.equal(yes.includes("wa"), false);
  assert.equal(Reading.pronunciation("こんにちは"), "konnichiwa");
  assert.equal(Reading.pronunciation("こんばんは"), "konbanwa");
  assert.equal(Reading.pronunciation("今日"), "kyou");
  assert.equal(Reading.pronunciation("学校"), "gakkou");
  assert.equal(Reading.pronunciation("は"), "wa");
  assert.equal(Reading.pronunciation("へ"), "e");
  assert.equal(Reading.pronunciation("を"), "o");
  assert.equal(Reading.pronunciation("はい"), "hai");
  assert.equal(Reading.pronunciation("おはよう"), "ohayou");
  assert.equal(Reading.pronunciation("はな"), "hana");
  assert.equal(Reading.pronunciation("てはいけません"), "tewaikemasen");
  assert.equal(Reading.pronunciation("ではありません"), "dewaarimasen");
  assert.equal(Reading.romaji("ではありません"), "dewaarimasen");
});

test("lecture des mots : は particule dans les expressions, ha dans les mots lexicaux", function () {
  assert.equal(Reading.wordRomaji("実は", "じつは"), "jitsuwa");
  assert.equal(Reading.wordRomaji("それでは", "それでは"), "soredewa");
  assert.equal(Reading.wordRomaji("では", "では"), "dewa");
  assert.equal(Reading.wordRomaji("歯", "は"), "ha");
  assert.equal(Reading.wordRomaji("母親", "ははおや"), "hahaoya");
  assert.equal(Reading.pronunciation("実は"), "jitsuwa");
  assert.equal(Reading.pronunciation("それでは"), "soredewa");
  assert.equal(Reading.pronunciation("ははです"), "hahadesu");
  assert.equal(Reading.pronunciation("わたしははなです"), "watashiwahanadesu");
  assert.equal(Reading.pronunciation("このは"), "konoha");
  assert.equal(Reading.pronunciation("このどうがはむりょうです"), "konodougawamuryoudesu");
  assert.equal(Reading.pronunciation("かれはぐあいがわるいようです"), "karewaguaigawaruiyoudesu");
  assert.equal(Reading.pronunciation("はな"), "hana");
});

test("import « bonjour | kon-ni-chi-wa »", function () {
  const e = entryOf("bonjour | kon-ni-chi-wa");
  assert.equal(e.fr, "bonjour");
  assert.equal(e.jp, "こんにちは");
  assert.equal(e.ruby, "こんにちは");
  assert.equal(e.romaji, "kon-ni-chi-wa");
  assert.equal(e.context, "こんにちは、花さん！");
  assert.equal(e.contextFr, "Bonjour, Hana !");
});

test("import sur deux lignes : japonais puis français", function () {
  const e = entryOf("おはよう\nbonjour (le matin)");
  assert.equal(e.fr, "bonjour (le matin)");
  assert.equal(e.jp, "おはよう");
  assert.equal(e.context, "おはよう、花さん！");
});

test("import japonais | romaji | français", function () {
  const e = entryOf("水 | mizu | eau");
  assert.equal(e.jp, "水");
  assert.equal(e.ruby, "水[みず]");
  assert.equal(e.fr, "eau");
  assert.equal(e.romaji, "mizu");
  assert.equal(e.context, "水を一杯ください。");
});

test("import kanji | lecture | romaji | français | contexte", function () {
  const e = entryOf("食べる | たべる | taberu | manger | ご飯を食べる。 | Je mange du riz.");
  assert.equal(e.jp, "食べる");
  assert.equal(e.ruby, "食[た]べる");
  assert.equal(e.fr, "manger");
  assert.equal(e.context, "ご飯を食べる。");
  assert.equal(e.contextFr, "Je mange du riz.");
});

test("import français d'abord avec contexte et traduction", function () {
  const e = entryOf("bonjour | こんにちは | konnichiwa | こんにちは、花さん！ | Bonjour, Hana !");
  assert.equal(e.fr, "bonjour");
  assert.equal(e.jp, "こんにちは");
  assert.equal(e.context, "こんにちは、花さん！");
  assert.equal(e.contextFr, "Bonjour, Hana !");
});

test("ordre japonais d'abord accepté", function () {
  const e = entryOf("こんにちは | bonjour");
  assert.equal(e.jp, "こんにちは");
  assert.equal(e.fr, "bonjour");
});

test("virgule comme séparateur", function () {
  const e = entryOf("bonjour, こんにちは");
  assert.equal(e.jp, "こんにちは");
  assert.equal(e.fr, "bonjour");
});

test("merci | arigatou passe par le lexique", function () {
  const e = entryOf("merci | arigatou");
  assert.equal(e.jp, "ありがとう");
  assert.equal(e.fr, "merci");
});

test("un mot japonais seul reçoit sa traduction du lexique", function () {
  const e = entryOf("おはよう");
  assert.equal(e.jp, "おはよう");
  assert.equal(e.fr, "bonjour (le matin)");
});

test("les commentaires et lignes vides sont ignorés", function () {
  const r = Parser.parseText("# mes mots\n\nbonjour | こんにちは");
  assert.equal(r.entries.length, 1);
  assert.equal(r.errors.length, 0);
});

test("une ligne sans japonais produit une erreur claire", function () {
  const r = Parser.parseText("bonjour | ???");
  assert.equal(r.entries.length, 0);
  assert.equal(r.errors.length, 1);
  assert.equal(r.errors[0].reason, "Aucun mot japonais détecté");
});

test("contexte japonais seul accepté", function () {
  const e = entryOf("bonjour | こんにちは | こんにちは、花さん！");
  assert.equal(e.context, "こんにちは、花さん！");
});

test("annotate place la lecture au-dessus des kanji", function () {
  assert.equal(Parser.annotate("食べる", "たべる"), "食[た]べる");
  assert.equal(Parser.annotate("買い物", "かいもの"), "買[か]い物[もの]");
  assert.equal(Parser.annotate("今日", "きょう"), "今日[きょう]");
});

test("kana vers romaji", function () {
  assert.equal(Parser.kanaToRomaji("たべる"), "taberu");
  assert.equal(Parser.kanaToRomaji("がっこう"), "gakkou");
  assert.equal(Parser.kanaToRomaji("コーヒー"), "koohii");
});

test("formes polies : les verbes courants", function () {
  const eat = Polite.prepare({ jp: "食べる", reading: "たべる", fr: "manger" });
  assert.equal(eat.jp, "食べます");
  assert.equal(eat.politeForms.negative.jp, "食べません");
  assert.equal(eat.politeForms.past.jp, "食べました");
  assert.equal(eat.politeForms.pastNegative.jp, "食べませんでした");
  assert.equal(eat.politeForms.question.jp, "食べますか");

  const go = Polite.prepare({ jp: "行く", reading: "いく", fr: "aller" });
  assert.equal(go.jp, "行きます");
  assert.equal(go.politeForms.te.jp, "行って");

  const come = Polite.prepare({ jp: "来る", reading: "くる", fr: "venir" });
  assert.equal(come.jp, "来ます");
  assert.equal(come.politeForms.te.jp, "来て");

  const make = Polite.prepare({ jp: "する", reading: "する", fr: "faire" });
  assert.equal(make.jp, "します");
  assert.equal(make.politeForms.negative.jp, "しません");

  const work = Polite.prepare({ jp: "働く", reading: "はたらく", fr: "travailler" });
  assert.equal(work.jp, "働きます");
  assert.equal(work.politeForms.te.jp, "働いて");

  const brush = Polite.prepare({ jp: "磨きます", reading: "みがきます", fr: "brosser" });
  assert.equal(brush.jp, "磨きます");
  assert.equal(brush.politeForms.negative.jp, "磨きません");
});

test("formes polies : variantes de lecture des verbes", function () {
  const forms = Polite.variants({ jp: "働く", reading: "はたらく", fr: "travailler" });
  assert.ok(forms.some(function (form) { return form.jp === "働いて"; }));
  assert.ok(Reading.romajiRubyHtml("働[はたら]いて").indexOf("hatara") >= 0);
});

test("formes polies : les verbes en -える restent des ichidan", function () {
  var finir = Polite.conjugate({ jp: "終える", reading: "おえる", fr: "finir" });
  assert.equal(finir.present.jp, "終えます");
  assert.equal(finir.negative.jp, "終えません");
  var enseigner = Polite.conjugate({ jp: "教える", reading: "おしえる", fr: "enseigner" });
  assert.equal(enseigner.present.jp, "教えます");
});

test("formes polies : les verbes du pack sont reconnus", function () {
  [
    { jp: "登る", reading: "のぼる", fr: "grimper", present: "登ります" },
    { jp: "怒る", reading: "おこる", fr: "se fâcher", present: "怒ります" },
    { jp: "決める", reading: "きめる", fr: "décider", present: "決めます" },
    { jp: "咲く", reading: "さく", fr: "fleurir", present: "咲きます" },
    { jp: "帰る", reading: "かえる", fr: "rentrer", present: "帰ります" }
  ].forEach(function (item) {
    var forms = Polite.conjugate(item);
    assert.ok(forms, item.jp + " doit être reconnu comme verbe");
    assert.equal(forms.present.jp, item.present, item.jp);
  });
});

test("romaji vers kana", function () {
  assert.equal(Parser.romajiToKana("konnichiha"), "こんにちは");
  assert.equal(Parser.romajiToKana("ohayou"), "おはよう");
  assert.equal(Parser.romajiToKana("gakkou"), "がっこう");
});

test("progression SRS : 1 j, 2 j, 4 j puis connue", function () {
  let p = Store.freshProgress(1000);
  assert.equal(Store.isNew(p), true);
  p = Store.schedule(p, "good", 1000);
  assert.equal(p.level, 1);
  assert.equal(p.reps, 1);
  assert.equal(p.due, 1000 + Store.LEVELS[1] * 86400000);
  assert.equal(Store.isKnown(p), false);
  p = Store.schedule(p, "good", p.due);
  p = Store.schedule(p, "good", p.due);
  assert.equal(p.level, 3);
  assert.equal(Store.isKnown(p), true);
});

test("un échec remet le mot en apprentissage immédiat", function () {
  let p = Store.freshProgress(0);
  p = Store.schedule(p, "good", 0);
  p = Store.schedule(p, "good", p.due);
  p = Store.schedule(p, "good", p.due);
  const before = p.due;
  p = Store.schedule(p, "again", before);
  assert.equal(p.level, 0);
  assert.equal(p.lapses, 1);
  assert.equal(p.due, before + 600000);
  assert.equal(Store.isNew(p), false);
});

test("série et XP", function () {
  const st = Store.defaultState();
  Store.bumpStats(st, "good", Date.parse("2026-10-31T10:00:00"));
  assert.equal(st.stats.streak, 1);
  assert.equal(st.stats.xp, 10);
  Store.bumpStats(st, "good", Date.parse("2026-10-31T11:00:00"));
  assert.equal(st.stats.streak, 1);
  assert.equal(st.stats.xp, 20);
  Store.bumpStats(st, "good", Date.parse("2026-11-01T10:00:00"));
  assert.equal(st.stats.streak, 2);
  Store.bumpStats(st, "good", Date.parse("2026-11-03T10:00:00"));
  assert.equal(st.stats.streak, 1);
});

test("l’XP hors vocabulaire entretient aussi la série", function () {
  const st = Store.defaultState();
  Store.addXp(st, 10, Date.parse("2026-11-05T10:00:00"));
  assert.equal(st.stats.streak, 1);
  assert.equal(st.stats.bestStreak, 1);
  assert.equal(st.stats.lastDay, "2026-11-05");
  Store.addXp(st, 20, Date.parse("2026-11-05T12:00:00"));
  assert.equal(st.stats.streak, 1);
  Store.addXp(st, 10, Date.parse("2026-11-06T09:00:00"));
  assert.equal(st.stats.streak, 2);
  assert.equal(st.stats.bestStreak, 2);
});

test("une conversation puis une carte le même jour ne doublent pas la série", function () {
  const st = Store.defaultState();
  const now = Date.parse("2026-11-05T10:00:00");
  Store.addXp(st, 10, now);
  Store.bumpStats(st, "good", now + 3600000);
  assert.equal(st.stats.streak, 1);
  assert.equal(st.stats.bestStreak, 1);
  assert.equal(st.stats.daily["2026-11-05"], 20);
});

test("comptage des nouveaux, en cours et connus", function () {
  const entries = [{ id: "a" }, { id: "b" }, { id: "c" }];
  const state = Store.defaultState();
  state.progress.a = Store.schedule(Store.freshProgress(0), "good", 0);
  state.progress.b = Store.schedule(Store.freshProgress(0), "good", 0);
  state.progress.b = Store.schedule(state.progress.b, "good", state.progress.b.due);
  state.progress.b = Store.schedule(state.progress.b, "good", state.progress.b.due);
  const c = Store.counts(entries, state, 1000);
  assert.equal(c.new, 1);
  assert.equal(c.learning, 1);
  assert.equal(c.known, 1);
});

test("export puis import d'une sauvegarde", function () {
  const st = Store.defaultState();
  st.entries["i:test"] = { id: "i:test", fr: "test", jp: "テスト" };
  const round = Store.importState(Store.exportState(st));
  assert.equal(round.entries["i:test"].jp, "テスト");
  assert.equal(round.version, Store.VERSION);
});

test("détection français / romaji", function () {
  assert.equal(Parser.looksFrench("bonjour"), true);
  assert.equal(Parser.looksFrench("mizu"), false);
  assert.equal(Parser.looksRomaji("mizu"), true);
  assert.equal(Parser.looksRomaji("kon-ni-chi-wa"), true);
});

test('aller | ikimasu donne la forme polie', function () {
const e = entryOf('aller | ikimasu');
assert.equal(e.jp, '行きます');
assert.equal(e.romaji, 'ikimasu');
assert.equal(e.context, '明日、東京に行きます。');
});
test("prononciation : score et variantes", function () {
const entry = { jp: "こんばんは", reading: "こんばんは", romaji: "konbanwa" };
assert.equal(Pron.compare("こんばんは", entry).good, true);
assert.equal(Pron.compare("こんばんわ", entry).good, true);
assert.equal(Pron.compare("おはよう", entry).good, false);
assert.ok(Pron.compare("こんばんは", entry).score >= 75);
});
test("prononciation : la meilleure alternative est retenue", function () {
const entry = { jp: "ありがとう", reading: "ありがとう", romaji: "arigatou" };
const result = Pron.best(["おはよう", "ありがとう"], entry);
assert.equal(result.good, true);
assert.equal(result.transcript, "ありがとう");
});
test("prononciation : un transcript en kanji est lu en kana", function () {
const entry = { jp: "水を飲みます。", reading: "みずをのみます。" };
const result = Pron.compare("水を飲みます", entry, {
readingOf: function (text) { return text === "水を飲みます" ? "みずをのみます" : text; }
});
assert.equal(result.good, true);
assert.equal(result.score, 100);
assert.equal(result.expected, "みずおのみます");
assert.equal(result.heard, "みずおのみます");
});
test("prononciation : les particules は et を sont normalisées", function () {
const entry = { jp: "私は水を飲みます。", reading: "わたしはみずをのみます。" };
const result = Pron.compare("わたしわみずおのみます", entry);
assert.equal(result.good, true);
assert.equal(result.score, 100);
});
test("prononciation : l'alignement signale le son manquant", function () {
const entry = { jp: "水を飲みます。", reading: "みずをのみます。" };
const result = Pron.compare("みずおのみす", entry);
assert.ok(result.score < 100);
assert.ok(result.diff.some(function (op) { return op.type === "del"; }));
assert.ok(result.tip.length > 0);
});
test("prononciation : une voyelle longue manquante est signalée", function () {
const entry = { jp: "コーヒー", reading: "コーヒー" };
const result = Pron.compare("こひ", entry);
assert.ok(result.score < 100);
assert.equal(result.good, false);
assert.ok(/voyelle longue/.test(result.tip));
assert.equal(Pron.compare("こーひー", entry).score, 100);
});
test("prononciation : は/わ n'est pas confondu dans un mot", function () {
const result = Pron.compare("はわ", { jp: "母", reading: "はは" });
assert.equal(result.good, false);
});
test("parcours : 10 révisions valident, 30 rendent ultime", function () {
  let p = Store.freshProgress(0);
  assert.equal(Store.reviewStage(p), "new");
  for (let i = 0; i < 10; i++) p = Store.schedule(p, "good", 0);
  assert.equal(Store.reviewCount(p), 10);
  assert.equal(Store.reviewStage(p), "validated");
  assert.equal(Store.stageLabel(p), "Validé");
  for (let i = 0; i < 20; i++) p = Store.schedule(p, "good", 0);
  assert.equal(Store.reviewCount(p), 30);
  assert.equal(Store.reviewStage(p), "ultimate");
  assert.equal(Store.stageLabel(p), "Ultime");
  assert.equal(Store.stageProgress(p).pct, 100);
});

test("parcours : les échecs comptent aussi comme révisions", function () {
  let p = Store.freshProgress(0);
  p = Store.schedule(p, "again", 0);
  assert.equal(Store.reviewCount(p), 1);
  assert.equal(Store.reviewStage(p), "learning");
});

test("parcours : comptage par étape", function () {
  const entries = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  const state = Store.defaultState();
  state.progress.b = Store.freshProgress(0);
  for (let i = 0; i < 10; i++) state.progress.b = Store.schedule(state.progress.b, "good", 0);
  state.progress.c = Store.freshProgress(0);
  for (let i = 0; i < 30; i++) state.progress.c = Store.schedule(state.progress.c, "good", 0);
  const c = Store.stageCounts(entries, state);
  assert.equal(c.new, 2);
  assert.equal(c.learning, 0);
  assert.equal(c.validated, 1);
  assert.equal(c.ultimate, 1);
});

test("le pack contient 1000 mots courants et 60 mots d'escalade", function () {
  const previous = global.window;
  global.window = {};
  try {
    ["../data.js", "../js/vocab-extra.js", "../js/vocab-1000.js"].forEach(function (p) {
      const resolved = require.resolve(p);
      delete require.cache[resolved];
      require(p);
    });
    const units = global.window.UNITS_DATA || [];
    const climbingUnits = units.filter(function (u) { return /^escalade-/.test(u.id); });
    const essentialUnits = units.filter(function (u) { return /^essentiels-/.test(u.id); });
    const words = units.reduce(function (n, u) { return n + ((u.words && u.words.length) || 0); }, 0);
    const climbing = climbingUnits.reduce(function (n, u) { return n + u.words.length; }, 0);
    const essentials = essentialUnits.reduce(function (n, u) { return n + u.words.length; }, 0);
    assert.equal(climbing, 60);
    assert.equal(essentials, 799);
    assert.equal(words - climbing, 1000);
    const seen = new Set();
    units.forEach(function (u) {
      u.words.forEach(function (w) {
        const jp = Array.isArray(w) ? w[0] : w.jp;
        const fr = Array.isArray(w) ? w[3] : w.fr;
        const context = Array.isArray(w) ? w[4] : w.context;
        const contextFr = Array.isArray(w) ? w[5] : w.contextFr;
        assert.ok(jp && fr, "mot incomplet dans " + u.id);
        assert.ok(context && contextFr, "contexte manquant pour " + jp);
        if (!Array.isArray(w)) assert.ok(w.reading, "lecture manquante pour " + jp);
        assert.equal(seen.has(jp), false, "doublon : " + jp);
        seen.add(jp);
      });
    });
  } finally {
    global.window = previous;
  }
});

test("prononciation : ください est accepté pour s'il vous plaît", function () {
  const entry = Lex.lookup({ jp: "お願いします" });
  const result = Pron.compare("ください", entry);
  assert.equal(result.good, true);
  assert.equal(result.score, 100);
  assert.equal(result.alternative, true);
  assert.equal(result.expected, "ください");
  assert.ok(entry.alternatives[0].usage.indexOf('Plus directe') >= 0);
  assert.ok(entry.contextNote.indexOf('Au café') >= 0);
  assert.ok(entry.nuance.indexOf('plus forte') >= 0);
});

if (failed) {
  console.error("\n" + failed + " test(s) en échec.");
  process.exit(1);
}
console.log("\nTous les tests unitaires passent.");


test("atelier de phrases : texte à trous en kana ou romaji", function () {
  const entry = { id: "water", jp: "水", reading: "みず", romaji: "mizu", hl: "水", context: "水を一杯ください。", contextFr: "Un verre d’eau, s’il vous plaît." };
  const ex = Phrase.build(entry, "cloze");
  assert.ok(ex);
  assert.equal(ex.target, "水");
  assert.equal(ex.expected, "みず");
  assert.equal(Phrase.checkCloze(ex, "みず").good, true);
  assert.equal(Phrase.checkCloze(ex, "mizu").good, true);
  assert.equal(Phrase.checkCloze(ex, "みずを").good, false);
});

test("atelier de phrases : remise en ordre", function () {
  const entry = { id: "un", jp: "うん", reading: "うん", hl: "うん", context: "「美味しい？」「うん、美味しいよ」", contextFr: "..." };
  const ex = Phrase.build(entry, "order");
  assert.ok(ex);
  assert.ok(ex.tokens.length >= 3);
  assert.equal(Phrase.checkOrder(ex, ex.expectedIds).good, true);
  assert.equal(Phrase.checkOrder(ex, ex.expectedIds.slice().reverse()).good, false);
});

test("atelier de phrases : sans contexte, aucun exercice", function () {
  assert.equal(Phrase.build({ jp: "水", fr: "eau" }, "cloze"), null);
});

test("prononciation : le petit っ est contrôlé", function () {
  const result = Pron.compare("がこう", { jp: "学校", reading: "がっこう" });
  assert.equal(result.rhythm.missingSokuon, true);
  assert.equal(result.rhythm.missingLongVowel, false);
  assert.equal(result.good, false);
});

test("prononciation : une voyelle longue transcrite en kana reste acceptée", function () {
  const result = Pron.compare("こおひい", { jp: "コーヒー", reading: "コーヒー" });
  assert.equal(result.rhythm.missingLongVowel, false);
  assert.equal(result.score, 100);
});

test("sauvegarde locale : un point de restauration est conservé", function () {
  const data = new Map();
  global.localStorage = {
    getItem: function (key) { return data.has(key) ? data.get(key) : null; },
    setItem: function (key, value) { data.set(key, String(value)); },
    removeItem: function (key) { data.delete(key); }
  };
  const state = Store.defaultState();
  state.progress.water = Store.freshProgress(0);
  Store.save(state);
  const backup = Store.latestBackup();
  assert.ok(backup);
  assert.ok(backup.progress.water);
  delete global.localStorage;
});

test("synchronisation : fusionne les progrès récents sans écraser les autres", function () {
  const local = {
    createdAt: 10,
    entries: { a: { id: "a" } },
    progress: {
      water: {
        last: 100, reps: 2, lapses: 0, level: 4, due: 500,
        pronunciation: [{ t: 1, target: "word", score: 70, heard: "mizu" }]
      }
    },
    stats: { xp: 10, reviews: 5, daily: { "2026-11-01": 20 }, history: {}, lastDay: "2026-11-01" },
    settings: { theme: "dark", rate: 0.8 },
    flags: { daily: "2026-11-01" }
  };
  const remote = {
    createdAt: 5,
    entries: { b: { id: "b" } },
    progress: {
      water: {
        last: 200, reps: 1, lapses: 1, level: 3, due: 900,
        pronunciation: [{ t: 2, target: "phrase", score: 85, heard: "mizu o" }]
      },
      fire: { last: 50, reps: 1 }
    },
    stats: { xp: 20, reviews: 3, daily: { "2026-11-02": 30 }, history: {}, lastDay: "2026-11-02" },
    settings: { theme: "light", rate: 1 },
    flags: { daily: "2026-11-02" }
  };
  const before = JSON.stringify(local);
  const merged = Sync.mergeStates(local, remote);
  assert.equal(JSON.stringify(local), before, "la fusion ne doit pas modifier l'état local");
  assert.ok(merged.entries.a && merged.entries.b, "les mots importés des deux appareils sont réunis");
  assert.equal(merged.progress.water.last, 200, "la révision la plus récente gagne");
  assert.equal(merged.progress.water.due, 900);
  assert.equal(merged.progress.water.reps, 2, "le nombre de réussites le plus élevé est conservé");
  assert.equal(merged.progress.water.lapses, 1);
  assert.equal(merged.progress.water.level, 3, "le niveau suit la révision la plus récente");
  assert.equal(merged.progress.water.pronunciation.length, 2, "les historiques de prononciation sont réunis");
  assert.ok(merged.progress.fire);
  assert.equal(merged.stats.xp, 20);
  assert.equal(merged.stats.daily["2026-11-01"], 20);
  assert.equal(merged.stats.daily["2026-11-02"], 30);
  assert.equal(merged.stats.lastDay, "2026-11-02");
  assert.equal(merged.settings.theme, "dark", "les réglages locaux restent prioritaires");
  assert.equal(merged.flags.daily, "2026-11-02");
});

test("synchronisation : un échec récent n'est pas annulé par un ancien niveau", function () {
  const local = {
    progress: { water: { last: 100, reps: 5, lapses: 0, level: 5, due: 500, said: 3 } }
  };
  const remote = {
    progress: { water: { last: 200, reps: 6, lapses: 1, level: 0, due: 1200, said: 3 } }
  };
  const merged = Sync.mergeStates(local, remote);
  assert.equal(merged.progress.water.level, 0, "l'échec le plus récent remet le niveau à zéro");
  assert.equal(merged.progress.water.due, 1200, "la prochaine révision reste celle de l'échec");
  assert.equal(merged.progress.water.reps, 6);
  assert.equal(merged.progress.water.lapses, 1);
});

test("sauvegarde : une sauvegarde trop volumineuse est refusée", function () {
  const huge = '{"progress":{}}' + ' '.repeat(2 * 1024 * 1024);
  assert.throws(function () { Store.importState(huge); }, /trop volumineuse/);
});

test("conversation : les répliques ratées sont normalisées et fusionnées", function () {
  const local = {
    conversationReview: {
      "meet:0": { scenario: "meet", turn: 0, missedAt: 100, clearedAt: 0, count: 2 }
    }
  };
  const normalized = Store.normalizeState(local);
  assert.equal(normalized.conversationReview["meet:0"].count, 2);
  assert.equal(normalized.conversationReview["meet:0"].missedAt, 100);

  const remote = {
    conversationReview: {
      "meet:0": { scenario: "meet", turn: 0, missedAt: 90, clearedAt: 200, count: 1 },
      "cafe:1": { scenario: "cafe", turn: 1, missedAt: 150, clearedAt: 0, count: 1 }
    }
  };
  const merged = Sync.mergeStates(local, remote);
  assert.equal(merged.conversationReview["meet:0"].clearedAt, 200, "la correction la plus récente gagne");
  assert.equal(merged.conversationReview["cafe:1"].missedAt, 150, "les erreurs de l'autre appareil sont conservées");
});

test("synchronisation : sans état distant, l'état local est conservé", function () {
  const local = { entries: { a: { id: "a" } }, progress: { water: { reps: 3 } }, stats: { xp: 4 } };
  const merged = Sync.mergeStates(local, null);
  assert.deepEqual(merged, local);
  assert.notEqual(merged, local, "la copie évite de partager les objets");
});

test("conversation : l'état par défaut contient le suivi à retravailler", function () {
  assert.deepEqual(Store.defaultState().conversationReview, {});
  assert.deepEqual(Store.defaultState().stats.conversation, {});
});

test("synchronisation : réunit les conversations quotidiennes", function () {
  const local = { stats: { conversation: { "2026-11-04": 2, "2026-11-05": 1 } } };
  const remote = { stats: { conversation: { "2026-11-04": 3, "2026-11-03": 1 } } };
  const merged = Sync.mergeStates(local, remote);
  assert.equal(merged.stats.conversation["2026-11-04"], 3);
  assert.equal(merged.stats.conversation["2026-11-05"], 1);
  assert.equal(merged.stats.conversation["2026-11-03"], 1);
});

test("histoires : quinze récits gradués avec audio, traduction et quiz", function () {
  assert.equal(Immersion.stories.length, 15, "quinze histoires originales");
  const ids = {};
  Immersion.stories.forEach(function (story) {
    assert.ok(story.id && !ids[story.id], "identifiant unique : " + story.id);
    ids[story.id] = true;
    assert.ok(['A1', 'A2', 'B1', 'B2'].indexOf(story.cefr) >= 0, "niveau CECRL : " + story.id);
    assert.equal(story.cefr, Immersion.storyCefr(story), "niveau CECRL cohérent : " + story.id);
    assert.ok(story.lines.length >= 6, "histoire assez longue : " + story.id);
    assert.equal(story.questions.length, 2, "deux questions : " + story.id);
    story.questions.forEach(function (question) {
      assert.ok(Immersion.skills[question.skill], "compétence connue : " + story.id);
    });
    assert.ok(story.focus.length >= 6, "vocabulaire : " + story.id);
    story.lines.forEach(function (line) {
      assert.ok(Immersion.lineJp(line).length > 0);
      assert.ok(Immersion.lineJp(line).indexOf("[") < 0, "pas d'annotation brute à l'audio");
      assert.ok(line.fr.length > 0);
    });
  });
  ['resto', 'jikoshoukai', 'groupe', 'deeto', 'passions', 'shifuto', 'desaccord', 'entretien', 'negociation'].forEach(function (id) {
    assert.ok(Immersion.storyById(id), "histoire sociale présente : " + id);
  });
  const story = Immersion.storyById("asa");
  const result = Immersion.scoreStory(story, { 0: 1, 1: 2 });
  assert.equal(result.score, 2);
  assert.equal(result.total, 2);
  assert.equal(result.all, true);
  assert.equal(Immersion.scoreStory(story, { 0: 0 }).score, 0);
});

test("histoires : bilan A1 à B2 fondé sur les résultats", function () {
  const empty = Immersion.assessLevel({});
  assert.equal(empty.code, "A1");
  assert.equal(empty.status, "à établir");
  assert.equal(empty.stats.A1.total, 4);
  assert.equal(empty.stats.A2.total, 7);
  assert.equal(empty.stats.B1.total, 2);
  assert.equal(empty.stats.B2.total, 2);
  const a1 = Immersion.stories.filter(function (story) { return Immersion.storyCefr(story) === "A1"; });
  const a2 = Immersion.stories.filter(function (story) { return Immersion.storyCefr(story) === "A2"; });
  const b1 = Immersion.stories.filter(function (story) { return Immersion.storyCefr(story) === "B1"; });
  const b2 = Immersion.stories.filter(function (story) { return Immersion.storyCefr(story) === "B2"; });
  const records = {};
  a1.slice(0, 3).forEach(function (story) { records[story.id] = { completedAt: 1, total: 2, bestScore: 2 }; });
  a2.slice(0, 2).forEach(function (story) { records[story.id] = { completedAt: 1, total: 2, bestScore: 1 }; });
  const profile = Immersion.assessLevel(records);
  assert.equal(profile.code, "A2");
  assert.equal(profile.status, "en cours");
  assert.equal(profile.stats.A1.passed, 3);
  assert.equal(profile.stats.A2.passed, 2);
  a2.slice(0, 4).forEach(function (story) { records[story.id] = { completedAt: 1, total: 2, bestScore: 2 }; });
  assert.equal(Immersion.assessLevel(records).status, "consolidé");
  b1.forEach(function (story) { records[story.id] = { completedAt: 1, total: 2, bestScore: 1 }; });
  assert.equal(Immersion.assessLevel(records).code, "B1");
  b2.forEach(function (story) { records[story.id] = { completedAt: 1, total: 2, bestScore: 1 }; });
  const b2Profile = Immersion.assessLevel(records);
  assert.equal(b2Profile.code, "B2");
  assert.equal(b2Profile.status, "en cours");
  b2.forEach(function (story) { records[story.id] = { completedAt: 1, total: 2, bestScore: 2 }; });
  assert.equal(Immersion.assessLevel(records).status, "consolidé");
});

test("histoires : l'état par défaut et la synchronisation conservent les lectures", function () {
  assert.deepEqual(Store.defaultState().immersion, {});
  const normalized = Store.normalizeState({ immersion: { asa: { completedAt: 100, lastAt: 120, bestScore: 1, total: 2, attempts: 2 } } });
  assert.equal(normalized.immersion.asa.bestScore, 1);
  assert.equal(normalized.immersion.asa.total, 2);
  const merged = Sync.mergeStates(
    { immersion: { asa: { completedAt: 100, lastAt: 100, bestScore: 1, total: 2, attempts: 1, lastRewardDay: "2026-11-01" } } },
    { immersion: { asa: { completedAt: 200, lastAt: 300, bestScore: 2, total: 2, attempts: 3, lastRewardDay: "2026-11-02" }, yama: { completedAt: 50, lastAt: 50, bestScore: 1, total: 2, attempts: 1 } } }
  );
  assert.equal(merged.immersion.asa.completedAt, 100, "la première lecture est conservée");
  assert.equal(merged.immersion.asa.lastAt, 300);
  assert.equal(merged.immersion.asa.bestScore, 2);
  assert.equal(merged.immersion.asa.attempts, 3);
  assert.equal(merged.immersion.asa.lastRewardDay, "2026-11-02");
  assert.ok(merged.immersion.yama);
});

test("conversation : accepte japonais, kana et romaji, puis refuse une autre réponse", function () {
  const scenario = Conversation.scenarioById("meet");
  assert.ok(scenario);
  assert.equal(Conversation.checkAnswer("私はレアです。", scenario.turns[0].accepted, scenario.turns[0]), true);
  assert.equal(Conversation.checkAnswer("わたしはレアです", scenario.turns[0].accepted, scenario.turns[0]), true);
  assert.equal(Conversation.checkAnswer("watashi wa rea desu", scenario.turns[0].accepted, scenario.turns[0]), true);
  assert.equal(Conversation.checkAnswer("私はマリーです。", scenario.turns[0].accepted, scenario.turns[0]), true);
  assert.equal(Conversation.checkAnswer("フランスから来ました。", scenario.turns[1].accepted), true);
  assert.equal(Conversation.checkAnswer("furansu kara kimashita", scenario.turns[1].accepted), true);
  assert.equal(Conversation.checkAnswer("watashi wa nihonjin desu", scenario.turns[1].accepted), false);
  assert.equal(scenario.turns.length, 3, "chaque situation propose trois échanges");
  assert.equal(Conversation.checkAnswer("六ヶ月勉強しています。", scenario.turns[2].accepted), true);
  assert.equal(Conversation.checkAnswer("rokkagetsu benkyou shite imasu", scenario.turns[2].accepted), true);
  const cafe = Conversation.scenarioById("cafe");
  assert.equal(Conversation.checkAnswer("hotto koohii o kudasai", cafe.turns[0].accepted), true);
  assert.equal(Conversation.checkAnswer("tennai de onegai shimasu", cafe.turns[2].accepted), true);
  assert.equal(Conversation.scenarios.length, 15, "quinze situations de vie réelle");
  assert.equal(Conversation.scenarios.reduce(function (sum, item) { return sum + item.turns.length; }, 0), 45, "quarante-cinq répliques");
  assert.equal(Conversation.checkAnswer("カードでお願いします。", Conversation.scenarioById("konbini").turns[1].accepted), true);
  assert.equal(Conversation.checkAnswer("サーモンが一番好きです。", Conversation.scenarioById("opinion").turns[1].accepted), true);
  assert.equal(Conversation.checkAnswer("財布をなくしました。", Conversation.scenarioById("help").turns[0].accepted), true);
  assert.equal(Conversation.checkAnswer("往復でお願いします。", Conversation.scenarioById("train").turns[1].accepted), true);
  assert.equal(Conversation.checkAnswer("レアで予約しています。", Conversation.scenarioById("hotel").turns[0].accepted), true);
  assert.equal(Conversation.checkAnswer("一日に何回飲みますか。", Conversation.scenarioById("pharmacy").turns[2].accepted), true);
  assert.equal(Conversation.checkAnswer("カードでお願いします。", Conversation.scenarioById("taxi").turns[2].accepted), true);
});

test("carnet d'erreurs : mots fragiles, répliques et histoires", function () {
  const entries = [{ id: "a", fr: "aller" }, { id: "b", fr: "boire" }, { id: "c", fr: "voir" }, { id: "d", fr: "dormir" }];
  const state = {
    progress: {
      a: { last: 10, lapses: 2 },
      b: { last: 10, lapses: 0, pronunciation: [{ score: 55 }] },
      c: { last: 10, lapses: 0, pronunciation: [{ score: 92 }] },
      d: { last: 0, lapses: 0 }
    },
    conversationReview: {
      "cafe:1": { scenario: "cafe", turn: 1, missedAt: 200, clearedAt: 100 },
      "meet:0": { scenario: "meet", turn: 0, missedAt: 100, clearedAt: 200 },
      "help:2": { scenario: "help", turn: 2, missedAt: 50 }
    },
    immersion: {
      asa: { attempts: 1, bestScore: 1, total: 2 },
      yama: { attempts: 1, bestScore: 2, total: 2 },
      umi: { attempts: 0, bestScore: 0, total: 2 }
    }
  };
  const fragile = Mistakes.fragileWords(entries, state);
  assert.deepEqual(fragile.map(function (row) { return row.entry.id; }), ["a", "b"]);
  assert.equal(fragile[0].lastScore, null);
  assert.equal(fragile[1].lastScore, 55);
  assert.deepEqual(Mistakes.conversationMisses(state).map(function (row) { return row.key; }), ["cafe:1", "help:2"]);
  const stories = Mistakes.storiesToConsolidate(state, [{ id: "asa", title: "Asa" }, { id: "yama", title: "Yama" }]);
  assert.deepEqual(stories.map(function (row) { return row.id; }), ["asa"]);
  assert.equal(stories[0].story.title, "Asa");
  const total = Mistakes.summary(state, entries, [{ id: "asa", title: "Asa" }]);
  assert.equal(total.words, 2);
  assert.equal(total.conversations, 2);
  assert.equal(total.stories, 1);
  assert.equal(total.total, 5);
});

test("grammaire B1/B2 : douze leçons, quarante-huit exercices et lectures complètes", function () {
  const errors = GrammarTrack.validateContent();
  assert.deepEqual(errors, [], "le contenu doit être valide : " + errors.join(" | "));
  assert.equal(GrammarTrack.lessons.length, 12);
  assert.equal(GrammarTrack.lessonsByLevel("B1").length, 6);
  assert.equal(GrammarTrack.lessonsByLevel("B2").length, 6);
  assert.equal(GrammarTrack.lessons.reduce(function (sum, lesson) { return sum + lesson.exercises.length; }, 0), 48);
  const lesson = GrammarTrack.lessonById("b1-te-shimau");
  assert.ok(lesson);
  assert.equal(lesson.exercises[0].options.filter(function (option) { return option.correct; }).length, 1);
  assert.equal(Parser.annotate(lesson.points[0].examples[1].jp, lesson.points[0].examples[1].kana).indexOf("[") >= 0, true);
});

test("grammaire : progression normalisée et fusionnée entre appareils", function () {
  assert.deepEqual(Store.defaultState().grammar, { lessons: {}, history: [] });
  const normalized = Store.normalizeState({
    grammar: { lessons: { "b1-te-shimau": { attempts: "2", bestScore: "150", completedAt: "100", lastAt: "200", answers: { a: true, b: "non" } } } }
  });
  assert.equal(normalized.grammar.lessons["b1-te-shimau"].attempts, 2);
  assert.equal(normalized.grammar.lessons["b1-te-shimau"].bestScore, 100);
  assert.equal(normalized.grammar.lessons["b1-te-shimau"].answers.a, true);
  assert.equal(normalized.grammar.lessons["b1-te-shimau"].answers.b, undefined);
  assert.equal(GrammarTrack.levelStats(normalized, "B1").completed, 1);
  assert.equal(GrammarTrack.nextLessonId("B1", "b1-te-shimau"), "b1-te-oku");
  const merged = Sync.mergeStates(
    { grammar: { lessons: { "b1-te-shimau": { attempts: 1, bestScore: 50, completedAt: 100, lastAt: 200, answers: { a: true, b: false } } } } },
    { grammar: { lessons: { "b1-te-shimau": { attempts: 2, bestScore: 75, completedAt: 150, lastAt: 300, answers: { b: true, c: false } } } } }
  );
  assert.equal(merged.grammar.lessons["b1-te-shimau"].attempts, 2);
  assert.equal(merged.grammar.lessons["b1-te-shimau"].bestScore, 75);
  assert.equal(merged.grammar.lessons["b1-te-shimau"].completedAt, 100);
  assert.equal(merged.grammar.lessons["b1-te-shimau"].lastAt, 300);
  assert.equal(merged.grammar.lessons["b1-te-shimau"].answers.a, true);
  assert.equal(merged.grammar.lessons["b1-te-shimau"].answers.b, true);
});

test("grammaire : la session du jour cible une leçon échouée", function () {
  const now = Date.UTC(2026, 10, 7, 12);
  const good = GrammarTrack.lessonById("b1-te-shimau");
  const weak = GrammarTrack.lessonById("b1-te-oku");
  const state = { grammar: { lessons: {} } };
  state.grammar.lessons[good.id] = { attempts: 1, bestScore: 100, completedAt: 100, lastAt: 100, answers: {} };
  state.grammar.lessons[weak.id] = { attempts: 1, bestScore: 40, completedAt: 200, lastAt: 50, answers: {} };
  state.grammar.lessons[weak.id].answers[weak.exercises[1].id] = false;
  const pick = GrammarTrack.dailyPick(state, now);
  assert.equal(pick.lesson.id, weak.id);
  assert.equal(pick.exercise.id, weak.exercises[1].id);
  assert.equal(pick.reason, "review");

  const clean = { grammar: { lessons: {} } };
  clean.grammar.lessons[good.id] = { attempts: 1, bestScore: 100, completedAt: 100, lastAt: 100, answers: {} };
  const next = GrammarTrack.dailyPick(clean, now);
  assert.equal(next.lesson.id, "b1-te-oku");
  assert.equal(next.reason, "discover");

  const partial = { grammar: { lessons: {} } };
  partial.grammar.lessons[good.id] = { attempts: 1, bestScore: 100, completedAt: 100, lastAt: 100, answers: {} };
  partial.grammar.lessons[weak.id] = { attempts: 1, bestScore: 0, answers: {} };
  partial.grammar.lessons[weak.id].answers[weak.exercises[0].id] = true;
  assert.equal(GrammarTrack.dailyPick(partial, now).reason, "practice");
  assert.equal(GrammarTrack.dailyPick(partial, now).lesson.id, weak.id);
});

test("grammaire : historique des points revus et fusion", function () {
  const state = Store.defaultState();
  const lesson = GrammarTrack.lessonById("b1-te-shimau");
  const record = GrammarTrack.recordDailyReview(state, {
    lessonId: lesson.id,
    exerciseId: lesson.exercises[0].id,
    title: lesson.title,
    level: lesson.level,
    score: 100,
    correct: true,
    reason: "review"
  }, 1000);
  assert.equal(record.score, 100);
  assert.equal(state.grammar.history.length, 1);
  assert.equal(GrammarTrack.recentHistory(state, 1)[0].lessonId, lesson.id);

  const normalized = Store.normalizeState({ grammar: { history: [
    { at: 200, lessonId: "b1-te-shimau", exerciseId: "e2", title: "Titre", level: "B2", score: "120", correct: true, reason: "review" },
    { at: 100, lessonId: "b1-te-oku", exerciseId: "e1", score: 0, correct: false, reason: "practice" },
    { at: 200, lessonId: "b1-te-shimau", exerciseId: "e2", score: 10 }
  ] } });
  assert.equal(normalized.grammar.history.length, 2);
  assert.equal(normalized.grammar.history[0].score, 100);
  assert.equal(normalized.grammar.history[0].level, "B2");

  const merged = Sync.mergeStates(
    { grammar: { history: [{ at: 300, lessonId: "a", exerciseId: "x", title: "A", level: "B1", score: 100, correct: true, reason: "review" }] } },
    { grammar: { history: [
      { at: 300, lessonId: "a", exerciseId: "x", title: "A", level: "B1", score: 100, correct: true, reason: "review" },
      { at: 400, lessonId: "b", exerciseId: "y", title: "B", level: "B2", score: 0, correct: false, reason: "practice" }
    ] } }
  );
  assert.equal(merged.grammar.history.length, 2);
  assert.equal(merged.grammar.history[0].lessonId, "b");
});

test("grammaire : prochaine étape conseillée après le point du jour", function () {
  const lesson = GrammarTrack.lessonById("b1-te-shimau");
  const state = Store.defaultState();
  const currentWrong = GrammarTrack.nextStepFor(state, lesson.id, false, "b1-te-shimau-e2");
  assert.equal(currentWrong.kind, "review");
  assert.equal(currentWrong.exerciseId, "b1-te-shimau-e2");
  assert.equal(currentWrong.label, "Refaire l’exercice");
  assert.equal(GrammarTrack.nextStepFor(state, lesson.id, true).kind, "finish");
  state.grammar.lessons[lesson.id] = { attempts: 1, bestScore: 50, completedAt: 100, lastAt: 100, answers: {} };
  assert.equal(GrammarTrack.nextStepFor(state, lesson.id, true).kind, "review");
  state.grammar.lessons[lesson.id].answers = { "b1-te-shimau-e1": true, "b1-te-shimau-e2": false, "b1-te-shimau-e3": false };
  const targeted = GrammarTrack.nextStepFor(state, lesson.id, true, "b1-te-shimau-e1");
  assert.equal(targeted.exerciseId, "b1-te-shimau-e2");
  assert.deepEqual(GrammarTrack.reviewQueueFor(state, lesson.id, "b1-te-shimau-e1"), ["b1-te-shimau-e2", "b1-te-shimau-e3"]);
  state.grammar.lessons[lesson.id].bestScore = 100;
  const next = GrammarTrack.nextStepFor(state, lesson.id, true);
  assert.equal(next.kind, "next");
  assert.equal(next.lessonId, "b1-te-oku");
  const last = GrammarTrack.lessons[GrammarTrack.lessons.length - 1];
  assert.equal(GrammarTrack.nextStepFor({ grammar: { lessons: { [last.id]: { bestScore: 100, completedAt: 1, answers: {} } } } }, last.id, true).kind, "done");
});

if (failed) {
  console.error("\n" + failed + " test(s) en échec.");
  process.exit(1);
}
