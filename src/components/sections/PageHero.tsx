import type { PageHeroPreset } from "@/data/heroes";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  redTitle?: string;
  text: string;
  preset?: PageHeroPreset;
  image?: string;
  imagePosition?: string;
  kicker?: string;
  watermark?: string;
  className?: string;
  compact?: boolean;
  preContent?: React.ReactNode;
  children?: React.ReactNode;
};

export function PageHero({
  title,
  redTitle,
  text,
  preset,
  image,
  imagePosition,
  kicker,
  watermark,
  className,
  compact,
  preContent,
  children
}: PageHeroProps) {
  const heroImage = image ?? preset?.image;
  const heroPosition = imagePosition ?? preset?.position;
  const heroKicker = kicker ?? preset?.kicker;
  const heroWatermark = watermark ?? preset?.watermark;
  const variant = preset?.variant;

  const style = {
    "--hero-image": heroImage ? `url(${heroImage})` : undefined,
    "--hero-position": heroPosition
  } as React.CSSProperties;

  return (
    <section
      className={cn(
        "page-hero",
        variant && `page-hero--v-${variant}`,
        className,
        compact && "page-hero--compact"
      )}
      style={style}
    >
      <span className="page-hero__grain" aria-hidden="true" />
      {heroWatermark ? (
        <span className="page-hero__watermark" aria-hidden="true">
          {heroWatermark}
        </span>
      ) : null}
      <div className="container page-hero__inner">
        <div className="page-hero__copy">
          {preContent}
          {heroKicker ? <span className="page-hero__kicker">{heroKicker}</span> : null}
          <h1>
            <span>{title}</span>
            {redTitle ? <span>{redTitle}</span> : null}
          </h1>
          <p>{text}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
