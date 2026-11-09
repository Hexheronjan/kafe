import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rupiah(n: number) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}

/** Format 6285151951806 -> +62 851-5195-1806 */
export function formatPhoneID(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("62") && digits.length >= 11) {
    const rest = digits.slice(2);
    const p1 = rest.slice(0, 3);
    const p2 = rest.slice(3, 7);
    const p3 = rest.slice(7);
    return `+62 ${p1}-${p2}-${p3}`;
  }
  return raw.startsWith("+") ? raw : `+${raw}`;
}

export const EASE = [0.22, 1, 0.36, 1] as const;

/** blur-up placeholder (cream) */
export const BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzEwJz48cmVjdCB3aWR0aD0nOCcgaGVpZ2h0PScxMCcgZmlsbD0nI0VBRENDQicvPjwvc3ZnPg==";
