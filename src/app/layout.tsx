import type { Metadata } from "next";
import "./globals.css";
import { RouteBodyClass } from "@/components/layout/RouteBodyClass";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "SmashTime",
  description:
    "Die öffentliche Website von SmashTime aus St. Pölten mit Veranstaltungen, Champions, Neuigkeiten, Sponsoren und Kontakt."
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const publicSettings = await getPublicSiteSettings();

  return (
    <html lang="de">
      <head>
        <link rel="icon" href={publicSettings.faviconUrl} />
      </head>
      <body>
        <RouteBodyClass />
        <SiteChrome publicSettings={publicSettings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
