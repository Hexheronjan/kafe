"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, X } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { Reveal, Stagger, StaggerItem, TextReveal } from "@/components/motion";
import { ProductCard, ProductDetailDialog } from "@/components/public/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/config/site";

function MenuContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { menuItems, categoryList } = useDemoStore();

  const kategori = searchParams.get("kategori") ?? "all";
  const q = searchParams.get("q") ?? "";
  const produkSlug = searchParams.get("produk");

  const setParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (!v || v === "all") next.delete(k);
      else next.set(k, v);
    });
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCat = kategori === "all" || item.category === kategori;
      const needle = q.trim().toLowerCase();
      const matchQ =
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle);
      return matchCat && matchQ;
    });
  }, [menuItems, kategori, q]);

  const selectedProduct: Product | null = useMemo(
    () => (produkSlug ? menuItems.find((p) => p.slug === produkSlug) ?? null : null),
    [produkSlug, menuItems],
  );

  return (
    <>
      {/* Filter Kategori & Pencarian Modern (Disimpan di URL ?kategori=...&q=...) */}
      <div className="sticky top-[84px] z-30 py-3">
        <div className="container-x">
          <div className="flex flex-col gap-3 rounded-3xl border border-espresso/10 bg-cream/90 p-3 shadow-[0_12px_32px_-16px_rgba(28,22,18,0.14)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div
              role="tablist"
              aria-label="Kategori menu"
              className="no-scrollbar flex items-center gap-1.5 overflow-x-auto"
            >
              <button
                role="tab"
                aria-selected={kategori === "all"}
                onClick={() => setParams({ kategori: null })}
                className={cn(
                  "min-h-[42px] shrink-0 rounded-full px-4 text-xs font-semibold tracking-wider uppercase transition-all",
                  kategori === "all"
                    ? "bg-espresso text-cream shadow-xs"
                    : "bg-transparent text-espresso/80 hover:bg-latte/75",
                )}
              >
                Semua ({menuItems.length})
              </button>
              {categoryList.map((c) => {
                const active = kategori === c.slug;
                const count = menuItems.filter((m) => m.category === c.slug).length;
                return (
                  <button
                    key={c.slug}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setParams({ kategori: c.slug })}
                    className={cn(
                      "min-h-[42px] shrink-0 rounded-full px-4 text-xs font-semibold tracking-wider uppercase transition-all",
                      active
                        ? "bg-espresso text-cream shadow-xs"
                        : "bg-transparent text-espresso/80 hover:bg-latte/75",
                    )}
                  >
                    {c.name} ({count})
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-72">
              <Search
                size={15}
                strokeWidth={1.6}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mocha"
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setParams({ q: e.target.value || null })}
                placeholder="Cari kopi, croissant, latte…"
                aria-label="Cari menu"
                className="min-h-[42px] w-full rounded-full border border-espresso/12 bg-white/80 pr-9 pl-10 text-sm text-espresso placeholder:text-mocha/60 focus:border-brand focus:bg-white focus:outline-none"
              />
              {q && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={() => setParams({ q: null })}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-mocha hover:bg-latte hover:text-espresso"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Produk */}
      <section className="section pt-8">
        <div className="container-x">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-espresso/10 bg-white/70 py-20 text-center">
              <p className="font-display text-3xl italic text-mocha">Menu tidak ditemukan.</p>
              <p className="mt-2 text-sm text-mocha">
                Tidak ada hasil untuk filter tersebut. Coba kata kunci atau kategori lain.
              </p>
              <button
                type="button"
                onClick={() => setParams({ kategori: null, q: null })}
                className="btn btn-outline mt-6"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <Stagger key={`${kategori}-${q}`} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard
                    product={p}
                    layoutPrefix="catalog"
                    onSelect={(item) => setParams({ produk: item.slug })}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      <ProductDetailDialog
        product={selectedProduct}
        onClose={() => setParams({ produk: null })}
        layoutPrefix="catalog"
      />
    </>
  );
}

export default function MenuPage() {
  return (
    <div className="pt-24">
      <header className="py-12 md:py-16">
        <div className="container-x grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              <Sparkles size={13} /> Katalog Lengkap · Ponorogo
            </p>
            <TextReveal text="Menu Kopi, Roti Pagi & Hidangan" className="font-display t-h2 mt-3" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4">
            <p className="text-sm leading-relaxed text-mocha md:text-base">
              Seluruh minuman diseduh saat dipesan. Klik kartu produk untuk melihat catatan rasa, membagikan tautan, atau menambahkan ke keranjang.
            </p>
          </Reveal>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="container-x py-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[4/5] w-full" />
              ))}
            </div>
          </div>
        }
      >
        <MenuContent />
      </Suspense>
    </div>
  );
}
