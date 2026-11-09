/* Kotoba — parcours de grammaire B1/B2, données et progression.
   Aucune dépendance : ce module est testable directement avec Node. */
(function (root) {
'use strict';

const LESSONS = [
{
  id: 'b1-te-shimau',
  level: 'B1',
  emoji: '🧹',
  title: 'Finir… ou le regretter',
  subtitle: 'L’action est terminée, parfois malgré toi.',
  goal: 'Distinguer l’achèvement complet du regret et reconnaître la forme familière en -chatta.',
  patterns: [
    { jp: 'てしまう', kana: 'てしまう', romaji: 'te shimau', fr: 'finir par… / faire complètement (souvent avec regret)' },
    { jp: 'でしまう', kana: 'でしまう', romaji: 'de shimau', fr: 'variante après un verbe en -mu, -bu ou -nu' },
    { jp: 'ちゃった', kana: 'ちゃった', romaji: 'chatta', fr: 'forme familière de てしまった' }
  ],
  points: [
    {
      title: 'Un achèvement complet',
      text: 'La forme en -te shimau insiste sur une action menée jusqu’au bout. Elle peut simplement signifier « finir de… », sans idée négative.',
      examples: [
        { jp: '宿題はもうやってしまいました。', kana: 'しゅくだいはもうやってしまいました。', romaji: 'Shukudai wa mō yatte shimaimashita.', fr: 'J’ai déjà fini mes devoirs.' },
        { jp: 'ケーキを全部食べてしまいました。', kana: 'けーきをぜんぶたべてしまいました。', romaji: 'Kēki o zenbu tabete shimaimashita.', fr: 'J’ai mangé tout le gâteau.' }
      ]
    },
    {
      title: 'Le regret',
      text: 'Avec un événement non voulu, la même forme ajoute « zut, malheureusement ». Le contexte décide de la nuance.',
      examples: [
        { jp: '財布を落としてしまいました。', kana: 'さいふをおとしてしまいました。', romaji: 'Saifu o otoshite shimaimashita.', fr: 'J’ai perdu mon portefeuille (zut).' },
        { jp: '電車に乗り遅れてしまった。', kana: 'でんしゃにのりおくれてしまった。', romaji: 'Densha ni noriokurete shimatta.', fr: 'J’ai raté le train (malheureusement).' }
      ]
    },
    {
      title: 'À l’oral',
      text: 'À l’oral, -te shimatta devient souvent -chatta, et -de shimatta devient -jatta. C’est très fréquent dans une conversation détendue.',
      examples: [
        { jp: '全部食べちゃった。', kana: 'ぜんぶたべちゃった。', romaji: 'Zenbu tabechatta.', fr: 'J’ai tout mangé (oups).' },
        { jp: '忘れちゃった。', kana: 'わすれちゃった。', romaji: 'Wasurechatta.', fr: 'J’ai oublié (zut).' }
      ]
    }
  ],
  tip: 'Ne l’emploie pas pour un simple futur neutre. Pour « je vais finir », une forme comme 終わらせます est plus précise : -te shimau colore souvent l’action.',
  exercises: [
    {
      id: 'b1-te-shimau-e1',
      type: 'choice',
      question: 'Dans cette phrase, que suggère la forme en -te shimaimashita ?',
      focus: { jp: '落としてしまいました', kana: 'おとしてしまいました', romaji: 'otoshite shimaimashita', fr: 'j’ai perdu (malheureusement)' },
      options: [
        { jp: 'てしまいました', kana: 'てしまいました', romaji: 'te shimaimashita', fr: 'action achevée, souvent avec regret', correct: true },
        { jp: 'てください', kana: 'てください', romaji: 'te kudasai', fr: 'demande polie' },
        { jp: 'たいです', kana: 'たいです', romaji: 'tai desu', fr: 'désir' }
      ],
      explanation: 'Le locuteur constate une perte déjà accomplie, avec un sentiment de regret. Ce n’est ni une demande ni un désir.'
    },
    {
      id: 'b1-te-shimau-e2',
      type: 'choice',
      question: 'Complète la phrase pour dire « J’ai mangé tout le gâteau ».',
      sentence: { jp: 'ケーキを全部 ___', kana: 'けーきをぜんぶ ___', romaji: 'kēki o zenbu ___', fr: 'J’ai mangé tout le gâteau.' },
      options: [
        { jp: '食べてしまいました', kana: 'たべてしまいました', romaji: 'tabete shimaimashita', fr: 'j’ai mangé (jusqu’au bout)', correct: true },
        { jp: '食べてください', kana: 'たべてください', romaji: 'tabete kudasai', fr: 'mange, s’il te plaît' },
        { jp: '食べてもいいです', kana: 'たべてもいいです', romaji: 'tabete mo ii desu', fr: 'tu peux manger' }
      ],
      explanation: 'La forme en -te shimaimashita indique que l’action est accomplie. Les deux autres formes sont une demande et une permission.'
    },
    {
      id: 'b1-te-shimau-e3',
      type: 'choice',
      question: 'Quelle est la version familière de « 忘れてしまった » ?',
      focus: { jp: '忘れてしまった', kana: 'わすれてしまった', romaji: 'wasurete shimatta', fr: 'j’ai oublié (zut)' },
      options: [
        { jp: '忘れちゃった', kana: 'わすれちゃった', romaji: 'wasurechatta', fr: 'j’ai oublié (familier)', correct: true },
        { jp: '忘れておいた', kana: 'わすれておいた', romaji: 'wasurete oita', fr: 'j’ai laissé oublié (pour plus tard)' },
        { jp: '忘れられる', kana: 'わすれられる', romaji: 'wasurerareru', fr: 'on peut oublier / je peux oublier' }
      ],
      explanation: 'À l’oral, -te shimatta se contracte en -chatta. La forme -te oita exprime une préparation, et -rareru est le potentiel ou le passif.'
    },
    {
      id: 'b1-te-shimau-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « J’ai perdu mon portefeuille (zut). »',
      translation: 'J’ai perdu mon portefeuille (zut).',
      tokens: [
        { jp: '財布を', kana: 'さいふを', romaji: 'saifu o', fr: 'le portefeuille' },
        { jp: '落として', kana: 'おとして', romaji: 'otoshite', fr: 'perdre (forme en -te)' },
        { jp: 'しまいました', kana: 'しまいました', romaji: 'shimaimashita', fr: 'fini par (regret)' }
      ],
      solution: [0, 1, 2],
      answer: { jp: '財布を落としてしまいました。', kana: 'さいふをおとしてしまいました。', romaji: 'Saifu o otoshite shimaimashita.', fr: 'J’ai perdu mon portefeuille (zut).' },
      explanation: 'L’objet avec を vient avant le verbe. La forme en -te reste collée à shimaimashita : 落として + しまいました.'
    }
  ]
},
{
  id: 'b1-te-oku',
  level: 'B1',
  emoji: '📦',
  title: 'Préparer et laisser en état',
  subtitle: 'Une action faite pour plus tard, ou un état qui reste.',
  goal: 'Utiliser -te oku pour préparer et -te aru pour décrire un état résultant.',
  patterns: [
    { jp: 'ておく', kana: 'ておく', romaji: 'te oku', fr: 'faire par avance / laisser en état' },
    { jp: 'てある', kana: 'てある', romaji: 'te aru', fr: 'état résultant d’une action volontaire' },
    { jp: 'ておきます', kana: 'ておきます', romaji: 'te okimasu', fr: 'forme polie de ておく' }
  ],
  points: [
    {
      title: 'Préparer pour plus tard',
      text: 'La forme en -te oku présente une action faite à l’avance, pour que tout soit prêt. Elle répond souvent à la question « qu’as-tu préparé ? ».',
      examples: [
        { jp: '明日の会議の資料を準備しておきます。', kana: 'あしたのかいぎのしりょうをじゅんびしておきます。', romaji: 'Ashita no kaigi no shiryō o junbi shite okimasu.', fr: 'Je prépare les documents pour la réunion de demain (à l’avance).' },
        { jp: 'ホテルを予約しておきました。', kana: 'ほてるをよやくしておきました。', romaji: 'Hoteru o yoyaku shite okimashita.', fr: 'J’avais réservé l’hôtel.' }
      ]
    },
    {
      title: 'Laisser faire ou laisser en l’état',
      text: 'On peut aussi demander de laisser quelque chose comme il est, ou choisir de ne pas faire une action.',
      examples: [
        { jp: '窓を開けておいてください。', kana: 'まどをあけておいてください。', romaji: 'Mado o akete oite kudasai.', fr: 'Laisse la fenêtre ouverte, s’il te plaît.' },
        { jp: 'その話はしないでおきます。', kana: 'そのはなしはしないでおきます。', romaji: 'Sono hanashi wa shinaide okimasu.', fr: 'Je vais éviter de parler de ça.' }
      ]
    },
    {
      title: 'L’état avec -te aru',
      text: 'Avec -te aru, le résultat d’une action volontaire est encore visible. Le sujet grammatical est souvent l’objet, pas la personne qui a agi.',
      examples: [
        { jp: '窓が開けてあります。', kana: 'まどがあけてあります。', romaji: 'Mado ga akete arimasu.', fr: 'La fenêtre est ouverte (quelqu’un l’a ouverte).' },
        { jp: '冷蔵庫にビールが入れてあります。', kana: 'れいぞうこにびーるがいれてあります。', romaji: 'Reizōko ni bīru ga irete arimasu.', fr: 'Il y a de la bière au frigo (quelqu’un l’a mise).' }
      ]
    }
  ],
  tip: '-te oku = quelqu’un agit pour plus tard. -te aru = l’état existe déjà. Si tu décris simplement une fenêtre ouverte sans insister sur l’action, 開いています suffit.',
  exercises: [
    {
      id: 'b1-te-oku-e1',
      type: 'choice',
      question: 'Quelle forme exprime « Je prépare les documents à l’avance » ?',
      options: [
        { jp: '準備しておきます', kana: 'じゅんびしておきます', romaji: 'junbi shite okimasu', fr: 'je prépare à l’avance', correct: true },
        { jp: '準備してあります', kana: 'じゅんびしてあります', romaji: 'junbi shite arimasu', fr: 'les documents sont préparés (état)' },
        { jp: '準備してください', kana: 'じゅんびしてください', romaji: 'junbi shite kudasai', fr: 'prépare, s’il te plaît' }
      ],
      explanation: 'Le locuteur annonce une action qu’il fait pour que tout soit prêt : -te okimasu. -te arimasu décrit l’état déjà obtenu.'
    },
    {
      id: 'b1-te-oku-e2',
      type: 'choice',
      question: 'La fenêtre est ouverte parce que quelqu’un l’a ouverte. Quelle phrase le dit le mieux ?',
      options: [
        { jp: '窓が開けてあります。', kana: 'まどがあけてあります。', romaji: 'Mado ga akete arimasu.', fr: 'La fenêtre est ouverte (par quelqu’un).', correct: true },
        { jp: '窓を開けておきます。', kana: 'まどをあけておきます。', romaji: 'Mado o akete okimasu.', fr: 'Je vais ouvrir la fenêtre (pour plus tard).' },
        { jp: '窓が開いています。', kana: 'まどがあいています。', romaji: 'Mado ga aite imasu.', fr: 'La fenêtre est ouverte (constat neutre).' }
      ],
      explanation: 'La forme -te arimasu insiste sur l’état résultant d’une action volontaire. 開いています constate simplement que la fenêtre est ouverte.'
    },
    {
      id: 'b1-te-oku-e3',
      type: 'choice',
      question: 'Que signifie « その話はしないでおきます » ?',
      focus: { jp: 'しないでおきます', kana: 'しないでおきます', romaji: 'shinaide okimasu', fr: 'je vais éviter de le faire' },
      options: [
        { jp: 'しないでおきます', kana: 'しないでおきます', romaji: 'shinaide okimasu', fr: 'je vais éviter de parler de ça', correct: true },
        { jp: 'してしまいました', kana: 'してしまいました', romaji: 'shite shimaimashita', fr: 'je l’ai fait (malheureusement)' },
        { jp: 'しておいてください', kana: 'しておいてください', romaji: 'shite oite kudasai', fr: 'fais-le à l’avance, s’il te plaît' }
      ],
      explanation: 'La négation en -naide oku signifie « choisir de ne pas faire, laisser tomber pour l’instant ».'
    },
    {
      id: 'b1-te-oku-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Laisse la fenêtre ouverte, s’il te plaît. »',
      translation: 'Laisse la fenêtre ouverte, s’il te plaît.',
      tokens: [
        { jp: '窓を', kana: 'まどを', romaji: 'mado o', fr: 'la fenêtre' },
        { jp: '開けて', kana: 'あけて', romaji: 'akete', fr: 'ouvrir (forme en -te)' },
        { jp: 'おいて', kana: 'おいて', romaji: 'oite', fr: 'laisser (forme en -te)' },
        { jp: 'ください', kana: 'ください', romaji: 'kudasai', fr: 's’il te plaît' }
      ],
      solution: [0, 1, 2, 3],
      answer: { jp: '窓を開けておいてください。', kana: 'まどをあけておいてください。', romaji: 'Mado o akete oite kudasai.', fr: 'Laisse la fenêtre ouverte, s’il te plaît.' },
      explanation: 'La demande se construit avec la forme en -te, puis -te oite kudasai : ouvre et laisse comme ça.'
    }
  ]
}
,
{
  id: 'b1-conditionnels',
  level: 'B1',
  emoji: '🌦️',
  title: 'Quatre conditionnelles',
  subtitle: 'Quand, si, à condition que : la nuance change le sens.',
  goal: 'Choisir entre と, ば, たら et なら selon la conséquence, l’hypothèse ou le thème.',
  patterns: [
    { jp: 'と', kana: 'と', romaji: 'to', fr: 'quand / si : conséquence automatique' },
    { jp: 'ば', kana: 'ば', romaji: 'ba', fr: 'si : hypothèse, condition' },
    { jp: 'たら', kana: 'たら', romaji: 'tara', fr: 'quand / si : séquence, après que' },
    { jp: 'なら', kana: 'なら', romaji: 'nara', fr: 'si on parle de… / dans le cas de…' }
  ],
  points: [
    {
      title: 'と : la conséquence automatique',
      text: 'と relie une condition à un résultat qui suit naturellement, comme une règle ou un mécanisme. La seconde partie ne peut pas être une demande ou une intention personnelle.',
      examples: [
        { jp: '春になると、桜が咲きます。', kana: 'はるになると、さくらがさきます。', romaji: 'Haru ni naru to, sakura ga sakimasu.', fr: 'Quand le printemps arrive, les cerisiers fleurissent.' },
        { jp: 'ボタンを押すと、ドアが開きます。', kana: 'ぼたんをおすと、どあがあきます。', romaji: 'Botan o osu to, doa ga akimasu.', fr: 'Quand on appuie sur le bouton, la porte s’ouvre.' }
      ]
    },
    {
      title: 'ば : l’hypothèse',
      text: 'ば présente une condition générale : « si telle chose est vraie, alors… ». C’est la forme la plus neutre pour poser une hypothèse.',
      examples: [
        { jp: 'お金があれば、旅行します。', kana: 'おかねがあれば、りょこうします。', romaji: 'Okane ga areba, ryokō shimasu.', fr: 'Si j’ai de l’argent, je voyage.' },
        { jp: 'もっと練習すれば、上手になります。', kana: 'もっとれんしゅうすれば、じょうずになります。', romaji: 'Motto renshū sureba, jōzu ni narimasu.', fr: 'Si tu t’entraînes plus, tu progresseras.' }
      ]
    },
    {
      title: 'たら : le moment ou l’enchaînement',
      text: 'たら convient quand une action se produit d’abord, puis une autre. C’est aussi la forme la plus souple pour « si…, fais… ».',
      examples: [
        { jp: '駅に着いたら、電話してください。', kana: 'えきについたら、でんわしてください。', romaji: 'Eki ni tsuitara, denwa shite kudasai.', fr: 'Quand tu arrives à la gare, appelle-moi.' },
        { jp: '時間があったら、映画を見ましょう。', kana: 'じかんがあったら、えいがをみましょう。', romaji: 'Jikan ga attara, eiga o mimashō.', fr: 'Si on a le temps, regardons un film.' }
      ]
    },
    {
      title: 'なら : le thème',
      text: 'なら reprend le sujet dont on parle : « si c’est de cela qu’il s’agit ». Il ne décrit pas une conséquence automatique.',
      examples: [
        { jp: '日本なら、秋がおすすめです。', kana: 'にほんなら、あきがおすすめです。', romaji: 'Nihon nara, aki ga osusume desu.', fr: 'Si c’est le Japon, l’automne est recommandé.' },
        { jp: '田中さんなら、もう帰りましたよ。', kana: 'たなかさんなら、もうかえりましたよ。', romaji: 'Tanaka-san nara, mō kaerimashita yo.', fr: 'Si tu cherches M. Tanaka, il est déjà parti.' }
      ]
    }
  ],
  tip: 'Pour « si…, fais… », préfère たら. と ne se termine pas par une demande ni par une intention. なら reprend souvent une information déjà mentionnée.',
  exercises: [
    {
      id: 'b1-conditionnels-e1',
      type: 'choice',
      question: 'Quelle conditionnelle exprime une conséquence automatique ?',
      sentence: { jp: '春になると、桜が咲きます。', kana: 'はるになると、さくらがさきます。', romaji: 'Haru ni naru to, sakura ga sakimasu.', fr: 'Quand le printemps arrive, les cerisiers fleurissent.' },
      options: [
        { jp: 'と', kana: 'と', romaji: 'to', fr: 'conséquence automatique', correct: true },
        { jp: 'ば', kana: 'ば', romaji: 'ba', fr: 'hypothèse' },
        { jp: 'なら', kana: 'なら', romaji: 'nara', fr: 'si on parle de…' }
      ],
      explanation: 'Le printemps qui arrive entraîne naturellement la floraison : c’est une règle, donc と.'
    },
    {
      id: 'b1-conditionnels-e2',
      type: 'choice',
      question: 'Quelle forme complète « Quand tu arrives à la gare, appelle-moi » ?',
      options: [
        { jp: '駅に着いたら', kana: 'えきについたら', romaji: 'eki ni tsuitara', fr: 'quand tu arrives à la gare', correct: true },
        { jp: '駅に着くと', kana: 'えきにつくと', romaji: 'eki ni tsuku to', fr: 'quand tu arrives à la gare (conséquence automatique)' },
        { jp: '駅に着くなら', kana: 'えきにつくなら', romaji: 'eki ni tsuku nara', fr: 'si tu arrives à la gare' }
      ],
      explanation: 'Une demande après la condition demande たら. と ne peut pas introduire « appelle-moi » ; なら présente la gare comme un thème.'
    },
    {
      id: 'b1-conditionnels-e3',
      type: 'choice',
      question: 'Quelle conditionnelle reprend le thème « le Japon » ?',
      options: [
        { jp: '日本なら', kana: 'にほんなら', romaji: 'Nihon nara', fr: 'si c’est le Japon', correct: true },
        { jp: '日本ので', kana: 'にほんで', romaji: 'Nihon de', fr: 'à cause du Japon' },
        { jp: '日本のに', kana: 'にほんのに', romaji: 'Nihon noni', fr: 'alors que c’est le Japon' }
      ],
      explanation: 'なら signifie « si on parle de… ». Les deux autres formes ne sont pas des conditionnelles correctes ici.'
    },
    {
      id: 'b1-conditionnels-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Si j’ai de l’argent, je voyage. »',
      translation: 'Si j’ai de l’argent, je voyage.',
      tokens: [
        { jp: 'お金が', kana: 'おかねが', romaji: 'okane ga', fr: 'de l’argent' },
        { jp: 'あれば', kana: 'あれば', romaji: 'areba', fr: 's’il y a (condition)' },
        { jp: '旅行します', kana: 'りょこうします', romaji: 'ryokō shimasu', fr: 'je voyage' }
      ],
      solution: [0, 1, 2],
      answer: { jp: 'お金があれば、旅行します。', kana: 'おかねがあれば、りょこうします。', romaji: 'Okane ga areba, ryokō shimasu.', fr: 'Si j’ai de l’argent, je voyage.' },
      explanation: 'La condition avec ば vient avant la conséquence. La phrase garde l’ordre thème + condition + résultat.'
    }
  ]
},
{
  id: 'b1-passif',
  level: 'B1',
  emoji: '🎭',
  title: 'Le passif, vu de l’autre côté',
  subtitle: 'Subir, être fait, ou présenter un fait sans montrer l’auteur.',
  goal: 'Reconnaître le passif, choisir la particule de l’agent et comprendre le passif de nuisance.',
  patterns: [
    { jp: 'れる', kana: 'れる', romaji: 'reru', fr: 'passif des verbes en -u' },
    { jp: 'られる', kana: 'られる', romaji: 'rareru', fr: 'passif des verbes en -eru / -iru' },
    { jp: 'によって', kana: 'によって', romaji: 'ni yotte', fr: 'par (agent, style soutenu)' },
    { jp: 'に', kana: 'に', romaji: 'ni', fr: 'par (agent, passif du quotidien)' }
  ],
  points: [
    {
      title: 'Une voix neutre',
      text: 'Le passif permet de mettre l’objet ou l’événement au premier plan. L’auteur de l’action peut être mentionné avec に ou によって.',
      examples: [
        { jp: 'この本は多くの人に読まれています。', kana: 'このほんはおおくのひとによまれています。', romaji: 'Kono hon wa ōku no hito ni yomarete imasu.', fr: 'Ce livre est lu par beaucoup de gens.' },
        { jp: '法隆寺は607年に建てられました。', kana: 'ほうりゅうじはろっぴゃくななねんにたてられました。', romaji: 'Hōryū-ji wa roppyaku nana-nen ni tateraremashita.', fr: 'Le temple Hōryū-ji a été construit en 607.' }
      ]
    },
    {
      title: 'Le passif de nuisance',
      text: 'Avec un verbe transitif, le passif peut exprimer que l’on a subi l’action de quelqu’un, souvent avec contrariété.',
      examples: [
        { jp: '弟にケーキを食べられました。', kana: 'おとうとにけーきをたべられました。', romaji: 'Otōto ni kēki o taberaremashita.', fr: 'Mon petit frère a mangé mon gâteau (et cela m’a contrarié).' },
        { jp: '雨に降られて、試合が中止になった。', kana: 'あめにふられて、しあいがちゅうしになった。', romaji: 'Ame ni furarete, shiai ga chūshi ni natta.', fr: 'La pluie nous est tombée dessus, et le match a été annulé.' }
      ]
    },
    {
      title: 'Qui fait l’action ?',
      text: 'Pour un créateur ou une œuvre, によって est plus précis et plus soutenu. Pour une action quotidienne, に suffit souvent.',
      examples: [
        { jp: 'この絵は有名な画家によって描かれました。', kana: 'このえはゆうめいながかによってかかれました。', romaji: 'Kono e wa yūmei na gaka ni yotte kakaremashita.', fr: 'Ce tableau a été peint par un peintre célèbre.' },
        { jp: '先生にほめられました。', kana: 'せんせいにほめられました。', romaji: 'Sensei ni homeraremashita.', fr: 'J’ai été félicité par le professeur.' }
      ]
    }
  ],
  tip: 'Le passif n’est pas seulement une traduction de « être fait ». En japonais, il sert aussi à présenter un fait ou à exprimer une nuisance subie.',
  exercises: [
    {
      id: 'b1-passif-e1',
      type: 'choice',
      question: 'Quelle est la forme passive du verbe 読む ?',
      options: [
        { jp: '読まれる', kana: 'よまれる', romaji: 'yomareru', fr: 'être lu', correct: true },
        { jp: '読ませる', kana: 'よませる', romaji: 'yomaseru', fr: 'faire lire (causatif)' },
        { jp: '読める', kana: 'よめる', romaji: 'yomeru', fr: 'pouvoir lire (potentiel)' }
      ],
      explanation: '読む est un verbe en -mu : sa base passive est 読ま-, puis れる. 読ませる est le causatif, 読める le potentiel.'
    },
    {
      id: 'b1-passif-e2',
      type: 'choice',
      question: 'Complète : « Ce livre est lu par beaucoup de gens. »',
      sentence: { jp: 'この本は多くの人に ___。', kana: 'このほんはおおくのひとに ___。', romaji: 'Kono hon wa ōku no hito ni ___.', fr: 'Ce livre est lu par beaucoup de gens.' },
      options: [
        { jp: '読まれています', kana: 'よまれています', romaji: 'yomarete imasu', fr: 'est lu (passif)', correct: true },
        { jp: '読んでいます', kana: 'よんでいます', romaji: 'yonde imasu', fr: 'est en train de lire' },
        { jp: '読ませています', kana: 'よませています', romaji: 'yomasete imasu', fr: 'fait lire' }
      ],
      explanation: '多くの人に indique l’agent. Le verbe doit être au passif : 読まれています.'
    },
    {
      id: 'b1-passif-e3',
      type: 'choice',
      question: 'Que ressent le locuteur dans « 弟にケーキを食べられました » ?',
      focus: { jp: '食べられました', kana: 'たべられました', romaji: 'taberaremashita', fr: 'a été mangé (par lui)' },
      options: [
        { jp: '迷惑', kana: 'めいわく', romaji: 'meiwaku', fr: 'il a subi la perte de son gâteau', correct: true },
        { jp: '使役', kana: 'しえき', romaji: 'shieki', fr: 'il a fait manger son frère' },
        { jp: '可能', kana: 'かのう', romaji: 'kanō', fr: 'il peut manger le gâteau' }
      ],
      explanation: 'Le passif avec に et un objet perdu exprime la nuisance : le petit frère a mangé le gâteau, et le locuteur le déplore.'
    },
    {
      id: 'b1-passif-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Le temple Hōryū-ji a été construit en 607. »',
      translation: 'Le temple Hōryū-ji a été construit en 607.',
      tokens: [
        { jp: '法隆寺は', kana: 'ほうりゅうじは', romaji: 'Hōryū-ji wa', fr: 'le temple Hōryū-ji' },
        { jp: '607年に', kana: 'ろっぴゃくななねんに', romaji: 'roppyaku nana-nen ni', fr: 'en 607' },
        { jp: '建てられました', kana: 'たてられました', romaji: 'tateraremashita', fr: 'a été construit' }
      ],
      solution: [0, 1, 2],
      answer: { jp: '法隆寺は607年に建てられました。', kana: 'ほうりゅうじはろっぴゃくななねんにたてられました。', romaji: 'Hōryū-ji wa roppyaku nana-nen ni tateraremashita.', fr: 'Le temple Hōryū-ji a été construit en 607.' },
      explanation: 'Le thème est en tête, la date avec に précède le verbe passif. Le passif met le bâtiment au premier plan.'
    }
  ]
}
,
{
  id: 'b1-cause-concession',
  level: 'B1',
  emoji: '⚖️',
  title: 'Cause et concession',
  subtitle: 'Expliquer pourquoi, puis marquer le contraste.',
  goal: 'Nuancer la cause avec から et ので, puis exprimer le contraste avec のに et けれども.',
  patterns: [
    { jp: 'から', kana: 'から', romaji: 'kara', fr: 'parce que (direct, subjectif)' },
    { jp: 'ので', kana: 'ので', romaji: 'node', fr: 'comme / parce que (objectif, plus doux)' },
    { jp: 'のに', kana: 'のに', romaji: 'noni', fr: 'alors que / malgré (contraste, surprise)' },
    { jp: 'けれども', kana: 'けれども', romaji: 'keredomo', fr: 'mais / bien que (contraste neutre)' }
  ],
  points: [
    {
      title: 'から : la cause directe',
      text: 'から donne une raison de façon directe. On l’utilise beaucoup à l’oral, et la phrase peut finir sur から pour justifier une décision.',
      examples: [
        { jp: '時間がないから、タクシーで行きます。', kana: 'じかんがないから、たくしーでいきます。', romaji: 'Jikan ga nai kara, takushī de ikimasu.', fr: 'Comme je n’ai pas le temps, j’y vais en taxi.' },
        { jp: '疲れたから、もう寝ます。', kana: 'つかれたから、もうねます。', romaji: 'Tsukareta kara, mō nemasu.', fr: 'Je suis fatigué, donc je vais me coucher.' }
      ]
    },
    {
      title: 'ので : la cause présentée comme objective',
      text: 'ので adoucit le lien de cause. Il convient quand on explique une situation de façon polie, sans donner l’impression d’imposer son point de vue.',
      examples: [
        { jp: '雨が降っているので、試合は中止です。', kana: 'あめがふっているので、しあいはちゅうしです。', romaji: 'Ame ga futte iru node, shiai wa chūshi desu.', fr: 'Comme il pleut, le match est annulé.' },
        { jp: '明日は試験なので、今日は勉強します。', kana: 'あしたはしけんなので、きょうはべんきょうします。', romaji: 'Ashita wa shiken na node, kyō wa benkyō shimasu.', fr: 'Comme j’ai un examen demain, j’étudie aujourd’hui.' }
      ]
    },
    {
      title: 'のに : le contraste inattendu',
      text: 'のに relie deux faits qui ne vont pas ensemble. Il exprime souvent la surprise, la déception ou la frustration.',
      examples: [
        { jp: '頑張ったのに、負けてしまいました。', kana: 'がんばったのに、まけてしまいました。', romaji: 'Ganbatta noni, makete shimaimashita.', fr: 'J’ai perdu alors que j’avais fait de mon mieux.' },
        { jp: '薬を飲んだのに、まだ痛いです。', kana: 'くすりをのんだのに、まだいたいです。', romaji: 'Kusuri o nonda noni, mada itai desu.', fr: 'J’ai pris le médicament, et pourtant j’ai encore mal.' }
      ]
    },
    {
      title: 'けれども : le contraste neutre',
      text: 'けれども (ou けれど / けど à l’oral) présente simplement deux idées opposées, sans la charge émotionnelle de のに.',
      examples: [
        { jp: '高いけれども、質がいいです。', kana: 'たかいけれども、しつがいいです。', romaji: 'Takai keredomo, shitsu ga ii desu.', fr: 'C’est cher, mais la qualité est bonne.' },
        { jp: '行きたいですが、時間がありません。', kana: 'いきたいですが、じかんがありません。', romaji: 'Ikitai desu ga, jikan ga arimasen.', fr: 'Je veux y aller, mais je n’ai pas le temps.' }
      ]
    }
  ],
  tip: 'から est plus direct et personnel ; ので présente la cause comme un fait. のに ajoute une émotion ; けれども reste neutre.',
  exercises: [
    {
      id: 'b1-cause-concession-e1',
      type: 'choice',
      question: 'Quelle conjonction présente la cause de façon objective et douce ?',
      options: [
        { jp: 'ので', kana: 'ので', romaji: 'node', fr: 'comme / parce que (objectif)', correct: true },
        { jp: 'のに', kana: 'のに', romaji: 'noni', fr: 'alors que (contraste)' },
        { jp: 'けれども', kana: 'けれども', romaji: 'keredomo', fr: 'mais (contraste)' }
      ],
      explanation: 'ので relie une cause à une conséquence sans la charge subjective de から. のに et けれども marquent un contraste.'
    },
    {
      id: 'b1-cause-concession-e2',
      type: 'choice',
      question: 'Complète : « J’ai perdu alors que j’avais fait de mon mieux. »',
      sentence: { jp: '頑張った ___、負けてしまいました。', kana: 'がんばった ___、まけてしまいました。', romaji: 'Ganbatta ___, makete shimaimashita.', fr: 'J’ai perdu alors que j’avais fait de mon mieux.' },
      options: [
        { jp: 'のに', kana: 'のに', romaji: 'noni', fr: 'alors que (surprise, frustration)', correct: true },
        { jp: 'ので', kana: 'ので', romaji: 'node', fr: 'comme (cause)' },
        { jp: 'から', kana: 'から', romaji: 'kara', fr: 'parce que (cause)' }
      ],
      explanation: 'Les deux faits sont opposés et décevants : のに. ので et から introduiraient une cause, pas un contraste.'
    },
    {
      id: 'b1-cause-concession-e3',
      type: 'choice',
      question: 'Quelle phrase exprime un contraste neutre : « C’est cher, mais la qualité est bonne » ?',
      options: [
        { jp: '高いけれども、質がいいです。', kana: 'たかいけれども、しつがいいです。', romaji: 'Takai keredomo, shitsu ga ii desu.', fr: 'C’est cher, mais la qualité est bonne.', correct: true },
        { jp: '高いので、質がいいです。', kana: 'たかいので、しつがいいです。', romaji: 'Takai node, shitsu ga ii desu.', fr: 'Comme c’est cher, la qualité est bonne.' },
        { jp: '高いのに、質がいいです。', kana: 'たかいのに、しつがいいです。', romaji: 'Takai noni, shitsu ga ii desu.', fr: 'Alors que c’est cher, la qualité est bonne.' }
      ],
      explanation: 'けれども marque un simple « mais ». ので donne une cause absurde ici ; のに ajoute une surprise qui n’est pas nécessaire.'
    },
    {
      id: 'b1-cause-concession-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Comme il pleut, le match est annulé. »',
      translation: 'Comme il pleut, le match est annulé.',
      tokens: [
        { jp: '雨が', kana: 'あめが', romaji: 'ame ga', fr: 'la pluie' },
        { jp: '降っているので', kana: 'ふっているので', romaji: 'futte iru node', fr: 'comme il pleut' },
        { jp: '試合は', kana: 'しあいは', romaji: 'shiai wa', fr: 'le match' },
        { jp: '中止です', kana: 'ちゅうしです', romaji: 'chūshi desu', fr: 'est annulé' }
      ],
      solution: [0, 1, 2, 3],
      answer: { jp: '雨が降っているので、試合は中止です。', kana: 'あめがふっているので、しあいはちゅうしです。', romaji: 'Ame ga futte iru node, shiai wa chūshi desu.', fr: 'Comme il pleut, le match est annulé.' },
      explanation: 'La cause avec ので précède la conséquence. Le thème 試合は reste avant le nom prédicatif 中止です.'
    }
  ]
},
{
  id: 'b1-potentiel',
  level: 'B1',
  emoji: '🗝️',
  title: 'Pouvoir faire',
  subtitle: 'Le potentiel, la permission et la perception naturelle.',
  goal: 'Former le potentiel, choisir la particule が et distinguer 見える de 見られる.',
  patterns: [
    { jp: 'れる', kana: 'れる', romaji: 'reru', fr: 'potentiel des verbes en -u' },
    { jp: 'られる', kana: 'られる', romaji: 'rareru', fr: 'potentiel des verbes en -eru / -iru' },
    { jp: 'ことができる', kana: 'ことができる', romaji: 'koto ga dekiru', fr: 'pouvoir faire (forme explicite)' },
    { jp: '見える', kana: 'みえる', romaji: 'mieru', fr: 'être visible (perception naturelle)' },
    { jp: '聞こえる', kana: 'きこえる', romaji: 'kikoeru', fr: 'être audible (perception naturelle)' }
  ],
  points: [
    {
      title: 'Le potentiel court',
      text: 'Le potentiel se forme souvent avec -eru / -rareru. L’objet de la capacité est fréquemment marqué par が, même si を reste possible.',
      examples: [
        { jp: '私は日本語が少し話せます。', kana: 'わたしはにほんごがすこしはなせます。', romaji: 'Watashi wa nihongo ga sukoshi hanasemasu.', fr: 'Je peux parler un peu japonais.' },
        { jp: 'このレストランではカードが使えます。', kana: 'このれすとらんではかーどがつかえます。', romaji: 'Kono resutoran de wa kādo ga tsukaemasu.', fr: 'On peut utiliser une carte dans ce restaurant.' }
      ]
    },
    {
      title: 'La forme ことができる',
      text: 'La forme ことができる est plus explicite et un peu plus formelle. Elle est utile quand on veut distinguer clairement la capacité de l’action.',
      examples: [
        { jp: 'ここで写真を撮ることができます。', kana: 'ここでしゃしんをとることができます。', romaji: 'Koko de shashin o toru koto ga dekimasu.', fr: 'On peut prendre des photos ici.' },
        { jp: '日本語で話すことができますか。', kana: 'にほんごではなすことができますか。', romaji: 'Nihongo de hanasu koto ga dekimasu ka.', fr: 'Peux-tu parler en japonais ?' }
      ]
    },
    {
      title: 'Percevoir, sans effort',
      text: '見える et 聞こえる décrivent ce qui est visible ou audible naturellement. 見られる et 聞ける supposent une possibilité ou une permission.',
      examples: [
        { jp: '窓から海が見えます。', kana: 'まどからうみがみえます。', romaji: 'Mado kara umi ga miemasu.', fr: 'On voit la mer depuis la fenêtre.' },
        { jp: 'この動画は無料で見られます。', kana: 'このどうがはむりょうでみられます。', romaji: 'Kono dōga wa muryō de miraremasu.', fr: 'On peut regarder cette vidéo gratuitement.' },
        { jp: '音楽が聞こえます。', kana: 'おんがくがきこえます。', romaji: 'Ongaku ga kikoemasu.', fr: 'On entend de la musique.' }
      ]
    }
  ],
  tip: 'Le potentiel prend souvent が pour l’objet : 日本語が話せます. を reste possible, mais moins naturel avec les verbes de capacité.',
  exercises: [
    {
      id: 'b1-potentiel-e1',
      type: 'choice',
      question: 'Quelle est la forme potentielle du verbe 話す ?',
      options: [
        { jp: '話せる', kana: 'はなせる', romaji: 'hanaseru', fr: 'pouvoir parler', correct: true },
        { jp: '話させる', kana: 'はなさせる', romaji: 'hanasaseru', fr: 'faire parler (causatif)' },
        { jp: '話される', kana: 'はなされる', romaji: 'hanasareru', fr: 'être parlé (passif)' }
      ],
      explanation: '話す est un verbe en -u : la base potentielle est 話せ-, puis る. Les deux autres formes sont le causatif et le passif.'
    },
    {
      id: 'b1-potentiel-e2',
      type: 'choice',
      question: 'Complète : « Je peux parler un peu japonais. »',
      sentence: { jp: '私は日本語が少し ___。', kana: 'わたしはにほんごがすこし ___。', romaji: 'Watashi wa nihongo ga sukoshi ___.', fr: 'Je peux parler un peu japonais.' },
      options: [
        { jp: '話せます', kana: 'はなせます', romaji: 'hanasemasu', fr: 'je peux parler', correct: true },
        { jp: '話します', kana: 'はなします', romaji: 'hanashimasu', fr: 'je parle' },
        { jp: '話されます', kana: 'はなされます', romaji: 'hanasaremasu', fr: 'je suis parlé' }
      ],
      explanation: '日本語が marque l’objet de la capacité. Le verbe poli au potentiel est 話せます.'
    },
    {
      id: 'b1-potentiel-e3',
      type: 'choice',
      question: 'Quelle phrase décrit une perception naturelle : « On voit la mer depuis la fenêtre » ?',
      options: [
        { jp: '窓から海が見えます。', kana: 'まどからうみがみえます。', romaji: 'Mado kara umi ga miemasu.', fr: 'On voit la mer depuis la fenêtre.', correct: true },
        { jp: '窓から海が見られます。', kana: 'まどからうみがみられます。', romaji: 'Mado kara umi ga miraremasu.', fr: 'On peut voir la mer depuis la fenêtre (possibilité).' },
        { jp: '窓から海を聞こえます。', kana: 'まどからうみをきこえます。', romaji: 'Mado kara umi o kikoemasu.', fr: 'On entend la mer depuis la fenêtre (forme incorrecte).' }
      ],
      explanation: '見える décrit ce qui est visible sans effort. 見られる insiste sur la possibilité ; 海を聞こえます est incorrect car 聞こえる prend が.'
    },
    {
      id: 'b1-potentiel-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « On peut utiliser une carte dans ce restaurant. »',
      translation: 'On peut utiliser une carte dans ce restaurant.',
      tokens: [
        { jp: 'このレストランでは', kana: 'このれすとらんでは', romaji: 'kono resutoran de wa', fr: 'dans ce restaurant' },
        { jp: 'カードが', kana: 'かーどが', romaji: 'kādo ga', fr: 'la carte bancaire' },
        { jp: '使えます', kana: 'つかえます', romaji: 'tsukaemasu', fr: 'on peut utiliser' }
      ],
      solution: [0, 1, 2],
      answer: { jp: 'このレストランではカードが使えます。', kana: 'このれすとらんではかーどがつかえます。', romaji: 'Kono resutoran de wa kādo ga tsukaemasu.', fr: 'On peut utiliser une carte dans ce restaurant.' },
      explanation: 'Le lieu de l’action est marqué par では, l’objet de la capacité par が, puis le verbe potentiel 使えます.'
    }
  ]
}
,
{
  id: 'b2-causatif',
  level: 'B2',
  emoji: '🪢',
  title: 'Faire faire, être forcé',
  subtitle: 'Le causatif et le causatif-passif.',
  goal: 'Distinguer させる (faire faire) de させられる (être poussé à faire) et reconnaître la contrainte subie.',
  patterns: [
    { jp: 'させる', kana: 'させる', romaji: 'saseru', fr: 'faire faire (causatif)' },
    { jp: 'させられる', kana: 'させられる', romaji: 'saserareru', fr: 'être forcé de faire (causatif-passif)' },
    { jp: 'させてください', kana: 'させてください', romaji: 'sasete kudasai', fr: 'laissez-moi faire' }
  ],
  points: [
    {
      title: 'Faire faire quelque chose',
      text: 'Le causatif indique que quelqu’un pousse une autre personne à agir. La personne poussée est souvent marquée par に.',
      examples: [
        { jp: '先生は学生に作文を書かせました。', kana: 'せんせいはがくせいにさくぶんをかかせました。', romaji: 'Sensei wa gakusei ni sakubun o kakasemashita.', fr: 'Le professeur a fait écrire une rédaction aux étudiants.' },
        { jp: '母は私に野菜を食べさせました。', kana: 'はははわたしにやさいをたべさせました。', romaji: 'Haha wa watashi ni yasai o tabesasemashita.', fr: 'Ma mère m’a fait manger des légumes.' }
      ]
    },
    {
      title: 'Subir la contrainte',
      text: 'Le causatif-passif exprime que l’on est amené à faire quelque chose, souvent sans l’avoir choisi. C’est très fréquent au travail ou dans les souvenirs d’enfance.',
      examples: [
        { jp: '私は毎日残業させられています。', kana: 'わたしはまいにちざんぎょうさせられています。', romaji: 'Watashi wa mainichi zangyō saserarete imasu.', fr: 'On me fait faire des heures supplémentaires tous les jours.' },
        { jp: '子供のころ、ピアノを習わされました。', kana: 'こどものころ、ぴあのをならわされました。', romaji: 'Kodomo no koro, piano o narawasaremashita.', fr: 'Enfant, on m’a forcé à apprendre le piano.' }
      ]
    },
    {
      title: 'Demander la permission',
      text: 'させてください sert à demander poliment de pouvoir faire quelque chose soi-même. C’est une formule très utile en réunion ou dans un entretien.',
      examples: [
        { jp: '私に説明させてください。', kana: 'わたしにせつめいさせてください。', romaji: 'Watashi ni setsumei sasete kudasai.', fr: 'Laissez-moi expliquer.' },
        { jp: 'もう一度考えさせてください。', kana: 'もういちどかんがえさせてください。', romaji: 'Mō ichido kangaesasete kudasai.', fr: 'Laissez-moi réfléchir encore une fois.' }
      ]
    }
  ],
  tip: 'Avec un verbe transitif, la personne poussée est souvent en に. Le causatif-passif ajoute souvent une nuance de contrainte subie, pas seulement une action passive.',
  exercises: [
    {
      id: 'b2-causatif-e1',
      type: 'choice',
      question: 'Quelle est la forme causative du verbe 書く ?',
      options: [
        { jp: '書かせる', kana: 'かかせる', romaji: 'kakaseru', fr: 'faire écrire', correct: true },
        { jp: '書かれる', kana: 'かかれる', romaji: 'kakareru', fr: 'être écrit (passif)' },
        { jp: '書ける', kana: 'かける', romaji: 'kakeru', fr: 'pouvoir écrire (potentiel)' }
      ],
      explanation: '書く est un verbe en -u : base 書か- + せる. 書かれる est le passif, 書ける le potentiel.'
    },
    {
      id: 'b2-causatif-e2',
      type: 'choice',
      question: 'Complète : « Ma mère m’a fait manger des légumes. »',
      sentence: { jp: '母は私に野菜を ___。', kana: 'はははわたしにやさいを ___。', romaji: 'Haha wa watashi ni yasai o ___.', fr: 'Ma mère m’a fait manger des légumes.' },
      options: [
        { jp: '食べさせました', kana: 'たべさせました', romaji: 'tabesasemashita', fr: 'a fait manger', correct: true },
        { jp: '食べられました', kana: 'たべられました', romaji: 'taberaremashita', fr: 'a été mangé / a pu manger' },
        { jp: '食べました', kana: 'たべました', romaji: 'tabemashita', fr: 'a mangé' }
      ],
      explanation: 'La mère pousse l’enfant à manger : causatif 食べさせました. 食べられました serait un passif ou un potentiel.'
    },
    {
      id: 'b2-causatif-e3',
      type: 'choice',
      question: 'Que signifie « 毎日残業させられています » ?',
      focus: { jp: 'させられています', kana: 'させられています', romaji: 'saserarete imasu', fr: 'on me fait faire (malgré moi)' },
      options: [
        { jp: '強制', kana: 'きょうせい', romaji: 'kyōsei', fr: 'on me force à faire des heures supplémentaires', correct: true },
        { jp: '使役', kana: 'しえき', romaji: 'shieki', fr: 'je fais faire des heures supplémentaires' },
        { jp: '可能', kana: 'かのう', romaji: 'kanō', fr: 'je peux faire des heures supplémentaires' }
      ],
      explanation: 'La forme させられる est le causatif-passif : le locuteur subit la contrainte. Ce n’est ni lui qui fait faire, ni une simple permission.'
    },
    {
      id: 'b2-causatif-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Le professeur a fait écrire une rédaction aux étudiants. »',
      translation: 'Le professeur a fait écrire une rédaction aux étudiants.',
      tokens: [
        { jp: '先生は', kana: 'せんせいは', romaji: 'sensei wa', fr: 'le professeur' },
        { jp: '学生に', kana: 'がくせいに', romaji: 'gakusei ni', fr: 'aux étudiants' },
        { jp: '作文を', kana: 'さくぶんを', romaji: 'sakubun o', fr: 'une rédaction' },
        { jp: '書かせました', kana: 'かかせました', romaji: 'kakasemashita', fr: 'a fait écrire' }
      ],
      solution: [0, 1, 2, 3],
      answer: { jp: '先生は学生に作文を書かせました。', kana: 'せんせいはがくせいにさくぶんをかかせました。', romaji: 'Sensei wa gakusei ni sakubun o kakasemashita.', fr: 'Le professeur a fait écrire une rédaction aux étudiants.' },
      explanation: 'Le professeur est le thème, les étudiants la personne poussée (に), la rédaction l’objet (を), puis le verbe causatif.'
    }
  ]
},
{
  id: 'b2-keigo',
  level: 'B2',
  emoji: '🎎',
  title: 'Les bases du keigo',
  subtitle: 'Parler de l’autre avec respect, parler de soi avec modestie.',
  goal: 'Reconnaître le respect (尊敬語) et l’humilité (謙譲語), puis éviter de mélanger les deux.',
  patterns: [
    { jp: 'いらっしゃる', kana: 'いらっしゃる', romaji: 'irassharu', fr: 'aller, venir, être (respectueux)' },
    { jp: 'おっしゃる', kana: 'おっしゃる', romaji: 'ossharu', fr: 'dire (respectueux)' },
    { jp: '申す', kana: 'もうす', romaji: 'mōsu', fr: 's’appeler, dire (humble)' },
    { jp: 'いただく', kana: 'いただく', romaji: 'itadaku', fr: 'recevoir (humble)' },
    { jp: 'お送りいたします', kana: 'おおくりいたします', romaji: 'o-okuri itashimasu', fr: 'envoyer (humble)' }
  ],
  points: [
    {
      title: 'Respect : parler de l’autre',
      text: 'Le 尊敬語 élève la personne à qui l’on parle ou dont on parle. Les verbes changent parfois complètement : いる / 行く / 来る devient いらっしゃる, 言う devient おっしゃる.',
      examples: [
        { jp: '先生は何とおっしゃいましたか。', kana: 'せんせいはなんとおっしゃいましたか。', romaji: 'Sensei wa nan to osshaimashita ka.', fr: 'Qu’a dit le professeur ?' },
        { jp: '社長は会議室にいらっしゃいます。', kana: 'しゃちょうはかいぎしつにいらっしゃいます。', romaji: 'Shachō wa kaigishitsu ni irasshaimasu.', fr: 'Le directeur est dans la salle de réunion.' }
      ]
    },
    {
      title: 'Humilité : parler de soi',
      text: 'Le 謙譲語 abaisse son propre groupe pour respecter l’interlocuteur. On utilise 申す pour son nom, いただく pour recevoir, et お～いたす pour une action faite à l’autre.',
      examples: [
        { jp: '私は田中と申します。', kana: 'わたしはたなかともうします。', romaji: 'Watashi wa Tanaka to mōshimasu.', fr: 'Je m’appelle Tanaka.' },
        { jp: '資料をお送りいたします。', kana: 'しりょうをおおくりいたします。', romaji: 'Shiryō o o-okuri itashimasu.', fr: 'Je vais vous envoyer les documents.' }
      ]
    },
    {
      title: 'Recevoir avec humilité',
      text: 'いただく remplace もらう dans un contexte poli. Le donneur est marqué par に ou から.',
      examples: [
        { jp: '先生に本をいただきました。', kana: 'せんせいにほんをいただきました。', romaji: 'Sensei ni hon o itadakimashita.', fr: 'J’ai reçu un livre du professeur.' },
        { jp: 'お時間をいただき、ありがとうございます。', kana: 'おじかんをいただき、ありがとうございます。', romaji: 'O-jikan o itadaki, arigatō gozaimasu.', fr: 'Merci de m’avoir accordé du temps.' }
      ]
    }
  ],
  tip: 'N’utilise pas いらっしゃる pour tes propres actions, ni 申す pour celles du professeur. Le respect va vers l’autre ; l’humilité reste de ton côté.',
  exercises: [
    {
      id: 'b2-keigo-e1',
      type: 'choice',
      question: 'Quel verbe est une forme honorifique (尊敬語) ?',
      options: [
        { jp: 'いらっしゃる', kana: 'いらっしゃる', romaji: 'irassharu', fr: 'aller, venir, être (respectueux)', correct: true },
        { jp: '申す', kana: 'もうす', romaji: 'mōsu', fr: 's’appeler (humble)' },
        { jp: 'いただく', kana: 'いただく', romaji: 'itadaku', fr: 'recevoir (humble)' }
      ],
      explanation: 'いらっしゃる élève la personne dont on parle. 申す et いただく sont des formes humbles qui concernent le locuteur.'
    },
    {
      id: 'b2-keigo-e2',
      type: 'choice',
      question: 'Complète : « Je m’appelle Tanaka » en keigo humble.',
      sentence: { jp: '私は田中と ___。', kana: 'わたしはたなかと ___。', romaji: 'Watashi wa Tanaka to ___.', fr: 'Je m’appelle Tanaka.' },
      options: [
        { jp: '申します', kana: 'もうします', romaji: 'mōshimasu', fr: 'je m’appelle (humble)', correct: true },
        { jp: 'おっしゃいます', kana: 'おっしゃいます', romaji: 'osshaimasu', fr: 'il / elle dit (respectueux)' },
        { jp: 'いらっしゃいます', kana: 'いらっしゃいます', romaji: 'irasshaimasu', fr: 'il / elle est (respectueux)' }
      ],
      explanation: 'Pour parler de son propre nom, on utilise l’humilité 申します. おっしゃる et いらっしゃる sont réservés à l’autre.'
    },
    {
      id: 'b2-keigo-e3',
      type: 'choice',
      question: 'Quelle phrase est correcte pour « Je vais vous envoyer les documents » ?',
      options: [
        { jp: '資料をお送りいたします。', kana: 'しりょうをおおくりいたします。', romaji: 'Shiryō o o-okuri itashimasu.', fr: 'Je vais vous envoyer les documents (humble).', correct: true },
        { jp: '資料をお送りになります。', kana: 'しりょうをおおくりになります。', romaji: 'Shiryō o o-okuri ni narimasu.', fr: 'Vous allez envoyer les documents (respectueux).' },
        { jp: '資料を送っていただきます。', kana: 'しりょうをおくっていただきます。', romaji: 'Shiryō o okutte itadakimasu.', fr: 'Je reçois la faveur d’envoyer les documents.' }
      ],
      explanation: 'L’action est faite par le locuteur pour l’interlocuteur : お送りいたします. お～になる décrit l’action de l’autre.'
    },
    {
      id: 'b2-keigo-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Qu’a dit le professeur ? »',
      translation: 'Qu’a dit le professeur ?',
      tokens: [
        { jp: '先生は', kana: 'せんせいは', romaji: 'sensei wa', fr: 'le professeur' },
        { jp: '何と', kana: 'なんと', romaji: 'nan to', fr: 'quoi (citation)' },
        { jp: 'おっしゃいましたか', kana: 'おっしゃいましたか', romaji: 'osshaimashita ka', fr: 'a dit ? (respectueux)' }
      ],
      solution: [0, 1, 2],
      answer: { jp: '先生は何とおっしゃいましたか。', kana: 'せんせいはなんとおっしゃいましたか。', romaji: 'Sensei wa nan to osshaimashita ka.', fr: 'Qu’a dit le professeur ?' },
      explanation: '何と introduit la citation, puis le verbe respectueux おっしゃいました avec か pour la question.'
    }
  ]
}
,
{
  id: 'b2-modalite',
  level: 'B2',
  emoji: '🔮',
  title: 'Hésiter, déduire, expliquer',
  subtitle: 'Du peut-être à la quasi-certitude, et à la conclusion.',
  goal: 'Graduer le degré de certitude et distinguer une déduction d’une explication.',
  patterns: [
    { jp: 'かもしれない', kana: 'かもしれない', romaji: 'kamoshirenai', fr: 'peut-être' },
    { jp: 'に違いない', kana: 'にちがいない', romaji: 'ni chigai nai', fr: 'c’est sûrement le cas' },
    { jp: 'はずだ', kana: 'はずだ', romaji: 'hazu da', fr: 'cela devrait être le cas' },
    { jp: 'わけだ', kana: 'わけだ', romaji: 'wake da', fr: 'c’est pour cela / logiquement' }
  ],
  points: [
    {
      title: 'La possibilité',
      text: 'かもしれない laisse ouverte une possibilité, sans engagement fort. C’est la forme la plus prudente du groupe.',
      examples: [
        { jp: '明日は雨かもしれない。', kana: 'あしたはあめかもしれない。', romaji: 'Ashita wa ame kamoshirenai.', fr: 'Il pleuvra peut-être demain.' },
        { jp: '彼は来ないかもしれません。', kana: 'かれはこないかもしれません。', romaji: 'Kare wa konai kamoshiremasen.', fr: 'Il ne viendra peut-être pas.' }
      ]
    },
    {
      title: 'L’attente logique',
      text: 'はずだ exprime ce qui devrait être vrai selon la logique ou les informations disponibles. Ce n’est pas une simple supposition.',
      examples: [
        { jp: '彼はもう着いているはずです。', kana: 'かれはもうついているはずです。', romaji: 'Kare wa mō tsuite iru hazu desu.', fr: 'Il devrait déjà être arrivé.' },
        { jp: 'この道をまっすぐ行けば、駅に着くはずです。', kana: 'このみちをまっすぐいけば、えきにつくはずです。', romaji: 'Kono michi o massugu ikeba, eki ni tsuku hazu desu.', fr: 'Si tu suis cette route tout droit, tu devrais arriver à la gare.' }
      ]
    },
    {
      title: 'La forte conviction',
      text: 'に違いない affirme une conclusion avec une forte confiance, souvent à partir d’un indice visible.',
      examples: [
        { jp: '電気が消えている。誰もいないに違いない。', kana: 'でんきがきえている。だれもいないにちがいない。', romaji: 'Denki ga kiete iru. Dare mo inai ni chigai nai.', fr: 'La lumière est éteinte. Il n’y a sûrement personne.' },
        { jp: 'この問題は難しいに違いない。', kana: 'このもんだいはむずかしいにちがいない。', romaji: 'Kono mondai wa muzukashii ni chigai nai.', fr: 'Ce problème est sûrement difficile.' }
      ]
    },
    {
      title: 'La conclusion',
      text: 'わけだ présente une conclusion naturelle : « voilà pourquoi ». La forme négative わけではない signifie « ce n’est pas que… ».',
      examples: [
        { jp: '毎日練習した。上手になったわけだ。', kana: 'まいにちれんしゅうした。じょうずになったわけだ。', romaji: 'Mainichi renshū shita. Jōzu ni natta wake da.', fr: 'Il s’est entraîné tous les jours. C’est pour ça qu’il est devenu bon.' },
        { jp: '嫌いなわけではありません。', kana: 'きらいなわけではありません。', romaji: 'Kirai na wake de wa arimasen.', fr: 'Ce n’est pas que je déteste.' }
      ]
    }
  ],
  tip: 'Du plus prudent au plus affirmé : かもしれない < はずだ < に違いない. わけだ n’est pas une certitude sur l’avenir : c’est une explication après coup.',
  exercises: [
    {
      id: 'b2-modalite-e1',
      type: 'choice',
      question: 'Quelle expression marque une forte conviction ?',
      options: [
        { jp: 'に違いない', kana: 'にちがいない', romaji: 'ni chigai nai', fr: 'c’est sûrement le cas', correct: true },
        { jp: 'かもしれない', kana: 'かもしれない', romaji: 'kamoshirenai', fr: 'peut-être' },
        { jp: 'わけではない', kana: 'わけではない', romaji: 'wake de wa nai', fr: 'ce n’est pas que…' }
      ],
      explanation: 'に違いない exprime une conviction forte, souvent fondée sur un indice. かもしれない reste une possibilité.'
    },
    {
      id: 'b2-modalite-e2',
      type: 'choice',
      question: 'Complète : « Il devrait déjà être arrivé. »',
      sentence: { jp: '彼はもう着いている ___。', kana: 'かれはもうついている ___。', romaji: 'Kare wa mō tsuite iru ___.', fr: 'Il devrait déjà être arrivé.' },
      options: [
        { jp: 'はずです', kana: 'はずです', romaji: 'hazu desu', fr: 'cela devrait être le cas', correct: true },
        { jp: 'わけです', kana: 'わけです', romaji: 'wake desu', fr: 'c’est pour cela / logiquement' },
        { jp: 'そうです', kana: 'そうです', romaji: 'sō desu', fr: 'il paraît / on dit' }
      ],
      explanation: 'On exprime une attente logique à partir de ce que l’on sait : はずです. わけです expliquerait une conclusion déjà tirée.'
    },
    {
      id: 'b2-modalite-e3',
      type: 'choice',
      question: 'Quelle conclusion signifie « C’est pour ça qu’il est devenu bon » ?',
      options: [
        { jp: '上手になったわけだ。', kana: 'じょうずになったわけだ。', romaji: 'Jōzu ni natta wake da.', fr: 'C’est pour ça qu’il est devenu bon.', correct: true },
        { jp: '上手になったはずだ。', kana: 'じょうずになったはずだ。', romaji: 'Jōzu ni natta hazu da.', fr: 'Il devrait être devenu bon.' },
        { jp: '上手になったに違いない。', kana: 'じょうずになったにちがいない。', romaji: 'Jōzu ni natta ni chigai nai.', fr: 'Il est sûrement devenu bon.' }
      ],
      explanation: 'Après « il s’est entraîné tous les jours », わけだ relie l’effort à son résultat : voilà pourquoi. はずだ et に違いない ne donnent pas cette explication.'
    },
    {
      id: 'b2-modalite-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Il pleuvra peut-être demain. »',
      translation: 'Il pleuvra peut-être demain.',
      tokens: [
        { jp: '明日は', kana: 'あしたは', romaji: 'ashita wa', fr: 'demain' },
        { jp: '雨', kana: 'あめ', romaji: 'ame', fr: 'la pluie' },
        { jp: 'かもしれない', kana: 'かもしれない', romaji: 'kamoshirenai', fr: 'peut-être' }
      ],
      solution: [0, 1, 2],
      answer: { jp: '明日は雨かもしれない。', kana: 'あしたはあめかもしれない。', romaji: 'Ashita wa ame kamoshirenai.', fr: 'Il pleuvra peut-être demain.' },
      explanation: '明日は est le thème, 雨 le prédicat, puis かもしれない ajoute la possibilité. Il n’y a pas de verbe « pleuvoir » explicite dans cette phrase nominale.'
    }
  ]
},
{
  id: 'b2-concession',
  level: 'B2',
  emoji: '🌧️',
  title: 'Concession avancée',
  subtitle: 'Malgré, bien que, même si : le contraste se précise.',
  goal: 'Nuancer un contraste avec にもかかわらず, ものの, ながらも et とはいえ.',
  patterns: [
    { jp: 'にもかかわらず', kana: 'にもかかわらず', romaji: 'ni mo kakawarazu', fr: 'malgré / bien que (formel)' },
    { jp: 'ものの', kana: 'ものの', romaji: 'mono no', fr: 'bien que… (mais)' },
    { jp: 'ながらも', kana: 'ながらも', romaji: 'nagara mo', fr: 'bien que / tout en étant' },
    { jp: 'とはいえ', kana: 'とはいえ', romaji: 'to wa ie', fr: 'même si l’on dit que…' }
  ],
  points: [
    {
      title: 'Malgré : にもかかわらず',
      text: 'にもかかわらず est formel et insiste sur le caractère inattendu du contraste. Il convient à l’écrit et aux discours.',
      examples: [
        { jp: '雨にもかかわらず、試合は行われました。', kana: 'あめにもかかわらず、しあいはおこなわれました。', romaji: 'Ame ni mo kakawarazu, shiai wa okonawaremashita.', fr: 'Malgré la pluie, le match a eu lieu.' },
        { jp: '彼は若いにもかかわらず、経験が豊富です。', kana: 'かれはわかいにもかかわらず、けいけんがほうふです。', romaji: 'Kare wa wakai ni mo kakawarazu, keiken ga hōfu desu.', fr: 'Bien qu’il soit jeune, il a beaucoup d’expérience.' }
      ]
    },
    {
      title: 'Bien que… mais : ものの',
      text: 'ものの reconnaît un fait, puis ajoute une réserve. La seconde partie reste souvent en suspens ou moins affirmative.',
      examples: [
        { jp: '新しい車を買ったものの、あまり乗っていません。', kana: 'あたらしいくるまをかったものの、あまりのっていません。', romaji: 'Atarashii kuruma o katta mono no, amari notte imasen.', fr: 'J’ai acheté une nouvelle voiture, mais je ne l’utilise pas beaucoup.' },
        { jp: '申し込んだものの、まだ返事がありません。', kana: 'もうしこんだものの、まだへんじがありません。', romaji: 'Mōshikonda mono no, mada henji ga arimasen.', fr: 'J’ai fait une demande, mais je n’ai pas encore de réponse.' }
      ]
    },
    {
      title: 'Tout en étant : ながらも',
      text: 'ながらも s’attache à un état ou à un adjectif et le présente comme une concession : « tout en étant… ».',
      examples: [
        { jp: '狭いながらも、居心地がいいです。', kana: 'せまいながらも、いごこちがいいです。', romaji: 'Semai nagara mo, igokochi ga ii desu.', fr: 'Bien que ce soit petit, on s’y sent bien.' },
        { jp: '子供ながらも、よく理解しています。', kana: 'こどもながらも、よくりかいしています。', romaji: 'Kodomo nagara mo, yoku rikai shite imasu.', fr: 'Bien qu’il soit enfant, il comprend bien.' }
      ]
    },
    {
      title: 'Même si l’on dit que : とはいえ',
      text: 'とはいえ concède un point, puis le nuance : « même si l’on peut dire que…, il n’en reste pas moins que… ».',
      examples: [
        { jp: '安いとはいえ、品質はいいです。', kana: 'やすいとはいえ、ひんしつはいいです。', romaji: 'Yasui to wa ie, hinshitsu wa ii desu.', fr: 'Même si c’est bon marché, la qualité est bonne.' },
        { jp: '春とはいえ、まだ寒い日があります。', kana: 'はるとはいえ、まださむいひがあります。', romaji: 'Haru to wa ie, mada samui hi ga arimasu.', fr: 'Même si c’est le printemps, il y a encore des jours froids.' }
      ]
    }
  ],
  tip: 'にもかかわらず est le plus formel et le plus insistant. ものの laisse entendre une réserve ; ながらも décrit un état concédé ; とはいえ concède une affirmation pour mieux la nuancer.',
  exercises: [
    {
      id: 'b2-concession-e1',
      type: 'choice',
      question: 'Quelle expression signifie « malgré » de façon formelle ?',
      options: [
        { jp: 'にもかかわらず', kana: 'にもかかわらず', romaji: 'ni mo kakawarazu', fr: 'malgré / bien que (formel)', correct: true },
        { jp: 'ものの', kana: 'ものの', romaji: 'mono no', fr: 'bien que… (mais)' },
        { jp: 'ながらも', kana: 'ながらも', romaji: 'nagara mo', fr: 'tout en étant' }
      ],
      explanation: 'にもかかわらず est la forme la plus soutenue et la plus insistante pour « malgré ». Les autres marquent aussi une concession, avec d’autres nuances.'
    },
    {
      id: 'b2-concession-e2',
      type: 'choice',
      question: 'Complète : « J’ai acheté une nouvelle voiture, mais je ne l’utilise pas beaucoup. »',
      sentence: { jp: '新しい車を買った ___、あまり乗っていません。', kana: 'あたらしいくるまをかった ___、あまりのっていません。', romaji: 'Atarashii kuruma o katta ___, amari notte imasen.', fr: 'J’ai acheté une nouvelle voiture, mais je ne l’utilise pas beaucoup.' },
      options: [
        { jp: 'ものの', kana: 'ものの', romaji: 'mono no', fr: 'bien que… (mais)', correct: true },
        { jp: 'にもかかわらず', kana: 'にもかかわらず', romaji: 'ni mo kakawarazu', fr: 'malgré' },
        { jp: 'とはいえ', kana: 'とはいえ', romaji: 'to wa ie', fr: 'même si l’on dit que' }
      ],
      explanation: 'Le locuteur reconnaît l’achat, puis ajoute une réserve personnelle : ものの. にもかかわらず serait trop solennel et insisterait sur la surprise.'
    },
    {
      id: 'b2-concession-e3',
      type: 'choice',
      question: 'Que signifie « とはいえ » ?',
      options: [
        { jp: 'とはいえ', kana: 'とはいえ', romaji: 'to wa ie', fr: 'même si l’on dit que… / cela dit…', correct: true },
        { jp: 'というより', kana: 'というより', romaji: 'to iu yori', fr: 'plutôt que de dire…' },
        { jp: 'というと', kana: 'というと', romaji: 'to iu to', fr: 'quand on parle de…' }
      ],
      explanation: 'とはいえ concède une affirmation avant de la nuancer. というより corrige une formulation ; というと introduit un sujet.'
    },
    {
      id: 'b2-concession-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Malgré la pluie, le match a eu lieu. »',
      translation: 'Malgré la pluie, le match a eu lieu.',
      tokens: [
        { jp: '雨にもかかわらず', kana: 'あめにもかかわらず', romaji: 'ame ni mo kakawarazu', fr: 'malgré la pluie' },
        { jp: '試合は', kana: 'しあいは', romaji: 'shiai wa', fr: 'le match' },
        { jp: '行われました', kana: 'おこなわれました', romaji: 'okonawaremashita', fr: 'a eu lieu' }
      ],
      solution: [0, 1, 2],
      answer: { jp: '雨にもかかわらず、試合は行われました。', kana: 'あめにもかかわらず、しあいはおこなわれました。', romaji: 'Ame ni mo kakawarazu, shiai wa okonawaremashita.', fr: 'Malgré la pluie, le match a eu lieu.' },
      explanation: 'La concession ouvre la phrase, puis le thème 試合は et le verbe 行われました. Le contraste est présenté comme une information officielle.'
    }
  ]
}
,
{
  id: 'b2-apparence',
  level: 'B2',
  emoji: '👀',
  title: 'Ce que l’on voit, ce que l’on entend',
  subtitle: 'Apparence, déduction et ouï-dire.',
  goal: 'Distinguer そうだ (apparence), ようだ (déduction), らしい (ouï-dire) et みたいだ (familier).',
  patterns: [
    { jp: 'そうだ', kana: 'そうだ', romaji: 'sō da', fr: 'on dirait que… (apparence)' },
    { jp: 'ようだ', kana: 'ようだ', romaji: 'yō da', fr: 'il semble que… (déduction)' },
    { jp: 'らしい', kana: 'らしい', romaji: 'rashii', fr: 'il paraît que… / à ce qu’on dit' },
    { jp: 'みたいだ', kana: 'みたいだ', romaji: 'mitai da', fr: 'on dirait… (familier)' }
  ],
  points: [
    {
      title: 'L’apparence avec そうだ',
      text: 'Pour une impression visuelle, そうだ suit le radical de l’adjectif ou du verbe : おいしい → おいしそう, 降る → 降りそう. On regarde, on imagine.',
      examples: [
        { jp: '雨が降りそうです。', kana: 'あめがふりそうです。', romaji: 'Ame ga furisō desu.', fr: 'On dirait qu’il va pleuvoir.' },
        { jp: 'このケーキはおいしそうです。', kana: 'このけーきはおいしそうです。', romaji: 'Kono kēki wa oishisō desu.', fr: 'Ce gâteau a l’air délicieux.' }
      ]
    },
    {
      title: 'La déduction avec ようだ',
      text: 'ようだ se fonde sur des indices ou une observation. C’est une déduction polie, souvent moins directe qu’une affirmation.',
      examples: [
        { jp: '彼は具合が悪いようです。', kana: 'かれはぐあいがわるいようです。', romaji: 'Kare wa guai ga warui yō desu.', fr: 'Il semble ne pas aller bien.' },
        { jp: '外は雨のようです。', kana: 'そとはあめのようです。', romaji: 'Soto wa ame no yō desu.', fr: 'On dirait qu’il pleut dehors.' }
      ]
    },
    {
      title: 'Le ouï-dire avec らしい',
      text: 'らしい rapporte une information entendue ou lue, ou décrit un trait typique. Avec une source comme ニュースによると, c’est le ouï-dire.',
      examples: [
        { jp: 'ニュースによると、台風が来るらしいです。', kana: 'にゅーすによると、たいふうがくるらしいです。', romaji: 'Nyūsu ni yoru to, taifū ga kuru rashii desu.', fr: 'D’après les nouvelles, un typhon arriverait.' },
        { jp: '彼は日本に住んでいるらしいです。', kana: 'かれはにほんにすんでいるらしいです。', romaji: 'Kare wa Nihon ni sunde iru rashii desu.', fr: 'Il paraît qu’il habite au Japon.' }
      ]
    },
    {
      title: 'La version familière : みたいだ',
      text: 'みたいだ fonctionne comme ようだ, mais dans un registre familier. On l’entend beaucoup à l’oral.',
      examples: [
        { jp: '外は雨みたいだ。', kana: 'そとはあめみたいだ。', romaji: 'Soto wa ame mitai da.', fr: 'On dirait qu’il pleut dehors.' },
        { jp: '彼、疲れているみたい。', kana: 'かれ、つかれているみたい。', romaji: 'Kare, tsukarete iru mitai.', fr: 'Il a l’air fatigué.' }
      ]
    }
  ],
  tip: 'そうだ (apparence) part du radical ; ようだ et みたいだ déduisent ; らしい rapporte ou caractérise. Ne confonds pas そうだ d’apparence avec そうだ du ouï-dire (降るそうです = on dit qu’il va pleuvoir).',
  exercises: [
    {
      id: 'b2-apparence-e1',
      type: 'choice',
      question: 'Quelle expression exprime une apparence visuelle : « on dirait que » ?',
      options: [
        { jp: 'おいしそう', kana: 'おいしそう', romaji: 'oishisō', fr: 'a l’air délicieux', correct: true },
        { jp: 'おいしいらしい', kana: 'おいしいらしい', romaji: 'oishii rashii', fr: 'il paraît que c’est délicieux' },
        { jp: 'おいしいはず', kana: 'おいしいはず', romaji: 'oishii hazu', fr: 'ça devrait être délicieux' }
      ],
      explanation: 'L’apparence visuelle se forme avec le radical + そう : おいしそう. らしい rapporte une information, はず exprime une attente.'
    },
    {
      id: 'b2-apparence-e2',
      type: 'choice',
      question: 'Complète : « On dirait qu’il va pleuvoir. »',
      sentence: { jp: '雨が ___。', kana: 'あめが ___。', romaji: 'Ame ga ___.', fr: 'On dirait qu’il va pleuvoir.' },
      options: [
        { jp: '降りそうです', kana: 'ふりそうです', romaji: 'furisō desu', fr: 'on dirait qu’il va pleuvoir', correct: true },
        { jp: '降るらしいです', kana: 'ふるらしいです', romaji: 'furu rashii desu', fr: 'il paraît qu’il va pleuvoir' },
        { jp: '降るはずです', kana: 'ふるはずです', romaji: 'furu hazu desu', fr: 'il devrait pleuvoir' }
      ],
      explanation: 'L’impression visuelle se forme sur le radical : 降り + そうです. らしい est un ouï-dire, はず une attente logique.'
    },
    {
      id: 'b2-apparence-e3',
      type: 'choice',
      question: 'Quelle phrase rapporte une information venue des nouvelles ?',
      options: [
        { jp: 'ニュースによると、台風が来るらしいです。', kana: 'にゅーすによると、たいふうがくるらしいです。', romaji: 'Nyūsu ni yoru to, taifū ga kuru rashii desu.', fr: 'D’après les nouvelles, un typhon arriverait.', correct: true },
        { jp: 'ニュースによると、台風が来そうです。', kana: 'にゅーすによると、たいふうがきそうです。', romaji: 'Nyūsu ni yoru to, taifū ga kisō desu.', fr: 'D’après les nouvelles, un typhon aurait l’air d’arriver.' },
        { jp: 'ニュースによると、台風が来るはずです。', kana: 'にゅーすによると、たいふうがくるはずです。', romaji: 'Nyūsu ni yoru to, taifū ga kuru hazu desu.', fr: 'D’après les nouvelles, le typhon devrait arriver.' }
      ],
      explanation: 'Avec une source explicite, らしい convient au ouï-dire. そうだ d’apparence ne se combine pas naturellement avec ニュースによると ; はず exprime une attente personnelle.'
    },
    {
      id: 'b2-apparence-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Il semble ne pas aller bien. »',
      translation: 'Il semble ne pas aller bien.',
      tokens: [
        { jp: '彼は', kana: 'かれは', romaji: 'kare wa', fr: 'il' },
        { jp: '具合が', kana: 'ぐあいが', romaji: 'guai ga', fr: 'l’état de santé' },
        { jp: '悪いようです', kana: 'わるいようです', romaji: 'warui yō desu', fr: 'semble mauvais' }
      ],
      solution: [0, 1, 2],
      answer: { jp: '彼は具合が悪いようです。', kana: 'かれはぐあいがわるいようです。', romaji: 'Kare wa guai ga warui yō desu.', fr: 'Il semble ne pas aller bien.' },
      explanation: 'Le thème 彼は, puis 具合が with the adjective 悪い, et enfin ようです pour la déduction polie.'
    }
  ]
},
{
  id: 'b2-particules',
  level: 'B2',
  emoji: '🧭',
  title: 'Les particules de la nuance',
  subtitle: 'À propos de, envers, selon, en tant que, pour.',
  goal: 'Employer について, に対して, によって, として et にとって pour préciser le point de vue.',
  patterns: [
    { jp: 'について', kana: 'について', romaji: 'ni tsuite', fr: 'à propos de' },
    { jp: 'に対して', kana: 'にたいして', romaji: 'ni taishite', fr: 'envers / face à' },
    { jp: 'によって', kana: 'によって', romaji: 'ni yotte', fr: 'par / selon' },
    { jp: 'として', kana: 'として', romaji: 'to shite', fr: 'en tant que' },
    { jp: 'にとって', kana: 'にとって', romaji: 'ni totte', fr: 'du point de vue de / pour' }
  ],
  points: [
    {
      title: 'À propos de : について',
      text: 'について introduit le sujet d’un discours, d’une recherche ou d’une discussion. On peut le traduire par « au sujet de ».',
      examples: [
        { jp: '日本の文化について調べています。', kana: 'にほんのぶんかについてしらべています。', romaji: 'Nihon no bunka ni tsuite shirabete imasu.', fr: 'Je fais des recherches sur la culture japonaise.' },
        { jp: 'その件について話しましょう。', kana: 'そのけんについてはなしましょう。', romaji: 'Sono ken ni tsuite hanashimashō.', fr: 'Parlons de cette affaire.' }
      ]
    },
    {
      title: 'Envers : に対して',
      text: 'に対して indique la personne ou la chose vers laquelle une attitude, une réaction ou une comparaison est dirigée.',
      examples: [
        { jp: '先生に対して、失礼なことを言ってしまいました。', kana: 'せんせいにたいして、しつれいなことをいってしまいました。', romaji: 'Sensei ni taishite, shitsurei na koto o itte shimaimashita.', fr: 'J’ai dit quelque chose d’impoli à l’égard du professeur.' },
        { jp: 'この薬は子供に対して安全です。', kana: 'このくすりはこどもにたいしてあんぜんです。', romaji: 'Kono kusuri wa kodomo ni taishite anzen desu.', fr: 'Ce médicament est sûr pour les enfants.' }
      ]
    },
    {
      title: 'Par ou selon : によって',
      text: 'によって marque l’auteur d’une action au passif, ou une différence selon un critère.',
      examples: [
        { jp: 'この絵は有名な画家によって描かれました。', kana: 'このえはゆうめいながかによってかかれました。', romaji: 'Kono e wa yūmei na gaka ni yotte kakaremashita.', fr: 'Ce tableau a été peint par un peintre célèbre.' },
        { jp: '国によって習慣が違います。', kana: 'くにによってしゅうかんがちがいます。', romaji: 'Kuni ni yotte shūkan ga chigaimasu.', fr: 'Les coutumes diffèrent selon le pays.' }
      ]
    },
    {
      title: 'En tant que / pour : として, にとって',
      text: 'として présente un rôle ou une qualité. にとって donne le point de vue d’une personne ou d’un groupe.',
      examples: [
        { jp: '私は学生として日本に来ました。', kana: 'わたしはがくせいとしてにほんにきました。', romaji: 'Watashi wa gakusei to shite Nihon ni kimashita.', fr: 'Je suis venu au Japon en tant qu’étudiant.' },
        { jp: '私にとって、家族が一番大切です。', kana: 'わたしにとって、かぞくがいちばんたいせつです。', romaji: 'Watashi ni totte, kazoku ga ichiban taisetsu desu.', fr: 'Pour moi, la famille est le plus important.' }
      ]
    }
  ],
  tip: 'について = le sujet ; に対して = la direction d’une attitude ; によって = l’agent ou le critère ; として = le rôle ; にとって = le point de vue.',
  exercises: [
    {
      id: 'b2-particules-e1',
      type: 'choice',
      question: 'Quelle particule signifie « à propos de » ?',
      options: [
        { jp: 'について', kana: 'について', romaji: 'ni tsuite', fr: 'à propos de', correct: true },
        { jp: 'にとって', kana: 'にとって', romaji: 'ni totte', fr: 'du point de vue de' },
        { jp: 'として', kana: 'として', romaji: 'to shite', fr: 'en tant que' }
      ],
      explanation: 'について introduit le thème d’un discours ou d’une recherche. にとって donne un point de vue, として un rôle.'
    },
    {
      id: 'b2-particules-e2',
      type: 'choice',
      question: 'Complète : « Pour moi, la famille est le plus important. »',
      sentence: { jp: '私 ___、家族が一番大切です。', kana: 'わたし ___、かぞくがいちばんたいせつです。', romaji: 'Watashi ___, kazoku ga ichiban taisetsu desu.', fr: 'Pour moi, la famille est le plus important.' },
      options: [
        { jp: 'にとって', kana: 'にとって', romaji: 'ni totte', fr: 'du point de vue de', correct: true },
        { jp: 'に対して', kana: 'にたいして', romaji: 'ni taishite', fr: 'envers' },
        { jp: 'によって', kana: 'によって', romaji: 'ni yotte', fr: 'par / selon' }
      ],
      explanation: '家族 est important du point de vue du locuteur : にとって. に対して exprimerait une attitude envers la famille.'
    },
    {
      id: 'b2-particules-e3',
      type: 'choice',
      question: 'Quelle phrase signifie « Ce tableau a été peint par un peintre célèbre » ?',
      options: [
        { jp: 'この絵は有名な画家によって描かれました。', kana: 'このえはゆうめいながかによってかかれました。', romaji: 'Kono e wa yūmei na gaka ni yotte kakaremashita.', fr: 'Ce tableau a été peint par un peintre célèbre.', correct: true },
        { jp: 'この絵は有名な画家にとって描かれました。', kana: 'このえはゆうめいながかにとってかかれました。', romaji: 'Kono e wa yūmei na gaka ni totte kakaremashita.', fr: 'Ce tableau a été peint du point de vue d’un peintre célèbre.' },
        { jp: 'この絵は有名な画家として描かれました。', kana: 'このえはゆうめいながかとしてかかれました。', romaji: 'Kono e wa yūmei na gaka to shite kakaremashita.', fr: 'Ce tableau a été peint en tant que peintre célèbre.' }
      ],
      explanation: 'L’auteur d’un passif se marque avec によって. にとって et として ne marquent pas l’agent.'
    },
    {
      id: 'b2-particules-e4',
      type: 'order',
      question: 'Remets la phrase dans l’ordre : « Je suis venu au Japon en tant qu’étudiant. »',
      translation: 'Je suis venu au Japon en tant qu’étudiant.',
      tokens: [
        { jp: '私は', kana: 'わたしは', romaji: 'watashi wa', fr: 'je' },
        { jp: '学生として', kana: 'がくせいとして', romaji: 'gakusei to shite', fr: 'en tant qu’étudiant' },
        { jp: '日本に', kana: 'にほんに', romaji: 'Nihon ni', fr: 'au Japon' },
        { jp: '来ました', kana: 'きました', romaji: 'kimashita', fr: 'je suis venu' }
      ],
      solution: [0, 1, 2, 3],
      answer: { jp: '私は学生として日本に来ました。', kana: 'わたしはがくせいとしてにほんにきました。', romaji: 'Watashi wa gakusei to shite Nihon ni kimashita.', fr: 'Je suis venu au Japon en tant qu’étudiant.' },
      explanation: 'Le rôle se place avant la destination et le verbe : 学生として, puis 日本に来ました.'
    }
  ]
}
// __MORE_LESSONS__
];

const LEVELS = [
  { id: 'B1', title: 'Se débrouiller', description: 'Structurer, nuancer et raconter au quotidien.' },
  { id: 'B2', title: 'Gagner en nuance', description: 'Exprimer la cause, la concession, le point de vue et la politesse fine.' }
];
const HISTORY_MAX = 40;

function lessonsByLevel(level) {
  return LESSONS.filter(function (lesson) { return lesson.level === level; });
}

function lessonById(id) {
  return LESSONS.filter(function (lesson) { return lesson.id === id; })[0] || null;
}

function cleanInt(value, max) {
  const n = Math.max(0, Math.floor(Number(value) || 0));
  return max != null ? Math.min(max, n) : n;
}

function emptyLessonProgress() {
  return { attempts: 0, bestScore: 0, completedAt: 0, lastAt: 0, answers: {} };
}

function normalizeLessonProgress(raw) {
  const out = emptyLessonProgress();
  if (!raw || typeof raw !== 'object') return out;
  out.attempts = cleanInt(raw.attempts);
  out.bestScore = cleanInt(raw.bestScore, 100);
  out.completedAt = cleanInt(raw.completedAt);
  out.lastAt = cleanInt(raw.lastAt);
  if (raw.answers && typeof raw.answers === 'object') {
    Object.keys(raw.answers).forEach(function (key) {
      if (typeof raw.answers[key] === 'boolean') out.answers[String(key)] = raw.answers[key];
    });
  }
  return out;
}

function progressFor(state, id) {
  const lessons = state && state.grammar && state.grammar.lessons;
  return normalizeLessonProgress(lessons && lessons[id]);
}

function ensureProgress(state, id) {
  if (!state.grammar || typeof state.grammar !== 'object') state.grammar = { lessons: {} };
  if (!state.grammar.lessons || typeof state.grammar.lessons !== 'object') state.grammar.lessons = {};
  if (!state.grammar.lessons[id]) state.grammar.lessons[id] = emptyLessonProgress();
  return state.grammar.lessons[id];
}

function levelStats(state, level) {
  const list = lessonsByLevel(level);
  let completed = 0;
  let started = 0;
  let scoreSum = 0;
  list.forEach(function (lesson) {
    const p = progressFor(state, lesson.id);
    if (p.completedAt) completed++;
    if (p.attempts || Object.keys(p.answers).length) started++;
    scoreSum += p.bestScore;
  });
  return {
    total: list.length,
    completed: completed,
    started: started,
    average: list.length ? Math.round(scoreSum / list.length) : 0,
    percent: list.length ? Math.round(completed / list.length * 100) : 0
  };
}

function nextLessonId(level, afterId) {
  const list = lessonsByLevel(level);
  const index = list.findIndex(function (lesson) { return lesson.id === afterId; });
  return index >= 0 && list[index + 1] ? list[index + 1].id : '';
}

function reviewExerciseIds(lesson, progress, preferredId) {
  const exercises = lesson.exercises || [];
  const exists = function (id) { return exercises.some(function (ex) { return ex.id === id; }); };
  const wrong = exercises.filter(function (ex) { return progress.answers[ex.id] === false; }).map(function (ex) { return ex.id; });
  if (preferredId && exists(preferredId)) {
    if (progress.answers[preferredId] === false) return [preferredId].concat(wrong.filter(function (id) { return id !== preferredId; }));
    if (!wrong.length) return [preferredId];
  }
  return wrong;
}

function reviewQueueFor(state, lessonId, preferredExerciseId) {
  const lesson = lessonById(lessonId);
  if (!lesson) return [];
  return reviewExerciseIds(lesson, progressFor(state, lessonId), preferredExerciseId);
}

function nextStepFor(state, lessonId, correct, preferredExerciseId) {
  const lesson = lessonById(lessonId);
  if (!lesson) return null;
  const progress = progressFor(state, lessonId);
  const exerciseId = reviewExerciseIds(lesson, progress, preferredExerciseId)[0] || '';
  if (!correct) {
    return {
      kind: 'review',
      lessonId: lesson.id,
      exerciseId: exerciseId,
      label: exerciseId ? 'Refaire l’exercice' : 'Revoir la leçon',
      text: exerciseId
        ? 'Reprends directement l’exercice ciblé de « ' + lesson.title + ' » pour vérifier la nuance.'
        : 'Revois « ' + lesson.title + ' » dans le parcours, puis refais l’exercice.'
    };
  }
  if (!progress.completedAt) {
    return { kind: 'finish', lessonId: lesson.id, label: 'Terminer la leçon', text: 'Tu as réussi ce point. Termine les exercices de « ' + lesson.title + ' » pour valider la leçon.' };
  }
  if (progress.bestScore < 100) {
    return {
      kind: 'review',
      lessonId: lesson.id,
      exerciseId: exerciseId,
      label: exerciseId ? 'Refaire l’exercice' : 'Revoir la leçon',
      text: exerciseId
        ? 'Ce point est acquis, mais la leçon n’est pas encore à 100 %. Reprends l’exercice à consolider.'
        : 'Ce point est acquis, mais la leçon n’est pas encore à 100 %. Revois-la avant de passer à la suite.'
    };
  }
  const index = LESSONS.indexOf(lesson);
  const next = index >= 0 ? LESSONS[index + 1] : null;
  if (next) {
    return { kind: 'next', lessonId: next.id, label: 'Leçon suivante', text: 'Passe à la leçon suivante : « ' + next.title + ' ».' };
  }
  return { kind: 'done', lessonId: '', label: 'Retour au parcours', text: 'Tu as terminé le parcours B1/B2. Continue à réviser les leçons fragiles.' };
}

function validateContent() {
  const errors = [];
  const ids = {};
  const levels = {};
  LESSONS.forEach(function (lesson) {
    if (!lesson || !lesson.id) { errors.push('Leçon sans identifiant.'); return; }
    if (ids[lesson.id]) errors.push('Identifiant de leçon dupliqué : ' + lesson.id);
    ids[lesson.id] = true;
    if (lesson.level !== 'B1' && lesson.level !== 'B2') errors.push(lesson.id + ' : niveau invalide.');
    levels[lesson.level] = (levels[lesson.level] || 0) + 1;
    ['title', 'subtitle', 'goal', 'emoji', 'tip'].forEach(function (key) {
      if (!String(lesson[key] || '').trim()) errors.push(lesson.id + ' : ' + key + ' manquant.');
    });
    if (!Array.isArray(lesson.patterns) || !lesson.patterns.length) errors.push(lesson.id + ' : aucun motif.');
    (lesson.patterns || []).forEach(function (item, i) {
      ['jp', 'kana', 'romaji', 'fr'].forEach(function (key) {
        if (!String(item && item[key] || '').trim()) errors.push(lesson.id + ' motif ' + (i + 1) + ' : ' + key + ' manquant.');
      });
      if (/[\u4e00-\u9fff]/.test(String(item && item.kana || ''))) errors.push(lesson.id + ' motif ' + (i + 1) + ' : la lecture contient un kanji.');
    });
    if (!Array.isArray(lesson.points) || lesson.points.length < 2) errors.push(lesson.id + ' : points insuffisants.');
    (lesson.points || []).forEach(function (point, i) {
      if (!String(point && point.title || '').trim()) errors.push(lesson.id + ' point ' + (i + 1) + ' : titre manquant.');
      if (!String(point && point.text || '').trim()) errors.push(lesson.id + ' point ' + (i + 1) + ' : texte manquant.');
      (point && point.examples || []).forEach(function (example, j) {
        ['jp', 'kana', 'romaji', 'fr'].forEach(function (key) {
          if (!String(example && example[key] || '').trim()) errors.push(lesson.id + ' exemple ' + (i + 1) + '.' + (j + 1) + ' : ' + key + ' manquant.');
        });
        if (/[\u4e00-\u9fff]/.test(String(example && example.kana || ''))) errors.push(lesson.id + ' exemple ' + (i + 1) + '.' + (j + 1) + ' : la lecture contient un kanji.');
      });
    });
    if (!Array.isArray(lesson.exercises) || lesson.exercises.length < 3) errors.push(lesson.id + ' : exercices insuffisants.');
    const exerciseIds = {};
    (lesson.exercises || []).forEach(function (ex, i) {
      if (!ex || !ex.id) { errors.push(lesson.id + ' exercice ' + (i + 1) + ' : identifiant manquant.'); return; }
      if (exerciseIds[ex.id]) errors.push(lesson.id + ' : identifiant d’exercice dupliqué ' + ex.id);
      exerciseIds[ex.id] = true;
      if (!String(ex.question || '').trim()) errors.push(ex.id + ' : question manquante.');
      if (!String(ex.explanation || '').trim()) errors.push(ex.id + ' : explication manquante.');
      if (ex.focus && !['jp', 'kana', 'romaji', 'fr'].every(function (key) { return String(ex.focus[key] || '').trim(); })) errors.push(ex.id + ' : focus incomplet.');
      if (ex.sentence && !['jp', 'kana', 'romaji', 'fr'].every(function (key) { return String(ex.sentence[key] || '').trim(); })) errors.push(ex.id + ' : phrase incomplète.');
      if (ex.type === 'choice') {
        if (!Array.isArray(ex.options) || ex.options.length < 2) errors.push(ex.id + ' : options insuffisantes.');
        const correct = (ex.options || []).filter(function (option) { return option.correct === true; }).length;
        if (correct !== 1) errors.push(ex.id + ' : il faut exactement une bonne option.');
        (ex.options || []).forEach(function (option, j) {
          ['jp', 'kana', 'romaji', 'fr'].forEach(function (key) {
            if (!String(option && option[key] || '').trim()) errors.push(ex.id + ' option ' + (j + 1) + ' : ' + key + ' manquant.');
          });
          if (/[\u4e00-\u9fff]/.test(String(option && option.kana || ''))) errors.push(ex.id + ' option ' + (j + 1) + ' : la lecture contient un kanji.');
        });
      } else if (ex.type === 'order') {
        if (!Array.isArray(ex.tokens) || ex.tokens.length < 2) errors.push(ex.id + ' : jetons insuffisants.');
        if (!Array.isArray(ex.solution) || ex.solution.length !== (ex.tokens || []).length) errors.push(ex.id + ' : solution incomplète.');
        const sorted = (ex.solution || []).slice().sort(function (a, b) { return a - b; });
        sorted.forEach(function (value, j) { if (value !== j) errors.push(ex.id + ' : solution invalide.'); });
        if (!ex.answer || !['jp', 'kana', 'romaji', 'fr'].every(function (key) { return String(ex.answer[key] || '').trim(); })) errors.push(ex.id + ' : réponse complète manquante.');
        (ex.tokens || []).forEach(function (token, j) {
          ['jp', 'kana', 'romaji', 'fr'].forEach(function (key) {
            if (!String(token && token[key] || '').trim()) errors.push(ex.id + ' jeton ' + (j + 1) + ' : ' + key + ' manquant.');
          });
        });
      } else {
        errors.push(ex.id + ' : type inconnu.');
      }
    });
  });
  if ((levels.B1 || 0) < 6) errors.push('Le parcours doit contenir au moins 6 leçons B1.');
  if ((levels.B2 || 0) < 6) errors.push('Le parcours doit contenir au moins 6 leçons B2.');
  return errors;
}

function normalizeHistory(raw) {
  const list = Array.isArray(raw) ? raw : [];
  const seen = {};
  const out = [];
  list.forEach(function (item) {
    if (!item || typeof item !== 'object') return;
    const at = Math.max(0, Math.floor(Number(item.at) || 0));
    const lessonId = String(item.lessonId || '').trim();
    if (!at || !lessonId) return;
    const exerciseId = String(item.exerciseId || '').trim();
    const key = at + ':' + lessonId + ':' + exerciseId;
    if (seen[key]) return;
    seen[key] = true;
    out.push({
      at: at,
      lessonId: lessonId,
      exerciseId: exerciseId,
      title: String(item.title || '').slice(0, 120),
      level: item.level === 'B2' ? 'B2' : 'B1',
      score: Math.max(0, Math.min(100, Math.floor(Number(item.score) || 0))),
      correct: item.correct === true,
      reason: ['review', 'practice', 'discover'].indexOf(item.reason) >= 0 ? item.reason : 'review'
    });
  });
  out.sort(function (a, b) { return b.at - a.at; });
  return out.slice(0, HISTORY_MAX);
}
function recordDailyReview(state, data, now) {
  if (!data || !data.lessonId) return null;
  if (!state.grammar || typeof state.grammar !== 'object') state.grammar = { lessons: {}, history: [] };
  if (!Array.isArray(state.grammar.history)) state.grammar.history = [];
  const record = normalizeHistory([Object.assign({}, data, { at: Number(now) || Date.now() })])[0];
  if (!record) return null;
  state.grammar.history = normalizeHistory(state.grammar.history.concat([record]));
  return record;
}
function recentHistory(state, limit) {
  const max = limit == null ? 8 : Math.max(0, Math.floor(Number(limit) || 0));
  return normalizeHistory(state && state.grammar && state.grammar.history).slice(0, max);
}
function dailyPick(state, now) {
  const stamp = Number(now) || Date.now();
  const day = Math.floor(stamp / 86400000);
  const rows = LESSONS.map(function (lesson, index) {
    const p = progressFor(state, lesson.id);
    const answers = p.answers || {};
    const wrong = Object.keys(answers).filter(function (id) { return answers[id] === false; });
    const answered = Object.keys(answers).length;
    return { lesson: lesson, index: index, progress: p, wrong: wrong, answered: answered };
  });
  const failed = rows.filter(function (row) {
    return row.wrong.length > 0 || !!(row.progress.completedAt && row.progress.bestScore < 100);
  });
  const started = rows.filter(function (row) { return row.answered > 0 && !row.progress.completedAt; });
  const unseen = rows.filter(function (row) { return !row.answered && !row.progress.attempts; });
  const unfinished = rows.filter(function (row) { return !row.progress.completedAt; });
  let pool;
  let reason;
  if (failed.length) { pool = failed; reason = 'review'; }
  else if (started.length) { pool = started; reason = 'practice'; }
  else if (unseen.length) { pool = unseen; reason = 'discover'; }
  else if (unfinished.length) { pool = unfinished; reason = 'practice'; }
  else { pool = rows; reason = 'review'; }
  pool.sort(function (a, b) {
    if (a.progress.bestScore !== b.progress.bestScore) return a.progress.bestScore - b.progress.bestScore;
    if (a.wrong.length !== b.wrong.length) return b.wrong.length - a.wrong.length;
    if (a.progress.lastAt !== b.progress.lastAt) return a.progress.lastAt - b.progress.lastAt;
    return a.index - b.index;
  });
  const row = pool[0];
  if (!row) return null;
  const wrongExercises = row.lesson.exercises.filter(function (ex) { return row.wrong.indexOf(ex.id) >= 0; });
  const candidates = wrongExercises.length ? wrongExercises : row.lesson.exercises;
  const exercise = candidates[((day % candidates.length) + candidates.length) % candidates.length];
  return { lesson: row.lesson, exercise: exercise, reason: reason, progress: row.progress };
}

const api = {
  LEVELS: LEVELS,
  lessons: LESSONS,
  lessonsByLevel: lessonsByLevel,
  lessonById: lessonById,
  emptyLessonProgress: emptyLessonProgress,
  normalizeLessonProgress: normalizeLessonProgress,
  progressFor: progressFor,
  ensureProgress: ensureProgress,
  levelStats: levelStats,
  nextLessonId: nextLessonId,
  nextStepFor: nextStepFor,
  reviewQueueFor: reviewQueueFor,
  dailyPick: dailyPick,
  normalizeHistory: normalizeHistory,
  recordDailyReview: recordDailyReview,
  recentHistory: recentHistory,
  validateContent: validateContent
};

root.Kotoba = root.Kotoba || {};
root.Kotoba.GrammarTrack = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
