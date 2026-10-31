"use strict";

const assert = require("assert");
const Lex = require("../js/lexicon.js");
const Store = require("../js/srs.js");
const Parser = require("../js/parser.js");

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

if (failed) {
  console.error("\n" + failed + " test(s) en échec.");
  process.exit(1);
}
console.log("\nTous les tests unitaires passent.");
