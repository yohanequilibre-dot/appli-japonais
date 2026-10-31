/* Vocabulaire de départ.
   Format : [kanji, furigana, romaji, français, phrase japonaise, traduction, mot à surligner]
   Furigana : 食[た]べる  → la lecture entre crochets s'affiche au-dessus. */
window.UNITS_DATA = [
  { id:"salutations", name:"Saluer et dire au revoir", emoji:"👋", words:[
    ["こんにちは","","konnichiwa","bonjour (l'après-midi)","こんにちは、元気ですか。","Bonjour, comment vas-tu ?"],
    ["おはよう","","ohayō","bonjour (le matin)","おはよう。今日もいい天気ですね。","Bonjour. Il fait beau aujourd'hui aussi."],
    ["こんばんは","","konbanwa","bonsoir","こんばんは、いい夜ですね。","Bonsoir, quelle belle soirée."],
    ["さようなら","","sayōnara","au revoir","さようなら、また明日。","Au revoir, à demain."],
    ["ありがとう","","arigatō","merci","手伝ってくれてありがとう。","Merci de m'avoir aidé."],
    ["すみません","","sumimasen","excusez-moi / pardon","すみません、駅はどこですか。","Excusez-moi, où est la gare ?"],
    ["はい","","hai","oui","はい、そうです。","Oui, c'est ça."],
    ["いいえ","","iie","non","いいえ、違います。","Non, ce n'est pas ça."],
    ["お願いします","お願[ねが]いします","onegai shimasu","s'il vous plaît","コーヒーをお願いします。","Un café, s'il vous plaît."],
    ["大丈夫","大丈夫[だいじょうぶ]","daijōbu","ça va / pas de problème","大丈夫ですか。","Ça va ?"]
  ]},
  { id:"presentation", name:"Se présenter", emoji:"🙋", words:[
    ["私","私[わたし]","watashi","je / moi","私は学生です。","Je suis étudiant."],
    ["名前","名前[なまえ]","namae","nom","お名前は何ですか。","Quel est votre nom ?"],
    ["友達","友達[ともだち]","tomodachi","ami(e)","彼は私の友達です。","C'est mon ami."],
    ["学生","学生[がくせい]","gakusei","étudiant(e)","私は大学の学生です。","Je suis étudiant à l'université."],
    ["先生","先生[せんせい]","sensei","professeur","田中先生は日本語を教えます。","Le professeur Tanaka enseigne le japonais."],
    ["日本人","日本[にほん]人[じん]","nihonjin","Japonais(e)","彼女は日本人です。","Elle est japonaise."],
    ["日本語","日本[にほん]語[ご]","nihongo","le japonais","日本語を勉強しています。","J'étudie le japonais."],
    ["誰","誰[だれ]","dare","qui","あの人は誰ですか。","Qui est cette personne ?"],
    ["何","何[なに]","nani","quoi","これは何ですか。","Qu'est-ce que c'est ?"],
    ["出身","出身[しゅっしん]","shusshin","origine","ご出身はどちらですか。","D'où venez-vous ?"]
  ]},
  { id:"nourriture", name:"Parler de la nourriture", emoji:"🍙", words:[
    ["水","水[みず]","mizu","eau","水を一杯ください。","Un verre d'eau, s'il vous plaît."],
    ["お茶","お茶[ちゃ]","ocha","thé","毎朝お茶を飲みます。","Je bois du thé chaque matin."],
    ["コーヒー","","kōhī","café (boisson)","コーヒーは熱いです。","Le café est chaud."],
    ["ご飯","ご飯[はん]","gohan","riz / repas","ご飯を食べましょう。","Mangeons."],
    ["パン","","pan","pain","朝はパンを食べます。","Le matin, je mange du pain."],
    ["肉","肉[にく]","niku","viande","肉が好きじゃないです。","Je n'aime pas la viande."],
    ["魚","魚[さかな]","sakana","poisson","魚を焼きます。","Je fais griller du poisson."],
    ["野菜","野菜[やさい]","yasai","légumes","野菜をたくさん食べてください。","Mange beaucoup de légumes."],
    ["卵","卵[たまご]","tamago","œuf","卵を二つ買います。","J'achète deux œufs."],
    ["おいしい","","oishii","délicieux","このラーメンはおいしいです。","Ce ramen est délicieux."]
  ]},
  { id:"restaurant", name:"Commander à manger", emoji:"🍜", words:[
    ["メニュー","","menyū","menu","メニューを見せてください。","Montrez-moi le menu."],
    ["注文","注文[ちゅうもん]","chūmon","commande","ご注文は何ですか。","Qu'est-ce que vous commandez ?"],
    ["レストラン","","resutoran","restaurant","レストランで友達に会います。","Je retrouve un ami au restaurant."],
    ["お会計","お会計[かいけい]","okaikei","l'addition","お会計をお願いします。","L'addition, s'il vous plaît."],
    ["おすすめ","","osusume","recommandation","おすすめは何ですか。","Que recommandez-vous ?"],
    ["持ち帰り","持[も]ち帰[かえ]り","mochikaeri","à emporter","持ち帰りでお願いします。","À emporter, s'il vous plaît."],
    ["お腹","お腹[なか]","onaka","ventre","お腹が空きました。","J'ai faim."],
    ["箸","箸[はし]","hashi","baguettes","箸を使えますか。","Savez-vous utiliser des baguettes ?"],
    ["お酒","お酒[さけ]","osake","alcool / saké","お酒は飲みません。","Je ne bois pas d'alcool."],
    ["甘い","甘[あま]い","amai","sucré","このケーキは甘いです。","Ce gâteau est sucré."]
  ]},
  { id:"famille", name:"Parler de sa famille", emoji:"👨‍👩‍👧", words:[
    ["家族","家族[かぞく]","kazoku","famille","家族は四人です。","Nous sommes quatre dans la famille."],
    ["母","母[はは]","haha","ma mère","母は先生です。","Ma mère est professeur."],
    ["父","父[ちち]","chichi","mon père","父は東京に住んでいます。","Mon père habite à Tokyo."],
    ["お母さん","お母[かあ]さん","okāsan","ta mère","お母さんは元気ですか。","Ta mère va bien ?"],
    ["兄","兄[あに]","ani","mon grand frère","兄は大学生です。","Mon grand frère est étudiant."],
    ["姉","姉[あね]","ane","ma grande sœur","姉は東京にいます。","Ma grande sœur est à Tokyo."],
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
    ["今日","今日[きょう]","kyō","aujourd'hui","今日は暑いですね。","Il fait chaud aujourd'hui, n'est-ce pas ?"],
    ["明日","明日[あした]","ashita","demain","明日は学校に行きます。","Demain, je vais à l'école."],
    ["今","今[いま]","ima","maintenant","今、何時ですか。","Quelle heure est-il maintenant ?"],
    ["時間","時間[じかん]","jikan","temps / heure","時間がありません。","Je n'ai pas le temps."],
    ["毎日","毎日[まいにち]","mainichi","chaque jour","毎日日本語を勉強します。","J'étudie le japonais chaque jour."]
  ]},
  { id:"maison", name:"La maison et la ville", emoji:"🏠", words:[
    ["家","家[いえ]","ie","maison","家に帰ります。","Je rentre à la maison."],
    ["部屋","部屋[へや]","heya","chambre / pièce","私の部屋は狭いです。","Ma chambre est petite."],
    ["台所","台所[だいどころ]","daidokoro","cuisine (pièce)","台所に母がいます。","Ma mère est dans la cuisine."],
    ["お風呂","お風呂[ふろ]","ofuro","bain","お風呂に入ります。","Je prends un bain."],
    ["トイレ","","toire","toilettes","トイレはどこですか。","Où sont les toilettes ?"],
    ["駅","駅[えき]","eki","gare","駅まで歩きます。","Je marche jusqu'à la gare."],
    ["学校","学校[がっこう]","gakkō","école","学校は八時に始まります。","L'école commence à huit heures."],
    ["会社","会社[かいしゃ]","kaisha","entreprise","会社で働いています。","Je travaille dans une entreprise."],
    ["病院","病院[びょういん]","byōin","hôpital","病院はあそこです。","L'hôpital est là-bas."],
    ["図書館","図書館[としょかん]","toshokan","bibliothèque","図書館で勉強します。","J'étudie à la bibliothèque."]
  ]},
  { id:"verbes", name:"Les verbes du quotidien", emoji:"🏃", words:[
    ["する","","suru","faire","宿題をする。","Je fais mes devoirs."],
["行きます","行[い]きます","ikimasu","aller (forme polie)","明日、東京に行きます。","Demain, j’irai à Tokyo. (forme neutre : 行く / iku)"],
    ["来る","来[く]る","kuru","venir","友達が家に来る。","Un ami vient à la maison."],
    ["見る","見[み]る","miru","voir / regarder","夜はテレビを見る。","Le soir, je regarde la télévision."],
    ["食べる","食[た]べる","taberu","manger","ご飯を食べる。","Je mange."],
    ["飲む","飲[の]む","nomu","boire","水を飲む。","Je bois de l'eau."],
    ["寝る","寝[ね]る","neru","dormir","十一時に寝る。","Je me couche à onze heures."],
    ["起きる","起[お]きる","okiru","se lever","六時に起きる。","Je me lève à six heures."],
    ["働く","働[はたら]く","hataraku","travailler","会社で働く。","Je travaille dans une entreprise."],
    ["買う","買[か]う","kau","acheter","パンを買う。","J'achète du pain."]
["行く","行[い]く","iku","aller (forme familière)","明日、東京に行く。","Demain, je vais à Tokyo."],
  ]},
  { id:"adjectifs", name:"Décrire les choses", emoji:"✨", words:[
    ["大きい","大[おお]きい","ōkii","grand","大きい犬がいる。","Il y a un grand chien."],
    ["小さい","小[ちい]さい","chiisai","petit","小さい部屋です。","C'est une petite chambre."],
    ["新しい","新[あたら]しい","atarashii","nouveau","新しい車を買った。","J'ai acheté une nouvelle voiture."],
    ["古い","古[ふる]い","furui","vieux","古いお寺です。","C'est un vieux temple."],
    ["高い","高[たか]い","takai","cher / élevé","この時計は高い。","Cette montre est chère."],
    ["安い","安[やす]い","yasui","bon marché","野菜は安い。","Les légumes sont bon marché."],
    ["暑い","暑[あつ]い","atsui","chaud (météo)","夏は暑い。","L'été est chaud."],
    ["寒い","寒[さむ]い","samui","froid (météo)","冬は寒い。","L'hiver est froid."],
    ["楽しい","楽[たの]しい","tanoshii","amusant","パーティーは楽しい。","La fête est amusante."],
    ["好き","好[す]き","suki","aimer","日本料理が好き。","J'aime la cuisine japonaise."]
  ]},
  { id:"quotidien", name:"École, travail et loisirs", emoji:"🎒", words:[
    ["本","本[ほん]","hon","livre","本を読むのが好き。","J'aime lire."],
    ["映画","映画[えいが]","eiga","film","映画を見に行く。","Je vais voir un film."],
    ["音楽","音楽[おんがく]","ongaku","musique","音楽が好きです。","J'aime la musique."],
    ["写真","写真[しゃしん]","shashin","photo","写真を撮る。","Je prends des photos."],
    ["旅行","旅行[りょこう]","ryokō","voyage","夏に旅行する。","Je voyage en été."],
    ["宿題","宿題[しゅくだい]","shukudai","devoirs","宿題がたくさんある。","J'ai beaucoup de devoirs."],
    ["仕事","仕事[しごと]","shigoto","travail","仕事は五時に終わる。","Le travail finit à cinq heures."],
    ["お金","お金[かね]","okane","argent","お金がない。","Je n'ai pas d'argent."],
    ["電車","電車[でんしゃ]","densha","train","電車で行く。","J'y vais en train."],
    ["猫","猫[ねこ]","neko","chat","猫が好き。","J'aime les chats."]
  ]}
];
