/**
 * Masters API: skills, specializations, and languages from backend (via /api/backend proxy).
 */

const BASE = "/api/backend";

export interface SkillItem {
  id: string;
  name: string;
  category: string;
}

export interface SpecializationItem {
  id: string;
  name: string;
  category: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  code?: string;
}

function toSkillItem(raw: { id?: number; name?: string; category?: string }): SkillItem {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    category: String(raw.category ?? ""),
  };
}

function toSpecializationItem(raw: { id?: number; name?: string; category?: string }): SpecializationItem {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    category: String(raw.category ?? ""),
  };
}

function toLanguageItem(raw: { id?: number; name?: string; code?: string }): LanguageItem {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    code: raw.code != null ? String(raw.code) : undefined,
  };
}

/** Parse ApiResponse envelope: { success, data } */
function parseResponse<T>(res: Response): Promise<T | null> {
  return res.json().then((body: { success?: boolean; data?: T }) => {
    if (body.success && body.data != null) return body.data as T;
    return null;
  });
}

let skillsCache: SkillItem[] | null = null;
let skillsFetchPromise: Promise<SkillItem[] | null> | null = null;

export async function getSkills(): Promise<SkillItem[]> {
  if (skillsCache) return skillsCache;
  if (skillsFetchPromise) return skillsFetchPromise.then((r) => r ?? []);
  skillsFetchPromise = (async () => {
    try {
      const res = await fetch(`${BASE}/skills`, { credentials: "include" });
      if (!res.ok) return null;
      const data = await parseResponse<Array<{ id: number; name: string; category: string }>>(res);
      if (!data || !Array.isArray(data)) return null;
      const items = data.map((r) => toSkillItem(r));
      if (items.length > 0) {
        skillsCache = items;
        return items;
      }
      return null;
    } catch {
      return null;
    } finally {
      skillsFetchPromise = null;
    }
  })();
  const result = await skillsFetchPromise;
  return result ?? [];
}

let specializationsCache: SpecializationItem[] | null = null;
let specializationsFetchPromise: Promise<SpecializationItem[] | null> | null = null;

export async function getSpecializations(): Promise<SpecializationItem[]> {
  if (specializationsCache) return specializationsCache;
  if (specializationsFetchPromise) return specializationsFetchPromise.then((r) => r ?? []);
  specializationsFetchPromise = (async () => {
    try {
      const res = await fetch(`${BASE}/specializations`, { credentials: "include" });
      if (!res.ok) return null;
      const data = await parseResponse<Array<{ id: number; name: string; category: string }>>(res);
      if (!data || !Array.isArray(data)) return null;
      const items = data.map((r) => toSpecializationItem(r));
      if (items.length > 0) {
        specializationsCache = items;
        return items;
      }
      return null;
    } catch {
      return null;
    } finally {
      specializationsFetchPromise = null;
    }
  })();
  const result = await specializationsFetchPromise;
  return result ?? [];
}

let languagesCache: LanguageItem[] | null = null;
let languagesFetchPromise: Promise<LanguageItem[] | null> | null = null;

export async function getLanguages(): Promise<LanguageItem[]> {
  if (languagesCache) return languagesCache;
  if (languagesFetchPromise) return languagesFetchPromise.then((r) => r ?? []);
  languagesFetchPromise = (async () => {
    try {
      const res = await fetch(`${BASE}/languages`, { credentials: "include" });
      if (!res.ok) return null;
      const data = await parseResponse<Array<{ id: number; name: string; code?: string }>>(res);
      if (!data || !Array.isArray(data)) return null;
      const items = data.map((r) => toLanguageItem(r));
      if (items.length > 0) {
        languagesCache = items;
        return items;
      }
      return null;
    } catch {
      return null;
    } finally {
      languagesFetchPromise = null;
    }
  })();
  const result = await languagesFetchPromise;
  return result ?? [];
}
