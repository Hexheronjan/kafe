"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Clock,
  Coffee,
  Copy,
  MapPin,
  Navigation,
  Plus,
  Sparkles,
  Star,
} from "lucide-react";
import { features, gallery, hours, type Product } from "@/config/site";
import { useDemoStore } from "@/lib/demo-store";
import { BLUR, EASE, cn, rupiah } from "@/lib/utils";
import { Marquee, Parallax, Reveal, Stagger, StaggerItem, TextReveal } from "@/components/motion";
import { OpenStatus } from "@/components/public/open-status";
import { useCart } from "@/components/public/cart";
import { ProductCard, ProductDetailDialog } from "@/components/public/product-card";
import { TestimonialCarousel } from "@/components/public/testimonial-carousel";

export default function HomePage() {
  const { siteConfig, menuItems } = useDemoStore();
  const { add, setOpen } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [homeFilter, setHomeFilter] = useState<"all" | "coffee" | "sweet">("all");
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [todayIdx, setTodayIdx] = useState<number>(-1);

  const heroRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    try {
      const wd = new Intl.DateTimeFormat("en-US", {
        timeZone: siteConfig.timezone,
        weekday: "short",
      }).format(new Date());
      const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTodayIdx(map[wd] ?? -1);
    } catch {}
  }, [siteConfig.timezone]);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMapVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "280px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const featuredProducts = menuItems
    .filter((p) => p.featured)
    .filter((p) => {
      if (homeFilter === "coffee") return p.category === "coffee";
      if (homeFilter === "sweet") return p.category !== "coffee";
      return true;
    })
    .slice(0, 6);

  const signatureCup = menuItems[0];

  const copyAddress = () => {
    navigator.clipboard?.writeText(siteConfig.address);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 1800);
  };

  return (
    <>
      {/* 1. HERO FULL-SCREEN DENGAN FLOATING GLASS CARD */}
      <section
        ref={heroRef}
        className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-espresso text-cream"
      >
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
          style={reduce ? undefined : { y: heroY }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero.jpg"
            alt={`${siteConfig.name} Ponorogo — suasana ruang utama`}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/60 to-espresso/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,115,58,0.25),transparent_55%)]" />
        </motion.div>

        <div className="container-x relative z-10 pt-32 pb-14 md:pb-20">
          {/* Floating status & location pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-cream uppercase backdrop-blur-md">
              <Sparkles size={13} className="text-brand" />
              {siteConfig.hero.eyebrow}
            </span>
            <div className="rounded-full border border-cream/20 bg-espresso/45 px-4 py-1.5 backdrop-blur-md">
              <OpenStatus tone="light" />
            </div>
          </motion.div>

          <div className="mt-8 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <TextReveal text={siteConfig.hero.headline} className="font-display t-hero text-cream" />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.28 }}
                className="mt-6 max-w-2xl text-base leading-relaxed text-cream/85 md:text-lg"
              >
                {siteConfig.hero.sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.38 }}
                className="mt-8 flex flex-wrap items-center gap-3.5"
              >
                <Link href="/menu" className="btn btn-brand">
                  {siteConfig.hero.ctaMenu} <ArrowUpRight size={16} />
                </Link>
                {siteConfig.features.reservationEnabled && (
                  <Link href="/reservasi" className="btn btn-light">
                    {siteConfig.hero.ctaReserve}
                  </Link>
                )}
              </motion.div>

              {/* Live Metrics Strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5 }}
                className="mt-10 grid grid-cols-3 gap-4 border-t border-cream/15 pt-6 sm:max-w-xl"
              >
                <div>
                  <p className="font-display flex items-center gap-1 text-2xl text-cream">
                    4.9 <Star size={16} fill="currentColor" className="text-brand" />
                  </p>
                  <p className="text-xs text-cream/65">1.200+ Ulasan Tamu</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-cream">100%</p>
                  <p className="text-xs text-cream/65">Arabica Sangrai Segar</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-cream">07:00</p>
                  <p className="text-xs text-cream/65">Roti Pagi Keluar Oven</p>
                </div>
              </motion.div>
            </div>

            {/* Floating Glassmorphic Signature Card */}
            {signatureCup && (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.42 }}
                className="lg:col-span-4"
              >
                <div className="rounded-3xl border border-cream/20 bg-cream/12 p-5 text-cream shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-cream/75 uppercase">
                    <span className="flex items-center gap-1.5">
                      <Coffee size={13} className="text-brand" /> Rekomendasi Barista Hari Ini
                    </span>
                    <span>Ponorogo</span>
                  </div>

                  <div className="mt-3.5 flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-cream/20">
                      <Image
                        src={signatureCup.image ?? "/images/latte.jpg"}
                        alt={signatureCup.name}
                        fill
                        sizes="80px"
                        placeholder="blur"
                        blurDataURL={BLUR}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display truncate text-xl">{signatureCup.name}</h2>
                      <p className="mt-0.5 line-clamp-2 text-xs text-cream/75">{signatureCup.description}</p>
                      <p className="tabular font-display mt-1.5 text-lg text-brand">{rupiah(signatureCup.price)}</p>
                    </div>
                  </div>

                  {siteConfig.features.onlineOrderEnabled && (
                    <div className="mt-4 flex gap-2 border-t border-cream/15 pt-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          add(signatureCup.id, 1);
                          setOpen(true);
                        }}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-cream py-2.5 text-xs font-semibold tracking-wider text-espresso uppercase transition-colors hover:bg-brand hover:text-white"
                      >
                        <Plus size={14} /> Pesan Cepat
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(signatureCup)}
                        className="rounded-full border border-cream/25 px-4 py-2.5 text-xs font-semibold text-cream hover:bg-cream/15"
                      >
                        Detail
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 2. MARQUEE KATA KUNCI BRAND */}
      <section aria-label="Kata kunci brand" className="border-b border-[var(--line)] bg-latte/65 py-5">
        <Marquee items={siteConfig.marquee} />
      </section>

      {/* 3. KEUNGGULAN KAFE (4 MODERN SCULPTED CARDS) */}
      <section className="section border-b border-[var(--line)]">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow">Karakter & Kerajinan</p>
              <h2 className="font-display t-h2 mt-3">
                Empat hal sederhana yang kami jaga setiap pagi di Ponorogo.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <p className="text-sm leading-relaxed text-mocha md:text-base">
                Kami memilih bekerja dengan sabar: sangrai kecil yang terukur, pastry mentega Prancis yang dipanggang subuh, dan ruang tenang yang menghargai waktu Anda.
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <StaggerItem
                key={f.n}
                className="group flex flex-col justify-between rounded-3xl border border-espresso/10 bg-white/75 p-7 shadow-[0_12px_32px_-18px_rgba(28,22,18,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:bg-white"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl italic text-brand-ink">{f.n}</span>
                  <span className="rounded-full bg-latte/80 px-2.5 py-1 text-[9px] font-bold tracking-[0.16em] text-mocha uppercase">
                    {f.tag}
                  </span>
                </div>
                <div className="mt-10">
                  <h3 className="font-display text-2xl text-espresso">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-mocha">{f.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 4. MENU FAVORIT DENGAN FILTER INTERAKTIF */}
      <section className="section border-b border-[var(--line)]">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <Reveal>
              <p className="eyebrow">Kurasi Barista & Dapur</p>
              <h2 className="font-display t-h2 mt-2">Menu Favorit Pilihan Tamu</h2>
            </Reveal>

            <Reveal delay={0.1} className="flex flex-wrap items-center gap-2">
              {(
                [
                  ["all", "Semua Unggulan"],
                  ["coffee", "Signature Coffee"],
                  ["sweet", "Pastry & Non-Coffee"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setHomeFilter(key)}
                  className={cn(
                    "min-h-[42px] rounded-full px-4 text-xs font-semibold tracking-wider uppercase transition-all",
                    homeFilter === key
                      ? "bg-espresso text-cream shadow-sm"
                      : "border border-espresso/15 bg-white/70 text-espresso hover:bg-latte",
                  )}
                >
                  {label}
                </button>
              ))}
              <Link href="/menu" className="btn btn-outline !min-h-[42px] !px-4">
                Semua Menu <ArrowUpRight size={14} />
              </Link>
            </Reveal>
          </div>

          <Stagger key={homeFilter} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard
                  product={p}
                  layoutPrefix="home"
                  onSelect={(item) => setSelectedProduct(item)}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 5. EDITORIAL STORY SPLIT (ASIMETRIS MODERN) */}
      <section className="section border-b border-[var(--line)] bg-latte/40">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <div className="relative lg:col-span-6">
            <Parallax className="aspect-[4/4.6] w-full rounded-3xl border border-espresso/10 shadow-xl">
              <Image
                src="/images/interior.jpg"
                alt="Sudut duduk hangat di Prajalinks Ponorogo"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover"
              />
            </Parallax>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-espresso/10 bg-white/85 px-5 py-3.5 text-xs shadow-md backdrop-blur-md sm:absolute sm:right-5 sm:bottom-5 sm:left-5 sm:mt-0">
              <span className="font-semibold text-espresso">Jl. HOS Cokroaminoto No. 48 · Ponorogo</span>
              <span className="rounded-full bg-latte px-2.5 py-1 font-semibold text-brand-ink">2 Lantai & Taman</span>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <p className="eyebrow">Cerita Kami di Ponorogo</p>
              <h2 className="font-display t-h2 mt-3">
                Ruang hangat untuk bekerja fokus, berbincang, dan menikmati waktu.
              </h2>
              <blockquote className="font-display mt-6 rounded-2xl border-l-4 border-brand bg-white/65 p-5 text-xl italic text-espresso/90 shadow-xs">
                “Kopi yang baik tidak butuh tergesa-gesa — baik saat disangrai, diseduh, maupun diminum.”
              </blockquote>
              <p className="mt-6 text-sm leading-relaxed text-mocha md:text-base">
                Dimulai pada 2019 di Ponorogo, {siteConfig.name} tumbuh menjadi ruang ketiga bagi para pekerja kreatif, keluarga, dan penikmat kopi yang mencari kualitas seduhan yang konsisten setiap hari.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link href="/tentang-kami" className="btn btn-primary">
                  Baca Cerita Lengkap
                </Link>
                {siteConfig.features.reservationEnabled && (
                  <Link href="/reservasi" className="btn btn-outline">
                    Reservasi Meja
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6. FOTO SUASANA — MODERN BENTO GRID */}
      {siteConfig.features.galleryEnabled && (
        <section className="section border-b border-[var(--line)]">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <Reveal>
                <p className="eyebrow">Suasana & Ruang</p>
                <h2 className="font-display t-h2 mt-2">Potret Sehari-hari di Kafe</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <Link href="/galeri" className="btn btn-outline">
                  Buka Galeri Penuh <ArrowUpRight size={15} />
                </Link>
              </Reveal>
            </div>

            <div className="mt-10 grid auto-rows-[250px] grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[230px]">
              {gallery.slice(0, 5).map((item, idx) => {
                const spanClass =
                  idx === 0
                    ? "md:col-span-2 md:row-span-2"
                    : idx === 1
                      ? "md:col-span-1 md:row-span-1"
                      : idx === 2
                        ? "md:col-span-1 md:row-span-2"
                        : "md:col-span-1 md:row-span-1";
                return (
                  <Reveal
                    key={item.id}
                    delay={idx * 0.06}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl border border-espresso/10 bg-latte shadow-sm",
                      spanClass,
                    )}
                  >
                    <Link href="/galeri" className="relative block h-full w-full">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        placeholder="blur"
                        blurDataURL={BLUR}
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                      <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                        <span className="rounded-full bg-cream/20 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-cream uppercase backdrop-blur-md">
                          {item.category}
                        </span>
                        <p className="font-display mt-2 text-2xl">{item.title}</p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. TESTIMONI PELANGGAN & JAM OPERASIONAL */}
      <section className="section border-b border-[var(--line)] bg-latte/35">
        <div className="container-x">
          {siteConfig.features.testimonialEnabled && (
            <div className="mb-20">
              <Reveal className="mb-10">
                <p className="eyebrow">Suara Pelanggan Ponorogo</p>
                <h2 className="font-display t-h2 mt-2">Catatan dari Meja Tamu</h2>
              </Reveal>
              <TestimonialCarousel />
            </div>
          )}

          {/* Jam Operasional */}
          <div className="grid gap-10 border-t border-[var(--line)] pt-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow">
                <Clock size={14} /> Waktu Kunjungan
              </p>
              <h2 className="font-display t-h3 mt-2">Jam Operasional</h2>
              <p className="mt-3 text-sm leading-relaxed text-mocha">
                Status buka dihitung otomatis mengikuti zona waktu {siteConfig.timezone} (WIB). Untuk rombongan keluarga atau rapat tim di Ponorogo, Anda dapat melakukan reservasi meja lebih dulu.
              </p>
              <div className="mt-5">
                <OpenStatus tone="dark" />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-7">
              <div className="overflow-hidden rounded-3xl border border-espresso/10 bg-white/85 shadow-sm">
                {hours.map((h, i) => {
                  const isToday = i === todayIdx;
                  return (
                    <div
                      key={h.day}
                      className={cn(
                        "flex items-center justify-between border-b border-[var(--line)] px-6 py-3.5 text-sm last:border-b-0",
                        isToday && "bg-latte/75 font-semibold",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        {h.day}
                        {isToday && (
                          <span className="rounded-full bg-brand-ink px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">
                            Hari Ini
                          </span>
                        )}
                      </span>
                      <span className="tabular text-mocha">
                        {h.open && h.close ? `${h.open} – ${h.close} WIB` : "Tutup"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 8. LOKASI & PETA PONOROGO (LAZY LOADED) */}
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">
              <MapPin size={14} /> Lokasi Kami di Ponorogo
            </p>
            <h2 className="font-display t-h2 mt-2">Singgah di Ruang Kami</h2>
            <p className="mt-4 text-base leading-relaxed text-mocha">{siteConfig.address}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={copyAddress} className="btn btn-outline">
                {copiedAddr ? <Check size={15} /> : <Copy size={15} />}
                {copiedAddr ? "Alamat Tersalin" : "Salin Alamat"}
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                <Navigation size={15} /> Buka Rute Google Maps
              </a>
            </div>
          </Reveal>

          <div ref={mapRef} className="lg:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-espresso/15 bg-latte shadow-lg">
              {mapVisible ? (
                <iframe
                  title={`Peta lokasi ${siteConfig.name} Ponorogo`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapQuery)}&output=embed`}
                  className="h-full w-full border-0 grayscale-[25%] contrast-[1.04]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="skeleton grid h-full w-full place-items-center text-xs tracking-widest text-mocha uppercase">
                  Memuat Peta Ponorogo…
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductDetailDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        layoutPrefix="home"
      />
    </>
  );
}
