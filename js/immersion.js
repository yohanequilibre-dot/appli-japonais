/* Kotoba — histoires immersives graduées.
   Contenu original, sans dépendance réseau : lecture, audio et quiz.
   Le module reste utilisable avec Node pour tester les données et la correction. */
(function (root, factory) {
  var P = (root && root.Kotoba && root.Kotoba.Parser) ||
    (typeof require === 'function' ? require('./parser.js') : null);
  var api = factory(P);
  if (root && root.Kotoba) root.Kotoba.Immersion = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (P) {
  'use strict';

  var STORIES = [
    {
      id: 'asa',
      emoji: '🌅',
      tone: 'sun',
      level: 'N5',
      minutes: 3,
      title: 'Le matin de Yui',
      titleJp: 'ゆいの朝[あさ]',
      titleRomaji: 'Yui no asa',
      description: 'Une routine simple pour commencer la journée en japonais.',
      scene: 'Yui se prépare pour aller à l’école. Les phrases sont courtes et toutes au présent poli.',
      lines: [
        { ruby: 'おはよう。今朝[けさ]は七時[しちじ]に起[お]きました。', fr: 'Bonjour. Ce matin, je me suis levée à sept heures.' },
        { ruby: '顔[かお]を洗[あら]って、朝ご飯[あさごはん]を食[た]べます。', fr: 'Je me lave le visage et je prends le petit-déjeuner.' },
        { ruby: '今日[きょう]はパンと卵[たまご]を食[た]べました。', fr: 'Aujourd’hui, j’ai mangé du pain et des œufs.' },
        { ruby: 'それから、電車[でんしゃ]で学校[がっこう]へ行[い]きます。', fr: 'Ensuite, je vais à l’école en train.' },
        { ruby: '駅[えき]で友達[ともだち]の花[はな]さんに会[あ]いました。', fr: 'À la gare, j’ai retrouvé mon amie Hana.' },
        { ruby: '今日[きょう]も日本語[にほんご]を勉強[べんきょう]します。', fr: 'Aujourd’hui aussi, j’étudie le japonais.' }
      ],
      questions: [
        { q: 'À quelle heure Yui se lève-t-elle ?', options: ['À six heures', 'À sept heures', 'À huit heures'], answer: 1, explain: '今朝は七時に起きました signifie « ce matin, je me suis levée à sept heures ».' },
        { q: 'Comment va-t-elle à l’école ?', options: ['En bus', 'À vélo', 'En train'], answer: 2, explain: '電車で学校へ行きます signifie « je vais à l’école en train ».' }
      ],
      focus: [
        { jp: '今朝', fr: 'ce matin' }, { jp: '七時', fr: 'sept heures' },
        { jp: '起きる', fr: 'se lever' }, { jp: '朝ご飯', fr: 'petit-déjeuner' },
        { jp: '食べる', fr: 'manger' }, { jp: '電車', fr: 'train' },
        { jp: '学校', fr: 'école' }, { jp: '駅', fr: 'gare' },
        { jp: '友達', fr: 'ami' }, { jp: '会う', fr: 'rencontrer' },
        { jp: '日本語', fr: 'japonais' }, { jp: '勉強', fr: 'étude' }
      ]
    },
    {
      id: 'konbini',
      emoji: '🏪',
      tone: 'mint',
      level: 'N5',
      minutes: 3,
      title: 'Au konbini',
      titleJp: 'コンビニの夜[よる]',
      titleRomaji: 'Konbini no yoru',
      description: 'Une petite course de soir, avec les formules de politesse essentielles.',
      scene: 'Il est huit heures du soir. Tu entres dans un konbini pour acheter quelque chose à manger.',
      lines: [
        { ruby: '夜[よる]八時[はちじ]、わたしはコンビニへ行[い]きました。', fr: 'À huit heures du soir, je suis allé au konbini.' },
        { ruby: '店員[てんいん]さんが「いらっしゃいませ」と言[い]いました。', fr: 'Le vendeur a dit « Bienvenue ».' },
        { ruby: 'わたしはおにぎりを二[ふた]つとお茶[ちゃ]を買[か]いました。', fr: 'J’ai acheté deux onigiris et du thé.' },
        { ruby: 'お会計[かいけい]は三百円[さんびゃくえん]でした。', fr: 'Le total était de trois cents yens.' },
        { ruby: '「袋[ふくろ]は要[い]りますか」と聞[き]かれました。', fr: 'On m’a demandé : « Voulez-vous un sac ? »' },
        { ruby: '「いいえ、大丈夫[だいじょうぶ]です」と答[こた]えました。', fr: 'J’ai répondu : « Non, ça va. »' }
      ],
      questions: [
        { q: 'Qu’a acheté la narratrice ?', options: ['Un onigiri et du café', 'Deux onigiris et du thé', 'Un bento et de l’eau'], answer: 1, explain: 'おにぎりを二つとお茶を買いました : deux onigiris et du thé.' },
        { q: 'Combien a-t-elle payé ?', options: ['Cent yens', 'Deux cents yens', 'Trois cents yens'], answer: 2, explain: '三百円 (さんびゃくえん) signifie trois cents yens.' }
      ],
      focus: [
        { jp: '夜', fr: 'soir / nuit' }, { jp: '八時', fr: 'huit heures' },
        { jp: 'コンビニ', fr: 'supérette' }, { jp: '店員', fr: 'vendeur' },
        { jp: 'おにぎり', fr: 'onigiri' }, { jp: 'お茶', fr: 'thé' },
        { jp: '買う', fr: 'acheter' }, { jp: 'お会計', fr: 'addition' },
        { jp: '三百円', fr: 'trois cents yens' }, { jp: '袋', fr: 'sac' },
        { jp: '大丈夫', fr: 'ça va' }, { jp: '答える', fr: 'répondre' }
      ]
    },
    {
      id: 'ame',
      emoji: '☔',
      tone: 'sky',
      level: 'N5+',
      minutes: 4,
      title: 'La pluie de l’après-midi',
      titleJp: '雨[あめ]の帰[かえ]り道[みち]',
      titleRomaji: 'Ame no kaerimichi',
      description: 'Un parapluie partagé, une conversation douce et un peu de pluie.',
      scene: 'La pluie surprend Yui à la gare. Heureusement, Hana est là.',
      lines: [
        { ruby: '午後[ごご]から雨[あめ]が降[ふ]りました。', fr: 'Il a plu à partir de l’après-midi.' },
        { ruby: 'わたしは傘[かさ]を持[も]っていませんでした。', fr: 'Je n’avais pas de parapluie.' },
        { ruby: '駅[えき]の前[まえ]で、花[はな]さんが待[ま]っていました。', fr: 'Devant la gare, Hana m’attendait.' },
        { ruby: '「一緒[いっしょ]に帰[かえ]りましょう」と花[はな]さんが言[い]いました。', fr: 'Hana a dit : « Rentrons ensemble. »' },
        { ruby: 'わたしたちは一[ひと]つの傘[かさ]で家[いえ]まで歩[ある]きました。', fr: 'Nous avons marché jusqu’à la maison sous un même parapluie.' },
        { ruby: '雨[あめ]の音[おと]がとてもきれいでした。', fr: 'Le bruit de la pluie était très beau.' }
      ],
      questions: [
        { q: 'Pourquoi la narratrice ne pouvait-elle pas rentrer facilement ?', options: ['Elle avait oublié son parapluie', 'Elle avait perdu son sac', 'Elle n’avait pas d’argent'], answer: 0, explain: '傘を持っていませんでした signifie « je n’avais pas de parapluie ».' },
        { q: 'Qui l’attendait devant la gare ?', options: ['Sa sœur', 'Hana', 'Un collègue'], answer: 1, explain: '花さんが待っていました : c’est Hana qui attendait.' }
      ],
      focus: [
        { jp: '午後', fr: 'après-midi' }, { jp: '雨', fr: 'pluie' },
        { jp: '降る', fr: 'tomber (pluie)' }, { jp: '傘', fr: 'parapluie' },
        { jp: '持つ', fr: 'porter / tenir' }, { jp: '駅', fr: 'gare' },
        { jp: '前', fr: 'devant' }, { jp: '待つ', fr: 'attendre' },
        { jp: '一緒', fr: 'ensemble' }, { jp: '帰る', fr: 'rentrer' },
        { jp: '家', fr: 'maison' }, { jp: '歩く', fr: 'marcher' },
        { jp: '音', fr: 'son / bruit' }
      ]
    },
    {
      id: 'matsuri',
      emoji: '🎆',
      tone: 'rose',
      level: 'N5+',
      minutes: 4,
      title: 'Le festival d’été',
      titleJp: '夏祭り[なつまつり]',
      titleRomaji: 'Natsumatsuri',
      description: 'Lanternes, yukatas et feux d’artifice : une soirée japonaise typique.',
      scene: 'C’est samedi soir. Hana et Yui vont au festival d’été de leur quartier.',
      lines: [
        { ruby: '土曜日[どようび]の夜[よる]、花[はな]さんと夏祭り[なつまつり]へ行[い]きました。', fr: 'Samedi soir, je suis allée au festival d’été avec Hana.' },
        { ruby: '道[みち]にたくさんの提灯[ちょうちん]がありました。', fr: 'Il y avait beaucoup de lanternes dans la rue.' },
        { ruby: '屋台[やたい]でたこ焼き[たこやき]を買[か]いました。', fr: 'J’ai acheté des takoyaki à un stand.' },
        { ruby: '花[はな]さんはりんご飴[あめ]が好[す]きです。', fr: 'Hana aime les pommes d’amour.' },
        { ruby: '太鼓[たいこ]の音[おと]が聞[き]こえました。', fr: 'On entendait le son des tambours.' },
        { ruby: 'わたしたちは浴衣[ゆかた]を着[き]ました。', fr: 'Nous avons mis des yukatas.' },
        { ruby: '最後[さいご]に花火[はなび]を見[み]ました。', fr: 'Enfin, nous avons regardé les feux d’artifice.' }
      ],
      questions: [
        { q: 'Qu’est-ce que la narratrice a acheté au stand ?', options: ['Des takoyaki', 'Une pomme d’amour', 'Une glace'], answer: 0, explain: '屋台でたこ焼きを買いました : elle a acheté des takoyaki.' },
        { q: 'Qu’ont-elles regardé à la fin ?', options: ['Les tambours', 'Les feux d’artifice', 'Les lanternes'], answer: 1, explain: '最後に花火を見ました : à la fin, elles ont regardé les feux d’artifice.' }
      ],
      focus: [
        { jp: '土曜日', fr: 'samedi' }, { jp: '夜', fr: 'soir / nuit' },
        { jp: '夏祭り', fr: 'festival d’été' }, { jp: '道', fr: 'rue / chemin' },
        { jp: '提灯', fr: 'lanterne' }, { jp: '屋台', fr: 'stand' },
        { jp: 'たこ焼き', fr: 'takoyaki' }, { jp: '買う', fr: 'acheter' },
        { jp: '好む', fr: 'aimer' }, { jp: '太鼓', fr: 'tambour' },
        { jp: '音', fr: 'son' }, { jp: '浴衣', fr: 'yukata' },
        { jp: '着る', fr: 'porter / mettre' }, { jp: '最後', fr: 'enfin' },
        { jp: '花火', fr: 'feux d’artifice' }, { jp: '見る', fr: 'regarder' }
      ]
    },
    {
      id: 'denwa',
      emoji: '📱',
      tone: 'lavender',
      level: 'N5+',
      minutes: 4,
      title: 'Un message de Hana',
      titleJp: '花[はな]さんからのメッセージ',
      titleRomaji: 'Hana-san kara no messeeji',
      description: 'Un échange de messages pour organiser un rendez-vous au parc.',
      scene: 'Vers midi, le téléphone de Yui sonne. Hana lui propose de se retrouver.',
      lines: [
        { ruby: '昼[ひる]ごろ、携帯[けいたい]が鳴[な]りました。', fr: 'Vers midi, mon téléphone a sonné.' },
        { ruby: '花[はな]さんからメッセージが来[き]ました。', fr: 'J’ai reçu un message de Hana.' },
        { ruby: '「今日[きょう]の夕方[ゆうがた]、時間[じかん]がありますか」と書[か]いてありました。', fr: 'Il était écrit : « Tu as du temps ce soir ? »' },
        { ruby: 'わたしは「はい、五時[ごじ]なら大丈夫[だいじょうぶ]です」と返[かえ]しました。', fr: 'J’ai répondu : « Oui, à cinq heures, ça va. »' },
        { ruby: '花[はな]さんは「じゃあ、公園[こうえん]で会[あ]いましょう」と言[い]いました。', fr: 'Hana a dit : « Alors retrouvons-nous au parc. »' },
        { ruby: '公園[こうえん]には桜[さくら]の木[き]がありました。', fr: 'Il y avait des cerisiers dans le parc.' },
        { ruby: 'わたしたちは六時[ろくじ]まで話[はな]しました。', fr: 'Nous avons parlé jusqu’à six heures.' }
      ],
      questions: [
        { q: 'Comment Hana a-t-elle contacté la narratrice ?', options: ['Par téléphone', 'Par message', 'En personne'], answer: 1, explain: 'メッセージが来ました : Hana a envoyé un message.' },
        { q: 'Où se sont-elles retrouvées ?', options: ['Au café', 'À l’école', 'Au parc'], answer: 2, explain: '公園で会いましょう : retrouvons-nous au parc.' }
      ],
      focus: [
        { jp: '昼', fr: 'midi' }, { jp: '携帯', fr: 'téléphone portable' },
        { jp: '鳴る', fr: 'sonner' }, { jp: 'メッセージ', fr: 'message' },
        { jp: '来る', fr: 'venir' }, { jp: '夕方', fr: 'soir' },
        { jp: '時間', fr: 'temps' }, { jp: '書く', fr: 'écrire' },
        { jp: '五時', fr: 'cinq heures' }, { jp: '返す', fr: 'répondre' },
        { jp: '公園', fr: 'parc' }, { jp: '会う', fr: 'se retrouver' },
        { jp: '桜', fr: 'cerisier' }, { jp: '木', fr: 'arbre' },
        { jp: '六時', fr: 'six heures' }, { jp: '話す', fr: 'parler' }
      ]
    },
    {
      id: 'yama',
      emoji: '⛰️',
      tone: 'sand',
      level: 'N4',
      minutes: 5,
      title: 'Une journée à la montagne',
      titleJp: '山[やま]の一日[いちにち]',
      titleRomaji: 'Yama no ichinichi',
      description: 'Une randonnée, un bento et une vue qui récompense l’effort.',
      scene: 'Dimanche matin, deux amis partent marcher en montagne. Le chemin est un peu étroit.',
      lines: [
        { ruby: '日曜日[にちようび]の朝[あさ]、友達[ともだち]と山[やま]に登[のぼ]りました。', fr: 'Dimanche matin, j’ai gravi la montagne avec un ami.' },
        { ruby: '空気[くうき]がとてもきれいで、鳥[とり]の声[こえ]が聞[き]こえました。', fr: 'L’air était très pur et on entendait les oiseaux.' },
        { ruby: '道[みち]は少[すこ]し狭[せま]かったですが、歩[ある]きやすかったです。', fr: 'Le chemin était un peu étroit, mais facile à parcourir.' },
        { ruby: '一時間[いちじかん]ぐらいで頂上[ちょうじょう]に着[つ]きました。', fr: 'Nous sommes arrivés au sommet en environ une heure.' },
        { ruby: '頂上[ちょうじょう]から町[まち]がよく見[み]えました。', fr: 'Depuis le sommet, on voyait bien la ville.' },
        { ruby: 'お弁当[べんとう]を食[た]べて、ゆっくり休[やす]みました。', fr: 'Nous avons mangé un bento et nous nous sommes reposés tranquillement.' },
        { ruby: '帰[かえ]り道[みち]も、とても楽[たの]しかったです。', fr: 'Le chemin du retour aussi était très agréable.' }
      ],
      questions: [
        { q: 'Quand ont-ils grimpé ?', options: ['Samedi soir', 'Dimanche matin', 'Dimanche soir'], answer: 1, explain: '日曜日の朝、山に登りました : dimanche matin.' },
        { q: 'Combien de temps ont-ils mis pour atteindre le sommet ?', options: ['Environ trente minutes', 'Environ une heure', 'Environ deux heures'], answer: 1, explain: '一時間ぐらいで頂上に着きました : environ une heure.' }
      ],
      focus: [
        { jp: '日曜日', fr: 'dimanche' }, { jp: '朝', fr: 'matin' },
        { jp: '山', fr: 'montagne' }, { jp: '登る', fr: 'grimper' },
        { jp: '空気', fr: 'air' }, { jp: '鳥', fr: 'oiseau' },
        { jp: '声', fr: 'voix' }, { jp: '道', fr: 'chemin' },
        { jp: '狭い', fr: 'étroit' }, { jp: '歩く', fr: 'marcher' },
        { jp: '一時間', fr: 'une heure' }, { jp: '頂上', fr: 'sommet' },
        { jp: '着く', fr: 'arriver' }, { jp: '町', fr: 'ville' },
        { jp: '見える', fr: 'être visible' }, { jp: 'お弁当', fr: 'bento' },
        { jp: '休む', fr: 'se reposer' }, { jp: '帰り道', fr: 'chemin du retour' },
        { jp: '楽しい', fr: 'agréable' }
      ]
    }
  ];

  function plain(value) {
    return P && P.stripAnnotations ? P.stripAnnotations(String(value || '')) : String(value || '');
  }

  function storyById(id) {
    for (var i = 0; i < STORIES.length; i++) {
      if (STORIES[i].id === id) return STORIES[i];
    }
    return null;
  }

  function lineJp(line) {
    return plain(line && line.ruby);
  }

  function scoreStory(story, answers) {
    var questions = story && Array.isArray(story.questions) ? story.questions : [];
    var results = questions.map(function (question, index) {
      return !!(answers && Number(answers[index]) === Number(question.answer));
    });
    var score = results.filter(Boolean).length;
    return {
      score: score,
      total: questions.length,
      results: results,
      all: questions.length > 0 && score === questions.length
    };
  }

  return {
    stories: STORIES,
    storyById: storyById,
    lineJp: lineJp,
    plain: plain,
    scoreStory: scoreStory
  };
});
