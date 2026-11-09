"use client";

import Link from "next/link";
import { ArrowUpRight, Camera, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { hours, nav } from "@/config/site";
import { useDemoStore } from "@/lib/demo-store";
import { formatPhoneID } from "@/lib/utils";
import { OpenStatus } from "./open-status";

export function Footer() {
  const { siteConfig, adminSession } = useDemoStore();
  const waHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.waMessage)}`;

  return (
    <footer className="bg-espresso pb-24 text-cream md:pb-12">
      <div className="container-x pt-16 pb-14">
        {/* Top modern sculpted CTA card */}
        <div className="flex flex-col justify-between gap-8 rounded-3xl border border-cream/15 bg-gradient-to-br from-white/[0.06] to-transparent p-8 backdrop-blur-sm md:p-12 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow !text-brand">{siteConfig.tagline} · Ponorogo</p>
            <h2 className="font-display mt-3 text-[clamp(2.1rem,4vw,4rem)] leading-[1.02]">
              Mampir untuk secangkir hangat hari ini.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/menu" className="btn btn-brand">
              {siteConfig.hero.ctaMenu}
            </Link>
            {siteConfig.features.reservationEnabled && (
              <Link href="/reservasi" className="btn btn-light">
                {siteConfig.hero.ctaReserve}
              </Link>
            )}
          </div>
        </div>

        {/* 4-column info grid */}
        <div className="grid gap-12 border-b border-cream/15 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-3xl">
              {siteConfig.name}
              <span className="text-brand">.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">{siteConfig.description}</p>
            <div className="mt-6">
              <OpenStatus tone="light" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream/50 uppercase">Navigasi</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-cream/80 transition-colors hover:text-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cek-status" className="text-cream/80 transition-colors hover:text-cream">
                  Cek Status Transaksi
                </Link>
              </li>
              <li>
                <Link
                  href={adminSession ? "/admin" : "/admin/login"}
                  className="inline-flex items-center gap-1.5 text-brand hover:underline"
                >
                  <ShieldCheck size={14} />
                  {adminSession ? "Dashboard Admin" : "Login Admin"}
                  <ArrowUpRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream/50 uppercase">Jam Operasional</p>
            <dl className="mt-4 space-y-2 text-sm text-cream/80">
              <div className="flex justify-between border-b border-cream/10 pb-2">
                <dt>Senin – Kamis</dt>
                <dd className="tabular">{hours[1].open} – {hours[1].close} WIB</dd>
              </div>
              <div className="flex justify-between border-b border-cream/10 pb-2">
                <dt>Jumat – Sabtu</dt>
                <dd className="tabular">{hours[5].open} – {hours[5].close} WIB</dd>
              </div>
              <div className="flex justify-between">
                <dt>Minggu</dt>
                <dd className="tabular">{hours[0].open} – {hours[0].close} WIB</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream/50 uppercase">Lokasi Ponorogo</p>
            <ul className="mt-4 space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-brand" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} strokeWidth={1.5} className="shrink-0 text-brand" />
                <a href={waHref} target="_blank" rel="noreferrer" className="tabular hover:text-cream">
                  {formatPhoneID(siteConfig.whatsapp)}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} strokeWidth={1.5} className="shrink-0 text-brand" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-cream">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Camera size={16} strokeWidth={1.5} className="shrink-0 text-brand" />
                <a
                  href={`https://instagram.com/${siteConfig.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cream"
                >
                  @{siteConfig.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant editorial wordmark */}
        <div className="pt-10">
          <p
            aria-hidden
            className="font-display text-center text-[clamp(3.2rem,13vw,11.5rem)] leading-[0.86] tracking-tight text-cream/10 select-none"
          >
            {siteConfig.name.toUpperCase()}
          </p>
          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-cream/45 sm:flex-row">
            <p>© {new Date().getFullYear()} {siteConfig.name} Ponorogo · Specialty Coffee & Artisan Bakery.</p>
            <p>Sistem Website Kafe Komersial · Siap Dikustomisasi Tanpa Ubah Kode.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
