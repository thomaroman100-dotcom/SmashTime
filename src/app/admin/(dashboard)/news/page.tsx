import Link from "next/link";
import { Archive, FileText, Image as ImageIcon, Newspaper, Pencil, Plus, Search, Send } from "lucide-react";
import { type NewsRow, deleteNewsAction, setNewsStatusAction } from "@/lib/admin/actions/news";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/admin/format";
import { AdminImagePreview } from "@/components/admin/ui/AdminImagePreview";
import { Badge, EmptyState, Pagination, StatCard } from "@/components/admin/ui/primitives";
import { RowMenu } from "@/components/admin/ui/RowMenu";

export const metadata = {
  title: "Neuigkeiten | SmashTime Admin"
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string; kategorie?: string; seite?: string }>;
};

const statusMeta: Record<NewsRow["status"], { label: string; tone: "gray" | "green" | "red" }> = {
  draft: { label: "Entwurf", tone: "gray" },
  published: { label: "Veröffentlicht", tone: "green" },
  archived: { label: "Archiviert", tone: "red" }
};

export default async function AdminNewsPage({ searchParams }: PageProps) {
  const { q, status, kategorie, seite } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let posts: NewsRow[] = [];
  let loadError: string | null = null;

  if (!supabase) {
    loadError = "Supabase ist nicht konfiguriert.";
  } else {
    const { data, error } = await supabase
      .from("news_posts")
      .select("id, slug, title, category, excerpt, body, image_path, hero_image_path, status, published_at, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      loadError = `Beiträge konnten nicht geladen werden: ${error.message}`;
    } else {
      posts = (data ?? []) as NewsRow[];
    }
  }

  const total = posts.length;
  const published = posts.filter((item) => item.status === "published").length;
  const drafts = posts.filter((item) => item.status === "draft").length;
  const withImages = posts.filter((item) => item.image_path || item.hero_image_path).length;
  const categories = [...new Set(posts.map((item) => item.category).filter(Boolean))];

  const query = (q ?? "").trim().toLowerCase();
  const filtered = posts.filter((item) => {
    if (query) {
      const haystack = `${item.title} ${item.excerpt ?? ""} ${item.category}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    if (status && item.status !== status) {
      return false;
    }
    if (kategorie && item.category !== kategorie) {
      return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(seite ?? "1", 10) || 1), pageCount);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tableColumns = "minmax(280px, 1.6fr) 150px 160px 140px 150px 120px";

  return (
    <div>
      <div className="adm-head">
        <div>
          <h1>Neuigkeiten</h1>
          <p>Beiträge, Teaser, Bilder und Veröffentlichungsstatus verwalten.</p>
        </div>
        <div className="adm-head__actions">
          <Link className="adm-btn adm-btn--primary" href="/admin/news/new">
            <Plus aria-hidden="true" size={16} /> Beitrag erstellen
          </Link>
        </div>
      </div>

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>{loadError}</strong>
        </div>
      ) : null}

      <section className="adm-stats" aria-label="News-Kennzahlen">
        <StatCard icon={Newspaper} tone="red" label="Beiträge" value={total} detail="Alle Neuigkeiten" />
        <StatCard icon={Send} tone="green" label="Veröffentlicht" value={published} detail="Öffentlich sichtbar" />
        <StatCard icon={Archive} tone="orange" label="Entwürfe" value={drafts} detail="Noch nicht live" />
        <StatCard icon={ImageIcon} tone="purple" label="Mit Bild" value={withImages} detail="Beiträge mit Medien" />
      </section>

      <section className="adm-panel">
        <form className="adm-toolbar" method="get" action="/admin/news">
          <div className="adm-search">
            <Search aria-hidden="true" size={16} />
            <input type="search" name="q" defaultValue={q ?? ""} placeholder="Neuigkeiten suchen…" aria-label="Neuigkeiten suchen" />
          </div>
          <div className="adm-filter">
            <span>Status</span>
            <select name="status" defaultValue={status ?? ""}>
              <option value="">Alle Status</option>
              <option value="published">Veröffentlicht</option>
              <option value="draft">Entwurf</option>
              <option value="archived">Archiviert</option>
            </select>
          </div>
          <div className="adm-filter">
            <span>Kategorie</span>
            <select name="kategorie" defaultValue={kategorie ?? ""}>
              <option value="">Alle Kategorien</option>
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <button className="adm-btn" type="submit">
            Filtern
          </button>
        </form>

        {pageRows.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={filtered.length === 0 && total > 0 ? "Keine Treffer" : "Noch keine Beiträge"}
            description={
              filtered.length === 0 && total > 0
                ? "Für die aktuelle Suche/Filter gibt es keine Neuigkeiten."
                : "Lege den ersten echten Beitrag über „Beitrag erstellen“ an."
            }
          />
        ) : (
          <div className="adm-table">
            <div className="adm-table__head" style={{ gridTemplateColumns: tableColumns }}>
              <span>Beitrag</span>
              <span>Kategorie</span>
              <span>Veröffentlicht</span>
              <span>Status</span>
              <span>Aktualisiert</span>
              <span style={{ textAlign: "right" }}>Aktionen</span>
            </div>
            {pageRows.map((item) => (
              <div className="adm-table__row" key={item.id} style={{ gridTemplateColumns: tableColumns }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                  <AdminImagePreview
                    src={item.image_path || item.hero_image_path}
                    alt={`${item.title} Beitragsbild`}
                    fallback="Kein Bild"
                    aspectRatio="76 / 44"
                    sizes="76px"
                    className="adm-thumb"
                  />
                  <div style={{ minWidth: 0 }}>
                    <strong>{item.title}</strong>
                    <span className="adm-cell-sub">{item.slug}</span>
                  </div>
                </div>
                <span className="adm-chip">{item.category}</span>
                <span>{formatDate(item.published_at)}</span>
                <Badge tone={statusMeta[item.status].tone}>{statusMeta[item.status].label}</Badge>
                <span>{formatDate(item.updated_at)}</span>
                <div className="adm-row-actions">
                  <Link className="adm-icon-btn" href={`/admin/news/${item.id}`} aria-label={`${item.title} bearbeiten`}>
                    <Pencil aria-hidden="true" size={15} />
                  </Link>
                  <RowMenu
                    label={`Weitere Aktionen für ${item.title}`}
                    items={[
                      item.status !== "published"
                        ? {
                            type: "action",
                            label: "Veröffentlichen",
                            action: setNewsStatusAction.bind(null, item.id, "published")
                          }
                        : {
                            type: "action",
                            label: "Als Entwurf speichern",
                            action: setNewsStatusAction.bind(null, item.id, "draft")
                          },
                      {
                        type: "action",
                        label: "Archivieren",
                        action: setNewsStatusAction.bind(null, item.id, "archived")
                      },
                      {
                        type: "action",
                        label: "Löschen",
                        danger: true,
                        action: deleteNewsAction.bind(null, item.id),
                        confirm: {
                          title: "Neuigkeit löschen?",
                          message: "Der Beitrag wird dauerhaft gelöscht.",
                          itemLabel: item.title,
                          itemMeta: item.category
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
            basePath="/admin/news"
            page={page}
            pageCount={pageCount}
            totalLabel={
              filtered.length === 0
                ? "0 Beiträge"
                : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} von ${filtered.length} Beiträgen`
            }
            searchParams={{ q, status, kategorie }}
          />
        </div>
      </section>
    </div>
  );
}
