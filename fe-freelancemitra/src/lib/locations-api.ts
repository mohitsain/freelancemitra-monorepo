/**
 * Locations API: countries and states from backend (via public /api/countries).
 * Falls back to static data if the API is unavailable so the UI always works.
 */

import { COUNTRIES as FALLBACK_COUNTRIES, REGIONS as FALLBACK_REGIONS } from "@/data/countries-data";

export interface CountryItem {
  code: string;
  name: string;
  region: string;
  phone_code?: string;
  display_order?: number;
}

export interface StateItem {
  code: string;
  name: string;
}

let countriesCache: CountryItem[] | null = null;
let countriesBackendCache: CountryItem[] | null = null;
/** Single in-flight fetch for /api/countries (no region). Shared by getCountries() and getCountriesFromBackend() so only one request runs. */
let countriesFetchPromise: Promise<CountryItem[] | null> | null = null;
let regionsCache: string[] | null = null;
const statesCache = new Map<string, StateItem[]>();

function toCountryItem(c: {
  code: string;
  name: string;
  region: string;
  phone_code?: string;
  display_order?: number;
}): CountryItem {
  return {
    code: c.code,
    name: c.name,
    region: c.region,
    phone_code: c.phone_code ?? "",
    display_order: c.display_order ?? 0,
  };
}

/** Normalize backend country item (snake_case or camelCase) to CountryItem. */
function normalizeCountryItem(raw: Record<string, unknown>): CountryItem {
  return toCountryItem({
    code: String(raw.code ?? ""),
    name: String(raw.name ?? ""),
    region: String(raw.region ?? ""),
    phone_code: String(raw.phone_code ?? (raw as { phoneCode?: string }).phoneCode ?? ""),
    display_order: Number(raw.display_order ?? (raw as { displayOrder?: number }).displayOrder ?? 0),
  });
}

/** Single fetch for /api/countries (no region). Returns list or null on failure. Fills both caches on success. */
function doCountriesFetch(): Promise<CountryItem[] | null> {
  if (countriesFetchPromise) return countriesFetchPromise;
  countriesFetchPromise = (async () => {
    try {
      const res = await fetch("/api/countries");
      if (!res.ok) return null;
      const data = (await res.json()) as unknown;
      const list = Array.isArray(data) ? data : [];
      if (list.length === 0) return null;
      const items = list.map((c) => normalizeCountryItem(typeof c === "object" && c ? (c as Record<string, unknown>) : {}));
      countriesCache = items;
      countriesBackendCache = items;
      return items;
    } catch {
      return null;
    } finally {
      countriesFetchPromise = null;
    }
  })();
  return countriesFetchPromise;
}

export async function getCountries(region?: string): Promise<CountryItem[]> {
  if (!region && countriesCache) return countriesCache;
  if (!region) {
    const result = await doCountriesFetch();
    if (result) return result;
    const fallback = FALLBACK_COUNTRIES.map(toCountryItem);
    if (!countriesCache) countriesCache = fallback;
    return fallback;
  }
  const url = `/api/countries?region=${encodeURIComponent(region)}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as unknown;
      const list = Array.isArray(data) ? data : [];
      if (list.length > 0)
        return list.map((c) => normalizeCountryItem(typeof c === "object" && c ? (c as Record<string, unknown>) : {}));
    }
  } catch {
    // fall through
  }
  return FALLBACK_COUNTRIES.map(toCountryItem).filter((c) => c.region === region);
}

/**
 * Fetch countries from backend only (no static fallback). Use for phone code dropdown
 * so display format "CODE (+dial)" comes from backend master data.
 * Shares one in-flight request and cache with getCountries() so the API is called at most once.
 */
export async function getCountriesFromBackend(region?: string): Promise<CountryItem[]> {
  if (!region && countriesBackendCache) return countriesBackendCache;
  if (!region) {
    const result = await doCountriesFetch();
    return result ?? [];
  }
  const res = await fetch(`/api/countries?region=${encodeURIComponent(region)}`);
  if (!res.ok) return [];
  const data = (await res.json()) as unknown;
  const list = Array.isArray(data) ? data : [];
  return list.map((c) => normalizeCountryItem(typeof c === "object" && c ? (c as Record<string, unknown>) : {}));
}

export async function getRegions(): Promise<string[]> {
  if (regionsCache) return regionsCache;
  try {
    const res = await fetch("/api/countries/regions");
    if (res.ok) {
      const data = (await res.json()) as string[];
      if (Array.isArray(data) && data.length > 0) {
        regionsCache = data;
        return data;
      }
    }
  } catch {
    // fall through to fallback
  }
  regionsCache = [...FALLBACK_REGIONS];
  return regionsCache;
}

export async function getStates(countryCode: string): Promise<StateItem[]> {
  if (!countryCode) return [];
  const cached = statesCache.get(countryCode.toUpperCase());
  if (cached) return cached;
  const res = await fetch(`/api/countries/${encodeURIComponent(countryCode)}/states`);
  if (!res.ok) return [];
  const data = (await res.json()) as StateItem[];
  statesCache.set(countryCode.toUpperCase(), data);
  return data;
}

export function getCountryCodeByName(countries: CountryItem[], name: string): string {
  const c = countries.find(
    (x) => x.name.toLowerCase() === (name || "").toLowerCase()
  );
  return c?.code ?? "";
}

/** Return dial code (e.g. "+91") for a country name; used to normalize country_phone_code from DB. */
export function getPhoneCodeByCountryName(countries: CountryItem[], name: string): string {
  const c = countries.find(
    (x) => x.name.toLowerCase() === (name || "").toLowerCase()
  );
  if (!c?.phone_code) return "";
  const code = c.phone_code.trim();
  return code.startsWith("+") ? code : `+${code}`;
}
