import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FavoritesProvider } from "@/components/providers/favorites-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Vercel's default domain for this exact linked project name
// (.vercel/project.json → "projectName":"ogoouehabita"); update if a
// custom production domain is attached later.
const SITE_URL = "https://ogoouehabita.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ogooué Habitat — La plateforme immobilière de référence au Gabon",
    template: "%s | Ogooué Habitat",
  },
  description:
    "Ogooué Habitat : achat, location, terrains et biens neufs au Gabon. Passeport Ogooué, Ogooué Shield et Ogooué AI pour une transaction immobilière vérifiée et sécurisée.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout is the documented place for shared fonts; this rule only targets the Pages Router's pages/_document.js */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface font-body-md text-on-surface">
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}
