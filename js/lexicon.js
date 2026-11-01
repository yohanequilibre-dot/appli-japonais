/* Kotoba — lexique de secours pour l'import.
   Permet de retrouver un mot japonais à partir du romaji ou du français,
   même quand la liste collée ne contient que « bonjour | kon-ni-chi-wa ».
   Chaque entrée porte aussi une phrase de contexte toute prête. */
(function (root) {
  "use strict";

  function stripAccents(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Normalisation volontairement tolérante : kon-ni-chi-wa, konnichiwa,
  // konnichiha et kon-nichiha doivent tous mener à la même entrée.
  function normalizeRomaji(s) {
    return stripAccents(String(s || "").toLowerCase())
      .replace(/[’'\-–—]/g, "")
      .replace(/[^a-z]/g, "")
      .replace(/ou/g, "o")
      .replace(/oo/g, "o")
      .replace(/uu/g, "u")
      .replace(/aa/g, "a")
      .replace(/ii/g, "i")
      .replace(/ee/g, "e");
  }

  function normalizeFr(s) {
    return stripAccents(String(s || "").toLowerCase())
      .replace(/[’']/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function normalizeJp(s) {
    return String(s || "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/[\s　]/g, "")
      .replace(/[。、！？!?.,・]/g, "");
  }

  function E(jp, ruby, reading, romaji, fr, context, contextFr, extra) {
    return Object.assign({
      jp: jp,
      ruby: ruby || jp,
      reading: reading || jp,
      romaji: romaji,
      fr: fr,
      context: context || "",
      contextFr: contextFr || "",
      hl: jp
    }, extra || {});
  }

  const entries = [
    E("こんにちは", "こんにちは", "こんにちは", "konnichiwa", "bonjour (l'après-midi)", "こんにちは、花さん！", "Bonjour, Hana !", { frAliases: ["bonjour", "salut", "bonjour l apres midi", "bonjour apres midi"], romajiAliases: ["konnichiha", "kon-ni-chi-wa"] }),
    E("おはよう", "おはよう", "おはよう", "ohayou", "bonjour (le matin)", "おはよう、花さん！", "Bonjour, Hana !", { frAliases: ["bonjour le matin", "bonjour matin", "salut le matin", "bon matin"], romajiAliases: ["ohayo", "o-ha-yo-u", "ohayō"] }),
    E("こんばんは", "こんばんは", "こんばんは", "konbanwa", "bonsoir", "こんばんは、いい夜ですね。", "Bonsoir, quelle belle soirée.", { romajiAliases: ["kombanwa", "kon-ban-wa"] }),
    E("おやすみなさい", "おやすみなさい", "おやすみなさい", "oyasuminasai", "bonne nuit", "おやすみなさい、また明日。", "Bonne nuit, à demain.", { frAliases: ["bonne nuit", "bonne soiree"], romajiAliases: ["oyasumi", "o-ya-su-mi"] }),
    E("ありがとう", "ありがとう", "ありがとう", "arigatou", "merci", "手伝ってくれてありがとう。", "Merci de m'avoir aidé.", { frAliases: ["merci", "merci beaucoup"], romajiAliases: ["arigato", "a-ri-ga-to-u"] }),
    E("すみません", "すみません", "すみません", "sumimasen", "excusez-moi / pardon", "すみません、駅はどこですか。", "Excusez-moi, où est la gare ?", { frAliases: ["excusez moi", "pardon", "desole", "desolee"], romajiAliases: ["su-mi-ma-sen"] }),
    E("さようなら", "さようなら", "さようなら", "sayounara", "au revoir", "さようなら、また明日。", "Au revoir, à demain.", { frAliases: ["au revoir", "adieu", "bye"], romajiAliases: ["sayonara", "sa-yo-na-ra"] }),
    E("はい", "はい", "はい", "hai", "oui", "はい、そうです。", "Oui, c'est ça.", { frAliases: ["oui", "yes", "ouais"] }),
    E("いいえ", "いいえ", "いいえ", "iie", "non", "いいえ、違います。", "Non, ce n'est pas ça.", { frAliases: ["non", "no"] }),
    E("お願いします", "お願[ねが]いします", "おねがいします", "onegai shimasu", "s'il vous plaît", "コーヒーをお願いします。", "Un café, s'il vous plaît.", { frAliases: ["s il vous plait", "sil vous plait", "svp"], romajiAliases: ["onegaishimasu", "onegai-shimasu", "kudasai"], alternatives: [{ jp: "ください", reading: "ください", romaji: "kudasai", usage: "Plus directe et concrète, mais polie elle aussi. Elle suit un nom (+ を) ou une forme en て. Les deux se disent.", example: "コーヒーをください。", exampleFr: "Un café, s'il vous plaît.", exampleRomaji: "Kōhī o kudasai." }], nuance: "« お願いします » est plus douce et générale. « ください » est plus directe et concrète : elle peut sembler plus forte, mais elle reste polie. Les deux se disent.", contextNote: "Au café, les deux se disent : « コーヒーをお願いします » est plus douce, « コーヒーをください » plus directe. « ください » n’est pas une erreur." }),
    E("大丈夫", "大丈夫[だいじょうぶ]", "だいじょうぶ", "daijoubu", "ça va / pas de problème", "大丈夫ですか。", "Ça va ?", { frAliases: ["ca va", "pas de probleme", "pas de souci", "d accord"], romajiAliases: ["daijobu", "daijōbu"] }),
    E("はじめまして", "はじめまして", "はじめまして", "hajimemashite", "enchanté(e)", "はじめまして、田中です。", "Enchanté, je suis Tanaka.", { frAliases: ["enchante", "enchantée", "ravi de te rencontrer"], romajiAliases: ["ha-ji-me-ma-shi-te"] }),
    E("いただきます", "いただきます", "いただきます", "itadakimasu", "bon appétit", "いただきます！", "Bon appétit !", { frAliases: ["bon appetit", "bon appétit"] }),
    E("ごちそうさま", "ごちそうさま", "ごちそうさま", "gochisousama", "merci pour le repas", "ごちそうさまでした。", "Merci pour le repas.", { frAliases: ["merci pour le repas"], romajiAliases: ["gochisosama"] }),
    E("元気", "元気[げんき]", "げんき", "genki", "forme / bien", "お元気ですか。", "Comment allez-vous ?", { frAliases: ["forme", "bien", "en forme", "sante"] }),
    E("水", "水[みず]", "みず", "mizu", "eau", "水を一杯ください。", "Un verre d'eau, s'il vous plaît.", { frAliases: ["eau", "de l eau"] }),
    E("お茶", "お茶[ちゃ]", "ちゃ", "ocha", "thé", "毎朝お茶を飲みます。", "Je bois du thé chaque matin.", { frAliases: ["the", "the vert"] }),
    E("ご飯", "ご飯[はん]", "はん", "gohan", "riz / repas", "ご飯を食べましょう。", "Mangeons.", { frAliases: ["riz", "repas", "riz cuit"] }),
    E("食べる", "食[た]べる", "たべる", "taberu", "manger", "ご飯を食べる。", "Je mange.", { frAliases: ["manger", "je mange"] }),
    E("飲む", "飲[の]む", "のむ", "nomu", "boire", "水を飲む。", "Je bois de l'eau.", { frAliases: ["boire", "je bois"] }),
    E("猫", "猫[ねこ]", "ねこ", "neko", "chat", "猫が好き。", "J'aime les chats.", { frAliases: ["chat", "un chat"] }),
    E("犬", "犬[いぬ]", "いぬ", "inu", "chien", "大きい犬がいる。", "Il y a un grand chien.", { frAliases: ["chien", "un chien"] }),
    E("日本", "日本[にほん]", "にほん", "nihon", "Japon", "日本に行きたい。", "Je veux aller au Japon.", { frAliases: ["japon", "le japon"] }),
    E("日本語", "日本[にほん]語[ご]", "にほんご", "nihongo", "le japonais", "日本語を勉強しています。", "J'étudie le japonais.", { frAliases: ["japonais", "le japonais", "langue japonaise"] }),
    E("友達", "友達[ともだち]", "ともだち", "tomodachi", "ami(e)", "彼は私の友達です。", "C'est mon ami.", { frAliases: ["ami", "amie", "copain", "copine"] }),
    E("名前", "名前[なまえ]", "なまえ", "namae", "nom", "お名前は何ですか。", "Quel est votre nom ?", { frAliases: ["nom", "prenom"] }),
    E("学生", "学生[がくせい]", "がくせい", "gakusei", "étudiant(e)", "私は学生です。", "Je suis étudiant.", { frAliases: ["etudiant", "etudiante", "eleve"] }),
    E("先生", "先生[せんせい]", "せんせい", "sensei", "professeur", "田中先生は日本語を教えます。", "Le professeur Tanaka enseigne le japonais.", { frAliases: ["professeur", "prof", "enseignant"] }),
    E("今日", "今日[きょう]", "きょう", "kyou", "aujourd'hui", "今日は暑いですね。", "Il fait chaud aujourd'hui.", { frAliases: ["aujourd hui", "ce jour"], romajiAliases: ["kyo"] }),
    E("明日", "明日[あした]", "あした", "ashita", "demain", "明日は学校に行きます。", "Demain, je vais à l'école.", { frAliases: ["demain"] }),
    E("今", "今[いま]", "いま", "ima", "maintenant", "今、何時ですか。", "Quelle heure est-il maintenant ?", { frAliases: ["maintenant", "tout de suite"] }),
    E("時間", "時間[じかん]", "じかん", "jikan", "temps / heure", "時間がありません。", "Je n'ai pas le temps.", { frAliases: ["temps", "heure", "heures"] }),
    E("家", "家[いえ]", "いえ", "ie", "maison", "家に帰ります。", "Je rentre à la maison.", { frAliases: ["maison", "chez moi", "foyer"] }),
    E("駅", "駅[えき]", "えき", "eki", "gare", "駅はどこですか。", "Où est la gare ?", { frAliases: ["gare", "station"] }),
    E("学校", "学校[がっこう]", "がっこう", "gakkou", "école", "学校は八時に始まります。", "L'école commence à huit heures.", { frAliases: ["ecole", "lycee"], romajiAliases: ["gakko"] }),
    E("本", "本[ほん]", "ほん", "hon", "livre", "本を読むのが好き。", "J'aime lire.", { frAliases: ["livre", "bouquin"] }),
    E("映画", "映画[えいが]", "えいが", "eiga", "film", "映画を見に行く。", "Je vais voir un film.", { frAliases: ["film", "cinema"] }),
    E("音楽", "音楽[おんがく]", "おんがく", "ongaku", "musique", "音楽が好きです。", "J'aime la musique.", { frAliases: ["musique"] }),
    E("食べ物", "食[た]べ物[もの]", "たべもの", "tabemono", "nourriture", "日本の食べ物が好き。", "J'aime la nourriture japonaise.", { frAliases: ["nourriture", "aliment", "aliments"] }),
    E("美味しい", "美味[おい]しい", "おいしい", "oishii", "délicieux", "このラーメンは美味しいです。", "Ce ramen est délicieux.", { frAliases: ["delicieux", "bon", "savoureux"] }),
    E("好き", "好[す]き", "すき", "suki", "aimer", "日本料理が好き。", "J'aime la cuisine japonaise.", { frAliases: ["aimer", "j aime", "amour"] }),
    E("高い", "高[たか]い", "たかい", "takai", "cher / élevé", "この時計は高い。", "Cette montre est chère.", { frAliases: ["cher", "chere", "eleve", "couteux"] }),
    E("安い", "安[やす]い", "やすい", "yasui", "bon marché", "野菜は安い。", "Les légumes sont bon marché.", { frAliases: ["bon marche", "pas cher", "economique"] }),
    E("大きい", "大[おお]きい", "おおきい", "ookii", "grand", "大きい犬がいる。", "Il y a un grand chien.", { frAliases: ["grand", "grande", "gros"], romajiAliases: ["okii"] }),
    E("小さい", "小[ちい]さい", "ちいさい", "chiisai", "petit", "小さい部屋です。", "C'est une petite chambre.", { frAliases: ["petit", "petite"] }),
    E("新しい", "新[あたら]しい", "あたらしい", "atarashii", "nouveau", "新しい車を買った。", "J'ai acheté une nouvelle voiture.", { frAliases: ["nouveau", "nouvelle", "neuf"] }),
    E("古い", "古[ふる]い", "ふるい", "furui", "vieux", "古いお寺です。", "C'est un vieux temple.", { frAliases: ["vieux", "vieille", "ancien"] }),
    E("暑い", "暑[あつ]い", "あつい", "atsui", "chaud (météo)", "夏は暑い。", "L'été est chaud.", { frAliases: ["chaud", "il fait chaud"] }),
    E("寒い", "寒[さむ]い", "さむい", "samui", "froid (météo)", "冬は寒い。", "L'hiver est froid.", { frAliases: ["froid", "il fait froid"] }),
    E("楽しい", "楽[たの]しい", "たのしい", "tanoshii", "amusant", "パーティーは楽しい。", "La fête est amusante.", { frAliases: ["amusant", "fun", "joyeux"] }),
    E("お金", "お金[かね]", "かね", "okane", "argent", "お金がない。", "Je n'ai pas d'argent.", { frAliases: ["argent", "monnaie"] }),
    E("電車", "電車[でんしゃ]", "でんしゃ", "densha", "train", "電車で行く。", "J'y vais en train.", { frAliases: ["train"] }),
    E("仕事", "仕事[しごと]", "しごと", "shigoto", "travail", "仕事は五時に終わる。", "Le travail finit à cinq heures.", { frAliases: ["travail", "boulot", "job"] }),
    E("旅行", "旅行[りょこう]", "りょこう", "ryokou", "voyage", "夏に旅行する。", "Je voyage en été.", { frAliases: ["voyage", "voyager"], romajiAliases: ["ryoko"] }),
    E("写真", "写真[しゃしん]", "しゃしん", "shashin", "photo", "写真を撮る。", "Je prends des photos.", { frAliases: ["photo", "photographie"] }),
    E("宿題", "宿題[しゅくだい]", "しゅくだい", "shukudai", "devoirs", "宿題がたくさんある。", "J'ai beaucoup de devoirs.", { frAliases: ["devoirs", "devoir"] }),
    E("トイレ", "トイレ", "トイレ", "toire", "toilettes", "トイレはどこですか。", "Où sont les toilettes ?", { frAliases: ["toilettes", "toilette", "wc"] }),
    E("コンビニ", "コンビニ", "コンビニ", "konbini", "supérette", "コンビニでお弁当を買う。", "J'achète un bento à la supérette.", { frAliases: ["superette", "konbini"] }),
    E("お腹", "お腹[なか]", "なか", "onaka", "ventre", "お腹が空きました。", "J'ai faim.", { frAliases: ["ventre", "estomac"] }),
    E("箸", "箸[はし]", "はし", "hashi", "baguettes", "箸を使えますか。", "Savez-vous utiliser des baguettes ?", { frAliases: ["baguettes", "baguette"] }),
    E("お酒", "お酒[さけ]", "さけ", "osake", "alcool / saké", "お酒は飲みません。", "Je ne bois pas d'alcool.", { frAliases: ["alcool", "sake"] }),
    E("甘い", "甘[あま]い", "あまい", "amai", "sucré", "このケーキは甘いです。", "Ce gâteau est sucré.", { frAliases: ["sucre", "doux"] }),
    E("家族", "家族[かぞく]", "かぞく", "kazoku", "famille", "家族は四人です。", "Nous sommes quatre dans la famille.", { frAliases: ["famille"] }),
    E("母", "母[はは]", "はは", "haha", "ma mère", "母は先生です。", "Ma mère est professeur.", { frAliases: ["mere", "ma mere"] }),
    E("父", "父[ちち]", "ちち", "chichi", "mon père", "父は東京に住んでいます。", "Mon père habite à Tokyo.", { frAliases: ["pere", "mon pere"] }),
    E("子供", "子供[こども]", "こども", "kodomo", "enfant", "子供が二人います。", "J'ai deux enfants.", { frAliases: ["enfant", "enfants"] }),
    E("一", "一[いち]", "いち", "ichi", "un", "一から十まで数えます。", "Je compte de un à dix.", { frAliases: ["un"] }),
    E("二", "二[に]", "に", "ni", "deux", "二時に会いましょう。", "Retrouvons-nous à deux heures.", { frAliases: ["deux"] }),
    E("三", "三[さん]", "さん", "san", "trois", "三人で行きます。", "Nous y allons à trois.", { frAliases: ["trois"] }),
    E("十", "十[じゅう]", "じゅう", "juu", "dix", "十まで数えてください。", "Comptez jusqu'à dix.", { frAliases: ["dix"], romajiAliases: ["ju"] }),
    E("百", "百[ひゃく]", "ひゃく", "hyaku", "cent", "百円です。", "C'est cent yens.", { frAliases: ["cent"] }),
    E("毎日", "毎日[まいにち]", "まいにち", "mainichi", "chaque jour", "毎日日本語を勉強します。", "J'étudie le japonais chaque jour.", { frAliases: ["chaque jour", "tous les jours"] }),
    E("私", "私[わたし]", "わたし", "watashi", "je / moi", "私は学生です。", "Je suis étudiant.", { frAliases: ["je", "moi"] }),
    E("誰", "誰[だれ]", "だれ", "dare", "qui", "あの人は誰ですか。", "Qui est cette personne ?", { frAliases: ["qui"] }),
    E("何", "何[なに]", "なに", "nani", "quoi", "これは何ですか。", "Qu'est-ce que c'est ?", { frAliases: ["quoi", "que"] }),
    E("する", "する", "する", "suru", "faire", "宿題をする。", "Je fais mes devoirs.", { frAliases: ["faire"] }),
E("行きます", "行[い]きます", "いきます", "ikimasu", "aller (forme polie)", "明日、東京に行きます。", "Demain, j’irai à Tokyo.", { frAliases: ["aller", "aller poli"], romajiAliases: ["iki-masu"] }),
E("行く", "行[い]く", "いく", "iku", "aller (forme familière)", "明日、東京に行く。", "Demain, je vais à Tokyo.", { frAliases: ["aller familier", "aller neutre"], romajiAliases: ["iku"] }),
    E("来る", "来[く]る", "くる", "kuru", "venir", "友達が家に来る。", "Un ami vient à la maison.", { frAliases: ["venir"] }),
    E("見る", "見[み]る", "みる", "miru", "voir / regarder", "夜はテレビを見る。", "Le soir, je regarde la télévision.", { frAliases: ["voir", "regarder"] }),
    E("寝る", "寝[ね]る", "ねる", "neru", "dormir", "十一時に寝る。", "Je me couche à onze heures.", { frAliases: ["dormir", "se coucher"] }),
    E("起きる", "起[お]きる", "おきる", "okiru", "se lever", "六時に起きる。", "Je me lève à six heures.", { frAliases: ["se lever", "se reveiller"] }),
    E("働く", "働[はたら]く", "はたらく", "hataraku", "travailler", "会社で働く。", "Je travaille dans une entreprise.", { frAliases: ["travailler"] }),
    E("買う", "買[か]う", "かう", "kau", "acheter", "パンを買う。", "J'achète du pain.", { frAliases: ["acheter"] }),
    E("パン", "パン", "パン", "pan", "pain", "朝はパンを食べます。", "Le matin, je mange du pain.", { frAliases: ["pain", "du pain"] }),
    E("コーヒー", "コーヒー", "コーヒー", "koohii", "café (boisson)", "コーヒーは熱いです。", "Le café est chaud.", { frAliases: ["cafe", "café"], romajiAliases: ["kohi", "kōhī"] }),
    E("肉", "肉[にく]", "にく", "niku", "viande", "肉が好きじゃないです。", "Je n'aime pas la viande.", { frAliases: ["viande"] }),
    E("魚", "魚[さかな]", "さかな", "sakana", "poisson", "魚を焼きます。", "Je fais griller du poisson.", { frAliases: ["poisson"] }),
    E("野菜", "野菜[やさい]", "やさい", "yasai", "légumes", "野菜をたくさん食べてください。", "Mange beaucoup de légumes.", { frAliases: ["legumes", "legume"] }),
    E("卵", "卵[たまご]", "たまご", "tamago", "œuf", "卵を二つ買います。", "J'achète deux œufs.", { frAliases: ["oeuf", "oeufs"] }),
    E("メニュー", "メニュー", "メニュー", "menyuu", "menu", "メニューを見せてください。", "Montrez-moi le menu.", { frAliases: ["menu", "carte"], romajiAliases: ["menyu", "menyū"] }),
    E("レストラン", "レストラン", "レストラン", "resutoran", "restaurant", "レストランで友達に会います。", "Je retrouve un ami au restaurant.", { frAliases: ["restaurant"] }),
    E("お会計", "お会計[かいけい]", "かいけい", "okaikei", "l'addition", "お会計をお願いします。", "L'addition, s'il vous plaît.", { frAliases: ["addition", "l addition", "note"] }),
    E("おすすめ", "おすすめ", "おすすめ", "osusume", "recommandation", "おすすめは何ですか。", "Que recommandez-vous ?", { frAliases: ["recommandation", "conseil", "suggestion"] }),
    E("持ち帰り", "持[も]ち帰[かえ]り", "もちかえり", "mochikaeri", "à emporter", "持ち帰りでお願いします。", "À emporter, s'il vous plaît.", { frAliases: ["a emporter", "emporter"] }),
    E("部屋", "部屋[へや]", "へや", "heya", "chambre / pièce", "私の部屋は狭いです。", "Ma chambre est petite.", { frAliases: ["chambre", "piece"] }),
    E("台所", "台所[だいどころ]", "だいどころ", "daidokoro", "cuisine (pièce)", "台所に母がいます。", "Ma mère est dans la cuisine.", { frAliases: ["cuisine"] }),
    E("お風呂", "お風呂[ふろ]", "ふろ", "ofuro", "bain", "お風呂に入ります。", "Je prends un bain.", { frAliases: ["bain", "salle de bain"] }),
    E("会社", "会社[かいしゃ]", "かいしゃ", "kaisha", "entreprise", "会社で働いています。", "Je travaille dans une entreprise.", { frAliases: ["entreprise", "societe", "compagnie"] }),
    E("病院", "病院[びょういん]", "びょういん", "byouin", "hôpital", "病院はあそこです。", "L'hôpital est là-bas.", { frAliases: ["hopital", "clinique"], romajiAliases: ["byoin"] }),
    E("図書館", "図書館[としょかん]", "としょかん", "toshokan", "bibliothèque", "図書館で勉強します。", "J'étudie à la bibliothèque.", { frAliases: ["bibliotheque"] }),
    E("兄", "兄[あに]", "あに", "ani", "mon grand frère", "兄は大学生です。", "Mon grand frère est étudiant.", { frAliases: ["grand frere", "frere aine"] }),
    E("姉", "姉[あね]", "あね", "ane", "ma grande sœur", "姉は東京にいます。", "Ma grande sœur est à Tokyo.", { frAliases: ["grande soeur", "soeur ainee"] }),
    E("弟", "弟[おとうと]", "おとうと", "otouto", "mon petit frère", "弟はゲームが好きです。", "Mon petit frère aime les jeux.", { frAliases: ["petit frere"], romajiAliases: ["ototo", "otōto"] }),
    E("妹", "妹[いもうと]", "いもうと", "imouto", "ma petite sœur", "妹は六歳です。", "Ma petite sœur a six ans.", { frAliases: ["petite soeur"], romajiAliases: ["imoto", "imōto"] }),
    E("夫", "夫[おっと]", "おっと", "otto", "mari", "夫は料理が上手です。", "Mon mari cuisine bien.", { frAliases: ["mari", "epoux"] })
  ];

  const byRomaji = new Map();
  const byJp = new Map();
  const byFr = new Map();

  entries.forEach(function (e) {
    byJp.set(normalizeJp(e.jp), e);
    byRomaji.set(normalizeRomaji(e.romaji), e);
    (e.romajiAliases || []).forEach(function (r) { byRomaji.set(normalizeRomaji(r), e); });
    byFr.set(normalizeFr(e.fr), e);
    (e.frAliases || []).forEach(function (f) { byFr.set(normalizeFr(f), e); });
  });

  function lookup(q) {
    q = q || {};
    if (q.jp) {
      const hit = byJp.get(normalizeJp(q.jp));
      if (hit) return hit;
    }
    if (q.romaji) {
      const hit = byRomaji.get(normalizeRomaji(q.romaji));
      if (hit) return hit;
    }
    if (q.fr) {
      const hit = byFr.get(normalizeFr(q.fr));
      if (hit) return hit;
    }
    return null;
  }

  const api = {
    entries: entries,
    normalizeRomaji: normalizeRomaji,
    normalizeFr: normalizeFr,
    normalizeJp: normalizeJp,
    byRomaji: byRomaji,
    byJp: byJp,
    byFr: byFr,
    lookup: lookup
  };

  root.Kotoba = root.Kotoba || {};
  root.Kotoba.Lexicon = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
