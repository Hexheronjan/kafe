export default function Loading() {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream text-espresso">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-espresso/20 border-t-brand" />
        <p className="text-xs font-semibold tracking-[0.22em] text-mocha uppercase">Menyiapkan Ruang…</p>
      </div>
    </div>
  );
}
