"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  site as defaultSite,
  products as defaultProducts,
  categories as defaultCategories,
  testimonials as defaultTestimonials,
  about as defaultAbout,
  type Product,
  type Category,
} from "@/config/site";

export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "READY" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PENDING_VERIFICATION" | "PAID" | "REJECTED";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "COMPLETED" | "CANCELLED";

export type DemoOrder = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: "DINE_IN" | "TAKE_AWAY";
  status: OrderStatus;
  paymentMethod: "CASH" | "BANK_TRANSFER";
  paymentStatus: PaymentStatus;
  proofUploaded?: boolean;
  rejectReason?: string;
  note?: string;
  items: { productId: string; name: string; price: number; qty: number }[];
  total: number;
  createdAt: string;
};

export type DemoReservation = {
  reservationNumber: string;
  customerName: string;
  customerPhone: string;
  visitDate: string;
  visitTime: string;
  guestCount: number;
  note?: string;
  adminNote?: string;
  status: ReservationStatus;
  createdAt: string;
};

export type SiteConfig = typeof defaultSite;

const INITIAL_ORDERS: DemoOrder[] = [
  {
    orderNumber: "PRJ-20261109-0041",
    customerName: "Raka Pradipta",
    customerPhone: "081298765432",
    orderType: "DINE_IN",
    status: "PROCESSING",
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "PENDING_VERIFICATION",
    proofUploaded: true,
    note: "Meja lantai 2 dekat jendela, gula pisah.",
    items: [
      { productId: "p1", name: "Signature Caffe Latte", price: 32000, qty: 2 },
      { productId: "p4", name: "French Butter Croissant", price: 28000, qty: 1 },
    ],
    total: 92000,
    createdAt: "2026-11-09 09:20 WIB",
  },
  {
    orderNumber: "PRJ-20261109-0040",
    customerName: "Anindya Putri",
    customerPhone: "081322334455",
    orderType: "TAKE_AWAY",
    status: "READY",
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    items: [
      { productId: "p3", name: "V60 Seasonal Single Origin", price: 36000, qty: 1 },
      { productId: "p5", name: "Artisanal Espresso Tiramisu", price: 42000, qty: 1 },
    ],
    total: 78000,
    createdAt: "2026-11-09 08:55 WIB",
  },
  {
    orderNumber: "PRJ-20261109-0039",
    customerName: "Dimas Mahendra",
    customerPhone: "085711223344",
    orderType: "DINE_IN",
    status: "COMPLETED",
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "PAID",
    proofUploaded: true,
    items: [
      { productId: "p2", name: "Ponorogo Aren Crème Latte", price: 30000, qty: 2 },
      { productId: "p9", name: "Rice Bowl Ayam Bakar Sambal Matah", price: 44000, qty: 2 },
    ],
    total: 148000,
    createdAt: "2026-11-09 08:15 WIB",
  },
];

const INITIAL_RESERVATIONS: DemoReservation[] = [
  {
    reservationNumber: "RSV-20261109-0007",
    customerName: "Clarissa Wijaya",
    customerPhone: "085151951806",
    visitDate: "2026-11-10",
    visitTime: "16:00",
    guestCount: 6,
    note: "Meeting tim kreatif di Ponorogo, butuh meja dekat stopkontak.",
    status: "PENDING",
    createdAt: "2026-11-09 09:30 WIB",
  },
  {
    reservationNumber: "RSV-20261109-0006",
    customerName: "Hendra Kusuma",
    customerPhone: "081987654321",
    visitDate: "2026-11-09",
    visitTime: "19:00",
    guestCount: 4,
    note: "Makan malam keluarga di area indoor non-smoking.",
    status: "CONFIRMED",
    adminNote: "Meja 04 lantai atas sudah disiapkan.",
    createdAt: "2026-11-08 20:10 WIB",
  },
];

export type AdminUserSession = {
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "STAFF";
};

type DemoStoreCtx = {
  siteConfig: SiteConfig;
  updateSiteConfig: (patch: Partial<SiteConfig>) => void;
  resetSiteConfig: () => void;
  menuItems: Product[];
  toggleProductAvailable: (id: string) => void;
  addMenuItem: (item: Omit<Product, "id">) => void;
  categoryList: Category[];
  orders: DemoOrder[];
  addOrder: (order: DemoOrder) => void;
  updateOrderStatus: (orderNumber: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderNumber: string, status: PaymentStatus, rejectReason?: string) => void;
  uploadOrderProof: (orderNumber: string) => void;
  reservations: DemoReservation[];
  addReservation: (res: DemoReservation) => void;
  updateReservationStatus: (reservationNumber: string, status: ReservationStatus, adminNote?: string) => void;
  testimonialList: typeof defaultTestimonials;
  aboutList: typeof defaultAbout;
  adminSession: AdminUserSession | null;
  loginAdmin: (session: AdminUserSession) => void;
  logoutAdmin: () => void;
};

const Ctx = createContext<DemoStoreCtx | null>(null);

function darkenHex(hex: string, factor = 0.78): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#8f5424";
  const r = Math.max(0, Math.floor(parseInt(clean.slice(0, 2), 16) * factor));
  const g = Math.max(0, Math.floor(parseInt(clean.slice(2, 4), 16) * factor));
  const b = Math.max(0, Math.floor(parseInt(clean.slice(4, 6), 16) * factor));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSite);
  const [menuItems, setMenuItems] = useState<Product[]>(defaultProducts);
  const [categoryList] = useState<Category[]>(defaultCategories);
  const [orders, setOrders] = useState<DemoOrder[]>(INITIAL_ORDERS);
  const [reservations, setReservations] = useState<DemoReservation[]>(INITIAL_RESERVATIONS);
  const [testimonialList] = useState(defaultTestimonials);
  const [aboutList] = useState(defaultAbout);
  const [adminSession, setAdminSession] = useState<AdminUserSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedSite = localStorage.getItem("prj-site-config-v3");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedSite) setSiteConfig({ ...defaultSite, ...JSON.parse(savedSite) });
      const savedMenu = localStorage.getItem("prj-menu-items-v3");
      if (savedMenu) setMenuItems(JSON.parse(savedMenu));
      const savedOrders = localStorage.getItem("prj-orders-v3");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      const savedRes = localStorage.getItem("prj-reservations-v3");
      if (savedRes) setReservations(JSON.parse(savedRes));
      const savedAdmin = sessionStorage.getItem("prj-admin-session");
      if (savedAdmin) setAdminSession(JSON.parse(savedAdmin));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.style.setProperty("--brand", siteConfig.primaryColor);
    document.documentElement.style.setProperty("--brand-ink", darkenHex(siteConfig.primaryColor, 0.78));
    try {
      localStorage.setItem("prj-site-config-v3", JSON.stringify(siteConfig));
    } catch {}
  }, [siteConfig, hydrated]);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("prj-menu-items-v3", JSON.stringify(menuItems));
      } catch {}
    }
  }, [menuItems, hydrated]);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("prj-orders-v3", JSON.stringify(orders));
      } catch {}
    }
  }, [orders, hydrated]);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("prj-reservations-v3", JSON.stringify(reservations));
      } catch {}
    }
  }, [reservations, hydrated]);

  const loginAdmin = useCallback((session: AdminUserSession) => {
    setAdminSession(session);
    try {
      sessionStorage.setItem("prj-admin-session", JSON.stringify(session));
    } catch {}
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminSession(null);
    try {
      sessionStorage.removeItem("prj-admin-session");
    } catch {}
  }, []);

  const updateSiteConfig = useCallback((patch: Partial<SiteConfig>) => {
    setSiteConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetSiteConfig = useCallback(() => {
    setSiteConfig(defaultSite);
    setMenuItems(defaultProducts);
    setOrders(INITIAL_ORDERS);
    setReservations(INITIAL_RESERVATIONS);
    try {
      localStorage.removeItem("prj-site-config-v3");
      localStorage.removeItem("prj-menu-items-v3");
      localStorage.removeItem("prj-orders-v3");
      localStorage.removeItem("prj-reservations-v3");
    } catch {}
  }, []);

  const toggleProductAvailable = useCallback((id: string) => {
    setMenuItems((prev) => prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p)));
  }, []);

  const addMenuItem = useCallback((item: Omit<Product, "id">) => {
    setMenuItems((prev) => [{ ...item, id: `p${Date.now()}` }, ...prev]);
  }, []);

  const addOrder = useCallback((order: DemoOrder) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((orderNumber: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o)));
  }, []);

  const updatePaymentStatus = useCallback((orderNumber: string, paymentStatus: PaymentStatus, rejectReason?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderNumber === orderNumber ? { ...o, paymentStatus, rejectReason } : o)),
    );
  }, []);

  const uploadOrderProof = useCallback((orderNumber: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNumber === orderNumber
          ? { ...o, proofUploaded: true, paymentStatus: "PENDING_VERIFICATION", rejectReason: undefined }
          : o,
      ),
    );
  }, []);

  const addReservation = useCallback((res: DemoReservation) => {
    setReservations((prev) => [res, ...prev]);
  }, []);

  const updateReservationStatus = useCallback(
    (reservationNumber: string, status: ReservationStatus, adminNote?: string) => {
      setReservations((prev) =>
        prev.map((r) =>
          r.reservationNumber === reservationNumber
            ? { ...r, status, adminNote: adminNote ?? r.adminNote }
            : r,
        ),
      );
    },
    [],
  );

  return (
    <Ctx.Provider
      value={{
        siteConfig,
        updateSiteConfig,
        resetSiteConfig,
        menuItems,
        toggleProductAvailable,
        addMenuItem,
        categoryList,
        orders,
        addOrder,
        updateOrderStatus,
        updatePaymentStatus,
        uploadOrderProof,
        reservations,
        addReservation,
        updateReservationStatus,
        testimonialList,
        aboutList,
        adminSession,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useDemoStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("DemoStoreProvider missing");
  return c;
}
