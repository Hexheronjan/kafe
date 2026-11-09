"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Expand, Sparkles, X } from "lucide-react";
import { gallery, galleryCategories } from "@/config/site";
import { Reveal, TextReveal } from "@/components/motion";
import { BLUR, EASE, cn } from "@/lib/utils";

export default function GaleriPage() {
  const [cat, setCat] = useState("all");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const items = useMemo(
    () => (cat === "all" ? gallery : gallery.filter((g) => g.category === cat)),
    [cat],
  );

  const activeItem = activeIdx !== null ? items[activeIdx] ?? null : null;

  const prev = useCallback(() => {
    setActiveIdx((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length]);

  const next = useCallback(() => {
    setActiveIdx((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIdx(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, prev, next]);

  return (
    <div className="pt-24">
      <header className="py-12 md:py-16">
        <div className="container-x grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              <Sparkles size={13} /> Arsip Visual · Ponorogo
            </p>
            <TextReveal text="Galeri Ruang, Seduhan & Momen" className="font-display t-h2 mt-3" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4">
            <p className="text-sm leading-relaxed text-mocha md:text-base">
              Klik foto untuk membuka tampilan penuh (mendukung navigasi tombol panah keyboard serta geser/swipe di layar sentuh).
            </p>
          </Reveal>
        </div>
      </header>

      {/* Filter Kategori Pill dengan Transisi Layout */}
      <div className="container-x">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-full border border-espresso/10 bg-white/75 p-2 shadow-xs backdrop-blur-md">
          {galleryCategories.map((c) => {
            const active = cat === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  setActiveIdx(null);
                  setCat(c.slug);
                }}
                className={cn(
                  "min-h-[40px] shrink-0 rounded-full px-5 text-xs font-semibold tracking-wider uppercase transition-all",
                  active
                    ? "bg-espresso text-cream shadow-xs"
                    : "text-espresso/80 hover:bg-latte/70",
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Foto dengan layout transition */}
      <section className="section pt-10">
        <div className="container-x">
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {items.map((g, idx) => (
                <motion.figure
                  key={g.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  onClick={() => setActiveIdx(idx)}
                  className="group relative aspect-[4/4.6] cursor-pointer overflow-hidden rounded-3xl border border-espresso/10 bg-latte shadow-md"
                >
                  <motion.div layoutId={`gallery-${g.id}`} className="relative h-full w-full">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={BLUR}
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/15 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-cream">
                    <div>
                      <span className="rounded-full bg-cream/20 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-cream uppercase backdrop-blur-md">
                        {g.category}
                      </span>
                      <p className="font-display mt-2 text-2xl">{g.title}</p>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-cream/35 bg-espresso/40 backdrop-blur-md transition-transform group-hover:scale-110">
                      <Expand size={15} />
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox dengan layoutId, Keyboard & Swipe */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            role="dialog"
            aria-modal
            aria-label={activeItem.title}
            className="fixed inset-0 z-[130] flex flex-col justify-between bg-espresso/95 p-4 text-cream backdrop-blur-md md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <p className="rounded-full border border-cream/20 bg-cream/10 px-4 py-1.5 text-xs tracking-[0.2em] text-cream/85 uppercase">
                {(activeIdx ?? 0) + 1} / {items.length} · {activeItem.category}
              </p>
              <button
                type="button"
                onClick={() => setActiveIdx(null)}
                aria-label="Tutup lightbox"
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/25 hover:bg-cream hover:text-espresso"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative my-4 flex flex-1 items-center justify-center overflow-hidden">
              <motion.div
                key={activeItem.id}
                layoutId={`gallery-${activeItem.id}`}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 60) prev();
                  else if (info.offset.x < -60) next();
                }}
                className="relative h-full max-h-[72dvh] w-full max-w-4xl overflow-hidden rounded-3xl border border-cream/20"
              >
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  sizes="90vw"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  className="object-contain bg-espresso"
                />
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl">{activeItem.title}</h2>
                <p className="text-sm text-cream/70">{activeItem.alt}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Foto sebelumnya"
                  className="grid h-11 w-11 place-items-center rounded-full border border-cream/30 hover:bg-cream hover:text-espresso"
                >
                  <ArrowLeft size={17} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Foto berikutnya"
                  className="grid h-11 w-11 place-items-center rounded-full border border-cream/30 hover:bg-cream hover:text-espresso"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
