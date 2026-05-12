window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level2 = ({ validateTwoSubnets, routedPair }) => ({
  title: "Internetworking LAN",
  difficulty: 25,
  available: ["pc", "switch", "router"],
  objective: [
    "Collega due LAN diverse usando il routing (livello 3 OSI).",
    "",
    "Requisiti:",
    "- 2 switch di accesso",
    "- 6 PC totali (3 per ogni switch)",
    "- 1 router tra le due LAN",
    "- usa solo cavi dritti",
    "",
    "La prova controlla che un PC della prima LAN raggiunga un PC della seconda LAN.",
  ].join("\n"),
  checks: ["6 PC totali", "2 switch di accesso", "Router collegato ai due switch", "3 PC per ogni LAN", "Solo cavi dritti"],
  hint: "Lo switch collega host nella stessa LAN; il router serve quando devi passare da una rete IP a un'altra.",
  info: "Il router lavora al livello 3 OSI: separa domini broadcast diversi e inoltra pacchetti IP verso la rete corretta.",
  validate: validateTwoSubnets,
  pairs: () => routedPair(),
});
