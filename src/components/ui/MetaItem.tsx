import type { IconName } from "./IconBadge";
import { IconBadge } from "./IconBadge";

type MetaItemProps = {
  icon: IconName;
  label?: string;
  value: string;
  detail?: string;
};

export function MetaItem({ icon, label, value, detail }: MetaItemProps) {
  return (
    <div className="meta-item">
      <IconBadge name={icon} size="sm" />
      <div>
        {label ? <span className="meta-item__label">{label}</span> : null}
        <strong>{value}</strong>
        {detail ? <span>{detail}</span> : null}
      </div>
    </div>
  );
}
