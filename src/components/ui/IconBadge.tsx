import {
  CalendarDays,
  ChartNoAxesCombined,
  Clock3,
  Crown,
  Diamond,
  Gem,
  Handshake,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  PackageOpen,
  Send,
  Settings,
  Shield,
  Target,
  Trophy,
  Users,
  FileText,
  Dumbbell,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  calendar: CalendarDays,
  chart: ChartNoAxesCombined,
  clock: Clock3,
  crown: Crown,
  diamond: Diamond,
  gem: Gem,
  handshake: Handshake,
  mail: Mail,
  map: MapPin,
  megaphone: Megaphone,
  box: PackageOpen,
  send: Send,
  settings: Settings,
  shield: Shield,
  target: Target,
  trophy: Trophy,
  users: Users,
  file: FileText,
  message: MessageCircle,
  fighter: Dumbbell,
  circle: Circle
};

export type IconName = keyof typeof icons;

type IconBadgeProps = {
  name: IconName | string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function IconBadge({ name, className, size = "md" }: IconBadgeProps) {
  const Icon = icons[name as IconName] ?? Shield;

  return (
    <span className={cn("icon-badge", `icon-badge--${size}`, className)} aria-hidden="true">
      <Icon size={size === "sm" ? 18 : size === "lg" ? 31 : 24} strokeWidth={1.9} />
    </span>
  );
}
