window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level7 = ({ validateSecureWan, secureWanPairs }) => ({
  title: "Doppia LAN con uscita protetta",
  difficulty: 52,
  available: ["pc", "switch", "router", "firewall", "internet"],
  objective: [
    "Collega due LAN interne e portale su Internet in modo sicuro.",
    "",
    "- 2 switch di accesso",
    "- 6 PC totali (3 per switch)",
    "- router collegato ai 2 switch",
    "- router -> firewall -> Internet",
    "- nessun bypass diretto switch -> firewall o switch -> Internet",
    "",
    "La prova testa PC-LAN1 -> PC-LAN2 e PC -> Internet.",
  ].join("\n"),
  checks: [
    "6 PC totali",
    "2 switch con 3 PC ciascuno",
    "Router collegato ai due switch",
    "Catena WAN: router -> firewall -> Internet",
    "Nessun bypass degli switch verso firewall/Internet",
  ],
  hint: "Prima crea le due LAN da 3 PC, poi collega tutto al router e chiudi verso Internet passando dal firewall.",
  info: "Il router instrada tra LAN diverse, mentre il firewall controlla il traffico verso la WAN.",
  validate: validateSecureWan,
  pairs: () => secureWanPairs(),
});
