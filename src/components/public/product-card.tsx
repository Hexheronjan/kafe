"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Eye, Minus, Plus, Share2, Sparkles, X } from "lucide-react";
import { categories, type Product } from "@/config/site";
import { useDemoStore } from "@/lib/demo-store";
import { EASE, cn, rupiah } from "@/lib/utils";
import { useCart } from "./cart";
import { ProductImage } from "./product-image";

const catLabel = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

export function ProductCard({
  product,
  onSelect,
  layoutPrefix = "menu",
}: {
  product: Product;
  onSelect?: (p: Product) => void;
  layoutPrefix?: string;
}) {
  const { add } = useCart();
  const { siteConfig } = useDemoStore();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;
    add(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: EASE }}
      onClick={() => onSelect?.(product)}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-espresso/10 bg-white/75 p-3 shadow-[0_12px_32px_-16px_rgba(28,22,18,0.12)] backdrop-blur-sm transition-all duration-500 hover:border-brand/40 hover:bg-white hover:shadow-[0_24px_48px_-18px_rgba(28,22,18,0.22)]",
        !product.available && "opacity-70",
      )}
    >
      {/* Image container (wajib relative agar next/image fill sempurna) */}
      <motion.div
        layoutId={`${layoutPrefix}-img-${product.slug}`}
        className="relative aspect-[4/4.2] w-full overflow-hidden rounded-2xl bg-latte"
      >
        <div className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
          <ProductImage
            product={product}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={!product.available ? "grayscale-[55%]" : ""}
          />
        </div>

        {/* Gradient vignette halus */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/45 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          {product.badge === "BEST_SELLER" && (
            <span className="shimmer inline-flex items-center gap-1 rounded-full bg-espresso/90 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-cream uppercase shadow-sm backdrop-blur-md">
              <Sparkles size={11} className="text-brand" /> Best Seller
            </span>
          )}
          {product.badge === "RECOMMENDED" && (
            <span className="rounded-full bg-brand-ink/95 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase shadow-sm backdrop-blur-md">
              Rekomendasi
            </span>
          )}
        </div>

        {/* Quick view pill on hover */}
        <div className="absolute right-3 bottom-3 z-10 flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1.5 text-[11px] font-semibold text-espresso opacity-0 shadow-sm backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
          <Eye size={13} /> Detail
        </div>

        {/* Status habis */}
        {!product.available && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-espresso/50 backdrop-blur-[2px]">
            <span className="rounded-full border border-cream/60 bg-espresso/90 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-cream uppercase">
              Habis Hari Ini
            </span>
          </div>
        )}
      </motion.div>

      {/* Card body */}
      <div className="flex flex-1 flex-col justify-between px-2 pt-4 pb-2">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold tracking-[0.15em] text-mocha uppercase">
            <span>{catLabel(product.category)}</span>
            <span className={cn("inline-flex items-center gap-1", product.available ? "text-sage" : "text-[#b3473e]")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", product.available ? "bg-sage" : "bg-[#b3473e]")} />
              {product.available ? "Tersedia" : "Habis"}
            </span>
          </div>

          <h3 className="font-display mt-1.5 text-2xl leading-snug text-espresso transition-colors group-hover:text-brand-ink">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-mocha">{product.description}</p>

          {/* Tasting Notes Chips */}
          {product.notes && product.notes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.notes.map((n) => (
                <span
                  key={n}
                  className="rounded-full bg-latte/70 px-2.5 py-0.5 text-[11px] font-medium text-mocha"
                >
                  {n}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-3.5">
          <div>
            <span className="block text-[10px] font-medium tracking-wider text-mocha uppercase">Harga</span>
            <span className="tabular font-display text-xl font-semibold text-espresso">{rupiah(product.price)}</span>
          </div>

          {siteConfig.features.onlineOrderEnabled && (
            <button
              type="button"
              disabled={!product.available}
              onClick={handleAdd}
              aria-label={product.available ? `Tambah ${product.name} ke keranjang` : `${product.name} habis`}
              className={cn(
                "inline-flex min-h-[42px] items-center gap-1.5 rounded-full px-4 text-xs font-semibold tracking-wider uppercase transition-all",
                !product.available
                  ? "cursor-not-allowed bg-stone-200 text-mocha/50"
                  : added
                    ? "bg-sage text-white shadow-sm"
                    : "bg-espresso text-cream hover:bg-brand-ink shadow-xs",
              )}
            >
              {added ? (
                <>
                  <Check size={14} strokeWidth={2.2} /> Masuk
                </>
              ) : (
                <>
                  <Plus size={14} strokeWidth={2} /> Tambah
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ProductDetailDialog({
  product,
  onClose,
  layoutPrefix = "menu",
}: {
  product: Product | null;
  onClose: () => void;
  layoutPrefix?: string;
}) {
  const { add, setOpen } = useCart();
  const { siteConfig } = useDemoStore();
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQty(1);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  const handleShare = () => {
    if (!product) return;
    const url = `${window.location.origin}/menu?produk=${product.slug}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="fixed inset-0 z-[115] bg-espresso/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[120] grid place-items-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal
              aria-label={product.name}
              className="pointer-events-auto grid w-full max-w-3xl overflow-hidden rounded-3xl border border-espresso/15 bg-cream shadow-2xl md:grid-cols-12"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <motion.div
                layoutId={`${layoutPrefix}-img-${product.slug}`}
                className="relative aspect-[4/3.6] w-full bg-latte md:col-span-6 md:aspect-auto md:min-h-[440px]"
              >
                <ProductImage product={product} sizes="(max-width: 768px) 100vw, 420px" />
              </motion.div>

              <div className="flex flex-col justify-between p-6 md:col-span-6 md:p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">{catLabel(product.category)}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleShare}
                        aria-label="Salin link produk"
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-latte/70 px-3 text-xs font-medium text-mocha hover:bg-latte hover:text-espresso"
                      >
                        <Share2 size={13} />
                        {copied ? "Tersalin" : "Bagikan"}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup detail produk"
                        className="grid h-9 w-9 place-items-center rounded-full bg-latte/70 hover:bg-latte"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </div>

                  <h2 className="font-display mt-2.5 text-3xl leading-tight">{product.name}</h2>
                  <p className="tabular font-display mt-2 text-2xl font-semibold text-brand-ink">
                    {rupiah(product.price)}
                  </p>

                  {product.notes && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.notes.map((n) => (
                        <span key={n} className="rounded-full bg-latte px-3 py-1 text-xs font-medium text-espresso">
                          {n}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="hairline my-5" />

                  <p className="text-sm leading-relaxed text-mocha">{product.description}</p>

                  <dl className="mt-5 space-y-2 rounded-2xl bg-latte/50 p-4 text-xs text-mocha">
                    <div className="flex justify-between">
                      <dt>Ketersediaan</dt>
                      <dd className="font-semibold text-espresso">
                        {product.available ? "Tersedia Hari Ini" : "Sedang Habis"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Saran Penyajian</dt>
                      <dd className="font-semibold text-espresso">{product.serving ?? "Dine In & Take Away"}</dd>
                    </div>
                  </dl>
                </div>

                {siteConfig.features.onlineOrderEnabled && (
                  <div className="mt-6 space-y-3 border-t border-[var(--line)] pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wider text-mocha uppercase">
                        Jumlah Pesanan
                      </span>
                      <div className="flex items-center rounded-full border border-[var(--line)] bg-white px-1">
                        <button
                          type="button"
                          aria-label="Kurangi jumlah"
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="grid h-9 w-9 place-items-center rounded-full hover:bg-latte"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="tabular w-9 text-center text-sm font-semibold">{qty}</span>
                        <button
                          type="button"
                          aria-label="Tambah jumlah"
                          onClick={() => setQty((q) => Math.min(20, q + 1))}
                          className="grid h-9 w-9 place-items-center rounded-full hover:bg-latte"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!product.available}
                      onClick={() => {
                        add(product.id, qty);
                        onClose();
                        setOpen(true);
                      }}
                      className="btn btn-primary w-full"
                    >
                      {product.available
                        ? `Tambah ke Keranjang · ${rupiah(product.price * qty)}`
                        : "Menu Sedang Habis"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
