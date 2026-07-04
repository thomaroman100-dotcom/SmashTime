import type { Metadata } from "next";
import "./globals.css";
import { RouteBodyClass } from "@/components/layout/RouteBodyClass";
import { SiteChrome } from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: "SmashTime",
  description:
    "Die öffentliche Website von SmashTime aus St. Pölten mit Veranstaltungen, Champions, Neuigkeiten, Sponsoren und Kontakt."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        <RouteBodyClass />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
