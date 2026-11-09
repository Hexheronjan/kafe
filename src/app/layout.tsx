import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/motion/motion-provider";
import { site, hours } from "@/config/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${site.name} — ${site.tagline} Ponorogo`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline} Ponorogo`,
    description: site.description,
    type: "website",
    locale: "id_ID",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: site.name }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: site.name,
    description: site.description,
    telephone: `+${site.whatsapp}`,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Ponorogo",
      addressRegion: "Jawa Timur",
      postalCode: "63416",
      addressCountry: "ID",
    },
    servesCuisine: ["Specialty Coffee", "Artisan Bakery", "Indonesian"],
    priceRange: "Rp 24.000 - Rp 44.000",
    openingHoursSpecification: hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: h.open,
      closes: h.close,
    })),
  };

  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col">
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
