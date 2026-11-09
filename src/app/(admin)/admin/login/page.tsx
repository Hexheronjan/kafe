"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
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
    label: "Owner (Pemilik)",
    name: "Hendrawan · Owner",
    email: "owner@prajalinks.id",
    pass: "PrajalinksPonorogo2026!",
    desc: "Akses penuh: statistik pendapatan, menu, pesanan, reservasi & pengaturan white-label.",
  },
  {
    role: "ADMIN",
    label: "Admin Operasional",
    name: "Nadia · Store Manager",
    email: "admin@prajalinks.id",
    pass: "AdminPonorogo2026!",
    desc: "Kelola menu, verifikasi bukti transfer, pesanan harian & konfirmasi reservasi.",
  },
  {
    role: "STAFF",
    label: "Staff Kasir",
    name: "Raka · Head Barista",
    email: "kasir@prajalinks.id",
    pass: "StaffPonorogo2026!",
    desc: "Pantau antrean pesanan masuk, ubah status siap saji & cek ketersediaan menu.",
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
    }, 350);
  };

  return (
    <div className="admin grid min-h-dvh lg:grid-cols-12">
      {/* Kolom Kiri: Visual Branding Kafe */}
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

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">
              {siteConfig.name.slice(0, 1)}
            </span>
            <span className="font-display text-2xl">
              {siteConfig.name}
              <span className="text-brand">.</span>
            </span>
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
          <span>JWT Session + Role Permission</span>
        </div>
      </div>

      {/* Kolom Kanan: Kartu Login Otomatis Terisi */}
      <div className="grid place-items-center p-6 sm:p-10 lg:col-span-7">
        <div className="w-full max-w-lg rounded-3xl border border-[#e4e0d8] bg-white p-7 shadow-[0_20px_50px_-20px_rgba(28,22,18,0.12)] sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800">
              <CheckCircle2 size={13} /> Kredensial Login Otomatis Terisi
            </span>
            <span className="text-xs font-medium text-stone-400">Ponorogo Edition</span>
          </div>

          <h2 className="font-display mt-4 text-3xl text-[#1c1612]">
            Masuk ke Dashboard {siteConfig.name}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-500">
            Email dan password sudah terisi otomatis untuk memudahkan demo. Pilih role di bawah atau langsung klik tombol <strong>Masuk ke Dashboard</strong>.
          </p>

          {/* Pemilih Role 1-Klik */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              Pilih Akun Role (Auto-Fill):
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const active = selectedRole === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => selectPreset(acc)}
                    className={cn(
                      "rounded-2xl border p-2.5 text-left text-xs transition-all",
                      active
                        ? "border-[#1c1612] bg-[#1c1612] text-white shadow-sm"
                        : "border-[#e4e0d8] bg-[#f8f7f4] text-stone-700 hover:bg-stone-100",
                    )}
                  >
                    <span className="flex items-center justify-between font-bold">
                      {acc.role}
                      <KeyRound size={12} className={active ? "text-brand" : "text-stone-400"} />
                    </span>
                    <span className={cn("mt-0.5 block truncate text-[10px]", active ? "text-white/75" : "text-stone-500")}>
                      {acc.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 rounded-xl bg-[#f8f7f4] px-3 py-2 text-[11px] text-stone-600">
              <ShieldCheck size={13} className="mr-1 inline text-brand-ink" />
              {DEMO_ACCOUNTS.find((a) => a.role === selectedRole)?.desc}
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-5 space-y-4 text-xs">
            <div>
              <label htmlFor="adm-email" className="block font-semibold text-stone-700">
                Email Admin (Otomatis Terisi)
              </label>
              <div className="relative mt-1.5">
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
                Password (Otomatis Terisi)
              </label>
              <div className="relative mt-1.5">
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
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1c1612] text-xs font-semibold tracking-wider text-white uppercase shadow-md transition-all hover:bg-brand-ink"
            >
              {loading ? (
                "Memverifikasi Sesi…"
              ) : (
                <>
                  Masuk ke Dashboard Admin <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-[#e4e0d8] pt-4 text-xs text-stone-500">
            <Link href="/" className="font-medium hover:text-stone-900 hover:underline">
              ← Kembali ke Website Publik
            </Link>
            <span>Proteksi Rate-Limit & Cookie HttpOnly</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <AdminLoginView />;
}
