import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getSessionProfile } from "@/lib/admin/auth";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "SmashTime",
  description:
    "Die öffentliche Website von SmashTime aus St. Pölten mit Veranstaltungen, Champions, Neuigkeiten, Sponsoren und Kontakt.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [publicSettings, sessionProfile] = await Promise.all([getPublicSiteSettings(), getSessionProfile()]);

  return (
    <html lang="de">
      <head>
        <link rel="icon" href={publicSettings.faviconUrl} />
      </head>
      <body>
        <SiteChrome publicSettings={publicSettings} sessionProfile={sessionProfile}>{children}</SiteChrome>
      </body>
    </html>
  );
}
