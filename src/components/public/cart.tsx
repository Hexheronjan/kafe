"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useDemoStore } from "@/lib/demo-store";
import { EASE, rupiah } from "@/lib/utils";
import { ProductImage } from "./product-image";

type Line = { id: string; qty: number };
type Ctx = {
  lines: Line[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};
const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("CartProvider missing");
  return c;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { menuItems } = useDemoStore();
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Keranjang hanya menyimpan productId + jumlah (harga selalu diambil ulang dari data produk)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("prj-cart");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("prj-cart", JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((id: string, qty = 1) => {
    setLines((l) => {
      const f = l.find((x) => x.id === id);
      if (f) return l.map((x) => (x.id === id ? { ...x, qty: Math.min(20, x.qty + qty) } : x));
      return [...l, { id, qty: Math.min(20, qty) }];
    });
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setLines((l) =>
      qty <= 0 ? l.filter((x) => x.id !== id) : l.map((x) => (x.id === id ? { ...x, qty: Math.min(20, qty) } : x)),
    );
  }, []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Ctx>(() => {
    const count = lines.reduce((a, l) => a + l.qty, 0);
    const total = lines.reduce((a, l) => {
      const p = menuItems.find((item) => item.id === l.id);
      return a + (p?.price ?? 0) * l.qty;
    }, 0);
    return { lines, count, total, open, setOpen, add, setQty, clear };
  }, [lines, open, add, setQty, clear, menuItems]);

  return (
    <CartCtx.Provider value={value}>
      {children}
      <CartDrawer />
    </CartCtx.Provider>
  );
}

export function CartButton({ className = "" }: { className?: string }) {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Buka keranjang, ${count} item`}
      className={`relative grid h-11 w-11 place-items-center ${className}`}
    >
      <ShoppingBag size={22} strokeWidth={1.5} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 14 }}
            className="absolute top-0 right-0 grid h-5 min-w-5 place-items-center rounded-full bg-brand-ink px-1 text-[11px] font-semibold text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function CartDrawer() {
  const { open, setOpen, lines, setQty, total, count } = useCart();
  const { menuItems } = useDemoStore();
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", k);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bg"
            className="fixed inset-0 z-[110] bg-espresso/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal
            aria-label="Keranjang"
            className="fixed top-0 right-0 z-[120] flex h-dvh w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <header className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
              <div>
                <p className="eyebrow">Pesanan Anda</p>
                <h2 className="font-display text-3xl">Keranjang</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup keranjang"
                className="grid h-11 w-11 place-items-center"
              >
                <X strokeWidth={1.5} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <p className="font-display text-3xl italic text-mocha">Masih kosong.</p>
                    <p className="mt-2 text-sm text-mocha">Pilih kopi atau roti favorit Anda.</p>
                    <Link href="/menu" onClick={() => setOpen(false)} className="btn btn-primary mt-6">
                      Lihat Menu
                    </Link>
                  </div>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((l) => {
                      const p = menuItems.find((item) => item.id === l.id);
                      if (!p) return null;
                      return (
                        <motion.li
                          key={l.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-4 border-b border-[var(--line)] py-5">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden">
                              <ProductImage product={p} sizes="80px" />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                              <div className="flex justify-between gap-3">
                                <p className="font-display text-lg leading-tight">{p.name}</p>
                                <p className="tabular text-sm">{rupiah(p.price * l.qty)}</p>
                              </div>
                              <div className="flex items-center gap-1 self-start border border-[var(--line)]">
                                <button
                                  aria-label="Kurangi"
                                  onClick={() => setQty(l.id, l.qty - 1)}
                                  className="grid h-11 w-11 place-items-center hover:bg-latte"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="tabular w-6 text-center text-sm">{l.qty}</span>
                                <button
                                  aria-label="Tambah"
                                  onClick={() => setQty(l.id, l.qty + 1)}
                                  className="grid h-11 w-11 place-items-center hover:bg-latte"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-[var(--line)] bg-latte/60 px-6 py-6">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-sm text-mocha">Total ({count} item)</span>
                  <span className="tabular font-display text-3xl">{rupiah(total)}</span>
                </div>
                <p className="mb-5 text-xs text-mocha">Harga final dikonfirmasi dari server saat checkout.</p>
                <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                  Lanjut ke Checkout
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
