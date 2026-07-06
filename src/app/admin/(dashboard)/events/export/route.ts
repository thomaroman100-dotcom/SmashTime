import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/admin/action-helpers";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const admin = await getAdminClient("events.manage");
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  const { data, error } = await admin.supabase
    .from("events")
    .select("name, subtitle, event_date, date_label, location, address, starts_at, admission, status, ticket_url")
    .order("event_date", { ascending: false, nullsFirst: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = ["Name", "Untertitel", "Datum", "Datum (Label)", "Ort", "Adresse", "Beginn", "Einlass", "Status", "Ticketlink"];
  const rows = ((data ?? []) as Array<Record<string, unknown>>).map((row) =>
    [
      row.name,
      row.subtitle,
      row.event_date,
      row.date_label,
      row.location,
      row.address,
      row.starts_at,
      row.admission,
      row.status,
      row.ticket_url
    ]
      .map(csvCell)
      .join(";")
  );

  const csv = [header.map(csvCell).join(";"), ...rows].join("\r\n");

  return new NextResponse(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="smashtime-events.csv"'
    }
  });
}
