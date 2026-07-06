import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { emptyMembersAdminData, loadMembersAdminData, memberStatusLabels, memberTypeLabels } from "@/lib/admin/members";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function csvCell(value: string | number | null | undefined) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await getAdminSession("users.manage");
  if (session.status !== "authenticated") {
    return NextResponse.json({ error: "Nicht berechtigt" }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase nicht konfiguriert" }, { status: 500 });
  }

  let data = emptyMembersAdminData();
  try {
    data = await loadMembersAdminData(supabase);
  } catch {
    data = emptyMembersAdminData();
  }
  const header = [
    "Benutzer-ID",
    "Anzeigename",
    "E-Mail",
    "Rolle",
    "Typ",
    "Status",
    "Verknüpfung",
    "Berechtigungen",
    "Erstellt",
    "Aktualisiert"
  ];
  const rows = data.members.map((member) => [
    member.userId,
    member.displayName,
    member.email,
    member.roleLabel,
    memberTypeLabels[member.profileType],
    memberStatusLabels[member.status],
    member.linkedLabel,
    member.isAdmin ? "Vollzugriff" : member.permissions.join(", "),
    member.createdAt,
    member.updatedAt
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\n");
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="smashtime-benutzer.csv"`
    }
  });
}
