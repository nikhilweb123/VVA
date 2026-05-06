import type { Metadata } from "next";
import "./globals.css";
import { cache } from "react";
import dbConnect from "@/lib/db";
import SiteSettingsModel from "@/models/SiteSettings";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";

export const dynamic = "force-dynamic";

const getSiteSettings = cache(async () => {
  try {
    await dbConnect();
    let settings = await SiteSettingsModel.findOne({}).lean<Record<string, unknown>>();
    if (!settings) {
      settings = (await SiteSettingsModel.create({})).toJSON() as Record<string, unknown>;
    }
    return settings;
  } catch {
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const seo = (settings?.seo as Record<string, string> | undefined) ?? {};

  return {
    title: seo.metaTitle || "VVA — Architecture & Interiors",
    description: seo.metaDescription || "Award-winning architecture and interior design studio crafting spaces that inspire.",
    keywords: "architecture, interiors, design studio, luxury spaces",
    openGraph: seo.ogImage
      ? { images: [{ url: seo.ogImage }] }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <SiteSettingsProvider settings={settings as any}>
          {children}
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
