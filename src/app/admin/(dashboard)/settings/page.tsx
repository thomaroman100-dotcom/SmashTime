import { SettingsForm } from "@/components/admin/SettingsForm";
import type { SettingsEventOption } from "@/components/admin/SettingsForm";
import { type SettingRow, saveSettingsAction } from "@/lib/admin/actions/settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Einstellungen | SmashTime Admin"
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();

  const values: Record<string, string> = {};
  let eventOptions: SettingsEventOption[] = [];
  let loadError: string | null = null;

  if (!supabase) {
    loadError = "Supabase ist nicht konfiguriert.";
  } else {
    const [{ data, error }, { data: eventsData }] = await Promise.all([
      supabase.from("site_settings").select("key, value"),
      supabase
        .from("events")
        .select("id, slug, name, date_label, event_date, starts_at")
        .order("event_date", { ascending: true, nullsFirst: false })
    ]);

    if (error) {
      loadError = `Einstellungen konnten nicht geladen werden: ${error.message}`;
    } else {
      for (const row of (data ?? []) as SettingRow[]) {
        values[row.key] = row.value?.text ?? "";
      }
      eventOptions = (eventsData ?? []).map((event) => {
        const row = event as {
          id: number;
          slug: string | null;
          name: string | null;
          date_label: string | null;
          event_date: string | null;
          starts_at: string | null;
        };
        return {
          id: row.slug ?? String(row.id),
          label: [row.name ?? "Veranstaltung", row.date_label].filter(Boolean).join(" - "),
          endAt: row.event_date ?? "2026-10-17T18:00:00+02:00"
        };
      });
    }
  }

  return loadError ? (
    <section className="admin-panel">
      <p className="admin-form__message" role="alert">{loadError}</p>
    </section>
  ) : (
    <SettingsForm action={saveSettingsAction} values={values} eventOptions={eventOptions} />
  );
}
