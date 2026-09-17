/** Shown only if a project module suspends; static pages usually skip it. */
export default function Loading() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center px-5 pt-28 pb-24" aria-busy="true">
      <div className="w-full max-w-[420px] font-mono text-[13px]">
        <p className="text-faint">LOADING MODULE...</p>
        <div className="mt-3 h-2 w-full border border-line">
          <div className="fill h-full bg-accent" />
        </div>
        <p className="mt-3 text-muted">MODULE READY</p>
      </div>
    </main>
  );
}
