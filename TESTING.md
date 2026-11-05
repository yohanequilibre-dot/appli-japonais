# Tester Kotoba sur ton PC

## 1. Le plus simple : le site en ligne

Ouvre https://yohanequilibre-dot.github.io/appli-japonais/ dans Chrome, Edge, Firefox ou Safari. C'est la version déployée depuis la branche `main` du dépôt.

## 2. En local, sur ta machine

### Prérequis

- Un navigateur récent.
- Python 3 (déjà présent sur macOS et Linux ; sur Windows, `py` est généralement disponible).
- Node.js 18 ou plus seulement pour lancer les tests automatisés.

### Lancer le serveur

Dans le dossier du projet :

```bash
python3 -m http.server 8080
```

Sur Windows :

```powershell
py -m http.server 8080
```

Puis ouvre http://localhost:8080 dans le navigateur.

### Pourquoi ne pas double-cliquer sur index.html ?

Le site fonctionne mieux derrière un vrai serveur HTTP : le service worker, le chargement des modules et l'OCR utilisent des mécanismes que `file://` bloque ou complique. Le serveur local évite ces faux bugs.

### Tester depuis le téléphone

1. Garde le serveur lancé sur le PC.
2. Trouve l'adresse IP locale du PC (par exemple `192.168.1.42`).
3. Relance le serveur en écoutant sur toutes les interfaces :

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

4. Sur le téléphone, connecté au même Wi-Fi, ouvre `http://192.168.1.42:8080`.
5. Si ça ne répond pas, autorise Python dans le pare-feu du PC.

## 3. Le parcours à vérifier en cinq minutes

1. **Accueil** : la carte « Prêt à apprendre ? » et le bouton « Apprendre de nouveaux mots » s'affichent. Le compteur de cartes dues et l'objectif XP sont visibles.
2. **Carte** : clique sur le bouton principal. Le français apparaît seul. Clique sur « 🎙️ Prononcer » pour faire valider ta prononciation, ou sur « Révéler la réponse » pour passer directement. Après le micro, la fiche s'affiche automatiquement avec le score et l'écart : lueur verte si c'est réussi, rouge sinon, et détail centré sous la carte. Le mot puis la phrase de contexte sont lus automatiquement, sans clic. Un verdict explicite dit « C’est correct » ou « Ce n’est pas correct ». Tu dois voir le japonais avec une lecture latine au-dessus de chaque unité (par exemple `o` au-dessus de `お`, `nega` au-dessus de `願`, puis `i`, `shi`, `ma`, `su`), sans ligne de kana dupliquée ; la phrase de contexte est annotée de la même façon. Le romaji complet est affiché sous le mot ; pour `お願いします`, `ください` (kudasai) est aussi accepté et signalé comme variante. `お願いします` est plus doux et général ; `ください` est plus direct, mais les deux sont polis. Survole une phrase de contexte (ou place le focus dessus au clavier) : une infobulle affiche sa traduction complète et un aperçu « Mot à mot ». Ouvre aussi le bloc « Mot à mot » sous la phrase pour voir chaque mot et particule avec sa traduction. Les phrases japonaises ont plus d’espace entre les caractères.
   Vérifie aussi un verbe : dans « Mes mots », cherche `働きます`, ouvre sa fiche. La section « Conjugaison polie » doit afficher `働きます`, `働きません`, `働きました`, `働きませんでした` et la question, avec la forme du dictionnaire `働く` seulement en note. La phrase `会社で働いています。` doit montrer la lecture `はたら` au-dessus de `働` et `います`, et la section « Autres exemples » doit proposer plusieurs phrases. Si la fiche ne s’ouvre pas, vérifie que le mot est bien dans le pack de 1 000 mots et que le service worker a été rechargé.
3. **Validation** : clique sur « Passer au suivant ». La carte suivante arrive immédiatement, sans écran intermédiaire.
4. **Import** : va dans « Importer », colle `bonjour | kon-ni-chi-wa`, clique sur « Analyser la liste ». L'aperçu doit montrer こんにちは, le romaji et le contexte `こんにちは、花さん！`. Clique sur « Importer 1 mot ».
5. **Mes mots** : clique sur le filtre « Importés ». Le filtre « Mal prononcés » garde les mots dont le dernier essai micro était rouge. La ligne `bonjour` / こんにちは est là. Clique dessus : la fiche affiche le français, le japonais, le romaji et le contexte. Tu peux modifier ou supprimer ce mot importé.
   Vérifie aussi l’**entraînement actif** dans « Réviser » : « Compréhension » affiche le japonais et demande le sens français ; « Production » demande d’écrire le mot en japonais. Dans Production, `konnichiwa` et `こんにちは` doivent être acceptés pour le mot `こんにちは` ; les espaces, la ponctuation et les accents romaji sont ignorés. Une mauvaise réponse est remise dans la session après la correction.
6. **Réviser** : l’onglet « Réviser » propose les cartes dues, la révision rapide, tout revoir et les nouveaux mots. Clique sur la carte « Cartes dues » ou sur le bouton « Commencer » : la session doit s’ouvrir. Les prévisions sur sept jours sont affichées. Un mot importé est dû immédiatement : il apparaît dans les cartes à réviser.
7. **Mobile** : ouvre les outils de développement du navigateur (F12), passe en largeur 390 px. La barre de navigation du bas doit apparaître, sans débordement horizontal.
8. **Réglages** : l'engrenage ouvre l'objectif quotidien, le furigana, le romaji, le thème, la vitesse audio, l'export / import de sauvegarde et l'effacement.
9. **Persistance** : recharge la page après une validation. Le XP et la série doivent rester. La progression est dans le `localStorage` de ce navigateur.

10. **Parcours** : sur l'accueil, « Mon parcours » montre Nouveaux, En révision, Validés (10 révisions) et Ultimes (30). Clique sur une carte pour ouvrir le filtre correspondant dans Mes mots ; la fiche d'un mot affiche sa barre de progression.
11. **Prononciation** : ouvre un mot depuis « Mes mots », clique sur « Prononcer », puis sur le bouton d’écoute du micro. Commence par le mot : une fois le score validé, le bouton « Valider le mot et prononcer la phrase » ouvre l’étape 2 avec la phrase complète. Tu peux aussi choisir « La phrase » directement. Le niveau audio, le score, l’écart syllabique, les alertes de rythme (petit っ et voyelles longues) et un conseil s’affichent, et la fiche du mot garde les derniers scores. La capture s’arrête seule après un silence. Le bouton « IA locale » active Whisper (téléchargement du modèle au premier essai) ; après un essai, « Ma voix » permet de comparer ta prise avec le modèle.

11 bis. **Atelier de phrases et session du jour** : clique sur « Atelier complet » ou sur un mode (trou, ordre, dictée). Vérifie qu’un exercice s’affiche, que « Voir la réponse » révèle la phrase complète, puis que « Continuer » enchaîne. Reviens à l’accueil et clique sur « Commencer » dans « Ta session du jour » : le parcours doit mélanger mots, phrases et prononciation.
11 ter. **Parler** : ouvre l’onglet « Parler » (ou « Toutes les situations » depuis l’accueil). Choisis « Rencontrer quelqu’un ». La réplique de Hana, sa lecture et sa traduction s’affichent ; réponds `私はレアです。` puis clique sur « Vérifier ». La correction doit être verte et proposer le modèle audio, l’astuce et les variantes. Clique sur « Suivant », réponds `furansu kara kimashita`, puis réponds `六ヶ月勉強しています。` au troisième échange. Le bilan doit afficher les trois réponses et permettre de rejouer. Teste aussi « 🎧 Écoute » : le texte japonais doit disparaître et l’audio doit démarrer, puis « Afficher le texte » doit le révéler. Depuis la liste, « 🎲 Situation surprise » doit ouvrir une situation au hasard. Vérifie aussi une situation de voyage (train, hôtel, pharmacie ou taxi), puis les parcours « Au konbini », « Parler de ses goûts » et « Demander de l’aide ». Avec un navigateur compatible et le micro autorisé, clique sur « 🎙️ Répondre à l’oral » : la transcription doit remplir le champ avant que tu cliques sur « Vérifier », puis un score de prononciation doit s’afficher dans la correction. Vérifie aussi une mauvaise prononciation depuis une carte de rappel : l’avertissement « Prononciation à retravailler » et le bouton « Réessayer à l’oral » apparaissent, avec la possibilité de passer quand même. Vérifie aussi une mauvaise réponse : le modèle s’affiche et « Réessayer » remet le champ. Clique sur « 💡 Indice » : l’astuce et le premier mot en romaji apparaissent, et le texte déjà saisi reste dans le champ. Fais volontairement une erreur sur la première réplique, réponds juste aux deux suivantes, puis clique sur « Voir le bilan » : la ligne ratée doit être marquée « À revoir » et le bouton « Rejouer la réplique ratée » doit relancer uniquement cette réplique. Ferme ensuite la conversation : « Tes phrases à revoir » doit apparaître dans l’onglet Parler. Recharge la page, vérifie que la phrase est toujours là, clique sur « Réviser », réussis-la, puis reviens à la liste : le panneau doit disparaître.
12. **Grammaire** : l’onglet « Grammaire » ouvre les leçons. Vérifie que « L’ordre de la phrase » s’affiche, que l’explication de 行きます / iku est présente et que les exemples ont des furigana.
13. **Pack de 1 000 mots et escalade** : l’accueil doit afficher « 1 000 courants + 60 escalade ». Ouvre « Escalade · matériel », puis un mot comme ロープ : sa fiche affiche le mot, sa lecture, son romaji et une phrase de contexte. Vérifie que « Mot à mot » découpe ロープ / を / しっかり / 結びます avec leurs traductions.

## 4. Le test exact de ta demande

Importe cette ligne :

```text
bonjour | kon-ni-chi-wa
```

Résultat attendu dans l'aperçu puis dans la fiche du mot :

| Champ | Valeur |
| --- | --- |
| Français | bonjour |
| Japonais | こんにちは |
| Romaji | kon-ni-chi-wa |
| Contexte | こんにちは、花さん！ |
| Traduction | Bonjour, Hana ! |

Pour voir la carte dans l'ordre demandé, ouvre la fiche depuis « Mes mots » → « Importés », ou lance une session de révision. La carte de session montre le français d'abord ; la révélation ajoute le japonais, le romaji et le contexte. Comme le mot importé est marqué dû immédiatement, il apparaît aussi dans « Réviser » → « Cartes dues ».

## 5. Tests automatisés

### Tests unitaires (parseur, SRS, lexique)

```bash
npm install
npm test
```

Attendu : la liste des tests avec `✓`, puis `Tous les tests unitaires passent.`

### Vérification manuelle du compte et de la synchronisation

1. Dans l'en-tête, clique sur 👤 puis sur « Créer un compte ». Utilise un e-mail de test et un mot de passe de 8 caractères minimum.
2. Vérifie que le panneau d'accueil affiche l'e-mail, le statut « Compte connecté » et une date de synchronisation.
3. Ouvre une fenêtre de navigation privée (ou un autre navigateur) sur `http://localhost:8080`, clique sur 👤 et connecte-toi avec le même compte. La progression doit être récupérée.
4. Ajoute une révision sur un appareil, termine la session ou clique sur « Synchroniser », puis recharge l'autre appareil : la progression doit être fusionnée.
5. Teste « Se déconnecter » puis « Supprimer mon compte ». La progression locale doit rester disponible après la déconnexion.

L'API est déployée séparément sur Freebuff Sites ; `sync/deploy.json` ne fait pas partie du déploiement GitHub Pages. Les appels serveur doivent accepter `https://yohanequilibre-dot.github.io` et les origines locales autorisées, et refuser une origine étrangère.

### Tests de bout en bout (vrai navigateur)

```bash
npx playwright install chromium
npm run test:e2e
```

Le test démarre automatiquement un petit serveur Node sur le port 4173, ouvre Chromium et vérifie :

- l'accueil et l'ordre français → japonais → contexte ;
- la validation et la persistance du XP après rechargement ;
- l'import exact `bonjour | kon-ni-chi-wa` et l'affichage du contexte ;
- les réglages (objectif et thème sombre) après rechargement ;
- l'absence de débordement horizontal sur un écran mobile de 390 px.
- l’ouverture de l’onglet Réviser et le compteur de prononciations ;
- le micro sur la carte de révision, la lueur verte/rouge et la révélation automatique de la fiche ;
- les lectures latines au-dessus de chaque unité du mot et du contexte, sans ligne kana dupliquée ;
- la lecture au-dessus des mots d’un contexte sans kanji ;
- la lecture automatique du mot puis de la phrase après le micro et après la révélation ;
- le démarrage du micro uniquement au clic ;
- l'enregistrement d'un mot mal prononcé dans le filtre « Mal prononcés » ;
- le registre seul sur la carte, puis les variantes dans la fiche ;
- le verdict explicite correct / incorrect et l’alternative `ください` acceptée pour « s’il vous plaît » ;
- le parcours par étapes et les filtres Validés / Ultimes ;
- la prononciation du mot puis de la phrase entière, avec score, écart syllabique, réécoute et historique ;
- les exercices de phrases et le parcours guidé de la session du jour ;
- les conversations : trois échanges, réponse en japonais puis en romaji, mode écoute, réponse orale simulée, correction et bilan ;
- le panneau de progression et le lancement d’une session sur les mots à retravailler ;
- les furigana de l’onglet Grammaire et le vocabulaire quotidien ;
- les 1 000 mots courants, les 60 mots d’escalade et la décomposition mot à mot ;
- l’infobulle avec traduction complète et aperçu mot à mot ;
- la synchronisation entre deux navigateurs : un mot importé sur l’un est retrouvé sur l’autre, et la révision faite sur le second revient sur le premier.

Le test de synchronisation utilise une API simulée en mémoire pour rester rapide et reproductible en CI. Le parcours réel contre l’API déployée reste à vérifier une fois avec deux vrais appareils, comme décrit dans la section « Vérification manuelle du compte et de la synchronisation ».

Le test de prononciation simule la reconnaissance du navigateur pour rester rapide et déterministe. La capture micro réelle et le modèle Whisper ne sont pas lancés en CI : leur fonctionnement se vérifie une fois à la main, dans un navigateur avec micro.

Pour voir les tests dans une interface : `npx playwright test --ui`.

## 6. Dépannage

- **Page blanche** : ouvre la console (F12). Vérifie que tu es bien à la racine du projet et que `js/app.js` répond en 200. Ne lance pas le serveur depuis un sous-dossier.
- **Pas de son** : la synthèse vocale dépend des voix japonaises installées. Essaie Chrome ou Edge, vérifie le volume, puis teste le bouton « Tester » dans les réglages. L'application ne bloque pas si l'audio est absent.
- **OCR qui échoue** : vérifie la connexion Internet (Tesseract est chargé depuis un CDN au premier usage), utilise une image nette, et vérifie le texte avant d'importer.
- **Progression perdue** : elle est propre au navigateur et au profil. Une fenêtre privée ou un nettoyage des données du site l'efface. Crée un compte pour la retrouver sur un autre appareil, ou exporte-la avant de changer d'appareil.
- **Port 8080 déjà utilisé** : utilise `python3 -m http.server 8081`, puis http://localhost:8081.
- **Playwright ne trouve pas Chromium** : relance `npx playwright install chromium`. Sur Linux, `npx playwright install --with-deps chromium` installe aussi les bibliothèques système.

## 7. CI et déploiement

À chaque push sur `main`, GitHub Actions exécute la syntaxe, le manifeste, les tests unitaires et les tests Playwright (`.github/workflows/check.yml`). GitHub Pages redéploie ensuite le site automatiquement. En cas d'échec Playwright, le rapport et les traces sont attachés au run.

Pour redéployer manuellement : pousse sur `main`, puis vérifie l'onglet **Actions** et l'onglet **Deployments** du dépôt.

## 8. Après une mise à jour

Le service worker privilégie le réseau et garde une copie hors ligne. Si une ancienne version s'affiche encore après un déploiement, recharge une fois avec Ctrl+F5 (Windows/Linux) ou Cmd+Shift+R (macOS), ou ferme puis rouvre l'onglet.

Pour vérifier que tu es sur la bonne version, ouvre les outils de développement → Application → Service Workers, puis clique sur « Mettre à jour ».
