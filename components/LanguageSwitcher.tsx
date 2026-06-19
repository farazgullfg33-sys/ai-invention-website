"use client";

import { Globe } from "lucide-react";
import { languages, useI18n, type LanguageCode } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="language-switcher" aria-label={t("ui.language")}>
      <Globe size={16} aria-hidden="true" />
      <select value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)}>
        {languages.map((item) => (
          <option value={item.code} key={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
