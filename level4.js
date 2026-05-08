window.NetBuilderLevelFactories = window.NetBuilderLevelFactories || {};
window.NetBuilderLevelFactories.level4 = ({ validateFirewall, firewallPairs }) => ({
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
});
