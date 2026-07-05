"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { PublicSettings } from "@/lib/site-settings";

type SiteChromeProps = {
  children: React.ReactNode;
  publicSettings: PublicSettings;
};

export function SiteChrome({ children, publicSettings }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main>{children}</main>;
  }

  const themeStyle = {
    "--red": publicSettings.theme.primaryColor,
    "--deep-red": publicSettings.theme.primaryColor,
    "--gold": publicSettings.theme.accentColor,
    "--dirty-white": publicSettings.theme.textColor
  } as React.CSSProperties;

  return (
    <div className="public-site-chrome" style={themeStyle}>
      <Header siteContent={publicSettings.site} />
      <main>{children}</main>
      <Footer siteContent={publicSettings.site} />
    </div>
  );
}
