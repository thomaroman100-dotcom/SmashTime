import Image from "next/image";
import Link from "next/link";
import { AtSign, Camera, Music2, Video } from "lucide-react";
import { site } from "@/data/site";

const socialIcons = {
  Instagram: Camera,
  Facebook: AtSign,
  YouTube: Video,
  TikTok: Music2
};

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Link href="/" className="site-footer__brand" aria-label="SmashTime Startseite">
          <Image src={site.logo} alt="SmashTime" width={108} height={108} />
        </Link>

        <p className="site-footer__copy">© 2026 SmashTime. Alle Rechte vorbehalten.</p>

        <nav className="site-footer__nav" aria-label="Fussnavigation">
          {site.footerNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__social">
          <span>Folge uns</span>
          {site.socialLinks.map((item) => {
            const Icon = socialIcons[item.label as keyof typeof socialIcons] ?? Camera;
            return (
              <Link key={item.label} href={item.href} aria-label={item.label}>
                <Icon size={20} strokeWidth={2} />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
