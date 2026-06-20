/**
 * ⭐ SITE CONFIGURATION — waermepumpe-einbauen.de
 * EMD single-niche : Wärmepumpe einbauen
 */
export const siteConfig = {
  // === IDENTITÄT ===
  domain: "waermepumpe-einbauen.de",
  name: "Wärmepumpe einbauen",
  tagline: "Wärmepumpe einbauen — Ablauf, Kosten & Fachbetriebe finden 2026",
  description: "Wärmepumpe einbauen 2026: Ablauf, Dauer und Kosten im Überblick. Finden Sie geprüfte Heizungsbetriebe in Ihrer Nähe — kostenlos und unverbindlich.",
  editorialTone: "Installationsberater",

  // === NICHE ===
  niche: {
    slug: "waermepumpe-einbauen",
    name: "Luft-Wasser-Wärmepumpe",
    nameShort: "Wärmepumpe",
    emoji: "🔧",
    icon: "wrench",
    seoTitleTemplate: "Wärmepumpe einbauen in {city} — Ablauf, Kosten & Fachbetriebe {zip}",
    metaDescTemplate: "Wärmepumpe einbauen in {city}: Ablauf, Dauer und Kosten ab {priceMin}€. Finden Sie geprüfte Heizungsbetriebe in Ihrer Nähe — kostenlos und unverbindlich.",
    heroTitle: "Wärmepumpe einbauen — Ablauf, Kosten & Fachbetriebe 2026",
    heroSubtitle: "Sie haben sich entschieden — wir zeigen Ihnen das WIE. Erfahren Sie alles über Ablauf, Dauer, Kosten und finden Sie geprüfte Fachbetriebe für den schnellen Einbau.",
  },

  // === MONETARISIERUNG (TAP TAP HOME) ===
  taptaphome: {
    // Mode can be: 'redirect' (tracking link), 'iframe', or 'api'
    mode: 'api' as 'redirect' | 'iframe' | 'api',
    trackingLinkHP: "https://www.taptaphome.com/?utm_source=affiliate&utm_campaign=waermepumpe_einbauen_de", // Partner tracking link
    partnerName: "DAA GmbH (BOSCH-Gruppe)",
    contactPerson: "Tuuli Himme (tuuli.himme@taptaphome.com)",
    provisionPerLead: "35% des Lead-Umsatzes (ca. 63€ im Schnitt)",
    
    // Top-HP-Regionen (AVR >= 3.0)
    highAvrPrefixes: [
      "04", "07", "09", "12", "13", "14", "15", "16", "21", "22", "27", "28", "30", "31", "40", 
      "41", "42", "44", "45", "46", "47", "49", "55", "57", "58", "60", "64", "65", "68", "80", 
      "81", "82", "85"
    ],
  },

  // === PREISE FÜR EINBAU WÄRMEPUMPEN (2026) ===
  pricing: [
    { service: "Luft-Wasser-Wärmepumpe (Standard)", price: "20.000€ – 35.000€", details: "Am häufigsten installiert, komplett inklusive Deinstallation Altgerät und Einbau" },
    { service: "Luft-Wasser-Wärmepumpe (Premium)", price: "30.000€ – 45.000€", details: "Extrem leise Monoblock-Systeme, Kältemittel Propan R290, Smart-Home-Integration" },
    { service: "Sole-Wasser-Wärmepumpe (Erdwärme)", price: "35.000€ – 55.000€", details: "⚠️ Nicht bei TapTapHome! Nur für SEO-Zwecke (Erdsonde/Kollektor)" },
    { service: "Wasser-Wasser-Wärmepumpe (Grundwasser)", price: "40.000€ – 63.000€", details: "⚠️ Nicht bei TapTapHome! Nur für SEO-Zwecke (Brunnenbohrung)" },
  ],
  pricingNote: "Durchschnittliche Brutto-Kosten für 2026 inklusive Demontage Altgerät, Installation und Inbetriebnahme. Förderung noch nicht abgezogen.",

  // === DETAILED COSTS FROM SPEC ===
  detailedCosts: [
    { item: "Wärmepumpe (Gerät)", price: "8.000€ – 16.000€" },
    { item: "Installation & Montage", price: "6.000€ – 12.000€" },
    { item: "Demontage Altgerät", price: "1.000€ – 3.000€" },
    { item: "Elektrik-Anpassung", price: "800€ – 2.500€" },
    { item: "Pufferspeicher", price: "1.000€ – 3.000€" },
    { item: "Fundament Außeneinheit", price: "500€ – 1.500€" },
    { item: "Genehmigungen/Gutachten", price: "200€ – 800€" },
  ],

  // === BETRIEBSKOSTEN IM VERGLEICH (150m² EFH) ===
  operatingCosts: [
    { system: "Wärmepumpe (COP 3,5)", price: "1.200€ – 1.800€ / Jahr", details: "Heizstrombedarf ca. 4.300 kWh à 28-35 ct" },
    { system: "Gasheizung", price: "2.500€ – 3.500€ / Jahr", details: "Gasbedarf ca. 20.000 kWh à 12-16 ct" },
    { system: "Ölheizung", price: "3.000€ – 4.500€ / Jahr", details: "Ölbedarf ca. 2.000 Liter à 1,00-1,30 €" },
  ],
  savingsNote: "Jährliche Einsparung der Wärmepumpe liegt bei ca. 1.300€ bis 2.700€ im Vergleich zu fossilen Heizsystemen.",

  // === REGIONALE VARIATIONEN (Klimabedingt & Heizgradtage) ===
  regionalMultipliers: {
    south: { name: "Süddeutschland (Kältere Klimazone, höhere Heizlast)", factor: 1.05, heatingDays: "3.200 – 3.500 HGT" },
    center: { name: "Mitteldeutschland", factor: 1.00, heatingDays: "2.900 – 3.200 HGT" },
    north: { name: "Norddeutschland (Mildere Klimazone, Lärmschutzauflagen beachten)", factor: 0.95, heatingDays: "2.700 – 2.900 HGT" },
    east: { name: "Ostdeutschland", factor: 0.90, heatingDays: "2.900 – 3.200 HGT" },
  },

  // === FÖRDERUNG 2026 (KfW-Programm 458) ===
  subsidies: [
    { name: "KfW-Grundförderung", amount: "30%", condition: "Basis-Zuschuss für alle privaten Hauseigentümer" },
    { name: "Klimageschwindigkeits-Bonus", amount: "+20%", condition: "Bei Austausch einer funktionierenden Öl-, Kohle-, Nachtspeicher- oder mind. 20 Jahre alten Gasheizung" },
    { name: "Einkommens-Bonus", amount: "+30%", condition: "Für selbstnutzende Eigentümer mit zvE unter 40.000 € pro Jahr" },
    { name: "Effizienz-Bonus", amount: "+5%", condition: "Für den Einsatz natürlicher Kältemittel (z.B. Propan R290) oder Erdwärme" },
    { name: "Maximaler Fördersatz", amount: "70%", condition: "Gedeckelt auf maximal 30.000 € förderfähige Gesamtkosten" },
    { name: "Maximaler Zuschuss", amount: "21.000 €", condition: "Reine Fördersumme, direkt über das KfW-Portal (Zuschuss 458) zu beantragen" },
  ],

  // === TIMELINE STEPS FROM SPEC ===
  process: [
    { title: "Beratung & Angebote", desc: "Mindestens 3 Angebote einholen, Vor-Ort-Besichtigung durchführen.", icon: "📋", duration: "1–2 Wochen" },
    { title: "KfW-Antrag stellen", desc: "MUSS vor Vertragsabschluss passieren! Einreichung über das KfW-Zuschussportal.", icon: "🏛️", duration: "1 Tag + Zusage" },
    { title: "Vertrag & Planung", desc: "Nach Erhalt der KfW-Zusage: Vertrag unterzeichnen, Einbau-Termin fixieren.", icon: "✍️", duration: "1–2 Wochen" },
    { title: "Demontage Altgerät", desc: "Alte Öl- oder Gasheizung umweltgerecht entfernen und entsorgen.", icon: "🔧", duration: "0.5–1 Tag" },
    { title: "Installation & Elektrik", desc: "Fundament für Außengerät gießen, Hydraulik anschließen, Elektroanschluss fertigstellen.", icon: "⚡", duration: "1.5–2 Tage" },
    { title: "Inbetriebnahme", desc: "Befüllung, Entlüftung, Testlauf und Einweisung durch den Heizungsbauer.", icon: "🟢", duration: "0.5 Tag" }
  ],

  // === FAQ ===
  faq: [
    {
      q: "Wie lange dauert der eigentliche Einbau einer Wärmepumpe vor Ort?",
      a: "Der eigentliche Einbau und die Montage einer Luft-Wasser-Wärmepumpe vor Ort dauern ab Baubeginn in der Regel nur <strong>2 bis 3 Tage</strong>. Die Demontage des Altgeräts nimmt etwa einen halben bis einen Tag in Anspruch, während die Montage der Innen- und Außeneinheit sowie der Elektroanschluss und die Inbetriebnahme jeweils etwa einen Tag dauern."
    },
    {
      q: "Was kostet der Einbau einer Luft-Wasser-Wärmepumpe inklusive Montage 2026?",
      a: "Die Gesamtkosten für eine Luft-Wasser-Wärmepumpe inklusive Einbau, Demontage der Altheizung und Elektroarbeiten liegen 2026 vor Förderung zwischen <strong>20.000 € und 35.000 €</strong>. Durch den Abzug der staatlichen KfW-Förderung (Zuschussprogramm 458) von durchschnittlich 50 % bis 70 % sinkt der tatsächliche Eigenanteil jedoch auf etwa <strong>10.000 € bis 17.500 €</strong>."
    },
    {
      q: "Wann muss der Förderantrag bei der KfW gestellt werden?",
      a: "Der KfW-Förderantrag (Programm 458) <strong>muss zwingend vor Beginn der Arbeiten vor Ort und vor dem finalen Abschluss des Lieferungs- und Leistungsvertrags gestellt werden</strong>. Der Vertrag mit dem Fachbetrieb muss hierfür eine aufschiebende Bedingung enthalten, die an die Zusage der KfW gekoppelt ist."
    },
    {
      q: "Welche Voraussetzungen müssen für den Einbau der Außeneinheit erfüllt sein?",
      a: "Für die Außenaufstellung muss ein solides Betonfundament oder ein stabiles Boden-/Wandkonsolensystem vorhanden sein. Aus Lärmschutzgründen und zur Einhaltung der TA Lärm sollte ein Mindestabstand von 3 Metern zur Grundstücksgrenze eingehalten werden. Je nach Bundesland ist die Installation an der Grenze bei Einhaltung der Lärmwerte genehmigungsfrei."
    },
    {
      q: "Lohnt sich der Einbau einer Wärmepumpe ohne Fußbodenheizung?",
      a: "Ja. Moderne Luft-Wasser-Wärmepumpen mit natürlichen Kältemitteln wie Propan (R290) arbeiten auch mit klassischen Heizkörpern (Plattenheizkörpern) hocheffizient. Oft reicht es aus, einzelne zu kleine Heizkörper durch größere Niedertemperatur-Modelle zu ersetzen, um die benötigte Vorlauftemperatur auf unter 55°C abzusenken."
    },
    {
      q: "Warum ist ein hydraulischer Abgleich beim Wärmepumpen-Einbau Pflicht?",
      a: "Der hydraulische Abgleich sorgt dafür, dass jeder Heizkörper im Haus exakt die richtige Menge an Heizungswasser erhält. Dies verhindert Strömungsgeräusche, optimiert die Effizienz der Wärmepumpe um bis zu 15 % und ist eine **zwingende Voraussetzung für den Erhalt der KfW-Förderung**."
    }
  ],

  // === TRUST BADGES ===
  trustBadges: ["Einbau in 2–3 Tagen", "Geprüfte Fachbetriebe", "Bis zu 70% KfW-Förderung"],

  // === CONTENT BLOCKS ===
  introText: `Sie haben sich bereits für eine nachhaltige Zukunft entschieden und wollen eine moderne Wärmepumpe einbauen? Das ist eine hervorragende Wahl: Angetrieben durch das Gebäudeenergiegesetz (GEG) und gefördert mit Rekordsummen von bis zu 70 % durch die KfW, ist der Heizungswechsel wirtschaftlich so attraktiv wie nie zuvor.

Der Einbau einer hocheffizienten Luft-Wasser-Wärmepumpe dauert vor Ort meist nur 2 bis 3 Tage. Erfahrene regionale Meisterbetriebe übernehmen die Planung, Demontage der Altheizung, Montage der Außeneinheit sowie die hydraulische Einbindung und Elektrik schlüsselfertig aus einer Hand. Unser Portal hilft Ihnen dabei, den genauen Ablauf zu verstehen und kostenlos Angebote von zertifizierten Heizungsbauern in Ihrer Nähe zu vergleichen.`,

  whyChooseUs: [
    "Detaillierte Ablaufpläne von der Beratung bis zur Inbetriebnahme",
    "Geprüfte Heizungsfachbetriebe aus Ihrer Region vergleichen",
    "Kostenlose und unverbindliche Vermittlung von bis zu 3 Angeboten",
    "Sicherung der maximalen KfW-Förderung (Zuschuss 458)",
    "Berücksichtigung aller Lärmschutz- und Aufstellkriterien",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
