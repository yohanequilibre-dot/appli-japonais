/* Kotoba — vocabulaire quotidien supplémentaire.
Même format que data.js : [kanji, furigana, romaji, français, phrase, traduction].
Chargé après data.js et avant app.js. */
(function () {
'use strict';
var extra = [
{ id: 'verbes-quotidien', name: 'Verbes utiles au quotidien', emoji: '🗣️', words: [
['使います','使[つか]います','tsukaimasu','utiliser','携帯を使います。','J’utilise mon téléphone.'],
['作ります','作[つく]ります','tsukurimasu','préparer / cuisiner','朝ご飯を作ります。','Je prépare le petit-déjeuner.'],
['洗います','洗[あら]います','araimasu','laver','手を洗います。','Je me lave les mains.'],
['待ちます','待[ま]ちます','machimasu','attendre','駅で待ちます。','J’attends à la gare.'],
['開けます','開[あ]けます','akemasu','ouvrir','窓を開けます。','J’ouvre la fenêtre.'],
['閉めます','閉[し]めます','shimemasu','fermer','ドアを閉めます。','Je ferme la porte.'],
['貸します','貸[か]します','kashimasu','prêter','ペンを貸します。','Je prête un stylo.'],
['借ります','借[か]ります','karimasu','emprunter','本を借ります。','J’emprunte un livre.'],
['覚えます','覚[おぼ]えます','oboemasu','mémoriser','新しい言葉を覚えます。','Je mémorise de nouveaux mots.'],
['忘れます','忘[わす]れます','wasuremasu','oublier','よく鍵を忘れます。','J’oublie souvent mes clés.']
]},
{ id: 'maison-quotidien', name: 'La maison au quotidien', emoji: '🛏️', words: [
['ベッド','ベッド','beddo','lit','ベッドで寝ます。','Je dors dans un lit.'],
['机','机[つくえ]','tsukue','bureau / table','机の上に本があります。','Il y a un livre sur le bureau.'],
['椅子','椅子[いす]','isu','chaise','椅子に座ります。','Je m’assois sur une chaise.'],
['ドア','ドア','doa','porte','ドアを開けてください。','Ouvrez la porte, s’il vous plaît.'],
['窓','窓[まど]','mado','fenêtre','窓を閉めます。','Je ferme la fenêtre.'],
['鍵','鍵[かぎ]','kagi','clé','鍵はどこですか。','Où est la clé ?'],
['電気','電気[でんき]','denki','électricité / lumière','電気を消してください。','Éteignez la lumière, s’il vous plaît.'],
['タオル','タオル','taoru','serviette','タオルを持ってきます。','J’apporte une serviette.'],
['石鹸','石鹸[せっけん]','sekken','savon','石鹸で手を洗います。','Je me lave les mains avec du savon.'],
['歯ブラシ','歯[は]ブラシ','haburashi','brosse à dents','歯ブラシを買います。','J’achète une brosse à dents.']
]},
{ id: 'ville-transport', name: 'En ville et en transport', emoji: '🚇', words: [
['バス','バス','basu','bus','バスで学校に行きます。','Je vais à l’école en bus.'],
['地下鉄','地下鉄[ちかてつ]','chikatetsu','métro','地下鉄は速いです。','Le métro est rapide.'],
['車','車[くるま]','kuruma','voiture','車を運転します。','Je conduis une voiture.'],
['自転車','自転車[じてんしゃ]','jitensha','vélo','自転車で駅まで行きます。','Je vais à la gare à vélo.'],
['道','道[みち]','michi','route / chemin','この道をまっすぐ行ってください。','Allez tout droit dans cette rue.'],
['橋','橋[はし]','hashi','pont','橋を渡ります。','Je traverse le pont.'],
['店','店[みせ]','mise','magasin','あの店は安いです。','Ce magasin est bon marché.'],
['スーパー','スーパー','sūpā','supermarché','スーパーで野菜を買います。','J’achète des légumes au supermarché.'],
['銀行','銀行[ぎんこう]','ginkō','banque','銀行は駅の近くです。','La banque est près de la gare.'],
['公園','公園[こうえん]','kōen','parc','公園で散歩します。','Je me promène dans le parc.']
]},
{ id: 'sante-corps', name: 'Santé et corps', emoji: '🩺', words: [
['頭','頭[あたま]','atama','tête','頭が痛いです。','J’ai mal à la tête.'],
['背中','背中[せなか]','senaka','dos','背中が痛いです。','J’ai mal au dos.'],
['手','手[て]','te','main','手を洗ってください。','Lavez-vous les mains.'],
['足','足[あし]','ashi','pied / jambe','足が疲れました。','J’ai les jambes fatiguées.'],
['薬','薬[くすり]','kusuri','médicament','薬を飲みます。','Je prends un médicament.'],
['医者','医者[いしゃ]','isha','médecin','医者に行きます。','Je vais chez le médecin.'],
['熱','熱[ねつ]','netsu','fièvre','熱があります。','J’ai de la fièvre.'],
['風邪','風邪[かぜ]','kaze','rhume','風邪をひきました。','J’ai attrapé un rhume.'],
['痛い','痛[いた]い','itai','douloureux','お腹が痛いです。','J’ai mal au ventre.'],
['元気','元気[げんき]','genki','en forme','今日は元気です。','Je suis en forme aujourd’hui.']
]},
{ id: 'travail-etudes', name: 'Travail et études', emoji: '💼', words: [
['会議','会議[かいぎ]','kaigi','réunion','会議は三時からです。','La réunion est à trois heures.'],
['会社員','会社員[かいしゃいん]','kaishain','employé(e)','父は会社員です。','Mon père est employé.'],
['事務所','事務所[じむしょ]','jimusho','bureau (lieu)','事務所は五階です。','Le bureau est au cinquième étage.'],
['パソコン','パソコン','pasokon','ordinateur','パソコンで仕事をします。','Je travaille sur ordinateur.'],
['携帯','携帯[けいたい]','keitai','téléphone portable','携帯を忘れました。','J’ai oublié mon téléphone.'],
['メール','メール','mēru','e-mail','メールを送ります。','J’envoie un e-mail.'],
['紙','紙[かみ]','kami','papier','紙に書いてください。','Écrivez sur le papier.'],
['ペン','ペン','pen','stylo','ペンを貸してください。','Prête-moi un stylo.'],
['授業','授業[じゅぎょう]','jugyō','cours','授業は九時に始まります。','Le cours commence à neuf heures.'],
['試験','試験[しけん]','shiken','examen','明日、試験があります。','J’ai un examen demain.']
]},
{ id: 'temps-meteo', name: 'Le temps et la météo', emoji: '🌦️', words: [
['朝','朝[あさ]','asa','matin','朝にコーヒーを飲みます。','Le matin, je bois du café.'],
['晩','晩[ばん]','ban','soir','晩はテレビを見ます。','Le soir, je regarde la télévision.'],
['夜','夜[よる]','yoru','nuit','夜は静かです。','La nuit est calme.'],
['週','週[しゅう]','shū','semaine','来週、日本に行きます。','La semaine prochaine, je vais au Japon.'],
['月','月[つき]','tsuki','mois','今月は忙しいです。','Ce mois-ci, je suis occupé.'],
['年','年[とし]','toshi','année','今年は忙しいです。','Cette année, je suis occupé.'],
['雨','雨[あめ]','ame','pluie','今日は雨です。','Aujourd’hui, il pleut.'],
['雪','雪[ゆき]','yuki','neige','冬は雪が降ります。','Il neige en hiver.'],
['風','風[かぜ]','kaze','vent','風が強いです。','Le vent est fort.'],
['天気','天気[てんき]','tenki','temps (météo)','いい天気ですね。','Il fait beau, n’est-ce pas ?']
]},
{ id: 'nourriture-plus', name: 'À table : au-delà des bases', emoji: '🍚', words: [
['米','米[こめ]','kome','riz cru','米を買います。','J’achète du riz.'],
['麺','麺[めん]','men','nouilles','麺が好きです。','J’aime les nouilles.'],
['果物','果物[くだもの]','kudamono','fruits','果物を食べます。','Je mange des fruits.'],
['りんご','りんご','ringo','pomme','りんごを一つください。','Une pomme, s’il vous plaît.'],
['バナナ','バナナ','banana','banane','バナナは甘いです。','Les bananes sont sucrées.'],
['砂糖','砂糖[さとう]','satō','sucre','砂糖を入れます。','J’ajoute du sucre.'],
['塩','塩[しお]','shio','sel','塩を少しください。','Un peu de sel, s’il vous plaît.'],
['弁当','弁当[べんとう]','bentō','bento','弁当を持って行きます。','J’emporte un bento.'],
['味噌汁','味噌汁[みそしる]','misoshiru','soupe miso','味噌汁を飲みます。','Je bois de la soupe miso.'],
['天ぷら','天[てん]ぷら','tenpura','tempura','天ぷらはおいしいです。','La tempura est délicieuse.']
]},
{ id: 'loisirs', name: 'Loisirs et sorties', emoji: '🎶', words: [
['スポーツ','スポーツ','supōtsu','sport','スポーツが好きです。','J’aime le sport.'],
['サッカー','サッカー','sakkā','football','サッカーをします。','Je joue au football.'],
['散歩','散歩[さんぽ]','sanpo','promenade','公園を散歩します。','Je me promène dans le parc.'],
['ゲーム','ゲーム','gēmu','jeu','ゲームをします。','Je joue à des jeux.'],
['歌','歌[うた]','uta','chanson','歌を歌います。','Je chante une chanson.'],
['ダンス','ダンス','dansu','danse','ダンスが上手です。','Il ou elle danse bien.'],
['温泉','温泉[おんせん]','onsen','source chaude','温泉に入ります。','Je prends un bain thermal.'],
['祭り','祭[まつ]り','matsuri','festival','夏祭りに行きます。','Je vais au festival d’été.'],
['山','山[やま]','yama','montagne','山に登ります。','Je grimpe une montagne.'],
['海','海[うみ]','umi','mer','海で泳ぎます。','Je nage dans la mer.']
]},
{ id: 'emotions', name: 'Dire ses émotions', emoji: '💬', words: [
['嬉しい','嬉[うれ]しい','ureshii','content','合格して嬉しいです。','Je suis content d’avoir réussi.'],
['悲しい','悲[かな]しい','kanashii','triste','別れは悲しいです。','Les adieux sont tristes.'],
['怒る','怒[おこ]る','okoru','se fâcher','父はよく怒る。','Mon père se fâche souvent.'],
['疲れる','疲[つか]れる','tsukareru','être fatigué','仕事で疲れる。','Je me fatigue au travail.'],
['心配','心配[しんぱい]','shinpai','inquiétude / souci','心配しないでください。','Ne t’inquiète pas.'],
['安心','安心[あんしん]','anshin','soulagement','安心しました。','J’ai été soulagé.'],
['恥ずかしい','恥[は]ずかしい','hazukashii','gêné / honteux','少し恥ずかしいです。','Je suis un peu gêné.'],
['寂しい','寂[さび]しい','sabishii','seul / triste','一人で寂しいです。','Je me sens seul.'],
['面白い','面白[おもしろ]い','omoshiroi','intéressant / amusant','この本は面白いです。','Ce livre est intéressant.'],
['つまらない','つまらない','tsumaranai','ennuyeux','この映画はつまらないです。','Ce film est ennuyeux.']
]},
{ id: 'expressions-quotidien', name: 'Expressions du quotidien', emoji: '🗨️', words: [
['お疲れ様','お疲[つか]れ様[さま]','otsukaresama','merci pour ton travail','お疲れ様です。','Merci pour votre travail.'],
['頑張って','頑張[がんば]って','ganbatte','bon courage','試験、頑張って！','Bon courage pour l’examen !'],
['いただきます','いただきます','itadakimasu','bon appétit','いただきます！','Bon appétit !'],
['ごちそうさま','ごちそうさま','gochisōsama','merci pour le repas','ごちそうさまでした。','Merci pour le repas.'],
['いってきます','いってきます','ittekimasu','je pars','いってきます！','Je pars !'],
['いってらっしゃい','いってらっしゃい','itterasshai','à tout à l’heure','いってらっしゃい。','À tout à l’heure.'],
['ただいま','ただいま','tadaima','je suis rentré','ただいま！','Je suis rentré !'],
['おかえりなさい','おかえりなさい','okaerinasai','bon retour','おかえりなさい。','Bon retour.'],
['気をつけて','気[き]をつけて','ki o tsukete','fais attention','気をつけて帰ってください。','Rentrez prudemment.'],
['おめでとう','おめでとう','omedetō','félicitations','おめでとうございます！','Félicitations !']
]}
];
window.UNITS_DATA = (window.UNITS_DATA || []).concat(extra);
})();
