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
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");
  const [settingsSubTab, setSettingsSubTab] = useState<
    "identitas" | "tampilan" | "kontak" | "operasional" | "modul" | "pembayaran" | "seo"
  >("identitas");

  // State tambah menu baru
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState(32000);
  const [newCat, setNewCat] = useState("coffee");
  const [newDesc, setNewDesc] = useState("");

  // Statistik utama
  const activeMenuCount = menuItems.filter((m) => m.available).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING" || o.paymentStatus === "PENDING_VERIFICATION").length;
  const pendingResCount = reservations.filter((r) => r.status === "PENDING").length;

  // Pendapatan dihitung dari pesanan berstatus Selesai dengan pembayaran Lunas
  const realizedRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status === "COMPLETED" && o.paymentStatus === "PAID")
        .reduce((acc, o) => acc + o.total, 0) + 12450000,
    [orders],
  );

  const navItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard Utama", icon: LayoutDashboard },
    { id: "pesanan", label: "Pesanan Online", icon: ShoppingBag, badge: pendingOrdersCount },
    { id: "reservasi", label: "Reservasi Meja", icon: CalendarCheck, badge: pendingResCount },
    { id: "menu", label: "Manajemen Menu", icon: Coffee },
    { id: "kategori", label: "Kategori Menu", icon: FolderKanban },
    { id: "galeri", label: "Galeri Foto", icon: ImageIcon },
    { id: "testimoni", label: "Testimoni", icon: MessageSquareQuote },
    { id: "tentang", label: "Tentang Kami", icon: BookOpen },
    { id: "pengaturan", label: "Pengaturan Website", icon: Settings },
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

  // Jika belum login, tampilkan halaman Login Admin yang otomatis terisi
  if (!adminSession) {
    return <AdminLoginView />;
  }

  return (
    <div className="admin flex min-h-dvh">
      {/* SIDEBAR BISA DILIPAT */}
      <aside
        className={cn(
          "sticky top-0 flex h-dvh shrink-0 flex-col justify-between border-r border-[#e4e0d8] bg-white transition-[width] duration-300",
          collapsed ? "w-[72px]" : "w-64",
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
                <p className="text-[10px] tracking-widest text-stone-500 uppercase">Admin Workspace</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Perlebar sidebar" : "Lipat sidebar"}
              className="grid h-9 w-9 place-items-center rounded border border-[#e4e0d8] text-stone-600 hover:bg-stone-100"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav aria-label="Menu Admin" className="p-2.5 space-y-1">
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
                    "flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-xs font-medium transition-colors",
                    active
                      ? "bg-[#1c1612] text-white"
                      : "text-stone-700 hover:bg-stone-100",
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

        <div className="border-t border-[#e4e0d8] p-3 space-y-1.5">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            <ExternalLink size={15} className="shrink-0" />
            {!collapsed && <span>Lihat Website Publik</span>}
          </Link>
          <button
            type="button"
            onClick={logoutAdmin}
            className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-left text-xs text-rose-700 hover:bg-rose-50"
          >
            <LogOut size={15} className="shrink-0" />
            {!collapsed && <span>Keluar (Logout)</span>}
          </button>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header dengan Breadcrumb, Pencarian Global & Badge Notifikasi */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-[#e4e0d8] bg-white px-6">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-stone-900 capitalize">{tab}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Cari nomor pesanan, menu, pelanggan…"
                className="h-9 w-64 rounded border border-[#e4e0d8] bg-[#f8f7f4] pr-3 pl-8 text-xs focus:border-stone-800 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setTab("pesanan")}
              aria-label="Notifikasi pesanan dan reservasi baru"
              className="relative flex h-9 items-center gap-1.5 rounded border border-[#e4e0d8] bg-[#f8f7f4] px-3 text-xs font-medium text-stone-700 hover:bg-stone-100"
            >
              <Bell size={14} />
              <span className="hidden md:inline">Antrean Baru</span>
              {pendingOrdersCount + pendingResCount > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {pendingOrdersCount + pendingResCount}
                </span>
              )}
            </button>

            <div className="hidden items-center gap-2 border-l border-[#e4e0d8] pl-3 text-xs lg:flex">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1c1612] text-[11px] font-bold text-white">
                {adminSession.role.slice(0, 2)}
              </span>
              <div>
                <p className="font-semibold leading-none text-stone-900">{adminSession.name}</p>
                <p className="text-[10px] text-stone-500">Role: {adminSession.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* 1. DASHBOARD UTAMA */}
          {tab === "dashboard" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded border border-[#e4e0d8] bg-white p-4">
                  <p className="text-xs text-stone-500">Total Menu Aktif</p>
                  <p className="tabular mt-2 text-2xl font-bold text-stone-900">
                    {activeMenuCount} <span className="text-xs font-normal text-stone-400">/ {menuItems.length}</span>
                  </p>
                </div>
                <div className="rounded border border-[#e4e0d8] bg-white p-4">
                  <p className="text-xs text-stone-500">Total Pesanan</p>
                  <p className="tabular mt-2 text-2xl font-bold text-stone-900">{orders.length + 312}</p>
                </div>
                <div className="rounded border border-[#e4e0d8] bg-white p-4">
                  <p className="text-xs text-stone-500">Total Reservasi</p>
                  <p className="tabular mt-2 text-2xl font-bold text-stone-900">{reservations.length + 48}</p>
                </div>
                <div className="rounded border border-[#e4e0d8] bg-white p-4">
                  <p className="text-xs text-stone-500">Pesanan Hari Ini</p>
                  <p className="tabular mt-2 text-2xl font-bold text-stone-900">{orders.length + 24}</p>
                </div>
                <div className="rounded border border-[#e4e0d8] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-stone-500">Pendapatan</p>
                    <span
                      title="Pendapatan dihitung hanya dari pesanan berstatus Selesai dengan pembayaran Lunas."
                      className="inline-flex cursor-help items-center gap-1 text-[10px] text-stone-400"
                    >
                      <HelpCircle size={13} /> Selesai & Lunas
                    </span>
                  </div>
                  <p className="tabular mt-2 text-xl font-bold text-emerald-700">{rupiah(realizedRevenue)}</p>
                </div>
              </div>

              {/* Grafik 7 Hari Terakhir & Komposisi Penjualan */}
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="rounded border border-[#e4e0d8] bg-white p-5 lg:col-span-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-stone-900">
                        Tren Pendapatan & Pesanan (7 Hari Terakhir)
                      </h2>
                      <p className="text-xs text-stone-500">
                        Pesanan berstatus Selesai & pembayaran Lunas
                      </p>
                    </div>
                    <BarChart3 size={18} className="text-stone-400" />
                  </div>

                  <div className="mt-6 grid grid-cols-7 items-end gap-3 h-44 pt-4 border-b border-[#e4e0d8]">
                    {WEEKLY_DATA.map((d) => {
                      const heightPct = Math.round((d.revenue / 3300000) * 100);
                      return (
                        <div key={d.day} className="flex h-full flex-col items-center justify-end gap-2">
                          <span className="tabular text-[10px] font-medium text-stone-500">
                            {d.orders} psn
                          </span>
                          <div
                            style={{ height: `${heightPct}%` }}
                            className="w-full max-w-[42px] rounded-t bg-[#1c1612] transition-all hover:bg-brand"
                            title={`${d.day}: ${rupiah(d.revenue)}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2 grid grid-cols-7 text-center text-xs font-medium text-stone-600">
                    {WEEKLY_DATA.map((d) => (
                      <span key={d.day}>{d.day}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded border border-[#e4e0d8] bg-white p-5 lg:col-span-4">
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
                        <div className="mt-1.5 h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                          <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pesanan & Reservasi Terbaru dengan Aksi Cepat */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded border border-[#e4e0d8] bg-white p-5">
                  <div className="flex items-center justify-between mb-4">
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
                      <div key={o.orderNumber} className="flex items-center justify-between py-3 gap-2">
                        <div>
                          <p className="tabular font-semibold text-stone-900">{o.orderNumber}</p>
                          <p className="text-stone-500">
                            {o.customerName} · {rupiah(o.total)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn("border px-2 py-0.5 text-[10px] font-semibold rounded", statusBadgeClass(o.status))}>
                            {statusLabelID(o.status, o.orderType)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(o);
                              setTab("pesanan");
                            }}
                            className="rounded border border-[#e4e0d8] px-2.5 py-1 font-medium hover:bg-stone-100"
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded border border-[#e4e0d8] bg-white p-5">
                  <div className="flex items-center justify-between mb-4">
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
                      <div key={r.reservationNumber} className="flex items-center justify-between py-3 gap-2">
                        <div>
                          <p className="tabular font-semibold text-stone-900">{r.reservationNumber}</p>
                          <p className="text-stone-500">
                            {r.customerName} · {r.visitDate} ({r.visitTime}) · {r.guestCount} tamu
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={cn("border px-2 py-0.5 text-[10px] font-semibold rounded", statusBadgeClass(r.status))}>
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
                              className="rounded bg-emerald-700 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-800"
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
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="rounded border border-[#e4e0d8] bg-white p-5 lg:col-span-7">
                <h2 className="text-base font-semibold text-stone-900">Manajemen Pesanan Online</h2>
                <p className="text-xs text-stone-500">
                  Tombol status hanya mengizinkan transisi berikutnya yang valid sesuai aturan server.
                </p>

                <div className="mt-4 overflow-x-auto">
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
                            <p className="tabular text-stone-500">{o.orderType === "DINE_IN" ? "Dine In" : "Take Away"}</p>
                          </td>
                          <td className="tabular py-3 px-3 font-semibold">{rupiah(o.total)}</td>
                          <td className="py-3 px-3">
                            <span className={cn("border px-2 py-0.5 text-[10px] font-semibold rounded", statusBadgeClass(o.paymentStatus))}>
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={cn("border px-2 py-0.5 text-[10px] font-semibold rounded", statusBadgeClass(o.status))}>
                              {statusLabelID(o.status, o.orderType)}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(o)}
                              className="rounded border border-stone-300 bg-white px-2.5 py-1 font-semibold hover:bg-stone-100"
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

              {/* Panel Samping Detail Pesanan & Verifikasi Bukti */}
              <div className="rounded border border-[#e4e0d8] bg-white p-5 lg:col-span-5">
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
                        className="rounded p-1 hover:bg-stone-100"
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
                        <p className="font-semibold text-stone-700 mb-2">Rincian Item (Snapshot Harga):</p>
                        {selectedOrder.items.map((item) => (
                          <div key={item.productId} className="flex justify-between py-1">
                            <span>
                              {item.qty}× {item.name}
                            </span>
                            <span className="tabular font-medium">{rupiah(item.price * item.qty)}</span>
                          </div>
                        ))}
                        <div className="mt-2 flex justify-between border-t border-[#e4e0d8] pt-2 font-bold text-sm">
                          <span>Total</span>
                          <span className="tabular">{rupiah(selectedOrder.total)}</span>
                        </div>
                      </div>

                      {/* Transisi Status Pesanan */}
                      <div className="border-t border-[#e4e0d8] pt-4">
                        <p className="font-semibold text-stone-700">
                          Status Saat Ini: {statusLabelID(selectedOrder.status, selectedOrder.orderType)}
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          Pilih status berikutnya yang diizinkan:
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {VALID_NEXT_ORDER_STATUS[selectedOrder.status].length === 0 ? (
                            <span className="text-stone-400 italic">Status bersifat final.</span>
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
                                  "rounded px-3 py-1.5 text-xs font-semibold text-white",
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

                      {/* Verifikasi Pembayaran */}
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
                              className="inline-flex items-center gap-1 rounded bg-emerald-700 px-3 py-1.5 font-semibold text-white hover:bg-emerald-800"
                            >
                              <Check size={14} /> Tandai Lunas
                            </button>
                          )}
                          {selectedOrder.paymentMethod === "BANK_TRANSFER" &&
                            selectedOrder.paymentStatus !== "REJECTED" && (
                              <div className="flex w-full gap-2 mt-2">
                                <input
                                  type="text"
                                  value={rejectReasonInput}
                                  onChange={(e) => setRejectReasonInput(e.target.value)}
                                  placeholder="Alasan penolakan bukti (wajib)…"
                                  className="flex-1 rounded border border-[#e4e0d8] px-2.5 py-1 text-xs"
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
                                  className="rounded bg-rose-600 px-3 py-1 font-semibold text-white hover:bg-rose-700"
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
                  <div className="grid h-64 place-items-center text-center text-xs text-stone-400">
                    Pilih salah satu pesanan di tabel untuk memverifikasi pembayaran atau mengubah status pesanan.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. MANAJEMEN RESERVASI */}
          {tab === "reservasi" && (
            <div className="rounded border border-[#e4e0d8] bg-white p-5">
              <h2 className="text-base font-semibold text-stone-900">Manajemen Reservasi Meja</h2>
              <p className="text-xs text-stone-500">
                Konfirmasi manual oleh admin dan kirim pesan WhatsApp langsung ke pelanggan.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-y border-[#e4e0d8] bg-[#f8f7f4] text-stone-600 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">No. Reservasi</th>
                      <th className="py-2.5 px-3">Pelanggan</th>
                      <th className="py-2.5 px-3">Jadwal</th>
                      <th className="py-2.5 px-3">Tamu</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Aksi Konfirmasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4e0d8]">
                    {reservations.map((r) => (
                      <tr key={r.reservationNumber}>
                        <td className="tabular py-3 px-3 font-semibold">{r.reservationNumber}</td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-stone-900">{r.customerName}</p>
                          <p className="tabular text-stone-500">{r.customerPhone}</p>
                        </td>
                        <td className="tabular py-3 px-3">
                          {r.visitDate} · {r.visitTime} WIB
                        </td>
                        <td className="tabular py-3 px-3">{r.guestCount} org</td>
                        <td className="py-3 px-3">
                          <span className={cn("border px-2 py-0.5 text-[10px] font-semibold rounded", statusBadgeClass(r.status))}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1.5">
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
                                  className="rounded bg-emerald-700 px-2.5 py-1 font-semibold text-white hover:bg-emerald-800"
                                >
                                  Konfirmasi
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
                                  className="rounded bg-rose-600 px-2.5 py-1 font-semibold text-white hover:bg-rose-700"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                            <a
                              href={`https://wa.me/${r.customerPhone}?text=${encodeURIComponent(
                                `Halo ${r.customerName}, status reservasi Anda (${r.reservationNumber}) di ${siteConfig.name} pada ${r.visitDate} pukul ${r.visitTime} WIB kini: ${r.status}.`,
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded border border-[#e4e0d8] px-2.5 py-1 font-medium hover:bg-stone-100"
                            >
                              Kirim WA
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. MANAJEMEN MENU */}
          {tab === "menu" && (
            <div className="rounded border border-[#e4e0d8] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">Manajemen Menu</h2>
                  <p className="text-xs text-stone-500">
                    Toggle ketersediaan menu langsung memperbarui tampilan di halaman publik `/menu`.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded bg-[#1c1612] px-3.5 py-2 text-xs font-semibold text-white hover:bg-stone-800"
                >
                  <Plus size={14} /> Tambah Menu Baru
                </button>
              </div>

              {newMenuOpen && (
                <form
                  onSubmit={handleAddMenu}
                  className="mt-4 grid gap-3 rounded border border-[#e4e0d8] bg-[#f8f7f4] p-4 text-xs sm:grid-cols-4"
                >
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nama menu (contoh: Piccolo Latte)"
                    className="rounded border border-[#e4e0d8] bg-white px-3 py-2"
                  />
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    placeholder="Harga Rupiah"
                    className="tabular rounded border border-[#e4e0d8] bg-white px-3 py-2"
                  />
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="rounded border border-[#e4e0d8] bg-white px-3 py-2"
                  >
                    {categoryList.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
                  >
                    Simpan Menu
                  </button>
                </form>
              )}

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-y border-[#e4e0d8] bg-[#f8f7f4] text-stone-600 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Nama Produk</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3">Harga</th>
                      <th className="py-2.5 px-3">Badge</th>
                      <th className="py-2.5 px-3">Status Tersedia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4e0d8]">
                    {menuItems.map((m) => (
                      <tr key={m.id}>
                        <td className="py-3 px-3 font-semibold text-stone-900">{m.name}</td>
                        <td className="py-3 px-3 capitalize">{m.category}</td>
                        <td className="tabular py-3 px-3 font-medium">{rupiah(m.price)}</td>
                        <td className="py-3 px-3">{m.badge ?? "—"}</td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => toggleProductAvailable(m.id)}
                            className={cn(
                              "rounded border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                              m.available
                                ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                                : "border-rose-300 bg-rose-100 text-rose-800",
                            )}
                          >
                            {m.available ? "Tersedia (Klik untuk Habiskan)" : "Habis (Klik untuk Aktifkan)"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. MANAJEMEN KATEGORI */}
          {tab === "kategori" && (
            <div className="rounded border border-[#e4e0d8] bg-white p-5">
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
                      <span className="rounded bg-stone-100 px-2.5 py-1 font-medium text-stone-700">
                        Dipakai oleh {count} produk
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6, 7, 8. GALERI, TESTIMONI, TENTANG KAMI */}
          {(tab === "galeri" || tab === "testimoni" || tab === "tentang") && (
            <div className="rounded border border-[#e4e0d8] bg-white p-5">
              <h2 className="text-base font-semibold text-stone-900 capitalize">Modul {tab}</h2>
              <p className="text-xs text-stone-500 mt-1">
                Seluruh item yang ditandai <strong>Published</strong> tampil otomatis di website publik.
              </p>

              {tab === "galeri" && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
                  {gallery.map((g) => (
                    <div key={g.id} className="rounded border border-[#e4e0d8] p-3">
                      <p className="font-semibold">{g.title}</p>
                      <p className="text-stone-500 mt-0.5">Alt: {g.alt}</p>
                      <span className="mt-2 inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase">
                        Published · {g.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "testimoni" && (
                <div className="mt-4 divide-y divide-[#e4e0d8] text-xs">
                  {testimonialList.map((t, i) => (
                    <div key={i} className="py-3 flex justify-between gap-4">
                      <div>
                        <p className="font-semibold">{t.name} ({t.rating}★)</p>
                        <p className="text-stone-600 mt-0.5">{t.text}</p>
                      </div>
                      <span className="self-start rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        Tampil
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "tentang" && (
                <div className="mt-4 space-y-3 text-xs">
                  {aboutList.map((a, i) => (
                    <div key={i} className="rounded border border-[#e4e0d8] p-4">
                      <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold">
                        Tipe: {a.type}
                      </span>
                      <p className="mt-1.5 font-semibold text-sm">{a.title}</p>
                      <p className="mt-1 text-stone-600">{a.body.join(" ")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 9. PENGATURAN WEBSITE (MULTI-TAB) */}
          {tab === "pengaturan" && (
            <div className="rounded border border-[#e4e0d8] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4e0d8] pb-4">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">
                    Pengaturan Website (White-Label Multi-Client)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Perubahan identitas, warna utama, dan modul langsung diterapkan ke website publik tanpa mengubah kode.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetSiteConfig}
                  className="rounded border border-[#e4e0d8] px-3 py-1.5 text-xs font-medium hover:bg-stone-100"
                >
                  Reset ke Default Prajalinks
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5 border-b border-[#e4e0d8] pb-3 text-xs">
                {(
                  [
                    ["identitas", "Identitas & Hero"],
                    ["tampilan", "Tampilan & Warna"],
                    ["kontak", "Kontak & Lokasi"],
                    ["operasional", "Jam Operasional"],
                    ["modul", "Modul Fitur"],
                    ["pembayaran", "Rekening Pembayaran"],
                    ["seo", "SEO & OpenGraph"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSettingsSubTab(key)}
                    className={cn(
                      "rounded px-3 py-1.5 font-semibold transition-colors",
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
                        className="mt-1 w-full rounded border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700">Tagline</label>
                      <input
                        type="text"
                        value={siteConfig.tagline}
                        onChange={(e) => updateSiteConfig({ tagline: e.target.value })}
                        className="mt-1 w-full rounded border border-[#e4e0d8] px-3 py-2"
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
                        className="mt-1 w-full rounded border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                  </>
                )}

                {settingsSubTab === "tampilan" && (
                  <>
                    <div>
                      <label className="block font-semibold text-stone-700">
                        Warna Aksen Utama (Hex CSS Variable `--brand`)
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          type="color"
                          value={siteConfig.primaryColor}
                          onChange={(e) => updateSiteConfig({ primaryColor: e.target.value })}
                          className="h-10 w-16 cursor-pointer rounded border border-[#e4e0d8]"
                        />
                        <input
                          type="text"
                          value={siteConfig.primaryColor}
                          onChange={(e) => updateSiteConfig({ primaryColor: e.target.value })}
                          className="tabular rounded border border-[#e4e0d8] px-3 py-2 uppercase"
                        />
                      </div>
                    </div>
                  </>
                )}

                {settingsSubTab === "kontak" && (
                  <>
                    <div>
                      <label className="block font-semibold text-stone-700">Alamat Lengkap</label>
                      <input
                        type="text"
                        value={siteConfig.address}
                        onChange={(e) => updateSiteConfig({ address: e.target.value })}
                        className="mt-1 w-full rounded border border-[#e4e0d8] px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700">Nomor WhatsApp (Format 628…)</label>
                      <input
                        type="text"
                        value={siteConfig.whatsapp}
                        onChange={(e) => updateSiteConfig({ whatsapp: e.target.value })}
                        className="tabular mt-1 w-full rounded border border-[#e4e0d8] px-3 py-2"
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
                      <label key={k} className="flex items-center gap-2.5 rounded border border-[#e4e0d8] p-3">
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
                        className="mt-1 w-full rounded border border-[#e4e0d8] px-3 py-2"
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
                        className="tabular mt-1 w-full rounded border border-[#e4e0d8] px-3 py-2"
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
                      className="mt-1 w-full rounded border border-[#e4e0d8] px-3 py-2"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
