import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

const pathPermissions = [
  { prefix: "/admin/members", permission: "users.manage" },
  { prefix: "/admin/champions", permission: "champions.manage" },
  { prefix: "/admin/events", permission: "events.manage" },
  { prefix: "/admin/fightcards", permission: "fightcards.manage" },
  { prefix: "/admin/news", permission: "news.manage" },
  { prefix: "/admin/sponsors", permission: "sponsors.manage" },
  { prefix: "/admin/contact", permission: "contact.manage" },
  { prefix: "/admin/media", permission: "media.manage" },
  { prefix: "/admin/settings", permission: "settings.manage" }
] as const;

function permissionForPath(pathname: string) {
  return pathPermissions.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`))?.permission;
}

function loginRedirect(request: NextRequest, status: string) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("status", status);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request
  });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!user && !isLoginRoute) {
    return loginRedirect(request, "unauthenticated");
  }

  if (user && !isLoginRoute) {
    const requiredPermission = permissionForPath(request.nextUrl.pathname);
    const [{ data: adminData }, { data: profileData }, { data: permissionData }] = await Promise.all([
      supabase
        .from("admin_profiles")
        .select("role, is_active")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("profile_type, status")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("staff_permissions")
        .select("permission")
        .eq("user_id", user.id)
    ]);

    const admin = adminData as { role: string | null; is_active: boolean | null } | null;
    const profile = profileData as { profile_type: string | null; status: string | null } | null;
    const permissions = (permissionData ?? []) as Array<{ permission: string | null }>;
    const isAdmin = Boolean(admin?.is_active && admin.role === "admin");
    const isStaff = profile?.profile_type === "staff" && profile.status === "active";
    const hasAnyPermission = permissions.some((item) => Boolean(item.permission));
    const hasRequiredPermission = requiredPermission
      ? permissions.some((item) => item.permission === requiredPermission)
      : hasAnyPermission;

    if (!isAdmin && (!isStaff || !hasRequiredPermission)) {
      return loginRedirect(request, "forbidden");
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
