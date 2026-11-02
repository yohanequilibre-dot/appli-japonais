/* Kotoba — 799 mots courants + 60 mots d’escalade.
   Mots courants : Kanjikana Core 1000, par Kanjikana, CC BY 4.0.
   https://kanjikana.com/en/words/core-1000
   Exemples japonais-français : Tatoeba, CC BY 2.0 FR.
   https://tatoeba.org
   Format : { jp, reading, fr, context, contextFr, hl }. */
(function () {
'use strict';
var data = [
  {
    "id": "essentiels-1",
    "name": "Les 1000 · 1 à 80",
    "emoji": "📚",
    "words": [
      {
        "jp": "うん",
        "reading": "うん",
        "fr": "ouais",
        "context": "「美味しい？」「うん、美味しいよ」",
        "contextFr": "« Tu aimes ? » « Oui, c’est délicieux. »",
        "hl": "うん"
      },
      {
        "jp": "ええ",
        "reading": "ええ",
        "fr": "ouais",
        "context": "「この店は初めて？」「ええ、初めてです」",
        "contextFr": "«Est-ce la première fois que vous venez dans ce magasin ?» «Oui, c'est ma première fois.»",
        "hl": "ええ"
      },
      {
        "jp": "いや",
        "reading": "いや",
        "fr": "non (familier)",
        "context": "いや、でも野球を見に行くのは好きだけどね。",
        "contextFr": "Non, mais j'aime aller au baseball.",
        "hl": "いや"
      },
      {
        "jp": "そう",
        "reading": "そう",
        "fr": "ainsi",
        "context": "私もそう思ってたよ、若い頃は。",
        "contextFr": "Je pensais aussi ça, quand j’étais jeune.",
        "hl": "そう"
      },
      {
        "jp": "なる",
        "reading": "なる",
        "fr": "devenir",
        "context": "いくつになっても子供は子供なのである。",
        "contextFr": "Peu importe l'âge, un enfant est un enfant.",
        "hl": "なっ"
      },
      {
        "jp": "言う",
        "reading": "いう",
        "fr": "dire",
        "context": "私は彼が何を言いたいのか分からなかった。",
        "contextFr": "Je n'ai pas pu comprendre ce qu'il désirait dire.",
        "hl": "言い"
      },
      {
        "jp": "おやすみなさい",
        "reading": "おやすみなさい",
        "fr": "bonne nuit",
        "context": "おやすみなさい、ママ。",
        "contextFr": "Bonne nuit, maman.",
        "hl": "おやすみなさい"
      },
      {
        "jp": "はじめまして",
        "reading": "はじめまして",
        "fr": "enchanté",
        "context": "はじめまして、ジョーンズ夫人。",
        "contextFr": "Ravi de vous rencontrer, Madame Jones.",
        "hl": "はじめまして"
      },
      {
        "jp": "じゃあね",
        "reading": "じゃあね",
        "fr": "salut",
        "context": "じゃあね、また明日！",
        "contextFr": "Salut, à demain !",
        "hl": "じゃあね"
      },
      {
        "jp": "またね",
        "reading": "またね",
        "fr": "à plus tard",
        "context": "またね、気をつけてね。",
        "contextFr": "À plus, fais attention à toi.",
        "hl": "またね"
      },
      {
        "jp": "失礼します",
        "reading": "しつれいします",
        "fr": "excusez-moi (en entrant ou en sortant)",
        "context": "お先に失礼します。",
        "contextFr": "Je vous laisse, excusez-moi.",
        "hl": "失礼します"
      },
      {
        "jp": "分かる",
        "reading": "わかる",
        "fr": "comprendre",
        "context": "彼の言ったことははっきり分からなかった。",
        "contextFr": "Je n'ai pas bien compris ce qu'il a dit.",
        "hl": "分から"
      },
      {
        "jp": "気",
        "reading": "き",
        "fr": "esprit",
        "context": "私はもうこれ以上待つ気がしない。",
        "contextFr": "Je ne suis pas d'humeur à attendre plus longtemps.",
        "hl": "気"
      },
      {
        "jp": "いい",
        "reading": "いい",
        "fr": "bon",
        "context": "「それはいい考えだ」と、私は心の中で思った。",
        "contextFr": "Je me suis dit : « C’est une bonne idée. »",
        "hl": "いい"
      },
      {
        "jp": "これ",
        "reading": "これ",
        "fr": "ceci",
        "context": "あなたはこれとあれとどちらを選びますか。",
        "contextFr": "Lequel choisis-tu, celui-ci ou celui-là ?",
        "hl": "これ"
      },
      {
        "jp": "それ",
        "reading": "それ",
        "fr": "cela",
        "context": "それが本当なら彼は事故を起こしていない。",
        "contextFr": "Si cela est vrai, il n'a pas causé l'accident.",
        "hl": "それ"
      },
      {
        "jp": "あれ",
        "reading": "あれ",
        "fr": "cela",
        "context": "この動物はあれよりも大きい。",
        "contextFr": "Cet animal est plus gros que celui-là.",
        "hl": "あれ"
      },
      {
        "jp": "思う",
        "reading": "おもう",
        "fr": "penser",
        "context": "すみません。そこは私の席だと思うのですが。",
        "contextFr": "Excusez-moi, je pense que c'est mon siège.",
        "hl": "思う"
      },
      {
        "jp": "もう",
        "reading": "もう",
        "fr": "déjà",
        "context": "あなたはもうそのニュースを聞きましたか。",
        "contextFr": "As-tu déjà entendu les informations ?",
        "hl": "もう"
      },
      {
        "jp": "人",
        "reading": "ひと",
        "fr": "personne",
        "context": "その自動車事故で死んだ人はほとんどいなかった。",
        "contextFr": "Il y a peu de personnes tuées dans cet accident.",
        "hl": "人"
      },
      {
        "jp": "どう",
        "reading": "どう",
        "fr": "comment",
        "context": "数学のテストはどうでしたか。",
        "contextFr": "Comment s'est passé l'examen de mathématiques ?",
        "hl": "どう"
      },
      {
        "jp": "日",
        "reading": "ひ",
        "fr": "jour",
        "context": "「５日前に彼女にあった」と彼は言った。",
        "contextFr": "Il a dit : \"Je l'ai vue il y a cinq jours\".",
        "hl": "日"
      },
      {
        "jp": "知る",
        "reading": "しる",
        "fr": "savoir",
        "context": "私は彼の住所を知っている。でもそれは秘密だ。",
        "contextFr": "Je connais son adresse mais c'est un secret.",
        "hl": "知っ"
      },
      {
        "jp": "聞く",
        "reading": "きく",
        "fr": "entendre",
        "context": "あなたは毎日家でラジオを聞いているのですか。",
        "contextFr": "Écoutes-tu tous les jours la radio à la maison ?",
        "hl": "聞い"
      },
      {
        "jp": "出る",
        "reading": "でる",
        "fr": "partir",
        "context": "私は今は外へ出たくない。",
        "contextFr": "Je n'ai pas envie de sortir maintenant.",
        "hl": "出"
      },
      {
        "jp": "どこ",
        "reading": "どこ",
        "fr": "où",
        "context": "彼がどこでカメラを買ったのか知っていますか。",
        "contextFr": "Sais-tu où il a acheté son appareil photo ?",
        "hl": "どこ"
      },
      {
        "jp": "いつ",
        "reading": "いつ",
        "fr": "quand",
        "context": "いつでも私の車を借りていいからね。",
        "contextFr": "Tu peux prendre ma voiture quand bon te semble.",
        "hl": "いつ"
      },
      {
        "jp": "なぜ",
        "reading": "なぜ",
        "fr": "pourquoi",
        "context": "なぜあなたは今日そんなに疲れているのですか。",
        "contextFr": "Pourquoi êtes-vous si fatiguée aujourd'hui ?",
        "hl": "なぜ"
      },
      {
        "jp": "どうして",
        "reading": "どうして",
        "fr": "pourquoi",
        "context": "どうして、パーティーに来なかったのですか。",
        "contextFr": "Pourquoi n'êtes-vous pas venues à la fête ?",
        "hl": "どうして"
      },
      {
        "jp": "どれ",
        "reading": "どれ",
        "fr": "lequel",
        "context": "あなたの鞄はどれですか。",
        "contextFr": "Lequel est ton sac ?",
        "hl": "どれ"
      },
      {
        "jp": "どの",
        "reading": "どの",
        "fr": "quel (+ nom)",
        "context": "あなたはどのスポーツが一番好きですか。",
        "contextFr": "Quel sport préfères-tu ?",
        "hl": "どの"
      },
      {
        "jp": "どちら",
        "reading": "どちら",
        "fr": "lequel",
        "context": "太陽と地球とではどちらが大きいですか。",
        "contextFr": "Lequel est plus grand, le Soleil ou la Terre ?",
        "hl": "どちら"
      },
      {
        "jp": "いくつ",
        "reading": "いくつ",
        "fr": "combien",
        "context": "あなたは月曜日にいくつ授業がありますか。",
        "contextFr": "Combien de cours avez-vous le lundi ?",
        "hl": "いくつ"
      },
      {
        "jp": "いくら",
        "reading": "いくら",
        "fr": "combien (prix)",
        "context": "すみません、このセーターいくらですか？",
        "contextFr": "Excusez-moi, combien coûte ce pull ?",
        "hl": "いくら"
      },
      {
        "jp": "どんな",
        "reading": "どんな",
        "fr": "quel genre de",
        "context": "あなたはどんなスポーツが一番好きですか。",
        "contextFr": "Quel sport préfères-tu ?",
        "hl": "どんな"
      },
      {
        "jp": "この",
        "reading": "この",
        "fr": "ce",
        "context": "彼女はこの前の水曜日からずっと休んでいる。",
        "contextFr": "Elle est en repos depuis mercredi dernier.",
        "hl": "この"
      },
      {
        "jp": "その",
        "reading": "その",
        "fr": "ce",
        "context": "彼が事実上はその会社の社長である。",
        "contextFr": "Il est en fait le président de la société.",
        "hl": "その"
      },
      {
        "jp": "あの",
        "reading": "あの",
        "fr": "ce",
        "context": "この本の方があの本よりも古い。",
        "contextFr": "Ce livre est plus vieux que celui-là.",
        "hl": "あの"
      },
      {
        "jp": "ここ",
        "reading": "ここ",
        "fr": "ici",
        "context": "ここから歩いて行くにはちょっと遠いですよ。",
        "contextFr": "C'est un peu loin pour y aller à pied d'ici.",
        "hl": "ここ"
      },
      {
        "jp": "そこ",
        "reading": "そこ",
        "fr": "là (près de vous)",
        "context": "飛行機が時間通りにそこに着くのは確かだ。",
        "contextFr": "C'est sûr que l'avion arrivera à l'heure.",
        "hl": "そこ"
      },
      {
        "jp": "あそこ",
        "reading": "あそこ",
        "fr": "là-bas",
        "context": "これ、あそこに置いてもいいですか？",
        "contextFr": "Ceci, si je le dépose là-bas cela convient-il ?",
        "hl": "あそこ"
      },
      {
        "jp": "こちら",
        "reading": "こちら",
        "fr": "par ici",
        "context": "こちらに英語を話す方はいらっしゃいますか？",
        "contextFr": "Y a t-il quelqu'un ici qui parle anglais ?",
        "hl": "こちら"
      },
      {
        "jp": "そちら",
        "reading": "そちら",
        "fr": "par là",
        "context": "そちらは暑いですか。",
        "contextFr": "Est-ce qu'il fait chaud là-bas ?",
        "hl": "そちら"
      },
      {
        "jp": "あちら",
        "reading": "あちら",
        "fr": "là-bas",
        "context": "トイレはあちらにあります。",
        "contextFr": "Les toilettes sont là-bas.",
        "hl": "あちら"
      },
      {
        "jp": "待つ",
        "reading": "まつ",
        "fr": "attendre",
        "context": "彼女はあなたのことを２時間待っていた。",
        "contextFr": "Elle vous a attendu pendant deux heures.",
        "hl": "待っ"
      },
      {
        "jp": "彼女",
        "reading": "かのじょ",
        "fr": "elle",
        "context": "私の彼女がいないのが本当に寂しい。",
        "contextFr": "Ma petite amie me manque vraiment.",
        "hl": "彼女"
      },
      {
        "jp": "僕",
        "reading": "ぼく",
        "fr": "je",
        "context": "彼はスポーツが好きではない。僕も好きではない。",
        "contextFr": "Il n'aime pas le sport. Moi non plus.",
        "hl": "僕"
      },
      {
        "jp": "死ぬ",
        "reading": "しぬ",
        "fr": "mourir",
        "context": "死ぬ前、彼はほとんど目が見えなかった。",
        "contextFr": "Avant de mourir, il était presque aveugle.",
        "hl": "死ぬ"
      },
      {
        "jp": "早い",
        "reading": "はやい",
        "fr": "tôt",
        "context": "もっと早く返事を出さないでいてすみません。",
        "contextFr": "Désolé de ne pas avoir répondu plus tôt.",
        "hl": "早く"
      },
      {
        "jp": "話す",
        "reading": "はなす",
        "fr": "parler",
        "context": "彼らがなぜ話すのをやめたのか知っていますか。",
        "contextFr": "Sais-tu pourquoi ils se sont arrêtés de parler ?",
        "hl": "話す"
      },
      {
        "jp": "四",
        "reading": "よん",
        "fr": "quatre",
        "context": "一、二、三、四、五、六、七、八、九、十。",
        "contextFr": "Un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.",
        "hl": "四"
      },
      {
        "jp": "五",
        "reading": "ご",
        "fr": "cinq",
        "context": "私はこのコートを五年以上着ている。",
        "contextFr": "J'ai porté ce pardessus pendant plus de cinq ans.",
        "hl": "五"
      },
      {
        "jp": "六",
        "reading": "ろく",
        "fr": "six",
        "context": "十から四を引けば六が残る。",
        "contextFr": "Si tu soustrais quatre de dix, il te restera six.",
        "hl": "六"
      },
      {
        "jp": "七",
        "reading": "しち",
        "fr": "sept",
        "context": "彼女には七人もの息子がいる。",
        "contextFr": "Elle n'a pas moins de sept fils.",
        "hl": "七"
      },
      {
        "jp": "八",
        "reading": "はち",
        "fr": "huit",
        "context": "彼女は八歳のときにダンスを始めた。",
        "contextFr": "Elle a commencé la danse à l'âge de huit ans.",
        "hl": "八"
      },
      {
        "jp": "九",
        "reading": "きゅう",
        "fr": "neuf",
        "context": "学校は九時から始まります。",
        "contextFr": "L'école débute à neuf heures.",
        "hl": "九"
      },
      {
        "jp": "千",
        "reading": "せん",
        "fr": "mille",
        "context": "このホールには人が二千人入れる。",
        "contextFr": "Cette salle peut accueillir deux mille personnes.",
        "hl": "千"
      },
      {
        "jp": "万",
        "reading": "まん",
        "fr": "dix mille",
        "context": "この時計は一万円だった。",
        "contextFr": "Cette montre m'a coûté dix mille yen.",
        "hl": "万"
      },
      {
        "jp": "持つ",
        "reading": "もつ",
        "fr": "avoir",
        "context": "彼女はたくさんの歴史の本を持っています。",
        "contextFr": "Elle possède de nombreux livres sur l’histoire.",
        "hl": "持っ"
      },
      {
        "jp": "帰る",
        "reading": "かえる",
        "fr": "rentrer",
        "context": "彼女は家に遅く帰ったことを父親に謝った。",
        "contextFr": "Elle s'excusa auprès de son père pour être rentrée si tard.",
        "hl": "帰っ"
      },
      {
        "jp": "彼",
        "reading": "かれ",
        "fr": "il",
        "context": "彼の住所を知っていたら、手紙を書いたのだが。",
        "contextFr": "Si j'avais connu son adresse, je lui aurais écrit.",
        "hl": "彼"
      },
      {
        "jp": "前",
        "reading": "まえ",
        "fr": "devant",
        "context": "寝る前に猫を外に出すのを忘れないでね。",
        "contextFr": "N'oublie pas de sortir le chat avant de sortir.",
        "hl": "前"
      },
      {
        "jp": "会う",
        "reading": "あう",
        "fr": "rencontrer",
        "context": "次の日曜日に君に会うのを楽しみにしています。",
        "contextFr": "J'ai hâte de te revoir dimanche prochain.",
        "hl": "会う"
      },
      {
        "jp": "違う",
        "reading": "ちがう",
        "fr": "être différent",
        "context": "私の意見はあなたの意見とは少し違う。",
        "contextFr": "Mon opinion est un peu différente de la tienne.",
        "hl": "違う"
      },
      {
        "jp": "同じ",
        "reading": "おなじ",
        "fr": "même",
        "context": "あなたが持っているのと同じカメラを買った。",
        "contextFr": "J'ai acheté la même caméra que la tienne.",
        "hl": "同じ"
      },
      {
        "jp": "使う",
        "reading": "つかう",
        "fr": "utiliser",
        "context": "この歯ブラシを使っているのは母ではない。",
        "contextFr": "Ce n'est pas ma mère qui utilise cette brosse à dents.",
        "hl": "使っ"
      },
      {
        "jp": "作る",
        "reading": "つくる",
        "fr": "faire",
        "context": "この場所を野菜を作るのに使っていいですか。",
        "contextFr": "Puis-je utiliser cet endroit pour faire pousser des légumes ?",
        "hl": "作る"
      },
      {
        "jp": "次",
        "reading": "つぎ",
        "fr": "suivant",
        "context": "私の妹は次の夏には１３歳になる。",
        "contextFr": "Ma sœur aura treize ans l'été prochain.",
        "hl": "次"
      },
      {
        "jp": "話",
        "reading": "はなし",
        "fr": "conversation",
        "context": "彼の話で僕は昔のことを思い出します。",
        "contextFr": "Son histoire me remît à l'esprit mes jours passés.",
        "hl": "話"
      },
      {
        "jp": "入れる",
        "reading": "いれる",
        "fr": "mettre dedans",
        "context": "皆さんは自由に図書館に入れる。",
        "contextFr": "L'entrée de la bibliothèque est libre.",
        "hl": "入れる"
      },
      {
        "jp": "入る",
        "reading": "はいる",
        "fr": "entrer",
        "context": "男の人がその部屋に入るのを見ました。",
        "contextFr": "J'ai vu un homme entrer dans la chambre.",
        "hl": "入る"
      },
      {
        "jp": "春",
        "reading": "はる",
        "fr": "printemps",
        "context": "春が好きですか、秋が好きですか。",
        "contextFr": "Aimez-vous le printemps ou l'automne ?",
        "hl": "春"
      },
      {
        "jp": "夏",
        "reading": "なつ",
        "fr": "été",
        "context": "あなたが今年の夏何をしたか知りたい。",
        "contextFr": "Je veux savoir ce que tu as fait cet été.",
        "hl": "夏"
      },
      {
        "jp": "秋",
        "reading": "あき",
        "fr": "automne",
        "context": "ビルは去年の秋に私に会いに来た。",
        "contextFr": "Bill est venu me voir l'automne dernier.",
        "hl": "秋"
      },
      {
        "jp": "冬",
        "reading": "ふゆ",
        "fr": "hiver",
        "context": "冬は１年のうちで一番寒い季節です。",
        "contextFr": "L'hiver est la saison la plus froide de l'année.",
        "hl": "冬"
      },
      {
        "jp": "自分",
        "reading": "じぶん",
        "fr": "soi-même",
        "context": "私はこの服を自分で作りました。",
        "contextFr": "J'ai fabriqué ce vêtement moi-même.",
        "hl": "自分"
      },
      {
        "jp": "戻る",
        "reading": "もどる",
        "fr": "revenir",
        "context": "彼はまだ山から戻っていない。",
        "contextFr": "Il n'est pas revenu de la montagne.",
        "hl": "戻っ"
      },
      {
        "jp": "呼ぶ",
        "reading": "よぶ",
        "fr": "appeler",
        "context": "駅に着くとすぐ、彼はタクシーを呼んだ。",
        "contextFr": "À son arrivée à la gare, il appela un taxi.",
        "hl": "呼ん"
      },
      {
        "jp": "顔",
        "reading": "かお",
        "fr": "visage",
        "context": "彼女は私の顔を見て泣き始めた。",
        "contextFr": "À la vue de mon visage, elle commença à pleurer.",
        "hl": "顔"
      },
      {
        "jp": "取る",
        "reading": "とる",
        "fr": "prendre",
        "context": "一日休みを取ってもいいですか。",
        "contextFr": "Est-ce que je peux prendre un jour de congé ?",
        "hl": "取っ"
      }
    ]
  },
  {
    "id": "essentiels-2",
    "name": "Les 1000 · 81 à 160",
    "emoji": "🔑",
    "words": [
      {
        "jp": "少し",
        "reading": "すこし",
        "fr": "un peu",
        "context": "少しの間、この馬に乗ってもいいですか。",
        "contextFr": "Est-ce que je peux chevaucher ce cheval un moment ?",
        "hl": "少し"
      },
      {
        "jp": "教える",
        "reading": "おしえる",
        "fr": "enseigner",
        "context": "彼はここで教えた先生の中で一番若い先生です。",
        "contextFr": "C'est le plus jeune enseignant qui ait jamais enseigné ici.",
        "hl": "教え"
      },
      {
        "jp": "娘",
        "reading": "むすめ",
        "fr": "fille (enfant)",
        "context": "うちの娘も結婚を考える歳になった。",
        "contextFr": "Ma fille a atteint l'âge de penser au mariage.",
        "hl": "娘"
      },
      {
        "jp": "終わる",
        "reading": "おわる",
        "fr": "finir",
        "context": "この調子じゃ今週中に終わりそうにないね。",
        "contextFr": "À ce rythme, on risque pas de finir cette semaine.",
        "hl": "終わり"
      },
      {
        "jp": "見せる",
        "reading": "みせる",
        "fr": "montrer",
        "context": "彼は私にたくさんの美しい写真を見せてくれました。",
        "contextFr": "Il m'a montré beaucoup de belles photos.",
        "hl": "見せ"
      },
      {
        "jp": "体",
        "reading": "からだ",
        "fr": "corps",
        "context": "みんな台所で体を洗いました。",
        "contextFr": "Tous lavaient leur corps dans la cuisine.",
        "hl": "体"
      },
      {
        "jp": "全部",
        "reading": "ぜんぶ",
        "fr": "tout",
        "context": "学生は全部で何人ですか？",
        "contextFr": "Quel est le nombre total d'étudiants ?",
        "hl": "全部"
      },
      {
        "jp": "息子",
        "reading": "むすこ",
        "fr": "fils",
        "context": "彼女はまだ息子が生きていると信じている。",
        "contextFr": "Elle croit que son fils est encore vivant.",
        "hl": "息子"
      },
      {
        "jp": "始める",
        "reading": "はじめる",
        "fr": "commencer",
        "context": "もうあの本を読み始めましたか。",
        "contextFr": "Avez-vous déjà commencé à lire ce livre ?",
        "hl": "始め"
      },
      {
        "jp": "結婚",
        "reading": "けっこん",
        "fr": "mariage",
        "context": "彼女は結婚まで待ちたい。",
        "contextFr": "Elle souhaite attendre jusqu'au mariage.",
        "hl": "結婚"
      },
      {
        "jp": "見つける",
        "reading": "みつける",
        "fr": "trouver",
        "context": "あなたは他の誰も見ていなかった場所で私を見つけた。",
        "contextFr": "Tu m'as trouvée où personne ne cherchait.",
        "hl": "見つけ"
      },
      {
        "jp": "覚える",
        "reading": "おぼえる",
        "fr": "se souvenir",
        "context": "彼女はどんな人だったか覚えていますか。",
        "contextFr": "Te rappelles-tu à quoi elle ressemblait ?",
        "hl": "覚え"
      },
      {
        "jp": "言葉",
        "reading": "ことば",
        "fr": "mot",
        "context": "分からない言葉がたくさんある。",
        "contextFr": "Il y a beaucoup de mots que je ne comprends pas.",
        "hl": "言葉"
      },
      {
        "jp": "乗る",
        "reading": "のる",
        "fr": "monter (dans)",
        "context": "一人で地下鉄に乗るのは危ないですか。",
        "contextFr": "Est-il dangereux de prendre le métro tout seul ?",
        "hl": "乗る"
      },
      {
        "jp": "気持ち",
        "reading": "きもち",
        "fr": "sentiment",
        "context": "こんな気持ちにさせてくれる人は初めてだよ。",
        "contextFr": "Je ne me suis jamais senti comme ça avant de te rencontrer.",
        "hl": "気持ち"
      },
      {
        "jp": "みんな",
        "reading": "みんな",
        "fr": "tout le monde",
        "context": "その少年以外はみんな眠っていた。",
        "contextFr": "Tout le monde était endormi sauf le garçon.",
        "hl": "みんな"
      },
      {
        "jp": "数",
        "reading": "かず",
        "fr": "nombre",
        "context": "私の学生は数が少ない。全部でたった５人だ。",
        "contextFr": "Mes étudiants sont en petit nombre, pas plus de cinq en tout.",
        "hl": "数"
      },
      {
        "jp": "一番",
        "reading": "いちばん",
        "fr": "numéro un",
        "context": "秋はスポーツに一番いい季節だ。",
        "contextFr": "L'automne est la meilleure saison pour faire du sport.",
        "hl": "一番"
      },
      {
        "jp": "送る",
        "reading": "おくる",
        "fr": "envoyer",
        "context": "彼は娘に果物と野菜を送った。",
        "contextFr": "Il envoya des fruits et des légumes à sa fille.",
        "hl": "送っ"
      },
      {
        "jp": "探す",
        "reading": "さがす",
        "fr": "chercher",
        "context": "その少年は無くした鍵を探していた。",
        "contextFr": "Le garçon cherchait la clé qu'il avait perdue.",
        "hl": "探し"
      },
      {
        "jp": "国",
        "reading": "くに",
        "fr": "pays",
        "context": "あなたの国では雪がたくさん降りますか。",
        "contextFr": "Y a-t-il beaucoup de neige dans votre pays ?",
        "hl": "国"
      },
      {
        "jp": "多い",
        "reading": "おおい",
        "fr": "nombreux",
        "context": "最近は車で旅行する人が多い。",
        "contextFr": "De nos jours beaucoup de personnes voyagent en voiture.",
        "hl": "多い"
      },
      {
        "jp": "座る",
        "reading": "すわる",
        "fr": "s'asseoir",
        "context": "そこに入っても座っても結構です。",
        "contextFr": "Tu peux entrer et t'asseoir.",
        "hl": "座っ"
      },
      {
        "jp": "読む",
        "reading": "よむ",
        "fr": "lire",
        "context": "私はよく本を読んで夜遅くまで起きている。",
        "contextFr": "Je m'assois souvent tard le soir pour lire.",
        "hl": "読ん"
      },
      {
        "jp": "落ちる",
        "reading": "おちる",
        "fr": "tomber",
        "context": "彼は試験に落ちると思っていました。",
        "contextFr": "Je m'attendais à ce qu'il échoue à l'examen.",
        "hl": "落ちる"
      },
      {
        "jp": "立つ",
        "reading": "たつ",
        "fr": "se tenir debout",
        "context": "橋の上に立っている人を知っていますか。",
        "contextFr": "Connais-tu l'homme qui se tient debout sur le pont ?",
        "hl": "立っ"
      },
      {
        "jp": "質問",
        "reading": "しつもん",
        "fr": "question",
        "context": "私はあなたの質問に答えることができない。",
        "contextFr": "Je ne peux pas répondre à votre question.",
        "hl": "質問"
      },
      {
        "jp": "酒",
        "reading": "さけ",
        "fr": "alcool",
        "context": "私は医者に酒を止められている。",
        "contextFr": "Le docteur m'interdit de m'approcher de l'alcool.",
        "hl": "酒"
      },
      {
        "jp": "長い",
        "reading": "ながい",
        "fr": "long",
        "context": "彼は彼女に長い手紙を書いたが、出さなかった。",
        "contextFr": "Il lui a écrit une longue lettre qu'il n'a pas envoyée.",
        "hl": "長い"
      },
      {
        "jp": "遅い",
        "reading": "おそい",
        "fr": "lent",
        "context": "そんなに遅くまで起きていない方がいいよ。",
        "contextFr": "Tu ne devrais pas veiller si tard.",
        "hl": "遅く"
      },
      {
        "jp": "売る",
        "reading": "うる",
        "fr": "vendre",
        "context": "５００円でその本を私に売って下さい。",
        "contextFr": "Pourriez-vous me vendre ce livre à 500 yen, s'il vous plaît ?",
        "hl": "売っ"
      },
      {
        "jp": "楽しむ",
        "reading": "たのしむ",
        "fr": "apprécier",
        "context": "私は昨夜サッカーを見て楽しんだ。",
        "contextFr": "J'ai apprécié regarder du soccer la nuit dernière.",
        "hl": "楽しん"
      },
      {
        "jp": "木",
        "reading": "き",
        "fr": "arbre",
        "context": "それは私が今まで見たうちで一番高い木です。",
        "contextFr": "C'est le plus grand arbre que j'ai jamais vu.",
        "hl": "木"
      },
      {
        "jp": "難しい",
        "reading": "むずかしい",
        "fr": "difficile",
        "context": "それは解決するのが難しい問題だった。",
        "contextFr": "C'était un problème difficile à résoudre.",
        "hl": "難しい"
      },
      {
        "jp": "笑う",
        "reading": "わらう",
        "fr": "rire",
        "context": "笑うことのできるのは人間だけであります。",
        "contextFr": "Seuls les êtres humains peuvent rire.",
        "hl": "笑う"
      },
      {
        "jp": "走る",
        "reading": "はしる",
        "fr": "courir",
        "context": "彼は１日で２００キロ走ると言って、そうした。",
        "contextFr": "Il a dit qu'il pouvait courir 200 kilomètres en une journée et il l'a fait.",
        "hl": "走る"
      },
      {
        "jp": "払う",
        "reading": "はらう",
        "fr": "payer",
        "context": "これを買って、ＶＩＳＡカードで払いたいんですけど。",
        "contextFr": "J'aimerais payer pour cela avec ma carte Visa.",
        "hl": "払い"
      },
      {
        "jp": "いる",
        "reading": "いる",
        "fr": "être",
        "context": "彼がベッドに横になっているのを見つけた。",
        "contextFr": "Je l'ai trouvé allongé sur le lit.",
        "hl": "いる"
      },
      {
        "jp": "着る",
        "reading": "きる",
        "fr": "porter (un vêtement)",
        "context": "彼女は青い服を着ています。",
        "contextFr": "Elle porte une robe bleue.",
        "hl": "着"
      },
      {
        "jp": "美しい",
        "reading": "うつくしい",
        "fr": "beau",
        "context": "空から見ればその橋はもっと美しく見える。",
        "contextFr": "Ce pont est encore plus beau vu du ciel.",
        "hl": "美しく"
      },
      {
        "jp": "住む",
        "reading": "すむ",
        "fr": "habiter",
        "context": "来月でここに１０年間住んだことになります。",
        "contextFr": "Cela fera dix ans que j'habite ici le mois prochain.",
        "hl": "住ん"
      },
      {
        "jp": "あげる",
        "reading": "あげる",
        "fr": "donner (à quelqu'un d'autre)",
        "context": "君にお金をあげるから俺が必要なのか。",
        "contextFr": "As-tu besoin que je te donne de l'argent ?",
        "hl": "あげる"
      },
      {
        "jp": "上げる",
        "reading": "あげる",
        "fr": "lever",
        "context": "彼らは給料を上げることを要求した。",
        "contextFr": "Ils ont réclamé une augmentation de salaire.",
        "hl": "上げる"
      },
      {
        "jp": "親",
        "reading": "おや",
        "fr": "parent",
        "context": "彼女はいつも親と口論していました。",
        "contextFr": "Elle se disputait toujours avec ses parents.",
        "hl": "親"
      },
      {
        "jp": "大好き",
        "reading": "だいすき",
        "fr": "adorer",
        "context": "その少年はその犬が大好きになった。",
        "contextFr": "Le garçon s'est beaucoup attaché à ce chien.",
        "hl": "大好き"
      },
      {
        "jp": "大学",
        "reading": "だいがく",
        "fr": "université",
        "context": "あの人は医者でありまた大学の先生でもある。",
        "contextFr": "Il est docteur et professeur d'université.",
        "hl": "大学"
      },
      {
        "jp": "女の子",
        "reading": "おんなのこ",
        "fr": "fille",
        "context": "私が君に話した女の子はここに住んでいる。",
        "contextFr": "La fille dont je t'ai parlé habite ici.",
        "hl": "女の子"
      },
      {
        "jp": "若い",
        "reading": "わかい",
        "fr": "jeune",
        "context": "彼女は、２人のうちで若い方です。",
        "contextFr": "Des deux filles, elle est la plus jeune.",
        "hl": "若い"
      },
      {
        "jp": "腕",
        "reading": "うで",
        "fr": "bras",
        "context": "小さい頃、腕を折ったことがあります。",
        "contextFr": "Je me suis cassé le bras quand j'étais petit.",
        "hl": "腕"
      },
      {
        "jp": "歌う",
        "reading": "うたう",
        "fr": "chanter",
        "context": "私は彼女が自分の部屋で歌っているのを聞いた。",
        "contextFr": "Je l'ai entendue chanter dans sa chambre.",
        "hl": "歌っ"
      },
      {
        "jp": "遊ぶ",
        "reading": "あそぶ",
        "fr": "jouer",
        "context": "子供が通りで遊ぶのはとても危険だ。",
        "contextFr": "Il est très dangereux pour les enfants de jouer dans la rue.",
        "hl": "遊ぶ"
      },
      {
        "jp": "色",
        "reading": "いろ",
        "fr": "couleur",
        "context": "彼は青が一番美しい色だと思っている。",
        "contextFr": "Il pense que le bleu est la plus belle couleur.",
        "hl": "色"
      },
      {
        "jp": "胸",
        "reading": "むね",
        "fr": "poitrine",
        "context": "胸が痛いです。",
        "contextFr": "J’ai mal à la poitrine.",
        "hl": "胸"
      },
      {
        "jp": "消す",
        "reading": "けす",
        "fr": "effacer",
        "context": "寝る前にテレビを消すのを忘れていた。",
        "contextFr": "J'ai oublié d'éteindre la télé avant de dormir.",
        "hl": "消す"
      },
      {
        "jp": "勉強",
        "reading": "べんきょう",
        "fr": "étude",
        "context": "彼は勉強だけでなく運動も好きだ。",
        "contextFr": "Il aime les études, mais aussi le sport.",
        "hl": "勉強"
      },
      {
        "jp": "病気",
        "reading": "びょうき",
        "fr": "maladie",
        "context": "祖父は８０歳のときに病気で亡くなりました。",
        "contextFr": "Mon grand-père est mort d'une maladie à 80 ans.",
        "hl": "病気"
      },
      {
        "jp": "起こす",
        "reading": "おこす",
        "fr": "réveiller (quelqu'un)",
        "context": "何かあったら起こしてね。",
        "contextFr": "Réveille-moi s'il se passe quelque chose.",
        "hl": "起こし"
      },
      {
        "jp": "首",
        "reading": "くび",
        "fr": "cou",
        "context": "その長い首は馬に似ている。",
        "contextFr": "Son long cou ressemble à celui d'un cheval.",
        "hl": "首"
      },
      {
        "jp": "起こる",
        "reading": "おこる",
        "fr": "se produire",
        "context": "ほとんどの事故がすぐ近くで起こっている。",
        "contextFr": "La plupart des accidents ont lieu près de chez soi.",
        "hl": "起こっ"
      },
      {
        "jp": "耳",
        "reading": "みみ",
        "fr": "oreille",
        "context": "彼は自分の耳を信じることができなかった。",
        "contextFr": "Il ne pouvait pas en croire ses oreilles.",
        "hl": "耳"
      },
      {
        "jp": "近い",
        "reading": "ちかい",
        "fr": "proche",
        "context": "近いうちに彼の絵を見たいと思う。",
        "contextFr": "J'espère voir son film prochainement.",
        "hl": "近い"
      },
      {
        "jp": "重い",
        "reading": "おもい",
        "fr": "lourd",
        "context": "手伝いましょう。あなたの鞄とても重そうです。",
        "contextFr": "Laissez-moi vous aider. Votre sac semble très lourd.",
        "hl": "重"
      },
      {
        "jp": "右",
        "reading": "みぎ",
        "fr": "droite",
        "context": "彼は机を右に動かした。",
        "contextFr": "Il déplaça le bureau à droite.",
        "hl": "右"
      },
      {
        "jp": "円",
        "reading": "えん",
        "fr": "yen",
        "context": "私はこの帽子を２０００円で買った。",
        "contextFr": "J'ai acheté ce chapeau pour 2000 yen.",
        "hl": "円"
      },
      {
        "jp": "遠い",
        "reading": "とおい",
        "fr": "loin",
        "context": "レストランは駅から遠かったです。",
        "contextFr": "Le restaurant était loin de la gare.",
        "hl": "遠かっ"
      },
      {
        "jp": "少ない",
        "reading": "すくない",
        "fr": "peu nombreux",
        "context": "彼は言葉少ないが、必ず約束を守る人です。",
        "contextFr": "C'est un homme qui parle peu, mais qui tient toujours ses promesses.",
        "hl": "少ない"
      },
      {
        "jp": "私たち",
        "reading": "わたしたち",
        "fr": "nous",
        "context": "私たちは駅で待っています。",
        "contextFr": "Nous attendons à la gare.",
        "hl": "私たち"
      },
      {
        "jp": "一緒に",
        "reading": "いっしょに",
        "fr": "ensemble",
        "context": "一緒に昼ご飯を食べましょう。",
        "contextFr": "Déjeunons ensemble.",
        "hl": "一緒に"
      },
      {
        "jp": "忘れる",
        "reading": "わすれる",
        "fr": "oublier",
        "context": "彼はここであなたに会うことを忘れている。",
        "contextFr": "Il a oublié qu'il devait te voir ici.",
        "hl": "忘れ"
      },
      {
        "jp": "もっと",
        "reading": "もっと",
        "fr": "plus",
        "context": "人生は甘くないけど僕はもっとつよい。",
        "contextFr": "La vie est dure, mais je suis encore plus dur.",
        "hl": "もっと"
      },
      {
        "jp": "熱い",
        "reading": "あつい",
        "fr": "chaud (au toucher)",
        "context": "私は冷たいものよりも熱いお茶が好きです。",
        "contextFr": "Je préfère le thé chaud que froid.",
        "hl": "熱い"
      },
      {
        "jp": "今年",
        "reading": "ことし",
        "fr": "cette année",
        "context": "今年あの学校へ入学できた生徒は何人ですか。",
        "contextFr": "Combien d'étudiants ont été admis à l'école cette année ?",
        "hl": "今年"
      },
      {
        "jp": "飛行機",
        "reading": "ひこうき",
        "fr": "avion",
        "context": "あなたは船で旅行をしますか、飛行機でしますか。",
        "contextFr": "Voyagez-vous par bateau ou par avion ?",
        "hl": "飛行機"
      },
      {
        "jp": "どうぞ",
        "reading": "どうぞ",
        "fr": "je vous en prie",
        "context": "「このペンを借りてもいいですか」「ええ、どうぞ」",
        "contextFr": "« Pourrais-je emprunter ce stylo ? » « Bien sûr, vas-y. »",
        "hl": "どうぞ"
      },
      {
        "jp": "午後",
        "reading": "ごご",
        "fr": "après-midi",
        "context": "父は今日の午後映画に行ったらどうかと言った。",
        "contextFr": "Mon père a suggéré d'aller au cinéma cet après-midi.",
        "hl": "午後"
      },
      {
        "jp": "軽い",
        "reading": "かるい",
        "fr": "léger (poids)",
        "context": "私は軽い靴が好きだ。",
        "contextFr": "J'aime les chaussures légères.",
        "hl": "軽い"
      },
      {
        "jp": "書く",
        "reading": "かく",
        "fr": "écrire",
        "context": "私は午前中ずっと手紙を書いていました。",
        "contextFr": "J'ai passé la matinée à écrire des lettres.",
        "hl": "書い"
      },
      {
        "jp": "ところ",
        "reading": "ところ",
        "fr": "endroit",
        "context": "いいね、どこかいいところを知っている？",
        "contextFr": "Bien sûr. Tu connais un endroit sympa ?",
        "hl": "ところ"
      },
      {
        "jp": "別",
        "reading": "べつ",
        "fr": "différent",
        "context": "言うこととすることとは別問題だ。",
        "contextFr": "Dire et faire sont deux choses différentes.",
        "hl": "別"
      },
      {
        "jp": "広い",
        "reading": "ひろい",
        "fr": "large",
        "context": "この通りは広いが、あまり長くない。",
        "contextFr": "Cette rue est large, mais pas très longue.",
        "hl": "広い"
      }
    ]
  },
  {
    "id": "essentiels-3",
    "name": "Les 1000 · 161 à 240",
    "emoji": "🗣️",
    "words": [
      {
        "jp": "開ける",
        "reading": "あける",
        "fr": "ouvrir",
        "context": "彼はその箱を開けることができなかった。",
        "contextFr": "Il n'a pas été capable d'ouvrir la boîte.",
        "hl": "開ける"
      },
      {
        "jp": "男の子",
        "reading": "おとこのこ",
        "fr": "garçon",
        "context": "あなたのクラスに男の子は何人いますか。",
        "contextFr": "Combien y a-t-il de garçons dans votre classe ?",
        "hl": "男の子"
      },
      {
        "jp": "置く",
        "reading": "おく",
        "fr": "mettre",
        "context": "どこに自転車を置いたらいいですか。",
        "contextFr": "Où devrais-je poser le vélo ?",
        "hl": "置い"
      },
      {
        "jp": "低い",
        "reading": "ひくい",
        "fr": "bas",
        "context": "この机は私にはちょっと低い。",
        "contextFr": "Ce bureau est un peu bas pour moi.",
        "hl": "低い"
      },
      {
        "jp": "歩く",
        "reading": "あるく",
        "fr": "marcher",
        "context": "もし車が故障したら、歩きますよ。",
        "contextFr": "Si la voiture tombe en panne, nous marcherons.",
        "hl": "歩き"
      },
      {
        "jp": "続く",
        "reading": "つづく",
        "fr": "continuer",
        "context": "この寒い天気はいつまで続くのだろうか。",
        "contextFr": "Combien de temps va durer ce froid ?",
        "hl": "続く"
      },
      {
        "jp": "飛ぶ",
        "reading": "とぶ",
        "fr": "voler (dans les airs)",
        "context": "鳥は南へ飛んで行った。",
        "contextFr": "L'oiseau est parti voler vers le sud.",
        "hl": "飛ん"
      },
      {
        "jp": "近く",
        "reading": "ちかく",
        "fr": "près",
        "context": "こんなに駅に近くに住んでいると便利ですよ。",
        "contextFr": "C'est pratique de vivre si près de la gare.",
        "hl": "近く"
      },
      {
        "jp": "引く",
        "reading": "ひく",
        "fr": "tirer",
        "context": "子供はただ注意を引きたくて泣くことが多い。",
        "contextFr": "Les enfants pleurent souvent juste pour attirer l'attention.",
        "hl": "引き"
      },
      {
        "jp": "閉める",
        "reading": "しめる",
        "fr": "fermer (quelque chose)",
        "context": "ドアは開けるか閉めるかしなければならない。",
        "contextFr": "Il faut qu'une porte soit ouverte ou fermée.",
        "hl": "閉める"
      },
      {
        "jp": "去年",
        "reading": "きょねん",
        "fr": "l'année dernière",
        "context": "あなたは去年どこに住んでいましたか。",
        "contextFr": "Où habitiez-vous l'année dernière ?",
        "hl": "去年"
      },
      {
        "jp": "短い",
        "reading": "みじかい",
        "fr": "court",
        "context": "彼女は髪の毛を短く切ってもらいました。",
        "contextFr": "Elle s'est fait couper les cheveux court.",
        "hl": "短く"
      },
      {
        "jp": "狭い",
        "reading": "せまい",
        "fr": "étroit",
        "context": "彼らは狭い道を歩いていった。",
        "contextFr": "Ils ont marché le long d'un chemin étroit.",
        "hl": "狭い"
      },
      {
        "jp": "午前",
        "reading": "ごぜん",
        "fr": "matin",
        "context": "彼女は午前中に英語を勉強しました。",
        "contextFr": "Elle étudiait l'anglais le matin.",
        "hl": "午前"
      },
      {
        "jp": "今月",
        "reading": "こんげつ",
        "fr": "ce mois-ci",
        "context": "今月いっぱいここにいます。",
        "contextFr": "Je serai là tout le mois.",
        "hl": "今月"
      },
      {
        "jp": "できる",
        "reading": "できる",
        "fr": "pouvoir",
        "context": "私はその質問に答えることができた。",
        "contextFr": "J'ai été capable de répondre à la question.",
        "hl": "でき"
      },
      {
        "jp": "肩",
        "reading": "かた",
        "fr": "épaule",
        "context": "父は私の肩に手を置いた。",
        "contextFr": "Mon père a posé sa main sur mon épaule.",
        "hl": "肩"
      },
      {
        "jp": "弱い",
        "reading": "よわい",
        "fr": "faible",
        "context": "彼は弱いものいじめが好きなのです。",
        "contextFr": "Il aime brutaliser les faibles.",
        "hl": "弱い"
      },
      {
        "jp": "浴びる",
        "reading": "あびる",
        "fr": "se baigner dans",
        "context": "丘は陽光をいっぱいに浴びていた。",
        "contextFr": "Les collines sont baignées de soleil.",
        "hl": "浴び"
      },
      {
        "jp": "後",
        "reading": "あと",
        "fr": "après",
        "context": "大学を卒業した後何をしますか。",
        "contextFr": "Que vas-tu faire après ton diplôme ?",
        "hl": "後"
      },
      {
        "jp": "すぐ",
        "reading": "すぐ",
        "fr": "tout de suite",
        "context": "すぐ返事をしてもらいたいと思っています。",
        "contextFr": "J'espère que vous me répondrez bientôt.",
        "hl": "すぐ"
      },
      {
        "jp": "まだ",
        "reading": "まだ",
        "fr": "encore",
        "context": "僕はまだその小説の最後のページを読んでいない。",
        "contextFr": "Je n'ai pas encore lu la dernière page de ce roman.",
        "hl": "まだ"
      },
      {
        "jp": "いつも",
        "reading": "いつも",
        "fr": "toujours",
        "context": "彼は会うといつも「こんにちは」と私に言う。",
        "contextFr": "Il me dit toujours \"Bonjour\" quand je le vois.",
        "hl": "いつも"
      },
      {
        "jp": "もらう",
        "reading": "もらう",
        "fr": "recevoir",
        "context": "あなたのために、この仕事をしてもらいます。",
        "contextFr": "Pour toi, je vais accepter ce travail.",
        "hl": "もらい"
      },
      {
        "jp": "とき",
        "reading": "とき",
        "fr": "temps",
        "context": "私が話をしているときは邪魔しないでくれ。",
        "contextFr": "Ne m'interromps pas quand je parle.",
        "hl": "とき"
      },
      {
        "jp": "切る",
        "reading": "きる",
        "fr": "couper",
        "context": "彼女は髪を切ってもらう必要がある。",
        "contextFr": "Elle a besoin de se faire couper les cheveux.",
        "hl": "切っ"
      },
      {
        "jp": "服",
        "reading": "ふく",
        "fr": "vêtements",
        "context": "あなたはあの服が彼女に似合うと思いますか。",
        "contextFr": "Est-ce que vous croyez que ces vêtements lui vont ?",
        "hl": "服"
      },
      {
        "jp": "ため",
        "reading": "ため",
        "fr": "pour",
        "context": "彼が休んだのは病気のためだ。",
        "contextFr": "Son absence a été causée par une maladie.",
        "hl": "ため"
      },
      {
        "jp": "男",
        "reading": "おとこ",
        "fr": "homme",
        "context": "私はその男がお金を盗んでいるところを見つけた。",
        "contextFr": "J'ai pris l'homme en train de voler l'argent.",
        "hl": "男"
      },
      {
        "jp": "後ろ",
        "reading": "うしろ",
        "fr": "derrière",
        "context": "病院の後ろにあるあの建物はなんですか。",
        "contextFr": "Quel est cet immeuble derrière l'hôpital ?",
        "hl": "後ろ"
      },
      {
        "jp": "昼",
        "reading": "ひる",
        "fr": "midi",
        "context": "昼に彼と会う約束がある。",
        "contextFr": "J'ai un rendez-vous avec lui à midi.",
        "hl": "昼"
      },
      {
        "jp": "悪い",
        "reading": "わるい",
        "fr": "mauvais",
        "context": "誰にでも良いところと悪いところがある。",
        "contextFr": "Tout le monde a des bons et des mauvais côtés.",
        "hl": "悪い"
      },
      {
        "jp": "考える",
        "reading": "かんがえる",
        "fr": "penser",
        "context": "私はその問題を考えているところだ。",
        "contextFr": "Je suis en train de penser à cette affaire.",
        "hl": "考え"
      },
      {
        "jp": "君",
        "reading": "きみ",
        "fr": "tu",
        "context": "君のためにそれをしたのだから、怒らないでくれ。",
        "contextFr": "Ne sois pas en colère contre moi, car je l'ai fait pour toi.",
        "hl": "君"
      },
      {
        "jp": "大学生",
        "reading": "だいがくせい",
        "fr": "étudiant (à l'université)",
        "context": "妹は２１で大学生です。",
        "contextFr": "Ma sœur est une étudiante universitaire de 21 ans.",
        "hl": "大学生"
      },
      {
        "jp": "人間",
        "reading": "にんげん",
        "fr": "humain",
        "context": "猫は人間じゃない。",
        "contextFr": "Les chats ne sont pas humains.",
        "hl": "人間"
      },
      {
        "jp": "終わり",
        "reading": "おわり",
        "fr": "fin",
        "context": "その年の終わりに彼は日本を離れた。",
        "contextFr": "Il a quitté le Japon à la fin de l'année.",
        "hl": "終わり"
      },
      {
        "jp": "手伝う",
        "reading": "てつだう",
        "fr": "aider",
        "context": "手伝ってくれる人が必要ですね。",
        "contextFr": "Nous avons besoin de quelqu'un pour nous aider.",
        "hl": "手伝っ"
      },
      {
        "jp": "目",
        "reading": "め",
        "fr": "œil",
        "context": "彼女は私を変な目で見た。",
        "contextFr": "Elle m'a lancé un étrange regard.",
        "hl": "目"
      },
      {
        "jp": "鼻",
        "reading": "はな",
        "fr": "nez",
        "context": "私の鼻は、とても大きく、しかも曲がっている。",
        "contextFr": "Mon nez est très grand et en plus il devient crochu.",
        "hl": "鼻"
      },
      {
        "jp": "口",
        "reading": "くち",
        "fr": "bouche",
        "context": "なぜ、あなたの口はそんなに大きいの？",
        "contextFr": "Pourquoi ta bouche est-elle si grande ?",
        "hl": "口"
      },
      {
        "jp": "髪",
        "reading": "かみ",
        "fr": "cheveux",
        "context": "黒い髪の綺麗な女の子が公園にいました。",
        "contextFr": "Une jolie fille aux cheveux noirs était dans le parc.",
        "hl": "髪"
      },
      {
        "jp": "歯",
        "reading": "は",
        "fr": "dent",
        "context": "目には目を、歯には歯を。",
        "contextFr": "Œil pour œil, dent pour dent.",
        "hl": "歯"
      },
      {
        "jp": "背",
        "reading": "せ",
        "fr": "taille",
        "context": "彼女は私と同じくらい背が高い。",
        "contextFr": "Elle est à peu près de la même taille que moi.",
        "hl": "背"
      },
      {
        "jp": "乗せる",
        "reading": "のせる",
        "fr": "poser sur",
        "context": "彼の母親が彼を車に乗せるために来た。",
        "contextFr": "Sa mère vint le chercher.",
        "hl": "乗せる"
      },
      {
        "jp": "でも",
        "reading": "でも",
        "fr": "mais",
        "context": "彼はここに来るといつでも同じ料理を注文する。",
        "contextFr": "Chaque fois qu'il vient ici, il commande le même plat.",
        "hl": "でも"
      },
      {
        "jp": "テーブル",
        "reading": "テーブル",
        "fr": "table",
        "context": "「彼の本はどこですか」「それはテーブルの上です」",
        "contextFr": "« Où est son livre ? » « Il est sur la table. »",
        "hl": "テーブル"
      },
      {
        "jp": "くれる",
        "reading": "くれる",
        "fr": "donner (à moi)",
        "context": "彼は私に彼が持っているお金を全部くれた。",
        "contextFr": "Il m'a donné tout l'argent qu'il avait.",
        "hl": "くれ"
      },
      {
        "jp": "よく",
        "reading": "よく",
        "fr": "souvent",
        "context": "彼女が子供の頃のことを言うのをよく耳にする。",
        "contextFr": "Je l'entends souvent se référer à son enfance.",
        "hl": "よく"
      },
      {
        "jp": "とても",
        "reading": "とても",
        "fr": "très",
        "context": "とても驚いたことには、ドアが音もなく開いた。",
        "contextFr": "À ma grande surprise, la porte s'ouvrit sans bruit.",
        "hl": "とても"
      },
      {
        "jp": "食べ物",
        "reading": "たべもの",
        "fr": "nourriture",
        "context": "彼は食べ物と、その上にお金もくれた。",
        "contextFr": "Il me donna de la nourriture ainsi que de l'argent.",
        "hl": "食べ物"
      },
      {
        "jp": "最高",
        "reading": "さいこう",
        "fr": "suprême",
        "context": "彼はその賞を最高の栄誉だと感じている。",
        "contextFr": "Il ressent ce prix comme la gloire suprême.",
        "hl": "最高"
      },
      {
        "jp": "始まる",
        "reading": "はじまる",
        "fr": "commencer",
        "context": "日本語の授業はいつ始まるの？",
        "contextFr": "Quand est-ce que le cours de japonais commence ?",
        "hl": "始まる"
      },
      {
        "jp": "太い",
        "reading": "ふとい",
        "fr": "épais",
        "context": "地図上の太い線は道路に相当する。",
        "contextFr": "Les grosses lignes sur la carte représentent les routes.",
        "hl": "太い"
      },
      {
        "jp": "けど",
        "reading": "けど",
        "fr": "mais",
        "context": "でも、今度の週末はプールは開いてないと思うけど。",
        "contextFr": "Mais je ne pense pas que la piscine soit ouverte ce week-end.",
        "hl": "けど"
      },
      {
        "jp": "お父さん",
        "reading": "おとうさん",
        "fr": "père",
        "context": "あなたのお父さんの友達は女の人ですか。",
        "contextFr": "Est-ce que l'ami de ton père est une femme ?",
        "hl": "お父さん"
      },
      {
        "jp": "多分",
        "reading": "たぶん",
        "fr": "probablement",
        "context": "手伝いたいけど、多分足手まといになるよね。",
        "contextFr": "J'aimerais aider, mais je ne serai peut-être qu'un fardeau.",
        "hl": "多分"
      },
      {
        "jp": "時計",
        "reading": "とけい",
        "fr": "horloge",
        "context": "時計が欲しいのですかと私は彼に言った。",
        "contextFr": "Je lui ai demandé s'il voulait une montre.",
        "hl": "時計"
      },
      {
        "jp": "泊まる",
        "reading": "とまる",
        "fr": "passer la nuit",
        "context": "今晩泊まりたいんだが、部屋はありますか。",
        "contextFr": "Avez-vous une chambre libre pour la nuit ?",
        "hl": "泊まり"
      },
      {
        "jp": "掛ける",
        "reading": "かける",
        "fr": "accrocher",
        "context": "彼は絵を壁に掛けた。",
        "contextFr": "Il accrocha une image au mur.",
        "hl": "掛け"
      },
      {
        "jp": "曲がる",
        "reading": "まがる",
        "fr": "tourner",
        "context": "最初の信号を左へ曲がるのですか。",
        "contextFr": "Je tourne à gauche au prochain feu rouge ?",
        "hl": "曲がる"
      },
      {
        "jp": "嫌い",
        "reading": "きらい",
        "fr": "ne pas aimer",
        "context": "子供はほうれん草が嫌いなことが多い。",
        "contextFr": "Les enfants détestent souvent les épinards.",
        "hl": "嫌い"
      },
      {
        "jp": "音",
        "reading": "おと",
        "fr": "son",
        "context": "音を立てないで。勉強中だから。",
        "contextFr": "Ne faites pas de bruit. J'étudie.",
        "hl": "音"
      },
      {
        "jp": "必要",
        "reading": "ひつよう",
        "fr": "nécessaire",
        "context": "もし必要なら、彼に会いに行きます。",
        "contextFr": "Si c'est nécessaire, je vais aller le voir.",
        "hl": "必要"
      },
      {
        "jp": "優しい",
        "reading": "やさしい",
        "fr": "gentil",
        "context": "どうしてそんなに優しくしてくれるの？",
        "contextFr": "Pourquoi tu es si gentille avec moi ?",
        "hl": "優しく"
      },
      {
        "jp": "女",
        "reading": "おんな",
        "fr": "femme",
        "context": "君は今まで見た女の中で一番綺麗な女だ。",
        "contextFr": "Vous êtes la plus belle femme que j'aie jamais vue.",
        "hl": "女"
      },
      {
        "jp": "晴れる",
        "reading": "はれる",
        "fr": "s'éclaircir",
        "context": "昨日は雨が降ったが、今朝は晴れた。",
        "contextFr": "Il a plu hier, mais ça s'est éclairci ce matin.",
        "hl": "晴れ"
      },
      {
        "jp": "汚い",
        "reading": "きたない",
        "fr": "sale",
        "context": "汚い手で私の本に触らないで。",
        "contextFr": "Ne touchez pas mes livres avec des mains sales.",
        "hl": "汚い"
      },
      {
        "jp": "そんな",
        "reading": "そんな",
        "fr": "tel",
        "context": "そんなのよくあることだから気にしなくていいよ。",
        "contextFr": "T’en fais pas, ça arrive souvent ce genre de choses.",
        "hl": "そんな"
      },
      {
        "jp": "本当に",
        "reading": "ほんとうに",
        "fr": "vraiment",
        "context": "こんな天気の中、本当に出かける必要があるの？",
        "contextFr": "Il faut vraiment sortir par un temps pareil ?",
        "hl": "本当に"
      },
      {
        "jp": "上る",
        "reading": "のぼる",
        "fr": "monter",
        "context": "彼はかつてテムズ川を船で上ったことがある。",
        "contextFr": "Une fois il a remonté la Tamise.",
        "hl": "上っ"
      },
      {
        "jp": "出す",
        "reading": "だす",
        "fr": "sortir",
        "context": "私は手紙を出したことを覚えている。",
        "contextFr": "Je me rappelle qu'une lettre a été envoyée.",
        "hl": "出し"
      },
      {
        "jp": "月曜日",
        "reading": "げつようび",
        "fr": "lundi",
        "context": "彼はいつも月曜日には家にいる。",
        "contextFr": "Il est toujours à la maison le lundi.",
        "hl": "月曜日"
      },
      {
        "jp": "火曜日",
        "reading": "かようび",
        "fr": "mardi",
        "context": "月曜日、火曜日、水曜日、木曜日、金曜日、土曜日、日曜日。",
        "contextFr": "Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.",
        "hl": "火曜日"
      },
      {
        "jp": "水曜日",
        "reading": "すいようび",
        "fr": "mercredi",
        "context": "彼女は先週の水曜日から病気です。",
        "contextFr": "Elle est malade depuis mercredi dernier.",
        "hl": "水曜日"
      },
      {
        "jp": "木曜日",
        "reading": "もくようび",
        "fr": "jeudi",
        "context": "昨日は木曜日だった。",
        "contextFr": "Hier, c'était jeudi.",
        "hl": "木曜日"
      },
      {
        "jp": "金曜日",
        "reading": "きんようび",
        "fr": "vendredi",
        "context": "その事故は金曜日に起きた。",
        "contextFr": "L'accident a eu lieu vendredi.",
        "hl": "金曜日"
      },
      {
        "jp": "土曜日",
        "reading": "どようび",
        "fr": "samedi",
        "context": "土曜日に映画を見に行くのはどうですか。",
        "contextFr": "Ça te dirait d'aller voir un film samedi ?",
        "hl": "土曜日"
      },
      {
        "jp": "日曜日",
        "reading": "にちようび",
        "fr": "dimanche",
        "context": "君はこの前の日曜日にはどこへ行きましたか。",
        "contextFr": "Où êtes-vous allé dimanche dernier ?",
        "hl": "日曜日"
      },
      {
        "jp": "他",
        "reading": "ほか",
        "fr": "autre",
        "context": "彼は他のどの少年よりも背が高い。",
        "contextFr": "Il est plus grand que tous les autres garçons.",
        "hl": "他"
      }
    ]
  },
  {
    "id": "essentiels-4",
    "name": "Les 1000 · 241 à 320",
    "emoji": "🏠",
    "words": [
      {
        "jp": "今週",
        "reading": "こんしゅう",
        "fr": "cette semaine",
        "context": "今週あなたは何をしていましたか。",
        "contextFr": "Qu'est-ce que tu as fait cette semaine?",
        "hl": "今週"
      },
      {
        "jp": "締める",
        "reading": "しめる",
        "fr": "serrer",
        "context": "彼女は財布のひもをしっかり締めていた。",
        "contextFr": "Elle a gardé les cordons de la bourse bien serrés.",
        "hl": "締め"
      },
      {
        "jp": "問題",
        "reading": "もんだい",
        "fr": "problème",
        "context": "問題は我々が十分なお金を持っていないことだ。",
        "contextFr": "Le problème est que nous n'avons pas assez d'argent.",
        "hl": "問題"
      },
      {
        "jp": "触る",
        "reading": "さわる",
        "fr": "toucher",
        "context": "触らないで、このブタ！",
        "contextFr": "Ne me touche pas, espèce de porc !",
        "hl": "触ら"
      },
      {
        "jp": "飲み物",
        "reading": "のみもの",
        "fr": "boisson",
        "context": "水がトムさん好きな飲み物じゃないです。",
        "contextFr": "L'eau n'est pas la boisson préférée de Tom.",
        "hl": "飲み物"
      },
      {
        "jp": "中",
        "reading": "なか",
        "fr": "intérieur",
        "context": "川が町の中を流れている。",
        "contextFr": "La rivière passe à l'intérieur de la ville.",
        "hl": "中"
      },
      {
        "jp": "見える",
        "reading": "みえる",
        "fr": "être visible",
        "context": "彼女は電車が見えなくなってもそこに立っていた。",
        "contextFr": "Elle est restée là même lorsque le train ne fut plus en vue.",
        "hl": "見え"
      },
      {
        "jp": "そば",
        "reading": "そば",
        "fr": "près de",
        "context": "彼はよく私のそばに座り音楽を聞きます。",
        "contextFr": "Il s'assied souvent à côté de moi et écoute de la musique.",
        "hl": "そば"
      },
      {
        "jp": "今晩",
        "reading": "こんばん",
        "fr": "ce soir",
        "context": "今晩の予約をしたいのですが。",
        "contextFr": "Je voudrais faire une réservation pour ce soir.",
        "hl": "今晩"
      },
      {
        "jp": "もの",
        "reading": "もの",
        "fr": "chose",
        "context": "私は絶対にそんなものは信じない。",
        "contextFr": "Je suis le dernier à croire une telle chose.",
        "hl": "もの"
      },
      {
        "jp": "お姉さん",
        "reading": "おねえさん",
        "fr": "sœur aînée (de quelqu'un d'autre",
        "context": "お姉さんは東京に住んでいます。",
        "contextFr": "Ma grande sœur habite à Tokyo.",
        "hl": "お姉さん"
      },
      {
        "jp": "治る",
        "reading": "なおる",
        "fr": "guérir",
        "context": "自然に治りますよ。",
        "contextFr": "Cela va se guérir naturellement.",
        "hl": "治り"
      },
      {
        "jp": "方",
        "reading": "ほう",
        "fr": "direction",
        "context": "どちらでも欲しい方を選んでいいですよ。",
        "contextFr": "Tu peux choisir celui que tu veux.",
        "hl": "方"
      },
      {
        "jp": "だから",
        "reading": "だから",
        "fr": "donc",
        "context": "ビルは勉強が足りなかった。だから失敗した。",
        "contextFr": "Bill n'avait pas étudié suffisamment, il a donc échoué.",
        "hl": "だから"
      },
      {
        "jp": "こんな",
        "reading": "こんな",
        "fr": "tel",
        "context": "私はこんなことをしたことを後悔している。",
        "contextFr": "Je regrette d'avoir fait une telle chose.",
        "hl": "こんな"
      },
      {
        "jp": "電話",
        "reading": "でんわ",
        "fr": "téléphone",
        "context": "２０分後に電話を掛け直してもいいですか。",
        "contextFr": "Puis-je te rappeler dans vingt minutes ?",
        "hl": "電話"
      },
      {
        "jp": "頑張る",
        "reading": "がんばる",
        "fr": "faire de son mieux",
        "context": "彼は頑張ったが結局負けた。",
        "contextFr": "Il fit de son mieux pour être finalement vaincu.",
        "hl": "頑張っ"
      },
      {
        "jp": "両親",
        "reading": "りょうしん",
        "fr": "parents",
        "context": "私は両親と意見が合わないことがよくあった。",
        "contextFr": "Mon opinion divergeait souvent de celles de mes parents.",
        "hl": "両親"
      },
      {
        "jp": "妻",
        "reading": "つま",
        "fr": "épouse",
        "context": "彼も彼の妻も車を持っている。",
        "contextFr": "Lui et sa femme ont tous deux une voiture.",
        "hl": "妻"
      },
      {
        "jp": "お兄さん",
        "reading": "おにいさん",
        "fr": "frère aîné (de quelqu'un d'autre",
        "context": "お兄さんは何をしていますか。",
        "contextFr": "Que fait ton grand frère ?",
        "hl": "お兄さん"
      },
      {
        "jp": "おじいさん",
        "reading": "おじいさん",
        "fr": "grand-père",
        "context": "昔々おじいさんとおばあさんが住んでいました。",
        "contextFr": "Il y a très très longtemps vivaient un vieil homme et sa femme.",
        "hl": "おじいさん"
      },
      {
        "jp": "おばあさん",
        "reading": "おばあさん",
        "fr": "grand-mère",
        "context": "彼女は土曜日におばあさんを訪ねます。",
        "contextFr": "Elle va rendre visite à sa grand-mère samedi.",
        "hl": "おばあさん"
      },
      {
        "jp": "ちゃん",
        "reading": "ちゃん",
        "fr": "-chan (suffixe pour les enfants et les amis proches)",
        "context": "愛ちゃんは私のそばに座った。",
        "contextFr": "Ai s'est assise auprès de moi.",
        "hl": "ちゃん"
      },
      {
        "jp": "声",
        "reading": "こえ",
        "fr": "voix",
        "context": "彼女の声はまだ私の耳に残っている。",
        "contextFr": "Sa voix résonne encore à mes oreilles.",
        "hl": "声"
      },
      {
        "jp": "辛い",
        "reading": "からい",
        "fr": "épicé",
        "context": "台湾料理はインド料理ほど辛くない。",
        "contextFr": "La cuisine taïwanaise est moins épicée que la cuisine indienne.",
        "hl": "辛く"
      },
      {
        "jp": "じゃあ",
        "reading": "じゃあ",
        "fr": "bon alors",
        "context": "じゃあ、今日はここまで。",
        "contextFr": "Donc, pour aujourd'hui on arrête ici.",
        "hl": "じゃあ"
      },
      {
        "jp": "力",
        "reading": "ちから",
        "fr": "force",
        "context": "一番大切なのは、自分で考える力です。",
        "contextFr": "La chose la plus importante est la capacité à penser par vous-même.",
        "hl": "力"
      },
      {
        "jp": "強い",
        "reading": "つよい",
        "fr": "fort",
        "context": "昨日、強い地震がありました。",
        "contextFr": "Il y a eu hier un fort tremblement de terre.",
        "hl": "強い"
      },
      {
        "jp": "いっぱい",
        "reading": "いっぱい",
        "fr": "plein",
        "context": "彼の部屋はいつも彼の友人でいっぱいだ。",
        "contextFr": "Sa chambre est toujours pleine d'amis à lui.",
        "hl": "いっぱい"
      },
      {
        "jp": "上",
        "reading": "うえ",
        "fr": "haut",
        "context": "鳥が木の上を飛んでいる。",
        "contextFr": "Les oiseaux volent au-dessus des arbres.",
        "hl": "上"
      },
      {
        "jp": "先",
        "reading": "さき",
        "fr": "avant",
        "context": "お金を先に入れるのですか。",
        "contextFr": "Dois-je d'abord mettre les pièces ?",
        "hl": "先"
      },
      {
        "jp": "細い",
        "reading": "ほそい",
        "fr": "mince",
        "context": "彼は先の細い鉛筆を使う。",
        "contextFr": "Il utilise un crayon avec une pointe fine.",
        "hl": "細い"
      },
      {
        "jp": "高校生",
        "reading": "こうこうせい",
        "fr": "lycéen",
        "context": "今日は、高校生の朝の様子を見てみよう。",
        "contextFr": "Examinons aujourd'hui une matinée type de lycéen.",
        "hl": "高校生"
      },
      {
        "jp": "上手",
        "reading": "じょうず",
        "fr": "habile",
        "context": "彼女がコーヒーを入れるのを上手なのを君は知っているか。",
        "contextFr": "Savais-tu qu'elle sait bien faire le café ?",
        "hl": "上手"
      },
      {
        "jp": "ちょっと",
        "reading": "ちょっと",
        "fr": "un peu",
        "context": "ちょっと全然関係ないこと聞いてもいい？",
        "contextFr": "Je peux te demander un truc qui a absolument rien à voir ?",
        "hl": "ちょっと"
      },
      {
        "jp": "世界",
        "reading": "せかい",
        "fr": "monde",
        "context": "世界で一番長い川は何ですか。",
        "contextFr": "Quelle est la rivière la plus longue au monde ?",
        "hl": "世界"
      },
      {
        "jp": "左",
        "reading": "ひだり",
        "fr": "gauche",
        "context": "左を下にして横になってください。",
        "contextFr": "Allongez-vous sur votre côté gauche.",
        "hl": "左"
      },
      {
        "jp": "変える",
        "reading": "かえる",
        "fr": "changer",
        "context": "彼女は服を変えに部屋へ入った。",
        "contextFr": "Elle alla dans sa chambre pour changer sa robe.",
        "hl": "変え"
      },
      {
        "jp": "暖かい",
        "reading": "あたたかい",
        "fr": "chaud",
        "context": "日一日と暖かくなって来る。",
        "contextFr": "Il fait de plus en plus chaud jour après jour.",
        "hl": "暖かく"
      },
      {
        "jp": "こと",
        "reading": "こと",
        "fr": "chose",
        "context": "私は自分のしたことを悪かったと思わない。",
        "contextFr": "Je n'ai aucun regret de ce que j'ai fait.",
        "hl": "こと"
      },
      {
        "jp": "美味しい",
        "reading": "おいしい",
        "fr": "délicieux",
        "context": "「美味しくないの？」「うん、美味しくない」",
        "contextFr": "« C’est pas bon ? » « Non, c’est pas bon. »",
        "hl": "美味しく"
      },
      {
        "jp": "昨日",
        "reading": "きのう",
        "fr": "hier",
        "context": "昨日あなたの手紙をポストに入れたことを覚えています。",
        "contextFr": "Je me souviens avoir posté ta lettre hier.",
        "hl": "昨日"
      },
      {
        "jp": "今朝",
        "reading": "けさ",
        "fr": "ce matin",
        "context": "実は、今朝から何も食べてないのです。",
        "contextFr": "En fait, je n'ai rien mangé depuis ce matin.",
        "hl": "今朝"
      },
      {
        "jp": "来週",
        "reading": "らいしゅう",
        "fr": "la semaine prochaine",
        "context": "彼らは来週パーティーを開く予定です。",
        "contextFr": "Ils vont faire une fête la semaine prochaine.",
        "hl": "来週"
      },
      {
        "jp": "先週",
        "reading": "せんしゅう",
        "fr": "la semaine dernière",
        "context": "先週の日曜日からずっと雨が降っている。",
        "contextFr": "Il pleut depuis dimanche dernier.",
        "hl": "先週"
      },
      {
        "jp": "来月",
        "reading": "らいげつ",
        "fr": "le mois prochain",
        "context": "来月１０日に二人は結婚２０周年を迎えます。",
        "contextFr": "Le dix du mois prochain, il y a vingt ans qu'ils seront mariés.",
        "hl": "来月"
      },
      {
        "jp": "先月",
        "reading": "せんげつ",
        "fr": "le mois dernier",
        "context": "私は先月から彼女に会っていない。",
        "contextFr": "Je ne l'ai pas vue depuis le mois dernier.",
        "hl": "先月"
      },
      {
        "jp": "来年",
        "reading": "らいねん",
        "fr": "l'année prochaine",
        "context": "彼は来年外国旅行をする。",
        "contextFr": "Il va voyager à l'étranger l'année prochaine.",
        "hl": "来年"
      },
      {
        "jp": "毎朝",
        "reading": "まいあさ",
        "fr": "chaque matin",
        "context": "私は毎朝散歩することにしている。",
        "contextFr": "Je me fais une règle de marcher chaque matin.",
        "hl": "毎朝"
      },
      {
        "jp": "毎週",
        "reading": "まいしゅう",
        "fr": "chaque semaine",
        "context": "彼は毎週必ず母親に手紙を書いている。",
        "contextFr": "Il ne manque jamais d'écrire à sa mère chaque semaine.",
        "hl": "毎週"
      },
      {
        "jp": "毎月",
        "reading": "まいつき",
        "fr": "chaque mois",
        "context": "私は両親には必ず毎月手紙を書きます。",
        "contextFr": "Je ne manque jamais d'écrire à mes parents tous les mois.",
        "hl": "毎月"
      },
      {
        "jp": "毎年",
        "reading": "まいとし",
        "fr": "chaque année",
        "context": "私の家族は毎年冬になるとスキーに行きます。",
        "contextFr": "Ma famille part skier chaque hiver.",
        "hl": "毎年"
      },
      {
        "jp": "夕方",
        "reading": "ゆうがた",
        "fr": "soir",
        "context": "夫婦は、その日の夕方、馬車に乗りました。",
        "contextFr": "Le couple prit une diligence ce soir-là.",
        "hl": "夕方"
      },
      {
        "jp": "週末",
        "reading": "しゅうまつ",
        "fr": "week-end",
        "context": "この調子では週末前に終わりそうにない。",
        "contextFr": "À ce rythme, on risque pas de finir avant le week-end.",
        "hl": "週末"
      },
      {
        "jp": "俺",
        "reading": "おれ",
        "fr": "je",
        "context": "君が俺のそばにいてくれたらなあ。",
        "contextFr": "Je regrette que vous ne soyez pas près de moi.",
        "hl": "俺"
      },
      {
        "jp": "人生",
        "reading": "じんせい",
        "fr": "vie",
        "context": "僕の人生がどんなものか、君は分かっているのか？",
        "contextFr": "As-tu une idée de ce à quoi ma vie ressemble ?",
        "hl": "人生"
      },
      {
        "jp": "下",
        "reading": "した",
        "fr": "sous",
        "context": "ジョンソンさんの下の名前はなんですか？",
        "contextFr": "Comment M. Johnson se prénomme-t-il?",
        "hl": "下"
      },
      {
        "jp": "外",
        "reading": "そと",
        "fr": "dehors",
        "context": "外のテーブルがいいのですが。",
        "contextFr": "Pourrait-on avoir une table à l'extérieur ?",
        "hl": "外"
      },
      {
        "jp": "隣",
        "reading": "となり",
        "fr": "voisin",
        "context": "彼は隣の部屋に入って横になりました。",
        "contextFr": "Il alla dans la pièce d'à côté et s'allongea.",
        "hl": "隣"
      },
      {
        "jp": "東",
        "reading": "ひがし",
        "fr": "est",
        "context": "風は東から吹いている。",
        "contextFr": "Le vent souffle de l'est.",
        "hl": "東"
      },
      {
        "jp": "西",
        "reading": "にし",
        "fr": "ouest",
        "context": "駅はホテルの西の方にある。",
        "contextFr": "La gare est à l'ouest de l'hôtel.",
        "hl": "西"
      },
      {
        "jp": "南",
        "reading": "みなみ",
        "fr": "sud",
        "context": "秋にはたくさんの鳥が南に向かう。",
        "contextFr": "À l'automne, beaucoup d'oiseaux migrent vers le sud.",
        "hl": "南"
      },
      {
        "jp": "北",
        "reading": "きた",
        "fr": "nord",
        "context": "北から冷たい風が吹いていた。",
        "contextFr": "Il y avait un vent froid soufflant du nord.",
        "hl": "北"
      },
      {
        "jp": "大人",
        "reading": "おとな",
        "fr": "adulte",
        "context": "大人だけこの映画が見える。",
        "contextFr": "Seuls les adultes peuvent voir ce film.",
        "hl": "大人"
      },
      {
        "jp": "以上",
        "reading": "いじょう",
        "fr": "au-dessus de",
        "context": "彼は収入以上の生活をしている。",
        "contextFr": "Il vit au-dessus de ses moyens.",
        "hl": "以上"
      },
      {
        "jp": "子",
        "reading": "こ",
        "fr": "enfant",
        "context": "その子は犬を見て泣き出した。",
        "contextFr": "Cet enfant s'est mis à pleurer à la vue du chien.",
        "hl": "子"
      },
      {
        "jp": "変わる",
        "reading": "かわる",
        "fr": "changer",
        "context": "天気は刻々と変わる。",
        "contextFr": "Le temps varie d'heure en heure.",
        "hl": "変わる"
      },
      {
        "jp": "冷たい",
        "reading": "つめたい",
        "fr": "froid (au toucher)",
        "context": "彼は何か冷たい飲み物を欲しがっている。",
        "contextFr": "Il veut boire quelque chose de froid.",
        "hl": "冷たい"
      },
      {
        "jp": "漢字",
        "reading": "かんじ",
        "fr": "kanji",
        "context": "漢字は読むのが難しい。",
        "contextFr": "Les idéogrammes chinois sont difficiles à lire.",
        "hl": "漢字"
      },
      {
        "jp": "あなた",
        "reading": "あなた",
        "fr": "vous",
        "context": "それをあなたに説明することは私には無理です。",
        "contextFr": "C'est impossible pour moi de te l'expliquer.",
        "hl": "あなた"
      },
      {
        "jp": "さん",
        "reading": "さん",
        "fr": "monsieur",
        "context": "ハドソンさんがどこに住んでいるか知っていますか。",
        "contextFr": "Est-ce que tu sais où Mademoiselle Hudson habite?",
        "hl": "さん"
      },
      {
        "jp": "時々",
        "reading": "ときどき",
        "fr": "parfois",
        "context": "彼は時々私の息子に会いに来る。",
        "contextFr": "Il vient voir mon fils de temps en temps.",
        "hl": "時々"
      },
      {
        "jp": "助ける",
        "reading": "たすける",
        "fr": "aider",
        "context": "彼らは人々を助けるために働きました。",
        "contextFr": "Ils travaillèrent pour aider tout le monde.",
        "hl": "助ける"
      },
      {
        "jp": "相手",
        "reading": "あいて",
        "fr": "partenaire",
        "context": "彼は相手チームに入った。",
        "contextFr": "Il a rejoint l'équipe adverse.",
        "hl": "相手"
      },
      {
        "jp": "一人",
        "reading": "ひとり",
        "fr": "une personne",
        "context": "一人で旅行します。",
        "contextFr": "Je voyage seul.",
        "hl": "一人"
      },
      {
        "jp": "どうも",
        "reading": "どうも",
        "fr": "merci",
        "context": "手伝ってくれてどうもありがとう。",
        "contextFr": "Merci de votre assistance.",
        "hl": "どうも"
      },
      {
        "jp": "欲しい",
        "reading": "ほしい",
        "fr": "vouloir",
        "context": "「今一番欲しいものは何？」「お金」",
        "contextFr": "« Qu’est-ce que tu désires le plus, là ? » « De l’argent. »",
        "hl": "欲しい"
      },
      {
        "jp": "初めて",
        "reading": "はじめて",
        "fr": "pour la première fois",
        "context": "馬に乗るのは、これが初めてです。",
        "contextFr": "C'est la première fois que je fais du cheval.",
        "hl": "初めて"
      },
      {
        "jp": "本当",
        "reading": "ほんとう",
        "fr": "vérité",
        "context": "私はあなたに本当のことを言って欲しい。",
        "contextFr": "Je voudrais que tu me dises la vérité.",
        "hl": "本当"
      },
      {
        "jp": "やめる",
        "reading": "やめる",
        "fr": "arrêter",
        "context": "彼女は夫に『やめて！』と言いました。",
        "contextFr": "Elle a dit à son mari: \"Arrête !\".",
        "hl": "やめ"
      }
    ]
  },
  {
    "id": "essentiels-5",
    "name": "Les 1000 · 321 à 400",
    "emoji": "🍽️",
    "words": [
      {
        "jp": "意味",
        "reading": "いみ",
        "fr": "sens",
        "context": "この文章は何を意味していると思う？",
        "contextFr": "Que penses-tu que signifie cette phrase ?",
        "hl": "意味"
      },
      {
        "jp": "男性",
        "reading": "だんせい",
        "fr": "homme",
        "context": "写真でその男性が誰か分かりますか。",
        "contextFr": "Est-ce que vous reconnaissez l'homme sur cette photo ?",
        "hl": "男性"
      },
      {
        "jp": "続ける",
        "reading": "つづける",
        "fr": "continuer",
        "context": "彼は朝から晩まで働き続けた。",
        "contextFr": "Il continua à travailler du matin jusqu'au soir.",
        "hl": "続け"
      },
      {
        "jp": "答える",
        "reading": "こたえる",
        "fr": "répondre",
        "context": "「いいえ、いました」とその学生は答えた。",
        "contextFr": "« Si, j'y étais », répondit cet étudiant.",
        "hl": "答え"
      },
      {
        "jp": "仲間",
        "reading": "なかま",
        "fr": "compagnon",
        "context": "彼は私の仕事仲間である。",
        "contextFr": "Il est mon collègue.",
        "hl": "仲間"
      },
      {
        "jp": "見つかる",
        "reading": "みつかる",
        "fr": "être trouvé",
        "context": "探しているものは見つかりましたか。",
        "contextFr": "Avez-vous trouvé ce que vous cherchiez ?",
        "hl": "見つかり"
      },
      {
        "jp": "休む",
        "reading": "やすむ",
        "fr": "se reposer",
        "context": "彼女は５日前から学校を休んでいます。",
        "contextFr": "Elle est absente de l'école depuis cinq jours.",
        "hl": "休ん"
      },
      {
        "jp": "昔",
        "reading": "むかし",
        "fr": "il y a longtemps",
        "context": "でも、もちろん、ずっと昔のことだけど。",
        "contextFr": "Mais bien sûr, c'était il y a longtemps.",
        "hl": "昔"
      },
      {
        "jp": "ゆっくり",
        "reading": "ゆっくり",
        "fr": "lentement",
        "context": "彼はゆっくりと通りを歩いていた。",
        "contextFr": "Il marchait lentement dans la rue.",
        "hl": "ゆっくり"
      },
      {
        "jp": "生きる",
        "reading": "いきる",
        "fr": "vivre",
        "context": "僕は眠りたい！生きるよりかは眠りたい！",
        "contextFr": "Je veux dormir ! Dormir plutôt que vivre !",
        "hl": "生きる"
      },
      {
        "jp": "花",
        "reading": "はな",
        "fr": "fleur",
        "context": "この花は全ての花の中で一番美しい。",
        "contextFr": "Cette fleur est la plus belle d'entre toutes.",
        "hl": "花"
      },
      {
        "jp": "動く",
        "reading": "うごく",
        "fr": "bouger",
        "context": "その自動車は電気で動く。",
        "contextFr": "Cette automobile fonctionne à l'électricité.",
        "hl": "動く"
      },
      {
        "jp": "こう",
        "reading": "こう",
        "fr": "comme ceci",
        "context": "こうやって私はその機械を作った。",
        "contextFr": "C'est comme ça que j'ai construit cette machine.",
        "hl": "こう"
      },
      {
        "jp": "線",
        "reading": "せん",
        "fr": "ligne",
        "context": "地図上の青い線は川を示す。",
        "contextFr": "Les lignes bleues sur la carte désignent des fleuves.",
        "hl": "線"
      },
      {
        "jp": "以外",
        "reading": "いがい",
        "fr": "sauf",
        "context": "私は雨の日以外は毎日散歩しています。",
        "contextFr": "Je me promène quotidiennement, excepté s'il pleut.",
        "hl": "以外"
      },
      {
        "jp": "辺",
        "reading": "へん",
        "fr": "zone",
        "context": "この辺でスーパーってどこにありますか？",
        "contextFr": "Où peut-on trouver un supermarché dans les environs ?",
        "hl": "辺"
      },
      {
        "jp": "閉まる",
        "reading": "しまる",
        "fr": "se fermer",
        "context": "このデパートは今日は閉まっている。",
        "contextFr": "Cette galerie marchande est fermée aujourd'hui.",
        "hl": "閉まっ"
      },
      {
        "jp": "頼む",
        "reading": "たのむ",
        "fr": "demander",
        "context": "母は私に食事の準備をしてくれと頼んだ。",
        "contextFr": "Ma mère m'a demandé de dresser la table.",
        "hl": "頼ん"
      },
      {
        "jp": "信じる",
        "reading": "しんじる",
        "fr": "croire",
        "context": "あなたは正しいことができると信じています。",
        "contextFr": "Je crois en ta capacité à faire ce qu'il faut.",
        "hl": "信じ"
      },
      {
        "jp": "最後",
        "reading": "さいご",
        "fr": "dernier",
        "context": "彼は最後の最後になって約束を取り消した。",
        "contextFr": "Il a annulé le rendez-vous au dernier moment.",
        "hl": "最後"
      },
      {
        "jp": "最近",
        "reading": "さいきん",
        "fr": "récemment",
        "context": "それは君が思っているよりも最近のことだ。",
        "contextFr": "Il est plus récent que tu ne le penses.",
        "hl": "最近"
      },
      {
        "jp": "コンピュータ",
        "reading": "コンピュータ",
        "fr": "ordinateur",
        "context": "コンピュータに向かって喚いても、何も解決しないよ。",
        "contextFr": "Crier à ton ordinateur n'aidera en rien.",
        "hl": "コンピュータ"
      },
      {
        "jp": "増える",
        "reading": "ふえる",
        "fr": "augmenter",
        "context": "車の数が増えている。",
        "contextFr": "Le nombre des voitures augmente.",
        "hl": "増え"
      },
      {
        "jp": "場所",
        "reading": "ばしょ",
        "fr": "endroit",
        "context": "行ったことのない場所に行くのが好きです。",
        "contextFr": "J’aime visiter des lieux où je ne suis jamais allé.",
        "hl": "場所"
      },
      {
        "jp": "選ぶ",
        "reading": "えらぶ",
        "fr": "choisir",
        "context": "私はＡかＢのどちらかを選ばなくてはならなかった。",
        "contextFr": "Je devais choisir entre A et B.",
        "hl": "選ば"
      },
      {
        "jp": "生活",
        "reading": "せいかつ",
        "fr": "vie",
        "context": "彼は忙しい生活の中で家族と会うことがない。",
        "contextFr": "Ayant une vie occupée, il ne voit pas sa famille.",
        "hl": "生活"
      },
      {
        "jp": "まずい",
        "reading": "まずい",
        "fr": "mauvais (goût)",
        "context": "私たち、こんなことをしていてはまずいと思う。",
        "contextFr": "Je pense que nous ne devrions pas faire cela.",
        "hl": "まずい"
      },
      {
        "jp": "曇る",
        "reading": "くもる",
        "fr": "se couvrir (de nuages)",
        "context": "急に空が曇ってきた。",
        "contextFr": "Tout à coup, le ciel se couvrit.",
        "hl": "曇っ"
      },
      {
        "jp": "上がる",
        "reading": "あがる",
        "fr": "monter",
        "context": "彼女は急いで階段を上がって行った。",
        "contextFr": "Elle a monté les marches quatre à quatre.",
        "hl": "上がっ"
      },
      {
        "jp": "だって",
        "reading": "だって",
        "fr": "mais",
        "context": "今日が土曜日だってこと忘れてた。",
        "contextFr": "J’ai oublié que c’était samedi, aujourd’hui.",
        "hl": "だって"
      },
      {
        "jp": "集める",
        "reading": "あつめる",
        "fr": "collecter",
        "context": "彼はいくらかの情報を集めた。",
        "contextFr": "Il a rassemblé des bouts d'informations.",
        "hl": "集め"
      },
      {
        "jp": "心",
        "reading": "こころ",
        "fr": "cœur",
        "context": "でも僕の心が、僕の指に何をしたらいいのか教えてくれるのだ。",
        "contextFr": "...mais mon cœur dit à mes doigts ce qu'ils doivent faire.",
        "hl": "心"
      },
      {
        "jp": "消える",
        "reading": "きえる",
        "fr": "disparaître",
        "context": "火は自然に消えた。",
        "contextFr": "Le feu s'est éteint naturellement.",
        "hl": "消え"
      },
      {
        "jp": "社会",
        "reading": "しゃかい",
        "fr": "société",
        "context": "この社会には３０人の会員がいます。",
        "contextFr": "Cette association comporte trente adhérents.",
        "hl": "社会"
      },
      {
        "jp": "今回",
        "reading": "こんかい",
        "fr": "cette fois-ci",
        "context": "今回の試験は非常に難しかった。",
        "contextFr": "Le dernier examen a été très difficile.",
        "hl": "今回"
      },
      {
        "jp": "彼ら",
        "reading": "かれら",
        "fr": "ils",
        "context": "彼らのうち何人かは私の友達です。",
        "contextFr": "Parmi eux certains sont mes amis.",
        "hl": "彼ら"
      },
      {
        "jp": "予定",
        "reading": "よてい",
        "fr": "projet",
        "context": "何か予定はあるの？",
        "contextFr": "As-tu des projets ?",
        "hl": "予定"
      },
      {
        "jp": "テレビ",
        "reading": "テレビ",
        "fr": "télévision",
        "context": "私は宿題が終わってからテレビを見てます。",
        "contextFr": "Je regarde la télé après avoir fini mes devoirs.",
        "hl": "テレビ"
      },
      {
        "jp": "減る",
        "reading": "へる",
        "fr": "diminuer",
        "context": "最近チラシが減ってる。",
        "contextFr": "Le nombre de prospectus a diminué ces derniers temps.",
        "hl": "減っ"
      },
      {
        "jp": "比べる",
        "reading": "くらべる",
        "fr": "comparer",
        "context": "自分の車と彼の車を比べた。",
        "contextFr": "J'ai comparé ma voiture avec la sienne.",
        "hl": "比べ"
      },
      {
        "jp": "生まれる",
        "reading": "うまれる",
        "fr": "naître",
        "context": "カナダ人に生まれたかった。",
        "contextFr": "J’aurais voulu naître canadienne.",
        "hl": "生まれ"
      },
      {
        "jp": "全員",
        "reading": "ぜんいん",
        "fr": "tout le monde",
        "context": "全員がその単語を暗記しなければならない。",
        "contextFr": "Tout le monde doit apprendre les paroles par cœur.",
        "hl": "全員"
      },
      {
        "jp": "感じ",
        "reading": "かんじ",
        "fr": "sentiment",
        "context": "今朝の地震は感じましたか。",
        "contextFr": "As-tu senti le tremblement de terre ce matin ?",
        "hl": "感じ"
      },
      {
        "jp": "日本",
        "reading": "にほん",
        "fr": "Japon",
        "context": "日本であなたに会うのを楽しみにしています。",
        "contextFr": "Je suis pressé de te rencontrer au Japon.",
        "hl": "日本"
      },
      {
        "jp": "英語",
        "reading": "えいご",
        "fr": "anglais (langue)",
        "context": "彼女はたくさんの英語の本を持っています。",
        "contextFr": "Elle a beaucoup de livres écrits en anglais.",
        "hl": "英語"
      },
      {
        "jp": "外国",
        "reading": "がいこく",
        "fr": "pays étranger",
        "context": "私の両親は姉が外国人と結婚するのに反対している。",
        "contextFr": "Mes parents s'opposent à ce que ma sœur épouse un étranger.",
        "hl": "外国"
      },
      {
        "jp": "外国人",
        "reading": "がいこくじん",
        "fr": "étranger (personne)",
        "context": "この町には外国人が多いです。",
        "contextFr": "Il y a beaucoup d’étrangers dans cette ville.",
        "hl": "外国人"
      },
      {
        "jp": "行う",
        "reading": "おこなう",
        "fr": "effectuer",
        "context": "言うことと行うことは別である。",
        "contextFr": "Dire et faire sont deux choses différentes.",
        "hl": "行う"
      },
      {
        "jp": "調べる",
        "reading": "しらべる",
        "fr": "enquêter",
        "context": "人に聞く前に少しは自分で調べたら？",
        "contextFr": "Et si tu cherchais un peu par toi-même avant de demander aux autres ?",
        "hl": "調べ"
      },
      {
        "jp": "守る",
        "reading": "まもる",
        "fr": "protéger",
        "context": "彼だけはその習慣を守らない。",
        "contextFr": "Il est le seul à ne pas respecter la coutume.",
        "hl": "守ら"
      },
      {
        "jp": "大変",
        "reading": "たいへん",
        "fr": "très",
        "context": "彼が先週受けた試験は大変難しかった。",
        "contextFr": "L'examen qu'il a passé la semaine dernière était très difficile.",
        "hl": "大変"
      },
      {
        "jp": "事故",
        "reading": "じこ",
        "fr": "accident",
        "context": "その事故のことは聞きましたと彼女は言った。",
        "contextFr": "Elle a dit qu'elle avait entendu parler de l'accident.",
        "hl": "事故"
      },
      {
        "jp": "開く",
        "reading": "あく",
        "fr": "s'ouvrir",
        "context": "その新しい店は来週開きます。",
        "contextFr": "Ce nouveau magasin ouvrira dans une semaine.",
        "hl": "開き"
      },
      {
        "jp": "十分",
        "reading": "じゅうぶん",
        "fr": "assez",
        "context": "私はその事実を十分よく知っている。",
        "contextFr": "Je connais suffisamment les faits.",
        "hl": "十分"
      },
      {
        "jp": "あまり",
        "reading": "あまり",
        "fr": "pas beaucoup",
        "context": "父が時計を買ってくれたが、あまり気に入らない。",
        "contextFr": "Mon père m'a acheté une montre qui ne me plaît pas beaucoup.",
        "hl": "あまり"
      },
      {
        "jp": "怖い",
        "reading": "こわい",
        "fr": "effrayant",
        "context": "私は地震が怖い。",
        "contextFr": "J'ai peur des tremblements de terre.",
        "hl": "怖い"
      },
      {
        "jp": "易しい",
        "reading": "やさしい",
        "fr": "facile",
        "context": "易しい言葉でそれを説明して下さい。",
        "contextFr": "Expliquez-le avec des mots simples.",
        "hl": "易しい"
      },
      {
        "jp": "決める",
        "reading": "きめる",
        "fr": "décider",
        "context": "何をするかを決めるのはあなたの責任である。",
        "contextFr": "À toi de décider que faire.",
        "hl": "決める"
      },
      {
        "jp": "意見",
        "reading": "いけん",
        "fr": "opinion",
        "context": "彼の意見は大変重要だと思います。",
        "contextFr": "Je crois que son opinion a beaucoup d'importance.",
        "hl": "意見"
      },
      {
        "jp": "新聞",
        "reading": "しんぶん",
        "fr": "journal",
        "context": "あの店では新聞と雑誌を売っている。",
        "contextFr": "Le magasin vend des journaux et des magazines.",
        "hl": "新聞"
      },
      {
        "jp": "文章",
        "reading": "ぶんしょう",
        "fr": "écrit",
        "context": "この文章を訳すことはとても易しいでしょう。",
        "contextFr": "Traduire ce texte sera très facile.",
        "hl": "文章"
      },
      {
        "jp": "厚い",
        "reading": "あつい",
        "fr": "épais",
        "context": "その本は厚いが、高くはない。",
        "contextFr": "Le livre est épais mais pas cher.",
        "hl": "厚い"
      },
      {
        "jp": "忙しい",
        "reading": "いそがしい",
        "fr": "occupé",
        "context": "忙しいなら無理して来なくてもいいからね。",
        "contextFr": "Ne t’embête pas à venir si tu es occupée.",
        "hl": "忙しい"
      },
      {
        "jp": "薄い",
        "reading": "うすい",
        "fr": "mince",
        "context": "濃いコーヒーより、薄いコーヒーの方が好きです。",
        "contextFr": "Je préfère le café léger au café fort.",
        "hl": "薄い"
      },
      {
        "jp": "川",
        "reading": "かわ",
        "fr": "rivière",
        "context": "あなたは、泳いで川を渡ることができますのか。",
        "contextFr": "Pouvez-vous traverser la rivière à la nage ?",
        "hl": "川"
      },
      {
        "jp": "暗い",
        "reading": "くらい",
        "fr": "sombre",
        "context": "部屋の中は暗くて寒かった。",
        "contextFr": "La pièce était sombre et froide.",
        "hl": "暗く"
      },
      {
        "jp": "クラス",
        "reading": "クラス",
        "fr": "classe",
        "context": "あなたのクラスには何人の生徒がいますか。",
        "contextFr": "Combien d'élèves y a-t-il dans votre classe ?",
        "hl": "クラス"
      },
      {
        "jp": "感じる",
        "reading": "かんじる",
        "fr": "ressentir",
        "context": "彼女は何かが首に触れるのを感じた。",
        "contextFr": "Elle sentit quelque chose toucher son cou.",
        "hl": "感じ"
      },
      {
        "jp": "父親",
        "reading": "ちちおや",
        "fr": "père",
        "context": "私には父親が有名な小説家である友達がいる。",
        "contextFr": "J'ai un ami dont le père est un célèbre romancier.",
        "hl": "父親"
      },
      {
        "jp": "赤",
        "reading": "あか",
        "fr": "rouge",
        "context": "我々のチームは赤シャツを着ていた。",
        "contextFr": "Notre équipe portait des maillots rouges.",
        "hl": "赤"
      },
      {
        "jp": "青",
        "reading": "あお",
        "fr": "bleu",
        "context": "彼の車は青で、彼女のは赤だった。",
        "contextFr": "Sa voiture à lui était bleue ; sa voiture à elle était rouge.",
        "hl": "青"
      },
      {
        "jp": "白",
        "reading": "しろ",
        "fr": "blanc",
        "context": "庭のばらのいくつかは白だが、残りは全部赤です。",
        "contextFr": "Une partie des roses de mon jardin sont blanches, et les autres sont rouges.",
        "hl": "白"
      },
      {
        "jp": "黒",
        "reading": "くろ",
        "fr": "noir",
        "context": "黒のものはあなたによく似合います。",
        "contextFr": "Le noir te va bien.",
        "hl": "黒"
      },
      {
        "jp": "黄色",
        "reading": "きいろ",
        "fr": "jaune",
        "context": "私たちは黄色のりんごを持っています。",
        "contextFr": "Nous avons des pommes jaunes.",
        "hl": "黄色"
      },
      {
        "jp": "緑",
        "reading": "みどり",
        "fr": "vert",
        "context": "このはこの外は緑だが中は赤である。",
        "contextFr": "L'extérieur de cette boîte est vert, mais l'intérieur est rouge.",
        "hl": "緑"
      },
      {
        "jp": "茶色",
        "reading": "ちゃいろ",
        "fr": "marron",
        "context": "彼女は濃い茶色の靴を履いていた。",
        "contextFr": "Elle portait des chaussures brun foncé.",
        "hl": "茶色"
      },
      {
        "jp": "赤い",
        "reading": "あかい",
        "fr": "rouge",
        "context": "彼女は赤い花を持っています。",
        "contextFr": "Elle a des fleurs rouges.",
        "hl": "赤い"
      },
      {
        "jp": "青い",
        "reading": "あおい",
        "fr": "bleu",
        "context": "その青い車を買うことに決めたよ。",
        "contextFr": "J'ai décidé d'acheter la voiture bleue.",
        "hl": "青い"
      },
      {
        "jp": "白い",
        "reading": "しろい",
        "fr": "blanc",
        "context": "白い雲が空を走っているのが見えた。",
        "contextFr": "J'ai vu un nuage blanc naviguer à travers le ciel.",
        "hl": "白い"
      },
      {
        "jp": "黒い",
        "reading": "くろい",
        "fr": "noir",
        "context": "彼女はいつも黒い服を着ている。",
        "contextFr": "Elle est toujours habillée en noir.",
        "hl": "黒い"
      }
    ]
  },
  {
    "id": "essentiels-6",
    "name": "Les 1000 · 401 à 480",
    "emoji": "🧭",
    "words": [
      {
        "jp": "黄色い",
        "reading": "きいろい",
        "fr": "jaune",
        "context": "母は弟に黄色い傘を買ってやった。",
        "contextFr": "Ma mère a acheté un parapluie jaune à mon frère.",
        "hl": "黄色い"
      },
      {
        "jp": "買い物",
        "reading": "かいもの",
        "fr": "courses",
        "context": "母はちょうど買い物に出かけたところです。",
        "contextFr": "Ma mère vient juste de partir faire des courses.",
        "hl": "買い物"
      },
      {
        "jp": "休み",
        "reading": "やすみ",
        "fr": "vacances",
        "context": "明日は休みを取ろうと思っています。",
        "contextFr": "J'ai envie de prendre un jour de congé demain.",
        "hl": "休み"
      },
      {
        "jp": "住所",
        "reading": "じゅうしょ",
        "fr": "adresse",
        "context": "彼女は私に彼の住所を知っているかどうかを尋ねた。",
        "contextFr": "Elle m'a demandé si je connaissais son adresse.",
        "hl": "住所"
      },
      {
        "jp": "財布",
        "reading": "さいふ",
        "fr": "portefeuille",
        "context": "財布を無くしたことある？",
        "contextFr": "N'as-tu jamais perdu ton porte-monnaie ?",
        "hl": "財布"
      },
      {
        "jp": "母親",
        "reading": "ははおや",
        "fr": "mère",
        "context": "私は彼女を見ると必ず彼女の母親のことを思い出す。",
        "contextFr": "Je ne la vois jamais sans penser à sa mère.",
        "hl": "母親"
      },
      {
        "jp": "では",
        "reading": "では",
        "fr": "bon alors",
        "context": "では明日その事について彼に尋ねてみます。",
        "contextFr": "Alors je vais le lui demander demain.",
        "hl": "では"
      },
      {
        "jp": "可愛い",
        "reading": "かわいい",
        "fr": "mignon",
        "context": "彼女は綺麗というより可愛い。",
        "contextFr": "Elle est davantage mignonne que belle.",
        "hl": "可愛い"
      },
      {
        "jp": "事件",
        "reading": "じけん",
        "fr": "incident",
        "context": "彼はその事件とは全然関係がなかった。",
        "contextFr": "Il n'avait rien à voir avec l'affaire.",
        "hl": "事件"
      },
      {
        "jp": "空",
        "reading": "そら",
        "fr": "vide",
        "context": "海と魚の関係は空と鳥の関係と同じだ。",
        "contextFr": "La mer est aux poissons ce que le ciel est aux oiseaux.",
        "hl": "空"
      },
      {
        "jp": "様",
        "reading": "さま",
        "fr": "M.",
        "context": "私はその様な美しい動物に会えて嬉しい。",
        "contextFr": "Je suis heureux d'avoir pu rencontrer un animal aussi beau.",
        "hl": "様"
      },
      {
        "jp": "女性",
        "reading": "じょせい",
        "fr": "femme",
        "context": "私は真の大人の女性に会いたいと思った。",
        "contextFr": "Je voulais rencontrer une femme vraiment mature.",
        "hl": "女性"
      },
      {
        "jp": "情報",
        "reading": "じょうほう",
        "fr": "information",
        "context": "彼は情報を提供してくれると約束した。",
        "contextFr": "Il promit de fournir des informations.",
        "hl": "情報"
      },
      {
        "jp": "勝つ",
        "reading": "かつ",
        "fr": "gagner",
        "context": "彼は勝って見せると言ったが確かに勝った。",
        "contextFr": "Il a dit qu'il gagnerait et il l'a fait, aussi.",
        "hl": "勝っ"
      },
      {
        "jp": "一つ",
        "reading": "ひとつ",
        "fr": "un (objet)",
        "context": "彼の病気は彼女がとても心配していることの一つです。",
        "contextFr": "Sa maladie est une de ses principales inquiétudes.",
        "hl": "一つ"
      },
      {
        "jp": "二つ",
        "reading": "ふたつ",
        "fr": "deux (objets)",
        "context": "私はお茶を二つとコーヒーを三つ注文した。",
        "contextFr": "J'ai commandé deux thés et trois cafés.",
        "hl": "二つ"
      },
      {
        "jp": "三つ",
        "reading": "みっつ",
        "fr": "trois (objets)",
        "context": "一つ、二つ、三つ、四つ、五つ、六つ、七つ、八つ、九つ、十。",
        "contextFr": "Un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.",
        "hl": "三つ"
      },
      {
        "jp": "四つ",
        "reading": "よっつ",
        "fr": "quatre (objets)",
        "context": "日本は四つの主な島から成り立っている。",
        "contextFr": "Le Japon se compose de quatre îles principales.",
        "hl": "四つ"
      },
      {
        "jp": "五つ",
        "reading": "いつつ",
        "fr": "cinq (objets)",
        "context": "この箱にはりんごが五つ入っている。",
        "contextFr": "Cette boîte contient cinq pommes.",
        "hl": "五つ"
      },
      {
        "jp": "六つ",
        "reading": "むっつ",
        "fr": "six (objets)",
        "context": "そして次に、州についてですが、どんな州でもいいですから、その州が五つか六つの地域に分かれていると考えてください。",
        "contextFr": "Et maintenant, représente-toi un comté, n'importe lequel, et imagine que ce comté est divisé en cinq ou six zones différentes.",
        "hl": "六つ"
      },
      {
        "jp": "七つ",
        "reading": "ななつ",
        "fr": "sept (objets)",
        "context": "一つ、二つ、三つ、四つ、五つ、六つ、七つ、八つ、九つ、十。",
        "contextFr": "Un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.",
        "hl": "七つ"
      },
      {
        "jp": "八つ",
        "reading": "やっつ",
        "fr": "huit (objets)",
        "context": "彼女は八つだ。",
        "contextFr": "Elle a 8 ans.",
        "hl": "八つ"
      },
      {
        "jp": "九つ",
        "reading": "ここのつ",
        "fr": "neuf (objets)",
        "context": "一つ、二つ、三つ、四つ、五つ、六つ、七つ、八つ、九つ、十。",
        "contextFr": "Un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.",
        "hl": "九つ"
      },
      {
        "jp": "逃げる",
        "reading": "にげる",
        "fr": "s'enfuir",
        "context": "危険な状態にあるとき、彼らは逃げます。",
        "contextFr": "Lorsqu'ils sont en danger, ils s'enfuient.",
        "hl": "逃げ"
      },
      {
        "jp": "警察",
        "reading": "けいさつ",
        "fr": "police",
        "context": "「誰か警察に電話したの？」「私がしました」",
        "contextFr": "« Quelqu'un a-t-il téléphoné à la police ? » « Oui, moi. »",
        "hl": "警察"
      },
      {
        "jp": "最初",
        "reading": "さいしょ",
        "fr": "début",
        "context": "彼女は私に誰が最初に着いたのと聞いた。",
        "contextFr": "Elle m'a demandé qui était arrivé en premier.",
        "hl": "最初"
      },
      {
        "jp": "負ける",
        "reading": "まける",
        "fr": "perdre",
        "context": "この試合には負けたくない。",
        "contextFr": "Je ne veux pas perdre ce match.",
        "hl": "負け"
      },
      {
        "jp": "ずっと",
        "reading": "ずっと",
        "fr": "continuellement",
        "context": "彼は１週間前からずっとここに住んでいます。",
        "contextFr": "Il habite ici depuis une semaine.",
        "hl": "ずっと"
      },
      {
        "jp": "これから",
        "reading": "これから",
        "fr": "à partir de maintenant",
        "context": "これから帰ります。",
        "contextFr": "Je vais à la maison maintenant.",
        "hl": "これから"
      },
      {
        "jp": "建てる",
        "reading": "たてる",
        "fr": "construire",
        "context": "彼はそれらの家をだれが建てたのか知らない。",
        "contextFr": "Il ne sait pas qui a construit ces maisons.",
        "hl": "建て"
      },
      {
        "jp": "日記",
        "reading": "にっき",
        "fr": "journal intime",
        "context": "私は三十年間父がつけた日記を見つけた。",
        "contextFr": "J'ai trouvé le journal que mon père a tenu pendant 30 ans.",
        "hl": "日記"
      },
      {
        "jp": "準備",
        "reading": "じゅんび",
        "fr": "préparation",
        "context": "この試験のためによく準備した。",
        "contextFr": "Je me suis bien préparé pour cet examen.",
        "hl": "準備"
      },
      {
        "jp": "降りる",
        "reading": "おりる",
        "fr": "descendre",
        "context": "彼はエレベーターが降りてくるのを待った。",
        "contextFr": "Il attendit que l'ascenseur descende.",
        "hl": "降り"
      },
      {
        "jp": "洗う",
        "reading": "あらう",
        "fr": "laver",
        "context": "私の仕事は父の車を洗うことです。",
        "contextFr": "Mon travail est de laver la voiture de mon père.",
        "hl": "洗う"
      },
      {
        "jp": "パート",
        "reading": "パート",
        "fr": "travail à temps partiel",
        "context": "母はスーパーでパートをしています。",
        "contextFr": "Ma mère travaille à temps partiel dans un supermarché.",
        "hl": "パート"
      },
      {
        "jp": "無理",
        "reading": "むり",
        "fr": "impossible",
        "context": "アメリカへの旅行は今年の夏はとても無理だ。",
        "contextFr": "Un voyage en Amérique, cet été, est hors de question.",
        "hl": "無理"
      },
      {
        "jp": "今夜",
        "reading": "こんや",
        "fr": "ce soir",
        "context": "今夜は温泉に入りたい気分だ。",
        "contextFr": "J'ai envie de prendre un bain thermal ce soir.",
        "hl": "今夜"
      },
      {
        "jp": "誰か",
        "reading": "だれか",
        "fr": "quelqu'un",
        "context": "ドアを閉じるとすぐに誰かがノックし始めた。",
        "contextFr": "J'avais à peine fermé la porte que quelqu'un frappa.",
        "hl": "誰か"
      },
      {
        "jp": "履く",
        "reading": "はく",
        "fr": "porter",
        "context": "彼女は古い靴を脱いで新しい靴を履きました。",
        "contextFr": "Elle retira ses vieilles chaussures et passa les nouvelles.",
        "hl": "履き"
      },
      {
        "jp": "受ける",
        "reading": "うける",
        "fr": "recevoir",
        "context": "彼女は英語の試験を受けた。",
        "contextFr": "Elle a passé un examen d'anglais.",
        "hl": "受け"
      },
      {
        "jp": "危険",
        "reading": "きけん",
        "fr": "danger",
        "context": "『危険な関係』を読んだことがありますか？",
        "contextFr": "Avez-vous lu \"Les Liaisons dangereuses\"?",
        "hl": "危険"
      },
      {
        "jp": "方法",
        "reading": "ほうほう",
        "fr": "méthode",
        "context": "船に乗って行く以外には、その島へ行く方法はない。",
        "contextFr": "Il n'y a pas d'autre moyen d'atteindre l'île qu'en bateau.",
        "hl": "方法"
      },
      {
        "jp": "ママ",
        "reading": "ママ",
        "fr": "maman",
        "context": "もしママが僕らにお金くれなかったらどうする？",
        "contextFr": "Que ferons-nous si Maman ne nous donne pas l'argent ?",
        "hl": "ママ"
      },
      {
        "jp": "庭",
        "reading": "にわ",
        "fr": "jardin",
        "context": "うちの庭には小さな池がある。",
        "contextFr": "Il y a un petit étang dans notre jardin.",
        "hl": "庭"
      },
      {
        "jp": "今度",
        "reading": "こんど",
        "fr": "cette fois",
        "context": "彼女は今度の日曜日にニューヨークへ出発します。",
        "contextFr": "Elle part pour New-York dimanche prochain.",
        "hl": "今度"
      },
      {
        "jp": "指",
        "reading": "ゆび",
        "fr": "doigt",
        "context": "指を切りました。",
        "contextFr": "Je viens de me couper le doigt.",
        "hl": "指"
      },
      {
        "jp": "眼鏡",
        "reading": "めがね",
        "fr": "lunettes",
        "context": "その眼鏡はいくらだったの？",
        "contextFr": "À combien étaient ces lunettes ?",
        "hl": "眼鏡"
      },
      {
        "jp": "変",
        "reading": "へん",
        "fr": "étrange",
        "context": "彼女がまだ来ていないのは変だと思います。",
        "contextFr": "Il est étrange qu'elle ne soit pas encore arrivée.",
        "hl": "変"
      },
      {
        "jp": "状況",
        "reading": "じょうきょう",
        "fr": "situation",
        "context": "状況を改善するのを手伝ってくれてありがとう。",
        "contextFr": "Merci de m'avoir aidé à corriger la situation.",
        "hl": "状況"
      },
      {
        "jp": "下手",
        "reading": "へた",
        "fr": "mauvais en",
        "context": "彼は名前を覚えるのが下手だ。",
        "contextFr": "Il n'est pas doué pour retenir les noms.",
        "hl": "下手"
      },
      {
        "jp": "お手洗い",
        "reading": "おてあらい",
        "fr": "toilettes",
        "context": "お手洗いはどこですか。",
        "contextFr": "Où sont les toilettes ?",
        "hl": "お手洗い"
      },
      {
        "jp": "厳しい",
        "reading": "きびしい",
        "fr": "strict",
        "context": "父は私にはとても厳しい。",
        "contextFr": "Mon père est très sévère avec moi.",
        "hl": "厳しい"
      },
      {
        "jp": "ある",
        "reading": "ある",
        "fr": "exister",
        "context": "昔はここに広い公園があったものだ。",
        "contextFr": "Un grand parc se trouvait ici, autrefois.",
        "hl": "あっ"
      },
      {
        "jp": "答え",
        "reading": "こたえ",
        "fr": "réponse",
        "context": "その２つの答えはどちらも正しくない。",
        "contextFr": "Aucune de ces deux réponses n'est correcte.",
        "hl": "答え"
      },
      {
        "jp": "分",
        "reading": "ふん",
        "fr": "minute",
        "context": "僕のアパートは駅から５分です。",
        "contextFr": "Mon appartement est à cinq minutes de la gare.",
        "hl": "分"
      },
      {
        "jp": "残念",
        "reading": "ざんねん",
        "fr": "regrettable",
        "context": "あなたがパーティーに来られないのは残念だ。",
        "contextFr": "C'est dommage que vous ne pouvez pas venir à la fête.",
        "hl": "残念"
      },
      {
        "jp": "気分",
        "reading": "きぶん",
        "fr": "humeur",
        "context": "今はテレビを見る気分じゃない。",
        "contextFr": "Je ne suis pas d'humeur à regarder de la télé là.",
        "hl": "気分"
      },
      {
        "jp": "綺麗",
        "reading": "きれい",
        "fr": "joli",
        "context": "アンはいつも自分の部屋を綺麗にしている。",
        "contextFr": "Ann tient toujours sa chambre propre.",
        "hl": "綺麗"
      },
      {
        "jp": "大切",
        "reading": "たいせつ",
        "fr": "important",
        "context": "自分の人生より、家族の方が大切なの。",
        "contextFr": "Ma famille est plus importante que ma vie.",
        "hl": "大切"
      },
      {
        "jp": "驚く",
        "reading": "おどろく",
        "fr": "être surpris",
        "context": "ニュースを聞いて、とても驚きました。",
        "contextFr": "J'ai été très surpris de ces nouvelles.",
        "hl": "驚き"
      },
      {
        "jp": "絶対",
        "reading": "ぜったい",
        "fr": "absolu",
        "context": "私は彼に絶対に会いたくありません。",
        "contextFr": "Je ne veux absolument pas le rencontrer.",
        "hl": "絶対"
      },
      {
        "jp": "犬",
        "reading": "いぬ",
        "fr": "chien",
        "context": "「あなたは何が欲しいですか」「犬が欲しいです」",
        "contextFr": "« Qu'est-ce que tu veux ? » « Je veux un chien. »",
        "hl": "犬"
      },
      {
        "jp": "勤める",
        "reading": "つとめる",
        "fr": "travailler pour",
        "context": "私は、旅行会社に勤めています。",
        "contextFr": "Je travaille pour une agence de voyage.",
        "hl": "勤め"
      },
      {
        "jp": "丈夫",
        "reading": "じょうぶ",
        "fr": "solide",
        "context": "彼は丈夫で健康そうに見える。",
        "contextFr": "Il semble être fort et en bonne santé.",
        "hl": "丈夫"
      },
      {
        "jp": "急ぐ",
        "reading": "いそぐ",
        "fr": "se dépêcher",
        "context": "彼女はそんなに急いで行く必要はなかったのに。",
        "contextFr": "Il n'était pas nécessaire qu'elle se presse.",
        "hl": "急い"
      },
      {
        "jp": "眠い",
        "reading": "ねむい",
        "fr": "avoir sommeil",
        "context": "彼はとても眠そうだ。",
        "contextFr": "Il a l'air d'avoir très sommeil.",
        "hl": "眠"
      },
      {
        "jp": "許す",
        "reading": "ゆるす",
        "fr": "pardonner",
        "context": "母は私が映画に行くのを許してくれた。",
        "contextFr": "Ma mère m'a autorisée à aller au cinéma.",
        "hl": "許し"
      },
      {
        "jp": "止まる",
        "reading": "とまる",
        "fr": "s'arrêter",
        "context": "バスが止まったが、誰も降りなかった。",
        "contextFr": "Le bus s'est arrêté mais personne n'en est sorti.",
        "hl": "止まっ"
      },
      {
        "jp": "降る",
        "reading": "ふる",
        "fr": "tomber (pluie",
        "context": "この季節はたくさん雪が降る。",
        "contextFr": "Il neige beaucoup pendant cette saison.",
        "hl": "降る"
      },
      {
        "jp": "町",
        "reading": "まち",
        "fr": "ville",
        "context": "君の町にいくつ学校がありますか。",
        "contextFr": "Combien d'écoles y a-t-il dans votre ville ?",
        "hl": "町"
      },
      {
        "jp": "お菓子",
        "reading": "おかし",
        "fr": "sucreries",
        "context": "このお菓子は甘いです。",
        "contextFr": "Ces friandises sont sucrées.",
        "hl": "お菓子"
      },
      {
        "jp": "夢",
        "reading": "ゆめ",
        "fr": "rêve",
        "context": "愛とは夢にまで彼女を見ることだ。",
        "contextFr": "L'amour, c'est de la voir même dans ses rêves.",
        "hl": "夢"
      },
      {
        "jp": "伝える",
        "reading": "つたえる",
        "fr": "dire",
        "context": "私にはとても彼に事実を伝える勇気はなかった。",
        "contextFr": "Je n'avais pas le cœur de lui dire la vérité.",
        "hl": "伝える"
      },
      {
        "jp": "歳",
        "reading": "さい",
        "fr": "âge",
        "context": "日本では十八歳になると車を運転できます。",
        "contextFr": "Au Japon, on peut conduire lorsque l'on atteint 18 ans.",
        "hl": "歳"
      },
      {
        "jp": "実は",
        "reading": "じつは",
        "fr": "en fait",
        "context": "実は、君の髪型は好きじゃない。",
        "contextFr": "En réalité, je n'aime pas ta coiffure.",
        "hl": "実は"
      },
      {
        "jp": "つける",
        "reading": "つける",
        "fr": "attacher",
        "context": "私はニュースを聞くためにラジオをつけた。",
        "contextFr": "J'ai allumé la radio pour écouter les nouvelles.",
        "hl": "つけ"
      },
      {
        "jp": "合う",
        "reading": "あう",
        "fr": "correspondre",
        "context": "私はこの点であなたと意見が合わない。",
        "contextFr": "Je ne suis pas d'accord avec vous à ce sujet.",
        "hl": "合わ"
      },
      {
        "jp": "大事",
        "reading": "だいじ",
        "fr": "important",
        "context": "それは一番大事なことです。",
        "contextFr": "C'est la chose la plus importante.",
        "hl": "大事"
      },
      {
        "jp": "嫌",
        "reading": "いや",
        "fr": "déplaisant",
        "context": "私は周りのみんなが自分を見ているような嫌な感じがしている。",
        "contextFr": "J'ai l'impression désagréable que tout le monde me dévisage.",
        "hl": "嫌"
      },
      {
        "jp": "フォーク",
        "reading": "フォーク",
        "fr": "fourchette",
        "context": "フォークがテーブルから落ちた。",
        "contextFr": "Une fourchette est tombée de la table.",
        "hl": "フォーク"
      }
    ]
  },
  {
    "id": "essentiels-7",
    "name": "Les 1000 · 481 à 560",
    "emoji": "💼",
    "words": [
      {
        "jp": "スプーン",
        "reading": "スプーン",
        "fr": "cuillère",
        "context": "スプーンをいただけますか。",
        "contextFr": "Pourrais-je avoir une cuillère ?",
        "hl": "スプーン"
      },
      {
        "jp": "簡単",
        "reading": "かんたん",
        "fr": "facile",
        "context": "僕の国で仕事を見つけるのは簡単なことじゃない。",
        "contextFr": "Il n'est pas facile de trouver du travail dans mon pays.",
        "hl": "簡単"
      },
      {
        "jp": "パパ",
        "reading": "パパ",
        "fr": "papa",
        "context": "パパは私たちのアパートの下の事務所にいたのよ。",
        "contextFr": "Papa était dans son bureau en dessous de notre appartement.",
        "hl": "パパ"
      },
      {
        "jp": "関係",
        "reading": "かんけい",
        "fr": "relation",
        "context": "彼はその運動に関係があるのですか。",
        "contextFr": "A-t-il un rapport quelconque avec cette activité ?",
        "hl": "関係"
      },
      {
        "jp": "ほとんど",
        "reading": "ほとんど",
        "fr": "presque",
        "context": "私は彼の言っていることがほとんど理解できない。",
        "contextFr": "Je peux à peine comprendre ce qu'il dit.",
        "hl": "ほとんど"
      },
      {
        "jp": "動かす",
        "reading": "うごかす",
        "fr": "déplacer",
        "context": "この机を動かすのを手伝ってくれませんか。",
        "contextFr": "Pouvez-vous m'aider à déplacer ce bureau ?",
        "hl": "動かす"
      },
      {
        "jp": "壊れる",
        "reading": "こわれる",
        "fr": "se casser",
        "context": "彼は、私の家の壊れた窓を直した。",
        "contextFr": "Il a réparé la fenêtre brisée de ma maison.",
        "hl": "壊れ"
      },
      {
        "jp": "止める",
        "reading": "とめる",
        "fr": "arrêter",
        "context": "彼はタクシーを止めるために手を上げた。",
        "contextFr": "Il leva la main pour arrêter un taxi.",
        "hl": "止める"
      },
      {
        "jp": "客",
        "reading": "きゃく",
        "fr": "invité",
        "context": "その店には客は１０人以上はいなかった。",
        "contextFr": "Il n'y avait pas plus de dix clients dans ce magasin.",
        "hl": "客"
      },
      {
        "jp": "風呂",
        "reading": "ふろ",
        "fr": "bain",
        "context": "彼は風呂に入り、テレビをつけた。",
        "contextFr": "Il prit un bain chaud et alluma la télé.",
        "hl": "風呂"
      },
      {
        "jp": "湯",
        "reading": "ゆ",
        "fr": "eau chaude",
        "context": "風呂に湯を入れる。",
        "contextFr": "Fais couler de l'eau chaude dans le bain.",
        "hl": "湯"
      },
      {
        "jp": "靴下",
        "reading": "くつした",
        "fr": "chaussettes",
        "context": "靴下はもう乾いたのですか。",
        "contextFr": "Mes chaussettes sont-elles déjà sèches ?",
        "hl": "靴下"
      },
      {
        "jp": "理由",
        "reading": "りゆう",
        "fr": "raison",
        "context": "私は彼が欠席した本当の理由を知っている。",
        "contextFr": "Je connais la véritable raison de son absence.",
        "hl": "理由"
      },
      {
        "jp": "結果",
        "reading": "けっか",
        "fr": "résultat",
        "context": "彼女は息子のテスト結果がどうなるかと心配している。",
        "contextFr": "Elle s'inquiète des résultats du test de son fils.",
        "hl": "結果"
      },
      {
        "jp": "雲",
        "reading": "くも",
        "fr": "nuage",
        "context": "雲がだんだん黒くなって、雨が降りそうです。",
        "contextFr": "Les nuages s'assombrissent, il va pleuvoir.",
        "hl": "雲"
      },
      {
        "jp": "もし",
        "reading": "もし",
        "fr": "si",
        "context": "もし私があなただったらそれをしないでしょう。",
        "contextFr": "Je ne le ferais pas si j'étais à ta place.",
        "hl": "もし"
      },
      {
        "jp": "人気",
        "reading": "にんき",
        "fr": "popularité",
        "context": "この曲は日本でとても人気がある。",
        "contextFr": "Cette chanson est très populaire au Japon.",
        "hl": "人気"
      },
      {
        "jp": "普通",
        "reading": "ふつう",
        "fr": "ordinaire",
        "context": "彼は普通の学生じゃない。",
        "contextFr": "Il sort de l'ordinaire en tant qu'élève.",
        "hl": "普通"
      },
      {
        "jp": "確認",
        "reading": "かくにん",
        "fr": "confirmation",
        "context": "３０日の予約を確認したいのですが。",
        "contextFr": "J'aimerais confirmer ma réservation pour le 30.",
        "hl": "確認"
      },
      {
        "jp": "はっきり",
        "reading": "はっきり",
        "fr": "clairement",
        "context": "彼は満足だとはっきり言った。",
        "contextFr": "Il a affirmé clairement qu'il était satisfait.",
        "hl": "はっきり"
      },
      {
        "jp": "似る",
        "reading": "にる",
        "fr": "ressembler à",
        "context": "彼女はおばあさんに大変よく似ている。",
        "contextFr": "Elle ressemble fortement à sa grand-mère.",
        "hl": "似"
      },
      {
        "jp": "回",
        "reading": "かい",
        "fr": "fois (compteur d'occurrences)",
        "context": "彼の父は１週間に２回そこで食べる。",
        "contextFr": "Son père mange là deux fois par semaine.",
        "hl": "回"
      },
      {
        "jp": "間",
        "reading": "あいだ",
        "fr": "entre",
        "context": "あなたが寝ている間に、私は本を読む。",
        "contextFr": "Je vais lire un livre pendant que tu dors.",
        "hl": "間"
      },
      {
        "jp": "喧嘩",
        "reading": "けんか",
        "fr": "dispute",
        "context": "彼は子供のことで妻と喧嘩した。",
        "contextFr": "Il s'est querellé avec son épouse au sujet des enfants.",
        "hl": "喧嘩"
      },
      {
        "jp": "郵便局",
        "reading": "ゆうびんきょく",
        "fr": "bureau de poste",
        "context": "郵便局で切手を買います。",
        "contextFr": "J’achète des timbres à la poste.",
        "hl": "郵便局"
      },
      {
        "jp": "遅れる",
        "reading": "おくれる",
        "fr": "être en retard",
        "context": "彼女は雨の日にはよく学校に遅れます。",
        "contextFr": "Elle est souvent en retard à l'école les jours de pluie.",
        "hl": "遅れ"
      },
      {
        "jp": "生徒",
        "reading": "せいと",
        "fr": "élève",
        "context": "クラスのどの生徒もその事実を知っている。",
        "contextFr": "Tous les élèves dans la classe connaissent les faits.",
        "hl": "生徒"
      },
      {
        "jp": "約束",
        "reading": "やくそく",
        "fr": "promesse",
        "context": "約束を守ることは大切なことだと私は思っている。",
        "contextFr": "Pour moi, tenir ses promesses est quelque chose de crucial.",
        "hl": "約束"
      },
      {
        "jp": "切手",
        "reading": "きって",
        "fr": "timbre (postal)",
        "context": "切手をたくさん集めています。",
        "contextFr": "J'ai une grande collection de timbres.",
        "hl": "切手"
      },
      {
        "jp": "涼しい",
        "reading": "すずしい",
        "fr": "frais",
        "context": "天気予報では、明日は涼しくなるそうだ。",
        "contextFr": "Selon la météo, le temps se rafraîchit demain.",
        "hl": "涼しく"
      },
      {
        "jp": "話し合う",
        "reading": "はなしあう",
        "fr": "discuter",
        "context": "何したらいいか話し合った。",
        "contextFr": "Nous avons discuté de ce que nous devrions faire.",
        "hl": "話し合っ"
      },
      {
        "jp": "晴れ",
        "reading": "はれ",
        "fr": "beau temps",
        "context": "晴れた日には遠くに富士山が見えます。",
        "contextFr": "Par beau temps, on peut voir le mont Fuji de loin.",
        "hl": "晴れ"
      },
      {
        "jp": "曇り",
        "reading": "くもり",
        "fr": "temps nuageux",
        "context": "昨日は曇りだった。",
        "contextFr": "Il y avait des nuages, hier.",
        "hl": "曇り"
      },
      {
        "jp": "残す",
        "reading": "のこす",
        "fr": "laisser",
        "context": "彼は息子に一財産を残して死んだ。",
        "contextFr": "Il a laissé une fortune à son fils.",
        "hl": "残し"
      },
      {
        "jp": "手紙",
        "reading": "てがみ",
        "fr": "lettre",
        "context": "彼女は彼からの手紙を何度も何度も読んだ。",
        "contextFr": "Elle a lu sa lettre à maintes reprises.",
        "hl": "手紙"
      },
      {
        "jp": "動物",
        "reading": "どうぶつ",
        "fr": "animal",
        "context": "この動物は日本語で何と言いますか。",
        "contextFr": "Comment appelez-vous cet animal en japonais ?",
        "hl": "動物"
      },
      {
        "jp": "当たる",
        "reading": "あたる",
        "fr": "toucher (une cible)",
        "context": "福引きでカメラが当たった。",
        "contextFr": "J'ai gagné un appareil photo à la loterie.",
        "hl": "当たっ"
      },
      {
        "jp": "星",
        "reading": "ほし",
        "fr": "étoile",
        "context": "空に数千の星を見ることができる。",
        "contextFr": "On peut voir des milliers d'étoiles dans le ciel.",
        "hl": "星"
      },
      {
        "jp": "集まる",
        "reading": "あつまる",
        "fr": "se rassembler",
        "context": "何千人もの人々がそこに集まった。",
        "contextFr": "Des milliers de personnes se rassemblèrent là.",
        "hl": "集まっ"
      },
      {
        "jp": "船",
        "reading": "ふね",
        "fr": "bateau",
        "context": "島のそばにあるあの船が見えますか。",
        "contextFr": "Vois-tu ce bateau près de l'île ?",
        "hl": "船"
      },
      {
        "jp": "少年",
        "reading": "しょうねん",
        "fr": "jeune homme",
        "context": "あなたが知らないあの少年を私は知っている。",
        "contextFr": "Je connais ce garçon dont tu ne sais rien.",
        "hl": "少年"
      },
      {
        "jp": "孫",
        "reading": "まご",
        "fr": "petit-enfant",
        "context": "孫はいないよ。",
        "contextFr": "Je n’ai pas de petits-enfants.",
        "hl": "孫"
      },
      {
        "jp": "並ぶ",
        "reading": "ならぶ",
        "fr": "faire la queue",
        "context": "こちらに並んでお待ちください。",
        "contextFr": "Je vous demanderais de faire la queue ici.",
        "hl": "並ん"
      },
      {
        "jp": "高校",
        "reading": "こうこう",
        "fr": "lycée",
        "context": "彼は高校時代からずっとチェスをし続けている。",
        "contextFr": "Il joue aux échecs depuis qu'il est au Lycée.",
        "hl": "高校"
      },
      {
        "jp": "付く",
        "reading": "つく",
        "fr": "coller à",
        "context": "靴の底にガムが付いてしまった。",
        "contextFr": "Du chewing-gum s'est collé à ma semelle.",
        "hl": "付い"
      },
      {
        "jp": "卒業",
        "reading": "そつぎょう",
        "fr": "obtention du diplôme",
        "context": "大学を卒業して５年になる。",
        "contextFr": "Cela fait 5 ans que je suis diplômé de l'université.",
        "hl": "卒業"
      },
      {
        "jp": "社長",
        "reading": "しゃちょう",
        "fr": "président (d'entreprise)",
        "context": "彼はついにＩＢＭの社長になった。",
        "contextFr": "Il est finalement devenu le président d'IBM.",
        "hl": "社長"
      },
      {
        "jp": "選手",
        "reading": "せんしゅ",
        "fr": "athlète",
        "context": "彼は大人になったらテニスの選手になりたいと思っている。",
        "contextFr": "Il veut être joueur de tennis plus tard.",
        "hl": "選手"
      },
      {
        "jp": "辞書",
        "reading": "じしょ",
        "fr": "dictionnaire",
        "context": "私は君の弟と同じ辞書を持っている。",
        "contextFr": "J'ai le même dictionnaire que votre frère.",
        "hl": "辞書"
      },
      {
        "jp": "建物",
        "reading": "たてもの",
        "fr": "bâtiment",
        "context": "彼女はその建物の前で待っていた。",
        "contextFr": "Elle attendait devant le bâtiment.",
        "hl": "建物"
      },
      {
        "jp": "料理",
        "reading": "りょうり",
        "fr": "cuisine",
        "context": "彼女は家族のために料理するのが好きです。",
        "contextFr": "Elle aime cuisiner pour sa famille.",
        "hl": "料理"
      },
      {
        "jp": "一昨日",
        "reading": "おととい",
        "fr": "avant-hier",
        "context": "一昨日あなたの手紙を受け取りました。",
        "contextFr": "J'ai reçu ta lettre avant-hier.",
        "hl": "一昨日"
      },
      {
        "jp": "明後日",
        "reading": "あさって",
        "fr": "après-demain",
        "context": "彼らは明後日パーティーを開くつもりだ。",
        "contextFr": "Ils vont faire une fête après-demain.",
        "hl": "明後日"
      },
      {
        "jp": "連絡",
        "reading": "れんらく",
        "fr": "contact",
        "context": "連絡するなら電話でお願いします。",
        "contextFr": "Si tu veux me contacter, fais le par téléphone.",
        "hl": "連絡"
      },
      {
        "jp": "村",
        "reading": "むら",
        "fr": "village",
        "context": "私が村に着いたのは暗くなってからだった。",
        "contextFr": "Il faisait nuit quand nous sommes arrivés au village.",
        "hl": "村"
      },
      {
        "jp": "鞄",
        "reading": "かばん",
        "fr": "sac",
        "context": "あの女の人は鞄を２つ持っています。",
        "contextFr": "Cette femme a deux sacs.",
        "hl": "鞄"
      },
      {
        "jp": "残る",
        "reading": "のこる",
        "fr": "rester",
        "context": "彼女は行くか残るかどちらかだった。",
        "contextFr": "Elle avait le choix entre partir ou rester.",
        "hl": "残る"
      },
      {
        "jp": "当然",
        "reading": "とうぜん",
        "fr": "bien sûr",
        "context": "彼がホームシックになるのは当然だと思った。",
        "contextFr": "J'ai pensé qu'il était naturel qu'il ait le mal du pays.",
        "hl": "当然"
      },
      {
        "jp": "家庭",
        "reading": "かてい",
        "fr": "foyer",
        "context": "夫は家を作り、妻は家庭を作る。",
        "contextFr": "Les hommes font les maisons, les femmes fondent les foyers.",
        "hl": "家庭"
      },
      {
        "jp": "返す",
        "reading": "かえす",
        "fr": "rendre",
        "context": "彼は私にそのお金を返してくれると約束した。",
        "contextFr": "Il m'a promis de rembourser l'argent.",
        "hl": "返し"
      },
      {
        "jp": "機械",
        "reading": "きかい",
        "fr": "machine",
        "context": "誰がその機械を発明したのか知っていますか。",
        "contextFr": "Sais-tu qui a inventé cette machine ?",
        "hl": "機械"
      },
      {
        "jp": "ちょうど",
        "reading": "ちょうど",
        "fr": "exactement",
        "context": "それはちょうど私が欲しいと思っているものだ。",
        "contextFr": "C'est exactement ce que je veux.",
        "hl": "ちょうど"
      },
      {
        "jp": "聞こえる",
        "reading": "きこえる",
        "fr": "être audible",
        "context": "誰かが私の名前を呼んでいるのが聞こえた。",
        "contextFr": "J'entendis quelqu'un appeler mon nom.",
        "hl": "聞こえ"
      },
      {
        "jp": "賑やか",
        "reading": "にぎやか",
        "fr": "animé",
        "context": "この通りは夜も賑やかです。",
        "contextFr": "Cette rue est animée même la nuit.",
        "hl": "賑やか"
      },
      {
        "jp": "困る",
        "reading": "こまる",
        "fr": "être embarrassé",
        "context": "困ったことがおきるのではないかと気をもむことがある。",
        "contextFr": "J'appréhende parfois qu'il y ait des difficultés.",
        "hl": "困っ"
      },
      {
        "jp": "進む",
        "reading": "すすむ",
        "fr": "avancer",
        "context": "時計は１０分進んでいる。",
        "contextFr": "Ma montre avance de dix minutes.",
        "hl": "進ん"
      },
      {
        "jp": "成功",
        "reading": "せいこう",
        "fr": "succès",
        "context": "彼女は仕事で素晴らしい成功を手に入れた。",
        "contextFr": "Elle a rencontré beaucoup de succès au travail.",
        "hl": "成功"
      },
      {
        "jp": "直接",
        "reading": "ちょくせつ",
        "fr": "directement",
        "context": "なぜ、彼女に直接言わないの。",
        "contextFr": "Pourquoi ne pas lui en parler directement ?",
        "hl": "直接"
      },
      {
        "jp": "皆さん",
        "reading": "みなさん",
        "fr": "tout le monde",
        "context": "皆さんおはよう。",
        "contextFr": "Bonjour tout le monde.",
        "hl": "皆さん"
      },
      {
        "jp": "特に",
        "reading": "とくに",
        "fr": "surtout",
        "context": "私は今話したいことは特にない。",
        "contextFr": "Je n'ai rien de particulier à dire maintenant.",
        "hl": "特に"
      },
      {
        "jp": "説明",
        "reading": "せつめい",
        "fr": "explication",
        "context": "どうして彼が嫌いなのか説明してくれない？",
        "contextFr": "Peux-tu m'expliquer pourquoi tu ne l'aimes pas ?",
        "hl": "説明"
      },
      {
        "jp": "運ぶ",
        "reading": "はこぶ",
        "fr": "porter",
        "context": "彼女は一人でそのテーブルを運んだ。",
        "contextFr": "Elle a transporté cette table toute seule.",
        "hl": "運ん"
      },
      {
        "jp": "半分",
        "reading": "はんぶん",
        "fr": "moitié",
        "context": "この推理小説はまだ半分も読んでない。",
        "contextFr": "Je suis à la moitié de ce roman policier.",
        "hl": "半分"
      },
      {
        "jp": "直す",
        "reading": "なおす",
        "fr": "réparer",
        "context": "彼は私の時計を直すのを手伝ってくれた。",
        "contextFr": "Il m'aida à réparer ma montre.",
        "hl": "直す"
      },
      {
        "jp": "愛",
        "reading": "あい",
        "fr": "amour",
        "context": "彼女への愛に我を忘れていたのは事実だ。",
        "contextFr": "Il est vrai que j'étais fou amoureux d'elle.",
        "hl": "愛"
      },
      {
        "jp": "反対",
        "reading": "はんたい",
        "fr": "opposition",
        "context": "その村のほとんどの人がその計画に反対した。",
        "contextFr": "La plupart des habitants de ce village se sont opposés à ce projet.",
        "hl": "反対"
      },
      {
        "jp": "醤油",
        "reading": "しょうゆ",
        "fr": "sauce soja",
        "context": "同社は醤油その他の食品を生産する。",
        "contextFr": "L'entreprise produit de la sauce soja et d'autres produits alimentaires.",
        "hl": "醤油"
      },
      {
        "jp": "理解",
        "reading": "りかい",
        "fr": "compréhension",
        "context": "この状態を理解していますか？",
        "contextFr": "Est-ce que vous comprenez la situation ?",
        "hl": "理解"
      },
      {
        "jp": "場合",
        "reading": "ばあい",
        "fr": "cas",
        "context": "この規則はその場合には当てはまらない。",
        "contextFr": "Cette règle ne s'applique pas au cas.",
        "hl": "場合"
      },
      {
        "jp": "あんな",
        "reading": "あんな",
        "fr": "tel",
        "context": "あんなものを読んだのは時間の無駄だった。",
        "contextFr": "Je n'aurais pas dû perdre mon temps à lire ça.",
        "hl": "あんな"
      }
    ]
  },
  {
    "id": "essentiels-8",
    "name": "Les 1000 · 561 à 640",
    "emoji": "🌿",
    "words": [
      {
        "jp": "お祝い",
        "reading": "おいわい",
        "fr": "célébration",
        "context": "彼の７０歳の誕生日のお祝いにパーティーを開いた。",
        "contextFr": "Nous avons fait une fête pour célébrer son 70e anniversaire.",
        "hl": "お祝い"
      },
      {
        "jp": "アパート",
        "reading": "アパート",
        "fr": "immeuble",
        "context": "彼女は４部屋のアパートを借りた。",
        "contextFr": "Elle loua un appartement de quatre pièces.",
        "hl": "アパート"
      },
      {
        "jp": "ホテル",
        "reading": "ホテル",
        "fr": "hôtel",
        "context": "私は駅からホテルまでタクシーで行った。",
        "contextFr": "J'ai pris un taxi pour aller de la gare à l'hôtel.",
        "hl": "ホテル"
      },
      {
        "jp": "必ず",
        "reading": "かならず",
        "fr": "certainement",
        "context": "彼はフランス語を話すと必ず少し間違える。",
        "contextFr": "Il ne peut pas parler le français sans faire quelques fautes.",
        "hl": "必ず"
      },
      {
        "jp": "明るい",
        "reading": "あかるい",
        "fr": "lumineux",
        "context": "君は今日明るい顔をしている。",
        "contextFr": "Tu as l'air gaie aujourd'hui.",
        "hl": "明るい"
      },
      {
        "jp": "ぬるい",
        "reading": "ぬるい",
        "fr": "tiède",
        "context": "風呂が熱すぎるので水を埋めてぬるくする。",
        "contextFr": "Comme le bain est trop chaud je vais couler de l'eau froide pour le refroidir.",
        "hl": "ぬるく"
      },
      {
        "jp": "捨てる",
        "reading": "すてる",
        "fr": "jeter",
        "context": "私は家を買う考えを捨てた。",
        "contextFr": "J'ai abandonné l'idée d'acheter une maison.",
        "hl": "捨て"
      },
      {
        "jp": "渡す",
        "reading": "わたす",
        "fr": "remettre",
        "context": "彼に鍵を渡したことを覚えている。",
        "contextFr": "Je me souviens de lui avoir donné la clé.",
        "hl": "渡し"
      },
      {
        "jp": "テスト",
        "reading": "テスト",
        "fr": "test",
        "context": "最初、私はそのテストに失敗した。",
        "contextFr": "La première fois, j'ai raté le test.",
        "hl": "テスト"
      },
      {
        "jp": "ポスト",
        "reading": "ポスト",
        "fr": "boîte aux lettres",
        "context": "私は、その手紙をポストに入れるのを忘れた。",
        "contextFr": "J'ai oublié de poster la lettre.",
        "hl": "ポスト"
      },
      {
        "jp": "試合",
        "reading": "しあい",
        "fr": "match",
        "context": "試合は全然面白くなかったよ。",
        "contextFr": "Le match n'a pas été intéressant du tout.",
        "hl": "試合"
      },
      {
        "jp": "帽子",
        "reading": "ぼうし",
        "fr": "chapeau",
        "context": "彼女の新しい帽子が私の注意を引いた。",
        "contextFr": "Son nouveau chapeau a attiré mon attention.",
        "hl": "帽子"
      },
      {
        "jp": "元",
        "reading": "もと",
        "fr": "ancien",
        "context": "元妻は３人いるよ。",
        "contextFr": "J'ai trois ex-femmes.",
        "hl": "元"
      },
      {
        "jp": "傘",
        "reading": "かさ",
        "fr": "parapluie",
        "context": "私は傘を持っていたが、友人は持っていなかった。",
        "contextFr": "J'avais un parapluie, mais mon ami n'en avait pas.",
        "hl": "傘"
      },
      {
        "jp": "空気",
        "reading": "くうき",
        "fr": "air",
        "context": "空気と人間との関係は水と魚との関係と同じだ。",
        "contextFr": "L'air est à l'homme ce que l'eau est au poisson.",
        "hl": "空気"
      },
      {
        "jp": "チャンス",
        "reading": "チャンス",
        "fr": "chance",
        "context": "１度だけチャンスが残っている。",
        "contextFr": "Il ne reste qu’une seule chance.",
        "hl": "チャンス"
      },
      {
        "jp": "たくさん",
        "reading": "たくさん",
        "fr": "beaucoup",
        "context": "彼は旅行するためのたくさんのお金を持っていた。",
        "contextFr": "Il avait beaucoup d'argent pour son voyage.",
        "hl": "たくさん"
      },
      {
        "jp": "幸せ",
        "reading": "しあわせ",
        "fr": "bonheur",
        "context": "あなたといると、私は幸せな気分になる。",
        "contextFr": "Lorsque je suis avec toi, je suis heureux.",
        "hl": "幸せ"
      },
      {
        "jp": "経験",
        "reading": "けいけん",
        "fr": "expérience",
        "context": "この仕事では経験がものを言う。",
        "contextFr": "L'expérience compte dans ce travail.",
        "hl": "経験"
      },
      {
        "jp": "二人",
        "reading": "ふたり",
        "fr": "deux personnes",
        "context": "二人で映画を見に行きます。",
        "contextFr": "Nous allons voir un film à deux.",
        "hl": "二人"
      },
      {
        "jp": "安全",
        "reading": "あんぜん",
        "fr": "sécurité",
        "context": "両親は自分の子供たちの安全に責任がある。",
        "contextFr": "Les parents sont responsables de la sécurité de leurs enfants.",
        "hl": "安全"
      },
      {
        "jp": "この頃",
        "reading": "このごろ",
        "fr": "ces temps-ci",
        "context": "この頃、忙しいですか。",
        "contextFr": "Ces temps-ci, tu es occupé ?",
        "hl": "この頃"
      },
      {
        "jp": "結構",
        "reading": "けっこう",
        "fr": "assez",
        "context": "いいえ、結構です。お腹が一杯ですから。",
        "contextFr": "Non, merci. Je suis rassasié.",
        "hl": "結構"
      },
      {
        "jp": "注意",
        "reading": "ちゅうい",
        "fr": "attention",
        "context": "君の言うことにもっと注意を払うべきだ。",
        "contextFr": "Tu devrais faire plus attention à ce que tu dis.",
        "hl": "注意"
      },
      {
        "jp": "努力",
        "reading": "どりょく",
        "fr": "effort",
        "context": "彼らはその問題を解決するために大変努力した。",
        "contextFr": "Ils ont fait un gros effort pour résoudre le problème.",
        "hl": "努力"
      },
      {
        "jp": "鳥",
        "reading": "とり",
        "fr": "oiseau",
        "context": "私は鳥ではないが、鳥になりたい。",
        "contextFr": "Je ne suis pas un oiseau, mais j'aimerais en être un.",
        "hl": "鳥"
      },
      {
        "jp": "地震",
        "reading": "じしん",
        "fr": "tremblement de terre",
        "context": "日本では地震がよく起きます。",
        "contextFr": "Il y a beaucoup de tremblements de terre au Japon.",
        "hl": "地震"
      },
      {
        "jp": "また",
        "reading": "また",
        "fr": "encore",
        "context": "電話はまた故障していた。",
        "contextFr": "Le téléphone était de nouveau en panne.",
        "hl": "また"
      },
      {
        "jp": "手術",
        "reading": "しゅじゅつ",
        "fr": "opération (chirurgicale)",
        "context": "私は手術が成功したと知って安心しました。",
        "contextFr": "Je fus soulagé d'apprendre que l'opération fut un succès.",
        "hl": "手術"
      },
      {
        "jp": "向かう",
        "reading": "むかう",
        "fr": "faire face à",
        "context": "船はまっすぐ北に向かっている。",
        "contextFr": "Le bateau se dirige droit vers le nord.",
        "hl": "向かっ"
      },
      {
        "jp": "撮る",
        "reading": "とる",
        "fr": "prendre (une photo)",
        "context": "ここは写真撮って大丈夫ですか？",
        "contextFr": "Est-il permis de prendre des photos ici ?",
        "hl": "撮っ"
      },
      {
        "jp": "実際",
        "reading": "じっさい",
        "fr": "en fait",
        "context": "実際の値段は思ったより安かった。",
        "contextFr": "Le prix actuel était plus bas que je ne l'avais pensé.",
        "hl": "実際"
      },
      {
        "jp": "借りる",
        "reading": "かりる",
        "fr": "emprunter",
        "context": "私は友人からお金を払って車を借りている。",
        "contextFr": "J'ai emprunté une voiture à un ami.",
        "hl": "借り"
      },
      {
        "jp": "パーティー",
        "reading": "パーティー",
        "fr": "fête",
        "context": "彼女はパーティーを開くことを提案した。",
        "contextFr": "Elle suggéra de faire une fête.",
        "hl": "パーティー"
      },
      {
        "jp": "命",
        "reading": "いのち",
        "fr": "vie",
        "context": "彼女は飛行機事故で命を落とした。",
        "contextFr": "Elle a perdu la vie dans un accident d'avion.",
        "hl": "命"
      },
      {
        "jp": "提案",
        "reading": "ていあん",
        "fr": "proposition",
        "context": "彼らの提案は我々のと反対である。",
        "contextFr": "Leur proposition est l'inverse de la nôtre.",
        "hl": "提案"
      },
      {
        "jp": "教授",
        "reading": "きょうじゅ",
        "fr": "professeur (d'université)",
        "context": "私は教授と１時３０分に会う約束がある。",
        "contextFr": "J'aurai un entretien avec le professeur à 13 h 30.",
        "hl": "教授"
      },
      {
        "jp": "地図",
        "reading": "ちず",
        "fr": "carte",
        "context": "地図で町の位置を見つけた。",
        "contextFr": "J'ai trouvé l'emplacement de la ville sur la carte.",
        "hl": "地図"
      },
      {
        "jp": "カメラ",
        "reading": "カメラ",
        "fr": "appareil photo",
        "context": "私のカメラはあなたのカメラよりずっといい。",
        "contextFr": "Mon appareil photo est nettement mieux que le tien.",
        "hl": "カメラ"
      },
      {
        "jp": "協力",
        "reading": "きょうりょく",
        "fr": "coopération",
        "context": "ご協力に感謝します。",
        "contextFr": "J'apprécie votre coopération.",
        "hl": "協力"
      },
      {
        "jp": "静か",
        "reading": "しずか",
        "fr": "calme",
        "context": "その部屋ではみんな静かにしていた。",
        "contextFr": "Tout était tranquille dans la pièce.",
        "hl": "静か"
      },
      {
        "jp": "硬い",
        "reading": "かたい",
        "fr": "dur",
        "context": "靴は新しい間は硬い。",
        "contextFr": "Les chaussures sont raides quand elles sont neuves.",
        "hl": "硬い"
      },
      {
        "jp": "深い",
        "reading": "ふかい",
        "fr": "profond",
        "context": "私は彼の話に深く感動した。",
        "contextFr": "Je suis profondément ému par ce qu'il dit.",
        "hl": "深く"
      },
      {
        "jp": "ごちそう",
        "reading": "ごちそう",
        "fr": "festin",
        "context": "彼はごちそうをすっかり平らげた。",
        "contextFr": "Il a mangé la totalité de son diner.",
        "hl": "ごちそう"
      },
      {
        "jp": "教室",
        "reading": "きょうしつ",
        "fr": "salle de classe",
        "context": "ほとんど全ての生徒が教室の中にいた。",
        "contextFr": "Presque tous les élèves étaient dans la salle de classe.",
        "hl": "教室"
      },
      {
        "jp": "文化",
        "reading": "ぶんか",
        "fr": "culture",
        "context": "我々が他の文化を理解しているのは良いことだ。",
        "contextFr": "C'est une bonne chose pour nous de comprendre d'autres cultures.",
        "hl": "文化"
      },
      {
        "jp": "うるさい",
        "reading": "うるさい",
        "fr": "bruyant",
        "context": "この通りはなんてうるさいのだろう！",
        "contextFr": "Que cette rue est bruyante !",
        "hl": "うるさい"
      },
      {
        "jp": "もちろん",
        "reading": "もちろん",
        "fr": "bien sûr",
        "context": "あなたはもちろん、彼もこの仕事には飽きています。",
        "contextFr": "Comme toi, il est lassé de son travail.",
        "hl": "もちろん"
      },
      {
        "jp": "貸す",
        "reading": "かす",
        "fr": "prêter",
        "context": "私は学生の誰にも本は貸さない。",
        "contextFr": "Je ne prête mes livres à aucun des étudiants.",
        "hl": "貸さ"
      },
      {
        "jp": "タクシー",
        "reading": "タクシー",
        "fr": "taxi",
        "context": "彼女はタクシーを探しに外へでました。",
        "contextFr": "Elle est sortie pour chercher un taxi.",
        "hl": "タクシー"
      },
      {
        "jp": "着く",
        "reading": "つく",
        "fr": "arriver",
        "context": "暗くならないうちにその村に着いた。",
        "contextFr": "Je suis arrivé au village avant qu'il ne fasse nuit.",
        "hl": "着い"
      },
      {
        "jp": "朝ご飯",
        "reading": "あさごはん",
        "fr": "petit-déjeuner",
        "context": "朝ご飯にパンを食べます。",
        "contextFr": "Je mange du pain au petit-déjeuner.",
        "hl": "朝ご飯"
      },
      {
        "jp": "昼ご飯",
        "reading": "ひるごはん",
        "fr": "déjeuner",
        "context": "昼ご飯は十二時に食べます。",
        "contextFr": "Je déjeune à midi.",
        "hl": "昼ご飯"
      },
      {
        "jp": "晩ご飯",
        "reading": "ばんごはん",
        "fr": "dîner",
        "context": "晩ご飯を作ります。",
        "contextFr": "Je prépare le dîner.",
        "hl": "晩ご飯"
      },
      {
        "jp": "何で",
        "reading": "なんで",
        "fr": "pourquoi",
        "context": "何でまたこんな高い辞書を買ったの？",
        "contextFr": "Pourquoi as-tu acheté un dictionnaire aussi cher ?",
        "hl": "何で"
      },
      {
        "jp": "兄弟",
        "reading": "きょうだい",
        "fr": "frères et sœurs",
        "context": "私には２人の兄弟と１人の姉がいる。",
        "contextFr": "J'ai deux frères et une sœur.",
        "hl": "兄弟"
      },
      {
        "jp": "自然",
        "reading": "しぜん",
        "fr": "nature",
        "context": "彼らは自然と急に笑い出した。",
        "contextFr": "Ils éclatèrent d'un rire naturel.",
        "hl": "自然"
      },
      {
        "jp": "キロ",
        "reading": "キロ",
        "fr": "kilo",
        "context": "駅までは３キロよりもっとある。",
        "contextFr": "C'est à plus de 3 kilomètres de la station.",
        "hl": "キロ"
      },
      {
        "jp": "玄関",
        "reading": "げんかん",
        "fr": "entrée",
        "context": "だれか玄関にいる。",
        "contextFr": "Il y a quelqu'un à la porte.",
        "hl": "玄関"
      },
      {
        "jp": "茶碗",
        "reading": "ちゃわん",
        "fr": "bol à riz",
        "context": "これらの茶碗はみんな壊れている。",
        "contextFr": "Ces tasses sont toutes cassées.",
        "hl": "茶碗"
      },
      {
        "jp": "ハンカチ",
        "reading": "ハンカチ",
        "fr": "mouchoir",
        "context": "彼女はたくさんハンカチを持っている。",
        "contextFr": "Elle a beaucoup de mouchoirs.",
        "hl": "ハンカチ"
      },
      {
        "jp": "味",
        "reading": "あじ",
        "fr": "goût",
        "context": "このりんごはすっぱい味がする。",
        "contextFr": "Cette pomme a un goût aigre.",
        "hl": "味"
      },
      {
        "jp": "牛肉",
        "reading": "ぎゅうにく",
        "fr": "bœuf",
        "context": "彼は牛肉が好きではありません。私もです。",
        "contextFr": "Il n'aime pas le bœuf, moi non plus.",
        "hl": "牛肉"
      },
      {
        "jp": "何でも",
        "reading": "なんでも",
        "fr": "n'importe quoi",
        "context": "私は彼のためなら何でもします。",
        "contextFr": "Je ferai n'importe quoi pour lui.",
        "hl": "何でも"
      },
      {
        "jp": "雑誌",
        "reading": "ざっし",
        "fr": "magazine",
        "context": "この雑誌は捨てないでくれ。まだ読んでいないのだ。",
        "contextFr": "Ne jetez pas ce magazine. Je ne l'ai pas encore lu.",
        "hl": "雑誌"
      },
      {
        "jp": "大使館",
        "reading": "たいしかん",
        "fr": "ambassade",
        "context": "オランダ大使館はどこですか？",
        "contextFr": "Où est l'ambassade néerlandaise?",
        "hl": "大使館"
      },
      {
        "jp": "食事",
        "reading": "しょくじ",
        "fr": "repas",
        "context": "父はこのレストランでいつも食事をしていた。",
        "contextFr": "Mon père avait l'habitude de manger dans ce restaurant.",
        "hl": "食事"
      },
      {
        "jp": "向こう",
        "reading": "むこう",
        "fr": "là-bas",
        "context": "「あなたの家はどこですか」「それは向こうです」",
        "contextFr": "« Où est ta maison ? » « Elle est de l'autre côté. »",
        "hl": "向こう"
      },
      {
        "jp": "馬",
        "reading": "うま",
        "fr": "cheval",
        "context": "しばらくこの馬に乗ってもいいですか。",
        "contextFr": "Est-ce que je peux chevaucher ce cheval un moment ?",
        "hl": "馬"
      },
      {
        "jp": "友人",
        "reading": "ゆうじん",
        "fr": "ami",
        "context": "私の両親は彼女の友人をよく知っている。",
        "contextFr": "Mes parents connaissent bien son ami.",
        "hl": "友人"
      },
      {
        "jp": "横",
        "reading": "よこ",
        "fr": "côté",
        "context": "右わき腹を下にして横になってください。",
        "contextFr": "Étendez-vous sur le côté droit.",
        "hl": "横"
      },
      {
        "jp": "無くす",
        "reading": "なくす",
        "fr": "perdre",
        "context": "これは私が無くしたカメラだ。",
        "contextFr": "C'est l'appareil photo que j'ai perdu.",
        "hl": "無くし"
      },
      {
        "jp": "自動車",
        "reading": "じどうしゃ",
        "fr": "automobile",
        "context": "その男の人は自動車事故で死んだ。",
        "contextFr": "Cet homme est mort dans un accident de voiture.",
        "hl": "自動車"
      },
      {
        "jp": "並べる",
        "reading": "ならべる",
        "fr": "ranger",
        "context": "彼女はＣＤを棚に１列に並べた。",
        "contextFr": "Elle plaça ses CD dans une rangée sur l'étagère.",
        "hl": "並べ"
      },
      {
        "jp": "ラジオ",
        "reading": "ラジオ",
        "fr": "radio",
        "context": "あなたはラジオでそのニュースを聞きましたか。",
        "contextFr": "As-tu entendu les nouvelles à la radio ?",
        "hl": "ラジオ"
      },
      {
        "jp": "ニュース",
        "reading": "ニュース",
        "fr": "actualités",
        "context": "彼女にあのニュースを話したことを覚えている。",
        "contextFr": "Je me rappelle lui avoir parlé de cette nouvelle.",
        "hl": "ニュース"
      },
      {
        "jp": "練習",
        "reading": "れんしゅう",
        "fr": "entraînement",
        "context": "たくさん練習すれば、日本語が上手になります。",
        "contextFr": "Si vous pratiquez beaucoup, votre japonais s'améliorera.",
        "hl": "練習"
      },
      {
        "jp": "任せる",
        "reading": "まかせる",
        "fr": "confier",
        "context": "私はジョンに私の車を任せることはできない。",
        "contextFr": "Je ne peux pas faire confiance à John avec ma voiture.",
        "hl": "任せる"
      },
      {
        "jp": "危ない",
        "reading": "あぶない",
        "fr": "dangereux",
        "context": "私の命が危ないと言ってるわけですか？",
        "contextFr": "Es-tu en train de dire que ma vie est en danger ?",
        "hl": "危ない"
      },
      {
        "jp": "ちゃんと",
        "reading": "ちゃんと",
        "fr": "correctement",
        "context": "とぼけてないで、私の質問にちゃんと答えて！",
        "contextFr": "Ne fais pas l'innocent, et réponds-moi franchement !",
        "hl": "ちゃんと"
      }
    ]
  },
  {
    "id": "essentiels-9",
    "name": "Les 1000 · 641 à 720",
    "emoji": "💡",
    "words": [
      {
        "jp": "有名",
        "reading": "ゆうめい",
        "fr": "célèbre",
        "context": "彼の息子さんは有名なピアニストになった。",
        "contextFr": "Son fils est devenu un pianiste renommé.",
        "hl": "有名"
      },
      {
        "jp": "番",
        "reading": "ばん",
        "fr": "numéro",
        "context": "私が部屋を掃除する番にあたっていた。",
        "contextFr": "C'était à mon tour de nettoyer la salle.",
        "hl": "番"
      },
      {
        "jp": "度",
        "reading": "ど",
        "fr": "degré",
        "context": "あなたに会う度に、私はあなたの父親を思い出す。",
        "contextFr": "À chaque fois que je te vois, je pense à ton père.",
        "hl": "度"
      },
      {
        "jp": "コップ",
        "reading": "コップ",
        "fr": "verre",
        "context": "このコップには水が入っている。",
        "contextFr": "Il y a de l'eau dans ce verre.",
        "hl": "コップ"
      },
      {
        "jp": "先輩",
        "reading": "せんぱい",
        "fr": "aîné (à l'école ou au travail)",
        "context": "彼は仕事の上では私の先輩だ。",
        "contextFr": "Il a plus d'expérience au travail que moi.",
        "hl": "先輩"
      },
      {
        "jp": "決まる",
        "reading": "きまる",
        "fr": "être décidé",
        "context": "赤ちゃんの名前は決まりましたか？",
        "contextFr": "Avez-vous choisi le prénom de votre enfant ?",
        "hl": "決まり"
      },
      {
        "jp": "過去",
        "reading": "かこ",
        "fr": "passé",
        "context": "私の過去なんて知ってもいいことないよ。",
        "contextFr": "Rien de mon passé n’est bon à savoir.",
        "hl": "過去"
      },
      {
        "jp": "セーター",
        "reading": "セーター",
        "fr": "pull",
        "context": "このセーター、首のところがチクチクする。",
        "contextFr": "Il me gratte le cou, ce pull.",
        "hl": "セーター"
      },
      {
        "jp": "大きな",
        "reading": "おおきな",
        "fr": "grand",
        "context": "大きな犬を連れた男が入って来た。",
        "contextFr": "Un homme avec un grand chien est entré.",
        "hl": "大きな"
      },
      {
        "jp": "洗濯",
        "reading": "せんたく",
        "fr": "lessive",
        "context": "赤ちゃんが眠っている間に洗濯をした。",
        "contextFr": "J'ai fait la lessive pendant que le bébé était en train de dormir.",
        "hl": "洗濯"
      },
      {
        "jp": "シャツ",
        "reading": "シャツ",
        "fr": "chemise",
        "context": "私のシャツはまだ乾いていないの。",
        "contextFr": "Ma chemise n'est pas encore sèche.",
        "hl": "シャツ"
      },
      {
        "jp": "曲",
        "reading": "きょく",
        "fr": "chanson",
        "context": "私はこの曲を聞き終わったところです。",
        "contextFr": "Je viens juste d'écouter cette musique.",
        "hl": "曲"
      },
      {
        "jp": "色々",
        "reading": "いろいろ",
        "fr": "divers",
        "context": "彼女は色々な種類の花を育てている。",
        "contextFr": "Elle cultive toutes sortes de fleurs.",
        "hl": "色々"
      },
      {
        "jp": "光",
        "reading": "ひかり",
        "fr": "lumière",
        "context": "僕は日の光で本を読むことが好き。",
        "contextFr": "J'aime lire un livre à la lumière du jour.",
        "hl": "光"
      },
      {
        "jp": "始め",
        "reading": "はじめ",
        "fr": "début",
        "context": "７月１日から仕事を始めます。",
        "contextFr": "Je commencerai à travailler le premier juillet.",
        "hl": "始め"
      },
      {
        "jp": "エレベーター",
        "reading": "エレベーター",
        "fr": "ascenseur",
        "context": "あなたの家にはエレベーターがありますか？",
        "contextFr": "Votre maison a-t-elle un ascenseur ?",
        "hl": "エレベーター"
      },
      {
        "jp": "思い出す",
        "reading": "おもいだす",
        "fr": "se rappeler",
        "context": "君を見ると、昔知ってた少年を思い出すよ。",
        "contextFr": "Tu me rappelles un garçon que je connaissais.",
        "hl": "思い出す"
      },
      {
        "jp": "押す",
        "reading": "おす",
        "fr": "pousser",
        "context": "私はボタンを押してラジオをつけた。",
        "contextFr": "J’ai allumé la radio en appuyant sur le bouton.",
        "hl": "押し"
      },
      {
        "jp": "全然",
        "reading": "ぜんぜん",
        "fr": "(pas) du tout",
        "context": "アルジェリアとパキスタンは全然違うよ。",
        "contextFr": "L'Algérie et le Pakistan sont complètement différents.",
        "hl": "全然"
      },
      {
        "jp": "昼間",
        "reading": "ひるま",
        "fr": "journée",
        "context": "昼間、友人が私に会いに来た。",
        "contextFr": "Un de mes amis vint me voir pendant la journée.",
        "hl": "昼間"
      },
      {
        "jp": "島",
        "reading": "しま",
        "fr": "île",
        "context": "その島のほとんどに人が住んでいない。",
        "contextFr": "Peu de gens vivent sur l'île.",
        "hl": "島"
      },
      {
        "jp": "一昨年",
        "reading": "おととし",
        "fr": "il y a deux ans",
        "context": "一昨年に日本へ行きました。",
        "contextFr": "Je suis allé au Japon il y a deux ans.",
        "hl": "一昨年"
      },
      {
        "jp": "チーム",
        "reading": "チーム",
        "fr": "équipe",
        "context": "そのチームは試合前でとても神経質になっていた。",
        "contextFr": "L'équipe était assez nerveuse avant la partie.",
        "hl": "チーム"
      },
      {
        "jp": "夏休み",
        "reading": "なつやすみ",
        "fr": "vacances d'été",
        "context": "今年の夏休みは、どこに遊びに行きたい？",
        "contextFr": "Pendant ces vacances d'été, où veux-tu aller t'amuser ?",
        "hl": "夏休み"
      },
      {
        "jp": "祖父",
        "reading": "そふ",
        "fr": "grand-père",
        "context": "祖父は９０歳で、とても元気です。",
        "contextFr": "Mon grand-père de 90 ans est en pleine forme.",
        "hl": "祖父"
      },
      {
        "jp": "用意",
        "reading": "ようい",
        "fr": "préparation",
        "context": "彼女は我々に極上の食事を用意してくれた。",
        "contextFr": "Elle nous a préparé un merveilleux repas.",
        "hl": "用意"
      },
      {
        "jp": "奥さん",
        "reading": "おくさん",
        "fr": "épouse",
        "context": "私には奥さんがピアニストである友人がいる。",
        "contextFr": "J'ai un ami dont la femme est pianiste.",
        "hl": "奥さん"
      },
      {
        "jp": "祖母",
        "reading": "そぼ",
        "fr": "grand-mère",
        "context": "私は週に２回、祖母に会いに行く。",
        "contextFr": "Je vais chez ma grand-mère deux fois par semaine.",
        "hl": "祖母"
      },
      {
        "jp": "失敗",
        "reading": "しっぱい",
        "fr": "échec",
        "context": "彼は弟が失敗するのではないかと心配している。",
        "contextFr": "Il craint que son frère échoue.",
        "hl": "失敗"
      },
      {
        "jp": "靴",
        "reading": "くつ",
        "fr": "chaussure",
        "context": "姉は毎週日曜日に自分の靴を洗う。",
        "contextFr": "Ma sœur lave ses chaussures tous les dimanches.",
        "hl": "靴"
      },
      {
        "jp": "失う",
        "reading": "うしなう",
        "fr": "perdre",
        "context": "私はそれを失う危険を冒したくない。",
        "contextFr": "Je ne veux pas courir le risque de le perdre.",
        "hl": "失う"
      },
      {
        "jp": "返事",
        "reading": "へんじ",
        "fr": "réponse",
        "context": "彼は私の手紙にまだ返事をしてくれない。",
        "contextFr": "Il n'a pas encore répondu à ma lettre.",
        "hl": "返事"
      },
      {
        "jp": "泳ぐ",
        "reading": "およぐ",
        "fr": "nager",
        "context": "海で泳ぐことは私の一番の楽しみだ。",
        "contextFr": "Nager dans l'océan est mon plus grand plaisir.",
        "hl": "泳ぐ"
      },
      {
        "jp": "コート",
        "reading": "コート",
        "fr": "manteau",
        "context": "コートはあるけど、帽子はないです。",
        "contextFr": "J'ai un manteau, mais je n'ai pas de chapeau.",
        "hl": "コート"
      },
      {
        "jp": "年間",
        "reading": "ねんかん",
        "fr": "année",
        "context": "彼はここ１０年間ずっとここに住んでいます。",
        "contextFr": "Il a vécu ici ces dix années.",
        "hl": "年間"
      },
      {
        "jp": "全て",
        "reading": "すべて",
        "fr": "tout",
        "context": "私は全ての質問に答えることができた。",
        "contextFr": "Je pouvais répondre à toutes les questions.",
        "hl": "全て"
      },
      {
        "jp": "泣く",
        "reading": "なく",
        "fr": "pleurer",
        "context": "お菓子をもらうまでその男の子はずっと泣いていた。",
        "contextFr": "Ce garçon a pleuré jusqu'à qu'on lui donne un biscuit.",
        "hl": "泣い"
      },
      {
        "jp": "コピー",
        "reading": "コピー",
        "fr": "copie",
        "context": "出来るだけ早くこの絵のコピーを送ります。",
        "contextFr": "Je vous envoie une copie de l'image dès que possible.",
        "hl": "コピー"
      },
      {
        "jp": "非常に",
        "reading": "ひじょうに",
        "fr": "très",
        "context": "この問題は非常に難しいです。",
        "contextFr": "Ce problème est très difficile.",
        "hl": "非常に"
      },
      {
        "jp": "複雑",
        "reading": "ふくざつ",
        "fr": "compliqué",
        "context": "コンピューターは複雑な機械だ。",
        "contextFr": "L'ordinateur est une machine complexe.",
        "hl": "複雑"
      },
      {
        "jp": "考え",
        "reading": "かんがえ",
        "fr": "pensée",
        "context": "よく考えたらそこまで面白くなかった。",
        "contextFr": "À bien y réfléchir, ce n'était pas si intéressant.",
        "hl": "考え"
      },
      {
        "jp": "平和",
        "reading": "へいわ",
        "fr": "paix",
        "context": "両国は今、平和な状態にあります。",
        "contextFr": "Les deux pays sont maintenant en paix.",
        "hl": "平和"
      },
      {
        "jp": "階段",
        "reading": "かいだん",
        "fr": "escalier",
        "context": "階段から落ちて背中を強く打ちました。",
        "contextFr": "Je suis tombé dans les escaliers et j'ai pris un grand coup dans le dos.",
        "hl": "階段"
      },
      {
        "jp": "回る",
        "reading": "まわる",
        "fr": "tourner",
        "context": "私は注文を取りに町中を回った。",
        "contextFr": "J'ai fait le tour de la ville pour prendre ma commande.",
        "hl": "回っ"
      },
      {
        "jp": "若者",
        "reading": "わかもの",
        "fr": "jeune",
        "context": "彼女はその若者を恥ずかしそうにちらりと見た。",
        "contextFr": "Elle a timidement jeté un regard au jeune homme.",
        "hl": "若者"
      },
      {
        "jp": "失礼",
        "reading": "しつれい",
        "fr": "impoli",
        "context": "失礼ですが、この席は空いていますか。",
        "contextFr": "Excusez-moi, cette place est-elle prise ?",
        "hl": "失礼"
      },
      {
        "jp": "吸う",
        "reading": "すう",
        "fr": "inspirer",
        "context": "君は煙草を吸うのをやめることが必要だ。",
        "contextFr": "Il faut que tu arrêtes de fumer.",
        "hl": "吸う"
      },
      {
        "jp": "通り",
        "reading": "とおり",
        "fr": "rue",
        "context": "通りに人がたくさん集まっている。",
        "contextFr": "Il y a beaucoup de gens dans la rue.",
        "hl": "通り"
      },
      {
        "jp": "連れる",
        "reading": "つれる",
        "fr": "emmener (quelqu'un)",
        "context": "彼女は親切にも私を病院へ連れて行ってくれた。",
        "contextFr": "Elle a eu la gentillesse de m'emmener à l'hôpital.",
        "hl": "連れ"
      },
      {
        "jp": "咲く",
        "reading": "さく",
        "fr": "fleurir",
        "context": "ある花は春に咲き、またある花は秋に咲く。",
        "contextFr": "Certaines fleurs fleurissent au printemps et d'autres en automne.",
        "hl": "咲き"
      },
      {
        "jp": "受け取る",
        "reading": "うけとる",
        "fr": "recevoir",
        "context": "私は彼女の言うことを文字どおりに受け取った。",
        "contextFr": "J'ai interprété ses propos littéralement.",
        "hl": "受け取っ"
      },
      {
        "jp": "池",
        "reading": "いけ",
        "fr": "étang",
        "context": "その池は小さな魚でいっぱいだった。",
        "contextFr": "Cet étang était rempli de petits poissons.",
        "hl": "池"
      },
      {
        "jp": "火",
        "reading": "ひ",
        "fr": "feu",
        "context": "人間は火を使うことのできる唯一の動物である。",
        "contextFr": "L'Homme est le seul animal qui peut utiliser le feu.",
        "hl": "火"
      },
      {
        "jp": "遊び",
        "reading": "あそび",
        "fr": "jeu",
        "context": "明日、時間があったら私の家に遊びに来て。",
        "contextFr": "Si tu as le temps, passe me voir chez moi demain.",
        "hl": "遊び"
      },
      {
        "jp": "秘密",
        "reading": "ひみつ",
        "fr": "secret",
        "context": "彼女は秘密を知っていることを認めている。",
        "contextFr": "Elle a admis qu'elle connaissait le secret.",
        "hl": "秘密"
      },
      {
        "jp": "食堂",
        "reading": "しょくどう",
        "fr": "cantine",
        "context": "食堂はセルフサービスでした。",
        "contextFr": "La cantine était un self.",
        "hl": "食堂"
      },
      {
        "jp": "空港",
        "reading": "くうこう",
        "fr": "aéroport",
        "context": "空港まで父を迎えに行きました。",
        "contextFr": "Je suis allé à l'aéroport pour accueillir mon père.",
        "hl": "空港"
      },
      {
        "jp": "出発",
        "reading": "しゅっぱつ",
        "fr": "départ",
        "context": "私のために出発を延期しないでくれ。",
        "contextFr": "Ne retardez pas votre départ à cause de moi.",
        "hl": "出発"
      },
      {
        "jp": "便利",
        "reading": "べんり",
        "fr": "pratique",
        "context": "この百科事典は検索に便利である。",
        "contextFr": "Cette encyclopédie est pratique pour vérifier des choses.",
        "hl": "便利"
      },
      {
        "jp": "目的",
        "reading": "もくてき",
        "fr": "but",
        "context": "彼らは大学へ入る目的で勉強している。",
        "contextFr": "Ils étudient dans le but d'entrer à l'université.",
        "hl": "目的"
      },
      {
        "jp": "運転",
        "reading": "うんてん",
        "fr": "conduite",
        "context": "ある雨の夜彼は車を運転していた。",
        "contextFr": "Un soir de pluie, il conduisait une voiture.",
        "hl": "運転"
      },
      {
        "jp": "特別",
        "reading": "とくべつ",
        "fr": "spécial",
        "context": "彼にはそこへいく特別の理由はなかった。",
        "contextFr": "Il n'a aucune raison particulière d'être ici.",
        "hl": "特別"
      },
      {
        "jp": "デパート",
        "reading": "デパート",
        "fr": "grand magasin",
        "context": "私はデパートで迷子になった少年を助けた。",
        "contextFr": "J'ai aidé le garçon qui s'était perdu dans le grand magasin.",
        "hl": "デパート"
      },
      {
        "jp": "通う",
        "reading": "かよう",
        "fr": "faire le trajet",
        "context": "毎日バスで学校に通っています。",
        "contextFr": "Tous les jours, je prends le bus pour aller à l'école.",
        "hl": "通っ"
      },
      {
        "jp": "番号",
        "reading": "ばんごう",
        "fr": "numéro",
        "context": "彼の電話番号を覚えていますか。",
        "contextFr": "Tu te souviens de son numéro de téléphone ?",
        "hl": "番号"
      },
      {
        "jp": "絵",
        "reading": "え",
        "fr": "image",
        "context": "誰があの絵を見ているか知っていますか。",
        "contextFr": "Sais-tu qui est en train de regarder cette image ?",
        "hl": "絵"
      },
      {
        "jp": "行動",
        "reading": "こうどう",
        "fr": "action",
        "context": "彼は自分の息子の行動を恥ずかしく思います。",
        "contextFr": "Il a honte de la conduite de son fils.",
        "hl": "行動"
      },
      {
        "jp": "豚肉",
        "reading": "ぶたにく",
        "fr": "porc",
        "context": "豚肉は私には合わない。",
        "contextFr": "La viande de porc ne me correspond pas.",
        "hl": "豚肉"
      },
      {
        "jp": "正しい",
        "reading": "ただしい",
        "fr": "correct",
        "context": "彼の言ったことは全て正しかった。",
        "contextFr": "Tout ce qu'il disait était juste.",
        "hl": "正しかっ"
      },
      {
        "jp": "習う",
        "reading": "ならう",
        "fr": "apprendre (auprès de quelqu'un)",
        "context": "どうしてフランス語を習うことにしたの？",
        "contextFr": "Pourquoi as-tu décidé d'apprendre le français ?",
        "hl": "習う"
      },
      {
        "jp": "ページ",
        "reading": "ページ",
        "fr": "page",
        "context": "昨日はその本を８０ページまで読んだ。",
        "contextFr": "J'ai lu le livre jusqu'à la page 80 hier.",
        "hl": "ページ"
      },
      {
        "jp": "細かい",
        "reading": "こまかい",
        "fr": "petit",
        "context": "普通の甘さのチョコレートを細かく砕きます。",
        "contextFr": "Cassez le chocolat mi-amer en petits morceaux.",
        "hl": "細かく"
      },
      {
        "jp": "感謝",
        "reading": "かんしゃ",
        "fr": "remerciement",
        "context": "私はあなたが手伝ってくれたことを感謝しています。",
        "contextFr": "Je vous remercie de votre aide.",
        "hl": "感謝"
      },
      {
        "jp": "箱",
        "reading": "はこ",
        "fr": "boîte",
        "context": "私は何がこの箱の中にあるのか知っています。",
        "contextFr": "Je sais ce qu'il y a dans cette boîte.",
        "hl": "箱"
      },
      {
        "jp": "プール",
        "reading": "プール",
        "fr": "piscine",
        "context": "私はプールで泳ぐのは好きではない。",
        "contextFr": "Je n’aime pas nager dans les piscines.",
        "hl": "プール"
      },
      {
        "jp": "ノート",
        "reading": "ノート",
        "fr": "cahier",
        "context": "あの店ではノートを売っていますか？",
        "contextFr": "Vend-on des cahiers dans ce magasin ?",
        "hl": "ノート"
      },
      {
        "jp": "立派",
        "reading": "りっぱ",
        "fr": "splendide",
        "context": "彼には立派な息子が２人いる。",
        "contextFr": "Il a deux beaux garçons.",
        "hl": "立派"
      },
      {
        "jp": "例えば",
        "reading": "たとえば",
        "fr": "par exemple",
        "context": "例えば、これはペンです。",
        "contextFr": "Par exemple, ceci est un crayon.",
        "hl": "例えば"
      },
      {
        "jp": "渡る",
        "reading": "わたる",
        "fr": "traverser",
        "context": "向こうまで泳いで渡ることができますか。",
        "contextFr": "Pouvez-vous traverser à la nage ?",
        "hl": "渡る"
      },
      {
        "jp": "紹介",
        "reading": "しょうかい",
        "fr": "présentation",
        "context": "簡単に自己紹介してもらってもいいですか？",
        "contextFr": "Pouvez-vous vous présenter en quelques mots ?",
        "hl": "紹介"
      }
    ]
  },
  {
    "id": "essentiels-10",
    "name": "Les 1000 · 721 à 799",
    "emoji": "⭐",
    "words": [
      {
        "jp": "荷物",
        "reading": "にもつ",
        "fr": "bagages",
        "context": "どこで荷物を受け取るのですか。",
        "contextFr": "Où est-ce que je peux récupérer mes bagages ?",
        "hl": "荷物"
      },
      {
        "jp": "小学校",
        "reading": "しょうがっこう",
        "fr": "école primaire",
        "context": "弟は小学校へ通っています。",
        "contextFr": "Mon petit frère va dans une école primaire.",
        "hl": "小学校"
      },
      {
        "jp": "冗談",
        "reading": "じょうだん",
        "fr": "plaisanterie",
        "context": "彼女は私の冗談を本気にした。",
        "contextFr": "Elle a pris ma plaisanterie au sérieux.",
        "hl": "冗談"
      },
      {
        "jp": "廊下",
        "reading": "ろうか",
        "fr": "couloir",
        "context": "バスルームは廊下の突き当たりにございます。",
        "contextFr": "La salle de bain se trouve au fond du couloir.",
        "hl": "廊下"
      },
      {
        "jp": "計画",
        "reading": "けいかく",
        "fr": "plan",
        "context": "彼は計画を私の息子にも私にも説明した。",
        "contextFr": "Il a expliqué son plan à mon fils et à moi.",
        "hl": "計画"
      },
      {
        "jp": "席",
        "reading": "せき",
        "fr": "place",
        "context": "すみません、ここは私の席ですが。",
        "contextFr": "Excusez-moi, mais je pense que c'est ma place.",
        "hl": "席"
      },
      {
        "jp": "点",
        "reading": "てん",
        "fr": "point",
        "context": "あなたはいくつかの点で私と違う。",
        "contextFr": "Tu ne me ressembles pas sur plusieurs points.",
        "hl": "点"
      },
      {
        "jp": "戦争",
        "reading": "せんそう",
        "fr": "guerre",
        "context": "１００万人の人々がその戦争で命を落とした。",
        "contextFr": "Un million de personnes ont perdu la vie pendant la guerre.",
        "hl": "戦争"
      },
      {
        "jp": "教師",
        "reading": "きょうし",
        "fr": "enseignant",
        "context": "「あなたは教師ですか」「はい、そうです」",
        "contextFr": "« Vous êtes enseignant ? » « Oui, c'est cela. »",
        "hl": "教師"
      },
      {
        "jp": "責任",
        "reading": "せきにん",
        "fr": "responsabilité",
        "context": "これは私ではなくあなたの責任です。",
        "contextFr": "Ceci n’est pas ma faute mais la vôtre.",
        "hl": "責任"
      },
      {
        "jp": "数学",
        "reading": "すうがく",
        "fr": "mathématiques",
        "context": "私は数学よりも英語の方が好きです。",
        "contextFr": "Je préfère l'anglais aux mathématiques.",
        "hl": "数学"
      },
      {
        "jp": "もう一度",
        "reading": "もういちど",
        "fr": "encore une fois",
        "context": "我々がもう一度率いてやる必要があるのだよ。",
        "contextFr": "Nous devons encore une fois les diriger.",
        "hl": "もう一度"
      },
      {
        "jp": "壁",
        "reading": "かべ",
        "fr": "mur",
        "context": "壁に大きな穴が開いています。",
        "contextFr": "Il y a un gros trou dans le mur.",
        "hl": "壁"
      },
      {
        "jp": "留学生",
        "reading": "りゅうがくせい",
        "fr": "étudiant étranger",
        "context": "留学生の方ですか？",
        "contextFr": "Êtes-vous étudiant étranger ?",
        "hl": "留学生"
      },
      {
        "jp": "育てる",
        "reading": "そだてる",
        "fr": "élever",
        "context": "幼児は母親が育ててくれることを信じている。",
        "contextFr": "Le bébé s'en remet à sa mère pour l'élever.",
        "hl": "育て"
      },
      {
        "jp": "確か",
        "reading": "たしか",
        "fr": "certain",
        "context": "彼女は確かにかわいいが、しかし私は好きではない。",
        "contextFr": "Elle est peut-être mignonne mais je ne l'apprécie pas.",
        "hl": "確か"
      },
      {
        "jp": "倒れる",
        "reading": "たおれる",
        "fr": "tomber",
        "context": "その木は今にも倒れそうだった。",
        "contextFr": "L'arbre était prêt à tomber à tout moment.",
        "hl": "倒れ"
      },
      {
        "jp": "落とす",
        "reading": "おとす",
        "fr": "faire tomber",
        "context": "パソコンは落とさないよ。",
        "contextFr": "Je ne laisse pas tomber l'ordinateur.",
        "hl": "落とさ"
      },
      {
        "jp": "状態",
        "reading": "じょうたい",
        "fr": "état",
        "context": "３４５型は良い状態で受け取りました。",
        "contextFr": "J'ai reçu le modèle 345 dans de bonnes conditions.",
        "hl": "状態"
      },
      {
        "jp": "落ち着く",
        "reading": "おちつく",
        "fr": "se calmer",
        "context": "落ち着けよ。すぐそこに行くから。",
        "contextFr": "Calmez-vous. Je passe dès que possible.",
        "hl": "落ち着け"
      },
      {
        "jp": "誕生日",
        "reading": "たんじょうび",
        "fr": "anniversaire",
        "context": "誕生日はいつですか。",
        "contextFr": "C’est quand, ton anniversaire ?",
        "hl": "誕生日"
      },
      {
        "jp": "離れる",
        "reading": "はなれる",
        "fr": "être séparé",
        "context": "彼は家族から離れたくなかった。",
        "contextFr": "Il n'aimait être séparé de sa famille.",
        "hl": "離れ"
      },
      {
        "jp": "立てる",
        "reading": "たてる",
        "fr": "dresser",
        "context": "食事中に音を立てるのは不作法だ。",
        "contextFr": "C'est malpoli de faire du bruit à table.",
        "hl": "立てる"
      },
      {
        "jp": "報告",
        "reading": "ほうこく",
        "fr": "rapport",
        "context": "彼は事故について詳しく報告してくれた。",
        "contextFr": "Il a fait un rapport détaillé sur l'accident.",
        "hl": "報告"
      },
      {
        "jp": "重要",
        "reading": "じゅうよう",
        "fr": "important",
        "context": "この問題はとても重要です。",
        "contextFr": "Ce problème est de la plus haute importance.",
        "hl": "重要"
      },
      {
        "jp": "隠す",
        "reading": "かくす",
        "fr": "cacher",
        "context": "ベッドの下に隠さないでよ。",
        "contextFr": "Ne te cache pas sous le lit.",
        "hl": "隠さ"
      },
      {
        "jp": "飾る",
        "reading": "かざる",
        "fr": "décorer",
        "context": "私は部屋を花で飾るのが好きだ。",
        "contextFr": "J'aime orner sa chambre de fleurs.",
        "hl": "飾る"
      },
      {
        "jp": "下げる",
        "reading": "さげる",
        "fr": "baisser",
        "context": "ラジオの音を下げてくれませんか。",
        "contextFr": "Pouvez-vous baisser la radio ?",
        "hl": "下げ"
      },
      {
        "jp": "打つ",
        "reading": "うつ",
        "fr": "frapper",
        "context": "君はタイプライターを打つことができるか。",
        "contextFr": "Savez-vous taper à la machine ?",
        "hl": "打つ"
      },
      {
        "jp": "頃",
        "reading": "ころ",
        "fr": "vers",
        "context": "その頃は、ほとんどの人が大学へは行かなかった。",
        "contextFr": "De ce temps, peu de personnes faisaient des études supérieures.",
        "hl": "頃"
      },
      {
        "jp": "訪ねる",
        "reading": "たずねる",
        "fr": "rendre visite à",
        "context": "私は来週友達を訪ねたいと思います。",
        "contextFr": "J'envisage de rendre visite à mon ami l'année prochaine.",
        "hl": "訪ね"
      },
      {
        "jp": "番組",
        "reading": "ばんぐみ",
        "fr": "émission",
        "context": "そのテレビ番組はとても面白そうだった。",
        "contextFr": "Le programme télé semblait vraiment intéressant.",
        "hl": "番組"
      },
      {
        "jp": "相談",
        "reading": "そうだん",
        "fr": "consultation",
        "context": "決める前に家族と相談したいのですが。",
        "contextFr": "Avant de décider, je souhaiterais consulter ma famille.",
        "hl": "相談"
      },
      {
        "jp": "時代",
        "reading": "じだい",
        "fr": "époque",
        "context": "我々の時代は機械時代だ。",
        "contextFr": "Notre époque est l'époque des machines.",
        "hl": "時代"
      },
      {
        "jp": "位置",
        "reading": "いち",
        "fr": "position",
        "context": "全員それぞれの位置に着いた。",
        "contextFr": "Chacun se mit en position.",
        "hl": "位置"
      },
      {
        "jp": "それでは",
        "reading": "それでは",
        "fr": "bon alors",
        "context": "それでは要点をノートにまとめてください。",
        "contextFr": "Alors notez ce point essentiel dans vos cahiers.",
        "hl": "それでは"
      },
      {
        "jp": "季節",
        "reading": "きせつ",
        "fr": "saison",
        "context": "私は季節の中で春が好きだ。",
        "contextFr": "Le printemps est la saison que j'aime le mieux.",
        "hl": "季節"
      },
      {
        "jp": "中学校",
        "reading": "ちゅうがっこう",
        "fr": "collège",
        "context": "父は中学校で英語を教えています。",
        "contextFr": "Mon père enseigne l'anglais au collège.",
        "hl": "中学校"
      },
      {
        "jp": "様子",
        "reading": "ようす",
        "fr": "apparence",
        "context": "彼は腹を立てた様子だったが、結局それは冗談だった。",
        "contextFr": "Son apparente colère n'était en fait qu'une plaisanterie.",
        "hl": "様子"
      },
      {
        "jp": "穴",
        "reading": "あな",
        "fr": "trou",
        "context": "この穴を何かで詰めなくては。",
        "contextFr": "Nous devons combler ce trou avec quelque chose.",
        "hl": "穴"
      },
      {
        "jp": "海岸",
        "reading": "かいがん",
        "fr": "côte",
        "context": "海岸にはほとんど人がいなかった。",
        "contextFr": "Il y avait peu de gens sur la plage.",
        "hl": "海岸"
      },
      {
        "jp": "科学",
        "reading": "かがく",
        "fr": "science",
        "context": "彼は「私は科学者になりたい」と言った。",
        "contextFr": "Il a dit : « Je veux devenir scientifique. »",
        "hl": "科学"
      },
      {
        "jp": "太陽",
        "reading": "たいよう",
        "fr": "soleil",
        "context": "太陽は月より大きいのです。",
        "contextFr": "Le soleil est plus grand que la lune.",
        "hl": "太陽"
      },
      {
        "jp": "平気",
        "reading": "へいき",
        "fr": "ça va",
        "context": "私は注射器を見るまでは平気だった。",
        "contextFr": "J'étais calme jusqu'à ce que je voie la seringue.",
        "hl": "平気"
      },
      {
        "jp": "期待",
        "reading": "きたい",
        "fr": "attente",
        "context": "彼女はいつも僕が手伝うのを期待する。",
        "contextFr": "Elle attend toujours de moi que je l'aide.",
        "hl": "期待"
      },
      {
        "jp": "再来週",
        "reading": "さらいしゅう",
        "fr": "dans deux semaines",
        "context": "また再来週。",
        "contextFr": "À dans deux semaines !",
        "hl": "再来週"
      },
      {
        "jp": "小説",
        "reading": "しょうせつ",
        "fr": "roman",
        "context": "小説は読むより書く方が好きです。",
        "contextFr": "Je préfère lire les romans que de les écrire.",
        "hl": "小説"
      },
      {
        "jp": "乗り換える",
        "reading": "のりかえる",
        "fr": "changer (de train",
        "context": "次の駅で列車を乗り換えなさい。",
        "contextFr": "Changez de train à la gare suivante.",
        "hl": "乗り換え"
      },
      {
        "jp": "認める",
        "reading": "みとめる",
        "fr": "reconnaître",
        "context": "彼女は自分が間違っていることを認めない。",
        "contextFr": "Elle n'admet pas qu'elle fait erreur.",
        "hl": "認め"
      },
      {
        "jp": "故障",
        "reading": "こしょう",
        "fr": "panne",
        "context": "昨日故障したのは、私の車ではなくて彼の車だった。",
        "contextFr": "C'était sa voiture, pas la mienne, qui est tombée en panne hier.",
        "hl": "故障"
      },
      {
        "jp": "真ん中",
        "reading": "まんなか",
        "fr": "milieu",
        "context": "トラックが道の真ん中に止まっていた。",
        "contextFr": "Un poids-lourd se tenait au milieu de la chaussée.",
        "hl": "真ん中"
      },
      {
        "jp": "遠く",
        "reading": "とおく",
        "fr": "au loin",
        "context": "遠くに何か動いているものがあった。",
        "contextFr": "Quelque chose se déplaçait au loin.",
        "hl": "遠く"
      },
      {
        "jp": "素晴らしい",
        "reading": "すばらしい",
        "fr": "merveilleux",
        "context": "彼女の母親は素晴らしいピアニストだ。",
        "contextFr": "Sa mère est une excellente pianiste.",
        "hl": "素晴らしい"
      },
      {
        "jp": "自由",
        "reading": "じゆう",
        "fr": "liberté",
        "context": "この部屋は自由に使っていいですか。",
        "contextFr": "Puis-je utiliser cette pièce librement ?",
        "hl": "自由"
      },
      {
        "jp": "了解",
        "reading": "りょうかい",
        "fr": "compris",
        "context": "了解です。",
        "contextFr": "C’est compris.",
        "hl": "了解"
      },
      {
        "jp": "通る",
        "reading": "とおる",
        "fr": "passer par",
        "context": "私は毎日その教会の前を通る。",
        "contextFr": "Je passe tous les jours devant cette église.",
        "hl": "通る"
      },
      {
        "jp": "慣れる",
        "reading": "なれる",
        "fr": "s'habituer à",
        "context": "私は朝早く起きるのに慣れていない。",
        "contextFr": "Je ne suis pas habituée à me lever tôt.",
        "hl": "慣れ"
      },
      {
        "jp": "どんどん",
        "reading": "どんどん",
        "fr": "rapidement",
        "context": "時間がどんどん経った。",
        "contextFr": "Le temps est passé très vite.",
        "hl": "どんどん"
      },
      {
        "jp": "本気",
        "reading": "ほんき",
        "fr": "sérieux",
        "context": "彼は本気で言っている。",
        "contextFr": "Il dit ça sérieusement.",
        "hl": "本気"
      },
      {
        "jp": "止む",
        "reading": "やむ",
        "fr": "s'arrêter",
        "context": "一時間前に雪が降り止みました。",
        "contextFr": "Il s'est arrêté de neiger il y a une heure.",
        "hl": "止み"
      },
      {
        "jp": "週間",
        "reading": "しゅうかん",
        "fr": "semaine",
        "context": "彼女は二週間だけ彼を知っています。",
        "contextFr": "Elle ne le connaît que depuis deux semaines.",
        "hl": "週間"
      },
      {
        "jp": "値段",
        "reading": "ねだん",
        "fr": "prix",
        "context": "私はこの服を安い値段で買った。",
        "contextFr": "J'ai acheté cette robe à un bas prix.",
        "hl": "値段"
      },
      {
        "jp": "両方",
        "reading": "りょうほう",
        "fr": "les deux",
        "context": "私は彼らの両方とも知らない。",
        "contextFr": "Je ne connais aucun des deux.",
        "hl": "両方"
      },
      {
        "jp": "一部",
        "reading": "いちぶ",
        "fr": "partie",
        "context": "その話の一部は本当です。",
        "contextFr": "Une partie de l'histoire est vraie.",
        "hl": "一部"
      },
      {
        "jp": "お釣り",
        "reading": "おつり",
        "fr": "monnaie (rendue après un paiement)",
        "context": "ごめん、お釣りが無い。",
        "contextFr": "Je regrette, je n'ai pas de monnaie.",
        "hl": "お釣り"
      },
      {
        "jp": "入院",
        "reading": "にゅういん",
        "fr": "hospitalisation",
        "context": "私の父は２ヶ月入院していた。",
        "contextFr": "Mon père est hospitalisé depuis deux mois.",
        "hl": "入院"
      },
      {
        "jp": "地球",
        "reading": "ちきゅう",
        "fr": "Terre",
        "context": "その子は地球は平らだと信じている。",
        "contextFr": "Cet enfant pense que la Terre est plate.",
        "hl": "地球"
      },
      {
        "jp": "解決",
        "reading": "かいけつ",
        "fr": "solution",
        "context": "彼は何か解決策を提案しましたか。",
        "contextFr": "A-t-il proposé quelconques solutions ?",
        "hl": "解決"
      },
      {
        "jp": "迎える",
        "reading": "むかえる",
        "fr": "accueillir",
        "context": "明日の朝迎えに来るのを忘れないでね。",
        "contextFr": "N'oublie pas de venir me chercher demain matin.",
        "hl": "迎え"
      },
      {
        "jp": "街",
        "reading": "まち",
        "fr": "ville",
        "context": "あなたの街には何人住んでいますか。",
        "contextFr": "Combien d'habitants vivent dans votre ville ?",
        "hl": "街"
      },
      {
        "jp": "記録",
        "reading": "きろく",
        "fr": "record",
        "context": "彼の記録は１００メートルの世界新記録だ。",
        "contextFr": "Son record est un nouveau record mondial du 100 mètres.",
        "hl": "記録"
      },
      {
        "jp": "振る",
        "reading": "ふる",
        "fr": "secouer",
        "context": "彼は首を横に振った。",
        "contextFr": "Il a secoué la tête.",
        "hl": "振っ"
      },
      {
        "jp": "盗む",
        "reading": "ぬすむ",
        "fr": "voler",
        "context": "彼は私のお金など盗まないよ。彼を信頼しています。",
        "contextFr": "Il ne volera pas mon argent ; j'ai confiance en lui.",
        "hl": "盗ま"
      },
      {
        "jp": "珍しい",
        "reading": "めずらしい",
        "fr": "rare",
        "context": "探していた珍しい本を見つけた。",
        "contextFr": "J'ai trouvé un livre rare que j'avais recherché.",
        "hl": "珍しい"
      },
      {
        "jp": "喜ぶ",
        "reading": "よろこぶ",
        "fr": "se réjouir",
        "context": "彼の両親は、彼の成功を喜んだ。",
        "contextFr": "Ses parents furent contents de son succès.",
        "hl": "喜ん"
      },
      {
        "jp": "グラム",
        "reading": "グラム",
        "fr": "gramme",
        "context": "この肉は二百グラムです。",
        "contextFr": "Cette viande pèse deux cents grammes.",
        "hl": "グラム"
      },
      {
        "jp": "済む",
        "reading": "すむ",
        "fr": "finir",
        "context": "１０時ちょっと前に仕事が済んだ。",
        "contextFr": "J'ai terminé mon travail un peu avant 10 heures.",
        "hl": "済ん"
      },
      {
        "jp": "急",
        "reading": "きゅう",
        "fr": "soudain",
        "context": "私の姿を見ると、彼らは急に話をやめた。",
        "contextFr": "En me voyant, ils se sont soudainement arrêtés de parler.",
        "hl": "急"
      },
      {
        "jp": "ビル",
        "reading": "ビル",
        "fr": "immeuble",
        "context": "あのビルの一階にあります。",
        "contextFr": "Il se trouve au rez-de-chaussée de cet immeuble.",
        "hl": "ビル"
      }
    ]
  },
  {
    "id": "escalade-materiel",
    "name": "Escalade · matériel",
    "emoji": "🧗",
    "words": [
      {
        "jp": "ロープ",
        "reading": "ロープ",
        "fr": "corde",
        "context": "ロープをしっかり結びます。",
        "contextFr": "Je noue solidement la corde."
      },
      {
        "jp": "ハーネス",
        "reading": "ハーネス",
        "fr": "baudrier",
        "context": "ハーネスを着けてから登ります。",
        "contextFr": "Je mets le baudrier avant de grimper."
      },
      {
        "jp": "カラビナ",
        "reading": "カラビナ",
        "fr": "mousqueton",
        "context": "カラビナをベルトに掛けます。",
        "contextFr": "J’accroche le mousqueton au baudrier."
      },
      {
        "jp": "クイックドロー",
        "reading": "クイックドロー",
        "fr": "dégaine",
        "context": "クイックドローをクリップします。",
        "contextFr": "Je clippe la dégaine."
      },
      {
        "jp": "チョーク",
        "reading": "チョーク",
        "fr": "magnésie",
        "context": "チョークを手に付けます。",
        "contextFr": "Je mets de la magnésie sur les mains."
      },
      {
        "jp": "チョークバッグ",
        "reading": "チョークバッグ",
        "fr": "sac à magnésie",
        "context": "チョークバッグを腰に付けます。",
        "contextFr": "J’accroche le sac à magnésie à ma taille."
      },
      {
        "jp": "クライミングシューズ",
        "reading": "クライミングシューズ",
        "fr": "chaussons d’escalade",
        "context": "クライミングシューズはきついです。",
        "contextFr": "Les chaussons d’escalade sont serrés."
      },
      {
        "jp": "ヘルメット",
        "reading": "ヘルメット",
        "fr": "casque",
        "context": "ヘルメットをかぶって登ります。",
        "contextFr": "Je grimpe avec un casque."
      },
      {
        "jp": "ビレイデバイス",
        "reading": "ビレイデバイス",
        "fr": "dispositif d’assurage",
        "context": "ビレイデバイスを確認します。",
        "contextFr": "Je vérifie le dispositif d’assurage."
      },
      {
        "jp": "スリング",
        "reading": "スリング",
        "fr": "sangle",
        "context": "スリングを岩に巻きます。",
        "contextFr": "J’enroule la sangle autour du rocher."
      },
      {
        "jp": "ロープバッグ",
        "reading": "ロープバッグ",
        "fr": "sac à corde",
        "context": "ロープバッグにロープを入れます。",
        "contextFr": "Je range la corde dans le sac à corde."
      },
      {
        "jp": "マット",
        "reading": "マット",
        "fr": "crashpad",
        "context": "マットを岩の下に置きます。",
        "contextFr": "Je place le crashpad sous le rocher."
      },
      {
        "jp": "ブラシ",
        "reading": "ブラシ",
        "fr": "brosse",
        "context": "ブラシでホールドを磨きます。",
        "contextFr": "Je brosse la prise."
      },
      {
        "jp": "テープ",
        "reading": "テープ",
        "fr": "bande de doigts",
        "context": "指にテープを巻きます。",
        "contextFr": "J’enroule du ruban autour de mes doigts."
      },
      {
        "jp": "水筒",
        "reading": "すいとう",
        "fr": "gourde",
        "context": "水筒を持って行きます。",
        "contextFr": "J’emporte une gourde."
      },
      {
        "jp": "行動食",
        "reading": "こうどうしょく",
        "fr": "en-cas",
        "context": "行動食をポケットに入れます。",
        "contextFr": "Je mets des en-cas dans ma poche."
      },
      {
        "jp": "ガイドブック",
        "reading": "ガイドブック",
        "fr": "guide",
        "context": "ガイドブックで岩場を探します。",
        "contextFr": "Je cherche le site d’escalade dans le guide."
      },
      {
        "jp": "トポ",
        "reading": "トポ",
        "fr": "topo",
        "context": "トポでルートを確認します。",
        "contextFr": "Je consulte le topo pour la voie."
      },
      {
        "jp": "ルート",
        "reading": "ルート",
        "fr": "voie",
        "context": "このルートは初心者向けです。",
        "contextFr": "Cette voie est pour débutants."
      },
      {
        "jp": "グレード",
        "reading": "グレード",
        "fr": "cotation",
        "context": "このグレードは難しいです。",
        "contextFr": "Cette cotation est difficile."
      },
      {
        "jp": "ボルダー",
        "reading": "ボルダー",
        "fr": "bloc",
        "context": "ボルダーを登ります。",
        "contextFr": "Je grimpe un bloc."
      },
      {
        "jp": "リード",
        "reading": "リード",
        "fr": "tête",
        "context": "リードで登るのは緊張します。",
        "contextFr": "Grimper en tête est stressant."
      },
      {
        "jp": "トップロープ",
        "reading": "トップロープ",
        "fr": "moulinette",
        "context": "トップロープで練習します。",
        "contextFr": "Je m’entraîne en moulinette."
      },
      {
        "jp": "アンカー",
        "reading": "アンカー",
        "fr": "relais",
        "context": "アンカーを設置します。",
        "contextFr": "J’installe le relais."
      },
      {
        "jp": "支点",
        "reading": "してん",
        "fr": "point d’ancrage",
        "context": "支点をしっかり取ります。",
        "contextFr": "Je place un point d’ancrage solide."
      },
      {
        "jp": "ハーケン",
        "reading": "ハーケン",
        "fr": "piton",
        "context": "ハーケンを打ちます。",
        "contextFr": "Je plante un piton."
      },
      {
        "jp": "ボルト",
        "reading": "ボルト",
        "fr": "spit",
        "context": "ボルトにクイックドローを掛けます。",
        "contextFr": "Je clippe la dégaine dans le spit."
      },
      {
        "jp": "ロワーダウン",
        "reading": "ロワーダウン",
        "fr": "descente en moulinette",
        "context": "最後はロワーダウンで降ります。",
        "contextFr": "À la fin, je descends en moulinette."
      },
      {
        "jp": "懸垂下降",
        "reading": "けんすいこうか",
        "fr": "rappel",
        "context": "懸垂下降で岩場を降ります。",
        "contextFr": "Je descends le site en rappel."
      },
      {
        "jp": "ファーストエイドキット",
        "reading": "ファーストエイドキット",
        "fr": "trousse de secours",
        "context": "ファーストエイドキットを携帯します。",
        "contextFr": "J’emporte une trousse de secours."
      }
    ]
  },
  {
    "id": "escalade-gestes",
    "name": "Escalade · gestes et terrain",
    "emoji": "⛰️",
    "words": [
      {
        "jp": "登る",
        "reading": "のぼる",
        "fr": "grimper",
        "context": "毎週、岩場で登ります。",
        "contextFr": "Je grimpe sur le rocher chaque semaine."
      },
      {
        "jp": "登攀",
        "reading": "とうはん",
        "fr": "ascension",
        "context": "登攀の技術を練習します。",
        "contextFr": "Je pratique la technique d’ascension."
      },
      {
        "jp": "クライミング",
        "reading": "クライミング",
        "fr": "escalade",
        "context": "クライミングが好きです。",
        "contextFr": "J’aime l’escalade."
      },
      {
        "jp": "ボルダリング",
        "reading": "ボルダリング",
        "fr": "bloc",
        "context": "ジムでボルダリングをします。",
        "contextFr": "Je fais du bloc en salle."
      },
      {
        "jp": "フリークライミング",
        "reading": "フリークライミング",
        "fr": "escalade libre",
        "context": "フリークライミングに挑戦します。",
        "contextFr": "Je m’essaie à l’escalade libre."
      },
      {
        "jp": "確保",
        "reading": "かくほ",
        "fr": "assurage",
        "context": "パートナーの確保をします。",
        "contextFr": "J’assure mon partenaire."
      },
      {
        "jp": "ビレイ",
        "reading": "ビレイ",
        "fr": "assurage",
        "context": "ビレイを交代します。",
        "contextFr": "On échange l’assurage."
      },
      {
        "jp": "クリップ",
        "reading": "クリップ",
        "fr": "clip",
        "context": "ロープをクリップします。",
        "contextFr": "Je clippe la corde."
      },
      {
        "jp": "ムーブ",
        "reading": "ムーブ",
        "fr": "mouvement",
        "context": "次のムーブを考えます。",
        "contextFr": "Je réfléchis au mouvement suivant."
      },
      {
        "jp": "ホールド",
        "reading": "ホールド",
        "fr": "prise",
        "context": "ホールドを強く握ります。",
        "contextFr": "Je serre fort la prise."
      },
      {
        "jp": "足がかり",
        "reading": "あしがかり",
        "fr": "appui de pied",
        "context": "足がかりを探します。",
        "contextFr": "Je cherche un appui de pied."
      },
      {
        "jp": "手がかり",
        "reading": "てがかり",
        "fr": "prise de main",
        "context": "手がかりが見つかりません。",
        "contextFr": "Je ne trouve pas de prise de main."
      },
      {
        "jp": "レイバック",
        "reading": "レイバック",
        "fr": "dulfer",
        "context": "クラックでレイバックを使います。",
        "contextFr": "J’utilise un dulfer dans la fissure."
      },
      {
        "jp": "ジャミング",
        "reading": "ジャミング",
        "fr": "coinçage",
        "context": "ジャミングで手を固定します。",
        "contextFr": "Je coince ma main avec la technique du jamming."
      },
      {
        "jp": "ヒールフック",
        "reading": "ヒールフック",
        "fr": "talon",
        "context": "ヒールフックで体を引き上げます。",
        "contextFr": "Je me hisse avec un talon."
      },
      {
        "jp": "トゥフック",
        "reading": "トゥフック",
        "fr": "pointe",
        "context": "トゥフックでバランスを取ります。",
        "contextFr": "Je garde l’équilibre avec la pointe du pied."
      },
      {
        "jp": "マントリング",
        "reading": "マントリング",
        "fr": "rétablissement",
        "context": "最後はマントリングで上がります。",
        "contextFr": "À la fin, je me rétablis."
      },
      {
        "jp": "ダイノ",
        "reading": "ダイノ",
        "fr": "dyno",
        "context": "ダイノで次のホールドへ飛びます。",
        "contextFr": "Je saute vers la prise suivante avec un dyno."
      },
      {
        "jp": "オンサイト",
        "reading": "オンサイト",
        "fr": "à vue",
        "context": "このルートをオンサイトしました。",
        "contextFr": "J’ai réussi cette voie à vue."
      },
      {
        "jp": "フラッシュ",
        "reading": "フラッシュ",
        "fr": "flash",
        "context": "初挑戦でフラッシュしました。",
        "contextFr": "Je l’ai flashé à la première tentative."
      },
      {
        "jp": "レッドポイント",
        "reading": "レッドポイント",
        "fr": "enchaînement",
        "context": "ついにレッドポイントできました。",
        "contextFr": "J’ai enfin enchaîné la voie."
      },
      {
        "jp": "プロジェクト",
        "reading": "プロジェクト",
        "fr": "projet",
        "context": "このルートは私のプロジェクトです。",
        "contextFr": "Cette voie est mon projet."
      },
      {
        "jp": "フォール",
        "reading": "フォール",
        "fr": "chute",
        "context": "フォールしても安全です。",
        "contextFr": "Même en cas de chute, c’est sûr."
      },
      {
        "jp": "テンション",
        "reading": "テンション",
        "fr": "tension",
        "context": "テンションをかけてください。",
        "contextFr": "Mets de la tension, s’il te plaît."
      },
      {
        "jp": "レスト",
        "reading": "レスト",
        "fr": "repos",
        "context": "ホールドでレストします。",
        "contextFr": "Je me repose sur une prise."
      },
      {
        "jp": "完登",
        "reading": "かんとう",
        "fr": "enchaînement",
        "context": "完登おめでとう！",
        "contextFr": "Félicitations pour l’enchaînement !"
      },
      {
        "jp": "岩場",
        "reading": "いわば",
        "fr": "site d’escalade",
        "context": "週末に岩場へ行きます。",
        "contextFr": "Je vais sur un site d’escalade ce week-end."
      },
      {
        "jp": "外岩",
        "reading": "そといわ",
        "fr": "rocher extérieur",
        "context": "外岩はジムと違います。",
        "contextFr": "Le rocher extérieur est différent de la salle."
      },
      {
        "jp": "傾斜",
        "reading": "けいしゃ",
        "fr": "dévers",
        "context": "この壁は傾斜が強いです。",
        "contextFr": "Ce mur est très déversant."
      },
      {
        "jp": "スラブ",
        "reading": "スラブ",
        "fr": "dalle",
        "context": "スラブは足の技術が大事です。",
        "contextFr": "En dalle, la technique de pied est importante."
      }
    ]
  }
];
window.UNITS_DATA = (window.UNITS_DATA || []).concat(data);
})();
