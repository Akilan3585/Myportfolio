/** Fixed ambient layers: a faint grid, one radial glow, and film grain. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-bg" />
      <div className="bg-grid absolute inset-x-0 top-0 h-[120vh]" />
      <div
        className="absolute left-1/2 top-[-20vh] h-[80vh] w-[120vw] -translate-x-1/2 rounded-[100%] opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgb(124 140 255 / 0.22), rgb(79 227 193 / 0.06) 55%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />
      <div className="bg-noise absolute inset-0" />
    </div>
  );
}
