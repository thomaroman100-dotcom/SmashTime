import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CTAButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function CTAButton({
  href,
  children,
  variant = "solid",
  className,
  type = "button",
  onClick
}: CTAButtonProps) {
  const classes = cn(
    "cta-button",
    variant === "outline" && "cta-button--outline",
    className
  );

  if (href) {
    return (
      <Link className={classes} href={href} onClick={onClick}>
        <span>{children}</span>
        <ArrowRight aria-hidden="true" size={19} strokeWidth={2.4} />
      </Link>
    );
  }

  return (
    <button className={classes} type={type} onClick={onClick}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={19} strokeWidth={2.4} />
    </button>
  );
}
