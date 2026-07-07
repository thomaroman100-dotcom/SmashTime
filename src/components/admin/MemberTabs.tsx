import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Alle Benutzer", href: "/admin/members" },
  { label: "Rollen & Rechte", href: "/admin/members/roles" },
  { label: "Verifizierungen", href: "/admin/members/verifications" }
];

export function MemberTabs({ active }: { active: "users" | "roles" | "verifications" }) {
  const activeHref =
    active === "roles" ? "/admin/members/roles" : active === "verifications" ? "/admin/members/verifications" : "/admin/members";

  return (
    <nav className="adm-section-tabs" aria-label="Benutzerbereiche">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} className={cn(tab.href === activeHref && "adm-section-tabs__item--active")}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
