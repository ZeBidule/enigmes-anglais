# Rue de Londres et appartement sur deux étages — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer catalogue, tenues et décors par un univers londonien (rue + appartement en coupe, 1er étage achetable).

**Architecture:** Réécriture de `js/shop.js` (même structure : `ITEMS`, `SLOT_NAMES`, `DECOR_SLOTS`, fonctions de dessin) ; `drawGarden` devient `drawStreet` ; `js/game.js` ajoute le verrou du 1er étage.

**Tech Stack:** JS vanilla, SVG inline, Node (test/check.js), Playwright (test/e2e.js).

**Spec:** `docs/superpowers/specs/2026-11-02-londres-appartement-design.md`

## Global Constraints

- Total des prix = 2 130 ; seul identifiant conservé : `forme` (haut-de-forme, 70).
- `DECOR_SLOTS = ["home", "floor", "upstairs", "street", "vehicle"]` ; objet `etage` (slot `floor`, 150).
- Pas de compatibilité des anciennes sauvegardes.
- Pas de `undefined`/`NaN` dans les SVG ; chaque objet de décor change le dessin.

## Review Focus

- Objet `upstairs` acheté via `G.buy` sans `etage` → refusé (test check + e2e).
- Objet `upstairs` passé à `drawScene` sans `etage` → non dessiné (étage noirci).
- `importSave` : slots non portables = `DECOR_SLOTS` (ne plus coder la liste en dur).
- Mode test (`save.test`) : le verrou d'étage s'applique quand même.

---

### Task 1: Catalogue et dessins (`js/shop.js`)

**Files:** Modify `js/shop.js`, `test/check.js:184-201,205-216`

**Interfaces — Produces:** `ITEMS`, `SLOT_NAMES` (hat, coat, neck, face, hand, home:"Rez-de-chaussée", floor:"Appartement", upstairs:"1er étage", street:"Rue", vehicle:"Véhicules"), `DECOR_SLOTS`, `drawScene(owned, equipped)` (coupe 400×300 : 1er étage en haut, RDC en bas, inspecteur au RDC), `drawStreet(owned)` (400×220), `drawPortrait(equipped)`, `itemLocked(it, owned) -> bool` (vrai si `it.slot==="upstairs"` et `etage` non possédé).

- [ ] Adapter les tests de `test/check.js` : `drawStreet` au lieu de `drawGarden` ; ≥6 `street`, ≥5 `upstairs`, exactement 1 `floor` ; `DECOR_SLOTS` attendu ; chaque objet `home`/`upstairs` (avec `etage`) change `drawScene`, chaque `street`/`vehicle` change `drawStreet` ; `drawScene(["violon"])===drawScene([])` ; `itemLocked` ; total prix === 2130 ; sauvegarde d'exemple avec `forme`, `corgi`, `bus`.
- [ ] `node test/check.js` → échecs attendus.
- [ ] Réécrire `js/shop.js` selon le catalogue de la spec (ids : `flatcap`, `bobby`, `bearskin`, `forme`, `tartan`, `chesterfield`, `tunique`, `cravate`, `ecossaise`, `pincenez`, `moustache`, `the`, `parapluie`, `coussin`, `persan`, `service`, `portrait`, `fauteuil`, `cheminee`, `gramophone`, `corgi`, `etage`, `violon`, `enquete`, `machine`, `buste`, `lit`, `boite`, `jardinieres`, `plaque`, `kiosque`, `fishchips`, `bigben`, `fiacre`, `blackcab`, `bus`).
- [ ] `node test/check.js` → PASS. Commit.

### Task 2: Verrou dans le moteur (`js/game.js`)

**Files:** Modify `js/game.js` (`importSave`, `home`, `shop`, `buy`), `test/e2e.js`

- [ ] `importSave` utilise `DECOR_SLOTS` ; `home`/`shop` appellent `drawStreet` ; `shop` affiche `🔒 Débloque d'abord le 1er étage` pour un objet verrouillé ; `buy` refuse si `itemLocked`.
- [ ] Mettre à jour `test/e2e.js` (Nœud papillon → Cravate club rayée, Chat → Corgi, Montgolfière → Bus à impériale ; vérifier le bouton 🔒 puis l'achat après `etage`).
- [ ] Lancer check + e2e → PASS. Commit.

### Task 3: README

- [ ] Mettre à jour la section Principe (boutique, étage, rue) et la table Structure. Commit.
