# Nouveau décor : rue de Londres et appartement sur deux étages

## Intention

Remplacer le décor « maison de campagne avec jardin » et tout le catalogue de la boutique
par un univers londonien plus typique : une rue avec la façade de l'appartement de l'inspecteur,
un appartement en coupe sur deux étages (le 1er étage s'achète), et des tenues anglaises.

## Objectifs / non-objectifs

- Objectifs : nouveaux dessins SVG (inspecteur, coupe de l'appartement, rue), nouveau catalogue,
  1er étage achetable qui débloque ses propres objets, total boutique ≈ 2 130 écus (règle « tout acheter »).
- Non-objectifs : compatibilité des anciennes sauvegardes (les objets supprimés sont ignorés au chargement,
  sans remboursement — décision de l'utilisateur), changement des énigmes ou du moteur de progression.
- Anti-objectif : un étage acheté sans rien à y mettre, ou des objets du 1er étage achetables avant l'étage.

## Approches

- **A (retenue)** : tout refaire dans `js/shop.js` en gardant sa structure ; ajouts minimes dans `js/game.js`.
- B : séparer catalogue et dessins en plusieurs fichiers ; plus de changements (index.html, tests),
  et s'écarte du jeu jumeau Plume & Cie. Rejetée.

## Décisions

- Seul objet conservé : le haut-de-forme (`forme`, 70).
- Vue de l'appartement en **coupe** : rez-de-chaussée en bas, 1er étage au-dessus,
  noirci et barré de planches tant que l'étage n'est pas acheté.
- Objets du 1er étage : bouton « 🔒 Débloque d'abord le 1er étage » tant que `etage` n'est pas possédé
  (vérifié aussi dans `buy`).
- Rubrique « Jardin » renommée « Rue ». Nouveaux slots de décor : `home`, `floor`, `upstairs`, `street`, `vehicle`.

## Catalogue (proposition, total 2 130)

| Rubrique | Objets (prix) | Total |
|---|---|---|
| Chapeaux | Casquette plate 20, Casque de bobby 45, Bonnet à poil de garde royal 60, Haut-de-forme 70 | 195 |
| Vestes | Gilet en tartan 25, Manteau Chesterfield 55, Tunique rouge de garde royal 85 | 165 |
| Cou | Cravate club rayée 10, Écharpe écossaise à carreaux 25 | 35 |
| Visage | Pince-nez 15, Moustache en guidon 40 | 55 |
| Accessoires | Tasse de thé 20, Parapluie noir 45 | 65 |
| Rez-de-chaussée | Drapeau Union Jack sur pied 10, Tapis persan 15, Service à thé 20, Portrait royal 30, Fauteuil Chesterfield 40, Cheminée 55, Gramophone 65, Corgi 110 | 345 |
| Appartement | 1er étage 150 | 150 |
| 1er étage | Violon 35, Tableau d'enquête 40, Machine à écrire 45, Buste de Shakespeare 50, Lit à baldaquin 70 | 240 |
| Rue | Boîte aux lettres rouge 25, Jardinières aux fenêtres 25, Plaque bleue 30, Kiosque à journaux 60, Stand de fish & chips 90, Big Ben au loin 120 | 350 |
| Véhicules | Fiacre (hansom cab) 50, Taxi d'époque 120, Bus à impériale 160, Dirigeable 200 | 530 |

Façade toujours présente : maison mitoyenne en briques, porte noire avec numéro, trottoir, ciel gris de Londres.

## Laissé au constructeur

Détail des dessins SVG, identifiants des nouveaux objets (nouveaux, jamais réutilisés),
mise à jour du README, de `test/check.js` (budget, verrou de l'étage) et de `test/e2e.js`.
