window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level2 = ({ validateTwoSubnets, routedPair }) => ({
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
});
