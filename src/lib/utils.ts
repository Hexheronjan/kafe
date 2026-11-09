import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rupiah(n: number) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}

export const EASE = [0.22, 1, 0.36, 1] as const;

/** blur-up placeholder (cream) */
export const BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzEwJz48cmVjdCB3aWR0aD0nOCcgaGVpZ2h0PScxMCcgZmlsbD0nI0VBRENDQicvPjwvc3ZnPg==";
