/* Kotoba — conversations de la vraie vie.
   Module sans DOM : les réponses sont corrigées en japonais, en kana ou en romaji,
   puis testées avec Node. Les variantes acceptées restent volontairement polies. */
(function (root, factory) {
  var P = (root && root.Kotoba && root.Kotoba.Parser) ||
    (typeof require === 'function' ? require('./parser.js') : null);
  var api = factory(P);
  if (root && root.Kotoba) root.Kotoba.Conversation = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (P) {
  'use strict';
  if (!P) throw new Error('Kotoba : analyseur introuvable pour les conversations.');

  var NOISE_RE = /[\s　。、！？!?.,・…「」『』（）()［］\[\]{}～〜—–\-]/g;

  var SCENARIOS = [
    {
      id: 'meet',
      emoji: '🙇',
      title: 'Rencontrer quelqu’un',
      level: 'A1',
      goal: 'Se présenter et parler de son pays',
      situation: 'Tu rencontres une personne dans un cours de japonais. Elle te parle en style poli.',
      speaker: '花',
      speakerFr: 'Hana',
      turns: [
        {
          partner: {
            jp: 'はじめまして。私は花です。お名前は何ですか。',
            reading: 'はじめまして。わたしははなです。おなまえはなんですか。',
            fr: 'Enchantée, je suis Hana. Comment tu t’appelles ?'
          },
          task: 'Tu t’appelles Léa. Présente-toi poliment — tu peux aussi utiliser ton prénom.',
          acceptName: true,
          accepted: [
            ['私はレアです。', 'わたしはれあです。'],
            ['レアです。', 'れあです。'],
            ['はじめまして。私はレアです。', 'はじめまして。わたしはれあです。'],
            ['はじめまして、レアです。', 'はじめまして、れあです。']
          ],
          model: {
            jp: 'はじめまして。私はレアです。',
            reading: 'はじめまして。わたしはれあです。',
            romaji: 'Hajimemashite. Watashi wa Rea desu.',
            fr: 'Enchantée, je m’appelle Léa.'
          },
          tip: 'はじめまして est la formule de première rencontre. 私は…です signifie « je suis… ». Tu peux remplacer レア par ton prénom.'
        },
        {
          partner: {
            jp: 'お国はどちらですか。',
            reading: 'おくにはどちらですか。',
            fr: 'D’où viens-tu ?'
          },
          task: 'Dis que tu viens de France.',
          accepted: [
            ['フランスから来ました。', 'ふらんすからきました。'],
            ['フランスからです。', 'ふらんすからです。'],
            ['私はフランスから来ました。', 'わたしはふらんすからきました。']
          ],
          model: {
            jp: 'フランスから来ました。',
            reading: 'ふらんすからきました。',
            romaji: 'Furansu kara kimashita.',
            fr: 'Je viens de France.'
          },
          tip: '〜から来ました signifie « je viens de… ». Garde la particule から après le pays.'
        },
        {
          partner: {
            jp: '日本語はどのくらい勉強していますか。',
            reading: 'にほんごはどのくらいべんきょうしていますか。',
            fr: 'Depuis combien de temps étudies-tu le japonais ?'
          },
          task: 'Dis que tu étudies depuis six mois.',
          accepted: [
            ['六ヶ月勉強しています。', 'ろっかげつべんきょうしています。'],
            ['半年勉強しています。', 'はんとしべんきょうしています。'],
            ['六ヶ月です。', 'ろっかげつです。']
          ],
          model: {
            jp: '六ヶ月勉強しています。',
            reading: 'ろっかげつべんきょうしています。',
            romaji: 'Rokkagetsu benkyō shite imasu.',
            fr: 'J’étudie depuis six mois.'
          },
          tip: 'ヶ月 est le compteur des mois. 半年 signifie « six mois » et évite de compter.'
        }
      ]
    },
    {
      id: 'cafe',
      emoji: '☕',
      title: 'Commander au café',
      level: 'A1',
      goal: 'Commander poliment et terminer la commande',
      situation: 'Tu es dans un café. Le serveur attend ta commande.',
      speaker: '店員',
      speakerFr: 'le serveur',
      turns: [
        {
          partner: {
            jp: 'いらっしゃいませ。ご注文は何ですか。',
            reading: 'いらっしゃいませ。ごちゅうもんはなんですか。',
            fr: 'Bienvenue. Quelle est votre commande ?'
          },
          task: 'Commande un café chaud, poliment.',
          accepted: [
            ['ホットコーヒーをください。', 'ほっとこーひーをください。'],
            ['ホットコーヒーをお願いします。', 'ほっとこーひーをおねがいします。'],
            ['コーヒーを一つお願いします。', 'こーひーをひとつおねがいします。'],
            ['コーヒーをください。', 'こーひーをください。']
          ],
          model: {
            jp: 'ホットコーヒーを一つお願いします。',
            reading: 'ほっとこーひーをひとつおねがいします。',
            romaji: 'Hotto kōhī o hitotsu onegai shimasu.',
            fr: 'Un café chaud, s’il vous plaît.'
          },
          tip: '〜をください et 〜をお願いします sont deux demandes polies. 一つ signifie « un » pour un objet.'
        },
        {
          partner: {
            jp: 'かしこまりました。ほかに何かありますか。',
            reading: 'かしこまりました。ほかになにかありますか。',
            fr: 'Très bien. Autre chose ?'
          },
          task: 'Dis que ce sera tout, merci.',
          accepted: [
            ['以上です。ありがとうございます。', 'いじょうです。ありがとうございます。'],
            ['以上です。', 'いじょうです。'],
            ['これで大丈夫です。', 'これでだいじょうぶです。'],
            ['いいえ、大丈夫です。', 'いいえ、だいじょうぶです。']
          ],
          model: {
            jp: '以上です。ありがとうございます。',
            reading: 'いじょうです。ありがとうございます。',
            romaji: 'Ijō desu. Arigatō gozaimasu.',
            fr: 'Ce sera tout. Merci beaucoup.'
          },
          tip: '以上です est très courant pour dire « ce sera tout ». 大丈夫です peut aussi répondre « ça va, merci ».'
        },
        {
          partner: {
            jp: 'お持ち帰りですか、店内でお召し上がりですか。',
            reading: 'おもちかえりですか、てんないでおめしあがりですか。',
            fr: 'C’est à emporter ou sur place ?'
          },
          task: 'Dis que tu restes sur place.',
          accepted: [
            ['店内でお願いします。', 'てんないでおねがいします。'],
            ['ここで飲みます。', 'ここでのみます。'],
            ['店内で飲みます。', 'てんないでのみます。']
          ],
          model: {
            jp: '店内でお願いします。',
            reading: 'てんないでおねがいします。',
            romaji: 'Tennai de onegai shimasu.',
            fr: 'Sur place, s’il vous plaît.'
          },
          tip: '店内 signifie « sur place » ; お持ち帰り signifie « à emporter ». で indique le lieu de l’action.'
        }
      ]
    },
    {
      id: 'directions',
      emoji: '🧭',
      title: 'Demander son chemin',
      level: 'A1',
      goal: 'Trouver la gare et vérifier la distance',
      situation: 'Tu cherches la gare. Une personne s’arrête pour t’aider.',
      speaker: '通行人',
      speakerFr: 'un passant',
      turns: [
        {
          partner: {
            jp: 'すみません、何かお困りですか。',
            reading: 'すみません、なにかおこまりですか。',
            fr: 'Excusez-moi, avez-vous besoin d’aide ?'
          },
          task: 'Demande où se trouve la gare.',
          accepted: [
            ['駅はどこですか。', 'えきはどこですか。'],
            ['すみません、駅はどこですか。', 'すみません、えきはどこですか。'],
            ['駅はどこにありますか。', 'えきはどこにありますか。']
          ],
          model: {
            jp: 'すみません、駅はどこですか。',
            reading: 'すみません、えきはどこですか。',
            romaji: 'Sumimasen, eki wa doko desu ka.',
            fr: 'Excusez-moi, où est la gare ?'
          },
          tip: '〜はどこですか est la question de base pour demander un lieu. すみません attire l’attention poliment.'
        },
        {
          partner: {
            jp: '駅はあちらです。まっすぐ行ってください。',
            reading: 'えきはあちらです。まっすぐいってください。',
            fr: 'La gare est par là. Allez tout droit.'
          },
          task: 'Remercie et demande si c’est loin.',
          accepted: [
            ['ありがとうございます。遠いですか。', 'ありがとうございます。とおいですか。'],
            ['ありがとうございます。ここから遠いですか。', 'ありがとうございます。ここからとおいですか。']
          ],
          model: {
            jp: 'ありがとうございます。ここから遠いですか。',
            reading: 'ありがとうございます。ここからとおいですか。',
            romaji: 'Arigatō gozaimasu. Koko kara tōi desu ka.',
            fr: 'Merci. C’est loin d’ici ?'
          },
          tip: 'ここから = « d’ici ». 遠い (とおい) signifie « loin ».'
        },
        {
          partner: {
            jp: 'いいえ、歩いて五分です。',
            reading: 'いいえ、あるいてごふんです。',
            fr: 'Non, c’est à cinq minutes à pied.'
          },
          task: 'Remercie et confirme que c’est tout droit.',
          accepted: [
            ['わかりました。まっすぐですね。ありがとうございます。', 'わかりました。まっすぐですね。ありがとうございます。'],
            ['ありがとうございます。まっすぐ行きます。', 'ありがとうございます。まっすぐいきます。'],
            ['わかりました。ありがとうございます。', 'わかりました。ありがとうございます。']
          ],
          model: {
            jp: 'わかりました。まっすぐですね。ありがとうございます。',
            reading: 'わかりました。まっすぐですね。ありがとうございます。',
            romaji: 'Wakarimashita. Massugu desu ne. Arigatō gozaimasu.',
            fr: 'Compris. Tout droit, c’est ça. Merci.'
          },
          tip: '〜ですね sert à confirmer ce que l’autre vient de dire : « c’est bien…, n’est-ce pas ? ».'
        }
      ]
    },
    {
      id: 'shopping',
      emoji: '🛍️',
      title: 'Demander un prix',
      level: 'A1',
      goal: 'Demander le prix et prendre l’article',
      situation: 'Tu es dans une petite boutique. Tu as repéré un article.',
      speaker: '店員',
      speakerFr: 'la vendeuse',
      turns: [
        {
          partner: {
            jp: 'いらっしゃいませ。何をお探しですか。',
            reading: 'いらっしゃいませ。なにをおさがしですか。',
            fr: 'Bienvenue. Que cherchez-vous ?'
          },
          task: 'Demande le prix de cet article.',
          accepted: [
            ['これはいくらですか。', 'これはいくらですか。'],
            ['すみません、これはいくらですか。', 'すみません、これはいくらですか。'],
            ['これはいくらになりますか。', 'これはいくらになりますか。']
          ],
          model: {
            jp: 'すみません、これはいくらですか。',
            reading: 'すみません、これはいくらですか。',
            romaji: 'Sumimasen, kore wa ikura desu ka.',
            fr: 'Excusez-moi, combien coûte ceci ?'
          },
          tip: 'いくら = « combien ». これ désigne l’objet près de toi ; それ désigne celui près de l’autre personne.'
        },
        {
          partner: {
            jp: '千円です。',
            reading: 'せんえんです。',
            fr: 'Mille yens.'
          },
          task: 'Dis que tu le prends.',
          accepted: [
            ['これをください。', 'これをください。'],
            ['じゃあ、これをください。', 'じゃあ、これをください。'],
            ['それをください。', 'それをください。']
          ],
          model: {
            jp: 'じゃあ、これをください。',
            reading: 'じゃあ、これをください。',
            romaji: 'Jā, kore o kudasai.',
            fr: 'Alors, je prends ceci.'
          },
          tip: 'じゃあ = « alors ». 〜をください fonctionne aussi pour acheter, pas seulement pour commander.'
        },
        {
          partner: {
            jp: 'ありがとうございます。千円になります。',
            reading: 'ありがとうございます。せんえんになります。',
            fr: 'Merci. Cela fera mille yens.'
          },
          task: 'Dis que tu paies en espèces.',
          accepted: [
            ['現金で払います。', 'げんきんではらいます。'],
            ['現金でお願いします。', 'げんきんでおねがいします。'],
            ['はい、現金で払います。', 'はい、げんきんではらいます。']
          ],
          model: {
            jp: '現金で払います。',
            reading: 'げんきんではらいます。',
            romaji: 'Genkin de haraimasu.',
            fr: 'Je paie en espèces.'
          },
          tip: '現金 = espèces. で indique le moyen de paiement ; 払います signifie « payer ».'
        }
      ]
    },
    {
      id: 'repeat',
      emoji: '🔁',
      title: 'Faire répéter',
      level: 'A2',
      goal: 'Demander une répétition sans bloquer la conversation',
      situation: 'Un ami te donne un rendez-vous, mais la phrase est allée trop vite.',
      speaker: '友だち',
      speakerFr: 'un ami',
      turns: [
        {
          partner: {
            jp: '明日の待ち合わせは、新宿駅の東口です。',
            reading: 'あしたのまちあわせは、しんじゅくえきのひがしぐちです。',
            fr: 'Le rendez-vous de demain est à la sortie est de la gare de Shinjuku.'
          },
          task: 'Tu n’as pas compris. Demande poliment de répéter.',
          accepted: [
            ['すみません、もう一度お願いします。', 'すみません、もういちどおねがいします。'],
            ['もう一度言ってください。', 'もういちどいってください。'],
            ['すみません、よく分かりません。', 'すみません、よくわかりません。']
          ],
          model: {
            jp: 'すみません、もう一度お願いします。',
            reading: 'すみません、もういちどおねがいします。',
            romaji: 'Sumimasen, mō ichido onegai shimasu.',
            fr: 'Excuse-moi, encore une fois s’il te plaît.'
          },
          tip: 'もう一度 = « encore une fois ». Cette phrase est indispensable pour survivre à une conversation rapide.'
        },
        {
          partner: {
            jp: '新宿駅の東口です。ゆっくり言いましょうか。',
            reading: 'しんじゅくえきのひがしぐちです。ゆっくりいいましょうか。',
            fr: 'La sortie est de la gare de Shinjuku. Je parle plus lentement ?'
          },
          task: 'Demande de parler plus lentement.',
          accepted: [
            ['ゆっくり話してください。', 'ゆっくりはなしてください。'],
            ['ゆっくりお願いします。', 'ゆっくりおねがいします。'],
            ['すみません、ゆっくり話してください。', 'すみません、ゆっくりはなしてください。']
          ],
          model: {
            jp: 'すみません、ゆっくり話してください。',
            reading: 'すみません、ゆっくりはなしてください。',
            romaji: 'Sumimasen, yukkuri hanashite kudasai.',
            fr: 'Excuse-moi, parle plus lentement s’il te plaît.'
          },
          tip: 'ゆっくり = « lentement ». 〜てください est la demande polie « fais… s’il te plaît ».'
        },
        {
          partner: {
            jp: 'ゆっくり言います。明日の待ち合わせは、新宿駅の東口です。',
            reading: 'ゆっくりいいます。あしたのまちあわせは、しんじゅくえきのひがしぐちです。',
            fr: 'Je parle lentement. Le rendez-vous de demain est à la sortie est de la gare de Shinjuku.'
          },
          task: 'Confirme que tu as compris le lieu.',
          accepted: [
            ['わかりました。明日、新宿駅の東口ですね。', 'わかりました。あした、しんじゅくえきのひがしぐちですね。'],
            ['はい、わかりました。新宿駅の東口ですね。', 'はい、わかりました。しんじゅくえきのひがしぐちですね。'],
            ['わかりました。ありがとうございます。', 'わかりました。ありがとうございます。']
          ],
          model: {
            jp: 'わかりました。明日、新宿駅の東口ですね。',
            reading: 'わかりました。あした、しんじゅくえきのひがしぐちですね。',
            romaji: 'Wakarimashita. Ashita, Shinjuku-eki no higashiguchi desu ne.',
            fr: 'Compris. Demain, sortie est de la gare de Shinjuku.'
          },
          tip: 'Répéter l’information avec 〜ですね montre que tu as écouté et vérifies le rendez-vous.'
        }
      ]
    },
    {
      id: 'invite',
      emoji: '🍱',
      title: 'Proposer un déjeuner',
      level: 'A2',
      goal: 'Inviter et fixer une heure',
      situation: 'Un ami te demande ce que tu fais ce week-end. Tu veux le voir.',
      speaker: '友だち',
      speakerFr: 'une amie',
      turns: [
        {
          partner: {
            jp: '週末は何をしますか。',
            reading: 'しゅうまつはなにをしますか。',
            fr: 'Que fais-tu ce week-end ?'
          },
          task: 'Propose de déjeuner ensemble.',
          accepted: [
            ['一緒に昼ご飯を食べませんか。', 'いっしょにひるごはんをたべませんか。'],
            ['昼ご飯を一緒に食べませんか。', 'ひるごはんをいっしょにたべませんか。'],
            ['一緒にランチを食べませんか。', 'いっしょにらんちをたべませんか。']
          ],
          model: {
            jp: '一緒に昼ご飯を食べませんか。',
            reading: 'いっしょにひるごはんをたべませんか。',
            romaji: 'Issho ni hirugohan o tabemasen ka.',
            fr: 'On déjeune ensemble ?'
          },
          tip: '〜ませんか est une invitation polie, plus douce qu’une question directe. 一緒に = « ensemble ».'
        },
        {
          partner: {
            jp: 'いいですね。何時がいいですか。',
            reading: 'いいですね。なんじがいいですか。',
            fr: 'Bonne idée. Quelle heure te convient ?'
          },
          task: 'Propose midi.',
          accepted: [
            ['十二時はどうですか。', 'じゅうにじはどうですか。'],
            ['十二時にしましょう。', 'じゅうにじにしましょう。'],
            ['昼の十二時はどうですか。', 'ひるのじゅうにじはどうですか。']
          ],
          model: {
            jp: '十二時はどうですか。',
            reading: 'じゅうにじはどうですか。',
            romaji: 'Jūni-ji wa dō desu ka.',
            fr: 'Midi, ça te va ?'
          },
          tip: '〜はどうですか sert à proposer sans imposer. 十二時 = midi (littéralement « 12 heures »).'
        },
        {
          partner: {
            jp: '十二時で大丈夫です。どこで待ち合わせましょうか。',
            reading: 'じゅうにじでだいじょうぶです。どこでまちあわせましょうか。',
            fr: 'Midi me va. Où se retrouve-t-on ?'
          },
          task: 'Propose de vous retrouver devant la gare.',
          accepted: [
            ['駅の前で待ち合わせましょう。', 'えきのまえでまちあわせましょう。'],
            ['駅の前はどうですか。', 'えきのまえはどうですか。'],
            ['駅で待ち合わせませんか。', 'えきでまちあわせませんか。']
          ],
          model: {
            jp: '駅の前で待ち合わせましょう。',
            reading: 'えきのまえでまちあわせましょう。',
            romaji: 'Eki no mae de machiawasemashō.',
            fr: 'Retrouvons-nous devant la gare.'
          },
          tip: '待ち合わせ = rendez-vous. 〜の前 = devant ; で indique le lieu du rendez-vous.'
        }
      ]
    },
    {
      id: 'restaurant',
      emoji: '🍽️',
      title: 'Au restaurant',
      level: 'A2',
      goal: 'Demander une recommandation et commander',
      situation: 'Tu es au restaurant et tu hésites devant le menu.',
      speaker: '店員',
      speakerFr: 'le serveur',
      turns: [
        {
          partner: {
            jp: 'ご注文はお決まりですか。',
            reading: 'ごちゅうもんはおきまりですか。',
            fr: 'Avez-vous choisi ?'
          },
          task: 'Demande ce que le restaurant recommande.',
          accepted: [
            ['おすすめは何ですか。', 'おすすめはなんですか。'],
            ['何がおすすめですか。', 'なにがおすすめですか。'],
            ['おすすめを教えてください。', 'おすすめをおしえてください。']
          ],
          model: {
            jp: 'おすすめは何ですか。',
            reading: 'おすすめはなんですか。',
            romaji: 'Osusume wa nan desu ka.',
            fr: 'Quelle est votre recommandation ?'
          },
          tip: 'おすすめ = « recommandation ». 教えてください = « dites-moi / apprenez-moi », très utile pour demander une information.'
        },
        {
          partner: {
            jp: '今日は魚料理がおすすめです。',
            reading: 'きょうはさかなりょうりがおすすめです。',
            fr: 'Aujourd’hui, je recommande le plat de poisson.'
          },
          task: 'Dis que tu prends ça.',
          accepted: [
            ['じゃあ、それをください。', 'じゃあ、それをください。'],
            ['魚料理をお願いします。', 'さかなりょうりをおねがいします。'],
            ['それをください。', 'それをください。']
          ],
          model: {
            jp: 'じゃあ、魚料理をお願いします。',
            reading: 'じゃあ、さかなりょうりをおねがいします。',
            romaji: 'Jā, sakana ryōri o onegai shimasu.',
            fr: 'Alors, je prends le plat de poisson.'
          },
          tip: 'それを = « cela » (ce que l’autre vient de mentionner). お願いします convient très bien pour commander.'
        },
        {
          partner: {
            jp: 'お飲み物は何になさいますか。',
            reading: 'おのみものはなんになさいますか。',
            fr: 'Que prenez-vous comme boisson ?'
          },
          task: 'Commande de l’eau.',
          accepted: [
            ['お水をお願いします。', 'おみずをおねがいします。'],
            ['水でお願いします。', 'みずでおねがいします。'],
            ['お水をください。', 'おみずをください。']
          ],
          model: {
            jp: 'お水をお願いします。',
            reading: 'おみずをおねがいします。',
            romaji: 'Omizu o onegai shimasu.',
            fr: 'De l’eau, s’il vous plaît.'
          },
          tip: 'お水 est la forme polie de « eau ». 何になさいますか est une façon très polie de demander « que prenez-vous ? ».'
        }
      ]
    },
    {
      id: 'goodbye',
      emoji: '👋',
      title: 'Terminer une conversation',
      level: 'A2',
      goal: 'Remercier et prendre congé poliment',
      situation: 'La rencontre se termine. Tu veux laisser une bonne impression.',
      speaker: '友だち',
      speakerFr: 'un ami',
      turns: [
        {
          partner: {
            jp: '今日は楽しかったです。ありがとうございました。',
            reading: 'きょうはたのしかったです。ありがとうございました。',
            fr: 'C’était sympa aujourd’hui. Merci beaucoup.'
          },
          task: 'Remercie et propose de vous revoir.',
          accepted: [
            ['こちらこそありがとうございました。また会いましょう。', 'こちらこそありがとうございました。またあいましょう。'],
            ['ありがとうございました。また会いましょう。', 'ありがとうございました。またあいましょう。'],
            ['こちらこそ。また会いましょう。', 'こちらこそ。またあいましょう。']
          ],
          model: {
            jp: 'こちらこそありがとうございました。また会いましょう。',
            reading: 'こちらこそありがとうございました。またあいましょう。',
            romaji: 'Kochira koso arigatō gozaimashita. Mata aimashō.',
            fr: 'C’est moi qui te remercie. À bientôt.'
          },
          tip: 'こちらこそ = « c’est moi qui te remercie ». また会いましょう = « revoyons-nous », poli et chaleureux.'
        },
        {
          partner: {
            jp: 'また連絡しますね。',
            reading: 'またれんらくしますね。',
            fr: 'Je te recontacterai.'
          },
          task: 'Dis au revoir poliment.',
          accepted: [
            ['はい、お疲れさまでした。', 'はい、おつかれさまでした。'],
            ['お疲れさまでした。', 'おつかれさまでした。'],
            ['失礼します。', 'しつれいします。']
          ],
          model: {
            jp: 'はい、お疲れさまでした。',
            reading: 'はい、おつかれさまでした。',
            romaji: 'Hai, otsukaresama deshita.',
            fr: 'Oui, merci pour aujourd’hui. À bientôt.'
          },
          tip: 'お疲れさまでした est une formule de fin très courante. 失礼します est plus formel : « je vous laisse ».'
        },
        {
          partner: {
            jp: 'はい、また連絡します。気をつけて帰ってくださいね。',
            reading: 'はい、またれんらくします。きをつけてかえってくださいね。',
            fr: 'Oui, je te recontacterai. Rentre bien.'
          },
          task: 'Remercie et prends congé poliment.',
          accepted: [
            ['ありがとうございます。失礼します。', 'ありがとうございます。しつれいします。'],
            ['はい、またね。', 'はい、またね。'],
            ['ありがとうございます。また連絡します。', 'ありがとうございます。またれんらくします。']
          ],
          model: {
            jp: 'ありがとうございます。失礼します。',
            reading: 'ありがとうございます。しつれいします。',
            romaji: 'Arigatō gozaimasu. Shitsurei shimasu.',
            fr: 'Merci. Je vous laisse.'
          },
          tip: '気をつけて = « fais attention / rentre bien ». 失礼します est la formule polie pour prendre congé.'
        }
      ]
    }
  ];

  function clean(value) {
    return P.stripAnnotations(String(value == null ? '' : value)).normalize('NFKC').trim();
  }

  function toHiragana(value) {
    return String(value || '').replace(/[\u30a1-\u30f6]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0x60);
    });
  }

  function kanaKey(value) {
    return toHiragana(clean(value)).replace(NOISE_RE, '');
  }

  function romanKey(value) {
    return clean(value)
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z]/g, '');
  }

  function romanVariants(value) {
    var base = romanKey(value);
    if (!base) return [];
    function longVowels(s) {
      return s.replace(/ou/g, 'o').replace(/oo/g, 'o').replace(/uu/g, 'u')
        .replace(/aa/g, 'a').replace(/ii/g, 'i').replace(/ee/g, 'e');
    }
    function particles(s) {
      return s.replace(/ha/g, 'wa').replace(/wo/g, 'o').replace(/he/g, 'e');
    }
    var seeds = [
      base,
      particles(base),
      longVowels(base),
      particles(longVowels(base)),
      longVowels(particles(base)),
      base.replace(/shi/g, 'si').replace(/chi/g, 'ti').replace(/tsu/g, 'tu')
        .replace(/fu/g, 'hu').replace(/ji/g, 'zi')
    ];
    var out = [];
    seeds.forEach(function (seed) {
      var key = romanKey(seed);
      if (key && out.indexOf(key) < 0) out.push(key);
    });
    return out;
  }

  function pairOf(item) {
    if (Array.isArray(item)) {
      return {
        jp: String(item[0] || ''),
        reading: String(item[1] || item[0] || ''),
        romaji: String(item[2] || '')
      };
    }
    return { jp: String(item || ''), reading: String(item || ''), romaji: '' };
  }

  function checkAnswer(answer, accepted, options) {
    var raw = clean(answer);
    if (!raw || !Array.isArray(accepted) || !accepted.length) return false;
    var key = kanaKey(raw);
    if (options && options.acceptName && /^(はじめまして)?(わたしは)?[\u3040-\u30ff\u3400-\u9fff]{1,16}です$/.test(key)) return true;
    var pairs = accepted.map(pairOf);
    if (/[a-zA-Z]/.test(raw)) {
      var inputVariants = romanVariants(raw);
      return pairs.some(function (pair) {
        var target = pair.romaji || P.kanaToRomaji(pair.reading);
        var candidates = romanVariants(target);
        return inputVariants.some(function (value) { return candidates.indexOf(value) >= 0; });
      });
    }
    return pairs.some(function (pair) {
      return key === kanaKey(pair.jp) || key === kanaKey(pair.reading);
    });
  }

  function scenarioById(id) {
    for (var i = 0; i < SCENARIOS.length; i++) {
      if (SCENARIOS[i].id === id) return SCENARIOS[i];
    }
    return null;
  }

  return {
    scenarios: SCENARIOS,
    scenarioById: scenarioById,
    checkAnswer: checkAnswer,
    normalizeKana: kanaKey,
    normalizeRomaji: romanKey
  };
});
