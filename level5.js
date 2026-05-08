window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level5 = ({ validateSchool, schoolPairs }) => ({
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
});
