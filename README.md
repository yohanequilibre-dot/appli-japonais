# Kotoba — mes mots japonais

Kotoba est une application web gratuite pour apprendre et réviser le vocabulaire japonais, pensée pour le PC et le téléphone. Elle mélange la carte à révéler de Duolingo, la répétition espacée d'Anki, les furigana de WaniKani et les phrases de contexte de Bunpro.

**Tester en ligne :** https://yohanequilibre-dot.github.io/appli-japonais/

**Tester sur ton PC :** voir [TESTING.md](TESTING.md).

## Le principe

Une carte montre d'abord le mot **français**. Tu peux le prononcer avec le micro — le score s'affiche et la fiche se révèle automatiquement — ou révéler directement :

1. le japonais en kanji / kana, avec le **furigana** au-dessus ;
2. une **phrase de contexte** japonaise avec sa traduction, à droite sur grand écran et sous la carte sur mobile.

Le romaji complet apparaît sous le mot, et chaque unité (kanji ou kana) porte sa lecture latine au-dessus. Aucune ligne de kana dupliquée au-dessus du mot.

Tu valides ensuite avec « Je ne savais pas » ou « J'ai prononcé ». La répétition espacée décide du prochain rendez-vous.

Exemple importé avec `bonjour | kon-ni-chi-wa` :

- français : bonjour
- japonais : こんにちは
- romaji : kon-ni-chi-wa
- contexte : こんにちは、花さん！ / Bonjour, Hana !

## Fonctionnalités

- **aller** : la carte de base utilise 行きます (ikimasu, forme polie). La forme neutre 行く (iku) est aussi disponible, et la différence est expliquée dans l’onglet Grammaire.
- **1 000 mots courants + 60 mots d’escalade** : les bases quotidiennes, les mots les plus fréquents et un pack dédié à la grimpe, chacun avec une phrase de contexte et sa traduction. 32 thèmes au total.
- **Révision espacée** par paliers : 10 min, 1 j, 2 j, 4 j, 8 j, 16 j, 32 j, 64 j, 128 j, 256 j.
- **Parcours par étapes** : un mot passe de « Nouveau » à « En révision », puis à « Validé » après 10 révisions et à « Ultime » après 30. Les onglets du parcours ouvrent directement le filtre correspondant dans Mes mots, et chaque fiche montre sa barre de progression.
- **Contexte annoté** : chaque unité du mot et de la phrase de contexte porte sa lecture latine (romaji) au-dessus ; les groupes de kanji gardent leur lecture de groupe, et les kana sont lus séparément. Aucune ligne de kana dupliquée.
- **Formes polies partout** : les verbes sont présentés et pratiqués à la forme ます (働きます, 働きません, 働きました, 働きませんでした), avec la question et les formes neutres expliquées dans la fiche. Les formes conjuguées de la phrase de contexte reçoivent aussi leur lecture latine (働いています → はたら + います).
- **Exemples variés** : en plus de la phrase principale, la fiche de chaque verbe courant montre des exemples supplémentaires (négation, passé, question) pour voir la forme en situation.
- **Traduction au survol** : survole une phrase de contexte (ou place le focus dessus au clavier) pour afficher sa traduction dans une infobulle, sans quitter la carte.
- **Traduction mot à mot** : ouvre « Mot à mot » sous une phrase, ou survole-la, pour voir chaque mot ou particule avec sa traduction. Les particules indiquent leur rôle ; les mots hors lexique sont signalés.
- **Nuances de registre** : la carte de rappel indique seulement le registre (« Version formelle » ou « Version familière ») ; la fiche et la réponse précisent les variantes さようなら / じゃあね.
- **Réponse lue automatiquement** : dès que la réponse s’affiche — par révélation ou par résultat micro — le mot puis la phrase de contexte sont lus sans clic. Un verdict explicite indique si c’est correct ou non.
- **Alternatives acceptées** : pour « s’il vous plaît », お願いします et ください (kudasai) sont acceptés. La fiche explique la nuance : お願いします est plus doux et général ; ください est plus direct et concret, mais les deux restent polis.
- **Six modes de session** : rappel (révéler puis valider), QCM, écoute, prononciation, compréhension (japonais → sens) et production écrite (français → japonais, en kana, kanji ou romaji). Le bouton « Passer au suivant » enchaîne immédiatement la carte suivante.
- **Entraînement actif** : les cartes « Compréhension » et « Production » sont accessibles depuis Réviser. La session du jour alterne aussi les directions pour éviter de seulement reconnaître le français.
- **Micro intégré à la révision** : sur la carte française, « 🎙️ Prononcer » écoute, donne un score et révèle la fiche dans tous les cas, même si la prononciation est imparfaite. La carte s'illumine fortement en vert ou en rouge selon le résultat, le détail est centré sous la fiche et le retry reste disponible. Dans la fiche d'un mot, « Prononcer » ouvre la carte de prononciation ; le micro ne démarre qu’au clic sur le bouton d’écoute.
- **Prononciation guidée** : le mot d’abord, puis la phrase complète dès qu’il est validé (si le mot a un contexte) ; score sur 100 et historique des dernières tentatives dans la fiche du mot. La capture est mono, filtrée, normalisée et coupée automatiquement après un silence ; le retour montre le niveau, les sons manquants ou en trop, le petit っ et les voyelles longues, puis un conseil. En mode IA locale, réécoute ta prise à côté de la voix modèle. Deux moteurs au choix : la reconnaissance du navigateur ou **Whisper en local** (IA, sans clé API, décodage beam search).
- **Atelier de phrases** : à partir des phrases de contexte déjà présentes, complète un mot en kana ou romaji, remets une phrase dans l’ordre ou écoute-la puis reconstruis-la avec des tuiles. Chaque réponse est corrigée et expliquée avec le mot à mot.
- **Conversation de la vraie vie** : 12 situations et 36 répliques pour se présenter, commander, demander son chemin, faire répéter, proposer un déjeuner, demander une recommandation et prendre congé. Tu réponds en kana, kanji ou romaji ; les variantes polies sont acceptées, la réponse modèle est lue et expliquée avec une astuce de politesse. Chaque situation propose trois échanges, le mode écoute masque le texte et lance l’audio pour travailler la compréhension orale, une situation surprise permet de varier les contextes, et « Répondre à l’oral » transcrit ta voix japonaise dans le champ de réponse avant vérification, puis affiche un score de prononciation et un conseil quand la réponse est juste. Les parcours train, hôtel, pharmacie et taxi complètent les situations de voyage et d’imprévu.
- **Session du jour** : un parcours guidé qui mélange les cartes dues, quelques nouveaux mots, deux phrases et une prononciation ciblée.
- **Compte et synchronisation** : crée un compte e-mail / mot de passe et retrouve tes révisions, tes mots importés et tes statistiques sur ton téléphone comme sur ton PC. La progression reste locale hors ligne et les états sont fusionnés avant chaque envoi.
- **Furigana et romaji partout** : les mots, les phrases de contexte et les exemples de l’onglet Grammaire sont annotés automatiquement ; la lecture latine est affichée au-dessus des kanji.
- **Carte dans le bon ordre** : français → japonais avec lectures latines et furigana → contexte annoté, avec le romaji complet sous le mot.
- **Audio japonais** via la synthèse vocale du navigateur, avec vitesse réglable et bouton lent.
- **Série, XP, objectif quotidien** et prévisions des sept prochains jours.
- **Mes mots** : recherche en français / japonais / romaji, filtres (à réviser, nouveaux, révisés, mal prononcés, en révision, validés, ultimes, connus, importés), fiche détaillée, modification et suppression des mots importés.
- **Suivi des révisions** : nombre de prononciations, de révisions et de réussites par mot ; filtre « Révisés », cinq derniers scores dans la fiche et panneau de progression avec moyenne récente, meilleur score et mots à retravailler.
- **Onglet Grammaire** : ordre de la phrase, particules, formes ます / neutres, passé, négation, questions, compteurs et constructions quotidiennes.
- **Import libre** : texte collé, fichier `.txt` / `.csv` / `.tsv` / `.json`, ou capture d'écran avec OCR japonais + français.
- **Sauvegarde** : export / import JSON de toute la progression.
- **PWA** : installation sur l'écran d'accueil et consultation hors ligne après le premier chargement.
- **Thème clair / sombre / système**, furigana et romaji activables.

## Méthode d’apprentissage

L’app combine plusieurs principes bien établis en sciences de l’apprentissage :

- **Récupération active** : l’app demande de retrouver le sens ou le mot avant de révéler la réponse, plutôt que de relire passivement.
- **Espacement** : les révisions reviennent à intervalles croissants ; le calendrier et les paliers sont visibles dans l’app.
- **Interleaving** : la session du jour mélange révisions, compréhension, production, phrases et prononciation au lieu de bloquer une seule compétence.
- **Input et output** : les phrases contextualisées et l’écoute entraînent la compréhension ; la production écrite et la prononciation obligent à récupérer la langue pour communiquer.
- **Tâches communicatives** : les conversations partent d’une situation et d’une intention (« demander le chemin », « faire répéter »), pas d’une liste de mots. C’est le transfert vers la vraie conversation qui est entraîné.
- **Feedback immédiat** : chaque essai est corrigé, avec la bonne réponse, la lecture et le contexte.

Références utiles : [retrievalpractice.org](https://www.retrievalpractice.org/), [EduResearch — spacing and retrieval](https://www.edresearch.edu.au/guides-resources/practice-guides/spacing-and-retrieval-practice-guide-full-publication), [The Triple Helix — input and output](https://voices.uchicago.edu/triplehelix/2025/05/20/effective-language-learning-focus-on-input-or-output/).

## Formats d'import acceptés

Le parseur reconnaît le français avant ou après le japonais, et tolère plusieurs séparateurs :

```text
bonjour | kon-ni-chi-wa
merci | arigatou
manger | 食べる | taberu | ご飯を食べる。 | Je mange du riz.
おはよう
bonjour (le matin)
こんにちは | bonjour
bonjour, こんにちは
```

Il complète automatiquement le kanji, le furigana, le romaji et le contexte quand le mot est dans le lexique de secours. Une ligne sans japonais produit une erreur claire dans l'aperçu, sans bloquer le reste de l'import.

## Lancer en local

```bash
python3 -m http.server 8080
```

Puis ouvrir http://localhost:8080. Sur Windows : `py -m http.server 8080`.

Ne pas ouvrir `index.html` par double-clic : le service worker, l'OCR et certains comportements du navigateur ont besoin d'un vrai serveur HTTP. Le détail est dans [TESTING.md](TESTING.md).

## Compte et synchronisation

Le bouton 👤 dans l'en-tête (et le panneau « Téléphone + ordinateur » sur l'accueil) ouvre la connexion. Crée un compte sur un appareil, puis connecte-toi avec le même e-mail et le même mot de passe sur l'autre : la progression est fusionnée automatiquement. Une synchronisation est aussi tentée après une session, à la fermeture de l'onglet et via le bouton « Synchroniser ».

Le service est un petit Worker Cloudflare avec une base D1 (`sync/worker.js` et `sync/deploy.json`). Les mots de passe sont hachés avec PBKDF2-SHA-256 (100 000 itérations, la limite de WebCrypto sur Workers) et les sessions utilisent des jetons dont seul le hash est stocké. CORS n'accepte que GitHub Pages et les adresses de développement local. La progression en ligne est stockée en JSON sur ce service ; elle n'est pas chiffrée de bout en bout. Le mode local reste disponible si l'API est hors ligne.

## Tests

```bash
npm install
npm test                 # parseur, SRS, lexique et fusion de synchronisation (Node)
npx playwright install chromium
npm run test:e2e         # parcours réel dans Chromium
```

La CI GitHub Actions vérifie la syntaxe, le manifeste, les tests unitaires et les tests Playwright à chaque push sur `main`.

## Structure

```text
index.html             coquille de l'application
styles.css             design responsive clair / sombre
data.js + js/vocab-extra.js + js/vocab-1000.js 1 000 mots courants + 60 mots d’escalade, 32 thèmes
js/lexicon.js          lexique de secours français / romaji → japonais
js/srs.js              état local, paliers SRS, étapes de parcours, statistiques
js/parser.js           analyse des imports et annotations furigana
js/reading.js          lectures kana et furigana automatiques
js/grammar-reading.js  furigana des exemples de grammaire
js/pronunciation.js    comparaison, score et contrôle du rythme
js/phrase.js           exercices de phrases : trou, ordre et dictée
js/conversation.js     situations de conversation, variantes, correction kana/romaji et mode écoute
js/whisper.js          micro et transcription Whisper locale
js/whisper-worker.js   worker du modèle Whisper (Transformers.js)
js/sync.js             client de compte et fusion des progressions
js/app.js              interface, sessions, import, réglages
sync/worker.js         API comptes, sessions et sauvegarde (Cloudflare Worker / D1)
sync/deploy.json       manifeste de déploiement de l'API
manifest.webmanifest   installation PWA
sw.js                  cache hors ligne
icon.svg               icône
playwright.config.js   configuration des tests navigateur
tests/                 tests unitaires, E2E et serveur de test
```

## Limites assumées

- La progression est d'abord stockée dans le navigateur (`localStorage`) avec des points de restauration locaux automatiques. Le compte permet de la synchroniser entre appareils ; sans connexion, l'application continue de fonctionner localement et la synchronisation reprend plus tard. Les réglages d'affichage restent propres à chaque appareil.
- La synchronisation n'inclut pas encore la vérification d'e-mail, la réinitialisation du mot de passe ni le chiffrement de bout en bout de la progression. Utilise un mot de passe unique pour ce compte.
- La voix japonaise dépend des voix installées sur l'ordinateur ou le téléphone. L'application reste utilisable sans audio.
- L'OCR télécharge Tesseract.js et les modèles japonais / français au premier usage : une connexion est nécessaire la première fois. Une image nette et contrastée améliore beaucoup le résultat.
- Les conversations sont des mises en situation scriptées : elles donnent des formules solides et un entraînement de production, mais elles ne remplacent pas une conversation imprévisible avec un locuteur natif. Répète les réponses à voix haute, puis essaie-les en vrai.
- Les lectures et les phrases de contexte sont un point de départ : l'import permet d'ajouter ton propre vocabulaire, avec tes propres phrases.
- La reconnaissance du navigateur peut envoyer l'audio au service du navigateur. Le moteur « IA locale » Whisper reste dans le navigateur, mais télécharge le modèle (plusieurs dizaines de Mo) au premier usage, puis le garde en cache. La réponse orale de l'onglet Parler utilise la reconnaissance du navigateur : Chrome ou Edge sont recommandés, et une connexion peut être nécessaire selon le navigateur.
- Le score de prononciation est indicatif : il compare la transcription à la lecture attendue, en convertissant les kanji en kana et en tolérant les particules は / を / へ, mais ce n'est pas un jugement humain.

## Sources et licences

- **Kanjikana Core 1000** : les 1 000 mots courants viennent de la liste [Kanjikana Core 1000](https://kanjikana.com/en/words/core-1000), par Kanjikana, sous licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **Tatoeba** : les exemples japonais-français sont issus de [Tatoeba](https://tatoeba.org), sous licence [CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/).

## Inspiration

Les fonctionnalités ont été choisies en regardant Duolingo (carte à révéler, XP, série), Anki (répétition espacée, notation binaire), Bunpro (contexte et révisions), WaniKani (furigana et niveaux), Renshuu (modes de quiz), Satori Reader (phrases contextualisées) et Takoboto (fiches de mots). Kotoba n'est affilié à aucun de ces services.
