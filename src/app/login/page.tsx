import { PublicAuthForm } from "@/components/auth/PublicAuthForm";

export const metadata = {
  title: "Login | SmashTime"
};

export default function LoginPage() {
  return <PublicAuthForm mode="login" />;
}
