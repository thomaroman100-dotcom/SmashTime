"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogIn, LogOut, Menu, Shield, Ticket, UserCircle, UserPlus, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavigationItem } from "@/data/site";
import { site as defaultSite } from "@/data/site";
import type { SessionProfile } from "@/lib/admin/auth";
import type { PublicSiteContent } from "@/lib/site-settings";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type HeaderProps = {
  siteContent?: PublicSiteContent;
  sessionProfile?: SessionProfile | null;
};

export function Header({ siteContent = defaultSite, sessionProfile = null }: HeaderProps) {
  const site = siteContent;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const getPathFromHref = (href: string) => href.split("#")[0];

  const isActive = (href: string) => {
    const path = getPathFromHref(href);
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isGroupActive = (item: NavigationItem) =>
    (item.children?.some((child) => isActive(child.href)) ?? false);

  const closeMobileMenu = () => {
    setOpen(false);
    setOpenGroup(null);
  };

  const toggleGroup = (label: string) => {
    setOpenGroup((current) => (current === label ? null : label));
  };

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    setProfileOpen(false);
    closeMobileMenu();
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setOpenGroup(null);
        setDropdownOpen(false);
        setProfileOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="site-header__logo" aria-label="SmashTime Startseite">
          <Image src={site.logo} alt="SmashTime" width={216} height={72} priority />
        </Link>

        <nav className="site-header__nav" aria-label="Hauptnavigation">
          {site.navigation.map((item) =>
            item.children ? (
              <div
                className={cn("site-header__nav-item", dropdownOpen && "site-header__nav-item--open")}
                key={item.label}
                ref={dropdownRef}
              >
                <button
                  type="button"
                  className={cn(
                    "site-header__link site-header__dropdown-trigger",
                    isGroupActive(item) && "site-header__link--active"
                  )}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((value) => !value)}
                >
                  {item.label}
                  <ChevronDown aria-hidden="true" size={14} />
                </button>
                <div className="site-header__dropdown">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      className={cn(
                        "site-header__dropdown-link",
                        isActive(child.href) && "site-header__dropdown-link--active"
                      )}
                      href={child.href}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="site-header__nav-item" key={item.href}>
                <Link
                  className={cn("site-header__link", isActive(item.href) && "site-header__link--active")}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </div>
            )
          )}
        </nav>

        <div className="site-header__actions">
          <div className="site-profile-menu" ref={profileRef}>
            <button
              className={cn("site-profile-menu__trigger", sessionProfile && "site-profile-menu__trigger--active")}
              type="button"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((value) => !value)}
            >
              <UserCircle aria-hidden="true" size={20} />
              <span>{sessionProfile ? sessionProfile.displayName : "Login"}</span>
              <ChevronDown aria-hidden="true" size={13} />
            </button>
            <div className={cn("site-profile-menu__dropdown", profileOpen && "site-profile-menu__dropdown--open")}>
              {sessionProfile ? (
                <>
                  <div className="site-profile-menu__identity">
                    <strong>{sessionProfile.displayName}</strong>
                    <span>{sessionProfile.roleLabel} · {sessionProfile.status}</span>
                  </div>
                  <Link href="/account" onClick={() => setProfileOpen(false)}>
                    <UserCircle aria-hidden="true" size={16} /> Mein Profil
                  </Link>
                  {sessionProfile.canAccessAdmin ? (
                    <Link href="/admin" onClick={() => setProfileOpen(false)}>
                      <Shield aria-hidden="true" size={16} /> Adminbereich
                    </Link>
                  ) : null}
                  <button type="button" onClick={signOut}>
                    <LogOut aria-hidden="true" size={16} /> Abmelden
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setProfileOpen(false)}>
                    <LogIn aria-hidden="true" size={16} /> Einloggen
                  </Link>
                  <Link href="/register" onClick={() => setProfileOpen(false)}>
                    <UserPlus aria-hidden="true" size={16} /> Registrieren
                  </Link>
                </>
              )}
            </div>
          </div>
          <Link href={site.headerCta.href} className="site-header__ticket-cta">
            <Ticket aria-hidden="true" size={16} strokeWidth={2.4} />
            <span>{site.headerCta.label}</span>
          </Link>
          <button
            className="site-header__menu"
            type="button"
            aria-controls="mobile-navigation"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={34} /> : <Menu size={34} />}
          </button>
        </div>
      </header>

      <div id="mobile-navigation" className={cn("mobile-panel", open && "mobile-panel--open")}>
        <nav aria-label="Hauptnavigation Mobil">
          {site.navigation.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  type="button"
                  className={cn(
                    "mobile-panel__group-trigger",
                    isGroupActive(item) && "mobile-panel__group-trigger--active"
                  )}
                  aria-expanded={openGroup === item.label}
                  onClick={() => toggleGroup(item.label)}
                >
                  {item.label}
                  <ChevronDown aria-hidden="true" size={20} />
                </button>
                <div
                  className={cn(
                    "mobile-panel__submenu",
                    openGroup === item.label && "mobile-panel__submenu--open"
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      className={cn(
                        "mobile-panel__submenu-link",
                        isActive(child.href) && "mobile-panel__submenu-link--active"
                      )}
                      href={child.href}
                      onClick={closeMobileMenu}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                className={cn("mobile-panel__link", isActive(item.href) && "mobile-panel__link--active")}
                href={item.href}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            )
          )}
          {sessionProfile ? (
            <>
              <Link href="/account" className="mobile-panel__login" onClick={closeMobileMenu}>
                Mein Profil · {sessionProfile.displayName}
              </Link>
              {sessionProfile.canAccessAdmin ? (
                <Link href="/admin" className="mobile-panel__login" onClick={closeMobileMenu}>
                  Adminbereich
                </Link>
              ) : null}
              <button className="mobile-panel__login mobile-panel__button" type="button" onClick={signOut}>
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="mobile-panel__login" onClick={closeMobileMenu}>
                Einloggen
              </Link>
              <Link href="/register" className="mobile-panel__login" onClick={closeMobileMenu}>
                Registrieren
              </Link>
            </>
          )}
          <Link href={site.headerCta.href} className="mobile-panel__ticket-cta" onClick={closeMobileMenu}>
            <Ticket aria-hidden="true" size={18} strokeWidth={2.4} />
            <span>{site.headerCta.label}</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
