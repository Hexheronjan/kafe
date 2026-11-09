"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useDemoStore, type AdminUserSession } from "@/lib/demo-store";
import { BLUR, cn } from "@/lib/utils";

const DEMO_ACCOUNTS: {
  role: AdminUserSession["role"];
  label: string;
  name: string;
  email: string;
  pass: string;
  desc: string;
}[] = [
  {
    role: "OWNER",
    label: "Owner (Pemilik Kafe)",
    name: "Hendrawan · Owner",
    email: "owner@prajalinks.id",
    pass: "PrajalinksPonorogo2026!",
    desc: "Akses penuh: laporan pendapatan, menu, pesanan, reservasi & pengaturan tema website.",
  },
  {
    role: "ADMIN",
    label: "Admin Operasional",
    name: "Nadia · Store Manager",
    email: "admin@prajalinks.id",
    pass: "AdminPonorogo2026!",
    desc: "Kelola katalog menu, verifikasi bukti transfer, pesanan harian & konfirmasi reservasi.",
  },
  {
    role: "STAFF",
    label: "Staff Kasir & Barista",
    name: "Raka · Head Barista",
    email: "kasir@prajalinks.id",
    pass: "StaffPonorogo2026!",
    desc: "Pantau antrean pesanan masuk, ubah status siap saji & atur ketersediaan menu.",
  },
];

export function AdminLoginView({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const { siteConfig, loginAdmin } = useDemoStore();
  const [selectedRole, setSelectedRole] = useState<AdminUserSession["role"]>("OWNER");
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState(DEMO_ACCOUNTS[0].pass);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pastikan body & html scroll tidak terkunci saat halaman login dibuka di mobile
  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  const selectPreset = (acc: (typeof DEMO_ACCOUNTS)[number]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const acc = DEMO_ACCOUNTS.find((a) => a.role === selectedRole) ?? DEMO_ACCOUNTS[0];
    setTimeout(() => {
      loginAdmin({
        name: acc.name,
        email: email.trim() || acc.email,
        role: acc.role,
      });
      setLoading(false);
      if (onSuccess) onSuccess();
      else router.push("/admin");
    }, 300);
  };

  const activeAccount = DEMO_ACCOUNTS.find((a) => a.role === selectedRole) ?? DEMO_ACCOUNTS[0];

  return (
    <div className="admin min-h-dvh w-full lg:grid lg:grid-cols-12">
      {/* Banner Visual Mobile */}
      <div className="relative overflow-hidden bg-[#1c1612] px-5 pt-4 pb-10 text-[#f6f0e7] lg:hidden">
        <Image
          src="/images/hero.jpg"
          alt={siteConfig.name}
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1612]/60 via-[#1c1612]/75 to-[#1c1612]" />

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-bold text-white">
              {siteConfig.name.slice(0, 1)}
            </span>
            <span className="font-display text-xl">
              {siteConfig.name}
              <span className="text-brand">.</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md"
          >
            <ArrowLeft size={13} /> Website
          </Link>
        </div>

        <div className="relative z-10 mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md">
            <Sparkles size={11} className="text-brand" /> Portal Pengelola · Ponorogo
          </span>
          <h1 className="font-display mt-2 text-2xl leading-snug">
            Login Dashboard {siteConfig.name}
          </h1>
          <p className="mt-0.5 text-xs text-white/75">
            Pilih akun role di bawah (otomatis terisi) lalu tekan Masuk.
          </p>
        </div>
      </div>

      {/* Kolom Kiri Desktop: Visual Branding Kafe */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#1c1612] p-12 text-[#f6f0e7] lg:col-span-5 lg:flex">
        <Image
          src="/images/hero.jpg"
          alt={siteConfig.name}
          fill
          sizes="45vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1612] via-[#1c1612]/70 to-[#1c1612]/40" />

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">
              {siteConfig.name.slice(0, 1)}
            </span>
            <span className="font-display text-2xl">
              {siteConfig.name}
              <span className="text-brand">.</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md hover:bg-white hover:text-[#1c1612]"
          >
            <ArrowLeft size={14} /> Kembali ke Website
          </Link>
        </div>

        <div className="relative z-10 my-auto max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md">
            <Sparkles size={12} className="text-brand" /> Sistem Manajemen Kafe Komersial
          </span>
          <h1 className="font-display mt-4 text-4xl leading-tight">
            Satu Dashboard untuk Seluruh Operasional Kafe.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Kelola katalog menu, stok harian, pesanan online, verifikasi bukti transfer, reservasi meja, hingga ubah nama & warna tema website langsung tanpa menyentuh kode.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-5 text-xs text-white/60">
          <span>{siteConfig.name} · Ponorogo, Jawa Timur</span>
          <span>+62 851-5195-1806</span>
        </div>
      </div>

      {/* Kolom Kanan: Kartu Login Otomatis Terisi */}
      <div className="-mt-5 px-4 pb-14 sm:px-8 lg:col-span-7 lg:mt-0 lg:grid lg:place-items-center lg:p-10">
        <div className="relative z-20 mx-auto w-full max-w-lg rounded-3xl border border-[#e4e0d8] bg-white p-5 shadow-[0_20px_50px_-20px_rgba(28,22,18,0.16)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800">
              <CheckCircle2 size={13} /> Login Otomatis Terisi
            </span>
            <span className="text-[11px] font-medium text-stone-400">Ponorogo Edition</span>
          </div>

          <div className="hidden lg:block">
            <h2 className="font-display mt-3 text-3xl text-[#1c1612]">
              Masuk ke Dashboard {siteConfig.name}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-stone-500">
              Pilih salah satu akun di bawah untuk mengisi email & password secara otomatis.
            </p>
          </div>

          {/* Pemilih Role Responsif */}
          <div className="mt-4">
            <p className="text-[11px] font-bold tracking-wider text-stone-500 uppercase">
              1. Pilih Akun Role (Auto-Fill):
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {DEMO_ACCOUNTS.map((acc) => {
                const active = selectedRole === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => selectPreset(acc)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-3.5 py-2.5 text-left transition-all sm:flex-col sm:items-start sm:justify-start sm:p-3",
                      active
                        ? "border-[#1c1612] bg-[#1c1612] text-white shadow-md"
                        : "border-[#e4e0d8] bg-[#f8f7f4] text-stone-800 hover:bg-stone-100",
                    )}
                  >
                    <div className="flex items-center gap-2 sm:w-full sm:justify-between">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                          active ? "bg-brand text-white" : "bg-stone-200 text-stone-700",
                        )}
                      >
                        {acc.role}
                      </span>
                      <UserCheck size={14} className={active ? "text-brand" : "text-stone-400"} />
                    </div>
                    <div className="text-right sm:mt-2 sm:text-left">
                      <p className="text-xs font-bold leading-snug">{acc.label}</p>
                      <p className={cn("text-[11px]", active ? "text-white/70" : "text-stone-500")}>
                        {acc.email}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-start gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/70 px-3.5 py-2.5 text-xs text-stone-700">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand-ink" />
              <span>
                <strong className="text-stone-900">{activeAccount.name}:</strong> {activeAccount.desc}
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-4 space-y-3.5 text-xs">
            <p className="text-[11px] font-bold tracking-wider text-stone-500 uppercase">
              2. Kredensial Terisi Otomatis:
            </p>
            <div>
              <label htmlFor="adm-email" className="block font-semibold text-stone-700">
                Email Admin
              </label>
              <div className="relative mt-1">
                <Mail size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-400" />
                <input
                  id="adm-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#e4e0d8] bg-[#faf9f6] pr-3 pl-10 text-sm font-medium text-stone-900 focus:border-stone-800 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="adm-pass" className="block font-semibold text-stone-700">
                Password
              </label>
              <div className="relative mt-1">
                <Lock size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-400" />
                <input
                  id="adm-pass"
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-[#e4e0d8] bg-[#faf9f6] pr-10 pl-10 text-sm font-medium text-stone-900 focus:border-stone-800 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Sembunyikan password" : "Lihat password"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1c1612] text-xs font-semibold tracking-wider text-white uppercase shadow-md transition-all hover:bg-brand-ink active:scale-[0.99]"
            >
              {loading ? (
                "Memverifikasi Sesi…"
              ) : (
                <>
                  Masuk sebagai {selectedRole} <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#e4e0d8] pt-4 text-xs text-stone-500">
            <Link href="/" className="font-semibold text-stone-700 hover:text-stone-900 hover:underline">
              ← Kembali ke Website Publik
            </Link>
            <span className="text-[11px]">Sesi Aman · Role-Based Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <AdminLoginView />;
}
