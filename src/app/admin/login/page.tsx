import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export const metadata = {
  title: "Admin-Anmeldung | SmashTime"
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const session = await getAdminSession();

  if (session.status === "authenticated") {
    redirect("/admin");
  }

  const { status } = await searchParams;

  return <AdminLoginForm status={status ?? session.status} />;
}
