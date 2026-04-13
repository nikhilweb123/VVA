import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VVA — Architecture & Interiors",
  description: "Award-winning architecture and interior design studio crafting spaces that inspire.",
  keywords: "architecture, interiors, design studio, luxury spaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
