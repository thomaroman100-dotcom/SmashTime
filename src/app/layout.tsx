import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RouteBodyClass } from "@/components/layout/RouteBodyClass";

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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
