"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream px-6 text-center text-espresso">
      <div className="max-w-md">
        <p className="eyebrow">Terjadi Kendala</p>
        <h1 className="font-display mt-3 text-4xl">Seduhan Sedang Dijeda.</h1>
        <p className="mt-3 text-sm leading-relaxed text-mocha">
          Maaf, terjadi gangguan sementara saat memuat halaman ini. Silakan coba muat ulang.
        </p>
        <button type="button" onClick={reset} className="btn btn-primary mt-7">
          Muat Ulang Halaman
        </button>
      </div>
    </div>
  );
}
