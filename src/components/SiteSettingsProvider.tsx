"use client";

import { createContext, useContext } from "react";
import type { ISiteSettings } from "@/models/SiteSettings";

type SiteSettingsContextValue = ISiteSettings | null;

const SiteSettingsContext = createContext<SiteSettingsContextValue>(null);

export function SiteSettingsProvider({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: SiteSettingsContextValue;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettingsContextValue {
  return useContext(SiteSettingsContext);
}
