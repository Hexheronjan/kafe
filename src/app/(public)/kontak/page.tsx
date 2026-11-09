"use client";

import { useState } from "react";
import { Camera, Check, Copy, Mail, MapPin, MessageCircle, Navigation, Phone, Sparkles } from "lucide-react";
import { hours } from "@/config/site";
import { useDemoStore } from "@/lib/demo-store";
import { Reveal, TextReveal } from "@/components/motion";
import { OpenStatus } from "@/components/public/open-status";

export default function KontakPage() {
  const { siteConfig } = useDemoStore();
  const [copied, setCopied] = useState(false);

  const copyAddr = () => {
    navigator.clipboard?.writeText(siteConfig.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const waHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.waMessage)}`;

  return (
    <div className="pt-24">
      <header className="py-12 md:py-16">
        <div className="container-x grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              <Sparkles size={13} /> Kontak, Jam Buka & Rute · Ponorogo
            </p>
            <TextReveal text="Mari Berjumpa di Meja Kami" className="font-display t-h2 mt-3" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4">
            <OpenStatus tone="dark" />
            <p className="mt-3 text-sm leading-relaxed text-mocha">
              Hubungi kami lewat WhatsApp untuk pertanyaan cepat, kerja sama acara di Ponorogo, atau pemesanan khusus.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="section pt-6">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          {/* Kartu Kontak */}
          <Reveal className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-espresso/10 bg-white/80 p-7 shadow-sm">
              <p className="eyebrow">Alamat Kafe Ponorogo</p>
              <h2 className="font-display mt-2 text-2xl">{siteConfig.name}</h2>
              <p className="mt-3 flex items-start gap-2.5 text-sm leading-relaxed text-mocha">
                <MapPin size={17} className="mt-0.5 shrink-0 text-brand-ink" />
                <span>{siteConfig.address}</span>
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <button type="button" onClick={copyAddr} className="btn btn-outline !min-h-[44px] !px-4">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Alamat Tersalin" : "Salin Alamat"}
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary !min-h-[44px] !px-4"
                >
                  <Navigation size={15} /> Buka Rute
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-espresso/10 bg-white/80 p-7 shadow-sm">
              <p className="eyebrow">Saluran Komunikasi</p>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <span className="flex items-center gap-2.5 text-mocha">
                    <Phone size={16} className="text-brand-ink" /> WhatsApp
                  </span>
                  <a href={waHref} target="_blank" rel="noreferrer" className="tabular font-semibold hover:text-brand-ink">
                    +{siteConfig.whatsapp}
                  </a>
                </li>
                <li className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <span className="flex items-center gap-2.5 text-mocha">
                    <Mail size={16} className="text-brand-ink" /> Email
                  </span>
                  <a href={`mailto:${siteConfig.email}`} className="font-semibold hover:text-brand-ink">
                    {siteConfig.email}
                  </a>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 text-mocha">
                    <Camera size={16} className="text-brand-ink" /> Instagram
                  </span>
                  <a
                    href={`https://instagram.com/${siteConfig.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold hover:text-brand-ink"
                  >
                    @{siteConfig.instagram}
                  </a>
                </li>
              </ul>

              <a href={waHref} target="_blank" rel="noreferrer" className="btn btn-brand mt-6 w-full">
                <MessageCircle size={16} /> Kirim Pesan WhatsApp
              </a>
            </div>

            <div className="rounded-3xl border border-espresso/10 bg-white/80 p-7 shadow-sm">
              <p className="eyebrow">Jadwal Mingguan ({siteConfig.timezone})</p>
              <dl className="mt-4 space-y-2.5 text-sm">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between border-b border-[var(--line)] pb-2 last:border-b-0 last:pb-0">
                    <dt className="font-medium">{h.day}</dt>
                    <dd className="tabular text-mocha">
                      {h.open && h.close ? `${h.open} – ${h.close} WIB` : "Libur"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Peta Lokasi Ponorogo */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="h-full min-h-[480px] w-full overflow-hidden rounded-3xl border border-espresso/15 bg-latte shadow-lg">
              <iframe
                title={`Peta lokasi ${siteConfig.name} Ponorogo`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapQuery)}&output=embed`}
                className="h-full min-h-[480px] w-full border-0 grayscale-[25%] contrast-[1.04]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
