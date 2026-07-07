import Link from "next/link";
import { Handshake, Image as ImageIcon, Pencil, Plus, Search, ShieldCheck, ShieldOff, Star } from "lucide-react";
import { type SponsorRow, deleteSponsorAction, setSponsorActiveAction } from "@/lib/admin/actions/sponsors";
import { sponsorPackages } from "@/data/sponsors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminImagePreview } from "@/components/admin/ui/AdminImagePreview";
import { Badge, EmptyState, Pagination, Panel, StatCard } from "@/components/admin/ui/primitives";
import { RowMenu } from "@/components/admin/ui/RowMenu";

export const metadata = {
  title: "Sponsoren | SmashTime Admin"
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type PageProps = {
  searchParams: Promise<{ q?: string; paket?: string; status?: string; seite?: string }>;
};

export default async function AdminSponsorsPage({ searchParams }: PageProps) {
  const { q, paket, status, seite } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let sponsors: SponsorRow[] = [];
  let loadError: string | null = null;

  if (!supabase) {
    loadError = "Supabase ist nicht konfiguriert.";
  } else {
    const { data, error } = await supabase
      .from("sponsors")
      .select("id, name, logo_path, website_url, package_name, sort_order, is_active, updated_at")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      loadError = `Sponsoren konnten nicht geladen werden: ${error.message}`;
    } else {
      sponsors = (data ?? []) as SponsorRow[];
    }
  }

  const total = sponsors.length;
  const active = sponsors.filter((item) => item.is_active).length;
  const inactive = total - active;
  const withLogo = sponsors.filter((item) => item.logo_path).length;
  const packages = [...new Set(sponsors.map((item) => item.package_name).filter(Boolean))] as string[];

  const query = (q ?? "").trim().toLowerCase();
  const filtered = sponsors.filter((item) => {
    if (query && !`${item.name} ${item.website_url ?? ""}`.toLowerCase().includes(query)) {
      return false;
    }
    if (paket && item.package_name !== paket) {
      return false;
    }
    if (status === "aktiv" && !item.is_active) {
      return false;
    }
    if (status === "inaktiv" && item.is_active) {
      return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(seite ?? "1", 10) || 1), pageCount);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tableColumns = "minmax(260px, 1.5fr) 150px minmax(180px, 1fr) 120px 130px 120px";

  return (
    <div>
      <div className="adm-head">
        <div>
          <h1>Sponsoren</h1>
          <p>Logo-Plätze, Pakete, Sichtbarkeit und Sponsorstatus verwalten.</p>
        </div>
        <div className="adm-head__actions">
          <Link className="adm-btn adm-btn--primary" href="/admin/sponsors/new">
            <Plus aria-hidden="true" size={16} /> Sponsor hinzufügen
          </Link>
        </div>
      </div>

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>{loadError}</strong>
        </div>
      ) : null}

      <section className="adm-stats" aria-label="Sponsoren-Kennzahlen">
        <StatCard icon={Handshake} tone="red" label="Sponsoren" value={total} detail="Alle Partner" />
        <StatCard icon={ShieldCheck} tone="green" label="Aktiv" value={active} detail="Öffentlich sichtbar" />
        <StatCard icon={ShieldOff} tone="orange" label="Inaktiv" value={inactive} detail="Nicht sichtbar" />
        <StatCard icon={ImageIcon} tone="purple" label="Mit Logo" value={withLogo} detail="Logo hinterlegt" />
      </section>

      <div className="adm-cols adm-cols--main-rail">
        <section className="adm-panel">
          <form className="adm-toolbar" method="get" action="/admin/sponsors">
            <div className="adm-search">
              <Search aria-hidden="true" size={16} />
              <input type="search" name="q" defaultValue={q ?? ""} placeholder="Sponsoren suchen…" aria-label="Sponsoren suchen" />
            </div>
            <div className="adm-filter">
              <span>Paket</span>
              <select name="paket" defaultValue={paket ?? ""}>
                <option value="">Alle Pakete</option>
                {packages.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-filter">
              <span>Status</span>
              <select name="status" defaultValue={status ?? ""}>
                <option value="">Alle Status</option>
                <option value="aktiv">Aktiv</option>
                <option value="inaktiv">Inaktiv</option>
              </select>
            </div>
            <button className="adm-btn" type="submit">
              Filtern
            </button>
          </form>

          {pageRows.length === 0 ? (
            <EmptyState
              icon={Handshake}
              title={filtered.length === 0 && total > 0 ? "Keine Treffer" : "Noch keine Sponsoren"}
              description={
                filtered.length === 0 && total > 0
                  ? "Für die aktuelle Suche/Filter gibt es keine Sponsoren."
                  : "Lege den ersten echten Sponsor über „Sponsor hinzufügen“ an."
              }
            />
          ) : (
            <div className="adm-table">
              <div className="adm-table__head" style={{ gridTemplateColumns: tableColumns }}>
                <span>Sponsor</span>
                <span>Paket</span>
                <span>Website</span>
                <span>Status</span>
                <span>Sortierung</span>
                <span style={{ textAlign: "right" }}>Aktionen</span>
              </div>
              {pageRows.map((sponsor) => (
                <div className="adm-table__row" key={sponsor.id} style={{ gridTemplateColumns: tableColumns }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                    <AdminImagePreview
                      src={sponsor.logo_path}
                      alt={`${sponsor.name} Logo`}
                      fallback="Kein Logo"
                      aspectRatio="76 / 44"
                      sizes="76px"
                      className="adm-thumb"
                    />
                    <strong>{sponsor.name}</strong>
                  </div>
                  <span className="adm-chip">{sponsor.package_name ?? "Kein Paket"}</span>
                  <span className="adm-cell-muted">{sponsor.website_url ?? "–"}</span>
                  <Badge tone={sponsor.is_active ? "green" : "gray"}>{sponsor.is_active ? "Aktiv" : "Inaktiv"}</Badge>
                  <span>{sponsor.sort_order}</span>
                  <div className="adm-row-actions">
                    <Link className="adm-icon-btn" href={`/admin/sponsors/${sponsor.id}`} aria-label={`${sponsor.name} bearbeiten`}>
                      <Pencil aria-hidden="true" size={15} />
                    </Link>
                    <RowMenu
                      label={`Weitere Aktionen für ${sponsor.name}`}
                      items={[
                        {
                          type: "action",
                          label: sponsor.is_active ? "Deaktivieren" : "Aktivieren",
                          action: setSponsorActiveAction.bind(null, sponsor.id, !sponsor.is_active)
                        },
                        {
                          type: "action",
                          label: "Löschen",
                          danger: true,
                          action: deleteSponsorAction.bind(null, sponsor.id),
                          confirm: {
                            title: "Sponsor löschen?",
                            message: "Der Sponsor wird dauerhaft gelöscht.",
                            itemLabel: sponsor.name,
                            itemMeta: sponsor.package_name ?? undefined
                          }
                        }
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="adm-panel__body" style={{ borderTop: "1px solid var(--adm-border-soft)" }}>
            <Pagination
              basePath="/admin/sponsors"
              page={page}
              pageCount={pageCount}
              totalLabel={
                filtered.length === 0
                  ? "0 Sponsoren"
                  : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} von ${filtered.length} Sponsoren`
              }
              searchParams={{ q, paket, status }}
            />
          </div>
        </section>

        <aside className="adm-rail">
          <Panel icon={Star} title="Sponsorenpakete" subtitle="Statische Paketübersicht für die Vermarktung">
            <div className="adm-system-list">
              {sponsorPackages.map((item) => (
                <article className="adm-system-row" key={item.name}>
                  <span className="adm-system-row__icon">
                    <Star aria-hidden="true" size={18} />
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.price} · {item.benefits.length} Leistungen
                    </small>
                  </span>
                </article>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
