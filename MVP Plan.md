# Perancangan MVP: Sistem Klasifikasi Kondisi Ruang Bakar Berbasis Citra Borescope
**Studi Kasus: PLN Nusantara Power UP Arun**

## 1. Ringkasan Sistem
Sistem ini bertujuan untuk mengotomatisasi klasifikasi kondisi ruang bakar mesin menggunakan deep learning (CNN ResNet-50) untuk membantu teknisi dalam proses pemeliharaan melalui platform web yang intuitif.

## 2. Status Pengembangan (Milestones)

### 🚩 Milestone 1: Arsitektur & UI Core (Selesai)
Fokus pada pembangunan pondasi aplikasi dan antarmuka pengguna utama.
- [x] Inisialisasi Project (Next.js 15, Tailwind CSS, Shadcn UI)
- [x] Landing Page Premium dengan Branding PLN
- [x] Dashboard Layout & Sidebar Navigasi
- [x] Komponen Upload Borescope (UI/UX)
- [x] Halaman Preview Hasil Analisis (Mockup)

### 🚩 Milestone 2: Autentikasi & Manajemen Pengguna (Selesai)
Implementasi sistem keamanan dan akses berdasarkan peran.
- [x] Setup Database & Auth (Supabase)
- [x] Halaman Login & Register (Premium Glassmorphism)
- [x] Role-based Access Control (Admin vs Teknisi)
- [x] Sidebar Dinamis (Manajemen User hanya untuk Admin)

### 🚩 Milestone 3: Integrasi & Interaktivitas Analisis (Selesai)
Fokus pada alur kerja analisis citra dan pengalaman pengguna saat proses klasifikasi.
- [x] Integrasi Frontend dengan API Prediksi (Menghubungkan Upload ke Hasil)
- [x] Tampilan Hasil Analisis Dinamis (Status Warna, Badge, & Progress Bar)
- [x] Fitur Interaktif Preview Citra (Zoom & Detail Area)
- [x] Penanganan State Loading (Skeleton Screens) & Error Handling
- [x] Sinkronisasi Data Prediksi ke Database Supabase

### 🚩 Milestone 4: Manajemen Data & Dashboard Pelaporan (Selesai)
Fokus pada fitur arsip, ekspor data, dan visualisasi statistik.
- [x] Halaman Riwayat Inspeksi (Tabel Data dengan Fetch Real-time)
- [x] Fitur Filter & Search Riwayat (Berdasarkan ID & Teknisi)
- [x] Modul Export Laporan PDF (Generate Otomatis Berita Acara Inspeksi)
- [x] Dashboard Statistik (Visualisasi Chart Tren Kondisi Ruang Bakar)
- [x] Manajemen Profil & Pengaturan Akun

### 🚩 Milestone 5: Manajemen Pengguna & Optimasi UI (Selesai)
Fokus pada kontrol akses admin dan penyempurnaan pengalaman pengguna.
- [x] Halaman User Management (CRUD Akun Teknisi - Admin Only)
- [x] Role-based Access Control (Membatasi akses fitur Admin/Teknisi)
- [x] Optimasi Responsivitas UI (Penyesuaian tampilan Mobile & Tablet)
- [x] Audit Keamanan (Pengecekan ulang RLS Supabase & Auth)
- [x] Uji Coba Pengguna (Final bug fixing & feedback adjustment)

## 3. Struktur Halaman Web (Sitemap)
- **Halaman 1: Login/Register** (Keamanan akses)
- **Halaman 2: Dashboard** (Pusat aksi upload & ringkasan cepat)
- **Halaman 3: Hasil Analisis** (Visualisasi detail output AI & aksi simpan)
- **Halaman 4: Riwayat Inspeksi** (Arsip digital hasil pemeliharaan terdahulu)
- **Halaman 5: User Management** (Pengaturan akun & peran teknisi - Admin Only)

## 4. Stack Teknologi Web
- **Core:** Next.js (React), TypeScript.
- **Styling:** Tailwind CSS, Shadcn UI.
- **Backend Service:** Supabase (Auth, Database, Storage).
- **Icons & UI:** Lucide React, Framer Motion (Animations).
- **Reporting:** JSPDF / React-PDF.

---
*Update Terakhir: 13 Mei 2026 oleh Antigravity AI*
