import type { FighterProfileOption } from "@/components/admin/FighterProfilePicker";
import type { createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

export async function loadVerifiedFighterOptions(supabase: SupabaseServerClient) {
  const { data, error } = await supabase
    .from("fighter_profiles")
    .select("user_id, nickname, weight_class, record, image_path, profiles!inner(display_name, profile_type, status)")
    .eq("is_verified", true)
    .eq("profiles.profile_type", "fighter")
    .eq("profiles.status", "active");

  if (error) {
    return { options: [] as FighterProfileOption[], error };
  }

  const options = ((data ?? []) as unknown as Array<{
    user_id: string;
    nickname: string | null;
    weight_class: string | null;
    record: string | null;
    image_path: string | null;
    profiles: { display_name: string | null } | null;
  }>)
    .map((row) => ({
      userId: row.user_id,
      name: row.nickname || row.profiles?.display_name || "Kämpfer",
      meta: [row.weight_class, row.record].filter(Boolean).join(" · "),
      imagePath: row.image_path
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));

  return { options, error: null };
}
