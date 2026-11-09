"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarCheck,
  Coffee,
  MessageCircle,
  Palette,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
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
      {/* Tombol Kustomisasi Client (Hanya tampil mengambang di Desktop md+; di Mobile menyatu di Bottom Dock) */}
      <div className="fixed bottom-6 left-6 z-[92] hidden md:block">
        <button
          onClick={() => setCustomizerOpen(true)}
          aria-label="Buka panel kustomisasi tema klien"
          className="flex items-center gap-2 rounded-full border border-espresso/15 bg-cream/95 px-4 py-3 text-xs font-semibold tracking-wider text-espresso uppercase shadow-xl backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-espresso hover:text-cream"
        >
          <Palette size={15} strokeWidth={1.7} className="text-brand" />
          <span>Kustomisasi Client</span>
        </button>
      </div>

      {/* Tombol WhatsApp Mengambang (Hanya di Desktop md+; di Mobile menyatu di Bottom Dock) */}
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat WhatsApp Kafe"
        className="fixed right-6 bottom-6 z-[92] hidden h-12 items-center gap-2.5 rounded-full bg-espresso px-5 text-xs font-semibold tracking-wider text-cream uppercase shadow-xl transition-all hover:-translate-y-0.5 hover:bg-brand-ink md:flex"
      >
        <span className="relative h-2 w-2 rounded-full bg-[#5fbf6a] pulse-dot" />
        <MessageCircle size={17} strokeWidth={1.6} />
        <span>WhatsApp</span>
      </a>

      {/* Unified Mobile Bottom Dock (Rapi, tidak bertumpuk di layar HP) */}
      <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-espresso/10 bg-cream/95 px-2.5 py-2 shadow-[0_-8px_24px_rgba(28,22,18,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1.5">
          <Link
            href="/menu"
            className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-espresso py-2 text-[10px] font-semibold text-cream"
          >
            <Coffee size={15} />
            <span>Menu</span>
          </Link>

          <Link
            href={siteConfig.features.reservationEnabled ? "/reservasi" : "/cek-status"}
            className="flex flex-col items-center justify-center gap-0.5 rounded-2xl border border-espresso/15 bg-white/80 py-2 text-[10px] font-semibold text-espresso"
          >
            <CalendarCheck size={15} className="text-brand-ink" />
            <span>{siteConfig.features.reservationEnabled ? "Reservasi" : "Status"}</span>
          </Link>

          <button
            type="button"
            onClick={() => setCustomizerOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 rounded-2xl border border-espresso/15 bg-white/80 py-2 text-[10px] font-semibold text-espresso"
          >
            <Palette size={15} className="text-brand" />
            <span>Tema</span>
          </button>

          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#246b3d] py-2 text-[10px] font-semibold text-white"
          >
            <MessageCircle size={15} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Panel Kustomisasi Client (Simulasi White-Label untuk Pemilik Kafe) */}
      <AnimatePresence>
        {customizerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[115] bg-espresso/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizerOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-label="Kustomisasi Identitas & Tema Kafe"
              className="fixed inset-x-0 bottom-0 z-[120] max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-espresso/15 bg-cream p-5 shadow-2xl sm:p-6 md:bottom-6 md:left-6 md:rounded-3xl"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-3.5">
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
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-white/40"
                            style={{ background: c.hex }}
                          />
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

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-4">
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
