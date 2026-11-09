import Image from "next/image";
import { Coffee, Croissant, CupSoda, Cookie, CakeSlice, Utensils } from "lucide-react";
import { BLUR, cn } from "@/lib/utils";
import type { Product } from "@/config/site";

const icons: Record<string, typeof Coffee> = {
  coffee: Coffee,
  "non-coffee": CupSoda,
  makanan: Utensils,
  snack: Cookie,
  dessert: CakeSlice,
};

const categoryMeta: Record<string, { label: string; note: string; bg: string }> = {
  coffee: {
    label: "HOUSE ROAST · ARABICA",
    note: "Small-batch · 92°C extraction",
    bg: "from-[#EADCCB] via-[#E2CEB7] to-[#D6BC9E]",
  },
  "non-coffee": {
    label: "BOTANICAL & MILK BAR",
    note: "Hand-whisked · Steamed velvety",
    bg: "from-[#EAE3D2] via-[#DFD5BE] to-[#CFC2A4]",
  },
  makanan: {
    label: "KITCHEN & PATISSERIE",
    note: "Baked & prepared fresh daily",
    bg: "from-[#EFE3D0] via-[#E5D1B5] to-[#D8BC98]",
  },
  snack: {
    label: "SMALL PLATES · SAVORY",
    note: "Warm & crisp from the kitchen",
    bg: "from-[#EDE1CF] via-[#E0CEB3] to-[#D2B996]",
  },
  dessert: {
    label: "ARTISANAL SWEET",
    note: "House recipe · Balanced sweetness",
    bg: "from-[#EADACE] via-[#DEC6B4] to-[#CEAD96]",
  },
};

/** Foto produk, atau placeholder bergaya editorial jika belum ada foto. */
export function ProductImage({
  product,
  sizes,
  className,
  priority,
}: {
  product: Pick<Product, "name" | "image" | "category">;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR}
        className={cn("object-cover", className)}
      />
    );
  }
  const Icon = icons[product.category] ?? Croissant;
  const meta = categoryMeta[product.category] ?? categoryMeta.coffee;

  return (
    <div
      role="img"
      aria-label={`${product.name} — ilustrasi editorial`}
      className={cn(
        "absolute inset-0 flex flex-col justify-between overflow-hidden bg-gradient-to-br p-4 text-espresso select-none",
        meta.bg,
        className,
      )}
    >
      {/* Fine editorial botanical & geometric linework */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-35" viewBox="0 0 200 240" fill="none" aria-hidden>
        <circle cx="100" cy="120" r="68" stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.75" />
        <circle cx="100" cy="120" r="52" stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.5" strokeDasharray="3 3" />
        <line x1="16" y1="36" x2="184" y2="36" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.6" />
        <line x1="16" y1="204" x2="184" y2="204" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.6" />
        <path d="M100 38 C100 85, 65 120, 100 202" stroke="currentColor" strokeOpacity="0.14" strokeWidth="0.75" />
        <path d="M100 38 C100 85, 135 120, 100 202" stroke="currentColor" strokeOpacity="0.14" strokeWidth="0.75" />
      </svg>

      <div className="relative z-10 flex items-center justify-between text-[9px] font-semibold tracking-[0.2em] text-mocha/80 uppercase">
        <span className="truncate">{meta.label}</span>
        <span>PRJ</span>
      </div>

      <div className="relative z-10 my-auto grid place-items-center">
        <div className="grid h-16 w-16 place-items-center rounded-full border border-espresso/20 bg-cream/75 text-brand-ink shadow-xs backdrop-blur-[2px]">
          <Icon strokeWidth={1.3} className="h-7 w-7" />
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-2 text-[10px] text-mocha/85">
        <span className="font-display italic truncate">{meta.note}</span>
        <span className="text-[9px] tracking-widest uppercase opacity-70">No. 01</span>
      </div>
    </div>
  );
}
