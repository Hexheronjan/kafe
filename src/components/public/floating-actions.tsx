"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Palette, RotateCcw, SlidersHorizontal, X, ShieldCheck } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { EASE } from "@/lib/utils";

const PRESET_COLORS = [
  { name: "Caramel (Default)", hex: "#B8733A" },
  { name: "Forest Sage", hex: "#4D6B53" },
  { name: "Terracotta Clay", hex: "#A84A32" },
  { name: "Burgundy Roast", hex: "#7C2D38" },
  { name: "Midnight Slate", hex: "#354F69" },
];

export function FloatingActions() {
  const { siteConfig, updateSiteConfig, resetSiteConfig, adminSession } = useDemoStore();
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const waHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.waMessage)}`;

  return (
    <>
      {/* Tombol Kustomisasi Client (Live White-Label Demo) di kiri bawah */}
      <div className="fixed bottom-20 left-4 z-[92] md:bottom-6 md:left-6">
        <button
          onClick={() => setCustomizerOpen(true)}
          aria-label="Buka panel kustomisasi tema klien"
          className="flex items-center gap-2 rounded-full border border-espresso/15 bg-cream/95 px-4 py-3 text-xs font-semibold tracking-wider text-espresso uppercase shadow-xl backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-espresso hover:text-cream"
        >
          <Palette size={15} strokeWidth={1.7} className="text-brand" />
          <span className="hidden sm:inline">Kustomisasi Client</span>
        </button>
      </div>

      {/* Tombol WhatsApp Mengambang di kanan bawah */}
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp Kafe"
        className="fixed right-4 bottom-20 z-[92] flex h-12 items-center gap-2.5 rounded-full bg-espresso px-5 text-xs font-semibold tracking-wider text-cream uppercase shadow-xl transition-all hover:-translate-y-0.5 hover:bg-brand-ink md:right-6 md:bottom-6"
      >
        <span className="relative h-2 w-2 rounded-full bg-[#5fbf6a] pulse-dot" />
        <MessageCircle size={17} strokeWidth={1.6} />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      {/* Sticky Bottom Bar untuk Mobile */}
      <div className="fixed inset-x-0 bottom-0 z-[90] grid grid-cols-2 gap-2 border-t border-[var(--line)] bg-cream/95 p-2.5 backdrop-blur-xl md:hidden">
        <Link href="/menu" className="btn btn-primary !min-h-[44px] !px-3 !text-[11px]">
          {siteConfig.hero.ctaMenu}
        </Link>
        {siteConfig.features.reservationEnabled ? (
          <Link href="/reservasi" className="btn btn-outline !min-h-[44px] !px-3 !text-[11px]">
            {siteConfig.hero.ctaReserve}
          </Link>
        ) : (
          <Link href="/cek-status" className="btn btn-outline !min-h-[44px] !px-3 !text-[11px]">
            Cek Status
          </Link>
        )}
      </div>

      {/* Panel Kustomisasi Client (Simulasi White-Label untuk Pemilik Kafe) */}
      <AnimatePresence>
        {customizerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[115] bg-espresso/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizerOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-label="Kustomisasi Identitas & Tema Kafe"
              className="fixed bottom-0 left-0 z-[120] w-full max-w-md rounded-t-3xl border border-espresso/15 bg-cream p-6 shadow-2xl md:bottom-6 md:left-6 md:rounded-3xl"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
                <div>
                  <p className="eyebrow flex items-center gap-1.5">
                    <SlidersHorizontal size={12} /> Demo Produk Komersial
                  </p>
                  <h3 className="font-display text-2xl">Sesuaikan Identitas Kafe</h3>
                </div>
                <button
                  onClick={() => setCustomizerOpen(false)}
                  aria-label="Tutup panel"
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-latte"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-mocha uppercase">
                    Nama Kafe Client
                  </label>
                  <input
                    type="text"
                    value={siteConfig.name}
                    onChange={(e) => updateSiteConfig({ name: e.target.value || "Prajalinks" })}
                    className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3.5 py-2.5 text-sm text-espresso focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider text-mocha uppercase">
                    Tagline Brand
                  </label>
                  <input
                    type="text"
                    value={siteConfig.tagline}
                    onChange={(e) => updateSiteConfig({ tagline: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3.5 py-2.5 text-sm text-espresso focus:border-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider text-mocha uppercase">
                    Warna Aksen Utama (CSS Variable)
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => {
                      const active = siteConfig.primaryColor.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updateSiteConfig({ primaryColor: c.hex })}
                          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                            active
                              ? "border-espresso bg-espresso font-semibold text-cream"
                              : "border-[var(--line)] bg-white/70 hover:bg-latte"
                          }`}
                        >
                          <span className="h-3.5 w-3.5 rounded-full border border-white/40" style={{ background: c.hex }} />
                          {c.name.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-wider text-mocha uppercase">Modul Fitur Aktif</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2.5 text-xs">
                      <input
                        type="checkbox"
                        checked={siteConfig.features.onlineOrderEnabled}
                        onChange={(e) =>
                          updateSiteConfig({
                            features: { ...siteConfig.features, onlineOrderEnabled: e.target.checked },
                          })
                        }
                        className="accent-brand"
                      />
                      Pemesanan Online
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2.5 text-xs">
                      <input
                        type="checkbox"
                        checked={siteConfig.features.reservationEnabled}
                        onChange={(e) =>
                          updateSiteConfig({
                            features: { ...siteConfig.features, reservationEnabled: e.target.checked },
                          })
                        }
                        className="accent-brand"
                      />
                      Modul Reservasi
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-[var(--line)] pt-4">
                  <button
                    type="button"
                    onClick={resetSiteConfig}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-mocha hover:text-espresso"
                  >
                    <RotateCcw size={13} /> Reset Default
                  </button>
                  <Link
                    href={adminSession ? "/admin" : "/admin/login"}
                    onClick={() => setCustomizerOpen(false)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-4 py-2.5 text-xs font-semibold tracking-wider text-cream uppercase hover:bg-brand-ink"
                  >
                    <ShieldCheck size={14} /> {adminSession ? "Dashboard Admin" : "Login Admin"}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
