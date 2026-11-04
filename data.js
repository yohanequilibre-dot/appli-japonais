/* Vocabulaire optimisé — japonais poli uniquement.
   AMÉLIORATIONS : Phrases variées avec négations, questions, contextes réels
   Format : [kanji, furigana, romaji, français, phrase japonaise, traduction] */
window.UNITS_DATA = [
  { id:"salutations", name:"Saluer et dire au revoir", emoji:"👋", words:[
    ["こんにちは","","konnichiwa","bonjour (après-midi)","こんにちは、元気ですか。","Bonjour, comment allez-vous ?"],
    ["おはようございます","","ohayō gozaimasu","bonjour (matin, poli)","おはようございます。今日もいい天気ですね。","Bonjour. Il fait beau aujourd'hui aussi."],
    ["こんばんは","","konbanwa","bonsoir","こんばんは、お疲れ様です。","Bonsoir, bonne fin de journée."],
    ["さようなら","","sayōnara","au revoir","さようなら、また明日会いましょう。","Au revoir, à demain."],
    ["ありがとうございます","","arigatō gozaimasu","merci (poli)","手伝ってくれてありがとうございます。","Merci de m'avoir aidé."],
    ["すみません","","sumimasen","excusez-moi / pardon","すみません、駅はどこですか。","Excusez-moi, où est la gare ?"],
    ["はい","","hai","oui","はい、そうです。","Oui, c'est ça."],
    ["いいえ","","iie","non","いいえ、違います。","Non, ce n'est pas ça."],
    ["お願いします","お願[ねが]いします","onegai shimasu","s'il vous plaît","コーヒーをお願いします。","Un café, s'il vous plaît.","",[{"jp":"ください","reading":"ください","romaji":"kudasai","usage":"Plus directe et concrète, mais polie elle aussi. Elle suit un nom (+ を) ou une forme en て. Les deux se disent.","example":"コーヒーをください。","exampleFr":"Un café, s'il vous plaît.","exampleRomaji":"Kōhī o kudasai."}],{"nuance":"« お願いします » est plus douce et générale. « ください » est plus directe et concrète : elle peut sembler plus forte, mais elle reste polie. Les deux se disent.","contextNote":"Au café, les deux se disent : « コーヒーをお願いします » est plus douce, « コーヒーをください » plus directe. « ください » n’est pas une erreur."}],
    ["大丈夫","大丈夫[だいじょうぶ]","daijōbu","ça va / pas de problème","大丈夫です、心配しないでください。","Ça va, ne vous inquiétez pas."]
  ]},
  { id:"presentation", name:"Se présenter", emoji:"🙋", words:[
    ["私","私[わたし]","watashi","je / moi","私は学生です。","Je suis étudiant."],
    ["名前","名前[なまえ]","namae","nom","お名前は何ですか。","Quel est votre nom ?"],
    ["友達","友達[ともだち]","tomodachi","ami(e)","彼は私の友達です。","C'est mon ami."],
    ["学生","学生[がくせい]","gakusei","étudiant(e)","私は大学の学生ではありません。","Je ne suis pas étudiant à l'université."],
    ["先生","先生[せんせい]","sensei","professeur","田中先生は日本語を教えています。","Le professeur Tanaka enseigne le japonais."],
    ["日本人","日本[にほん]人[じん]","nihonjin","Japonais(e)","彼女は日本人ですか。","Est-elle japonaise ?"],
    ["日本語","日本[にほん]語[ご]","nihongo","le japonais","日本語を勉強しています。","J'étudie le japonais."],
    ["誰","誰[だれ]","dare","qui","あの人は誰ですか。","Qui est cette personne ?"],
    ["何","何[なに]","nani","quoi","これは何ですか。","Qu'est-ce que c'est ?"],
    ["出身","出身[しゅっしん]","shusshin","origine","ご出身はどちらですか。","D'où venez-vous ?"]
  ]},
  { id:"nourriture", name:"Parler de la nourriture", emoji:"🍙", words:[
    ["水","水[みず]","mizu","eau","水を一杯ください。","Un verre d'eau, s'il vous plaît."],
    ["お茶","お茶[ちゃ]","ocha","thé","毎朝お茶を飲みます。","Je bois du thé chaque matin."],
    ["コーヒー","","kōhī","café","コーヒーは飲みません。","Je ne bois pas de café."],
    ["ご飯","ご飯[はん]","gohan","riz / repas","今日はご飯を食べませんでした。","Je n'ai pas mangé aujourd'hui."],
    ["パン","","pan","pain","朝はパンを食べます。","Le matin, je mange du pain."],
    ["肉","肉[にく]","niku","viande","肉は好きじゃないです。","Je n'aime pas la viande."],
    ["魚","魚[さかな]","sakana","poisson","魚をよく食べますか。","Vous mangez souvent du poisson ?"],
    ["野菜","野菜[やさい]","yasai","légumes","野菜をたくさん食べてください。","Mangez beaucoup de légumes."],
    ["卵","卵[たまご]","tamago","œuf","卵料理は作りません。","Je ne fais pas de plats aux œufs."],
    ["おいしい","","oishii","délicieux","このラーメンはおいしいです。","Ce ramen est délicieux."]
  ]},
  { id:"restaurant", name:"Commander à manger", emoji:"🍜", words:[
    ["メニュー","","menyū","menu","メニューを見せてください。","Montrez-moi le menu."],
    ["注文","注文[ちゅうもん]","chūmon","commande","まだ注文していません。","Je n'ai pas encore commandé."],
    ["レストラン","","resutoran","restaurant","このレストランは高いですか。","Ce restaurant est cher ?"],
    ["お会計","お会計[かいけい]","okaikei","l'addition","お会計をお願いします。","L'addition, s'il vous plaît."],
    ["おすすめ","","osusume","recommandation","今日のおすすめは何ですか。","Quelle est la recommandation du jour ?"],
    ["持ち帰り","持[も]ち帰[かえ]り","mochikaeri","à emporter","持ち帰りでお願いします。","À emporter, s'il vous plaît."],
    ["お腹","お腹[なか]","onaka","ventre","お腹が空きました。","J'ai faim."],
    ["箸","箸[はし]","hashi","baguettes","箸を使えますか。","Savez-vous utiliser des baguettes ?"],
    ["お酒","お酒[さけ]","osake","alcool / saké","お酒は飲みません。","Je ne bois pas d'alcool."],
    ["甘い","甘[あま]い","amai","sucré","甘いものは好きじゃありません。","Je n'aime pas les choses sucrées."]
  ]},
  { id:"famille", name:"Parler de sa famille", emoji:"👨‍👩‍👧", words:[
    ["家族","家族[かぞく]","kazoku","famille","家族は四人です。","Nous sommes quatre dans la famille."],
    ["母","母[はは]","haha","ma mère","母は先生です。","Ma mère est professeur."],
    ["父","父[ちち]","chichi","mon père","父は毎日働いています。","Mon père travaille tous les jours."],
    ["お母さん","お母[かあ]さん","okāsan","ta/votre mère","お母さんは元気ですか。","Votre mère va bien ?"],
    ["兄","兄[あに]","ani","mon grand frère","兄は大学生ではありません。","Mon grand frère n'est pas étudiant."],
    ["姉","姉[あね]","ane","ma grande sœur","姉は結婚していません。","Ma grande sœur n'est pas mariée."],
    ["弟","弟[おとうと]","otōto","mon petit frère","弟はゲームが好きです。","Mon petit frère aime les jeux."],
    ["妹","妹[いもうと]","imōto","ma petite sœur","妹は六歳です。","Ma petite sœur a six ans."],
    ["子供","子供[こども]","kodomo","enfant","子供が二人います。","J'ai deux enfants."],
    ["夫","夫[おっと]","otto","mari","夫は料理が上手です。","Mon mari cuisine bien."]
  ]},
  { id:"nombres", name:"Les nombres et le temps", emoji:"🔢", words:[
    ["一","一[いち]","ichi","un","一から十まで数えます。","Je compte de un à dix."],
    ["二","二[に]","ni","deux","二時に会いましょう。","Retrouvons-nous à deux heures."],
    ["三","三[さん]","san","trois","三人で行きます。","Nous y allons à trois."],
    ["十","十[じゅう]","jū","dix","十まで数えてください。","Comptez jusqu'à dix."],
    ["百","百[ひゃく]","hyaku","cent","百円です。","C'est cent yens."],
    ["今日","今日[きょう]","kyō","aujourd'hui","今日は暑くないですね。","Il ne fait pas chaud aujourd'hui, n'est-ce pas ?"],
    ["明日","明日[あした]","ashita","demain","明日は学校に行きません。","Demain, je ne vais pas à l'école."],
    ["今","今[いま]","ima","maintenant","今、何時ですか。","Quelle heure est-il maintenant ?"],
    ["時間","時間[じかん]","jikan","temps / heure","時間がありません。","Je n'ai pas le temps."],
    ["毎日","毎日[まいにち]","mainichi","chaque jour","毎日日本語を勉強します。","J'étudie le japonais chaque jour."]
  ]},
  { id:"maison", name:"La maison et la ville", emoji:"🏠", words:[
    ["家","家[いえ]","ie","maison","今日は家にいません。","Aujourd'hui, je ne suis pas à la maison."],
    ["部屋","部屋[へや]","heya","chambre / pièce","私の部屋は狭いです。","Ma chambre est petite."],
    ["台所","台所[だいどころ]","daidokoro","cuisine (pièce)","台所に母がいます。","Ma mère est dans la cuisine."],
    ["お風呂","お風呂[ふろ]","ofuro","bain","お風呂に入ります。","Je prends un bain."],
    ["トイレ","","toire","toilettes","トイレはどこですか。","Où sont les toilettes ?"],
    ["駅","駅[えき]","eki","gare","駅まで歩きますか。","Vous marchez jusqu'à la gare ?"],
    ["学校","学校[がっこう]","gakkō","école","学校は八時に始まります。","L'école commence à huit heures."],
    ["会社","会社[かいしゃ]","kaisha","entreprise","会社で働いています。","Je travaille dans une entreprise."],
    ["病院","病院[びょういん]","byōin","hôpital","今日は病院には行きません。","Aujourd'hui, je ne vais pas à l'hôpital."],
    ["図書館","図書館[としょかん]","toshokan","bibliothèque","週末は図書館で勉強します。","Le week-end, j'étudie à la bibliothèque."]
  ]},
  { id:"verbes", name:"Les verbes du quotidien (forme polie)", emoji:"🏃", words:[
    ["します","","shimasu","faire","毎日宿題をします。","Je fais mes devoirs chaque jour."],
    ["行きます","行[い]きます","ikimasu","aller","明日、東京に行きます。","Demain, j'irai à Tokyo."],
    ["来ます","来[き]ます","kimasu","venir","友達が家に来ます。","Un ami vient à la maison."],
    ["見ます","見[み]ます","mimasu","voir / regarder","夜はテレビを見ます。","Le soir, je regarde la télévision."],
    ["食べます","食[た]べます","tabemasu","manger","朝ご飯を食べますか。","Vous mangez le petit-déjeuner ?"],
    ["飲みます","飲[の]みます","nomimasu","boire","朝は水を飲みます。","Le matin, je bois de l'eau."],
    ["寝ます","寝[ね]ます","nemasu","dormir","十一時に寝ます。","Je me couche à onze heures."],
    ["起きます","起[お]きます","okimasu","se lever","六時に起きます。","Je me lève à six heures."],
    ["働きます","働[はたら]きます","hatarakimasu","travailler","会社で働いています。","Je travaille dans une entreprise.","働"],
    ["買います","買[か]います","kaimasu","acheter","スーパーでパンを買います。","J'achète du pain au supermarché."]
    ,["磨きます","磨[みが]きます","migakimasu","brosser / polir","歯を磨きます。","Je me brosse les dents."]
  ]},
  { id:"adjectifs", name:"Décrire les choses", emoji:"✨", words:[
    ["大きい","大[おお]きい","ōkii","grand","大きい犬がいます。","Il y a un grand chien."],
    ["小さい","小[ちい]さい","chiisai","petit","小さい部屋です。","C'est une petite chambre."],
    ["新しい","新[あたら]しい","atarashii","nouveau","新しい車を買いました。","J'ai acheté une nouvelle voiture."],
    ["古い","古[ふる]い","furui","vieux","古いお寺ではありません。","Ce n'est pas un vieux temple."],
    ["高い","高[たか]い","takai","cher / élevé","この時計は高すぎます。","Cette montre est trop chère."],
    ["安い","安[やす]い","yasui","bon marché","野菜は安いです。","Les légumes sont bon marché."],
    ["暑い","暑[あつ]い","atsui","chaud (météo)","今日は暑くないです。","Aujourd'hui, il ne fait pas chaud."],
    ["寒い","寒[さむ]い","samui","froid (météo)","冬は寒くないです。","L'hiver n'est pas froid."],
    ["楽しい","楽[たの]しい","tanoshii","amusant","パーティーは楽しいです。","La fête est amusante."],
    ["好き","好[す]き","suki","aimer","日本料理が好きです。","J'aime la cuisine japonaise."]
  ]},
  { id:"quotidien", name:"École, travail et loisirs", emoji:"🎒", words:[
    ["本","本[ほん]","hon","livre","本を読みます。","Je lis des livres."],
    ["映画","映画[えいが]","eiga","film","今日は映画を見ません。","Aujourd'hui, je ne vois pas de film."],
    ["音楽","音楽[おんがく]","ongaku","musique","音楽が好きです。","J'aime la musique."],
    ["写真","写真[しゃしん]","shashin","photo","写真を撮りますか。","Vous prenez des photos ?"],
    ["旅行","旅行[りょこう]","ryokō","voyage","今年は旅行しません。","Cette année, je ne voyage pas."],
    ["宿題","宿題[しゅくだい]","shukudai","devoirs","宿題がたくさんあります。","J'ai beaucoup de devoirs."],
    ["仕事","仕事[しごと]","shigoto","travail","仕事は五時に終わります。","Le travail finit à cinq heures."],
    ["お金","お金[かね]","okane","argent","お金がありません。","Je n'ai pas d'argent."],
    ["電車","電車[でんしゃ]","densha","train","電車で行きます。","J'y vais en train."],
    ["猫","猫[ねこ]","neko","chat","猫が好きです。","J'aime les chats."]
  ]}
];

/* Quatre exemples pour les verbes de base : affirmatif, négatif, passé et question.
   Ils sont affichés dans la fiche du mot, en complément de la phrase de contexte. */
window.VERB_EXAMPLES = {
  "します": [
    { jp: "毎日宿題をします。", fr: "Je fais mes devoirs chaque jour." },
    { jp: "今日は宿題をしません。", fr: "Aujourd'hui, je ne fais pas mes devoirs." },
    { jp: "昨日、宿題をしました。", fr: "Hier, j'ai fait mes devoirs." },
    { jp: "明日、宿題をしますか。", fr: "Tu fais tes devoirs demain ?" }
  ],
  "行きます": [
    { jp: "明日、東京に行きます。", fr: "Demain, j'irai à Tokyo." },
    { jp: "明日は学校に行きません。", fr: "Demain, je ne vais pas à l'école." },
    { jp: "昨日、東京に行きました。", fr: "Hier, je suis allé à Tokyo." },
    { jp: "週末、どこに行きますか。", fr: "Où vas-tu ce week-end ?" }
  ],
  "来ます": [
    { jp: "友達が家に来ます。", fr: "Un ami vient à la maison." },
    { jp: "今日は来ません。", fr: "Aujourd'hui, il ne vient pas." },
    { jp: "昨日、友達が来ました。", fr: "Hier, un ami est venu." },
    { jp: "明日、誰が来ますか。", fr: "Qui vient demain ?" }
  ],
  "見ます": [
    { jp: "夜はテレビを見ます。", fr: "Le soir, je regarde la télévision." },
    { jp: "今日はテレビを見ません。", fr: "Aujourd'hui, je ne regarde pas la télévision." },
    { jp: "昨日、映画を見ました。", fr: "Hier, j'ai regardé un film." },
    { jp: "週末、何を見ますか。", fr: "Que regardes-tu ce week-end ?" }
  ],
  "食べます": [
    { jp: "朝ご飯を食べます。", fr: "Je prends le petit-déjeuner." },
    { jp: "朝ご飯は食べません。", fr: "Je ne prends pas de petit-déjeuner." },
    { jp: "昨日、寿司を食べました。", fr: "Hier, j'ai mangé des sushis." },
    { jp: "何を食べますか。", fr: "Qu'est-ce que tu manges ?" }
  ],
  "飲みます": [
    { jp: "朝は水を飲みます。", fr: "Le matin, je bois de l'eau." },
    { jp: "お酒は飲みません。", fr: "Je ne bois pas d'alcool." },
    { jp: "昨日、お茶を飲みました。", fr: "Hier, j'ai bu du thé." },
    { jp: "何を飲みますか。", fr: "Qu'est-ce que tu bois ?" }
  ],
  "寝ます": [
    { jp: "十一時に寝ます。", fr: "Je me couche à onze heures." },
    { jp: "今夜は寝ません。", fr: "Cette nuit, je ne dors pas." },
    { jp: "昨日、早く寝ました。", fr: "Hier, je me suis couché tôt." },
    { jp: "何時に寝ますか。", fr: "À quelle heure te couches-tu ?" }
  ],
  "起きます": [
    { jp: "六時に起きます。", fr: "Je me lève à six heures." },
    { jp: "日曜日は早く起きません。", fr: "Le dimanche, je ne me lève pas tôt." },
    { jp: "今朝、七時に起きました。", fr: "Ce matin, je me suis levé à sept heures." },
    { jp: "毎朝、何時に起きますか。", fr: "À quelle heure te lèves-tu chaque matin ?" }
  ],
  "働きます": [
    { jp: "会社で働きます。", fr: "Je travaille dans une entreprise." },
    { jp: "週末は働きません。", fr: "Le week-end, je ne travaille pas." },
    { jp: "昨日、遅くまで働きました。", fr: "Hier, j'ai travaillé tard." },
    { jp: "どこで働きますか。", fr: "Où travailles-tu ?" }
  ],
  "買います": [
    { jp: "スーパーでパンを買います。", fr: "J'achète du pain au supermarché." },
    { jp: "今日は何も買いません。", fr: "Aujourd'hui, je n'achète rien." },
    { jp: "昨日、本を買いました。", fr: "Hier, j'ai acheté un livre." },
    { jp: "何を買いますか。", fr: "Qu'est-ce que tu achètes ?" }
  ],
  "磨きます": [
    { jp: "歯を磨きます。", fr: "Je me brosse les dents." },
    { jp: "今日は歯を磨きません。", fr: "Aujourd'hui, je ne me brosse pas les dents." },
    { jp: "朝、歯を磨きました。", fr: "Ce matin, je me suis brossé les dents." },
    { jp: "歯を磨きますか。", fr: "Tu te brosses les dents ?" }
  ]
};
