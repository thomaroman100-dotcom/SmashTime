"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site, type NavigationItem } from "@/data/site";
import { CTAButton } from "@/components/ui/CTAButton";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileGroups, setMobileGroups] = useState<Record<string, boolean>>({});

  const getPathFromHref = (href: string) => href.split("#")[0];

  const isActive = (href: string) => {
    const path = getPathFromHref(href);
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isActiveItem = (item: NavigationItem) =>
    isActive(item.href) || Boolean(item.children?.some((child) => isActive(child.href)));

  const closeMobileMenu = () => setOpen(false);

  const toggleMobileGroup = (label: string) => {
    setMobileGroups((current) => ({
      ...current,
      [label]: !current[label]
    }));
  };

  return (
    <header className="site-header">
      <Link href="/" className="site-header__logo" aria-label="SmashTime Startseite">
        <Image src={site.logo} alt="SmashTime" width={150} height={150} priority />
      </Link>

      <nav className="site-header__nav" aria-label="Hauptnavigation">
        {site.navigation.map((item) => {
          const hasChildren = Boolean(item.children?.length);

          if (!hasChildren) {
            return (
              <Link
                key={item.href}
                className={cn(
                  "site-header__link",
                  isActiveItem(item) && "site-header__link--active"
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <div
              key={item.href}
              className={cn(
                "site-header__nav-item",
                isActiveItem(item) && "site-header__nav-item--active"
              )}
            >
              <Link
                className={cn(
                  "site-header__link site-header__dropdown-trigger",
                  isActiveItem(item) && "site-header__link--active"
                )}
                href={item.href}
                aria-haspopup="true"
              >
                <span>{item.label}</span>
                <ChevronDown aria-hidden="true" size={15} strokeWidth={2.6} />
              </Link>
              <div className="site-header__dropdown" role="menu">
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    className={cn(
                      "site-header__dropdown-link",
                      isActive(child.href) && "site-header__dropdown-link--active"
                    )}
                    href={child.href}
                    role="menuitem"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
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
          {site.navigation.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const groupOpen = Boolean(mobileGroups[item.label]);

            if (!hasChildren) {
              return (
                <Link
                  key={item.href}
                  className={cn(
                    "mobile-panel__link",
                    isActiveItem(item) && "mobile-panel__link--active"
                  )}
                  href={item.href}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div className="mobile-panel__group" key={item.href}>
                <button
                  className={cn(
                    "mobile-panel__group-trigger",
                    isActiveItem(item) && "mobile-panel__group-trigger--active"
                  )}
                  type="button"
                  aria-expanded={groupOpen}
                  onClick={() => toggleMobileGroup(item.label)}
                >
                  <span>{item.label}</span>
                  <ChevronDown aria-hidden="true" size={22} strokeWidth={2.6} />
                </button>
                <div className={cn("mobile-panel__submenu", groupOpen && "mobile-panel__submenu--open")}>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "mobile-panel__submenu-link",
                        isActive(child.href) && "mobile-panel__submenu-link--active"
                      )}
                      onClick={closeMobileMenu}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <CTAButton href={site.headerCta.href} className="mobile-panel__cta" onClick={closeMobileMenu}>
            {site.headerCta.label}
          </CTAButton>
        </nav>
      </div>
    </header>
  );
}
