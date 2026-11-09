# Prajalinks — Website Coffee Shop & Bakery House (Warm Editorial)

Website kafe komersial (white-label) yang dirancang agar identitas brand, warna aksen, konten, dan modul fitur dapat disesuaikan dari Dashboard Admin tanpa mengubah kode.

## Menjalankan Pratinjau UI

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.

## Halaman yang Tersedia

### 1. Website Publik (Arah Visual: Warm Editorial)
- **Beranda (`/`)**: Hero full-screen dengan animasi kata-per-kata dari balik mask, indikator buka/tutup real-time (WIB), marquee brand, 4 poin keunggulan editorial, menu favorit, cerita singkat asimetris, bento grid galeri, carousel testimoni (Embla), jam operasional, dan peta lazy-load.
- **Menu (`/menu`)**: Filter kategori dan pencarian tersimpan di URL (`?kategori=coffee&q=latte`), badge shimmer *Best Seller*, dialog detail produk dengan transisi shared-element (`?produk=slug`), status *Habis* redup, dan placeholder ilustrasi editorial untuk menu tanpa foto.
- **Tentang Kami (`/tentang-kami`)**: 4 tata letak berbeda untuk tipe *STORY*, *CONCEPT*, *VALUES*, dan *PLACE*.
- **Galeri (`/galeri`)**: Filter kategori dengan animasi layout dan lightbox penuh (`layoutId`, navigasi tombol panah keyboard, dan swipe di layar sentuh).
- **Reservasi (`/reservasi`)**: Validasi tanggal & jam operasional, anti-spam honeypot, pembuatan nomor reservasi unik (`RSV-YYYYMMDD-NNNN`), status awal *Menunggu konfirmasi*, dan tombol kirim ke WhatsApp.
- **Checkout & Pemesanan Online (`/checkout`)**: Drawer keranjang dari kanan, perhitungan ulang harga dari katalog, pilihan *Dine In* / *Take Away*, metode *Bayar di Kasir* / *Transfer Bank*, unggah bukti pembayaran, dan nomor pesanan unik (`PRJ-YYYYMMDD-NNNN`).
- **Cek Status (`/cek-status`)**: Pelacakan status pesanan atau reservasi dengan kombinasi nomor transaksi dan nomor WhatsApp.
- **Kontak (`/kontak`)**: Informasi lengkap, salin alamat, buka rute Google Maps, dan jam operasional.

### 2. Panel Kustomisasi Client & Dashboard Admin
- **Tombol "Kustomisasi Client" (Kiri Bawah)**: Memungkinkan Anda mendemokan perubahan nama kafe, tagline, warna aksen utama (`--brand`), dan aktivasi modul secara langsung di depan calon klien pemilik kafe.
- **Dashboard Admin (`/admin`) & Login (`/admin/login`)**: Tema terang, rapi, dan padat data dengan sidebar yang bisa dilipat, statistik pendapatan (dihitung dari pesanan *Selesai* & *Lunas*), grafik 7 hari terakhir, manajemen menu & kategori, verifikasi bukti transfer, manajemen pesanan sesuai aturan transisi status, manajemen reservasi, dan pengaturan website multi-tab.
