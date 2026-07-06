import type { NextConfig } from "next";

// Supabase-Storage-Host aus der Env ableiten – kein Wildcard-Proxy, kein hartcodierter Hostname.
const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return null;
  }
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)"
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }
];

const publicAssetCacheHeaders = [
  { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/images/**" }],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/smashtime-media/**"
          }
        ]
      : []
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders
      },
      {
        source: "/images/:path*",
        headers: publicAssetCacheHeaders
      },
      {
        source: "/favicon.svg",
        headers: publicAssetCacheHeaders
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/veranstaltungen/smashtime-3-cagetime",
        destination: "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring",
        permanent: false
      },
      {
        source: "/events/smashtime-3-cagetime",
        destination: "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring",
        permanent: false
      },
      { source: "/events", destination: "/veranstaltungen", permanent: false },
      { source: "/events/:path*", destination: "/veranstaltungen/:path*", permanent: false },
      { source: "/news", destination: "/neuigkeiten", permanent: false },
      { source: "/news/:path*", destination: "/neuigkeiten/:path*", permanent: false },
      { source: "/sponsors", destination: "/sponsoren", permanent: false },
      { source: "/about", destination: "/ueber-uns", permanent: false },
      { source: "/contact", destination: "/kontakt", permanent: false },
      { source: "/partners", destination: "/sponsoren", permanent: false },
      { source: "/fighters", destination: "/champions", permanent: false },
      { source: "/rankings", destination: "/champions", permanent: false },
      { source: "/career", destination: "/kontakt", permanent: false },
      { source: "/faq", destination: "/kontakt", permanent: false },
      { source: "/media", destination: "/neuigkeiten", permanent: false },
      { source: "/shop", destination: "/tickets", permanent: false },
      { source: "/legal/impressum", destination: "/impressum", permanent: false },
      { source: "/legal/datenschutz", destination: "/datenschutz", permanent: false },
      { source: "/legal/agb", destination: "/datenschutz", permanent: false }
    ];
  }
};

export default nextConfig;
