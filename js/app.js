/* Kotoba — interface, sessions et import.
   Dépend de data.js, js/lexicon.js, js/srs.js et js/parser.js. */
(function () {
'use strict';

if (!window.Kotoba || !window.Kotoba.Parser || !window.Kotoba.Store || !window.Kotoba.Phrase) {
  document.body.innerHTML = '<p style="padding:2rem;font-family:system-ui">Kotoba n\'a pas pu charger ses modules. Recharge la page.</p>';
  return;
}

const P = window.Kotoba.Parser;
const S = window.Kotoba.Store;
const PH = window.Kotoba.Phrase;
const SY = window.Kotoba.Sync || null;
const CONV = window.Kotoba.Conversation || null;
const IMM = window.Kotoba.Immersion || null;
const MISTAKES = window.Kotoba.Mistakes || null;
const GRAMMAR = window.Kotoba.GrammarTrack || null;
const $ = function (sel, root) { return (root || document).querySelector(sel); };
const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

const state = S.load();
let entries = [];
let glossSignatureValue = '';
let view = 'learn';
let session = null;
let conversationState = null;
let immersionState = null;
const grammarUi = { level: 'B1', openId: null, session: null };
const ui = { filter: 'all', storyLevel: 'all', search: '', importText: '', preview: null, lastFocus: null, detailId: null, validationTimer: 0 };
let toastTimer = 0;
let syncBusy = false;
let syncTimer = 0;
let voices = [];
let tessPromise = null;
let speechPrimed = false;
let tooltipTarget = null;
let glossIndex = null;
let glossKeys = null;
let glossBuckets = null;
let glossRoles = null;
let glossReadings = null;
const MAX_IMPORT_CHARS = 2 * 1024 * 1024;

const VIEWS = { learn: '#view-learn', review: '#view-review', conversation: '#view-conversation', reading: '#view-reading', library: '#view-library', import: '#view-import', grammar: '#view-grammar' };
const FROM_HASH = { apprendre: 'learn', reviser: 'review', parler: 'conversation', histoires: 'reading', mots: 'library', importer: 'import', grammaire: 'grammar' };

/* ---------- Utilitaires ---------- */
function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
  });
}
function attr(value) { return esc(value); }
function frHtml(fr) {
  const s = String(fr || '');
  const m = s.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (m) return esc(m[1]) + '<span class="fr-note">(' + esc(m[2]) + ')</span>';
  return esc(s);
}
function annotatedRubyOf(e) {
  const jp = e && e.jp ? P.stripAnnotations(e.jp) : '';
  if (!jp) return '';
  const ruby = String(e.ruby || '');
  if (ruby.indexOf('[') >= 0 && P.stripAnnotations(ruby) === jp) return ruby;
  const reading = kanaFromRuby(e.reading || e.ruby || '');
  if (reading && reading !== jp && !P.hasKanji(reading)) {
    const annotated = P.annotate(jp, reading);
    if (annotated && annotated.indexOf('[') >= 0) return annotated;
  }
  return ruby || jp;
}
function rubyHtml(annotated, showFurigana) {
  const s = String(annotated || '');
  if (!showFurigana) return esc(P.stripAnnotations(s));
  if (window.Kotoba.Reading && window.Kotoba.Reading.romajiRubyHtml) {
    return window.Kotoba.Reading.romajiRubyHtml(s);
  }
  return esc(P.stripAnnotations(s));
}
function kanaFromRuby(value) {
  const raw = String(value || '');
  if (!raw) return '';
  return raw.indexOf('[') >= 0
    ? raw.replace(/([^\s\[\]]+?)\[([^\]]+)\]/g, function (match, base, reading) {
      const prefix = (String(base).match(/^[\u3040-\u30ff]+/) || [''])[0];
      return prefix + reading;
    })
    : P.stripAnnotations(raw);
}
function wordRubyHtml(e) {
  const jp = e && e.jp ? P.stripAnnotations(e.jp) : '';
  if (!jp) return '';
  if (!state.settings.furigana) return esc(jp);
  if (!P.hasKanji(jp) && window.Kotoba.Reading && window.Kotoba.Reading.kanaReading) {
    const kana = window.Kotoba.Reading.kanaReading(e);
    if (kana) return kana;
  }
  return rubyHtml(annotatedRubyOf(e), true);
}
const REGISTER_NOTES = {
  'さようなら': 'Formel : さようなら · Familier : じゃあね.',
  'じゃあね': 'Familier : じゃあね · Formel : さようなら.'
};
const REGISTER_HINTS = {
  'さようなら': 'Version formelle',
  'じゃあね': 'Version familière'
};
function jpKeyOf(entry) {
  if (!entry) return '';
  return window.Kotoba.Parser && window.Kotoba.Parser.stripAnnotations
    ? window.Kotoba.Parser.stripAnnotations(entry.jp || '')
    : String(entry.jp || '');
}
function nuanceOf(entry) {
  if (!entry) return '';
  if (entry.nuance) return String(entry.nuance);
  return REGISTER_NOTES[jpKeyOf(entry)] || '';
}
function registerHintOf(entry) {
  if (!entry) return '';
  return REGISTER_HINTS[jpKeyOf(entry)] || '';
}
function alternativesHtml(entry) {
  const alts = entry && Array.isArray(entry.alternatives) ? entry.alternatives : [];
  if (!alts.length) return '';
  const items = alts.map(function (alt) {
    const jp = alt && (alt.jp || alt.reading) || '';
    const romaji = alt && alt.romaji || '';
    const usage = alt && alt.usage ? String(alt.usage) : '';
    const example = alt && alt.example ? String(alt.example) : '';
    const exampleFr = alt && alt.exampleFr ? String(alt.exampleFr) : '';
    const exampleRomaji = alt && alt.exampleRomaji ? String(alt.exampleRomaji) : '';
    return '<div class="answer-also-item">' +
      '<p class="answer-also-title">Autre formulation possible : <b lang="ja">' + esc(jp) + '</b>' + (romaji ? ' · ' + esc(romaji) : '') + '</p>' +
      (usage ? '<p class="answer-also-usage">' + esc(usage) + '</p>' : '') +
      (example ? '<p class="answer-also-example sentence-tip" lang="ja"' + translationTipAttrs(exampleFr, example) + '>' + esc(example) + '</p>' : '') +
      (exampleFr ? '<p class="answer-also-example-fr">' + esc(exampleFr) + '</p>' : '') +
      (exampleRomaji ? '<p class="answer-also-example-romaji">' + esc(exampleRomaji) + '</p>' : '') +
    '</div>';
  }).join('');
  return '<div class="answer-also" data-testid="answer-also">' + items + '</div>';
}
function translationTipAttrs(translation, japanese) {
  const text = String(translation || '').trim();
  if (!text) return '';
  const jp = String(japanese || '').trim();
  return ' data-tooltip="' + attr(text) + '" tabindex="0"' +
    (jp ? ' data-tooltip-jp="' + attr(P.stripAnnotations(jp)) + '"' : '');
}

const GLOSS_EXTRA = {
  'は': 'thème', 'が': 'sujet', 'を': 'objet', 'に': 'direction / lieu / heure',
  'で': 'lieu / moyen', 'へ': 'vers', 'と': 'et / avec', 'も': 'aussi',
  'の': 'de / lien', 'か': 'question', 'ね': 'n’est-ce pas ?', 'よ': 'insistance',
  'さん': 'suffixe poli (M./Mme)', 'ちゃん': 'suffixe affectueux', 'くん': 'suffixe pour un garçon',
  'から': 'depuis / parce que', 'まで': 'jusqu’à', 'より': 'que', 'や': 'et (liste)',
  'など': 'etc.', 'だけ': 'seulement', 'でも': 'même / mais', 'そして': 'et puis',
  'それから': 'ensuite', 'しかし': 'mais', 'だから': 'donc',
  'です': 'être (poli)', 'でした': 'être (passé poli)', 'ます': 'marqueur poli',
  'ました': 'passé poli', 'ません': 'négation polie', 'ましょう': 'proposons',
  'たい': 'vouloir', 'て': 'forme en -te', 'た': 'passé', 'だ': 'être (familier)',
  'ない': 'négation', 'ん': 'explication', 'ある': 'il y a', 'いる': 'être / il y a',
  'これ': 'ceci', 'それ': 'cela', 'あれ': 'cela (là-bas)', 'この': 'ce / cette',
  'その': 'ce / cette', 'あの': 'ce / cette (là-bas)', 'ここ': 'ici', 'そこ': 'là',
  'あそこ': 'là-bas', 'どこ': 'où', 'いつ': 'quand', 'だれ': 'qui', 'なに': 'quoi',
  'なん': 'quoi', 'どう': 'comment', 'なぜ': 'pourquoi', 'いくら': 'combien',
  'いくつ': 'combien'
};

const GLOSS_CONTENT = {
  'しっかり': 'fermement',
  '結ぶ': 'nouer'
};

// Mots des phrases d'exemple qui ne figurent pas dans les 859 fiches :
// forme, lecture kana, traduction. Les verbes reçoivent aussi leurs formes.
const GLOSS_LEARN = {
  'っ': ['っ', 'petit tsu (gémination)'],
  '々': ['々', 'répétition du kanji'],
  'な': ['な', 'liaison adjectivale'],
  'し': ['し', 'radical de する'],
  'お': ['お', 'préfixe poli'],
  'ご': ['ご', 'préfixe poli'],
  'すみません': ['すみません', 'excusez-moi'],
  'ありません': ['ありません', 'il n’y a pas (poli)'],
  'ございます': ['ございます', 'être (très poli)'],
  'だろう': ['だろう', 'probablement'],
  'でしょう': ['でしょう', 'probablement (poli)'],
  'だった': ['だった', 'était (familier)'],
  'てる': ['てる', 'forme contractée de ている'],
  'けど': ['けど', 'mais'],
  'たら': ['たら', 'si / quand (conditionnel)'],
  'うち': ['うち', 'parmi / chez soi'],
  'なく': ['なく', 'sans'],
  'ほど': ['ほど', 'à tel point'],
  'ついに': ['ついに', 'enfin'],
  'なあ': ['なあ', 'particule d’émotion'],
  '我々': ['われわれ', 'nous'],
  '事実': ['じじつ', 'fait'],
  '州': ['しゅう', 'État / région'],
  '田': ['た', 'rizière (ou nom)'],
  '杯': ['はい', 'verre / coupe (compteur)'],
  'お寺': ['おてら', 'temple'],
  'ラーメン': ['ラーメン', 'ramen'],
  'ピアニスト': ['ピアニスト', 'pianiste'],
  'ジム': ['ジム', 'salle de sport'],
  'ホール': ['ホール', 'salle'],
  'ジョーンズ': ['ジョーンズ', 'Jones'],
  'ジョンソン': ['ジョンソン', 'Johnson'],
  'ハドソン': ['ハドソン', 'Hudson'],
  'トム': ['トム', 'Tom'],
  'アン': ['アン', 'Anne'],
  'テムズ': ['テムズ', 'Tamise'],
  'カナダ': ['カナダ', 'Canada'],
  'アメリカ': ['アメリカ', 'États-Unis'],
  'ニューヨーク': ['ニューヨーク', 'New York'],
  '台湾': ['たいわん', 'Taïwan'],
  'インド': ['インド', 'Inde'],
  'スキー': ['スキー', 'ski'],
  'ＶＩＳＡ': ['ビザ', 'Visa (carte)'],
  'Ａ': ['エー', 'A'],
  'Ｂ': ['ビー', 'B'],
  'チラシ': ['チラシ', 'prospectus'],
  'ブタ': ['ブタ', 'cochon'],
  'ばら': ['ばら', 'rose'],
  'ひも': ['ひも', 'corde / lacet'],
  '単語': ['たんご', 'mot / vocabulaire'],
  '技術': ['ぎじゅつ', 'technique'],
  '歴史': ['れきし', 'histoire'],
  '給料': ['きゅうりょう', 'salaire'],
  '要求': ['ようきゅう', 'exigence'],
  '論': ['ろん', 'discussion / thèse'],
  '運動': ['うんどう', 'sport'],
  '野球': ['やきゅう', 'base-ball'],
  '毛': ['け', 'poil / cheveu'],
  'いじめ': ['いじめ', 'harcèlement'],
  '丘': ['おか', 'colline'],
  '陽光': ['ようこう', 'lumière du soleil'],
  '邪魔': ['じゃま', 'gêne'],
  '賞': ['しょう', 'prix / récompense'],
  '栄誉': ['えいよ', 'honneur'],
  '道路': ['どうろ', 'route'],
  '相当': ['そうとう', 'correspondre à'],
  '足手まとい': ['あしでまとい', 'gêneur'],
  '信号': ['しんごう', 'feu de signalisation'],
  'ほうれん草': ['ほうれんそう', 'épinard'],
  '後悔': ['こうかい', 'regret'],
  '鉛筆': ['えんぴつ', 'crayon'],
  '周年': ['しゅうねん', 'anniversaire (compteur)'],
  '夫婦': ['ふうふ', 'couple marié'],
  '収入': ['しゅうにゅう', 'revenu'],
  '刻々': ['こっこく', 'd’instant en instant'],
  '地域': ['ちいき', 'région'],
  '改善': ['かいぜん', 'amélioration'],
  '提供': ['ていきょう', 'offrir / fournir'],
  '主な': ['おもな', 'principal'],
  '真': ['ま', 'vrai'],
  '事': ['こと', 'chose / fait'],
  '語': ['ご', 'langue'],
  '列': ['れつ', 'rangée'],
  '型': ['かた', 'modèle / forme'],
  '濃い': ['こい', 'fort (goût)'],
  '良い': ['よい', 'bon'],
  '速い': ['はやい', 'rapide'],
  '高い': ['たかい', 'cher / élevé'],
  '重い': ['おもい', 'lourd'],
  '欲しい': ['ほしい', 'vouloir'],
  '小さな': ['ちいさな', 'petit'],
  'つよい': ['つよい', 'fort'],
  '昨夜': ['さくや', 'hier soir'],
  '下さい': ['ください', 's’il vous plaît'],
  '調子': ['ちょうし', 'état / rythme'],
  '見る': ['みる', 'voir'],
  '出る': ['でる', 'sortir'],
  '眠る': ['ねむる', 'dormir'],
  '泣く': ['なく', 'pleurer'],
  '吹く': ['ふく', 'souffler'],
  '似合う': ['にあう', 'convenir / aller bien'],
  'くれる': ['くれる', 'donner (à moi)'],
  'しれる': ['しれる', 'pouvoir savoir'],
  '空く': ['あく', 'se vider / se libérer'],
  '出かける': ['でかける', 'sortir'],
  '尋ねる': ['たずねる', 'demander'],
  '乾く': ['かわく', 'sécher'],
  '迎える': ['むかえる', 'accueillir / aller chercher'],
  '巻く': ['まく', 'enrouler'],
  'ひく': ['ひく', 'attraper (une maladie)'],
  'いらっしゃる': ['いらっしゃる', 'être / aller (honorifique)'],
  '謝る': ['あやまる', 's’excuser'],
  'させる': ['させる', 'faire faire'],
  '止める': ['とめる', 'arrêter'],
  'できる': ['できる', 'pouvoir'],
  '折る': ['おる', 'casser'],
  '亡くなる': ['なくなる', 'mourir'],
  '流れる': ['ながれる', 'couler'],
  '見える': ['みえる', 'être visible'],
  '足りる': ['たりる', 'suffire'],
  '掛ける': ['かける', 'appeler / suspendre'],
  '示す': ['しめす', 'montrer'],
  '喚く': ['わめく', 'crier'],
  '訳す': ['やくす', 'traduire'],
  '会える': ['あえる', 'pouvoir rencontrer'],
  '成り立つ': ['なりたつ', 'se composer de'],
  'くる': ['くる', 'venir'],
  '閉じる': ['とじる', 'fermer'],
  '脱ぐ': ['ぬぐ', 'enlever (vêtement)'],
  'いう': ['いう', 'dire'],
  'ノック': ['ノック', 'coup frappé (à la porte)'],
  'しれません': ['しれません', 'peut-être'],
  'かもしれません': ['かもしれません', 'peut-être'],
  'いらっしゃいます': ['いらっしゃいます', 'être / aller (honorifique)'],
  '数える': ['かぞえる', 'compter'],
  '会う': ['あう', 'rencontrer'],
  '健康': ['けんこう', 'santé'],
  '勇気': ['ゆうき', 'courage'],
  '周り': ['まわり', 'entourage / alentours'],
  '欠席': ['けっせき', 'absence'],
  '満足': ['まんぞく', 'satisfaction'],
  '予報': ['よほう', 'prévision'],
  '富士山': ['ふじさん', 'mont Fuji'],
  '財産': ['ざいさん', 'fortune'],
  '福引き': ['ふくびき', 'tombola'],
  'チェス': ['チェス', 'échecs'],
  '底': ['そこ', 'fond'],
  'ガム': ['ガム', 'chewing-gum'],
  'ＩＢＭ': ['アイビーエム', 'IBM'],
  'テニス': ['テニス', 'tennis'],
  'ホームシック': ['ホームシック', 'mal du pays'],
  '発明': ['はつめい', 'invention'],
  '推理': ['すいり', 'déduction'],
  '我': ['われ', 'soi-même'],
  '同社': ['どうしゃ', 'cette société'],
  '食品': ['しょくひん', 'aliment'],
  '生産': ['せいさん', 'production'],
  '規則': ['きそく', 'règle'],
  '当てはまる': ['あてはまる', 's’appliquer'],
  '無駄': ['むだ', 'inutile'],
  'すぎる': ['すぎる', 'trop'],
  '埋める': ['うめる', 'remplir'],
  '責任': ['せきにん', 'responsabilité'],
  'べき': ['べき', 'devoir'],
  '払う': ['はらう', 'payer'],
  '変える': ['かえる', 'changer'],
  'わけ': ['わけ', 'raison'],
  '向け': ['むけ', 'destiné à'],
  'たち': ['たち', 'suffixe pluriel'],
  'しまった': ['しまった', 'zut'],
  'きた': ['きた', 'est venu'],
  'もむ': ['もむ', 'se tourmenter'],
  '欲しがる': ['ほしがる', 'désirer'],
  'かける': ['かける', 'mettre / accrocher'],
  '上る': ['のぼる', 'monter'],
  '減る': ['へる', 'diminuer'],
  '別れ': ['わかれ', 'séparation'],
  '感動': ['かんどう', 'émotion'],
  '平らげる': ['たいらげる', 'finir (un plat)'],
  '飽きる': ['あきる', 'se lasser'],
  'すっぱい': ['すっぱい', 'acide'],
  'オランダ': ['オランダ', 'Pays-Bas'],
  'わき腹': ['わきばら', 'flanc'],
  'ＣＤ': ['シーディー', 'CD'],
  '棚': ['たな', 'étagère'],
  'ジョン': ['ジョン', 'John'],
  'とぼける': ['とぼける', 'faire l’innocent'],
  '掃除': ['そうじ', 'nettoyage'],
  'チクチク': ['チクチク', 'piquant'],
  '種類': ['しゅるい', 'sorte'],
  'ボタン': ['ボタン', 'bouton'],
  'アルジェリア': ['アルジェリア', 'Algérie'],
  'パキスタン': ['パキスタン', 'Pakistan'],
  '神経質': ['しんけいしつ', 'nerveux'],
  '極上': ['ごくじょう', 'excellent'],
  '冒す': ['おかす', 'risquer'],
  'コンピューター': ['コンピューター', 'ordinateur'],
  'ー': ['ー', 'allongement de voyelle'],
  '両国': ['りょうこく', 'les deux pays'],
  '恥ずかしい': ['はずかしい', 'honteux'],
  'ちらりと': ['ちらりと', 'furtivement'],
  '煙草': ['たばこ', 'cigarette'],
  '文字どおり': ['もじどおり', 'littéralement'],
  '唯一': ['ゆいいつ', 'unique'],
  'セルフサービス': ['セルフサービス', 'self-service'],
  '百科事典': ['ひゃっかじてん', 'encyclopédie'],
  '検索': ['けんさく', 'recherche'],
  'いく': ['いく', 'aller'],
  '迷子': ['まいご', 'enfant perdu'],
  '甘さ': ['あまさ', 'douceur'],
  'チョコレート': ['チョコレート', 'chocolat'],
  '砕く': ['くだく', 'casser'],
  '自己紹介': ['じこしょうかい', 'présentation'],
  'バスルーム': ['バスルーム', 'salle de bain'],
  '突き当たり': ['つきあたり', 'bout (du couloir)'],
  '率いる': ['ひきいる', 'mener'],
  '幼児': ['ようじ', 'jeune enfant'],
  'かわいい': ['かわいい', 'mignon'],
  '不作法': ['ぶさほう', 'impoli'],
  '詳しい': ['くわしい', 'détaillé'],
  'タイプライター': ['タイプライター', 'machine à écrire'],
  '面白い': ['おもしろい', 'intéressant'],
  'それぞれ': ['それぞれ', 'chacun'],
  '要点': ['ようてん', 'point essentiel'],
  '腹': ['はら', 'ventre'],
  '詰める': ['つめる', 'boucher'],
  '科学者': ['かがくしゃ', 'scientifique'],
  '注射器': ['ちゅうしゃき', 'seringue'],
  'トラック': ['トラック', 'camion'],
  '教会': ['きょうかい', 'église'],
  '経つ': ['たつ', 'passer (temps)'],
  'ごめん': ['ごめん', 'pardon'],
  'お釣り': ['おつり', 'monnaie'],
  '無い': ['ない', 'il n’y a pas'],
  '平ら': ['たいら', 'plat'],
  '解決策': ['かいけつさく', 'solution'],
  'メートル': ['メートル', 'mètre'],
  '新記録': ['しんきろく', 'nouveau record'],
  '信頼': ['しんらい', 'confiance'],
  '姿': ['すがた', 'silhouette'],
  'ベルト': ['ベルト', 'ceinture'],
  '腰': ['こし', 'hanches'],
  'きつい': ['きつい', 'serré'],
  'かぶる': ['かぶる', 'mettre (chapeau)'],
  'ポケット': ['ポケット', 'poche'],
  '初心者': ['しょしんしゃ', 'débutant'],
  '緊張': ['きんちょう', 'tension'],
  '設置': ['せっち', 'installation'],
  '挑戦': ['ちょうせん', 'défi'],
  'パートナー': ['パートナー', 'partenaire'],
  '交代': ['こうたい', 'relais'],
  '握る': ['にぎる', 'saisir'],
  'クラック': ['クラック', 'fissure'],
  '固定': ['こてい', 'fixation'],
  'バランス': ['バランス', 'équilibre'],
  '初挑戦': ['はつちょうせん', 'premier essai'],
  'テンション': ['テンション', 'tension'],
  'みる': ['みる', 'essayer de / regarder'],
  'それら': ['それら', 'ceux-là'],
  'つもり': ['つもり', 'intention'],
  '変え': ['かえ', 'changer (radical)'],
  '暗記': ['あんき', 'mémorisation'],
  'について': ['について', 'à propos de'],
  'ような': ['ような', 'comme'],
  'おきる': ['おきる', 'arriver / se lever'],
  '結局': ['けっきょく', 'finalement'],
  '結ぶ': ['むすぶ', 'nouer'],
  '僕ら': ['ぼくら', 'nous (fam.)'],
  'かつて': ['かつて', 'jadis'],
  'すっかり': ['すっかり', 'complètement'],
  'しばらく': ['しばらく', 'un moment'],
  'やる': ['やる', 'faire / donner'],
  'だったら': ['だったら', 'si (conditionnel)'],
  'これら': ['これら', 'ceux-ci'],
  '分かれる': ['わかれる', 'se diviser'],
  '恥ずかし': ['はずかし', 'honteux (radical)'],
  '岩': ['いわ', 'rocher'],
  '焼く': ['やく', 'griller'],
  'きます': ['きます', 'venir (poli)'],
  'だけど': ['だけど', 'mais']
};

function normalizeGlossKey(value) {
  return P.stripAnnotations(String(value || ''))
    .replace(/[\s　]/g, '')
    .replace(/[。、！？!?.,・…「」『』（）()\[\]{}～〜]/g, '');
}

function addGloss(index, key, fr, role) {
  const k = normalizeGlossKey(key);
  if (!k || !fr) return;
  if (role) {
    if (!(k in index)) { index[k] = fr; glossRoles[k] = true; }
    return;
  }
  if (!(k in index)) index[k] = fr;
}

// Lecture d'une forme conjuguée : on garde la lecture du radical et on
// remplace la fin du mot, pour que 食べましょう obtienne たべましょう.
function formReading(base, reading, form) {
  const b = normalizeGlossKey(base);
  const r = String(reading || '').trim();
  if (!b || !r || P.hasKanji(r) || b.length < 2) return '';
  if (b === '来る') {
    return {
      '来': 'き', '来ます': 'きます', '来た': 'きた', '来て': 'きて', '来れば': 'くれば',
      '来ない': 'こない', '来なかった': 'こなかった', '来なく': 'こなく', '来られ': 'こられ',
      '来られない': 'こられない', '来られる': 'こられる', '来よう': 'こよう',
      '来ましょう': 'きましょう', '来たい': 'きたい'
    }[form] || '';
  }
  // Prefixe commun (les kanji) : on garde sa lecture et on remplace la fin.
  let shared = 0;
  while (shared < b.length - 1 && shared < form.length && b.charAt(shared) === form.charAt(shared)) shared++;
  if (shared < 1) return '';
  const baseTail = b.slice(shared);
  const readPrefix = r.slice(0, Math.max(0, r.length - baseTail.length));
  return readPrefix + form.slice(shared);
}

// Table de conjugaison godan : chaque rang (a/i/e/o) et les formes en -te/-ta.
const GODAN_ROWS = {
  'う': { a: 'わ', i: 'い', e: 'え', o: 'お', te: 'って', ta: 'った' },
  'く': { a: 'か', i: 'き', e: 'け', o: 'こ', te: 'いて', ta: 'いた' },
  'ぐ': { a: 'が', i: 'ぎ', e: 'げ', o: 'ご', te: 'いで', ta: 'いだ' },
  'す': { a: 'さ', i: 'し', e: 'せ', o: 'そ', te: 'して', ta: 'した' },
  'つ': { a: 'た', i: 'ち', e: 'て', o: 'と', te: 'って', ta: 'った' },
  'ぬ': { a: 'な', i: 'に', e: 'ね', o: 'の', te: 'んで', ta: 'んだ' },
  'ぶ': { a: 'ば', i: 'び', e: 'べ', o: 'ぼ', te: 'んで', ta: 'んだ' },
  'む': { a: 'ま', i: 'み', e: 'め', o: 'も', te: 'んで', ta: 'んだ' },
  'る': { a: 'ら', i: 'り', e: 'れ', o: 'ろ', te: 'って', ta: 'った' }
};

const ICHIDAN_ENDS = [
  'ます', 'ました', 'ません', 'ませんでした', 'ましょう', 'たい', 'たかった', 'たくない',
  'ない', 'なかった', 'なくて', 'なければ', 'て', 'た', 'れば', 'たら', 'られる',
  'られます', 'させる', 'させます', 'よう', 'ろ', 'ながら', 'なさい', 'そう',
  'ている', 'ていません', 'てください', 'たくなかった', 'なかったら', 'てる', 'てた'
];

function addVerbGlosses(add, base, fr, addReading, reading) {
  const b = normalizeGlossKey(base);
  if (!b) return;
  function reg(form) {
    if (!form || form.length < 2) return;
    add(form, fr);
    if (!addReading) return;
    const kana = formReading(b, reading, form);
    if (kana) addReading(form, kana);
  }
  if (b === '来る') {
    ['来', '来ます', '来た', '来て', '来れば', '来ない', '来なかった', '来なく', '来られ', '来られない',
      '来られる', '来よう', '来ましょう', '来たい'].forEach(reg);
    return;
  }
  if (b === 'する' || b.slice(-2) === 'する') {
    const prefix = b === 'する' ? '' : b.slice(0, -2);
    ['し', 'します', 'した', 'して', 'しない', 'しなかった', 'しなくて', 'しなければ', 'しよう', 'すれば',
      'しましょう', 'したい', 'したら', 'できる', 'できます', 'しなさい', 'されて', 'させる', 'させます'].forEach(function (x) { reg(prefix + x); });
    return;
  }
  const stem = b.slice(0, -1);
  const row = GODAN_ROWS[b.slice(-1)];
  if (row) {
    const a = stem + row.a, i = stem + row.i, e = stem + row.e, o = stem + row.o;
    [a + 'ない', a + 'なかった', a + 'なくて', a + 'なければ', a + 'れる', a + 'れます', a + 'せる', a + 'せます', a + 'ないで',
      i + 'ます', i + 'ました', i + 'ません', i + 'ませんでした', i + 'ましょう', i + 'たい', i + 'たく', i + 'たかった', i + 'たくない',
      i + 'ながら', i + 'なさい', i + 'そう',
      e + 'ば', e + 'る', e + 'ます', e + 'ません', e + 'ない',
      o + 'う',
      stem + row.te, stem + row.ta, stem + row.te + 'いる', stem + row.te + 'る', stem + row.te + 'ください', stem + row.ta + 'ら'
    ].forEach(reg);
  }
  if (b.slice(-1) === 'る') {
    ICHIDAN_ENDS.forEach(function (end) { reg(stem + end); });
  }
  if (b === '行く') {
    ['行って', '行った', '行ったら', '行けば', '行ける', '行けない', '行こう', '行きましょう'].forEach(reg);
  }
}

function addAdjectiveGlosses(add, base, fr, addReading, reading) {
  const b = normalizeGlossKey(base);
  if (!b || b.slice(-1) !== 'い') return;
  function reg(form) {
    add(form, fr);
    if (!addReading) return;
    const kana = formReading(b, reading, form);
    if (kana) addReading(form, kana);
  }
  if (b === 'いい') {
    ['よく', 'よかった', 'よくない', 'よくなかった'].forEach(reg);
    return;
  }
  const stem = b.slice(0, -1);
  ['く', 'かった', 'くない', 'くなかった', 'ければ', 'そう', 'さ'].forEach(function (end) { reg(stem + end); });
  // Radical nu : 面白 + そう, 高 + すぎる.
  if (P.hasKanji(stem)) reg(stem);
}

function glossSignature() {
  const Lex = window.Kotoba.Lexicon;
  const lexCount = Lex && Lex.entries ? Lex.entries.length : 0;
  return entries.length + '|' + lexCount;
}

function buildGlossIndex() {
  // L'index est construit à la première bulle « mot à mot », parfois avant que
  // la collection et le lexique soient chargés : on le reconstruit si leur
  // contenu a changé (chargement initial, import, édition d'un mot).
  const signature = glossSignature();
  if (glossIndex && glossSignatureValue === signature) return;
  glossSignatureValue = signature;
  const index = Object.create(null);
  glossRoles = Object.create(null);
  glossReadings = Object.create(null);
  function add(key, fr, role) { addGloss(index, key, fr, role); }
  function addReading(key, reading) {
    const k = normalizeGlossKey(key);
    const r = P.stripAnnotations(String(reading || ''));
    if (!k || !r || P.hasKanji(r) || (k in glossReadings)) return;
    glossReadings[k] = r;
  }
  if (IMM && IMM.glossary) {
    Object.keys(IMM.glossary).forEach(function (key) {
      const item = IMM.glossary[key] || {};
      add(key, item.fr);
      addReading(key, item.reading);
    });
  }
  // Les cartes de vocabulaire affichent la forme polie : on enregistre aussi
  // la forme du dictionnaire, sinon 知る, 思う ou 入る restent inconnus.
  function addEntryGloss(e) {
    if (!e || !e.jp || !e.fr) return;
    add(e.jp, e.fr);
    addReading(e.jp, e.reading);
    addVerbGlosses(add, e.jp, e.fr, addReading, e.reading);
    addAdjectiveGlosses(add, e.jp, e.fr, addReading, e.reading);
    const base = e.dictionaryForm && e.dictionaryForm !== e.jp ? e.dictionaryForm : '';
    if (!base) return;
    const baseReading = e.dictionaryReading || '';
    add(base, e.fr);
    addReading(base, baseReading);
    addVerbGlosses(add, base, e.fr, addReading, baseReading);
    addAdjectiveGlosses(add, base, e.fr, addReading, baseReading);
  }
  entries.forEach(addEntryGloss);
  const Lex = window.Kotoba.Lexicon;
  if (Lex && Lex.entries) Lex.entries.forEach(addEntryGloss);
  if (CONV && CONV.glossary) {
    Object.keys(CONV.glossary).forEach(function (key) {
      const item = CONV.glossary[key] || {};
      add(key, item.fr);
      addReading(key, item.reading);
    });
  }
  if (IMM && IMM.stories) {
    IMM.stories.forEach(function (story) {
      (story.focus || []).forEach(function (item) {
        if (!item || !item.jp) return;
        add(item.jp, item.fr);
        addReading(item.jp, (IMM.readingOf && IMM.readingOf(item.jp)) || '');
        const kana = (IMM.readingOf && IMM.readingOf(item.jp)) || '';
        addVerbGlosses(add, item.jp, item.fr, addReading, kana);
        addAdjectiveGlosses(add, item.jp, item.fr, addReading, kana);
      });
    });
  }
  Object.keys(GLOSS_LEARN).forEach(function (key) {
    const item = GLOSS_LEARN[key] || [];
    add(key, item[1]);
    addReading(key, item[0]);
    addVerbGlosses(add, key, item[1], addReading, item[0]);
    addAdjectiveGlosses(add, key, item[1], addReading, item[0]);
  });
  Object.keys(GLOSS_EXTRA).forEach(function (key) { add(key, GLOSS_EXTRA[key], true); });
  Object.keys(GLOSS_CONTENT).forEach(function (key) {
    add(key, GLOSS_CONTENT[key]);
    addVerbGlosses(add, key, GLOSS_CONTENT[key]);
    addAdjectiveGlosses(add, key, GLOSS_CONTENT[key]);
  });
  glossIndex = index;
  glossKeys = Object.keys(index)
    .filter(function (key) { return /[\u3040-\u30ff\u3400-\u9fff\u3005\uff01-\uff5eA-Za-z0-9]/.test(key); })
    .sort(function (a, b) { return b.length - a.length; });
  // Index par premier caractère : le glossaire contient des milliers de formes
  // conjuguées et la recherche mot à mot doit rester instantanée.
  glossBuckets = Object.create(null);
  glossKeys.forEach(function (key) {
    const first = key.charAt(0);
    if (!glossBuckets[first]) glossBuckets[first] = [];
    glossBuckets[first].push(key);
  });
}

function isGlossBreak(ch) {
  return !ch || /[\s　。、！？!?.,・…「」『』（）()\[\]{}～〜]/.test(ch);
}

function glossaryKana(jp) {
  const text = P.stripAnnotations(String(jp || ''));
  const key = normalizeGlossKey(text);
  if (glossReadings && glossReadings[key]) return glossReadings[key];
  if (IMM && IMM.readingOf) {
    const reading = IMM.readingOf(text);
    if (reading && !P.hasKanji(reading)) return reading;
  }
  const R = window.Kotoba.Reading;
  const kana = R && R.reading ? R.reading(text) : '';
  return kana && !P.hasKanji(kana) ? kana : '';
}
function glossaryPronunciation(jp) {
  const text = P.stripAnnotations(String(jp || ''));
  const key = normalizeGlossKey(text);
  const special = {
    'は': 'wa', 'へ': 'e', 'を': 'o', 'こんにちは': 'konnichiwa', 'こんばんは': 'konbanwa',
    'っ': 'tsu', '々': 'kurikaeshi'
  };
  if (special[key]) return special[key];
  const reading = glossReadings && glossReadings[key];
  if (reading) return P.kanaToRomaji(reading) || '';
  const kana = glossaryKana(text);
  if (kana) return P.kanaToRomaji(kana) || '';
  const R = window.Kotoba.Reading;
  return R && R.pronunciation ? R.pronunciation(text) : '';
}

function glossKeyAt(raw, i) {
  const bucket = glossBuckets && glossBuckets[raw.charAt(i)];
  if (!bucket) return '';
  for (let k = 0; k < bucket.length; k++) {
    const key = bucket[k];
    if (!raw.startsWith(key, i)) continue;
    const next = raw.charAt(i + key.length);
    // « 何ですか » se découpe 何 + です, pas 何で + す ; « はいつ » se découpe は + いつ.
    if (key === '何で' && next === 'す') continue;
    if (key === 'はい' && next === 'つ') continue;
    // « これはいくら » : le は est une particule, pas le mot はい.
    if (key === 'はい' && glossKeyAt(raw, i + 1).length >= 3) continue;
    // « じゃありません » n'est pas じゃあ + り.
    if (key === 'じゃあ' && (next === 'り' || next === 'る')) continue;
    // « ことのできる » : の + できる, pas ので + きる.
    if (key === 'ので' && glossKeyAt(raw, i + 1).length >= 3) continue;
    // « なのです » : c'est な + の + です, pas なので + す.
    if (key === 'なので' && next === 'す') continue;
    // Le な adjectival ne s'emploie devant un nom (kanji), pas devant une kana.
    // « のですが » : c'est です + が, pas ので + す.
    if (key === 'ので' && next === 'す' &&
      (/[がかねよなはも]/.test(raw.charAt(i + 3)) || isGlossBreak(raw.charAt(i + 3)))) continue;
    return key;
  }
  return '';
}

// Un radical de verbe (知ら, 眠っ, 引け…) n'est pas un mot du glossaire :
// on le rattache à sa forme du dictionnaire pour donner sens + lecture.
const DEINFLECT_ENDINGS = {
  'っ': ['う', 'つ', 'る'], 'い': ['う', 'る'], 'き': ['く'], 'ぎ': ['ぐ'],
  'し': ['す'], 'ち': ['つ'], 'に': ['ぬ'], 'び': ['ぶ'], 'み': ['む'],
  'り': ['る'], 'ら': ['る'], 'れ': ['る'], 'ろ': ['る'], 'か': ['く'], 'け': ['く', 'る'], 'く': ['い'],
  'え': ['る'], 'べ': ['る'], 'せ': ['る'], 'て': ['る'], 'で': ['る'], 'ね': ['る'], 'め': ['る'],
  'い': ['う', 'る'], 'き': ['く', 'る'], 'ぎ': ['ぐ', 'る'], 'し': ['す', 'る'],
  'ち': ['つ', 'る'], 'に': ['ぬ', 'る'], 'び': ['ぶ', 'る'], 'み': ['む', 'る'], 'ず': ['る']
};
function deinflectGloss(jp) {
  const text = String(jp || '');
  if (!text || (text.length < 2 && !/[\u3400-\u9fff\u3005]/.test(text))) return null;
  const last = text.slice(-1);
  const ends = DEINFLECT_ENDINGS[last] ||
    (/[\u3400-\u9fff\u3005]/.test(last) ? ['る', 'う', 'く', 'つ', 'す', 'む', 'ぶ', 'ぬ', 'ぐ', 'い'] : []);
  for (let i = 0; i < ends.length; i++) {
    // Deux formes possibles : radical + terminaison (迎え + る) ou
    // remplacement du kana final (知ら → 知る, 買い → 買う).
    const candidates = [text + ends[i]];
    if (text.length > 1) candidates.push(text.slice(0, -1) + ends[i]);
    for (let c = 0; c < candidates.length; c++) {
      const cand = candidates[c];
      const fr = glossIndex[cand];
      if (!fr) continue;
      const baseReading = glossReadings[cand] || glossaryKana(cand);
      let reading = '';
      if (baseReading) {
        if (cand.startsWith(text)) {
          reading = baseReading.slice(0, baseReading.length - (cand.length - text.length));
        } else if (text.startsWith(cand.slice(0, -1))) {
          reading = baseReading.slice(0, -1) + last;
        }
      }
      return { fr: fr, romaji: reading ? (P.kanaToRomaji(reading) || '') : '' };
    }
  }
  return null;
}

const JA_DIGITS = ['ぜろ', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
const FR_SMALL = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
const FR_TENS = { 20: 'vingt', 30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante' };
function frNumber(n) {
  if (n <= 16) return FR_SMALL[n];
  if (n < 20) return 'dix-' + FR_SMALL[n - 10];
  if (n < 70) {
    const tens = FR_TENS[Math.floor(n / 10) * 10];
    const unit = n % 10;
    if (!unit) return tens;
    if (unit === 1) return tens + ' et un';
    return tens + '-' + FR_SMALL[unit];
  }
  if (n < 80) return n === 71 ? 'soixante et onze' : 'soixante-' + frNumber(n - 60);
  if (n < 100) return n === 80 ? 'quatre-vingts' : 'quatre-vingt-' + frNumber(n - 80);
  if (n < 1000) {
    const h = Math.floor(n / 100), rest = n % 100;
    const head = h === 1 ? 'cent' : FR_SMALL[h] + ' cent' + (rest ? '' : 's');
    return head + (rest ? ' ' + frNumber(rest) : '');
  }
  if (n < 10000) {
    const t = Math.floor(n / 1000), rest = n % 1000;
    const head = t === 1 ? 'mille' : frNumber(t) + ' mille';
    return head + (rest ? ' ' + frNumber(rest) : '');
  }
  return String(n);
}
const JA_HUNDREDS = ['', 'ひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく'];
const JA_THOUSANDS = ['', 'せん', 'にせん', 'さんぜん', 'よんせん', 'ごせん', 'ろくせん', 'ななせん', 'はっせん', 'きゅうせん'];
function jaNumber(n) {
  if (n < 10) return JA_DIGITS[n];
  if (n < 20) return 'じゅう' + (n % 10 ? JA_DIGITS[n % 10] : '');
  if (n < 100) return JA_DIGITS[Math.floor(n / 10)] + 'じゅう' + (n % 10 ? JA_DIGITS[n % 10] : '');
  if (n < 1000) {
    const rest = n % 100;
    return JA_HUNDREDS[Math.floor(n / 100)] + (rest ? jaNumber(rest) : '');
  }
  if (n < 10000) {
    const rest = n % 1000;
    return JA_THOUSANDS[Math.floor(n / 1000)] + (rest ? jaNumber(rest) : '');
  }
  return '';
}
const JA_COUNTER_TSU = ['', 'ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお'];
function numberGlossToken(raw, i) {
  const match = /^[0-9０-９]+/.exec(raw.slice(i));
  if (!match) return null;
  const digits = match[0];
  let end = i + digits.length;
  let jp = digits;
  let kana = '';
  const n = Number(digits.replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); }));
  if (raw.charAt(end) === 'つ' && n >= 1 && n <= 10) {
    jp += 'つ';
    kana = JA_COUNTER_TSU[n];
    end += 1;
  } else {
    kana = jaNumber(n);
  }
  return {
    token: { jp: jp, fr: frNumber(n), unknown: false, role: false, romaji: kana ? P.kanaToRomaji(kana) : '' },
    end: end
  };
}

function tokenizeJapaneseGloss(text) {
  buildGlossIndex();
  const raw = P.stripAnnotations(String(text || ''));
  const R = window.Kotoba && window.Kotoba.Reading;
  const overrides = R && R.particleOverrides ? R.particleOverrides(raw) : {};
  const particleChars = { 'は': 'wa', 'へ': 'e', 'を': 'o' };
  const out = [];
  let i = 0;
  while (i < raw.length) {
    if (isGlossBreak(raw[i])) { i++; continue; }
    const particleChar = raw.charAt(i);
    const particleRoman = particleChars[particleChar];
    if (particleRoman && overrides[i] === particleRoman) {
      const role = particleChar === 'は' ? 'thème' : (particleChar === 'へ' ? 'direction' : 'objet');
      out.push({ jp: particleChar, fr: glossIndex[particleChar] || role, unknown: false, role: true, romaji: particleRoman });
      i += 1;
      continue;
    }
    const number = numberGlossToken(raw, i);
    if (number) { out.push(number.token); i = number.end; continue; }
    const hit = glossKeyAt(raw, i);
    if (!hit) {
      let j = i + 1;
      while (j < raw.length && !isGlossBreak(raw[j])) {
        if (glossKeyAt(raw, j)) break;
        j++;
      }
      const jp = raw.slice(i, j);
      const stem = deinflectGloss(jp);
      if (stem) {
        out.push({ jp: jp, fr: stem.fr, unknown: false, role: false, romaji: stem.romaji || glossaryPronunciation(jp) });
      } else {
        out.push({ jp: jp, fr: '', unknown: true, role: false, romaji: glossaryPronunciation(jp) });
      }
      i = j;
    } else {
      out.push({ jp: hit, fr: glossIndex[hit], unknown: false, role: !!glossRoles[hit], romaji: glossaryPronunciation(hit) });
      i += hit.length;
    }
  }
  return out;
}

window.Kotoba.Gloss = {
  tokenize: tokenizeJapaneseGloss,
  kana: glossaryKana,
  pronunciation: glossaryPronunciation
};

function glossWordHtml(token) {
  const jp = esc(token.jp);
  const romaji = String(token.romaji || '');
  if (!romaji) return '<b lang="ja">' + jp + '</b>';
  return '<ruby><b lang="ja">' + jp + '</b><rt><span class="rt-romaji">' + esc(romaji) + '</span></rt></ruby>';
}

function glossItemHtml(token, className) {
  const cls = (className || 'gloss-item') + (token.role ? ' role' : '') + (token.unknown ? ' unknown' : '');
  return '<li class="' + cls + '">' + glossWordHtml(token) + '<span>' + esc(token.fr || '—') + '</span></li>';
}

function wordByWordDetails(context, extraClass, testId) {
  const tokens = tokenizeJapaneseGloss(context);
  if (!tokens.length) return '';
  return '<details class="word-by-word ' + (extraClass || '') + '" data-testid="' + attr(testId || 'word-by-word') + '">' +
    '<summary>Mot à mot</summary><ul class="gloss-list">' +
    tokens.map(function (token) { return glossItemHtml(token); }).join('') +
    '</ul></details>';
}

function tooltipGlossHtml(context) {
  const tokens = tokenizeJapaneseGloss(context);
  if (!tokens.length) return '';
  const shown = tokens.slice(0, 12);
  return '<div class="tip-gloss"><span class="tip-gloss-title">Mot à mot</span><div class="tip-gloss-list">' +
    shown.map(function (token) {
      return '<span class="tip-gloss-item' + (token.role ? ' role' : '') + (token.unknown ? ' unknown' : '') + '">' +
        glossWordHtml(token) + '<span>' + esc(token.fr || '—') + '</span></span>';
    }).join('') +
    (tokens.length > shown.length ? '<span class="tip-gloss-more">+ ' + (tokens.length - shown.length) + '</span>' : '') +
    '</div></div>';
}
function contextNoteHtml(entry) {
  const note = entry && entry.contextNote ? String(entry.contextNote) : '';
  return note ? '<p class="context-note" data-testid="answer-context-note">' + esc(note) + '</p>' : '';
}
function kanaContextHtml(text, highlight) {
  if (window.Kotoba.Reading && window.Kotoba.Reading.annotate) {
    return window.Kotoba.Reading.annotate(text, highlight, true);
  }
  const raw = String(text || '');
  const target = String(highlight || '').trim();
  const segmenter = window.Intl && window.Intl.Segmenter
    ? new window.Intl.Segmenter('ja', { granularity: 'word' })
    : null;
  function render(part) {
    const chunks = segmenter
      ? Array.from(segmenter.segment(part), function (item) { return item.segment; })
      : (window.Kotoba.Reading && window.Kotoba.Reading.kanaUnits ? window.Kotoba.Reading.kanaUnits(part) : Array.from(part));
    return chunks.map(function (chunk) {
      if (!/[\u3040-\u30ff]/.test(chunk)) return esc(chunk);
      const romaji = P.kanaToRomaji(chunk);
      return romaji ? '<ruby>' + esc(chunk) + '<rt><span class="rt-romaji">' + esc(romaji) + '</span></rt></ruby>' : esc(chunk);
    }).join('');
  }
  if (!target || raw.indexOf(target) < 0) return render(raw);
  const idx = raw.indexOf(target);
  return render(raw.slice(0, idx)) + '<mark>' + render(target) + '</mark>' + render(raw.slice(idx + target.length));
}
function rubyForTarget(ruby, target) {
  const raw = String(ruby || '');
  const plain = P.stripAnnotations(raw);
  const wanted = P.stripAnnotations(String(target || ''));
  if (!raw || !wanted) return '';
  const index = plain.indexOf(wanted);
  if (index < 0) return '';
  const end = index + wanted.length;
  let pos = 0, out = '', annotated = false;
  raw.replace(/([^\s\[\]]+?)\[([^\]]+)\]|([^\s\[\]]+)/g, function (match, base, reading, text) {
    const value = base || text || '';
    const start = pos;
    const stop = pos + value.length;
    pos = stop;
    if (stop <= index || start >= end) return match;
    if (base && reading && start >= index && stop <= end) {
      out += value + '[' + reading + ']';
      annotated = true;
    } else {
      const from = Math.max(index, start);
      const to = Math.min(end, stop);
      out += value.slice(from - start, to - start);
    }
    return match;
  });
  return annotated ? out : '';
}
function contextHtml(context, hl, entry) {
  const text = String(context || '').trim();
  const target = P.stripAnnotations(String(hl || '').trim());
  if (!text) return '<span class="muted">Pas encore de phrase de contexte.</span>';
  if (window.Kotoba.Reading) {
    const base = entry ? jpKeyOf(entry) : '';
    const targetRuby = entry && target
      ? (target === base ? annotatedRubyOf(entry) : rubyForTarget(entry.ruby, target))
      : '';
    return window.Kotoba.Reading.annotate(text, target, state.settings.furigana, targetRuby);
  }
  const safe = esc(text);
  if (!target) return safe;
  const escTarget = esc(target);
  const idx = safe.indexOf(escTarget);
  if (idx < 0) return safe;
  return safe.slice(0, idx) + '<mark>' + escTarget + '</mark>' + safe.slice(idx + escTarget.length);
}
function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
function todayXp() { return (state.stats.daily && state.stats.daily[S.todayKey()]) || 0; }
function greeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return { jp: 'おはよう', fr: 'Bonjour' };
  if (h >= 11 && h < 18) return { jp: 'こんにちは', fr: 'Bonjour' };
  return { jp: 'こんばんは', fr: 'Bonsoir' };
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function byDue(a, b) {
  const pa = state.progress[a.id];
  const pb = state.progress[b.id];
  const da = pa && pa.last ? pa.due : Infinity;
  const db = pb && pb.last ? pb.due : Infinity;
  if (da !== db) return da - db;
  return String(a.fr).localeCompare(String(b.fr), 'fr');
}
function entryKey(e) {
  return P.stripAnnotations(e.jp || '') + '|' + String(e.fr || '').toLowerCase().replace(/\s+/g, ' ').trim();
}
function normalizeSearch(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, ' ');
}
function alternativesSearchText(e) {
  return (e && Array.isArray(e.alternatives) ? e.alternatives : []).map(function (alt) {
    return [alt.jp, alt.reading, alt.romaji, alt.usage, alt.example, alt.exampleFr, alt.exampleRomaji].join(' ');
  }).join(' ');
}
function primarySearchBlobOf(e) {
  return normalizeSearch([e.fr, e.jp, e.ruby, e.romaji, e.nuance, alternativesSearchText(e)].join(' '));
}
function searchBlobOf(e) {
  return primarySearchBlobOf(e) + ' ' + normalizeSearch([e.context, e.contextFr, e.contextNote].join(' '));
}
function alternativeHint(e) {
  const alt = e && Array.isArray(e.alternatives) ? e.alternatives[0] : null;
  if (!alt) return '';
  const jp = alt.jp || alt.reading || '';
  return jp ? ' · aussi ' + jp + (alt.romaji ? ' (' + alt.romaji + ')' : '') : '';
}
function hideSentenceTooltip() {
  const tip = $('#sentenceTooltip');
  const target = tooltipTarget;
  tooltipTarget = null;
  if (target && target.getAttribute && target.getAttribute('aria-describedby') === 'sentenceTooltip') target.removeAttribute('aria-describedby');
  if (tip) { tip.hidden = true; tip.classList.remove('show'); }
}
function showSentenceTooltip(target) {
  const text = target && target.getAttribute ? target.getAttribute('data-tooltip') : '';
  const jp = target && target.getAttribute ? target.getAttribute('data-tooltip-jp') : '';
  const tip = $('#sentenceTooltip');
  if (!text || !tip) return;
  if (tooltipTarget !== target && tooltipTarget && tooltipTarget.getAttribute && tooltipTarget.getAttribute('aria-describedby') === 'sentenceTooltip') tooltipTarget.removeAttribute('aria-describedby');
  tooltipTarget = target;
  target.setAttribute('aria-describedby', 'sentenceTooltip');
  tip.innerHTML = '<span class="sentence-tooltip-translation">' + esc(text) + '</span>' + tooltipGlossHtml(jp);
  tip.hidden = false;
  tip.classList.remove('show');
  tip.style.left = '0px';
  tip.style.top = '0px';
  positionSentenceTooltip(target, tip);
  void tip.offsetWidth;
  if (tooltipTarget === target) tip.classList.add('show');
}
function positionSentenceTooltip(target, tip) {
  const pad = 12;
  const gap = 10;
  const rect = target.getBoundingClientRect();
  const maxWidth = Math.max(180, Math.min(360, window.innerWidth - pad * 2));
  tip.style.maxWidth = maxWidth + 'px';
  const box = tip.getBoundingClientRect();
  let top = rect.top - box.height - gap;
  let below = false;
  if (top < pad) {
    top = rect.bottom + gap;
    below = true;
  }
  if (top + box.height > window.innerHeight - pad) top = Math.max(pad, window.innerHeight - box.height - pad);
  let left = rect.left + (rect.width - box.width) / 2;
  left = Math.max(pad, Math.min(left, window.innerWidth - box.width - pad));
  tip.style.left = Math.round(left) + 'px';
  tip.style.top = Math.round(top) + 'px';
  tip.classList.toggle('below', below);
}
function initSentenceTooltip() {
  const tip = $('#sentenceTooltip');
  if (!tip) return;
  document.addEventListener('mouseover', function (event) {
    const target = event.target && event.target.closest ? event.target.closest('[data-tooltip]') : null;
    if (target) showSentenceTooltip(target);
  });
  document.addEventListener('mouseout', function (event) {
    const target = event.target && event.target.closest ? event.target.closest('[data-tooltip]') : null;
    if (!target) return;
    if (event.relatedTarget && target.contains(event.relatedTarget)) return;
    hideSentenceTooltip();
  });
  document.addEventListener('focusin', function (event) {
    const target = event.target && event.target.closest ? event.target.closest('[data-tooltip]') : null;
    if (target) showSentenceTooltip(target);
  });
  document.addEventListener('focusout', function (event) {
    const target = event.target && event.target.closest ? event.target.closest('[data-tooltip]') : null;
    if (target && target === tooltipTarget) hideSentenceTooltip();
  });
  window.addEventListener('scroll', hideSentenceTooltip, true);
  window.addEventListener('resize', hideSentenceTooltip);
}
function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3000);
}
function persist() {
  if (!S.save(state)) toast('Impossible d\'enregistrer (stockage du navigateur plein ?).');
  queueSync();
}
function applyTheme() {
  const pref = state.settings.theme || 'system';
  const dark = pref === 'dark' || (pref === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#101714' : '#58cc02');
}
function updateChrome() {
  const c = S.counts(entries, state, Date.now());
  const badge = $('#dueBadge');
  if (badge) { badge.textContent = String(c.due); badge.setAttribute('data-zero', c.due ? '0' : '1'); }
  const streak = $('#streakVal');
  if (streak) {
const streakValue = window.Kotoba.Motivation ? window.Kotoba.Motivation.currentStreak(state) : (state.stats.streak || 0);
streak.textContent = String(streakValue);
const streakPill = streak.closest ? streak.closest('.stat-pill') : null;
if (streakPill) {
streakPill.classList.toggle('is-lit', streakValue > 0 && state.stats.lastDay === S.todayKey());
streakPill.title = streakValue ? 'Série de ' + streakValue + ' jour(s)' : 'Lance ta série aujourd’hui';
}
}
  const xp = $('#xpVal');
  if (xp) xp.textContent = String(todayXp());
  const accountBtn = $('#accountBtn');
  if (accountBtn && SY) {
    const account = SY.session();
    accountBtn.classList.toggle('is-on', account.loggedIn);
    accountBtn.title = account.loggedIn ? 'Compte · ' + account.email : 'Compte et synchronisation';
    accountBtn.setAttribute('aria-label', account.loggedIn ? 'Compte de ' + account.email : 'Compte et synchronisation');
  }
}
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { voices = []; }
}
function primeSpeech() {
  if (speechPrimed || !('speechSynthesis' in window) || !('speaking' in window.speechSynthesis)) return;
  speechPrimed = true;
  try {
    const u = new window.SpeechSynthesisUtterance(' ');
    u.lang = 'ja-JP';
    u.rate = 2;
    u.volume = 0;
    window.speechSynthesis.speak(u);
  } catch (e) { /* la lecture manuelle reste disponible */ }
}
function speak(text, rate) {
  const t = String(text || '').trim();
  if (!t) return;
  if (window.Kotoba.Whisper && window.Kotoba.Whisper.stopPlayback) {
    try { window.Kotoba.Whisper.stopPlayback(); } catch (e) { /* ignore */ }
  }
  if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') {
    toast('La synthèse vocale n\'est pas disponible ici.');
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const u = new window.SpeechSynthesisUtterance(t);
    u.lang = 'ja-JP';
    u.rate = rate || state.settings.rate || 0.9;
    const v = voices.filter(function (x) { return /^ja/i.test(x.lang); })[0];
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch (e) { toast('Impossible de lire l\'audio.'); }
}
function speakSequence(texts) {
  const list = (texts || []).map(function (text) { return String(text || '').trim(); }).filter(Boolean);
  if (!list.length) return;
  if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') return;
  try {
    loadVoices();
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused && window.speechSynthesis.resume) window.speechSynthesis.resume();
    const v = voices.filter(function (x) { return /^ja/i.test(x.lang); })[0];
    list.forEach(function (text) {
      const u = new window.SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = state.settings.rate || 0.9;
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    });
  } catch (e) { /* le bouton Écouter reste disponible */ }
}
function autoSpeakAnswer(entry) {
  if (!session || !entry) return;
  if (session.autoSpokenFor === entry.id) return;
  session.autoSpokenFor = entry.id;
  const id = entry.id;
  setTimeout(function () {
    if (!session || !session.current || session.current.id !== id) return;
    speakSequence([entry.jp, entry.context]);
  }, 220);
}
function download(name, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

/* ---------- Données ---------- */
function prepareEntry(entry) {
  const Pol = window.Kotoba && window.Kotoba.Polite;
  const prepared = Pol ? Pol.prepare(entry) : entry;
  const map = window.VERB_EXAMPLES || {};
  const examples = map[prepared.jp] || map[prepared.dictionaryForm];
  if (examples) prepared.examples = examples;
  return prepared;
}
function buildEntries() {
  const list = [];
  (window.UNITS_DATA || []).forEach(function (unit) {
    (unit.words || []).forEach(function (w, i) {
      const isArray = Array.isArray(w);
      const rawJp = isArray ? w[0] : (w && w.jp);
      const fr = isArray ? w[3] : (w && w.fr);
      if (!rawJp || !fr) return;
      let jp, ruby, reading, romaji, context, contextFr, hl, alternatives, nuance, contextNote;
      if (isArray) {
        jp = rawJp || '';
        ruby = w[1] || jp;
        reading = kanaFromRuby(ruby);
        romaji = w[2] || '';
        context = w[4] || '';
        contextFr = w[5] || '';
        hl = w[6] || P.stripAnnotations(jp);
        alternatives = Array.isArray(w[7]) ? w[7] : [];
        nuance = w[8] && w[8].nuance ? String(w[8].nuance) : '';
        contextNote = w[8] && w[8].contextNote ? String(w[8].contextNote) : '';
      } else {
        jp = P.stripAnnotations(rawJp);
        reading = String(w.reading || '');
        ruby = String(w.ruby || '');
        if (!ruby) ruby = reading && P.hasKanji(jp) ? P.annotate(jp, reading) : jp;
        if (!reading) reading = kanaFromRuby(ruby);
        romaji = String(w.romaji || '') || (reading ? P.kanaToRomaji(reading) : '');
        context = String(w.context || '');
        contextFr = String(w.contextFr || '');
        hl = String(w.hl || jp);
        alternatives = Array.isArray(w.alternatives) ? w.alternatives : [];
        nuance = w.nuance ? String(w.nuance) : '';
        contextNote = w.contextNote ? String(w.contextNote) : '';
      }
      list.push(prepareEntry({
        id: 'u:' + unit.id + ':' + i,
        unitId: unit.id, theme: unit.name, emoji: unit.emoji || '📘',
        jp: P.stripAnnotations(jp), ruby: ruby,
        reading: reading, romaji: romaji, fr: String(fr),
        context: context, contextFr: contextFr, hl: hl,
        alternatives: alternatives, nuance: nuance, contextNote: contextNote, source: 'base'
      }));
    });
  });
  Object.keys(state.entries || {}).forEach(function (key) {
    const e = state.entries[key];
    if (!e || !e.jp) return;
    list.push(prepareEntry(Object.assign({ theme: 'Mes mots importés', emoji: '📥' }, e, {
      id: e.id || key,
      source: 'import',
      ruby: e.ruby || e.jp,
      reading: e.reading && !P.hasKanji(e.reading) ? P.stripAnnotations(e.reading) : kanaFromRuby(e.ruby || e.jp),
      hl: e.hl || e.jp
    })));
  });
  glossIndex = null;
  glossKeys = null;
  glossRoles = null;
  glossReadings = null;
  return list;
}
function unitStats(unitId, now) {
  const list = entries.filter(function (e) { return e.unitId === unitId; });
  let seen = 0, known = 0, due = 0, fresh = 0;
  list.forEach(function (e) {
    const p = state.progress[e.id];
    if (S.isNew(p)) { fresh++; return; }
    seen++;
    if (S.isKnown(p)) known++;
    if (p && p.due <= now) due++;
  });
  return { total: list.length, seen: seen, known: known, due: due, new: fresh };
}
function showView(name, opts) {
  hideSentenceTooltip();
  if (!VIEWS[name]) name = 'learn';
  view = name;
  Object.keys(VIEWS).forEach(function (key) {
    const el = $(VIEWS[key]);
    if (el) el.hidden = key !== name;
  });
  $$('[data-nav]').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === name); });
  render();
  if (!opts || !opts.noScroll) window.scrollTo(0, 0);
}
function render() {
  if (view === 'learn') renderHome();
  else if (view === 'review') renderReview();
  else if (view === 'conversation') renderConversation();
  else if (view === 'reading') renderReading();
  else if (view === 'library') renderLibrary();
  else if (view === 'import') renderImport();
  else if (view === 'grammar') renderGrammar();
  updateChrome();
}
function route() {
  const key = (location.hash || '').replace(/^#/, '');
  showView(FROM_HASH[key] || 'learn', { noScroll: true });
}

/* ---------- Accueil ---------- */
function dailyConversationPracticeTask(now) {
  if (!CONV || !Array.isArray(CONV.scenarios) || !CONV.scenarios.length) return null;
  const day = Math.floor((Number(now) || Date.now()) / 86400000);
  const scenario = CONV.scenarios[day % CONV.scenarios.length];
  if (!scenario || !scenario.turns.length) return null;
  const turnIndex = day % scenario.turns.length;
  const turn = scenario.turns[turnIndex];
  if (!turn) return null;
  return {
    entry: null,
    mode: 'conversation',
    conversationScenario: scenario,
    conversationTurnIndex: turnIndex,
    conversationTurn: turn,
    conversationPractice: true
  };
}
function dailyConversationTasks(limit) {
  if (!CONV) return [];
  const out = [];
  const max = limit == null ? 2 : Math.max(0, Math.floor(Number(limit) || 0));
  conversationReviewGroups().forEach(function (group) {
    group.items.forEach(function (item) {
      if (out.length >= max) return;
      const turn = group.scenario.turns[item.turn];
      if (!turn) return;
      out.push({
        entry: null,
        mode: 'conversation',
        conversationScenario: group.scenario,
        conversationTurnIndex: item.turn,
        conversationTurn: turn
      });
    });
  });
  if (!out.length && max > 0) {
    const practice = dailyConversationPracticeTask(Date.now());
    if (practice) out.push(practice);
  }
  return out;
}
function dailyGrammarTask(now) {
  if (!GRAMMAR || typeof GRAMMAR.dailyPick !== 'function') return null;
  const pick = GRAMMAR.dailyPick(state, now);
  if (!pick || !pick.lesson || !pick.exercise) return null;
  return {
    entry: null,
    mode: 'grammar',
    grammarLesson: pick.lesson,
    grammarExercise: pick.exercise,
    grammarReason: pick.reason || 'practice'
  };
}
function dailyPlanPanelHtml() {
  const c = S.counts(entries, state, Date.now());
  const grammarTask = dailyGrammarTask(Date.now());
  const conversationCount = Math.min(2, dailyConversationTasks(2).length);
  const conversationReviewTotal = Math.min(2, conversationReviewCount());
  const hasPhrases = entries.some(function (entry) { return !!(entry && entry.context); });
  const parts = [];
  if (grammarTask) parts.push('1 point de grammaire');
  if (conversationCount) parts.push(conversationCount + ' conversation' + (conversationCount === 1 ? '' : 's') + (conversationReviewTotal ? ' à revoir' : ' du jour'));
  if (c.due) parts.push(Math.min(8, c.due) + ' révision' + (Math.min(8, c.due) === 1 ? '' : 's'));
  if (c.new) parts.push(Math.min(3, c.new) + ' nouveau' + (Math.min(3, c.new) === 1 ? '' : 'x') + ' mot' + (Math.min(3, c.new) === 1 ? '' : 's'));
  if (c.due >= 2) parts.push('1 compréhension');
  if (c.due >= 3) parts.push('1 production');
  if (hasPhrases) parts.push('2 phrases');
  if (entries.length) parts.push('1 prononciation');
  const steps = [];
  if (grammarTask) steps.push('Grammaire');
  if (conversationCount) steps.push('Conversation');
  steps.push('Mots', 'Compréhension', 'Production', 'Phrases', 'Bilan');
  return '<section class="panel today-panel" data-testid="today-panel">' +
    '<div class="panel-head"><div><p class="eyebrow">Parcours guidé</p><h2>Ta session du jour</h2>' +
    '<p>Un seul parcours : ' + esc(parts.join(' · ')) + '.</p></div>' +
    '<button class="btn primary" data-action="start-today" data-testid="start-today">Commencer</button></div>' +
    '<div class="today-steps">' + steps.map(function (step) { return '<span>' + esc(step) + '</span>'; }).join('') + '</div></section>';
}
function phrasePanelHtml() {
  if (!entries.some(function (entry) { return !!(entry && entry.context); })) return '';
  return '<section class="panel phrase-panel" data-testid="phrase-panel">' +
    '<div class="panel-head"><div><p class="eyebrow">Atelier de phrases</p><h2>Construis des phrases entières</h2>' +
    '<p>À partir de tes contextes : complète, remets dans l’ordre ou écoute puis reconstruis.</p></div>' +
    '<button class="btn primary" data-action="start-phrase" data-type="mixed" data-testid="start-phrase">Atelier complet</button></div>' +
    '<div class="phrase-mode-row">' +
    '<button class="mode-btn" data-action="start-phrase" data-type="cloze" data-testid="start-phrase-cloze">Texte à trous</button>' +
    '<button class="mode-btn" data-action="start-phrase" data-type="order" data-testid="start-phrase-order">Remettre en ordre</button>' +
    '<button class="mode-btn" data-action="start-phrase" data-type="dictation" data-testid="start-phrase-dictation">Dictée</button></div></section>';
}
function conversationPanelHtml() {
  if (!CONV || !Array.isArray(CONV.scenarios) || !CONV.scenarios.length) return '';
  const picks = CONV.scenarios.slice(0, 3);
  const reviewCount = conversationReviewCount();
  return '<section class="panel conversation-panel" data-testid="conversation-panel">' +
    '<div class="panel-head"><div><p class="eyebrow">Parler aux gens</p><h2>Des phrases pour la vraie vie</h2>' +
    '<p>Commandes, chemin, invitations, imprévus : réponds en japonais poli, puis compare avec un modèle naturel.</p></div>' +
    '<button class="btn primary" data-action="go-conversation" data-testid="go-conversation">Toutes les situations</button></div>' +
    '<div class="conversation-mini-grid">' + picks.map(conversationMiniCardHtml).join('') + '</div>' +
    '<p class="hint">' + CONV.scenarios.length + ' situations · kana, kanji ou romaji acceptés · audio et mode écoute' +
    (reviewCount ? ' · 🎯 ' + reviewCount + ' réplique' + (reviewCount === 1 ? '' : 's') + ' à retravailler' : '') + '</p></section>';
}
function conversationMiniCardHtml(scenario) {
  return '<button class="conv-mini" data-action="start-conversation" data-id="' + attr(scenario.id) + '" data-testid="conversation-mini-' + attr(scenario.id) + '">' +
    '<span class="conv-mini-emoji" aria-hidden="true">' + esc(scenario.emoji) + '</span>' +
    '<span class="conv-mini-copy"><b>' + esc(scenario.title) + '</b><small>' + esc(scenario.level) + ' · ' + scenario.turns.length + ' répliques</small></span></button>';
}
function conversationListHtml() {
  const cards = CONV.scenarios.map(function (scenario) {
    return '<button class="conv-card" data-action="start-conversation" data-id="' + attr(scenario.id) + '" data-testid="conversation-scenario-' + attr(scenario.id) + '">' +
      '<span class="conv-card-top"><span class="conv-emoji" aria-hidden="true">' + esc(scenario.emoji) + '</span><span class="conv-level">' + esc(scenario.level) + '</span></span>' +
      '<strong>' + esc(scenario.title) + '</strong><span class="conv-goal">' + esc(scenario.goal) + '</span>' +
      '<span class="conv-meta">' + scenario.turns.length + ' répliques · écrit ou écoute</span></button>';
  }).join('');
  return '<section class="panel conversation-hero" data-testid="conversation-list">' +
    '<div><p class="eyebrow">Parler aux gens</p><h2>Les situations qui reviennent vraiment</h2>' +
    '<p class="lead">Lis la réplique ou active le mode écoute, réponds en japonais poli, puis compare avec le modèle. Les variantes naturelles sont acceptées.</p>' +
    '<button class="btn primary conversation-random" data-action="random-conversation" data-testid="conversation-random">🎲 Situation surprise</button></div>' +
    '<div class="conversation-hero-stats"><b>' + CONV.scenarios.length + '</b><span>situations</span><small>A1 → A2</small></div></section>' +
    conversationReviewPanelHtml() +
    '<div class="conversation-grid">' + cards + '</div>' +
    '<section class="panel conversation-how"><h2>Comment ça marche</h2><ol>' +
    '<li>Écoute la réplique et lis sa traduction.</li><li>Réponds avec tes mots : kana, kanji ou romaji.</li>' +
    '<li>Active le mode écoute pour masquer le texte et travailler la compréhension orale.</li>' +
    '<li>Compare, réécoute le modèle, puis enchaîne la réplique suivante.</li></ol>' +
    '<p class="hint">Astuce : répète la réponse à voix haute après l’avoir vérifiée. C’est cette production orale qui te servira dehors.</p></section>';
}
function conversationReviewGroups() {
  if (!CONV || !state.conversationReview || typeof state.conversationReview !== 'object') return [];
  const groups = {};
  Object.keys(state.conversationReview).forEach(function (key) {
    const item = state.conversationReview[key];
    if (!item || typeof item !== 'object') return;
    const missedAt = Math.max(0, Number(item.missedAt) || 0);
    const clearedAt = Math.max(0, Number(item.clearedAt) || 0);
    if (!missedAt || missedAt <= clearedAt) return;
    const scenario = CONV.scenarioById ? CONV.scenarioById(item.scenario) : null;
    const turn = Math.floor(Number(item.turn));
    if (!scenario || !isFinite(turn) || turn < 0 || !scenario.turns[turn]) return;
    if (!groups[scenario.id]) groups[scenario.id] = { scenario: scenario, items: [], latest: 0 };
    groups[scenario.id].items.push({ turn: turn, missedAt: missedAt });
    groups[scenario.id].latest = Math.max(groups[scenario.id].latest, missedAt);
  });
  return Object.keys(groups).map(function (id) {
    const group = groups[id];
    group.items.sort(function (a, b) { return a.turn - b.turn; });
    return group;
  }).sort(function (a, b) { return b.latest - a.latest; });
}
function conversationReviewCount() {
  return conversationReviewGroups().reduce(function (total, group) { return total + group.items.length; }, 0);
}
function conversationReviewPanelHtml() {
  const groups = conversationReviewGroups();
  if (!groups.length) return '';
  const total = groups.reduce(function (sum, group) { return sum + group.items.length; }, 0);
  const rows = groups.map(function (group) {
    const scenario = group.scenario;
    const count = group.items.length;
    const sample = scenario.turns[group.items[0].turn].model.jp;
    return '<div class="conversation-review-row" data-testid="conversation-review-' + attr(scenario.id) + '">' +
      '<span class="conv-emoji" aria-hidden="true">' + esc(scenario.emoji) + '</span>' +
      '<div class="conversation-review-copy"><strong>' + esc(scenario.title) + '</strong>' +
      '<small>' + count + ' réplique' + (count === 1 ? '' : 's') + ' à revoir · <span lang="ja">' + esc(sample) + '</span></small></div>' +
      '<button class="btn ghost small" data-action="review-conversation-misses" data-id="' + attr(scenario.id) + '" data-testid="conversation-review-start-' + attr(scenario.id) + '" aria-label="Réviser les répliques ratées de ' + attr(scenario.title) + '">Réviser</button></div>';
  }).join('');
  return '<section class="panel conversation-review-panel" data-testid="conversation-review-panel">' +
    '<div class="panel-head"><div><p class="eyebrow">À retravailler</p><h2>Tes phrases à revoir</h2>' +
    '<p>Les répliques ratées restent ici, même après avoir fermé l’onglet.</p></div>' +
    '<span class="conversation-review-total"><b>' + total + '</b><small>réplique' + (total === 1 ? '' : 's') + '</small></span></div>' +
    '<div class="conversation-review-list">' + rows + '</div></section>';
}
function reviewConversationMisses(scenarioId) {
  const group = conversationReviewGroups().filter(function (item) { return item.scenario.id === scenarioId; })[0];
  if (!group) { toast('Aucune réplique à revoir.'); renderConversation(); return; }
  startConversation(scenarioId, { turnIndices: group.items.map(function (item) { return item.turn; }) });
}
function conversationTurnIndex() {
  const queue = conversationState && conversationState.queue;
  return Array.isArray(queue) && queue.length ? queue[conversationState.index] : conversationState.index;
}
function conversationTotal() {
  const queue = conversationState && conversationState.queue;
  return Array.isArray(queue) && queue.length ? queue.length : conversationState.scenario.turns.length;
}
function conversationTurn() {
  return conversationState.scenario.turns[conversationTurnIndex()];
}
function renderConversation() {
  const host = $('#view-conversation');
  if (!host) return;
  if (!CONV) {
    host.innerHTML = '<div class="panel"><h2>Conversations indisponibles</h2><p>Le module de conversation n’a pas pu être chargé. Recharge la page.</p></div>';
    return;
  }
  if (conversationState) host.innerHTML = conversationState.completed ? conversationSummaryHtml() : conversationSessionHtml();
  else host.innerHTML = conversationListHtml();
}
function conversationSessionHtml() {
  const scenario = conversationState.scenario;
  const turn = conversationTurn();
  const total = conversationTotal();
  const last = conversationState.index + 1 >= total;
  const progress = Math.round(conversationState.index / total * 100);
  const listenOn = !!conversationState.listen;
  const hideText = listenOn && !conversationState.revealed && !conversationState.feedback;
  const partner = hideText
    ? '<p class="conv-listen-hint">🔒 Texte masqué. Écoute la réplique, puis réponds de mémoire.</p>' +
      '<div class="conversation-actions"><button class="btn primary small" data-action="speak-text" data-text="' + attr(turn.partner.jp) + '" data-slow="1" data-testid="conversation-play">🔊 Écouter</button>' +
      '<button class="btn ghost small" data-action="reveal-conversation" data-testid="conversation-reveal">Afficher le texte</button></div>'
    : '<p class="conv-jp" lang="ja">' + esc(turn.partner.jp) + '</p>' +
      '<p class="conv-reading">' + esc(turn.partner.reading) + '</p>' +
      (turn.partner.romaji ? '<p class="conv-romaji">' + esc(turn.partner.romaji) + '</p>' : '') +
      '<p class="conv-fr">' + esc(turn.partner.fr) + '</p>' +
      wordByWordDetails(turn.partner.jp, 'conv-word-by-word', 'conversation-partner-word-by-word') +
      '<div class="conversation-actions"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(turn.partner.jp) + '" data-slow="1">🔊 Écouter</button></div>';
  return '<section class="panel conversation-session" data-testid="conversation-session">' +
    '<div class="conversation-top"><button class="btn ghost small" data-action="close-conversation" data-testid="conversation-close">← Situations</button>' +
    '<div class="conversation-tools"><button class="btn ghost small' + (listenOn ? ' active' : '') + '" data-action="toggle-conversation-listen" aria-pressed="' + (listenOn ? 'true' : 'false') + '" data-testid="conversation-listen">🎧 Écoute</button>' +
    '<span class="conversation-count">' + (conversationState.review ? '🎯 Révision ciblée · ' : '') + esc(scenario.title) + ' · ' + (conversationState.index + 1) + '/' + total + '</span></div></div>' +
    '<div class="conversation-progress" aria-hidden="true"><span style="width:' + progress + '%"></span></div>' +
    '<div class="conversation-scenario-head"><span class="conv-level">' + esc(scenario.level) + '</span><h2>' + esc(scenario.title) + '</h2><p>' + esc(scenario.situation) + '</p>' +
    (conversationState.review ? '<p class="conv-review-note" data-testid="conversation-review-note">🎯 Tu rejoues uniquement les répliques à retravailler.</p>' : '') + '</div>' +
    '<div class="conversation-bubble" data-testid="conversation-partner"><div class="conv-speaker"><span aria-hidden="true">' + esc(scenario.emoji) + '</span> ' + esc(scenario.speaker) + ' <small>· ' + esc(scenario.speakerFr) + '</small></div>' +
    partner + '</div>' +
    '<div class="conversation-task"><p class="eyebrow">À toi</p><h3>' + esc(turn.task) + '</h3>' +
    '<p class="hint">Réponds en japonais poli · kana, kanji ou romaji acceptés</p>' +
    (conversationState.feedback ? conversationFeedbackHtml(turn, last) : conversationFormHtml()) + '</div></section>';
}
function conversationFormHtml() {
  return '<form class="conversation-form" data-form="conversation">' +
    '<input id="conversationAnswer" name="answer" class="conversation-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Écris en japonais ou en romaji…" aria-label="Ta réponse en japonais" data-testid="conversation-answer">' +
    '<button class="btn primary" type="submit" data-testid="conversation-submit">Vérifier</button>' +
    '<div class="conversation-voice-row"><button class="btn ghost small" type="button" data-action="conversation-voice" aria-pressed="false" data-testid="conversation-voice">🎙️ Répondre à l’oral</button>' +
    '<button class="btn ghost small" type="button" data-action="conversation-hint" aria-expanded="false" aria-controls="conversationHint" data-testid="conversation-hint">💡 Indice</button>' +
    '<span class="conversation-voice-status" id="conversationVoiceStatus" role="status" aria-live="polite" data-testid="conversation-voice-status">Le micro remplit le champ en japonais ; tu peux corriger avant de vérifier.</span></div>' +
    '<div class="conversation-hint" id="conversationHint" data-testid="conversation-hint-box" role="note" hidden></div></form>';
}
function toggleConversationHint() {
  if (!conversationState || conversationState.completed || conversationState.feedback) return;
  const box = $('#conversationHint');
  const button = $('[data-action="conversation-hint"]');
  if (!box || !button) return;
  const show = box.hidden;
  if (show) {
    const turn = conversationTurn();
    const first = String(turn.model.romaji || '').trim().split(/\s+/)[0].replace(/[.,!?…]+$/, '');
    box.innerHTML = '<b>💡 Indice</b><p>' + esc(turn.tip) + '</p>' +
      (first ? '<p class="conv-hint-start">Commence par : <strong>' + esc(first) + '…</strong></p>' : '');
  }
  box.hidden = !show;
  button.textContent = show ? '🙈 Masquer l’indice' : '💡 Indice';
  button.setAttribute('aria-expanded', show ? 'true' : 'false');
}
function setConversationVoiceStatus(message, tone) {
  const el = $('#conversationVoiceStatus');
  if (!el) return;
  el.textContent = message;
  el.className = 'conversation-voice-status' + (tone ? ' ' + tone : '');
}
function setConversationVoiceButton(listening) {
  const btn = $('[data-action="conversation-voice"]');
  if (!btn) return;
  btn.textContent = listening ? '⏹️ Arrêter' : '🎙️ Répondre à l’oral';
  btn.setAttribute('aria-pressed', listening ? 'true' : 'false');
  btn.classList.toggle('active', !!listening);
}
function stopConversationVoice() {
  if (!conversationState) return;
  conversationState.voiceToken = (conversationState.voiceToken || 0) + 1;
  if (conversationState.recognition) {
    try { conversationState.recognition.abort(); } catch (e) { /* ignore */ }
    conversationState.recognition = null;
  }
  setConversationVoiceButton(false);
}
function startConversationVoice() {
  if (!conversationState || conversationState.completed || conversationState.feedback) return;
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) {
    setConversationVoiceStatus('La reconnaissance vocale n’est pas disponible dans ce navigateur. Essaie Chrome ou Edge.', 'error');
    toast('Réponse orale indisponible dans ce navigateur.');
    return;
  }
  stopConversationVoice();
  const rec = new Ctor();
  const token = conversationState.voiceToken;
  conversationState.recognition = rec;
  conversationState.voiceUsed = false;
  rec.lang = 'ja-JP';
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 3;
  let heard = false;
  let failed = false;
  function active() { return conversationState && conversationState.voiceToken === token; }
  rec.onstart = function () {
    if (!active()) return;
    setConversationVoiceButton(true);
    setConversationVoiceStatus('🎧 J’écoute… parle en japonais.', 'listening');
  };
  rec.onresult = function (event) {
    if (!active()) return;
    const results = (event && event.results) || [];
    let finalText = '';
    let interimText = '';
    for (let r = 0; r < results.length; r++) {
      const result = results[r];
      if (!result || !result.length) continue;
      const text = String((result[0] && result[0].transcript) || '');
      if (result.isFinal) finalText += text;
      else interimText += text;
    }
    const transcript = (finalText || interimText).trim();
    if (!transcript) return;
    heard = true;
    conversationState.voiceUsed = true;
    const input = $('#conversationAnswer');
    if (input) {
      input.value = transcript;
      input.focus();
    }
    if (finalText.trim()) setConversationVoiceStatus('Transcription reçue. Vérifie, corrige si besoin, puis clique sur Vérifier.');
    else setConversationVoiceStatus('🎧 J’écoute… parle en japonais.', 'listening');
  };
  rec.onerror = function (event) {
    if (!active()) return;
    const code = event && event.error;
    if (code === 'aborted') return;
    failed = true;
    const messages = {
      'not-allowed': 'Autorise le micro dans les réglages du navigateur, puis réessaie.',
      'service-not-allowed': 'Autorise le micro dans les réglages du navigateur, puis réessaie.',
      'no-speech': 'Je n’ai rien entendu. Rapproche-toi du micro et réessaie.',
      'audio-capture': 'Aucun micro détecté. Vérifie ton matériel.',
      'network': 'La reconnaissance vocale a besoin d’une connexion réseau.'
    };
    setConversationVoiceStatus(messages[code] || 'La reconnaissance vocale a échoué. Tu peux écrire ta réponse.', 'error');
  };
  rec.onend = function () {
    if (!active()) return;
    conversationState.recognition = null;
    setConversationVoiceButton(false);
    if (!heard && !failed) setConversationVoiceStatus('Je n’ai rien entendu. Rapproche-toi du micro et réessaie.', 'error');
  };
  try { rec.start(); } catch (e) {
    conversationState.recognition = null;
    setConversationVoiceButton(false);
    setConversationVoiceStatus('Impossible de démarrer le micro. Tu peux écrire ta réponse.', 'error');
  }
}
function conversationFeedbackHtml(turn, last) {
  const ok = !!conversationState.feedback.ok;
  const alternatives = turn.accepted.map(function (item) { return Array.isArray(item) ? item[0] : item; })
    .filter(function (jp) { return jp && jp !== turn.model.jp; }).slice(0, 3);
  return '<div class="conversation-feedback ' + (ok ? 'good' : 'bad') + '" data-testid="conversation-feedback">' +
    '<div class="conv-verdict">' + (ok ? '✅ Bonne réponse !' : '💡 Presque !') + '</div>' +
    '<p class="conv-attempt">Ta réponse : <b lang="ja">' + esc(conversationState.feedback.answer) + '</b></p>' +
    (conversationState.feedback.pronunciation ? conversationPronunciationHtml(conversationState.feedback.pronunciation) : '') +
    '<div class="conv-model"><p class="eyebrow">Réponse modèle</p><p class="conv-jp" lang="ja">' + esc(turn.model.jp) + '</p>' +
    '<p class="conv-reading">' + esc(turn.model.reading) + '</p><p class="conv-romaji">' + esc(turn.model.romaji) + '</p>' +
    '<p class="conv-fr">' + esc(turn.model.fr) + '</p>' +
    wordByWordDetails(turn.model.jp, 'conv-word-by-word', 'conversation-model-word-by-word') +
    '<div class="conversation-actions"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(turn.model.jp) + '">🔊 Écouter</button></div></div>' +
    '<p class="conv-tip"><b>À retenir :</b> ' + esc(turn.tip) + '</p>' +
    (alternatives.length ? '<details class="conv-alt"><summary>Autres formulations acceptées</summary><ul><li lang="ja">' + alternatives.map(esc).join('</li><li lang="ja">') + '</li></ul></details>' : '') +
    '<div class="conversation-actions"><button class="btn primary" data-action="next-conversation" data-testid="conversation-next">' + (last ? 'Voir le bilan' : 'Suivant') + '</button>' +
    (!ok ? '<button class="btn ghost" data-action="retry-conversation" data-testid="conversation-retry">Réessayer</button>' : '') + '</div></div>';
}
function conversationTaskView() {
  const task = session && session.task;
  const scenario = task && task.conversationScenario;
  const turn = task && task.conversationTurn;
  if (!scenario || !turn) return '<div class="session-card conversation-task-card" data-testid="conversation-task"><p>Réplique indisponible.</p></div>';
  if (session.phase === 'feedback') return conversationTaskFeedbackHtml(scenario, turn);
  const practice = !!task.conversationPractice;
  return '<div class="session-card conversation-task-card" data-testid="conversation-task" data-practice="' + (practice ? '1' : '0') + '">' +
    '<p class="eyebrow">' + (practice ? 'Conversation du jour' : 'Conversation · ' + esc(scenario.title)) + '</p>' +
    '<p class="hint">' + esc(scenario.situation) + '</p>' +
    '<div class="conversation-bubble" data-testid="conversation-task-partner"><div class="conv-speaker"><span aria-hidden="true">' + esc(scenario.emoji) + '</span> ' + esc(scenario.speaker) + ' <small>· ' + esc(scenario.speakerFr) + '</small></div>' +
    '<p class="conv-jp" lang="ja">' + esc(turn.partner.jp) + '</p>' +
    '<p class="conv-reading">' + esc(turn.partner.reading) + '</p>' +
    (turn.partner.romaji ? '<p class="conv-romaji">' + esc(turn.partner.romaji) + '</p>' : '') +
    '<p class="conv-fr">' + esc(turn.partner.fr) + '</p>' +
    wordByWordDetails(turn.partner.jp, 'conv-word-by-word', 'conversation-task-partner-word-by-word') +
    '<div class="conversation-actions"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(turn.partner.jp) + '">🔊 Écouter</button></div></div>' +
    '<div class="conversation-task"><p class="eyebrow">À toi</p><h3>' + esc(turn.task) + '</h3>' +
    '<p class="hint">Réponds en japonais poli · kana, kanji ou romaji acceptés</p>' +
    '<form class="conversation-form" data-form="conversation-task">' +
    '<input id="conversationTaskAnswer" name="answer" class="conversation-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Écris en japonais ou en romaji…" aria-label="Ta réponse en japonais" data-testid="conversation-task-answer">' +
    '<button class="btn primary" type="submit" data-testid="conversation-task-submit">Vérifier</button>' +
    '<div class="conversation-voice-row"><button class="btn ghost small" type="button" data-action="conversation-task-voice" aria-pressed="false" data-testid="conversation-task-voice">🎙️ Répondre à l’oral</button>' +
    '<span class="conversation-voice-status" id="conversationTaskVoiceStatus" role="status" aria-live="polite" data-testid="conversation-task-voice-status">Le micro remplit le champ en japonais ; tu peux corriger avant de vérifier.</span></div></form></div></div>';
}
function setConversationTaskVoiceStatus(message, tone) {
  const el = $('#conversationTaskVoiceStatus');
  if (!el) return;
  el.textContent = message;
  el.className = 'conversation-voice-status' + (tone ? ' ' + tone : '');
}
function setConversationTaskVoiceButton(listening) {
  const btn = $('[data-action="conversation-task-voice"]');
  if (!btn) return;
  btn.textContent = listening ? '⏹️ Arrêter' : '🎙️ Répondre à l’oral';
  btn.setAttribute('aria-pressed', listening ? 'true' : 'false');
  btn.classList.toggle('active', !!listening);
}
function stopConversationTaskVoice() {
  if (!session) return;
  session.conversationVoiceToken = (session.conversationVoiceToken || 0) + 1;
  if (session.conversationRecognition) {
    try { session.conversationRecognition.abort(); } catch (e) { /* ignore */ }
    session.conversationRecognition = null;
  }
  setConversationTaskVoiceButton(false);
}
function startConversationTaskVoice() {
  if (!session || session.mode !== 'conversation' || session.phase !== 'question' || !session.task) return;
  const button = $('[data-action="conversation-task-voice"]');
  if (button && button.getAttribute('aria-pressed') === 'true') {
    stopConversationTaskVoice();
    setConversationTaskVoiceStatus('Micro arrêté. Tu peux réessayer ou écrire ta réponse.');
    return;
  }
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) {
    setConversationTaskVoiceStatus('La reconnaissance vocale n’est pas disponible dans ce navigateur. Essaie Chrome ou Edge.', 'error');
    toast('Réponse orale indisponible dans ce navigateur.');
    return;
  }
  stopConversationTaskVoice();
  const rec = new Ctor();
  const token = session.conversationVoiceToken;
  session.conversationRecognition = rec;
  rec.lang = 'ja-JP';
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 3;
  let heard = false;
  let failed = false;
  function active() { return session && session.conversationVoiceToken === token; }
  rec.onstart = function () {
    if (!active()) return;
    setConversationTaskVoiceButton(true);
    setConversationTaskVoiceStatus('🎧 J’écoute… parle en japonais.', 'listening');
  };
  rec.onresult = function (event) {
    if (!active()) return;
    const results = (event && event.results) || [];
    let finalText = '';
    let interimText = '';
    for (let r = 0; r < results.length; r++) {
      const result = results[r];
      if (!result || !result.length) continue;
      const text = String((result[0] && result[0].transcript) || '');
      if (result.isFinal) finalText += text;
      else interimText += text;
    }
    const transcript = (finalText || interimText).trim();
    if (!transcript) return;
    heard = true;
    session.conversationVoiceUsed = true;
    const input = $('#conversationTaskAnswer');
    if (input) {
      input.value = transcript;
      input.focus();
    }
    if (finalText.trim()) setConversationTaskVoiceStatus('Transcription reçue. Vérifie, corrige si besoin, puis clique sur Vérifier.');
    else setConversationTaskVoiceStatus('🎧 J’écoute… parle en japonais.', 'listening');
  };
  rec.onerror = function (event) {
    if (!active()) return;
    const code = event && event.error;
    if (code === 'aborted') return;
    failed = true;
    const messages = {
      'not-allowed': 'Autorise le micro dans les réglages du navigateur, puis réessaie.',
      'service-not-allowed': 'Autorise le micro dans les réglages du navigateur, puis réessaie.',
      'no-speech': 'Je n’ai rien entendu. Rapproche-toi du micro et réessaie.',
      'audio-capture': 'Aucun micro détecté. Vérifie ton matériel.',
      'network': 'La reconnaissance vocale a besoin d’une connexion réseau.'
    };
    setConversationTaskVoiceStatus(messages[code] || 'La reconnaissance vocale a échoué. Tu peux écrire ta réponse.', 'error');
  };
  rec.onend = function () {
    if (!active()) return;
    session.conversationRecognition = null;
    setConversationTaskVoiceButton(false);
    if (!heard && !failed) setConversationTaskVoiceStatus('Je n’ai rien entendu. Rapproche-toi du micro et réessaie.', 'error');
  };
  try { rec.start(); } catch (e) {
    session.conversationRecognition = null;
    setConversationTaskVoiceButton(false);
    setConversationTaskVoiceStatus('Impossible de démarrer le micro. Tu peux écrire ta réponse.', 'error');
  }
}
function conversationTaskAlternativesHtml(turn) {
  const alternatives = (turn.accepted || []).map(function (item) { return Array.isArray(item) ? item[0] : item; })
    .filter(function (jp) { return jp && jp !== turn.model.jp; }).slice(0, 3);
  if (!alternatives.length) return '';
  return '<details class="conv-alt"><summary>Autres formulations acceptées</summary><ul><li lang="ja">' +
    alternatives.map(esc).join('</li><li lang="ja">') + '</li></ul></details>';
}
function conversationTaskFeedbackHtml(scenario, turn) {
  const result = session.conversationResult || { good: false, answer: '' };
  const last = !session.tasks.length;
  const practice = !!(session.task && session.task.conversationPractice);
  return '<div class="session-card conversation-task-card conversation-task-feedback ' + (result.good ? 'good' : 'bad') + '" data-testid="conversation-task-feedback" data-practice="' + (practice ? '1' : '0') + '">' +
    '<p class="eyebrow">' + (practice ? 'Conversation du jour' : 'Conversation · ' + esc(scenario.title)) + '</p>' +
    '<div class="conv-verdict">' + (result.good ? '✅ Bonne réponse !' : '💡 Presque !') + '</div>' +
    '<p class="conv-attempt">Ta réponse : <b lang="ja">' + esc(result.answer) + '</b></p>' +
    (result.pronunciation ? conversationPronunciationHtml(result.pronunciation) : '') +
    '<div class="conv-model"><p class="eyebrow">Réponse modèle</p><p class="conv-jp" lang="ja">' + esc(turn.model.jp) + '</p>' +
    '<p class="conv-reading">' + esc(turn.model.reading) + '</p><p class="conv-romaji">' + esc(turn.model.romaji) + '</p>' +
    '<p class="conv-fr">' + esc(turn.model.fr) + '</p>' +
    wordByWordDetails(turn.model.jp, 'conv-word-by-word', 'conversation-model-word-by-word') +
    '<div class="conversation-actions"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(turn.model.jp) + '">🔊 Écouter</button></div></div>' +
    '<p class="conv-tip"><b>À retenir :</b> ' + esc(turn.tip) + '</p>' +
    conversationTaskAlternativesHtml(turn) +
    (!result.good ? '<p class="hint">Cette réplique reste dans « Tes phrases à revoir ».</p>' : '') +
    '<div class="conversation-actions"><button class="btn primary" data-action="continue-session" data-testid="session-next">' + (last ? 'Voir le bilan' : 'Continuer') + ' <kbd>Entrée</kbd></button>' +
    (!result.good ? '<button class="btn ghost" data-action="conversation-task-retry" data-testid="conversation-task-retry">Réessayer</button>' : '') + '</div></div>';
}
function submitConversationTask(form) {
  if (!session || session.mode !== 'conversation' || session.phase !== 'question' || !session.task) return;
  const input = form.querySelector('input[name="answer"]');
  const answer = String((input && input.value) || '').trim();
  if (!answer) { toast('Écris une réponse.'); return; }
  const task = session.task;
  const turn = task.conversationTurn;
  const spoke = !!session.conversationVoiceUsed;
  stopConversationTaskVoice();
  const good = !!(CONV && CONV.checkAnswer(answer, turn.accepted, turn));
  let pronunciation = null;
  if (spoke && good && window.Kotoba.Pronunciation && window.Kotoba.Pronunciation.best) {
    const result = window.Kotoba.Pronunciation.best([answer], conversationPronunciationEntry(turn));
    if (result) pronunciation = { score: result.score, good: result.good, tip: result.tip };
  }
  const xp = S.addXp(state, good ? 10 : 3, Date.now());
  session.conversationAnswer = answer;
  session.conversationResult = { good: good, answer: answer, pronunciation: pronunciation, spoken: spoke };
  session.done++;
  if (good) session.correct++;
  session.xp += xp;
  session.lastGrade = good ? 'good' : 'again';
  session.lastXp = xp;
  session.lastDue = 0;
  recordConversationReview(task.conversationScenario.id, task.conversationTurnIndex, good);
  session.phase = 'feedback';
  persist();
  flashValidation(good ? 'good' : 'again');
  toast(good ? '✅ Bonne réponse' : '❌ Réplique à retravailler');
  renderSession();
  updateChrome();
  const next = $('[data-testid="session-next"]');
  if (next) next.focus();
}
function retryConversationTask() {
  if (!session || session.mode !== 'conversation' || !session.task) return;
  stopConversationTaskVoice();
  session.phase = 'question';
  session.conversationResult = null;
  session.conversationAnswer = '';
  session.conversationVoiceUsed = false;
  session.lastGrade = null;
  session.lastDue = 0;
  renderSession();
}
function conversationSummaryHtml() {
  const scenario = conversationState.scenario;
  const total = conversationTotal();
  const correct = conversationState.correct;
  const missedCount = conversationState.missed.length;
  const allGood = correct === total;
  const lines = conversationState.queue.map(function (turnIndex) {
    const turn = scenario.turns[turnIndex];
    const ok = conversationState.results[turnIndex] === true;
    return '<div class="conv-summary-line ' + (ok ? 'good' : 'missed') + '"><span class="conv-summary-mark">' + (ok ? '✓ Juste' : 'À revoir') + '</span>' +
      '<p class="conv-jp" lang="ja">' + esc(turn.model.jp) + '</p><p class="conv-fr">' + esc(turn.model.fr) + '</p>' +
      '<button class="btn ghost small" data-action="speak-text" data-text="' + attr(turn.model.jp) + '">🔊</button></div>';
  }).join('');
  const lead = allGood
    ? (conversationState.review ? 'Toutes les répliques ciblées sont justes.' : 'Toutes les répliques sont justes.')
    : correct + ' réponse' + (correct === 1 ? '' : 's') + ' juste' + (correct === 1 ? '' : 's') + ' sur ' + total + '. Les répliques marquées « À revoir » peuvent être rejouées seules.';
  const retryLabel = missedCount === 1 ? 'Rejouer la réplique ratée' : 'Rejouer les ' + missedCount + ' répliques ratées';
  return '<section class="panel conversation-session conversation-summary" data-testid="conversation-summary">' +
    '<p class="eyebrow">' + (conversationState.review ? 'Révision ciblée terminée' : 'Conversation terminée') + '</p><h2>' + esc(scenario.title) + '</h2>' +
    '<p class="lead">' + lead + ' Tu peux rejouer ou choisir une autre situation.</p>' +
    '<div class="summary-stats"><div><b>' + correct + '/' + total + '</b><span>réponses justes</span></div><div><b>' + esc(scenario.level) + '</b><span>niveau</span></div></div>' +
    '<div class="conv-summary-lines">' + lines + '</div>' +
    '<p class="hint">' + (allGood ? 'Maintenant, dis les réponses à voix haute sans regarder. C’est le passage à la conversation réelle.' : 'Rejoue les répliques ratées pendant qu’elles sont fraîches : tu ne refais que celles-ci.') + '</p>' +
    '<div class="conversation-actions">' + (missedCount ? '<button class="btn primary" data-action="retry-missed-conversation" data-testid="conversation-retry-missed">' + retryLabel + '</button>' : '') +
    '<button class="btn ' + (missedCount ? 'ghost' : 'primary') + '" data-action="start-conversation" data-id="' + attr(scenario.id) + '" data-testid="conversation-restart">Refaire la situation</button>' +
    '<button class="btn ghost" data-action="close-conversation" data-testid="conversation-other">Autre situation</button></div></section>';
}
function startConversation(id, options) {
  if (!CONV) return;
  const scenario = CONV.scenarioById ? CONV.scenarioById(id) : null;
  if (!scenario) { toast('Situation introuvable.'); return; }
  const requested = options && Array.isArray(options.turnIndices)
    ? options.turnIndices.filter(function (idx) { return Number.isInteger(idx) && idx >= 0 && idx < scenario.turns.length; })
    : [];
  const unique = requested.filter(function (idx, pos) { return requested.indexOf(idx) === pos; });
  const review = unique.length > 0;
  const queue = review ? unique : scenario.turns.map(function (_, idx) { return idx; });
  conversationState = { scenario: scenario, queue: queue, review: review, results: {}, missed: [], index: 0, feedback: null, completed: false, correct: 0, listen: false, revealed: false, recognition: null, voiceToken: 0, voiceUsed: false };
  try { history.replaceState(null, '', '#parler'); } catch (e) { location.hash = 'parler'; }
  showView('conversation');
  setTimeout(function () { const input = $('#conversationAnswer'); if (input) input.focus(); }, 80);
}
function retryMissedConversation() {
  if (!conversationState || !conversationState.missed.length) return;
  const id = conversationState.scenario.id;
  const turnIndices = conversationState.missed.slice();
  startConversation(id, { turnIndices: turnIndices });
}
function recordConversationReview(scenarioId, turnIndex, ok) {
  if (!state.conversationReview || typeof state.conversationReview !== 'object') state.conversationReview = {};
  const key = String(scenarioId) + ':' + turnIndex;
  const previous = state.conversationReview[key];
  const now = Date.now();
  if (!state.flags || typeof state.flags !== 'object') state.flags = {};
  state.flags.conversationDay = S.todayKey(now);
  S.touchDay(state, now);
  if (!state.stats.conversation || typeof state.stats.conversation !== 'object') state.stats.conversation = {};
  const day = S.todayKey(now);
  state.stats.conversation[day] = (Number(state.stats.conversation[day]) || 0) + 1;
  if (ok) {
    if (previous) previous.clearedAt = Math.max(now, Number(previous.clearedAt) || 0);
  } else {
    state.conversationReview[key] = {
      scenario: scenarioId,
      turn: turnIndex,
      missedAt: now,
      clearedAt: 0,
      count: Math.max(1, (Number(previous && previous.count) || 0) + 1)
    };
  }
  persist();
}
function conversationPronunciationEntry(turn) {
  const alternatives = [];
  (turn.accepted || []).forEach(function (item) {
    const jp = Array.isArray(item) ? item[0] : item;
    const reading = Array.isArray(item) ? (item[1] || item[0]) : item;
    if (jp && jp !== turn.model.jp) alternatives.push({ jp: jp, reading: reading });
  });
  return { jp: turn.model.jp, reading: turn.model.reading, alternatives: alternatives };
}
function conversationPronunciationHtml(p) {
  const score = Math.max(0, Math.min(100, Number(p.score) || 0));
  return '<div class="conv-pronunciation ' + (p.good ? 'good' : 'warn') + '" data-testid="conversation-pronunciation">' +
    '<div class="conv-pron-head"><span>🎙️ Prononciation</span><b data-testid="conversation-pronunciation-score">' + score + ' %</b></div>' +
    '<div class="conv-pron-bar" aria-hidden="true"><span style="width:' + score + '%"></span></div>' +
    '<p>' + esc(p.tip || 'Réécoute le modèle et répète à voix haute.') + '</p></div>';
}
function submitConversation(form) {
  if (!conversationState || conversationState.completed) return;
  const input = form.querySelector('input[name="answer"]');
  const answer = String((input && input.value) || '').trim();
  if (!answer) { toast('Écris une réponse.'); return; }
  const spoke = !!conversationState.voiceUsed;
  stopConversationVoice();
  const turn = conversationTurn();
  const turnIndex = conversationTurnIndex();
  const ok = !!(CONV && CONV.checkAnswer(answer, turn.accepted, turn));
  let pronunciation = null;
  if (spoke && ok && window.Kotoba.Pronunciation && window.Kotoba.Pronunciation.best) {
    const result = window.Kotoba.Pronunciation.best([answer], conversationPronunciationEntry(turn));
    if (result) pronunciation = { score: result.score, good: result.good, tip: result.tip };
  }
  conversationState.results[turnIndex] = ok;
  if (ok) conversationState.missed = conversationState.missed.filter(function (idx) { return idx !== turnIndex; });
  else if (conversationState.missed.indexOf(turnIndex) < 0) conversationState.missed.push(turnIndex);
  conversationState.correct = conversationState.queue.filter(function (idx) { return conversationState.results[idx] === true; }).length;
  recordConversationReview(conversationState.scenario.id, turnIndex, ok);
  conversationState.feedback = { ok: ok, answer: answer, pronunciation: pronunciation };
  renderConversation();
  const next = $('[data-action="next-conversation"]');
  if (next) next.focus();
}
function nextConversation() {
  if (!conversationState || !conversationState.feedback) return;
  stopConversationVoice();
  if (conversationState.index + 1 >= conversationTotal()) {
    conversationState.completed = true;
    conversationState.feedback = null;
  } else {
    conversationState.index += 1;
    conversationState.feedback = null;
  }
  conversationState.revealed = false;
  conversationState.voiceUsed = false;
  renderConversation();
  window.scrollTo(0, 0);
  setTimeout(function () { const input = $('#conversationAnswer'); if (input) input.focus(); }, 60);
  if (conversationState.listen && !conversationState.completed) setTimeout(speakConversationPartner, 220);
}
function retryConversation() {
  if (!conversationState) return;
  stopConversationVoice();
  conversationState.feedback = null;
  conversationState.revealed = false;
  conversationState.voiceUsed = false;
  renderConversation();
  setTimeout(function () { const input = $('#conversationAnswer'); if (input) input.focus(); }, 60);
}
function closeConversation() {
  stopConversationVoice();
  conversationState = null;
  renderConversation();
  window.scrollTo(0, 0);
}
function toggleConversationListen() {
  if (!conversationState || conversationState.completed) return;
  conversationState.listen = !conversationState.listen;
  conversationState.revealed = false;
  renderConversation();
  if (conversationState.listen) setTimeout(speakConversationPartner, 120);
}
function speakConversationPartner() {
  if (!conversationState || conversationState.completed || conversationState.feedback) return;
  const turn = conversationTurn();
  if (turn) speak(turn.partner.jp, Math.max(0.5, (state.settings.rate || 0.9) * 0.72));
}
function revealConversation() {
  if (!conversationState || conversationState.completed) return;
  conversationState.revealed = true;
  renderConversation();
  setTimeout(function () { const input = $('#conversationAnswer'); if (input) input.focus(); }, 60);
}
function randomConversation() {
  if (!CONV || !Array.isArray(CONV.scenarios) || !CONV.scenarios.length) return;
  const pool = CONV.scenarios.filter(function (scenario) {
    return !conversationState || conversationState.scenario.id !== scenario.id;
  });
  const pick = (pool.length ? pool : CONV.scenarios)[Math.floor(Math.random() * (pool.length ? pool.length : CONV.scenarios.length))];
  if (pick) startConversation(pick.id);
}
function goConversation() {
  stopConversationVoice();
  conversationState = null;
  try { history.replaceState(null, '', '#parler'); } catch (e) { location.hash = 'parler'; }
  showView('conversation');
}
function renderHome() {
  const now = Date.now();
  const c = S.counts(entries, state, now);
  const ps = pronunciationStats();
  const stages = S.stageCounts(entries, state);
  const xp = todayXp();
  const goal = state.settings.goal || 50;
  const pct = Math.min(100, Math.round(xp / goal * 100));
  const g = greeting();
  const wotd = entries.length ? entries[Math.floor(now / 86400000) % entries.length] : null;
  const primaryKind = c.due ? 'due' : (c.new ? 'new' : 'all');
  const primaryLabel = c.due ? 'Réviser mes mots · ' + c.due : (c.new ? 'Apprendre de nouveaux mots' : 'Tout revoir');
  const units = (window.UNITS_DATA || []).map(function (unit) {
    const st = unitStats(unit.id, now);
    const p = st.total ? Math.round(st.seen / st.total * 100) : 0;
    return '<button class="theme-card" data-action="start" data-kind="unit" data-unit="' + attr(unit.id) + '" data-mode="recall">' +
      '<span class="theme-top"><span class="theme-emoji">' + esc(unit.emoji || '📘') + '</span><span class="theme-name">' + esc(unit.name) + '</span></span>' +
      '<span class="theme-meta"><span>' + st.seen + '/' + st.total + ' vus</span><span>' + (st.due ? st.due + ' à revoir' : st.known + ' connus') + '</span></span>' +
      '<span class="bar"><span class="bar-fill" style="width:' + p + '%"></span></span></button>';
  }).join('');
  let body = '<section class="hero">' +
    '<div><p class="eyebrow">' + esc(g.jp) + ' · ' + esc(g.fr) + '</p>' +
      '<h1>' + (c.due ? 'On révise un peu ?' : (c.new ? 'Prêt à apprendre ?' : 'Tout est à jour.')) + '</h1>' +
      '<p class="lead">' + (c.due
        ? plural(c.due, 'carte t\'attend', 'cartes t\'attendent') + ' aujourd\'hui. Un petit tour et ta mémoire te dira merci.'
        : (c.new ? plural(c.new, 'nouveau mot', 'nouveaux mots') + ' à découvrir. Commence par cinq, tu verras.'
          : 'Reviens demain pour entretenir ta mémoire, ou révise tout ce que tu connais déjà.')) + '</p>' +
      '<div class="hero-actions"><button class="btn primary big" data-action="start" data-kind="' + primaryKind + '" data-mode="recall" data-testid="cta-main">' + primaryLabel + '</button>' +
      (primaryKind !== 'new' && c.new ? '<button class="btn ghost" data-action="start" data-kind="new" data-mode="recall" data-testid="cta-learn">Apprendre de nouveaux mots · ' + c.new + '</button>' : '') +
      (c.seen ? '<button class="btn ghost" data-action="start" data-kind="all" data-mode="recall">Tout revoir</button>' : '') + '</div>' +
      '<p class="hero-sub">' + (c.due ? plural(c.due, 'carte due', 'cartes dues') : (c.new ? plural(c.new, 'mot à découvrir', 'mots à découvrir') : 'Série : ' + (state.stats.streak || 0) + ' jour(s)')) + '</p></div>' +
    '<div class="goal-ring" aria-label="Objectif quotidien : ' + xp + ' sur ' + goal + ' XP"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="52"></circle>' +
      '<circle class="ring-fill" cx="60" cy="60" r="52" stroke-dasharray="' + (pct / 100 * 326.7).toFixed(1) + ' 326.7"></circle></svg>' +
      '<div class="ring-label"><b>' + xp + '</b><span>/ ' + goal + ' XP</span></div></div></section>' +
    '<div class="stat-row"><div class="stat-card"><span class="stat-num">' + c.due + '</span><span class="stat-label">À réviser</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + c.known + '</span><span class="stat-label">Mots connus</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + c.new + '</span><span class="stat-label">Nouveaux</span></div></div>' +
    (window.Kotoba.Motivation ? window.Kotoba.Motivation.streakPanel(state, now) : '') +
    journeyPanelHtml(stages) +
    dailyPlanPanelHtml() +
    readingPanelHtml() +
    conversationPanelHtml() +
    accountPanelHtml() +
    phrasePanelHtml() +
    (ps.attempts ? pronunciationPanelHtml(ps) : '') +
    '<section class="panel"><div class="panel-head"><h2>Mes thèmes</h2><p>' + c.seen + '/' + c.total + ' mots découverts · 1 000 courants + 60 escalade</p></div><div class="theme-grid">' + units + '</div></section>';
  if (wotd) {
    body += '<section class="panel"><div class="panel-head"><h2>Mot du jour</h2><button class="btn ghost small" data-action="speak-text" data-text="' + attr(wotd.jp) + '">🔊 Écouter</button></div>' +
      '<div class="wotd"><div><div class="wotd-fr">' + frHtml(wotd.fr) + '</div><div class="wotd-jp" lang="ja">' + wordRubyHtml(wotd) + '</div>' +
      '<div class="muted small">' + esc(wotd.romaji) + '</div></div><div><p class="wotd-context sentence-tip" lang="ja"' + translationTipAttrs(wotd.contextFr, wotd.context) + '>' + contextHtml(wotd.context, wotd.hl, wotd) + '</p>' +
      '<p class="muted small">' + esc(wotd.contextFr) + '</p>' + wordByWordDetails(wotd.context, 'wotd-word-by-word') + '<button class="btn ghost small" data-action="detail" data-id="' + attr(wotd.id) + '">Voir la fiche</button></div></div></section>';
  }
$('#view-learn').innerHTML = body;
}

/* ---------- Histoires immersives ---------- */
function storyRecord(id) {
  const map = state.immersion && typeof state.immersion === 'object' ? state.immersion : {};
  const record = map[id];
  return record && typeof record === 'object' ? record : null;
}
function storyReadCount() {
  return Object.keys(state.immersion || {}).filter(function (id) {
    const record = storyRecord(id);
    return !!(record && record.completedAt);
  }).length;
}
function storyLevelLabel(story) {
  if (!story) return '';
  const cefr = IMM && IMM.storyCefr ? IMM.storyCefr(story) : '';
  return cefr ? cefr + ' · ' + story.level : String(story.level || '');
}
function storyOfDay(now) {
  if (!IMM || !IMM.stories.length) return null;
  return IMM.stories[Math.floor((Number(now) || Date.now()) / 86400000) % IMM.stories.length];
}
function storyLineText(line) {
  if (!line) return '';
  return IMM ? IMM.lineJp(line) : P.stripAnnotations(line.ruby || '');
}
function readingPanelHtml() {
  if (!IMM || !IMM.stories.length) return '';
  const story = storyOfDay(Date.now());
  if (!story) return '';
  const record = storyRecord(story.id);
  const done = !!(record && record.completedAt);
  const doneToday = !!(record && record.lastRewardDay === S.todayKey());
  return '<section class="panel reading-panel" data-testid="reading-panel">' +
    '<div class="panel-head"><div><p class="eyebrow">Immersion</p><h2>Lis une histoire aujourd’hui</h2>' +
    '<p>Du japonais qui raconte quelque chose, avec l’audio, la traduction et deux questions.</p></div>' +
    '<button class="btn ghost small" data-action="go-reading" data-testid="go-reading">Toutes les histoires</button></div>' +
    '<button class="reading-daily-card tone-' + attr(story.tone || 'mint') + '" data-action="open-story" data-id="' + attr(story.id) + '" data-testid="reading-daily-open">' +
      '<span class="reading-daily-art" aria-hidden="true">' + esc(story.emoji) + '</span>' +
      '<span class="reading-daily-copy"><span class="story-level">' + esc(storyLevelLabel(story)) + ' · ' + story.lines.length + ' lignes · ' + story.minutes + ' min</span>' +
        '<strong>' + esc(story.title) + '</strong><small lang="ja">' + rubyHtml(story.titleJp, state.settings.furigana) + '</small>' +
        '<span class="reading-daily-desc">' + esc(story.description) + '</span></span>' +
      '<span class="reading-daily-cta">' + (done ? (doneToday ? 'Lue aujourd’hui ✓' : 'Relire →') : 'Lire →') + '</span></button>' +
    '<p class="hint">' + storyReadCount() + ' / ' + IMM.stories.length + ' histoires lues · chaque histoire terminée rapporte de l’XP.</p></section>';
}
function renderReading() {
  const host = $('#view-reading');
  if (!host) return;
  if (!IMM) {
    host.innerHTML = '<div class="panel"><h2>Histoires indisponibles</h2><p>Le module d’immersion n’a pas pu être chargé. Recharge la page.</p></div>';
    return;
  }
  const story = immersionState ? IMM.storyById(immersionState.id) : null;
  host.innerHTML = story ? storyReaderHtml(story) : readingListHtml();
}
function readingListHtml() {
  const levels = [['all', 'Toutes'], ['A1', 'A1'], ['A2', 'A2'], ['B1', 'B1'], ['B2', 'B2'], ['N5', 'N5'], ['N5+', 'N5+'], ['N4', 'N4'], ['N2', 'N2']];
  const chips = levels.map(function (level) {
    return '<button class="chip' + (ui.storyLevel === level[0] ? ' active' : '') + '" data-action="story-filter" data-level="' + attr(level[0]) + '">' + level[1] + '</button>';
  }).join('');
  const cefrOrder = { A1: 0, A2: 1, B1: 2, B2: 3 };
  const stories = IMM.stories.slice().sort(function (a, b) {
    const left = cefrOrder[a.cefr];
    const right = cefrOrder[b.cefr];
    return (left == null ? 9 : left) - (right == null ? 9 : right);
  }).filter(function (story) { return ui.storyLevel === 'all' || story.cefr === ui.storyLevel || story.level === ui.storyLevel; });
  const cards = stories.map(storyCardHtml).join('');
  return '<section class="panel reading-hero" data-testid="reading-list">' +
    '<div class="reading-hero-copy"><p class="eyebrow">Immersion guidée</p><h2>Lis du japonais qui raconte quelque chose</h2>' +
    '<p class="lead">' + IMM.stories.length + ' histoires originales, du N5 au N2. Des scènes du quotidien, des situations sociales et un bilan A1 à B2 conversationnel pour savoir quoi travailler.</p></div>' +
    '<div class="reading-hero-stats"><b>' + IMM.stories.length + '</b><span>histoires</span><small>' + storyReadCount() + ' lue' + (storyReadCount() === 1 ? '' : 's') + '</small></div></div>' +
    levelProfileHtml() +
    '<div class="reading-toolbar"><div class="chips">' + chips + '</div><span class="hint">Une histoire = quelques minutes de vrai japonais.</span></div>' +
    '<div class="story-grid">' + cards + '</div>' +
    '<section class="panel reading-how"><div class="panel-head"><div><p class="eyebrow">Comment lire</p><h2>Le bon niveau de difficulté</h2></div></div>' +
    '<div class="reading-how-grid"><div><b>1</b><strong>Lis sans traduire</strong><span>Cherche le verbe à la fin et repère les particules.</span></div>' +
    '<div><b>2</b><strong>Écoute et répète</strong><span>Une ligne, une voix : ralentis avec le bouton 🐢.</span></div>' +
    '<div><b>3</b><strong>Vérifie</strong><span>Deux questions pour transformer la lecture en mémoire.</span></div></div></section>';
}
function levelProfileHtml() {
  if (!IMM || !IMM.assessLevel) return '';
  const profile = IMM.assessLevel(state.immersion);
  const info = IMM.cefrLevels && IMM.cefrLevels[profile.code] ? IMM.cefrLevels[profile.code] : {};
  const stats = profile.stats || { A1: { passed: 0, solid: 0, total: 0 }, A2: { passed: 0, solid: 0, total: 0 }, B1: { passed: 0, solid: 0, total: 0 }, B2: { passed: 0, solid: 0, total: 0 } };
  const criteria = {
    A1: stats.A1.passed + ' / 3 histoires A1 validées',
    A2: stats.A2.solid + ' / 4 histoires A2 à 100 %',
    B1: stats.B1.solid + ' / 2 histoires B1 à 100 %',
    B2: stats.B2.solid + ' / 2 histoires B2 à 100 %'
  };
  const criterion = criteria[profile.code] || '';
  const levelName = profile.code === 'B2' ? 'B2 conversationnel' : profile.code;
  return '<section class="panel level-profile" data-testid="level-profile">' +
    '<div class="level-profile-head"><div><p class="eyebrow">Mon niveau de lecture</p><h2>Niveau ' + esc(levelName) + ' <small>' + esc(profile.status) + '</small></h2>' +
    '<p class="hint">' + esc(info.title || '') + ' · ' + esc(criterion) + '</p></div>' +
    '<div class="level-profile-badge" aria-hidden="true">' + esc(profile.code) + '</div></div>' +
    '<div class="level-profile-bar" role="progressbar" aria-label="Progression du niveau" aria-valuenow="' + profile.progress + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + profile.progress + '%"></span></div>' +
    '<ul class="level-profile-can">' + (info.can || []).map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>' +
    '<p class="level-profile-scale"><b>Parcours :</b> A1 dès 1 histoire · A2 à 3 A1 + 2 A2 · A2 consolidé à 4 A2 sur 7 à 100 % · B1 à +2 B1 · B2 à +2 B2 · B2 consolidé à 2 B2 sur 2 à 100 %.</p>' +
    '<p class="hint">' + esc(profile.next) + '</p>' +
    '<p class="level-profile-note">Estimation d’entraînement fondée sur des critères A1 à B2, pas un examen officiel.</p></section>';
}
function storyCardHtml(story) {
  const record = storyRecord(story.id);
  const done = !!(record && record.completedAt);
  const best = record && record.total ? ' · ' + record.bestScore + '/' + record.total : '';
  return '<button class="story-card tone-' + attr(story.tone || 'mint') + (done ? ' is-read' : '') + '" data-action="open-story" data-id="' + attr(story.id) + '" data-testid="story-card-' + attr(story.id) + '">' +
    '<span class="story-card-top"><span class="story-emoji" aria-hidden="true">' + esc(story.emoji) + '</span><span class="story-level">' + esc(storyLevelLabel(story)) + '</span></span>' +
    '<strong>' + esc(story.title) + '</strong><span class="story-card-jp" lang="ja">' + rubyHtml(story.titleJp, state.settings.furigana) + '</span>' +
    '<span class="story-card-desc">' + esc(story.description) + '</span>' +
    '<span class="story-card-meta"><span>' + story.lines.length + ' lignes · ' + story.minutes + ' min</span><span class="' + (done ? 'story-done' : '') + '">' + (done ? 'Lue ✓' + best : 'À découvrir') + '</span></span></button>';
}
function storyReaderHtml(story) {
  if (!story) { immersionState = null; renderReading(); return ''; }
  const shownAll = !!immersionState.showAll;
  const lines = story.lines.map(function (line, index) {
    const shown = shownAll || !!immersionState.translations[index];
    return '<div class="story-line" data-testid="story-line-' + index + '">' +
      '<div class="story-line-main"><p class="story-jp" lang="ja">' + rubyHtml(line.ruby, state.settings.furigana) + '</p>' +
      '<div class="story-line-actions"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(storyLineText(line)) + '" aria-label="Écouter la ligne ' + (index + 1) + '">🔊</button>' +
      '<button class="btn ghost small" data-action="story-translation" data-index="' + index + '" data-testid="story-translation-' + index + '" aria-expanded="' + (shown ? 'true' : 'false') + '">' + (shown ? 'Masquer' : 'Traduire') + '</button></div></div>' +
      (shown ? '<p class="story-fr" data-testid="story-fr-' + index + '">' + esc(line.fr) + '</p>' : '') +
      wordByWordDetails(storyLineText(line), 'story-word-by-word', 'story-word-by-word-' + index) + '</div>';
  }).join('');
  return '<section class="panel story-reader" data-testid="story-reader">' +
    '<div class="story-reader-top"><button class="btn ghost small" data-action="close-story" data-testid="story-close">← Toutes les histoires</button><span class="story-level">' + esc(storyLevelLabel(story)) + ' · ' + story.minutes + ' min</span></div>' +
    '<div class="story-reader-head tone-' + attr(story.tone || 'mint') + '"><span class="story-reader-emoji" aria-hidden="true">' + esc(story.emoji) + '</span><div><p class="eyebrow">Histoire ' + story.lines.length + ' lignes</p><h2>' + esc(story.title) + '</h2><p class="story-reader-jp" lang="ja">' + rubyHtml(story.titleJp, state.settings.furigana) + '</p><p class="story-scene">' + esc(story.scene) + '</p></div></div>' +
    '<div class="story-reader-actions"><button class="btn primary" data-action="story-audio-all" data-testid="story-audio-all">🔊 Écouter l’histoire</button><button class="btn ghost" data-action="story-translations-all" data-testid="story-translations-all">' + (shownAll ? 'Masquer les traductions' : 'Afficher les traductions') + '</button></div>' +
    '<div class="story-lines">' + lines + '</div>' +
    '<div class="story-reader-foot"><button class="btn primary" data-action="story-quiz-open" data-testid="story-quiz-start">🧠 Vérifier ma compréhension</button><span class="hint">Deux questions, sans stress : relis une ligne si besoin.</span></div>' +
    storyQuizHtml(story) + storyFocusHtml(story) + '</section>';
}
function storyQuizHtml(story) {
  if (!immersionState || (!immersionState.quizOpen && !immersionState.result)) return '';
  const result = immersionState.result;
  const answered = story.questions.filter(function (_, index) { return immersionState.answers[index] != null; }).length;
  const questions = story.questions.map(function (question, qi) {
    const options = question.options.map(function (option, oi) {
      const chosen = Number(immersionState.answers[qi]) === oi;
      let cls = 'story-option' + (chosen ? ' selected' : '');
      if (result) {
        if (oi === question.answer) cls += ' correct';
        else if (chosen) cls += ' wrong';
      }
      return '<button class="' + cls + '" data-action="story-option" data-question="' + qi + '" data-option="' + oi + '" data-testid="story-option-' + qi + '-' + oi + '"' + (result ? ' disabled' : '') + ' aria-pressed="' + (chosen ? 'true' : 'false') + '">' + esc(option) + '</button>';
    }).join('');
    return '<div class="story-question" data-testid="story-question-' + qi + '"><p><b>' + (qi + 1) + '.</b> ' + esc(question.q) + '</p><div class="story-options">' + options + '</div>' +
      (result ? '<p class="story-explanation ' + (result.results[qi] ? 'good' : 'bad') + '">' + (result.results[qi] ? '✓ ' : '✗ ') + esc(question.explain) + '</p>' : '') + '</div>';
  }).join('');
  const resultHtml = result
    ? '<div class="story-result ' + (result.score === result.total ? 'good' : 'warn') + '" data-testid="story-result"><div class="story-result-score"><b>' + result.score + ' / ' + result.total + '</b><span>bonnes réponses</span></div><div><p>' + (result.score === result.total ? 'Tu as tout compris. Continue avec une histoire du même niveau, ou relis celle-ci à voix haute.' : 'Ce n’est pas grave : relis les lignes et réessaie. Comprendre une histoire, c’est déjà parler japonais.') + '</p>' + (result.reward ? '<span class="story-reward">+' + result.reward + ' XP</span>' : '<span class="hint">Histoire déjà récompensée aujourd’hui.</span>') + '</div><button class="btn ghost small" data-action="story-quiz-retry" data-testid="story-quiz-retry">Recommencer le quiz</button></div>' + storyLevelFeedbackHtml(story, result)
    : '<div class="story-quiz-actions"><button class="btn primary" data-action="story-quiz-submit" data-testid="story-quiz-submit"' + (answered === story.questions.length ? '' : ' disabled') + '>Valider mes réponses</button><span class="hint">' + answered + ' / ' + story.questions.length + ' réponse' + (story.questions.length === 1 ? '' : 's') + ' sélectionnée' + (answered === 1 ? '' : 's') + '.</span></div>';
  return '<section class="story-quiz" id="storyQuiz" data-testid="story-quiz"><div class="story-quiz-head"><div><p class="eyebrow">Compréhension</p><h3>As-tu suivi l’histoire ?</h3></div><span class="story-quiz-count">' + answered + ' / ' + story.questions.length + '</span></div>' + questions + resultHtml + '</section>';
}
function storyLevelFeedbackHtml(story, result) {
  if (!IMM || !result) return '';
  const profile = IMM.assessLevel(state.immersion);
  const missed = [];
  (story.questions || []).forEach(function (question, index) {
    if (result.results[index]) return;
    const key = question.skill || 'comprehension';
    if (missed.indexOf(key) < 0) missed.push(key);
  });
  const target = IMM.storyCefr(story);
  const passed = result.total > 0 && result.score >= Math.ceil(result.total / 2);
  const actions = missed.map(function (key) {
    const skill = IMM.skills && IMM.skills[key] ? IMM.skills[key] : { label: 'Compréhension', tip: 'Relis l’histoire et vérifie les informations clés.' };
    return '<li><b>' + esc(skill.label) + '</b> — ' + esc(skill.tip) + '</li>';
  }).join('');
  return '<section class="story-level-feedback" data-testid="story-level-feedback">' +
    '<div class="story-level-feedback-badge"><span>Niveau estimé</span><b>' + esc(profile.code) + '</b><small>' + esc(profile.status) + '</small></div>' +
    '<div><p class="story-level-target"><b>Cette histoire : ' + esc(target) + '</b> · ' + (passed ? 'validée' : 'à consolider') + '</p>' +
    (actions ? '<p class="story-level-action"><b>À travailler :</b></p><ul class="story-level-action-list">' + actions + '</ul>' : '<p class="story-level-action"><b>Prochaine étape :</b> ' + esc(profile.next) + '</p>') +
    (actions ? '<p class="hint">' + esc(profile.next) + '</p>' : '') +
    '</div></section>';
}
function storyFocusJpHtml(item) {
  const jp = String(item && item.jp || '');
  const kana = glossaryKana(jp);
  const annotated = kana && P.hasKanji(jp) ? P.annotate(jp, kana) : jp;
  return rubyHtml(annotated, state.settings.furigana);
}
function storyFocusHtml(story) {
  const focus = Array.isArray(story.focus) ? story.focus : [];
  if (!focus.length) return '';
  const matched = focusEntriesForStory(story);
  const chips = focus.map(function (item) {
    const entry = storyEntryForFocus(item);
    return entry
      ? '<button class="story-focus-chip" data-action="detail" data-id="' + attr(entry.id) + '">' + storyFocusJpHtml(item) + '<small>' + esc(item.fr) + '</small></button>'
      : '<span class="story-focus-chip">' + storyFocusJpHtml(item) + '<small>' + esc(item.fr) + '</small></span>';
  }).join('');
  return '<section class="story-focus" data-testid="story-focus"><div class="story-focus-head"><div><p class="eyebrow">Vocabulaire</p><h3>Les mots de l’histoire</h3></div>' +
    (matched.length ? '<button class="btn ghost small" data-action="story-review-words" data-id="' + attr(story.id) + '" data-testid="story-review-words">Réviser ces ' + matched.length + ' mots</button>' : '') + '</div>' +
    '<div class="story-focus-list">' + chips + '</div><p class="hint">Les mots déjà dans ta collection ouvrent leur fiche. Ceux qui manquent restent affichés avec leur sens.</p></section>';
}
function storyEntryForFocus(item) {
  if (!item || !item.jp) return null;
  const key = normalizeGlossKey(item.jp);
  return entries.filter(function (entry) {
    return normalizeGlossKey(entry.jp) === key || normalizeGlossKey(entry.dictionaryForm) === key || normalizeGlossKey(entry.reading) === key;
  })[0] || null;
}
function focusEntriesForStory(story) {
  const seen = {};
  return (story.focus || []).map(storyEntryForFocus).filter(function (entry) {
    if (!entry || seen[entry.id]) return false;
    seen[entry.id] = true;
    return true;
  });
}
function openStory(id) {
  if (!IMM) return;
  const story = IMM.storyById(id);
  if (!story) { toast('Histoire introuvable.'); return; }
  immersionState = { id: story.id, translations: {}, showAll: false, quizOpen: false, answers: {}, result: null };
  try { history.replaceState(null, '', '#histoires'); } catch (e) { location.hash = 'histoires'; }
  showView('reading');
}
function closeStory() {
  immersionState = null;
  renderReading();
  window.scrollTo(0, 0);
}
function goReading() {
  immersionState = null;
  try { history.replaceState(null, '', '#histoires'); } catch (e) { location.hash = 'histoires'; }
  showView('reading');
}
function toggleStoryTranslation(index) {
  if (!immersionState || !IMM) return;
  const story = IMM.storyById(immersionState.id);
  if (!story) return;
  const idx = Number(index);
  if (!isFinite(idx) || idx < 0 || idx >= story.lines.length) return;
  if (immersionState.showAll) {
    immersionState.showAll = false;
    story.lines.forEach(function (_, i) { immersionState.translations[i] = true; });
  }
  immersionState.translations[idx] = !immersionState.translations[idx];
  renderReading();
}
function toggleAllStoryTranslations() {
  if (!immersionState || !IMM) return;
  const story = IMM.storyById(immersionState.id);
  if (!story) return;
  immersionState.showAll = !immersionState.showAll;
  immersionState.translations = {};
  if (immersionState.showAll) story.lines.forEach(function (_, i) { immersionState.translations[i] = true; });
  renderReading();
}
function openStoryQuiz() {
  if (!immersionState) return;
  immersionState.quizOpen = true;
  renderReading();
  setTimeout(function () { const quiz = $('#storyQuiz'); if (quiz) quiz.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 40);
}
function chooseStoryOption(question, option) {
  if (!immersionState || immersionState.result) return;
  const qi = Number(question), oi = Number(option);
  if (!isFinite(qi) || !isFinite(oi)) return;
  immersionState.answers[qi] = oi;
  renderReading();
  setTimeout(function () { const quiz = $('#storyQuiz'); if (quiz) quiz.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 10);
}
function submitStoryQuiz() {
  if (!immersionState || !IMM) return;
  const story = IMM.storyById(immersionState.id);
  if (!story) return;
  const answered = story.questions.filter(function (_, index) { return immersionState.answers[index] != null; }).length;
  if (answered !== story.questions.length) { toast('Réponds aux deux questions avant de valider.'); return; }
  const result = IMM.scoreStory(story, immersionState.answers);
  const now = Date.now();
  const previous = storyRecord(story.id) || {};
  const first = !previous.completedAt;
  const day = S.todayKey(now);
  const reward = first ? 20 : (previous.lastRewardDay === day ? 0 : 5);
  if (reward) S.addXp(state, reward, now);
  state.immersion = state.immersion && typeof state.immersion === 'object' ? state.immersion : {};
  state.immersion[story.id] = {
    completedAt: previous.completedAt || now,
    lastAt: now,
    bestScore: Math.max(Number(previous.bestScore) || 0, result.score),
    total: result.total,
    attempts: (Number(previous.attempts) || 0) + 1,
    lastRewardDay: reward ? day : (previous.lastRewardDay || '')
  };
  immersionState.result = { score: result.score, total: result.total, results: result.results, reward: reward, first: first };
  persist();
  updateChrome();
  if (reward && window.Kotoba.Motivation) window.Kotoba.Motivation.celebrate((first ? 'Première histoire terminée : +20 XP' : 'Histoire relue : +5 XP') + ' 📖');
  renderReading();
  setTimeout(function () { const box = $('[data-testid="story-result"]'); if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
}
function retryStoryQuiz() {
  if (!immersionState) return;
  immersionState.result = null;
  immersionState.answers = {};
  renderReading();
  setTimeout(function () { const quiz = $('#storyQuiz'); if (quiz) quiz.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
}
function speakStory() {
  if (!immersionState || !IMM) return;
  const story = IMM.storyById(immersionState.id);
  if (story) speakSequence(story.lines.map(storyLineText));
}
function startStoryReview(id) {
  if (!IMM) return;
  const story = IMM.storyById(id);
  if (!story) return;
  const matched = focusEntriesForStory(story).slice(0, 10);
  if (!matched.length) { toast('Ces mots ne sont pas encore dans ta collection. Tu peux les importer depuis l’onglet Importer.'); return; }
  openSession('story', matched.map(function (entry) { return wordTask(entry, 'recall'); }));
}

/* ---------- Réviser ---------- */
function renderReview() {
const now = Date.now();
const c = S.counts(entries, state, now);
const forecast = S.forecast(entries, state, now);
const max = Math.max.apply(null, forecast.concat([1]));
const labels = ['Auj.', 'Demain', '+2 j', '+3 j', '+4 j', '+5 j', '+6 j'];
const bars = forecast.map(function (n, i) {
return `<div class='forecast-col'><div class='forecast-bar' style='height:${Math.max(3, Math.round(n / max * 100))}%'></div><span class='forecast-label'>${labels[i]}</span></div>`;
}).join('');
const primaryKind = c.due ? 'due' : (c.new ? 'new' : 'quick');
const primaryLabel = c.due ? `Réviser ${plural(c.due, 'carte due', 'cartes dues')}` : (c.new ? `Découvrir ${plural(c.new, 'nouveau mot', 'nouveaux mots')}` : 'Révision rapide');
const primaryHint = c.due ? 'Une session de rappel, puis tu valides ta prononciation.' : (c.new ? 'Commence par une série de nouveaux mots.' : 'Un petit tour sur les mots déjà connus.');
const disabled = !(c.due || c.new || c.seen);
const activeKind = c.due ? 'due' : (c.new ? 'new' : 'all');
const activeCount = c.due || c.new || c.seen;
$('#view-review').innerHTML = `
<div class='panel review-hero'>
<div><p class='eyebrow'>Ta session</p><h2>${c.due ? 'On révise un peu ?' : (c.new ? 'Prêt à découvrir ?' : 'Tout est à jour.')}</h2><p class='lead'>${primaryHint}</p></div>
<div class='review-hero-actions'><button class='btn primary big' data-action='start' data-kind='${primaryKind}' data-mode='recall' data-testid='review-start-main'${disabled ? ' disabled' : ''}>${primaryLabel}</button></div>
</div>
${dailyPlanPanelHtml()}${mistakesPanelHtml()}
<div class='panel'><div class='panel-head'><div><h2>Réviser</h2><p>${c.due ? plural(c.due, 'carte t’attend', 'cartes t’attendent') : 'Rien n’est dû pour le moment.'}</p></div></div>
<div class='review-grid'>
<div class='review-card' role='button' tabindex='0' data-action='start' data-kind='due' data-mode='recall' data-testid='review-card-due'>
<span class='review-num'>${c.due}</span><strong>Cartes dues</strong><span class='hint'>Clique sur la carte pour commencer en rappel, ou choisis un mode.</span>
<button class='btn primary small' data-action='start' data-kind='due' data-mode='recall'${c.due ? '' : ' disabled'}>Commencer</button>
<div class='mode-row'><button class='mode-btn active' data-action='start' data-kind='due' data-mode='recall'${c.due ? '' : ' disabled'}>Rappel</button><button class='mode-btn' data-action='start' data-kind='due' data-mode='choice'${c.due ? '' : ' disabled'}>QCM</button><button class='mode-btn' data-action='start' data-kind='due' data-mode='listen'${c.due ? '' : ' disabled'}>Écoute</button><button class='mode-btn' data-action='start' data-kind='due' data-mode='pronounce'>🎙️ Prononciation</button></div>
</div>
<button class='review-card' data-action='start' data-kind='${activeKind}' data-mode='comprehension' data-testid='review-comprehension'${disabled ? ' disabled' : ''}><span class='review-num'>${activeCount}</span><strong>Compréhension</strong><span class='hint'>Japonais → sens, sans indice.</span></button>
<button class='review-card' data-action='start' data-kind='${activeKind}' data-mode='production' data-testid='review-production'${disabled ? ' disabled' : ''}><span class='review-num'>${activeCount}</span><strong>Production</strong><span class='hint'>Français → japonais, en écrivant.</span></button>
<button class='review-card' data-action='start' data-kind='quick' data-mode='recall'${c.seen ? '' : ' disabled'}><span class='review-num'>${Math.min(10, c.seen)}</span><strong>Révision rapide</strong><span class='hint'>Dix mots au hasard, même s’ils ne sont pas dus.</span></button>
<button class='review-card' data-action='start' data-kind='all' data-mode='recall'${c.seen ? '' : ' disabled'}><span class='review-num'>${c.seen}</span><strong>Tout revoir</strong><span class='hint'>Tous les mots déjà rencontrés.</span></button>
<button class='review-card' data-action='start' data-kind='new' data-mode='recall' data-testid='review-start-new'${c.new ? '' : ' disabled'}><span class='review-num'>${c.new}</span><strong>Nouveaux mots</strong><span class='hint'>Découvre jusqu’à dix nouveaux mots.</span></button>
</div></div>
${phrasePanelHtml()}
<section class='panel'><div class='panel-head'><h2>Prévisions</h2><p>Les 7 prochains jours</p></div><div class='forecast'>${bars}</div></section>`;
}

/* ---------- Mes mots ---------- */
function renderLibrary() {
  const filters = [['all', 'Tous'], ['due', 'À réviser'], ['new', 'Nouveaux'], ['reviewed', 'Révisés'], ['bad', 'Mal prononcés'], ['learning', 'En révision'], ['validated', 'Validés'], ['ultimate', 'Ultimes'], ['known', 'Connus'], ['imported', 'Importés']];
  const chips = filters.map(function (f) {
    return '<button class="chip' + (ui.filter === f[0] ? ' active' : '') + '" data-action="filter" data-filter="' + f[0] + '">' + f[1] + '</button>';
  }).join('');
  $('#view-library').innerHTML = '<div class="panel"><div class="panel-head"><div><h2>Mes mots</h2><p>' + entries.length + ' mots dans ta collection</p></div>' +
    '<button class="btn ghost small" data-action="go-import">Importer</button></div>' +
    '<div class="library-tools"><input class="search" id="searchInput" type="search" placeholder="Chercher en français, japonais ou romaji…" value="' + attr(ui.search) + '" data-testid="search">' +
    '<div class="chips">' + chips + '</div></div><div id="libraryList" data-testid="library-list"></div></div>';
  renderLibraryList();
}
function renderLibraryList() {
  const box = $('#libraryList');
  if (!box) return;
  const now = Date.now();
  const q = normalizeSearch(ui.search.trim());
  let list = entries.slice();
  if (ui.filter === 'imported') list = list.filter(function (e) { return e.source === 'import'; });
  else if (ui.filter === 'due') list = list.filter(function (e) { return S.isDue(state.progress[e.id], now); });
  else if (ui.filter === 'new') list = list.filter(function (e) { return S.isNew(state.progress[e.id]); });
else if (ui.filter === 'reviewed') list = list.filter(function (e) { const p = state.progress[e.id]; return p && p.last && ((p.reps || 0) + (p.lapses || 0)) > 0; });
  else if (ui.filter === 'bad') list = list.filter(badPronunciation);
  else if (ui.filter === 'learning') list = list.filter(function (e) { return S.reviewStage(state.progress[e.id]) === 'learning'; });
  else if (ui.filter === 'validated') list = list.filter(function (e) { return S.reviewStage(state.progress[e.id]) === 'validated'; });
  else if (ui.filter === 'ultimate') list = list.filter(function (e) { return S.reviewStage(state.progress[e.id]) === 'ultimate'; });
  else if (ui.filter === 'known') list = list.filter(function (e) { return S.isKnown(state.progress[e.id]); });
  if (q) {
    const primary = list.filter(function (e) { return primarySearchBlobOf(e).indexOf(q) >= 0; });
    list = primary.length ? primary : list.filter(function (e) { return searchBlobOf(e).indexOf(q) >= 0; });
  }
  list.sort(function (a, b) {
    const pa = state.progress[a.id], pb = state.progress[b.id];
    const da = pa && pa.last ? pa.due : Infinity, db = pb && pb.last ? pb.due : Infinity;
    if (da !== db) return da - db;
    return String(a.fr).localeCompare(String(b.fr), 'fr');
  });
  if (!list.length) { box.innerHTML = '<div class="empty"><span class="big">🔎</span>Aucun mot ne correspond à ce filtre.</div>'; return; }
  box.innerHTML = '<div class="word-list">' + list.map(function (e) {
    const p = state.progress[e.id];
    const stage = S.reviewStage(p);
    const label = S.stageLabel(p);
    const badge = stage === 'ultimate' ? 'ultimate' : (stage === 'validated' ? 'known' : (stage === 'learning' ? 'learning' : 'new'));
    return '<div class="word-row" role="button" tabindex="0" data-action="detail" data-id="' + attr(e.id) + '">' +
      '<span><span class="word-fr">' + frHtml(e.fr) + '</span><br><span class="badge ' + badge + '" title="' + attr(S.stageDetail(p)) + '">' + esc(label) + '</span></span>' +
      '<span class="word-jp" lang="ja">' + wordRubyHtml(e) + '</span>' +
      '<span class="word-romaji">' + esc(e.romaji + alternativeHint(e)) + (e.source === 'import' ? ' <span class="badge import">Importé</span>' : '') + '</span></div>';
  }).join('') + '</div>';
}

/* ---------- Import ---------- */
function renderImport() {
  $('#view-import').innerHTML = '<div class="panel"><div class="panel-head"><div><h2>Importer des mots</h2><p>Colle une liste, un fichier ou une capture d\'écran.</p></div></div>' +
    '<p class="hint">Format conseillé : <b>français | japonais | romaji | phrase | traduction</b>. Les deux premiers champs suffisent. Le japonais peut être en kanji, en kana ou en romaji.</p>' +
    '<textarea class="import-text" id="importText" data-testid="import-textarea" placeholder="bonjour | kon-ni-chi-wa&#10;merci | arigatou&#10;manger | 食べる | taberu">' + esc(ui.importText) + '</textarea>' +
    '<div class="import-actions"><button class="btn primary" data-action="preview-import" data-testid="preview-import">Analyser la liste</button><button class="btn ghost" data-action="clear-import">Effacer</button></div>' +
    '<div id="importPreview" data-testid="import-preview"></div></div>' +
    '<div class="panel"><div class="panel-head"><h2>Depuis un fichier</h2><p>.txt, .csv, .tsv ou .json</p></div><div class="file-row"><input type="file" id="importFile" accept=".txt,.csv,.tsv,.json,text/plain,application/json"></div></div>' +
    '<div class="panel"><div class="panel-head"><h2>Depuis une capture d\'écran</h2><p>OCR japonais + français</p></div>' +
    '<div id="dropZone" class="drop-zone" data-testid="drop-zone">Glisse une image ici, colle-la avec Ctrl+V, ou <button class="btn ghost small" data-action="pick-image">choisir une image</button></div>' +
    '<input type="file" id="ocrFile" accept="image/*" hidden><div id="ocrStatus" class="ocr-status"></div></div>';
  if (ui.preview) renderPreview();
}
function renderPreview() {
  const box = $('#importPreview');
  if (!box) return;
  const p = ui.preview;
  if (!p) { box.innerHTML = ''; return; }
  const existing = new Set(entries.map(entryKey));
  const newCount = p.entries.filter(function (e) { return !existing.has(entryKey(e)); }).length;
  const rows = p.entries.slice(0, 50).map(function (e) {
    const dup = existing.has(entryKey(e));
    return '<div class="preview-row"><span>' + esc(e.fr) + (dup ? '<br><span class="badge new">déjà présent</span>' : '') + '</span>' +
      '<span class="preview-jp" lang="ja">' + rubyHtml(e.ruby, state.settings.furigana) + '</span>' +
      '<span class="muted">' + esc(e.romaji) + '</span>' +
      '<span><span class="sentence-tip" lang="ja"' + translationTipAttrs(e.contextFr, e.context) + '>' + esc(e.context || '—') + '</span>' + (e.contextFr ? '<br><span class="muted">' + esc(e.contextFr) + '</span>' : '') + '</span></div>';
  }).join('');
  const errors = p.errors.length ? '<div class="errors"><b>' + p.errors.length + ' ligne(s) ignorée(s)</b>' + p.errors.slice(0, 5).map(function (x) {
    return '<div class="error-item">Ligne ' + x.line + ' : ' + esc(x.reason) + ' — <i>' + esc(x.text) + '</i></div>';
  }).join('') + '</div>' : '';
  box.innerHTML = '<div class="preview-table"><div class="preview-row head"><span>Français</span><span>Japonais</span><span>Romaji</span><span>Contexte</span></div>' + rows + '</div>' +
    (p.entries.length > 50 ? '<p class="hint">Aperçu limité à 50 lignes sur ' + p.entries.length + '.</p>' : '') +
    '<div class="import-actions"><button class="btn primary" data-action="do-import" data-testid="do-import"' + (newCount ? '' : ' disabled') + '>Importer ' + newCount + ' mot(s)</button>' +
    '<span class="hint">' + p.entries.length + ' détecté(s), ' + p.errors.length + ' erreur(s).</span></div>' + errors;
}
function previewImport() {
  const el = $('#importText');
  if (!el) return;
  if (el.value.length > MAX_IMPORT_CHARS) { toast('Texte trop volumineux (2 Mo maximum).'); return; }
  ui.importText = el.value;
  const p = P.parseText(el.value);
  if (!p.entries.length && !p.errors.length) { toast('Colle d\'abord quelques mots.'); return; }
  ui.preview = p;
  renderPreview();
  const box = $('#importPreview');
  if (box) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function doImport() {
  if (!ui.preview || !ui.preview.entries.length) return;
  const keys = new Set(entries.map(entryKey));
  let added = 0, skipped = 0;
  ui.preview.entries.forEach(function (e) {
    if (keys.has(entryKey(e))) { skipped++; return; }
    state.entries[e.id] = e; keys.add(entryKey(e)); added++;
    state.progress[e.id] = { level: 0, reps: 0, lapses: 0, due: Date.now() - 1, last: Date.now() - 1 };
  });
  if (!added) { toast('Ces mots sont déjà dans ta collection.'); return; }
  persist();
  entries = buildEntries();
  ui.preview = null; ui.importText = '';
  toast(added + ' mot(s) importé(s)' + (skipped ? ' · ' + skipped + ' doublon(s) ignoré(s)' : ''));
  try { history.replaceState(null, '', '#mots'); } catch (e) { location.hash = 'mots'; }
  showView('library');
}
function readImportFile(file) {
  if (!file) return;
  if (Number(file.size) > MAX_IMPORT_CHARS) { toast('Fichier trop volumineux (2 Mo maximum).'); return; }
  const reader = new FileReader();
  reader.onload = function () {
    let text = String(reader.result || '');
    if (/\.json$/i.test(file.name)) {
      try {
        const data = JSON.parse(text);
        const arr = Array.isArray(data) ? data : (data.entries ? (Array.isArray(data.entries) ? data.entries : Object.keys(data.entries).map(function (k) { return data.entries[k]; })) : null);
        if (!arr) throw new Error('JSON sans liste d\'entrées');
        text = arr.filter(function (e) { return e && (e.jp || e.ruby) && e.fr; }).map(function (e) {
          return [e.fr, e.jp || e.ruby, e.romaji || '', e.context || '', e.contextFr || ''].join(' | ');
        }).join('\n');
      } catch (err) { toast('Fichier JSON non reconnu.'); return; }
    }
    ui.importText = text; ui.preview = null;
    renderImport();
    previewImport();
  };
  reader.onerror = function () { toast('Impossible de lire le fichier.'); };
  reader.readAsText(file, 'utf-8');
}
function cleanOcr(text) {
  return String(text || '').replace(/[ \t]+/g, ' ').replace(/([\u3040-\u30ff\u3400-\u9fff]) (?=[\u3040-\u30ff\u3400-\u9fff])/g, '$1').replace(/\n{3,}/g, '\n\n').trim();
}
function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (tessPromise) return tessPromise;
  tessPromise = new Promise(function (resolve, reject) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.async = true;
    s.onload = function () { if (window.Tesseract) resolve(window.Tesseract); else reject(new Error('moteur OCR indisponible')); };
    s.onerror = function () { tessPromise = null; reject(new Error('téléchargement de l\'OCR impossible')); };
    document.head.appendChild(s);
  });
  return tessPromise;
}
function handleImage(file) {
  if (!file || !/^image\//.test(file.type || '')) { toast('Choisis une image (PNG, JPG…).'); return; }
  const status = $('#ocrStatus');
  if (status) status.textContent = 'Chargement de l\'OCR…';
  loadTesseract().then(function (T) {
    return T.createWorker(['jpn', 'fra'], 1, { logger: function (m) {
      if (status) status.textContent = m.status === 'recognizing text' ? 'Lecture… ' + Math.round((m.progress || 0) * 100) + '%' : 'Préparation de l\'OCR…';
    } }).then(function (worker) {
      return worker.recognize(file).then(function (res) { return worker.terminate().then(function () { return res; }); });
    });
  }).then(function (res) {
    const text = cleanOcr(res && res.data && res.data.text);
    if (!text) { if (status) status.textContent = 'Aucun texte détecté. Essaie une image plus nette.'; return; }
    ui.importText = text; ui.preview = null;
    renderImport();
    if (status) status.textContent = 'Texte reconnu. Vérifie-le avant d\'importer.';
    previewImport();
  }).catch(function (err) {
    if (status) status.textContent = '';
    toast('OCR impossible : ' + (err && err.message ? err.message : 'vérifie ta connexion.'));
  });
}

/* ---------- Session ---------- */
function wordTask(entry, mode, target) {
  return { entry: entry, mode: mode || 'recall', target: target || '' };
}
function productionKey(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/[a-zA-Z]/.test(raw)) {
    const roman = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
    return roman ? 'r:' + roman : '';
  }
  return 'j:' + P.stripAnnotations(raw).replace(/[\s　。、！？!?.,・…「」『』（）()]/g, '');
}
function isProductionCorrect(entry, answer) {
  if (!entry) return false;
  const key = productionKey(answer);
  if (!key) return false;
  const values = [entry.jp, entry.reading, entry.romaji];
  (entry.alternatives || []).forEach(function (item) {
    if (item) values.push(item.jp, item.reading, item.romaji);
  });
  const accepted = values.map(productionKey).filter(Boolean);
  if (accepted.indexOf(key) >= 0) return true;
  if (key.indexOf('r:') !== 0) return false;
  const roman = key.slice(2);
  const variants = [roman, roman.replace(/ha$/, 'wa'), roman.replace(/wa$/, 'ha'), roman.replace(/ou/g, 'o'), roman.replace(/oo/g, 'o'), roman.replace(/uu/g, 'u')];
  return accepted.some(function (candidate) {
    return candidate.indexOf('r:') === 0 && variants.indexOf(candidate.slice(2)) >= 0;
  });
}
function submitProduction(form) {
  if (!session || session.phase !== 'question' || !session.current) return;
  const input = form.querySelector('input[name="answer"]');
  const answer = String((input && input.value) || '').trim();
  if (!answer) { toast('Écris une réponse.'); return; }
  session.productionAnswer = answer;
  grade(isProductionCorrect(session.current, answer) ? 'good' : 'again');
}
function revealProduction() {
  if (!session || session.phase !== 'question' || !session.current) return;
  session.productionAnswer = '';
  grade('again');
}
function makePhraseTask(entry, preferred) {
  if (!entry || !PH) return null;
  const exercise = PH.bestType(entry, preferred);
  return exercise ? { entry: entry, mode: 'phrase', exercise: exercise } : null;
}
function addPhraseTask(tasks, pool, preferred, used) {
  for (let i = 0; i < pool.length; i++) {
    const entry = pool[i];
    if (used[entry.id]) continue;
    const task = makePhraseTask(entry, preferred);
    if (!task) continue;
    tasks.push(task);
    used[entry.id] = true;
    return true;
  }
  return false;
}
function openSession(kind, tasks) {
  if (!tasks || !tasks.length) { toast('Aucun exercice disponible pour l\'instant.'); return; }
  session = {
    kind: kind, grammarSummary: null, tasks: tasks.slice(), current: null, mode: 'recall', task: null, exercise: null,
    phase: 'front', done: 0, correct: 0, xp: 0, total: tasks.length, options: [],
    lastGrade: null, lastDue: 0, lastXp: 0, lastChoice: null,
    phraseSelection: [], phraseResult: null, productionAnswer: '',
    conversationAnswer: '', conversationResult: null,
    conversationVoiceUsed: false, conversationVoiceToken: 0, conversationRecognition: null
  };
  document.body.style.overflow = 'hidden';
  const root = $('#session');
  if (root) root.hidden = false;
  nextCard();
}
function startPhraseSession(type) {
  const pool = shuffle(entries.filter(function (e) { return !!(e && e.context); }));
  const wanted = type && type !== 'mixed' ? type : '';
  const tasks = [];
  for (let i = 0; i < pool.length && tasks.length < 6; i++) {
    const preferred = wanted || PH.TYPES[tasks.length % PH.TYPES.length];
    const task = makePhraseTask(pool[i], preferred);
    if (task) tasks.push(task);
  }
  if (!tasks.length) { toast('Aucune phrase de contexte disponible.'); return; }
  openSession('phrases', tasks);
}
function mistakesPanelHtml() {
  if (!MISTAKES) return '';
  const sum = MISTAKES.summary(state, entries, IMM ? IMM.stories : []);
  const wordChips = sum.wordRows.slice(0, 3).map(function (row) {
    return '<button class="mistake-chip" data-action="detail" data-id="' + attr(row.entry.id) + '">' +
      '<span lang="ja">' + wordRubyHtml(row.entry) + '</span>' +
      '<small>' + esc(row.entry.fr) + (row.lastScore != null ? ' · ' + row.lastScore + ' %' : '') + '</small></button>';
  }).join('');
  const storyChips = sum.storyRows.slice(0, 2).map(function (row) {
    return '<button class="mistake-chip" data-action="open-story" data-id="' + attr(row.id) + '">' +
      '<span>' + esc(row.story ? row.story.title : row.id) + '</span>' +
      '<small>' + row.bestScore + '/' + row.total + '</small></button>';
  }).join('');
  return '<section class="panel mistakes-panel" data-testid="mistakes-panel">' +
    '<div class="panel-head"><div><p class="eyebrow">Rattrapage</p><h2>Mon carnet d’erreurs</h2>' +
    '<p>' + (sum.total ? 'Ce qui a résisté, réuni au même endroit : une séance pour repartir dessus.' : 'Rien en attente : ton carnet est vide.') + '</p></div>' +
    '<button class="btn primary" data-action="start-mistakes" data-testid="start-mistakes"' + (sum.total ? '' : ' disabled') + '>Séance de rattrapage</button></div>' +
    '<div class="mistakes-grid">' +
      '<div class="mistake-card" data-testid="mistakes-words"><b>' + sum.words + '</b><span>Mots fragiles</span><small>2 échecs ou prononciation sous 75 %</small></div>' +
      '<div class="mistake-card" data-testid="mistakes-conversations"><b>' + sum.conversations + '</b><span>Répliques à revoir</span><small>Conversations ratées</small></div>' +
      '<div class="mistake-card" data-testid="mistakes-stories"><b>' + sum.stories + '</b><span>Histoires à consolider</span><small>Quiz incomplet</small></div>' +
    '</div>' +
    (wordChips ? '<div class="mistake-chips"><span class="context-label">Tes mots fragiles</span>' + wordChips + '</div>' : '') +
    (storyChips ? '<div class="mistake-chips"><span class="context-label">Histoires</span>' + storyChips + '</div>' : '') +
    '</section>';
}
function startMistakes() {
  if (!MISTAKES) { toast('Le carnet d’erreurs n’est pas disponible. Recharge la page.'); return; }
  if (!entries.length) { toast('Aucun mot à travailler pour l’instant.'); return; }
  const sum = MISTAKES.summary(state, entries, IMM ? IMM.stories : []);
  if (!sum.total) { toast('Ton carnet est vide : rien à rattraper.'); return; }
  const tasks = [];
  const fragile = sum.wordRows.slice(0, 5);
  fragile.forEach(function (row, index) {
    tasks.push(wordTask(row.entry, index === 0 ? 'recall' : (index % 2 ? 'comprehension' : 'production'), 'word'));
  });
  const phraseRow = fragile.filter(function (row) { return row.entry && row.entry.context; })[0];
  if (phraseRow) {
    const phraseTask = makePhraseTask(phraseRow.entry, 'cloze');
    if (phraseTask) tasks.push(phraseTask);
  }
  const pronRow = fragile.filter(function (row) { return row.lastScore != null && row.lastScore < MISTAKES.WEAK_PRONUNCIATION; })[0];
  if (pronRow) tasks.push({ entry: pronRow.entry, mode: 'pronounce', target: pronRow.entry.context ? 'phrase' : 'word' });
  if (CONV) {
    conversationReviewGroups().slice(0, 2).forEach(function (group) {
      const item = group.items[0];
      const turn = item ? group.scenario.turns[item.turn] : null;
      if (!turn) return;
      tasks.push({
        entry: null,
        mode: 'conversation',
        conversationScenario: group.scenario,
        conversationTurnIndex: item.turn,
        conversationTurn: turn
      });
    });
  }
  if (!tasks.length) {
    if (sum.storyRows.length && sum.storyRows[0].story) {
      if (session) closeSession();
      openStory(sum.storyRows[0].id);
      return;
    }
    toast('Rien à lancer pour l’instant.');
    return;
  }
  openSession('mistakes', tasks.slice(0, 9));
}
function startDailyPlan() {
  const now = Date.now();
  const tasks = [];
  const used = {};
  const grammarTask = dailyGrammarTask(now);
  if (grammarTask) tasks.push(grammarTask);
  const conversationTasks = dailyConversationTasks(2);
  if (conversationTasks[0]) tasks.push(conversationTasks[0]);
  const due = S.dueEntries(entries, state, now).slice(0, 8);
  const activeModes = ['recall', 'comprehension', 'production'];
  due.forEach(function (entry, index) {
    tasks.push(wordTask(entry, activeModes[index] || 'recall', 'word'));
    used[entry.id] = true;
  });
  const fresh = entries.filter(function (e) { return S.isNew(state.progress[e.id]); }).slice(0, 3);
  fresh.forEach(function (entry) {
    if (used[entry.id]) return;
    tasks.push(wordTask(entry, 'recall', 'word'));
    used[entry.id] = true;
  });
  if (!tasks.length) {
    shuffle(entries.filter(function (e) { const p = state.progress[e.id]; return p && p.last; })).slice(0, 5).forEach(function (entry) {
      tasks.push(wordTask(entry, 'recall', 'word'));
      used[entry.id] = true;
    });
  }
  const phrasePool = shuffle(entries.filter(function (e) { return !!(e && e.context); }));
  addPhraseTask(tasks, phrasePool, 'cloze', used);
  addPhraseTask(tasks, phrasePool, 'order', used);
  const weak = pronunciationStats().weak.map(function (row) {
    return row.entry;
  }).filter(function (entry) { return entry && !used[entry.id]; });
  const pronunciationEntry = weak[0] || shuffle(entries.filter(function (entry) {
    return entry && entry.context && !used[entry.id];
  }))[0] || entries.filter(function (entry) { return !used[entry.id]; })[0];
  if (pronunciationEntry) {
    tasks.push({ entry: pronunciationEntry, mode: 'pronounce', target: pronunciationEntry.context ? 'phrase' : 'word' });
  }
  if (conversationTasks[1]) tasks.push(conversationTasks[1]);
  if (!tasks.length) { toast('Aucune carte pour la session du jour.'); return; }
  openSession('today', tasks);
}
function startSession(kind, mode, unitId) {
  mode = mode || 'recall';
  if (!entries.length) { toast('Aucun mot à afficher.'); return; }
  if (mode === 'listen' && !('speechSynthesis' in window)) { mode = 'choice'; toast('Pas de synthèse vocale ici : passage en QCM.'); }
  const now = Date.now();
  let list = [];
  if (kind === 'due') list = S.dueEntries(entries, state, now);
  else if (kind === 'new') list = entries.filter(function (e) { return S.isNew(state.progress[e.id]); }).slice(0, 10);
  else if (kind === 'quick') list = shuffle(entries.filter(function (e) { const p = state.progress[e.id]; return p && p.last; })).slice(0, 10);
  else if (kind === 'all') list = entries.filter(function (e) { const p = state.progress[e.id]; return p && p.last; }).sort(byDue);
  else if (kind === 'unit') list = entries.filter(function (e) { return e.unitId === unitId; }).sort(byDue).slice(0, 15);
else if (kind === 'daily') {
if (state.flags.daily === S.todayKey()) { toast('Défi du jour déjà relevé.'); return; }
const seen = entries.filter(function (e) { const p = state.progress[e.id]; return p && p.last; }).sort(byDue);
const fresh = entries.filter(function (e) { return S.isNew(state.progress[e.id]); });
list = seen.concat(fresh).slice(0, 3);
}
  if (!list.length) { toast('Rien à réviser pour l\'instant.'); return; }
  if (kind === 'due') list = list.slice(0, 30);
  openSession(kind, list.map(function (entry) { return wordTask(entry, mode); }));
}
function startPronunciationPractice() {
  const stats = pronunciationStats();
  const list = stats.weak.map(function (row) { return row.entry; });
  if (!list.length) { toast('Aucun mot à retravailler pour l’instant.'); return; }
  openSession('pronunciation', list.map(function (entry) { return wordTask(entry, 'pronounce'); }));
}
function startOne(id, mode) {
const e = entries.filter(function (x) { return x.id === id; })[0];
if (!e) return;
closeModal();
mode = mode || 'recall';
openSession('single', [wordTask(e, mode)]);
}
function claimDaily() {
const day = S.todayKey();
if (state.flags.daily === day) return;
const beforeXp = todayXp();
state.flags.daily = day;
S.addXp(state, 20, Date.now());
if (session) session.xp += 20;
persist();
updateChrome();
const goal = state.settings.goal || 50;
const message = beforeXp < goal && todayXp() >= goal ? 'Objectif du jour atteint + défi relevé ! +20 XP' : 'Défi du jour relevé ! +20 XP';
if (window.Kotoba.Motivation) window.Kotoba.Motivation.celebrate(message); else toast(message);
}
function weeklyReportHtml(now) {
  now = Number(now) || Date.now();
  const dayMs = 86400000;
  const base = new Date(now);
  base.setHours(0, 0, 0, 0);
  const start = base.getTime() - 6 * dayMs;
  const labels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const fullDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const days = [];
  let totalXp = 0, totalReviews = 0, totalConversations = 0;
  for (let i = 0; i < 7; i++) {
    const t = start + i * dayMs;
    const key = S.todayKey(t);
    const xp = Math.max(0, Number(state.stats.daily && state.stats.daily[key]) || 0);
    const reviews = Math.max(0, Number(state.stats.history && state.stats.history[key]) || 0);
    const conversations = Math.max(0, Number(state.stats.conversation && state.stats.conversation[key]) || 0);
    totalXp += xp;
    totalReviews += reviews;
    totalConversations += conversations;
    days.push({ key: key, label: labels[new Date(t).getDay()], full: fullDays[new Date(t).getDay()], xp: xp, reviews: reviews, conversations: conversations, today: key === S.todayKey(now) });
  }
  let storiesRead = 0;
  Object.keys(state.immersion || {}).forEach(function (id) {
    const item = state.immersion[id];
    const t = Number(item && (item.lastAt || item.completedAt)) || 0;
    if (t >= start && t <= now) storiesRead++;
  });
  let pronCount = 0, pronScore = 0;
  entries.forEach(function (entry) {
    pronunciations(entry).forEach(function (item) {
      const t = Number(item && item.t) || 0;
      if (t < start || t > now) return;
      pronCount++;
      pronScore += Math.max(0, Math.min(100, Number(item && item.score) || 0));
    });
  });
  const pronAverage = pronCount ? Math.round(pronScore / pronCount) : 0;
  const maxXp = Math.max(1, days.reduce(function (max, day) { return Math.max(max, day.xp); }, 0));
  const activeDays = days.filter(function (day) { return day.xp > 0 || day.reviews > 0 || day.conversations > 0; }).length;
  const top = days.reduce(function (best, day) { return day.xp > best.xp ? day : best; }, days[0]);
  let weak = 0;
  Object.keys(state.conversationReview || {}).forEach(function (key) {
    const item = state.conversationReview[key];
    if (item && Number(item.missedAt) > Number(item.clearedAt)) weak++;
  });
  const streak = window.Kotoba.Motivation ? window.Kotoba.Motivation.currentStreak(state, now) : (Number(state.stats.streak) || 0);
  const range = new Date(start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' → ' + new Date(now).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const bars = days.map(function (day) {
    const height = day.xp ? Math.max(8, Math.round(day.xp / maxXp * 100)) : 3;
    return '<div class="weekly-bar-col' + (day.today ? ' today' : '') + '"><span class="weekly-bar-value">' + (day.xp || '') + '</span><div class="weekly-bar-track"><span class="weekly-bar" style="height:' + height + '%" title="' + esc(day.full + ' : ' + day.xp + ' XP') + '"></span></div><span class="weekly-bar-label">' + day.label + '</span></div>';
  }).join('');
  const activity = totalXp > 0 || totalReviews > 0 || totalConversations > 0;
  const insight = !activity
    ? 'Aucune activité ces sept derniers jours. Une carte suffit pour relancer la série.'
    : top && top.xp
      ? 'Ton jour le plus actif : ' + top.full + ' (' + top.xp + ' XP).'
      : 'Tu as travaillé ' + activeDays + ' jour' + (activeDays === 1 ? '' : 's') + ' cette semaine. Une carte suffit pour gagner de l’XP.';
  return '<div class="weekly-report" data-testid="weekly-report-modal">' +
    '<div class="weekly-report-head"><div><p class="eyebrow">7 derniers jours</p><h3>Ta semaine en japonais</h3></div><span class="weekly-streak">🔥 ' + streak + ' j</span></div>' +
    '<p class="hint">' + esc(range) + ' · ' + activeDays + ' jour' + (activeDays === 1 ? '' : 's') + ' actif' + (activeDays === 1 ? '' : 's') + '</p>' +
    '<div class="weekly-bars" aria-label="XP par jour">' + bars + '</div>' +
    '<div class="weekly-metrics">' +
      '<div class="weekly-metric" data-testid="weekly-xp"><span aria-hidden="true">⚡</span><strong>' + totalXp + ' XP</strong><small>gagnés cette semaine</small></div>' +
      '<div class="weekly-metric" data-testid="weekly-reviews"><span aria-hidden="true">📚</span><strong>' + totalReviews + '</strong><small>révision' + (totalReviews === 1 ? '' : 's') + '</small></div>' +
      '<div class="weekly-metric" data-testid="weekly-conversations"><span aria-hidden="true">💬</span><strong>' + totalConversations + '</strong><small>réplique' + (totalConversations === 1 ? '' : 's') + ' travaillée' + (totalConversations === 1 ? '' : 's') + '</small></div>' +
      '<div class="weekly-metric" data-testid="weekly-pronunciation"><span aria-hidden="true">🎙️</span><strong>' + (pronCount ? pronAverage + ' %' : '—') + '</strong><small>' + (pronCount ? pronCount + ' son' + (pronCount === 1 ? '' : 's') + ' travaillé' + (pronCount === 1 ? '' : 's') : 'aucun son ce cycle') + '</small></div>' +
    '</div>' +
    '<div class="weekly-insight"><p>' + esc(insight) + '</p>' + (storiesRead ? '<p>📖 ' + storiesRead + ' histoire' + (storiesRead === 1 ? '' : 's') + ' lue' + (storiesRead === 1 ? '' : 's') + ' cette semaine.</p>' : '') + (weak ? '<p>🎯 ' + weak + ' réplique' + (weak === 1 ? '' : 's') + ' encore à revoir.</p>' : '') + '</div>' +
    '<p class="hint">Ce bilan se met à jour après chaque révision, conversation, histoire ou séance de prononciation.</p>' +
    '</div>';
}
function openWeeklyReport() {
  openModal('Ma semaine', weeklyReportHtml(Date.now()));
}
function nextCard() {
  if (!session) return;
  stopConversationTaskVoice();
  if (!session.tasks.length) {
session.current = null; session.phase = 'summary';
if (session.kind === 'daily') claimDaily();
renderSession(); return;
}
  const task = session.tasks.shift();
  session.task = task;
  session.current = task.entry;
  session.mode = task.mode || 'recall';
  session.exercise = task.exercise || null;
  session.autoSpokenFor = null;
  session.pronunciation = null;
  session.phraseSelection = [];
  session.phraseResult = null;
  session.productionAnswer = '';
  session.conversationAnswer = '';
  session.conversationResult = null;
  session.conversationVoiceUsed = false;
  session.grammarState = task.mode === 'grammar' ? { selected: null, picked: [], checked: false, correct: false, xp: 0 } : null;
  if (session.pronunciationAutoPhrase) {
    session.pronunciationTarget = 'word';
    session.pronunciationAutoPhrase = false;
  }
  if (session.mode === 'phrase') {
    if (!session.exercise) { nextCard(); return; }
    session.phase = 'question';
    session.options = [];
    session.lastGrade = null;
    session.lastChoice = null;
    session.total = Math.max(session.total, session.done + session.tasks.length + 1);
    renderSession();
    return;
  }
  if (session.mode === 'grammar') {
    session.phase = 'question';
    session.options = [];
    session.lastGrade = null;
    session.lastChoice = null;
    session.total = Math.max(session.total, session.done + session.tasks.length + 1);
    renderSession();
    return;
  }
  if (session.mode === 'conversation') {
    session.phase = 'question';
    session.options = [];
    session.lastGrade = null;
    session.lastChoice = null;
    session.total = Math.max(session.total, session.done + session.tasks.length + 1);
    renderSession();
    return;
  }
  if (task.target) session.pronunciationTarget = task.target;
  else if (!session.pronunciationTarget) session.pronunciationTarget = state.settings.pronunciationTarget === 'phrase' ? 'phrase' : 'word';
  if (!session.pronunciationEngine) {
    const browserOk = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    const whisperOk = !!(window.Kotoba.Whisper && window.Kotoba.Whisper.supported());
    const savedEngine = state.settings.pronunciationEngine;
    session.pronunciationEngine = savedEngine === 'whisper' || (!browserOk && whisperOk) ? 'whisper' : 'browser';
  }
session.phase = session.mode === 'recall' ? 'front' : 'question';
  session.options = (session.mode === 'recall' || session.mode === 'pronounce' || session.mode === 'production') ? [] : buildOptions(session.current, session.mode);
  session.lastGrade = null; session.lastChoice = null;
  session.total = Math.max(session.total, session.done + session.tasks.length + 1);
  renderSession();
}
function buildOptions(entry, mode) {
  const seen = new Set([entry.id]);
  const pool = [];
  const same = shuffle(entries.filter(function (e) { return e.unitId === entry.unitId && e.id !== entry.id; }));
  const rest = shuffle(entries.filter(function (e) { return e.unitId !== entry.unitId && e.id !== entry.id; }));
  same.concat(rest).forEach(function (e) {
    if (pool.length >= 3 || seen.has(e.id)) return;
    if (pool.some(function (x) { return x.jp === e.jp || ((mode === 'listen' || mode === 'comprehension') && x.fr === e.fr); })) return;
    seen.add(e.id); pool.push(e);
  });
  return shuffle([entry].concat(pool));
}
function renderSession() {
  hideSentenceTooltip();
  const root = $('#session');
  if (!root) return;
  if (!session) { root.hidden = true; return; }
  root.hidden = false;
  const pct = Math.min(100, Math.round(session.done / Math.max(1, session.total) * 100));
  const body = session.phase === 'summary' ? summaryHtml() : (session.mode === 'grammar' ? grammarTaskView() : (session.mode === 'conversation' ? conversationTaskView() : (session.mode === 'phrase' ? phraseView() : (session.mode === 'recall' ? recallView() : (session.mode === 'pronounce' ? pronounceView() : (session.mode === 'production' ? productionView() : quizView()))))));
  root.innerHTML = '<div class="session-shell"><div class="session-top"><button class="icon-btn" data-action="quit-session" aria-label="Quitter la session">✕</button>' +
    '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><div class="progress-fill" style="width:' + pct + '%" data-testid="progress"></div></div>' +
    '<span class="session-count">' + session.done + '/' + Math.max(session.done, session.total) + '</span></div><div class="session-body">' + body + '</div></div>';
  root.tabIndex = -1;
  root.style.outline = 'none';
  try { root.focus({ preventScroll: true }); } catch (e) { root.focus(); }
  if (session.current && session.mode !== 'phrase' && (session.phase === 'revealed' || session.phase === 'feedback' ||
    (session.mode === 'pronounce' && session.pronunciation && session.pronunciation.status === 'done'))) {
    autoSpeakAnswer(session.current);
  }
  if (session.mode === 'phrase' && session.phase === 'question' && session.exercise && session.exercise.type === 'cloze') {
    setTimeout(function () { const input = $('#phraseAnswer'); if (input) input.focus(); }, 30);
  }
  if (session.mode === 'production' && session.phase === 'question') {
    setTimeout(function () { const input = $('#productionAnswer'); if (input) input.focus(); }, 30);
  }
  if (session.mode === 'conversation' && session.phase === 'question') {
    setTimeout(function () { const input = $('#conversationTaskAnswer'); if (input) input.focus(); }, 30);
  }
}
function answerVerdictHtml(st, graded) {
  if (st && st.status === 'done') {
    const alternative = st.good && st.alternative && st.alternativeLabel;
    const target = st.expected || 'le mot';
    const main = session && session.current ? session.current.jp : 'le mot';
    return '<div class="answer-verdict ' + (st.good ? 'good' : 'bad') + '" data-testid="answer-verdict" role="status">' +
      '<b>' + (st.good ? '✅ C’est correct' : '❌ Ce n’est pas correct') + '</b>' +
      '<span>' + (st.good
        ? (alternative ? '« ' + esc(st.alternativeLabel) + ' » est accepté. C’est une autre formulation de « ' + esc(main) + ' » : plus directe, mais polie elle aussi.' : 'Tu as bien prononcé « ' + esc(target) + ' ».')
        : 'Tu t’es trompé. On attendait « ' + esc(target) + ' »' + (st.heard ? ', tu as dit « ' + esc(st.heard) + ' »' : '') + '. Réessaie en écoutant le modèle.') + '</span></div>';
  }
  if (graded) {
    const good = session.lastGrade === 'good';
    return '<div class="answer-verdict ' + (good ? 'good' : 'bad') + '" data-testid="answer-verdict" role="status">' +
      '<b>' + (good ? '✅ Bonne réponse' : '❌ Mauvaise réponse') + '</b>' +
      '<span>' + (good ? 'Continue comme ça.' : 'La bonne réponse est affichée. Prends le temps de la relire.') + '</span></div>';
  }
  return '';
}
function acceptedAlternativeHtml(e) {
  const st = session && session.pronunciation;
  if (!st || !st.good || !st.alternative) return '';
  return '<div class="accepted-alternative" data-testid="accepted-alternative"><b>« ' + esc(st.alternativeLabel || st.expected || '') + ' » est accepté.</b>' +
    '<span>C’est une autre formulation de « ' + esc(e && e.fr || 'cette demande') + ' » : plus directe et concrète, mais polie. Les deux se disent.</span></div>';
}
function answerCard(e) {
  const st = session && session.pronunciation;
  const graded = session && session.phase === 'feedback';
  const tone = st && st.status === 'done'
    ? (st.good ? ' glow-good' : ' glow-bad')
    : (graded ? (session.lastGrade === 'good' ? ' glow-good' : ' glow-bad') : '');
  const inline = session && session.mode === 'recall' ? inlinePronunciationHtml(st) : '';
  const nuance = nuanceOf(e);
  const verdict = answerVerdictHtml(st, graded);
  return '<div class="session-card answer-card' + tone + '" data-testid="session-card">' + verdict + acceptedAlternativeHtml(e) + '<div class="answer-main">' +
    '<div class="answer-head"><div class="fr-small">' + frHtml(e.fr) + '</div>' +
    (nuance ? '<p class="nuance-note" data-testid="answer-nuance">' + esc(nuance) + '</p>' : '') +
    '<div class="jp-big" lang="ja" data-testid="answer-jp">' + wordRubyHtml(e) + '</div>' +
    (e.romaji ? '<div class="answer-romaji" data-testid="answer-romaji">' + esc(e.romaji) + '</div>' : '') +
    alternativesHtml(e) +
    '<div class="audio-row"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.jp) + '">🔊 Écouter</button>' +
    '<button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.jp) + '" data-slow="1">🐢 Lent</button></div></div>' +
    '<aside class="context-card" data-testid="answer-context"><div class="context-label">En contexte</div>' +
    '<p class="context-jp sentence-tip" lang="ja"' + translationTipAttrs(e.contextFr, e.context) + '>' + contextHtml(e.context, e.hl, e) + '</p>' +
    '<p class="context-fr">' + esc(e.contextFr || '—') + '</p>' +
    wordByWordDetails(e.context, 'answer-word-by-word') +
    contextNoteHtml(e) +
    (e.context ? '<button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.context) + '">🔊 La phrase</button>' : '<p class="hint">Pas encore de phrase. Ajoute-en une depuis Mes mots.</p>') + '</aside></div>' +
    inline + '</div>';
}
function pronunciationRhythmHtml(st) {
  if (!st || !st.rhythm) return '';
  const chips = [];
  if (st.rhythm.expectedSokuon) {
    chips.push('<span class="rhythm-chip ' + (st.rhythm.missingSokuon ? 'bad' : 'good') + '">' + (st.rhythm.missingSokuon ? 'Petit っ manquant' : 'Petit っ ✓') + '</span>');
  }
  if (st.rhythm.expectedLongVowels) {
    chips.push('<span class="rhythm-chip ' + (st.rhythm.missingLongVowel ? 'bad' : 'good') + '">' + (st.rhythm.missingLongVowel ? 'Voyelle longue manquante' : 'Voyelle longue ✓') + '</span>');
  }
  return chips.length ? '<div class="rhythm-chips" data-testid="pronounce-rhythm">' + chips.join('') + '</div>' : '';
}
function inlinePronunciationHtml(st) {
  if (!st || st.status !== 'done') return '';
  const replay = st.engine === 'whisper' && window.Kotoba.Whisper && window.Kotoba.Whisper.hasRecording && window.Kotoba.Whisper.hasRecording()
    ? '<button class="btn ghost small" data-action="pronounce-play" data-testid="inline-pronounce-play">🎧 Ma voix</button>' : '';
  const accepted = st.good && st.alternative;
  const main = session && session.current ? session.current.jp : '';
  const lines = accepted
    ? '<div class="inline-pronunciation-lines"><span>Accepté</span><span lang="ja">' + esc(st.alternativeLabel || st.expected || '—') + '</span><span>Autre formulation</span><span lang="ja">' + esc(main || '—') + '</span></div>'
    : '<div class="inline-pronunciation-lines"><span>Attendu</span><span lang="ja">' + esc(st.expected || '—') + '</span><span>Entendu</span><span lang="ja">' + esc(st.heard || st.transcript || '—') + '</span></div>';
  return '<div class="inline-pronunciation ' + (st.good ? 'good' : 'retry') + '" data-testid="inline-pronunciation">' +
    '<div class="inline-pronunciation-head"><b data-testid="inline-pronunciation-score">' + Math.round(Number(st.score) || 0) + ' %</b><span>' + (st.good ? '✅ C’est correct' : '❌ Tu t’es trompé') + '</span></div>' +
    lines +
    (st.score < 100 ? pronunciationDiffHtml(st.diff) : '') +
    (accepted ? '<p class="variant-note" data-testid="inline-variant">Autre formulation acceptée : <b lang="ja">' + esc(st.alternativeLabel || st.expected || '') + '</b>. « ' + esc(main || 'La forme principale') + ' » est plus doux et général ; « ' + esc(st.alternativeLabel || st.expected || '') + ' » est plus direct et peut sembler plus fort, mais il reste poli.</p>' : '') +
    (st.tip ? '<p class="hint inline-tip"><b>Conseil :</b> ' + esc(st.tip) + '</p>' : '') +
    pronunciationRhythmHtml(st) +
    '<div class="inline-pronunciation-actions">' + replay +
    '<button class="btn ghost small" data-action="pronounce-front-start" data-testid="inline-pronounce-retry">Réessayer</button></div></div>';
}
function frontPronunciationHtml() {
  const st = session.pronunciation;
  const reveal = '<button class="btn ghost" data-action="reveal" data-testid="reveal">Révéler la réponse <kbd>Espace</kbd></button>';
  if (!st) {
    return '<div class="front-actions"><button class="btn primary big mic-btn" data-action="pronounce-front-start" data-testid="pronounce-front-start">🎙️ Prononcer</button>' + reveal + '</div>' +
      '<p class="hint">Le micro écoute, donne un score, puis la fiche s’affiche dans tous les cas.</p>';
  }
  if (st.status === 'listening' || st.status === 'recording') {
    return '<div class="pronounce-status listening" data-testid="pronounce-status" aria-live="polite"><span class="listening-dot" aria-hidden="true"></span> J’écoute… Parle maintenant.</div>' +
      (st.status === 'recording' ? pronunciationMeterHtml() + '<p class="hint">La capture s’arrête après un silence.</p>' : '<p class="hint" data-testid="pronounce-interim">' + esc(st.interim || 'La transcription apparaîtra ici.') + '</p>') +
      '<div class="front-actions"><button class="btn primary" data-action="pronounce-stop" data-testid="pronounce-stop">J’ai fini</button>' +
      '<button class="btn ghost" data-action="pronounce-cancel" data-testid="pronounce-cancel">Annuler</button>' + reveal + '</div>';
  }
  if (st.status === 'loading' || st.status === 'transcribing') {
    const pct = Math.max(0, Math.min(100, Number(st.progress) || 0));
    return '<div class="pronounce-status" data-testid="pronounce-status">' + esc(st.message || (st.status === 'transcribing' ? 'Transcription en cours…' : 'Préparation du moteur IA…')) + '</div>' +
      (st.status === 'loading' ? '<div class="pronounce-progress"><span style="width:' + pct + '%"></span></div>' : '') +
      '<p class="hint">Le premier passage télécharge le modèle ; les suivants sont plus rapides.</p>' + reveal;
  }
  if (st.status === 'error') {
    return '<div class="pronounce-status error" data-testid="pronounce-status">' + esc(st.message) + '</div>' +
      '<div class="front-actions"><button class="btn primary" data-action="pronounce-front-start" data-testid="pronounce-front-retry">Réessayer</button>' + reveal + '</div>';
  }
  return reveal;
}
function recallView() {
  const e = session.current;
  if (session.phase === 'front') {
    const register = registerHintOf(e);
    return '<div class="session-card front" data-testid="session-card"><p class="eyebrow">' + esc(e.theme) + '</p><h1 class="prompt-fr">' + frHtml(e.fr) + '</h1>' +
      (register ? '<p class="prompt-register" data-testid="prompt-register">' + esc(register) + '</p>' : '') +
      '<p class="prompt-hint">Prononce à voix haute : le micro valide, puis la fiche s’affiche.</p>' +
      frontPronunciationHtml() + '</div>';
  }
  const answer = answerCard(e);
  if (session.phase === 'feedback') return answer + feedbackHtml();
  const pronunciationFailed = !!(session.pronunciation && session.pronunciation.status === 'done' && !session.pronunciation.good);
  if (pronunciationFailed) {
    return answer + '<div class="pronunciation-retry-note" data-testid="pronunciation-retry-note" role="status"><b>🎙️ Prononciation à retravailler</b><span>Réessaie le micro avant de passer au suivant, ou choisis de continuer.</span></div>' +
      '<div class="grade-row" data-testid="grade-row"><button class="btn primary" data-action="pronounce-front-start" data-testid="pronunciation-retry-start">🎙️ Réessayer à l’oral</button>' +
      '<button class="btn ghost danger-text" data-action="grade" data-grade="again" data-testid="grade-again">Je ne connaissais pas ce mot <kbd>1</kbd></button>' +
      '<button class="btn ghost" data-action="grade" data-grade="good" data-testid="grade-good">Passer quand même <kbd>2</kbd></button></div>';
  }
  return answer + '<div class="grade-row" data-testid="grade-row"><button class="btn ghost danger-text" data-action="grade" data-grade="again" data-testid="grade-again">Je ne connaissais pas ce mot <kbd>1</kbd></button>' +
    '<button class="btn primary" data-action="grade" data-grade="good" data-testid="grade-good">Passer au suivant <kbd>2</kbd></button></div>';
}
function pronunciations(entry) {
  const p = entry && state.progress ? state.progress[entry.id] : null;
  return p && Array.isArray(p.pronunciation) ? p.pronunciation : [];
}
function badPronunciation(entry) {
  const p = entry && state.progress ? state.progress[entry.id] : null;
  if (p && typeof p.pronunciationBad === 'boolean') return p.pronunciationBad;
  const history = pronunciations(entry);
  const last = history[history.length - 1];
  return !!last && last.good === false;
}
function pronunciationStats() {
  const rows = [];
  entries.forEach(function (entry) {
    const history = pronunciations(entry);
    if (!history.length) return;
    const recent = history.slice(-5);
    const average = Math.round(recent.reduce(function (sum, item) {
      return sum + Math.max(0, Math.min(100, Number(item && item.score) || 0));
    }, 0) / recent.length);
    const last = Math.round(Math.max(0, Math.min(100, Number(history[history.length - 1] && history[history.length - 1].score) || 0)));
    rows.push({ entry: entry, average: average, last: last, attempts: history.length, bad: badPronunciation(entry) });
  });
  const all = [];
  rows.forEach(function (row) {
    pronunciations(row.entry).forEach(function (item) { all.push(item); });
  });
  all.sort(function (a, b) { return (Number(b && b.t) || 0) - (Number(a && a.t) || 0); });
  const recent = all.slice(0, 40);
  const average = recent.length ? Math.round(recent.reduce(function (sum, item) {
    return sum + Math.max(0, Math.min(100, Number(item && item.score) || 0));
  }, 0) / recent.length) : 0;
  let best = 0;
  all.forEach(function (item) {
    best = Math.max(best, Math.min(100, Number(item && item.score) || 0));
  });
  const weak = rows.filter(function (row) { return row.last < 75 || row.average < 75; })
    .sort(function (a, b) { return a.last - b.last || a.average - b.average; })
    .slice(0, 3);
  const bad = rows.filter(function (row) { return row.bad; }).length;
  return { attempts: all.length, practiced: rows.length, average: average, best: Math.round(best), weak: weak, bad: bad };
}
function pronunciationPanelHtml(stats) {
  const weak = stats.weak.map(function (row) {
    return '<button type="button" class="pron-weak-chip" data-action="detail" data-id="' + attr(row.entry.id) + '">' +
      '<span>' + esc(row.entry.fr) + '</span><b>' + row.last + ' %</b></button>';
  }).join('');
  const actions = stats.bad || weak ? '<div class="head-actions">' +
    (stats.bad ? '<button class="btn ghost small" data-action="open-stage" data-stage="bad" data-testid="bad-pronunciation">⚠️ Mots mal prononcés · ' + stats.bad + '</button>' : '') +
    (weak ? '<button class="btn ghost small" data-action="practice-pronunciation" data-testid="practice-pronunciation">Travailler</button>' : '') + '</div>' : '';
  return '<section class="panel pronunciation-panel" data-testid="pronunciation-progress">' +
    '<div class="panel-head"><div><h2>Prononciation</h2><p>' + stats.practiced + ' mot(s) travaillé(s) · ' + stats.attempts + ' essai(s)</p></div>' +
    actions + '</div>' +
    '<div class="pron-stats"><div><b data-testid="pronunciation-average">' + stats.average + ' %</b><span>moyenne récente</span></div>' +
    '<div><b>' + stats.best + ' %</b><span>meilleur score</span></div>' +
    '<div><b>' + stats.weak.length + '</b><span>mot(s) à retravailler</span></div></div>' +
    (weak ? '<div class="pron-weak-list"><span class="context-label">À retravailler</span>' + weak + '</div>' : '<p class="hint">Tous tes derniers essais sont au vert. Continue à t’entraîner.</p>') +
    '</section>';
}
function journeyPanelHtml(stages) {
  const items = [
    ['new', 'Nouveaux', stages.new, 'Découvrir'],
    ['learning', 'En révision', stages.learning, 'Consolider'],
    ['validated', 'Validés', stages.validated, '10 révisions'],
    ['ultimate', 'Ultimes', stages.ultimate, '30 révisions']
  ];
  return '<section class="panel journey-panel" data-testid="journey-panel">' +
    '<div class="panel-head"><div><h2>Mon parcours</h2><p>10 révisions = validé · 30 = ultime</p></div></div>' +
    '<div class="journey-grid">' + items.map(function (item) {
      return '<button type="button" class="journey-card" data-action="open-stage" data-stage="' + item[0] + '" data-testid="journey-' + item[0] + '">' +
        '<b>' + item[2] + '</b><span>' + item[1] + '</span><small>' + item[3] + '</small></button>';
    }).join('') + '</div></section>';
}
function openStage(stage) {
  const allowed = ['new', 'learning', 'validated', 'ultimate', 'due', 'reviewed', 'bad', 'known', 'imported'];
  ui.filter = allowed.indexOf(stage) >= 0 ? stage : 'all';
  try { history.replaceState(null, '', '#mots'); } catch (e) { location.hash = 'mots'; }
  showView('library');
  renderLibraryList();
}
function pronunciationPhrase(entry) {
  return String((entry && entry.context) || '').trim();
}
function pronunciationTargetOf(entry) {
  return session && session.pronunciationTarget === 'phrase' && pronunciationPhrase(entry) ? 'phrase' : 'word';
}
function pronunciationEntry(entry, target) {
  if (target === 'phrase') {
    const phrase = pronunciationPhrase(entry);
    if (phrase) {
      const R = window.Kotoba.Reading;
      return { jp: phrase, reading: R && R.reading ? R.reading(phrase) : phrase, romaji: '', alternatives: [] };
    }
  }
  return entry;
}
function pronunciationDiffHtml(diff) {
  if (!Array.isArray(diff) || !diff.length) return '';
  const parts = diff.map(function (op) {
    if (!op) return '';
    if (op.type === 'same') return esc(op.expected);
    if (op.type === 'sub') return '<span class="pron-diff-bad" title="Entendu : ' + attr(op.heard) + '">' + esc(op.expected) + '</span>';
    if (op.type === 'del') return '<span class="pron-diff-missing" title="Son manquant">' + esc(op.expected) + '</span>';
    return '<span class="pron-diff-extra" title="Son en trop">+' + esc(op.heard) + '</span>';
  }).join('');
  return '<div class="pronounce-diff" data-testid="pronounce-diff"><span class="compare-label">Écart</span><span lang="ja">' + parts + '</span></div>';
}
function pronunciationMeterHtml() {
  return '<div class="pronounce-meter" data-testid="pronounce-meter" aria-hidden="true"><span data-testid="pronounce-level"></span></div>' +
    '<div class="pronounce-live"><span data-testid="pronounce-timer">0,0 s</span><span data-testid="pronounce-voice-hint">Parle maintenant…</span></div>';
}
function updatePronunciationMeter(level, info) {
  const bar = document.querySelector('[data-testid="pronounce-level"]');
  if (bar) bar.style.width = Math.max(0, Math.min(100, Math.round((Number(level) || 0) * 100))) + '%';
  const timer = document.querySelector('[data-testid="pronounce-timer"]');
  if (timer && info && info.elapsed != null) timer.textContent = (Math.max(0, Number(info.elapsed) || 0) / 1000).toFixed(1).replace('.', ',') + ' s';
  const hint = document.querySelector('[data-testid="pronounce-voice-hint"]');
  if (hint && info) hint.textContent = info.voiced ? 'Son détecté' : 'Parle maintenant…';
}
function savePronunciationScore(entry, result, target, engine) {
  if (!entry) return;
  const now = Date.now();
  if (!state.progress[entry.id]) state.progress[entry.id] = S.freshProgress(now);
  const p = state.progress[entry.id];
  const history = Array.isArray(p.pronunciation) ? p.pronunciation.slice(-11) : [];
  history.push({
    t: now,
    score: Math.max(0, Math.min(100, Math.round(Number(result.score) || 0))),
    good: !!result.good,
    target: target === 'phrase' ? 'phrase' : 'word',
    engine: engine === 'whisper' ? 'whisper' : 'browser',
    transcript: String(result.transcript || '').slice(0, 180),
    expected: String(result.expected || '').slice(0, 120)
  });
  p.pronunciation = history;
  p.pronunciationBad = !result.good;
  persist();
}
function clearPronunciationTimer() {
  if (session && session.pronunciationTimer) {
    clearTimeout(session.pronunciationTimer);
    session.pronunciationTimer = 0;
  }
}
function finishPronunciation(transcript, engine, token, preset) {
  if (!session || !session.current) return;
  if (token != null && session.pronunciationToken !== token) return;
  const entry = session.current;
  const target = pronunciationTargetOf(entry);
  const readingOf = window.Kotoba.Reading && window.Kotoba.Reading.reading ? window.Kotoba.Reading.reading : null;
  const result = preset || (window.Kotoba.Pronunciation
    ? window.Kotoba.Pronunciation.best([transcript], pronunciationEntry(entry, target), { readingOf: readingOf })
    : { transcript: String(transcript || ''), score: 0, good: false });
  session.pronunciation = {
    status: 'done',
    transcript: result.transcript,
    score: result.score,
    good: result.good,
    target: target,
    engine: engine,
    expected: result.expected || '',
    heard: result.heard || '',
    diff: result.diff || [],
    tip: result.tip || '',
    variant: !!result.variant,
    alternative: !!result.alternative,
    alternativeLabel: result.alternativeLabel || ''
  };
  session.recognition = null;
  clearPronunciationTimer();
  savePronunciationScore(entry, result, target, engine);
  if (session.mode === 'recall' && session.phase === 'front') session.phase = 'revealed';
  renderSession();
}
function abortPronunciation() {
  if (session) {
    clearPronunciationTimer();
    session.pronunciationToken = (session.pronunciationToken || 0) + 1;
    if (session.recognition) {
      try { session.recognition.abort(); } catch (e) { /* ignore */ }
      session.recognition = null;
    }
  }
  if (window.Kotoba.Whisper) { try { window.Kotoba.Whisper.abort(); } catch (e) { /* ignore */ } }
}
function stopPronunciation() {
  clearPronunciationTimer();
  if (window.Kotoba.Whisper) { try { window.Kotoba.Whisper.stop(); } catch (e) { /* ignore */ } }
  if (session && session.recognition && session.recognition.stop) {
    try { session.recognition.stop(); } catch (e) { /* ignore */ }
  }
}
function setPronunciationTarget(target) {
  if (!session) return;
  abortPronunciation();
  session.pronunciationTarget = target === 'phrase' ? 'phrase' : 'word';
  session.pronunciationAutoPhrase = false;
  session.pronunciation = null;
  state.settings.pronunciationTarget = session.pronunciationTarget;
  persist();
  renderSession();
}
function setPronunciationEngine(engine) {
  if (!session) return;
  abortPronunciation();
  session.pronunciationEngine = engine === 'whisper' ? 'whisper' : 'browser';
  session.pronunciation = null;
  state.settings.pronunciationEngine = session.pronunciationEngine;
  persist();
  renderSession();
}
function continueToPronunciationPhrase() {
  if (!session || !session.current) return;
  if (!pronunciationPhrase(session.current)) return;
  if (!session.pronunciation || !session.pronunciation.good || session.pronunciation.target !== 'word') return;
  abortPronunciation();
  session.pronunciationTarget = 'phrase';
  session.pronunciationAutoPhrase = true;
  session.pronunciation = null;
  renderSession();
}
function pronounceView() {
const e = session.current;
if (session.phase === 'feedback') return answerCard(e) + feedbackHtml();
const phrase = pronunciationPhrase(e);
const target = pronunciationTargetOf(e);
const engine = session.pronunciationEngine === 'whisper' ? 'whisper' : 'browser';
const browserOk = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
const whisperOk = !!(window.Kotoba.Whisper && window.Kotoba.Whisper.supported());
const st = session.pronunciation;
const stepHint = session.mode === 'pronounce' && phrase && !st && (target === 'word' || (target === 'phrase' && session.pronunciationAutoPhrase))
? '<p class="hint pronounce-step-hint" data-testid="pronounce-step-hint">' + (target === 'phrase'
? 'Étape 2 sur 2 · Le mot est validé : prononce maintenant toute la phrase.'
: 'Étape 1 sur 2 · Valide le mot, puis prononce la phrase complète.') + '</p>'
: '';
const targets = '<div class="pronounce-targets" role="group" aria-label="À prononcer">' +
'<button type="button" class="pronounce-target' + (target === 'word' ? ' active' : '') + '" data-action="pronounce-target" data-target="word" data-testid="pronounce-target-word">Le mot</button>' +
'<button type="button" class="pronounce-target' + (target === 'phrase' ? ' active' : '') + '" data-action="pronounce-target" data-target="phrase" data-testid="pronounce-target-phrase"' + (phrase ? '' : ' disabled title="Ce mot n’a pas encore de phrase de contexte"') + '>La phrase</button></div>';
const engines = '<div class="pronounce-engine" role="group" aria-label="Moteur de reconnaissance">' +
'<span class="pronounce-engine-label">Reconnaissance</span>' +
'<button type="button" class="' + (engine === 'browser' ? 'active' : '') + '" data-action="pronounce-engine" data-engine="browser" data-testid="pronounce-engine-browser"' + (browserOk ? '' : ' disabled title="Indisponible dans ce navigateur"') + '>Navigateur</button>' +
'<button type="button" class="' + (engine === 'whisper' ? 'active' : '') + '" data-action="pronounce-engine" data-engine="whisper" data-testid="pronounce-engine-whisper"' + (whisperOk ? '' : ' disabled title="Indisponible dans ce navigateur"') + '>IA locale</button></div>';
let shown = '';
if (target === 'phrase' && phrase) {
shown = '<div class="jp-big pronounce-phrase sentence-tip" lang="ja" data-testid="pronounce-phrase"' + translationTipAttrs(e.contextFr, e.context) + '>' + contextHtml(phrase, '', e) + '</div>' +
'<p class="hint pronounce-target-hint">' + esc(e.contextFr || 'Toute la phrase, sans t’arrêter.') + '</p>' +
wordByWordDetails(phrase, 'pronounce-word-by-word') +
contextNoteHtml(e);
} else {
shown = '<div class="jp-big" lang="ja" data-testid="pronounce-word">' + wordRubyHtml(e) + '</div>' +
(state.settings.romaji ? '<div class="romaji">' + esc(e.romaji) + '</div>' : '');
}
const audioText = target === 'phrase' && phrase ? phrase : e.jp;
let interaction = '';
if (!st) {
const label = engine === 'whisper' ? '🎙️ Enregistrer avec l’IA' : '🎙️ Prononcer';
interaction = '<button class="btn primary big mic-btn" data-action="pronounce-start" data-testid="pronounce-start">' + label + '</button>' +
'<p class="hint">' + (engine === 'whisper'
? 'Whisper tourne en local dans ton navigateur, sans clé ni serveur. Le modèle se télécharge au premier essai, puis reste en cache.'
: 'Autorise le micro, puis répète ' + (target === 'phrase' ? 'la phrase' : 'le mot') + '. La reconnaissance se fait dans ton navigateur.') + '</p>';
} else if (st.status === 'listening') {
interaction = '<div class="pronounce-status listening" data-testid="pronounce-status" aria-live="polite">🎙️ J’écoute… Parle maintenant.</div>' +
'<p class="hint" data-testid="pronounce-interim">' + esc(st.interim || 'La transcription apparaîtra ici.') + '</p>';
} else if (st.status === 'recording') {
interaction = '<div class="pronounce-status listening" data-testid="pronounce-status" aria-live="polite">🎙️ J’écoute… Parle maintenant.</div>' +
pronunciationMeterHtml() +
'<p class="hint">La capture s’arrête toute seule après un silence, ou appuie sur « J’ai fini ».</p>' +
'<div class="pronounce-actions"><button class="btn primary" data-action="pronounce-stop" data-testid="pronounce-stop">J’ai fini</button></div>';
} else if (st.status === 'loading' || st.status === 'transcribing') {
const pct = Math.max(0, Math.min(100, Number(st.progress) || 0));
interaction = '<div class="pronounce-status" data-testid="pronounce-status">' + esc(st.message || (st.status === 'transcribing' ? 'Transcription en cours…' : 'Préparation du moteur IA…')) + '</div>' +
(st.status === 'loading' ? '<div class="pronounce-progress"><span style="width:' + pct + '%"></span></div>' : '') +
'<p class="hint">Le premier passage télécharge le modèle ; les suivants sont plus rapides.</p>';
} else if (st.status === 'error') {
interaction = '<div class="pronounce-status error" data-testid="pronounce-status">' + esc(st.message) + '</div>' +
'<div class="pronounce-actions"><button class="btn primary" data-action="pronounce-retry">Réessayer</button>' +
'<button class="btn ghost" data-action="pronounce-finish" data-good="0" data-testid="pronounce-finish">Passer</button></div>';
} else {
const replay = st.engine === 'whisper' && window.Kotoba.Whisper && window.Kotoba.Whisper.hasRecording && window.Kotoba.Whisper.hasRecording()
? '<div class="pronounce-replay" data-testid="pronounce-replay">' +
'<button class="btn ghost small" data-action="pronounce-play" data-testid="pronounce-play">🎧 Ma voix</button></div>'
: '';
const toPhrase = st.good && st.target === 'word' && !!phrase;
const finishAction = toPhrase ? 'pronounce-sentence' : 'pronounce-finish';
const finishTestId = toPhrase ? 'pronounce-sentence' : 'pronounce-finish';
const finishLabel = toPhrase ? 'Valider le mot et prononcer la phrase' : (st.good ? 'Valider et continuer' : 'Continuer sans valider');
const finishGood = toPhrase || st.good ? '1' : '0';
const compare = (st.expected || st.heard) ? '<div class="pronounce-compare">' +
'<div><span class="compare-label">' + (st.alternative ? 'Accepté' : 'Attendu') + '</span><span lang="ja" data-testid="pronounce-expected">' + esc(st.expected || '—') + '</span></div>' +
'<div><span class="compare-label">Entendu</span><span lang="ja" data-testid="pronounce-heard">' + esc(st.heard || st.transcript || '—') + '</span></div>' +
(st.score < 100 ? pronunciationDiffHtml(st.diff) : '') + '</div>' : '';
interaction = '<div class="pronounce-result ' + (st.good ? 'good' : 'retry') + '" data-testid="pronounce-result">' +
'<div class="pronounce-score">' + (st.good ? '✅' : '❌') + '</div>' +
'<div><strong>' + (st.good ? 'C’est correct' : 'Ce n’est pas correct') + '</strong>' +
'<span>Score : <b data-testid="pronounce-score">' + st.score + ' %</b> · ' + (st.target === 'phrase' ? 'phrase' : 'mot') + '</span>' +
'<p class="hint">Entendu : ' + esc(st.transcript || '—') + '</p></div></div>' +
compare +
(st.alternative && st.good ? '<p class="variant-note" data-testid="pronounce-variant">Autre formulation acceptée. Les deux sont polies : « ' + esc(e.jp) + ' » est plus doux et général, « ' + esc(st.alternativeLabel || st.expected || '') + ' » plus direct.</p>' : '') +
    (st.tip ? '<p class="hint pronounce-tip" data-testid="pronounce-tip"><b>Conseil :</b> ' + esc(st.tip) + '</p>' : '') +
    pronunciationRhythmHtml(st) +
replay +
'<div class="pronounce-actions"><button class="btn primary" data-action="' + finishAction + '" data-good="' + finishGood + '" data-testid="' + finishTestId + '">' + finishLabel + '</button>' +
'<button class="btn ghost" data-action="pronounce-retry">Réessayer</button></div>';
}
return '<div class="session-card pronounce-card" data-testid="pronounce-card"><p class="eyebrow">Prononciation · ' + (target === 'phrase' ? 'phrase complète' : 'le mot') + ' · ' + (engine === 'whisper' ? 'IA locale' : 'navigateur') + '</p>' +
'<h1 class="prompt-fr">' + frHtml(e.fr) + '</h1>' + targets + stepHint + engines + shown +
'<div class="audio-row"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(audioText) + '">🔊 Écouter</button>' +
'<button class="btn ghost small" data-action="speak-text" data-text="' + attr(audioText) + '" data-slow="1">🐢 Lent</button></div>' + interaction + '</div>';
}
function phraseTypeLabel(type) {
  if (type === 'cloze') return 'Texte à trous';
  if (type === 'dictation') return 'Dictée';
  return 'Remise en ordre';
}
function phrasePromptHtml(exercise) {
  return '<p class="phrase-prompt" lang="ja" data-testid="phrase-prompt">' +
    (exercise.before ? contextHtml(exercise.before, '', null) : '') +
    '<span class="phrase-blank" aria-label="mot manquant">…</span>' +
    (exercise.after ? contextHtml(exercise.after, '', null) : '') + '</p>';
}
function phraseTokenButtons(exercise, ids) {
  return ids.map(function (id) {
    const token = exercise.tokens.filter(function (item) { return item.id === id; })[0];
    if (!token) return '';
    return '<button type="button" class="phrase-token" data-action="phrase-token" data-token="' + token.id + '" data-testid="phrase-token-' + token.id + '">' + esc(token.text) + '</button>';
  }).join('');
}
function phraseView() {
  const ex = session.exercise;
  if (!ex) return '<div class="session-card phrase-card" data-testid="phrase-card"><p>Exercice indisponible.</p></div>';
  if (session.phase === 'feedback') return phraseFeedbackHtml(ex);
  const intro = ex.type === 'cloze' ? 'Complète la phrase' : (ex.type === 'dictation' ? 'Écoute et reconstruis' : 'Remets la phrase dans l’ordre');
  const translation = ex.contextFr ? '<p class="phrase-translation">' + esc(ex.contextFr) + '</p>' : '';
  let body = '';
  if (ex.type === 'cloze') {
    body = phrasePromptHtml(ex) + translation +
      '<form class="phrase-form" data-form="phrase-cloze" data-testid="phrase-cloze">' +
      '<label for="phraseAnswer">Le mot manquant</label>' +
      '<div class="phrase-input-row"><input id="phraseAnswer" name="answer" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="kana ou romaji" data-testid="phrase-input">' +
      '<button class="btn primary" type="submit" data-testid="phrase-submit">Vérifier</button></div>' +
      '<p class="hint">Écris le mot en kana ou en romaji. Les deux sont acceptés.</p></form>' +
      '<button class="btn ghost small" type="button" data-action="phrase-reveal" data-testid="phrase-reveal">Voir la réponse</button>';
  } else {
    const selected = session.phraseSelection || [];
    const available = ex.shuffled.map(function (token) { return token.id; }).filter(function (id) { return selected.indexOf(id) < 0; });
    body = '<p class="phrase-instruction">' + (ex.type === 'dictation' ? 'Écoute la phrase, puis touche les mots dans le bon ordre.' : 'Touche les mots dans le bon ordre.') + '</p>' +
      (ex.type === 'dictation' ? '<button class="btn primary" data-action="speak-text" data-text="' + attr(ex.audioText) + '" data-testid="phrase-listen">🔊 Écouter</button>' : '') +
      translation +
      '<div class="phrase-selected" data-testid="phrase-selected">' + (selected.length ? phraseTokenButtons(ex, selected) : '<span class="phrase-placeholder">Les mots choisis apparaîtront ici.</span>') + '</div>' +
      '<div class="phrase-bank" data-testid="phrase-bank">' + phraseTokenButtons(ex, available) + '</div>' +
      '<div class="phrase-actions"><button class="btn primary" data-action="phrase-check" data-testid="phrase-check"' + (selected.length === ex.expectedIds.length ? '' : ' disabled') + '>Vérifier</button>' +
      '<button class="btn ghost" data-action="phrase-reset" data-testid="phrase-reset">Effacer</button>' +
      '<button class="btn ghost small" data-action="phrase-reveal" data-testid="phrase-reveal">Voir la réponse</button></div>';
  }
  return '<div class="session-card phrase-card" data-testid="phrase-card"><p class="eyebrow">Atelier de phrases · ' + esc(phraseTypeLabel(ex.type)) + '</p>' +
    '<h1 class="phrase-title">' + esc(intro) + '</h1>' + body + '</div>';
}
function phraseFeedbackHtml(ex) {
  const result = session.phraseResult || { good: false };
  const verdict = result.good ? '✅ Bien joué' : (result.revealed ? '👀 Réponse affichée' : '❌ À retravailler');
  return '<div class="session-card phrase-card" data-testid="phrase-card"><div class="phrase-result-head ' + (result.good ? 'good' : 'retry') + '" data-testid="phrase-result"><b>' + verdict + '</b>' +
    '<span>La phrase est maintenant complète.</span></div>' +
    '<div class="phrase-feedback"><div class="context-label">La phrase</div><p class="phrase-full" lang="ja" data-testid="phrase-full">' + contextHtml(ex.context, ex.target, session.current) + '</p>' +
    (ex.contextFr ? '<p class="phrase-translation">' + esc(ex.contextFr) + '</p>' : '') +
    '<p class="phrase-target">Mot travaillé : <b lang="ja">' + esc(ex.target) + '</b>' + (ex.reading && ex.reading !== ex.target ? ' · ' + esc(ex.reading) : '') + '</p>' +
    wordByWordDetails(ex.context, 'phrase-word-by-word') +
    '<div class="audio-row"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(ex.audioText) + '">🔊 Écouter</button>' +
    '<button class="btn ghost small" data-action="speak-text" data-text="' + attr(ex.audioText) + '" data-slow="1">🐢 Lent</button></div></div>' +
    '<div class="phrase-actions"><button class="btn primary" data-action="phrase-next" data-testid="phrase-next">Continuer</button></div></div>';
}
function finishPhrase(good, answer, revealed) {
  if (!session || session.mode !== 'phrase' || session.phase !== 'question') return;
  const now = Date.now();
  const xp = S.bumpStats(state, good ? 'good' : 'again', now);
  state.stats.phraseAttempts = (Number(state.stats.phraseAttempts) || 0) + 1;
  if (good) state.stats.phraseCorrect = (Number(state.stats.phraseCorrect) || 0) + 1;
  session.xp += xp;
  session.done++;
  if (good) session.correct++;
  session.lastGrade = good ? 'good' : 'again';
  session.lastXp = xp;
  session.lastDue = 0;
  session.phraseResult = { good: !!good, answer: String(answer || ''), revealed: !!revealed };
  session.phase = 'feedback';
  persist();
  flashValidation(good ? 'good' : 'again');
  toast(good ? '✅ Phrase correcte' : (revealed ? 'Réponse affichée' : '❌ Phrase à retravailler'));
  renderSession();
  updateChrome();
}
function choosePhraseToken(id) {
  if (!session || session.mode !== 'phrase' || session.phase !== 'question' || !session.exercise) return;
  const tokenId = Number(id);
  if (!Number.isFinite(tokenId)) return;
  const selected = session.phraseSelection || [];
  const at = selected.indexOf(tokenId);
  if (at >= 0) selected.splice(at, 1);
  else if (selected.length < session.exercise.expectedIds.length) selected.push(tokenId);
  session.phraseSelection = selected;
  renderSession();
}
function checkPhraseOrder() {
  if (!session || session.mode !== 'phrase' || !session.exercise) return;
  const result = PH.checkOrder(session.exercise, session.phraseSelection || []);
  finishPhrase(result.good, (session.phraseSelection || []).join(','), false);
}
function startWhisper(token) {
  const s = session;
  const W = window.Kotoba.Whisper;
  if (!W || !W.supported()) {
    s.pronunciation = { status: 'error', message: 'La reconnaissance IA locale n’est pas disponible dans ce navigateur. Choisis le moteur du navigateur.' };
    renderSession();
    return;
  }
  const target = pronunciationTargetOf(s.current);
  s.pronunciation = { status: 'loading', message: 'Préparation du moteur IA…', progress: 0 };
  renderSession();
  W.listen({
    maxMs: target === 'phrase' ? 15000 : 10000,
    silenceMs: 1200,
    onStatus: function (status, message) {
      if (session !== s || s.pronunciationToken !== token || !s.pronunciation) return;
      s.pronunciation.status = status;
      s.pronunciation.message = message || '';
      if (status === 'recording') s.pronunciation.progress = 0;
      renderSession();
    },
    onProgress: function (progress, message) {
      if (session !== s || s.pronunciationToken !== token || !s.pronunciation) return;
      s.pronunciation.status = 'loading';
      s.pronunciation.progress = progress;
      s.pronunciation.message = message || '';
      renderSession();
    },
    onLevel: function (level, info) {
      if (session !== s || s.pronunciationToken !== token) return;
      updatePronunciationMeter(level, info);
    }
  }).then(function (text) {
    if (session !== s || s.pronunciationToken !== token) return;
    const clean = String(text || '').trim();
    if (!clean) {
      s.pronunciation = { status: 'error', message: 'Je n’ai rien entendu. Rapproche-toi du micro et réessaie.' };
      renderSession();
      return;
    }
    finishPronunciation(clean, 'whisper', token);
  }).catch(function (err) {
    if (session !== s || s.pronunciationToken !== token) return;
    const message = err && err.message ? err.message : 'La transcription IA a échoué.';
    if (/annulée/i.test(message)) return;
    s.pronunciation = { status: 'error', message: message };
    renderSession();
  });
}
function startPronunciation() {
if (!session || !session.current) return;
if (session.mode === 'recall') {
  session.pronunciationTarget = 'word';
  if (session.phase === 'revealed') session.phase = 'front';
}
abortPronunciation();
const token = session.pronunciationToken;
if (session.pronunciationEngine === 'whisper') { startWhisper(token); return; }
const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!Ctor) {
session.pronunciation = { status: 'error', message: 'La reconnaissance vocale n’est pas disponible dans ce navigateur. Essaie Chrome ou Edge, ou choisis l’IA locale.' };
renderSession();
return;
}
if (session.recognition) { try { session.recognition.abort(); } catch (e) { /* ignore */ } session.recognition = null; }
const rec = new Ctor();
rec.lang = 'ja-JP';
rec.interimResults = true;
rec.continuous = false;
rec.maxAlternatives = 5;
session.recognition = rec;
session.pronunciation = { status: 'listening' };
renderSession();
let finished = false;
let interimList = [];
const failRecognition = function (message) {
  if (finished) return;
  finished = true;
  clearPronunciationTimer();
  if (!session || session.pronunciationToken !== token) return;
  session.pronunciation = { status: 'error', message: message };
  session.recognition = null;
  renderSession();
};
const finishOnce = function (list) {
  if (finished || !session || session.pronunciationToken !== token) return;
  finished = true;
  clearPronunciationTimer();
  const target = pronunciationTargetOf(session.current);
  const readingOf = window.Kotoba.Reading && window.Kotoba.Reading.reading ? window.Kotoba.Reading.reading : null;
  const best = window.Kotoba.Pronunciation
    ? window.Kotoba.Pronunciation.best(list, pronunciationEntry(session.current, target), { readingOf: readingOf })
    : { transcript: list[0] || '', score: 0, good: false };
  try { rec.stop(); } catch (e) { /* ignore */ }
  setTimeout(function () {
    if (!session || session.pronunciationToken !== token) return;
    finishPronunciation(best.transcript, 'browser', token, best);
  }, 160);
};
rec.onresult = function (event) {
  if (!session || session.pronunciationToken !== token || finished) return;
  const list = [];
  const results = (event && event.results) || [];
  for (let r = 0; r < results.length; r++) {
    const result = results[r];
    if (!result) continue;
    for (let i = 0; i < result.length; i++) {
      const transcript = String((result[i] && result[i].transcript) || '').trim();
      if (transcript) {
        if (result.isFinal) list.push(transcript);
        else if (interimList.indexOf(transcript) < 0) interimList.push(transcript);
      }
    }
  }
  if (list.length) {
    finishOnce(list);
    try { rec.stop(); } catch (e) { /* ignore */ }
    return;
  }
  if (interimList.length && session.pronunciation) {
    session.pronunciation.interim = interimList[interimList.length - 1];
    const live = document.querySelector('[data-testid="pronounce-interim"]');
    if (live) live.textContent = session.pronunciation.interim;
  }
};
rec.onerror = function (event) {
  const messages = {
    'not-allowed': 'Autorise le micro dans les réglages du navigateur, puis réessaie.',
    'service-not-allowed': 'Autorise le micro dans les réglages du navigateur, puis réessaie.',
    'no-speech': 'Je n’ai rien entendu. Rapproche-toi du micro et réessaie.',
    'audio-capture': 'Aucun micro détecté. Vérifie ton matériel.',
    'network': 'La reconnaissance vocale a besoin d’une connexion réseau.'
  };
  failRecognition(messages[event.error] || 'Je n’ai pas pu écouter. Réessaie.');
};
rec.onend = function () {
  if (!session || session.pronunciationToken !== token) return;
  if (!finished && interimList.length) {
    finishOnce(interimList);
    return;
  }
  if (!finished) {
    finished = true;
    clearPronunciationTimer();
    session.pronunciation = { status: 'error', message: 'Je n’ai rien entendu. Rapproche-toi du micro et réessaie.' };
    renderSession();
  }
  if (session.recognition === rec) session.recognition = null;
};
session.pronunciationTimer = setTimeout(function () {
  if (!session || session.pronunciationToken !== token || finished) return;
  finished = true;
  try { rec.abort(); } catch (e) { /* ignore */ }
  clearPronunciationTimer();
  if (session) {
    session.recognition = null;
    session.pronunciation = { status: 'error', message: 'Je n’ai rien entendu. Rapproche-toi du micro et réessaie.' };
    renderSession();
  }
}, 15000);
try { rec.start(); } catch (e) {
  failRecognition('Impossible de démarrer le micro. Vérifie les autorisations.');
}
}
function productionView() {
  const e = session.current;
  if (session.phase === 'feedback') {
    const attempt = session.productionAnswer
      ? '<p class="production-attempt" data-testid="production-attempt">Ta réponse : <b lang="ja">' + esc(session.productionAnswer) + '</b></p>'
      : '';
    return answerCard(e) + attempt + feedbackHtml();
  }
  return '<form class="session-card production-card" data-form="production" data-testid="production-card"><p class="eyebrow">Production écrite</p>' +
    '<h1 class="prompt-fr">' + frHtml(e.fr) + '</h1>' +
    '<p class="prompt-hint">Écris le mot en japonais. Kana, kanji ou romaji acceptés.</p>' +
    '<label class="production-input-wrap"><span class="sr-only">Ta réponse en japonais</span><input id="productionAnswer" name="answer" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="こんにちは / konnichiwa" data-testid="production-input"></label>' +
    '<div class="production-actions"><button class="btn primary" type="submit" data-testid="production-submit">Vérifier</button><button class="btn ghost" type="button" data-action="production-reveal" data-testid="production-reveal">Voir la réponse</button></div>' +
    '<p class="hint">La forme polie est attendue. Les espaces et la ponctuation sont ignorés.</p></form>';
}
function quizView() {
  const e = session.current;
  if (session.phase === 'feedback') return answerCard(e) + feedbackHtml();
  const listen = session.mode === 'listen';
  const comprehension = session.mode === 'comprehension';
  const prompt = comprehension
    ? '<h1 class="prompt-jp" data-testid="comprehension-prompt" lang="ja">' + wordRubyHtml(e) + '</h1><p class="prompt-hint">Que signifie ce mot ?</p>'
    : (listen
      ? '<button class="btn primary big" data-action="speak-text" data-text="' + attr(e.jp) + '" data-testid="listen-again">🔊 Réécouter</button><p class="prompt-hint">Clique sur « Réécouter », puis choisis le sens.</p>'
      : '<h1 class="prompt-fr">' + frHtml(e.fr) + '</h1><p class="prompt-hint">Quel mot japonais correspond ?</p>');
  return '<div class="session-card" data-testid="session-card"><p class="eyebrow">' + (comprehension ? 'Lis et choisis le sens' : (listen ? 'Écoute et choisis' : 'Choisis la bonne traduction')) + '</p>' + prompt +
    '<div class="options" data-testid="options">' + session.options.map(function (o, i) {
      return '<button class="option' + ((listen || comprehension) ? ' fr' : '') + '" data-action="choose" data-id="' + attr(o.id) + '" data-testid="option-' + i + '">' +
        ((listen || comprehension) ? esc(o.fr) : rubyHtml(o.ruby, state.settings.furigana)) + '<span class="option-key">' + (i + 1) + '</span></button>';
    }).join('') + '</div></div>';
}
function feedbackHtml() {
  const good = session.lastGrade === 'good';
  const wrongChoice = session.lastChoice && session.current && session.lastChoice !== session.current.id;
  return '<div class="feedback ' + (good ? 'good' : 'again') + '" data-testid="feedback"><div class="feedback-text"><strong>' + (good ? '✅ Bonne réponse' : '❌ Mauvaise réponse') + '</strong>' +
    '<span>Prochaine révision : ' + S.dueLabel(session.lastDue) + ' · +' + session.lastXp + ' XP</span>' + (wrongChoice ? '<span>La bonne réponse est affichée ci-dessus.</span>' : '') + '</div>' +
    '<button class="btn ' + (good ? 'primary' : 'warn') + '" data-action="continue-session" data-testid="session-next">Continuer <kbd>Entrée</kbd></button></div>';
}
function grammarSummaryHtml() {
  const summary = session && session.grammarSummary;
  if (!summary || !GRAMMAR) return '';
  const step = typeof GRAMMAR.nextStepFor === 'function' ? GRAMMAR.nextStepFor(state, summary.lessonId, summary.correct, summary.exerciseId) : null;
  const lesson = GRAMMAR.lessonById(summary.lessonId) || {};
  const title = summary.title || lesson.title || summary.lessonId;
  const meta = [summary.level || lesson.level || '', grammarTaskReason(summary.reason)].filter(Boolean).join(' · ');
  const score = Math.max(0, Math.min(100, Math.round(Number(summary.score) || 0)));
  return '<div class="summary-grammar" data-testid="summary-grammar">' +
    '<div class="summary-grammar-head"><div><p class="eyebrow">Grammaire du jour</p><b>' + esc(title) + '</b><small>' + esc(meta) + '</small></div><span class="grammar-history-score ' + (summary.correct ? 'good' : 'bad') + '" data-testid="summary-grammar-score">' + score + ' %</span></div>' +
    (step ? '<p class="summary-grammar-next" data-testid="summary-grammar-next-step"><b>Prochaine étape :</b> ' + esc(step.text) + '</p>' : '') +
    (step && step.lessonId ? '<button class="btn ghost small" data-action="grammar-summary-open" data-id="' + attr(step.lessonId) + '" data-exercise="' + attr(step.exerciseId || '') + '" data-testid="summary-grammar-open">' + esc(step.label) + '</button>' : '') +
  '</div>';
}
function summaryHtml() {
  const accuracy = session.done ? Math.round(session.correct / session.done * 100) : 0;
  const c = S.counts(entries, state, Date.now());
  const next = S.nextDue(entries, state, Date.now());
  const mistakes = MISTAKES ? MISTAKES.summary(state, entries, IMM ? IMM.stories : []) : null;
const dailyBonus = (session.kind === 'daily' && state.flags.daily === S.todayKey()) ? '<div class="summary-bonus" data-testid="daily-bonus">Défi du jour relevé : +20 XP bonus.</div>' : '';
  return '<div class="summary-card" data-testid="summary"><div class="summary-emoji">🎉</div><h1>Session terminée !</h1><p class="muted">' + (session.done ? 'Bien joué, continue comme ça.' : 'Rien à faire pour l\'instant.') + '</p>' +
    '<div class="summary-stats"><div><b>' + session.done + '</b><span>' + (session.kind === 'today' || session.kind === 'mistakes' ? 'étapes' : 'cartes') + '</span></div><div><b>' + accuracy + '%</b><span>réussite</span></div><div><b>+' + session.xp + '</b><span>XP</span></div></div>' +
    grammarSummaryHtml() +
    '<p class="hint">' + (next ? 'Prochaine révision : ' + S.dueLabel(next) + '.' : 'Tu es à jour.') + '</p>' + dailyBonus + '<div class="summary-actions">' +
    '<button class="btn primary" data-action="finish-session" data-testid="finish-session">Retour à l\'accueil</button>' +
    (c.due ? '<button class="btn ghost" data-action="start-again" data-testid="start-again">Réviser encore</button>' : '') + (mistakes && mistakes.total ? '<button class="btn ghost" data-action="start-mistakes" data-testid="summary-mistakes">Revoir mes erreurs · ' + mistakes.total + '</button>' : '') + '</div></div>';
}
function reveal() {
  if (!session || session.phase !== 'front') return;
  if (session.pronunciation && session.pronunciation.status !== 'done') {
    abortPronunciation();
    session.pronunciation = null;
  }
  session.phase = 'revealed';
  renderSession();
}
function flashValidation(grade) {
  const flash = $('#validationFlash');
  if (!flash) return;
  if (ui.validationTimer) clearTimeout(ui.validationTimer);
  flash.className = 'validation-flash ' + (grade === 'good' ? 'good' : 'bad');
  flash.textContent = grade === 'good' ? '✅ Bonne réponse' : '❌ Mauvaise réponse';
  flash.hidden = false;
  ui.validationTimer = setTimeout(function () {
    flash.hidden = true;
    flash.className = 'validation-flash';
  }, 700);
}
function grade(g) {
  if (!session || !session.current) return;
  const e = session.current, now = Date.now();
  const beforeXp = todayXp();
const beforeStreak = state.stats.streak || 0;
const prev = state.progress[e.id] || S.freshProgress(now);
const stageBefore = S.reviewStage(prev);
const next = S.schedule(prev, g, now);
const stageAfter = S.reviewStage(next);
if ((session.mode === 'recall' || session.mode === 'pronounce') && g === 'good') next.said = (prev.said || 0) + 1;
state.progress[e.id] = next;
  const xp = S.bumpStats(state, g, now);
  session.xp += xp; session.done++;
  if (g === 'good') session.correct++;
  session.lastGrade = g; session.lastXp = xp; session.lastDue = state.progress[e.id].due;
  if (g === 'again') session.tasks.splice(Math.min(3, session.tasks.length), 0, wordTask(e, session.mode, session.task && session.task.target));
  session.total = Math.max(session.total, session.done + session.tasks.length);
  persist();
  flashValidation(g);
  toast(g === 'good' ? '✅ Bonne réponse' : '❌ Mauvaise réponse');
  if (window.Kotoba.Motivation) {
const goal = state.settings.goal || 50;
if (beforeXp < goal && todayXp() >= goal) window.Kotoba.Motivation.celebrate('Objectif du jour atteint ! 🎯');
else if (state.stats.streak > beforeStreak && [3, 7, 14, 30, 100].indexOf(state.stats.streak) >= 0) window.Kotoba.Motivation.celebrate('Série de ' + state.stats.streak + ' jours ! 🔥');
}
  if (stageAfter !== stageBefore && (stageAfter === 'validated' || stageAfter === 'ultimate')) {
    toast(stageAfter === 'validated' ? '🎉 « ' + e.fr + ' » atteint 10 révisions : révision validée.' : '🏆 « ' + e.fr + ' » atteint 30 révisions : révision ultime.');
  }
  if (session.mode === 'recall' && g === 'good') {
    nextCard();
    updateChrome();
    return;
  }
session.phase = 'feedback';
  renderSession();
  updateChrome();
}
function choose(id) { if (session && session.phase === 'question' && session.current) { session.lastChoice = id; grade(id === session.current.id ? 'good' : 'again'); } }
function quitSession() {
  if (!session) return;
  if (session.done > 0 && !window.confirm('Quitter la session ? Ta progression est déjà enregistrée.')) return;
  closeSession();
}function closeSession() {
  stopConversationTaskVoice();
  abortPronunciation();
  session = null;
  const root = $('#session');
  if (root) { root.hidden = true; root.innerHTML = ''; }
  document.body.style.overflow = '';
  render();
  window.scrollTo(0, 0);
  if (SY && SY.session().loggedIn) syncCloud(false);
}
function syncCloud(manual) {
  if (!SY) {
    if (manual) toast('La synchronisation n’est pas disponible.');
    return Promise.resolve(false);
  }
  if (!SY.session().loggedIn) {
    if (manual) { openAccount(); toast('Connecte-toi pour synchroniser.'); }
    return Promise.resolve(false);
  }
  if (session) {
    if (manual) toast('Termine ou quitte la session pour synchroniser.');
    return Promise.resolve(false);
  }
  if (syncBusy) {
    if (manual) toast('Synchronisation déjà en cours…');
    return Promise.resolve(false);
  }
  syncBusy = true;
  return SY.sync(state).then(function (result) {
    if (result && result.state) applySyncedState(result.state);
    if (manual) toast('Progression synchronisée.');
    return true;
  }).catch(function (error) {
    if (manual) toast(error && error.message ? error.message : 'Synchronisation impossible. Réessaie plus tard.');
    return false;
  }).then(function (ok) {
    syncBusy = false;
    updateChrome();
    return ok;
  });
}
function queueSync() {
  if (!SY || session || !SY.session().loggedIn) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(function () { syncCloud(false); }, 5000);
}
function applySyncedState(next) {
  if (!next || typeof next !== 'object') return;
  if (next.entries && typeof next.entries === 'object') state.entries = next.entries;
  if (next.progress && typeof next.progress === 'object') state.progress = next.progress;
  state.stats = Object.assign({}, state.stats, next.stats || {});
  state.settings = Object.assign({}, state.settings, next.settings || {});
  state.flags = Object.assign({}, state.flags, next.flags || {});
  if (next.conversationReview && typeof next.conversationReview === 'object') state.conversationReview = next.conversationReview;
  if (next.immersion && typeof next.immersion === 'object') state.immersion = next.immersion;
  if (next.grammar && typeof next.grammar === 'object') state.grammar = next.grammar;
  if (next.createdAt) state.createdAt = Math.min(state.createdAt || next.createdAt, next.createdAt);
  if (next.version) state.version = next.version;
  entries = buildEntries();
  S.save(state);
  applyTheme();
  render();
}
function finishSession() {
  closeSession();
  try { history.replaceState(null, '', '#apprendre'); } catch (e) { /* ignore */ }
  showView('learn');
}
function startAgain() { closeSession(); if (S.counts(entries, state, Date.now()).due) startSession('due', 'recall'); else toast('Rien à réviser pour l\'instant.'); }

/* ---------- Modales ---------- */
function openModal(title, body) {
  hideSentenceTooltip();
  const modal = $('#modal');
  if (!modal) return;
  ui.lastFocus = document.activeElement;
  modal.innerHTML = '<div class="modal-backdrop" data-action="close-modal"></div><div class="modal-panel" role="dialog" aria-modal="true" aria-label="' + attr(title) + '">' +
    '<div class="modal-head"><h2>' + esc(title) + '</h2><button class="icon-btn" data-action="close-modal" aria-label="Fermer">✕</button></div><div class="modal-body">' + body + '</div></div>';
  modal.hidden = false;
  const panel = $('.modal-panel', modal);
  if (panel) { const focusable = panel.querySelector('button, input, select, textarea, [tabindex]'); if (focusable) setTimeout(function () { focusable.focus(); }, 30); }
}
function closeModal() {
  hideSentenceTooltip();
  const modal = $('#modal');
  if (!modal) return;
  modal.hidden = true; modal.innerHTML = '';
  if (ui.lastFocus && ui.lastFocus.focus) { try { ui.lastFocus.focus(); } catch (e) { /* ignore */ } }
  ui.lastFocus = null;
}
function formatSyncDate(ts) {
  if (!ts) return 'Pas encore synchronisé';
  try { return new Date(ts).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }); } catch (e) { return 'Récemment'; }
}
function accountPanelHtml() {
  if (!SY) return '';
  const account = SY.session();
  if (account.loggedIn) {
    return '<section class="panel account-panel" data-testid="account-panel">' +
      '<div class="account-panel-icon" aria-hidden="true">👤</div>' +
      '<div class="account-panel-copy"><p class="eyebrow">Compte</p><h2>Ta progression suit tes appareils</h2>' +
      '<p><span class="account-email">' + esc(account.email) + '</span> · ' + (account.lastSync ? 'dernière synchro ' + esc(formatSyncDate(account.lastSync)) : 'prête pour la première synchro') + '</p>' +
      '<span class="account-state">Compte connecté</span></div>' +
      '<div class="account-panel-actions"><button class="btn primary small" data-action="sync-now">Synchroniser</button><button class="btn ghost small" data-action="open-account">Gérer</button></div></section>';
  }
  return '<section class="panel account-panel" data-testid="account-panel">' +
    '<div class="account-panel-icon" aria-hidden="true">📱</div>' +
    '<div class="account-panel-copy"><p class="eyebrow">Téléphone + ordinateur</p><h2>Retrouve ton japonais partout</h2>' +
    '<p>Crée un compte gratuit pour synchroniser tes révisions, tes mots importés et tes statistiques entre ton téléphone et ton PC.</p></div>' +
    '<div class="account-panel-actions"><button class="btn primary small" data-action="open-account">Se connecter</button></div></section>';
}
function setSyncMode(mode) {
  const form = $('[data-form="sync-auth"]');
  if (!form) return;
  const nextMode = mode === 'register' ? 'register' : 'login';
  form.querySelector('[name="mode"]').value = nextMode;
  $$('[data-action="sync-mode"]').forEach(function (button) {
    button.classList.toggle('active', button.getAttribute('data-mode') === nextMode);
  });
  const password = form.querySelector('[name="password"]');
  if (password) password.setAttribute('autocomplete', nextMode === 'register' ? 'new-password' : 'current-password');
  const hint = form.querySelector('[data-sync-hint]');
  if (hint) hint.textContent = nextMode === 'register' ? 'Choisis un mot de passe de 8 caractères minimum. Il protège ton compte et ta progression.' : 'Entre l’e-mail et le mot de passe utilisés sur ton autre appareil.';
  const submit = form.querySelector('[data-sync-submit]');
  if (submit) submit.textContent = nextMode === 'register' ? 'Créer mon compte' : 'Se connecter';
}
function openAccount() {
  if (!SY) { toast('La synchronisation n’est pas disponible.'); return; }
  const account = SY.session();
  if (account.loggedIn) {
    openModal('Compte', '<div class="sync-account-card"><span class="account-state">Compte connecté</span><strong>' + esc(account.email) + '</strong><small>' + (account.lastSync ? 'Dernière synchronisation : ' + esc(formatSyncDate(account.lastSync)) : 'Aucune synchronisation effectuée pour le moment.') + '</small></div>' +
      '<p class="sync-hint">La fusion garde le plus récent de chaque mot et réunit les mots importés. Tes réglages d’appareil restent prioritaires.</p>' +
      '<div class="sync-actions"><button class="btn primary" data-action="sync-now">Synchroniser maintenant</button><button class="btn ghost" data-action="sync-logout">Se déconnecter</button></div>' +
      '<div class="sync-danger"><button class="btn danger-text" data-action="sync-delete-account">Supprimer mon compte</button><p class="sync-hint">Le compte et la sauvegarde en ligne seront supprimés. La progression de cet appareil restera locale.</p></div>');
    return;
  }
  openModal('Compte et synchronisation', '<div class="sync-tabs" role="tablist" aria-label="Connexion ou création de compte">' +
    '<button type="button" class="active" data-action="sync-mode" data-mode="login">Se connecter</button>' +
    '<button type="button" data-action="sync-mode" data-mode="register">Créer un compte</button></div>' +
    '<form class="sync-form" data-form="sync-auth"><input type="hidden" name="mode" value="login">' +
    '<label>E-mail<input name="email" type="email" inputmode="email" autocomplete="email" placeholder="toi@exemple.fr" maxlength="254" required></label>' +
    '<label>Mot de passe<input name="password" type="password" autocomplete="current-password" minlength="8" maxlength="128" required></label>' +
    '<p class="sync-hint" data-sync-hint>Entre l’e-mail et le mot de passe utilisés sur ton autre appareil.</p>' +
    '<div class="sync-form-actions"><button class="btn primary" type="submit" data-sync-submit>Se connecter</button><button class="btn ghost" type="button" data-action="close-modal">Plus tard</button></div></form>' +
    '<p class="sync-hint">Sans compte, tout continue de fonctionner hors ligne. Avec un compte, chaque session terminée est synchronisée automatiquement.</p>');
}
function handleSyncAuth(form) {
  if (!SY) return;
  const fd = new FormData(form);
  const mode = String(fd.get('mode') || 'login');
  const email = String(fd.get('email') || '').trim();
  const password = String(fd.get('password') || '');
  if (!email || !password) { toast('Renseigne ton e-mail et ton mot de passe.'); return; }
  const button = form.querySelector('[data-sync-submit]');
  const oldLabel = button ? button.textContent : '';
  if (button) { button.disabled = true; button.textContent = mode === 'register' ? 'Création…' : 'Connexion…'; }
  const action = mode === 'register' ? SY.register(email, password) : SY.login(email, password);
  action.then(function () {
    return syncCloud(false);
  }).then(function (ok) {
    closeModal();
    render();
    toast(ok ? (mode === 'register' ? 'Compte créé. Ta progression est synchronisée.' : 'Compte connecté. Ta progression est synchronisée.') : 'Compte connecté. La synchronisation réessaiera plus tard.');
  }).catch(function (error) {
    if (button) { button.disabled = false; button.textContent = oldLabel; }
    toast(error && error.message ? error.message : 'Connexion impossible.');
  });
}
function syncLogout() {
  if (!SY) return;
  SY.logout().then(function () {
    closeModal();
    render();
    toast('Déconnecté sur cet appareil. Ta progression reste accessible.');
  });
}
function syncDeleteAccount() {
  if (!SY) return;
  if (!window.confirm('Supprimer définitivement ton compte et sa sauvegarde en ligne ? La progression locale restera sur cet appareil.')) return;
  SY.deleteAccount().then(function () {
    closeModal();
    render();
    toast('Compte supprimé. Ta progression locale est conservée.');
  }).catch(function (error) {
    toast(error && error.message ? error.message : 'Suppression impossible.');
  });
}
function openSettings() {
  const s = state.settings;
  const account = SY ? SY.session() : null;
  const goals = [20, 30, 50, 100];
  const backups = S.backupInfo();
  const lastBackup = backups.length ? new Date(backups[backups.length - 1].t).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '';
  openModal('Réglages', '<div class="setting-row"><div><strong>Compte et synchronisation</strong><small>' + (account && account.loggedIn ? esc(account.email) + ' · téléphone et PC' : 'Retrouve ta progression sur ton téléphone et ton PC') + '</small></div><button class="btn ghost small" data-action="open-account">' + (account && account.loggedIn ? 'Gérer' : 'Se connecter') + '</button></div>' +
    '<div class="setting-row"><div><strong>Objectif quotidien</strong><small>XP à gagner chaque jour</small></div><div class="seg">' +
    goals.map(function (g) { return '<button class="' + (s.goal === g ? 'active' : '') + '" data-action="set-goal" data-goal="' + g + '">' + g + '</button>'; }).join('') + '</div></div>' +
    '<div class="setting-row"><div><strong>Furigana</strong><small>Lecture au-dessus des kanji</small></div><label class="switch"><input type="checkbox" data-setting="furigana"' + (s.furigana ? ' checked' : '') + '> Afficher</label></div>' +
    '<div class="setting-row"><div><strong>Romaji</strong><small>Prononciation en lettres latines</small></div><label class="switch"><input type="checkbox" data-setting="romaji"' + (s.romaji ? ' checked' : '') + '> Afficher</label></div>' +
    '<div class="setting-row"><div><strong>Thème</strong><small>Clair, sombre ou système</small></div><select data-setting="theme"><option value="system"' + (s.theme === 'system' ? ' selected' : '') + '>Système</option><option value="light"' + (s.theme === 'light' ? ' selected' : '') + '>Clair</option><option value="dark"' + (s.theme === 'dark' ? ' selected' : '') + '>Sombre</option></select></div>' +
    '<div class="setting-row"><div><strong>Vitesse audio</strong><small>Voix japonaise du navigateur</small></div><div style="display:flex;align-items:center;gap:8px"><input type="range" min="0.5" max="1.3" step="0.05" value="' + s.rate + '" data-setting="rate" style="width:110px"><button class="btn ghost small" data-action="test-voice">Tester</button></div></div>' +
    '<div class="setting-row"><div><strong>Sauvegarde</strong><small>Exporte ou transfère ta progression sur un autre appareil</small></div><div class="modal-actions" style="margin:0"><button class="btn ghost small" data-action="export-data">Exporter</button><button class="btn ghost small" data-action="import-data">Importer</button></div></div>' +
    '<div class="setting-row"><div><strong>Sauvegarde locale automatique</strong><small>' + (lastBackup ? 'Dernier point : ' + esc(lastBackup) : 'Aucun point local pour l’instant') + '</small></div><button class="btn ghost small" data-action="restore-backup" data-testid="restore-backup"' + (lastBackup ? '' : ' disabled') + '>Restaurer</button></div>' +
    '<input type="file" id="dataFile" accept=".json,application/json" hidden><div class="modal-actions"><button class="btn danger-text" data-action="reset-data">Tout effacer</button></div>' +
    '<p class="hint">' + (account && account.loggedIn ? 'Compte connecté : ta progression est synchronisée après chaque session.' : 'Kotoba stocke tout dans ce navigateur. Utilise l\'export ou un compte pour passer d\'un appareil à l\'autre.') + '</p>' +
    '<p class="hint data-credit">Sources : <a href="https://kanjikana.com/en/words/core-1000" target="_blank" rel="noopener">Kanjikana Core 1000</a> (CC BY 4.0) · <a href="https://tatoeba.org" target="_blank" rel="noopener">Tatoeba</a> (CC BY 2.0 FR).</p>');
}
function politeFormsHtml(e) {
  const f = e && e.politeForms;
  if (!f) return '';
  const labels = [
    ['present', 'Présent'],
    ['negative', 'Négatif'],
    ['past', 'Passé'],
    ['pastNegative', 'Passé négatif'],
    ['question', 'Question']
  ];
  const rows = labels.map(function (pair) {
    const form = f[pair[0]];
    if (!form) return '';
    return '<div class="polite-form-row"><span>' + pair[1] + '</span><b lang="ja">' + rubyHtml(form.ruby, state.settings.furigana) + '</b><em>' + esc(form.romaji) + '</em></div>';
  }).join('');
  const dictionary = e.dictionaryForm && e.dictionaryForm !== e.jp
    ? '<p class="dictionary-note">Forme du dictionnaire : <b lang="ja">' + esc(e.dictionaryForm) + '</b> (' + esc(e.dictionaryRomaji || '') + '). La carte utilise la forme polie.</p>'
    : '';
  return '<div class="polite-forms" data-testid="polite-forms"><div class="context-label">Conjugaison polie</div>' + rows + dictionary + '</div>';
}
function examplesHtml(e) {
  const examples = e && Array.isArray(e.examples) ? e.examples : [];
  if (!examples.length) return '';
  return '<div class="examples-block" data-testid="examples"><div class="context-label">Autres exemples</div>' +
    examples.map(function (ex) {
      return '<div class="example-row"><p class="context-jp" lang="ja">' + contextHtml(ex.jp, '', e) + '</p><p class="context-fr">' + esc(ex.fr) + '</p></div>';
    }).join('') + '</div>';
}
function openDetail(id) {
const e = entries.filter(function (x) { return x.id === id; })[0];
if (!e) return;
ui.detailId = id;
const p = state.progress[id];
const stage = S.stageProgress(p);
const totalReviews = p ? ((p.reps || 0) + (p.lapses || 0)) : 0;
const meta = ['Niveau : ' + S.levelLabel(p), p && p.last ? 'Prochaine révision : ' + S.dueLabel(p.due) : 'Jamais révisé',
plural((p && p.said) || 0, 'prononciation', 'prononciations'),
plural(totalReviews, 'révision', 'révisions'),
plural((p && p.reps) || 0, 'réussite', 'réussites'),
p && p.lapses ? plural(p.lapses, 'oubli', 'oublis') : ''].filter(Boolean)
.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('');
const recentPronunciations = pronunciations(e).slice(-5).reverse();
const pronunciationHistory = recentPronunciations.length
? '<div class="pronunciation-history" data-testid="pronunciation-history"><div class="context-label">Derniers scores de prononciation</div><ul>' +
recentPronunciations.map(function (item) {
const day = item && item.t ? new Date(item.t).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '';
return '<li><span class="pron-score' + (item && item.good ? ' good' : '') + '">' + Math.round(Number(item && item.score) || 0) + ' %</span>' +
'<span>' + (item && item.target === 'phrase' ? 'Phrase' : 'Mot') + ' · ' + (item && item.engine === 'whisper' ? 'IA locale' : 'Navigateur') + (day ? ' · ' + esc(day) : '') + '</span>' +
(item && item.transcript ? '<span class="pron-transcript">' + esc(item.transcript) + '</span>' : '') + '</li>';
}).join('') + '</ul></div>'
: '';
const stageHtml = '<div class="stage-progress" data-testid="stage-progress">' +
'<div class="stage-progress-head"><span>' + esc(stage.detail) + '</span><b>' + stage.count + ' révision' + (stage.count === 1 ? '' : 's') + '</b></div>' +
'<div class="bar"><span class="bar-fill" style="width:' + stage.pct + '%"></span></div></div>';
const nuance = nuanceOf(e);
const nuanceHtml = nuance ? '<p class="nuance-note" data-testid="detail-nuance">' + esc(nuance) + '</p>' : '';
openModal('Fiche du mot', `
<div class='detail-top'><div class='detail-fr'><span class='detail-label'>Français</span>${frHtml(e.fr)}</div>${nuanceHtml}<div class='detail-jp' lang='ja'>${wordRubyHtml(e)}</div>
<div class='detail-romaji'>${esc(e.romaji)}</div>${politeFormsHtml(e)}${alternativesHtml(e)}<div class='audio-row' style='justify-content:center'><button class='btn ghost small' data-action='speak-text' data-text='${attr(e.jp)}'>🔊 Écouter</button>
<button class='btn ghost small' data-action='speak-text' data-text='${attr(e.jp)}' data-slow='1'>🐢 Lent</button></div></div>
<div class='detail-context'><div class='context-label'>En contexte</div><p class='jp sentence-tip' lang='ja'${translationTipAttrs(e.contextFr, e.context)}>${contextHtml(e.context, e.hl, e)}</p><p class='muted small'>${esc(e.contextFr || '—')}</p>${wordByWordDetails(e.context, 'detail-word-by-word')}${contextNoteHtml(e)}
${e.context ? '<button class=\'btn ghost small\' data-action=\'speak-text\' data-text=\'' + attr(e.context) + '\'>🔊 La phrase</button>' : ''}${examplesHtml(e)}</div>
${stageHtml}
${pronunciationHistory}
<div class='detail-meta'>${meta}<span>${esc(stage.label)}</span><span>${esc(e.source === 'import' ? 'Importé' : e.theme)}</span></div>
<div class='modal-actions'><button class='btn primary small' data-action='review-one' data-id='${attr(e.id)}'>Réviser ce mot</button><button class="btn ghost small" data-action="pronounce-one">🎙️ Prononcer</button>${e.source === 'import' ? '<button class=\'btn ghost small\' data-action=\'edit-entry\' data-id=\'' + attr(e.id) + '\'>Modifier</button>' : ''}${p ? '<button class=\'btn ghost small\' data-action=\'reset-progress\' data-id=\'' + attr(e.id) + '\'>Réinitialiser la progression</button>' : ''}${e.source === 'import' ? '<button class=\'btn ghost small danger-text\' data-action=\'delete-entry\' data-id=\'' + attr(e.id) + '\'>Supprimer</button>' : ''}</div>`);
}

function openEdit(id) {
  const e = state.entries[id];
  if (!e) return;
  openModal('Modifier le mot', '<form class="edit-form" data-form="edit" data-id="' + attr(id) + '">' +
    '<label>Français<input name="fr" value="' + attr(e.fr) + '" required></label><label>Japonais<input name="jp" value="' + attr(e.jp) + '" required></label>' +
    '<label>Romaji<input name="romaji" value="' + attr(e.romaji || '') + '"></label><label>Phrase de contexte<input name="context" value="' + attr(e.context || '') + '"></label>' +
    '<label>Traduction du contexte<input name="contextFr" value="' + attr(e.contextFr || '') + '"></label><p class="hint">Pour ajouter un furigana, écris par exemple 食[た]べる.</p>' +
    '<div class="modal-actions"><button class="btn primary" type="submit">Enregistrer</button><button class="btn ghost" type="button" data-action="detail" data-id="' + attr(id) + '">Annuler</button></div></form>');
}
function deleteEntry(id) {
  if (!state.entries[id]) return;
  if (!window.confirm('Supprimer ce mot importé ?')) return;
  delete state.entries[id]; delete state.progress[id];
  entries = buildEntries(); persist(); closeModal(); render(); toast('Mot supprimé.');
}
function resetProgress(id) {
  if (!window.confirm('Réinitialiser la progression de ce mot ?')) return;
  delete state.progress[id]; persist(); closeModal(); render(); toast('Progression réinitialisée.');
}
function exportData() { download('kotoba-sauvegarde-' + S.todayKey() + '.json', S.exportState(state)); toast('Sauvegarde exportée.'); }
function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const next = S.importState(String(reader.result || ''));
      if (!window.confirm('Remplacer ta progression actuelle par cette sauvegarde ?')) return;
      Object.keys(state).forEach(function (k) { delete state[k]; });
      Object.keys(next).forEach(function (k) { state[k] = next[k]; });
      entries = buildEntries(); persist(); applyTheme(); closeModal(); render(); updateChrome(); toast('Sauvegarde restaurée.');
    } catch (err) { toast(err.message || 'Sauvegarde invalide.'); }
  };
  reader.onerror = function () { toast('Impossible de lire le fichier.'); };
  reader.readAsText(file, 'utf-8');
}
function restoreBackup() {
  const backup = S.latestBackup();
  if (!backup) { toast('Aucune sauvegarde locale disponible.'); return; }
  if (!window.confirm('Restaurer le dernier point de sauvegarde local ? La progression actuelle sera remplacée.')) return;
  Object.keys(state).forEach(function (k) { delete state[k]; });
  Object.keys(backup).forEach(function (k) { state[k] = backup[k]; });
  entries = buildEntries();
  persist();
  applyTheme();
  closeModal();
  render();
  updateChrome();
  toast('Dernier point local restauré.');
}
function resetAll() {
  if (!window.confirm('Effacer toute la progression et les mots importés ?')) return;
  if (!window.confirm('Cette action est définitive. Confirmer ?')) return;
  S.reset();
  const fresh = S.defaultState();
  Object.keys(state).forEach(function (k) { delete state[k]; });
  Object.keys(fresh).forEach(function (k) { state[k] = fresh[k]; });
  entries = buildEntries(); persist(); applyTheme(); closeModal(); render(); updateChrome(); toast('Tout a été effacé.');
}

/* ---------- Grammaire B1/B2 ---------- */
function grammarTrackJp(jp, kana) {
  if (!jp) return '';
  if (!state.settings.furigana) return esc(jp);
  const annotated = P.annotate(jp, kana || jp);
  if (window.Kotoba.Reading && window.Kotoba.Reading.romajiRubyHtml) return window.Kotoba.Reading.romajiRubyHtml(annotated);
  return esc(jp);
}
function grammarReadingHtml(item) {
  return '<span class="grammar-kana">' + esc(item.kana || '') + '</span><span class="grammar-romaji">' + esc(item.romaji || '') + '</span>';
}
function grammarExampleHtml(example) {
  return '<div class="grammar-example grammar-track-example">' +
    '<div class="grammar-track-jp" lang="ja">' + grammarTrackJp(example.jp, example.kana) + '</div>' +
    '<div class="grammar-track-reading">' + grammarReadingHtml(example) + '</div>' +
    '<div class="grammar-fr">' + esc(example.fr) + '</div>' +
    '<button class="btn ghost small" data-action="speak-text" data-text="' + attr(example.jp) + '">🔊 Écouter</button>' +
  '</div>';
}
function grammarPatternHtml(item) {
  return '<div class="grammar-pattern">' +
    '<div class="grammar-pattern-jp" lang="ja">' + grammarTrackJp(item.jp, item.kana) + '</div>' +
    '<div class="grammar-pattern-reading">' + grammarReadingHtml(item) + '</div>' +
    '<div class="grammar-pattern-fr">' + esc(item.fr) + '</div>' +
  '</div>';
}
function grammarLessonCardHtml(lesson, index) {
  const progress = GRAMMAR.progressFor(state, lesson.id);
  const answered = Object.keys(progress.answers).length;
  const percent = progress.completedAt ? progress.bestScore : Math.min(100, Math.round(answered / lesson.exercises.length * 100));
  const status = progress.completedAt
    ? 'Terminé · ' + progress.bestScore + ' %'
    : (answered ? 'En cours · ' + answered + '/' + lesson.exercises.length : 'À découvrir');
  const reviewCount = typeof GRAMMAR.reviewQueueFor === 'function' ? GRAMMAR.reviewQueueFor(state, lesson.id).length : 0;
  const reviewLabel = reviewCount ? '<span class="grammar-lesson-review" data-testid="grammar-review-badge-' + attr(lesson.id) + '">' + reviewCount + ' exercice' + (reviewCount === 1 ? '' : 's') + ' à revoir</span>' : '';
  return '<button class="grammar-lesson-card' + (progress.completedAt ? ' is-done' : '') + '" data-action="grammar-open" data-id="' + attr(lesson.id) + '" data-testid="grammar-lesson-' + attr(lesson.id) + '">' +
    '<span class="grammar-lesson-top"><span class="grammar-lesson-emoji" aria-hidden="true">' + esc(lesson.emoji) + '</span><span class="grammar-lesson-index">' + (index + 1) + '</span><span class="grammar-lesson-status">' + esc(status) + '</span></span>' +
    '<strong>' + esc(lesson.title) + '</strong>' +
    '<span class="grammar-lesson-sub">' + esc(lesson.subtitle) + '</span>' +
    reviewLabel +
    '<span class="grammar-lesson-bar"><span style="width:' + percent + '%"></span></span>' +
    '<span class="grammar-lesson-open">Ouvrir la leçon <span aria-hidden="true">→</span></span>' +
  '</button>';
}
function grammarTrackHtml() {
  const level = grammarUi.level === 'B2' ? 'B2' : 'B1';
  const info = GRAMMAR.LEVELS.filter(function (item) { return item.id === level; })[0] || GRAMMAR.LEVELS[0];
  const lessons = GRAMMAR.lessonsByLevel(level);
  const stats = GRAMMAR.levelStats(state, level);
  const tabs = GRAMMAR.LEVELS.map(function (item) {
    const count = GRAMMAR.lessonsByLevel(item.id).length;
    return '<button class="grammar-level-tab' + (item.id === level ? ' active' : '') + '" data-action="grammar-level" data-level="' + attr(item.id) + '" data-testid="grammar-level-' + attr(item.id.toLowerCase()) + '" aria-pressed="' + (item.id === level ? 'true' : 'false') + '"><b>' + esc(item.id) + '</b><span>' + count + ' leçons</span></button>';
  }).join('');
  return '<section class="panel grammar-track-panel">' +
    '<div class="panel-head grammar-track-head"><div><p class="eyebrow">Parcours avancé</p><h2>Grammaire B1 · B2</h2><p class="lead">Douze leçons pour passer de la phrase correcte à la nuance juste. Chaque point est illustré, puis vérifié par des exercices corrigés.</p></div>' +
    '<div class="grammar-level-tabs" role="tablist" aria-label="Niveau de grammaire">' + tabs + '</div></div>' +
    '<div class="grammar-level-summary" data-testid="grammar-level-progress"><div class="grammar-summary-stat"><b>' + stats.completed + '/' + stats.total + '</b><span>leçons terminées</span></div><div class="grammar-summary-stat"><b>' + stats.average + ' %</b><span>score moyen</span></div><div class="grammar-summary-bar"><span style="width:' + stats.percent + '%"></span></div></div>' +
    '<div class="grammar-track-intro"><b>' + esc(info.title) + '</b><span>' + esc(info.description) + '</span></div>' +
    '<div class="grammar-track-grid">' + lessons.map(grammarLessonCardHtml).join('') + '</div>' +
    grammarHistoryHtml() +
  '</section>';
}
function grammarHistoryDate(ts) {
  const date = new Date(Number(ts) || 0);
  if (!Number(ts) || !isFinite(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' · ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
function grammarHistoryHtml() {
  if (!GRAMMAR || typeof GRAMMAR.recentHistory !== 'function') return '';
  const rows = GRAMMAR.recentHistory(state, 6);
  if (!rows.length) return '';
  return '<section class="grammar-history" data-testid="grammar-history">' +
    '<div class="grammar-history-head"><div><p class="eyebrow">Session du jour</p><h3>Derniers points revus</h3></div><span class="grammar-history-count">' + rows.length + ' dernier' + (rows.length === 1 ? '' : 's') + '</span></div>' +
    '<div class="grammar-history-list">' + rows.map(function (row) {
      const lesson = GRAMMAR.lessonById(row.lessonId) || {};
      const title = row.title || lesson.title || row.lessonId;
      const meta = [row.level || lesson.level || '', grammarTaskReason(row.reason)].filter(Boolean).join(' · ');
      return '<div class="grammar-history-row" data-testid="grammar-history-row">' +
        '<span class="grammar-history-date">' + esc(grammarHistoryDate(row.at)) + '</span>' +
        '<div class="grammar-history-copy"><b>' + esc(title) + '</b><small>' + esc(meta) + '</small></div>' +
        '<span class="grammar-history-score ' + (row.correct ? 'good' : 'bad') + '" data-testid="grammar-history-score">' + Math.round(row.score) + ' %</span>' +
      '</div>';
    }).join('') + '</div></section>';
}
function grammarLessonHtml(lesson) {
  const index = GRAMMAR.lessonsByLevel(lesson.level).findIndex(function (item) { return item.id === lesson.id; }) + 1;
  const patterns = lesson.patterns.map(grammarPatternHtml).join('');
  const points = lesson.points.map(function (point) {
    return '<section class="grammar-point grammar-track-point"><h3>' + esc(point.title) + '</h3><p>' + esc(point.text) + '</p>' + point.examples.map(grammarExampleHtml).join('') + '</section>';
  }).join('');
  return '<article class="panel grammar-lesson-panel" data-testid="grammar-lesson-detail">' +
    '<div class="grammar-detail-top"><button class="btn ghost small" data-action="grammar-back">← Parcours</button><span class="grammar-level-badge">' + esc(lesson.level) + ' · Leçon ' + index + '</span></div>' +
    '<div class="grammar-detail-head"><div class="grammar-detail-emoji" aria-hidden="true">' + esc(lesson.emoji) + '</div><div><p class="eyebrow">' + esc(lesson.level) + ' · Grammaire</p><h2>' + esc(lesson.title) + '</h2><p class="lead">' + esc(lesson.subtitle) + '</p></div></div>' +
    '<div class="grammar-goal"><b>Objectif</b><span>' + esc(lesson.goal) + '</span></div>' +
    '<div class="grammar-patterns">' + patterns + '</div>' +
    '<div class="grammar-track-points">' + points + '</div>' +
    '<p class="grammar-tip">' + esc(lesson.tip) + '</p>' +
    grammarExerciseSectionHtml(lesson) +
  '</article>';
}
function renderGrammar() {
  const mount = $('#grammar-track');
  if (!mount || !GRAMMAR) return;
  const lesson = grammarUi.openId ? GRAMMAR.lessonById(grammarUi.openId) : null;
  mount.innerHTML = lesson ? grammarLessonHtml(lesson) : grammarTrackHtml();
  if (window.Kotoba.GrammarReading) setTimeout(function () { window.Kotoba.GrammarReading.apply(); }, 0);
}
function grammarExerciseSectionHtml(lesson) {
  const progress = GRAMMAR.progressFor(state, lesson.id);
  const gs = grammarUi.session;
  if (!gs || gs.lessonId !== lesson.id) {
    const best = progress.completedAt ? 'Meilleur score : ' + progress.bestScore + ' %.' : lesson.exercises.length + ' questions corrigées, sans chrono.';
    const reviewCount = typeof GRAMMAR.reviewQueueFor === 'function' ? GRAMMAR.reviewQueueFor(state, lesson.id).length : 0;
    const review = reviewCount
      ? '<button class="btn ghost" data-action="grammar-review-mistakes" data-id="' + attr(lesson.id) + '" data-testid="grammar-review-mistakes">Réviser ' + (reviewCount === 1 ? 'l’exercice raté' : 'les ' + reviewCount + ' exercices ratés') + '</button>'
      : '';
    return '<div class="grammar-exercise-launch" data-testid="grammar-exercise-launch"><div><p class="eyebrow">Pratique</p><b>Vérifie que la nuance est passée</b><span>' + esc(best) + '</span></div><div class="grammar-launch-actions"><button class="btn primary" data-action="grammar-start-exercises" data-id="' + attr(lesson.id) + '" data-testid="grammar-start-exercises">Commencer les exercices · ' + lesson.exercises.length + ' questions</button>' + review + '</div></div>';
  }
  if (gs.finished) return grammarResultHtml(lesson, gs);
  return grammarQuestionHtml(lesson, gs);
}
function grammarQuestionHtml(lesson, gs) {
  const ex = lesson.exercises[gs.index];
  const reviewQueue = gs.review ? (gs.reviewQueue || []) : [];
  const total = gs.review ? Math.max(1, reviewQueue.length) : lesson.exercises.length;
  const reviewPos = gs.review ? Math.min((gs.reviewPos || 0) + 1, total) : 0;
  const answered = gs.review ? Math.min(total, (gs.reviewPos || 0) + (gs.checked ? 1 : 0)) : gs.index + (gs.checked ? 1 : 0);
  const stepLabel = gs.review ? 'Révision ciblée · ' + reviewPos + ' / ' + total : 'Exercice ' + (gs.index + 1) + ' / ' + total;
  const canCheck = ex.type === 'choice' ? gs.selected !== null : gs.picked.length === ex.tokens.length;
  const focus = ex.focus ? '<div class="grammar-focus">' + grammarPatternHtml(ex.focus) + '</div>' : '';
  const sentence = ex.sentence ? '<div class="grammar-exercise-sentence"><div class="grammar-track-jp" lang="ja">' + grammarTrackJp(ex.sentence.jp, ex.sentence.kana) + '</div><div class="grammar-track-reading">' + grammarReadingHtml(ex.sentence) + '</div><div class="grammar-fr">' + esc(ex.sentence.fr) + '</div></div>' : '';
  return '<div class="panel grammar-exercise" data-testid="grammar-exercise">' +
    '<div class="grammar-exercise-head"><span class="grammar-exercise-step">' + esc(stepLabel) + '</span><span class="grammar-exercise-score">' + gs.score + ' bonne' + (gs.score === 1 ? '' : 's') + '</span></div>' +
    '<div class="grammar-exercise-bar"><span style="width:' + Math.round(answered / total * 100) + '%"></span></div>' +
    '<h3>' + esc(ex.question) + '</h3>' + focus + sentence +
    (ex.type === 'choice' ? grammarChoiceHtml(ex, gs) : grammarOrderHtml(ex, gs)) +
    (!gs.checked ? '<div class="grammar-exercise-actions"><button class="btn primary" data-action="grammar-check" data-testid="grammar-check"' + (canCheck ? '' : ' disabled') + '>Vérifier</button></div>' : grammarFeedbackHtml(ex, gs, total)) +
  '</div>';
}
function grammarChoiceHtml(ex, gs) {
  return '<div class="grammar-options">' + ex.options.map(function (option, index) {
    const selected = gs.selected === index;
    let stateClass = '';
    if (gs.checked) {
      if (option.correct) stateClass = ' correct';
      else if (selected) stateClass = ' wrong';
    }
    return '<button class="grammar-option' + (selected ? ' selected' : '') + stateClass + '" data-action="grammar-answer" data-index="' + index + '" data-testid="grammar-option-' + index + '" aria-pressed="' + (selected ? 'true' : 'false') + '"' + (gs.checked ? ' disabled' : '') + '>' +
      '<span class="grammar-option-jp" lang="ja">' + grammarTrackJp(option.jp, option.kana) + '</span>' +
      '<span class="grammar-option-reading">' + grammarReadingHtml(option) + '</span>' +
      '<span class="grammar-option-fr">' + esc(option.fr) + '</span>' +
    '</button>';
  }).join('') + '</div>';
}
function grammarOrderHtml(ex, gs) {
  const line = gs.picked.length ? gs.picked.map(function (tokenIndex) {
    const token = ex.tokens[tokenIndex];
    return '<button class="grammar-token in-line" data-action="grammar-token" data-index="' + tokenIndex + '"' + (gs.checked ? ' disabled' : '') + '>' +
      '<span class="grammar-token-jp" lang="ja">' + grammarTrackJp(token.jp, token.kana) + '</span>' +
      '<span class="grammar-token-reading">' + grammarReadingHtml(token) + '</span>' +
      '<span class="grammar-token-fr">' + esc(token.fr) + '</span>' +
    '</button>';
  }).join('') : '<span class="grammar-order-empty">Clique sur les morceaux pour construire la phrase.</span>';
  const pool = ex.tokens.map(function (token, index) {
    const used = gs.picked.indexOf(index) >= 0;
    return '<button class="grammar-token' + (used ? ' used' : '') + '" data-action="grammar-token" data-index="' + index + '" data-testid="grammar-token-' + index + '" aria-pressed="' + (used ? 'true' : 'false') + '"' + (used || gs.checked ? ' disabled' : '') + '>' +
      '<span class="grammar-token-jp" lang="ja">' + grammarTrackJp(token.jp, token.kana) + '</span>' +
      '<span class="grammar-token-reading">' + grammarReadingHtml(token) + '</span>' +
      '<span class="grammar-token-fr">' + esc(token.fr) + '</span>' +
    '</button>';
  }).join('');
  return '<div class="grammar-order"><div class="grammar-order-line">' + line + '</div><div class="grammar-token-pool">' + pool + '</div><p class="hint">Clique sur un morceau pour l’ajouter ; reclique sur un morceau de la ligne pour le retirer.</p></div>';
}
function grammarFeedbackHtml(ex, gs, total) {
  const answer = ex.type === 'choice' ? ex.options.filter(function (option) { return option.correct; })[0] : ex.answer;
  const hasNextReview = !!gs.review && (gs.reviewPos || 0) + 1 < (gs.reviewQueue || []).length;
  const action = gs.review ? (hasNextReview ? 'grammar-review-next' : 'grammar-review-back') : 'grammar-next';
  const testId = gs.review ? (hasNextReview ? 'grammar-review-next' : 'grammar-review-back') : 'grammar-next';
  const label = gs.review ? (hasNextReview ? 'Exercice suivant' : 'Retour à la leçon') : (gs.index + 1 >= total ? 'Voir le résultat' : 'Question suivante');
  const back = hasNextReview ? '<button class="btn ghost" data-action="grammar-review-back" data-testid="grammar-review-back">Retour à la leçon</button>' : '';
  return '<div class="grammar-feedback ' + (gs.correct ? 'good' : 'bad') + '" data-testid="grammar-feedback" role="status" aria-live="polite">' +
    '<b>' + (gs.correct ? '✅ Bonne réponse' : '❌ Pas tout à fait') + '</b>' +
    '<p>' + esc(ex.explanation) + '</p>' +
    '<div class="grammar-answer"><span class="grammar-answer-label">Réponse</span><div class="grammar-answer-jp" lang="ja">' + grammarTrackJp(answer.jp, answer.kana) + '</div><div class="grammar-answer-reading">' + grammarReadingHtml(answer) + '</div><div class="grammar-answer-fr">' + esc(answer.fr) + '</div></div>' +
    '<div class="grammar-feedback-actions"><button class="btn primary" data-action="' + action + '" data-testid="' + testId + '">' + label + '</button>' + back + '</div>' +
  '</div>';
}
function grammarResultHtml(lesson, gs) {
  const total = lesson.exercises.length;
  const percent = Math.round(gs.score / total * 100);
  const nextId = GRAMMAR.nextLessonId(lesson.level, lesson.id);
  const best = GRAMMAR.progressFor(state, lesson.id).bestScore;
  return '<div class="grammar-result" data-testid="grammar-result">' +
    '<div class="grammar-result-score">' + gs.score + '<span>/' + total + '</span></div>' +
    '<h3>' + (percent === 100 ? 'Sans faute !' : (percent >= 50 ? 'Bonne base' : 'À retravailler')) + '</h3>' +
    '<p>' + percent + ' % de réussite · meilleur score : ' + best + ' %.' + (gs.xp ? ' +' + gs.xp + ' XP.' : '') + '</p>' +
    '<div class="grammar-result-actions"><button class="btn primary" data-action="grammar-retry" data-id="' + attr(lesson.id) + '">Refaire</button><button class="btn ghost" data-action="grammar-back">Retour au parcours</button>' + (nextId ? '<button class="btn ghost" data-action="grammar-next-lesson" data-id="' + attr(nextId) + '">Leçon suivante →</button>' : '') + '</div>' +
  '</div>';
}
function scrollToGrammarExercise() {
  setTimeout(function () {
    const target = $('[data-testid="grammar-exercise"]');
    if (target && target.scrollIntoView) target.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, 40);
}
function openGrammarLesson(id) {
  if (!GRAMMAR || !GRAMMAR.lessonById(id)) return;
  grammarUi.openId = id;
  grammarUi.session = null;
  renderGrammar();
  window.scrollTo(0, 0);
}
function startGrammarExercises(id) {
  if (!GRAMMAR) return;
  const lesson = GRAMMAR.lessonById(id);
  if (!lesson) return;
  const progress = GRAMMAR.ensureProgress(state, id);
  progress.attempts += 1;
  progress.lastAt = Date.now();
  grammarUi.openId = id;
  grammarUi.session = { lessonId: id, index: 0, selected: null, picked: [], checked: false, correct: false, score: 0, finished: false, xp: 0 };
  persist();
  renderGrammar();
  scrollToGrammarExercise();
}
function selectGrammarAnswer(index) {
  const gs = grammarUi.session;
  if (!gs || gs.checked) return;
  gs.selected = index;
  renderGrammar();
}
function toggleGrammarToken(index) {
  const gs = grammarUi.session;
  if (!gs || gs.checked) return;
  const at = gs.picked.indexOf(index);
  if (at >= 0) gs.picked.splice(at, 1);
  else gs.picked.push(index);
  renderGrammar();
}
function checkGrammarAnswer() {
  const gs = grammarUi.session;
  if (!gs || gs.checked) return;
  const lesson = GRAMMAR.lessonById(gs.lessonId);
  if (!lesson) return;
  const ex = lesson.exercises[gs.index];
  if (!ex) return;
  let correct = false;
  if (ex.type === 'choice') {
    const option = ex.options[gs.selected];
    correct = !!option && option.correct === true;
  } else {
    correct = gs.picked.length === ex.tokens.length && ex.solution.every(function (value, i) { return gs.picked[i] === value; });
  }
  gs.checked = true;
  gs.correct = correct;
  if (correct) gs.score += 1;
  const progress = GRAMMAR.ensureProgress(state, lesson.id);
  progress.answers[ex.id] = correct;
  progress.lastAt = Date.now();
  persist();
  renderGrammar();
}
function nextGrammarQuestion() {
  const gs = grammarUi.session;
  if (!gs || !gs.checked) return;
  const lesson = GRAMMAR.lessonById(gs.lessonId);
  if (!lesson) return;
  if (gs.index + 1 >= lesson.exercises.length) {
    finishGrammarSession();
    return;
  }
  gs.index += 1;
  gs.selected = null;
  gs.picked = [];
  gs.checked = false;
  gs.correct = false;
  renderGrammar();
  scrollToGrammarExercise();
}
function finishGrammarSession() {
  const gs = grammarUi.session;
  if (!gs || gs.finished) return;
  const lesson = GRAMMAR.lessonById(gs.lessonId);
  if (!lesson) return;
  const percent = Math.round(gs.score / lesson.exercises.length * 100);
  const progress = GRAMMAR.ensureProgress(state, lesson.id);
  const firstCompletion = !progress.completedAt;
  progress.bestScore = Math.max(progress.bestScore, percent);
  progress.completedAt = progress.completedAt || Date.now();
  progress.lastAt = Date.now();
  if (firstCompletion) gs.xp = S.addXp(state, 20, Date.now());
  gs.finished = true;
  persist();
  updateChrome();
  renderGrammar();
}
function closeGrammarReview() {
  if (!grammarUi.session || !grammarUi.session.review) return;
  grammarUi.session = null;
  renderGrammar();
  window.scrollTo(0, 0);
}
function nextGrammarReview() {
  const gs = grammarUi.session;
  if (!gs || !gs.review || !gs.checked) return;
  const queue = gs.reviewQueue || [];
  const nextPos = (gs.reviewPos || 0) + 1;
  const lesson = GRAMMAR.lessonById(gs.lessonId);
  if (!lesson || nextPos >= queue.length) { closeGrammarReview(); return; }
  const index = lesson.exercises.findIndex(function (ex) { return ex.id === queue[nextPos]; });
  if (index < 0) { closeGrammarReview(); return; }
  gs.reviewPos = nextPos;
  gs.index = index;
  gs.selected = null;
  gs.picked = [];
  gs.checked = false;
  gs.correct = false;
  renderGrammar();
  scrollToGrammarExercise();
}
function grammarTaskState() {
  if (!session || session.mode !== 'grammar') return null;
  if (!session.grammarState) session.grammarState = { selected: null, picked: [], checked: false, correct: false, xp: 0 };
  return session.grammarState;
}
function grammarTaskReason(reason) {
  if (reason === 'review') return 'Révision ciblée';
  if (reason === 'practice') return 'À consolider';
  return 'Découverte';
}
function grammarTaskChoiceHtml(ex, gs) {
  return '<div class="grammar-options">' + ex.options.map(function (option, index) {
    const selected = gs.selected === index;
    let stateClass = '';
    if (gs.checked) {
      if (option.correct) stateClass = ' correct';
      else if (selected) stateClass = ' wrong';
    }
    return '<button class="grammar-option' + (selected ? ' selected' : '') + stateClass + '" data-action="grammar-task-answer" data-index="' + index + '" data-testid="session-grammar-option-' + index + '" aria-pressed="' + (selected ? 'true' : 'false') + '"' + (gs.checked ? ' disabled' : '') + '>' +
      '<span class="grammar-option-jp" lang="ja">' + grammarTrackJp(option.jp, option.kana) + '</span>' +
      '<span class="grammar-option-reading">' + grammarReadingHtml(option) + '</span>' +
      '<span class="grammar-option-fr">' + esc(option.fr) + '</span>' +
    '</button>';
  }).join('') + '</div>';
}
function grammarTaskOrderHtml(ex, gs) {
  const line = gs.picked.length ? gs.picked.map(function (tokenIndex) {
    const token = ex.tokens[tokenIndex];
    return '<button class="grammar-token in-line" data-action="grammar-task-token" data-index="' + tokenIndex + '" data-testid="session-grammar-line-' + tokenIndex + '"' + (gs.checked ? ' disabled' : '') + '>' +
      '<span class="grammar-token-jp" lang="ja">' + grammarTrackJp(token.jp, token.kana) + '</span>' +
      '<span class="grammar-token-reading">' + grammarReadingHtml(token) + '</span>' +
      '<span class="grammar-token-fr">' + esc(token.fr) + '</span>' +
    '</button>';
  }).join('') : '<span class="grammar-order-empty">Clique sur les morceaux pour construire la phrase.</span>';
  const pool = ex.tokens.map(function (token, index) {
    const used = gs.picked.indexOf(index) >= 0;
    return '<button class="grammar-token' + (used ? ' used' : '') + '" data-action="grammar-task-token" data-index="' + index + '" data-testid="session-grammar-token-' + index + '" aria-pressed="' + (used ? 'true' : 'false') + '"' + (used || gs.checked ? ' disabled' : '') + '>' +
      '<span class="grammar-token-jp" lang="ja">' + grammarTrackJp(token.jp, token.kana) + '</span>' +
      '<span class="grammar-token-reading">' + grammarReadingHtml(token) + '</span>' +
      '<span class="grammar-token-fr">' + esc(token.fr) + '</span>' +
    '</button>';
  }).join('');
  return '<div class="grammar-order"><div class="grammar-order-line">' + line + '</div><div class="grammar-token-pool">' + pool + '</div><p class="hint">Clique sur un morceau pour l’ajouter ; reclique sur un morceau de la ligne pour le retirer.</p></div>';
}
function grammarTaskFeedbackHtml(ex, gs) {
  const answer = ex.type === 'choice' ? ex.options.filter(function (option) { return option.correct; })[0] : ex.answer;
  if (!answer) return '';
  return '<div class="grammar-feedback ' + (gs.correct ? 'good' : 'bad') + '" data-testid="session-grammar-feedback" role="status" aria-live="polite">' +
    '<b>' + (gs.correct ? '✅ Bonne réponse' : '❌ Pas tout à fait') + (gs.xp ? ' · +' + gs.xp + ' XP' : '') + '</b>' +
    '<p>' + esc(ex.explanation) + '</p>' +
    '<div class="grammar-answer"><span class="grammar-answer-label">Réponse</span><div class="grammar-answer-jp" lang="ja">' + grammarTrackJp(answer.jp, answer.kana) + '</div><div class="grammar-answer-reading">' + grammarReadingHtml(answer) + '</div><div class="grammar-answer-fr">' + esc(answer.fr) + '</div><button class="btn ghost small" data-action="speak-text" data-text="' + attr(answer.jp) + '">🔊 Écouter</button></div>' +
    '<button class="btn primary" data-action="grammar-task-next" data-testid="session-grammar-next">Continuer</button></div>';
}
function grammarTaskView() {
  const task = session && session.task;
  const lesson = task && task.grammarLesson;
  const ex = task && task.grammarExercise;
  const gs = grammarTaskState();
  if (!lesson || !ex || !gs) return '<div class="session-card" data-testid="grammar-task"><p>Exercice de grammaire indisponible.</p></div>';
  const focus = ex.focus ? '<div class="grammar-focus">' + grammarPatternHtml(ex.focus) + '</div>' : '';
  const sentence = ex.sentence ? '<div class="grammar-exercise-sentence"><div class="grammar-track-jp" lang="ja">' + grammarTrackJp(ex.sentence.jp, ex.sentence.kana) + '</div><div class="grammar-track-reading">' + grammarReadingHtml(ex.sentence) + '</div><div class="grammar-fr">' + esc(ex.sentence.fr) + '</div></div>' : '';
  const canCheck = ex.type === 'choice' ? gs.selected !== null : gs.picked.length === ex.tokens.length;
  return '<div class="session-card grammar-task-card" data-testid="grammar-task" data-grammar-reason="' + attr(task.grammarReason || '') + '" data-grammar-exercise="' + attr(ex.id) + '">' +
    '<div class="grammar-task-top"><p class="eyebrow">Grammaire · ' + esc(lesson.level) + '</p><span class="grammar-task-badge">' + esc(grammarTaskReason(task.grammarReason)) + '</span></div>' +
    '<h2 class="grammar-task-title">' + esc(lesson.title) + '</h2>' +
    '<p class="hint">' + esc(lesson.goal) + '</p>' +
    '<h3>' + esc(ex.question) + '</h3>' + focus + sentence +
    (ex.type === 'choice' ? grammarTaskChoiceHtml(ex, gs) : grammarTaskOrderHtml(ex, gs)) +
    (!gs.checked ? '<div class="grammar-exercise-actions"><button class="btn primary" data-action="grammar-task-check" data-testid="session-grammar-check"' + (canCheck ? '' : ' disabled') + '>Vérifier</button></div>' : grammarTaskFeedbackHtml(ex, gs)) +
  '</div>';
}
function selectGrammarTaskAnswer(index) {
  const gs = grammarTaskState();
  if (!gs || gs.checked) return;
  gs.selected = index;
  renderSession();
}
function toggleGrammarTaskToken(index) {
  const gs = grammarTaskState();
  const task = session && session.task;
  const ex = task && task.grammarExercise;
  if (!gs || !ex || gs.checked) return;
  const at = gs.picked.indexOf(index);
  if (at >= 0) gs.picked.splice(at, 1);
  else if (gs.picked.length < ex.tokens.length) gs.picked.push(index);
  renderSession();
}
function checkGrammarTaskAnswer() {
  const gs = grammarTaskState();
  const task = session && session.task;
  const lesson = task && task.grammarLesson;
  const ex = task && task.grammarExercise;
  if (!gs || !lesson || !ex || gs.checked) return;
  if (ex.type === 'choice' && gs.selected === null) return;
  if (ex.type === 'order' && gs.picked.length !== ex.tokens.length) return;
  let correct = false;
  if (ex.type === 'choice') {
    const option = ex.options[gs.selected];
    correct = !!option && option.correct === true;
  } else {
    correct = ex.solution.every(function (value, i) { return gs.picked[i] === value; });
  }
  const now = Date.now();
  gs.checked = true;
  gs.correct = correct;
  const progress = GRAMMAR.ensureProgress(state, lesson.id);
  progress.answers[ex.id] = correct;
  progress.lastAt = now;
  const grammarSummary = {
    lessonId: lesson.id,
    exerciseId: ex.id,
    title: lesson.title,
    level: lesson.level,
    score: correct ? 100 : 0,
    correct: correct,
    reason: task.grammarReason
  };
  session.grammarSummary = grammarSummary;
  if (typeof GRAMMAR.recordDailyReview === 'function') GRAMMAR.recordDailyReview(state, grammarSummary, now);
  const xp = S.addXp(state, correct ? 10 : 3, now);
  gs.xp = xp;
  session.done += 1;
  if (correct) session.correct += 1;
  session.xp += xp;
  session.lastGrade = correct ? 'good' : 'again';
  session.lastXp = xp;
  session.lastDue = 0;
  session.total = Math.max(session.total, session.done + session.tasks.length);
  persist();
  flashValidation(correct ? 'good' : 'again');
  toast(correct ? '✅ Bonne réponse' : '❌ À retravailler');
  renderSession();
  updateChrome();
  const next = $('[data-testid="session-grammar-next"]');
  if (next) next.focus();
}
function nextGrammarTask() {
  const gs = grammarTaskState();
  if (!gs || !gs.checked) return;
  nextCard();
}
function openGrammarSummaryTarget(id, exerciseId) {
  if (!GRAMMAR) return;
  const lesson = GRAMMAR.lessonById(id);
  if (!lesson) { toast('Leçon introuvable.'); return; }
  if (session) closeSession();
  const reviewQueue = typeof GRAMMAR.reviewQueueFor === 'function' ? GRAMMAR.reviewQueueFor(state, lesson.id, exerciseId) : (exerciseId ? [exerciseId] : []);
  const reviewIndex = reviewQueue.length ? lesson.exercises.findIndex(function (ex) { return ex.id === reviewQueue[0]; }) : -1;
  grammarUi.level = lesson.level;
  grammarUi.openId = lesson.id;
  grammarUi.session = reviewIndex >= 0 ? {
    lessonId: lesson.id,
    index: reviewIndex,
    review: true,
    reviewQueue: reviewQueue,
    reviewPos: 0,
    selected: null,
    picked: [],
    checked: false,
    correct: false,
    score: 0,
    finished: false,
    xp: 0
  } : null;
  try { history.replaceState(null, '', '#grammaire'); } catch (e) { location.hash = 'grammaire'; }
  showView('grammar');
  if (reviewIndex >= 0) scrollToGrammarExercise();
  else window.scrollTo(0, 0);
}
/* ---------- Événements ---------- */
/* ---------- Événements ---------- */
function onClick(event) {
primeSpeech();
const nav = event.target.closest ? event.target.closest('[data-nav]') : null;
if (nav) {
event.preventDefault();
const name = nav.getAttribute('data-nav');
const hashes = { learn: '#apprendre', review: '#reviser', conversation: '#parler', reading: '#histoires', library: '#mots', import: '#importer', grammar: '#grammaire' };
const hash = hashes[name];
if (name === 'conversation') { stopConversationVoice(); conversationState = null; }
if (hash) { try { history.replaceState(null, '', hash); } catch (err) { location.hash = hash.slice(1); } }
if (session) closeSession();
showView(name);
return;
}
  const el = event.target.closest ? event.target.closest('[data-action]') : null;
  if (!el) return;
  const action = el.getAttribute('data-action');
  const id = el.getAttribute('data-id');
  switch (action) {
    case 'start': startSession(el.getAttribute('data-kind'), el.getAttribute('data-mode') || 'recall', el.getAttribute('data-unit')); break;
    case 'start-conversation': startConversation(id); break;
    case 'go-conversation': goConversation(); break;
    case 'next-conversation': nextConversation(); break;
    case 'retry-conversation': retryConversation(); break;
    case 'retry-missed-conversation': retryMissedConversation(); break;
    case 'review-conversation-misses': reviewConversationMisses(id); break;
    case 'conversation-hint': toggleConversationHint(); break;
    case 'conversation-task-retry': retryConversationTask(); break;
    case 'conversation-task-voice': startConversationTaskVoice(); break;
    case 'toggle-conversation-listen': toggleConversationListen(); break;
    case 'reveal-conversation': revealConversation(); break;
    case 'conversation-voice': startConversationVoice(); break;
    case 'random-conversation': randomConversation(); break;
    case 'close-conversation': closeConversation(); break;
    case 'go-reading': goReading(); break;
    case 'open-story': openStory(id); break;
    case 'close-story': closeStory(); break;
    case 'story-filter': ui.storyLevel = el.getAttribute('data-level') || 'all'; renderReading(); break;
    case 'story-translation': toggleStoryTranslation(el.getAttribute('data-index')); break;
    case 'story-translations-all': toggleAllStoryTranslations(); break;
    case 'story-audio-all': speakStory(); break;
    case 'story-quiz-open': openStoryQuiz(); break;
    case 'story-option': chooseStoryOption(el.getAttribute('data-question'), el.getAttribute('data-option')); break;
    case 'story-quiz-submit': submitStoryQuiz(); break;
    case 'story-quiz-retry': retryStoryQuiz(); break;
    case 'story-review-words': startStoryReview(id); break;
    case 'start-today': startDailyPlan(); break;
    case 'grammar-task-answer': selectGrammarTaskAnswer(Number(el.getAttribute('data-index'))); break;
    case 'grammar-task-token': toggleGrammarTaskToken(Number(el.getAttribute('data-index'))); break;
    case 'grammar-task-check': checkGrammarTaskAnswer(); break;
    case 'grammar-task-next': nextGrammarTask(); break;
    case 'grammar-summary-open': openGrammarSummaryTarget(id, el.getAttribute('data-exercise')); break;
    case 'start-mistakes': startMistakes(); break;
    case 'grammar-level': grammarUi.level = el.getAttribute('data-level') === 'B2' ? 'B2' : 'B1'; grammarUi.openId = null; grammarUi.session = null; renderGrammar(); break;
    case 'grammar-open': openGrammarLesson(id); break;
    case 'grammar-back': grammarUi.openId = null; grammarUi.session = null; renderGrammar(); window.scrollTo(0, 0); break;
    case 'grammar-start-exercises': startGrammarExercises(id); break;
    case 'grammar-review-mistakes': openGrammarSummaryTarget(id, ''); break;
    case 'grammar-answer': selectGrammarAnswer(Number(el.getAttribute('data-index'))); break;
    case 'grammar-token': toggleGrammarToken(Number(el.getAttribute('data-index'))); break;
    case 'grammar-check': checkGrammarAnswer(); break;
    case 'grammar-next': nextGrammarQuestion(); break;
    case 'grammar-review-next': nextGrammarReview(); break;
    case 'grammar-review-back': closeGrammarReview(); break;
    case 'grammar-retry': startGrammarExercises(id); break;
    case 'grammar-next-lesson': openGrammarLesson(id); break;
    case 'start-phrase': startPhraseSession(el.getAttribute('data-type')); break;
    case 'phrase-token': choosePhraseToken(el.getAttribute('data-token')); break;
    case 'phrase-check': checkPhraseOrder(); break;
    case 'phrase-reset': if (session) { session.phraseSelection = []; renderSession(); } break;
    case 'phrase-reveal': finishPhrase(false, '', true); break;
    case 'phrase-next': nextCard(); break;
    case 'restore-backup': restoreBackup(); break;
    case 'reveal': reveal(); break;
    case 'grade': grade(el.getAttribute('data-grade')); break;
    case 'choose': choose(id); break;
    case 'production-reveal': revealProduction(); break;
    case 'continue-session': nextCard(); break;
    case 'quit-session': quitSession(); break;
    case 'finish-session': finishSession(); break;
    case 'start-again': startAgain(); break;
    case 'open-settings': openSettings(); break;
    case 'weekly-report': openWeeklyReport(); break;
    case 'open-account': openAccount(); break;
    case 'sync-mode': setSyncMode(el.getAttribute('data-mode')); break;
    case 'sync-now': syncCloud(true); break;
    case 'sync-logout': syncLogout(); break;
    case 'sync-delete-account': syncDeleteAccount(); break;
    case 'close-modal': closeModal(); break;
    case 'set-goal': state.settings.goal = Number(el.getAttribute('data-goal')) || 50; persist(); render(); openSettings(); break;
    case 'test-voice': speak('こんにちは、花さん！'); break;
    case 'export-data': exportData(); break;
    case 'import-data': { const f = $('#dataFile'); if (f) f.click(); break; }
    case 'reset-data': resetAll(); break;
    case 'speak-text': speak(el.getAttribute('data-text'), el.getAttribute('data-slow') ? Math.max(0.5, (state.settings.rate || 0.9) * 0.72) : (state.settings.rate || 0.9)); break;
    case 'detail': openDetail(id); break;
case "review-one": startOne(id); break;
case 'pronounce-one': startOne(ui.detailId, 'pronounce'); break;
case 'pronounce-start': startPronunciation(); break;
case 'pronounce-retry': startPronunciation(); break;
case 'pronounce-front-start': startPronunciation(); break;
case 'pronounce-stop': stopPronunciation(); break;
    case 'pronounce-cancel': {
      abortPronunciation();
      if (session) { session.pronunciation = null; renderSession(); }
      break;
    }
case 'pronounce-target': setPronunciationTarget(el.getAttribute('data-target')); break;
case 'pronounce-sentence': continueToPronunciationPhrase(); break;
case 'pronounce-engine': setPronunciationEngine(el.getAttribute('data-engine')); break;
case 'pronounce-play': {
  try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  if (window.Kotoba.Whisper && window.Kotoba.Whisper.play) {
    window.Kotoba.Whisper.play().catch(function () { toast('Impossible de relire l’enregistrement.'); });
  }
  break;
}
case 'practice-pronunciation': startPronunciationPractice(); break;
case 'pronounce-finish': grade(el.getAttribute('data-good') === '1' ? 'good' : 'again'); break;
    case 'edit-entry': openEdit(id); break;
    case 'delete-entry': deleteEntry(id); break;
    case 'reset-progress': resetProgress(id); break;
    case 'open-stage': openStage(el.getAttribute('data-stage')); break;
    case 'filter': ui.filter = el.getAttribute('data-filter') || 'all'; $$('.chip[data-filter]').forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-filter') === ui.filter); }); renderLibraryList(); break;
    case 'preview-import': previewImport(); break;
    case 'do-import': doImport(); break;
    case 'clear-import': ui.importText = ''; ui.preview = null; renderImport(); break;
    case 'pick-image': { const f = $('#ocrFile'); if (f) f.click(); break; }
    case 'go-import': if (location.hash !== '#importer') { try { history.replaceState(null, '', '#importer'); } catch (e) { /* ignore */ } } showView('import'); break;
    default: break;
  }
}
function onSubmit(event) {
  const conversationForm = event.target.closest ? event.target.closest('[data-form="conversation"]') : null;
  if (conversationForm) {
    event.preventDefault();
    submitConversation(conversationForm);
    return;
  }
  const conversationTaskForm = event.target.closest ? event.target.closest('[data-form="conversation-task"]') : null;
  if (conversationTaskForm) {
    event.preventDefault();
    submitConversationTask(conversationTaskForm);
    return;
  }
  const productionForm = event.target.closest ? event.target.closest('[data-form="production"]') : null;
  if (productionForm) {
    event.preventDefault();
    submitProduction(productionForm);
    return;
  }
  const syncForm = event.target.closest ? event.target.closest('[data-form="sync-auth"]') : null;
  if (syncForm) {
    event.preventDefault();
    handleSyncAuth(syncForm);
    return;
  }
  const phraseForm = event.target.closest ? event.target.closest('[data-form="phrase-cloze"]') : null;
  if (phraseForm) {
    event.preventDefault();
    if (!session || !session.exercise) return;
    const answer = String(new FormData(phraseForm).get('answer') || '').trim();
    if (!answer) { toast('Écris le mot manquant.'); return; }
    const result = PH.checkCloze(session.exercise, answer);
    finishPhrase(result.good, answer, false);
    return;
  }
  const form = event.target.closest ? event.target.closest('[data-form="edit"]') : null;
  if (!form) return;
  event.preventDefault();
  const id = form.getAttribute('data-id');
  const old = state.entries[id];
  if (!old) return;
  const fd = new FormData(form);
  const fr = String(fd.get('fr') || '').trim();
  const jp = String(fd.get('jp') || '').trim();
  const romaji = String(fd.get('romaji') || '').trim();
  const context = String(fd.get('context') || '').trim();
  const contextFr = String(fd.get('contextFr') || '').trim();
  if (!fr || !jp) { toast('Le français et le japonais sont obligatoires.'); return; }
  const built = P.buildEntry([fr, jp, romaji, context, contextFr]);
  if (!built.entry) { toast(built.reason || 'Impossible de lire ce mot.'); return; }
  state.entries[id] = Object.assign({}, built.entry, { id: id, context: context, contextFr: contextFr, source: 'import', createdAt: old.createdAt || Date.now() });
  entries = buildEntries(); persist(); closeModal(); render(); toast('Mot modifié.');
}
function onChange(event) {
  const t = event.target;
  if (t.id === 'importFile') { const f = t.files && t.files[0]; t.value = ''; if (f) readImportFile(f); return; }
  if (t.id === 'ocrFile') { const f = t.files && t.files[0]; t.value = ''; if (f) handleImage(f); return; }
  if (t.id === 'dataFile') { const f = t.files && t.files[0]; t.value = ''; if (f) importData(f); return; }
  const key = t.getAttribute ? t.getAttribute('data-setting') : null;
  if (!key) return;
  let value;
  if (t.type === 'checkbox') value = t.checked;
  else if (key === 'rate') value = Number(t.value);
  else value = t.value;
  state.settings[key] = value;
  persist(); applyTheme(); render();
  if (window.Kotoba.GrammarReading) window.Kotoba.GrammarReading.apply();
}
function onInput(event) {
  const t = event.target;
  if (t.id === 'searchInput') { ui.search = t.value; renderLibraryList(); }
  else if (t.id === 'importText') ui.importText = t.value;
  else if (t.getAttribute && t.getAttribute('data-setting') === 'rate') state.settings.rate = Number(t.value) || 0.9;
}
function onKeydown(event) {
  primeSpeech();
  if (!session && view === 'conversation' && conversationState && event.key === 'Escape') { closeConversation(); return; }
  if (!session && view === 'reading' && immersionState && event.key === 'Escape') { closeStory(); return; }
  if (!session && view === 'grammar' && grammarUi.session && event.key === 'Escape') { grammarUi.session = null; renderGrammar(); return; }
  const modal = $('#modal');
  if (modal && !modal.hidden && event.key === 'Escape') { closeModal(); return; }
  if (session) {
    if (event.key === 'Escape') { quitSession(); return; }
    const tag = (event.target && event.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    const onButton = event.target && event.target.closest && event.target.closest('button');
    if (onButton && (event.key === 'Enter' || event.key === ' ')) return;
    if (session.mode === 'conversation') {
      if (session.phase === 'feedback' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); nextCard(); }
      return;
    }
    if (session.mode === 'phrase') {
      if (session.phase === 'feedback' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); nextCard(); }
      return;
    }
    if (session.mode === 'grammar') {
      const gs = grammarTaskState();
      if (gs && gs.checked && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); nextGrammarTask(); }
      else if (gs && !gs.checked && event.key === 'Enter') { event.preventDefault(); checkGrammarTaskAnswer(); }
      return;
    }
    if (session.phase === 'front' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); reveal(); return; }
    if (session.phase === 'revealed') {
      if (event.key === '1') { event.preventDefault(); grade('again'); return; }
      if (event.key === '2' || event.key === 'Enter') { event.preventDefault(); grade('good'); return; }
      if (event.key.toLowerCase() === 'a') { speak(session.current.jp); return; }
    }
    if (session.phase === 'feedback' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); nextCard(); return; }
    if (session.phase === 'question') {
      if (event.key.toLowerCase() === 'a') { speak(session.current.jp); return; }
      const n = parseInt(event.key, 10);
      if (n >= 1 && n <= session.options.length) { event.preventDefault(); choose(session.options[n - 1].id); }
    }
    return;
  }
  if ((event.key === 'Enter' || event.key === ' ') && event.target && event.target.getAttribute && event.target.getAttribute('role') === 'button') {
    event.preventDefault(); event.target.click();
  }
}

function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  if (!/^https?:$/.test(location.protocol)) return;
  const hadController = !!navigator.serviceWorker.controller;
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController || refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  const run = function () {
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then(function (reg) {
      if (reg && reg.update) reg.update().catch(function () { /* hors ligne */ });
    }).catch(function () { /* offline bonus */ });
  };
  if (document.readyState === 'complete') run(); else window.addEventListener('load', run);
}

/* ---------- Démarrage ---------- */
function init() {
  entries = buildEntries();
  applyTheme();
  updateChrome();
  loadVoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = function () { if (state.settings.theme === 'system') applyTheme(); };
    if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn);
  }
  document.addEventListener('click', onClick);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('change', onChange);
  document.addEventListener('input', onInput);
  document.addEventListener('keydown', onKeydown);
  initSentenceTooltip();
  window.addEventListener('hashchange', function () { if (session) closeSession(); route(); });
  document.addEventListener('dragover', function (e) {
    const z = e.target.closest && e.target.closest('#dropZone');
    if (z) { e.preventDefault(); z.classList.add('drag'); }
  });
  document.addEventListener('dragleave', function (e) {
    const z = e.target.closest && e.target.closest('#dropZone');
    if (z) z.classList.remove('drag');
  });
  document.addEventListener('drop', function (e) {
    const z = e.target.closest && e.target.closest('#dropZone');
    if (!z) return;
    e.preventDefault(); z.classList.remove('drag');
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleImage(f);
  });
  document.addEventListener('paste', function (e) {
    if (view !== 'import') return;
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf('image/') === 0) {
        const f = items[i].getAsFile();
        if (f) { e.preventDefault(); handleImage(f); }
        break;
      }
    }
  });
  registerSW();
  route();
  if (SY) {
    SY.init().then(function (account) {
      if (account) syncCloud(false);
    }).catch(function () { /* le mode local reste disponible */ });
  }
  window.addEventListener('online', function () { if (SY) syncCloud(false); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && !session && SY && SY.session().loggedIn) syncCloud(false);
  });
}

init();
})();
