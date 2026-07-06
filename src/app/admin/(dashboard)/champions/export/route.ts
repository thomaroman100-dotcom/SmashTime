import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/admin/action-helpers";
import { csvCell, csvDownloadHeaders } from "@/lib/admin/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminClient("champions.manage");
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  const { data, error } = await admin.supabase
    .from("champions")
    .select("name, title, weight_class, weight, record, origin, is_active, updated_at")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = ["Name", "Titel", "Gewichtsklasse", "Gewicht", "Bilanz", "Herkunft", "Status", "Aktualisiert"];
  const rows = ((data ?? []) as Array<Record<string, unknown>>).map((row) =>
    [
      row.name,
      row.title,
      row.weight_class,
      row.weight,
      row.record,
      row.origin,
      row.is_active ? "Aktiv" : "Inaktiv",
      row.updated_at
    ]
      .map(csvCell)
      .join(";")
  );

  const csv = [header.map(csvCell).join(";"), ...rows].join("\r\n");

  return new NextResponse(`﻿${csv}`, {
    headers: csvDownloadHeaders("smashtime-champions.csv")
  });
}
