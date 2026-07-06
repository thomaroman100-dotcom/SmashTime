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

const nextConfig: NextConfig = {
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
