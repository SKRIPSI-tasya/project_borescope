# Perancangan MVP: Sistem Klasifikasi Kondisi Ruang Bakar Berbasis Citra Borescope
**Studi Kasus: PLN Nusantara Power UP Arun**

## 1. Ringkasan Sistem
Sistem ini bertujuan untuk mengotomatisasi klasifikasi kondisi ruang bakar mesin menggunakan deep learning (CNN ResNet-50) untuk membantu teknisi dalam proses pemeliharaan.

## 2. Fitur Utama MVP
| Fitur | Deskripsi |
|-------|-----------|
| **Autentikasi** | Sistem login aman untuk teknisi berwenang. |
| **Unggah Data** | Upload file citra atau video borescope (.jpg, .png, .mp4). |
| **Klasifikasi Otomatis** | Eksekusi model ResNet-50 di backend untuk analisis kondisi. |
| **Visualisasi Hasil** | Menampilkan status "Bagus" / "Tidak Bagus" & *Confidence Score*. |
| **Manajemen Laporan** | Simpan hasil ke database dan unduh laporan PDF. |
| **Riwayat Inspeksi** | Daftar histori inspeksi yang pernah dilakukan sebelumnya. |

## 3. Struktur Halaman Web (Sitemap)
### **Halaman 1: Login Page**
- **Fungsi:** Gerbang masuk utama.
- **Komponen:** Form login (Username/Email & Password), Branding PLN Nusantara Power.

### **Halaman 2: Dashboard / Upload Page**
- **Fungsi:** Workspace utama teknisi.
- **Komponen:**
  - Sidebar navigasi.aa
  - Drag & Drop Upload Area untuk file borescope.
  - Tombol "Jalankan Klasifikasi".
  - Ringkasan statistik inspeksi terakhir.

### **Halaman 3: Halaman Hasil Analisis**
- **Fungsi:** Menampilkan output dari model AI.
- **Komponen:**
  - Preview citra/video yang diunggah.
  - Indikator Status (Warna Hijau untuk Bagus, Merah untuk Tidak Bagus).
  - Meteran Probabilitas (*Confidence Score*).
  - Tombol "Simpan ke Riwayat" dan "Unduh Laporan PDF".

### **Halaman 4: Halaman Riwayat Inspeksi**
- **Fungsi:** Arsip digital hasil pemeliharaan.
- **Komponen:**
  - Tabel data (ID, Tanggal, Teknisi, Hasil, Confidence).
  - Fitur Filter & Search berdasarkan tanggal atau status.
  - Aksi "Lihat Detail" untuk membuka kembali hasil analisis lama.

## 4. Stack Teknologi (Rekomendasi)
- **Frontend:** Next.js (React), Tailwind CSS, Shadcn UI.
- **Backend API:** FastAPI (Python) - *Paling optimal untuk integrasi model CNN*.
- **AI Model:** CNN (ResNet-50) menggunakan PyTorch/TensorFlow.
- **Database:** MySQL.
- **Reporting:** `jspdf` atau `react-pdf` untuk generate laporan.

---
*Draft disusun oleh Antigravity AI - 2026*
