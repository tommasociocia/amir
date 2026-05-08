window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level1 = ({ validateLanStar, pcPairs }) => ({
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
});
