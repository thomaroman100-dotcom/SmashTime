"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Crown,
  Handshake,
  Images,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Settings,
  X
} from "lucide-react";
import type { AdminUser } from "@/lib/admin/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { AdminUiProvider } from "@/components/admin/ui/AdminUiProvider";
import { InitialsAvatar } from "@/components/admin/ui/primitives";

type AdminShellProps = {
  user: AdminUser;
  children: React.ReactNode;
};

const adminNavigation = [
  { label: "Übersicht", href: "/admin", icon: LayoutDashboard },
  { label: "Champions", href: "/admin/champions", icon: Crown },
  { label: "Veranstaltungen", href: "/admin/events", icon: CalendarDays },
  { label: "Fightcard", href: "/admin/fightcards", icon: ListOrdered },
  { label: "Neuigkeiten", href: "/admin/news", icon: Newspaper },
  { label: "Sponsoren", href: "/admin/sponsors", icon: Handshake },
  { label: "Kontaktanfragen", href: "/admin/contact", icon: Mail },
  { label: "Medien", href: "/admin/media", icon: Images },
  { label: "Einstellungen", href: "/admin/settings", icon: Settings }
];

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
  const roleLabel = referenceMode ? "Administrator" : user.role === "admin" ? "Administrator" : "Redaktion";

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
              unoptimized
            />
            <small>Admin</small>
          </Link>

          <nav aria-label="Admin Navigation">
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/admin"
                  ? pathname === "/admin" || referenceMode
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

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
