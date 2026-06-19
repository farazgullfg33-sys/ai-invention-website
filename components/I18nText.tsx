"use client";

import type { ReactNode } from "react";
import { useI18n, type TranslationKey } from "@/lib/i18n";

type I18nTextProps = {
  children: ReactNode;
  k: TranslationKey;
};

export function I18nText({ children, k }: I18nTextProps) {
  const { t } = useI18n();
  const translated = t(k);
  return <>{translated || children}</>;
}
