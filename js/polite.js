/* Kotoba — formes polies et variantes de lecture des verbes.
   Le japonais affiché par défaut est poli. Les formes du dictionnaire restent
   disponibles dans la fiche, mais ne sont plus la forme principale. */
(function (root) {
  "use strict";

  if (!root.Kotoba) root.Kotoba = {};
  var P = root.Kotoba && root.Kotoba.Parser;
  var cache = null;
  var conjugationCache = Object.create(null);
  var preparedCache = Object.create(null);
  var variantsCache = Object.create(null);
  var verbCache = Object.create(null);

  var GODAN_RU = new Set([
    "ある", "なる", "分かる", "取る", "帰る", "走る", "座る", "知る", "作る",
    "売る", "送る", "終わる", "始まる", "上がる", "下がる", "乗る", "入る",
    "切る", "要る", "混じる", "限る", "減る", "滑る", "蹴る", "握る", "守る",
    "困る", "怒る", "張る", "貼る", "散る", "照る", "湿る", "茂る", "参る",
    "喋る", "渡る", "戻る", "至る", "劣る", "優る", "交じる", "焦る", "眠る",
    "儲かる", "見つかる", "当たる", "触る", "残る", "回る", "変わる",
    "加わる"
  ]);

  var VOWEL_ROW = {};
  "あかさたなはまやらわがざだばぱ".split("").forEach(function (k) { VOWEL_ROW[k] = "a"; });
  "いきしちにひみりぎじぢびぴ".split("").forEach(function (k) { VOWEL_ROW[k] = "i"; });
  "うくすつぬふむゆるぐずづぶぷ".split("").forEach(function (k) { VOWEL_ROW[k] = "u"; });
  "えけせてねへめれげぜでべぺ".split("").forEach(function (k) { VOWEL_ROW[k] = "e"; });
  "おこそとのほもよろをごぞどぼぽ".split("").forEach(function (k) { VOWEL_ROW[k] = "o"; });

  var VERB_FR = new Set((
    "être avoir faire dire penser croire comprendre attendre mourir parler devenir venir voir regarder manger boire dormir " +
    "travailler acheter prendre donner recevoir écrire lire écouter entendre sortir entrer rentrer revenir appeler chercher " +
    "trouver utiliser mettre ouvrir fermer commencer finir continuer courir marcher tomber rire pleurer chanter jouer danser " +
    "voyager habiter vivre aimer adorer détester vouloir pouvoir devoir savoir connaître oublier aider montrer enseigner " +
    "apprendre étudier répondre demander payer vendre porter laver réveiller coucher lever promener reposer dépêcher sentir " +
    "rappeler tromper plaindre asseoir monter descendre tourner traverser passer rester partir arriver naître grandir vieillir " +
    "guérir tuer casser construire créer changer choisir couper dessiner effacer emprunter envoyer espérer essayer expliquer " +
    "garder jeter nager nettoyer occuper offrir oser paraître perdre plaire pleuvoir pousser préférer préparer présenter prêter " +
    "produire promettre protéger ranger réaliser réfléchir refuser regretter remercier remplir rencontrer rendre répéter " +
    "représenter résoudre retourner réunir réussir rêver salir sembler servir sourire suffire suggérer tirer toucher traduire " +
    "traiter transporter unir vaincre valoir verser visiter voler attendrir baigner éclaircir relever retenir contenir obtenir brosser polir " +
    "maintenir appartenir convenir devenir revenir souvenir tenir venir tenir valoir vouloir falloir neiger pleuvoir " +
    "s'approcher approcher s'éloigner éloigner s'endormir endormir se réveiller réveiller se laver laver se lever lever " +
    "se coucher coucher se promener promener se reposer reposer se dépêcher dépêcher se sentir sentir se rappeler rappeler " +
    "se tromper tromper se plaindre plaindre s'asseoir asseoir s'éclaircir éclaircir se produire produire se tenir tenir " +
    "se baigner baigner se souvenir souvenir s'en aller aller s'enfuir enfuir s'inquiéter inquiéter s'amuser amuser " +
    "s'appeler appeler s'arrêter arrêter s'asseoir asseoir s'efforcer efforcer s'évanouir évanouir s'habituer habituer " +
    "s'installer installer s'intéresser intéresser s'occuper occuper s'opposer opposer se plaindre plaindre se préparer préparer " +
    "se rappeler rappeler se raser raser se réfugier réfugier se réjouir réjouir se rendre rendre se reproduire reproduire " +
    "se réunir réunir se servir servir se taire taire se trouver trouver se vanter vanter se venger venger se verser verser"
  ).split(/\s+/).filter(Boolean));
  [
    "apprécier", "fâcher", "poser", "accrocher", "serrer", "bouger", "augmenter",
    "couvrir", "collecter", "disparaître", "diminuer", "comparer", "effectuer",
    "enquêter", "décider", "ressentir", "gagner", "pardonner", "attacher",
    "correspondre", "déplacer", "ressembler", "discuter", "laisser", "rassembler",
    "coller", "avancer", "réparer", "remettre", "confier", "inspirer", "emmener",
    "fleurir", "élever", "calmer", "dresser", "cacher", "décorer", "baisser",
    "frapper", "reconnaître", "accueillir", "secouer", "grimper", "exister"
  ].forEach(function (verb) { VERB_FR.add(verb); });

  var MANUAL = {
    "洗います": { jp: "洗う", reading: "あらう", fr: "laver" },
    "磨きます": { jp: "磨く", reading: "みがく", fr: "brosser" },
    "泳ぎます": { jp: "泳ぐ", reading: "およぐ", fr: "nager" },
    "歌います": { jp: "歌う", reading: "うたう", fr: "chanter" },
    "読みます": { jp: "読む", reading: "よむ", fr: "lire" },
    "書きます": { jp: "書く", reading: "かく", fr: "écrire" },
    "話します": { jp: "話す", reading: "はなす", fr: "parler" },
    "待ちます": { jp: "待つ", reading: "まつ", fr: "attendre" },
    "休みます": { jp: "休む", reading: "やすむ", fr: "se reposer" },
    "遊びます": { jp: "遊ぶ", reading: "あそぶ", fr: "jouer" },
    "急ぎます": { jp: "急ぐ", reading: "いそぐ", fr: "se dépêcher" },
    "死にます": { jp: "死ぬ", reading: "しぬ", fr: "mourir" },
    "呼びます": { jp: "呼ぶ", reading: "よぶ", fr: "appeler" },
    "住みます": { jp: "住む", reading: "すむ", fr: "habiter" },
    "知ります": { jp: "知る", reading: "しる", fr: "savoir" },
    "帰ります": { jp: "帰る", reading: "かえる", fr: "rentrer" },
    "入ります": { jp: "入る", reading: "はいる", fr: "entrer" },
    "走ります": { jp: "走る", reading: "はしる", fr: "courir" },
    "座ります": { jp: "座る", reading: "すわる", fr: "s'asseoir" },
    "作ります": { jp: "作る", reading: "つくる", fr: "faire" },
    "売ります": { jp: "売る", reading: "うる", fr: "vendre" },
    "送ります": { jp: "送る", reading: "おくる", fr: "envoyer" },
    "終わります": { jp: "終わる", reading: "おわる", fr: "finir" },
    "始まります": { jp: "始まる", reading: "はじまる", fr: "commencer" },
    "分かります": { jp: "分かる", reading: "わかる", fr: "comprendre" }
  };

  var NA_ADJ = new Set([
    "好き", "嫌い", "きらい", "きれい", "綺麗", "大丈夫", "元気", "静か", "便利", "有名",
    "上手", "下手", "大切", "必要", "十分", "自由", "楽", "簡単", "複雑", "安全", "危険",
    "親切", "真面目", "特別", "普通", "同じ", "いろいろ", "無理", "可能", "不可能"
  ]);

  function strip(value) {
    return P && P.stripAnnotations ? P.stripAnnotations(String(value || "")) : String(value || "");
  }

  function hasKanji(value) {
    return !!(P && P.hasKanji ? P.hasKanji(value) : /[\u3400-\u9fff]/.test(String(value || "")));
  }

  function kanaFromRuby(value) {
    var raw = String(value || "");
    if (!raw) return "";
    if (raw.indexOf("[") >= 0) {
      return raw.replace(/([^\s\[\]]+?)\[([^\]]+)\]/g, function (match, base, reading) {
        var prefix = (String(base).match(/^[\u3040-\u30ff]+/) || [""])[0];
        return prefix + reading;
      });
    }
    return strip(raw);
  }

  function shape(entry) {
    if (!entry) return null;
    if (Array.isArray(entry)) {
      var ruby = String(entry[1] || entry[0] || "");
      return {
        jp: strip(entry[0]),
        ruby: ruby,
        reading: kanaFromRuby(ruby),
        romaji: String(entry[2] || ""),
        fr: String(entry[3] || "")
      };
    }
    var jp = strip(entry.jp);
    var ruby = String(entry.ruby || "");
    var reading = String(entry.reading || "") || kanaFromRuby(ruby || jp);
    return {
      jp: jp,
      ruby: ruby,
      reading: strip(reading),
      romaji: String(entry.romaji || "") || (P && P.kanaToRomaji ? P.kanaToRomaji(reading) : ""),
      fr: String(entry.fr || "")
    };
  }

  function normalizeFr(value) {
    return String(value || "").toLowerCase()
      .replace(/\([^)]*\)/g, " ")
      .replace(/^(ne pas|ne plus|ne jamais)\s+/, "")
      .replace(/^(se |s'|s’)/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isVerbFr(value) {
    var fr = normalizeFr(value);
    if (!fr) return false;
    if (/^(le |la |les |un |une |des |du |de |ce |cette |ces |mon |ma |mes |ton |ta |tes |son |sa |ses |notre |votre |leur |leurs |quel |quelle |quelques )/.test(fr)) return false;
    var first = fr.split(/[ ,/]/)[0];
    if (VERB_FR.has(first)) return true;
    return /^(se |s'|s’)/.test(String(value || "").toLowerCase()) && VERB_FR.has(fr.split(/[ ,/]/)[0]);
  }

  function isPolite(jp) {
    return /(ます|ません|ました|ませんでした)$/.test(String(jp || ""));
  }

  function isDictionary(jp) {
    jp = strip(jp);
    if (isPolite(jp)) return false;
    return /(する|来る|[うくぐすつぬぶむる])$/.test(jp) && !isPolite(jp);
  }

  function isVerbEntry(entry) {
    var e = shape(entry);
    if (!e || !e.jp || !e.fr) return false;
    var key = e.jp + "|" + e.reading + "|" + normalizeFr(e.fr);
    if (key in verbCache) return verbCache[key];
    var result = (isPolite(e.jp) || isDictionary(e.jp)) && isVerbFr(e.fr);
    verbCache[key] = result;
    return result;
  }

  function isIAdjective(entry) {
    var e = shape(entry);
    if (!e || !e.jp || !/い$/.test(e.jp) || !hasKanji(e.jp) || NA_ADJ.has(e.jp)) return false;
    return !isVerbEntry(e);
  }

  function make(jp, reading) {
    jp = strip(jp);
    reading = strip(reading) || jp;
    var ruby = hasKanji(jp) && P && P.annotate ? P.annotate(jp, reading) : jp;
    return {
      jp: jp,
      reading: reading,
      romaji: P && P.kanaToRomaji ? P.kanaToRomaji(reading) : "",
      ruby: ruby
    };
  }

  function lastKanaMap(map, kana) {
    return map[kana] || "";
  }

  var MASU = { "う": "い", "く": "き", "ぐ": "ぎ", "す": "し", "つ": "ち", "ぬ": "に", "ぶ": "び", "む": "み", "る": "り" };
  var NAI = { "う": "わ", "く": "か", "ぐ": "が", "す": "さ", "つ": "た", "ぬ": "な", "ぶ": "ば", "む": "ま", "る": "ら" };
  var TE = {
    "う": ["って", "った"], "つ": ["って", "った"], "る": ["って", "った"],
    "む": ["んで", "んだ"], "ぶ": ["んで", "んだ"], "ぬ": ["んで", "んだ"],
    "く": ["いて", "いた"], "ぐ": ["いで", "いだ"], "す": ["して", "した"]
  };

  function conjugate(entry) {
    var e = shape(entry);
    if (!e || !isVerbEntry(e)) return null;
    var cacheKey = e.jp + "|" + e.reading + "|" + normalizeFr(e.fr);
    if (conjugationCache[cacheKey]) return conjugationCache[cacheKey];
    var jp = e.jp;
    var reading = e.reading || jp;
    var baseJp = jp;
    var baseReading = reading;
    var cls = "godan";
    var special = "";

    if (/する$/.test(jp)) {
      cls = "suru";
      baseJp = jp.slice(0, -2);
      baseReading = reading.slice(0, -2);
    } else if (/来る$/.test(jp) || /くる$/.test(jp)) {
      cls = "kuru";
      baseJp = jp.slice(0, -1);
      baseReading = "き";
      special = "kuru";
    } else if (jp === "行く" || reading === "いく") {
      cls = "iku";
      baseJp = jp.slice(0, -1);
      baseReading = reading.slice(0, -1);
      special = "iku";
    } else if (jp === "ある" || reading === "ある") {
      cls = "aru";
      baseJp = jp.slice(0, -1);
      baseReading = reading.slice(0, -1);
      special = "aru";
    } else if (jp === "いる" || reading === "いる") {
      cls = "iru";
      baseJp = jp.slice(0, -1);
      baseReading = reading.slice(0, -1);
      special = "iru";
    } else if (/る$/.test(jp)) {
      var before = jp.slice(-2, -1);
      var readingBefore = reading.slice(-2, -1);
      var row = VOWEL_ROW[readingBefore] || "";
      if (GODAN_RU.has(jp) || GODAN_RU.has(reading) || row === "a" || row === "u" || row === "o") {
        cls = "godan";
        baseJp = jp.slice(0, -1);
        baseReading = reading.slice(0, -1);
      } else {
        cls = "ichidan";
        baseJp = jp.slice(0, -1);
        baseReading = reading.slice(0, -1);
      }
    } else {
      cls = "godan";
      baseJp = jp.slice(0, -1);
      baseReading = reading.slice(0, -1);
    }

    var lastJp = jp.slice(-1);
    var lastReading = reading.slice(-1);
    var masuJp = "";
    var masuReading = "";
    var naiJp = "";
    var naiReading = "";
    var teJp = "";
    var teReading = "";
    var taJp = "";
    var taReading = "";

    if (cls === "suru") {
      masuJp = baseJp + "します"; masuReading = baseReading + "します";
      naiJp = baseJp + "しない"; naiReading = baseReading + "しない";
      teJp = baseJp + "して"; teReading = baseReading + "して";
      taJp = baseJp + "した"; taReading = baseReading + "した";
    } else if (cls === "kuru") {
      masuJp = baseJp + "ます"; masuReading = baseReading + "ます";
      naiJp = baseJp + "ない"; naiReading = "こない";
      teJp = baseJp + "て"; teReading = baseReading + "て";
      taJp = baseJp + "た"; taReading = baseReading + "た";
    } else if (cls === "iku") {
      masuJp = baseJp + "きます"; masuReading = baseReading + "きます";
      naiJp = baseJp + "かない"; naiReading = baseReading + "かない";
      teJp = baseJp + "って"; teReading = baseReading + "って";
      taJp = baseJp + "った"; taReading = baseReading + "った";
    } else if (cls === "aru") {
      masuJp = baseJp + "ります"; masuReading = baseReading + "ります";
      naiJp = "ない"; naiReading = "ない";
      teJp = baseJp + "って"; teReading = baseReading + "って";
      taJp = baseJp + "った"; taReading = baseReading + "った";
    } else if (cls === "iru") {
      masuJp = baseJp + "ます"; masuReading = baseReading + "ます";
      naiJp = baseJp + "ない"; naiReading = baseReading + "ない";
      teJp = baseJp + "て"; teReading = baseReading + "て";
      taJp = baseJp + "た"; taReading = baseReading + "た";
    } else if (cls === "ichidan") {
      masuJp = baseJp + "ます"; masuReading = baseReading + "ます";
      naiJp = baseJp + "ない"; naiReading = baseReading + "ない";
      teJp = baseJp + "て"; teReading = baseReading + "て";
      taJp = baseJp + "た"; taReading = baseReading + "た";
    } else {
      masuJp = baseJp + (MASU[lastJp] || lastKanaMap(MASU, lastReading)) + "ます";
      masuReading = baseReading + (MASU[lastReading] || lastKanaMap(MASU, lastJp)) + "ます";
      naiJp = baseJp + (NAI[lastJp] || lastKanaMap(NAI, lastReading)) + "ない";
      naiReading = baseReading + (NAI[lastReading] || lastKanaMap(NAI, lastJp)) + "ない";
      var te = TE[lastJp] || TE[lastReading] || ["て", "た"];
      teJp = baseJp + te[0]; teReading = baseReading + te[0];
      taJp = baseJp + te[1]; taReading = baseReading + te[1];
    }

    var present = make(masuJp, masuReading);
    var stemJp = present.jp.replace(/ます$/, "");
    var stemReading = present.reading.replace(/ます$/, "");
    var negative = make(stemJp + "ません", stemReading + "ません");
    var past = make(stemJp + "ました", stemReading + "ました");
    var pastNegative = make(stemJp + "ませんでした", stemReading + "ませんでした");

    var result = {
      class: cls,
      dictionary: make(jp, reading),
      present: present,
      negative: negative,
      past: past,
      pastNegative: pastNegative,
      question: make(present.jp + "か", present.reading + "か"),
      te: make(teJp, teReading),
      ta: make(taJp, taReading),
      nai: make(naiJp, naiReading)
    };
    conjugationCache[cacheKey] = result;
    return result;
  }

  function manualDictionary(jp) {
    var hit = MANUAL[jp];
    return hit ? { jp: hit.jp, reading: hit.reading, fr: hit.fr } : null;
  }

  function buildIndex() {
    if (cache) return cache;
    var index = {};
    function add(entry) {
      var dict = manualDictionary(entry.jp) || (isDictionary(entry.jp) ? entry : null);
      if (!dict || !isVerbEntry(dict)) return;
      var forms = conjugate(dict);
      if (!forms) return;
      [forms.present, forms.negative, forms.past, forms.pastNegative, forms.question].forEach(function (form) {
        if (form && form.jp && !index[form.jp]) index[form.jp] = dict;
      });
    }
    var Lex = root.Kotoba && root.Kotoba.Lexicon;
    if (Lex && Array.isArray(Lex.entries)) Lex.entries.forEach(add);
    (root.UNITS_DATA || []).forEach(function (unit) {
      (unit.words || []).forEach(function (word) {
        var e = shape(word);
        if (e) add(e);
      });
    });
    cache = index;
    return cache;
  }

  function findDictionary(entry) {
    var e = shape(entry);
    if (!e) return null;
    if (isDictionary(e.jp) && isVerbEntry(e)) return e;
    var manual = manualDictionary(e.jp);
    if (manual) return manual;
    var index = buildIndex();
    return index[e.jp] || null;
  }

  function prepare(entry) {
    if (!isVerbEntry(entry)) return entry;
    var dict = findDictionary(entry);
    if (!dict) return entry;
    var forms = conjugate(dict);
    if (!forms) return entry;
    var e = shape(entry);
    var cacheKey = e.jp + "|" + e.reading + "|" + normalizeFr(e.fr);
    if (preparedCache[cacheKey]) return Object.assign({}, entry, preparedCache[cacheKey]);
    var present = isPolite(e.jp) ? make(e.jp, e.reading) : forms.present;
    var meta = {
      jp: present.jp,
      ruby: present.ruby,
      reading: present.reading,
      romaji: present.romaji,
      dictionaryForm: forms.dictionary.jp,
      dictionaryReading: forms.dictionary.reading,
      dictionaryRomaji: forms.dictionary.romaji,
      politeForms: forms,
      verbClass: forms.class
    };
    preparedCache[cacheKey] = meta;
    return Object.assign({}, entry, meta);
  }

  function variants(entry) {
    if (isIAdjective(entry)) {
      var adj = shape(entry);
      var adjKey = "adj|" + adj.jp + "|" + adj.reading;
      if (variantsCache[adjKey]) return variantsCache[adjKey];
      var adjBase = adj.jp.slice(0, -1);
      var adjReading = adj.reading.slice(0, -1);
      var adjectives = [
        make(adj.jp, adj.reading),
        make(adjBase + "くない", adjReading + "くない"),
        make(adjBase + "かった", adjReading + "かった"),
        make(adjBase + "くなかった", adjReading + "くなかった"),
        make(adjBase + "くて", adjReading + "くて"),
        make(adjBase + "く", adjReading + "く")
      ];
      variantsCache[adjKey] = adjectives;
      return adjectives;
    }
    var dict = findDictionary(entry);
    if (!dict) return [];
    var key = "verb|" + dict.jp + "|" + dict.reading;
    if (variantsCache[key]) return variantsCache[key];
    var forms = conjugate(dict);
    if (!forms) return [];
    var seen = {};
    var out = [forms.dictionary, forms.present, forms.negative, forms.past, forms.pastNegative, forms.question, forms.te, forms.ta, forms.nai]
      .filter(function (form) {
        if (!form || !form.jp || seen[form.jp]) return false;
        seen[form.jp] = true;
        return true;
      });
    variantsCache[key] = out;
    return out;
  }

  var API = {
    isPolite: isPolite,
    isDictionary: isDictionary,
    isVerbEntry: isVerbEntry,
    conjugate: conjugate,
    findDictionary: findDictionary,
    prepare: prepare,
    variants: variants,
    kanaFromRuby: kanaFromRuby
  };

  if (root && root.Kotoba) root.Kotoba.Polite = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : globalThis);
