import Link from "next/link";
import {
  Award,
  Crown,
  Download,
  Eye,
  Hourglass,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  type ChampionRow,
  deleteChampionAction,
  setChampionActiveAction
} from "@/lib/admin/actions/champions";
import { formatDate } from "@/lib/admin/format";
import { AdminImagePreview } from "@/components/admin/ui/AdminImagePreview";
import { Badge, EmptyState, Pagination, StatCard } from "@/components/admin/ui/primitives";
import { RowMenu } from "@/components/admin/ui/RowMenu";

export const metadata = {
  title: "Champions | SmashTime Admin"
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 8;

type PageProps = {
  searchParams: Promise<{
    q?: string;
    klasse?: string;
    herkunft?: string;
    status?: string;
    seite?: string;
  }>;
};

export default async function AdminChampionsPage({ searchParams }: PageProps) {
  const { q, klasse, herkunft, status, seite } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let champions: ChampionRow[] = [];
  let loadError: string | null = null;

  if (!supabase) {
    loadError = "Supabase ist nicht konfiguriert.";
  } else {
    const { data, error } = await supabase
      .from("champions")
      .select(
        "id, slug, fighter_user_id, name, age, weight, weight_class, record, origin, image_path, stance, bio, quote, title, sort_order, is_active, updated_at"
      )
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      loadError = `Champions konnten nicht geladen werden: ${error.message}`;
    } else {
      champions = (data ?? []) as unknown as ChampionRow[];
    }
  }

  const total = champions.length;
  const active = champions.filter((champion) => champion.is_active).length;
  const inactive = total - active;
  const titleHolders = champions.filter((champion) => champion.is_active && champion.title).length;

  const weightClasses = [...new Set(champions.map((c) => c.weight_class).filter(Boolean))] as string[];
  const origins = [...new Set(champions.map((c) => c.origin).filter(Boolean))] as string[];

  const query = (q ?? "").trim().toLowerCase();
  const filtered = champions.filter((champion) => {
    if (query) {
      const haystack = `${champion.name} ${champion.title ?? ""} ${champion.weight_class ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    if (klasse && champion.weight_class !== klasse) {
      return false;
    }
    if (herkunft && champion.origin !== herkunft) {
      return false;
    }
    if (status === "aktiv" && !champion.is_active) {
      return false;
    }
    if (status === "inaktiv" && champion.is_active) {
      return false;
    }
    if (status === "titel" && !(champion.is_active && champion.title)) {
      return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(seite ?? "1", 10) || 1), pageCount);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tableColumns = "minmax(220px, 1.4fr) minmax(180px, 1.2fr) 150px 130px 170px 130px";

  return (
    <div>
      <div className="adm-head">
        <div>
          <h1>
            Champions Übersicht <ShieldCheck aria-hidden="true" size={24} />
          </h1>
          <p>Verwalte alle Champions, Titel, Statistiken und Profile zentral an einem Ort.</p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href="/admin/champions/export" download>
            <Download aria-hidden="true" size={16} /> Export
          </a>
          <Link className="adm-btn adm-btn--primary" href="/admin/champions/new">
            <Plus aria-hidden="true" size={16} /> Champion hinzufügen
          </Link>
        </div>
      </div>

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>{loadError}</strong>
        </div>
      ) : null}

      <section className="adm-stats" aria-label="Champion-Kennzahlen">
        <StatCard icon={Crown} tone="red" label="Gesamt" value={total} detail="Alle Champions" />
        <StatCard icon={ShieldCheck} tone="green" label="Aktiv" value={active} detail="Aktive Champions" />
        <StatCard icon={Hourglass} tone="orange" label="Inaktiv" value={inactive} detail="Inaktive Champions" />
        <StatCard icon={Award} tone="red" label="Titelträger" value={titleHolders} detail="Aktuelle Titelträger" />
      </section>

      <section className="adm-panel">
        <form className="adm-toolbar" method="get" action="/admin/champions">
          <div className="adm-search">
            <Search aria-hidden="true" size={16} />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Suche nach Namen, Titel oder Gewichtsklasse…"
              aria-label="Champions durchsuchen"
            />
          </div>
          <div className="adm-filter">
            <span>Gewichtsklasse</span>
            <select name="klasse" defaultValue={klasse ?? ""}>
              <option value="">Alle Klassen</option>
              {weightClasses.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="adm-filter">
            <span>Herkunft</span>
            <select name="herkunft" defaultValue={herkunft ?? ""}>
              <option value="">Alle Länder</option>
              {origins.map((value) => (
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
              <option value="titel">Titelträger</option>
            </select>
          </div>
          <button className="adm-btn" type="submit">
            <SlidersHorizontal aria-hidden="true" size={15} /> Mehr Filter
          </button>
        </form>

        {pageRows.length === 0 ? (
          <EmptyState
            icon={Crown}
            title={filtered.length === 0 && total > 0 ? "Keine Treffer" : "Noch keine Champions"}
            description={
              filtered.length === 0 && total > 0
                ? "Für die aktuelle Suche/Filter gibt es keine Champions."
                : "Lege den ersten Champion über „Champion hinzufügen“ an."
            }
          />
        ) : (
          <div className="adm-table">
            <div className="adm-table__head" style={{ gridTemplateColumns: tableColumns }}>
              <span>Champion</span>
              <span>Titel</span>
              <span>Klasse</span>
              <span>Status</span>
              <span>Letzte Aktualisierung</span>
              <span style={{ textAlign: "right" }}>Aktionen</span>
            </div>
            {pageRows.map((champion) => (
              <div className="adm-table__row" key={champion.id} style={{ gridTemplateColumns: tableColumns }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                  <AdminImagePreview
                    src={champion.image_path}
                    alt={`${champion.name} Championfoto`}
                    fallback="Kein Foto"
                    aspectRatio="44 / 52"
                    sizes="52px"
                    className="adm-thumb adm-thumb--portrait"
                  />
                  <div style={{ minWidth: 0 }}>
                    <strong>{champion.name}</strong>
                    <span className="adm-cell-sub">{champion.origin ?? "Herkunft offen"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 0 }}>
                  <Award
                    aria-hidden="true"
                    size={16}
                    style={{ color: champion.title ? "var(--adm-gold)" : "var(--adm-faint)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      color: champion.title ? "var(--adm-gold)" : "var(--adm-faint)",
                      fontSize: 13,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {champion.title ?? "Titel vakant"}
                  </span>
                </div>
                <div>
                  <span className="adm-chip">{champion.weight_class ?? "–"}</span>
                  {champion.weight ? <span className="adm-cell-sub">{champion.weight}</span> : null}
                </div>
                <div>
                  <Badge tone={champion.is_active ? "green" : "gray"} uppercase>
                    {champion.is_active ? "Aktiv" : "Inaktiv"}
                  </Badge>
                  <span className="adm-cell-sub">{champion.title ? "Titelträger" : "Titel vakant"}</span>
                </div>
                <div>
                  <span>{formatDate(champion.updated_at)}</span>
                  {champion.record ? <span className="adm-cell-sub">Bilanz {champion.record}</span> : null}
                </div>
                <div className="adm-row-actions">
                  <Link
                    className="adm-icon-btn"
                    href={`/admin/champions/${champion.id}`}
                    aria-label={`${champion.name} bearbeiten`}
                  >
                    <Pencil aria-hidden="true" size={15} />
                  </Link>
                  <Link
                    className="adm-icon-btn"
                    href="/champions"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${champion.name} auf der Website ansehen`}
                  >
                    <Eye aria-hidden="true" size={15} />
                  </Link>
                  <RowMenu
                    label={`Weitere Aktionen für ${champion.name}`}
                    items={[
                      {
                        type: "action",
                        label: champion.is_active ? "Deaktivieren" : "Aktivieren",
                        action: setChampionActiveAction.bind(null, champion.id, !champion.is_active)
                      },
                      {
                        type: "action",
                        label: "Löschen",
                        danger: true,
                        action: deleteChampionAction.bind(null, champion.id),
                        confirm: {
                          title: "Champion löschen?",
                          message: "Der Champion wird dauerhaft gelöscht.",
                          itemLabel: champion.name,
                          itemMeta: champion.title ?? champion.weight_class ?? undefined
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
            basePath="/admin/champions"
            page={page}
            pageCount={pageCount}
            totalLabel={
              filtered.length === 0
                ? "0 Champions"
                : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} von ${filtered.length} Champions`
            }
            searchParams={{ q, klasse, herkunft, status }}
          />
        </div>
      </section>
    </div>
  );
}
