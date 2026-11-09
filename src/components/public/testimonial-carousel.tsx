"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";

export function TestimonialCarousel() {
  const { testimonialList } = useDemoStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true }),
  ]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div>
      <div className="overflow-hidden py-2" ref={emblaRef}>
        <div className="-ml-6 flex">
          {testimonialList.map((t, idx) => (
            <div key={idx} className="min-w-0 flex-[0_0_100%] pl-6 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              <article className="flex h-full flex-col justify-between rounded-3xl border border-espresso/10 bg-white/80 p-7 shadow-[0_14px_34px_-18px_rgba(28,22,18,0.12)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-brand-ink" aria-label={`Rating ${t.rating} dari 5`}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          size={14}
                          strokeWidth={1.6}
                          fill={s < t.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <Quote size={20} className="text-brand/40" />
                  </div>
                  <blockquote className="font-display mt-5 text-lg leading-relaxed italic text-espresso/90">
                    “{t.text}”
                  </blockquote>
                </div>
                <footer className="mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-latte font-display text-sm font-semibold text-espresso">
                    {t.name.slice(0, 1)}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-espresso">{t.name}</p>
                    <p className="text-mocha">{("role" in t && t.role) ? t.role : "Pelanggan Terverifikasi · Ponorogo"}</p>
                  </div>
                </footer>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={prev}
          aria-label="Testimoni sebelumnya"
          className="grid h-11 w-11 place-items-center rounded-full border border-espresso/15 bg-white/75 transition-colors hover:bg-espresso hover:text-cream"
        >
          <ArrowLeft size={16} strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Testimoni berikutnya"
          className="grid h-11 w-11 place-items-center rounded-full border border-espresso/15 bg-white/75 transition-colors hover:bg-espresso hover:text-cream"
        >
          <ArrowRight size={16} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}
