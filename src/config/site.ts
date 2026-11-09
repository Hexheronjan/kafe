/**
 * Data contoh untuk pratinjau UI Prajalinks (Ponorogo).
 * Seluruh data ini terhubung ke DemoStore sehingga dapat diubah langsung
 * dari Dashboard Admin (/admin) maupun panel Kustomisasi Client.
 */

export const site = {
  name: "Prajalinks",
  tagline: "Specialty Coffee & Artisan Bakery",
  description:
    "Ruang kopi modern & artisan bakery di jantung Ponorogo. Biji Arabica Nusantara sangrai segar setiap pekan, pastry mentega Prancis yang dipanggang tiap pagi, dan suasana hangat untuk berkarya maupun berbagi cerita.",
  primaryColor: "#B8733A",
  hero: {
    eyebrow: "Sejak 2019 · Ponorogo, Jawa Timur",
    headline: "Secangkir kopi yang tenang di tengah hari yang cepat.",
    sub: "Dari sangrai kecil mingguan hingga croissant berlapis yang keluar hangat dari oven setiap pukul tujuh pagi di Ponorogo.",
    ctaMenu: "Jelajahi Menu",
    ctaReserve: "Reservasi Meja",
  },
  marquee: [
    "Specialty Arabica",
    "Artisan Croissant",
    "Slow Bar Ponorogo",
    "Single Origin Nusantara",
    "Freshly Baked Daily",
    "Warm Modern Space",
  ],
  address: "Jl. HOS Cokroaminoto No. 48, Bangunsari, Kec. Ponorogo, Kabupaten Ponorogo, Jawa Timur 63416",
  whatsapp: "6281234567890",
  waMessage: "Halo Prajalinks Ponorogo, saya ingin bertanya mengenai menu / reservasi.",
  email: "halo@prajalinks.id",
  instagram: "prajalinks.ponorogo",
  timezone: "Asia/Jakarta",
  mapQuery: "Jl. HOS Cokroaminoto Ponorogo Jawa Timur",
  features: {
    onlineOrderEnabled: true,
    reservationEnabled: true,
    galleryEnabled: true,
    testimonialEnabled: true,
  },
  payment: { bank: "BCA", number: "1234 5678 90", holder: "PT Prajalinks Kopi Nusantara" },
};

/** 0 = Minggu */
export const hours: { day: string; open: string | null; close: string | null }[] = [
  { day: "Minggu", open: "08:00", close: "22:30" },
  { day: "Senin", open: "08:00", close: "22:00" },
  { day: "Selasa", open: "08:00", close: "22:00" },
  { day: "Rabu", open: "08:00", close: "22:00" },
  { day: "Kamis", open: "08:00", close: "22:00" },
  { day: "Jumat", open: "08:00", close: "23:00" },
  { day: "Sabtu", open: "08:00", close: "23:00" },
];

export type Category = { slug: string; name: string };
export const categories: Category[] = [
  { slug: "coffee", name: "Coffee" },
  { slug: "non-coffee", name: "Non Coffee" },
  { slug: "makanan", name: "Makanan" },
  { slug: "snack", name: "Snack" },
  { slug: "dessert", name: "Dessert" },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  badge: "BEST_SELLER" | "RECOMMENDED" | null;
  available: boolean;
  featured: boolean;
  notes?: string[];
  serving?: string;
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "caffe-latte",
    name: "Signature Caffe Latte",
    description: "Double ristretto Arabica Gayo-Ijen dengan susu organik bertekstur microfoam lembut dan sentuhan manis alami.",
    price: 32000,
    category: "coffee",
    image: "/images/latte.jpg",
    badge: "BEST_SELLER",
    available: true,
    featured: true,
    notes: ["Sweet Caramel", "Velvety Milk", "Medium Roast"],
    serving: "Hot / Iced · 240 ml",
  },
  {
    id: "p2",
    slug: "aren-creme-latte",
    name: "Ponorogo Aren Crème Latte",
    description: "Perpaduan espresso house blend, gula aren organik pilihan, dan sea-salt sweet cream di bagian atas.",
    price: 30000,
    category: "coffee",
    image: "/images/latte.jpg",
    badge: "BEST_SELLER",
    available: true,
    featured: true,
    notes: ["Palm Sugar", "Sea Salt Cream", "Bold Espresso"],
    serving: "Iced · 250 ml",
  },
  {
    id: "p3",
    slug: "v60-manual-brew",
    name: "V60 Seasonal Single Origin",
    description: "Seduh manual pilihan barista dari biji terbaik bulan ini (Ijen, Gayo, atau Flores Bajawa), disajikan dengan kartu profil rasa.",
    price: 36000,
    category: "coffee",
    image: "/images/hero.jpg",
    badge: "RECOMMENDED",
    available: true,
    featured: true,
    notes: ["Floral Jasmine", "Citrus", "Clean Finish"],
    serving: "Hot / Japanese Iced · 220 ml",
  },
  {
    id: "p4",
    slug: "butter-croissant",
    name: "French Butter Croissant",
    description: "Lapisan pastry renyah keemasan dengan laminasi mentega Elle & Vire, dipanggang segar setiap pagi pukul 07.00.",
    price: 28000,
    category: "makanan",
    image: "/images/interior.jpg",
    badge: "BEST_SELLER",
    available: true,
    featured: true,
    notes: ["Flaky Layers", "French Butter", "Baked 07:00 AM"],
    serving: "Warm · Disajikan dengan butter & jam",
  },
  {
    id: "p5",
    slug: "tiramisu-slice",
    name: "Artisanal Espresso Tiramisu",
    description: "Krim mascarpone lembut berlapis savoiardi yang direndam cold-brew espresso pekat dan taburan Valrhona cocoa.",
    price: 42000,
    category: "dessert",
    image: "/images/latte.jpg",
    badge: "RECOMMENDED",
    available: true,
    featured: true,
    notes: ["Mascarpone", "Cold Brew Soaked", "Dark Cocoa"],
    serving: "Chilled · 160 g",
  },
  {
    id: "p6",
    slug: "uji-matcha-latte",
    name: "Ceremonial Uji Matcha Oat",
    description: "Matcha ceremonial grade dari Uji, Kyoto yang di-whisk hangat dengan pilihan susu oat premium atau fresh milk.",
    price: 35000,
    category: "non-coffee",
    image: "/images/interior.jpg",
    badge: "RECOMMENDED",
    available: true,
    featured: true,
    notes: ["Umami Rich", "Oat Milk", "Kyoto Grade"],
    serving: "Hot / Iced · 240 ml",
  },
  {
    id: "p7",
    slug: "espresso-single-origin",
    name: "Double Espresso Single Origin",
    description: "Ekstraksi presisi 18 gram biji sangrai medium-dark dengan krema tebal, notes dark chocolate dan roasted hazelnut.",
    price: 24000,
    category: "coffee",
    image: null,
    badge: null,
    available: true,
    featured: false,
    notes: ["Dark Chocolate", "Hazelnut", "Full Body"],
    serving: "Hot · 60 ml + Sparkling Water",
  },
  {
    id: "p8",
    slug: "cokelat-hangat",
    name: "70% Single-Estate Hot Chocolate",
    description: "Cokelat pekat 70% dari perkebunan Jawa Timur yang dilelehkan perlahan dengan susu hangat dan sedikit vanilla bean.",
    price: 31000,
    category: "non-coffee",
    image: null,
    badge: null,
    available: false,
    featured: false,
    notes: ["70% Dark Cacao", "Rich & Creamy", "East Java Origin"],
    serving: "Hot / Iced · 240 ml",
  },
  {
    id: "p9",
    slug: "nasi-ayam-sambal-matah",
    name: "Rice Bowl Ayam Bakar Sambal Matah",
    description: "Paha ayam tanpa tulang panggang rempah madu, sambal matah kecombrang segar, telur onsen, dan nasi hangat.",
    price: 44000,
    category: "makanan",
    image: null,
    badge: "RECOMMENDED",
    available: true,
    featured: false,
    notes: ["Kecombrang", "Onsen Egg", "Smoky Grilled"],
    serving: "Main Course · Porsi Kenyang",
  },
  {
    id: "p10",
    slug: "kentang-goreng-truffle",
    name: "Parmesan Truffle Shoestring Fries",
    description: "Kentang goreng renyah dengan minyak white truffle, parutan keju Grana Padano, dan saus garlic aioli.",
    price: 30000,
    category: "snack",
    image: null,
    badge: "BEST_SELLER",
    available: true,
    featured: false,
    notes: ["White Truffle", "Grana Padano", "Garlic Aioli"],
    serving: "Sharing Plate · 220 g",
  },
  {
    id: "p11",
    slug: "pisang-goreng-karamel",
    name: "Caramelized Banana Fritters",
    description: "Pisang raja matang yang digoreng krispi dengan saus butterscotch gula kelapa dan taburan keju cheddar tua.",
    price: 26000,
    category: "snack",
    image: null,
    badge: null,
    available: true,
    featured: false,
    notes: ["Pisang Raja", "Butterscotch", "Aged Cheddar"],
    serving: "Warm · 4 pcs",
  },
  {
    id: "p12",
    slug: "basque-burnt-cheesecake",
    name: "San Sebastian Burnt Cheesecake",
    description: "Cheesecake panggang suhu tinggi dengan bagian atas karamel kecokelatan dan bagian tengah yang lumer creamy.",
    price: 38000,
    category: "dessert",
    image: null,
    badge: "BEST_SELLER",
    available: true,
    featured: false,
    notes: ["Caramelized Top", "Creamy Center", "Vanilla Bean"],
    serving: "Chilled · 150 g",
  },
];

export type GalleryItem = { id: string; title: string; alt: string; category: string; src: string; span: string };
export const galleryCategories = [
  { slug: "all", name: "Semua" },
  { slug: "interior", name: "Interior" },
  { slug: "exterior", name: "Eksterior" },
  { slug: "food", name: "Makanan & Minuman" },
  { slug: "activity", name: "Kegiatan" },
];
export const gallery: GalleryItem[] = [
  { id: "g1", title: "Sudut Baca & Lounge", alt: "Sudut duduk kulit hangat dengan tanaman hijau dan lampu temaram", category: "interior", src: "/images/interior.jpg", span: "row-span-2" },
  { id: "g2", title: "Signature Latte Pagi", alt: "Cangkir keramik latte dengan tulip microfoam di atas meja kayu", category: "food", src: "/images/latte.jpg", span: "" },
  { id: "g3", title: "Ruang Utama & Slow Bar", alt: "Interior kafe dengan jendela besar dan cahaya matahari pagi", category: "interior", src: "/images/hero.jpg", span: "col-span-2" },
  { id: "g4", title: "Sesi Cupping Mingguan", alt: "Cangkir kopi spesialti di atas meja kayu bersama linen", category: "activity", src: "/images/latte.jpg", span: "" },
  { id: "g5", title: "Espresso Bar Ponorogo", alt: "Meja bar espresso dengan pencahayaan alami pagi hari", category: "exterior", src: "/images/hero.jpg", span: "" },
  { id: "g6", title: "Nuansa Malam Hangat", alt: "Lampu gantung hangat dan dinding bata ekspos", category: "interior", src: "/images/interior.jpg", span: "" },
];

export const testimonials = [
  { name: "Nadia Rahmawati", role: "Creative Director · Ponorogo", rating: 5, text: "Tempat paling nyaman di Ponorogo untuk kerja fokus atau ketemu klien. Aren Crème Latte-nya balance banget, croissant-nya benar-benar berlapis renyah." },
  { name: "Bagas Pratama", role: "Coffee Enthusiast", rating: 5, text: "V60 di sini salah satu yang paling konsisten di Jawa Timur. Baristanya paham betul karakter biji dan ramah menjelaskan notes-nya." },
  { name: "Maya & Dito", role: "Pelanggan Reservasi", rating: 5, text: "Reservasi meja untuk kumpul keluarga lewat websitenya gampang banget, langsung dapat nomor RSV dan meja sudah siap waktu kami tiba." },
  { name: "dr. Sinta Ayu", role: "Pelanggan Rutin", rating: 5, text: "Suasananya tenang, playlist-nya enak, dan tiramisu-nya juara. Rasanya seperti kafe kurasi di kota besar tapi dengan keramahan khas Ponorogo." },
];

export const features = [
  { n: "01", tag: "SMALL BATCH ROASTERY", title: "Sangrai Segar Mingguan", text: "Biji disangrai dalam batch kecil setiap pekan agar aroma dan kompleksitas rasa selalu berada di puncaknya." },
  { n: "02", tag: "ARTISAN PATISSERIE", title: "Dipanggang Pukul Tujuh", text: "Croissant, danish, dan kue dibuat di dapur kami sendiri dan keluar hangat dari oven sebelum pintu kafe dibuka." },
  { n: "03", tag: "ARCHITECTURAL SPACE", title: "Ruang Kerja & Bercerita", text: "Akustik ruang yang tenang, kursi ergonomis, stopkontak di tiap meja, dan Wi-Fi cepat di pusat kota Ponorogo." },
  { n: "04", tag: "DIRECT TRADE", title: "Hulu Petani Nusantara", text: "Bekerja langsung dengan petani Ijen, Gayo, Kintamani, dan Flores dengan transparansi kualitas dan harga yang adil." },
];

export type AboutSection = { type: "STORY" | "CONCEPT" | "VALUES" | "PLACE"; title: string; body: string[]; image?: string | null; alt?: string };
export const about: AboutSection[] = [
  {
    type: "STORY",
    title: "Bermula dari satu mesin espresso di Ponorogo",
    body: [
      "Prajalinks lahir pada 2019 dari sebuah ruang kecil di Jalan HOS Cokroaminoto, Ponorogo. Dua sahabat, satu mesin espresso dua-grup, dan keyakinan bahwa kota ini layak memiliki ruang kopi spesialti yang digarap dengan sepenuh hati.",
      "Hari ini kami menyeduh ratusan cangkir setiap pekan, namun ritme kerja kami tidak berubah: menimbang setiap dosis dengan presisi, memanggang roti setiap subuh, dan menyapa setiap tamu layaknya kawan lama.",
    ],
    image: "/images/hero.jpg",
    alt: "Ruang utama Prajalinks Ponorogo",
  },
  {
    type: "CONCEPT",
    title: "Modern Warm Editorial",
    body: [
      "Kami merancang Prajalinks seperti halaman majalah gaya hidup yang hidup: perpaduan kayu jati hangat, pencahayaan alami yang jatuh lembut dari jendela tinggi, serta aroma mentega panggang dan kopi segar.",
    ],
    image: "/images/interior.jpg",
    alt: "Interior hangat dengan tanaman hijau",
  },
  {
    type: "VALUES",
    title: "Prinsip yang Kami Jaga",
    body: [
      "Kualitas bahan di atas jalan pintas.",
      "Harga yang jujur bagi petani maupun tamu.",
      "Keramahan yang tulus tanpa dibuat-buat.",
      "Ruang yang inklusif untuk bekerja, membaca, dan berbincang.",
    ],
  },
  {
    type: "PLACE",
    title: "Dua Lantai di Jantung Ponorogo",
    body: [
      "Terletak strategis di Jl. HOS Cokroaminoto No. 48, bangunan kami memiliki slow bar terbuka di lantai satu, area taman semi-outdoor yang teduh, serta ruang kerja tenang dan ruang komunal reservasi di lantai dua.",
    ],
    image: "/images/interior.jpg",
    alt: "Sudut duduk Prajalinks Ponorogo",
  },
];

export const nav = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/tentang-kami", label: "Tentang" },
  { href: "/galeri", label: "Galeri" },
  { href: "/reservasi", label: "Reservasi" },
  { href: "/kontak", label: "Kontak" },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
