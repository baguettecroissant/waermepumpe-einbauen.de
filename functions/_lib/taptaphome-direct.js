const DAA_ENDPOINT = 'https://www.daa.net/api/v3/leads/send';
const VERSION = '2026-08-26.4-strict-direct-daa-v3';
const MAX_BODY_BYTES = 64 * 1024;
const UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ENUMS = {
  eigentumsverhaeltnisse: new Set([
    'Eigner / Entscheidungsbefugt', 'Eigentümergemeinschaft',
    'Kauf, Notartermin bevorstehend', 'Allgemeine Infosuche vor Immobilienkauf',
    'Mieter ohne Entscheidungsbefugnis', 'Im Eigentümerauftrag',
  ]),
  objekt: new Set([
    'Eigentumswohnung', 'Einfamilienhaus', 'Zweifamilienhaus',
    'Doppelhaushälfte', 'Reihenhaus', 'Mehrfamilienhaus / Wohnanlage',
    'Gewerbeobjekt / Hallenbauten', 'Bürogebäude / Geschäftsgebäude',
    'Carport / Garage', 'Sonstiges (siehe Kommentar)',
  ]),
  dachausrichtung: new Set(['Ost', 'Süd/Ost', 'Süd', 'Süd/West', 'West', 'Nord', 'Nord/Ost', 'Nord/West']),
  dacheindeckung: new Set([
    'Dachziegel', 'Blech', 'Schiefer', 'Dachpappe / Bitumen', 'Folie',
    'Wellplatten', 'Asbesthaltige Eindeckung', 'Biberschwanzziegel',
    'Sonstiges (siehe Kommentar)', 'Begrüntes Dach',
  ]),
  dachtyp: new Set(['Satteldach', 'Pultdach', 'Walmdach', 'Flachdach', 'Ackerfläche', 'Fassade', 'Sonstige Freifläche']),
  stromspeicher: new Set(['Ja', 'Nein', 'Weiß nicht / Beratung erwünscht']),
  stromverbrauch: new Set([
    'bis 1.500 kWh', '1.500-2.500 kWh', '2.500-3.500 kWh',
    '3.500-4.500 kWh', 'über 4.500 kWh', 'über 7.500 kWh', 'über 10.000 kWh',
  ]),
  zeitpunkt_projektbegin: new Set([
    'Umgehend', 'In den nächsten 3 Monaten', 'In 3 bis 6 Monaten',
    'In 6 bis 12 Monaten', 'In mehr als 12 Monaten',
  ]),
  heat_pump_type: new Set([
    'Luft-Wasser-Wärmepumpe', 'Wasser-Wasser-Wärmepumpe (Tiefenbohrung)',
    'Sole-Wasser-Wärmepumpe (Erdwärme)', 'Luft-Luft-Wärmepumpe', 'Beratung erwünscht',
  ]),
  heating_room_location: new Set(['Keller', 'Wohnraum', 'Dachboden', 'Hauswirtschaftsraum', 'Anderer Standort']),
  heizung_aktuell: new Set([
    'Gasheizung', 'Ölheizung', 'Wärmepumpe', 'Pelletheizung', 'Holzheizung',
    'Solarthermie', 'Blockheizkraftwerk', 'Elektroheizung', 'Infrarotheizung',
    'Nachtspeicherheizung', 'Fernwärme', 'Andere Heizung', 'Keine Heizung vorhanden',
  ]),
  heating_elements: new Set([
    'Fußbodenheizung im ganzen Haus', 'Fußbodenheizung im Erdgeschoss + Heizkörper',
    'Fußbodenheizung nur in einzelnen Räumen (z.B. Bad) + Heizkörper',
    'Moderne Plattenheizkörper (Standard)', 'Moderne Plattenheizkörper (Niedertemperatur)',
    'Ältere Rippen- oder Gliederheizkörper', 'Heizkörpersanierung geplant',
    'Wandheizung', 'Sonstige (siehe Kommentar)', 'Nicht bekannt', 'Keine Heizkörper vorhanden',
  ]),
  baujahr: new Set(['Neubau', 'Ab 2002', '1995-2001', '1978-1994', 'vor 1978', 'Baujahr nicht bekannt']),
  tiefenbohrung: new Set(['Ja', 'Nein', 'Weiß nicht / Beratung erwünscht']),
};

const ALIASES = {
  eigentumsverhaeltnisse: {
    eigentuemer: 'Eigner / Entscheidungsbefugt',
    eigentum: 'Eigner / Entscheidungsbefugt',
    'eigentum-vermietet': 'Eigner / Entscheidungsbefugt',
    erbbaurecht: 'Eigner / Entscheidungsbefugt',
    wohneigentum: 'Eigentümergemeinschaft',
    in_kaufabwicklung: 'Kauf, Notartermin bevorstehend',
  },
  objekt: {
    efh: 'Einfamilienhaus',
    einfamilienhaus: 'Einfamilienhaus',
    zfh: 'Zweifamilienhaus',
    zweifamilienhaus: 'Zweifamilienhaus',
    mfh: 'Mehrfamilienhaus / Wohnanlage',
    mehrfamilienhaus: 'Mehrfamilienhaus / Wohnanlage',
    gewerbe: 'Gewerbeobjekt / Hallenbauten',
  },
  dachtyp: { satteldach: 'Satteldach', flachdach: 'Flachdach', pultdach: 'Pultdach' },
  dachausrichtung: { sued: 'Süd' },
  stromspeicher: { ja: 'Ja', nein: 'Nein', unentschlossen: 'Weiß nicht / Beratung erwünscht' },
  zeitpunkt_projektbegin: {
    schnellstmoeglich: 'Umgehend',
    in_3_bis_6_monaten: 'In 3 bis 6 Monaten',
    nur_information: 'In mehr als 12 Monaten',
    sofort: 'In den nächsten 3 Monaten',
    halbjahr: 'In 3 bis 6 Monaten',
    jahr: 'In 6 bis 12 Monaten',
    planung: 'In mehr als 12 Monaten',
  },
  heating_room_location: {
    keller: 'Keller', eg: 'Hauswirtschaftsraum', dach: 'Dachboden',
    abstell: 'Anderer Standort',
  },
  heizung_aktuell: {
    gas: 'Gasheizung', oel: 'Ölheizung', nachtspeicher: 'Nachtspeicherheizung',
    fern: 'Fernwärme', alte_wp: 'Wärmepumpe',
  },
  heating_elements: {
    fbh: 'Fußbodenheizung im ganzen Haus',
    plattenheizkoerper: 'Moderne Plattenheizkörper (Standard)',
    rohr: 'Ältere Rippen- oder Gliederheizkörper',
    mix: 'Fußbodenheizung im Erdgeschoss + Heizkörper',
  },
};

class ClientError extends Error {
  constructor(message, status = 422) {
    super(message);
    this.status = status;
  }
}

const PROJECT_INPUT_KEYS = {
  photovoltaics: new Set([
    'eigentumsverhaeltnisse', 'ownership', 'objekt', 'property_type',
    'nutzflaeche', 'dachflaeche', 'dacheindeckung', 'dachtyp', 'roof_type',
    'dachausrichtung', 'orientation', 'stromspeicher', 'battery_storage',
    'stromverbrauch', 'annual_consumption', 'zeitpunkt_projektbegin', 'timeframe',
    'heat_pump_type', 'heizflaeche',
  ]),
  heat_pump: new Set([
    'eigentumsverhaeltnisse', 'ownership', 'objekt', 'property_type',
    'heat_pump_type', 'heizflaeche', 'flaeche', 'heating_room_location',
    'heizung_aktuell', 'aktuelle_heizung', 'heating_elements', 'heizflaechen',
    'baujahr', 'baujahr_gebaeude', 'baujahr_heizung', 'tiefenbohrung',
    'stromspeicher', 'stromverbrauch', 'dacheindeckung', 'dachtyp',
    'dachausrichtung', 'zeitpunkt_projektbegin', 'timeframe',
  ]),
};

const TOP_LEVEL_KEYS = new Set([
  'firstname', 'lastname', 'first_name', 'last_name', 'forename', 'surname',
  'email', 'phone', 'telephone', 'street', 'street_address', 'address',
  'zip', 'zipcode', 'zip_code', 'postal_code', 'city', 'town',
  'consent', 'consent_at', 'consent_version', 'consent_text_hash',
  'idempotency_key', 'form_started_at', 'page_url', 'source_url',
  'website', 'fax_number', 'company_hp', 'website_url_hp',
  'job_details', 'project', 'projects',
  ...PROJECT_INPUT_KEYS.photovoltaics,
  ...PROJECT_INPUT_KEYS.heat_pump,
]);

const REQUIRED_PROJECT_FIELDS = {
  photovoltaics: ['eigentumsverhaeltnisse', 'objekt', 'nutzflaeche', 'stromverbrauch', 'zeitpunkt_projektbegin'],
  heat_pump: ['eigentumsverhaeltnisse', 'objekt', 'heat_pump_type', 'heizflaeche', 'zeitpunkt_projektbegin'],
};

function compactText(value, max = 200) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function strictText(value, label, max, { required = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) throw new ClientError(`${label} ist erforderlich.`);
    return undefined;
  }
  if (typeof value !== 'string' || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new ClientError(`${label} ist ungültig.`);
  }
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) {
    if (required) throw new ClientError(`${label} ist erforderlich.`);
    return undefined;
  }
  if (normalized.length > max) throw new ClientError(`${label} ist zu lang.`);
  return normalized;
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function assertAllowedKeys(record, allowed, label) {
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) throw new ClientError(`Ungültiges ${label}: ${key}.`);
  }
}

function validateTopLevel(payload) {
  assertAllowedKeys(payload, TOP_LEVEL_KEYS, 'Anfragefeld');
}

function projectInput(value, subject) {
  if (value === undefined || value === null) return {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ClientError('Die Projektdaten sind ungültig.');
  }
  assertAllowedKeys(value, PROJECT_INPUT_KEYS[subject], 'Projektfeld');
  return value;
}

function pickFrom(sources, ...keys) {
  for (const source of sources) {
    const record = object(source);
    for (const key of keys) {
      if (record[key] !== undefined && record[key] !== null && record[key] !== '') return record[key];
    }
  }
  return undefined;
}

function canonicalEnum(field, value) {
  if (value === undefined || value === null || value === '') return undefined;
  const raw = strictText(value, field, 160, { required: true });
  if (ENUMS[field]?.has(raw)) return raw;
  const alias = ALIASES[field]?.[raw.toLowerCase()];
  if (alias && ENUMS[field]?.has(alias)) return alias;
  throw new ClientError(`Ungültiger Wert für ${field}.`);
}

function strictInteger(value, min, max, label) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'number' && typeof value !== 'string') throw new ClientError(`${label} ist ungültig.`);
  const raw = typeof value === 'string' ? value.trim() : value;
  if (typeof raw === 'string' && !/^\d+$/.test(raw)) throw new ClientError(`${label} ist ungültig.`);
  const number = Number(raw);
  if (!Number.isInteger(number) || number < min || number > max) throw new ClientError(`${label} ist ungültig.`);
  return number;
}

function canonicalBuildingYear(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'string') {
    const raw = strictText(value, 'Baujahr', 40, { required: true });
    if (ENUMS.baujahr.has(raw)) return raw;
  }
  const year = strictInteger(value, 1700, new Date().getUTCFullYear() + 2, 'Baujahr');
  if (year >= 2002) return 'Ab 2002';
  if (year >= 1995) return '1995-2001';
  if (year >= 1978) return '1978-1994';
  return 'vor 1978';
}

function setIf(target, key, value) {
  if (value !== undefined) target[key] = value;
}

function normalizeCommon(sources) {
  const details = {};
  setIf(details, 'eigentumsverhaeltnisse', canonicalEnum('eigentumsverhaeltnisse', pickFrom(sources, 'eigentumsverhaeltnisse', 'ownership')));
  setIf(details, 'objekt', canonicalEnum('objekt', pickFrom(sources, 'objekt', 'property_type')));
  setIf(details, 'zeitpunkt_projektbegin', canonicalEnum('zeitpunkt_projektbegin', pickFrom(sources, 'zeitpunkt_projektbegin', 'timeframe')));
  return details;
}

function requireProjectDetails(details, subject) {
  const missing = REQUIRED_PROJECT_FIELDS[subject].filter((field) => details[field] === undefined);
  if (missing.length) throw new ClientError(`Unvollständige Projektdaten: ${missing.join(', ')}.`);
}

function normalizePv(detailsInput, root) {
  const input = projectInput(detailsInput, 'photovoltaics');
  const sources = [input, object(root)];
  const details = normalizeCommon(sources);
  setIf(details, 'nutzflaeche', strictInteger(pickFrom(sources, 'nutzflaeche', 'dachflaeche'), 20, 10000, 'Dachfläche'));
  setIf(details, 'dacheindeckung', canonicalEnum('dacheindeckung', pickFrom(sources, 'dacheindeckung')));
  setIf(details, 'dachtyp', canonicalEnum('dachtyp', pickFrom(sources, 'dachtyp', 'roof_type')));
  setIf(details, 'dachausrichtung', canonicalEnum('dachausrichtung', pickFrom(sources, 'dachausrichtung', 'orientation')));
  setIf(details, 'stromspeicher', canonicalEnum('stromspeicher', pickFrom(sources, 'stromspeicher', 'battery_storage')));
  setIf(details, 'stromverbrauch', canonicalEnum('stromverbrauch', pickFrom(sources, 'stromverbrauch', 'annual_consumption')));
  setIf(details, 'heat_pump_type', canonicalEnum('heat_pump_type', pickFrom(sources, 'heat_pump_type')));
  setIf(details, 'heizflaeche', strictInteger(pickFrom(sources, 'heizflaeche'), 20, 2000, 'Heizfläche'));
  requireProjectDetails(details, 'photovoltaics');
  return details;
}

function normalizeHp(detailsInput, root, defaultHeatPumpType) {
  const input = projectInput(detailsInput, 'heat_pump');
  const sources = [input, object(root)];
  const details = normalizeCommon(sources);
  setIf(details, 'heizflaeche', strictInteger(pickFrom(sources, 'heizflaeche', 'flaeche'), 20, 2000, 'Heizfläche'));
  const requestedType = pickFrom(sources, 'heat_pump_type');
  setIf(details, 'heat_pump_type', canonicalEnum('heat_pump_type', requestedType === undefined ? defaultHeatPumpType : requestedType));
  setIf(details, 'heating_room_location', canonicalEnum('heating_room_location', pickFrom(sources, 'heating_room_location')));
  setIf(details, 'heizung_aktuell', canonicalEnum('heizung_aktuell', pickFrom(sources, 'heizung_aktuell', 'aktuelle_heizung')));
  setIf(details, 'heating_elements', canonicalEnum('heating_elements', pickFrom(sources, 'heating_elements', 'heizflaechen')));

  const buildingInput = pickFrom(sources, 'baujahr_gebaeude');
  const genericYear = pickFrom(sources, 'baujahr');
  setIf(details, 'baujahr', canonicalBuildingYear(buildingInput === undefined ? genericYear : buildingInput));
  const heatingInput = pickFrom(sources, 'baujahr_heizung') ?? (buildingInput === undefined ? undefined : genericYear);
  const heatingYear = strictInteger(heatingInput, 1900, new Date().getUTCFullYear() + 2, 'Baujahr der Heizung');
  if (heatingYear !== undefined) details.baujahr_heizung = String(heatingYear);

  setIf(details, 'tiefenbohrung', canonicalEnum('tiefenbohrung', pickFrom(sources, 'tiefenbohrung')));
  setIf(details, 'stromspeicher', canonicalEnum('stromspeicher', pickFrom(sources, 'stromspeicher')));
  setIf(details, 'stromverbrauch', canonicalEnum('stromverbrauch', pickFrom(sources, 'stromverbrauch')));
  setIf(details, 'dacheindeckung', canonicalEnum('dacheindeckung', pickFrom(sources, 'dacheindeckung')));
  setIf(details, 'dachtyp', canonicalEnum('dachtyp', pickFrom(sources, 'dachtyp')));
  setIf(details, 'dachausrichtung', canonicalEnum('dachausrichtung', pickFrom(sources, 'dachausrichtung')));
  requireProjectDetails(details, 'heat_pump');
  return details;
}

function normalizeContact(payload) {
  const sources = [payload];
  const forename = strictText(pickFrom(sources, 'forename', 'firstname', 'first_name'), 'Vorname', 100, { required: true });
  const surname = strictText(pickFrom(sources, 'surname', 'lastname', 'last_name'), 'Nachname', 100, { required: true });
  const email = strictText(pickFrom(sources, 'email'), 'E-Mail-Adresse', 254, { required: true });
  const phone = strictText(pickFrom(sources, 'phone', 'telephone'), 'Telefonnummer', 40, { required: true });
  const street = strictText(pickFrom(sources, 'street', 'street_address', 'address'), 'Straße und Hausnummer', 200, { required: true });
  const zipcode = strictText(pickFrom(sources, 'zipcode', 'zip', 'zip_code', 'postal_code'), 'Postleitzahl', 5, { required: true });
  const city = strictText(pickFrom(sources, 'city', 'town'), 'Ort', 120, { required: true });

  const errors = [];
  if (forename.length < 2 || !/[\p{L}]/u.test(forename)) errors.push('Vorname');
  if (surname.length < 2 || !/[\p{L}]/u.test(surname)) errors.push('Nachname');
  if (!EMAIL_RE.test(email)) errors.push('E-Mail-Adresse');
  const digits = phone.replace(/\D/g, '');
  if (!/^[+()\d\s./-]+$/.test(phone) || digits.length < 7 || digits.length > 15) errors.push('Telefonnummer');
  if (!/[\p{L}]/u.test(street) || !/\d/.test(street)) errors.push('Straße und Hausnummer');
  if (!/^\d{5}$/.test(zipcode)) errors.push('Postleitzahl');
  if (city.length < 2 || !/[\p{L}]/u.test(city)) errors.push('Ort');
  if (errors.length) throw new ClientError(`Bitte prüfen Sie: ${errors.join(', ')}.`);

  return { forename, surname, email, phone, address: { street, zipcode, city } };
}

function normalizeId(payload) {
  const raw = strictText(payload.idempotency_key, 'Anfragekennung', 36, { required: true });
  if (!UUID_V4_RE.test(raw)) throw new ClientError('Ungültige Anfragekennung. Bitte laden Sie das Formular neu.');
  return raw.toLowerCase();
}

function consentAccepted(payload) {
  return payload.consent === true || payload.consent === 'true';
}

function isHoneypot(payload) {
  return ['website', 'fax_number', 'company_hp', 'website_url_hp'].some((key) => {
    const value = payload[key];
    if (value === undefined || value === null || value === '') return false;
    return typeof value !== 'string' || value.trim().length > 0;
  });
}

function corsHeaders(origin, domain) {
  const allowed = origin === `https://${domain}` || origin === `https://www.${domain}`;
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    vary: 'Origin',
  };
  if (allowed) {
    headers['access-control-allow-origin'] = origin;
    headers['access-control-allow-methods'] = 'POST, OPTIONS';
    headers['access-control-allow-headers'] = 'Content-Type';
    headers['access-control-max-age'] = '86400';
  }
  return headers;
}

function json(domain, origin, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin, domain) });
}

function originAllowed(request, domain) {
  const origin = request.headers.get('Origin') || '';
  return origin === `https://${domain}` || origin === `https://www.${domain}` ? origin : null;
}

async function readPayload(request) {
  const contentType = request.headers.get('Content-Type') || '';
  const mediaParts = contentType.split(';').map((part) => part.trim()).filter(Boolean);
  const validCharset = mediaParts.slice(1).every((part) => /^charset=(?:utf-8|"utf-8")$/i.test(part));
  if (mediaParts[0]?.toLowerCase() !== 'application/json' || mediaParts.length > 2 || !validCharset) {
    throw new ClientError('JSON-Inhalt erforderlich.', 415);
  }
  const contentLength = request.headers.get('Content-Length');
  if (contentLength !== null && !/^\d+$/.test(contentLength)) throw new ClientError('Ungültige Inhaltslänge.', 400);
  const declared = contentLength === null ? 0 : Number(contentLength);
  if (declared > MAX_BODY_BYTES) throw new ClientError('Anfrage ist zu groß.', 413);
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) throw new ClientError('Anfrage ist zu groß.', 413);
  try {
    const payload = JSON.parse(raw);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('shape');
    return payload;
  } catch {
    throw new ClientError('Ungültige JSON-Anfrage.', 400);
  }
}

function projectsFor(config, payload) {
  if (config.mode === 'photovoltaics') {
    return [{ subject: 'photovoltaics', service: 'power_system', job_details: normalizePv(payload.job_details, payload) }];
  }
  if (config.mode === 'heat_pump') {
    return [{ subject: 'heat_pump', service: 'installation', job_details: normalizeHp(payload.job_details, payload, config.defaultHeatPumpType) }];
  }

  const projectRaw = strictText(payload.project, 'Projektwahl', 40, { required: true });
  const project = projectRaw.toLowerCase();
  let nested = {};
  if (payload.projects !== undefined) {
    if (!payload.projects || typeof payload.projects !== 'object' || Array.isArray(payload.projects)) {
      throw new ClientError('Die Projektauswahl ist ungültig.');
    }
    assertAllowedKeys(payload.projects, new Set(['photovoltaics', 'heat_pump']), 'Projektgruppe');
    nested = payload.projects;
  }
  if (project === 'combo' || project === 'both') {
    return [
      { subject: 'photovoltaics', service: 'power_system', job_details: normalizePv(nested.photovoltaics, payload) },
      { subject: 'heat_pump', service: 'installation', job_details: normalizeHp(nested.heat_pump, payload, config.defaultHeatPumpType) },
    ];
  }
  if (project === 'pv' || project === 'photovoltaics') {
    return [{ subject: 'photovoltaics', service: 'power_system', job_details: normalizePv(nested.photovoltaics || payload.job_details, payload) }];
  }
  if (project === 'hp' || project === 'heat_pump') {
    return [{ subject: 'heat_pump', service: 'installation', job_details: normalizeHp(nested.heat_pump || payload.job_details, payload, config.defaultHeatPumpType) }];
  }
  throw new ClientError('Bitte wählen Sie Photovoltaik, Wärmepumpe oder das Kombipaket.');
}

function serviceCredential(value) {
  if (typeof value !== 'string') return '';
  const normalized = value.trim();
  if (!normalized || normalized.length > 512 || /[\u0000-\u001f\u007f]/.test(normalized)) return '';
  return normalized;
}

async function sendToDaa(env, outbound) {
  const username = serviceCredential(env.TAPTAPHOME_USERNAME);
  const apiKey = serviceCredential(env.TAPTAPHOME_API_KEY);
  if (!username || !apiKey) throw new ClientError('Dienst vorübergehend nicht verfügbar.', 503);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(DAA_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${username}:${apiKey}`)}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(outbound),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.success !== true) throw new Error('upstream');
    return {
      id: typeof data.id === 'number' || typeof data.id === 'string' ? String(data.id) : undefined,
      status: compactText(data.status, 80) || 'received',
    };
  } finally {
    clearTimeout(timer);
  }
}

export function createLeadHandlers(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('Invalid direct DAA handler configuration');
  const domain = typeof config.site === 'string' ? config.site.trim().toLowerCase() : '';
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)
    || !['photovoltaics', 'heat_pump', 'combo'].includes(config.mode)) {
    throw new Error('Invalid direct DAA handler configuration');
  }
  if (config.defaultHeatPumpType !== undefined) canonicalEnum('heat_pump_type', config.defaultHeatPumpType);

  async function onRequestGet({ request, env = {} }) {
    const origin = request.headers.get('Origin') || '';
    const mapping = config.mode === 'combo'
      ? [{ subject: 'photovoltaics', service: 'power_system' }, { subject: 'heat_pump', service: 'installation' }]
      : [{ subject: config.mode, service: config.mode === 'photovoltaics' ? 'power_system' : 'installation' }];
    return json(domain, origin, {
      ok: true,
      success: true,
      architecture: 'direct_daa',
      partner: 'TapTapHome/DAA',
      site: domain,
      version: VERSION,
      mapping,
      delivery_enabled: Boolean(serviceCredential(env.TAPTAPHOME_USERNAME) && serviceCredential(env.TAPTAPHOME_API_KEY)),
      storage: 'none',
    });
  }

  async function onRequestOptions({ request }) {
    const origin = originAllowed(request, domain);
    if (!origin) return json(domain, '', { ok: false, success: false, error: 'origin_not_allowed' }, 403);
    return new Response(null, { status: 204, headers: corsHeaders(origin, domain) });
  }

  async function onRequestPost({ request, env = {} }) {
    const origin = originAllowed(request, domain);
    if (!origin) return json(domain, '', { ok: false, success: false, errors: ['Ungültige Anfragequelle.'] }, 403);
    try {
      const payload = await readPayload(request);
      if (isHoneypot(payload)) return json(domain, origin, { ok: true, success: true, received: true });
      validateTopLevel(payload);
      if (!consentAccepted(payload)) throw new ClientError('Die Einwilligung ist erforderlich.');
      const contact = normalizeContact(payload);
      const requestId = normalizeId(payload);
      if (!serviceCredential(env.TAPTAPHOME_USERNAME) || !serviceCredential(env.TAPTAPHOME_API_KEY)) {
        throw new ClientError('Dienst vorübergehend nicht verfügbar.', 503);
      }
      const projects = projectsFor(config, payload);
      const outbound = projects.map((project) => ({
        subject: project.subject,
        service: project.service,
        contact,
        job_details: project.job_details,
        options: {
          locale: 'de_DE',
          site: domain,
          terms_accepted: true,
          id_partner: config.mode === 'combo'
            ? `${domain}:${requestId}:${project.subject}`
            : `${domain}:${requestId}`,
        },
      }));
      const settled = await Promise.allSettled(outbound.map((lead) => sendToDaa(env, lead)));
      if (settled.some((result) => result.status === 'rejected')) throw new Error('upstream');
      const results = settled.map((result) => result.value);
      return json(domain, origin, {
        ok: true,
        success: true,
        protocol_number: results[0]?.id,
        leads: results.map((result) => ({ status: result.status })),
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return json(domain, origin, { ok: false, success: false, errors: [error.message], message: error.message }, error.status);
      }
      return json(domain, origin, {
        ok: false,
        success: false,
        errors: ['Dienst vorübergehend nicht erreichbar. Bitte versuchen Sie es später erneut.'],
        message: 'Dienst vorübergehend nicht erreichbar. Bitte versuchen Sie es später erneut.',
      }, 502);
    }
  }

  return { onRequestGet, onRequestOptions, onRequestPost };
}
