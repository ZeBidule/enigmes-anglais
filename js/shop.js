/* SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Baker Street & Co : The Missing Dictionary
 * Copyright (C) 2026 ZeBidule
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Code source / source code : https://github.com/ZeBidule/enigmes-anglais
 */
/* =====================================================================
   Boutique et dessin (SVG) de l'inspecteur Bramble, de son appartement de Baker Street et de sa rue.
   (Les identifiants d'objets sont stables : les sauvegardes s'en servent.)
   slot : emplacement sur l'inspecteur (un seul objet porté par slot).
   slots de décor (DECOR_SLOTS) : toujours affichés une fois achetés,
   dans l'appartement (home = rez-de-chaussée, floor = achat du 1er étage, upstairs = objets du 1er étage)
   ou dans la rue (street, vehicle). Les objets du 1er étage ne s'achètent qu'après l'étage.
   ===================================================================== */
const ITEMS = [
  // Chapeaux
  { id:"flatcap",   slot:"hat",  name:"Casquette plate (flat cap)",        price:20 },
  { id:"bobby",     slot:"hat",  name:"Casque de bobby",                   price:45 },
  { id:"bearskin",  slot:"hat",  name:"Bonnet à poil de garde royal",      price:60 },
  { id:"forme",     slot:"hat",  name:"Haut-de-forme",                     price:70 },
  // Vestes
  { id:"tartan",    slot:"coat", name:"Gilet en tartan",                   price:25 },
  { id:"chesterfield", slot:"coat", name:"Manteau Chesterfield",           price:55 },
  { id:"tunique",   slot:"coat", name:"Tunique rouge de garde royal",      price:85 },
  // Cou
  { id:"cravate",   slot:"neck", name:"Cravate club rayée",                price:10 },
  { id:"ecossaise", slot:"neck", name:"Écharpe écossaise à carreaux",      price:25 },
  // Visage
  { id:"pincenez",  slot:"face", name:"Pince-nez",                         price:15 },
  { id:"moustache", slot:"face", name:"Moustache en guidon",               price:40 },
  // Main
  { id:"the",       slot:"hand", name:"Tasse de thé",                      price:20 },
  { id:"parapluie", slot:"hand", name:"Parapluie noir",                    price:45 },
  // Rez-de-chaussée
  { id:"drapeau",   slot:"home", name:"Drapeau Union Jack sur pied",       price:10 },
  { id:"persan",    slot:"home", name:"Tapis persan",                      price:15 },
  { id:"service",   slot:"home", name:"Bouilloire et service à thé",        price:20 },
  { id:"portrait",  slot:"home", name:"Portrait royal",                    price:30 },
  { id:"fauteuil",  slot:"home", name:"Fauteuil Chesterfield",             price:40 },
  { id:"cheminee",  slot:"home", name:"Cheminée",                          price:55 },
  { id:"gramophone", slot:"home", name:"Gramophone",                       price:65 },
  { id:"corgi",     slot:"home", name:"Corgi de compagnie",                price:110 },
  // Appartement
  { id:"etage",     slot:"floor", name:"1er étage de l'appartement",       price:150 },
  // 1er étage
  { id:"violon",    slot:"upstairs", name:"Violon",                        price:35 },
  { id:"enquete",   slot:"upstairs", name:"Tableau d'enquête",             price:40 },
  { id:"machine",   slot:"upstairs", name:"Bureau et machine à écrire",    price:45 },
  { id:"buste",     slot:"upstairs", name:"Buste de Shakespeare",          price:50 },
  { id:"lit",       slot:"upstairs", name:"Lit à baldaquin",               price:70 },
  // Rue
  { id:"boite",     slot:"street", name:"Boîte aux lettres rouge",         price:25 },
  { id:"cabine",    slot:"street", name:"Cabine téléphonique rouge",       price:60 },
  { id:"jardinieres", slot:"street", name:"Jardinières aux fenêtres",      price:25 },
  { id:"plaque",    slot:"street", name:"Plaque bleue commémorative",      price:30 },
  { id:"kiosque",   slot:"street", name:"Kiosque à journaux",              price:60 },
  { id:"fishchips", slot:"street", name:"Stand de fish & chips",           price:60 },
  { id:"bigben",    slot:"street", name:"Vue sur Big Ben",                 price:90 },
  // Véhicules
  { id:"fiacre",    slot:"vehicle", name:"Fiacre (hansom cab)",            price:50 },
  { id:"taxi",      slot:"vehicle", name:"Taxi londonien d'époque",        price:120 },
  { id:"bus",       slot:"vehicle", name:"Bus rouge à impériale",          price:160 },
  { id:"dirigeable", slot:"vehicle", name:"Dirigeable",                    price:200 }
];
const DECOR_SLOTS = ["home", "floor", "upstairs", "street", "vehicle"];
const SLOT_NAMES = { hat:"Chapeaux", coat:"Vestes", neck:"Cou", face:"Visage", hand:"Accessoires",
  home:"Rez-de-chaussée", floor:"Appartement", upstairs:"1er étage", street:"Rue", vehicle:"Véhicules" };

/* Un objet du 1er étage ne s'achète qu'une fois l'étage acheté. */
function itemLocked(it, owned){
  return it.slot === "upstairs" && !owned.includes("etage");
}

const SKIN = "#f1c27d";
const COAT_COLORS = { none:"#7a6a5a", tartan:"#2e5a3a", chesterfield:"#3a3d44", tunique:"#c8102e" };

/* ---------- Rez-de-chaussée (y 150-300) ---------- */
function drawGround(owned){
  const h = id => owned.includes(id);
  let s = `<rect y="150" width="400" height="112" fill="#d9c8a0"/><rect y="150" width="400" height="112" fill="url(#wall)"/>
    <rect y="150" width="400" height="6" fill="#5a3a1a"/>
    <rect y="256" width="400" height="6" fill="#5a3a1a"/><rect y="262" width="400" height="38" fill="#8a5d32"/>
    ${[0,1,2,3,4,5,6,7].map(i=>`<line x1="${i*55}" y1="262" x2="${i*55-20}" y2="300" stroke="#6b4420"/>`).join("")}
    <rect x="22" y="168" width="48" height="52" fill="#b9c7cf" stroke="#3b2412" stroke-width="4"/>
    <line x1="46" y1="168" x2="46" y2="220" stroke="#3b2412" stroke-width="2"/><line x1="22" y1="194" x2="70" y2="194" stroke="#3b2412" stroke-width="2"/>`;
  if (h("portrait")) s += `<ellipse cx="290" cy="182" rx="20" ry="25" fill="#c99a2e"/><ellipse cx="290" cy="182" rx="16.5" ry="21.5" fill="#2c3e6a"/>
    <path d="M275 202 q2 -13 15 -13 q13 0 15 13 q-15 4 -30 0z" fill="#a8323a"/>
    <path d="M278 194 q12 9 24 0 l1.5 4 q-13.5 8 -27 0z" fill="#f4f1ea"/>${[281,287,293,299].map(x=>`<circle cx="${x}" cy="196.5" r="0.9" fill="#222"/>`).join("")}
    <circle cx="290" cy="181" r="8" fill="${SKIN}"/>
    <path d="M281.5 181 q-1.5 -11 8.5 -11 q10 0 8.5 11 q-2 -6 -8.5 -6 q-6.5 0 -8.5 6z" fill="#cfcfcf"/>
    <path d="M282 171 l1 -8 l3.5 3.5 l3.5 -6 l3.5 6 l3.5 -3.5 l1 8z" fill="#f2c94c" stroke="#8a6a1e" stroke-width="0.6"/>
    <circle cx="290" cy="167.5" r="1.2" fill="#c8102e"/>
    <circle cx="287" cy="181.5" r="0.9" fill="#222"/><circle cx="293" cy="181.5" r="0.9" fill="#222"/><path d="M287.5 186 q2.5 1.8 5 0" fill="none" stroke="#8a4a3a" stroke-width="0.8"/>`;
  if (h("cheminee")) s += `<rect x="248" y="208" width="84" height="8" rx="1" fill="#e8e0d0" stroke="#b8ad98"/><rect x="252" y="216" width="76" height="3" fill="#b8ad98"/>
    <rect x="258" y="219" width="64" height="37" fill="#cfc4b0"/><rect x="258" y="219" width="9" height="37" fill="#bdb29c"/><rect x="313" y="219" width="9" height="37" fill="#bdb29c"/>
    ${[0,1,2,3].map(k=>`<rect x="259.5" y="${221+k*8.5}" width="6" height="6.5" fill="#2c4a8a"/><rect x="314.5" y="${221+k*8.5}" width="6" height="6.5" fill="#2c4a8a"/>`).join("")}
    <path d="M270 256 v-26 q20 -10 40 0 v26z" fill="#1c1c1c"/><ellipse cx="290" cy="253" rx="15" ry="3" fill="#3b2412"/><rect x="276" y="249" width="28" height="5" rx="2.5" fill="#6b3f1d"/><rect x="280" y="245" width="22" height="5" rx="2.5" fill="#8a5a2b"/>
    <path d="M278 250 q4 -22 11 -8 q3 -16 9 -2 q5 -10 6 10z" fill="#f28c28"/><path d="M284 250 q4 -12 6 -4 q3 -9 6 4z" fill="#ffe27a"/>
    <path d="M272 244 h36 M272 238 h36" stroke="#555" stroke-width="1"/><rect x="266" y="254" width="48" height="3" fill="#c99a2e"/><rect x="252" y="256" width="76" height="4" fill="#b8ad98"/>
    <rect x="256" y="198" width="4" height="10" fill="#c99a2e"/><rect x="255" y="206" width="6" height="2" fill="#c99a2e"/><rect x="257" y="192" width="2" height="6" fill="#fff"/><path d="M258 186 q-2 3 0 5 q2 -2 0 -5z" fill="#ffb020"/>
    <rect x="320" y="198" width="4" height="10" fill="#c99a2e"/><rect x="319" y="206" width="6" height="2" fill="#c99a2e"/><rect x="321" y="192" width="2" height="6" fill="#fff"/><path d="M322 186 q-2 3 0 5 q2 -2 0 -5z" fill="#ffb020"/>`;
  if (h("service")) s += `<rect x="340" y="236" width="48" height="5" fill="#6b3f1d"/><rect x="344" y="241" width="3" height="21" fill="#6b3f1d"/><rect x="381" y="241" width="3" height="21" fill="#6b3f1d"/>
    <path d="M344 236 q-1 -12 8 -17 h12 q9 5 8 17z" fill="#b87333" stroke="#7a4a1e" stroke-width="1"/><path d="M349 228 q0 5 2 8" fill="none" stroke="#e8b27a" stroke-width="1.6"/>
    <path d="M344.5 231 q-5 -1 -8 -7 l2.4 -1 q2 4.5 5.6 4.6z" fill="#b87333" stroke="#7a4a1e" stroke-width="1"/>
    <rect x="352" y="216" width="12" height="3" rx="1.5" fill="#8a5a2b"/><circle cx="358" cy="214" r="2.2" fill="#3b2412"/>
    <path d="M349 218 q9 -15 18 0" fill="none" stroke="#3b2412" stroke-width="2.4"/><path d="M345 229 h26" stroke="#7a4a1e" stroke-width="1"/>
    <path d="M336 220 q-3 -4 0 -7 q3 -3 0 -7 M340 219 q-3 -4 0 -7" fill="none" stroke="#cfd6dc" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M374 236 v-8 h10 v8 q-5 4 -10 0z" fill="#f4f1ea" stroke="#2c4a8a"/><path d="M384 230 q4 0 3 3 q-1 2 -3 2" fill="none" stroke="#2c4a8a" stroke-width="1.4"/><path d="M374 231 h10" stroke="#2c4a8a"/>`;
  if (h("fauteuil")) s += `<rect x="18" y="226" width="64" height="34" rx="6" fill="#7a1f26"/><rect x="14" y="236" width="12" height="26" rx="5" fill="#5e161c"/><rect x="74" y="236" width="12" height="26" rx="5" fill="#5e161c"/>
    <rect x="24" y="246" width="52" height="12" rx="3" fill="#8f2830"/>${[30,42,54,66].map(x=>`<circle cx="${x}" cy="236" r="1.5" fill="#3a0c10"/>`).join("")}`;
  if (h("gramophone")) s += `<rect x="100" y="228" width="44" height="4" fill="#3b2412"/><rect x="104" y="232" width="36" height="30" fill="#6b3f1d" stroke="#3b2412"/>
    <rect x="109" y="237" width="26" height="17" fill="#8a5a2b" stroke="#3b2412"/>${[0,1,2,3,4].map(k=>`<line x1="111" y1="${240+k*3}" x2="133" y2="${240+k*3}" stroke="#3b2412"/>`).join("")}
    <rect x="101" y="258" width="42" height="5" fill="#3b2412"/><rect x="103" y="263" width="6" height="4" fill="#2a1a0c"/><rect x="135" y="263" width="6" height="4" fill="#2a1a0c"/>
    <path d="M140 244 h6 q3 0 3 4 v4" fill="none" stroke="#c99a2e" stroke-width="2"/><circle cx="149" cy="253" r="2.5" fill="#c99a2e"/>
    <rect x="108" y="224" width="28" height="4" fill="#3b2412"/><ellipse cx="122" cy="224" rx="12" ry="2.5" fill="#1c1c1c"/><path d="M122 224 l8 -4" stroke="#c99a2e" stroke-width="1.5"/>
    <path d="M136 228 h6 v6 h-6z" fill="#c99a2e"/>
    <g transform="translate(130 222) rotate(-50)"><path d="M0 -3 Q18 -4 38 -17 L38 17 Q18 4 0 3z" fill="#d9a92f" stroke="#8a6a1e" stroke-width="1"/>
      <ellipse cx="38" cy="0" rx="5" ry="17" fill="#7a5a14" stroke="#8a6a1e" stroke-width="1"/><ellipse cx="38.5" cy="0" rx="2.5" ry="11" fill="#3b2a0a"/>
      <path d="M6 -2.5 Q20 -3 34 -13" fill="none" stroke="#f2d97a" stroke-width="1.5"/></g>`;
  if (h("persan")) s += `<ellipse cx="200" cy="284" rx="100" ry="12" fill="#8a2c2c"/><ellipse cx="200" cy="284" rx="86" ry="8" fill="none" stroke="#2c4a8a" stroke-width="3"/>
    <ellipse cx="200" cy="284" rx="70" ry="5" fill="none" stroke="#e0b050" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  if (h("drapeau")) s += `<ellipse cx="96" cy="258" rx="9" ry="3" fill="#3b2412"/><line x1="96" y1="258" x2="96" y2="164" stroke="#6b3f1d" stroke-width="3"/><circle cx="96" cy="162" r="3" fill="#c99a2e"/>
    <svg x="60" y="167" width="36" height="18" viewBox="0 0 60 30" preserveAspectRatio="none"><rect width="60" height="30" fill="#1f3f8a"/>
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0 L60 30 M60 0 L0 30" stroke="#c8102e" stroke-width="2"/>
      <path d="M30 0 V30 M0 15 H60" stroke="#fff" stroke-width="10"/><path d="M30 0 V30 M0 15 H60" stroke="#c8102e" stroke-width="6"/></svg>`;
  return s;
}

/* ---------- 1er étage (y 0-150), noirci et condamné tant qu'il n'est pas acheté ---------- */
function drawUpstairs(owned){
  const h = id => owned.includes(id);
  if (!h("etage")) return `<rect width="400" height="150" fill="#2a2420"/>
    ${[0,1,2,3,4].map(i=>`<rect x="-10" y="${18+i*24}" width="420" height="12" fill="#5a3f28" transform="rotate(${i%2?2:-2} 200 ${24+i*24})"/>`).join("")}
    <rect x="130" y="58" width="140" height="30" rx="4" fill="#f4e4c1" stroke="#8a5a2b" stroke-width="2"/>
    <text x="200" y="78" font-size="13" text-anchor="middle" font-family="serif" fill="#5a3a1a">1er étage fermé</text>`;
  let s = `<rect width="400" height="138" fill="#b9cfc0"/><rect width="400" height="138" fill="url(#wall2)"/>
    <rect y="128" width="400" height="10" fill="#7b4f2a"/>
    <rect x="160" y="20" width="44" height="56" fill="#b9c7cf" stroke="#3b2412" stroke-width="4"/>
    <line x1="182" y1="20" x2="182" y2="76" stroke="#3b2412" stroke-width="2"/><line x1="160" y1="48" x2="204" y2="48" stroke="#3b2412" stroke-width="2"/>`;
  if (h("enquete")) s += `<rect x="20" y="14" width="96" height="58" fill="#b5835a" stroke="#6b3f1d" stroke-width="3"/>
    ${[[32,24],[60,40],[92,26],[44,56],[96,58]].map(([x,y],k)=>`<rect x="${x-8}" y="${y-6}" width="16" height="12" fill="${k%2?"#fff6c0":"#f4f1ea"}"/>`).join("")}
    <path d="M32 24 L60 40 L92 26 M60 40 L44 56 M60 40 L96 58" fill="none" stroke="#c8102e" stroke-width="1.2"/>
    ${[[32,24],[60,40],[92,26],[44,56],[96,58]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="#c8102e"/>`).join("")}`;
  if (h("buste")) s += `<rect x="36" y="124" width="34" height="5" fill="#bdb29c"/><rect x="38" y="118" width="30" height="6" fill="#cfc4b0"/><rect x="41" y="102" width="24" height="16" fill="#e8e0d0" stroke="#bdb29c"/>
    <path d="M44 106 v8 M50 106 v8 M56 106 v8 M62 106 v8" stroke="#d0c6b4"/><rect x="38" y="98" width="30" height="5" fill="#cfc4b0"/>
    <path d="M40 98 q1 -11 13 -11 q12 0 13 11z" fill="#f0ece4" stroke="#c9c1b2"/><ellipse cx="53" cy="88" rx="11" ry="3.5" fill="#fff" stroke="#c9c1b2"/>
    ${[45,49,53,57,61].map(x=>`<line x1="${x}" y1="86" x2="${x}" y2="90" stroke="#c9c1b2"/>`).join("")}
    <rect x="49" y="82" width="8" height="6" fill="#f0ece4"/><ellipse cx="53" cy="76" rx="8" ry="10" fill="#f0ece4" stroke="#c9c1b2"/>
    <path d="M45 74 q-3 -2 -1 -8 q2 4 4 5z M61 74 q3 -2 1 -8 q-2 4 -4 5z M45 76 q-4 2 -2 8 q3 -1 3 -5z M61 76 q4 2 2 8 q-3 -1 -3 -5z" fill="#d8d0c0" stroke="#c9c1b2" stroke-width="0.6"/>
    <path d="M47 66 q6 -6 12 0" fill="none" stroke="#c9c1b2" stroke-width="1.2"/>
    <circle cx="50" cy="74" r="1" fill="#8a8274"/><circle cx="56" cy="74" r="1" fill="#8a8274"/><path d="M53 75 v4 h-1.5" fill="none" stroke="#b5ac9c" stroke-width="1"/>
    <path d="M48 80 q5 -2 10 0 q-2 2 -5 1.5 q-3 .5 -5 -1.5z" fill="#cfc6b6"/><path d="M49 82 q4 8 4 9 q0 -1 4 -9 q-4 2 -8 0z" fill="#d8d0c0" stroke="#c9c1b2" stroke-width="0.6"/>`;
  if (h("machine")) s += `<rect x="130" y="100" width="92" height="6" fill="#6b3f1d"/><rect x="134" y="106" width="6" height="22" fill="#6b3f1d"/><rect x="212" y="106" width="6" height="22" fill="#6b3f1d"/>
    <rect x="142" y="106" width="68" height="14" fill="#7a4a22" stroke="#3b2412"/><line x1="176" y1="106" x2="176" y2="120" stroke="#3b2412"/><circle cx="159" cy="113" r="2" fill="#c99a2e"/><circle cx="193" cy="113" r="2" fill="#c99a2e"/>
    <rect x="163" y="54" width="26" height="22" fill="#fffdf2" stroke="#cfc8b0"/>${[0,1,2,3].map(k=>`<line x1="167" y1="${60+k*4}" x2="${k===3?177:185}" y2="${60+k*4}" stroke="#555" stroke-width="0.8"/>`).join("")}
    <path d="M148 100 L152 86 H200 L204 100 Z" fill="#1c1c1c" stroke="#555"/><rect x="146" y="98" width="60" height="3" fill="#2a2a2a"/>
    <rect x="150" y="74" width="4" height="14" fill="#2a2a2a"/><rect x="198" y="74" width="4" height="14" fill="#2a2a2a"/><rect x="168" y="80" width="16" height="7" fill="#2a2a2a"/>
    <rect x="152" y="74" width="48" height="7" rx="3.5" fill="#3a3a3a" stroke="#555"/><circle cx="148" cy="77.5" r="3" fill="#555"/><circle cx="204" cy="77.5" r="3" fill="#555"/>
    <path d="M200 74 l8 -6" stroke="#c0c0c0" stroke-width="1.5"/><rect x="163" y="75" width="26" height="2" fill="#fffdf2"/>
    ${[0,1,2].map(r=>[...Array(8-r)].map((_,c)=>`<circle cx="${158+r*3+c*5.2}" cy="${90+r*3.3}" r="1.6" fill="#e8e8e8" stroke="#888" stroke-width="0.4"/>`).join("")).join("")}
    <rect x="132" y="90" width="9" height="10" rx="1" fill="#1f3f6a"/><rect x="134" y="87" width="5" height="3" fill="#111"/>`;
  if (h("violon")) s += `<g transform="rotate(-20 236 60)">
    <rect x="248" y="30" width="2" height="66" fill="#6b3f1d"/><line x1="249.5" y1="32" x2="249.5" y2="94" stroke="#f4f1ea" stroke-width="0.8"/>
    <path d="M226 62 q-4 6 0 10 q-6 4 -4 12 q4 10 14 10 q10 0 14 -10 q2 -8 -4 -12 q4 -4 0 -10 q-4 -8 -10 -8 q-6 0 -10 8z" fill="#a0521d" stroke="#5a2a0d" stroke-width="1.2"/>
    <rect x="233.5" y="26" width="5" height="40" fill="#1c1c1c"/><rect x="234.5" y="22" width="3" height="6" fill="#3b2412"/><circle cx="236" cy="20" r="3.5" fill="#6b3f1d"/>
    <path d="M229 74 q-2 4 0 8 M243 74 q2 4 0 8" fill="none" stroke="#2a1408" stroke-width="1.6"/>
    <rect x="231" y="76" width="10" height="2" fill="#e8d9b0"/><path d="M233 87 h6 l-3 9z" fill="#2a1408"/>
    ${[234.7, 235.6, 236.4, 237.3].map(x=>`<line x1="${x}" y1="22" x2="${x}" y2="90" stroke="#e8e8e8" stroke-width="0.6"/>`).join("")}</g>`;
  if (h("lit")) s += `<rect x="282" y="34" width="5" height="100" fill="#4a2a12"/><rect x="385" y="34" width="5" height="100" fill="#4a2a12"/><rect x="278" y="30" width="116" height="8" fill="#4a2a12"/>
    <path d="M287 38 q10 30 0 54 h10 q-8 -28 -4 -54z M385 38 q-10 30 0 54 h-10 q8 -28 4 -54z" fill="#2c4a8a"/>
    <rect x="287" y="112" width="98" height="12" fill="#6b3f1d" stroke="#3b2412" stroke-width="1.5"/>
    ${[0,1,2].map(k=>`<rect x="${292+k*30}" y="115" width="26" height="6" fill="#8a5a2b"/>`).join("")}
    <rect x="288" y="94" width="96" height="18" fill="#f4f1ea"/><rect x="288" y="102" width="96" height="10" fill="#2c4a8a"/><rect x="291" y="88" width="22" height="9" rx="4" fill="#fff" stroke="#d8d2c4"/>`;
  return s;
}

/* ---------- Inspecteur ---------- */
function drawInspector(eq){
  const coat = COAT_COLORS[eq.coat || "none"];
  let s = "";
  // Jambes et chaussures
  s += `<rect x="184" y="238" width="13" height="40" fill="${eq.coat === "tunique" ? "#1c1c2a" : "#3b2a20"}"/><rect x="203" y="238" width="13" height="40" fill="${eq.coat === "tunique" ? "#1c1c2a" : "#3b2a20"}"/>
        <ellipse cx="187" cy="281" rx="12" ry="6" fill="#1a1a1a"/><ellipse cx="213" cy="281" rx="12" ry="6" fill="#1a1a1a"/>`;
  // Corps (veste)
  s += `<path d="M172 158 h56 l12 88 h-80z" fill="${coat}"/>
        <path d="M192 158 h16 l-8 32z" fill="#fff"/>
        <line x1="200" y1="190" x2="200" y2="246" stroke="#00000033" stroke-width="2"/>
        ${[205,220,235].map(y=>`<circle cx="205" cy="${y}" r="2" fill="#c99a2e"/>`).join("")}`;
  if (eq.coat === "tartan") s += `<path d="M168 180 h64 M166 205 h68 M164 230 h72" stroke="#c8102e" stroke-width="2"/><path d="M186 160 v86 M214 160 v86" stroke="#f2c94c" stroke-width="1.5"/>`;
  if (eq.coat === "chesterfield") s += `<path d="M180 158 l12 0 l-6 22z M220 158 l-12 0 l6 22z" fill="#1c1c1c"/><path d="M166 236 h68" stroke="#2a2d33" stroke-width="3"/>`;
  if (eq.coat === "tunique") s += `<rect x="166" y="222" width="68" height="7" fill="#fff"/><rect x="195" y="221" width="10" height="9" fill="#c99a2e"/>
        ${[172,184,196,208].map(y=>`<circle cx="200" cy="${y}" r="2.5" fill="#f2c94c"/>`).join("")}`;
  // Bras et mains
  s += `<rect x="157" y="162" width="15" height="62" rx="7" fill="${coat}" transform="rotate(8 164 162)"/>
        <rect x="228" y="162" width="15" height="62" rx="7" fill="${coat}" transform="rotate(-8 236 162)"/>
        <circle cx="160" cy="226" r="8" fill="${SKIN}"/><circle cx="240" cy="226" r="8" fill="${SKIN}"/>`;
  // Cou
  if (eq.neck === "cravate") s += `<path d="M196 160 h8 l3 30 l-7 8 l-7 -8z" fill="#1f3f6a"/><path d="M195 168 l10 -4 M195 178 l11 -4 M195 188 l11 -4" stroke="#c99a2e" stroke-width="2"/>`;
  if (eq.neck === "ecossaise") s += `<path d="M180 154 q20 12 40 0 v10 q-20 12 -40 0z" fill="#a8323a"/><path d="M210 160 l10 40 l-11 2 l-7 -40z" fill="#a8323a"/>
        <path d="M188 160 v10 M200 162 v12 M212 160 v10 M206 172 l9 -2 M208 184 l10 -2" stroke="#1f3f6a" stroke-width="2"/>`;
  // Tête
  s += `<rect x="194" y="148" width="12" height="12" fill="${SKIN}"/>
        <circle cx="200" cy="128" r="27" fill="${SKIN}"/>
        <path d="M173 124 q-2 -26 27 -28 q29 2 27 28 q-4 -12 -10 -14 q-17 6 -34 0 q-6 2 -10 14z" fill="#cfcfcf"/>
        <ellipse cx="172" cy="130" rx="4" ry="7" fill="${SKIN}"/><ellipse cx="228" cy="130" rx="4" ry="7" fill="${SKIN}"/>
        <circle cx="190" cy="126" r="3" fill="#222"/><circle cx="210" cy="126" r="3" fill="#222"/>
        <path d="M185 118 l10 -2 M205 116 l10 2" stroke="#888" stroke-width="2"/>
        <path d="M200 129 l-3 8 h5" fill="none" stroke="#c48b52" stroke-width="2"/>
        <path d="M200 140 q-8 -4 -18 4 q10 0 18 -2 q8 2 18 2 q-10 -8 -18 -4z" fill="#9e9e9e"/>
        <path d="M193 147 q7 4 14 0" fill="none" stroke="#8a4a3a" stroke-width="2"/>`;
  // Visage
  if (eq.face === "pincenez") s += `<ellipse cx="192" cy="127" rx="6" ry="5" fill="#ffffff33" stroke="#c99a2e" stroke-width="1.5"/><ellipse cx="208" cy="127" rx="6" ry="5" fill="#ffffff33" stroke="#c99a2e" stroke-width="1.5"/>
        <path d="M198 126 q2 -3 4 0" fill="none" stroke="#c99a2e" stroke-width="1.5"/><path d="M186 129 q-8 14 2 26" fill="none" stroke="#333" stroke-width="0.8"/>`;
  if (eq.face === "moustache") s += `<path d="M200 139 q-10 -6 -20 0 q-8 4 -10 -6 q2 12 12 10 q10 -2 18 -2 q8 0 18 2 q10 2 12 -10 q-2 10 -10 6 q-10 -6 -20 0z" fill="#5a3a1a"/>`;
  // Chapeaux
  if (eq.hat === "flatcap") s += `<path d="M172 110 q2 -20 30 -20 q22 0 26 16 l14 6 q-30 6 -70 -2z" fill="#7a6a4a"/><path d="M178 104 q20 -8 46 0" fill="none" stroke="#5a4a32" stroke-width="1.5" stroke-dasharray="3 2"/>`;
  if (eq.hat === "bobby") s += `<path d="M176 110 q-2 -30 10 -46 q14 -12 28 0 q12 16 10 46z" fill="#1c2340"/><rect x="172" y="106" width="56" height="6" rx="3" fill="#111833"/>
        <circle cx="200" cy="58" r="4" fill="#c0c0c0"/><path d="M200 78 l6 6 l-6 10 l-6 -10z" fill="#c0c0c0"/>`;
  if (eq.hat === "bearskin") s += `<path d="M174 112 q-6 -40 6 -62 q20 -14 40 0 q12 22 6 62z" fill="#111"/>
        <path d="M180 60 q6 -6 10 2 M196 50 q6 -6 10 2 M210 62 q6 -6 10 2 M184 84 q6 -6 10 2 M206 88 q6 -6 10 2" fill="none" stroke="#333" stroke-width="2"/>
        <path d="M222 108 l-2 -40" stroke="#c8102e" stroke-width="4"/><path d="M178 112 q22 18 44 0" fill="none" stroke="#c99a2e" stroke-width="2"/>`;
  if (eq.hat === "forme") s += `<ellipse cx="200" cy="106" rx="38" ry="6" fill="#111"/><rect x="178" y="56" width="44" height="50" fill="#111"/><rect x="178" y="92" width="44" height="8" fill="#a8323a"/>`;
  // Main droite
  if (eq.hand === "the") s += `<ellipse cx="248" cy="222" rx="14" ry="3" fill="#f4f1ea" stroke="#2c4a8a"/><path d="M240 210 h16 l-2 12 h-12z" fill="#f4f1ea" stroke="#2c4a8a"/>
        <path d="M256 213 q6 1 1 7" fill="none" stroke="#2c4a8a" stroke-width="1.5"/><path d="M245 205 q-3 -5 1 -9 M251 205 q-3 -5 1 -9" fill="none" stroke="#bbb" stroke-width="1.5"/>`;
  if (eq.hand === "parapluie") s += `<line x1="246" y1="214" x2="258" y2="286" stroke="#3b2412" stroke-width="2.5"/><path d="M248 230 l4 -2 l10 52 l-6 2z" fill="#111"/>
        <path d="M246 214 q-2 -10 -10 -6" fill="none" stroke="#6b3f1d" stroke-width="4" stroke-linecap="round"/>`;
  return s;
}

function drawCorgi(){
  return `<g transform="translate(250 266)">
    <path d="M1.2 9.4 Q-4 6 -5.5 -3.5 Q-1 -1.5 5 7.2z" fill="#e08a3c"/><ellipse cx="-5" cy="-3" rx="1.7" ry="2.2" fill="#fff" transform="rotate(-25 -5 -3)"/>
    <ellipse cx="18" cy="12" rx="18" ry="8" fill="#e08a3c"/><ellipse cx="18" cy="15" rx="12" ry="5" fill="#fff"/>
    <circle cx="36" cy="4" r="8" fill="#e08a3c"/>
    <path d="M30.5 0 L31 -12 L36 -3.5z" fill="#e08a3c"/><path d="M32 -2 L32 -8.5 L34.5 -4z" fill="#f2b8a8"/>
    <path d="M36.5 -3.6 L42 -12 L43 1z" fill="#e08a3c"/><path d="M38 -3 L41.5 -8.5 L41.5 -1z" fill="#f2b8a8"/>
    <ellipse cx="41" cy="7" rx="4" ry="3" fill="#fff"/><path d="M37 -3 q1 5 -1 8" fill="none" stroke="#fff" stroke-width="1.6"/>
    <circle cx="38" cy="2" r="1.3" fill="#000"/><circle cx="44" cy="6" r="1.4" fill="#000"/>
    <rect x="6" y="17" width="4" height="6" fill="#e08a3c"/><rect x="26" y="17" width="4" height="6" fill="#e08a3c"/></g>`;
}

/* Scène complète : coupe de l'appartement (1er étage au-dessus, rez-de-chaussée en bas) + inspecteur au rez-de-chaussée. */
function drawScene(owned, equipped){
  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="L'inspecteur Bramble dans son appartement">
    <defs><pattern id="wall" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 0 v20" stroke="#cbb88e" stroke-width="2"/></pattern>
      <pattern id="wall2" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="2" fill="#a6bfae"/></pattern></defs>
    ${drawUpstairs(owned)}${drawGround(owned)}
    <rect y="138" width="400" height="12" fill="#3b2412"/>
    <g transform="translate(76 112) scale(0.62)">${drawInspector(equipped)}</g>${owned.includes("corgi") ? drawCorgi() : ""}</svg>`;
}

/* ---------- Rue de Londres (extérieur) ---------- */
function drawStreet(owned){
  const h = id => owned.includes(id);
  const cloud = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="7" rx="36" ry="6" fill="#c3cad1"/>
    <circle cx="-20" cy="1" r="9" fill="#e9edf0"/><circle cx="-6" cy="-6" r="14" fill="#f4f6f8"/><circle cx="14" cy="-2" r="11" fill="#eef1f4"/><circle cx="27" cy="3" r="7" fill="#e6eaee"/>
    <ellipse cx="2" cy="3" rx="31" ry="6.5" fill="#e6eaee"/><path d="M-12 -10 q6 -5 12 -1 M-26 -3 q3 -3 6 -2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <path d="M-28 8 q10 3 22 2 M8 9 q10 1 20 -2" fill="none" stroke="#b4bcc5" stroke-width="1.5" stroke-linecap="round"/></g>`;
  let s = `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="La rue de l'inspecteur Bramble">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa8b5"/><stop offset="1" stop-color="#dfe4e8"/></linearGradient>
      <pattern id="brick" width="16" height="8" patternUnits="userSpaceOnUse"><rect width="16" height="8" fill="#9c4a32"/><path d="M0 7.5 h16 M8 0 v4 M0 4 h16 M0 4 v4 M16 4 v4" stroke="#7a3624" stroke-width="1"/></pattern></defs>
    <rect width="400" height="250" fill="url(#sky)"/>
    ${cloud(62, 26, 1)}${cloud(190, 12, 0.7)}${cloud(250, 34, 0.45)}`;
  if (h("bigben")) s += `<g stroke="#6b5a3a" stroke-width="0.8">
    <rect x="358" y="38" width="22" height="92" fill="#c9b588"/>${[46,54,62,70,78,86,94,102,110,118,126].map(y=>`<line x1="358" y1="${y}" x2="380" y2="${y}" stroke="#a8946a" stroke-width="0.6"/>`).join("")}
    ${[76,92,108].map(y=>`<path d="M366 ${y+8} v-6 q3 -4 6 0 v6z" fill="#3e4c5a" stroke="none"/>`).join("")}
    <rect x="355" y="36" width="28" height="4" fill="#b8a27a"/><rect x="356" y="24" width="26" height="12" fill="#d3bf92"/>
    ${[360,368,376].map(x=>`<path d="M${x} 36 v-8 q3 -5 6 0 v8z" fill="#4a3a1e" stroke="none"/>`).join("")}
    <rect x="354" y="22" width="30" height="3" fill="#b8a27a"/>
    <path d="M356 22 l2 -10 l2 10z M378 22 l2 -10 l2 10z" fill="#8a7a52"/><path d="M360 22 L369 -2 L378 22z" fill="#6b7a62"/><path d="M369 -2 v-5" stroke="#c99a2e" stroke-width="1.5"/><circle cx="369" cy="-8" r="1.6" fill="#c99a2e" stroke="none"/>
    <rect x="356" y="40" width="26" height="32" fill="#c9b588"/><circle cx="369" cy="55" r="11.5" fill="#c99a2e"/><circle cx="369" cy="55" r="9.5" fill="#f6f1dc" stroke="#3b2412" stroke-width="1"/>
    ${[...Array(12)].map((_,k)=>`<line x1="${(369+7.2*Math.sin(k*Math.PI/6)).toFixed(1)}" y1="${(55-7.2*Math.cos(k*Math.PI/6)).toFixed(1)}" x2="${(369+9*Math.sin(k*Math.PI/6)).toFixed(1)}" y2="${(55-9*Math.cos(k*Math.PI/6)).toFixed(1)}" stroke="#3b2412" stroke-width="0.8"/>`).join("")}
    <path d="M369 55 v-7 M369 55 l5 3" stroke="#000" stroke-width="1.4"/><circle cx="369" cy="55" r="1.2" fill="#000"/></g>`;
  if (h("dirigeable")) s += `<g transform="translate(300 26)"><path d="M-30 -2 l-10 -10 l2 10 l-2 10 z" fill="#8a96a3"/><path d="M-26 -4 l-6 -12 l8 5z M-26 4 l-6 12 l8 -5z" fill="#6f7b88"/>
    <ellipse cx="0" cy="0" rx="34" ry="12" fill="#e9dfc4" stroke="#8a7a52" stroke-width="1.5"/>
    ${[-20,-10,0,10,20].map(x=>`<path d="M${x} ${(-11.5*Math.sqrt(1-(x/34)**2)).toFixed(1)} q3 11 0 ${(23*Math.sqrt(1-(x/34)**2)).toFixed(1)}" fill="none" stroke="#b8a27a" stroke-width="0.8"/>`).join("")}
    <path d="M-30 1 q30 5 60 0" fill="none" stroke="#c8102e" stroke-width="2"/>
    <line x1="-10" y1="11" x2="-10" y2="16" stroke="#555"/><line x1="10" y1="11" x2="10" y2="16" stroke="#555"/>
    <rect x="-14" y="16" width="28" height="8" rx="2" fill="#6b3f1d" stroke="#3b2412"/>${[-9,-3,3,9].map(x=>`<rect x="${x-1.5}" y="18" width="3" height="3" fill="#bfe3f0"/>`).join("")}
    <line x1="-14" y1="20" x2="-19" y2="20" stroke="#555" stroke-width="1.5"/><path d="M-21 15 v10" stroke="#333" stroke-width="1.5"/></g>`;
  // Maisons voisines et façade de l'appartement
  const win = (x, y, w, h, o = {}) => `${o.shut ? `<rect x="${x - 6}" y="${y}" width="5" height="${h}" fill="#2e5a3a"/><rect x="${x + w + 1}" y="${y}" width="5" height="${h}" fill="#2e5a3a"/>` : ""}
    <rect x="${x - 3}" y="${y - 5}" width="${w + 6}" height="4" fill="#e8dfc8" stroke="#a89878" stroke-width="0.6"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.lit ? "#f2d98a" : "#4a5a68"}" stroke="#fff" stroke-width="2"/>
    <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="#fff" stroke-width="1.5"/><line x1="${x}" y1="${y + h * 0.4}" x2="${x + w}" y2="${y + h * 0.4}" stroke="#fff" stroke-width="1.5"/>
    ${o.cur ? `<path d="M${x} ${y} h${w * 0.3} q-3 ${h * 0.5} 0 ${h} h-${w * 0.3}z" fill="${o.cur}"/><path d="M${x + w} ${y} h-${w * 0.3} q3 ${h * 0.5} 0 ${h} h${w * 0.3}z" fill="${o.cur}"/>` : ""}
    <rect x="${x - 2}" y="${y + h}" width="${w + 4}" height="3" fill="#e8dfc8" stroke="#a89878" stroke-width="0.6"/>`;
  const bigwin = (x, y, w, h) => `<rect x="${x - 4}" y="${y - 5}" width="${w + 8}" height="${h + 9}" fill="#efe9dc" stroke="#bfb497" stroke-width="1"/>
    <rect x="${x + w / 2 - 4}" y="${y - 10}" width="8" height="6" fill="#e8dfc8" stroke="#a89878" stroke-width="0.7"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3e4c5a" stroke="#fff" stroke-width="2.5"/>
    <path d="M${x + 3} ${y + 3} l${w * 0.3} 0 l-${w * 0.2} ${h * 0.5}z" fill="#ffffff22"/>
    <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="#fff" stroke-width="2"/>${[1, 2].map(k => `<line x1="${x}" y1="${y + h * k / 3}" x2="${x + w}" y2="${y + h * k / 3}" stroke="#fff" stroke-width="1.6"/>`).join("")}
    <path d="M${x} ${y} h${w * 0.22} q-4 ${h * 0.35} -1 ${h * 0.6} q2 3 -1 ${h * 0.4 - 0} h-${w * 0.22 - 1}z" fill="#8a2c36" opacity="0.9"/><path d="M${x + w} ${y} h-${w * 0.22} q4 ${h * 0.35} 1 ${h * 0.6} q-2 3 1 ${h * 0.4} h${w * 0.22 - 1}z" fill="#8a2c36" opacity="0.9"/>
    <rect x="${x - 6}" y="${y + h}" width="${w + 12}" height="4" fill="#e8dfc8" stroke="#a89878" stroke-width="0.7"/><rect x="${x + 2}" y="${y + h + 4}" width="4" height="3" fill="#d8cfbc"/><rect x="${x + w - 6}" y="${y + h + 4}" width="4" height="3" fill="#d8cfbc"/>`;
  const door = (x, y, w, h, c) => `<rect x="${x - 3}" y="${y - 5}" width="${w + 6}" height="${h + 5}" fill="#e8dfc8" stroke="#a89878" stroke-width="0.6"/>
    <path d="M${x} ${y} q${w / 2} -9 ${w} 0z" fill="#9fb3c3" stroke="#e8dfc8"/><path d="M${x + w / 2} ${y - 4.5} v4.5 M${x + 3} ${y - 2} l${w / 2 - 3} 2 M${x + w - 3} ${y - 2} l-${w / 2 - 3} 2" stroke="#fff" stroke-width="0.6"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="#00000055"/>
    <rect x="${x + 3}" y="${y + 4}" width="${w / 2 - 4.5}" height="${h * 0.38}" fill="#ffffff22" stroke="#00000044"/><rect x="${x + w / 2 + 1.5}" y="${y + 4}" width="${w / 2 - 4.5}" height="${h * 0.38}" fill="#ffffff22" stroke="#00000044"/>
    <rect x="${x + 3}" y="${y + h * 0.5}" width="${w / 2 - 4.5}" height="${h * 0.42}" fill="#00000022" stroke="#00000044"/><rect x="${x + w / 2 + 1.5}" y="${y + h * 0.5}" width="${w / 2 - 4.5}" height="${h * 0.42}" fill="#00000022" stroke="#00000044"/>
    <circle cx="${x + w - 3.5}" cy="${y + h * 0.48}" r="1.4" fill="#c99a2e"/><rect x="${x - 4}" y="${y + h - 2}" width="${w + 8}" height="3" fill="#b8ad98" stroke="#8a806a" stroke-width="0.5"/>`;
  const chimney = (x, y, n) => `<rect x="${x}" y="${y}" width="12" height="${n}" fill="url(#brick)" stroke="#7a3624" stroke-width="0.6"/><rect x="${x - 1}" y="${y - 2}" width="14" height="3" fill="#e8dfc8"/><rect x="${x + 2}" y="${y - 8}" width="3.5" height="6" fill="#b5651d"/><rect x="${x + 7}" y="${y - 8}" width="3.5" height="6" fill="#b5651d"/>`;
  s += `<rect x="0" y="50" width="105" height="125" fill="#c9b79a"/>${[58,68,78,88,98,108,118,128,138,148,158,168].map(y => `<line x1="0" y1="${y}" x2="105" y2="${y}" stroke="#b8a584" stroke-width="0.8"/>`).join("")}
    ${chimney(14, 24, 20)}${chimney(72, 28, 16)}<path d="M-2 52 L2 36 H103 L107 52z" fill="#4a4f5a"/>${[0,1,2,3,4,5,6,7,8,9,10].map(k => `<path d="M${k * 10} 37 v14" stroke="#383c46" stroke-width="0.8"/>`).join("")}
    <rect x="-2" y="50" width="109" height="6" fill="#e8dfc8" stroke="#a89878" stroke-width="0.6"/>${[...Array(18)].map((_, k) => `<rect x="${k * 6 - 1}" y="56" width="3" height="2.5" fill="#d3c8a8"/>`).join("")}
    ${win(16, 66, 22, 28, { cur: "#a8323a", lit: true })}${win(66, 66, 22, 28, { shut: true })}
    ${win(12, 138, 24, 24, { shut: true, cur: "#a8323a" })}${door(60, 132, 24, 43, "#2e5a3a")}
    <rect x="102" y="52" width="3" height="123" fill="#5a5a5a"/>
    <rect x="275" y="70" width="125" height="105" fill="#d8cdb0"/>${[78,88,98,108,118,128,138,148,158,168].map(y => `<line x1="275" y1="${y}" x2="400" y2="${y}" stroke="#c4b896" stroke-width="0.8"/>`).join("")}
    ${chimney(286, 50, 20)}${chimney(310, 56, 14)}<rect x="273" y="68" width="127" height="7" fill="#e8dfc8" stroke="#a89878" stroke-width="0.6"/>${[...Array(21)].map((_, k) => `<rect x="${275 + k * 6}" y="75" width="3" height="2.5" fill="#cbbf9c"/>`).join("")}
    <rect x="275" y="76" width="5" height="99" fill="#cfc3a0"/><rect x="395" y="76" width="5" height="99" fill="#cfc3a0"/>
    ${win(297, 86, 20, 28, { cur: "#6a2c8a", lit: true })}${win(353, 86, 20, 28, { shut: true })}
    ${win(290, 140, 22, 24, { cur: "#6a2c8a", lit: true })}${door(346, 130, 26, 45, "#1f3f6a")}
    <rect x="349" y="118" width="28" height="3" fill="#2a2a2a"/>${[0,1,2,3,4,5].map(k => `<line x1="${351 + k * 5}" y1="109" x2="${351 + k * 5}" y2="118" stroke="#2a2a2a" stroke-width="1"/>`).join("")}<path d="M349 109 h28" stroke="#2a2a2a" stroke-width="1"/>
    <rect x="272" y="76" width="3" height="99" fill="#5a5a5a"/>
    <rect x="105" y="30" width="170" height="145" fill="url(#brick)"/>
    <rect x="105" y="105" width="170" height="70" fill="#efe9dc"/><rect x="100" y="24" width="180" height="8" fill="#efe9dc"/><rect x="100" y="102" width="180" height="5" fill="#d8cfbc"/>
    ${bigwin(128, 49, 34, 40)}${bigwin(218, 49, 34, 40)}${bigwin(123, 122, 34, 32)}
    <rect x="172" y="112" width="36" height="58" fill="#111"/><path d="M172 112 q18 -14 36 0z" fill="#9fb3c3" stroke="#efe9dc" stroke-width="2"/>
    <circle cx="200" cy="142" r="2" fill="#c99a2e"/><text x="190" y="132" font-size="8" fill="#c99a2e" text-anchor="middle" font-family="serif">221B</text>
    <rect x="166" y="170" width="48" height="5" fill="#cfcfcf"/>
    <rect x="213" y="172" width="62" height="4" fill="#a9a9a3" stroke="#8a8a84" stroke-width="0.5"/>
    <rect x="214" y="156" width="60" height="2.2" fill="#111"/><rect x="214" y="166" width="60" height="2.2" fill="#111"/>
    ${[...Array(12)].map((_, k) => `<line x1="${216.5 + k * 5.1}" y1="158" x2="${216.5 + k * 5.1}" y2="172" stroke="#111" stroke-width="1.3"/><path d="M${214.8 + k * 5.1} 158 l1.7 -5 l1.7 5z" fill="#111"/>`).join("")}
    ${[...Array(5)].map((_, k) => `<circle cx="${219 + k * 12.3}" cy="162" r="2.1" fill="none" stroke="#111" stroke-width="0.9"/>`).join("")}
    ${[214.5, 244, 273.5].map(x => `<rect x="${x - 1.5}" y="152" width="3" height="21" fill="#111"/><circle cx="${x}" cy="150.5" r="2.6" fill="#111"/><rect x="${x - 3}" y="169" width="6" height="3" fill="#222"/>`).join("")}
    <rect y="175" width="400" height="12" fill="#a9a9a3"/><rect y="187" width="400" height="63" fill="#4a4a4e"/>
    ${[20,90,160,230,300,370].map(x=>`<rect x="${x}" y="244" width="30" height="3" fill="#e8e8e8"/>`).join("")}`;
  if (h("plaque")) s += `<circle cx="246" cy="128" r="20" fill="#f4f1ea" stroke="#9a9a92" stroke-width="1"/><circle cx="246" cy="128" r="18" fill="#1f5aa8"/><circle cx="246" cy="128" r="16.2" fill="none" stroke="#fff" stroke-width="0.8"/>
    <text x="246" y="121" font-size="3.3" fill="#fff" text-anchor="middle" font-family="serif" letter-spacing="0.3">INSPECTOR</text>
    <text x="246" y="129" font-size="5.5" fill="#fff" text-anchor="middle" font-family="serif" font-weight="bold">BRAMBLE</text>
    <path d="M236 131.5 h20" stroke="#fff" stroke-width="0.6"/>
    <text x="246" y="136.5" font-size="3.2" fill="#fff" text-anchor="middle" font-family="serif" font-style="italic">lived here</text>
    <text x="246" y="142.5" font-size="3.8" fill="#fff" text-anchor="middle" font-family="serif" font-weight="bold">221B</text>
    ${[[228.5,128],[263.5,128]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.1" fill="#777"/>`).join("")}`;
  if (h("jardinieres")) s += [125,215].map(x => {
    const petals = (cx, cy, c) => [0,72,144,216,288].map(a => `<circle cx="${(cx + 1.8 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(cy + 1.8 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="1.6" fill="${c}"/>`).join("") + `<circle cx="${cx}" cy="${cy}" r="1" fill="#f2c94c"/>`;
    const cols = ["#d8223a", "#f4a6c0", "#f2c94c", "#ffffff", "#9a5ad0"];
    return `<rect x="${x - 3}" y="91" width="46" height="9" fill="#6b3f1d" stroke="#3b2412"/>${[0,1,2,3,4,5].map(k => `<line x1="${x + k * 8}" y1="92" x2="${x + k * 8}" y2="99" stroke="#3b2412" stroke-width="0.7"/>`).join("")}
      <rect x="${x - 4}" y="94" width="48" height="2" fill="#c99a2e"/>
      ${[...Array(12)].map((_, k) => `<ellipse cx="${x + 1 + k * 3.6}" cy="${88 + (k % 3)}" rx="3.2" ry="4" fill="${["#2e7d32", "#3e8e3a", "#4caf50"][k % 3]}" transform="rotate(${(k % 2 ? 25 : -25)} ${x + 1 + k * 3.6} 89)"/>`).join("")}
      ${[0,1,2,3,4,5,6,7].map(k => petals(x + 3 + k * 5.2, 84 + (k % 3) * 2.5, cols[k % 5])).join("")}`;
  }).join("");
  if (h("kiosque")) s += `<rect x="10" y="132" width="74" height="43" fill="#2e5a3a" stroke="#1f3f2a" stroke-width="1.5"/>
    <path d="M3 132 l11 -16 h66 l11 16z" fill="#1f3f2a" stroke="#142a1c"/><rect x="3" y="131" width="88" height="3" fill="#c99a2e"/><line x1="47" y1="116" x2="47" y2="108" stroke="#c99a2e" stroke-width="2"/><circle cx="47" cy="106" r="2.5" fill="#c99a2e"/>
    <rect x="24" y="118" width="46" height="11" rx="1.5" fill="#0f2a1a" stroke="#c99a2e"/><text x="47" y="126.5" font-size="8" fill="#f2c94c" text-anchor="middle" font-family="serif" font-weight="bold">NEWS</text>
    <rect x="15" y="136" width="64" height="24" fill="#241a10" stroke="#142a1c"/><rect x="15" y="136" width="64" height="3" fill="#5a3a1a"/>
    ${[0,1,2,3,4,5,6].map(k => `<rect x="${17 + k * 9}" y="141" width="8" height="9" fill="${["#c8102e","#2c4a8a","#f2c94c","#2e7d32","#d36ac2","#e2873d","#6a2c8a"][k]}"/><rect x="${18.5 + k * 9}" y="143" width="5" height="1.5" fill="#fff"/><rect x="${18.5 + k * 9}" y="146" width="5" height="1" fill="#ffffffaa"/>`).join("")}
    <rect x="15" y="151" width="64" height="2" fill="#5a3a1a"/>${[0,1,2,3,4,5].map(k => `<rect x="${18 + k * 10}" y="153" width="9" height="7" fill="#f4f1ea" stroke="#999" stroke-width="0.5"/><path d="M${19.5 + k * 10} 155 h6 M${19.5 + k * 10} 157.5 h6" stroke="#444" stroke-width="0.7"/>`).join("")}
    <path d="M38 160 v-5 q0 -6 9 -6 q9 0 9 6 v5z" fill="#8a3a2a"/><path d="M41.5 160 v-7 h11 v7z" fill="#e8dfc8" stroke="#b5ab94" stroke-width="0.5"/><path d="M43 149.8 l1 3.2 M51 149.8 l-1 3.2" stroke="#e8dfc8" stroke-width="1.2"/><rect x="44.5" y="155" width="5" height="3" fill="#cfc4aa"/>
    <rect x="45" y="147.5" width="4" height="3" fill="${SKIN}"/><path d="M43 150 l4 3.6 l4 -3.6 q-4 -1.8 -8 0z" fill="#c8102e"/>
    <path d="M38.5 153 q-3.5 3 -2 7" fill="none" stroke="#8a3a2a" stroke-width="3.2" stroke-linecap="round"/><circle cx="36.6" cy="160" r="1.7" fill="${SKIN}"/>
    <circle cx="47" cy="143.5" r="5" fill="${SKIN}"/><circle cx="42" cy="144.5" r="1.3" fill="#e0ae6a"/><circle cx="52" cy="144.5" r="1.3" fill="#e0ae6a"/><circle cx="44" cy="146" r="1.1" fill="#f0a090" opacity="0.7"/><circle cx="50" cy="146" r="1.1" fill="#f0a090" opacity="0.7"/>
    <path d="M41.2 141.5 q0 -6.5 5.8 -6.5 q5.8 0 5.8 6.5z" fill="#5a4a32" stroke="#3f331f" stroke-width="0.5"/><path d="M52 141.3 h6 q0.6 1.8 -6 1.8z" fill="#46361f"/><circle cx="47" cy="135.4" r="0.9" fill="#3f331f"/><path d="M42 140.4 h10" stroke="#3f331f" stroke-width="0.6"/>
    <circle cx="45" cy="143.2" r="0.8" fill="#222"/><circle cx="49" cy="143.2" r="0.8" fill="#222"/><path d="M43.6 141.9 l2.6 -0.5 M48 141.4 l2.6 0.5" stroke="#5a3a1a" stroke-width="0.6"/><path d="M47 143.8 v1.6 h-1" fill="none" stroke="#c48b52" stroke-width="0.6"/>
    <path d="M44 146.6 q3 -1.6 6 0 q-3 0.8 -6 0z" fill="#5a3a1a"/><ellipse cx="47" cy="148" rx="1.3" ry="0.9" fill="#7a2a2a"/>
    <path d="M55 153 q5 -1 6.5 -5" fill="none" stroke="#8a3a2a" stroke-width="3.2" stroke-linecap="round"/><circle cx="61.8" cy="147.2" r="1.8" fill="${SKIN}"/>
    <path d="M58.5 138.5 l9.5 -1.2 l1.2 10 l-9.5 1.2z" fill="#f4f1ea" stroke="#999" stroke-width="0.5"/><path d="M60 141 l6.5 -0.8 M60.3 143.3 l6.5 -0.8 M60.6 145.6 l4 -0.5" stroke="#444" stroke-width="0.6"/><rect x="60" y="139.3" width="6.4" height="1.6" fill="#c8102e" transform="rotate(-7 60 139.3)"/>
    <rect x="12" y="159" width="70" height="4" fill="#c9a26a" stroke="#8a6a3a" stroke-width="0.6"/><rect x="62" y="154" width="16" height="5" fill="#f4f1ea" stroke="#999" stroke-width="0.5"/><rect x="62" y="150" width="16" height="4" fill="#e8e0c8" stroke="#999" stroke-width="0.5"/>
    <rect x="12" y="163" width="14" height="10" fill="#f4f1ea" stroke="#1f3f2a"/><text x="19" y="169" font-size="3.2" fill="#c8102e" text-anchor="middle" font-family="sans-serif" font-weight="bold">DAILY</text><text x="19" y="172" font-size="3.2" fill="#222" text-anchor="middle" font-family="sans-serif">NEWS</text>
    <rect x="30" y="165" width="50" height="8" fill="#244a30" stroke="#1f3f2a" stroke-width="0.6"/>${[0,1,2,3].map(k => `<rect x="${32 + k * 12}" y="166.5" width="9" height="5" fill="#2e5a3a" stroke="#1f3f2a" stroke-width="0.5"/>`).join("")}
    <path d="M10 175 h74" stroke="#142a1c" stroke-width="2"/>`;
  if (h("boite")) s += `<g transform="translate(94 148)"><ellipse cx="6" cy="27.5" rx="9" ry="1.8" fill="#00000033"/>
    <rect x="-0.5" y="24" width="13" height="3" fill="#1c1c1c"/><rect x="0.5" y="22.5" width="11" height="1.8" fill="#2a2a2a"/>
    <rect x="0" y="5" width="12" height="18" rx="1" fill="#c8102e" stroke="#8a0a1e" stroke-width="0.8"/><rect x="9" y="5.5" width="2.8" height="17" fill="#8a0a1e" opacity="0.35"/><rect x="1" y="6" width="1.2" height="16" fill="#ffffff" opacity="0.3"/>
    <rect x="-1" y="3.8" width="14" height="2.2" rx="0.8" fill="#a00d24" stroke="#8a0a1e" stroke-width="0.5"/><path d="M0 3.8 q6 -7 12 0z" fill="#c8102e" stroke="#8a0a1e" stroke-width="0.6"/><circle cx="6" cy="-2" r="1.2" fill="#a00d24"/><rect x="5.3" y="-1" width="1.4" height="2.4" fill="#a00d24"/>
    <rect x="1.5" y="7.6" width="9" height="3.2" rx="0.6" fill="#1c1c1c" stroke="#f2c94c" stroke-width="0.5"/><rect x="2.4" y="8.5" width="7.2" height="1.2" fill="#000"/>
    <rect x="2.4" y="12.3" width="7.2" height="4.4" fill="#f4f1ea" stroke="#8a8a84" stroke-width="0.4"/><path d="M3.4 13.7 h5.2 M3.4 15.1 h3.6" stroke="#444" stroke-width="0.4"/>
    <path d="M4.2 21 l0.6 -1.6 l0.9 1 l0.9 -1.4 l0.9 1.4 l0.9 -1 l0.6 1.6z" fill="#f2c94c"/><text x="6" y="22.6" font-size="2.2" fill="#f2c94c" text-anchor="middle" font-family="serif">ER</text></g>`;
  if (h("fishchips")) s += `<rect x="318" y="140" width="4" height="36" fill="#3b2412"/><rect x="386" y="140" width="4" height="36" fill="#3b2412"/>
    <rect x="322" y="142" width="64" height="18" fill="#f4f1ea"/><rect x="324" y="146" width="60" height="2" fill="#7a4a22"/>
    ${[0,1,2].map(k=>`<ellipse cx="${332+k*9}" cy="145" rx="4" ry="1.8" fill="#d9a441" stroke="#a8742a" stroke-width="0.5"/>`).join("")}<rect x="362" y="138" width="3" height="8" rx="1" fill="#7a3a1a"/><rect x="368" y="139" width="3" height="7" rx="1" fill="#3a5a8a"/>
    <circle cx="344" cy="154" r="4.5" fill="${SKIN}"/><path d="M339 152 q5 -9 10 0z" fill="#fff"/><rect x="338" y="158" width="12" height="10" fill="#fff"/><path d="M340 158 l4 4 l4 -4" fill="#1f5aa8"/>
    <rect x="362" y="153" width="20" height="8" fill="#9aa5ad" stroke="#5a6570"/><rect x="364" y="150" width="16" height="3" fill="#3b2412"/><path d="M368 148 q-3 -4 0 -7 M374 148 q-3 -4 0 -7" fill="none" stroke="#cfd6dc" stroke-width="1.4" stroke-linecap="round"/>
    <rect x="316" y="160" width="76" height="15" fill="#7a4a22" stroke="#3b2412"/><rect x="316" y="158" width="76" height="3" fill="#c9a26a"/>${[0,1,2,3].map(k=>`<rect x="${320+k*18}" y="164" width="14" height="8" fill="#8a5a2b" stroke="#3b2412" stroke-width="0.6"/>`).join("")}
    <path d="M326 158 l3 -8 l3 8z" fill="#f4f1ea" stroke="#999" stroke-width="0.5"/>${[0,1,2].map(k=>`<line x1="${327+k*1.5}" y1="152" x2="${326.5+k*1.5}" y2="148.5" stroke="#e8c14a" stroke-width="1"/>`).join("")}
    ${[...Array(16)].map((_, j) => `<path d="M${312 + j * 5.5} 142 h5.5 L${321 + j * 5} 131 h-5z" fill="${j % 2 ? "#fff" : "#1f5aa8"}" stroke="#1f5aa8" stroke-width="0.4"/>`).join("")}
    ${[...Array(16)].map((_, j) => `<circle cx="${314.75 + j * 5.5}" cy="142" r="2.75" fill="${j % 2 ? "#fff" : "#1f5aa8"}" stroke="#1f5aa8" stroke-width="0.4"/>`).join("")}
    <rect x="320" y="120" width="68" height="11" rx="2" fill="#1f3f6a" stroke="#f2c94c" stroke-width="1.2"/><text x="354" y="128.5" font-size="7.2" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="bold">FISH &amp; CHIPS</text>
    <rect x="337" y="116" width="2" height="5" fill="#3b2412"/><rect x="369" y="116" width="2" height="5" fill="#3b2412"/>`;
  if (h("cabine")) s += `<g transform="translate(278 118)"><ellipse cx="15" cy="66" rx="19" ry="2.5" fill="#00000033"/>
    <path d="M-1 9 q16 -13 32 0z" fill="#c8102e" stroke="#8a0a1e" stroke-width="1.2"/><rect x="-1" y="9" width="32" height="2.5" fill="#a00d24"/>
    <path d="M10 4 l2 -4 l3 3 l3 -3 l2 4z" fill="#f2c94c" stroke="#8a6a1e" stroke-width="0.6"/><circle cx="15" cy="-1" r="1.2" fill="#f2c94c"/>
    <rect x="0" y="11" width="30" height="53" fill="#c8102e" stroke="#8a0a1e" stroke-width="1.5"/><rect x="2" y="12.5" width="26" height="6.5" fill="#1c1c1c"/><text x="15" y="17.6" font-size="4.4" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="bold">TELEPHONE</text>
    ${[0,1,2,3].map(r => [0,1,2].map(c => `<rect x="${2.5 + c * 9}" y="${21 + r * 9.4}" width="7.6" height="8" fill="${r === 1 ? "#fff6c0" : "#e8f4ff"}" stroke="#8a0a1e" stroke-width="1"/>`).join("")).join("")}
    <rect x="2.5" y="59" width="25" height="3.5" fill="#a00d24"/><rect x="0" y="64" width="30" height="3" fill="#1c1c1c"/>
    <rect x="24.5" y="38" width="2" height="8" rx="1" fill="#c99a2e"/><rect x="11" y="31" width="8" height="10" fill="#2a2a2a" opacity="0.75"/><circle cx="15" cy="35" r="1.6" fill="#c0c0c0"/><path d="M10 39 q-3 3 0 6" fill="none" stroke="#c0c0c0" stroke-width="0.8"/></g>`;
  // Véhicules sur la chaussée (tous tournés vers la droite), au-dessous du trottoir : rien ne cache les boutiques
  if (h("fiacre")) s += `<g transform="translate(6 195) scale(0.9)">
    <path d="M62 26 C50 26 44 34 38 34" fill="none" stroke="#3b2412" stroke-width="2"/><line x1="40" y1="33" x2="84" y2="33" stroke="#3b2412" stroke-width="2.5"/>
    <path d="M9 14 l-3 -3 M8 15 L14 25" stroke="#3b2412" stroke-width="1.6"/><rect x="5" y="12.5" width="18" height="3.5" fill="#5a3a1a"/><rect x="4" y="3" width="2.4" height="10" fill="#5a3a1a"/>
    <rect x="9" y="4" width="8.5" height="9" rx="2" fill="#2a2a3a"/><rect x="12" y="10" width="11" height="3.6" rx="1.8" fill="#2a2a3a"/><rect x="21" y="11" width="3.6" height="5.5" fill="#1c1c1c"/>
    <circle cx="13.2" cy="0.5" r="3.2" fill="${SKIN}"/><rect x="8.5" y="-1.6" width="9.5" height="1.6" fill="#111"/><rect x="10" y="-8" width="6.5" height="6.5" fill="#111"/><rect x="10" y="-3.2" width="6.5" height="1.2" fill="#a8323a"/>
    <path d="M17 6.5 Q22 7 25 4" fill="none" stroke="#2a2a3a" stroke-width="2.6" stroke-linecap="round"/><path d="M25 4 Q48 14 70 23" fill="none" stroke="#2a1a0c" stroke-width="0.8"/><path d="M24 3 l-2 -9" stroke="#3b2412" stroke-width="0.9"/>
    <path d="M12 16 h38 v22 h-42z" fill="#1c1c1c"/><path d="M9 17 q22 -16 44 0z" fill="#1c1c1c"/><rect x="31" y="21" width="15" height="10" fill="#9fb3c3"/><line x1="26" y1="18" x2="26" y2="38" stroke="#4a4a4a"/>
    <circle cx="30" cy="40" r="12" fill="none" stroke="#3b2412" stroke-width="3"/>${[0,45,90,135].map(a=>`<line x1="${(30-11*Math.cos(a*Math.PI/180)).toFixed(1)}" y1="${(40-11*Math.sin(a*Math.PI/180)).toFixed(1)}" x2="${(30+11*Math.cos(a*Math.PI/180)).toFixed(1)}" y2="${(40+11*Math.sin(a*Math.PI/180)).toFixed(1)}" stroke="#3b2412"/>`).join("")}<circle cx="30" cy="40" r="2" fill="#c99a2e"/>
    <path d="M70 22 q-12 4 -8 22" fill="none" stroke="#2a1a0c" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="82" cy="29" rx="18" ry="9" fill="#7a4a22"/>
    <path d="M88 21 L97 8 L107 2 L113 13 L103 24 L99 34 L90 30z" fill="#7a4a22"/><path d="M89 19 Q96 7 106 2" fill="none" stroke="#2a1a0c" stroke-width="3.6" stroke-linecap="round"/>
    <ellipse cx="115" cy="12" rx="12" ry="5.2" fill="#7a4a22" transform="rotate(38 115 12)"/><path d="M106 4 l2 -7 l3 6z" fill="#7a4a22"/>
    <circle cx="113" cy="9" r="1.2" fill="#000"/><circle cx="123" cy="19" r="1" fill="#2a1a0c"/>
    <path d="M96 24 q4 6 2 11" fill="none" stroke="#3b2412" stroke-width="2"/>
    ${[68,74,90,96].map(x=>`<rect x="${x}" y="33" width="3.6" height="19" fill="#7a4a22"/><rect x="${x}" y="49" width="3.6" height="3" fill="#1c1c1c"/>`).join("")}</g>`;
  if (h("taxi")) {
    // Voiture d'époque (type Ford T, années 1920) : capote en toile, carrosserie haute,
    // roues à rayons en bois, garde-boue noirs, marchepied, radiateur et phare en laiton.
    const wheel = cx => `<circle cx="${cx}" cy="38.5" r="13" fill="#ead9aa" stroke="#1c1c1c" stroke-width="3"/>` +
      [0, 30, 60, 90, 120, 150].map(a => { const dx = (10 * Math.cos(a * Math.PI / 180)).toFixed(1), dy = (10 * Math.sin(a * Math.PI / 180)).toFixed(1);
        return `<line x1="${cx - dx}" y1="${(38.5 - dy).toFixed(1)}" x2="${(cx + +dx).toFixed(1)}" y2="${(38.5 + +dy).toFixed(1)}" stroke="#8a5a2b" stroke-width="1.1"/>`; }).join("") +
      `<circle cx="${cx}" cy="38.5" r="2.6" fill="#c99a2e"/>`;
    s += `<g transform="translate(138 194) scale(0.85)">
      <rect x="3" y="1" width="60" height="5" rx="2.5" fill="#1c1c1c"/>
      <line x1="7" y1="6" x2="7" y2="13" stroke="#1c1c1c" stroke-width="2.5"/><line x1="59" y1="6" x2="59" y2="13" stroke="#1c1c1c" stroke-width="2.5"/>
      <rect x="5" y="12" width="56" height="26" rx="3" fill="#1c1c1c"/>
      <rect x="11" y="14" width="20" height="9" fill="#bfe3f0" stroke="#4a1216" stroke-width="1.5"/>
      <rect x="36" y="14" width="19" height="9" fill="#bfe3f0" stroke="#4a1216" stroke-width="1.5"/>
      <line x1="33.5" y1="12" x2="33.5" y2="38" stroke="#4a1216" stroke-width="1.5"/><circle cx="31.5" cy="29" r="1.2" fill="#c99a2e"/>
      <path d="M60 8 l5 -1 v16 h-5z" fill="#bfe3f0" stroke="#c99a2e" stroke-width="1.5"/>
      <path d="M61 25 h42 v13 h-42z" fill="#1c1c1c"/><line x1="61" y1="25" x2="103" y2="25" stroke="#4a1216" stroke-width="2"/>
      ${[68, 73, 78].map(x => `<line x1="${x}" y1="28" x2="${x}" y2="34" stroke="#4a1216" stroke-width="1.4"/>`).join("")}
      <rect x="103" y="19" width="7" height="19" rx="1.5" fill="#c99a2e"/><line x1="106.5" y1="21" x2="106.5" y2="36" stroke="#8a6a1e" stroke-width="1"/>
      <circle cx="100" cy="17" r="4" fill="#c99a2e"/><circle cx="100" cy="17" r="2.3" fill="#fff6c0"/><rect x="97" y="20" width="6" height="2" fill="#1c1c1c"/>
      <rect x="9" y="39" width="94" height="3" fill="#1c1c1c"/>
      ${wheel(23)}${wheel(88)}
      <path d="M7 40 A16 16 0 0 1 39 40" fill="none" stroke="#1c1c1c" stroke-width="3.2"/>
      <path d="M72 40 A16 16 0 0 1 104 40" fill="none" stroke="#1c1c1c" stroke-width="3.2"/>
    </g>`;
  }
  if (h("bus")) s += `<g transform="translate(232 168.4) scale(1.38)">
    <path d="M14 2 H100 Q113 2 115 14 V46 H14z" fill="#c8102e" stroke="#8a0a1e" stroke-width="1.5"/>
    <rect x="14" y="22" width="101" height="4" fill="#f4f1ea"/>
    ${[0,1,2,3,4].map(k => `<rect x="${20 + k * 15}" y="7" width="12" height="12" fill="#cfe3ee" stroke="#8a0a1e"/>`).join("")}
    ${[0,1,2,3,4].map(k => `<rect x="${20 + k * 16}" y="29" width="13" height="12" fill="#cfe3ee" stroke="#8a0a1e"/>`).join("")}
    <path d="M97 6 h8 q6 0 7 8 v6 h-15z" fill="#cfe3ee" stroke="#8a0a1e"/><rect x="98" y="23" width="14" height="5" fill="#1c1c1c"/><text x="105" y="26.8" font-size="3.6" fill="#f2c94c" text-anchor="middle" font-family="sans-serif" font-weight="bold">LONDON</text>
    <rect x="99" y="28" width="11" height="14" rx="1" fill="#cfe3ee" stroke="#8a0a1e"/><circle cx="104.5" cy="34" r="3" fill="${SKIN}"/><path d="M100.5 42 q4 -6 8 0z" fill="#2c3e6a"/>
    <circle cx="114" cy="43" r="3" fill="#fff6c0" stroke="#8a6a1e"/><rect x="112" y="45" width="7" height="4" rx="1" fill="#555"/>
    <path d="M25 48 a11 11 0 0 1 22 0z M87 48 a10 10 0 0 1 20 0z" fill="#8a0a1e"/>
    <circle cx="36" cy="49" r="8.5" fill="#222" stroke="#999" stroke-width="2"/><circle cx="36" cy="49" r="2.5" fill="#bbb"/>
    <circle cx="97" cy="49" r="8" fill="#222" stroke="#999" stroke-width="2"/><circle cx="97" cy="49" r="2.3" fill="#bbb"/></g>`;
  return s + "</svg>";
}

/* Inspecteur seul (petit portrait pour les énigmes). */
function drawPortrait(equipped){
  return `<svg viewBox="140 50 120 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${drawInspector(equipped)}</svg>`;
}

if (typeof module !== "undefined") module.exports = { ITEMS, SLOT_NAMES, DECOR_SLOTS, itemLocked, drawScene, drawStreet, drawPortrait };
