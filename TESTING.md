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
2. **Carte** : clique sur le bouton principal. Le français apparaît seul. Clique sur « 🎙️ Prononcer » pour faire valider ta prononciation, ou sur « Révéler la réponse » pour passer directement. Après le micro, la fiche s'affiche automatiquement avec le score et l'écart. Tu dois voir, dans cet ordre : le japonais avec furigana, le romaji, puis la phrase de contexte et sa traduction.
3. **Validation** : clique sur « J'ai prononcé ». Le message « Bien joué ! » et la prochaine révision s'affichent. Clique sur « Continuer » : la carte suivante arrive.
4. **Import** : va dans « Importer », colle `bonjour | kon-ni-chi-wa`, clique sur « Analyser la liste ». L'aperçu doit montrer こんにちは, le romaji et le contexte `こんにちは、花さん！`. Clique sur « Importer 1 mot ».
5. **Mes mots** : clique sur le filtre « Importés ». La ligne `bonjour` / こんにちは est là. Clique dessus : la fiche affiche le français, le japonais, le romaji et le contexte. Tu peux modifier ou supprimer ce mot importé.
6. **Réviser** : l’onglet « Réviser » propose les cartes dues, la révision rapide, tout revoir et les nouveaux mots. Clique sur la carte « Cartes dues » ou sur le bouton « Commencer » : la session doit s’ouvrir. Les prévisions sur sept jours sont affichées. Un mot importé est dû immédiatement : il apparaît dans les cartes à réviser.
7. **Mobile** : ouvre les outils de développement du navigateur (F12), passe en largeur 390 px. La barre de navigation du bas doit apparaître, sans débordement horizontal.
8. **Réglages** : l'engrenage ouvre l'objectif quotidien, le furigana, le romaji, le thème, la vitesse audio, l'export / import de sauvegarde et l'effacement.
9. **Persistance** : recharge la page après une validation. Le XP et la série doivent rester. La progression est dans le `localStorage` de ce navigateur.

10. **Parcours** : sur l'accueil, « Mon parcours » montre Nouveaux, En révision, Validés (10 révisions) et Ultimes (30). Clique sur une carte pour ouvrir le filtre correspondant dans Mes mots ; la fiche d'un mot affiche sa barre de progression.
11. **Prononciation** : ouvre un mot depuis « Mes mots », clique sur « Prononcer », puis choisis « La phrase » si le mot a un contexte. Lance la reconnaissance : le niveau audio, le score, l’écart syllabique et un conseil s’affichent, et la fiche du mot garde les derniers scores. La capture s’arrête seule après un silence. Le bouton « IA locale » active Whisper (téléchargement du modèle au premier essai) ; après un essai, « Ma voix » permet de comparer ta prise avec le modèle.
12. **Grammaire** : l’onglet « Grammaire » ouvre les leçons. Vérifie que « L’ordre de la phrase » s’affiche, que l’explication de 行きます / iku est présente et que les exemples ont des furigana.

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
- le micro sur la carte de révision et la révélation automatique de la fiche ;
- le parcours par étapes et les filtres Validés / Ultimes ;
- la prononciation du mot et de la phrase entière, avec score, écart syllabique, réécoute et historique ;
- le panneau de progression et le lancement d’une session sur les mots à retravailler ;
- les furigana de l’onglet Grammaire et le vocabulaire quotidien.

Le test de prononciation simule la reconnaissance du navigateur pour rester rapide et déterministe. La capture micro réelle et le modèle Whisper ne sont pas lancés en CI : leur fonctionnement se vérifie une fois à la main, dans un navigateur avec micro.

Pour voir les tests dans une interface : `npx playwright test --ui`.

## 6. Dépannage

- **Page blanche** : ouvre la console (F12). Vérifie que tu es bien à la racine du projet et que `js/app.js` répond en 200. Ne lance pas le serveur depuis un sous-dossier.
- **Pas de son** : la synthèse vocale dépend des voix japonaises installées. Essaie Chrome ou Edge, vérifie le volume, puis teste le bouton « Tester » dans les réglages. L'application ne bloque pas si l'audio est absent.
- **OCR qui échoue** : vérifie la connexion Internet (Tesseract est chargé depuis un CDN au premier usage), utilise une image nette, et vérifie le texte avant d'importer.
- **Progression perdue** : elle est propre au navigateur et au profil. Une fenêtre privée ou un nettoyage des données du site l'efface. Exporte avant de changer d'appareil.
- **Port 8080 déjà utilisé** : utilise `python3 -m http.server 8081`, puis http://localhost:8081.
- **Playwright ne trouve pas Chromium** : relance `npx playwright install chromium`. Sur Linux, `npx playwright install --with-deps chromium` installe aussi les bibliothèques système.

## 7. CI et déploiement

À chaque push sur `main`, GitHub Actions exécute la syntaxe, le manifeste, les tests unitaires et les tests Playwright (`.github/workflows/check.yml`). GitHub Pages redéploie ensuite le site automatiquement. En cas d'échec Playwright, le rapport et les traces sont attachés au run.

Pour redéployer manuellement : pousse sur `main`, puis vérifie l'onglet **Actions** et l'onglet **Deployments** du dépôt.

## 8. Après une mise à jour

Le service worker privilégie le réseau et garde une copie hors ligne. Si une ancienne version s'affiche encore après un déploiement, recharge une fois avec Ctrl+F5 (Windows/Linux) ou Cmd+Shift+R (macOS), ou ferme puis rouvre l'onglet.

Pour vérifier que tu es sur la bonne version, ouvre les outils de développement → Application → Service Workers, puis clique sur « Mettre à jour ».
