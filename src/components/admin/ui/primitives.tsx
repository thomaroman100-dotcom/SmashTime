import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getMemberImageSrc } from "@/lib/media-placeholders";
import { cn } from "@/lib/utils";

/* ---------- Stat-Card (Kennzahlenkarten oben auf jeder Seite) ---------- */

type StatCardProps = {
  icon: LucideIcon;
  tone?: "red" | "green" | "orange" | "purple" | "blue";
  label: string;
  value: string | number;
  detail?: string;
  trend?: { direction: "up" | "down" | "warn"; label: string };
};

export function StatCard({ icon: Icon, tone = "red", label, value, detail, trend }: StatCardProps) {
  return (
    <article className="adm-stat">
      <span className={`adm-stat__icon adm-stat__icon--${tone}`}>
        <Icon aria-hidden="true" size={21} />
      </span>
      <div className="adm-stat__body">
        <span className="adm-stat__label">{label}</span>
        <span className="adm-stat__value">{value}</span>
        {detail ? <span className="adm-stat__detail">{detail}</span> : null}
      </div>
      {trend ? (
        <span className={`adm-stat__trend adm-stat__trend--${trend.direction}`}>
          {trend.direction === "down" ? (
            <ArrowDownRight aria-hidden="true" size={14} />
          ) : (
            <ArrowUpRight aria-hidden="true" size={14} />
          )}
          {trend.label}
        </span>
      ) : null}
    </article>
  );
}

/* ---------- Panel mit Icon-Titelzeile ---------- */

type PanelProps = {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  unpadded?: boolean;
  children: React.ReactNode;
};

export function Panel({
  icon: Icon,
  title,
  subtitle,
  aside,
  footer,
  className,
  bodyClassName,
  unpadded = false,
  children
}: PanelProps) {
  return (
    <section className={cn("adm-panel", className)}>
      {title ? (
        <div className="adm-panel__head">
          {Icon ? <Icon aria-hidden="true" size={17} /> : null}
          <div className="adm-panel__head-text">
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {aside ? <div className="adm-panel__aside">{aside}</div> : null}
        </div>
      ) : null}
      <div className={cn(!unpadded && "adm-panel__body", bodyClassName)}>{children}</div>
      {footer ? <div className="adm-panel__footer">{footer}</div> : null}
    </section>
  );
}

/* ---------- Badges ---------- */

export type BadgeTone = "green" | "blue" | "gray" | "red" | "orange" | "yellow" | "purple" | "gold";

export function Badge({
  tone,
  uppercase = false,
  children
}: {
  tone: BadgeTone;
  uppercase?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("adm-badge", `adm-badge--${tone}`, uppercase && "adm-badge--uppercase")}>
      {children}
    </span>
  );
}

/* ---------- Avatar mit zentralem Bild-Fallback ---------- */

export function InitialsAvatar({
  name,
  src,
  size = "md",
  online = false
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md";
  online?: boolean;
}) {
  return (
    <span
      className={cn("adm-avatar", size === "sm" && "adm-avatar--sm", online && "adm-avatar--online")}
      aria-hidden="true"
    >
      <Image src={getMemberImageSrc(src)} alt="" fill sizes={size === "sm" ? "30px" : "38px"} />
      <span className="adm-avatar__sr-name">{name}</span>
    </span>
  );
}

/* ---------- Leerer Zustand ---------- */

export function EmptyState({
  icon: Icon,
  title,
  description,
  children
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="adm-empty">
      {Icon ? <Icon aria-hidden="true" size={34} /> : null}
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {children}
    </div>
  );
}

/* ---------- Pagination über Suchparameter ---------- */

type PaginationProps = {
  basePath: string;
  page: number;
  pageCount: number;
  totalLabel: string;
  searchParams?: Record<string, string | undefined>;
};

export function Pagination({ basePath, page, pageCount, totalLabel, searchParams = {} }: PaginationProps) {
  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) {
        params.set(key, value);
      }
    }
    if (target > 1) {
      params.set("seite", String(target));
    } else {
      params.delete("seite");
    }
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages: number[] = [];
  for (let i = 1; i <= pageCount; i += 1) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) {
      pages.push(i);
    }
  }
  const deduped = pages.filter((value, index) => pages.indexOf(value) === index);

  return (
    <nav className="adm-pagination" aria-label="Seiten">
      <span className="adm-pagination__info">{totalLabel}</span>
      <Link
        className={cn("adm-page-btn", page <= 1 && "adm-page-btn--disabled")}
        href={hrefFor(Math.max(1, page - 1))}
        aria-label="Vorherige Seite"
      >
        <ChevronLeft aria-hidden="true" size={15} />
      </Link>
      {deduped.map((value, index) => (
        <span key={value} style={{ display: "inline-flex", gap: 6 }}>
          {index > 0 && deduped[index - 1] !== value - 1 ? (
            <span className="adm-page-btn adm-page-btn--disabled">…</span>
          ) : null}
          <Link
            className={cn("adm-page-btn", value === page && "adm-page-btn--active")}
            href={hrefFor(value)}
            aria-current={value === page ? "page" : undefined}
          >
            {value}
          </Link>
        </span>
      ))}
      <Link
        className={cn("adm-page-btn", page >= pageCount && "adm-page-btn--disabled")}
        href={hrefFor(Math.min(pageCount, page + 1))}
        aria-label="Nächste Seite"
      >
        <ChevronRight aria-hidden="true" size={15} />
      </Link>
    </nav>
  );
}
