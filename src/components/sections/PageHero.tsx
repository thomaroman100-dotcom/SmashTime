import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  redTitle?: string;
  text: string;
  image?: string;
  imagePosition?: string;
  className?: string;
  compact?: boolean;
  children?: React.ReactNode;
};

export function PageHero({
  title,
  redTitle,
  text,
  image,
  imagePosition,
  className,
  compact,
  children
}: PageHeroProps) {
  const style = {
    "--hero-image": image ? `url(${image})` : undefined,
    "--hero-position": imagePosition
  } as React.CSSProperties;

  return (
    <section
      className={cn("page-hero", className, compact && "page-hero--compact")}
      style={style}
    >
      <div className="container page-hero__inner">
        <div className="page-hero__copy">
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
