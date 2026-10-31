# Kotoba — mes mots japonais

Application web statique pour apprendre et réviser du vocabulaire japonais, sur PC et sur téléphone.

## Fonctionnalités

- Carte mot : kanji avec **furigana au-dessus**, romaji, traduction française, et **phrase de contexte à droite** (sous la carte sur mobile).
- Mode **Apprendre** par thème, mode **Réviser** avec répétition espacée (10 min, 1 j, 2 j, 4 j, 8 j, 16 j, 32 j).
- **Tout revoir** : enchaîne tous les mots déjà validés.
- Bibliothèque avec recherche, filtres, écoute (synthèse vocale japonaise du navigateur).
- **Import universel** : colle n'importe quelle liste (séparateurs `|`, tabulation, `;`, ` - `, ` = `, espaces multiples, ou japonais puis traduction sur la ligne suivante).
- **Import par capture d'écran** : OCR japonais + français via Tesseract.js (CDN, connexion requise au premier usage).
- Responsive, installable sur l'écran d'accueil.

## Lancer en local

Ouvrir `index.html` dans un navigateur. Aucun build, aucune dépendance à installer.

## Structure

- `index.html` — structure de l'interface
- `styles.css` — styles
- `data.js` — vocabulaire de départ (100 mots, 10 thèmes)
- `app.js` — logique : sessions, répétition espacée, import texte, OCR

## Format d'import

Une entrée par ligne :

```
日本語 | français
漢字 | kana | romaji | français
kanji | furigana | romaji | français | phrase | traduction
```

Le furigana s'écrit `食[た]べる`. Les lignes sans traduction sont ignorées. Les phrases complètes sont acceptées.

## Données

La progression et les mots importés sont stockés dans le `localStorage` du navigateur : pas de synchronisation entre appareils.

## Déploiement

GitHub Pages, branche `main`, dossier racine.
