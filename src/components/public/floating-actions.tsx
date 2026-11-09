"use client";

import { MessageCircle } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";

export function FloatingActions() {
  const { siteConfig } = useDemoStore();
  const waHref = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.waMessage)}`;

  return (
    <a
      href={waHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp Kafe"
      className="fixed right-4 bottom-4 z-[92] flex h-12 items-center gap-2.5 rounded-full bg-espresso px-4.5 text-xs font-semibold tracking-wider text-cream uppercase shadow-xl transition-all hover:-translate-y-0.5 hover:bg-brand-ink sm:right-6 sm:bottom-6 sm:px-5"
    >
      <span className="relative h-2 w-2 rounded-full bg-[#5fbf6a] pulse-dot" />
      <MessageCircle size={17} strokeWidth={1.6} />
      <span>WhatsApp</span>
    </a>
  );
}
