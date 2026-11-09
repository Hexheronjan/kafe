"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { nav } from "@/config/site";
import { useDemoStore } from "@/lib/demo-store";
import { EASE, cn, formatPhoneID } from "@/lib/utils";
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
        className="fixed inset-x-0 top-0 z-[100] px-2.5 pt-2.5 sm:px-6 sm:pt-4"
      >
        <div
          className={cn(
            "mx-auto flex h-[58px] max-w-7xl items-center justify-between rounded-full px-3.5 transition-all duration-500 sm:h-[64px] sm:px-7",
            overHero
              ? "border border-cream/20 bg-espresso/40 text-cream backdrop-blur-md"
              : "border border-espresso/10 bg-cream/92 text-espresso shadow-[0_12px_36px_-12px_rgba(28,22,18,0.16)] backdrop-blur-xl",
          )}
        >
          <Link href="/" className="group flex items-center gap-2" aria-label={`${siteConfig.name} beranda`}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white shadow-xs transition-transform group-hover:scale-105 sm:h-9 sm:w-9 sm:text-sm">
              {siteConfig.name.slice(0, 1)}
            </span>
            <div className="leading-none">
              <span className="font-display block text-lg tracking-tight sm:text-2xl">
                {siteConfig.name}
                <span className="text-brand">.</span>
              </span>
              <span
                className={cn(
                  "block text-[8px] font-semibold tracking-[0.18em] uppercase sm:text-[9px]",
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

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Tombol Admin tampil di Mobile maupun Desktop */}
            <Link
              href={adminSession ? "/admin" : "/admin/login"}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold tracking-wider uppercase transition-all sm:px-3.5 sm:py-2 sm:text-[11px]",
                overHero
                  ? "border-cream/35 bg-cream/15 text-cream hover:bg-cream hover:text-espresso"
                  : "border-espresso/15 bg-latte/75 text-espresso hover:bg-espresso hover:text-cream",
              )}
            >
              <ShieldCheck size={13} className="text-brand" />
              <span>{adminSession ? adminSession.role : "Admin"}</span>
            </Link>

            {siteConfig.features.onlineOrderEnabled && <CartButton />}

            <button
              className="grid h-9 w-9 place-items-center rounded-full lg:hidden"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} strokeWidth={1.7} /> : <Menu size={20} strokeWidth={1.7} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex flex-col justify-between overflow-y-auto bg-espresso px-6 pt-24 pb-24 text-cream lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <nav aria-label="Menu mobile" className="flex flex-col">
              {items.map((n, i) => (
                <div key={n.href} className="overflow-hidden border-b border-cream/15">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.08 + i * 0.04, duration: 0.5, ease: EASE }}
                  >
                    <Link
                      href={n.href}
                      className="font-display flex items-baseline justify-between py-3 text-[1.75rem] leading-tight sm:text-[2.1rem]"
                    >
                      {n.label}
                      <span className="text-xs tracking-widest text-cream/40">0{i + 1}</span>
                    </Link>
                  </motion.div>
                </div>
              ))}
              <div className="mt-4">
                <Link
                  href={adminSession ? "/admin" : "/admin/login"}
                  className="flex items-center justify-between rounded-2xl border border-brand/40 bg-brand/20 px-4 py-3.5 text-sm font-semibold text-cream"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={17} className="text-brand" />
                    {adminSession ? `Buka Dashboard (${adminSession.role})` : "Login Dashboard Admin (Auto-Fill)"}
                  </span>
                  <span>→</span>
                </Link>
              </div>
            </nav>

            <div className="mt-6 border-t border-cream/15 pt-4 text-xs text-cream/65">
              <p>{siteConfig.address}</p>
              <p className="mt-1.5 font-semibold text-cream">
                WA: {formatPhoneID(siteConfig.whatsapp)} · @{siteConfig.instagram}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
