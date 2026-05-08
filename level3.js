window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level3 = ({ validateRing, ringPair }) => ({
  title: "Topologia ad anello",
  difficulty: 35,
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
});
