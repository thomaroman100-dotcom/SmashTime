import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();

  if (session.status !== "authenticated") {
    redirect(`/admin/login?status=${session.status}`);
  }

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
