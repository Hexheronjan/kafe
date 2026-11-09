"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  ExternalLink,
  FolderKanban,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  MessageSquareQuote,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  X,
} from "lucide-react";
import { gallery, hours } from "@/config/site";
import {
  useDemoStore,
  type DemoOrder,
  type OrderStatus,
} from "@/lib/demo-store";
import { AdminLoginView } from "./login/page";
import { cn, rupiah } from "@/lib/utils";

type AdminTab =
  | "dashboard"
  | "menu"
  | "kategori"
  | "pesanan"
  | "reservasi"
  | "galeri"
  | "testimoni"
  | "tentang"
  | "pengaturan";

/** Aturan transisi status pesanan berurutan sesuai spesifikasi Bagian D */
const VALID_NEXT_ORDER_STATUS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["READY", "CANCELLED"],
  READY: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

function statusBadgeClass(status: string) {
  switch (status) {
    case "PENDING":
    case "PENDING_VERIFICATION":
    case "UNPAID":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "CONFIRMED":
    case "PROCESSING":
      return "bg-sky-100 text-sky-800 border-sky-300";
    case "READY":
    case "COMPLETED":
    case "PAID":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "CANCELLED":
    case "REJECTED":
      return "bg-rose-100 text-rose-800 border-rose-300";
    default:
      return "bg-stone-100 text-stone-700 border-stone-300";
  }
}

function statusLabelID(status: OrderStatus, orderType: "DINE_IN" | "TAKE_AWAY" = "DINE_IN") {
  switch (status) {
    case "PENDING":
      return "Menunggu konfirmasi";
    case "CONFIRMED":
      return "Dikonfirmasi";
    case "PROCESSING":
      return "Sedang diproses";
    case "READY":
      return orderType === "DINE_IN" ? "Siap disajikan" : "Siap diambil";
    case "COMPLETED":
      return "Selesai";
    case "CANCELLED":
      return "Dibatalkan";
  }
}

const WEEKLY_DATA = [
  { day: "Sen", orders: 28, revenue: 1120000 },
  { day: "Sel", orders: 34, revenue: 1380000 },
  { day: "Rab", orders: 31, revenue: 1250000 },
  { day: "Kam", orders: 42, revenue: 1690000 },
  { day: "Jum", orders: 56, revenue: 2340000 },
  { day: "Sab", orders: 74, revenue: 3180000 },
  { day: "Min", orders: 68, revenue: 2890000 },
];

export default function AdminDashboardPage() {
  const {
    siteConfig,
    updateSiteConfig,
    resetSiteConfig,
    menuItems,
    toggleProductAvailable,
    addMenuItem,
    categoryList,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    reservations,
    updateReservationStatus,
    testimonialList,
    aboutList,
    adminSession,
    logoutAdmin,
  } = useDemoStore();

  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");
  const [settingsSubTab, setSettingsSubTab] = useState<
    "identitas" | "tampilan" | "kontak" | "operasional" | "modul" | "pembayaran" | "seo"
  >("identitas");

  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState(32000);
  const [newCat, setNewCat] = useState("coffee");
  const [newDesc, setNewDesc] = useState("");

  const activeMenuCount = menuItems.filter((m) => m.available).length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "PENDING" || o.paymentStatus === "PENDING_VERIFICATION",
  ).length;
  const pendingResCount = reservations.filter((r) => r.status === "PENDING").length;

  const realizedRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status === "COMPLETED" && o.paymentStatus === "PAID")
        .reduce((acc, o) => acc + o.total, 0) + 12450000,
    [orders],
  );

  const navItems: { id: AdminTab; label: string; shortLabel: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard Utama", shortLabel: "Ringkasan", icon: LayoutDashboard },
    { id: "pesanan", label: "Pesanan Online", shortLabel: "Pesanan", icon: ShoppingBag, badge: pendingOrdersCount },
    { id: "reservasi", label: "Reservasi Meja", shortLabel: "Reservasi", icon: CalendarCheck, badge: pendingResCount },
    { id: "menu", label: "Manajemen Menu", shortLabel: "Menu", icon: Coffee },
    { id: "kategori", label: "Kategori Menu", shortLabel: "Kategori", icon: FolderKanban },
    { id: "galeri", label: "Galeri Foto", shortLabel: "Galeri", icon: ImageIcon },
    { id: "testimoni", label: "Testimoni", shortLabel: "Testimoni", icon: MessageSquareQuote },
    { id: "tentang", label: "Tentang Kami", shortLabel: "Tentang", icon: BookOpen },
    { id: "pengaturan", label: "Pengaturan Website", shortLabel: "Pengaturan", icon: Settings },
  ];

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    addMenuItem({
      name: newName.trim(),
      slug,
      price: Number(newPrice) || 28000,
      category: newCat,
      description: newDesc.trim() || "Disiapkan segar setiap hari oleh barista dan dapur kami.",
      image: null,
      badge: "RECOMMENDED",
      available: true,
      featured: true,
    });
    setNewName("");
    setNewDesc("");
    setNewMenuOpen(false);
  };

  if (!adminSession) {
    return <AdminLoginView />;
  }

  return (
    <div className="admin flex min-h-dvh pb-16 lg:pb-0">
      {/* SIDEBAR DESKTOP (Hanya tampil di layar lg ke atas) */}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col justify-between border-r border-[#e4e0d8] bg-white transition-[width] duration-300 lg:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <div>
          <div className="flex h-16 items-center justify-between border-b border-[#e4e0d8] px-4">
            {!collapsed && (
              <div>
                <p className="font-display text-xl font-semibold text-[#1c1612]">
                  {siteConfig.name}
                  <span className="text-brand">.</span>
                </p>
                <p className="text-[10px] tracking-widest text-stone-500 uppercase">Admin Ponorogo</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Perlebar sidebar" : "Lipat sidebar"}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[#e4e0d8] text-stone-600 hover:bg-stone-100"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav aria-label="Menu Admin" className="space-y-1 p-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-colors",
                    active ? "bg-[#1c1612] text-white" : "text-stone-700 hover:bg-stone-100",
                  )}
                >
                  <span className="flex items-center gap-3 truncate">
                    <Icon size={17} strokeWidth={1.6} className="shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1.5 border-t border-[#e4e0d8] p-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            <ExternalLink size={15} className="shrink-0" />
            {!collapsed && <span>Lihat Website Publik</span>}
          </Link>
          <button
            type="button"
            onClick={logoutAdmin}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            <LogOut size={15} className="shrink-0" />
            {!collapsed && <span>Keluar (Logout)</span>}
          </button>
        </div>
      </aside>

      {/* DRAWER SIDEBAR MOBILE */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <aside className="relative z-10 flex h-full w-72 max-w-[82vw] flex-col justify-between bg-white p-4 shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-[#e4e0d8] pb-3">
                <div>
                  <p className="font-display text-xl font-semibold text-[#1c1612]">
                    {siteConfig.name}
                    <span className="text-brand">.</span>
                  </p>
                  <p className="text-[11px] text-stone-500">{adminSession.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Tutup menu"
                  className="grid h-9 w-9 place-items-center rounded-full bg-stone-100"
                >
                  <X size={17} />
                </button>
              </div>

              <nav className="mt-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTab(item.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold",
                        active ? "bg-[#1c1612] text-white" : "text-stone-700 hover:bg-stone-100",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={17} />
                        {item.label}
                      </span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-1.5 border-t border-[#e4e0d8] pt-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-xl bg-stone-100 px-3.5 py-2.5 text-xs font-semibold text-stone-800"
              >
                <ExternalLink size={15} /> Lihat Website Publik
              </Link>
              <button
                type="button"
                onClick={logoutAdmin}
                className="flex w-full items-center gap-2.5 rounded-xl bg-rose-50 px-3.5 py-2.5 text-left text-xs font-semibold text-rose-700"
              >
                <LogOut size={15} /> Keluar dari Sesi ({adminSession.role})
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* AREA KONTEN UTAMA */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header Responsif */}
        <header className="sticky top-0 z-20 border-b border-[#e4e0d8] bg-white">
          <div className="flex h-14 items-center justify-between gap-2 px-4 sm:h-16 sm:px-6">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Buka menu navigasi admin"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#e4e0d8] text-stone-700 lg:hidden"
              >
                <MenuIcon size={17} />
              </button>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-stone-900 sm:text-sm capitalize">
                  {navItems.find((n) => n.id === tab)?.label ?? tab}
                </p>
                <p className="truncate text-[10px] text-stone-500">
                  {siteConfig.name} Ponorogo · Role: {adminSession.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-stone-400" />
                <input
                  type="search"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Cari pesanan, menu, pelanggan…"
                  className="h-9 w-56 rounded-full border border-[#e4e0d8] bg-[#f8f7f4] pr-3 pl-8 text-xs focus:border-stone-800 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setTab("pesanan")}
                aria-label="Notifikasi pesanan dan reservasi baru"
                className="relative flex h-9 items-center gap-1.5 rounded-full border border-[#e4e0d8] bg-[#f8f7f4] px-3 text-xs font-medium text-stone-700 hover:bg-stone-100"
              >
                <Bell size={14} />
                <span className="hidden sm:inline">Antrean</span>
                {pendingOrdersCount + pendingResCount > 0 && (
                  <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                    {pendingOrdersCount + pendingResCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={logoutAdmin}
                title="Logout"
                className="flex h-9 items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Baris Tab Horizontal Scroll untuk Mobile/Tablet */}
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-t border-[#e4e0d8] bg-[#faf9f6] px-4 py-2 lg:hidden">
            {navItems.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    active
                      ? "bg-[#1c1612] text-white"
                      : "border border-[#e4e0d8] bg-white text-stone-700",
                  )}
                >
                  {item.shortLabel}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </header>

        <main className="flex-1 space-y-5 p-4 sm:p-6">
          {/* 1. DASHBOARD UTAMA */}
          {tab === "dashboard" && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4">
                  <p className="text-xs text-stone-500">Menu Aktif</p>
                  <p className="tabular mt-1.5 text-xl font-bold text-stone-900 sm:text-2xl">
                    {activeMenuCount} <span className="text-xs font-normal text-stone-400">/ {menuItems.length}</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4">
                  <p className="text-xs text-stone-500">Total Pesanan</p>
                  <p className="tabular mt-1.5 text-xl font-bold text-stone-900 sm:text-2xl">{orders.length + 312}</p>
                </div>
                <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4">
                  <p className="text-xs text-stone-500">Total Reservasi</p>
                  <p className="tabular mt-1.5 text-xl font-bold text-stone-900 sm:text-2xl">{reservations.length + 48}</p>
                </div>
                <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4">
                  <p className="text-xs text-stone-500">Pesanan Hari Ini</p>
                  <p className="tabular mt-1.5 text-xl font-bold text-stone-900 sm:text-2xl">{orders.length + 24}</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-stone-500">Pendapatan</p>
                    <span
                      title="Pendapatan dihitung hanya dari pesanan berstatus Selesai dengan pembayaran Lunas."
                      className="inline-flex items-center gap-1 text-[10px] text-stone-400"
                    >
                      <HelpCircle size={12} /> Selesai & Lunas
                    </span>
                  </div>
                  <p className="tabular mt-1.5 text-xl font-bold text-emerald-700">{rupiah(realizedRevenue)}</p>
                </div>
              </div>

              {/* Grafik 7 Hari Terakhir & Komposisi Penjualan */}
              <div className="grid gap-5 lg:grid-cols-12">
                <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5 lg:col-span-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-stone-900">
                        Tren Pendapatan & Pesanan (7 Hari Terakhir)
                      </h2>
                      <p className="text-xs text-stone-500">Pesanan berstatus Selesai & pembayaran Lunas</p>
                    </div>
                    <BarChart3 size={18} className="text-stone-400" />
                  </div>

                  <div className="mt-5 grid h-40 grid-cols-7 items-end gap-2 border-b border-[#e4e0d8] pt-4 sm:h-44 sm:gap-3">
                    {WEEKLY_DATA.map((d) => {
                      const heightPct = Math.round((d.revenue / 3300000) * 100);
                      return (
                        <div key={d.day} className="flex h-full flex-col items-center justify-end gap-1.5">
                          <span className="tabular text-[9px] font-medium text-stone-500 sm:text-[10px]">
                            {d.orders}
                          </span>
                          <div
                            style={{ height: `${heightPct}%` }}
                            className="w-full max-w-[38px] rounded-t-lg bg-[#1c1612] transition-all hover:bg-brand"
                            title={`${d.day}: ${rupiah(d.revenue)}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-medium text-stone-600">
                    {WEEKLY_DATA.map((d) => (
                      <span key={d.day}>{d.day}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5 lg:col-span-4">
                  <h2 className="text-sm font-semibold text-stone-900">Komposisi Kategori</h2>
                  <p className="text-xs text-stone-500">Proporsi penjualan per kategori menu</p>
                  <div className="mt-5 space-y-3.5 text-xs">
                    {[
                      { name: "Coffee", pct: 48, color: "bg-[#1c1612]" },
                      { name: "Makanan & Bakery", pct: 24, color: "bg-[#b8733a]" },
                      { name: "Non Coffee", pct: 14, color: "bg-[#6b5444]" },
                      { name: "Dessert & Snack", pct: 14, color: "bg-[#7c8a6e]" },
                    ].map((c) => (
                      <div key={c.name}>
                        <div className="flex justify-between font-medium">
                          <span>{c.name}</span>
                          <span className="tabular">{c.pct}%</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-100">
                          <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pesanan & Reservasi Terbaru */}
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-stone-900">Pesanan Terbaru</h2>
                    <button
                      type="button"
                      onClick={() => setTab("pesanan")}
                      className="text-xs font-semibold text-brand-ink hover:underline"
                    >
                      Kelola Semua →
                    </button>
                  </div>
                  <div className="divide-y divide-[#e4e0d8] text-xs">
                    {orders.slice(0, 4).map((o) => (
                      <div key={o.orderNumber} className="flex flex-wrap items-center justify-between gap-2 py-3">
                        <div>
                          <p className="tabular font-semibold text-stone-900">{o.orderNumber}</p>
                          <p className="text-stone-500">
                            {o.customerName} · {rupiah(o.total)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                              statusBadgeClass(o.status),
                            )}
                          >
                            {statusLabelID(o.status, o.orderType)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(o);
                              setTab("pesanan");
                            }}
                            className="rounded-full border border-[#e4e0d8] px-3 py-1 font-medium hover:bg-stone-100"
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-stone-900">Reservasi Terbaru</h2>
                    <button
                      type="button"
                      onClick={() => setTab("reservasi")}
                      className="text-xs font-semibold text-brand-ink hover:underline"
                    >
                      Kelola Semua →
                    </button>
                  </div>
                  <div className="divide-y divide-[#e4e0d8] text-xs">
                    {reservations.slice(0, 4).map((r) => (
                      <div key={r.reservationNumber} className="flex flex-wrap items-center justify-between gap-2 py-3">
                        <div>
                          <p className="tabular font-semibold text-stone-900">{r.reservationNumber}</p>
                          <p className="text-stone-500">
                            {r.customerName} · {r.visitDate} ({r.visitTime}) · {r.guestCount} tamu
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                              statusBadgeClass(r.status),
                            )}
                          >
                            {r.status}
                          </span>
                          {r.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateReservationStatus(
                                  r.reservationNumber,
                                  "CONFIRMED",
                                  "Dikonfirmasi cepat dari dashboard.",
                                )
                              }
                              className="rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-emerald-800"
                            >
                              Terima
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 2. MANAJEMEN PESANAN & VERIFIKASI BUKTI TRANSFER */}
          {tab === "pesanan" && (
            <div className="grid gap-5 lg:grid-cols-12">
              <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5 lg:col-span-7">
                <h2 className="text-base font-semibold text-stone-900">Manajemen Pesanan Online</h2>
                <p className="text-xs text-stone-500">
                  Pilih salah satu pesanan untuk mengubah status atau memverifikasi bukti pembayaran.
                </p>

                {/* Kartu Mobile (Tampil rapi di HP) */}
                <div className="mt-4 space-y-3 md:hidden">
                  {orders.map((o) => (
                    <div
                      key={o.orderNumber}
                      className="rounded-2xl border border-[#e4e0d8] bg-[#faf9f6] p-3.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="tabular font-bold text-stone-900">{o.orderNumber}</span>
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                            statusBadgeClass(o.status),
                          )}
                        >
                          {statusLabelID(o.status, o.orderType)}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-stone-800">
                        {o.customerName} · {o.orderType === "DINE_IN" ? "Dine In" : "Take Away"}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between border-t border-[#e4e0d8] pt-2.5">
                        <div>
                          <span className="tabular font-bold text-stone-900">{rupiah(o.total)}</span>
                          <span className="ml-2 text-[10px] text-stone-500">({o.paymentStatus})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="rounded-full bg-[#1c1612] px-3.5 py-1.5 text-[11px] font-semibold text-white"
                        >
                          Kelola Pesanan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabel Desktop */}
                <div className="mt-4 hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-xs">
                    <thead className="border-y border-[#e4e0d8] bg-[#f8f7f4] text-stone-600 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">No. Pesanan</th>
                        <th className="py-2.5 px-3">Pelanggan</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Pembayaran</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e0d8]">
                      {orders.map((o) => (
                        <tr key={o.orderNumber} className="hover:bg-stone-50">
                          <td className="tabular py-3 px-3 font-semibold">{o.orderNumber}</td>
                          <td className="py-3 px-3">
                            <p className="font-medium text-stone-900">{o.customerName}</p>
                            <p className="tabular text-stone-500">
                              {o.orderType === "DINE_IN" ? "Dine In" : "Take Away"}
                            </p>
                          </td>
                          <td className="tabular py-3 px-3 font-semibold">{rupiah(o.total)}</td>
                          <td className="py-3 px-3">
                            <span
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                                statusBadgeClass(o.paymentStatus),
                              )}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                                statusBadgeClass(o.status),
                              )}
                            >
                              {statusLabelID(o.status, o.orderType)}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(o)}
                              className="rounded-full border border-stone-300 bg-white px-3 py-1 font-semibold hover:bg-stone-100"
                            >
                              Kelola
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Panel Detail Pesanan & Verifikasi Bukti */}
              <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5 lg:col-span-5">
                {selectedOrder ? (
                  <div>
                    <div className="flex items-center justify-between border-b border-[#e4e0d8] pb-3">
                      <div>
                        <p className="text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
                          Detail & Riwayat Pesanan
                        </p>
                        <h3 className="tabular text-lg font-bold">{selectedOrder.orderNumber}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(null)}
                        className="rounded-full p-1.5 hover:bg-stone-100"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="mt-4 space-y-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Pelanggan</span>
                        <span className="font-semibold">
                          {selectedOrder.customerName} ({selectedOrder.customerPhone})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Jenis Pesanan</span>
                        <span className="font-semibold">
                          {selectedOrder.orderType === "DINE_IN" ? "Dine In" : "Take Away"}
                        </span>
                      </div>
                      <div className="border-t border-[#e4e0d8] pt-3">
                        <p className="mb-2 font-semibold text-stone-700">Rincian Item (Snapshot Harga):</p>
                        {selectedOrder.items.map((item) => (
                          <div key={item.productId} className="flex justify-between py-1">
                            <span>
                              {item.qty}× {item.name}
                            </span>
                            <span className="tabular font-medium">{rupiah(item.price * item.qty)}</span>
                          </div>
                        ))}
                        <div className="mt-2 flex justify-between border-t border-[#e4e0d8] pt-2 text-sm font-bold">
                          <span>Total</span>
                          <span className="tabular">{rupiah(selectedOrder.total)}</span>
                        </div>
                      </div>

                      <div className="border-t border-[#e4e0d8] pt-4">
                        <p className="font-semibold text-stone-700">
                          Status Saat Ini: {statusLabelID(selectedOrder.status, selectedOrder.orderType)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-stone-500">
                          Pilih status berikutnya yang diizinkan:
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {VALID_NEXT_ORDER_STATUS[selectedOrder.status].length === 0 ? (
                            <span className="italic text-stone-400">Status bersifat final.</span>
                          ) : (
                            VALID_NEXT_ORDER_STATUS[selectedOrder.status].map((nextSt) => (
                              <button
                                key={nextSt}
                                type="button"
                                onClick={() => {
                                  updateOrderStatus(selectedOrder.orderNumber, nextSt);
                                  setSelectedOrder({ ...selectedOrder, status: nextSt });
                                }}
                                className={cn(
                                  "rounded-full px-3.5 py-1.5 text-xs font-semibold text-white",
                                  nextSt === "CANCELLED"
                                    ? "bg-rose-600 hover:bg-rose-700"
                                    : "bg-[#1c1612] hover:bg-stone-800",
                                )}
                              >
                                → {statusLabelID(nextSt, selectedOrder.orderType)}
                              </button>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="border-t border-[#e4e0d8] pt-4">
                        <p className="font-semibold text-stone-700">
                          Verifikasi Pembayaran ({selectedOrder.paymentMethod})
                        </p>
                        <p className="mt-1 text-stone-500">
                          Status Bayar: <strong>{selectedOrder.paymentStatus}</strong>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedOrder.paymentStatus !== "PAID" && (
                            <button
                              type="button"
                              onClick={() => {
                                updatePaymentStatus(selectedOrder.orderNumber, "PAID");
                                setSelectedOrder({ ...selectedOrder, paymentStatus: "PAID" });
                              }}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-3.5 py-1.5 font-semibold text-white hover:bg-emerald-800"
                            >
                              <Check size={14} /> Tandai Lunas
                            </button>
                          )}
                          {selectedOrder.paymentMethod === "BANK_TRANSFER" &&
                            selectedOrder.paymentStatus !== "REJECTED" && (
                              <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
                                <input
                                  type="text"
                                  value={rejectReasonInput}
                                  onChange={(e) => setRejectReasonInput(e.target.value)}
                                  placeholder="Alasan penolakan bukti (wajib)…"
                                  className="flex-1 rounded-xl border border-[#e4e0d8] px-3 py-2 text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!rejectReasonInput.trim()) return;
                                    updatePaymentStatus(
                                      selectedOrder.orderNumber,
                                      "REJECTED",
                                      rejectReasonInput.trim(),
                                    );
                                    setSelectedOrder({
                                      ...selectedOrder,
                                      paymentStatus: "REJECTED",
                                      rejectReason: rejectReasonInput.trim(),
                                    });
                                    setRejectReasonInput("");
                                  }}
                                  className="rounded-full bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700"
                                >
                                  Tolak Bukti
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid h-48 place-items-center text-center text-xs text-stone-400">
                    Pilih salah satu pesanan untuk memverifikasi pembayaran atau mengubah status pesanan.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. MANAJEMEN RESERVASI */}
          {tab === "reservasi" && (
            <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5">
              <h2 className="text-base font-semibold text-stone-900">Manajemen Reservasi Meja</h2>
              <p className="text-xs text-stone-500">
                Konfirmasi manual oleh admin dan kirim pesan WhatsApp langsung ke pelanggan.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {reservations.map((r) => (
                  <div
                    key={r.reservationNumber}
                    className="rounded-2xl border border-[#e4e0d8] bg-[#faf9f6] p-4 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="tabular font-bold text-stone-900">{r.reservationNumber}</span>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                          statusBadgeClass(r.status),
                        )}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-stone-900">{r.customerName}</p>
                    <p className="tabular text-stone-600">
                      WA: {r.customerPhone} · {r.visitDate} ({r.visitTime} WIB) · {r.guestCount} tamu
                    </p>
                    {r.note && <p className="mt-1.5 italic text-stone-500">“{r.note}”</p>}

                    <div className="mt-3 flex flex-wrap gap-2 border-t border-[#e4e0d8] pt-3">
                      {r.status === "PENDING" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateReservationStatus(
                                r.reservationNumber,
                                "CONFIRMED",
                                "Meja telah disiapkan sesuai jadwal.",
                              )
                            }
                            className="rounded-full bg-emerald-700 px-3 py-1.5 font-semibold text-white hover:bg-emerald-800"
                          >
                            Konfirmasi Meja
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateReservationStatus(
                                r.reservationNumber,
                                "REJECTED",
                                "Kapasitas meja pada jam tersebut sudah penuh.",
                              )
                            }
                            className="rounded-full bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-700"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      <a
                        href={`https://wa.me/${r.customerPhone}?text=${encodeURIComponent(
                          `Halo ${r.customerName}, status reservasi Anda (${r.reservationNumber}) di ${siteConfig.name} Ponorogo pada ${r.visitDate} pukul ${r.visitTime} WIB kini: ${r.status}.`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-[#e4e0d8] bg-white px-3 py-1.5 font-semibold hover:bg-stone-100"
                      >
                        Kirim WA
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MANAJEMEN MENU */}
          {tab === "menu" && (
            <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">Manajemen Menu</h2>
                  <p className="text-xs text-stone-500">
                    Toggle ketersediaan menu langsung memperbarui tampilan di halaman publik `/menu`.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1c1612] px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
                >
                  <Plus size={14} /> Tambah Menu Baru
                </button>
              </div>

              {newMenuOpen && (
                <form
                  onSubmit={handleAddMenu}
                  className="mt-4 grid gap-3 rounded-2xl border border-[#e4e0d8] bg-[#f8f7f4] p-4 text-xs sm:grid-cols-4"
                >
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nama menu (contoh: Piccolo Latte)"
                    className="rounded-xl border border-[#e4e0d8] bg-white px-3 py-2"
                  />
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    placeholder="Harga Rupiah"
                    className="tabular rounded-xl border border-[#e4e0d8] bg-white px-3 py-2"
                  />
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="rounded-xl border border-[#e4e0d8] bg-white px-3 py-2"
                  >
                    {categoryList.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
                  >
                    Simpan Menu
                  </button>
                </form>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col justify-between rounded-2xl border border-[#e4e0d8] bg-[#faf9f6] p-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                          {m.category}
                        </span>
                        <span className="tabular font-bold text-stone-900">{rupiah(m.price)}</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-stone-900">{m.name}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-[#e4e0d8] pt-3">
                      <span className="text-[11px] text-stone-500">{m.badge ?? "Tanpa Badge"}</span>
                      <button
                        type="button"
                        onClick={() => toggleProductAvailable(m.id)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
                          m.available
                            ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                            : "border-rose-300 bg-rose-100 text-rose-800",
                        )}
                      >
                        {m.available ? "Tersedia" : "Habis"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. MANAJEMEN KATEGORI */}
          {tab === "kategori" && (
            <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5">
              <h2 className="text-base font-semibold text-stone-900">Manajemen Kategori</h2>
              <p className="text-xs text-stone-500">
                Kategori yang masih memiliki produk tidak dapat dihapus permanen agar riwayat tetap utuh.
              </p>
              <div className="mt-4 divide-y divide-[#e4e0d8] text-xs">
                {categoryList.map((c, idx) => {
                  const count = menuItems.filter((m) => m.category === c.slug).length;
                  return (
                    <div key={c.slug} className="flex items-center justify-between py-3">
                      <div>
                        <span className="font-semibold text-stone-900">
                          {idx + 1}. {c.name}
                        </span>
                        <span className="ml-2 text-stone-400">({c.slug})</span>
                      </div>
                      <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700">
                        {count} produk
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6, 7, 8. GALERI, TESTIMONI, TENTANG KAMI */}
          {(tab === "galeri" || tab === "testimoni" || tab === "tentang") && (
            <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5">
              <h2 className="text-base font-semibold text-stone-900 capitalize">Modul {tab}</h2>
              <p className="mt-1 text-xs text-stone-500">
                Seluruh item yang ditandai <strong>Published</strong> tampil otomatis di website publik.
              </p>

              {tab === "galeri" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
                  {gallery.map((g) => (
                    <div key={g.id} className="rounded-2xl border border-[#e4e0d8] p-3.5">
                      <p className="font-semibold">{g.title}</p>
                      <p className="mt-0.5 text-stone-500">Alt: {g.alt}</p>
                      <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase">
                        Published · {g.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "testimoni" && (
                <div className="mt-4 divide-y divide-[#e4e0d8] text-xs">
                  {testimonialList.map((t, i) => (
                    <div key={i} className="flex justify-between gap-4 py-3">
                      <div>
                        <p className="font-semibold">
                          {t.name} ({t.rating}★)
                        </p>
                        <p className="mt-0.5 text-stone-600">{t.text}</p>
                      </div>
                      <span className="self-start rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        Tampil
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "tentang" && (
                <div className="mt-4 space-y-3 text-xs">
                  {aboutList.map((a, i) => (
                    <div key={i} className="rounded-2xl border border-[#e4e0d8] p-4">
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold">
                        Tipe: {a.type}
                      </span>
                      <p className="mt-1.5 text-sm font-semibold">{a.title}</p>
                      <p className="mt-1 text-stone-600">{a.body.join(" ")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 9. PENGATURAN WEBSITE (MULTI-TAB) */}
          {tab === "pengaturan" && (
            <div className="rounded-2xl border border-[#e4e0d8] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e0d8] pb-4">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Pengaturan Website (White-Label Multi-Client)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Perubahan identitas, warna utama, dan modul langsung diterapkan ke website publik.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetSiteConfig}
                  className="rounded-full border border-[#e4e0d8] px-3.5 py-1.5 text-xs font-medium hover:bg-stone-100"
                >
                  Reset ke Default
                </button>
              </div>

              <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto border-b border-[#e4e0d8] pb-3 text-xs">
                {(
                  [
                    ["identitas", "Identitas & Hero"],
                    ["tampilan", "Tampilan & Warna"],
                    ["kontak", "Kontak & Lokasi"],
                    ["operasional", "Jam Operasional"],
                    ["modul", "Modul Fitur"],
                    ["pembayaran", "Rekening"],
                    ["seo", "SEO"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSettingsSubTab(key)}
                    className={cn(
                      "shrink-0 rounded-full px-3.5 py-1.5 font-semibold transition-colors",
                      settingsSubTab === key
                        ? "bg-[#1c1612] text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-5 max-w-2xl space-y-4 text-xs">
                {settingsSubTab === "identitas" && (
                  <>
                    <div>
                      <label className="block font-semibold text-stone-700">Nama Kafe</label>
                      <input
                        type="text"
                        value={siteConfig.name}
                        onChange={(e) => updateSiteConfig({ name: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700">Tagline</label>
                      <input
                        type="text"
                        value={siteConfig.tagline}
                        onChange={(e) => updateSiteConfig({ tagline: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700">Headline Hero Beranda</label>
                      <input
                        type="text"
                        value={siteConfig.hero.headline}
                        onChange={(e) =>
                          updateSiteConfig({
                            hero: { ...siteConfig.hero, headline: e.target.value },
                          })
                        }
                        className="mt-1 w-full rounded-xl border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                  </>
                )}

                {settingsSubTab === "tampilan" && (
                  <div>
                    <label className="block font-semibold text-stone-700">
                      Warna Aksen Utama (Hex CSS Variable `--brand`)
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        type="color"
                        value={siteConfig.primaryColor}
                        onChange={(e) => updateSiteConfig({ primaryColor: e.target.value })}
                        className="h-10 w-16 cursor-pointer rounded-xl border border-[#e4e0d8]"
                      />
                      <input
                        type="text"
                        value={siteConfig.primaryColor}
                        onChange={(e) => updateSiteConfig({ primaryColor: e.target.value })}
                        className="tabular rounded-xl border border-[#e4e0d8] px-3 py-2 uppercase"
                      />
                    </div>
                  </div>
                )}

                {settingsSubTab === "kontak" && (
                  <>
                    <div>
                      <label className="block font-semibold text-stone-700">Alamat Lengkap Ponorogo</label>
                      <input
                        type="text"
                        value={siteConfig.address}
                        onChange={(e) => updateSiteConfig({ address: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700">Nomor WhatsApp</label>
                      <input
                        type="text"
                        value={siteConfig.whatsapp}
                        onChange={(e) => updateSiteConfig({ whatsapp: e.target.value })}
                        className="tabular mt-1 w-full rounded-xl border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                  </>
                )}

                {settingsSubTab === "operasional" && (
                  <div className="divide-y divide-[#e4e0d8]">
                    {hours.map((h) => (
                      <div key={h.day} className="flex justify-between py-2">
                        <span className="font-semibold">{h.day}</span>
                        <span className="tabular text-stone-600">
                          {h.open} – {h.close} WIB ({siteConfig.timezone})
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {settingsSubTab === "modul" && (
                  <div className="space-y-2.5">
                    {(
                      [
                        ["onlineOrderEnabled", "Modul Pemesanan Online (Keranjang & Checkout)"],
                        ["reservationEnabled", "Modul Reservasi Meja Online"],
                        ["galleryEnabled", "Modul Galeri Foto"],
                        ["testimonialEnabled", "Modul Testimoni Pelanggan"],
                      ] as const
                    ).map(([k, label]) => (
                      <label key={k} className="flex items-center gap-2.5 rounded-xl border border-[#e4e0d8] p-3">
                        <input
                          type="checkbox"
                          checked={siteConfig.features[k]}
                          onChange={(e) =>
                            updateSiteConfig({
                              features: { ...siteConfig.features, [k]: e.target.checked },
                            })
                          }
                        />
                        <span className="font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {settingsSubTab === "pembayaran" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-stone-700">Nama Bank</label>
                      <input
                        type="text"
                        value={siteConfig.payment.bank}
                        onChange={(e) =>
                          updateSiteConfig({ payment: { ...siteConfig.payment, bank: e.target.value } })
                        }
                        className="mt-1 w-full rounded-xl border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700">Nomor Rekening</label>
                      <input
                        type="text"
                        value={siteConfig.payment.number}
                        onChange={(e) =>
                          updateSiteConfig({ payment: { ...siteConfig.payment, number: e.target.value } })
                        }
                        className="tabular mt-1 w-full rounded-xl border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                  </div>
                )}

                {settingsSubTab === "seo" && (
                  <div>
                    <label className="block font-semibold text-stone-700">Deskripsi Default Meta SEO</label>
                    <textarea
                      rows={3}
                      value={siteConfig.description}
                      onChange={(e) => updateSiteConfig({ description: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#e4e0d8] px-3 py-2"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation Bar untuk Admin Mobile */}
        <nav
          aria-label="Navigasi Cepat Admin Mobile"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-[#e4e0d8] bg-white/95 py-1.5 backdrop-blur-md lg:hidden"
        >
          {(
            [
              { id: "dashboard", label: "Ringkasan", icon: LayoutDashboard },
              { id: "pesanan", label: "Pesanan", icon: ShoppingBag, badge: pendingOrdersCount },
              { id: "reservasi", label: "Reservasi", icon: CalendarCheck, badge: pendingResCount },
              { id: "menu", label: "Menu", icon: Coffee },
              { id: "pengaturan", label: "Tema", icon: Settings },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold",
                  active ? "text-[#1c1612]" : "text-stone-400",
                )}
              >
                <Icon size={17} strokeWidth={active ? 2.2 : 1.6} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
