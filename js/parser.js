/* Kotoba — analyse des listes importées.
   Formats acceptés (le français peut être avant ou après le japonais) :
     bonjour | kon-ni-chi-wa
     bonjour | こんにちは | konnichiwa
     bonjour | こんにちは | konnichiwa | こんにちは、花さん！ | Bonjour, Hana !
     食べる | たべる | taberu | manger | ご飯を食べる。 | Je mange du riz.
     bonjour, こんにちは
     japonais sur une ligne, français sur la suivante
   Le module est volontairement sans DOM pour être testé avec Node. */
(function (root) {
  "use strict";

  const Lex = (root.Kotoba && root.Kotoba.Lexicon) ||
    (typeof require === "function" ? require("./lexicon.js") : null);

  if (!Lex) throw new Error("Kotoba : lexique introuvable (charge js/lexicon.js avant js/parser.js).");

  const JP_RE = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\u3005]/;
  const KANJI_RE = /[\u3400-\u9fff\uf900-\ufaff\u3005]/;
  const KANA_RE = /^[\u3040-\u30ff\u30fc\s・ー]+$/;

  // Mots-outils et traductions fréquentes : servent à distinguer « eau » de « mizu ».
  const FR_WORDS = new Set((
    "le la les un une des du de d au aux a je tu il elle on nous vous ils elles " +
    "me te se ce cette ces mon ma mes ton ta tes son sa ses notre votre leur " +
    "est sont etait ete etre avoir ai as avons avez ont fait fais faire va vas allons allez vais " +
    "aller vient venir voir regarder manger mange boire bois dormir dors lever leve " +
    "travailler travaille acheter achete bonjour bonsoir salut merci pardon oui non " +
    "revoir au s il vous plait ca cela va pas probleme eau the cafe riz repas pain viande " +
    "poisson legumes oeuf menu commande restaurant addition recommandation ventre baguettes " +
    "alcool sucre grand grande petit petite nouveau nouvelle vieux vieille cher chere eleve " +
    "bon marche chaud froid amusant aimer aime famille mere pere frere soeur enfant mari femme " +
    "maison chambre cuisine bain toilettes gare ecole entreprise hopital bibliotheque livre film " +
    "musique photo voyage devoirs travail argent train chat chien nom ami amie etudiant etudiante " +
    "professeur japonais japonaise japon france chine coree qui quoi origine aujourd hui demain " +
    "maintenant temps heure chaque jour deux trois dix cent chose personne comment vraiment " +
    "aussi tres bien mal avec sans pour dans sur sous entre chez"
  ).split(/\s+/));

  function hasJapanese(s) { return JP_RE.test(String(s || "")); }
  function hasKanji(s) { return KANJI_RE.test(String(s || "")); }
  function stripAnnotations(s) { return String(s || "").replace(/\[[^\]]*\]/g, ""); }
  function isKanji(ch) { return KANJI_RE.test(ch); }
  function isKanaOnly(s) {
    const t = String(s || "").trim();
    return !!t && !hasKanji(t) && /[\u3040-\u30ff]/.test(t) && KANA_RE.test(t);
  }

  function looksFrench(s) {
    const raw = String(s || "").trim();
    if (!raw) return false;
    if (/[àâäéèêëîïôöùûüÿçœæ]/i.test(raw)) return true;
    const n = Lex.normalizeFr(raw);
    if (!n) return false;
    if (n.split(" ").some(function (w) { return FR_WORDS.has(w); })) return true;
    if (/['’]/.test(raw) && /[a-z]/i.test(raw)) return true;
    return false;
  }

  function looksRomaji(s) {
    const raw = String(s || "").trim();
    if (!raw || hasJapanese(raw)) return false;
    if (Lex.byRomaji.has(Lex.normalizeRomaji(raw))) return true;
    if (looksFrench(raw)) return false;
    const lower = raw.toLowerCase();
    if (!/^[a-zāīūēō\-' ]+$/.test(lower)) return false;
    if (!/[aeiouāīūēō]/.test(lower)) return false;
    if (lower.indexOf("-") >= 0) return true;
    return /^[a-z]{2,}$/.test(lower) || /^[a-z]+(?: [a-z]+)+$/.test(lower);
  }

  function splitCells(line) {
    const s = String(line || "").trim();
    if (!s) return [];
    if (s.indexOf("|") >= 0) return s.split("|").map(function (x) { return x.trim(); }).filter(Boolean);
    if (s.indexOf("\t") >= 0) return s.split("\t").map(function (x) { return x.trim(); }).filter(Boolean);
    if (s.indexOf(";") >= 0) return s.split(";").map(function (x) { return x.trim(); }).filter(Boolean);
    if (/\s+[-–—]\s+/.test(s)) return s.split(/\s+[-–—]\s+/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (/\s+=\s+/.test(s)) return s.split(/\s+=\s+/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (/\s{2,}/.test(s)) return s.split(/\s{2,}/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (s.split(",").length === 2 && s.length <= 100) return s.split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    return [s];
  }

  function isPair(a, b) {
    if (!a || !b) return false;
    if (hasJapanese(a) === hasJapanese(b)) return false;
    if (a.length > 60 || b.length > 60) return false;
    if (/[。！？]$/.test(a) || /[。！？]$/.test(b)) return false;
    return true;
  }

  // Place la lecture au-dessus des groupes de kanji. Si l'alignement est
  // impossible (lecture irrégulière), on met la lecture au-dessus du mot entier.
  function annotate(jp, reading) {
    const base = stripAnnotations(jp);
    const r = stripAnnotations(reading);
    if (!base || !r || !hasKanji(base)) return base || jp;
    if (String(jp).indexOf("[") >= 0) return jp;
    if (!/[\u3040-\u30ff]/.test(r) || /[a-zA-Z]/.test(r)) return base;

    let out = "";
    let bi = 0;
    let ri = 0;
    while (bi < base.length) {
      const ch = base[bi];
      if (!isKanji(ch)) {
        if (r[ri] === ch) { out += ch; bi++; ri++; continue; }
        const idx = r.indexOf(ch, ri);
        if (idx >= 0) { out += ch; bi++; ri = idx + 1; continue; }
        return base + "[" + r + "]";
      }

      let run = "";
      while (bi < base.length && isKanji(base[bi])) { run += base[bi]; bi++; }
      let nextKana = "";
      for (let k = bi; k < base.length; k++) {
        if (!isKanji(base[k])) { nextKana = base[k]; break; }
      }
      let end = r.length;
      if (nextKana) {
        const idx = r.indexOf(nextKana, ri);
        if (idx < 0) return base + "[" + r + "]";
        end = idx;
      }
      const seg = r.slice(ri, end);
      if (!seg) return base + "[" + r + "]";
      out += run + "[" + seg + "]";
      ri = end;
    }
    return out;
  }

  const DIGRAPHS = {
    "きゃ": "kya", "きゅ": "kyu", "きょ": "kyo",
    "しゃ": "sha", "しゅ": "shu", "しょ": "sho",
    "ちゃ": "cha", "ちゅ": "chu", "ちょ": "cho",
    "にゃ": "nya", "にゅ": "nyu", "にょ": "nyo",
    "ひゃ": "hya", "ひゅ": "hyu", "ひょ": "hyo",
    "みゃ": "mya", "みゅ": "myu", "みょ": "myo",
    "りゃ": "rya", "りゅ": "ryu", "りょ": "ryo",
    "ぎゃ": "gya", "ぎゅ": "gyu", "ぎょ": "gyo",
    "じゃ": "ja", "じゅ": "ju", "じょ": "jo",
    "びゃ": "bya", "びゅ": "byu", "びょ": "byo",
    "ぴゃ": "pya", "ぴゅ": "pyu", "ぴょ": "pyo",
    "しぇ": "she", "ちぇ": "che", "じぇ": "je",
    "ふぁ": "fa", "ふぃ": "fi", "ふぇ": "fe", "ふぉ": "fo",
    "てぃ": "ti", "でぃ": "di", "とぅ": "tu", "どぅ": "du",
    "うぃ": "wi", "うぇ": "we", "うぉ": "wo",
    "ゔぁ": "va", "ゔぃ": "vi", "ゔぇ": "ve", "ゔぉ": "vo"
  };

  const KANA_ROMAJI = {
    "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
    "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
    "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
    "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
    "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
    "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
    "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
    "や": "ya", "ゆ": "yu", "よ": "yo",
    "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
    "わ": "wa", "を": "o", "ん": "n",
    "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
    "ざ": "za", "じ": "ji", "ず": "zu", "ぜ": "ze", "ぞ": "zo",
    "だ": "da", "ぢ": "ji", "づ": "zu", "で": "de", "ど": "do",
    "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo",
    "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po",
    "ぁ": "a", "ぃ": "i", "ぅ": "u", "ぇ": "e", "ぉ": "o",
    "ゃ": "ya", "ゅ": "yu", "ょ": "yo", "ゎ": "wa", "ゔ": "vu"
  };

  function toHiragana(s) {
    return String(s || "").replace(/[\u30a1-\u30f6]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0x60);
    });
  }

  function matchKana(s, i) {
    const two = s.slice(i, i + 2);
    if (DIGRAPHS[two]) return { kana: two, romaji: DIGRAPHS[two], len: 2 };
    const one = s[i] || "";
    return { kana: one, romaji: KANA_ROMAJI[one] || "", len: 1 };
  }

  function kanaToRomaji(input) {
    const s = toHiragana(stripAnnotations(input)).replace(/[\s　]/g, "");
    let out = "";
    let i = 0;
    while (i < s.length) {
      const t = matchKana(s, i);
      if (t.kana === "っ") {
        const n = matchKana(s, i + 1);
        if (n.romaji) {
          out += n.romaji.indexOf("ch") === 0 ? "t" + n.romaji : n.romaji[0] + n.romaji;
          i += 1 + n.len;
          continue;
        }
        i++;
        continue;
      }
      if (t.kana === "ー") {
        const m = out.match(/[aeiou]$/);
        out += m ? m[0] : "";
        i++;
        continue;
      }
      if (t.kana === "ん") {
        const n = matchKana(s, i + 1);
        out += (n.romaji && /^[aeiouy]/.test(n.romaji)) ? "n'" : "n";
        i++;
        continue;
      }
      out += t.romaji;
      i += t.len;
    }
    return out;
  }

  const ROMAJI_KANA = {
    "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
    "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
    "sa": "さ", "shi": "し", "su": "す", "se": "せ", "so": "そ",
    "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
    "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
    "ha": "は", "hi": "ひ", "fu": "ふ", "he": "へ", "ho": "ほ",
    "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
    "ya": "や", "yu": "ゆ", "yo": "よ",
    "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
    "wa": "わ", "wo": "を", "n": "ん",
    "ga": "が", "gi": "ぎ", "gu": "ぐ", "ge": "げ", "go": "ご",
    "za": "ざ", "ji": "じ", "zu": "ず", "ze": "ぜ", "zo": "ぞ",
    "da": "だ", "di": "ぢ", "du": "づ", "de": "で", "do": "ど",
    "ba": "ば", "bi": "び", "bu": "ぶ", "be": "べ", "bo": "ぼ",
    "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ",
    "kya": "きゃ", "kyu": "きゅ", "kyo": "きょ",
    "sha": "しゃ", "shu": "しゅ", "sho": "しょ",
    "cha": "ちゃ", "chu": "ちゅ", "cho": "ちょ",
    "nya": "にゃ", "nyu": "にゅ", "nyo": "にょ",
    "hya": "ひゃ", "hyu": "ひゅ", "hyo": "ひょ",
    "mya": "みゃ", "myu": "みゅ", "myo": "みょ",
    "rya": "りゃ", "ryu": "りゅ", "ryo": "りょ",
    "gya": "ぎゃ", "gyu": "ぎゅ", "gyo": "ぎょ",
    "ja": "じゃ", "ju": "じゅ", "jo": "じょ",
    "bya": "びゃ", "byu": "びゅ", "byo": "びょ",
    "pya": "ぴゃ", "pyu": "ぴゅ", "pyo": "ぴょ",
    "fa": "ふぁ", "fi": "ふぃ", "fe": "ふぇ", "fo": "ふぉ",
    "va": "ゔぁ", "vi": "ゔぃ", "vu": "ゔ", "ve": "ゔぇ", "vo": "ゔぉ",
    "she": "しぇ", "che": "ちぇ", "je": "じぇ",
    "ti": "てぃ", "tu": "とぅ", "wi": "うぃ", "we": "うぇ"
  };

  function romajiToKana(input) {
    const s = String(input || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");
    let out = "";
    let i = 0;
    while (i < s.length) {
      if (s[i] === "n" && i + 1 < s.length && !/[aeiouy]/.test(s[i + 1])) {
        out += "ん";
        i++;
        continue;
      }
      if (i + 1 < s.length && s[i] === s[i + 1] && !/[aeiou]/.test(s[i]) && s[i] !== "n") {
        out += "っ";
        i++;
        continue;
      }
      let matched = false;
      const lengths = [3, 2, 1];
      for (let k = 0; k < lengths.length; k++) {
        const len = lengths[k];
        const chunk = s.slice(i, i + len);
        if (ROMAJI_KANA[chunk]) {
          out += ROMAJI_KANA[chunk];
          i += len;
          matched = true;
          break;
        }
      }
      if (!matched) i++;
    }
    return out;
  }

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }

  function buildEntry(inputCells) {
    const cells = (inputCells || []).map(function (c) { return String(c || "").trim(); }).filter(Boolean);
    if (!cells.length) return { reason: "Ligne vide" };

    const jpCells = [];
    const latinCells = [];
    cells.forEach(function (c) { (hasJapanese(c) ? jpCells : latinCells).push(c); });

    let jpCell = "";
    if (jpCells.length) {
      const first = jpCells[0];
      const shortest = jpCells.slice().sort(function (a, b) {
        return stripAnnotations(a).length - stripAnnotations(b).length;
      })[0];
      jpCell = (/[。！？!?]$/.test(first) && shortest !== first) ? shortest : first;
    }

    let readingCell = "";
    let contextJp = "";
    jpCells.forEach(function (c) {
      if (c === jpCell) return;
      if (!readingCell && isKanaOnly(c) && hasKanji(jpCell) &&
          stripAnnotations(c).length <= stripAnnotations(jpCell).length + 3 &&
          !/[。、！？!?]/.test(c)) {
        readingCell = c;
        return;
      }
      if (!contextJp || stripAnnotations(c).length > stripAnnotations(contextJp).length) contextJp = c;
    });

    const frCells = [];
    const romajiCells = [];
    latinCells.forEach(function (c) {
      if (looksFrench(c)) frCells.push(c);
      else if (looksRomaji(c)) romajiCells.push(c);
      else frCells.push(c);
    });

    let fr = "";
    let contextFr = "";
    if (frCells.length) {
      const sorted = frCells.slice().sort(function (a, b) { return a.length - b.length; });
      if (sorted[0].length <= 48) fr = sorted[0];
      if (sorted.length > 1) contextFr = sorted[sorted.length - 1];
      else if (!fr) contextFr = sorted[0];
    }

    let romaji = "";
    if (romajiCells.length) {
      romajiCells.sort(function (a, b) { return a.length - b.length; });
      romaji = romajiCells[0];
    }

    let lex = null;
    if (jpCell) lex = Lex.lookup({ jp: jpCell });
    else if (romaji) lex = Lex.lookup({ romaji: romaji });
    if (!lex && !jpCell && fr) lex = Lex.lookup({ fr: fr });
    if (!lex && jpCell && !hasKanji(jpCell) && romaji) lex = Lex.lookup({ romaji: romaji });

    let jp = jpCell ? stripAnnotations(jpCell) : "";
    let ruby = jpCell || "";
    let reading = readingCell ? stripAnnotations(readingCell) : "";
    let context = contextJp || "";
    let hl = "";

    if (lex) {
      if (!jp) jp = lex.jp;
      if (!reading) reading = lex.reading || "";
      if (!romaji) romaji = lex.romaji || "";
      if (!fr) fr = lex.fr || "";
      if (!context) context = lex.context || "";
      if (!contextFr) contextFr = lex.contextFr || "";
      hl = lex.hl || "";
      if (!ruby || ruby.indexOf("[") < 0) {
        if (lex.ruby && stripAnnotations(lex.ruby) === jp) ruby = lex.ruby;
      }
    }

    if (!jp && romaji) {
      jp = romajiToKana(romaji);
      ruby = jp;
      reading = jp;
    }

    if (!jp) return { reason: "Aucun mot japonais détecté" };
    if (!fr) return { reason: "Traduction française manquante" };

    if (ruby.indexOf("[") >= 0) {
      jp = stripAnnotations(ruby);
      if (!reading) reading = stripAnnotations(ruby);
    } else if (hasKanji(jp)) {
      ruby = reading ? annotate(jp, reading) : jp;
    } else {
      ruby = jp;
      if (!reading) reading = jp;
    }

    if (!romaji && reading) romaji = kanaToRomaji(reading);
    if (!hl) hl = jp;

    return {
      entry: {
        id: "i:" + hash(Lex.normalizeJp(jp) + "|" + Lex.normalizeFr(fr)),
        jp: jp,
        ruby: ruby,
        reading: reading,
        romaji: romaji,
        fr: fr,
        context: context,
        contextFr: contextFr,
        hl: hl,
        theme: "Mes mots importés",
        emoji: "📥",
        source: "import"
      }
    };
  }

  function parseText(text) {
    const lines = String(text || "").split(/\r?\n/);
    const entries = [];
    const errors = [];
    const seen = new Set();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (/^(#|\/\/)/.test(line)) continue;

      let cells = splitCells(line);

      if (cells.length <= 1) {
        const next = (lines[i + 1] || "").trim();
        if (next && isPair(line, next)) {
          cells = [line, next];
          i++;
        } else {
          const m = line.match(/^(.+?)\s*[\(（]([^\(\)（）]+)[\)）]\s*$/);
          if (m && (hasJapanese(m[1]) !== hasJapanese(m[2]))) {
            cells = [m[1].trim(), m[2].trim()];
          }
        }
      }

      // OCR colle parfois le japonais et sa traduction avec un seul espace.
      if (cells.length <= 1) {
        const m = line.match(/^([\u3040-\u30ff\u3400-\u9fff\u3005\u30fc]+)[\s　]+([A-Za-zÀ-ÿ].*)$/);
        if (m) {
          cells = [m[1], m[2]];
        } else {
          const m2 = line.match(/^([A-Za-zÀ-ÿ].*?)[\s　]+([\u3040-\u30ff\u3400-\u9fff\u3005\u30fc]+)$/);
          if (m2) cells = [m2[1], m2[2]];
        }
      }

      const built = buildEntry(cells);
      if (built.entry) {
        if (!seen.has(built.entry.id)) {
          entries.push(built.entry);
          seen.add(built.entry.id);
        }
      } else {
        errors.push({ line: i + 1, text: line, reason: built.reason });
      }
    }

    return { entries: entries, errors: errors };
  }

  const api = {
    parseText: parseText,
    buildEntry: buildEntry,
    splitCells: splitCells,
    isPair: isPair,
    annotate: annotate,
    stripAnnotations: stripAnnotations,
    hasJapanese: hasJapanese,
    hasKanji: hasKanji,
    isKanaOnly: isKanaOnly,
    looksFrench: looksFrench,
    looksRomaji: looksRomaji,
    kanaToRomaji: kanaToRomaji,
    romajiToKana: romajiToKana,
    hash: hash
  };

  root.Kotoba = root.Kotoba || {};
  root.Kotoba.Parser = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
