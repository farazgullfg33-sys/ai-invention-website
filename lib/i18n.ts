"use client";

import { useCallback, useEffect, useState } from "react";
import ar from "@/lib/translations/ar.json";
import bn from "@/lib/translations/bn.json";
import en from "@/lib/translations/en.json";
import hi from "@/lib/translations/hi.json";
import id from "@/lib/translations/id.json";
import ms from "@/lib/translations/ms.json";
import ur from "@/lib/translations/ur.json";

export const languages = [
  { code: "en", label: "English" },
  { code: "ms", label: "Malay" },
  { code: "id", label: "Indonesia" },
  { code: "ur", label: "اردو" },
  { code: "ar", label: "العربية" },
  { code: "bn", label: "বাংলা" },
  { code: "hi", label: "हिन्दी" }
] as const;

export type LanguageCode = (typeof languages)[number]["code"];
export type TranslationKey = keyof typeof en;

const translations: Record<LanguageCode, Record<string, string>> = {
  en,
  ms,
  id,
  ur,
  ar,
  bn,
  hi
};

const rtlLanguages = new Set<LanguageCode>(["ar", "ur"]);
const languageCodes = new Set<LanguageCode>(languages.map((language) => language.code));

function isLanguageCode(value: string | null): value is LanguageCode {
  return Boolean(value && languageCodes.has(value as LanguageCode));
}

function applyDocumentLanguage(language: LanguageCode) {
  document.documentElement.lang = language;
  document.documentElement.dir = rtlLanguages.has(language) ? "rtl" : "ltr";
}

export function translate(language: LanguageCode, key: TranslationKey) {
  return translations[language][key] || translations.en[key] || key;
}

export function useI18n() {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("lang");
    const initialLanguage = isLanguageCode(storedLanguage) ? storedLanguage : "en";
    setLanguageState(initialLanguage);
    applyDocumentLanguage(initialLanguage);

    function handleLanguageChange(event: Event) {
      const nextLanguage = (event as CustomEvent<LanguageCode>).detail;
      if (isLanguageCode(nextLanguage)) {
        setLanguageState(nextLanguage);
        applyDocumentLanguage(nextLanguage);
      }
    }

    window.addEventListener("ai-invention-language", handleLanguageChange);
    return () => window.removeEventListener("ai-invention-language", handleLanguageChange);
  }, []);

  const setLanguage = useCallback((nextLanguage: LanguageCode) => {
    localStorage.setItem("lang", nextLanguage);
    setLanguageState(nextLanguage);
    applyDocumentLanguage(nextLanguage);
    window.dispatchEvent(new CustomEvent("ai-invention-language", { detail: nextLanguage }));
  }, []);

  const t = useCallback((key: TranslationKey) => translate(language, key), [language]);

  return { language, setLanguage, t };
}
