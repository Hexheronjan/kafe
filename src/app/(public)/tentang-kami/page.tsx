"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { Parallax, Reveal, Stagger, StaggerItem, TextReveal } from "@/components/motion";
import { BLUR } from "@/lib/utils";

export default function TentangKamiPage() {
  const { siteConfig, aboutList } = useDemoStore();

  return (
    <div className="pt-24">
      {/* Editorial Hero */}
      <header className="border-b border-[var(--line)] py-14 md:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              <Sparkles size={13} /> Tentang {siteConfig.name} · Ponorogo
            </p>
            <TextReveal
              text="Menyeduh dengan sabar, menyambut dengan hangat."
              className="font-display t-h2 mt-3"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4">
            <p className="text-sm leading-relaxed text-mocha md:text-base">{siteConfig.description}</p>
          </Reveal>
        </div>
      </header>

      {/* Render tiap bagian sesuai tipenya (STORY, CONCEPT, VALUES, PLACE) */}
      {aboutList.map((sec, idx) => {
        if (sec.type === "STORY") {
          return (
            <section key={idx} className="section border-b border-[var(--line)]">
              <div className="container-x grid items-center gap-12 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <Reveal>
                    <p className="eyebrow">01 · Cerita & Sejarah</p>
                    <h2 className="font-display t-h2 mt-3">{sec.title}</h2>
                    <div className="mt-6 space-y-4 text-base leading-relaxed text-mocha">
                      {sec.body.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </Reveal>
                </div>
                {sec.image && (
                  <div className="lg:col-span-6 lg:col-start-7">
                    <Parallax className="aspect-[4/3] w-full rounded-3xl border border-espresso/10 shadow-xl">
                      <Image
                        src={sec.image}
                        alt={sec.alt ?? sec.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        placeholder="blur"
                        blurDataURL={BLUR}
                        className="object-cover"
                      />
                    </Parallax>
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (sec.type === "CONCEPT") {
          return (
            <section key={idx} className="section border-b border-[var(--line)] bg-espresso text-cream">
              <div className="container-x grid items-center gap-12 lg:grid-cols-12">
                {sec.image && (
                  <div className="order-2 lg:order-1 lg:col-span-5">
                    <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-3xl border border-cream/20 shadow-2xl">
                      <Image
                        src={sec.image}
                        alt={sec.alt ?? sec.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        placeholder="blur"
                        blurDataURL={BLUR}
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
                  <Reveal>
                    <p className="eyebrow !text-brand">02 · Konsep Visual & Ruang</p>
                    <h2 className="font-display t-h2 mt-3">{sec.title}</h2>
                    <div className="mt-6 space-y-4 text-lg leading-relaxed text-cream/80">
                      {sec.body.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        }

        if (sec.type === "VALUES") {
          return (
            <section key={idx} className="section border-b border-[var(--line)]">
              <div className="container-x">
                <Reveal>
                  <p className="eyebrow">03 · Nilai Kami</p>
                  <h2 className="font-display t-h2 mt-3">{sec.title}</h2>
                </Reveal>
                <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {sec.body.map((val, vIdx) => (
                    <StaggerItem
                      key={vIdx}
                      className="flex flex-col justify-between rounded-3xl border border-espresso/10 bg-white/80 p-7 shadow-sm"
                    >
                      <span className="font-display text-3xl italic text-brand-ink">0{vIdx + 1}</span>
                      <p className="font-display mt-10 text-2xl leading-snug">{val}</p>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </section>
          );
        }

        // PLACE
        return (
          <section key={idx} className="section">
            <div className="container-x grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="eyebrow">04 · Ruang & Tempat di Ponorogo</p>
                  <h2 className="font-display t-h2 mt-3">{sec.title}</h2>
                  <div className="mt-6 space-y-4 text-base leading-relaxed text-mocha">
                    {sec.body.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/reservasi" className="btn btn-primary">
                      Reservasi Meja
                    </Link>
                    <Link href="/kontak" className="btn btn-outline">
                      Lihat Lokasi Ponorogo
                    </Link>
                  </div>
                </Reveal>
              </div>
              {sec.image && (
                <div className="lg:col-span-6 lg:col-start-7">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-espresso/10 shadow-xl">
                    <Image
                      src={sec.image}
                      alt={sec.alt ?? sec.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      placeholder="blur"
                      blurDataURL={BLUR}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
