"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Crown,
  ExternalLink,
  FileCheck2,
  Handshake,
  KeyRound,
  Images,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  X
} from "lucide-react";
import { hasAdminPermission, type AdminPermission } from "@/lib/admin/permissions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getMemberImageSrc } from "@/lib/media-placeholders";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { AdminUiProvider } from "@/components/admin/ui/AdminUiProvider";
import { InitialsAvatar } from "@/components/admin/ui/primitives";

type AdminShellUser = {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: "admin" | "staff";
  permissions: AdminPermission[];
};

type AdminShellProps = {
  user: AdminShellUser;
  children: React.ReactNode;
};

const adminNavigation = [
  { label: "Übersicht", href: "/admin", icon: LayoutDashboard },
  { label: "Benutzer", href: "/admin/members", icon: UsersRound, permission: "users.manage" },
  { label: "Rollen & Rechte", href: "/admin/members/roles", icon: ShieldCheck, permission: "users.manage" },
  { label: "Verifizierungen", href: "/admin/members/verifications", icon: FileCheck2, permission: "users.manage" },
  { label: "Champions", href: "/admin/champions", icon: Crown, permission: "champions.manage" },
  { label: "Veranstaltungen", href: "/admin/events", icon: CalendarDays, permission: "events.manage" },
  { label: "Fightcard", href: "/admin/fightcards", icon: ListOrdered, permission: "fightcards.manage" },
  { label: "Neuigkeiten", href: "/admin/news", icon: Newspaper, permission: "news.manage" },
  { label: "Sponsoren", href: "/admin/sponsors", icon: Handshake, permission: "sponsors.manage" },
  { label: "Kontaktanfragen", href: "/admin/contact", icon: Mail, permission: "contact.manage" },
  { label: "Medien", href: "/admin/media", icon: Images, permission: "media.manage" },
  { label: "Einstellungen", href: "/admin/settings", icon: Settings, permission: "settings.manage" }
] satisfies Array<{
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  permission?: AdminPermission;
}>;

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    setProfileOpen(false);
    setOpen(false);
    router.push("/admin/login");
    router.refresh();
  };

  const referenceMode = process.env.NODE_ENV !== "production" && searchParams.get("reference") === "1";
  const displayName = referenceMode ? "Thomas Roman" : user.displayName;
  const roleLabel = referenceMode ? "Administrator" : user.role === "admin" ? "Administrator" : "Mitarbeiter";
  const avatarSrc = referenceMode ? "/images/admin/thomas-roman-avatar.png" : getMemberImageSrc(user.avatarUrl);
  const canManageUsers = hasAdminPermission(user, "users.manage");
  const canManageSettings = hasAdminPermission(user, "settings.manage");
  const permissionSummary = user.role === "admin" ? "Vollzugriff" : `${user.permissions.length} aktive Rechte`;
  const visibleNavigation = adminNavigation.filter((item) => !item.permission || hasAdminPermission(user, item.permission));
  const activeHref = visibleNavigation
    .filter((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setProfileOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
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

  return (
    <AdminUiProvider>
      <div className="adm-app">
        <button
          className="adm-mobile-toggle"
          type="button"
          aria-label={open ? "Admin-Menü schließen" : "Admin-Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>

        <aside className={cn("adm-sidebar", open && "adm-sidebar--open")}>
          <Link href="/admin" className="adm-sidebar__logo" onClick={() => setOpen(false)}>
            <Image
              src={referenceMode ? "/images/admin/smashtime-reference-logo.png" : site.logo}
              alt="SmashTime"
              width={166}
              height={31}
              priority
            />
            <small>Admin</small>
          </Link>

          <nav aria-label="Admin Navigation">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const active = referenceMode ? item.href === "/admin" : item.href === activeHref;

              return (
                <Link
                  key={item.href}
                  className={cn("adm-sidebar__link", active && "adm-sidebar__link--active")}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <Icon aria-hidden="true" size={19} strokeWidth={2} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="adm-main">
          <header className="adm-topbar">
            <div className="adm-topbar__cluster">
              <div className="adm-profile-menu" ref={profileRef}>
                <button
                  className={cn("adm-profile-menu__trigger", profileOpen && "adm-profile-menu__trigger--open")}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((value) => !value)}
                >
                  <span className="adm-topbar__id">
                    <strong>{displayName}</strong>
                    <span>{roleLabel}</span>
                  </span>
                  <span className="adm-topbar__photo">
                    <Image
                      src={avatarSrc}
                      alt=""
                      width={34}
                      height={34}
                      priority={referenceMode}
                    />
                    <i aria-hidden="true" />
                  </span>
                  <ChevronDown aria-hidden="true" size={14} />
                </button>
                <div
                  className={cn("adm-profile-menu__dropdown", profileOpen && "adm-profile-menu__dropdown--open")}
                  role="menu"
                  aria-label="Profilmenü"
                >
                  <div className="adm-profile-menu__identity">
                    <InitialsAvatar name={displayName} src={avatarSrc} online />
                    <div>
                      <strong>{displayName}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="adm-profile-menu__meta" aria-label="Sitzungsstatus">
                    <span>
                      <CheckCircle2 aria-hidden="true" size={14} />
                      Aktive Sitzung
                    </span>
                    <strong>{permissionSummary}</strong>
                  </div>
                  <div className="adm-profile-menu__section" role="none">
                    <Link href="/admin/account" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <UserRound aria-hidden="true" size={16} />
                      Konto & Profil
                    </Link>
                    {canManageUsers ? (
                      <Link href={`/admin/members/${user.userId}`} role="menuitem" onClick={() => setProfileOpen(false)}>
                        <ShieldCheck aria-hidden="true" size={16} />
                        Profil bearbeiten
                      </Link>
                    ) : null}
                    <Link href="/admin/account#sicherheit" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <KeyRound aria-hidden="true" size={16} />
                      Sicherheit
                    </Link>
                    {canManageSettings ? (
                      <Link href="/admin/settings" role="menuitem" onClick={() => setProfileOpen(false)}>
                        <Settings aria-hidden="true" size={16} />
                        Einstellungen
                      </Link>
                    ) : null}
                    <Link href="/" role="menuitem" onClick={() => setProfileOpen(false)}>
                      <ExternalLink aria-hidden="true" size={16} />
                      Website öffnen
                    </Link>
                  </div>
                  <button className="adm-profile-menu__logout" type="button" role="menuitem" onClick={signOut}>
                    <LogOut aria-hidden="true" size={16} />
                    Abmelden
                  </button>
                </div>
              </div>
              <button className="adm-bell" type="button" aria-label="Benachrichtigungen">
                <Bell aria-hidden="true" size={19} />
                <span className="adm-bell__dot" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="adm-content">{children}</div>

          <footer className="adm-footer">© 2026 SmashTime. Alle Rechte vorbehalten.</footer>
        </section>
      </div>
    </AdminUiProvider>
  );
}
