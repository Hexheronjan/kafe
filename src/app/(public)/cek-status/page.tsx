"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock, Search, Sparkles, Upload } from "lucide-react";
import {
  useDemoStore,
  type DemoOrder,
  type DemoReservation,
  type OrderStatus,
} from "@/lib/demo-store";
import { TextReveal } from "@/components/motion";
import { cn, rupiah } from "@/lib/utils";

const ORDER_STEPS: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "READY", "COMPLETED"];

function orderStatusLabel(status: OrderStatus, orderType: "DINE_IN" | "TAKE_AWAY") {
  switch (status) {
    case "PENDING":
      return "Menunggu konfirmasi";
    case "CONFIRMED":
      return "Dikonfirmasi";
    case "PROCESSING":
      return "Sedang diproses";
    case "READY":
      return orderType === "DINE_IN" ? "Siap disajikan" : "Siap diambil";
    case "COMPLETED":
      return "Selesai";
    case "CANCELLED":
      return "Dibatalkan";
  }
}

function paymentStatusLabel(s: DemoOrder["paymentStatus"]) {
  switch (s) {
    case "UNPAID":
      return "Belum dibayar";
    case "PENDING_VERIFICATION":
      return "Menunggu verifikasi";
    case "PAID":
      return "Lunas";
    case "REJECTED":
      return "Bukti ditolak";
  }
}

function reservationStatusLabel(s: DemoReservation["status"]) {
  switch (s) {
    case "PENDING":
      return "Menunggu konfirmasi";
    case "CONFIRMED":
      return "Dikonfirmasi";
    case "REJECTED":
      return "Ditolak";
    case "COMPLETED":
      return "Selesai";
    case "CANCELLED":
      return "Dibatalkan";
  }
}

function CekStatusContent() {
  const searchParams = useSearchParams();
  const { orders, reservations, uploadOrderProof } = useDemoStore();

  const [code, setCode] = useState(searchParams.get("kode") ?? "");
  const [phone, setPhone] = useState(searchParams.get("wa") ?? "");
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<DemoOrder | null>(null);
  const [foundRes, setFoundRes] = useState<DemoReservation | null>(null);

  const runLookup = (txCode: string, waPhone: string) => {
    const cleanCode = txCode.trim().toUpperCase();
    const cleanPhone = waPhone.replace(/\D/g, "");
    setSearched(true);

    const o = orders.find(
      (item) =>
        item.orderNumber.toUpperCase() === cleanCode &&
        item.customerPhone.replace(/\D/g, "") === cleanPhone,
    );
    if (o) {
      setFoundOrder(o);
      setFoundRes(null);
      return;
    }

    const r = reservations.find(
      (item) =>
        item.reservationNumber.toUpperCase() === cleanCode &&
        item.customerPhone.replace(/\D/g, "") === cleanPhone,
    );
    if (r) {
      setFoundRes(r);
      setFoundOrder(null);
      return;
    }

    setFoundOrder(null);
    setFoundRes(null);
  };

  useEffect(() => {
    const k = searchParams.get("kode");
    const w = searchParams.get("wa");
    if (k && w) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      runLookup(k, w);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="section pt-4">
      <div className="container-x mx-auto max-w-3xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runLookup(code, phone);
          }}
          className="rounded-3xl border border-espresso/10 bg-white/85 p-7 shadow-md md:p-9"
        >
          <p className="eyebrow">Verifikasi Nomor Transaksi & WhatsApp</p>
          <h2 className="font-display mt-2 text-2xl md:text-3xl">Masukkan Data Transaksi</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cs-code" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                Nomor Pesanan / Reservasi *
              </label>
              <input
                id="cs-code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PRJ-20261109-0041 atau RSV-..."
                className="field tabular uppercase"
              />
            </div>
            <div>
              <label htmlFor="cs-phone" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                Nomor WhatsApp Saat Memesan *
              </label>
              <input
                id="cs-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081298765432"
                className="field tabular"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-mocha">
              <span>Coba contoh cepat:</span>
              <button
                type="button"
                onClick={() => {
                  setCode("PRJ-20261109-0041");
                  setPhone("081298765432");
                  runLookup("PRJ-20261109-0041", "081298765432");
                }}
                className="rounded-full border border-espresso/15 bg-latte/65 px-3 py-1.5 font-semibold text-espresso hover:bg-latte"
              >
                Pesanan #0041
              </button>
              <button
                type="button"
                onClick={() => {
                  setCode("RSV-20261109-0007");
                  setPhone("081234567890");
                  runLookup("RSV-20261109-0007", "081234567890");
                }}
                className="rounded-full border border-espresso/15 bg-latte/65 px-3 py-1.5 font-semibold text-espresso hover:bg-latte"
              >
                Reservasi #0007
              </button>
            </div>

            <button type="submit" className="btn btn-primary">
              <Search size={15} /> Cek Status
            </button>
          </div>
        </form>

        {searched && !foundOrder && !foundRes && (
          <div
            role="status"
            className="mt-8 flex items-start gap-3 rounded-3xl border border-espresso/10 bg-white/80 p-6 text-sm text-mocha shadow-sm"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-brand-ink" />
            <div>
              <p className="font-semibold text-espresso">Data transaksi tidak ditemukan atau kombinasi tidak sesuai.</p>
              <p className="mt-1">
                Pastikan nomor transaksi (contoh: <code>PRJ-YYYYMMDD-NNNN</code> atau <code>RSV-YYYYMMDD-NNNN</code>) dan nomor WhatsApp yang dimasukkan sama persis dengan saat pemesanan.
              </p>
            </div>
          </div>
        )}

        {foundOrder && (
          <div className="mt-8 rounded-3xl border border-espresso/10 bg-white/85 p-7 shadow-md md:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-5">
              <div>
                <p className="eyebrow">Pesanan Online · {foundOrder.orderType === "DINE_IN" ? "Dine In" : "Take Away"}</p>
                <h3 className="tabular font-display mt-1 text-3xl">{foundOrder.orderNumber}</h3>
              </div>
              <span
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors duration-500",
                  foundOrder.status === "COMPLETED" || foundOrder.status === "READY"
                    ? "bg-[#dce8d6] text-[#2d4a22]"
                    : foundOrder.status === "CANCELLED"
                      ? "bg-[#f4d8d6] text-[#7f1d1d]"
                      : "bg-[#e8dcc2] text-[#6e4f1d]",
                )}
              >
                {orderStatusLabel(foundOrder.status, foundOrder.orderType)}
              </span>
            </div>

            {foundOrder.status !== "CANCELLED" && (
              <div className="my-6 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {ORDER_STEPS.map((step, idx) => {
                  const currentIdx = ORDER_STEPS.indexOf(foundOrder.status);
                  const done = idx <= currentIdx;
                  return (
                    <div
                      key={step}
                      className={cn(
                        "rounded-2xl border p-3 text-xs transition-colors",
                        done
                          ? "border-espresso bg-espresso text-cream"
                          : "border-[var(--line)] bg-cream/60 text-mocha",
                      )}
                    >
                      <span className="block text-[10px] opacity-65">0{idx + 1}</span>
                      <span className="mt-1 block font-semibold">
                        {orderStatusLabel(step, foundOrder.orderType)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <dl className="grid gap-4 border-y border-[var(--line)] py-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-mocha uppercase">Pelanggan</dt>
                <dd className="mt-0.5 font-semibold">{foundOrder.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-mocha uppercase">Metode Pembayaran</dt>
                <dd className="mt-0.5 font-semibold">
                  {foundOrder.paymentMethod === "BANK_TRANSFER" ? "Transfer Bank" : "Bayar di Kasir"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-mocha uppercase">Status Pembayaran</dt>
                <dd className="mt-0.5 font-semibold text-brand-ink">
                  {paymentStatusLabel(foundOrder.paymentStatus)}
                </dd>
              </div>
            </dl>

            {foundOrder.paymentStatus === "REJECTED" && (
              <div className="mt-5 rounded-2xl border border-[#b3261e]/40 bg-[#f9e6e4] p-4 text-sm text-[#7f1d1d]">
                <p className="font-semibold">Bukti transfer ditolak oleh admin:</p>
                <p className="mt-1">{foundOrder.rejectReason ?? "Nominal atau foto bukti tidak terbaca jelas."}</p>
                <button
                  type="button"
                  onClick={() => {
                    uploadOrderProof(foundOrder.orderNumber);
                    setFoundOrder({
                      ...foundOrder,
                      paymentStatus: "PENDING_VERIFICATION",
                      proofUploaded: true,
                    });
                  }}
                  className="btn btn-primary mt-3 !min-h-[40px] !px-4"
                >
                  <Upload size={14} /> Unggah Ulang Bukti Transfer
                </button>
              </div>
            )}

            <ul className="mt-5 space-y-2 text-sm">
              {foundOrder.items.map((item) => (
                <li key={item.productId} className="flex justify-between">
                  <span>
                    {item.qty}× {item.name}
                  </span>
                  <span className="tabular font-semibold">{rupiah(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-baseline justify-between border-t border-[var(--line)] pt-4">
              <span className="text-sm font-semibold">Total</span>
              <span className="tabular font-display text-2xl">{rupiah(foundOrder.total)}</span>
            </div>
          </div>
        )}

        {foundRes && (
          <div className="mt-8 rounded-3xl border border-espresso/10 bg-white/85 p-7 shadow-md md:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-5">
              <div>
                <p className="eyebrow">Reservasi Meja · Ponorogo</p>
                <h3 className="tabular font-display mt-1 text-3xl">{foundRes.reservationNumber}</h3>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase",
                  foundRes.status === "CONFIRMED" || foundRes.status === "COMPLETED"
                    ? "bg-[#dce8d6] text-[#2d4a22]"
                    : foundRes.status === "REJECTED" || foundRes.status === "CANCELLED"
                      ? "bg-[#f4d8d6] text-[#7f1d1d]"
                      : "bg-[#e8dcc2] text-[#6e4f1d]",
                )}
              >
                {foundRes.status === "CONFIRMED" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {reservationStatusLabel(foundRes.status)}
              </span>
            </div>

            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-mocha uppercase">Nama Tamu</dt>
                <dd className="mt-0.5 font-semibold">{foundRes.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-mocha uppercase">Tanggal & Jam</dt>
                <dd className="tabular mt-0.5 font-semibold">
                  {foundRes.visitDate} · {foundRes.visitTime} WIB
                </dd>
              </div>
              <div>
                <dt className="text-xs text-mocha uppercase">Jumlah Tamu</dt>
                <dd className="tabular mt-0.5 font-semibold">{foundRes.guestCount} orang</dd>
              </div>
            </dl>

            {foundRes.adminNote && (
              <div className="mt-5 rounded-2xl border-l-4 border-brand bg-cream p-4 text-sm">
                <p className="text-xs font-semibold tracking-wider text-mocha uppercase">Catatan dari Kafe</p>
                <p className="mt-1 text-espresso">{foundRes.adminNote}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function CekStatusPage() {
  return (
    <div className="pt-24">
      <header className="py-12 md:py-16">
        <div className="container-x">
          <p className="eyebrow">
            <Sparkles size={13} /> Pelacakan Real-Time · Pesanan & Reservasi
          </p>
          <TextReveal text="Cek Status Transaksi Anda" className="font-display t-h2 mt-2" />
        </div>
      </header>

      <Suspense
        fallback={
          <div className="container-x py-16">
            <div className="skeleton mx-auto h-64 max-w-3xl" />
          </div>
        }
      >
        <CekStatusContent />
      </Suspense>
    </div>
  );
}
