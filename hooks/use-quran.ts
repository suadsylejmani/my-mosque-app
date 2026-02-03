import { QURAN_ENC_BASE } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";

const AL_QURAN_CLOUD_BASE = "https://api.alquran.cloud/v1";

// --- Arabic (Al-Quran Cloud) types ---

export type ArabicAyah = {
  number: number;
  text: string;
  numberInSurah: number;
};

export type ArabicSurahData = {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  ayahs: ArabicAyah[];
};

// --- API types (per QuranEnc docs) ---

export type TranslationListItem = {
  key: string;
  language_iso_code: string;
  version: string;
  last_update: string;
  title: string;
  description: string;
};

export type SurahVerse = {
  sura: number;
  aya: number;
  translation: string;
  footnotes?: string;
};

/** Default Albanian translation key (confirm via useTranslationsList('sq')). */
export const ALBANIAN_TRANSLATION_KEY = "albanian_nahi";

/**
 * List available translations for a language (e.g. sq for Albanian).
 * GET /translations/list/{language}/?localization={language_iso_code}
 */
export function useTranslationsList(
  language: string = "sq",
  localization: string = "sq"
) {
  return useQuery<TranslationListItem[]>({
    queryKey: ["quran-translations", language, localization],
    queryFn: async () => {
      const url = `${QURAN_ENC_BASE}/translations/list/${language}?localization=${localization}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  });
}

/**
 * Get full surah translation (e.g. Albanian).
 * QuranEnc returns { result: [ { sura, aya, translation, footnotes, ... } ] }.
 */
export function useSurahTranslation(
  surahNumber: number,
  translationKey: string = ALBANIAN_TRANSLATION_KEY
) {
  return useQuery<SurahVerse[]>({
    queryKey: ["quran-surah", translationKey, surahNumber],
    queryFn: async () => {
      const url = `${QURAN_ENC_BASE}/translation/sura/${translationKey}/${surahNumber}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const raw = json?.result ?? json;
      const arr = Array.isArray(raw) ? raw : [];
      return arr.map((v: { sura?: string | number; aya?: string | number; translation?: string; footnotes?: string }) => ({
        sura: Number(v.sura) || 0,
        aya: Number(v.aya) || 0,
        translation: v.translation ?? "",
        footnotes: v.footnotes,
      }));
    },
    enabled: surahNumber >= 1 && surahNumber <= 114,
  });
}

/**
 * Get a single ayah translation (optional).
 * GET /translation/aya/{translation_key}/{sura_number}/{aya_number}
 */
export function useAyahTranslation(
  surahNumber: number,
  ayaNumber: number,
  translationKey: string = ALBANIAN_TRANSLATION_KEY
) {
  return useQuery<SurahVerse>({
    queryKey: ["quran-ayah", translationKey, surahNumber, ayaNumber],
    queryFn: async () => {
      const url = `${QURAN_ENC_BASE}/translation/aya/${translationKey}/${surahNumber}/${ayaNumber}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data[0] : data;
    },
    enabled:
      surahNumber >= 1 &&
      surahNumber <= 114 &&
      ayaNumber >= 1,
  });
}

/**
 * Get full surah in Arabic (Uthmani script).
 * GET api.alquran.cloud/v1/surah/{number}/quran-uthmani
 */
export function useSurahArabic(surahNumber: number) {
  return useQuery<ArabicSurahData>({
    queryKey: ["quran-arabic", surahNumber],
    queryFn: async () => {
      const url = `${AL_QURAN_CLOUD_BASE}/surah/${surahNumber}/quran-uthmani`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.code !== 200 || !json.data) throw new Error("Invalid response");
      return json.data;
    },
    enabled: surahNumber >= 1 && surahNumber <= 114,
  });
}

// --- All 114 surahs (Al-Quran Cloud meta) ---

export type SurahMeta = {
  number: number;
  name: string;
  translation: string;
  verses: number;
  revelation: string;
};

type MetaSurahRef = {
  number: number;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

/**
 * Fetch all 114 surahs metadata (name, translation, verse count, revelation).
 * GET api.alquran.cloud/v1/meta
 */
export function useSurahsMeta() {
  return useQuery<SurahMeta[]>({
    queryKey: ["quran-surahs-meta"],
    queryFn: async () => {
      const res = await fetch(`${AL_QURAN_CLOUD_BASE}/meta`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const refs: MetaSurahRef[] = json?.data?.surahs?.references ?? [];
      return refs.map((s) => ({
        number: s.number,
        name: s.englishName ?? "",
        translation: s.englishNameTranslation ?? "",
        verses: s.numberOfAyahs ?? 0,
        revelation: s.revelationType === "Medinan" ? "Medinan" : "Meccan",
      }));
    },
  });
}
