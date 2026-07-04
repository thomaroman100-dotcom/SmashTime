import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminUser = {
  email: string;
  displayName: string;
  role: string;
};

type AdminProfileRow = {
  display_name: string | null;
  role: string | null;
  is_active: boolean | null;
};

export type AdminSessionState =
  | { status: "authenticated"; user: AdminUser }
  | { status: "missing-config" | "unauthenticated" | "forbidden" };

export async function getAdminSession(): Promise<AdminSessionState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { status: "missing-config" };
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "unauthenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("display_name, role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  const adminProfile = profile as AdminProfileRow | null;

  if (profileError || !adminProfile?.is_active) {
    return { status: "forbidden" };
  }

  return {
    status: "authenticated",
    user: {
      email: user.email ?? "admin@smashtime.local",
      displayName: adminProfile.display_name ?? "Admin",
      role: adminProfile.role ?? "admin"
    }
  };
}
