window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level1 = ({ validateLanStar, pcPairs }) => ({
  title: "LAN a stella estesa",
  difficulty: 10,
  available: ["pc", "switch"],
  objective: [
    "Costruisci una LAN a stella di base.",
    "",
    "Requisiti:",
    "- 1 switch centrale",
    "- 4 PC collegati allo switch",
    "- esattamente 4 cavi (c = n - 1)",
    "- usa solo cavi dritti",
    "",
    "La prova invia pacchetti tra due host della stessa LAN.",
  ].join("\n"),
  checks: ["4 PC esatti", "1 switch centrale", "Ogni PC collegato solo allo switch", "Esattamente 4 cavi dritti"],
  hint: "Nella topologia a stella il nodo centrale e' lo switch: con 5 nodi totali servono 4 collegamenti.",
  info: "Nella topologia a stella il numero di collegamenti e' uguale al numero di nodi meno uno.",
  validate: validateLanStar,
  pairs: () => pcPairs(),
});
