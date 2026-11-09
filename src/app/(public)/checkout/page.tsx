"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  Copy,
  CreditCard,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Upload,
} from "lucide-react";
import { useDemoStore, type DemoOrder } from "@/lib/demo-store";
import { useCart } from "@/components/public/cart";
import { ProductImage } from "@/components/public/product-image";
import { TextReveal } from "@/components/motion";
import { rupiah } from "@/lib/utils";

export default function CheckoutPage() {
  const { siteConfig, menuItems, orders, addOrder, uploadOrderProof } = useDemoStore();
  const { lines, setQty, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<"DINE_IN" | "TAKE_AWAY">("DINE_IN");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BANK_TRANSFER">("BANK_TRANSFER");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<DemoOrder | null>(null);
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const resolvedItems = lines
    .map((l) => {
      const p = menuItems.find((m) => m.id === l.id);
      if (!p || !p.available) return null;
      return { product: p, qty: l.qty, subtotal: p.price * l.qty };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const total = resolvedItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (resolvedItems.length === 0) {
      setError("Keranjang Anda kosong atau produk yang dipilih sedang habis.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Mohon isi nama lengkap minimal 2 karakter.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 9 || cleanPhone.length > 15) {
      setError("Nomor WhatsApp tidak valid (gunakan 9–15 digit angka).");
      return;
    }

    const todayCompact = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const seq = String(orders.length + 42).padStart(4, "0");
    const orderNumber = `PRJ-${todayCompact}-${seq}`;

    const newOrder: DemoOrder = {
      orderNumber,
      customerName: name.trim(),
      customerPhone: cleanPhone,
      orderType,
      status: "PENDING",
      paymentMethod,
      paymentStatus: "UNPAID",
      note: note.trim() || undefined,
      items: resolvedItems.map((r) => ({
        productId: r.product.id,
        name: r.product.name,
        price: r.product.price,
        qty: r.qty,
      })),
      total,
      createdAt: new Date().toLocaleString("id-ID", { timeZone: siteConfig.timezone }) + " WIB",
    };

    addOrder(newOrder);
    clear();
    setCreatedOrder(newOrder);
  };

  const handleUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !createdOrder) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format bukti transfer wajib JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5 MB.");
      return;
    }
    setError(null);
    setProofFile(file.name);
    uploadOrderProof(createdOrder.orderNumber);
    setCreatedOrder({
      ...createdOrder,
      proofUploaded: true,
      paymentStatus: "PENDING_VERIFICATION",
    });
  };

  if (!siteConfig.features.onlineOrderEnabled) {
    return (
      <div className="container-x pt-40 pb-24 text-center">
        <p className="eyebrow">Modul Dinonaktifkan</p>
        <h1 className="font-display t-h2 mt-3">Pemesanan Online Sedang Ditutup</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-mocha">
          Silakan memesan langsung di kasir saat berkunjung ke kafe kami di Ponorogo.
        </p>
        <Link href="/menu" className="btn btn-primary mt-8">
          Kembali ke Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <header className="py-12 md:py-16">
        <div className="container-x">
          <p className="eyebrow">
            <Sparkles size={13} /> Pemesanan Online · {siteConfig.name} Ponorogo
          </p>
          <TextReveal
            text={createdOrder ? "Konfirmasi Pesanan Anda" : "Checkout Pesanan"}
            className="font-display t-h2 mt-2"
          />
        </div>
      </header>

      <section className="section pt-4">
        <div className="container-x">
          {createdOrder ? (
            <div className="mx-auto max-w-3xl rounded-3xl border border-espresso/10 bg-white/85 p-7 shadow-lg md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e8dcc2] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#6e4f1d] uppercase">
                  <CheckCircle2 size={14} /> Status Pesanan: Menunggu Konfirmasi
                </span>
                <span className="rounded-full border border-[var(--line)] bg-cream px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase">
                  Pembayaran:{" "}
                  {createdOrder.paymentStatus === "PENDING_VERIFICATION"
                    ? "Menunggu Verifikasi Admin"
                    : "Belum Dibayar"}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-cream p-5">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-mocha uppercase">Nomor Pesanan</p>
                  <p className="tabular font-display mt-1 text-3xl">{createdOrder.orderNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(createdOrder.orderNumber);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  }}
                  className="btn btn-outline !min-h-[42px] !px-4"
                >
                  <Copy size={14} /> {copied ? "Tersalin" : "Salin Nomor"}
                </button>
              </div>

              <div className="mt-6 border-y border-[var(--line)] py-5">
                <p className="text-xs font-semibold tracking-wider text-mocha uppercase">
                  Ringkasan Item ({createdOrder.orderType === "DINE_IN" ? "Dine In" : "Take Away"})
                </p>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {createdOrder.items.map((item) => (
                    <li key={item.productId} className="flex justify-between">
                      <span>
                        {item.qty}× {item.name}
                      </span>
                      <span className="tabular font-semibold">{rupiah(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-baseline justify-between border-t border-[var(--line)] pt-3">
                  <span className="text-sm font-semibold">Total Pembayaran</span>
                  <span className="tabular font-display text-2xl text-brand-ink">{rupiah(createdOrder.total)}</span>
                </div>
              </div>

              {createdOrder.paymentMethod === "BANK_TRANSFER" ? (
                <div className="mt-6 rounded-2xl border border-[var(--line)] bg-cream p-6">
                  <p className="eyebrow">Instruksi Transfer Bank</p>
                  <p className="mt-2 text-sm text-mocha">
                    Silakan transfer tepat sebesar <strong>{rupiah(createdOrder.total)}</strong> ke rekening resmi berikut:
                  </p>
                  <div className="mt-4 border-l-4 border-brand pl-4 text-sm">
                    <p className="font-semibold text-espresso">Bank {siteConfig.payment.bank}</p>
                    <p className="tabular font-display text-2xl">{siteConfig.payment.number}</p>
                    <p className="text-xs text-mocha">a.n. {siteConfig.payment.holder}</p>
                  </div>

                  <div className="mt-5 border-t border-[var(--line)] pt-5">
                    <label className="block text-xs font-semibold tracking-wider text-mocha uppercase">
                      Unggah Bukti Transfer (JPG, PNG, WebP · Maks. 5 MB)
                    </label>
                    {proofFile ? (
                      <div className="mt-3 flex items-center justify-between rounded-xl border border-sage/50 bg-[#eef3ea] px-4 py-3 text-xs text-[#3b4a32]">
                        <span>
                          ✓ File <strong>{proofFile}</strong> terunggah. Status pembayaran kini{" "}
                          <strong>Menunggu verifikasi</strong> oleh admin.
                        </span>
                      </div>
                    ) : (
                      <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-espresso/35 bg-latte/40 px-4 py-5 text-xs font-semibold tracking-wider text-espresso uppercase transition-colors hover:bg-latte">
                        <Upload size={16} />
                        Pilih File Bukti Pembayaran
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleUploadProof}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-[var(--line)] bg-cream p-5 text-sm text-mocha">
                  <p className="font-semibold text-espresso">Metode: Bayar di Kasir</p>
                  <p className="mt-1">
                    Silakan tunjukkan nomor pesanan <strong>{createdOrder.orderNumber}</strong> kepada kasir kami untuk menyelesaikan pembayaran.
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                    `Halo ${siteConfig.name} Ponorogo, saya ingin mengonfirmasi pesanan:\nNomor: ${createdOrder.orderNumber}\nNama: ${createdOrder.customerName}\nTipe: ${
                      createdOrder.orderType === "DINE_IN" ? "Dine In" : "Take Away"
                    }\nTotal: ${rupiah(createdOrder.total)}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-brand"
                >
                  <MessageCircle size={16} /> Kirim Ringkasan ke WhatsApp
                </a>
                <Link
                  href={`/cek-status?kode=${createdOrder.orderNumber}&wa=${createdOrder.customerPhone}`}
                  className="btn btn-outline"
                >
                  Pantau Status Pesanan
                </Link>
              </div>
            </div>
          ) : resolvedItems.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-3xl border border-espresso/10 bg-white/80 py-20 text-center shadow-sm">
              <ShoppingBag size={36} strokeWidth={1.25} className="mx-auto text-mocha" />
              <h2 className="font-display mt-4 text-3xl italic text-mocha">Keranjang Anda Kosong</h2>
              <p className="mt-2 text-sm text-mocha">Tambahkan menu favorit Anda terlebih dahulu sebelum checkout.</p>
              <Link href="/menu" className="btn btn-primary mt-6">
                Jelajahi Menu
              </Link>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-12">
              <form
                onSubmit={handleCheckout}
                noValidate
                className="rounded-3xl border border-espresso/10 bg-white/85 p-7 shadow-md md:p-10 lg:col-span-7"
              >
                <p className="eyebrow">Langkah 1 · Data Pemesan</p>
                <h2 className="font-display mt-2 text-3xl">Detail Pesanan</h2>

                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-2xl border border-[#b3261e]/40 bg-[#f9e6e4] px-4 py-3 text-sm text-[#7f1d1d]"
                  >
                    {error}
                  </div>
                )}

                <div className="mt-6 space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="co-name" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                        Nama Lengkap *
                      </label>
                      <input
                        id="co-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Raka Pradipta"
                        className="field"
                      />
                    </div>
                    <div>
                      <label htmlFor="co-phone" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                        Nomor WhatsApp *
                      </label>
                      <input
                        id="co-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 081298765432"
                        className="field tabular"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-wider text-mocha uppercase">Jenis Pesanan *</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderType("DINE_IN")}
                        className={`min-h-[56px] rounded-2xl border px-4 text-left text-sm transition-all ${
                          orderType === "DINE_IN"
                            ? "border-espresso bg-espresso text-cream shadow-sm"
                            : "border-espresso/15 bg-latte/40 text-espresso hover:bg-latte"
                        }`}
                      >
                        <span className="block font-semibold">Dine In</span>
                        <span className="text-xs opacity-75">Disajikan di meja kafe</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType("TAKE_AWAY")}
                        className={`min-h-[56px] rounded-2xl border px-4 text-left text-sm transition-all ${
                          orderType === "TAKE_AWAY"
                            ? "border-espresso bg-espresso text-cream shadow-sm"
                            : "border-espresso/15 bg-latte/40 text-espresso hover:bg-latte"
                        }`}
                      >
                        <span className="block font-semibold">Take Away</span>
                        <span className="text-xs opacity-75">Dikemas untuk dibawa pulang</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-wider text-mocha uppercase">Metode Pembayaran *</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("BANK_TRANSFER")}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-sm transition-all ${
                          paymentMethod === "BANK_TRANSFER"
                            ? "border-espresso bg-espresso text-cream shadow-sm"
                            : "border-espresso/15 bg-latte/40 text-espresso hover:bg-latte"
                        }`}
                      >
                        <CreditCard size={18} />
                        <div>
                          <span className="block font-semibold">Transfer Bank</span>
                          <span className="text-xs opacity-75">{siteConfig.payment.bank} · Verifikasi bukti</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("CASH")}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left text-sm transition-all ${
                          paymentMethod === "CASH"
                            ? "border-espresso bg-espresso text-cream shadow-sm"
                            : "border-espresso/15 bg-latte/40 text-espresso hover:bg-latte"
                        }`}
                      >
                        <Banknote size={18} />
                        <div>
                          <span className="block font-semibold">Bayar di Kasir</span>
                          <span className="text-xs opacity-75">Tunai / QRIS saat di kasir</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="co-note" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                      Catatan Pesanan (Opsional)
                    </label>
                    <textarea
                      id="co-note"
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Contoh: Less ice, gula pisah, atau nomor meja jika sudah duduk."
                      className="field resize-none"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-8 w-full">
                  Buat Pesanan Sekarang · {rupiah(total)}
                </button>
              </form>

              <aside className="lg:col-span-5">
                <div className="rounded-3xl border border-espresso/10 bg-white/80 p-7 shadow-sm">
                  <p className="eyebrow">Langkah 2 · Ringkasan Harga</p>
                  <h2 className="font-display mt-2 text-2xl">Item di Keranjang</h2>

                  <ul className="mt-5 divide-y divide-[var(--line)]">
                    {resolvedItems.map(({ product, qty, subtotal }) => (
                      <li key={product.id} className="flex gap-4 py-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[var(--line)]">
                          <ProductImage product={product} sizes="64px" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-2">
                            <p className="font-display text-lg leading-snug">{product.name}</p>
                            <p className="tabular text-sm font-semibold">{rupiah(subtotal)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="tabular text-xs text-mocha">{rupiah(product.price)} / item</span>
                            <div className="flex items-center rounded-full border border-[var(--line)] bg-cream px-1">
                              <button
                                type="button"
                                aria-label="Kurangi"
                                onClick={() => setQty(product.id, qty - 1)}
                                className="grid h-7 w-7 place-items-center rounded-full hover:bg-latte"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="tabular w-7 text-center text-xs font-semibold">{qty}</span>
                              <button
                                type="button"
                                aria-label="Tambah"
                                onClick={() => setQty(product.id, qty + 1)}
                                className="grid h-7 w-7 place-items-center rounded-full hover:bg-latte"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4 text-sm">
                    <div className="flex justify-between text-mocha">
                      <span>Subtotal</span>
                      <span className="tabular">{rupiah(total)}</span>
                    </div>
                    <div className="flex items-baseline justify-between pt-2">
                      <span className="font-semibold">Total</span>
                      <span className="tabular font-display text-3xl text-brand-ink">{rupiah(total)}</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
