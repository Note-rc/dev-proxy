import en from "./locales/en";
import zh from "./locales/zh";

export type TranslationKey = keyof typeof en;
export type Locale = "en" | "zh";

const STORAGE_KEY = "dev-proxy-locale";
const locales: Record<Locale, Record<string, string>> = { en, zh };

function detectLocale(): Locale {
  try {
    const uiLang =
      typeof chrome !== "undefined" && chrome.i18n
        ? chrome.i18n.getUILanguage()
        : navigator.language;
    if (uiLang.startsWith("zh")) return "zh";
  } catch {
    // fallback
  }
  return "en";
}

let currentLocale: Locale = detectLocale();

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export async function loadSavedLocale(): Promise<Locale> {
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const saved = result[STORAGE_KEY];
      if (saved === "en" || saved === "zh") {
        currentLocale = saved;
        return saved;
      }
    }
  } catch {
    // fallback to detected
  }
  return currentLocale;
}

export async function saveLocale(locale: Locale): Promise<void> {
  setLocale(locale);
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.local.set({ [STORAGE_KEY]: locale });
    }
  } catch {
    // ignore
  }
}

export function t(key: TranslationKey): string {
  return locales[currentLocale]?.[key] ?? locales.en[key] ?? key;
}

export default t;
