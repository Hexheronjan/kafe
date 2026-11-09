import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream px-6 text-center text-espresso">
      <div className="max-w-md">
        <p className="eyebrow">404 · Halaman Tidak Ditemukan</p>
        <h1 className="font-display mt-3 text-5xl">Cangkir Ini Kosong.</h1>
        <p className="mt-3 text-sm leading-relaxed text-mocha">
          Halaman yang Anda cari sudah berpindah atau tidak tersedia. Mari kembali ke beranda atau lihat menu kopi kami.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Beranda
          </Link>
          <Link href="/menu" className="btn btn-outline">
            Lihat Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
