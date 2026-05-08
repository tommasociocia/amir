window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level8 = ({ validateCampusEnterprise, campusEnterprisePairs }) => ({
  title: "Campus enterprise",
  difficulty: 75,
  available: ["pc", "switch", "server", "firewall", "router", "internet"],
  objective: [
    "Costruisci una rete campus completa a difficolta alta.",
    "",
    "- 5 switch totali: 1 core + 4 accesso",
    "- almeno 8 PC (minimo 2 per ogni switch di accesso)",
    "- 2 server collegati al core",
    "- uscita obbligatoria: core -> firewall -> router -> Internet",
    "- nessuno switch di accesso deve collegarsi direttamente a firewall/router/Internet",
    "",
    "La prova testa traffico PC -> Server e PC -> Internet.",
  ].join("\n"),
  checks: [
    "Almeno 8 PC",
    "5 switch: 1 core + 4 accesso",
    "Ogni switch di accesso ha almeno 2 PC",
    "2 server collegati al core",
    "Uscita completa: core -> firewall -> router -> Internet",
    "Nessun bypass dagli switch di accesso",
  ],
  hint: "Disegna prima il core, poi i 4 switch di accesso, poi PC e server, e solo alla fine la catena WAN.",
  info: "Una topologia campus gerarchica separa accesso, core e perimetro WAN per scalabilita e controllo.",
  validate: validateCampusEnterprise,
  pairs: () => campusEnterprisePairs(),
});
