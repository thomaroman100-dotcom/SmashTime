"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";
import { CTAButton } from "@/components/ui/CTAButton";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const getPathFromHref = (href: string) => href.split("#")[0];

  const isActive = (href: string) => {
    const path = getPathFromHref(href);
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const closeMobileMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <Link href="/" className="site-header__logo" aria-label="SmashTime Startseite">
        <Image src={site.logo} alt="SmashTime" width={150} height={150} priority />
      </Link>

      <nav className="site-header__nav" aria-label="Hauptnavigation">
        {site.navigation.map((item) => (
          <Link
            key={item.href}
            className={cn("site-header__link", isActive(item.href) && "site-header__link--active")}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="site-header__actions">
        <CTAButton href={site.headerCta.href} className="site-header__cta">
          {site.headerCta.label}
        </CTAButton>
        <button
          className="site-header__menu"
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={34} /> : <Menu size={34} />}
        </button>
      </div>

      <div className={cn("mobile-panel", open && "mobile-panel--open")}>
        <nav aria-label="Hauptnavigation Mobil">
          {site.navigation.map((item) => (
            <Link
              key={item.href}
              className={cn("mobile-panel__link", isActive(item.href) && "mobile-panel__link--active")}
              href={item.href}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
          <CTAButton href={site.headerCta.href} className="mobile-panel__cta" onClick={closeMobileMenu}>
            {site.headerCta.label}
          </CTAButton>
        </nav>
      </div>
    </header>
  );
}
