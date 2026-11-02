/* Kotoba — génération et correction des exercices de phrases.
   Module sans DOM : les exercices sont construits depuis les phrases de contexte
   déjà présentes dans le lexique, puis testés avec Node. */
(function (root, factory) {
  var P = (root && root.Kotoba && root.Kotoba.Parser) ||
    (typeof require === 'function' ? require('./parser.js') : null);
  var api = factory(P);
  if (root && root.Kotoba) root.Kotoba.Phrase = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (P) {
  'use strict';
  if (!P) throw new Error('Kotoba : analyseur introuvable pour les exercices de phrases.');

  var TYPES = ['cloze', 'order', 'dictation'];
  var PUNCT_RE = /^[\s　。、！？!?.,・…「」『』（）()［］\[\]{}～〜]+$/;
  var NOISE_RE = /[\s　。、！？!?.,・…「」『』（）()［］\[\]{}～〜—–\-]/g;

  function clean(value) {
    return P.stripAnnotations(String(value == null ? '' : value)).trim();
  }

  function hasKanji(value) {
    return P.hasKanji(String(value || ''));
  }

  function toHiragana(value) {
    return String(value || '').replace(/[ァ-ヶ]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0x60);
    });
  }

  function normalizeKana(value) {
    return toHiragana(clean(value)).replace(NOISE_RE, '');
  }

  function normalizeInput(value) {
    var text = String(value == null ? '' : value).trim();
    if (!text) return '';
    if (/[a-zA-Z]/.test(text)) text = P.romajiToKana(text);
    return normalizeKana(text);
  }

  function unique(list) {
    var out = [];
    list.forEach(function (value) {
      var normalized = normalizeKana(value);
      if (normalized && out.indexOf(normalized) < 0) out.push(normalized);
    });
    return out;
  }

  function contextOf(entry) {
    return clean(entry && entry.context);
  }

  function targetOf(entry) {
    var context = contextOf(entry);
    if (!context) return null;
    var candidates = [entry && entry.hl, entry && entry.jp, entry && entry.reading];
    for (var i = 0; i < candidates.length; i++) {
      var target = clean(candidates[i]);
      if (!target) continue;
      var index = context.indexOf(target);
      if (index >= 0) return { target: target, index: index };
    }
    return null;
  }

  function readingOf(target, entry) {
    if (!entry) return '';
    var jp = clean(entry.jp);
    if (target === jp && entry.reading) return clean(entry.reading);
    return '';
  }

  function isPunctuation(value) {
    return PUNCT_RE.test(String(value || ''));
  }

  function segmentWords(text) {
    var raw = String(text || '');
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      try {
        var segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
        return Array.from(segmenter.segment(raw), function (part) { return part.segment; });
      } catch (e) { /* moteur ancien */ }
    }
    return raw.split(/([\s　。、！？!?.,・…「」『』（）()［］\[\]{}～〜])/).filter(Boolean);
  }

  function tokenize(text) {
    var parts = segmentWords(clean(text));
    var out = [];
    var prefix = '';
    parts.forEach(function (part) {
      if (!part || !part.trim()) return;
      if (isPunctuation(part)) {
        if (out.length) out[out.length - 1] += part;
        else prefix += part;
        return;
      }
      out.push(prefix + part);
      prefix = '';
    });
    if (prefix) {
      if (out.length) out[out.length - 1] += prefix;
      else out.push(prefix);
    }
    return out.filter(function (part) { return !!part.trim(); });
  }

  function shuffle(items) {
    var list = items.slice();
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    return list;
  }

  function baseExercise(entry, target, type) {
    var context = contextOf(entry);
    return {
      type: type,
      entryId: entry && entry.id,
      context: context,
      contextFr: clean(entry && entry.contextFr),
      target: target,
      audioText: context
    };
  }

  function makeCloze(entry) {
    var hit = targetOf(entry);
    if (!hit) return null;
    var context = contextOf(entry);
    var target = hit.target;
    var reading = readingOf(target, entry);
    // Un kanji infléchi sans lecture connue ne peut pas être saisi au clavier.
    if (hasKanji(target) && !reading) return null;
    var accepted = unique([target, reading]);
    if (!hasKanji(target)) accepted = unique(accepted.concat([P.kanaToRomaji(target)]));
    if (!accepted.length) return null;
    var exercise = baseExercise(entry, target, 'cloze');
    exercise.before = context.slice(0, hit.index);
    exercise.after = context.slice(hit.index + target.length);
    exercise.expected = reading || target;
    exercise.expectedRaw = target;
    exercise.reading = reading;
    exercise.accepted = accepted;
    return exercise;
  }

  function makeOrder(entry, type) {
    var hit = targetOf(entry);
    if (!hit) return null;
    var context = contextOf(entry);
    var tokens = tokenize(context);
    if (tokens.length < 3 || tokens.length > 14) return null;
    if (new Set(tokens).size < 2) return null;
    var tokenList = tokens.map(function (text, id) { return { id: id, text: text }; });
    var expectedIds = tokenList.map(function (token) { return token.id; });
    var exercise = baseExercise(entry, hit.target, type || 'order');
    exercise.tokens = tokenList;
    exercise.shuffled = shuffle(tokenList);
    exercise.expectedIds = expectedIds;
    return exercise;
  }

  function build(entry, type) {
    if (!entry || !contextOf(entry)) return null;
    if (type === 'cloze') return makeCloze(entry);
    if (type === 'order') return makeOrder(entry, 'order');
    if (type === 'dictation') return makeOrder(entry, 'dictation');
    return null;
  }

  function bestType(entry, preferred) {
    var order = [preferred].concat(TYPES).filter(function (type, index, list) {
      return type && list.indexOf(type) === index;
    });
    for (var i = 0; i < order.length; i++) {
      var exercise = build(entry, order[i]);
      if (exercise) return exercise;
    }
    return null;
  }

  function checkCloze(exercise, answer) {
    var normalized = normalizeInput(answer);
    var accepted = exercise && Array.isArray(exercise.accepted) ? exercise.accepted : [];
    return {
      good: !!normalized && accepted.indexOf(normalized) >= 0,
      normalized: normalized,
      expected: exercise && (exercise.reading || exercise.target) || ''
    };
  }

  function checkOrder(exercise, selectedIds) {
    var expected = exercise && Array.isArray(exercise.expectedIds) ? exercise.expectedIds : [];
    var received = Array.isArray(selectedIds) ? selectedIds.map(Number) : [];
    var good = expected.length > 0 && received.length === expected.length &&
      expected.every(function (id, index) { return id === received[index]; });
    return { good: good, expected: expected.slice(), received: received };
  }

  return {
    TYPES: TYPES,
    build: build,
    bestType: bestType,
    contextOf: contextOf,
    targetOf: targetOf,
    tokenize: tokenize,
    normalizeInput: normalizeInput,
    checkCloze: checkCloze,
    checkOrder: checkOrder
  };
});
