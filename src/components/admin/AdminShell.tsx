"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Crown,
  FileCheck2,
  Handshake,
  Images,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Settings,
  ShieldCheck,
  UsersRound,
  X
} from "lucide-react";
import { hasAdminPermission, type AdminPermission } from "@/lib/admin/permissions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { AdminUiProvider } from "@/components/admin/ui/AdminUiProvider";
import { InitialsAvatar } from "@/components/admin/ui/primitives";

type AdminShellUser = {
  displayName: string;
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

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const referenceMode = process.env.NODE_ENV !== "production" && searchParams.get("reference") === "1";
  const displayName = referenceMode ? "Thomas Roman" : user.displayName;
  const roleLabel = referenceMode ? "Administrator" : user.role === "admin" ? "Administrator" : "Mitarbeiter";
  const visibleNavigation = adminNavigation.filter((item) => !item.permission || hasAdminPermission(user, item.permission));
  const activeHref = visibleNavigation
    .filter((item) =>
      item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

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

          <Link href="/admin/account" className="adm-sidebar__user" onClick={() => setOpen(false)}>
            <InitialsAvatar name={displayName} online />
            <div style={{ minWidth: 0 }}>
              <strong>{displayName}</strong>
              <span>{roleLabel}</span>
            </div>
          </Link>

          <button className="adm-sidebar__logout" type="button" onClick={signOut}>
            <LogOut aria-hidden="true" size={18} />
            <span>Abmelden</span>
          </button>
        </aside>

        <section className="adm-main">
          <header className="adm-topbar">
            <div className="adm-topbar__cluster">
              <div className="adm-topbar__id">
                <strong>{displayName}</strong>
                <span>{roleLabel}</span>
              </div>
              <span className="adm-topbar__photo">
                <Image
                  src="/images/admin/thomas-roman-avatar.png"
                  alt=""
                  width={34}
                  height={34}
                  priority={referenceMode}
                />
                <i aria-hidden="true" />
              </span>
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
