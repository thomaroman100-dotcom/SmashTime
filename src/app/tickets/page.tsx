import { redirect } from "next/navigation";

export default function TicketsRedirectPage() {
  redirect("/veranstaltungen#tickets");
}
