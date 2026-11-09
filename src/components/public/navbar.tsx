"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { nav } from "@/config/site";
import { useDemoStore } from "@/lib/demo-store";
import { EASE, cn } from "@/lib/utils";
import { CartButton } from "./cart";

export function Navbar() {
  const pathname = usePathname();
  const { siteConfig, adminSession } = useDemoStore();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 36);
    setHidden(y > prev && y > 240 && !open);
  });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const overHero = pathname === "/" && !scrolled && !open;
  const items = [
    ...nav.filter((n) =>
      n.href === "/reservasi"
        ? siteConfig.features.reservationEnabled
        : n.href === "/galeri"
          ? siteConfig.features.galleryEnabled
          : true,
    ),
    { href: "/cek-status", label: "Cek Status" },
  ];

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-120%" : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-6 sm:pt-4"
      >
        <div
          className={cn(
            "mx-auto flex h-[64px] max-w-7xl items-center justify-between rounded-full px-5 transition-all duration-500 sm:px-7",
            overHero
              ? "border border-cream/20 bg-espresso/30 text-cream backdrop-blur-md"
              : "border border-espresso/10 bg-cream/88 text-espresso shadow-[0_12px_36px_-12px_rgba(28,22,18,0.16)] backdrop-blur-xl",
          )}
        >
          <Link href="/" className="group flex items-center gap-2.5" aria-label={`${siteConfig.name} beranda`}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white shadow-xs transition-transform group-hover:scale-105">
              {siteConfig.name.slice(0, 1)}
            </span>
            <div className="leading-none">
              <span className="font-display block text-xl tracking-tight sm:text-2xl">
                {siteConfig.name}
                <span className="text-brand">.</span>
              </span>
              <span
                className={cn(
                  "hidden text-[9px] font-semibold tracking-[0.2em] uppercase sm:block",
                  overHero ? "text-cream/70" : "text-mocha",
                )}
              >
                Ponorogo
              </span>
            </div>
          </Link>

          <nav aria-label="Utama" className="hidden items-center gap-1 lg:flex">
            {items.map((n) => {
              const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? overHero
                        ? "text-espresso"
                        : "text-cream"
                      : overHero
                        ? "text-cream/85 hover:text-cream"
                        : "text-espresso/75 hover:text-espresso",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="navActivePill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className={cn(
                        "absolute inset-0 -z-10 rounded-full",
                        overHero ? "bg-cream" : "bg-espresso",
                      )}
                    />
                  )}
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={adminSession ? "/admin" : "/admin/login"}
              className={cn(
                "hidden items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-semibold tracking-wider uppercase transition-all md:inline-flex",
                overHero
                  ? "border-cream/35 bg-cream/10 text-cream hover:bg-cream hover:text-espresso"
                  : "border-espresso/15 bg-latte/65 text-espresso hover:bg-espresso hover:text-cream",
              )}
            >
              <ShieldCheck size={14} className="text-brand" />
              {adminSession ? `Admin (${adminSession.role})` : "Login Admin"}
            </Link>
            {siteConfig.features.onlineOrderEnabled && <CartButton />}
            <button
              className="grid h-10 w-10 place-items-center rounded-full lg:hidden"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X strokeWidth={1.6} /> : <Menu strokeWidth={1.6} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex flex-col justify-between bg-espresso px-6 pb-10 pt-28 text-cream lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <nav aria-label="Menu mobile" className="flex flex-col">
              {items.map((n, i) => (
                <div key={n.href} className="overflow-hidden border-b border-cream/15">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: EASE }}
                  >
                    <Link
                      href={n.href}
                      className="font-display flex items-baseline justify-between py-3.5 text-[2.1rem] leading-none"
                    >
                      {n.label}
                      <span className="text-xs tracking-widest text-cream/40">0{i + 1}</span>
                    </Link>
                  </motion.div>
                </div>
              ))}
              <div className="overflow-hidden border-b border-cream/15">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.12 + items.length * 0.05, duration: 0.6, ease: EASE }}
                >
                  <Link
                    href={adminSession ? "/admin" : "/admin/login"}
                    className="font-display flex items-center justify-between py-3.5 text-[1.75rem] leading-none text-brand"
                  >
                    <span>{adminSession ? "Dashboard Admin" : "Login Admin (Auto-Fill)"}</span>
                    <ShieldCheck size={20} />
                  </Link>
                </motion.div>
              </div>
            </nav>
            <div className="text-sm text-cream/60">
              <p>{siteConfig.address}</p>
              <p className="mt-2">@{siteConfig.instagram}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
