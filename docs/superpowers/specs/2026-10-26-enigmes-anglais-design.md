# Baker Street & Co : The Missing Dictionary — design

## Objectif

Jeu web d'énigmes pour réviser l'anglais au collège (6e → 3e), couvrant les notions du programme
de langues vivantes de l'Éducation nationale (cycle 3 pour la 6e, cycle 4 pour la 5e à la 3e,
niveaux A1 → A2/B1 du CECRL), dans l'ordre croissant de difficulté.
Inspiré de `ZeBidule/enigmes-orthographe` (« Plume & Cie »), dont on reprend le moteur.

## Décisions

- Repo public `ZeBidule/enigmes-anglais`, nouvel historique (copie du code, pas un fork GitHub).
- Licence identique : GNU AGPL v3 ou ultérieure (LICENSE, en-têtes SPDX, lien « Code source » dans le jeu
  vers `https://github.com/ZeBidule/enigmes-anglais`).
- Publication GitHub Pages : `https://zebidule.github.io/enigmes-anglais/`.
- Interface, consignes, histoires et indices en **français** ; phrases des énigmes en **anglais**.
- Tout est repris et réadapté : chapitres, 3 types d'énigmes, écus, indices, boutique SVG,
  sauvegarde/chargement JSON, 10 bonus, menu de test, tests `check.js` et `e2e.js`.

## Univers

Londres. Le dictionnaire de Sir Wordsworth a disparu ; le joueur aide un détective de Baker Street.
9 chapitres (noms définitifs fixés à l'implémentation), du « 221B Baker Street » à « Big Ben at Midnight ».
Boutique britannique : vêtements du détective (deerstalker, cape, loupe…), maison (théière, cheminée…),
jardin/rue (cabine téléphonique rouge, boîte aux lettres…), véhicules (vélo, taxi noir, bus à impériale).
Mêmes règles d'équilibrage que l'original : tout est achetable à la fin de l'histoire avec 1 indice
toutes les 5 questions ; les bonus rapportent 190 écus fixes.

## Contenu

### Différence avec l'original

Les chapitres suivent la **progression scolaire** au lieu de mélanger toutes les notions au même niveau :
chaque énigme porte un champ `grade` (`"6e"`, `"5e"`, `"4e"`, `"3e"`), et le niveau `lvl` (1–5) et `grade`
sont **non décroissants** dans l'ordre de jeu. `grade` est déduit du chapitre (`GRADE_OF_CHAPTER`) ;
`lvl` vaut 1 aux chapitres 1-2, 2 aux chapitres 3-4, 3 aux chapitres 5-6, 4 aux chapitres 7-8 et 5 au chapitre 9.

Progression **vérifiée** contre les attendus de fin d'année Eduscol pour l'anglais (6e, 5e, 4e, 3e) :
une notion est placée dans l'année où elle est attendue en production ; une notion seulement vue en lecture,
ou visée au niveau le plus haut d'une année, est exercée l'année suivante. Le tableau détaillé des notions
par classe est dans le README (section « Notions du programme »), qui fait référence.

### Catégories (8 × 12 = 96, + 10 bonus niveau expert)

| Clé | Libellé |
|---|---|
| `grammar` | Phrase et pronoms (be/have, pronoms, possessifs, questions, tags, relatives) |
| `present` | Le présent (présent simple, be + -ing, there is/are) |
| `past` | Le passé (prétérit, be + -ing passé, used to, present perfect) |
| `future` | Futur, modaux et conditionnels |
| `nouns` | Noms, articles et quantifieurs |
| `adjectives` | Adjectifs, comparatifs, superlatifs, adverbes |
| `words` | Mots et orthographe (spelling, homophones their/there/they're, faux amis, nombres, prépositions) |
| `irregular` | Verbes irréguliers |

Chaque catégorie apparaît 1 ou 2 fois par chapitre ; les 3 types (`find`, `fill`, `type`) sont 32/32/32,
3 ou 4 de chaque par chapitre (mêmes règles que l'original, appliquées par `tools/arrange.js` qui
fixe les chapitres à la main via un champ `ch` : il vérifie les règles et ordonne chaque chapitre par `lvl`,
en alternant les types).
En 6e, `past` s'appuie sur was/were (fin de 6e, chapitre 2) et `future` sur can/impératif ; le chapitre 1
peut donc avoir 0 énigme `past` (seule exception tolérée par le test).

### Règles de rédaction

- Le titre, l'histoire et la consigne ne donnent pas la réponse (test `énoncé`, `LEAK_ALLOWED` limité à
  quelques énigmes d'introduction).
- Réponses à taper : définies par un indice en français (« le prétérit de *to go* ») ; plusieurs réponses
  acceptées si légitimes (`don't` / `do not`). La casse est ignorée ; les apostrophes typographiques ’
  sont normalisées en '.
- Anglais britannique (colour, centre), cohérent avec l'univers londonien ; l'orthographe américaine est
  acceptée en réponse tapée quand elle est correcte.
- Pas de barre d'accents (inutile en anglais) ; une touche apostrophe reste disponible sur mobile via le clavier natif.

## Code (repris de l'original)

| Fichier | Changement |
|---|---|
| `index.html` | Titre, couleurs (rouge/bleu marine/or), lien source, `lang="fr"` |
| `js/puzzles.js` | Nouveau contenu, `CATEGORIES`, `CHAPTER_NAMES`, champ `grade` |
| `tools/arrange.js` | Vérifie la répartition (chapitres fixés par `ch`) et ordonne chaque chapitre |
| `js/shop.js` | Objets et dessins SVG britanniques |
| `js/game.js` | Textes, normalisation des réponses anglaises, suppression barre d'accents, nom du fichier de sauvegarde `baker-street-sauvegarde-AAAA-MM-JJ.json` |
| `test/check.js`, `test/e2e.js` | Adaptés (nouvelles contraintes `grade`, nouveaux libellés) |
| `README.md` | Réécrit sur le modèle de l'original (principe, répartition par classe/catégorie/chapitre, licence, tests) |

## Critères de réussite

- `node test/check.js` et `test/e2e.js` passent.
- Le jeu est jouable sur https://zebidule.github.io/enigmes-anglais/ (téléphone et ordinateur).
- 96 + 10 énigmes, grammaticalement correctes, ordonnées 6e → 3e, toutes les notions du tableau couvertes.
