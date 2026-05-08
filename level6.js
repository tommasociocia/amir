window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level6 = ({ validateClientServerLan, clientServerPairs }) => ({
  title: "LAN client-server",
  difficulty: 18,
  available: ["pc", "switch", "server"],
  objective: [
    "Costruisci una LAN client-server semplice.",
    "",
    "- 1 switch centrale",
    "- 3 PC client",
    "- 1 server",
    "- tutti collegati allo switch",
    "- esattamente 4 cavi dritti",
    "",
    "La prova testa la comunicazione PC -> Server.",
  ].join("\n"),
  checks: [
    "3 PC esatti",
    "1 switch centrale",
    "1 server",
    "PC e server collegati solo allo switch",
    "Esattamente 4 cavi dritti",
  ],
  hint: "Metti prima lo switch al centro, poi collega i 3 PC e il server con cavi dritti.",
  info: "In una LAN client-server i client raggiungono il server attraverso lo switch di accesso.",
  validate: validateClientServerLan,
  pairs: () => clientServerPairs(),
});
