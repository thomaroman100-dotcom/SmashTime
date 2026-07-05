import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AtSign, CalendarDays, Mail, Tag, UserRound } from "lucide-react";
import { ContactDetailForm } from "@/components/admin/ContactDetailForm";
import { type ContactRow, saveContactNotesAction } from "@/lib/admin/actions/contact";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/admin/ui/primitives";

export const metadata = {
  title: "Kontaktanfrage | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type AdminContactDetailPageProps = {
  params: Promise<{ id: string }>;
};

const statusTone: Record<ContactRow["status"], "red" | "orange" | "green"> = {
  neu: "red",
  gelesen: "orange",
  erledigt: "green"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default async function AdminContactDetailPage({ params }: AdminContactDetailPageProps) {
  const { id } = await params;
  const requestId = Number.parseInt(id, 10);

  if (!Number.isFinite(requestId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("contact_requests")
    .select("id, category, name, email, subject, message, status, internal_notes, created_at")
    .eq("id", requestId)
    .maybeSingle();

  const request = data as ContactRow | null;

  if (!request) {
    notFound();
  }

  return (
    <div>
      <div className="adm-head">
        <div>
          <Link className="adm-head__back" href="/admin/contact">
            <ArrowLeft aria-hidden="true" size={14} /> Kontaktanfragen
          </Link>
          <h1>{request.subject ?? "Anfrage ohne Betreff"}</h1>
          <p>Kontaktanfrage im Detail prüfen und intern dokumentieren.</p>
        </div>
      </div>

      <div className="adm-cols adm-cols--main-rail">
        <section className="adm-panel">
          <div className="adm-panel__head">
            <Mail aria-hidden="true" size={17} />
            <div className="adm-panel__head-text">
              <h2>Anfrage</h2>
              <p>Eingehende Nachricht aus dem öffentlichen Kontaktformular.</p>
            </div>
            <Badge tone={statusTone[request.status]}>{request.status === "neu" ? "Neu" : request.status === "gelesen" ? "Gelesen" : "Erledigt"}</Badge>
          </div>
          <div className="adm-panel__body">
            <div className="adm-system-list" style={{ marginBottom: 18 }}>
              <article className="adm-system-row">
                <span className="adm-system-row__icon">
                  <Tag aria-hidden="true" size={18} />
                </span>
                <span>
                  <strong>Kategorie</strong>
                  <small>{request.category}</small>
                </span>
              </article>
              <article className="adm-system-row">
                <span className="adm-system-row__icon">
                  <UserRound aria-hidden="true" size={18} />
                </span>
                <span>
                  <strong>Absender</strong>
                  <small>{request.name}</small>
                </span>
              </article>
              <article className="adm-system-row">
                <span className="adm-system-row__icon">
                  <AtSign aria-hidden="true" size={18} />
                </span>
                <span>
                  <strong>E-Mail</strong>
                  <small>{request.email}</small>
                </span>
              </article>
              <article className="adm-system-row">
                <span className="adm-system-row__icon">
                  <CalendarDays aria-hidden="true" size={18} />
                </span>
                <span>
                  <strong>Eingegangen</strong>
                  <small>{formatDate(request.created_at)}</small>
                </span>
              </article>
            </div>

            <div className="adm-message-box">
              <p>{request.message}</p>
            </div>
          </div>
        </section>

        <aside className="adm-rail">
          <ContactDetailForm action={saveContactNotesAction.bind(null, request.id)} request={request} />
        </aside>
      </div>
    </div>
  );
}
