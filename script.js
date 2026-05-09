/* ============================================================
   NetBuilder — script.js  (enhanced edition)
   Aggiunge: quiz teorici, flash‑teoria, XP/badge, animazioni
   ============================================================ */

/* ─── QUIZ DATABASE (dalle slide ISO/OSI, TCP/IP, storia Internet) ── */
const QUIZ_DB = {
  beforeLevel3: {
    title: "Checkpoint: Modello ISO/OSI",
    icon: "📚",
    questions: [
      {
        q: "Quanti livelli ha il modello ISO/OSI?",
        options: ["4", "5", "7", "9"],
        correct: 2,
        expl: "Il modello OSI è composto da sette livelli, suddivisi in livelli inferiori (fisico, data link, rete, trasporto) e livelli superiori (sessione, presentazione, applicazione)."
      },
      {
        q: "Cosa si intende per 'closed system' nelle reti degli anni '70?",
        options: [
          "Un sistema con firewall attivo",
          "Un sistema che comunica solo con prodotti dello stesso produttore",
          "Una rete senza accesso a Internet",
          "Un sistema con crittografia end-to-end"
        ],
        correct: 1,
        expl: "Negli anni '70 i produttori di hardware realizzavano reti proprietarie: i 'closed system' potevano comunicare solo con dispositivi dello stesso produttore."
      },
      {
        q: "Il livello Data Link (livello 2 OSI) divide i dati in:",
        options: ["Pacchetti", "Segmenti", "Frame (trame)", "Bit stream"],
        correct: 2,
        expl: "Il livello Data Link divide il flusso di bit in frame, individua inizio e fine di ogni trama e attribuisce a ogni campo un significato specifico."
      }
    ]
  },
  beforeLevel5: {
    title: "Checkpoint: Livelli OSI e TCP/IP",
    icon: "🌐",
    questions: [
      {
        q: "A quale livello OSI opera il router, e quale funzione svolge?",
        options: [
          "Livello 2 – gestisce indirizzi MAC",
          "Livello 3 – instrada i pacchetti IP tra reti diverse",
          "Livello 4 – garantisce l'affidabilità della trasmissione",
          "Livello 1 – trasmette i bit sul cavo"
        ],
        correct: 1,
        expl: "Il router lavora al livello 3 (Rete) OSI: analizza gli indirizzi IP e determina il percorso (routing) per far arrivare i pacchetti dal mittente al destinatario."
      },
      {
        q: "Il modello TCP/IP ha quanti livelli rispetto all'OSI?",
        options: ["Stessi 7 livelli", "5 livelli", "4 livelli", "3 livelli"],
        correct: 2,
        expl: "Il modello TCP/IP semplifica l'OSI in 4 livelli: Application (≈ OSI 5-6-7), Transport (TCP/UDP), Network (IP) e Physical (≈ OSI 1-2)."
      },
      {
        q: "Cosa fa il livello di Trasporto nel modello OSI?",
        options: [
          "Instrada i pacchetti nella rete",
          "Converte i dati in segnali fisici",
          "Riassembla i pacchetti in ordine e garantisce affidabilità",
          "Gestisce la cifratura dei dati"
        ],
        correct: 2,
        expl: "Il livello di trasporto è end-to-end: riassembla i pacchetti arrivati in ordine sparso, controlla l'affidabilità e definisce la qualità del servizio."
      }
    ]
  },
  beforeLevel7: {
    title: "Checkpoint: Storia di Internet e Sicurezza",
    icon: "🔒",
    questions: [
      {
        q: "In che anno fu realizzato il primo collegamento ARPANET tra 4 università americane?",
        options: ["1965", "1969", "1973", "1982"],
        correct: 1,
        expl: "Nel 1969 fu realizzato il primo collegamento ARPANET tra quattro università americane. Nel 1971 la rete collegava già 23 computer."
      },
      {
        q: "Chi ha inventato il World Wide Web e in che anno?",
        options: [
          "Vinton Cerf, 1973",
          "Ray Tomlinson, 1971",
          "Tim Berners-Lee, 1989",
          "Robert Kahn, 1982"
        ],
        correct: 2,
        expl: "Tim Berners-Lee, ricercatore al CERN, inventò HTML e il World Wide Web nel 1989. Il primo sito web fu pubblicato nel 1991."
      },
      {
        q: "Il protocollo UDP rispetto al TCP è:",
        options: [
          "Orientato alla connessione e affidabile",
          "Non orientato alla connessione, senza controllo del flusso",
          "Usato solo per la posta elettronica",
          "Più lento ma più sicuro"
        ],
        correct: 1,
        expl: "UDP è un protocollo non orientato alla connessione e non garantisce la consegna in ordine. È utile quando qualche perdita è accettabile, ad esempio nello streaming video."
      }
    ]
  }
};

/* ─── TEORIA FLASH (mini-schede prima di ogni livello) ─────── */
const THEORY_CARDS = {
  1: { icon: "⭐", title: "Topologia a Stella", body: "Lo switch è il nodo centrale. Il numero di collegamenti è c = n − 1 (con n nodi totali). Se si guasta un cavo, solo quell'host perde connettività." },
  2: { icon: "🔀", title: "Routing a Livello 3", body: "Il router separa domini broadcast diversi e instrada pacchetti IP tra reti diverse. Lo switch collega host nella stessa LAN." },
  3: { icon: "🔁", title: "Topologia ad Anello", body: "Ogni nodo ha esattamente 2 connessioni. Il traffico scorre in cerchio. Si usa un token per regolare l'accesso al canale (IEEE 802.5)." },
  4: { icon: "🛡️", title: "Perimetro LAN-WAN", body: "Il firewall si posiziona tra LAN privata e uscita WAN. Filtra traffico per IP, porta e protocollo. Nessun host deve bypassarlo." },
  5: { icon: "🏫", title: "Rete Gerarchica", body: "Tre livelli: accesso (switch aula) → distribuzione (switch centrale) → perimetro (firewall + router). Il traffico converge verso il centro." },
  6: { icon: "🖥️", title: "Modello Client-Server", body: "I client accedono al server tramite lo switch. Il server è sempre raggiungibile senza passare per altri host. Cavi dritti PC↔Switch." },
  7: { icon: "🔐", title: "Doppia LAN + WAN", body: "Il router collega le due LAN interne. L'uscita WAN passa obbligatoriamente per firewall → router → Internet." },
  8: { icon: "🏢", title: "Campus Enterprise", body: "Architettura a tre livelli su scala enterprise. Switch di accesso → switch centrale → firewall → router → Internet. Scalabile e sicura." }
};

/* ─── BADGE SYSTEM ──────────────────────────────────────────── */
const BADGES = [
  { id: "first_build",  icon: "🔧", label: "Primo circuito",   desc: "Completato il livello 1",          condition: s => s.completedLevels.has(1) },
  { id: "quiz_ace",     icon: "🎓", label: "Quiz Master",      desc: "Quiz superato con 3/3",             condition: s => s.perfectQuizzes >= 1 },
  { id: "speedrun",     icon: "⚡", label: "Speedrun",         desc: "Livello completato in < 60s",       condition: s => s.fastCompletes >= 1 },
  { id: "half_way",     icon: "🏅", label: "Metà percorso",    desc: "4 livelli completati",              condition: s => s.completedLevels.size >= 4 },
  { id: "theorist",     icon: "📚", label: "Teorico",          desc: "Tutti i quiz superati",             condition: s => s.quizzesPassed >= 3 },
  { id: "campus_pro",   icon: "🏢", label: "Campus Pro",       desc: "Livello 8 completato",              condition: s => s.completedLevels.has(8) },
];

/* ─── STATE ──────────────────────────────────────────────────── */
const state = {
  level: 1,
  score: Number(localStorage.getItem("netbuilder-score") || 0),
  xp: Number(localStorage.getItem("netbuilder-score") || 0),
  nodes: [],
  cables: [],
  selectedNode: null,
  pendingNode: null,
  cableType: "straight",
  dragging: null,
  dragOffset: { x: 0, y: 0 },
  wasDragged: false,
  completedLevels: new Set(JSON.parse(localStorage.getItem("netbuilder-completed") || "[]")),
  unlockedLevels: new Set([1]),
  savedLevels: JSON.parse(localStorage.getItem("netbuilder-levels") || "{}"),
  quizzesPassed: 0,
  perfectQuizzes: 0,
  fastCompletes: 0,
  levelStartTime: null,
  earnedBadges: new Set(),
  contextTarget: null,
};

/* ─── LEVEL DEFINITIONS ─────────────────────────────────────── */
const LEVELS = {};

/* ── Validation helpers ─────────────────────────────────────── */
function getNeighbors(nodeId) {
  return state.cables
    .filter(c => c.a === nodeId || c.b === nodeId)
    .map(c => (c.a === nodeId ? c.b : c.a));
}
function bfsReachable(startId) {
  const visited = new Set([startId]);
  const queue = [startId];
  while (queue.length) {
    const cur = queue.shift();
    getNeighbors(cur).forEach(n => { if (!visited.has(n)) { visited.add(n); queue.push(n); } });
  }
  return visited;
}
function nodesByType(type) { return state.nodes.filter(n => n.type === type); }
function straightCables() { return state.cables.filter(c => c.type === "straight"); }
function crossCables()    { return state.cables.filter(c => c.type === "cross"); }

/* ── pc pairs for simulation ───────────────────────────────── */
function pcPairs() {
  const pcs = nodesByType("pc");
  if (pcs.length < 2) return [];
  return [[pcs[0].id, pcs[pcs.length - 1].id]];
}
function routedPair() {
  const pcs = nodesByType("pc");
  if (pcs.length < 2) return [];
  return [[pcs[0].id, pcs[pcs.length - 1].id]];
}
function ringPair() { return pcPairs(); }
function firewallPairs() { return pcPairs(); }
function schoolPairs() {
  const pcs = nodesByType("pc");
  const servers = nodesByType("server");
  const pairs = [];
  if (pcs.length >= 2) pairs.push([pcs[0].id, pcs[pcs.length - 1].id]);
  if (pcs.length && servers.length) pairs.push([pcs[0].id, servers[0].id]);
  return pairs;
}
function clientServerPairs() {
  const pcs = nodesByType("pc");
  const servers = nodesByType("server");
  if (!pcs.length || !servers.length) return [];
  return [[pcs[0].id, servers[0].id]];
}
function secureWanPairs() { return pcPairs(); }
function campusEnterprisePairs() { return schoolPairs(); }

/* ── validateLanStar ──────────────────────────────────────────*/
function validateLanStar() {
  const pcs = nodesByType("pc");
  const switches = nodesByType("switch");
  const sc = straightCables();
  const errs = [];
  if (pcs.length !== 4) errs.push(`Hai ${pcs.length} PC, ne servono esattamente 4`);
  if (switches.length !== 1) errs.push(`Hai ${switches.length} switch, ne serve esattamente 1`);
  if (sc.length !== 4) errs.push(`Hai ${sc.length} cavi dritti, ne servono 4`);
  if (crossCables().length > 0) errs.push("Non usare cavi incrociati");
  if (switches.length === 1) {
    const sw = switches[0];
    pcs.forEach(pc => {
      const connected = getNeighbors(pc.id).includes(sw.id);
      if (!connected) errs.push(`${pc.label} non è collegato allo switch`);
    });
  }
  return errs;
}

/* ── validateTwoSubnets ───────────────────────────────────────*/
function validateTwoSubnets() {
  const pcs = nodesByType("pc");
  const switches = nodesByType("switch");
  const routers = nodesByType("router");
  const errs = [];
  if (pcs.length !== 6) errs.push(`Hai ${pcs.length} PC, ne servono 6`);
  if (switches.length !== 2) errs.push(`Hai ${switches.length} switch, ne servono 2`);
  if (routers.length !== 1) errs.push(`Hai ${routers.length} router, ne serve 1`);
  if (routers.length === 1 && switches.length === 2) {
    const r = routers[0];
    const rNeigh = getNeighbors(r.id);
    if (!rNeigh.includes(switches[0].id) || !rNeigh.includes(switches[1].id))
      errs.push("Il router non è collegato a entrambi gli switch");
    switches.forEach((sw, i) => {
      const pcsOnSw = pcs.filter(p => getNeighbors(p.id).includes(sw.id));
      if (pcsOnSw.length < 3) errs.push(`Switch ${i + 1}: hai ${pcsOnSw.length} PC, ne servono 3`);
    });
  }
  return errs;
}

/* ── validateRing ──────────────────────────────────────────── */
function validateRing() {
  const pcs = nodesByType("pc");
  const cc = crossCables();
  const errs = [];
  if (state.nodes.some(n => n.type !== "pc")) errs.push("Usa solo PC nell'anello");
  if (pcs.length !== 6) errs.push(`Hai ${pcs.length} PC, ne servono 6`);
  if (cc.length !== 6) errs.push(`Hai ${cc.length} cavi incrociati, ne servono 6`);
  if (straightCables().length > 0) errs.push("Usa solo cavi incrociati");
  pcs.forEach(pc => {
    const deg = getNeighbors(pc.id).length;
    if (deg !== 2) errs.push(`${pc.label} ha grado ${deg} (deve essere 2)`);
  });
  if (pcs.length > 0) {
    const reachable = bfsReachable(pcs[0].id);
    if (reachable.size !== pcs.length) errs.push("L'anello non è chiuso (non tutti i PC sono connessi)");
  }
  return errs;
}

/* ── validateFirewall ──────────────────────────────────────── */
function validateFirewall() {
  const pcs = nodesByType("pc");
  const switches = nodesByType("switch");
  const firewalls = nodesByType("firewall");
  const routers = nodesByType("router");
  const internets = nodesByType("internet");
  const errs = [];
  if (pcs.length < 2) errs.push("Servono almeno 2 PC");
  if (switches.length < 1) errs.push("Serve uno switch interno");
  if (firewalls.length !== 1) errs.push("Serve esattamente 1 firewall");
  if (routers.length !== 1) errs.push("Serve esattamente 1 router");
  if (internets.length !== 1) errs.push("Serve il nodo Internet");
  if (firewalls.length === 1 && routers.length === 1 && switches.length >= 1) {
    const fw = firewalls[0]; const rt = routers[0]; const sw = switches[0];
    if (!getNeighbors(fw.id).includes(rt.id)) errs.push("Il firewall non è collegato al router");
    if (!getNeighbors(sw.id).includes(fw.id)) errs.push("Lo switch non è collegato al firewall");
    pcs.forEach(pc => {
      if (getNeighbors(pc.id).includes(rt.id)) errs.push(`${pc.label} è collegato direttamente al router (bypass firewall)`);
    });
  }
  return errs;
}

/* ── validateSchool ────────────────────────────────────────── */
function validateSchool() {
  const pcs = nodesByType("pc");
  const switches = nodesByType("switch");
  const servers = nodesByType("server");
  const firewalls = nodesByType("firewall");
  const routers = nodesByType("router");
  const internets = nodesByType("internet");
  const errs = [];
  if (pcs.length < 6) errs.push(`Hai ${pcs.length} PC, ne servono almeno 6`);
  if (switches.length !== 4) errs.push(`Hai ${switches.length} switch, ne servono 4 (1 centrale + 3 aula)`);
  if (servers.length < 1) errs.push("Serve almeno 1 server");
  if (firewalls.length !== 1) errs.push("Serve 1 firewall");
  if (routers.length !== 1) errs.push("Serve 1 router");
  if (internets.length !== 1) errs.push("Serve il nodo Internet");
  return errs;
}

/* ── validateClientServerLan ──────────────────────────────── */
function validateClientServerLan() {
  const pcs = nodesByType("pc");
  const switches = nodesByType("switch");
  const servers = nodesByType("server");
  const sc = straightCables();
  const errs = [];
  if (pcs.length !== 3) errs.push(`Hai ${pcs.length} PC, ne servono 3`);
  if (switches.length !== 1) errs.push("Serve 1 switch centrale");
  if (servers.length !== 1) errs.push("Serve 1 server");
  if (sc.length !== 4) errs.push(`Hai ${sc.length} cavi, ne servono 4`);
  if (crossCables().length > 0) errs.push("Non usare cavi incrociati");
  return errs;
}

/* ── validateSecureWan ────────────────────────────────────── */
function validateSecureWan() {
  const pcs = nodesByType("pc");
  const switches = nodesByType("switch");
  const routers = nodesByType("router");
  const firewalls = nodesByType("firewall");
  const internets = nodesByType("internet");
  const errs = [];
  if (pcs.length !== 6) errs.push(`Hai ${pcs.length} PC, ne servono 6`);
  if (switches.length !== 2) errs.push("Servono 2 switch");
  if (routers.length !== 1) errs.push("Serve 1 router");
  if (firewalls.length !== 1) errs.push("Serve 1 firewall");
  if (internets.length !== 1) errs.push("Serve il nodo Internet");
  if (routers.length === 1 && firewalls.length === 1 && internets.length === 1) {
    const rt = routers[0]; const fw = firewalls[0]; const inet = internets[0];
    if (!getNeighbors(rt.id).includes(fw.id)) errs.push("Il router non è collegato al firewall");
    if (!getNeighbors(fw.id).includes(inet.id)) errs.push("Il firewall non è collegato a Internet");
  }
  return errs;
}

/* ── validateCampusEnterprise ─────────────────────────────── */
function validateCampusEnterprise() {
  const pcs = nodesByType("pc");
  const switches = nodesByType("switch");
  const servers = nodesByType("server");
  const firewalls = nodesByType("firewall");
  const routers = nodesByType("router");
  const internets = nodesByType("internet");
  const errs = [];
  if (pcs.length < 8) errs.push(`Hai ${pcs.length} PC, ne servono almeno 8`);
  if (switches.length !== 5) errs.push(`Hai ${switches.length} switch, ne servono 5 (1 centrale + 4 accesso)`);
  if (servers.length < 2) errs.push(`Hai ${servers.length} server, ne servono almeno 2`);
  if (firewalls.length !== 1) errs.push("Serve 1 firewall");
  if (routers.length !== 1) errs.push("Serve 1 router");
  if (internets.length !== 1) errs.push("Serve il nodo Internet");
  return errs;
}

/* ─── BUILD LEVELS ──────────────────────────────────────────── */
const factories = window.NetBuilderLevelFactories || {};
const helpers = { validateLanStar, validateTwoSubnets, validateRing, validateFirewall, validateSchool, validateClientServerLan, validateSecureWan, validateCampusEnterprise, pcPairs, routedPair, ringPair, firewallPairs, schoolPairs, clientServerPairs, secureWanPairs, campusEnterprisePairs };

[1,2,3,4,5,6,7,8].forEach(n => {
  const key = `level${n}`;
  if (factories[key]) LEVELS[n] = factories[key](helpers);
});

/* ─── DEVICE CATALOG ────────────────────────────────────────── */
const DEVICE_META = {
  pc:       { label: "PC",       sub: "Host",      color: "#0f766e", maxPorts: 1 },
  switch:   { label: "Switch",   sub: "L2",        color: "#2563eb", maxPorts: 8 },
  router:   { label: "Router",   sub: "L3",        color: "#7c3aed", maxPorts: 4 },
  server:   { label: "Server",   sub: "Host",      color: "#0f766e", maxPorts: 2 },
  firewall: { label: "Firewall", sub: "Perimetro", color: "#dc2626", maxPorts: 2 },
  internet: { label: "Internet", sub: "WAN",       color: "#64716f", maxPorts: 4 },
};

function usedPorts(nodeId) {
  return state.cables.filter(c => c.a === nodeId || c.b === nodeId).length;
}
function maxPorts(type) {
  return DEVICE_META[type]?.maxPorts ?? 1;
}

const DEVICE_ICONS = {
  pc: `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="28" height="19" rx="2"/><line x1="12" y1="24" x2="10" y2="31"/><line x1="24" y1="24" x2="26" y2="31"/><line x1="9" y1="31" x2="27" y2="31"/></svg>`,
  switch: `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="30" height="14" rx="3"/><circle cx="10" cy="18" r="2" fill="currentColor" opacity=".5"/><circle cx="18" cy="18" r="2" fill="currentColor" opacity=".5"/><circle cx="26" cy="18" r="2" fill="currentColor" opacity=".5"/><line x1="10" y1="11" x2="10" y2="7"/><line x1="18" y1="11" x2="18" y2="7"/><line x1="26" y1="11" x2="26" y2="7"/></svg>`,
  router: `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="11"/><path d="M7 18h22M18 7c-4 3-4 15 0 22M18 7c4 3 4 15 0 22"/></svg>`,
  server: `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="26" height="9" rx="2"/><rect x="5" y="17" width="26" height="9" rx="2"/><circle cx="28" cy="9.5" r="1.5" fill="currentColor"/><circle cx="28" cy="21.5" r="1.5" fill="currentColor"/><line x1="5" y1="29" x2="31" y2="29"/></svg>`,
  firewall: `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3 L32 9 L32 20 C32 27 25 32 18 33 C11 32 4 27 4 20 L4 9 Z"/><path d="M18 10 L18 23 M13 15 L23 15"/></svg>`,
  internet: `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="13"/><path d="M5 18h26M18 5c-5 4-5 18 0 26M18 5c5 4 5 18 0 26"/><path d="M7 11h22M7 25h22"/></svg>`,
};

/* ─── DOM REFS ──────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const board        = $("board");
const cableLayer   = $("cableLayer");
const packetLayer  = $("packetLayer");
const deviceLayer  = $("deviceLayer");
const levelTabs    = $("levelTabs");
const statLevel    = $("statLevel");
const statScore    = $("statScore");
const statDevices  = $("statDevices");
const levelTitle   = $("levelTitle");
const objectiveText= $("objectiveText");
const checklist    = $("checklist");
const networkLog   = $("networkLog");
const hintBtn      = $("hintBtn");
const resetBtn     = $("resetBtn");
const testBtn      = $("testBtn");
const toastEl      = $("toast");
const contextMenu  = $("contextMenu");
const resultModal  = $("resultModal");
const resultIcon   = $("resultIcon");
const resultTitle  = $("resultTitle");
const resultBody   = $("resultBody");
const resultInfo   = $("resultInfo");
const resultBtn    = $("resultBtn");

/* ─── SVG HELPERS ────────────────────────────────────────────── */
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

/* ─── TOAST ──────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg, dur = 2800) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), dur);
}

/* ─── LOG ────────────────────────────────────────────────────── */
function log(msg, cls = "") {
  const el = document.createElement("div");
  el.className = `log-entry${cls ? " " + cls : ""}`;
  el.textContent = msg;
  networkLog.prepend(el);
  if (networkLog.children.length > 40) networkLog.lastChild.remove();
}

/* ─── XP DISPLAY ─────────────────────────────────────────────── */
function addXP(amount, reason) {
  state.xp += amount;
  state.score += amount;
  statScore.textContent = state.score;
  showToast(`+${amount} XP — ${reason}`, 2000);
  checkBadges();
}

/* ─── BADGES ─────────────────────────────────────────────────── */
function checkBadges() {
  BADGES.forEach(badge => {
    if (!state.earnedBadges.has(badge.id) && badge.condition(state)) {
      state.earnedBadges.add(badge.id);
      showBadgePopup(badge);
    }
  });
}
function showBadgePopup(badge) {
  const popup = document.createElement("div");
  popup.className = "badge-popup";
  popup.innerHTML = `<span class="badge-popup-icon">${badge.icon}</span><div><strong>${badge.label}</strong><small>${badge.desc}</small></div>`;
  document.body.appendChild(popup);
  requestAnimationFrame(() => popup.classList.add("show"));
  setTimeout(() => { popup.classList.remove("show"); setTimeout(() => popup.remove(), 400); }, 3500);
}

/* ─── QUIZ MODAL ─────────────────────────────────────────────── */
function showQuizModal(quizKey, onComplete) {
  const quiz = QUIZ_DB[quizKey];
  if (!quiz) { onComplete(true); return; }

  let current = 0;
  let score = 0;
  let answered = false;

  const overlay = document.createElement("div");
  overlay.className = "quiz-overlay";

  function render() {
    const q = quiz.questions[current];
    overlay.innerHTML = `
      <div class="quiz-modal">
        <div class="quiz-header">
          <span class="quiz-icon">${quiz.icon}</span>
          <div>
            <p class="eyebrow">Checkpoint teoria</p>
            <h2>${quiz.title}</h2>
          </div>
          <div class="quiz-progress">${current + 1}/${quiz.questions.length}</div>
        </div>
        <div class="quiz-body">
          <p class="quiz-question">${q.q}</p>
          <div class="quiz-options" id="quizOptions">
            ${q.options.map((opt, i) => `<button class="quiz-opt" data-i="${i}">${opt}</button>`).join("")}
          </div>
          <div class="quiz-expl" id="quizExpl" style="display:none"></div>
        </div>
        <div class="quiz-footer">
          <div class="quiz-score-dots">
            ${quiz.questions.map((_, i) => `<span class="quiz-dot ${i < current ? "done" : i === current ? "active" : ""}"></span>`).join("")}
          </div>
          <button class="btn primary" id="quizNext" style="display:none">Avanti →</button>
        </div>
      </div>`;

    answered = false;

    overlay.querySelectorAll(".quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const chosen = parseInt(btn.dataset.i);
        const correct = chosen === q.correct;
        if (correct) score++;

        overlay.querySelectorAll(".quiz-opt").forEach((b, i) => {
          b.disabled = true;
          if (i === q.correct) b.classList.add("correct");
          else if (i === chosen && !correct) b.classList.add("wrong");
        });

        const explEl = overlay.querySelector("#quizExpl");
        explEl.style.display = "block";
        explEl.textContent = q.expl;
        explEl.className = `quiz-expl ${correct ? "ok" : "err"}`;

        const nextBtn = overlay.querySelector("#quizNext");
        nextBtn.style.display = "inline-flex";
        nextBtn.textContent = current < quiz.questions.length - 1 ? "Avanti →" : "Completa ✓";
        nextBtn.addEventListener("click", () => {
          current++;
          if (current >= quiz.questions.length) {
            finishQuiz(score, quiz.questions.length, onComplete);
            overlay.remove();
          } else {
            render();
          }
        });
      });
    });
  }

  render();
  document.body.appendChild(overlay);
}

function finishQuiz(score, total, onComplete) {
  const passed = score >= Math.ceil(total / 2);
  state.quizzesPassed += passed ? 1 : 0;
  if (score === total) state.perfectQuizzes++;
  addXP(score * 15, `Quiz: ${score}/${total} risposte corrette`);
  if (passed) {
    showToast(`✅ Quiz superato! ${score}/${total} — Livello sbloccato`, 3000);
    onComplete(true);
  } else {
    showToast(`❌ Quiz non superato (${score}/${total}). Riprova!`, 3500);
    onComplete(false);
  }
}

/* ─── THEORY FLASH MODAL ─────────────────────────────────────── */
function showTheoryFlash(levelNum, onDone) {
  const card = THEORY_CARDS[levelNum];
  if (!card) { onDone(); return; }

  const overlay = document.createElement("div");
  overlay.className = "theory-overlay";
  overlay.innerHTML = `
    <div class="theory-modal">
      <div class="theory-icon">${card.icon}</div>
      <p class="eyebrow">Concetto chiave — Livello ${levelNum}</p>
      <h2>${card.title}</h2>
      <p class="theory-body">${card.body}</p>
      <button class="btn primary" id="theoryOk">Capito, inizia! 🚀</button>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));
  overlay.querySelector("#theoryOk").addEventListener("click", () => {
    overlay.classList.remove("show");
    setTimeout(() => { overlay.remove(); onDone(); }, 300);
  });
}

/* ─── MINIGAME CHECKPOINTS ───────────────────────────────────── */
// Definisce quale tipo di checkpoint usare per ogni livello bloccato.
// "quiz"    → showQuizModal  (QUIZ_DB)
// "match"   → showMatchGame  (abbinamento)
// "timeline"→ showTimelineGame (ordina eventi)
const CHECKPOINT_TYPE = {
  beforeLevel3: "quiz",
  beforeLevel5: "match",
  beforeLevel7: "timeline",
};

/* ── Abbinamento OSI (livello 5) ────────────────────────────── */
function showMatchGame(onComplete) {
  const pairs = [
    { term: "Livello Fisico (L1)",        def: "Trasmette bit grezzi su cavo o wireless" },
    { term: "Livello Data Link (L2)",      def: "Frame, indirizzi MAC, rilevazione errori" },
    { term: "Livello Rete (L3)",           def: "Instradamento IP, routing tra reti diverse" },
    { term: "Livello Trasporto (L4)",      def: "Affidabilità end-to-end, TCP e UDP" },
    { term: "Livello Sessione (L5)",       def: "Gestione sessioni e sincronizzazione" },
    { term: "Livello Presentazione (L6)",  def: "Cifratura, compressione e sintassi dati" },
    { term: "Livello Applicazione (L7)",   def: "HTTP, FTP, SMTP — servizi utente" },
  ];

  // Shuffle definitions separately
  const shuffledDefs = [...pairs.map((p, i) => ({ def: p.def, idx: i }))].sort(() => Math.random() - 0.5);

  const overlay = document.createElement("div");
  overlay.className = "quiz-overlay";

  let selected = null;       // { side: "term"|"def", idx }
  const matched = new Set(); // idx of correctly matched pairs
  let errors = 0;

  function render() {
    overlay.innerHTML = `
      <div class="match-modal">
        <div class="quiz-header">
          <span class="quiz-icon">🔗</span>
          <div>
            <p class="eyebrow">Checkpoint — Abbinamento</p>
            <h2>Collega livello OSI alla funzione</h2>
          </div>
          <div class="quiz-progress">${matched.size}/7</div>
        </div>
        <p class="osi-game-intro">Clicca un livello a sinistra, poi la sua descrizione a destra.</p>
        <div class="match-grid">
          <div class="match-col" id="matchTerms">
            ${pairs.map((p, i) => `
              <div class="match-card ${matched.has(i) ? "matched" : ""}" data-side="term" data-idx="${i}">
                ${p.term}
              </div>`).join("")}
          </div>
          <div class="match-col" id="matchDefs">
            ${shuffledDefs.map(d => `
              <div class="match-card ${matched.has(d.idx) ? "matched" : ""}" data-side="def" data-idx="${d.idx}">
                ${d.def}
              </div>`).join("")}
          </div>
        </div>
        <div class="match-footer">
          <span class="match-errors">Errori: <strong>${errors}</strong></span>
          <button class="btn secondary" id="matchSkip">Salta</button>
        </div>
      </div>`;

    overlay.querySelectorAll(".match-card:not(.matched)").forEach(card => {
      card.addEventListener("click", () => handleMatchClick(card));
    });
    overlay.querySelector("#matchSkip").addEventListener("click", () => {
      overlay.remove();
      onComplete(false);
    });

    // Re-highlight selected
    if (selected) {
      const sel = overlay.querySelector(`.match-card[data-side="${selected.side}"][data-idx="${selected.idx}"]`);
      if (sel) sel.classList.add("selected");
    }
  }

  function handleMatchClick(card) {
    const side = card.dataset.side;
    const idx  = parseInt(card.dataset.idx);
    if (matched.has(idx)) return;

    if (!selected) {
      selected = { side, idx };
      card.classList.add("selected");
      return;
    }

    // Same side — change selection
    if (selected.side === side) {
      selected = { side, idx };
      render();
      return;
    }

    // Different sides — check match
    const termIdx = side === "term" ? idx : selected.idx;
    const defIdx  = side === "def"  ? idx : selected.idx;

    if (termIdx === defIdx) {
      // Correct!
      matched.add(termIdx);
      selected = null;
      render();
      if (matched.size === 7) {
        setTimeout(() => {
          overlay.remove();
          const xp = Math.max(7, 21 - errors * 2);
          addXP(xp, `Abbinamento OSI completato! (${errors} errori)`);
          showToast(errors === 0 ? `🎯 Perfetto! Nessun errore! +${xp} XP` : `✅ Completato con ${errors} errori — +${xp} XP`, 3000);
          onComplete(true);
        }, 600);
      }
    } else {
      // Wrong — flash red
      errors++;
      card.classList.add("wrong-flash");
      const otherSide = selected.side;
      const otherIdx  = selected.idx;
      const otherCard = overlay.querySelector(`.match-card[data-side="${otherSide}"][data-idx="${otherIdx}"]`);
      if (otherCard) otherCard.classList.add("wrong-flash");
      setTimeout(() => {
        card.classList.remove("wrong-flash");
        if (otherCard) otherCard.classList.remove("wrong-flash");
        selected = null;
        render();
      }, 700);
    }
  }

  render();
  document.body.appendChild(overlay);
}

/* ── Timeline Internet (livello 7) ─────────────────────────── */
function showTimelineGame(onComplete) {
  const events = [
    { year: 1969, text: "Primo collegamento ARPANET tra 4 università" },
    { year: 1971, text: "Ray Tomlinson inventa la e-mail" },
    { year: 1973, text: "Kahn e Cerf ideano il protocollo TCP" },
    { year: 1982, text: "Definizione del protocollo TCP/IP, nasce la parola 'internet'" },
    { year: 1987, text: "Registrato il dominio cnr.it, primo .it italiano" },
    { year: 1989, text: "Tim Berners-Lee inventa HTML e il World Wide Web" },
    { year: 1991, text: "Pubblicato il primo sito web al mondo (CERN)" },
    { year: 1993, text: "Rilasciato Mosaic, il primo browser grafico" },
  ];

  // Shuffle
  const shuffled = [...events].sort(() => Math.random() - 0.5);
  let order = shuffled.map((_, i) => i); // indices into shuffled array, representing current visual order
  let dragIdx = null;
  let dragOverIdx = null;

  const overlay = document.createElement("div");
  overlay.className = "quiz-overlay";

  function render() {
    overlay.innerHTML = `
      <div class="timeline-modal">
        <div class="quiz-header">
          <span class="quiz-icon">📅</span>
          <div>
            <p class="eyebrow">Checkpoint — Timeline</p>
            <h2>Ordina la storia di Internet</h2>
          </div>
        </div>
        <p class="osi-game-intro">Trascina gli eventi dal più antico (in cima) al più recente (in fondo).</p>
        <div class="timeline-list" id="timelineList">
          ${order.map((si, pos) => `
            <div class="tl-item" draggable="true" data-pos="${pos}" data-si="${si}">
              <span class="tl-handle">⠿</span>
              <span class="tl-text">${shuffled[si].text}</span>
            </div>`).join("")}
        </div>
        <div class="match-footer">
          <span></span>
          <div style="display:flex;gap:8px">
            <button class="btn secondary" id="tlSkip">Salta</button>
            <button class="btn primary" id="tlCheck">Verifica ✓</button>
          </div>
        </div>
      </div>`;

    // Drag listeners
    overlay.querySelectorAll(".tl-item").forEach(item => {
      item.addEventListener("dragstart", e => {
        dragIdx = parseInt(item.dataset.pos);
        item.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });
      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        overlay.querySelectorAll(".tl-item").forEach(i => i.classList.remove("drag-over-tl"));
        dragIdx = null; dragOverIdx = null;
      });
      item.addEventListener("dragover", e => {
        e.preventDefault();
        const over = parseInt(item.dataset.pos);
        if (over !== dragIdx) {
          overlay.querySelectorAll(".tl-item").forEach(i => i.classList.remove("drag-over-tl"));
          item.classList.add("drag-over-tl");
          dragOverIdx = over;
        }
      });
      item.addEventListener("drop", e => {
        e.preventDefault();
        if (dragIdx === null || dragOverIdx === null || dragIdx === dragOverIdx) return;
        // Reorder
        const newOrder = [...order];
        const [moved] = newOrder.splice(dragIdx, 1);
        newOrder.splice(dragOverIdx, 0, moved);
        order = newOrder;
        render();
      });
    });

    overlay.querySelector("#tlCheck").addEventListener("click", () => {
      // Check correctness: order[pos] should correspond to events sorted by year
      const sortedByYear = [...shuffled].map((e, i) => ({ ...e, si: i })).sort((a, b) => a.year - b.year);
      let correct = 0;
      const items = overlay.querySelectorAll(".tl-item");
      order.forEach((si, pos) => {
        const expectedSi = sortedByYear[pos].si;
        const item = items[pos];
        if (si === expectedSi) {
          correct++;
          item.classList.add("tl-correct");
          item.querySelector(".tl-text").textContent = `${shuffled[si].year} — ${shuffled[si].text}`;
        } else {
          item.classList.add("tl-wrong");
          item.querySelector(".tl-text").textContent = `${shuffled[si].year} — ${shuffled[si].text}`;
        }
      });

      overlay.querySelector("#tlCheck").disabled = true;
      overlay.querySelector("#tlSkip").textContent = "Continua →";

      const xp = correct * 5;
      addXP(xp, `Timeline Internet: ${correct}/8 corretti`);

      setTimeout(() => {
        overlay.querySelector("#tlSkip").addEventListener("click", () => {
          overlay.remove();
          showToast(correct === 8 ? `🏆 Perfetto! Tutti gli eventi in ordine! +${xp} XP` : `${correct}/8 corretti — +${xp} XP`, 3000);
          onComplete(true);
        }, { once: true });
      }, 100);
    });

    overlay.querySelector("#tlSkip").addEventListener("click", () => {
      overlay.remove();
      onComplete(false);
    });
  }

  render();
  document.body.appendChild(overlay);
}

/* ─── LEVEL LOADING ─────────────────────────────────────────── */
function loadLevel(n, skipIntro = false) {
  if (!state.unlockedLevels.has(n)) {
    const quizKey = `beforeLevel${n}`;
    const cpType = CHECKPOINT_TYPE[quizKey];

    if (cpType === "quiz" && QUIZ_DB[quizKey]) {
      showQuizModal(quizKey, passed => {
        if (passed) { state.unlockedLevels.add(n); loadLevel(n, false); }
      });
      return;
    }
    if (cpType === "match") {
      showMatchGame(passed => {
        if (passed) { state.unlockedLevels.add(n); loadLevel(n, false); }
      });
      return;
    }
    if (cpType === "timeline") {
      showTimelineGame(passed => {
        if (passed) { state.unlockedLevels.add(n); loadLevel(n, false); }
      });
      return;
    }
    state.unlockedLevels.add(n);
  }

  if (!skipIntro) {
    showTheoryFlash(n, () => _doLoadLevel(n));
  } else {
    _doLoadLevel(n);
  }
}

/* ─── PERSISTENZA ────────────────────────────────────────────── */
function saveProgress() {
  localStorage.setItem("netbuilder-score", String(state.score));
  localStorage.setItem("netbuilder-completed", JSON.stringify([...state.completedLevels]));
  localStorage.setItem("netbuilder-levels", JSON.stringify(state.savedLevels));
}

function saveCurrentLevelState() {
  state.savedLevels[state.level] = {
    nodes:     state.nodes.map(n => ({ ...n })),
    cables:    state.cables.map(c => ({ ...c })),
    cableType: state.cableType,
  };
  saveProgress();
}

function restoreLevelState(n) {
  const saved = state.savedLevels[n];
  if (!saved) return;
  state.nodes  = (saved.nodes  || []).map(n => ({ ...n }));
  state.cables = (saved.cables || []).map(c => ({ ...c }));
  if (saved.cableType) setCableType(saved.cableType);
  const maxId = state.nodes.reduce((m, nd) => Math.max(m, Number(nd.id) || 0), 0);
  if (maxId >= nodeIdCounter) nodeIdCounter = maxId + 1;
}

function _doLoadLevel(n) {
  // Salva il livello corrente prima di cambiare
  saveCurrentLevelState();

  state.level = n;
  state.nodes = [];
  state.cables = [];
  state.selectedNode = null;
  state.levelStartTime = Date.now();

  // Ripristina eventuale stato salvato
  restoreLevelState(n);

  const lv = LEVELS[n];
  statLevel.textContent = n;
  levelTitle.textContent = lv ? lv.title : `Livello ${n}`;
  objectiveText.textContent = lv ? lv.objective : "";

  renderChecklist();
  renderPalette();
  render();
  liveUpdateChecklist();
  updateTabs();
  log(`▶ Livello ${n} — ${lv ? lv.title : ""} caricato`, "");
}

/* ─── TABS ───────────────────────────────────────────────────── */
function updateTabs() {
  levelTabs.innerHTML = "";
  Object.keys(LEVELS).forEach(n => {
    const num = parseInt(n);
    const btn = document.createElement("button");
    btn.className = "level-tab";
    btn.textContent = num;
    btn.title = LEVELS[num]?.title || `Livello ${num}`;
    if (num === state.level) btn.classList.add("is-active");
    if (state.completedLevels.has(num)) btn.classList.add("is-complete");
    if (!state.unlockedLevels.has(num) && num !== state.level) {
      btn.classList.add("is-locked");
      btn.title += " 🔒";
    }
    btn.addEventListener("click", () => {
      if (state.unlockedLevels.has(num)) {
        loadLevel(num, true);
      } else {
        loadLevel(num, false);
      }
    });
    levelTabs.appendChild(btn);
  });
}

/* ─── PALETTE ────────────────────────────────────────────────── */
const devicePalette = $("devicePalette");

// Track drag-from-palette state
let paletteDragType = null;
let paletteDragGhost = null;

function renderPalette() {
  devicePalette.innerHTML = "";
  const lv = LEVELS[state.level];
  const available = lv ? lv.available : Object.keys(DEVICE_META);
  Object.keys(DEVICE_META).forEach(type => {
    const meta = DEVICE_META[type];
    const card = document.createElement("div");
    card.className = "device-card" + (available.includes(type) ? "" : " is-disabled");
    card.dataset.type = type;
    card.innerHTML = `<div class="device-icon" style="color:${meta.color}">${DEVICE_ICONS[type]}</div><strong>${meta.label}</strong><span>${meta.sub}</span>`;

    if (available.includes(type)) {
      // Drag-and-drop dalla palette alla board
      card.addEventListener("mousedown", e => {
        if (e.button !== 0) return;
        paletteDragType = type;

        // Crea ghost visivo che segue il mouse
        paletteDragGhost = document.createElement("div");
        paletteDragGhost.className = "device-card palette-drag-ghost";
        paletteDragGhost.innerHTML = `<div class="device-icon" style="color:${meta.color}">${DEVICE_ICONS[type]}</div><strong>${meta.label}</strong>`;
        paletteDragGhost.style.cssText = `
          position:fixed; pointer-events:none; z-index:9999;
          opacity:0.85; transform:translate(-50%,-50%) scale(0.92);
          left:${e.clientX}px; top:${e.clientY}px;
          box-shadow: 0 8px 24px rgba(0,0,0,.22);
          border: 2px solid var(--accent, #0f766e);
        `;
        document.body.appendChild(paletteDragGhost);

        e.preventDefault();
      });
    }

    devicePalette.appendChild(card);
  });
}

// Mouse move: aggiorna posizione ghost
document.addEventListener("mousemove", e => {
  if (!paletteDragGhost) return;
  paletteDragGhost.style.left = `${e.clientX}px`;
  paletteDragGhost.style.top  = `${e.clientY}px`;
});

// Mouse up: se sopra la board, piazza il nodo
document.addEventListener("mouseup", e => {
  if (!paletteDragType) return;
  const type = paletteDragType;
  paletteDragType = null;
  if (paletteDragGhost) { paletteDragGhost.remove(); paletteDragGhost = null; }

  // Controlla se il mouse è sopra la board SVG
  const boardRect = board.getBoundingClientRect();
  if (
    e.clientX >= boardRect.left && e.clientX <= boardRect.right &&
    e.clientY >= boardRect.top  && e.clientY <= boardRect.bottom
  ) {
    const lv = LEVELS[state.level];
    const available = lv ? lv.available : Object.keys(DEVICE_META);
    if (!available.includes(type)) return;

    // Converti coordinate schermo → SVG viewBox
    const vb = board.viewBox.baseVal;
    const sx = vb.width  / boardRect.width;
    const sy = vb.height / boardRect.height;
    const rawX = (e.clientX - boardRect.left) * sx;
    const rawY = (e.clientY - boardRect.top)  * sy;
    const snapV = 40;
    const x = Math.round(rawX / snapV) * snapV;
    const y = Math.round(rawY / snapV) * snapV;

    const meta = DEVICE_META[type];
    const id = nodeIdCounter++;
    const typeCount = state.nodes.filter(n => n.type === type).length + 1;
    state.nodes.push({ id, type, x, y, label: `${meta.label}${typeCount}` });
    addXP(2, `Piazzato ${meta.label}`);
    saveCurrentLevelState();
    render();
    liveUpdateChecklist();
  }
});

/* ─── RENDER ──────────────────────────────────────────────────── */
let nodeIdCounter = 1;
function render() {
  cableLayer.innerHTML = "";
  deviceLayer.innerHTML = "";
  statDevices.textContent = state.nodes.length;

  state.cables.forEach(cable => {
    const a = state.nodes.find(n => n.id === cable.a);
    const b = state.nodes.find(n => n.id === cable.b);
    if (!a || !b) return;
    const line = svgEl("line", {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      class: `cable ${cable.type}${cable.active ? " is-active" : ""}`,
      "data-a": cable.a,
      "data-b": cable.b,
    });
    cableLayer.appendChild(line);
  });

  state.nodes.forEach(node => {
    const used = usedPorts(node.id);
    const maxP = maxPorts(node.type);
    const portsFull = used >= maxP;
    const g = svgEl("g", {
      class: `device-node${node.id === state.selectedNode ? " is-selected" : ""}${portsFull ? " ports-full" : ""}`,
      transform: `translate(${node.x},${node.y})`
    });
    const meta = DEVICE_META[node.type] || DEVICE_META.pc;
    g.appendChild(svgEl("rect", { x: -36, y: -36, width: 72, height: 72, rx: 12, class: "node-shell" }));
    g.appendChild(svgEl("rect", { x: -26, y: -26, width: 52, height: 52, rx: 8, class: "node-face" }));
    const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    fo.setAttribute("x", -22); fo.setAttribute("y", -22);
    fo.setAttribute("width", 44); fo.setAttribute("height", 44);
    const div = document.createElement("div");
    div.style.cssText = `width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:${meta.color}`;
    div.innerHTML = DEVICE_ICONS[node.type];
    fo.appendChild(div);
    g.appendChild(fo);
    g.appendChild(svgEl("text", { x: 0, y: 52, class: "node-label" })).textContent = node.label;
    g.appendChild(svgEl("text", { x: 0, y: 64, class: "node-sub" })).textContent = `${meta.sub}`;

    // Badge porte — angolo in alto a destra del nodo, sempre leggibile
    // Solo rosso quando PIENO, altrimenti verde/grigio discreto
    const portBadge = svgEl("g", { class: "port-badge" });
    const badgeLabel = `${used}/${maxP}`;
    // Larghezza dinamica in base alle cifre
    const badgeW = badgeLabel.length <= 3 ? 22 : 28;
    const badgeH = 16;
    const bx = 20;   // angolo destro del nodo (nodo va da -36 a +36)
    const by = -42;  // sopra il nodo

    const badgeFill   = portsFull ? "#ef4444" : used === 0 ? "#f1f5f4" : "#dcfce7";
    const badgeBorder = portsFull ? "#dc2626"  : used === 0 ? "#cbd5d3" : "#16a34a";
    const badgeColor  = portsFull ? "#ffffff"  : used === 0 ? "#9ca3af" : "#15803d";

    portBadge.appendChild(svgEl("rect", {
      x: bx, y: by,
      width: badgeW, height: badgeH,
      rx: 8,
      fill: badgeFill,
      stroke: badgeBorder,
      "stroke-width": "1.2",
    }));
    // Testo centrato dentro il badge
    const bt = svgEl("text", {
      x: bx + badgeW / 2,
      y: by + badgeH / 2 + 1,
      "text-anchor": "middle",
      "dominant-baseline": "central",
      fill: badgeColor,
      "font-size": "8.5",
      "font-weight": "800",
      "font-family": "Inter, monospace",
    });
    bt.textContent = badgeLabel;
    portBadge.appendChild(bt);
    g.appendChild(portBadge);

    g.addEventListener("click", e => { e.stopPropagation(); onNodeClick(node.id); });
    g.addEventListener("mousedown", e => startDrag(e, node));
    g.addEventListener("contextmenu", e => { e.preventDefault(); showContextMenu(e, node.id); });
    g.addEventListener("dblclick", e => { e.stopPropagation(); deleteNode(node.id); });
    deviceLayer.appendChild(g);
  });

}

/* ─── CHECKLIST ──────────────────────────────────────────────── */
function renderChecklist() {
  checklist.innerHTML = "";
  const lv = LEVELS[state.level];
  if (!lv) return;
  lv.checks.forEach(txt => {
    const div = document.createElement("div");
    div.className = "check";
    div.textContent = txt;
    checklist.appendChild(div);
  });
}
function updateChecklist(errs) {
  // errs ignorato: ricalcoliamo sempre live per sicurezza
  liveUpdateChecklist();
}

// Condizioni individuali per ogni check di ogni livello.
// Ogni entry è un array di funzioni booleane, una per check nell'ordine di lv.checks[].
// Se il livello non ha una entry qui, ricadiamo sul matching testuale (fallback).
const CHECK_CONDITIONS = {
  // Livello 1 – LAN a stella
  1: [
    () => nodesByType("pc").length === 4,
    () => nodesByType("switch").length === 1,
    () => {
      const sw = nodesByType("switch")[0];
      const pcs = nodesByType("pc");
      return sw && pcs.length === 4 && pcs.every(pc => getNeighbors(pc.id).includes(sw.id));
    },
    () => straightCables().length === 4 && crossCables().length === 0,
  ],
  // Livello 2 – Internetworking LAN (due subnet)
  2: [
    () => nodesByType("pc").length === 6,
    () => nodesByType("switch").length === 2,
    () => {
      const routers = nodesByType("router");
      const switches = nodesByType("switch");
      if (routers.length !== 1 || switches.length < 2) return false;
      const rn = getNeighbors(routers[0].id);
      return rn.includes(switches[0].id) && rn.includes(switches[1].id);
    },
    () => {
      const switches = nodesByType("switch");
      const pcs = nodesByType("pc");
      return switches.length === 2 && switches.every(sw =>
        pcs.filter(p => getNeighbors(p.id).includes(sw.id)).length >= 3
      );
    },
  ],
  // Livello 3 – Topologia ad anello
  3: [
    () => !state.nodes.some(n => n.type !== "pc"),
    () => nodesByType("pc").length === 6,
    () => nodesByType("pc").every(pc => getNeighbors(pc.id).length === 2),
    () => {
      const pcs = nodesByType("pc");
      if (!pcs.length) return false;
      return bfsReachable(pcs[0].id).size === pcs.length;
    },
    () => crossCables().length === 6 && straightCables().length === 0,
  ],
  // Livello 4 – Firewall perimetrale
  4: [
    () => nodesByType("pc").length >= 2 && nodesByType("switch").length >= 1 &&
          nodesByType("pc").every(pc => getNeighbors(pc.id).some(id => {
            const nd = state.nodes.find(n => n.id === id); return nd && nd.type === "switch";
          })),
    () => {
      const fw = nodesByType("firewall")[0];
      const sw = nodesByType("switch")[0];
      const rt = nodesByType("router")[0];
      return fw && sw && rt && getNeighbors(sw.id).includes(fw.id) && getNeighbors(fw.id).includes(rt.id);
    },
    () => {
      const rt = nodesByType("router")[0];
      const inet = nodesByType("internet")[0];
      return rt && inet && getNeighbors(rt.id).includes(inet.id);
    },
    () => {
      const fw = nodesByType("firewall")[0];
      if (!fw) return false;
      return nodesByType("pc").every(pc => !getNeighbors(pc.id).includes(fw.id) ||
        !getNeighbors(pc.id).some(id => {
          const nd = state.nodes.find(n => n.id === id);
          return nd && (nd.type === "router" || nd.type === "internet");
        })
      );
    },
  ],
  // Livello 5 – Rete scolastica gerarchica
  5: [
    () => nodesByType("pc").length >= 6,
    () => nodesByType("switch").length === 4,
    () => nodesByType("server").length >= 1,
    () => nodesByType("firewall").length === 1,
    () => nodesByType("router").length === 1,
    () => nodesByType("internet").length === 1,
  ],
  // Livello 6 – Client-Server LAN
  6: [
    () => nodesByType("pc").length === 3,
    () => nodesByType("switch").length === 1,
    () => nodesByType("server").length === 1,
    () => {
      const sw = nodesByType("switch")[0];
      const hosts = [...nodesByType("pc"), ...nodesByType("server")];
      return sw && hosts.length === 4 && hosts.every(h => getNeighbors(h.id).includes(sw.id));
    },
    () => straightCables().length === 4 && crossCables().length === 0,
  ],
  // Livello 7 – Doppia LAN + WAN sicura
  7: [
    () => nodesByType("pc").length === 6,
    () => {
      const switches = nodesByType("switch");
      const pcs = nodesByType("pc");
      return switches.length === 2 && switches.every(sw =>
        pcs.filter(p => getNeighbors(p.id).includes(sw.id)).length === 3
      );
    },
    () => {
      const rt = nodesByType("router")[0];
      const switches = nodesByType("switch");
      return rt && switches.length === 2 && switches.every(sw => getNeighbors(sw.id).includes(rt.id));
    },
    () => {
      const rt = nodesByType("router")[0];
      const fw = nodesByType("firewall")[0];
      const inet = nodesByType("internet")[0];
      return rt && fw && inet && getNeighbors(rt.id).includes(fw.id) && getNeighbors(fw.id).includes(inet.id);
    },
    () => {
      const fw = nodesByType("firewall")[0];
      const inet = nodesByType("internet")[0];
      const switches = nodesByType("switch");
      return fw && inet && switches.every(sw =>
        !getNeighbors(sw.id).includes(fw.id) && !getNeighbors(sw.id).includes(inet.id)
      );
    },
  ],
  // Livello 8 – Campus Enterprise
  8: [
    () => nodesByType("pc").length >= 8,
    () => nodesByType("switch").length === 5,
    () => nodesByType("server").length >= 2,
    () => nodesByType("firewall").length === 1,
    () => nodesByType("router").length === 1,
    () => nodesByType("internet").length === 1,
  ],
};

function liveUpdateChecklist() {
  const lv = LEVELS[state.level];
  if (!lv) return;
  const items = checklist.querySelectorAll(".check");
  if (!items.length) return;

  const conditions = CHECK_CONDITIONS[state.level];

  if (conditions) {
    // Valutazione diretta: ogni check ha la sua funzione booleana
    items.forEach((item, i) => {
      const passed = conditions[i] ? conditions[i]() : false;
      item.className = "check" + (passed ? " ok" : "");
    });
  } else {
    // Fallback: usa validate() e matching testuale
    let errs = [];
    try { errs = lv.validate(); } catch(e2) { return; }
    if (errs.length === 0) {
      items.forEach(item => { item.className = "check ok"; });
      return;
    }
    items.forEach((item, i) => {
      const checkText = (lv.checks[i] || "").toLowerCase();
      const numsInCheck = [...checkText.matchAll(/\d+/g)].map(m => m[0]);
      const wordsInCheck = checkText.split(/\W+/).filter(w => w.length >= 4);
      const isContradicted = errs.some(err => {
        const e = err.toLowerCase();
        const kwMatch = wordsInCheck.some(w => e.includes(w));
        const numMatch = numsInCheck.length === 0 || numsInCheck.some(n => e.includes(n));
        return kwMatch && numMatch;
      });
      item.className = "check" + (isContradicted ? "" : " ok");
    });
  }
}

/* ─── CABLE TYPE BUTTONS ─────────────────────────────────────── */
$("straightCable").addEventListener("click", () => setCableType("straight"));
$("crossCable").addEventListener("click", () => setCableType("cross"));
function setCableType(type) {
  state.cableType = type;
  $("straightCable").classList.toggle("is-active", type === "straight");
  $("crossCable").classList.toggle("is-active", type === "cross");
}

/* ─── BOARD CLICKS ───────────────────────────────────────────── */
board.addEventListener("click", e => {
  if (e.target.closest(".device-node")) return;
  contextMenu.classList.remove("show");

  if (state.selectedNode !== null) {
    state.selectedNode = null;
    render();
  }
});

function onNodeClick(id) {
  // Se il nodo è stato appena draggato, ignora il click
  if (state.wasDragged) {
    state.wasDragged = false;
    return;
  }
  contextMenu.classList.remove("show");
  if (state.selectedNode === null) {
    state.selectedNode = id;
    render();
    showToast("Seleziona il secondo nodo per collegarlo", 1800);
  } else if (state.selectedNode === id) {
    state.selectedNode = null;
    render();
  } else {
    addCable(state.selectedNode, id);
    state.selectedNode = null;
    render();
  }
}

function addCable(a, b) {
  const existing = state.cables.findIndex(c => (c.a === a && c.b === b) || (c.a === b && c.b === a));
  if (existing !== -1) { state.cables.splice(existing, 1); saveCurrentLevelState(); render(); liveUpdateChecklist(); return; }
  // Controlla porte disponibili
  const nodeA = state.nodes.find(n => n.id === a);
  const nodeB = state.nodes.find(n => n.id === b);
  if (nodeA && usedPorts(a) >= maxPorts(nodeA.type)) {
    showToast(`🚧 ${nodeA.label} ha già tutte le porte occupate (max ${maxPorts(nodeA.type)})`, 2800);
    state.selectedNode = null; render(); return;
  }
  if (nodeB && usedPorts(b) >= maxPorts(nodeB.type)) {
    showToast(`🚧 ${nodeB.label} ha già tutte le porte occupate (max ${maxPorts(nodeB.type)})`, 2800);
    state.selectedNode = null; render(); return;
  }
  state.cables.push({ a, b, type: state.cableType });
  addXP(1, "Cavo aggiunto");
  saveCurrentLevelState();
  liveUpdateChecklist();
}

function deleteNode(id) {
  state.nodes = state.nodes.filter(n => n.id !== id);
  state.cables = state.cables.filter(c => c.a !== id && c.b !== id);
  if (state.selectedNode === id) state.selectedNode = null;
  saveCurrentLevelState();
  render();
  liveUpdateChecklist();
}

/* ─── DRAG ───────────────────────────────────────────────────── */
function startDrag(e, node) {
  if (e.button !== 0) return;
  e.stopPropagation();
  state.dragging = node;
  const pt = svgPoint(e);
  state.dragOffset = { x: pt.x - node.x, y: pt.y - node.y };
  state.wasDragged = false;

  // Posizione iniziale per rilevare movimento reale
  const startX = pt.x;
  const startY = pt.y;

  const onMove = ev => {
    if (!state.dragging) return;
    const p = svgPoint(ev);
    // Soglia di 5px prima di considerarlo un drag reale
    if (!state.wasDragged) {
      if (Math.abs(p.x - startX) > 5 || Math.abs(p.y - startY) > 5) {
        state.wasDragged = true;
      } else {
        return;
      }
    }
    node.x = p.x - state.dragOffset.x;
    node.y = p.y - state.dragOffset.y;
    render();
  };
  const onUp = () => {
    state.dragging = null;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    if (state.wasDragged) saveCurrentLevelState();
  };
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}

function svgPoint(e) {
  const rect = board.getBoundingClientRect();
  const vb = board.viewBox.baseVal;
  const sx = vb.width / rect.width;
  const sy = vb.height / rect.height;
  return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
}

/* ─── AUTO-MOVE (context menu "Sposta") ──────────────────────── */

/**
 * Trova uno spot libero sulla board, escludendo il nodo che si sta spostando.
 * Dispone i nodi in modo ordinato su una griglia di posizioni preferite.
 */
function findOpenBoardSpot(skipId) {
  const taken = state.nodes.filter(n => n.id !== skipId);
  const candidates = [
    { x: 360, y: 180 }, { x: 550, y: 180 }, { x: 740, y: 180 },
    { x: 360, y: 360 }, { x: 550, y: 360 }, { x: 740, y: 360 },
    { x: 360, y: 540 }, { x: 550, y: 540 }, { x: 740, y: 540 },
    { x: 920, y: 260 }, { x: 920, y: 460 }, { x: 180, y: 260 }, { x: 180, y: 460 },
    { x: 180, y: 360 }, { x: 920, y: 360 }, { x: 550, y: 80  }, { x: 550, y: 640 },
  ];
  const free = candidates.find(spot =>
    taken.every(n => Math.hypot(n.x - spot.x, n.y - spot.y) > 100)
  );
  // Fallback: calcola una posizione circolare se tutti gli slot sono occupati
  if (!free) {
    const count = taken.length;
    const radius = 200 + Math.floor(count / 8) * 80;
    const angle = (count * 45) * (Math.PI / 180);
    return {
      x: Math.round((550 + Math.cos(angle) * radius) / 40) * 40,
      y: Math.round((360 + Math.sin(angle) * radius) / 40) * 40,
    };
  }
  return free;
}

/**
 * Sposta il nodo verso la posizione libera più vicina con animazione fluida.
 */
function autoMoveNode(id) {
  const node = state.nodes.find(n => n.id === id);
  if (!node) return;

  const target = findOpenBoardSpot(id);
  showToast(`🖱️ ${node.label} spostato automaticamente`, 2000);

  const startX = node.x;
  const startY = node.y;
  const start = performance.now();
  const duration = 420;

  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    // Easing cubico out
    const eased = 1 - Math.pow(1 - t, 3);
    node.x = Math.round((startX + (target.x - startX) * eased) / 40) * 40;
    node.y = Math.round((startY + (target.y - startY) * eased) / 40) * 40;
    render();
    if (t < 1) requestAnimationFrame(frame);
    else {
      node.x = target.x;
      node.y = target.y;
      saveCurrentLevelState();
      render();
    }
  }
  requestAnimationFrame(frame);
}

/* ─── CONTEXT MENU ───────────────────────────────────────────── */
function showContextMenu(e, id) {
  state.contextTarget = id;
  contextMenu.style.left = e.clientX + "px";
  contextMenu.style.top = e.clientY + "px";
  contextMenu.classList.add("show");
}
contextMenu.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (state.contextTarget != null) {
      if (action === "delete") deleteNode(state.contextTarget);
      if (action === "move")   autoMoveNode(state.contextTarget);
    }
    contextMenu.classList.remove("show");
  });
});
document.addEventListener("click", () => contextMenu.classList.remove("show"));

/* ─── HINT ───────────────────────────────────────────────────── */
hintBtn.addEventListener("click", () => {
  const lv = LEVELS[state.level];
  if (lv) showToast("💡 " + lv.hint, 5000);
});

/* ─── RESET ──────────────────────────────────────────────────── */
resetBtn.addEventListener("click", () => {
  state.nodes = [];
  state.cables = [];
  state.selectedNode = null;
  state.levelStartTime = Date.now();
  delete state.savedLevels[state.level];
  saveProgress();
  render();
  networkLog.innerHTML = "";
  renderChecklist();
  log("🔄 Rete azzerata");
});

/* ─── TEST ───────────────────────────────────────────────────── */
testBtn.addEventListener("click", runTest);

function runTest() {
  const lv = LEVELS[state.level];
  if (!lv) return;
  const errs = lv.validate();
  updateChecklist(errs);

  if (errs.length > 0) {
    log("❌ Errori rilevati:", "err");
    errs.forEach(e => log("  • " + e, "err"));
    showToast("❌ La rete ha errori — controlla la console", 3000);
    return;
  }

  log("✅ Struttura valida — simulazione pacchetti...", "ok");
  const pairs = lv.pairs ? lv.pairs() : [];

  if (!pairs.length) {
    completeLevel();
    return;
  }

  let pairIdx = 0;
  function sendNext() {
    if (pairIdx >= pairs.length) { completeLevel(); return; }
    const [srcId, dstId] = pairs[pairIdx++];
    simulatePacket(srcId, dstId, () => sendNext());
  }
  sendNext();
}

function completeLevel() {
  const elapsed = (Date.now() - state.levelStartTime) / 1000;
  if (elapsed < 60) state.fastCompletes++;

  const baseXP = LEVELS[state.level]?.difficulty || 20;
  const timeBonus = elapsed < 60 ? 10 : 0;
  const totalXP = baseXP + timeBonus;

  state.completedLevels.add(state.level);
  addXP(totalXP, `Livello ${state.level} completato`);
  saveProgress();

  const nextLevel = state.level + 1;
  if (nextLevel <= 8) state.unlockedLevels.add(nextLevel);
  updateTabs();
  checkBadges();

  const lv = LEVELS[state.level];
  resultIcon.textContent = "🎉";
  resultTitle.textContent = "Rete completata!";
  resultBody.textContent = `${lv?.title || ""} — Ottimo lavoro!`;
  resultInfo.innerHTML = `<strong>${lv?.info || ""}</strong><br><br>⏱ Tempo: ${Math.round(elapsed)}s &nbsp;|&nbsp; +${totalXP} XP${timeBonus ? " (bonus velocità!)" : ""}`;

  if (nextLevel <= 8) {
    resultBtn.textContent = `Livello ${nextLevel} →`;
    resultBtn.onclick = () => { resultModal.close(); loadLevel(nextLevel); };
  } else {
    resultBtn.textContent = "🏆 Fine! Ricomincia";
    resultBtn.onclick = () => { resultModal.close(); loadLevel(1, true); };
  }
  resultModal.showModal();
  log(`🏆 Livello ${state.level} superato! +${totalXP} XP`, "ok");
}

/* ─── PACKET ANIMATION ───────────────────────────────────────── */

function setCableHighlight(aId, bId) {
  cableLayer.querySelectorAll("line").forEach(line => {
    // confronta sia come stringa che come numero per sicurezza
    const da = line.dataset.a;
    const db = line.dataset.b;
    const match = (da == aId && db == bId) || (da == bId && db == aId);
    line.classList.toggle("is-active", match);
  });
}
function clearCableHighlights() {
  cableLayer.querySelectorAll("line").forEach(l => l.classList.remove("is-active"));
}

function simulatePacket(srcId, dstId, onDone) {
  const src = state.nodes.find(n => n.id === srcId);
  const dst = state.nodes.find(n => n.id === dstId);
  if (!src || !dst) { onDone(); return; }

  const path = bfsPath(srcId, dstId);
  if (!path || path.length < 2) {
    log(`✖ ${src.label} → ${dst.label}: nessun percorso`, "err");
    onDone();
    return;
  }

  log(`📦 ${src.label} → ${dst.label} (${path.length - 1} hop)`, "ok");

  // Pallino pacchetto SVG — creato una sola volta, mai rimosso finché non arriva
  const packetG = svgEl("g", {});
  packetG.appendChild(svgEl("circle", {
    r: 10, fill: "#0f766e", stroke: "#ffffff", "stroke-width": "2.5",
  }));
  packetLayer.appendChild(packetG);

  const HOP_MS   = 650;  // durata di ogni hop in millisecondi
  const PAUSE_MS = 160;  // pausa sul nodo dopo ogni hop

  let step = 0;

  function doHop() {
    if (step >= path.length - 1) {
      // Fine percorso
      clearCableHighlights();
      packetG.remove();
      // Flash verde sul nodo destinazione
      const dstNode = state.nodes.find(n => n.id === dstId);
      if (dstNode) {
        const flash = svgEl("circle", {
          cx: dstNode.x, cy: dstNode.y,
          r: 20, fill: "#0f766e", opacity: "0.4",
        });
        packetLayer.appendChild(flash);
        let op = 0.4;
        const fade = setInterval(() => {
          op -= 0.035;
          if (op <= 0) { clearInterval(fade); flash.remove(); }
          else flash.setAttribute("opacity", op);
        }, 16);
      }
      onDone();
      return;
    }

    const fromId = path[step];
    const toId   = path[step + 1];
    const fromNode = state.nodes.find(n => n.id === fromId);
    const toNode   = state.nodes.find(n => n.id === toId);
    if (!fromNode || !toNode) { packetG.remove(); clearCableHighlights(); onDone(); return; }

    // Illumina il cavo di questo hop
    setCableHighlight(fromId, toId);

    const hopLabel = { pc:"host", switch:"switch L2", router:"router L3", firewall:"firewall", server:"server", internet:"WAN" };
    log(`  ↳ ${fromNode.label} → ${toNode.label} (${hopLabel[toNode.type] || toNode.type})`, "");

    const x0 = fromNode.x, y0 = fromNode.y;
    const x1 = toNode.x,   y1 = toNode.y;
    const t0 = performance.now();

    function tick(now) {
      const elapsed = now - t0;
      const rawT = Math.min(elapsed / HOP_MS, 1);
      // ease-in-out cubico
      const e = rawT < 0.5
        ? 4 * rawT * rawT * rawT
        : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      packetG.setAttribute("transform",
        `translate(${x0 + (x1 - x0) * e}, ${y0 + (y1 - y0) * e})`
      );

      if (rawT < 1) {
        requestAnimationFrame(tick);
      } else {
        step++;
        setTimeout(doHop, PAUSE_MS);
      }
    }

    requestAnimationFrame(tick);
  }

  // Posiziona subito sul nodo sorgente e parte
  packetG.setAttribute("transform", `translate(${src.x}, ${src.y})`);
  setTimeout(doHop, 80);
}

function bfsPath(start, end) {
  const prev = new Map([[start, null]]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    if (cur === end) {
      const path = [];
      let node = end;
      while (node != null) { path.unshift(node); node = prev.get(node); }
      return path;
    }
    getNeighbors(cur).forEach(n => { if (!prev.has(n)) { prev.set(n, cur); queue.push(n); } });
  }
  return null;
}

/* ─── EXTRA CSS (injected) ───────────────────────────────────── */
const extraCSS = `
/* ─── Quiz overlay ─── */
.quiz-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(20,16,10,.55); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn .22s ease;
}
.quiz-modal {
  width: min(540px, calc(100vw - 28px));
  background: var(--surface-strong);
  border: 1px solid var(--line); border-radius: 14px;
  padding: 28px; box-shadow: var(--shadow);
  display: flex; flex-direction: column; gap: 18px;
  animation: slideUp .28s ease;
}
.quiz-header { display: flex; align-items: center; gap: 14px; }
.quiz-icon { font-size: 34px; }
.quiz-header h2 { margin: 4px 0 0; font-size: 18px; letter-spacing: -.01em; }
.quiz-progress {
  margin-left: auto; font-weight: 900; font-size: 13px;
  background: #eef8f4; color: var(--accent);
  border: 1px solid #bde7d8; border-radius: 999px; padding: 4px 12px;
}
.quiz-question { font-size: 16px; font-weight: 700; line-height: 1.45; margin: 0; }
.quiz-options { display: grid; gap: 8px; }
.quiz-opt {
  text-align: left; padding: 11px 14px;
  border: 1.5px solid var(--line); border-radius: 10px;
  background: var(--surface); font-size: 14px; font-weight: 600;
  cursor: pointer; transition: border-color .14s, background .14s;
}
.quiz-opt:hover:not(:disabled) { border-color: var(--accent); background: #eef8f4; }
.quiz-opt.correct { border-color: var(--success) !important; background: #eef8ee !important; color: #14532d; }
.quiz-opt.wrong   { border-color: var(--danger)  !important; background: #fff1f1 !important; color: #7f1d1d; }
.quiz-expl {
  padding: 10px 12px; border-radius: 8px; font-size: 13px; line-height: 1.45;
  border-left: 4px solid var(--line-strong);
}
.quiz-expl.ok { border-color: var(--success); background: #eef8ee; color: #14532d; }
.quiz-expl.err { border-color: var(--danger); background: #fff1f1; color: #7f1d1d; }
.quiz-footer { display: flex; align-items: center; justify-content: space-between; }
.quiz-score-dots { display: flex; gap: 6px; }
.quiz-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--line-strong); background: var(--surface); }
.quiz-dot.active { border-color: var(--accent); background: var(--accent); }
.quiz-dot.done   { border-color: var(--success); background: var(--success); }

/* ─── Theory flash ─── */
.theory-overlay {
  position: fixed; inset: 0; z-index: 1900;
  background: rgba(20,16,10,.45); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .25s;
}
.theory-overlay.show { opacity: 1; }
.theory-modal {
  width: min(460px, calc(100vw - 28px));
  background: var(--surface-strong);
  border: 1px solid var(--line); border-radius: 14px;
  padding: 32px 28px; box-shadow: var(--shadow);
  text-align: center;
  transform: translateY(12px); transition: transform .25s;
}
.theory-overlay.show .theory-modal { transform: translateY(0); }
.theory-icon { font-size: 44px; margin-bottom: 10px; }
.theory-modal h2 { margin: 6px 0 10px; font-size: 22px; }
.theory-body { color: var(--muted); font-size: 14px; line-height: 1.65; margin: 0 0 22px; }

/* ─── Badge popup ─── */
.badge-popup {
  position: fixed; bottom: 80px; right: 22px; z-index: 2100;
  display: flex; align-items: center; gap: 12px;
  background: var(--surface-strong); border: 1px solid var(--line);
  border-radius: 12px; padding: 12px 16px;
  box-shadow: var(--shadow); max-width: 280px;
  transform: translateX(120%); transition: transform .32s cubic-bezier(.34,1.56,.64,1);
}
.badge-popup.show { transform: translateX(0); }
.badge-popup-icon { font-size: 28px; }
.badge-popup strong { display: block; font-size: 14px; }
.badge-popup small  { display: block; color: var(--muted); font-size: 12px; margin-top: 2px; }

/* ─── Abbinamento (match game) ─── */
.match-modal {
  width: min(700px, calc(100vw - 28px));
  background: var(--surface-strong);
  border: 1px solid var(--line); border-radius: 14px;
  padding: 28px; box-shadow: var(--shadow);
  display: flex; flex-direction: column; gap: 16px;
  animation: slideUp .28s ease;
  max-height: 90vh; overflow-y: auto;
}
.match-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}
.match-col { display: flex; flex-direction: column; gap: 6px; }
.match-card {
  padding: 10px 14px;
  border: 2px solid var(--line); border-radius: 10px;
  background: var(--surface); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: border-color .14s, background .14s, transform .12s;
  line-height: 1.4;
}
.match-card:hover:not(.matched):not(.wrong-flash) {
  border-color: var(--accent); background: #eef8f4;
  transform: translateY(-1px);
}
.match-card.selected {
  border-color: var(--accent-2); background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(37,99,235,.15);
}
.match-card.matched {
  border-color: var(--success); background: #eef8ee;
  color: #14532d; cursor: default;
  animation: matchPop .3s ease;
}
@keyframes matchPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
}
.match-card.wrong-flash {
  border-color: var(--danger); background: #fff1f1;
  animation: wrongShake .35s ease;
}
@keyframes wrongShake {
  0%,100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
.match-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 6px; border-top: 1px solid var(--line);
}
.match-errors { font-size: 13px; color: var(--muted); font-weight: 600; }
.match-errors strong { color: var(--danger); }

/* ─── Timeline game ─── */
.timeline-modal {
  width: min(580px, calc(100vw - 28px));
  background: var(--surface-strong);
  border: 1px solid var(--line); border-radius: 14px;
  padding: 28px; box-shadow: var(--shadow);
  display: flex; flex-direction: column; gap: 16px;
  animation: slideUp .28s ease;
  max-height: 90vh; overflow-y: auto;
}
.timeline-list {
  display: flex; flex-direction: column; gap: 6px;
}
.tl-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  border: 2px solid var(--line); border-radius: 10px;
  background: var(--surface); font-size: 13px; font-weight: 600;
  cursor: grab; transition: border-color .14s, background .14s, transform .12s;
  line-height: 1.4;
}
.tl-item:hover { border-color: var(--accent); background: #eef8f4; }
.tl-item.dragging { opacity: .4; transform: scale(.97); }
.tl-item.drag-over-tl {
  border-color: var(--accent-2); background: #eff6ff;
  transform: translateY(2px);
}
.tl-handle {
  font-size: 16px; color: var(--muted); flex-shrink: 0; cursor: grab;
  letter-spacing: -1px;
}
.tl-text { flex: 1; }
.tl-item.tl-correct {
  border-color: var(--success); background: #eef8ee; color: #14532d; cursor: default;
}
.tl-item.tl-wrong {
  border-color: var(--danger); background: #fff1f1; color: #7f1d1d; cursor: default;
}
#splashScreen {
  position: fixed; inset: 0; z-index: 3000;
  display: flex; align-items: center; justify-content: center;
  background: var(--paper);
  opacity: 0; transition: opacity .4s ease;
  overflow: hidden;
}
#splashScreen.show { opacity: 1; }
#splashScreen.hide { opacity: 0; pointer-events: none; }
.splash-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(15,118,110,.08) 0%, transparent 70%),
              radial-gradient(ellipse 50% 50% at 20% 80%, rgba(37,99,235,.06) 0%, transparent 60%);
}
.splash-content {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 18px; max-width: 480px; padding: 32px;
  animation: slideUp .5s .1s both ease;
}
.splash-logo {
  position: relative; width: 80px; height: 80px;
  display: flex; align-items: center; justify-content: center;
}
.splash-mark {
  width: 72px; height: 72px;
  display: grid; place-items: center;
  border: 2.5px solid var(--accent); border-radius: 16px;
  color: var(--accent); background: #ecf8f5;
  font-weight: 900; font-size: 26px; letter-spacing: -.02em;
  position: relative; z-index: 1;
}
.splash-pulse {
  position: absolute; inset: -8px; border-radius: 22px;
  border: 2px solid var(--accent); opacity: .3;
  animation: splashPulse 2.4s ease-in-out infinite;
}
@keyframes splashPulse {
  0%,100% { transform: scale(1); opacity: .3; }
  50% { transform: scale(1.1); opacity: .1; }
}
.splash-title {
  margin: 0; font-size: 42px; letter-spacing: -.04em;
  color: var(--ink); font-weight: 900; line-height: 1;
}
.splash-sub {
  margin: 0; color: var(--muted); font-size: 15px; font-weight: 500;
}
.splash-features {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%;
}
.splash-feat {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--line); border-radius: var(--radius);
  background: var(--surface-strong);
  font-size: 13px; font-weight: 600; color: var(--ink);
}
.splash-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 28px; margin-top: 6px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 10px; cursor: pointer;
  font-size: 16px; font-weight: 800;
  transition: transform .16s, box-shadow .16s;
  box-shadow: 0 12px 32px rgba(15,118,110,.28);
}
.splash-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(15,118,110,.36); }
.splash-note { margin: 0; color: var(--muted); font-size: 12px; }
.splash-nodes { position: absolute; inset: 0; pointer-events: none; }
.splash-node {
  position: absolute;
  animation: splashFloat linear infinite;
}
@keyframes splashFloat {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(8deg); }
}

/* ─── Final completion screen ─── */
#finalScreen {
  position: fixed; inset: 0; z-index: 3000;
  display: flex; align-items: center; justify-content: center;
  background: var(--paper);
  opacity: 0; transition: opacity .4s ease;
  overflow: hidden;
}
#finalScreen.show { opacity: 1; }
#finalScreen.hide { opacity: 0; pointer-events: none; }
.final-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 70% 50% at 50% 30%, rgba(22,128,60,.09) 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 20% 80%, rgba(15,118,110,.07) 0%, transparent 60%);
}
.final-content {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 20px; max-width: 580px; padding: 32px;
  animation: slideUp .5s .1s both ease;
}
.final-trophy {
  font-size: 72px; line-height: 1;
  animation: trophyBounce .6s .2s both cubic-bezier(.34,1.56,.64,1);
}
@keyframes trophyBounce {
  from { transform: scale(0) rotate(-20deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg); opacity: 1; }
}
.final-title {
  margin: 0; font-size: 36px; letter-spacing: -.03em; font-weight: 900;
}
.final-sub { margin: 0; color: var(--muted); font-size: 14px; max-width: 380px; line-height: 1.5; }
.final-stats {
  display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
}
.final-stat {
  min-width: 110px; padding: 14px 16px;
  border: 1px solid var(--line); border-radius: 12px;
  background: var(--surface-strong);
}
.final-stat strong { display: block; font-size: 32px; font-weight: 900; color: var(--accent); }
.final-stat span { display: block; font-size: 12px; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-top: 2px; }
.final-recap {
  width: 100%; padding: 16px; border: 1px solid var(--line);
  border-radius: 12px; background: var(--surface-strong);
  text-align: left;
}
.final-topics {
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px;
}
.final-topic {
  padding: 7px 10px;
  border-radius: 8px;
  background: #eef8f4; color: #14532d;
  font-size: 12px; font-weight: 700;
}
.final-badges-row {
  display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
}
.final-badge {
  padding: 6px 12px; border-radius: 999px;
  background: #fff8e7; border: 1px solid #e7c975;
  color: #7a4d00; font-size: 12px; font-weight: 800;
}
.final-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.final-btn-replay, .final-btn-osi { min-height: 44px; padding: 0 20px; font-size: 14px; }

/* ─── OSI Minigioco ─── */
.osi-game-modal {
  width: min(640px, calc(100vw - 28px));
  background: var(--surface-strong);
  border: 1px solid var(--line); border-radius: 14px;
  padding: 28px; box-shadow: var(--shadow);
  display: flex; flex-direction: column; gap: 16px;
  animation: slideUp .28s ease;
  max-height: 90vh; overflow-y: auto;
}
.osi-game-header { display: flex; align-items: center; gap: 14px; }
.osi-game-header h2 { margin: 4px 0 0; font-size: 18px; }
.osi-game-intro { margin: 0; color: var(--muted); font-size: 13px; }
.osi-slots {
  display: flex; flex-direction: column; gap: 6px;
}
.osi-slot {
  display: grid; grid-template-columns: 32px 1fr; align-items: center; gap: 8px;
}
.osi-slot-num {
  width: 28px; height: 28px; display: grid; place-items: center;
  background: #eef8f4; border-radius: 50%;
  font-size: 13px; font-weight: 900; color: var(--accent);
  flex-shrink: 0;
}
.osi-slot-drop {
  min-height: 38px; padding: 8px 14px;
  border: 2px dashed var(--line-strong); border-radius: 8px;
  color: var(--muted); font-size: 13px; font-weight: 600;
  display: flex; align-items: center;
  transition: border-color .14s, background .14s;
  cursor: default;
}
.osi-slot-drop.drag-over {
  border-color: var(--accent); background: #eef8f4;
}
.osi-slot-drop.slot-correct {
  border-color: var(--success); background: #eef8ee; color: var(--success);
  border-style: solid;
}
.osi-slot-drop.slot-wrong {
  border-color: var(--danger); background: #fff1f1; color: var(--danger);
  border-style: solid;
}
.osi-items {
  display: flex; flex-wrap: wrap; gap: 6px;
  padding: 12px; border: 1px solid var(--line); border-radius: 10px;
  background: #faf6ed; min-height: 48px;
}
.osi-item {
  padding: 7px 12px; border-radius: 8px;
  border: 2px solid var(--lc, var(--accent));
  background: #fff; cursor: grab;
  display: flex; flex-direction: column;
  transition: transform .12s, box-shadow .12s;
}
.osi-item:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,.1); }
.osi-item.dragging { opacity: .4; transform: scale(.96); }
.osi-item-name { font-size: 13px; font-weight: 800; color: var(--lc, var(--accent)); }
.osi-item-desc { font-size: 11px; color: var(--muted); margin-top: 2px; }
.osi-game-footer { display: flex; justify-content: flex-end; gap: 10px; }

/* ─── Locked tab ─── */
.level-tab.is-locked { opacity: .45; }
.level-tab.is-locked::before { content: "🔒"; font-size: 10px; margin-right: 3px; }

/* ─── Animations ─── */
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
`;

const styleEl = document.createElement("style");
styleEl.textContent = extraCSS;
document.head.appendChild(styleEl);

/* ─── SPLASH SCREEN ──────────────────────────────────────────── */
function showSplashScreen(onStart) {
  const splash = document.createElement("div");
  splash.id = "splashScreen";
  splash.innerHTML = `
    <div class="splash-bg"></div>
    <div class="splash-content">
      <div class="splash-logo">
        <span class="splash-mark">NB</span>
        <div class="splash-pulse"></div>
      </div>
      <h1 class="splash-title">NetBuilder</h1>
      <p class="splash-sub">Laboratorio TPSIT — Costruisci reti reali</p>
      <div class="splash-features">
        <div class="splash-feat"><span>🏗️</span><span>8 scenari progressivi</span></div>
        <div class="splash-feat"><span>📚</span><span>Teoria ISO/OSI & TCP/IP</span></div>
        <div class="splash-feat"><span>🎯</span><span>Quiz e minigiochi</span></div>
        <div class="splash-feat"><span>📦</span><span>Simulazione pacchetti</span></div>
      </div>
      <button class="splash-btn" id="splashStart">
        <span>Inizia il laboratorio</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <p class="splash-note">Progresso salvato automaticamente nel browser</p>
    </div>
    <div class="splash-nodes" id="splashNodes"></div>
  `;
  document.body.appendChild(splash);

  // Animated background nodes
  const nodesContainer = splash.querySelector("#splashNodes");
  const nodeTypes = ["💻","🔀","🌐","🛡️","🖥️"];
  for (let i = 0; i < 12; i++) {
    const nd = document.createElement("div");
    nd.className = "splash-node";
    nd.textContent = nodeTypes[i % nodeTypes.length];
    nd.style.cssText = `
      left:${Math.random()*90+5}%;
      top:${Math.random()*90+5}%;
      animation-delay:${Math.random()*4}s;
      animation-duration:${6+Math.random()*4}s;
      font-size:${18+Math.random()*16}px;
      opacity:${0.08+Math.random()*0.12};
    `;
    nodesContainer.appendChild(nd);
  }

  requestAnimationFrame(() => splash.classList.add("show"));

  splash.querySelector("#splashStart").addEventListener("click", () => {
    splash.classList.add("hide");
    setTimeout(() => { splash.remove(); onStart(); }, 500);
  });
}

/* ─── OSI LAYER MINIGIOCO ────────────────────────────────────── */
function showOsiMiniGame(onComplete) {
  const layers = [
    { n: 7, name: "Applicazione", desc: "Servizi utente (HTTP, FTP, SMTP)", color: "#ef4444" },
    { n: 6, name: "Presentazione", desc: "Sintassi, cifratura, compressione", color: "#f97316" },
    { n: 5, name: "Sessione", desc: "Gestione sessioni e sincronizzazione", color: "#eab308" },
    { n: 4, name: "Trasporto", desc: "Affidabilità end-to-end (TCP/UDP)", color: "#22c55e" },
    { n: 3, name: "Rete", desc: "Routing e indirizzamento IP", color: "#3b82f6" },
    { n: 2, name: "Collegamento", desc: "Frame, MAC, controllo errori", color: "#8b5cf6" },
    { n: 1, name: "Fisico", desc: "Segnali, cavi, bit raw", color: "#ec4899" },
  ];

  // Shuffle for the game
  const shuffled = [...layers].sort(() => Math.random() - 0.5);

  const overlay = document.createElement("div");
  overlay.className = "quiz-overlay";
  overlay.innerHTML = `
    <div class="osi-game-modal">
      <div class="osi-game-header">
        <span class="quiz-icon">🧩</span>
        <div>
          <p class="eyebrow">Minigioco — Modello ISO/OSI</p>
          <h2>Ordina i 7 livelli OSI</h2>
        </div>
        <div class="quiz-progress">dal 7 al 1</div>
      </div>
      <p class="osi-game-intro">Trascina i livelli per ordinarli dal più alto (Applicazione = 7) al più basso (Fisico = 1).</p>
      <div class="osi-slots" id="osiSlots">
        ${Array.from({length:7},(_,i)=>`
          <div class="osi-slot" data-pos="${i}">
            <span class="osi-slot-num">${7-i}</span>
            <div class="osi-slot-drop" data-slot="${i}">Trascina qui…</div>
          </div>`).join("")}
      </div>
      <div class="osi-items" id="osiItems">
        ${shuffled.map(l=>`
          <div class="osi-item" draggable="true" data-layer="${l.n}" style="--lc:${l.color}">
            <span class="osi-item-name">${l.name}</span>
            <span class="osi-item-desc">${l.desc}</span>
          </div>`).join("")}
      </div>
      <div class="osi-game-footer">
        <button class="btn secondary" id="osiSkip">Salta minigioco</button>
        <button class="btn primary" id="osiCheck" disabled>Verifica ✓</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const slots = overlay.querySelectorAll(".osi-slot-drop");
  const items = overlay.querySelectorAll(".osi-item");
  const checkBtn = overlay.querySelector("#osiCheck");
  const slotState = new Array(7).fill(null); // which layer number is in each slot

  // Drag & drop
  let dragItem = null;
  items.forEach(item => {
    item.addEventListener("dragstart", e => {
      dragItem = item;
      item.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      dragItem = null;
    });
  });

  slots.forEach((slot, i) => {
    slot.addEventListener("dragover", e => { e.preventDefault(); slot.classList.add("drag-over"); });
    slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
    slot.addEventListener("drop", e => {
      e.preventDefault();
      slot.classList.remove("drag-over");
      if (!dragItem) return;

      const layerN = parseInt(dragItem.dataset.layer);

      // If slot already has something, return it to items pool
      if (slotState[i] !== null) {
        const existing = overlay.querySelector(`.osi-item[data-layer="${slotState[i]}"]`);
        if (existing) {
          existing.style.display = "";
          overlay.querySelector("#osiItems").appendChild(existing);
        }
      }

      // If this item was already placed elsewhere, clear that slot
      slotState.forEach((v, j) => {
        if (v === layerN) {
          slotState[j] = null;
          slots[j].innerHTML = "Trascina qui…";
          slots[j].className = "osi-slot-drop";
        }
      });

      slotState[i] = layerN;
      slot.innerHTML = `<span style="color:var(--lc,#0f766e);font-weight:800">${dragItem.querySelector(".osi-item-name").textContent}</span>`;
      slot.style.setProperty("--lc", dragItem.style.getPropertyValue("--lc"));
      dragItem.style.display = "none";

      checkBtn.disabled = slotState.some(v => v === null);
    });
  });

  checkBtn.addEventListener("click", () => {
    let correct = 0;
    slotState.forEach((layerN, i) => {
      const expectedN = 7 - i; // slot 0 = level 7, slot 6 = level 1
      const slotEl = slots[i];
      if (layerN === expectedN) {
        correct++;
        slotEl.classList.add("slot-correct");
      } else {
        slotEl.classList.add("slot-wrong");
      }
    });

    const pct = Math.round((correct / 7) * 100);
    addXP(correct * 5, `OSI Minigioco: ${correct}/7 livelli corretti`);

    setTimeout(() => {
      overlay.remove();
      showToast(correct === 7 ? `🏆 Perfetto! Tutti i livelli OSI corretti! +${correct*5} XP` : `${correct}/7 corretti — continua a studiare! +${correct*5} XP`, 3500);
      onComplete();
    }, 1800);
  });

  overlay.querySelector("#osiSkip").addEventListener("click", () => {
    overlay.remove();
    onComplete();
  });
}

/* ─── FINAL COMPLETION SCREEN ────────────────────────────────── */
function showFinalCompletion() {
  const totalXP = state.score;
  const completedCount = state.completedLevels.size;
  const badges = [...state.earnedBadges];

  const screen = document.createElement("div");
  screen.id = "finalScreen";
  screen.innerHTML = `
    <div class="final-bg"></div>
    <div class="final-content">
      <div class="final-trophy">🏆</div>
      <h1 class="final-title">Laboratorio Completato!</h1>
      <p class="final-sub">Hai costruito reti reali e padroneggiato la teoria delle telecomunicazioni</p>
      <div class="final-stats">
        <div class="final-stat">
          <strong>${completedCount}</strong>
          <span>Livelli completati</span>
        </div>
        <div class="final-stat">
          <strong>${totalXP}</strong>
          <span>XP totali</span>
        </div>
        <div class="final-stat">
          <strong>${badges.length}</strong>
          <span>Badge guadagnati</span>
        </div>
      </div>
      <div class="final-recap">
        <p class="eyebrow">Argomenti padroneggiati</p>
        <div class="final-topics">
          <div class="final-topic">🌟 Topologia a stella (LAN)</div>
          <div class="final-topic">🔀 Internetworking e routing L3</div>
          <div class="final-topic">🔁 Topologia ad anello</div>
          <div class="final-topic">🛡️ Firewall e sicurezza perimetrale</div>
          <div class="final-topic">🏫 Reti gerarchiche (scolastica/campus)</div>
          <div class="final-topic">🖥️ Modello client-server</div>
          <div class="final-topic">🌐 Architettura ISO/OSI e TCP/IP</div>
        </div>
      </div>
      ${badges.length ? `<div class="final-badges-row">
        ${BADGES.filter(b => badges.includes(b.id)).map(b => `<span title="${b.desc}" class="final-badge">${b.icon} ${b.label}</span>`).join("")}
      </div>` : ""}
      <div class="final-actions">
        <button class="btn secondary final-btn-replay" id="finalReplay">🔄 Ricomincia da capo</button>
        <button class="btn primary final-btn-osi" id="finalOsi">🧩 Minigioco OSI</button>
      </div>
    </div>
  `;
  document.body.appendChild(screen);
  requestAnimationFrame(() => screen.classList.add("show"));

  screen.querySelector("#finalReplay").addEventListener("click", () => {
    screen.classList.add("hide");
    setTimeout(() => { screen.remove(); loadLevel(1, true); }, 500);
  });

  screen.querySelector("#finalOsi").addEventListener("click", () => {
    screen.classList.add("hide");
    setTimeout(() => {
      screen.remove();
      showOsiMiniGame(() => {});
    }, 300);
  });
}

/* ─── INIT ───────────────────────────────────────────────────── */
// Sblocca i livelli già completati al caricamento
state.completedLevels.forEach(n => {
  state.unlockedLevels.add(n);
  if (n + 1 <= 8) state.unlockedLevels.add(n + 1);
});

// Patch completeLevel to show final screen on level 8
const _origCompleteLevel = completeLevel;
// Override the "after level 8" button in completeLevel
const _patchedCompleteLevel = function() {
  const isLast = state.level === 8;
  _origCompleteLevel();
  if (isLast) {
    // Override the result button to go to final screen
    setTimeout(() => {
      resultBtn.textContent = "🏆 Vedi i risultati finali";
      resultBtn.onclick = () => {
        resultModal.close();
        showFinalCompletion();
      };
    }, 50);
  }
};

// Replace completeLevel references via event patching
testBtn.removeEventListener("click", runTest);
testBtn.addEventListener("click", function() {
  const lv = LEVELS[state.level];
  if (!lv) return;
  const errs = lv.validate();
  updateChecklist(errs);

  if (errs.length > 0) {
    log("❌ Errori rilevati:", "err");
    errs.forEach(e => log("  • " + e, "err"));
    showToast("❌ La rete ha errori — controlla la console", 3000);
    return;
  }

  log("✅ Struttura valida — simulazione pacchetti...", "ok");
  const pairs = lv.pairs ? lv.pairs() : [];

  if (!pairs.length) {
    _patchedCompleteLevel();
    return;
  }

  let pairIdx = 0;
  function sendNext() {
    if (pairIdx >= pairs.length) { _patchedCompleteLevel(); return; }
    const [srcId, dstId] = pairs[pairIdx++];
    simulatePacket(srcId, dstId, () => sendNext());
  }
  sendNext();
});

showSplashScreen(() => {
  loadLevel(1, true);
});