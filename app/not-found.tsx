import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-5 pt-28 pb-24">
      <div className="text-center">
        <p className="font-mono text-[12px] tracking-[0.2em] text-accent uppercase">404</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Nothing deployed here.</h1>
        <p className="mt-4 text-muted">The page you asked for does not exist.</p>
        <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-text px-6 font-medium text-bg transition-colors hover:bg-accent">
          Back home
        </Link>
      </div>
    </main>
  );
}
