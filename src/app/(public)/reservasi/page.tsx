"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, Clock, Copy, MessageCircle, Sparkles, Users } from "lucide-react";
import { hours } from "@/config/site";
import { useDemoStore, type DemoReservation } from "@/lib/demo-store";
import { Reveal, TextReveal } from "@/components/motion";

export default function ReservasiPage() {
  const { siteConfig, addReservation, reservations } = useDemoStore();
  const todayStr = new Date().toISOString().slice(0, 10);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [visitDate, setVisitDate] = useState(todayStr);
  const [visitTime, setVisitTime] = useState("16:00");
  const [guestCount, setGuestCount] = useState(2);
  const [note, setNote] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<DemoReservation | null>(null);
  const [copied, setCopied] = useState(false);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (honeypot) return;

    if (name.trim().length < 2) {
      setError("Mohon isi nama lengkap minimal 2 karakter.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 9 || cleanPhone.length > 15) {
      setError("Nomor WhatsApp tidak valid (gunakan 9–15 digit angka).");
      return;
    }
    if (!visitDate || visitDate < todayStr) {
      setError("Tanggal kunjungan tidak boleh di masa lalu.");
      return;
    }

    const dayIdx = new Date(`${visitDate}T12:00:00`).getDay();
    const dayHour = hours[dayIdx];
    if (!dayHour.open || !dayHour.close) {
      setError(`Mohon maaf, kafe libur pada hari ${dayHour.day}.`);
      return;
    }
    if (visitTime < dayHour.open || visitTime >= dayHour.close) {
      setError(
        `Jam kunjungan hari ${dayHour.day} harus berada dalam jam operasional (${dayHour.open} – ${dayHour.close} WIB).`,
      );
      return;
    }
    if (guestCount < 1 || guestCount > 12) {
      setError("Jumlah tamu maksimal 12 orang per reservasi online.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const dateCompact = visitDate.replace(/-/g, "");
      const seq = String(reservations.length + 7).padStart(4, "0");
      const reservationNumber = `RSV-${dateCompact}-${seq}`;
      const newRes: DemoReservation = {
        reservationNumber,
        customerName: name.trim(),
        customerPhone: cleanPhone,
        visitDate,
        visitTime,
        guestCount,
        note: note.trim() || undefined,
        status: "PENDING",
        createdAt: new Date().toLocaleString("id-ID", { timeZone: siteConfig.timezone }) + " WIB",
      };
      addReservation(newRes);
      setCreated(newRes);
      setSubmitting(false);
    }, 450);
  };

  const copyCode = () => {
    if (!created) return;
    navigator.clipboard?.writeText(created.reservationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!siteConfig.features.reservationEnabled) {
    return (
      <div className="container-x pt-40 pb-24 text-center">
        <p className="eyebrow">Modul Dinonaktifkan</p>
        <h1 className="font-display t-h2 mt-3">Reservasi Online Sedang Ditutup</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-mocha">
          Anda tetap dapat datang langsung (walk-in) ke Ponorogo atau menghubungi kami melalui WhatsApp.
        </p>
        <Link href="/menu" className="btn btn-primary mt-8">
          Lihat Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <header className="py-12 md:py-16">
        <div className="container-x grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              <Sparkles size={13} /> Pesan Meja · {siteConfig.name} Ponorogo
            </p>
            <TextReveal text="Reservasi Ruang & Meja Anda" className="font-display t-h2 mt-3" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4">
            <p className="text-sm leading-relaxed text-mocha md:text-base">
              Setiap permintaan reservasi ditinjau oleh tim kami sesuai ketersediaan meja pada jam yang Anda pilih.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="section pt-6">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          {/* Kolom Informasi */}
          <Reveal className="lg:col-span-4">
            <div className="rounded-3xl border border-espresso/10 bg-white/80 p-7 shadow-sm">
              <p className="eyebrow">Ketentuan Reservasi</p>
              <h2 className="font-display mt-2 text-2xl">Sebelum Anda Memesan</h2>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-mocha">
                <li className="flex gap-3">
                  <Clock size={17} className="mt-0.5 shrink-0 text-brand-ink" />
                  <span>
                    Meja ditahan hingga <strong>15 menit</strong> dari jadwal kunjungan yang disepakati.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Users size={17} className="mt-0.5 shrink-0 text-brand-ink" />
                  <span>
                    Kapasitas reservasi online untuk <strong>1 sampai 12 tamu</strong>. Untuk acara privat di Ponorogo, hubungi WhatsApp kami.
                  </span>
                </li>
                <li className="flex gap-3">
                  <Calendar size={17} className="mt-0.5 shrink-0 text-brand-ink" />
                  <span>
                    Status awal adalah <strong>Menunggu konfirmasi</strong>. Anda dapat memantau statusnya kapan saja di halaman Cek Status.
                  </span>
                </li>
              </ul>

              <div className="mt-7 border-t border-[var(--line)] pt-5 text-xs text-mocha">
                <p className="font-semibold tracking-wider text-espresso uppercase">Sudah Punya Nomor Reservasi?</p>
                <Link href="/cek-status" className="mt-2 inline-block font-semibold text-brand-ink underline">
                  Cek Status Reservasi di Sini →
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Kolom Formulir / Konfirmasi */}
          <div className="lg:col-span-8">
            {created ? (
              <div className="rounded-3xl border border-espresso/10 bg-white/85 p-8 shadow-md md:p-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#e8dcc2] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#6e4f1d] uppercase">
                  <CheckCircle2 size={14} /> Status: Menunggu Konfirmasi
                </div>

                <h2 className="font-display mt-4 text-3xl md:text-4xl">Permintaan Reservasi Diterima</h2>
                <p className="mt-2 text-sm leading-relaxed text-mocha">
                  Simpan nomor reservasi dan gunakan bersama nomor WhatsApp Anda untuk mengecek status konfirmasi meja.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-cream p-5">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-mocha uppercase">
                      Nomor Reservasi
                    </p>
                    <p className="tabular font-display mt-1 text-3xl text-espresso">{created.reservationNumber}</p>
                  </div>
                  <button type="button" onClick={copyCode} className="btn btn-outline !min-h-[42px] !px-4">
                    <Copy size={14} /> {copied ? "Tersalin" : "Salin Nomor"}
                  </button>
                </div>

                <dl className="mt-6 grid gap-4 border-y border-[var(--line)] py-5 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-mocha uppercase">Nama Tamu</dt>
                    <dd className="mt-0.5 font-semibold">{created.customerName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-mocha uppercase">Nomor WhatsApp</dt>
                    <dd className="tabular mt-0.5 font-semibold">{created.customerPhone}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-mocha uppercase">Jadwal Kunjungan</dt>
                    <dd className="tabular mt-0.5 font-semibold">
                      {created.visitDate} · {created.visitTime} WIB
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-mocha uppercase">Jumlah Tamu</dt>
                    <dd className="tabular mt-0.5 font-semibold">{created.guestCount} orang</dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                      `Halo ${siteConfig.name} Ponorogo, saya telah mengajukan reservasi:\nNomor: ${created.reservationNumber}\nNama: ${created.customerName}\nTanggal: ${created.visitDate} pukul ${created.visitTime} WIB\nJumlah Tamu: ${created.guestCount} orang\nCatatan: ${created.note ?? "-"}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-brand"
                  >
                    <MessageCircle size={16} /> Kirim ke WhatsApp
                  </a>
                  <Link
                    href={`/cek-status?kode=${created.reservationNumber}&wa=${created.customerPhone}`}
                    className="btn btn-outline"
                  >
                    Cek Status Reservasi
                  </Link>
                  <button type="button" onClick={() => setCreated(null)} className="btn btn-outline">
                    Buat Reservasi Lain
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={validateAndSubmit}
                noValidate
                className="rounded-3xl border border-espresso/10 bg-white/85 p-7 shadow-md md:p-10"
              >
                <p className="eyebrow">Formulir Reservasi</p>
                <h2 className="font-display mt-2 text-3xl">Data Kunjungan</h2>

                <input
                  type="text"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                />

                {error && (
                  <div
                    role="alert"
                    className="mt-6 rounded-2xl border border-[#b3261e]/40 bg-[#f9e6e4] px-4 py-3 text-sm text-[#7f1d1d]"
                  >
                    {error}
                  </div>
                )}

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="res-name" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                      Nama Pelanggan *
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Clarissa Wijaya"
                      className="field"
                    />
                  </div>

                  <div>
                    <label htmlFor="res-phone" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                      Nomor WhatsApp *
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 085151951806"
                      className="field tabular"
                    />
                  </div>

                  <div>
                    <label htmlFor="res-date" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                      Tanggal Kunjungan *
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      required
                      min={todayStr}
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="field tabular"
                    />
                  </div>

                  <div>
                    <label htmlFor="res-time" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                      Jam Kunjungan (WIB) *
                    </label>
                    <input
                      id="res-time"
                      type="time"
                      required
                      min="08:00"
                      max="22:00"
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="field tabular"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="res-guests" className="block text-xs font-semibold tracking-wider text-mocha uppercase">
                      Jumlah Tamu (1 – 12 Orang) *
                    </label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setGuestCount(n)}
                          className={`min-h-[44px] min-w-[48px] rounded-full border px-4 text-sm font-semibold transition-all ${
                            guestCount === n
                              ? "border-espresso bg-espresso text-cream shadow-xs"
                              : "border-espresso/15 bg-latte/45 text-espresso hover:bg-latte"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="res-note" className="mb-1.5 block text-xs font-semibold tracking-wider text-mocha uppercase">
                      Catatan Tambahan (Opsional)
                    </label>
                    <textarea
                      id="res-note"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Contoh: Area indoor lantai 2 non-smoking, dekat stopkontak, atau kursi bayi."
                      className="field resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
                  <p className="text-xs text-mocha">
                    Dengan mengirim formulir ini, permintaan Anda masuk ke antrean konfirmasi admin.
                  </p>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? "Memproses…" : "Kirim Permintaan Reservasi"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
