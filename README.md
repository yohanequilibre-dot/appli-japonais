# Kotoba — mes mots japonais

Kotoba est une application web gratuite pour apprendre et réviser le vocabulaire japonais, pensée pour le PC et le téléphone. Elle mélange la carte à révéler de Duolingo, la répétition espacée d'Anki, les furigana de WaniKani et les phrases de contexte de Bunpro.

**Tester en ligne :** https://yohanequilibre-dot.github.io/appli-japonais/

**Tester sur ton PC :** voir [TESTING.md](TESTING.md).

## Le principe

Une carte montre d'abord le mot **français**. Tu le prononces à voix haute, puis tu révèles :

1. le japonais en kanji / kana, avec le **furigana** au-dessus ;
2. le **romaji** ;
3. une **phrase de contexte** japonaise avec sa traduction, à droite sur grand écran et sous la carte sur mobile.

Tu valides ensuite avec « Je ne savais pas » ou « J'ai prononcé ». La répétition espacée décide du prochain rendez-vous.

Exemple importé avec `bonjour | kon-ni-chi-wa` :

- français : bonjour
- japonais : こんにちは
- romaji : kon-ni-chi-wa
- contexte : こんにちは、花さん！ / Bonjour, Hana !

## Fonctionnalités

- **aller** : la carte de base utilise 行きます (ikimasu, forme polie). La forme neutre 行く (iku) est aussi disponible, et la différence est expliquée dans l’onglet Grammaire.
- **Plus de 200 mots de départ** répartis en 20 thèmes (salutations, nourriture, maison, transports, santé, travail, météo, émotions, etc.).
- **Révision espacée** par paliers : 10 min, 1 j, 2 j, 4 j, 8 j, 16 j, 32 j, 64 j, 128 j, 256 j.
- **Trois modes de session** : rappel (révéler puis valider), QCM, écoute.
- **Carte dans le bon ordre** : français → japonais avec furigana → romaji → contexte.
- **Audio japonais** via la synthèse vocale du navigateur, avec vitesse réglable et bouton lent.
- **Série, XP, objectif quotidien** et prévisions des sept prochains jours.
- **Mes mots** : recherche en français / japonais / romaji, filtres (à réviser, nouveaux, révisés, en cours, connus, importés), fiche détaillée, modification et suppression des mots importés.
- **Suivi des révisions** : nombre de prononciations, de révisions et de réussites par mot ; filtre « Révisés ».
- **Onglet Grammaire** : ordre de la phrase, particules, formes ます / neutres, passé, négation, questions, compteurs et constructions quotidiennes.
- **Import libre** : texte collé, fichier `.txt` / `.csv` / `.tsv` / `.json`, ou capture d'écran avec OCR japonais + français.
- **Sauvegarde** : export / import JSON de toute la progression.
- **PWA** : installation sur l'écran d'accueil et consultation hors ligne après le premier chargement.
- **Thème clair / sombre / système**, furigana et romaji activables.

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

## Tests

```bash
npm install
npm test                 # parseur, SRS et lexique (Node)
npx playwright install chromium
npm run test:e2e         # parcours réel dans Chromium
```

La CI GitHub Actions vérifie la syntaxe, le manifeste, les tests unitaires et les tests Playwright à chaque push sur `main`.

## Structure

```text
index.html             coquille de l'application
styles.css             design responsive clair / sombre
data.js + js/vocab-extra.js plus de 200 mots de départ, 20 thèmes
js/lexicon.js          lexique de secours français / romaji → japonais
js/srs.js              état local, paliers SRS, statistiques
js/parser.js           analyse des imports et annotations furigana
js/app.js              interface, sessions, import, réglages
manifest.webmanifest   installation PWA
sw.js                  cache hors ligne
icon.svg               icône
playwright.config.js   configuration des tests navigateur
tests/                 tests unitaires, E2E et serveur de test
```

## Limites assumées

- La progression est stockée dans le navigateur (`localStorage`), pas sur un compte : elle ne se synchronise pas toute seule entre deux appareils. Utilise l'export / import JSON dans les réglages.
- La voix japonaise dépend des voix installées sur l'ordinateur ou le téléphone. L'application reste utilisable sans audio.
- L'OCR télécharge Tesseract.js et les modèles japonais / français au premier usage : une connexion est nécessaire la première fois. Une image nette et contrastée améliore beaucoup le résultat.
- Les lectures et les phrases de contexte sont un point de départ : l'import permet d'ajouter ton propre vocabulaire, avec tes propres phrases.

## Inspiration

Les fonctionnalités ont été choisies en regardant Duolingo (carte à révéler, XP, série), Anki (répétition espacée, notation binaire), Bunpro (contexte et révisions), WaniKani (furigana et niveaux), Renshuu (modes de quiz), Satori Reader (phrases contextualisées) et Takoboto (fiches de mots). Kotoba n'est affilié à aucun de ces services.
