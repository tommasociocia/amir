const board = document.querySelector("#board");
const deviceLayer = document.querySelector("#deviceLayer");
const cableLayer = document.querySelector("#cableLayer");
const packetLayer = document.querySelector("#packetLayer");
const palette = document.querySelector("#devicePalette");
const levelTabs = document.querySelector("#levelTabs");
const objectiveText = document.querySelector("#objectiveText");
const checklist = document.querySelector("#checklist");
const networkLog = document.querySelector("#networkLog");
const toast = document.querySelector("#toast");
const resultModal = document.querySelector("#resultModal");
const contextMenu = document.querySelector("#contextMenu");

const NODE_W = 112;
const NODE_H = 86;

const deviceMeta = {
  pc: { name: "PC", emoji: "🖥️", layer: "Host", ports: 1, cablePeers: ["switch", "router", "pc"] },
  switch: { name: "Switch", emoji: "🔀", layer: "L2", ports: 8, cablePeers: ["pc", "router", "server", "firewall", "switch"] },
  router: { name: "Router", emoji: "📡", layer: "L3", ports: 4, cablePeers: ["switch", "firewall", "internet", "pc"] },
  firewall: { name: "Firewall", emoji: "🛑", layer: "L3/4", ports: 2, cablePeers: ["switch", "router"] },
  server: { name: "Server", emoji: "🗄️", layer: "Host", ports: 2, cablePeers: ["switch"] },
  internet: { name: "Internet", emoji: "🌍", layer: "Rete", ports: 4, cablePeers: ["router"] },
};

const levels = [
  {
    title: "LAN a stella estesa",
    available: ["pc", "switch"],
    objective: [
      "Crea una LAN broadcast a stella, come nelle slide sulle reti locali.",
      "",
      "- 1 switch centrale",
      "- 4 PC collegati allo switch",
      "- esattamente 4 cavi: c = n - 1",
      "- usa cavi dritti",
      "",
      "La prova invia pacchetti tra due host della stessa LAN.",
    ].join("\n"),
    checks: ["4 PC esatti", "Uno switch centrale", "Ogni PC collegato solo allo switch", "Esattamente 4 cavi dritti"],
    hint: "Nella stella il centro e' lo switch. Se hai 5 nodi totali, i canali devono essere 4.",
    info: "Nella topologia a stella il numero di canali e' uguale al numero di nodi meno uno. Al centro si trova un hub o, realisticamente, uno switch.",
    validate: validateLanStar,
    pairs: () => pcPairs(),
  },
  {
    title: "Internetworking LAN",
    available: ["pc", "switch", "router"],
    objective: [
      "Collega due LAN diverse usando il livello Network OSI.",
      "",
      "- 2 switch di accesso",
      "- 6 PC, tre per ogni switch",
      "- 1 router tra le due LAN",
      "- cavi dritti",
      "",
      "La prova controlla che un PC della prima subnet raggiunga un PC dell'altra.",
    ].join("\n"),
    checks: ["6 PC totali", "2 switch di accesso", "Router collegato ai due switch", "3 PC per ogni LAN"],
    hint: "Lo switch collega host nella stessa LAN; il router serve quando devi passare da una rete IP a un'altra.",
    info: "Il router lavora al livello 3 OSI: separa domini broadcast diversi e inoltra pacchetti IP verso la rete corretta.",
    validate: validateTwoSubnets,
    pairs: () => routedPair(),
  },
  {
    title: "Topologia ad anello",
    available: ["pc"],
    objective: [
      "Ricostruisci una topologia storica ad anello.",
      "",
      "- esattamente 6 PC",
      "- ogni PC ha due collegamenti",
      "- l'anello deve essere chiuso",
      "- usa cavi incrociati",
      "",
      "La prova fa girare un token lungo tutto l'anello.",
    ].join("\n"),
    checks: ["6 PC esatti", "Ogni PC ha grado 2", "Anello chiuso", "6 cavi incrociati"],
    hint: "Se un PC ha una sola connessione, l'anello e' aperto. Se ne ha tre, hai creato una diramazione.",
    info: "Nelle topologie ad anello il traffico segue un percorso circolare. E' utile per capire differenze tra bus, stella, anello e maglia.",
    validate: validateRing,
    pairs: () => ringPair(),
  },
  {
    title: "Perimetro LAN-WAN",
    available: ["pc", "switch", "firewall", "router", "internet"],
    objective: [
      "Proteggi una LAN prima di uscire verso Internet.",
      "",
      "- 2 PC collegati allo switch",
      "- switch collegato al firewall",
      "- firewall collegato al router",
      "- router collegato a Internet",
      "- nessun collegamento diretto LAN -> router",
      "",
      "La prova mostra il traffico in uscita e blocca quello in ingresso.",
    ].join("\n"),
    checks: ["2 PC e switch interni", "Firewall tra LAN e router", "Router verso Internet", "Nessun bypass del firewall"],
    hint: "L'ordine corretto e': PC -> switch -> firewall -> router -> Internet.",
    info: "Il firewall applica regole di sicurezza su IP, porte e protocolli. In una rete reale si mette sul perimetro tra LAN privata e uscita WAN.",
    validate: validateFirewall,
    pairs: () => firewallPairs(),
  },
  {
    title: "Rete scolastica",
    available: ["pc", "switch", "server", "firewall", "router", "internet"],
    objective: [
      "Costruisci una piccola rete scolastica gerarchica.",
      "",
      "- 3 switch di aula con almeno 2 PC ciascuno",
      "- 1 switch core centrale",
      "- 1 server collegato al core",
      "- firewall, router e Internet per l'uscita",
      "",
      "La prova testa PC -> server e PC -> Internet.",
    ].join("\n"),
    checks: ["Almeno 6 PC", "3 switch aula + 1 core", "Server sul core", "Uscita: core -> firewall -> router -> Internet"],
    hint: "Pensa a tre livelli: accesso nelle aule, core centrale, perimetro verso Internet.",
    info: "Una rete gerarchica separa accesso, distribuzione/core e WAN: e' piu ordinata, scalabile e facile da mantenere.",
    validate: validateSchool,
    pairs: () => schoolPairs(),
  },
];

const state = {
  level: 0,
  score: Number(localStorage.getItem("netbuilder-score") || 0),
  completed: new Set(JSON.parse(localStorage.getItem("netbuilder-completed") || "[]")),
  savedLevels: JSON.parse(localStorage.getItem("netbuilder-levels") || "{}"),
  initialized: false,
  devices: [],
  cables: [],
  counters: {},
  selectedCable: "straight",
  selectedDevice: null,
  contextDevice: null,
  moveDevice: null,
  connectingFrom: null,
  dragType: null,
  dragDevice: null,
  dragOffset: { x: 0, y: 0 },
  animating: false,
};

function iconSvg(type) {
  return `<span class="device-icon">${deviceIconMarkup(type, false)}</span>`;
}

function deviceIconMarkup(type, compact = true) {
  const size = compact ? 48 : 56;
  const common = `width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"`;
  const cls = compact ? "node-icon" : "";
  const fill = compact ? "node-icon-fill" : "";
  const stroke = compact ? "" : 'stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  const soft = compact ? `class="${fill}"` : 'fill="#dff4ef"';

  const icons = {
    pc: `<svg ${common} ${stroke}><rect x="10" y="12" width="44" height="30" rx="5" ${soft}></rect><rect x="10" y="12" width="44" height="30" rx="5" class="${cls}"></rect><path d="M25 43h14l3 8H22l3-8Z" class="${cls}"></path><path d="M18 52h28" class="${cls}"></path></svg>`,
    switch: `<svg ${common} ${stroke}><rect x="8" y="20" width="48" height="24" rx="6" ${soft}></rect><rect x="8" y="20" width="48" height="24" rx="6" class="${cls}"></rect><path d="M16 30h5M27 30h5M38 30h5M16 37h5M27 37h5M38 37h5" class="${cls}"></path><path d="M19 16v-6h26v6" class="${cls}"></path></svg>`,
    router: `<svg ${common} ${stroke}><ellipse cx="32" cy="36" rx="22" ry="12" ${soft}></ellipse><ellipse cx="32" cy="36" rx="22" ry="12" class="${cls}"></ellipse><path d="M20 35h24M23 29l-8-8M41 29l8-8M32 24V10" class="${cls}"></path><path d="M16 21h10M10 27l5-6-6-5M48 21h-10M54 27l-5-6 6-5M26 10h12" class="${cls}"></path></svg>`,
    firewall: `<svg ${common} ${stroke}><path d="M32 8 52 16v17c0 12-9 20-20 24-11-4-20-12-20-24V16l20-8Z" ${soft}></path><path d="M32 8 52 16v17c0 12-9 20-20 24-11-4-20-12-20-24V16l20-8Z" class="${cls}"></path><path d="M22 32h20M24 23h16M24 41h16M26 32l5 5 9-12" class="${cls}"></path></svg>`,
    server: `<svg ${common} ${stroke}><rect x="16" y="8" width="32" height="14" rx="4" ${soft}></rect><rect x="16" y="25" width="32" height="14" rx="4" ${soft}></rect><rect x="16" y="42" width="32" height="14" rx="4" ${soft}></rect><rect x="16" y="8" width="32" height="14" rx="4" class="${cls}"></rect><rect x="16" y="25" width="32" height="14" rx="4" class="${cls}"></rect><rect x="16" y="42" width="32" height="14" rx="4" class="${cls}"></rect><path d="M23 15h12M23 32h12M23 49h12M43 15h1M43 32h1M43 49h1" class="${cls}"></path></svg>`,
    internet: `<svg ${common} ${stroke}><circle cx="32" cy="32" r="23" ${soft}></circle><circle cx="32" cy="32" r="23" class="${cls}"></circle><path d="M10 32h44M32 9c8 7 12 15 12 23s-4 16-12 23M32 9c-8 7-12 15-12 23s4 16 12 23M15 22h34M15 42h34" class="${cls}"></path></svg>`,
  };

  return icons[type];
}

function init() {
  Object.entries(deviceMeta).forEach(([type, meta]) => {
    const item = document.createElement("div");
    item.className = "device-card";
    item.draggable = true;
    item.dataset.type = type;
    item.innerHTML = `${iconSvg(type)}<span><strong>${meta.name}</strong><span class="port-text">${meta.layer} - ${meta.ports} porte</span></span>`;
    item.addEventListener("dragstart", () => {
      state.dragType = type;
    });
    item.addEventListener("click", () => {
      if (!levels[state.level].available.includes(type)) return;
      const spot = nextAutoPosition(type);
      addDevice(type, spot.x, spot.y);
      showHint(`${deviceMeta[type].emoji} ${deviceMeta[type].name} inserito. Puoi trascinarlo per rifinire lo schema.`, "ok");
    });
    palette.appendChild(item);
  });

  levels.forEach((level, index) => {
    const btn = document.createElement("button");
    btn.className = "level-tab";
    btn.type = "button";
    btn.textContent = index + 1;
    btn.addEventListener("click", () => loadLevel(index));
    levelTabs.appendChild(btn);
  });

  document.querySelectorAll(".cable-tool").forEach((btn) => {
    btn.addEventListener("click", () => selectCable(btn.dataset.cable));
  });

  document.querySelector("#testBtn").addEventListener("click", runTest);
  document.querySelector("#hintBtn").addEventListener("click", () => showHint(levels[state.level].hint, "warn"));
  document.querySelector("#resetBtn").addEventListener("click", resetLevel);
  document.querySelector("#resultBtn").addEventListener("click", closeResult);

  board.addEventListener("dragover", (event) => event.preventDefault());
  board.addEventListener("drop", onBoardDrop);
  board.addEventListener("pointermove", onPointerMove);
  board.addEventListener("pointerup", () => {
    if (state.dragDevice) saveCurrentLevelState();
    state.dragDevice = null;
  });
  board.addEventListener("pointerleave", () => {
    state.dragDevice = null;
  });
  board.addEventListener("click", (event) => {
    hideContextMenu();
    if (state.moveDevice) {
      const point = toSvgPoint(event.clientX, event.clientY);
      moveDeviceTo(state.moveDevice, snap(point.x), snap(point.y), true);
      state.moveDevice = null;
      return;
    }
    if (event.target === board || event.target.tagName === "rect") {
      state.selectedDevice = null;
      state.connectingFrom = null;
      render();
    }
  });

  contextMenu.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    if (!action || !state.contextDevice) return;
    const device = getDevice(state.contextDevice);
    hideContextMenu();
    if (!device) return;
    if (action === "delete") {
      removeDevice(device.id);
      return;
    }
    if (action === "move") {
      autoMoveDevice(device.id);
    }
  });

  document.addEventListener("click", (event) => {
    if (!contextMenu.contains(event.target)) hideContextMenu();
  });

  document.addEventListener("keydown", (event) => {
    if ((event.key === "Delete" || event.key === "Backspace") && state.selectedDevice) {
      removeDevice(state.selectedDevice);
    }
  });

  loadLevel(0);
}

function loadLevel(index) {
  if (state.initialized) saveCurrentLevelState();
  state.level = index;
  resetStateOnly(true);
  restoreLevelState(index);
  document.querySelector("#levelTitle").textContent = levels[index].title;
  objectiveText.textContent = levels[index].objective;
  updateLevelTabs();
  document.querySelectorAll(".device-card").forEach((card) => {
    card.classList.toggle("is-disabled", !levels[index].available.includes(card.dataset.type));
    card.querySelector(".port-text").textContent = `${deviceMeta[card.dataset.type].layer} - ${maxPorts(card.dataset.type)} porte`;
  });
  addLog(`🎯 Scenario caricato: ${levels[index].title}`, "ok");
  state.initialized = true;
  render();
}

function updateLevelTabs() {
  document.querySelectorAll(".level-tab").forEach((btn, i) => {
    btn.classList.toggle("is-active", i === state.level);
    btn.classList.toggle("is-complete", state.completed.has(i));
  });
}

function resetLevel() {
  resetStateOnly(true);
  delete state.savedLevels[state.level];
  saveProgress();
  addLog("🧹 Area ripulita. Ricostruisci la rete seguendo l'obiettivo.", "warn");
  render();
}

function resetStateOnly(clearLog = true) {
  state.devices = [];
  state.cables = [];
  state.counters = {};
  state.selectedDevice = null;
  state.contextDevice = null;
  state.moveDevice = null;
  state.connectingFrom = null;
  state.dragDevice = null;
  packetLayer.innerHTML = "";
  if (clearLog) networkLog.innerHTML = "";
}

function onBoardDrop(event) {
  event.preventDefault();
  if (!state.dragType || !levels[state.level].available.includes(state.dragType)) return;
  const point = toSvgPoint(event.clientX, event.clientY);
  addDevice(state.dragType, snap(point.x), snap(point.y));
  state.dragType = null;
}

function addDevice(type, x, y) {
  state.counters[type] = (state.counters[type] || 0) + 1;
  const device = {
    id: `d-${crypto.randomUUID()}`,
    type,
    x: clamp(x, NODE_W / 2 + 12, 1100 - NODE_W / 2 - 12),
    y: clamp(y, NODE_H / 2 + 12, 720 - NODE_H / 2 - 12),
    label: `${deviceMeta[type].name} ${state.counters[type]}`,
  };
  state.devices.push(device);
  addLog(`${deviceMeta[type].emoji} Aggiunto ${device.label}.`, "ok");
  saveCurrentLevelState();
  render();
}

function nextAutoPosition(type) {
  const count = state.devices.length;
  const center = { x: 550, y: 360 };
  const radius = 190 + Math.floor(count / 7) * 70;
  const angle = (-90 + count * 52) * (Math.PI / 180);
  const preferred = {
    switch: { x: 550, y: 360 },
    router: { x: 760, y: 360 },
    firewall: { x: 660, y: 360 },
    internet: { x: 920, y: 360 },
    server: { x: 550, y: 150 },
  };
  if (type !== "pc" && !state.devices.some((device) => device.type === type)) return preferred[type] || center;
  return {
    x: clamp(center.x + Math.cos(angle) * radius, NODE_W / 2 + 20, 1100 - NODE_W / 2 - 20),
    y: clamp(center.y + Math.sin(angle) * radius, NODE_H / 2 + 20, 720 - NODE_H / 2 - 20),
  };
}

function autoMoveDevice(id) {
  const device = getDevice(id);
  if (!device) return;
  const target = findOpenBoardSpot(device.id);
  showHint(`🖱️ ${device.label} si sposta automaticamente.`, "ok");
  moveDeviceTo(id, target.x, target.y, true);
}

function findOpenBoardSpot(skipId) {
  const taken = state.devices.filter((device) => device.id !== skipId);
  const candidates = [
    { x: 360, y: 180 }, { x: 550, y: 180 }, { x: 740, y: 180 },
    { x: 360, y: 360 }, { x: 550, y: 360 }, { x: 740, y: 360 },
    { x: 360, y: 540 }, { x: 550, y: 540 }, { x: 740, y: 540 },
    { x: 920, y: 260 }, { x: 920, y: 460 }, { x: 180, y: 260 }, { x: 180, y: 460 },
  ];
  return candidates.find((spot) => taken.every((device) => Math.hypot(device.x - spot.x, device.y - spot.y) > 130)) || nextAutoPosition("pc");
}

function moveDeviceTo(id, x, y, animated = false) {
  const device = getDevice(id);
  if (!device) return;
  const targetX = clamp(x, NODE_W / 2 + 12, 1100 - NODE_W / 2 - 12);
  const targetY = clamp(y, NODE_H / 2 + 12, 720 - NODE_H / 2 - 12);
  state.selectedDevice = id;
  state.connectingFrom = null;

  if (!animated) {
    device.x = targetX;
    device.y = targetY;
    saveCurrentLevelState();
    render();
    return;
  }

  const startX = device.x;
  const startY = device.y;
  const start = performance.now();
  const duration = 420;
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    device.x = snap(startX + (targetX - startX) * eased);
    device.y = snap(startY + (targetY - startY) * eased);
    render();
    if (t < 1) requestAnimationFrame(frame);
    else {
      device.x = targetX;
      device.y = targetY;
      saveCurrentLevelState();
      render();
    }
  }
  requestAnimationFrame(frame);
}

function removeDevice(id) {
  const device = getDevice(id);
  state.devices = state.devices.filter((item) => item.id !== id);
  state.cables = state.cables.filter((item) => item.from !== id && item.to !== id);
  state.selectedDevice = null;
  state.contextDevice = null;
  state.connectingFrom = null;
  addLog(`🗑️ ${device?.label || "Nodo"} rimosso.`, "warn");
  saveCurrentLevelState();
  render();
}

function selectCable(type) {
  state.selectedCable = type;
  document.querySelectorAll(".cable-tool").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.cable === type);
  });
  showHint(type === "straight" ? "➖ Cavo dritto selezionato." : "🔀 Cavo incrociato selezionato.", "ok");
}

function render() {
  cableLayer.innerHTML = "";
  deviceLayer.innerHTML = "";

  state.cables.forEach(renderCable);
  state.devices.forEach(renderDevice);
  renderChecklist();
  updateStats();
}

function renderCable(cable) {
  const from = getDevice(cable.from);
  const to = getDevice(cable.to);
  if (!from || !to) return;
  const line = svgEl("line", {
    x1: from.x,
    y1: from.y,
    x2: to.x,
    y2: to.y,
    class: `cable ${cable.type} ${cable.valid ? "" : "invalid"}`,
    "data-id": cable.id,
  });
  line.addEventListener("click", (event) => {
    event.stopPropagation();
    state.cables = state.cables.filter((item) => item.id !== cable.id);
    addLog("✂️ Cavo rimosso.", "warn");
    saveCurrentLevelState();
    render();
  });
  cableLayer.appendChild(line);
}

function renderDevice(device) {
  const group = svgEl("g", {
    class: `device-node ${state.selectedDevice === device.id || state.connectingFrom === device.id ? "is-selected" : ""}`,
    transform: `translate(${device.x - NODE_W / 2}, ${device.y - NODE_H / 2})`,
  });

  group.innerHTML = `
    <rect class="node-shell" width="${NODE_W}" height="${NODE_H}" rx="8"></rect>
    <rect class="node-face" x="13" y="8" width="86" height="39" rx="6"></rect>
    <g transform="translate(32 5)">${deviceIconMarkup(device.type)}</g>
    <text class="node-label" x="56" y="63">${escapeHtml(device.label)}</text>
    <text class="node-sub" x="56" y="78">${usedPorts(device.id)}/${maxPorts(device.type)} porte</text>
  `;

  group.addEventListener("pointerdown", (event) => {
    const point = toSvgPoint(event.clientX, event.clientY);
    state.dragDevice = device.id;
    state.dragOffset = { x: point.x - device.x, y: point.y - device.y };
    event.stopPropagation();
  });

  group.addEventListener("click", (event) => {
    event.stopPropagation();
    hideContextMenu();
    onDeviceClick(device.id);
  });

  group.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
    showDeviceMenu(device.id, event.clientX, event.clientY);
  });

  group.addEventListener("dblclick", (event) => {
    event.stopPropagation();
    removeDevice(device.id);
  });

  deviceLayer.appendChild(group);
}

function onPointerMove(event) {
  if (!state.dragDevice) return;
  const device = getDevice(state.dragDevice);
  if (!device) return;
  const point = toSvgPoint(event.clientX, event.clientY);
  device.x = clamp(snap(point.x - state.dragOffset.x), NODE_W / 2 + 12, 1100 - NODE_W / 2 - 12);
  device.y = clamp(snap(point.y - state.dragOffset.y), NODE_H / 2 + 12, 720 - NODE_H / 2 - 12);
  render();
}

function onDeviceClick(id) {
  if (!state.connectingFrom) {
    state.connectingFrom = id;
    state.selectedDevice = id;
    showHint("🔌 Ora clicca il secondo dispositivo da collegare.", "ok");
    render();
    return;
  }

  if (state.connectingFrom === id) {
    state.connectingFrom = null;
    state.selectedDevice = id;
    render();
    return;
  }

  addCable(state.connectingFrom, id);
  state.connectingFrom = null;
  state.selectedDevice = null;
  render();
}

function addCable(from, to) {
  if (state.cables.some((cable) => sameCable(cable, from, to))) {
    addLog("✖️ Questi due dispositivi sono gia collegati.", "warn");
    return;
  }
  if (usedPorts(from) >= maxPorts(getDevice(from).type) || usedPorts(to) >= maxPorts(getDevice(to).type)) {
    addLog("🚧 Una porta e' esaurita: rimuovi un cavo o usa un altro dispositivo.", "err");
    return;
  }

  const valid = isCableRealistic(from, to, state.selectedCable);
  state.cables.push({ id: `c-${crypto.randomUUID()}`, from, to, type: state.selectedCable, valid });
  addLog(valid ? "✓ Collegamento creato." : "✗ Collegamento sospetto: il tipo di cavo non e' realistico per questi dispositivi.", valid ? "ok" : "err");
  saveCurrentLevelState();
}

function isCableRealistic(fromId, toId, cableType) {
  const a = getDevice(fromId);
  const b = getDevice(toId);
  if (!a || !b) return false;
  const directPcPc = a.type === "pc" && b.type === "pc";
  if (directPcPc) return cableType === "cross";
  if (a.type === "pc" && b.type === "pc") return cableType === "cross";
  if (a.type === "switch" && b.type === "switch") return cableType === "cross";
  if (a.type === "internet" || b.type === "internet") return cableType === "straight";
  return cableType === "straight";
}

async function runTest() {
  if (state.animating) return;
  const level = levels[state.level];
  const result = level.validate();
  const pairs = level.pairs();
  state.animating = true;
  packetLayer.innerHTML = "";
  setCablesActive([]);
  addLog("🚀 Avvio prova: invio pacchetti nella rete...", "ok");

  if (!pairs.length) {
    addLog("⚠️ Non ci sono ancora due nodi adatti da testare.", "err");
  }

  for (const pair of pairs) {
    await simulatePair(pair);
  }

  state.animating = false;
  setCablesActive([]);

  if (result.ok) {
    if (!state.completed.has(state.level)) {
      state.completed.add(state.level);
      state.score += 100 * (state.level + 1);
      saveProgress();
      updateLevelTabs();
    }
    showResult(true, "🎉 Rete funzionante", `Hai completato: ${level.title}. Il livello resta salvato.`, level.info);
  } else {
    showResult(false, "💥 La rete non funziona ancora", result.msg, `💡 Indizio: ${result.hint || level.hint}`);
    showHint(result.hint || level.hint, "warn");
  }
  updateStats();
}

async function simulatePair(pair) {
  const source = getDevice(pair.src);
  const target = getDevice(pair.dst);
  if (!source || !target) return;
  addLog(`🧪 Test: ${source.label} -> ${target.label}`, "ok");

  const path = findPath(pair.src, pair.dst);
  if (!path) {
    await pulseFailure(source, "Nessun percorso");
    addLog(`✗ Nessun percorso tra ${source.label} e ${target.label}.`, "err");
    return;
  }

  if (pair.blocked) {
    await animatePath(path, true, pair.blockAt || "firewall");
    addLog("🛑 Il firewall ha bloccato il traffico in ingresso: comportamento corretto.", "ok");
    return;
  }

  await animatePath(path, false);
  addLog(`✓ Pacchetto consegnato a ${target.label}. ACK ricevuto.`, "ok");
}

async function animatePath(path, shouldBlock, blockType) {
  for (let i = 0; i < path.length - 1; i += 1) {
    const from = getDevice(path[i]);
    const to = getDevice(path[i + 1]);
    if (!from || !to) continue;
    const cable = state.cables.find((item) => sameCable(item, from.id, to.id));
    setCablesActive(cable ? [cable.id] : []);
    addLog(`✨ ${from.label} -> ${to.label}: ${operationFor(to.type)}`, "ok");
    await animatePacket(from, to, shouldBlock && to.type === blockType);
    if (shouldBlock && to.type === blockType) {
      await pulseFailure(to, "Bloccato");
      setCablesActive([]);
      return;
    }
  }
}

function animatePacket(from, to, fail) {
  return new Promise((resolve) => {
    const packet = svgEl("g", {});
    const circle = svgEl("circle", { class: `packet ${fail ? "fail" : ""}`, r: 13, cx: from.x, cy: from.y });
    const label = svgEl("text", { class: "packet-label", x: from.x, y: from.y - 22 });
    label.textContent = fail ? "DROP" : "PKT";
    packet.append(circle, label);
    packetLayer.appendChild(packet);

    const start = performance.now();
    const duration = 620;
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const x = from.x + (to.x - from.x) * eased;
      const y = from.y + (to.y - from.y) * eased;
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      label.setAttribute("x", x);
      label.setAttribute("y", y - 22);
      if (t < 1) requestAnimationFrame(frame);
      else {
        packet.remove();
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}

function pulseFailure(device, text) {
  return new Promise((resolve) => {
    const badge = svgEl("g", {});
    badge.innerHTML = `
      <rect class="node-badge" x="${device.x - 48}" y="${device.y - 72}" width="96" height="28" rx="8"></rect>
      <text class="node-badge-text" x="${device.x}" y="${device.y - 58}">${escapeHtml(text)}</text>
    `;
    packetLayer.appendChild(badge);
    setTimeout(() => {
      badge.remove();
      resolve();
    }, 950);
  });
}

function setCablesActive(ids) {
  cableLayer.querySelectorAll(".cable").forEach((line) => {
    line.classList.toggle("is-active", ids.includes(line.dataset.id));
  });
}

function renderChecklist() {
  const status = levels[state.level].validate({ quiet: true });
  checklist.innerHTML = "";
  levels[state.level].checks.forEach((text, index) => {
    const item = document.createElement("div");
    item.className = `check ${status.passed?.includes(index) ? "ok" : ""}`;
    item.textContent = text;
    checklist.appendChild(item);
  });
}

function validateLanStar() {
  const pcs = devicesOf("pc");
  const switches = devicesOf("switch");
  const passed = [];
  if (pcs.length === 4) passed.push(0);
  if (switches.length === 1) passed.push(1);
  if (pcs.length === 4 && switches[0] && pcs.every((pc) => getConnectedDevices(pc.id).length === 1 && getConnectedDevices(pc.id)[0]?.type === "switch")) passed.push(2);
  if (state.cables.length === 4 && state.cables.every((cable) => cable.type === "straight" && cable.valid)) passed.push(3);
  if (!passed.includes(0)) return fail(`Servono esattamente 4 PC, ora ne hai ${pcs.length}.`, passed);
  if (!passed.includes(1)) return fail("Usa esattamente uno switch centrale.", passed);
  if (!passed.includes(2)) return fail("Ogni PC deve arrivare allo switch, senza collegamenti PC-PC.", passed);
  if (!passed.includes(3)) return fail("La stella deve avere esattamente 4 cavi dritti: c = n - 1.", passed);
  return ok(passed);
}

function validateTwoSubnets() {
  const pcs = devicesOf("pc");
  const switches = devicesOf("switch");
  const router = devicesOf("router")[0];
  const passed = [];
  if (pcs.length === 6) passed.push(0);
  if (switches.length === 2) passed.push(1);
  if (router && getConnectedDevices(router.id).filter((d) => d.type === "switch").length >= 2) passed.push(2);
  if (switches.length === 2 && switches.every((sw) => getConnectedDevices(sw.id).filter((d) => d.type === "pc").length === 3)) passed.push(3);
  if (!passed.includes(0)) return fail(`Servono esattamente 6 PC, ora ne hai ${pcs.length}.`, passed);
  if (!passed.includes(1)) return fail("Servono esattamente 2 switch, uno per subnet.", passed);
  if (!passed.includes(2)) return fail("Il router deve essere collegato ai due switch.", passed);
  if (!passed.includes(3)) return fail("Metti esattamente 3 PC su ciascuno switch: sono due LAN diverse.", passed);
  return ok(passed);
}

function validateRing() {
  const pcs = devicesOf("pc");
  const passed = [];
  if (pcs.length === 6) passed.push(0);
  if (pcs.length === 6 && pcs.every((pc) => usedPorts(pc.id) === 2)) passed.push(1);
  if (passed.includes(1) && isSingleConnectedComponent(pcs.map((pc) => pc.id))) passed.push(2);
  if (state.cables.length === 6 && state.cables.every((cable) => cable.type === "cross")) passed.push(3);
  if (!passed.includes(0)) return fail(`Servono esattamente 6 PC, ora ne hai ${pcs.length}.`, passed);
  if (!passed.includes(1)) return fail("Ogni PC dell'anello deve avere esattamente due cavi.", passed);
  if (!passed.includes(2)) return fail("L'anello non e' chiuso oppure non collega tutti i PC.", passed);
  if (!passed.includes(3)) return fail("Per questo livello servono 6 cavi incrociati.", passed);
  return ok(passed);
}

function validateFirewall() {
  const pcs = devicesOf("pc");
  const pc = pcs[0];
  const sw = devicesOf("switch")[0];
  const fw = devicesOf("firewall")[0];
  const router = devicesOf("router")[0];
  const wan = devicesOf("internet")[0];
  const passed = [];
  if (pcs.length === 2 && sw && pcs.every((host) => areConnected(host.id, sw.id))) passed.push(0);
  if (sw && fw && router && areConnected(sw.id, fw.id) && areConnected(fw.id, router.id)) passed.push(1);
  if (router && wan && areConnected(router.id, wan.id)) passed.push(2);
  if (pc && wan && fw && findPath(pc.id, wan.id)?.includes(fw.id) && sw && router && !areConnected(sw.id, router.id) && !areConnected(sw.id, wan.id)) passed.push(3);
  if (!passed.includes(0)) return fail("Servono 2 PC collegati allo switch interno.", passed);
  if (!passed.includes(1)) return fail("Il firewall deve stare tra switch e router.", passed);
  if (!passed.includes(2)) return fail("Il router deve essere collegato a Internet.", passed);
  if (!passed.includes(3)) return fail("Non creare bypass: la LAN deve uscire solo passando dal firewall.", passed);
  return ok(passed);
}

function validateSchool() {
  const pcs = devicesOf("pc");
  const switches = devicesOf("switch");
  const server = devicesOf("server")[0];
  const firewall = devicesOf("firewall")[0];
  const router = devicesOf("router")[0];
  const wan = devicesOf("internet")[0];
  const passed = [];
  const core = switches.find((sw) => getConnectedDevices(sw.id).filter((d) => d.type === "switch").length >= 3);
  const accessSwitches = core ? switches.filter((sw) => sw.id !== core.id && areConnected(sw.id, core.id)) : [];
  if (pcs.length >= 6) passed.push(0);
  if (switches.length === 4 && accessSwitches.length === 3 && accessSwitches.every((sw) => getConnectedDevices(sw.id).filter((d) => d.type === "pc").length >= 2)) passed.push(1);
  if (core && server && areConnected(core.id, server.id)) passed.push(2);
  if (core && firewall && router && wan && areConnected(core.id, firewall.id) && areConnected(firewall.id, router.id) && areConnected(router.id, wan.id)) passed.push(3);
  if (!passed.includes(0)) return fail(`Servono almeno 6 PC, ora ne hai ${pcs.length}.`, passed);
  if (!passed.includes(1)) return fail("Servono 3 switch aula collegati al core, con almeno 2 PC per aula.", passed);
  if (!passed.includes(2)) return fail("Collega il server allo switch core centrale.", passed);
  if (!passed.includes(3)) return fail("L'uscita corretta e': core -> firewall -> router -> Internet.", passed);
  return ok(passed);
}

function pcPairs() {
  const pcs = devicesOf("pc");
  return pcs.length >= 2 ? [{ src: pcs[0].id, dst: pcs[1].id }] : [];
}

function routedPair() {
  const switches = devicesOf("switch").slice(0, 2);
  if (switches.length < 2) return pcPairs();
  const a = getConnectedDevices(switches[0].id).find((d) => d.type === "pc");
  const b = getConnectedDevices(switches[1].id).find((d) => d.type === "pc");
  return a && b ? [{ src: a.id, dst: b.id }] : pcPairs();
}

function ringPair() {
  const pcs = devicesOf("pc");
  return pcs.length >= 2 ? [{ src: pcs[0].id, dst: pcs[Math.floor(pcs.length / 2)].id }] : [];
}

function firewallPairs() {
  const pc = devicesOf("pc")[0];
  const wan = devicesOf("internet")[0];
  return pc && wan ? [{ src: pc.id, dst: wan.id }, { src: wan.id, dst: pc.id, blocked: true, blockAt: "firewall" }] : [];
}

function schoolPairs() {
  const pc = devicesOf("pc")[0];
  const server = devicesOf("server")[0];
  const wan = devicesOf("internet")[0];
  const pairs = [];
  if (pc && server) pairs.push({ src: pc.id, dst: server.id });
  if (pc && wan) pairs.push({ src: pc.id, dst: wan.id });
  return pairs;
}

function ok(passed) {
  return { ok: true, passed };
}

function fail(msg, passed) {
  return { ok: false, msg, hint: levels[state.level].hint, passed };
}

function operationFor(type) {
  return {
    pc: "ricezione host",
    switch: "switching livello 2",
    router: "routing livello 3",
    firewall: "controllo regole",
    server: "servizio applicativo",
    internet: "inoltro WAN",
  }[type];
}

function findPath(src, dst, visited = new Set()) {
  if (src === dst) return [src];
  visited.add(src);
  for (const node of getConnectedDevices(src)) {
    if (visited.has(node.id)) continue;
    const path = findPath(node.id, dst, new Set(visited));
    if (path) return [src, ...path];
  }
  return null;
}

function isSingleConnectedComponent(ids) {
  if (!ids.length) return false;
  const visited = new Set();
  const stack = [ids[0]];
  while (stack.length) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    getConnectedDevices(current).forEach((next) => {
      if (ids.includes(next.id) && !visited.has(next.id)) stack.push(next.id);
    });
  }
  return ids.every((id) => visited.has(id));
}

function getConnectedDevices(id) {
  return state.cables
    .filter((cable) => cable.from === id || cable.to === id)
    .map((cable) => getDevice(cable.from === id ? cable.to : cable.from))
    .filter(Boolean);
}

function usedPorts(id) {
  return state.cables.filter((cable) => cable.from === id || cable.to === id).length;
}

function maxPorts(type) {
  if (type === "pc" && levels[state.level]?.title === "Topologia ad anello") return 2;
  return deviceMeta[type].ports;
}

function areConnected(a, b) {
  return state.cables.some((cable) => sameCable(cable, a, b));
}

function sameCable(cable, a, b) {
  return (cable.from === a && cable.to === b) || (cable.from === b && cable.to === a);
}

function devicesOf(type) {
  return state.devices.filter((device) => device.type === type);
}

function getDevice(id) {
  return state.devices.find((device) => device.id === id);
}

function updateStats() {
  document.querySelector("#statLevel").textContent = state.level + 1;
  document.querySelector("#statScore").textContent = state.score;
  document.querySelector("#statDevices").textContent = state.devices.length;
}

function saveProgress() {
  localStorage.setItem("netbuilder-score", String(state.score));
  localStorage.setItem("netbuilder-completed", JSON.stringify([...state.completed]));
  localStorage.setItem("netbuilder-levels", JSON.stringify(state.savedLevels));
}

function saveCurrentLevelState() {
  if (!state.initialized && state.devices.length === 0 && state.cables.length === 0) return;
  state.savedLevels[state.level] = {
    devices: state.devices.map((device) => ({ ...device })),
    cables: state.cables.map((cable) => ({ ...cable })),
    counters: { ...state.counters },
    selectedCable: state.selectedCable,
  };
  saveProgress();
}

function restoreLevelState(index) {
  const saved = state.savedLevels[index];
  if (!saved) return;
  state.devices = (saved.devices || []).map((device) => ({ ...device }));
  state.cables = (saved.cables || []).map((cable) => ({ ...cable }));
  state.counters = { ...(saved.counters || {}) };
  state.selectedCable = saved.selectedCable || "straight";
  document.querySelectorAll(".cable-tool").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.cable === state.selectedCable);
  });
}

function addLog(message, type = "info") {
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  entry.textContent = message;
  networkLog.appendChild(entry);
  networkLog.scrollTop = networkLog.scrollHeight;
  while (networkLog.children.length > 40) networkLog.removeChild(networkLog.firstChild);
}

function showHint(message, type = "ok") {
  toast.textContent = message;
  toast.classList.add("show");
  addLog(message, type);
  clearTimeout(showHint.timer);
  showHint.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function showDeviceMenu(deviceId, x, y) {
  state.contextDevice = deviceId;
  state.selectedDevice = deviceId;
  contextMenu.classList.add("show");
  contextMenu.setAttribute("aria-hidden", "false");
  const pad = 10;
  const menuW = 150;
  const menuH = 90;
  contextMenu.style.left = `${Math.min(x, window.innerWidth - menuW - pad)}px`;
  contextMenu.style.top = `${Math.min(y, window.innerHeight - menuH - pad)}px`;
  render();
}

function hideContextMenu() {
  contextMenu.classList.remove("show");
  contextMenu.setAttribute("aria-hidden", "true");
  state.contextDevice = null;
}

function showResult(success, title, body, info) {
  document.querySelector("#resultIcon").textContent = success ? "✓" : "💡";
  document.querySelector("#resultTitle").textContent = title;
  document.querySelector("#resultBody").textContent = body;
  document.querySelector("#resultInfo").textContent = info;
  document.querySelector("#resultBtn").textContent = success && state.level < levels.length - 1 ? "Prossimo livello" : "Torna alla rete";
  resultModal.showModal();
}

function closeResult() {
  const success = document.querySelector("#resultIcon").textContent === "✓";
  resultModal.close();
  if (success && state.level < levels.length - 1) loadLevel(state.level + 1);
}

function toSvgPoint(clientX, clientY) {
  const point = board.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  return point.matrixTransform(board.getScreenCTM().inverse());
}

function svgEl(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function snap(value) {
  return Math.round(value / 20) * 20;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

init();

