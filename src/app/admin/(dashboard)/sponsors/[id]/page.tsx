import { notFound } from "next/navigation";
import { SponsorForm } from "@/components/admin/SponsorForm";
import { type SponsorRow, updateSponsorAction } from "@/lib/admin/actions/sponsors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sponsor bearbeiten | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type AdminSponsorEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSponsorEditPage({ params }: AdminSponsorEditPageProps) {
  const { id } = await params;
  const sponsorId = Number.parseInt(id, 10);

  if (!Number.isFinite(sponsorId)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("sponsors")
    .select("id, name, logo_path, website_url, package_name, sort_order, is_active, updated_at")
    .eq("id", sponsorId)
    .maybeSingle();

  const sponsor = data as SponsorRow | null;

  if (!sponsor) {
    notFound();
  }

  return (
    <SponsorForm
      action={updateSponsorAction.bind(null, sponsor.id)}
      initial={sponsor}
      heading="Sponsor bearbeiten"
      subheading={`Bearbeite ${sponsor.name} und speichere nur echte Partnerdaten.`}
    />
  );
}
