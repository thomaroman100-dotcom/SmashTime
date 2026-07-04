import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>Seite nicht gefunden.</h1>
      <p>Diese Seite existiert in Phase 1 nicht.</p>
      <Link href="/">Zur Startseite</Link>
    </section>
  );
}
