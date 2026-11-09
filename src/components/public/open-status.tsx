"use client";

import { useEffect, useState } from "react";
import { hours, site } from "@/config/site";
import { cn } from "@/lib/utils";

const DAY = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function nowIn(tz: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const wd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(get("weekday"));
  return { day: wd, minutes: parseInt(get("hour")) * 60 + parseInt(get("minute")) };
}
const toMin = (s: string) => parseInt(s.slice(0, 2)) * 60 + parseInt(s.slice(3));

export function getStatus() {
  const { day, minutes } = nowIn(site.timezone);
  const h = hours[day];
  if (!h.open || !h.close) return { open: false, label: "Tutup hari ini" };
  const o = toMin(h.open);
  const c = toMin(h.close);
  if (minutes >= o && minutes < c) return { open: true, label: `Buka · tutup ${h.close} WIB` };
  if (minutes < o) return { open: false, label: `Tutup · buka ${h.open} WIB` };
  const next = hours[(day + 1) % 7];
  return { open: false, label: next.open ? `Tutup · buka besok ${next.open}` : "Tutup" };
}

export function OpenStatus({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const [s, setS] = useState<ReturnType<typeof getStatus> | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setS(getStatus());
    const t = setInterval(() => setS(getStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={cn("inline-flex min-h-6 items-center gap-2.5 text-[13px] font-medium", tone === "light" ? "text-cream" : "text-espresso", className)} aria-live="polite">
      {s && (
        <>
          <span className={cn("relative h-2.5 w-2.5 rounded-full", s.open ? "pulse-dot bg-[#5fbf6a]" : "bg-[#c9615a]")} />
          {s.label}
        </>
      )}
    </div>
  );
}

export function TodayBadge() {
  const [d, setD] = useState(-1);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setD(nowIn(site.timezone).day);
  }, []);
  return <span data-day={d >= 0 ? DAY[d] : ""} hidden />;
}
