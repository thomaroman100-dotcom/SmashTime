import Link from "next/link";
import { CheckCircle2, Inbox, MailOpen, MessageSquare, Search } from "lucide-react";
import { type ContactRow, deleteContactRequestAction, setContactStatusAction } from "@/lib/admin/actions/contact";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRelative } from "@/lib/admin/format";
import { Badge, EmptyState, Pagination, StatCard } from "@/components/admin/ui/primitives";
import { RowMenu } from "@/components/admin/ui/RowMenu";

export const metadata = {
  title: "Kontaktanfragen | SmashTime Admin"
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string; typ?: string; seite?: string }>;
};

const statusMeta: Record<ContactRow["status"], { label: string; tone: "red" | "orange" | "green" }> = {
  neu: { label: "Neu", tone: "red" },
  gelesen: { label: "Gelesen", tone: "orange" },
  erledigt: { label: "Erledigt", tone: "green" }
};

export default async function AdminContactPage({ searchParams }: PageProps) {
  const { q, status, typ, seite } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let requests: ContactRow[] = [];
  let loadError: string | null = null;

  if (!supabase) {
    loadError = "Supabase ist nicht konfiguriert.";
  } else {
    const { data, error } = await supabase
      .from("contact_requests")
      .select("id, category, name, email, subject, message, status, internal_notes, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      loadError = `Anfragen konnten nicht geladen werden: ${error.message}`;
    } else {
      requests = (data ?? []) as ContactRow[];
    }
  }

  const total = requests.length;
  const newCount = requests.filter((item) => item.status === "neu").length;
  const readCount = requests.filter((item) => item.status === "gelesen").length;
  const doneCount = requests.filter((item) => item.status === "erledigt").length;
  const types = [...new Set(requests.map((item) => item.category).filter(Boolean))];

  const query = (q ?? "").trim().toLowerCase();
  const filtered = requests.filter((item) => {
    if (query) {
      const haystack = `${item.name} ${item.email} ${item.subject ?? ""} ${item.message}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    if (status && item.status !== status) {
      return false;
    }
    if (typ && item.category !== typ) {
      return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(seite ?? "1", 10) || 1), pageCount);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tableColumns = "minmax(220px, 1.1fr) minmax(230px, 1.4fr) minmax(250px, 1.5fr) 120px 150px 110px";

  return (
    <div>
      <div className="adm-head">
        <div>
          <h1>Kontaktanfragen</h1>
          <p>Überblick und Bearbeitung eingehender Kontakt- und Kooperationsanfragen.</p>
        </div>
      </div>

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>{loadError}</strong>
        </div>
      ) : null}

      <section className="adm-stats" aria-label="Kontakt-Kennzahlen">
        <StatCard icon={Inbox} tone="red" label="Neue Anfragen" value={newCount} detail="Noch offen" />
        <StatCard icon={MailOpen} tone="orange" label="In Bearbeitung" value={readCount} detail="Gelesen" />
        <StatCard icon={CheckCircle2} tone="green" label="Erledigt" value={doneCount} detail="Abgeschlossen" />
        <StatCard icon={MessageSquare} tone="purple" label="Gesamt" value={total} detail="Alle Anfragen" />
      </section>

      <section className="adm-panel">
        <form className="adm-toolbar" method="get" action="/admin/contact">
          <div className="adm-filter">
            <span>Typ</span>
            <select name="typ" defaultValue={typ ?? ""}>
              <option value="">Alle Typen</option>
              {types.map((value) => (
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
              <option value="neu">Neu</option>
              <option value="gelesen">Gelesen</option>
              <option value="erledigt">Erledigt</option>
            </select>
          </div>
          <div className="adm-search">
            <Search aria-hidden="true" size={16} />
            <input type="search" name="q" defaultValue={q ?? ""} placeholder="Suchen…" aria-label="Kontaktanfragen suchen" />
          </div>
          <button className="adm-btn" type="submit">
            Filtern
          </button>
        </form>

        {pageRows.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={filtered.length === 0 && total > 0 ? "Keine Treffer" : "Noch keine Kontaktanfragen"}
            description={
              filtered.length === 0 && total > 0
                ? "Für die aktuelle Suche/Filter gibt es keine Anfragen."
                : "Neue Anfragen aus dem Kontaktformular erscheinen automatisch hier."
            }
          />
        ) : (
          <div className="adm-table">
            <div className="adm-table__head" style={{ gridTemplateColumns: tableColumns }}>
              <span>Absender</span>
              <span>Betreff / Thema</span>
              <span>Nachricht</span>
              <span>Status</span>
              <span>Eingegangen</span>
              <span style={{ textAlign: "right" }}>Aktionen</span>
            </div>
            {pageRows.map((request) => (
              <div className="adm-table__row" key={request.id} style={{ gridTemplateColumns: tableColumns }}>
                <div>
                  <strong>{request.name}</strong>
                  <span className="adm-cell-sub">{request.email}</span>
                </div>
                <div>
                  <Link href={`/admin/contact/${request.id}`}>
                    <strong>{request.subject ?? "Ohne Betreff"}</strong>
                  </Link>
                  <span className="adm-cell-sub">{request.category}</span>
                </div>
                <span className="adm-cell-muted">{request.message.slice(0, 120)}{request.message.length > 120 ? "…" : ""}</span>
                <Badge tone={statusMeta[request.status].tone}>{statusMeta[request.status].label}</Badge>
                <span>{formatRelative(request.created_at)}</span>
                <div className="adm-row-actions">
                  <RowMenu
                    label={`Weitere Aktionen für Anfrage von ${request.name}`}
                    items={[
                      ...(request.status === "neu"
                        ? [
                            {
                              type: "action" as const,
                              label: "Als gelesen markieren",
                              action: setContactStatusAction.bind(null, request.id, "gelesen")
                            }
                          ]
                        : []),
                      ...(request.status !== "erledigt"
                        ? [
                            {
                              type: "action" as const,
                              label: "Als erledigt markieren",
                              action: setContactStatusAction.bind(null, request.id, "erledigt")
                            }
                          ]
                        : []),
                      {
                        type: "link",
                        label: "Details anzeigen",
                        href: `/admin/contact/${request.id}`
                      },
                      {
                        type: "action",
                        label: "Löschen",
                        danger: true,
                        action: deleteContactRequestAction.bind(null, request.id),
                        confirm: {
                          title: "Anfrage löschen?",
                          message: "Die Kontaktanfrage wird dauerhaft gelöscht.",
                          itemLabel: request.subject ?? request.name,
                          itemMeta: request.email
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
            basePath="/admin/contact"
            page={page}
            pageCount={pageCount}
            totalLabel={
              filtered.length === 0
                ? "0 Anfragen"
                : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} von ${filtered.length} Anfragen`
            }
            searchParams={{ q, status, typ }}
          />
        </div>
      </section>
    </div>
  );
}
