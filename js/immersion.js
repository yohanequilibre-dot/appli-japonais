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
      cefr: 'A1',
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
      cefr: 'A1',
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
      cefr: 'A2',
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
      cefr: 'A2',
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
      cefr: 'A2',
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
      cefr: 'A2',
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
    },
    {
      id: 'resto',
      emoji: '🍱',
      tone: 'sun',
      level: 'N5',
      cefr: 'A1',
      minutes: 3,
      title: 'Au restaurant',
      titleJp: 'レストランで',
      titleRomaji: 'Resutoran de',
      description: 'Commander un déjeuner, demander la spécialité et choisir sa boisson.',
      scene: 'Tu entres dans un petit restaurant. Le serveur t’accueille et tu commandes simplement.',
      lines: [
        { ruby: 'こんにちは。一人[ひとり]ですか。', fr: 'Bonjour. Vous êtes seul ?' },
        { ruby: 'はい、一人[ひとり]です。', fr: 'Oui, je suis seul.' },
        { ruby: '今日[きょう]のおすすめは何[なん]ですか。', fr: 'Quelle est la recommandation du jour ?' },
        { ruby: '定食[ていしょく]は魚[さかな]です。', fr: 'Le plat du jour est du poisson.' },
        { ruby: 'じゃあ、それをください。', fr: 'Alors, je prends ça, s’il vous plaît.' },
        { ruby: '飲[の]み物[もの]は何[なん]にしますか。', fr: 'Quelle boisson prenez-vous ?' },
        { ruby: 'お茶[ちゃ]をお願[ねが]いします。', fr: 'Du thé, s’il vous plaît.' }
      ],
      questions: [
        { q: 'Quel est le plat du jour ?', options: ['Du poisson', 'Du poulet', 'Des nouilles'], answer: 0, skill: 'vocabulaire', explain: '定食は魚です signifie « le plat du jour est du poisson ».' },
        { q: 'Quelle boisson la personne choisit-elle ?', options: ['De l’eau', 'Du thé', 'Du café'], answer: 1, skill: 'comprehension', explain: 'お茶をお願いします signifie « du thé, s’il vous plaît ».' }
      ],
      focus: [
        { jp: '一人', fr: 'seul' }, { jp: '今日', fr: 'aujourd’hui' },
        { jp: 'おすすめ', fr: 'recommandation' }, { jp: '定食', fr: 'plat du jour' },
        { jp: '魚', fr: 'poisson' }, { jp: '飲み物', fr: 'boisson' },
        { jp: 'お茶', fr: 'thé' }, { jp: 'ください', fr: 's’il vous plaît' },
        { jp: '願う', fr: 'souhaiter' }
      ]
    },
    {
      id: 'jikoshoukai',
      emoji: '🙋',
      tone: 'mint',
      level: 'N5',
      cefr: 'A1',
      minutes: 3,
      title: 'Se présenter',
      titleJp: 'はじめまして',
      titleRomaji: 'Hajimemashite',
      description: 'Une première rencontre simple : nom, origine, langue et loisir.',
      scene: 'Tu rencontres une nouvelle collègue. Tu te présentes et tu lui poses une question simple.',
      lines: [
        { ruby: 'はじめまして。わたしはレアです。', fr: 'Enchantée. Je m’appelle Léa.' },
        { ruby: 'フランスから来[き]ました。', fr: 'Je viens de France.' },
        { ruby: '日本語[にほんご]を勉[べん]強[きょう]しています。', fr: 'J’étudie le japonais.' },
        { ruby: '趣味[しゅみ]は何[なん]ですか。', fr: 'Quel est ton loisir ?' },
        { ruby: '音楽[おんがく]を聞[き]くことです。', fr: 'C’est écouter de la musique.' },
        { ruby: 'よろしくお願[ねが]いします。', fr: 'Ravie de te connaître.' }
      ],
      questions: [
        { q: 'D’où vient Léa ?', options: ['De France', 'Du Japon', 'Du Canada'], answer: 0, skill: 'comprehension', explain: 'フランスから来ました signifie « je viens de France ».' },
        { q: 'Quel est son loisir ?', options: ['Écouter de la musique', 'Lire des romans', 'Cuisiner'], answer: 0, skill: 'vocabulaire', explain: '音楽を聞くことです signifie « c’est écouter de la musique ».' }
      ],
      focus: [
        { jp: 'はじめまして', fr: 'enchanté' }, { jp: '来る', fr: 'venir' },
        { jp: '日本語', fr: 'japonais' }, { jp: '勉強', fr: 'étude' },
        { jp: '趣味', fr: 'loisir' }, { jp: '音楽', fr: 'musique' },
        { jp: '聞く', fr: 'écouter' }, { jp: 'よろしく', fr: 'enchanté / ravi' }
      ]
    },
    {
      id: 'groupe',
      emoji: '👥',
      tone: 'lavender',
      level: 'N4',
      cefr: 'A2',
      minutes: 4,
      title: 'Rejoindre un groupe',
      titleJp: 'グループに加[くわ]わる',
      titleRomaji: 'Guruupu ni kuwaru',
      description: 'Aborder un groupe avec politesse, écouter et trouver un point commun.',
      scene: 'À une soirée, tu veux parler à un petit groupe. Tu demandes une place, tu te présentes et tu écoutes.',
      lines: [
        { ruby: 'すみません、ここに座[すわ]ってもいいですか。', fr: 'Excusez-moi, puis-je m’asseoir ici ?' },
        { ruby: 'もちろんです。どうぞ。', fr: 'Bien sûr. Je vous en prie.' },
        { ruby: 'わたしはレアです。東京[とうきょう]に住[す]んでいます。', fr: 'Je m’appelle Léa. J’habite à Tokyo.' },
        { ruby: 'みなさんは何[なに]をしていましたか。', fr: 'Que faisiez-vous ?' },
        { ruby: '写真[しゃしん]の話[はなし]をしていました。', fr: 'Nous parlions de photos.' },
        { ruby: 'わたしも写真[しゃしん]が好[す]きです。', fr: 'Moi aussi, j’aime la photographie.' },
        { ruby: 'じゃあ、一緒[いっしょ]に見[み]ましょう。', fr: 'Alors, regardons-les ensemble.' }
      ],
      questions: [
        { q: 'Que demande Léa en arrivant ?', options: ['Si elle peut s’asseoir', 'Si elle peut payer', 'Si elle peut partir'], answer: 0, skill: 'registre', explain: 'ここに座ってもいいですか est une demande de permission polie.' },
        { q: 'Pourquoi le groupe l’accepte-t-il facilement ?', options: ['Elle partage leur intérêt pour les photos', 'Elle connaît le serveur', 'Elle apporte un gâteau'], answer: 0, skill: 'comprehension', explain: '写真が好きです signifie « j’aime la photographie » : elles ont un point commun.' }
      ],
      focus: [
        { jp: '座る', fr: 's’asseoir' }, { jp: 'もちろん', fr: 'bien sûr' },
        { jp: '東京', fr: 'Tokyo' }, { jp: '住む', fr: 'habiter' },
        { jp: '写真', fr: 'photo' }, { jp: '話', fr: 'conversation' },
        { jp: '好き', fr: 'aimer' }, { jp: '一緒', fr: 'ensemble' },
        { jp: '見る', fr: 'regarder' }
      ]
    },
    {
      id: 'deeto',
      emoji: '☕',
      tone: 'rose',
      level: 'N4',
      cefr: 'A2',
      minutes: 4,
      title: 'Un rendez-vous',
      titleJp: 'はじめてのデート',
      titleRomaji: 'Hajimete no deeto',
      description: 'Retrouver quelqu’un, s’excuser, parler de sa semaine et proposer une suite.',
      scene: 'Tu retrouves quelqu’un dans un café. Vous parlez de votre semaine et vous décidez de vous revoir.',
      lines: [
        { ruby: '待[ま]たせてごめんなさい。', fr: 'Désolée de t’avoir fait attendre.' },
        { ruby: '大丈夫[だいじょうぶ]です。わたしも今[いま]来[き]たところです。', fr: 'Ce n’est rien. Je viens d’arriver.' },
        { ruby: '今週[こんしゅう]は忙[いそが]しかったですか。', fr: 'Ta semaine a été chargée ?' },
        { ruby: 'はい、でも今日[きょう]は楽[たの]しみにしていました。', fr: 'Oui, mais j’attendais aujourd’hui avec impatience.' },
        { ruby: 'このカフェのケーキはおいしいですよ。', fr: 'Les gâteaux de ce café sont bons, tu sais.' },
        { ruby: 'じゃあ、次[つぎ]は一緒[いっしょ]に食[た]べに来[き]ましょう。', fr: 'Alors, la prochaine fois, venons les manger ensemble.' },
        { ruby: 'ぜひ。連絡[れんらく]してください。', fr: 'Avec plaisir. Contacte-moi.' }
      ],
      questions: [
        { q: 'Pourquoi la personne s’excuse-t-elle ?', options: ['Elle est en retard', 'Elle a oublié son portefeuille', 'Elle veut partir'], answer: 0, skill: 'comprehension', explain: '待たせてごめんなさい signifie « désolée de t’avoir fait attendre ».' },
        { q: 'Que proposent-ils pour la prochaine fois ?', options: ['Manger un gâteau ensemble', 'Aller au cinéma', 'Étudier le japonais'], answer: 0, skill: 'vocabulaire', explain: '次は一緒に食べに来ましょう : la prochaine fois, venons manger ensemble.' }
      ],
      focus: [
        { jp: '待つ', fr: 'attendre' }, { jp: 'ごめんなさい', fr: 'désolé' },
        { jp: '大丈夫', fr: 'ça va' }, { jp: '今', fr: 'maintenant' },
        { jp: '今週', fr: 'cette semaine' }, { jp: '忙しい', fr: 'occupé' },
        { jp: '楽しみ', fr: 'impatience / plaisir' }, { jp: 'おいしい', fr: 'bon' },
        { jp: '次', fr: 'la prochaine fois' }, { jp: '連絡', fr: 'contact' }
      ]
    },
    {
      id: 'passions',
      emoji: '🎸',
      tone: 'sky',
      level: 'N4',
      cefr: 'A2',
      minutes: 5,
      title: 'Parler de ses passions',
      titleJp: '好[す]きなこと',
      titleRomaji: 'Suki na koto',
      description: 'Parler de ses loisirs, de ses goûts et proposer une activité à deux.',
      scene: 'Avec un ami, tu parles de ce qui te passionne : la musique, les voyages et la montagne.',
      lines: [
        { ruby: '週末[しゅうまつ]は何[なに]をしていますか。', fr: 'Que fais-tu le week-end ?' },
        { ruby: '山[やま]に登[のぼ]ったり、音楽[おんがく]を聞[き]いたりしています。', fr: 'Je grimpe en montagne, j’écoute de la musique, entre autres.' },
        { ruby: 'いいですね。どんな音楽[おんがく]が好[す]きですか。', fr: 'C’est bien. Quel genre de musique aimes-tu ?' },
        { ruby: '静[しず]かな音楽[おんがく]が好[す]きです。', fr: 'J’aime la musique calme.' },
        { ruby: 'わたしは旅行[りょこう]が好[す]きです。', fr: 'Moi, j’aime voyager.' },
        { ruby: 'じゃあ、今度[こんど]一緒[いっしょ]に旅[たび]をしましょう。', fr: 'Alors, voyageons ensemble la prochaine fois.' },
        { ruby: 'いいですね。計画[けいかく]を立[た]てましょう。', fr: 'Bonne idée. Faisons un plan.' }
      ],
      questions: [
        { q: 'Qu’aime faire la personne le week-end ?', options: ['Grimper et écouter de la musique', 'Nager', 'Cuisiner'], answer: 0, skill: 'comprehension', explain: '山に登ったり、音楽を聞いたりしています : elle grimpe et écoute de la musique.' },
        { q: 'Quel genre de musique préfère-t-elle ?', options: ['La musique calme', 'Le rock', 'Le jazz'], answer: 0, skill: 'vocabulaire', explain: '静かな音楽が好きです signifie « j’aime la musique calme ».' }
      ],
      focus: [
        { jp: '週末', fr: 'week-end' }, { jp: '山', fr: 'montagne' },
        { jp: '登る', fr: 'grimper' }, { jp: '音楽', fr: 'musique' },
        { jp: '聞く', fr: 'écouter' }, { jp: '静か', fr: 'calme' },
        { jp: '旅行', fr: 'voyage' }, { jp: '今度', fr: 'la prochaine fois' },
        { jp: '旅', fr: 'voyage' }, { jp: '計画', fr: 'plan' },
        { jp: '立てる', fr: 'établir' }
      ]
    },
    {
      id: 'shifuto',
      emoji: '🗓️',
      tone: 'sand',
      level: 'N3',
      cefr: 'B1',
      minutes: 5,
      title: 'Changer d’horaire',
      titleJp: 'シフトの相談[そうだん]',
      titleRomaji: 'Shifuto no soudan',
      description: 'Expliquer une contrainte, demander un remplacement et préparer un service.',
      scene: 'Au travail, tu dois accompagner ta mère à l’hôpital. Tu demandes à une collègue de t’aider à changer ton horaire.',
      lines: [
        { ruby: 'すみません、ちょっと相談[そうだん]してもいいですか。', fr: 'Excuse-moi, je peux te parler un instant ?' },
        { ruby: 'もちろん。どうしましたか。', fr: 'Bien sûr. Qu’est-ce qui se passe ?' },
        { ruby: '来週[らいしゅう]の金曜日[きんようび]、母[はは]の病院[びょういん]に付[つ]き添[そ]わなければならなくて。', fr: 'Vendredi prochain, je dois accompagner ma mère à l’hôpital.' },
        { ruby: 'それは大変[たいへん]ですね。シフトを替[か]わりましょうか。', fr: 'Ce n’est pas facile. Je te remplace ?' },
        { ruby: 'ありがとうございます。ただ、夜[よる]のシフトは初[はじ]めてなので、研修[けんしゅう]を受[う]けておいたほうがいいですか。', fr: 'Merci. Mais comme c’est ma première fois en soirée, je devrais suivre une formation ?' },
        { ruby: 'そうですね。一時間[いちじかん]だけ説明[せつめい]しておきますよ。', fr: 'Oui. Je vais t’expliquer pendant une heure.' },
        { ruby: '助[たす]かります。じゃあ、木曜日[もくようび]の午後[ごご]にお願[ねが]いします。', fr: 'Ça m’aide. Alors jeudi après-midi, s’il te plaît.' },
        { ruby: '大丈夫[だいじょうぶ]です。無理[むり]しないでくださいね。', fr: 'Pas de souci. Ne te surcharge pas.' }
      ],
      questions: [
        { q: 'Pourquoi la personne doit-elle changer son horaire ?', options: ['Pour accompagner sa mère à l’hôpital', 'Pour partir en vacances', 'Pour suivre un cours de japonais'], answer: 0, skill: 'comprehension', explain: '母の病院に付き添わなければならなくて : elle doit accompagner sa mère à l’hôpital.' },
        { q: 'Que propose la collègue pour préparer le service du soir ?', options: ['Une heure d’explication', 'Un jour de congé', 'Une réunion avec le client'], answer: 0, skill: 'comprehension', explain: '一時間だけ説明しておきますよ : elle prend une heure pour expliquer le travail.' }
      ],
      focus: [
        { jp: '相談', fr: 'consultation' }, { jp: '来週', fr: 'la semaine prochaine' },
        { jp: '金曜日', fr: 'vendredi' }, { jp: '病院', fr: 'hôpital' },
        { jp: '付き添う', fr: 'accompagner' }, { jp: 'シフト', fr: 'service / horaire' },
        { jp: '替わる', fr: 'remplacer' }, { jp: '研修', fr: 'formation' },
        { jp: '受ける', fr: 'recevoir / suivre' }, { jp: '説明', fr: 'explication' },
        { jp: '無理', fr: 'excès / impossible' }
      ]
    },
    {
      id: 'desaccord',
      emoji: '💬',
      tone: 'mint',
      level: 'N3',
      cefr: 'B1',
      minutes: 5,
      title: 'Un désaccord',
      titleJp: '意見[いけん]が違[ちが]うとき',
      titleRomaji: 'Iken ga chigau toki',
      description: 'Comparer deux envies, parler budget et trouver un compromis.',
      scene: 'Avec un ami, tu prépares les vacances d’été. Vous n’avez pas le même budget et devez choisir une destination.',
      lines: [
        { ruby: '夏休[なつやす]み、どこに行[い]こうか。', fr: 'Où est-ce qu’on va pour les vacances d’été ?' },
        { ruby: '沖縄[おきなわ]はどう？海[うみ]がきれいだよ。', fr: 'Et Okinawa ? La mer est belle.' },
        { ruby: '行[い]きたいけど、今[いま]の予算[よさん]だと厳[きび]しいかもしれない。', fr: 'J’aimerais, mais avec mon budget actuel, ça risque d’être juste.' },
        { ruby: 'じゃあ、近[ちか]くで安[やす]く行[い]けるところにしない？', fr: 'Alors, on ne choisirait pas un endroit proche et pas cher ?' },
        { ruby: 'それもいいね。ただ、せっかくの休[やす]みだから、少[すこ]し予算[よさん]を上[あ]げてもいいんじゃない？', fr: 'C’est bien aussi. Mais comme ce sont les vacances, on pourrait augmenter un peu le budget, non ?' },
        { ruby: 'うーん、来月[らいげつ]は引[ひ]っ越[こ]しもあるから、あまり使[つか]えないんだ。', fr: 'Hmm, le mois prochain j’ai aussi un déménagement, donc je ne peux pas trop dépenser.' },
        { ruby: 'そっか。じゃあ、行[い]き先[さき]は近場[ちかば]にして、来年[らいねん]に沖縄[おきなわ]にしようか。', fr: 'Je vois. Alors on choisit un endroit proche cette fois et on garde Okinawa pour l’année prochaine ?' },
        { ruby: 'うん、そのほうがいいね。計画[けいかく]を立[た]てるの、手伝[てつだ]ってくれる？', fr: 'Oui, c’est mieux. Tu m’aides à faire le plan ?' },
        { ruby: 'もちろん。安[やす]い宿[やど]を探[さが]しておくよ。', fr: 'Bien sûr. Je vais chercher un logement pas cher.' }
      ],
      questions: [
        { q: 'Pourquoi l’ami ne peut-il pas augmenter son budget ?', options: ['Il déménage le mois prochain', 'Il change de travail', 'Il part déjà en voyage'], answer: 0, skill: 'comprehension', explain: '来月は引っ越しもある : il a un déménagement le mois prochain.' },
        { q: 'Que décident-ils finalement ?', options: ['Un voyage près d’ici, puis Okinawa l’année prochaine', 'Okinawa tout de suite', 'Renoncer aux vacances'], answer: 0, skill: 'vocabulaire', explain: '近場にして、来年に沖縄にしよう : ils gardent Okinawa pour plus tard et choisissent un endroit proche.' }
      ],
      focus: [
        { jp: '夏休み', fr: 'vacances d’été' }, { jp: '沖縄', fr: 'Okinawa' },
        { jp: '予算', fr: 'budget' }, { jp: '厳しい', fr: 'difficile / juste' },
        { jp: 'せっかく', fr: 'profiter de l’occasion' }, { jp: '引っ越し', fr: 'déménagement' },
        { jp: '行き先', fr: 'destination' }, { jp: '近場', fr: 'endroit proche' },
        { jp: '計画', fr: 'plan' }, { jp: '宿', fr: 'logement' },
        { jp: '探す', fr: 'chercher' }
      ]
    },
    {
      id: 'entretien',
      emoji: '💼',
      tone: 'sky',
      level: 'N2',
      cefr: 'B2',
      minutes: 6,
      title: 'Un entretien d’embauche',
      titleJp: '面接[めんせつ]で',
      titleRomaji: 'Mensetsu de',
      description: 'Présenter son expérience, défendre sa méthode et poser une question polie.',
      scene: 'Tu passes un entretien pour un poste dans une entreprise japonaise. Tu présentes ton expérience et tu expliques comment tu gères un désaccord.',
      lines: [
        { ruby: '本日[ほんじつ]はお忙[いそが]しいところ、お時間[じかん]をいただきありがとうございます。', fr: 'Merci de m’accorder du temps aujourd’hui malgré votre emploi du temps.' },
        { ruby: 'こちらこそ。まず、これまでのご経験[けいけん]を簡単[かんたん]に教[おし]えていただけますか。', fr: 'Merci à vous. Tout d’abord, pourriez-vous me présenter brièvement votre expérience ?' },
        { ruby: 'はい。前職[ぜんしょく]では、海外[かいがい]の取引先[とりひきさき]との調整[ちょうせい]を担当[たんとう]しておりました。', fr: 'Oui. Dans mon précédent poste, j’étais chargée de la coordination avec des partenaires étrangers.' },
        { ruby: 'なるほど。意見[いけん]が対立[たいりつ]したとき、どのように対応[たいおう]されますか。', fr: 'Je vois. Comment réagissez-vous lorsque les opinions s’opposent ?' },
        { ruby: 'まず双方[そうほう]の意図[いと]を確認[かくにん]し、共通[きょうつう]の目的[もくてき]に戻[もど]るようにしています。', fr: 'Je commence par vérifier les intentions des deux parties, puis je reviens à l’objectif commun.' },
        { ruby: '具体的[ぐたいてき]には、どのような場面[ばめん]でそれを実践[じっせん]されましたか。', fr: 'Concrètement, dans quelle situation l’avez-vous mis en pratique ?' },
        { ruby: '納期[のうき]が迫[せま]る中[なか]、品質[ひんしつ]を優先[ゆうせん]するか、スピードを取[と]るかで意見[いけん]が分[わ]かれたことがありました。', fr: 'Alors que le délai approchait, les avis se sont divisés entre privilégier la qualité ou la vitesse.' },
        { ruby: 'そのときは、工程[こうてい]を二[ふた]つに分[わ]け、リスクの少[すく]ない部分[ぶぶん]から先[さき]に進[すす]める提案[ていあん]をしました。', fr: 'Cette fois-là, j’ai proposé de diviser le processus en deux et de commencer par la partie à moindre risque.' },
        { ruby: 'なるほど、説得力[せっとくりょく]がありますね。何[なに]か質問[しつもん]はありますか。', fr: 'Je vois, c’est convaincant. Avez-vous des questions ?' },
        { ruby: 'はい、入社[にゅうしゃ]後[ご]の研修[けんしゅう]について伺[うかが]ってもよろしいでしょうか。', fr: 'Oui, pourrais-je vous interroger sur la formation après l’embauche ?' },
        { ruby: 'もちろんです。来週[らいしゅう]、詳[くわ]しい資料[しりょう]をお送[おく]りします。', fr: 'Bien sûr. Je vous enverrai des documents détaillés la semaine prochaine.' }
      ],
      questions: [
        { q: 'Quel était le rôle de la candidate dans son poste précédent ?', options: ['Coordonner des partenaires étrangers', 'Diriger une équipe de vente', 'Traduire des documents'], answer: 0, skill: 'comprehension', explain: '海外の取引先との調整を担当しておりました : elle coordonnait des partenaires étrangers.' },
        { q: 'Pourquoi utilise-t-elle 伺ってもよろしいでしょうか ?', options: ['Pour poser une question avec beaucoup de politesse', 'Pour refuser une offre', 'Pour changer de sujet'], answer: 0, skill: 'registre', explain: '伺ってもよろしいでしょうか est une formule très polie pour demander la permission de poser une question.' }
      ],
      focus: [
        { jp: '本日', fr: 'aujourd’hui (poli)' }, { jp: '経験', fr: 'expérience' },
        { jp: '前職', fr: 'poste précédent' }, { jp: '取引先', fr: 'partenaire commercial' },
        { jp: '調整', fr: 'coordination' }, { jp: '担当', fr: 'responsabilité' },
        { jp: '対立', fr: 'opposition' }, { jp: '対応', fr: 'réaction / traitement' },
        { jp: '納期', fr: 'délai de livraison' }, { jp: '工程', fr: 'processus' },
        { jp: '提案', fr: 'proposition' }, { jp: '説得力', fr: 'force de conviction' },
        { jp: '研修', fr: 'formation' }, { jp: '伺う', fr: 'demander (poli)' }
      ]
    },
    {
      id: 'negociation',
      emoji: '🤝',
      tone: 'lavender',
      level: 'N2',
      cefr: 'B2',
      minutes: 6,
      title: 'Négocier un lancement',
      titleJp: 'リリースの交渉[こうしょう]',
      titleRomaji: 'Ririisu no koushou',
      description: 'Défendre un calendrier, réduire un risque et proposer un compromis.',
      scene: 'En réunion, le lancement est menacé par un délai trop court. Tu proposes de livrer d’abord l’essentiel au lieu de tout reporter.',
      lines: [
        { ruby: 'お疲[つか]れさまです。来月[らいげつ]のリリースについて、少[すこ]しお話[はなし]してもよろしいですか。', fr: 'Bonjour. Puis-je vous parler un peu du lancement du mois prochain ?' },
        { ruby: 'ええ、ちょうどその件[けん]で相談[そうだん]したかったんです。', fr: 'Oui, justement je voulais en discuter.' },
        { ruby: '実[じつ]は、検証[けんしょう]に十分[じゅうぶん]な時間[じかん]が取[と]れないままリリースするのはリスクが高[たか]いと考え[かんが]ています。', fr: 'En fait, je pense qu’il est risqué de livrer sans laisser assez de temps pour les tests.' },
        { ruby: 'とはいえ、取引先[とりひきさき]との約束[やくそく]もあるので、延期[えんき]は難[むずか]しいんです。', fr: 'Cela dit, nous avons un engagement avec le client, donc reporter est difficile.' },
        { ruby: '承知[しょうち]しました。全部[ぜんぶ]を一度[いちど]に出すのではなく、重要[じゅうよう]な機能[きのう]に絞[しぼ]って先[さき]に公開[こうかい]するのはどうでしょうか。', fr: 'Je comprends. Et si, au lieu de tout livrer d’un coup, nous nous concentrions sur les fonctions essentielles pour une première mise en ligne ?' },
        { ruby: 'なるほど。その場合[ばあい]、残[のこ]りの機能[きのう]はいつになりますか。', fr: 'Je vois. Dans ce cas, quand viendront les fonctions restantes ?' },
        { ruby: '二週間[にしゅうかん]後[ご]を目安[めやす]にしています。ただ、テストの結果[けっか]次第[しだい]で前後[ぜんご]する可能性[かのうせい]があります。', fr: 'Nous visons dans deux semaines. Cependant, selon les résultats des tests, cela peut varier.' },
        { ruby: '分[わ]かりました。では、今日[きょう]中[じゅう]にその案[あん]を上[うえ]に共有[きょうゆう]していただけますか。', fr: 'Entendu. Pouvez-vous partager cette proposition avec la direction d’ici aujourd’hui ?' },
        { ruby: 'はい、資料[しりょう]をまとめてお送[おく]りします。', fr: 'Oui, je vais préparer les documents et vous les envoyer.' },
        { ruby: 'お願[ねが]いします。リスクを減[へ]らせるなら、そのほうが現実的[げんじつてき]ですね。', fr: 'Je vous en prie. Si cela réduit les risques, c’est plus réaliste.' }
      ],
      questions: [
        { q: 'Pourquoi l’équipe ne peut-elle pas simplement reporter le lancement ?', options: ['Un engagement avec le client', 'Un manque de personnel', 'Une panne de serveur'], answer: 0, skill: 'comprehension', explain: '取引先との約束もある : il y a un engagement pris avec le client.' },
        { q: 'Que signifie テストの結果次第 ?', options: ['Cela dépend des résultats des tests', 'Les tests sont terminés', 'Les tests ont échoué'], answer: 0, skill: 'grammaire', explain: '〜次第 signifie « selon » ou « dépend de » : ici, la date dépend des résultats des tests.' }
      ],
      focus: [
        { jp: 'リリース', fr: 'lancement' }, { jp: '検証', fr: 'vérification / tests' },
        { jp: '十分', fr: 'suffisant' }, { jp: 'リスク', fr: 'risque' },
        { jp: '取引先', fr: 'partenaire commercial' }, { jp: '約束', fr: 'engagement' },
        { jp: '延期', fr: 'report' }, { jp: '承知', fr: 'compréhension / accord' },
        { jp: '機能', fr: 'fonctionnalité' }, { jp: '絞る', fr: 'restreindre / cibler' },
        { jp: '公開', fr: 'mise en ligne' }, { jp: '目安', fr: 'repère / estimation' },
        { jp: '次第', fr: 'selon / dépend de' }, { jp: '現実的', fr: 'réaliste' }
      ]
    }
  ];

  // Lectures des mots mis en avant : elles servent au ruby des fiches de
  // vocabulaire et au glossaire mot à mot. Les mots kana gardent leur lecture.
  var FOCUS_READINGS = {
    'おいしい': 'おいしい', 'おすすめ': 'おすすめ', 'おにぎり': 'おにぎり', 'お会計': 'おかいけい',
    'お茶': 'おちゃ', 'お弁当': 'おべんとう', 'ください': 'ください', 'ごめんなさい': 'ごめんなさい',
    'コンビニ': 'コンビニ', 'シフト': 'シフト', 'せっかく': 'せっかく', 'たこ焼き': 'たこやき',
    'はじめまして': 'はじめまして', 'メッセージ': 'メッセージ', 'もちろん': 'もちろん', 'よろしく': 'よろしく',
    'リスク': 'リスク', 'リリース': 'リリース', '一時間': 'いちじかん', '一緒': 'いっしょ',
    '一人': 'ひとり', '引っ越し': 'ひっこし', '飲み物': 'のみもの', '雨': 'あめ',
    '駅': 'えき', '延期': 'えんき', '沖縄': 'おきなわ', '屋台': 'やたい', '音': 'おと',
    '音楽': 'おんがく', '夏休み': 'なつやすみ', '夏祭り': 'なつまつり', '家': 'いえ',
    '花火': 'はなび', '会う': 'あう', '学校': 'がっこう', '楽しい': 'たのしい',
    '楽しみ': 'たのしみ', '願う': 'ねがう', '機能': 'きのう', '帰り道': 'かえりみち',
    '帰る': 'かえる', '起きる': 'おきる', '休む': 'やすむ', '魚': 'さかな',
    '狭い': 'せまい', '近場': 'ちかば', '金曜日': 'きんようび', '空気': 'くうき',
    '携帯': 'けいたい', '経験': 'けいけん', '計画': 'けいかく', '検証': 'けんしょう',
    '研修': 'けんしゅう', '見える': 'みえる', '見る': 'みる', '厳しい': 'きびしい',
    '現実的': 'げんじつてき', '五時': 'ごじ', '午後': 'ごご', '公園': 'こうえん',
    '公開': 'こうかい', '好き': 'すき', '好む': 'このむ', '工程': 'こうてい',
    '絞る': 'しぼる', '行き先': 'いきさき', '降る': 'ふる', '今': 'いま',
    '今週': 'こんしゅう', '今朝': 'けさ', '今度': 'こんど', '今日': 'きょう',
    '座る': 'すわる', '最後': 'さいご', '桜': 'さくら', '三百円': 'さんびゃくえん',
    '傘': 'かさ', '山': 'やま', '伺う': 'うかがう', '持つ': 'もつ', '時間': 'じかん',
    '次': 'つぎ', '次第': 'しだい', '七時': 'しちじ', '写真': 'しゃしん', '取引先': 'とりひきさき',
    '趣味': 'しゅみ', '受ける': 'うける', '週末': 'しゅうまつ', '住む': 'すむ',
    '十分': 'じゅうぶん', '宿': 'やど', '書く': 'かく', '承知': 'しょうち',
    '食べる': 'たべる', '声': 'こえ', '静か': 'しずか', '説得力': 'せっとくりょく',
    '説明': 'せつめい', '前': 'まえ', '前職': 'ぜんしょく', '相談': 'そうだん',
    '太鼓': 'たいこ', '対応': 'たいおう', '対立': 'たいりつ', '待つ': 'まつ',
    '替わる': 'かわる', '袋': 'ふくろ', '大丈夫': 'だいじょうぶ', '担当': 'たんとう',
    '探す': 'さがす', '着く': 'つく', '着る': 'きる', '昼': 'ひる', '朝': 'あさ',
    '朝ご飯': 'あさごはん', '町': 'まち', '調整': 'ちょうせい', '頂上': 'ちょうじょう',
    '鳥': 'とり', '定食': 'ていしょく', '提案': 'ていあん', '提灯': 'ちょうちん',
    '店員': 'てんいん', '電車': 'でんしゃ', '登る': 'のぼる', '土曜日': 'どようび',
    '東京': 'とうきょう', '答える': 'こたえる', '道': 'みち', '日本語': 'にほんご',
    '日曜日': 'にちようび', '納期': 'のうき', '買う': 'かう', '八時': 'はちじ',
    '病院': 'びょういん', '付き添う': 'つきそう', '聞く': 'きく', '返す': 'かえす',
    '勉強': 'べんきょう', '歩く': 'あるく', '忙しい': 'いそがしい', '本日': 'ほんじつ',
    '無理': 'むり', '鳴る': 'なる', '木': 'き', '目安': 'めやす', '夜': 'よる',
    '約束': 'やくそく', '友達': 'ともだち', '夕方': 'ゆうがた', '予算': 'よさん',
    '浴衣': 'ゆかた', '来る': 'くる', '来週': 'らいしゅう', '立てる': 'たてる',
    '旅': 'たび', '旅行': 'りょこう', '連絡': 'れんらく', '六時': 'ろくじ',
    '話': 'はなし', '話す': 'はなす'
  };

  // Formes réellement présentes dans les histoires : verbes conjugués,
  // adverbes et noms composés que le lexique général ne couvre pas toujours.
  var STORY_GLOSS = {
    'おはよう': { reading: 'おはよう', fr: 'bonjour (le matin)' },
    '顔': { reading: 'かお', fr: 'visage' },
    '洗って': { reading: 'あらって', fr: 'laver (forme -te)' },
    '食べます': { reading: 'たべます', fr: 'manger (poli)' },
    '食べました': { reading: 'たべました', fr: 'a mangé' },
    '卵': { reading: 'たまご', fr: 'œuf' },
    '行きます': { reading: 'いきます', fr: 'aller (poli)' },
    '行きました': { reading: 'いきました', fr: 'est allé(e)' },
    '会いました': { reading: 'あいました', fr: 'a rencontré' },
    '花': { reading: 'はな', fr: 'fleur / Hana' },
    '勉強します': { reading: 'べんきょうします', fr: 'étudier (poli)' },
    '八時': { reading: 'はちじ', fr: 'huit heures' },
    'わたし': { reading: 'わたし', fr: 'je / moi' },
    'いらっしゃいませ': { reading: 'いらっしゃいませ', fr: 'bienvenue' },
    '言いました': { reading: 'いいました', fr: 'a dit' },
    '二つ': { reading: 'ふたつ', fr: 'deux (objets)' },
    '買いました': { reading: 'かいました', fr: 'a acheté' },
    '三百円': { reading: 'さんびゃくえん', fr: 'trois cents yens' },
    '要ります': { reading: 'いります', fr: 'falloir / être nécessaire' },
    '聞かれました': { reading: 'きかれました', fr: 'on m’a demandé' },
    '答えました': { reading: 'こたえました', fr: 'a répondu' },
    '降りました': { reading: 'ふりました', fr: 'est tombée (pluie)' },
    '持っていませんでした': { reading: 'もっていませんでした', fr: 'je n’avais pas' },
    '待っていました': { reading: 'まっていました', fr: 'attendait' },
    '帰りましょう': { reading: 'かえりましょう', fr: 'rentrons' },
    '一つ': { reading: 'ひとつ', fr: 'un (objet)' },
    '歩きました': { reading: 'あるきました', fr: 'avons marché' },
    'きれいでした': { reading: 'きれいでした', fr: 'était beau / propre' },
    'わたしたち': { reading: 'わたしたち', fr: 'nous' },
    'たくさんの': { reading: 'たくさんの', fr: 'beaucoup de' },
    'ありました': { reading: 'ありました', fr: 'il y avait' },
    'りんご飴': { reading: 'りんごあめ', fr: 'pomme d’amour' },
    '好きです': { reading: 'すきです', fr: 'aimer' },
    '聞こえました': { reading: 'きこえました', fr: 'on entendait' },
    '着ました': { reading: 'きました', fr: 'a mis (vêtement)' },
    '見ました': { reading: 'みました', fr: 'a regardé' },
    'ごろ': { reading: 'ごろ', fr: 'vers' },
    '鳴りました': { reading: 'なりました', fr: 'a sonné' },
    '来ました': { reading: 'きました', fr: 'est venu(e)' },
    'あります': { reading: 'あります', fr: 'il y a / avoir' },
    '書いてありました': { reading: 'かいてありました', fr: 'il était écrit' },
    '返しました': { reading: 'かえしました', fr: 'ai répondu' },
    '会いましょう': { reading: 'あいましょう', fr: 'retrouvons-nous' },
    '話しました': { reading: 'はなしました', fr: 'avons parlé' },
    '登りました': { reading: 'のぼりました', fr: 'ai gravi' },
    'きれいで': { reading: 'きれいで', fr: 'pur / beau (forme -te)' },
    '少し': { reading: 'すこし', fr: 'un peu' },
    '狭かった': { reading: 'せまかった', fr: 'était étroit' },
    '歩きやすかった': { reading: 'あるきやすかった', fr: 'était facile à parcourir' },
    'ぐらい': { reading: 'ぐらい', fr: 'environ' },
    '着きました': { reading: 'つきました', fr: 'sommes arrivés' },
    '見えました': { reading: 'みえました', fr: 'on voyait' },
    '食べて': { reading: 'たべて', fr: 'manger (forme -te)' },
    'ゆっくり': { reading: 'ゆっくり', fr: 'tranquillement' },
    '休みました': { reading: 'やすみました', fr: 'nous sommes reposés' },
    '楽しかった': { reading: 'たのしかった', fr: 'était agréable' },
    'します': { reading: 'します', fr: 'faire / choisir' },
    'お願いします': { reading: 'おねがいします', fr: 's’il vous plaît' },
    'レア': { reading: 'レア', fr: 'Léa' },
    'フランス': { reading: 'フランス', fr: 'France' },
    '勉強しています': { reading: 'べんきょうしています', fr: 'j’étudie' },
    '聞くことです': { reading: 'きくことです', fr: 'c’est écouter' },
    '座ってもいいですか': { reading: 'すわってもいいですか', fr: 'puis-je m’asseoir ?' },
    'どうぞ': { reading: 'どうぞ', fr: 'je vous en prie' },
    '住んでいます': { reading: 'すんでいます', fr: 'j’habite' },
    'みなさん': { reading: 'みなさん', fr: 'tout le monde' },
    'していました': { reading: 'していました', fr: 'faisait (forme -te + passé)' },
    '見ましょう': { reading: 'みましょう', fr: 'regardons' },
    '待たせて': { reading: 'またせて', fr: 'faire attendre (forme -te)' },
    '来た': { reading: 'きた', fr: 'est venu(e)' },
    'ところ': { reading: 'ところ', fr: 'au moment où' },
    '忙しかった': { reading: 'いそがしかった', fr: 'était chargé' },
    'でも': { reading: 'でも', fr: 'mais' },
    '楽しみにしていました': { reading: 'たのしみにしていました', fr: 'j’attendais avec impatience' },
    'カフェ': { reading: 'カフェ', fr: 'café' },
    'ケーキ': { reading: 'ケーキ', fr: 'gâteau' },
    '食べに': { reading: 'たべに', fr: 'pour manger' },
    '来ましょう': { reading: 'きましょう', fr: 'venons' },
    'ぜひ': { reading: 'ぜひ', fr: 'avec plaisir' },
    'してください': { reading: 'してください', fr: 'fais / faites s’il vous plaît' },
    '登ったり': { reading: 'のぼったり', fr: 'grimper (entre autres)' },
    '聞いたりしています': { reading: 'きいたりしています', fr: 'j’écoute (entre autres)' },
    'どんな': { reading: 'どんな', fr: 'quel genre de' },
    '静かな': { reading: 'しずかな', fr: 'calme' },
    'しましょう': { reading: 'しましょう', fr: 'faisons' },
    '立てましょう': { reading: 'たてましょう', fr: 'établissons' },
    'ちょっと': { reading: 'ちょっと', fr: 'un instant' },
    '相談してもいいですか': { reading: 'そうだんしてもいいですか', fr: 'puis-je te parler ?' },
    'どうしましたか': { reading: 'どうしましたか', fr: 'qu’est-ce qui se passe ?' },
    '母': { reading: 'はは', fr: 'ma mère' },
    '付き添わなければ': { reading: 'つきそわなければ', fr: 'devoir accompagner' },
    'ならなくて': { reading: 'ならなくて', fr: 'et donc (forme -te)' },
    'それは': { reading: 'それは', fr: 'c’est' },
    '大変': { reading: 'たいへん', fr: 'difficile' },
    '替わりましょうか': { reading: 'かわりましょうか', fr: 'je te remplace ?' },
    'ありがとうございます': { reading: 'ありがとうございます', fr: 'merci' },
    'ただ': { reading: 'ただ', fr: 'mais' },
    '初めて': { reading: 'はじめて', fr: 'première fois' },
    'なので': { reading: 'なので', fr: 'comme / donc' },
    '受けておいたほうがいいですか': { reading: 'うけておいたほうがいいですか', fr: 'devrais-je suivre ?' },
    'そうですね': { reading: 'そうですね', fr: 'oui' },
    '説明しておきますよ': { reading: 'せつめいしておきますよ', fr: 'je vais expliquer' },
    '助かります': { reading: 'たすかります', fr: 'ça m’aide' },
    'しないでください': { reading: 'しないでください', fr: 'ne fais pas' },
    '行こうか': { reading: 'いこうか', fr: 'on y va ?' },
    'きれいだよ': { reading: 'きれいだよ', fr: 'c’est beau' },
    '行きたい': { reading: 'いきたい', fr: 'vouloir aller' },
    'けど': { reading: 'けど', fr: 'mais' },
    'だと': { reading: 'だと', fr: 'avec / selon' },
    'かもしれない': { reading: 'かもしれない', fr: 'peut-être' },
    '近く': { reading: 'ちかく', fr: 'près' },
    '安く': { reading: 'やすく', fr: 'pas cher (forme adverbiale)' },
    '行ける': { reading: 'いける', fr: 'pouvoir aller' },
    'しない': { reading: 'しない', fr: 'ne pas faire' },
    'それも': { reading: 'それも', fr: 'ça aussi' },
    '休み': { reading: 'やすみ', fr: 'vacances / repos' },
    'だから': { reading: 'だから', fr: 'donc' },
    '上げてもいいんじゃない': { reading: 'あげてもいいんじゃない', fr: 'on pourrait augmenter, non ?' },
    'うーん': { reading: 'うーん', fr: 'hmm' },
    '来月': { reading: 'らいげつ', fr: 'mois prochain' },
    'あまり': { reading: 'あまり', fr: 'pas trop' },
    '使えない': { reading: 'つかえない', fr: 'ne pas pouvoir dépenser' },
    'そっか': { reading: 'そっか', fr: 'je vois' },
    'して': { reading: 'して', fr: 'faire (forme -te)' },
    '来年': { reading: 'らいねん', fr: 'année prochaine' },
    'しようか': { reading: 'しようか', fr: 'on fait ?' },
    'そのほうがいい': { reading: 'そのほうがいい', fr: 'c’est mieux' },
    '手伝ってくれる': { reading: 'てつだってくれる', fr: 'tu m’aides ?' },
    '探しておくよ': { reading: 'さがしておくよ', fr: 'je vais chercher' },
    'お忙しい': { reading: 'おいそがしい', fr: 'occupé (poli)' },
    'お時間': { reading: 'おじかん', fr: 'temps (poli)' },
    'いただき': { reading: 'いただき', fr: 'recevoir (forme -masu)' },
    'こちらこそ': { reading: 'こちらこそ', fr: 'c’est moi' },
    'まず': { reading: 'まず', fr: 'd’abord' },
    'これまでの': { reading: 'これまでの', fr: 'jusqu’ici' },
    'ご経験': { reading: 'ごけいけん', fr: 'expérience (poli)' },
    '簡単に': { reading: 'かんたんに', fr: 'brièvement' },
    '教えていただけますか': { reading: 'おしえていただけますか', fr: 'pourriez-vous m’expliquer ?' },
    '海外': { reading: 'かいがい', fr: 'étranger' },
    'との': { reading: 'との', fr: 'avec' },
    '担当しておりました': { reading: 'たんとうしておりました', fr: 'j’étais chargé de' },
    'なるほど': { reading: 'なるほど', fr: 'je vois' },
    '意見': { reading: 'いけん', fr: 'opinion' },
    '対立した': { reading: 'たいりつした', fr: 'se sont opposées' },
    'とき': { reading: 'とき', fr: 'lorsque' },
    'どのように': { reading: 'どのように', fr: 'comment' },
    '対応されますか': { reading: 'たいおうされますか', fr: 'réagissez-vous ?' },
    '双方': { reading: 'そうほう', fr: 'deux parties' },
    '意図': { reading: 'いと', fr: 'intention' },
    '確認し': { reading: 'かくにんし', fr: 'vérifier (forme -masu)' },
    '共通': { reading: 'きょうつう', fr: 'commun' },
    '目的': { reading: 'もくてき', fr: 'objectif' },
    '戻る': { reading: 'もどる', fr: 'revenir' },
    'ようにしています': { reading: 'ようにしています', fr: 'je m’efforce de' },
    '具体的には': { reading: 'ぐたいてきには', fr: 'concrètement' },
    'どのような': { reading: 'どのような', fr: 'quel' },
    '場面': { reading: 'ばめん', fr: 'situation' },
    '実践されましたか': { reading: 'じっせんされましたか', fr: 'avez-vous mis en pratique ?' },
    '迫る': { reading: 'せまる', fr: 'approcher' },
    '中': { reading: 'なか', fr: 'pendant' },
    '品質': { reading: 'ひんしつ', fr: 'qualité' },
    '優先する': { reading: 'ゆうせんする', fr: 'privilégier' },
    'スピード': { reading: 'スピード', fr: 'vitesse' },
    '取る': { reading: 'とる', fr: 'prendre' },
    '分かれた': { reading: 'わかれた', fr: 'se sont divisées' },
    'そのとき': { reading: 'そのとき', fr: 'cette fois-là' },
    '分け': { reading: 'わけ', fr: 'diviser (forme -masu)' },
    '少ない': { reading: 'すくない', fr: 'peu / moindre' },
    '部分': { reading: 'ぶぶん', fr: 'partie' },
    '先に': { reading: 'さきに', fr: 'd’abord' },
    '進める': { reading: 'すすめる', fr: 'faire avancer' },
    '何か': { reading: 'なにか', fr: 'quelque chose' },
    '質問': { reading: 'しつもん', fr: 'question' },
    '入社後': { reading: 'にゅうしゃご', fr: 'après l’embauche' },
    'について': { reading: 'について', fr: 'à propos de' },
    '伺ってもよろしいでしょうか': { reading: 'うかがってもよろしいでしょうか', fr: 'puis-je vous demander ?' },
    '詳しい': { reading: 'くわしい', fr: 'détaillé' },
    '資料': { reading: 'しりょう', fr: 'documents' },
    'お送りします': { reading: 'おくりします', fr: 'j’enverrai' },
    'お疲れさまです': { reading: 'おつかれさまです', fr: 'bonjour (travail)' },
    'お話してもよろしいですか': { reading: 'おはなししてもよろしいですか', fr: 'puis-je parler ?' },
    'よろしい': { reading: 'よろしい', fr: 'bien / acceptable (poli)' },
    'ええ': { reading: 'ええ', fr: 'oui' },
    'ちょうど': { reading: 'ちょうど', fr: 'justement' },
    'その件': { reading: 'そのけん', fr: 'ce sujet' },
    '相談したかったんです': { reading: 'そうだんしたかったんです', fr: 'je voulais en discuter' },
    '実は': { reading: 'じつは', fr: 'en fait' },
    '十分な': { reading: 'じゅうぶんな', fr: 'suffisant' },
    '取れない': { reading: 'とれない', fr: 'ne pas pouvoir prendre' },
    'まま': { reading: 'まま', fr: 'sans que' },
    'リリースする': { reading: 'リリースする', fr: 'livrer' },
    'のは': { reading: 'のは', fr: 'le fait de' },
    '高い': { reading: 'たかい', fr: 'élevé' },
    '考えています': { reading: 'かんがえています', fr: 'je pense' },
    'とはいえ': { reading: 'とはいえ', fr: 'cela dit' },
    'ので': { reading: 'ので', fr: 'donc' },
    '難しいんです': { reading: 'むずかしいんです', fr: 'c’est difficile' },
    '承知しました': { reading: 'しょうちしました', fr: 'j’ai compris' },
    '全部': { reading: 'ぜんぶ', fr: 'tout' },
    '一度に': { reading: 'いちどに', fr: 'd’un coup' },
    '出す': { reading: 'だす', fr: 'livrer / sortir' },
    'ではなく': { reading: 'ではなく', fr: 'au lieu de' },
    'のではなく': { reading: 'のではなく', fr: 'au lieu de' },
    'な': { reading: 'な', fr: 'marqueur adjectival' },
    'ほう': { reading: 'ほう', fr: 'côté / option' },
    '重要': { reading: 'じゅうよう', fr: 'important' },
    '絞って': { reading: 'しぼって', fr: 'se concentrer (forme -te)' },
    '公開する': { reading: 'こうかいする', fr: 'mettre en ligne' },
    'どうでしょうか': { reading: 'どうでしょうか', fr: 'que diriez-vous ?' },
    'その場合': { reading: 'そのばあい', fr: 'dans ce cas' },
    '残りの': { reading: 'のこりの', fr: 'restantes' },
    'いつになりますか': { reading: 'いつになりますか', fr: 'quand seront-elles ?' },
    '二週間後': { reading: 'にしゅうかんご', fr: 'dans deux semaines' },
    'にしています': { reading: 'にしています', fr: 'nous visons' },
    'テスト': { reading: 'テスト', fr: 'test' },
    '結果': { reading: 'けっか', fr: 'résultat' },
    '前後する': { reading: 'ぜんごする', fr: 'varier' },
    '可能性': { reading: 'かのうせい', fr: 'possibilité' },
    '分かりました': { reading: 'わかりました', fr: 'entendu' },
    'では': { reading: 'では', fr: 'alors' },
    '今日中': { reading: 'きょうじゅう', fr: 'd’ici aujourd’hui' },
    'その案': { reading: 'そのあん', fr: 'cette proposition' },
    '上': { reading: 'うえ', fr: 'direction / supérieur' },
    '共有していただけますか': { reading: 'きょうゆうしていただけますか', fr: 'pouvez-vous partager ?' },
    'まとめて': { reading: 'まとめて', fr: 'rassembler' },
    '減らせる': { reading: 'へらせる', fr: 'pouvoir réduire' },
    'なら': { reading: 'なら', fr: 'si' }
  };

  var GLOSSARY = {};
  STORIES.forEach(function (story) {
    (story.focus || []).forEach(function (item) {
      if (!item || !item.jp) return;
      GLOSSARY[item.jp] = {
        reading: FOCUS_READINGS[item.jp] || '',
        fr: item.fr || ''
      };
    });
  });
  Object.keys(STORY_GLOSS).forEach(function (key) {
    if (!GLOSSARY[key]) GLOSSARY[key] = STORY_GLOSS[key];
  });

  function readingOf(value) {
    var key = plain(value);
    return GLOSSARY[key] && GLOSSARY[key].reading ? GLOSSARY[key].reading : '';
  }

  var QUESTION_SKILLS = {
    asa: ['comprehension', 'vocabulaire'],
    konbini: ['vocabulaire', 'comprehension'],
    ame: ['grammaire', 'comprehension'],
    matsuri: ['vocabulaire', 'comprehension'],
    denwa: ['comprehension', 'vocabulaire'],
    yama: ['comprehension', 'grammaire']
  };
  STORIES.forEach(function (story) {
    if (!QUESTION_SKILLS[story.id]) return;
    (story.questions || []).forEach(function (question, index) {
      if (!question.skill) question.skill = QUESTION_SKILLS[story.id][index] || 'comprehension';
    });
  });

  function plain(value) {
    return P && P.stripAnnotations ? P.stripAnnotations(String(value || '')) : String(value || '');
  }

  var SKILLS = {
    comprehension: { label: 'Compréhension', tip: 'Relis l’histoire sans traduction et repère qui fait quoi, quand et où.' },
    vocabulaire: { label: 'Vocabulaire', tip: 'Ouvre le mot à mot, puis révise les mots de l’histoire avant de relire.' },
    grammaire: { label: 'Grammaire', tip: 'Repère le verbe à la fin et la particule qui relie les idées.' },
    registre: { label: 'Formules polies', tip: 'Compare les formules de politesse et choisis celle qui correspond au contexte.' }
  };

  var CEFR_LEVELS = {
    A1: {
      title: 'Découverte',
      can: [
        'Je comprends des phrases simples sur moi, mon quotidien et mes besoins.',
        'Je peux me présenter, commander et utiliser les politesses de base.',
        'Je repère les informations explicites d’un court récit.'
      ],
      target: '1 histoire A1 validée pour commencer, 3 pour consolider.'
    },
    A2: {
      title: 'Survie',
      can: [
        'Je comprends des échanges courts de la vie quotidienne.',
        'Je peux parler de mes goûts, fixer un rendez-vous et réagir à une demande.',
        'Je suis un récit simple au présent comme au passé.'
      ],
      target: '3 histoires A1 validées + 2 histoires A2 à 50 %, puis 4 A2 à 100 %.'
    },
    B1: {
      title: 'Seuil',
      can: [
        'Je comprends un échange imprévu et les arguments principaux d’une conversation.',
        'Je peux expliquer une contrainte, proposer une solution et réagir avec nuance.',
        'Je distingue les registres poli et familier dans une situation sociale.'
      ],
      target: '3 A1 + 2 A2 + 2 B1 validées, puis 2 B1 à 100 % pour consolider B1.'
    },
    B2: {
      title: 'Indépendance',
      can: [
        'Je comprends des échanges professionnels ou sociaux nuancés.',
        'Je peux défendre une position, reformuler et négocier un compromis.',
        'Je reconnais les formules de politesse avancées et les sous-entendus.'
      ],
      target: '3 A1 + 2 A2 + 2 B1 + 2 B2 validées, puis 2 B2 à 100 % pour consolider B2 conversationnel.'
    }
  };

  function storyById(id) {
    for (var i = 0; i < STORIES.length; i++) {
      if (STORIES[i].id === id) return STORIES[i];
    }
    return null;
  }

  function storyCefr(story) {
    if (!story) return '';
    if (story.cefr) return story.cefr;
    return story.level === 'N4' ? 'A2' : 'A1';
  }

  function assessLevel(records) {
    var map = records && typeof records === 'object' ? records : {};
    var stats = {
      A1: { passed: 0, solid: 0, total: 0 },
      A2: { passed: 0, solid: 0, total: 0 },
      B1: { passed: 0, solid: 0, total: 0 },
      B2: { passed: 0, solid: 0, total: 0 }
    };
    STORIES.forEach(function (story) {
      var level = storyCefr(story);
      if (!stats[level]) return;
      stats[level].total += 1;
      var record = map[story.id];
      if (!record || !record.completedAt || !Number(record.total)) return;
      var ratio = Number(record.bestScore) / Number(record.total);
      if (ratio >= 0.5) stats[level].passed += 1;
      if (ratio >= 0.999) stats[level].solid += 1;
    });
    var a1 = stats.A1;
    var a2 = stats.A2;
    var b1 = stats.B1;
    var b2 = stats.B2;
    var code = 'A1';
    var status = 'à établir';
    var progress = 0;
    var next = 'Termine une histoire A1 avec au moins 1 bonne réponse sur 2 pour établir ton niveau.';
    if (a1.passed >= 1) {
      status = 'en cours';
      progress = Math.min(100, Math.round(a1.passed / 3 * 100));
      next = a1.passed < 3
        ? 'Encore ' + (3 - a1.passed) + ' histoire' + (3 - a1.passed === 1 ? '' : 's') + ' A1 à valider pour consolider A1.'
        : 'Encore ' + Math.max(0, 2 - a2.passed) + ' histoire' + (2 - a2.passed === 1 ? '' : 's') + ' A2 à 50 % pour passer A2.';
    }
    if (a1.passed >= 3 && a2.passed >= 2) {
      code = 'A2';
      status = a2.solid >= 4 ? 'consolidé' : 'en cours';
      progress = Math.min(100, Math.round(a2.solid / 4 * 100));
      next = a2.solid >= 4
        ? 'Encore ' + Math.max(0, 2 - b1.passed) + ' histoire' + (2 - b1.passed === 1 ? '' : 's') + ' B1 à 50 % pour passer B1.'
        : 'Encore ' + Math.max(0, 4 - a2.solid) + ' histoire' + (4 - a2.solid === 1 ? '' : 's') + ' A2 à 100 % pour consolider A2.';
    }
    if (a1.passed >= 3 && a2.passed >= 2 && b1.passed >= 2) {
      code = 'B1';
      status = b1.solid >= 2 ? 'consolidé' : 'en cours';
      progress = Math.min(100, Math.round(b1.solid / 2 * 100));
      next = b1.solid >= 2
        ? 'Encore ' + Math.max(0, 2 - b2.passed) + ' histoire' + (2 - b2.passed === 1 ? '' : 's') + ' B2 à 50 % pour atteindre B2.'
        : 'Encore ' + Math.max(0, 2 - b1.solid) + ' histoire' + (2 - b1.solid === 1 ? '' : 's') + ' B1 à 100 % pour consolider B1.';
    }
    if (a1.passed >= 3 && a2.passed >= 2 && b1.passed >= 2 && b2.passed >= 2) {
      code = 'B2';
      status = b2.solid >= 2 ? 'consolidé' : 'en cours';
      progress = Math.min(100, Math.round(b2.solid / 2 * 100));
      next = b2.solid >= 2
        ? 'B2 conversationnel consolidé. Continue avec des conversations longues et défends un point de vue à l’oral.'
        : 'Encore ' + Math.max(0, 2 - b2.solid) + ' histoire' + (2 - b2.solid === 1 ? '' : 's') + ' B2 à 100 % pour consolider B2.';
    }
    return { code: code, status: status, progress: progress, next: next, stats: stats };
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
    storyCefr: storyCefr,
    assessLevel: assessLevel,
    skills: SKILLS,
    cefrLevels: CEFR_LEVELS,
    lineJp: lineJp,
    plain: plain,
    glossary: GLOSSARY,
    readingOf: readingOf,
    scoreStory: scoreStory
  };
});
