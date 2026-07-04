import { Check } from "lucide-react";
import type { SponsorPackage } from "@/data/sponsors";
import { CTAButton } from "@/components/ui/CTAButton";

type SponsorPackageCardProps = {
  item: SponsorPackage;
};

export function SponsorPackageCard({ item }: SponsorPackageCardProps) {
  return (
    <article className={`sponsor-package sponsor-package--${item.tone} card-grunge card-grunge--info`}>
      <div className="sponsor-package__medal" aria-hidden="true">
        {item.name.slice(0, 1)}
      </div>
      <h3>{item.name}</h3>
      <p>{item.price}</p>
      <ul>
        {item.benefits.map((benefit) => (
          <li key={benefit}>
            <Check aria-hidden="true" size={18} /> {benefit}
          </li>
        ))}
      </ul>
      <CTAButton href="/kontakt" variant="outline">
        Paket anfragen
      </CTAButton>
    </article>
  );
}
