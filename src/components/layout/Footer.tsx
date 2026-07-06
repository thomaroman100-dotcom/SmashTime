import Image from "next/image";
import Link from "next/link";
import { AtSign, Camera, Music2, Video } from "lucide-react";
import { site as defaultSite } from "@/data/site";
import type { PublicSiteContent } from "@/lib/site-settings";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const socialIcons = {
  Instagram: Camera,
  Facebook: AtSign,
  YouTube: Video,
  TikTok: Music2
};

type FooterProps = {
  siteContent?: PublicSiteContent;
};

export function Footer({ siteContent = defaultSite }: FooterProps) {
  const site = siteContent;
  const socialLinks = site.socialLinks.filter((item) => item.href && item.href !== "#");

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-col">
          <Link href="/" className="site-footer__brand" aria-label="SmashTime Startseite">
            <Image src={site.logo} alt="SmashTime" width={180} height={60} unoptimized />
          </Link>
          <p className="site-footer__claim">{site.claim}</p>
          <p className="site-footer__description">{site.description}</p>
        </div>

        {site.footerColumns.map((column) => (
          <nav className="site-footer__column" key={column.title} aria-label={column.title}>
            <h3>{column.title}</h3>
            {column.links.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className="site-footer__column site-footer__column--social">
          <h3>Folge uns</h3>
          {socialLinks.length > 0 ? (
            <div className="site-footer__social">
              {socialLinks.map((item) => {
                const Icon = socialIcons[item.label as keyof typeof socialIcons] ?? Camera;
                return (
                  <Link key={item.label} href={item.href} aria-label={item.label}>
                    <Icon size={20} strokeWidth={2} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="site-footer__note">Social Profile werden zum Launch ergänzt.</p>
          )}
          <h3>{site.newsletter.title}</h3>
          <NewsletterForm />
        </div>
      </div>

      <p className="site-footer__copy">© 2026 SmashTime. Alle Rechte vorbehalten.</p>
    </footer>
  );
}
