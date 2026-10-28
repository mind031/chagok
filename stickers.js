// 차곡차곡 손그림 스티커 — 직접 그린 원본 그림 (viewBox 0 0 100 100)
const O = "#4a3a33";
const C = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
const E = (x, y, rx, ry, f, rot = 0) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ""}/>`;
const R = (x, y, w, h, r, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"/>`;
const P = (d, f = "none") => `<path d="${d}" fill="${f}"/>`;
const L = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none"/>`;
// 얼굴: 점 눈, 작은 웃음, 볼터치 (선 없이)
const face = (x, y, s = 1, blush = "#ff9fb2") =>
  `<g stroke="none">${C(x - 7 * s, y, 2.6 * s, O)}${C(x + 7 * s, y, 2.6 * s, O)}` +
  `${E(x - 12 * s, y + 5 * s, 3.4 * s, 2.2 * s, blush)}${E(x + 12 * s, y + 5 * s, 3.4 * s, 2.2 * s, blush)}</g>` +
  `<path d="M${x - 3.5 * s} ${y + 4 * s}q${3.5 * s} ${3.5 * s} ${7 * s} 0" fill="none" stroke-width="${2.6 * s}"/>`;

const DRAW = {
  /* ---------- 냠냠 간식 ---------- */
  "milk": () => P("M30 36L50 18L70 36Z", "#ffe3ec") + R(30, 36, 40, 50, 6, "#ffc2d6") + C(50, 50, 6, "#ff6b86") + face(50, 66),
  "bungeo": () => P("M70 52L90 36Q86 52 90 68Z", "#eea952") + E(44, 52, 30, 21, "#f4b862") + P("M58 42q6 10 0 20M64 44q5 8 0 16", "none") + face(36, 50, .95),
  "tteok": () => L(18, 86, 82, 14) + E(36, 66, 12, 10, "#ff7b62", -42) + E(50, 50, 12, 10, "#ff7b62", -42) + E(64, 34, 12, 10, "#ff7b62", -42) + face(50, 48, .7),
  "gimbap": () => C(50, 52, 32, "#33443a") + C(50, 52, 24, "#fffdf6") + C(50, 60, 4.5, "#ffd23f") + C(42, 61, 4, "#ff8a3d") + C(58, 61, 4, "#7cc56b") + face(50, 44, .85),
  "hotteok": () => E(50, 56, 34, 25, "#e9a24e") + P("M30 50q6 -5 12 0M58 48q6 -5 12 0", "none") + face(50, 58),
  "icebar": () => R(45, 66, 10, 22, 4, "#e8c48f") + R(31, 14, 38, 56, 17, "#9ee3cc") + P("M31 32h38", "none") + face(50, 48),
  "tangerine": () => C(50, 56, 29, "#ffa53a") + E(56, 26, 9, 5, "#6cc35b", -25) + L(50, 28, 50, 34) + face(50, 58),
  "watermelon": () => P("M14 38A36 36 0 0 0 86 38Z", "#5cb85c") + P("M21 38A29 29 0 0 0 79 38Z", "#ff6b7f") + `<g stroke="none">${E(36, 50, 2, 3, O)}${E(64, 50, 2, 3, O)}${E(50, 60, 2, 3, O)}</g>` + face(50, 44, .8),
  "honey": () => R(26, 26, 48, 12, 6, "#c98a3d") + P("M24 42Q22 86 50 86Q78 86 76 42Z", "#f2b457") + P("M34 38q0 10 5 10t5 -10", "#ffd94a") + face(50, 62),
  "macaron": () => R(22, 26, 56, 20, 10, "#c7b6ff") + R(25, 46, 50, 9, 4, "#fff6f0") + R(22, 55, 56, 20, 10, "#c7b6ff") + face(50, 36, .8),
  "banana": () => P("M22 34Q30 80 82 72Q86 66 80 64Q42 66 34 30Z", "#ffd84a") + L(30, 30, 36, 24) + face(54, 60, .8),
  "gummy": () => C(36, 28, 8, "#ff7a8a") + C(64, 28, 8, "#ff7a8a") + C(50, 40, 18, "#ff7a8a") + E(50, 70, 20, 18, "#ff7a8a") + C(30, 66, 7, "#ff7a8a") + C(70, 66, 7, "#ff7a8a") + face(50, 40, .8, "#ffc2cb"),

  /* ---------- 동글 동물 ---------- */
  "penguin": () => E(50, 56, 28, 32, "#4d5a73") + E(50, 62, 18, 23, "#fffdf6") + P("M45 47l5 5l5 -5Z", "#ffb23f") + E(38, 88, 8, 4, "#ffb23f") + E(62, 88, 8, 4, "#ffb23f") + face(50, 36, .75),
  "whale": () => P("M82 46q10 -14 10 -2q-2 8 -10 10", "#7cc3f0") + P("M12 56Q14 28 48 30Q82 32 84 56Q82 78 48 76Q14 74 12 56Z", "#8fd0f7") + P("M44 30q-4 -12 -10 -12M44 30q2 -12 10 -14", "none") + face(36, 54),
  "panda": () => C(28, 28, 10, O) + C(72, 28, 10, O) + C(50, 54, 32, "#fffdf6") + `<g stroke="none">${E(38, 52, 8, 10, O, 20)}${E(62, 52, 8, 10, O, -20)}${C(38, 52, 2.4, "#fff")}${C(62, 52, 2.4, "#fff")}${E(26, 62, 3.4, 2.2, "#ff9fb2")}${E(74, 62, 3.4, 2.2, "#ff9fb2")}</g>` + P("M46 64q4 4 8 0", "none"),
  "duck": () => P("M20 62Q20 40 44 44Q46 22 62 24Q76 26 72 42Q90 46 84 66Q78 86 50 84Q22 84 20 62Z", "#fff7c2") + P("M74 36l14 2l-12 6Z", "#ffa53a") + P("M30 62q10 8 20 0", "none") + face(62, 34, .7),
  "squirrel": () => P("M66 80Q96 70 88 40Q82 18 66 30Q78 46 64 64Z", "#d79a5f") + E(44, 60, 22, 24, "#e7ad70") + C(28, 26, 6, "#e7ad70") + C(56, 26, 6, "#e7ad70") + C(42, 42, 18, "#e7ad70") + E(44, 66, 11, 13, "#fbe3c4") + face(42, 42, .75),
  "cat": () => P("M22 40L26 14L44 30ZM78 40L74 14L56 30Z", "#ffcf8a") + E(50, 52, 32, 27, "#ffcf8a") + P("M40 32q4 -4 10 0M50 32q4 -4 10 0", "none") + face(50, 54),
  "puppy": () => E(50, 52, 28, 26, "#f6e1c2") + E(22, 50, 9, 18, "#c88f5c", 14) + E(78, 50, 9, 18, "#c88f5c", -14) + E(62, 44, 7, 6, "#e6c49a") + face(50, 52) + `<g stroke="none">${E(50, 60, 3.4, 2.4, O)}</g>`,
  "bunny": () => E(38, 26, 8, 20, "#fffdf6", -8) + E(62, 26, 8, 20, "#fffdf6", 8) + `<g stroke="none">${E(38, 28, 3.5, 12, "#ffc8d4", -8)}${E(62, 28, 3.5, 12, "#ffc8d4", 8)}</g>` + E(50, 62, 30, 25, "#fffdf6") + face(50, 62),
  "hamster": () => C(28, 32, 8, "#f2b878") + C(72, 32, 8, "#f2b878") + P("M18 60Q18 30 50 30Q82 30 82 60Q82 84 50 84Q18 84 18 60Z", "#f2b878") + P("M32 70Q32 60 50 62Q68 60 68 70Q68 80 50 80Q32 80 32 70Z", "#fffdf6") + face(50, 48, .85),
  "turtle": () => C(20, 56, 10, "#bfe39a") + E(38, 78, 7, 5, "#bfe39a") + E(70, 78, 7, 5, "#bfe39a") + P("M28 70Q28 34 56 34Q84 34 84 70Z", "#7cc56b") + P("M44 52l12 -8l12 8l-4 12h-16Z", "#a8dc8a") + face(20, 54, .55),
  "octopus": () => P("M22 60q-6 20 6 20M36 64q-4 22 8 18M56 64q4 22 -8 18M70 60q8 20 -4 22", "none") + P("M18 52Q18 18 50 18Q82 18 82 52Q82 68 50 68Q18 68 18 52Z", "#ff9cb8") + face(50, 46),
  "sheep": () => P("M30 30a10 10 0 0 1 20 -4a10 10 0 0 1 20 4a10 10 0 0 1 6 18a10 10 0 0 1 -6 18a10 10 0 0 1 -20 4a10 10 0 0 1 -20 -4a10 10 0 0 1 -6 -18a10 10 0 0 1 6 -18Z", "#fffdf6") + E(50, 54, 15, 13, "#f6e1c2") + face(50, 54, .7),

  /* ---------- 하늘·꽃 ---------- */
  "sun": () => P("M50 8v10M50 82v10M8 50h10M82 50h10M20 20l7 7M73 73l7 7M80 20l-7 7M27 73l-7 7", "none") + C(50, 50, 24, "#ffd23f") + face(50, 50),
  "moon": () => P("M64 14Q30 18 30 52Q30 86 66 88Q40 78 40 50Q40 24 64 14Z", "#ffe27a") + face(46, 52, .5),
  "cloud": () => P("M24 70Q8 70 10 56Q12 44 26 46Q26 28 44 28Q58 28 62 40Q66 32 76 36Q88 40 86 52Q96 56 92 66Q90 72 80 72Z", "#cfeaff") + face(52, 54),
  "rainbow": () => P("M12 74A38 38 0 0 1 88 74", "none") + `<g fill="none" stroke-width="7">${["#ff8a8a", "#ffc261", "#8fd58f", "#8fc7ff"].map((c, i) => `<path d="M${16 + i * 7} 74A${34 - i * 7} ${34 - i * 7} 0 0 1 ${84 - i * 7} 74" stroke="${c}"/>`).join("")}</g>` + E(20, 76, 12, 8, "#fffdf6") + E(80, 76, 12, 8, "#fffdf6"),
  "star": () => P("M50 12L61 37L88 39L67 57L74 84L50 69L26 84L33 57L12 39L39 37Z", "#ffd84a") + face(50, 52, .85),
  "heart": () => P("M50 84Q14 60 14 38Q14 18 32 18Q44 18 50 30Q56 18 68 18Q86 18 86 38Q86 60 50 84Z", "#ff7f9c") + face(50, 46, .9, "#ffc2cf"),
  "ladybug": () => C(50, 30, 12, O) + E(50, 60, 30, 26, "#ff6b6b") + L(50, 36, 50, 86) + `<g stroke="none">${C(36, 54, 5, O)}${C(64, 54, 5, O)}${C(38, 72, 4, O)}${C(62, 72, 4, O)}${C(45, 28, 2, "#fff")}${C(55, 28, 2, "#fff")}</g>`,
  "snail": () => P("M10 78Q10 66 30 68H88Q92 78 80 80H16Z", "#ffd9b8") + L(26, 68, 20, 52) + L(32, 68, 34, 52) + C(20, 50, 3, O) + C(34, 50, 3, O) + C(58, 52, 22, "#c9a6ff") + P("M58 52m-6 0a6 6 0 1 0 6 -6a12 12 0 1 0 12 12", "none") + face(26, 74, .5),
  "sprout": () => R(32, 62, 36, 26, 6, "#e7a978") + R(28, 56, 44, 10, 4, "#d79464") + L(50, 56, 50, 36) + E(38, 32, 13, 8, "#8fd58f", -25) + E(62, 30, 13, 8, "#8fd58f", 25) + face(50, 74, .6),
  "sunflower": () => L(50, 70, 50, 94) + [0, 45, 90, 135, 180, 225, 270, 315].map(a => E(50 + 22 * Math.cos(a * Math.PI / 180), 42 + 22 * Math.sin(a * Math.PI / 180), 10, 7, "#ffd23f", a)).join("") + C(50, 42, 16, "#a8703f") + face(50, 42, .6, "#d98a6a"),
  "tulip": () => L(50, 56, 50, 92) + E(38, 80, 10, 5, "#8fd58f", -30) + P("M28 28L40 38L50 24L60 38L72 28Q76 62 50 62Q24 62 28 28Z", "#ff8fb0") + face(50, 46, .65),
  "umbrella": () => P("M50 52V82q0 8 -8 8q-6 0 -6 -6", "none") + P("M12 52Q14 18 50 16Q86 18 88 52Q80 46 70 52Q60 46 50 52Q40 46 30 52Q20 46 12 52Z", "#8fc7ff") + L(50, 16, 50, 10) + face(50, 36, .7)
};

export const DRAWN_PACKS = [
  { id: "snack", name: "냠냠 간식", color: "#ffe1cc", items: ["milk", "bungeo", "tteok", "gimbap", "hotteok", "icebar", "tangerine", "watermelon", "honey", "macaron", "banana", "gummy"] },
  { id: "animal", name: "동글 동물", color: "#e3f1ff", items: ["penguin", "whale", "panda", "duck", "squirrel", "cat", "puppy", "bunny", "hamster", "turtle", "octopus", "sheep"] },
  { id: "sky", name: "하늘과 꽃", color: "#fff4c7", items: ["sun", "moon", "cloud", "rainbow", "star", "heart", "ladybug", "snail", "sprout", "sunflower", "tulip", "umbrella"] }
];

export const NAMES = {
  milk: "딸기우유", bungeo: "붕어빵", tteok: "떡꼬치", gimbap: "김밥", hotteok: "호떡", icebar: "아이스바", tangerine: "귤", watermelon: "수박", honey: "꿀단지", macaron: "마카롱", banana: "바나나", gummy: "젤리곰",
  penguin: "펭귄", whale: "고래", panda: "판다", duck: "오리", squirrel: "다람쥐", cat: "고양이", puppy: "강아지", bunny: "토끼", hamster: "햄스터", turtle: "거북이", octopus: "문어", sheep: "양",
  sun: "해님", moon: "달님", cloud: "구름", rainbow: "무지개", star: "별", heart: "하트", ladybug: "무당벌레", snail: "달팽이", sprout: "새싹", sunflower: "해바라기", tulip: "튤립", umbrella: "우산"
};

// 흰 테두리(칼선)까지 있는 스티커 SVG
export function stickerSVG(id) {
  const f = DRAW[id]; if (!f) return "";
  const body = f();
  return `<svg viewBox="-6 -6 112 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
    `<g class="cut" stroke="#fff" stroke-width="15" stroke-linejoin="round" stroke-linecap="round" fill="#fff">${body}</g>` +
    `<g stroke="${O}" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
}
export const isDrawn = s => typeof s === "string" && s.startsWith("d:") && !!DRAW[s.slice(2)];
