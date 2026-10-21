# Biroumroh

Sistem manajemen perjalanan Umrah dan Haji untuk Biro Umrah dan Haji Amanah, Banjarnegara. Aplikasi terdiri dari backend (Express.js + SQLite) dan frontend (React + Vite + Tailwind CSS).

## Struktur Project

```
biroumroh/
├── backend/
│   ├── biroumroh.sql        # Skema database (SQLite)
│   ├── server.js            # Express.js API server
│   ├── init-db.js           # Inisialisasi database
│   ├── .env                 # Konfigurasi environment
│   ├── package.json
│   └── node_modules/
├── Dokumen/
│   ├── 001-paket.md         # Spesifikasi Paket Layanan
│   ├── 002-jamaah.md        # Spesifikasi Jamaah
│   ├── 003-schedule.md      # Spesifikasi Jadwal Perjalanan
│   ├── 004-registrasi.md    # Spesifikasi Registrasi / Rombongan
│   └── 005-*.md             # Dokumen pendukung lainnya
└── frontend/
    ├── src/
    │   ├── App.tsx          # Routing aplikasi
    │   ├── main.tsx
    │   ├── index.css        # Tema warna (ink, gold, cream)
    │   ├── components/      # Komponen landing page
    │   └── pages/           # Halaman aplikasi
    ├── package.json
    └── dist/                # Build hasil produksi
```

## Tema Warna

Tema warna disesuaikan dengan landing page (didefinisikan di `frontend/src/index.css`):

| Warna | Nilai | Penggunaan |
|-------|-------|------------|
| ink | `#0b0b0b` | Background utama, teks |
| ink-2 | `#151515` | Background card, tabel |
| gold | `#d4af37` | Aksen, tombol utama, teks ungu |
| cream | `#faf6e8` | Background section alur |
| cream-border | `#eadfb5` | Border |

## Persyaratan

- Node.js (v20+)
- npm
- SQLite (menggunakan paket `sqlite3`)

## Instalasi & Menjalankan

### 1. Backend

Masuk ke folder backend dan instal dependensi:

```bash
cd backend
npm install
```

Buat dan inisialisasi database:

```bash
npm run init-db
```

Jalankan server backend (port 3000):

```bash
npm start        # produksi
# atau
npm run dev      # development dengan --watch
```

Server akan berjalan di `http://localhost:3000`.

Konfigurasi environment ada di `backend/.env`:

```
DB_PATH=./Dokumen/biroumroh.sqlite
PORT=3000
```

### 2. Frontend

Masuk ke folder frontend dan instal dependensi:

```bash
cd frontend
npm install
```

Jalankan development server (port 5173):

```bash
npm run dev      # http://localhost:5173
```

Build untuk produksi:

```bash
npm run build    # hasil di frontend/dist
```

Preview build:

```bash
npm run preview
```

## Endpoint API (Backend)

### Paket
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/paket` | Tampilkan seluruh data paket |
| POST | `/paket/baru` | Tambah paket baru |
| POST | `/paket/ubah` | Update paket |
| POST | `/paket/hapus` | Soft delete paket |

### Jamaah
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/jamaah/list` | 100 data jamaah terakhir |
| POST | `/jamaah/baru` | Tambah jamaah baru |
| GET | `/jamaah/info?uuid=` | Detail jamaah |
| POST | `/jamaah/ganti` | Update jamaah |
| POST | `/jamaah/batal` | Soft delete jamaah |

### Jadwal Perjalanan (Trip)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/trip/list` | 50 data terakhir, status waiting |
| POST | `/trip/baru` | Tambah jadwal baru |
| POST | `/trip/ganti` | Update jadwal |
| POST | `/trip/batal` | Soft delete jadwal |

### Pendaftaran / Rombongan
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/registration/list?trip_id=` | Daftar pendaftaran per trip |
| GET | `/registration/invoice/:uuid` | Detail invoice |
| POST | `/rombongan/baru` | Tambah pendaftaran (nomor `yymm-xxx`) |
| POST | `/rombongan/batal` | Soft delete multiple pendaftaran |
| POST | `/registration/paid/:nomor_pendaftaran` | Set status pembayaran menjadi `paid` |

## Halaman Aplikasi (Frontend)

| Route | Deskripsi |
|-------|-----------|
| `/` | Landing page (beranda) |
| `/paket` | Kelola paket perjalanan (tambah, ubah, hapus) |
| `/jamaah` | Daftar calon jamaah (+ tambah, profil, hapus) |
| `/jamaah/profil/:uuid` | Detail profil jamaah (kartu, update, batal) |
| `/jamaah/blanko/:mode/:uuid` | Form tambah/ubah jamaah |
| `/trip` | Tabel jadwal perjalanan status waiting (+ tambah, update, hapus) |
| `/trip/blanko/:mode/:uuid` | Form tambah/ubah jadwal |
| `/registration` | Pendaftaran trip (pilih jadwal, cari jamaah, form pendaftaran) |
| `/registration/invoice/:uuid` | Halaman cetak invoice |
| `/rombongan` | Daftar rombongan perjalanan (hanya status paid) |
| `/serambi` | Dashboard manajemen (paket, jadwal, jamaah, pendaftaran, rombongan) |

## Skema Database (SQLite)

Tabel yang dibuat oleh `backend/biroumroh.sql`:

- **pakets**: id, nama, tipe (haji/umrah), durasi, harga, deleted
- **jamaahs**: id, nama, tg_lahir, alamat, nomor_hp, status (prospect/registered), deleted
- **trips**: id, nama_trip, paket_id (FK), tanggal_pergi, quota, status (waiting/departed/canceled), deleted
- **registrations**: id, nomor_pendaftaran (yymm-xxx, unique), tanggal, trip_id (FK), jamaah_id (FK), payment_status (unpaid/paid), deleted

Semua tabel menggunakan soft delete (`deleted = 0` untuk aktif, `1` untuk dihapus).

## Catatan

- Database SQLite disimpan di `backend/Dokumen/biroumroh.sqlite`.
- Backend menggunakan CORS, sehingga dapat diakses dari frontend development server.
- Frontend mengakses backend melalui `http://localhost:3000` (bisa diubah melalui `VITE_API_BASE`).

## Lisensi

Internal project Biro Umrah dan Haji Amanah.