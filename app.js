// 차곡차곡 — 아이 주간 미션 스티커판
import { DRAWN_PACKS, NAMES, stickerSVG, isDrawn, SHEET_PACKS, isSheet, sheetImg } from "./stickers.js";
const FB_VER = "10.12.2";

const IW = 1448, IH = 1086;
const COLS = [[436,575],[578,717],[720,859],[862,1001],[1004,1143],[1146,1285],[1288,1418]];
const ROWS = [[189,262],[262,337],[341,413],[413,486],[490,560],[560,630],[630,701],[705,772],[772,839],[839,895]];
const MISSIONS = ["아침에 씻고 양치하기","옷 입고 정리하기","샤워하기","가방 정리하고 물건 제자리에 놓기","저녁 식사 잘 하기","자기 전에 양치하기","10시 전 잠자기","가지고 논 장난감 정리하기","집안일하기","공부하기"];
const DAYS = ["월","화","수","목","금","토","일"];
const TIERS = [[30,1000],[40,1500],[50,2000],[60,2500],[65,3000]];
const TIER_BOX = [[38,958,134,1062],[140,958,238,1062],[242,958,340,1062],[344,958,442,1062],[446,958,544,1062]];
// 스티커 팩: 엄마·아빠가 준 스티커 판 8개
const PACKS = SHEET_PACKS;
// 예전에 붙인 스티커도 그대로 보이게
const OLD_STICKERS = [...DRAWN_PACKS.flatMap(p => p.items.map(id => "d:" + id)),
  ..."🐶 🐱 🐰 🐻 🐼 🐨 🐯 🦁 🐸 🐷 🐥 🐧 🐳 🦄 🐹 🦊 🍓 🍎 🍌 🍇 🍑 🍉 🍒 🍊 🍩 🧁 🍭 🍦 ⭐ 🌈 💖 🌸 🎀 💎 🚀 🚒 🚂 🛸 🦖 🐲".split(" ")];
const STICKERS = PACKS.flatMap(p => p.items);
const stickerLabel = s => isSheet(s) ? "" : isDrawn(s) ? NAMES[s.slice(2)] : s;
const stickerHTML = s => isSheet(s) ? sheetImg(s) : isDrawn(s) ? stickerSVG(s.slice(2)) : `<i>${esc(s)}</i>`;
const isPic = s => isSheet(s) || isDrawn(s);
const HELLO = "매일 매일<br>스티커를 모아보자!";

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");
const keyOf = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const parse = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const monday = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const won = n => n.toLocaleString("ko-KR");
const rewardFor = c => { let r = 0; for (const [t, w] of TIERS) if (c >= t) r = w; return r; };
const box = (x1, y1, x2, y2) => `left:${x1/IW*100}%;top:${y1/IH*100}%;width:${(x2-x1)/IW*100}%;height:${(y2-y1)/IH*100}%`;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

let weeks = {}, settings = {};
let cur = keyOf(monday(new Date()));
let parent = false, parentTimer = null;
const count = (k, ok = true) => { let n = 0; for (const v of Object.values((weeks[k] || {}).cells || {})) if (v && !!v.ok === ok) n++; return n; };

/* ---------- 저장소: 파이어베이스가 설정돼 있으면 온라인, 아니면 이 기기 ---------- */
const store = {
  mode: "local",
  fb: null, uid: null,
  saveLocal() { try { localStorage.setItem("chagok", JSON.stringify({ weeks, settings })); } catch (e) {} },
  loadLocal() { try { const o = JSON.parse(localStorage.getItem("chagok") || "{}"); weeks = o.weeks || {}; settings = o.settings || {}; } catch (e) {} },
  writeCell(k, ck, val) {
    if (this.mode === "local") return this.saveLocal();
    const { doc, setDoc, db } = this.fb;
    setDoc(doc(db, "families", this.uid, "weeks", k), { start: k, cells: { [ck]: val } }, { merge: true })
      .catch(() => note("저장이 잠깐 안 됐어요. 인터넷 연결을 확인해 주세요."));
  },
  writeSettings() {
    if (this.mode === "local") return this.saveLocal();
    const { doc, setDoc, db } = this.fb;
    setDoc(doc(db, "families", this.uid, "settings", "main"), settings, { merge: true })
      .catch(() => note("설정을 저장하지 못했어요."));
  }
};
function note(t) { $("syncNote").textContent = t; }

function writeCell(k, ck, val) {
  const w = weeks[k] || (weeks[k] = { start: k, cells: {} });
  w.cells = { ...w.cells, [ck]: val };
  render();
  store.writeCell(k, ck, val);
}

/* ---------- 겹쳐 놓을 자리 ---------- */
function buildOverlay() {
  let h = "";
  h += `<div class="o patch" style="${box(636,36,828,122)}"></div>`;
  h += `<button class="o pbtn" id="parentBtn" style="${box(640,40,824,118)}"><span class="k" id="pKey">🔒</span><span id="pTxt">엄마·아빠 확인</span><small id="pSub">비밀번호로 들어가요</small></button>`;
  h += `<div class="o patch" style="${box(864,76,1156,124)}"></div>`;
  h += `<div class="o wk" style="${box(866,76,1154,124)}"><button class="nav" id="prevW" aria-label="지난주">‹</button><label><span id="range"></span><span class="c">📅</span><input type="date" id="weekPick" aria-label="날짜 고르기"></label><button class="nav" id="nextW" aria-label="다음 주">›</button></div>`;
  h += `<div class="o patch say" id="say" style="${box(1304,30,1434,102)}">${HELLO}</div>`;
  h += `<div class="o today" id="today" hidden></div>`;
  ROWS.forEach(([y1, y2], r) => COLS.forEach(([x1, x2], d) => {
    h += `<button class="o cell" data-c="${r}-${d}" style="${box(x1+3,y1+3,x2-3,y2-3)}" aria-label="${DAYS[d]}요일 ${MISSIONS[r]}"></button>`;
  }));
  TIER_BOX.forEach((b, i) => h += `<div class="o got" id="tier${i}" style="${box(...b)}" hidden></div>`);
  h += `<div class="o cnt" style="${box(684,966,880,1056)}"><b id="cnt">0</b><span id="cntSub"></span></div>`;
  h += `<div class="o pill" style="${box(1032,914,1342,946)}">그동안 받은 용돈이에요!</div>`;
  h += `<div class="o patch" style="${box(1046,944,1418,1066)}"></div>`;
  h += `<div class="o saved" style="${box(1052,956,1412,1062)}"><span class="t">지난주까지 모은 돈</span><b><span id="saved">0</span><small>원</small></b><span class="sub" id="savedSub"></span></div>`;
  $("ov").innerHTML = h;
}

/* ---------- 그리기 ---------- */
const STICKER_SET = new Set([...STICKERS, ...OLD_STICKERS]);
function render() {
  const s = parse(cur), e = addDays(s, 6);
  $("range").textContent = `${s.getMonth()+1}월 ${s.getDate()}일 ~ ${e.getMonth()+1}월 ${e.getDate()}일`;
  $("weekPick").value = cur;
  const now = new Date(), isThis = keyOf(monday(now)) === cur, t = $("today");
  t.hidden = !isThis;
  if (isThis) { const [x1, x2] = COLS[(now.getDay() + 6) % 7]; t.setAttribute("style", box(x1 - 1, 150, x2 + 1, 897)); }
  const cells = (weeks[cur] || {}).cells || {};
  document.querySelectorAll(".cell").forEach(c => {
    const v = cells[c.dataset.c];
    const ok = v && STICKER_SET.has(v.s);
    const want = ok ? (v.ok ? "o" : "w") + v.s : "";
    if (c.dataset.v === want) return;
    c.dataset.v = want;
    c.classList.toggle("wait", !!ok && !v.ok);
    if (ok) {
      const h = [...c.dataset.c].reduce((n, ch) => n * 31 + ch.charCodeAt(0), 7);
      c.innerHTML = `<span class="stk${isPic(v.s) ? " drawn" : ""}" style="--tilt:${(h % 15) - 7}deg;--d:${(h % 9) * 0.5}s">${stickerHTML(v.s)}</span>`;
    } else c.innerHTML = "";
  });
  const n = count(cur), r = rewardFor(n);
  $("cnt").textContent = n;
  const nt = TIERS.find(([x]) => n < x);
  $("cntSub").textContent = nt ? `${nt[0]-n}개 더 모으면 ${won(nt[1])}원!` : "최고 보상 달성!";
  TIERS.forEach(([x], i) => $("tier" + i).hidden = n < x);
  let sum = 0, wk = 0;
  for (const k of Object.keys(weeks)) if (k < cur) { const rr = rewardFor(count(k)); if (rr) { sum += rr; wk++; } }
  $("saved").textContent = won(sum);
  $("savedSub").textContent = wk ? `${wk}주 동안 받은 용돈을 다 더했어요` : "지난주까지 받은 용돈이 여기 쌓여요";
  document.body.classList.toggle("parent-on", parent);
  $("pKey").textContent = parent ? "🔓" : "🔒";
  $("pTxt").textContent = parent ? "엄마·아빠 모드" : "엄마·아빠 확인";
  $("pSub").textContent = parent ? "한 번 더 누르면 나가요" : "비밀번호로 들어가요";
  $("logout").hidden = store.mode !== "online";
}
let sayT;
function say(t) {
  const b = $("say"); b.innerHTML = t; b.classList.add("pop");
  setTimeout(() => b.classList.remove("pop"), 250);
  clearTimeout(sayT); sayT = setTimeout(() => { b.innerHTML = HELLO; }, 6000);
}

/* ---------- 시트 ---------- */
function openSheet(html, bind, closable = true) {
  const host = $("sheetHost");
  host.innerHTML = `<div class="sheet-bg" id="sbg"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
  if (closable) $("sbg").addEventListener("click", e => { if (e.target.id === "sbg") closeSheet(); });
  bind && bind(host);
  const f = host.querySelector("input,button"); f && f.focus();
}
function closeSheet() { $("sheetHost").innerHTML = ""; }
let lastPack = null;
const packCards = () => `<div class="packs">${PACKS.map((p, i) => `<button class="pack" data-pack="${i}" style="--pc:${p.color}">
    <span class="pv">${p.items.slice(0, 4).map(s => `<span class="mini${isPic(s) ? "" : " glit"}">${stickerHTML(s)}</span>`).join("")}</span>
    <b>${p.name}</b><small>${p.items.length}개</small></button>`).join("")}</div>`;
const stickerButtons = i => `<div class="pack-head"><button class="back" id="packBack">‹ 스티커 팩</button><b>${PACKS[i].name}</b></div>
  <div class="stickers${PACKS[i].glitter ? " glit" : " drawn"}">${PACKS[i].items.map(s => `<button data-s="${s}" aria-label="${stickerLabel(s) || "그림"} 스티커">${stickerHTML(s)}</button>`).join("")}</div>`;
const grid = () => `<div id="stkArea">${lastPack === null ? packCards() : stickerButtons(lastPack)}</div>`;
function wireTabs(h, onPick) {
  const area = $("stkArea");
  const show = () => {
    area.innerHTML = lastPack === null ? packCards() : stickerButtons(lastPack);
    area.querySelectorAll("[data-pack]").forEach(b => b.onclick = () => { lastPack = +b.dataset.pack; show(); });
    area.querySelectorAll("[data-s]").forEach(b => b.onclick = () => onPick(b));
    const bk = $("packBack"); if (bk) bk.onclick = () => { lastPack = null; show(); };
  };
  show();
}
function sparkle(ck) {
  const c = document.querySelector(`.cell[data-c="${ck}"]`); if (!c) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 7; i++) {
    const s = document.createElement("span"); s.className = "spark"; s.textContent = i % 2 ? "✦" : "✧";
    const a = i / 7 * Math.PI * 2;
    s.style.left = c.style.left; s.style.top = c.style.top;
    s.style.marginLeft = `calc(${c.style.width} / 2)`; s.style.marginTop = `calc(${c.style.height} / 2 - 1.5%)`;
    s.style.setProperty("--x", `${Math.cos(a) * 3.2}cqw`); s.style.setProperty("--y", `${Math.sin(a) * 3.2}cqw`);
    $("ov").appendChild(s); setTimeout(() => s.remove(), 900);
  }
}

function onCell(ck) {
  const v = ((weeks[cur] || {}).cells || {})[ck];
  const [r, d] = ck.split("-").map(Number);
  const head = `<h3>${DAYS[d]}요일 · ${MISSIONS[r]}</h3>`;
  const big = v ? `<div class="big1${isPic(v.s) ? " drawn" : ""}">${stickerHTML(v.s)}</div>` : "";
  // 붙어 있는 스티커: 떼기 / 그냥 두기 만
  const removeSheet = (extra = "") => openSheet(head + big + `<div class="acts2">${extra}<button class="no" id="rm">떼기</button><button id="keep">그냥 두기</button></div>`, () => {
    $("rm").onclick = () => { writeCell(cur, ck, null); closeSheet(); };
    $("keep").onclick = closeSheet;
    const ap = $("ap"); if (ap) ap.onclick = () => { approve([ck]); closeSheet(); };
  });
  const pickSheet = (ok, msg, after) => openSheet(head + `<p>${msg}</p>` + grid() + `<div class="acts2"><button id="cl">닫기</button></div>`, h => {
    const pick = b => { const before = count(cur); writeCell(cur, ck, { s: b.dataset.s, ok }); closeSheet(); sparkle(ck); after(before); };
    wireTabs(h, pick);
    $("cl").onclick = closeSheet;
  });
  if (!parent) {
    if (v && v.ok) { say("벌써 붙였어요!<br>최고야"); return; }
    if (v) return removeSheet();
    return pickSheet(false, "마음에 드는 스티커를 골라요. 엄마·아빠가 확인하면 진짜로 붙어요.", () => say("엄마·아빠한테<br>보여주자!"));
  }
  if (v && !v.ok) return removeSheet('<button class="ok" id="ap">승인하기</button>');
  if (v) return removeSheet();
  pickSheet(true, "바로 붙일 스티커를 골라요.", cheer);
}
function cheer(before) {
  const after = count(cur), t = TIERS.filter(([x]) => before < x && after >= x).pop();
  say(t ? `${t[0]}개 달성!<br>용돈 ${won(t[1])}원!` : "잘했어!<br>차곡차곡 쌓인다");
}
function approve(keys) {
  const before = count(cur), cells = (weeks[cur] || {}).cells || {};
  keys.forEach(k => { const v = cells[k]; if (v && !v.ok) { writeCell(cur, k, { s: v.s, ok: true }); sparkle(k); } });
  cheer(before);
}

/* ---------- 엄마·아빠 비밀번호 ---------- */
async function hash(p) {
  const s = "chagok:" + p;
  try {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  } catch (e) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return "s" + h; }
}
function pinSheet() {
  const setting = !settings.pinHash; let pin = "", first = "";
  const title = () => setting ? (first ? "한 번 더 눌러 주세요" : "엄마·아빠 비밀번호 4자리를 정해요") : "엄마·아빠 비밀번호";
  openSheet(`<h3 id="pt">${title()}</h3><div class="pin-dots" id="dots">${"<span></span>".repeat(4)}</div><div class="err" id="perr"></div>
    <div class="pad">${[1,2,3,4,5,6,7,8,9,"취소",0,"⌫"].map(x => `<button data-k="${x}">${x}</button>`).join("")}</div>`, h => {
    const dots = () => h.querySelectorAll("#dots span").forEach((s, i) => s.classList.toggle("on", i < pin.length));
    h.querySelectorAll("[data-k]").forEach(b => b.onclick = async () => {
      const k = b.dataset.k;
      if (k === "취소") return closeSheet();
      if (k === "⌫") { pin = pin.slice(0, -1); return dots(); }
      if (pin.length >= 4) return;
      pin += k; dots();
      if (pin.length < 4) return;
      if (setting) {
        if (!first) { first = pin; pin = ""; $("pt").textContent = title(); dots(); return; }
        if (first !== pin) { first = ""; pin = ""; $("perr").textContent = "두 번이 달라요. 처음부터 다시 정해요."; $("pt").textContent = title(); dots(); return; }
        settings.pinHash = await hash(pin); store.writeSettings(); enterParent(); closeSheet(); return;
      }
      if (await hash(pin) === settings.pinHash) { enterParent(); closeSheet(); }
      else { pin = ""; dots(); $("perr").textContent = "비밀번호가 달라요."; }
    });
  });
}
function enterParent() { parent = true; render(); say("엄마·아빠 왔다!<br>확인해 주세요"); resetT(); }
function exitParent() { parent = false; clearTimeout(parentTimer); render(); }
function resetT() { clearTimeout(parentTimer); parentTimer = setTimeout(exitParent, 5 * 60 * 1000); }

/* ---------- 가족 계정 로그인 (파이어베이스) ---------- */
function loginSheet(onSubmit, msg = "") {
  openSheet(`<h3>차곡차곡 가족 계정으로 로그인</h3>
    <p>처음 한 번만 하면 돼요. 아이패드와 갤럭시에서 같은 계정으로 들어가면 같은 판이 보여요.</p>
    <form id="lf" style="display:flex;flex-direction:column;gap:10px">
      <label class="field">이메일<input id="le" type="email" autocomplete="username" required></label>
      <label class="field">비밀번호<input id="lp" type="password" autocomplete="current-password" required></label>
      <div class="err" id="lerr">${esc(msg)}</div>
      <div class="acts2"><button class="ok" type="submit">로그인</button></div>
    </form>`, () => {
    $("lf").addEventListener("submit", e => { e.preventDefault(); onSubmit($("le").value.trim(), $("lp").value); });
  }, false);
}
const AUTH_MSG = {
  "auth/invalid-credential": "이메일이나 비밀번호가 맞지 않아요.",
  "auth/wrong-password": "이메일이나 비밀번호가 맞지 않아요.",
  "auth/user-not-found": "이메일이나 비밀번호가 맞지 않아요.",
  "auth/invalid-email": "이메일 형식을 확인해 주세요.",
  "auth/too-many-requests": "여러 번 틀렸어요. 잠시 뒤에 다시 해 주세요.",
  "auth/network-request-failed": "인터넷 연결을 확인해 주세요."
};

async function startOnline(cfg) {
  const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
  const [{ initializeApp }, A, F] = await Promise.all([
    import(base + "firebase-app.js"), import(base + "firebase-auth.js"), import(base + "firebase-firestore.js")
  ]);
  const app = initializeApp(cfg);
  const auth = A.getAuth(app);
  await A.setPersistence(auth, A.browserLocalPersistence);
  let db;
  try { db = F.initializeFirestore(app, { localCache: F.persistentLocalCache() }); }
  catch (e) { db = F.getFirestore(app); }
  store.fb = { db, doc: F.doc, setDoc: F.setDoc };
  let unsubs = [];

  $("logout").onclick = async () => { exitParent(); await A.signOut(auth); };

  A.onAuthStateChanged(auth, user => {
    unsubs.forEach(u => u()); unsubs = [];
    if (!user) {
      store.mode = "local"; store.uid = null; weeks = {}; settings = {}; render();
      note("가족 계정으로 로그인해 주세요.");
      const tryLogin = (email, pw) => A.signInWithEmailAndPassword(auth, email, pw)
        .catch(err => loginSheet(tryLogin, AUTH_MSG[err.code] || "로그인하지 못했어요. 다시 해 주세요."));
      loginSheet(tryLogin);
      return;
    }
    closeSheet();
    store.mode = "online"; store.uid = user.uid;
    note("아이패드·갤럭시 어디서 열어도 같은 판이 보여요.");
    unsubs.push(F.onSnapshot(F.collection(db, "families", user.uid, "weeks"), snap => {
      const nw = {};
      snap.forEach(d => { const v = d.data(); nw[d.id] = { start: d.id, cells: { ...(v.cells || {}) } }; });
      weeks = nw; render();
    }, () => note("기록을 불러오지 못했어요. 새로고침해 주세요.")));
    unsubs.push(F.onSnapshot(F.doc(db, "families", user.uid, "settings", "main"), s => {
      settings = s.exists() ? { ...s.data() } : {};
    }, () => {}));
    render();
  });
}

/* ---------- 시작 ---------- */
buildOverlay();
$("ov").addEventListener("click", e => { const c = e.target.closest(".cell"); if (!c) return; if (parent) resetT(); onCell(c.dataset.c); });
$("prevW").onclick = () => { cur = keyOf(addDays(parse(cur), -7)); render(); };
$("nextW").onclick = () => { cur = keyOf(addDays(parse(cur), 7)); render(); };
$("weekPick").addEventListener("change", e => { if (e.target.value) { cur = keyOf(monday(parse(e.target.value))); render(); } });
$("parentBtn").onclick = () => parent ? exitParent() : pinSheet();
$("exitParent").onclick = exitParent;
$("approveAll").onclick = () => {
  const c = (weeks[cur] || {}).cells || {};
  const ks = Object.keys(c).filter(k => c[k] && !c[k].ok);
  if (!ks.length) { say("확인할 스티커가<br>없어요"); return; }
  approve(ks);
};
document.addEventListener("keydown", e => { if (e.key === "Escape" && !document.querySelector("#lf")) closeSheet(); });
// 자정이 지나면 오늘 표시와 이번 주를 맞춰요
let lastDay = keyOf(new Date());
setInterval(() => { const k = keyOf(new Date()); if (k !== lastDay) { const wasThis = cur === keyOf(monday(parse(lastDay))); lastDay = k; if (wasThis) cur = keyOf(monday(new Date())); render(); } }, 60000);

const cfg = window.FIREBASE_CONFIG;
if (cfg && cfg.apiKey && !String(cfg.apiKey).startsWith("여기에")) {
  render();
  startOnline(cfg).catch(() => { store.mode = "local"; store.loadLocal(); render(); note("온라인 저장소에 연결하지 못해서 이 기기에만 저장하고 있어요."); });
} else {
  store.loadLocal(); render();
  note("지금은 이 기기에만 저장돼요. 설정 안내서대로 파이어베이스를 연결하면 두 기기에서 같이 쓸 수 있어요.");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
