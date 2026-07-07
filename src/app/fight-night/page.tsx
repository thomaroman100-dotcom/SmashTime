import { redirect } from "next/navigation";
import { upcomingEvent } from "@/data/events";

export const metadata = {
  title: "Kampfabend | SmashTime"
};

export default function FightNightPage() {
  redirect(`${upcomingEvent.detailHref ?? "/veranstaltungen"}#fightcard`);
}
