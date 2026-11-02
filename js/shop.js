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
  { id:"coussin",   slot:"home", name:"Coussin Union Jack",                price:10 },
  { id:"persan",    slot:"home", name:"Tapis persan",                      price:15 },
  { id:"service",   slot:"home", name:"Service à thé",                     price:20 },
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
  { id:"jardinieres", slot:"street", name:"Jardinières aux fenêtres",      price:25 },
  { id:"plaque",    slot:"street", name:"Plaque bleue commémorative",      price:30 },
  { id:"kiosque",   slot:"street", name:"Kiosque à journaux",              price:60 },
  { id:"fishchips", slot:"street", name:"Stand de fish & chips",           price:90 },
  { id:"bigben",    slot:"street", name:"Vue sur Big Ben",                 price:120 },
  // Véhicules
  { id:"fiacre",    slot:"vehicle", name:"Fiacre (hansom cab)",            price:70 },
  { id:"blackcab",  slot:"vehicle", name:"Black cab",                      price:180 },
  { id:"bus",       slot:"vehicle", name:"Bus rouge à impériale",          price:280 }
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
  if (h("portrait")) s += `<rect x="272" y="160" width="36" height="44" fill="#c99a2e"/><rect x="277" y="165" width="26" height="34" fill="#2c3e6a"/>
    <circle cx="290" cy="178" r="7" fill="${SKIN}"/><path d="M283 172 l2 -6 l3 4 l2 -5 l2 5 l3 -4 l2 6z" fill="#f2c94c"/><path d="M280 199 q10 -14 20 0z" fill="#6a2c8a"/>`;
  if (h("cheminee")) s += `<rect x="252" y="210" width="76" height="8" fill="#e8e0d0"/><rect x="258" y="218" width="64" height="38" fill="#cfc4b0"/>
    <rect x="272" y="226" width="36" height="30" fill="#1c1c1c"/><path d="M280 256 q4 -18 10 -6 q4 -14 10 6z" fill="#f28c28"/><path d="M285 256 q4 -10 5 -2 q3 -8 6 2z" fill="#ffe27a"/>`;
  if (h("service")) s += `<rect x="342" y="236" width="44" height="5" fill="#6b3f1d"/><rect x="346" y="241" width="3" height="21" fill="#6b3f1d"/><rect x="379" y="241" width="3" height="21" fill="#6b3f1d"/>
    <path d="M352 236 q0 -14 12 -14 q12 0 12 14z" fill="#f4f1ea" stroke="#2c4a8a" stroke-width="1.5"/><path d="M376 228 q8 -2 6 6" fill="none" stroke="#2c4a8a" stroke-width="2"/>
    <path d="M352 230 l-7 -4" stroke="#2c4a8a" stroke-width="2"/><circle cx="364" cy="221" r="2" fill="#2c4a8a"/>`;
  if (h("fauteuil")) s += `<rect x="18" y="226" width="64" height="34" rx="6" fill="#7a1f26"/><rect x="14" y="236" width="12" height="26" rx="5" fill="#5e161c"/><rect x="74" y="236" width="12" height="26" rx="5" fill="#5e161c"/>
    <rect x="24" y="246" width="52" height="12" rx="3" fill="#8f2830"/>${[30,42,54,66].map(x=>`<circle cx="${x}" cy="236" r="1.5" fill="#3a0c10"/>`).join("")}`;
  if (h("gramophone")) s += `<rect x="104" y="232" width="36" height="30" fill="#6b3f1d"/><rect x="108" y="226" width="28" height="6" fill="#3b2412"/>
    <line x1="126" y1="226" x2="130" y2="206" stroke="#c99a2e" stroke-width="2.5"/><path d="M130 206 l18 -22 q6 10 -2 26z" fill="#c99a2e" stroke="#8a6a1e"/>`;
  if (h("persan")) s += `<ellipse cx="200" cy="284" rx="100" ry="12" fill="#8a2c2c"/><ellipse cx="200" cy="284" rx="86" ry="8" fill="none" stroke="#2c4a8a" stroke-width="3"/>
    <ellipse cx="200" cy="284" rx="70" ry="5" fill="none" stroke="#e0b050" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  if (h("coussin")) s += `<g transform="translate(90 268)"><rect width="26" height="18" rx="3" fill="#1f3f8a"/><path d="M0 0 L26 18 M26 0 L0 18" stroke="#fff" stroke-width="4"/>
    <path d="M0 0 L26 18 M26 0 L0 18" stroke="#c8102e" stroke-width="1.5"/><path d="M13 0 v18 M0 9 h26" stroke="#fff" stroke-width="6"/><path d="M13 0 v18 M0 9 h26" stroke="#c8102e" stroke-width="3"/></g>`;
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
  if (h("buste")) s += `<rect x="40" y="100" width="26" height="28" fill="#e8e0d0"/><rect x="36" y="96" width="34" height="5" fill="#d0c6b4"/>
    <path d="M41 96 q12 -16 24 0z" fill="#f0ece4"/><circle cx="53" cy="80" r="9" fill="#f0ece4"/><path d="M46 76 q7 -8 14 0" fill="none" stroke="#c9c1b2" stroke-width="2"/><path d="M50 87 q3 3 6 0" fill="none" stroke="#c9c1b2" stroke-width="2"/>`;
  if (h("machine")) s += `<rect x="130" y="96" width="92" height="6" fill="#6b3f1d"/><rect x="134" y="102" width="6" height="26" fill="#6b3f1d"/><rect x="212" y="102" width="6" height="26" fill="#6b3f1d"/>
    <path d="M160 96 l4 -12 h28 l4 12z" fill="#1c1c1c"/><rect x="166" y="78" width="24" height="8" fill="#f4f1ea"/>${[0,1,2,3,4].map(k=>`<circle cx="${167+k*5.5}" cy="92" r="1.5" fill="#cfcfcf"/>`).join("")}`;
  if (h("violon")) s += `<g transform="rotate(-20 236 60)"><ellipse cx="236" cy="74" rx="11" ry="13" fill="#a0521d"/><ellipse cx="236" cy="54" rx="9" ry="10" fill="#a0521d"/>
    <rect x="234" y="24" width="4" height="34" fill="#3b2412"/><path d="M233 66 q3 -4 6 0 M233 66 q3 4 6 0" fill="none" stroke="#3b2412"/></g>
    <line x1="252" y1="22" x2="262" y2="96" stroke="#8a6a3a" stroke-width="2"/>`;
  if (h("lit")) s += `<rect x="282" y="34" width="5" height="94" fill="#4a2a12"/><rect x="385" y="34" width="5" height="94" fill="#4a2a12"/><rect x="278" y="30" width="116" height="8" fill="#4a2a12"/>
    <path d="M287 38 q10 30 0 60 h10 q-8 -30 -4 -60z M385 38 q-10 30 0 60 h-10 q8 -30 4 -60z" fill="#2c4a8a"/>
    <rect x="290" y="96" width="94" height="22" fill="#f4f1ea"/><rect x="290" y="104" width="94" height="16" fill="#2c4a8a"/><rect x="292" y="90" width="22" height="10" rx="4" fill="#fff"/>`;
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
  return `<g transform="translate(250 266)"><ellipse cx="18" cy="12" rx="18" ry="8" fill="#e08a3c"/><ellipse cx="18" cy="15" rx="12" ry="5" fill="#fff"/>
    <circle cx="36" cy="4" r="8" fill="#e08a3c"/><path d="M31 -2 l1 -9 l5 6z M38 -3 l4 -8 l2 8z" fill="#e08a3c"/><ellipse cx="41" cy="7" rx="4" ry="3" fill="#fff"/>
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
  let s = `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="La rue de l'inspecteur Bramble">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa8b5"/><stop offset="1" stop-color="#dfe4e8"/></linearGradient>
      <pattern id="brick" width="16" height="8" patternUnits="userSpaceOnUse"><rect width="16" height="8" fill="#9c4a32"/><path d="M0 7.5 h16 M8 0 v4 M0 4 h16 M0 4 v4 M16 4 v4" stroke="#7a3624" stroke-width="1"/></pattern></defs>
    <rect width="400" height="220" fill="url(#sky)"/>
    <ellipse cx="80" cy="26" rx="40" ry="10" fill="#f0f2f4"/><ellipse cx="290" cy="18" rx="50" ry="9" fill="#f0f2f4"/>`;
  if (h("bigben")) s += `<g fill="#b8a27a" stroke="#6b5a3a"><rect x="346" y="40" width="26" height="90"/><path d="M344 40 l15 -30 l15 30z"/></g>
    <circle cx="359" cy="56" r="8" fill="#f4f1ea" stroke="#3b2412"/><path d="M359 56 v-5 M359 56 l4 2" stroke="#000" stroke-width="1.2"/><line x1="359" y1="10" x2="359" y2="2" stroke="#6b5a3a" stroke-width="2"/>`;
  // Maisons voisines et façade de l'appartement
  s += `<rect x="0" y="50" width="105" height="125" fill="#c9b79a"/><rect x="275" y="70" width="125" height="105" fill="#d8d2c4"/>
    ${[18,62].map(x=>`<rect x="${x}" y="70" width="24" height="30" fill="#5a6a78"/><rect x="${x}" y="120" width="24" height="30" fill="#5a6a78"/>`).join("")}
    ${[295,345].map(x=>`<rect x="${x}" y="88" width="24" height="28" fill="#5a6a78"/>`).join("")}
    <rect x="105" y="30" width="170" height="145" fill="url(#brick)"/>
    <rect x="105" y="105" width="170" height="70" fill="#efe9dc"/><rect x="100" y="24" width="180" height="8" fill="#efe9dc"/><rect x="100" y="102" width="180" height="5" fill="#d8cfbc"/>
    ${[125,215].map(x=>`<rect x="${x}" y="45" width="40" height="46" fill="#3e4c5a" stroke="#fff" stroke-width="3"/><line x1="${x+20}" y1="45" x2="${x+20}" y2="91" stroke="#fff" stroke-width="2"/>`).join("")}
    <rect x="120" y="118" width="40" height="40" fill="#3e4c5a" stroke="#fff" stroke-width="3"/>
    <rect x="172" y="112" width="36" height="58" fill="#111"/><path d="M172 112 q18 -14 36 0z" fill="#9fb3c3" stroke="#efe9dc" stroke-width="2"/>
    <circle cx="200" cy="142" r="2" fill="#c99a2e"/><text x="190" y="132" font-size="8" fill="#c99a2e" text-anchor="middle" font-family="serif">221B</text>
    <rect x="166" y="170" width="48" height="5" fill="#cfcfcf"/>
    ${[220,232,244,256,268].map(x=>`<line x1="${x}" y1="152" x2="${x}" y2="175" stroke="#111" stroke-width="2"/>`).join("")}<line x1="216" y1="152" x2="272" y2="152" stroke="#111" stroke-width="2"/>
    <rect y="175" width="400" height="12" fill="#a9a9a3"/><rect y="187" width="400" height="33" fill="#4a4a4e"/>
    ${[20,90,160,230,300,370].map(x=>`<rect x="${x}" y="202" width="30" height="3" fill="#e8e8e8"/>`).join("")}`;
  if (h("plaque")) s += `<circle cx="252" cy="122" r="11" fill="#1f5aa8" stroke="#fff" stroke-width="1.5"/><path d="M245 120 h14 M246 124 h12 M248 128 h8" stroke="#fff" stroke-width="1.2"/>`;
  if (h("jardinieres")) s += [125,215].map(x=>`<rect x="${x-2}" y="91" width="44" height="7" fill="#3b2412"/>` +
    [0,1,2,3,4,5].map(k=>`<circle cx="${x+3+k*7}" cy="89" r="3" fill="${["#c8102e","#f2c94c","#d36ac2"][k%3]}"/>`).join("")).join("");
  if (h("kiosque")) s += `<rect x="12" y="132" width="70" height="43" fill="#2e5a3a"/><path d="M6 132 l10 -14 h62 l10 14z" fill="#1f3f2a"/>
    <rect x="18" y="140" width="58" height="22" fill="#f4f1ea"/>${[0,1,2,3].map(k=>`<rect x="${21+k*14}" y="143" width="11" height="16" fill="#fff" stroke="#999"/><path d="M${23+k*14} 147 h7 M${23+k*14} 151 h7" stroke="#333"/>`).join("")}
    <text x="47" y="129" font-size="7" fill="#f2c94c" text-anchor="middle" font-family="serif">NEWS</text>`;
  if (h("boite")) s += `<rect x="284" y="142" width="16" height="33" rx="2" fill="#c8102e"/><path d="M282 144 q10 -12 20 0z" fill="#c8102e"/><rect x="286" y="150" width="12" height="2" fill="#1c1c1c"/><rect x="282" y="172" width="20" height="4" fill="#1c1c1c"/>`;
  if (h("fishchips")) s += `<rect x="320" y="142" width="70" height="33" fill="#f4f1ea" stroke="#1f3f6a" stroke-width="2"/><path d="M314 142 l8 -14 h66 l8 14z" fill="#1f5aa8"/>
    ${[322,338,354,370,386].map(x=>`<path d="M${x-8} 142 l8 -14 h8 l-8 14z" fill="#fff"/>`).join("")}
    <text x="355" y="160" font-size="8" fill="#1f3f6a" text-anchor="middle" font-family="sans-serif">FISH &amp; CHIPS</text>
    <circle cx="329" cy="181" r="4" fill="#222"/><circle cx="381" cy="181" r="4" fill="#222"/>`;
  if (h("fiacre")) s += `<g transform="translate(14 160)"><path d="M28 6 h32 v24 h-36z" fill="#1c1c1c"/><path d="M26 6 q16 -10 36 0" fill="#1c1c1c"/><rect x="32" y="10" width="16" height="12" fill="#9fb3c3"/>
    <circle cx="44" cy="34" r="11" fill="none" stroke="#3b2412" stroke-width="3"/><path d="M44 23 v22 M33 34 h22" stroke="#3b2412"/>
    <path d="M60 22 h28" stroke="#3b2412" stroke-width="2"/><ellipse cx="96" cy="26" rx="12" ry="7" fill="#6b3f1d"/><path d="M104 22 l8 -12 l4 4 l-6 10z" fill="#6b3f1d"/>
    ${[88,92,100,104].map(x=>`<line x1="${x}" y1="30" x2="${x}" y2="44" stroke="#6b3f1d" stroke-width="2.5"/>`).join("")}</g>`;
  if (h("blackcab")) s += `<g transform="translate(150 174)"><path d="M4 30 v-12 q0 -6 8 -6 h10 l10 -12 h30 l10 12 h12 q8 0 8 8 v10z" fill="#151515"/>
    <rect x="36" y="3" width="14" height="10" fill="#9fb3c3"/><rect x="54" y="3" width="14" height="10" fill="#9fb3c3"/><rect x="44" y="-4" width="12" height="4" fill="#f2c94c"/>
    <circle cx="22" cy="32" r="7" fill="#222" stroke="#999" stroke-width="2"/><circle cx="76" cy="32" r="7" fill="#222" stroke="#999" stroke-width="2"/></g>`;
  if (h("bus")) s += `<g transform="translate(268 136)"><rect width="120" height="70" rx="6" fill="#c8102e"/>
    ${[0,1,2,3,4].map(k=>`<rect x="${8+k*22}" y="8" width="18" height="16" fill="#cfe3ee"/><rect x="${8+k*22}" y="36" width="18" height="16" fill="#cfe3ee"/>`).join("")}
    <rect y="28" width="120" height="4" fill="#f2c94c"/><rect x="88" y="0" width="30" height="6" fill="#1c1c1c"/>
    <circle cx="24" cy="70" r="9" fill="#222" stroke="#999" stroke-width="2"/><circle cx="96" cy="70" r="9" fill="#222" stroke="#999" stroke-width="2"/></g>`;
  return s + "</svg>";
}

/* Inspecteur seul (petit portrait pour les énigmes). */
function drawPortrait(equipped){
  return `<svg viewBox="140 50 120 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${drawInspector(equipped)}</svg>`;
}

if (typeof module !== "undefined") module.exports = { ITEMS, SLOT_NAMES, DECOR_SLOTS, itemLocked, drawScene, drawStreet, drawPortrait };
