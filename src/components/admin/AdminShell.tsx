"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
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
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="admin-app">
      <button
        className="admin-mobile-toggle"
        type="button"
        aria-label={open ? "Admin-Menü schließen" : "Admin-Menü öffnen"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <aside className={cn("admin-sidebar", open && "admin-sidebar--open")}>
        <Link href="/admin" className="admin-sidebar__logo" onClick={() => setOpen(false)}>
          <Image src={site.logo} alt="SmashTime" width={132} height={132} priority />
        </Link>
        <nav aria-label="Admin Navigation">
          {adminNavigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                className={cn("admin-sidebar__link", active && "admin-sidebar__link--active")}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={2.1} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button className="admin-sidebar__logout" type="button" onClick={signOut}>
          <LogOut aria-hidden="true" size={20} />
          <span>Abmelden</span>
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <strong>{user.displayName}</strong>
            <span>{user.role === "admin" ? "Administrator" : "Redaktion"}</span>
          </div>
          <small>{user.email}</small>
        </header>
        {children}
      </section>
    </div>
  );
}
