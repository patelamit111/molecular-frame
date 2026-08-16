import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <p>Page not found</p>
      <h1>This frame is outside the sequence.</h1>
      <Link href="/" className="button">
        Return home
      </Link>
    </main>
  );
}
