"use strict";

const assert = require("assert");
const Lex = require("../js/lexicon.js");
const Store = require("../js/srs.js");
const Parser = require("../js/parser.js");
const Pron = require("../js/pronunciation.js");

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

test("prononciation : ください est accepté pour s'il vous plaît", function () {
  const entry = Lex.lookup({ jp: "お願いします" });
  const result = Pron.compare("ください", entry);
  assert.equal(result.good, true);
  assert.equal(result.score, 100);
  assert.equal(result.alternative, true);
  assert.equal(result.expected, "ください");
  assert.ok(entry.alternatives[0].usage.indexOf('Plus directe') >= 0);
  assert.ok(entry.contextNote.indexOf('Au café') >= 0);
});

if (failed) {
  console.error("\n" + failed + " test(s) en échec.");
  process.exit(1);
}
console.log("\nTous les tests unitaires passent.");
