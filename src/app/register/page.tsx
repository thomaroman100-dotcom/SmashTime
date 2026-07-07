import { PublicAuthForm } from "@/components/auth/PublicAuthForm";

export const metadata = {
  title: "Registrieren | SmashTime"
};

export default function RegisterPage() {
  return <PublicAuthForm mode="register" />;
}
