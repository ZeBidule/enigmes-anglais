/* SPDX-License-Identifier: AGPL-3.0-or-later
 * Baker Street & Co - Copyright (C) 2026 ZeBidule - GNU AGPL v3 or later, see LICENSE. */
/* Génère l'ordre de jeu (CHAPTER_PLAN) dans js/puzzles.js.
   Lancer : node tools/arrange.js
   Les chapitres sont fixés à la main dans chaque énigme (champ ch) pour suivre la
   progression du programme : chapitres 1-2 = 6e, 3-4 = 5e, 5-6 = 4e, 7-9 = 3e.
   Ce script vérifie les règles de répartition puis ordonne chaque chapitre :
   - 9 chapitres de 10 ou 11 énigmes ;
   - chaque catégorie a 1 ou 2 énigmes par chapitre (exception : « Le passé » peut
     être absent du chapitre 1, la notion n'arrivant qu'en fin de 6e) ;
   - chaque type a 3 ou 4 énigmes par chapitre ;
   - dans une catégorie, la difficulté ne baisse jamais d'un chapitre à l'autre ;
   - p01 (début de l'histoire) ouvre le jeu, p96 (dictionnaire retrouvé) le termine.
   Dans un chapitre : difficulté croissante, en alternant les types autant que possible. */
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "..", "js", "puzzles.js");
const { ALL_PUZZLES, CATEGORIES } = require(FILE);

const NCH = 9, CATS = Object.keys(CATEGORIES), TYPES = ["find", "fill", "type"];
const FIRST = "p01", LAST = "p96";

const errors = [];
for (let ch = 1; ch <= NCH; ch++) {
  const ps = ALL_PUZZLES.filter(p => p.ch === ch);
  if (ps.length < 10 || ps.length > 11) errors.push(`chapitre ${ch} : ${ps.length} énigmes`);
  CATS.forEach(c => {
    const k = ps.filter(p => p.cat === c).length, min = (c === "past" && ch === 1) ? 0 : 1;
    if (k < min || k > 2) errors.push(`chapitre ${ch} : ${k} × ${c}`);
  });
  TYPES.forEach(t => {
    const k = ps.filter(p => p.t === t).length;
    if (k < 3 || k > 4) errors.push(`chapitre ${ch} : ${k} × ${t}`);
  });
}
CATS.forEach(c => {
  const ps = ALL_PUZZLES.filter(p => p.cat === c).sort((a, b) => a.ch - b.ch);
  ps.forEach((p, i) => { if (i && ps[i - 1].ch < p.ch && p.lvl < ps[i - 1].lvl) errors.push(`${c} : ${ps[i - 1].id} → ${p.id} difficulté en baisse`); });
});
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }

const plan = [];
for (let ch = 1; ch <= NCH; ch++) {
  const sorted = ALL_PUZZLES.filter(p => p.ch === ch && p.id !== FIRST && p.id !== LAST)
    .sort((a, b) => a.lvl - b.lvl || a.id.localeCompare(b.id));
  const out = [];
  while (sorted.length) {
    const prev = out[out.length - 1];
    const i = sorted.findIndex(p => !prev || p.t !== prev.t);
    out.push(sorted.splice(i < 0 ? 0 : i, 1)[0]);
  }
  const ids = out.map(p => p.id);
  if (ch === 1) ids.unshift(FIRST);
  if (ch === NCH) ids.push(LAST);
  plan.push(ids);
}

const text = "const CHAPTER_PLAN = [\n" + plan.map(ids => "  [" + ids.map(i => `"${i}"`).join(",") + "]").join(",\n") + "\n];";
const src = fs.readFileSync(FILE, "utf8").replace(/const CHAPTER_PLAN = \[[\s\S]*?\];/, text);
fs.writeFileSync(FILE, src);
console.log(text);
