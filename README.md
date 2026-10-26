# Baker Street & Co : The Missing Dictionary

Petit jeu d'énigmes pour réviser l'anglais au collège, de la 6e à la 3e.
Le précieux dictionnaire de Sir Wordsworth a disparu dans Londres : 96 mystères à résoudre dans l'ordre,
puis 10 mystères bonus. Ils suivent la progression du programme d'anglais de l'Éducation nationale,
du niveau A1 (6e) au niveau A2/B1 (3e), et deviennent de plus en plus difficiles.
Les consignes sont en français et les phrases à corriger en anglais.

**Jouer : https://zebidule.github.io/enigmes-anglais/** (sur téléphone ou ordinateur, sans rien installer).

Inspiré de [Plume & Cie](https://github.com/ZeBidule/enigmes-orthographe), le jeu d'énigmes d'orthographe française,
dont il reprend le moteur.

## Licence

Ce projet est un **logiciel libre sous licence [GNU AGPL v3 ou ultérieure](LICENSE)** (copyright © 2026 ZeBidule).
C'est une licence « à copyleft fort ». Toute personne qui reprend ce code (énigmes, dessins et moteur compris),
le modifie, puis le **distribue ou le met à disposition en ligne** doit publier l'intégralité de ses sources
sous la même licence et les proposer à tous les utilisateurs du service.
C'est pour cette raison qu'un lien « Code source » apparaît en bas du jeu : il doit rester dans toute version modifiée.

## Principe

- 9 chapitres de 10 ou 11 mystères. Chaque mystère se débloque quand le précédent est résolu.
- Les chapitres suivent l'année scolaire : chapitres 1-2 = **6e**, 3-4 = **5e**, 5-6 = **4e**, 7-9 = **3e**.
- 3 types d'énigmes : trouver les mots fautifs, compléter des trous, taper la réponse au clavier.
  La casse et l'apostrophe typographique (’) ne comptent pas, et les deux formes sont acceptées quand elles sont correctes
  (`doesn't` / `does not`).
- Chaque mystère rapporte des **écus** : de 15 à 35 selon sa difficulté, avec 20 % de moins par erreur.
  Les écus servent à acheter des indices. Dans la boutique, ils permettent aussi d'équiper l'inspecteur Bramble
  (deerstalker, trench-coat, loupe…), de décorer sa maison et sa rue (cabine téléphonique rouge, réverbère victorien…)
  et d'acheter des véhicules (vélo, taxi londonien ancien, montgolfière).
  Les prix permettent de **tout acheter** à la fin de l'histoire en prenant un indice toutes les 5 questions :
  gains maximum 2 285 + 5 écus de départ − 19 indices × 3 = 2 233 écus, pour une boutique complète à 2 130 écus.
- **⭐ 10 mystères bonus** (« Les archives de Scotland Yard », niveau expert) se débloquent une fois les 96 mystères
  de l'histoire résolus. Chacun rapporte **190 écus fixes**, sans pénalité d'erreur.
- La progression est enregistrée automatiquement dans le navigateur (localStorage).
- **💾 Sauvegarder** (écran maison) télécharge un fichier `baker-street-sauvegarde-AAAA-MM-JJ.json`.
  **📂 Charger** (écran titre ou écran maison) recharge ce fichier, par exemple sur un autre appareil.

## Notions du programme

La progression suit les attendus de fin d'année publiés par Eduscol pour l'anglais (cycle 3 pour la 6e, cycle 4 pour la 5e à la 3e).
Pour chaque classe, on retient les notions que les attendus exigent en production. Une notion seulement rencontrée
en lecture une année plus tôt, ou visée au niveau le plus élevé de l'année, est exercée l'année suivante.

| Classe | Chapitres | Notions |
|---|---|---|
| 6e (A1) | 1-2 | be, have got, pronoms et adjectifs possessifs, pluriels, a/an, présent simple (3e personne, do/does, négation), présent en be + -ing, there is/are, can, must/mustn't, questions en wh-, majuscules, heure, nombres, prépositions de temps (on/in/at), comparatif court, prétérit de be (was) et premiers irréguliers (went, saw, ran) |
| 5e (A1+/A2) | 3-4 | génitif 's, présent simple et be + -ing, prétérit régulier, prétérit en be + -ing, futur (will, be going to), should, some/any, much/many, indénombrables, superlatif, comparatifs longs et d'égalité, adverbes en -ly, pronoms compléments, did, there/their/they're, faux amis (library), irréguliers usuels |
| 4e (A2) | 5-6 | present perfect (for/since/ago, ever), pronoms possessifs, verbe + -ing après enjoy, modaux could/might/must, have to, condition réelle (if + présent, will), discours indirect, relatif who, few/little, adjectifs en -ed/-ing, faux amis (actually, sensitive), orthographe courante, participes passés |
| 3e (A2/B1) | 7-9 | voix passive, past perfect, prétérit ou present perfect, used to, condition imaginaire (if + prétérit, would), if I were you, relatifs where/whose/which, question tags, déduction (must/can't/might), faire faire (have something done), discours indirect avancé, article zéro, both/every, so/such, verbes à particule, faux amis (attend, eventually) |

Les **bonus** vont un peu au-delà du programme : wish, unless, neither/everybody + singulier, do/make,
hard/hardly, be used to, if + past perfect.

## Répartition des énigmes

Ces chiffres concernent les 96 mystères de l'histoire.

| | Trouver les fautes | Compléter les trous | Réponse à taper | Total |
|---|---|---|---|---|
| Énigmes | 32 (33 %) | 32 (33 %) | 32 (33 %) | 96 |

### Par chapitre

Chaque chapitre contient 1 ou 2 énigmes de chacune des 8 catégories (12 énigmes par catégorie)
et 3 ou 4 énigmes de chacun des 3 types. Seule exception : « Le passé » ne commence qu'au chapitre 2,
le prétérit n'arrivant qu'en fin de 6e.

| Chapitre | Classe | Trouver les fautes | Compléter les trous | Réponse à taper | Phrase et pronoms | Le présent | Le passé | Futur, modaux et conditionnel | Noms, articles et quantifieurs | Adjectifs, comparatifs et adverbes | Mots, orthographe et faux amis | Verbes irréguliers | Difficulté |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Chapitre 1 — Le 221B Baker Street (10) | 6e | 4 | 3 | 3 | 2 | 2 | 0 | 1 | 2 | 1 | 1 | 1 | 1 / 5 |
| Chapitre 2 — Le marché de Camden (11) | 6e | 4 | 4 | 3 | 1 | 2 | 1 | 1 | 1 | 2 | 2 | 1 | 1 / 5 |
| Chapitre 3 — Le British Museum (11) | 5e | 3 | 4 | 4 | 1 | 1 | 2 | 1 | 2 | 1 | 1 | 2 | 2 / 5 |
| Chapitre 4 — Le métro de Londres (11) | 5e | 4 | 3 | 4 | 2 | 1 | 1 | 2 | 1 | 2 | 1 | 1 | 2 / 5 |
| Chapitre 5 — La Tour de Londres (11) | 4e | 4 | 4 | 3 | 1 | 1 | 2 | 1 | 2 | 1 | 2 | 1 | 3 / 5 |
| Chapitre 6 — Les quais de la Tamise (11) | 4e | 3 | 4 | 4 | 2 | 2 | 1 | 2 | 1 | 1 | 1 | 1 | 3 / 5 |
| Chapitre 7 — Le théâtre du Globe (11) | 3e | 4 | 3 | 4 | 1 | 1 | 2 | 1 | 1 | 2 | 2 | 1 | 4 / 5 |
| Chapitre 8 — Le brouillard de Whitechapel (10) | 3e | 3 | 4 | 3 | 1 | 1 | 2 | 1 | 1 | 1 | 1 | 2 | 4 / 5 |
| Chapitre 9 — Minuit à Big Ben (10) | 3e | 3 | 3 | 4 | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 2 | 5 / 5 |
| **Total** | | **32** | **32** | **32** | **12** | **12** | **12** | **12** | **12** | **12** | **12** | **12** | |

Certaines énigmes mélangent plusieurs notions ; elles sont classées selon la notion principale.

## Structure

| Fichier | Rôle |
|---|---|
| `LICENSE` | Texte intégral de la GNU AGPL v3 |
| `index.html` | Page et styles |
| `js/puzzles.js` | Les 96 énigmes de l'histoire (avec leur chapitre `ch`), les 10 bonus (format décrit en tête de fichier), la classe de chaque chapitre (`GRADE_OF_CHAPTER`) et l'ordre de jeu `CHAPTER_PLAN` |
| `tools/arrange.js` | Vérifie les règles de répartition et génère `CHAPTER_PLAN` (difficulté croissante, types alternés) |
| `js/shop.js` | Objets de la boutique et dessins SVG de l'inspecteur, de sa maison et de sa rue |
| `js/game.js` | Moteur : progression, écus, indices, boutique, sauvegarde |
| `test/check.js` | Vérification des énigmes, de la progression, du moteur et du format de sauvegarde |
| `test/e2e.js` | Test navigateur : écran titre, partie, saisie clavier, boutique, sauvegarde/chargement, bonus |
| `docs/superpowers/specs/` | Document de conception |

## Ajouter des énigmes

1. Ajouter l'énigme dans `ALL_PUZZLES` avec un nouvel `id` et le chapitre `ch` de la classe visée.
   Pour un bonus, l'ajouter dans `BONUS_PUZZLES`. Ne jamais renuméroter : les sauvegardes utilisent les `id`.
2. Lancer `node tools/arrange.js`. Le script refuse une répartition invalide et recalcule l'ordre de chaque chapitre.
3. Lancer les tests.

Règle de rédaction : le titre, l'histoire, la consigne et la phrase d'une énigme ne doivent pas donner la réponse
(le test `énoncé` le vérifie). Pour une réponse à taper, il faut la décrire en français (« le prétérit de *steal*, 5 lettres »),
sans la citer.

## Tests

```bash
node test/check.js

# test navigateur (Playwright + Chromium)
npx -y playwright install chromium
PLAYWRIGHT=$(dirname $(find ~/.npm/_npx -path '*node_modules/playwright/package.json' | head -1)) node test/e2e.js
```

## Jouer en local

Ouvrir `index.html` dans un navigateur, ou lancer `python3 -m http.server` puis aller sur http://localhost:8000.
