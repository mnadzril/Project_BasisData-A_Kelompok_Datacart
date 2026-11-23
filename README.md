# Datacart — Project Basis Data

Tugas kelompok mata kuliah **Basis Data** — **Kelompok Datacart**.

**Datacart** adalah aplikasi e-commerce full-stack yang terdiri dari tiga sisi:

- **shop.id (pembeli)** — beranda, pencarian produk, keranjang, wishlist, checkout, pembayaran, dan lacak pesanan.
- **shop.in (penjual / seller)** — dashboard toko, kelola produk, kelola pesanan masuk, dan pengaturan akun.
- **Admin & CS** — verifikasi pesanan, monitoring seluruh transaksi, dan jadwal shift.

## Teknologi

| Bagian  | Teknologi |
| ------- | --------- |
| Backend | Java (JDK 17/21), `com.sun.net.httpserver` (tanpa framework), Gson 2.11 |
| Database | MySQL / MariaDB (XAMPP), driver `mysql-connector-j-8.4.0` |
| Frontend | HTML, CSS, JavaScript (halaman statis, disajikan langsung oleh server Java) |
| Jalankan | `jalankan-windows.bat` (deteksi JDK otomatis, kompilasi, lalu start server) |

## Struktur Proyek

```
Project_BasisData-A_Kelompok_Datacart/
├── db_ecommerce.sql          Skema 9 tabel + data awal (produk & akun demo)
├── jalankan-windows.bat      Kompilasi + jalankan server (Windows)
├── PRD/                      Product Requirement Document
├── ERD/                      Entity Relationship Diagram
├── UML/                      Diagram UML
└── Sourcecode/
    ├── 1-Frontend/
    │   └── assets/
    │       ├── Frame 1/ … Frame 26/    Halaman-halaman aplikasi
    │       └── shared/                 CSS/JS bersama antarhalaman
    └── 2-Backend/
        ├── lib/                        gson-2.11.0.jar, mysql-connector-j-8.4.0.jar
        ├── pom.xml
        └── src/main/java/com/ecommerce/
            ├── ApiServer.java          Router utama + penyaji file statis
            ├── config/                 DatabaseConfig (koneksi via environment variable)
            ├── controllers/            7 controller (auth, produk, keranjang, pesanan,
            │                           pembayaran, wishlist, admin)
            ├── http/                   HttpUtil (respons JSON, pembacaan body)
            ├── models/                 8 class model (Pembeli, Penjual, Admin, Produk,
            │                           Pesanan, DetailPesanan, Pembayaran, Pengguna)
            └── util/                   PasswordUtil (hash SHA-256)
```

## Cara Menjalankan

1. Install **XAMPP** (MySQL) dan **JDK 17 atau 21**.
2. Buka **XAMPP Control Panel** → **Start** pada **MySQL**.
3. Buka **phpMyAdmin** (`http://localhost/phpmyadmin`) → menu **Import** → pilih `db_ecommerce.sql` → **Import**. Database `db_ecommerce` beserta 9 tabel dan data awalnya dibuat otomatis.
4. Jalankan **`jalankan-windows.bat`** (klik dua kali). Script akan mendeteksi JDK, mengompilasi seluruh kode Java, dan menyalakan server di **port 8080**.
5. Buka `http://localhost:8080` di browser — otomatis diarahkan ke halaman login (`/Frame%201/index.html`).

Konfigurasi opsional lewat environment variable (tanpa setting apa pun, server memakai default XAMPP: user `root`, password kosong):

| Variabel | Default | Keterangan |
| -------- | ------- | ---------- |
| `PORT` | `8080` | Port server |
| `DB_URL` | `localhost:3306` | Alamat MySQL |
| `DB_USER` | `root` | User MySQL |
| `DB_PASSWORD` | (kosong) | Password MySQL |
| `STATIC_ROOT` | `../1-Frontend/assets` | Folder frontend yang disajikan |

## Halaman (Frame 1–26)

Semua halaman frontend berada di `Sourcecode/1-Frontend/assets/`, satu folder per halaman:

| Frame | Halaman | Frame | Halaman |
| ----- | ------- | ----- | ------- |
| 1 | Login | 14 | Jadwal Shift |
| 2 | Beranda | 15 | Pulsa |
| 3 | Pencarian | 16 | Makanan |
| 4 | Kategori | 17 | Games |
| 5 | Detail Produk | 18 | Lainnya |
| 6 | Wishlist | 19 | Login Seller |
| 7 | Keranjang | 20 | Dashboard Seller |
| 8 | Pengiriman | 21 | Pengaturan Akun (Seller) |
| 9 | Pembayaran | 22 | Produk Saya (Seller) |
| 10 | Lacak Pesanan | 23 | Edit Produk (Seller) |
| 11 | Profil | 24 | Pesanan Saya (Seller) |
| 12 | Pengaturan Akun | 25 | Detail Pesanan (Seller) |
| 13 | Admin & CS | 26 | Login Admin |

## Akun Demo

Data akun berikut dibuat otomatis oleh `db_ecommerce.sql`:

| Role | Email | Password | Keterangan |
| ---- | ----- | -------- | ---------- |
| Pembeli | `demo@nexora.id` | `demo123` | Akun belanja demo |
| Penjual | `budi@nexora.id` | `penjual123` | Budi Digital Store |
| Penjual | `sari@nexora.id` | `penjual123` | Sari Fashion Store |
| Penjual | `joko@nexora.id` | `penjual123` | Toko Sepatu Jaya |
| Admin | `admin@nexora.id` | `admin123` | Wahyu Kusuma — shift Pagi |
| Admin/CS | `cs@nexora.id` | `admin123` | Dewi Lestari — shift Malam |

## API Documentation — Routing Map

Semua endpoint berawalan base URL `http://localhost:8080/api`. Body request dikirim sebagai JSON (`Content-Type: application/json`). Field yang ditandai **wajib** harus ada; field lainnya opsional.

Format respons seragam:

```json
{ "sukses": true,  "data": { ... } }
{ "sukses": false, "pesan": "alasan kegagalan" }
```

### Authentication Routes

| METHOD | ENDPOINT | DESCRIPTION | REQUEST BODY |
| ------ | -------- | ----------- | ------------ |
| POST | `/api/auth/register` | Registrasi pembeli baru | `nama`, `email`, `password` (wajib), `no_telepon`, `alamat` |
| POST | `/api/auth/login` | Login pembeli / penjual / admin, mengembalikan data akun + `role` | `email`, `password` |
| PUT | `/api/auth/profil` | Ubah profil pembeli (field yang tidak dikirim tetap memakai nilai lama) | `id` (wajib), `nama`, `no_telepon`, `alamat` |
| POST | `/api/auth/lupa-password` | Reset password (berlaku untuk pembeli, penjual, dan admin) | `email`, `password_baru` |

### Product Routes

| METHOD | ENDPOINT | DESCRIPTION | REQUEST BODY |
| ------ | -------- | ----------- | ------------ |
| GET | `/api/produk` | Daftar produk + jumlah terjual; mendukung filter. Query opsional: `search`, `kategori`, `id_toko` | — |
| GET | `/api/produk/{id}` | Detail satu produk | — |
| POST | `/api/produk` | Tambah produk baru | `nama_produk`, `id_penjual` (wajib), `harga`, `stok`, `kategori`, `deskripsi`, `foto_produk` |
| PUT | `/api/produk/{id}` | Ubah produk (parsial — cukup kirim field yang ingin diubah) | `nama_produk`, `harga`, `stok`, `kategori`, `deskripsi`, `foto_produk`, `id_penjual` |
| DELETE | `/api/produk/{id}` | Hapus produk | — |
| GET | `/api/kategori` | Daftar kategori unik dari semua produk | — |
| GET | `/api/toko` | Daftar toko + jumlah produk tiap toko. Query opsional: `search` | — |

### Cart Routes

| METHOD | ENDPOINT | DESCRIPTION | REQUEST BODY |
| ------ | -------- | ----------- | ------------ |
| POST | `/api/keranjang` | Tambah produk ke keranjang (jika produk sudah ada, jumlah diakumulasi — dibatasi stok tersedia) | `id_pembeli`, `id_produk` (wajib), `jumlah` (default 1) |
| GET | `/api/keranjang/{id_pembeli}` | Isi keranjang beserta subtotal item dan total belanja | — |
| PUT | `/api/keranjang/{id_pembeli}/{id_produk}` | Ubah jumlah item; `jumlah: 0` otomatis menghapus item | `jumlah` |
| DELETE | `/api/keranjang/{id_pembeli}/{id_produk}` | Hapus satu item dari keranjang | — |
| DELETE | `/api/keranjang/{id_pembeli}` | Kosongkan seluruh keranjang | — |

### Order Routes

Status pesanan yang valid: `Menunggu Pembayaran`, `Diproses`, `Dikemas`, `Dalam Perjalanan`, `Diterima`, `Dibatalkan`.

| METHOD | ENDPOINT | DESCRIPTION | REQUEST BODY |
| ------ | -------- | ----------- | ------------ |
| POST | `/api/pesanan/checkout` | Checkout dalam satu transaksi database: buat pesanan + detail, kurangi stok, kosongkan keranjang | `id_pembeli` (wajib), `items` berisi `{ id_produk, jumlah }` (wajib), `ongkir`, `biaya_layanan`, `diskon` |
| GET | `/api/pesanan/pembeli/{id_pembeli}` | Riwayat semua pesanan seorang pembeli | — |
| GET | `/api/pesanan/penjual/{id_penjual}` | Daftar pesanan masuk yang memuat produk penjual tersebut | — |
| GET | `/api/pesanan/{id}` | Detail pesanan: data pesanan + item + status pembayaran | — |
| PUT | `/api/pesanan/{id}/status` | Ubah status pesanan (penjual/admin) | `status` (wajib, salah satu status valid), `id_admin` |
| PUT | `/api/pesanan/{id}/verifikasi` | Admin memverifikasi pesanan — status langsung menjadi `Diproses` | `id_admin` (wajib) |

### Payment Routes

| METHOD | ENDPOINT | DESCRIPTION | REQUEST BODY |
| ------ | -------- | ----------- | ------------ |
| POST | `/api/pembayaran` | Catat pembayaran (satu pesanan hanya bisa dibayar sekali) — status pesanan menjadi `Diproses` | `id_pesanan`, `metode_bayar` (mis. QRIS, Transfer Bank, COD), `jumlah_bayar` (semua wajib) |
| GET | `/api/pembayaran/pesanan/{id_pesanan}` | Data pembayaran suatu pesanan | — |

### Wishlist Routes

| METHOD | ENDPOINT | DESCRIPTION | REQUEST BODY |
| ------ | -------- | ----------- | ------------ |
| POST | `/api/wishlist` | Tambah produk ke wishlist (tidak menduplikasi produk yang sudah ada) | `id_pembeli`, `id_produk` (wajib) |
| GET | `/api/wishlist/{id_pembeli}` | Daftar wishlist seorang pembeli | — |
| DELETE | `/api/wishlist/{id_pembeli}/{id_produk}` | Hapus produk dari wishlist | — |

### Admin Routes

| METHOD | ENDPOINT | DESCRIPTION | REQUEST BODY |
| ------ | -------- | ----------- | ------------ |
| GET | `/api/admin` | Daftar admin (id, nama, shift, email) | — |
| GET | `/api/admin/pesanan` | Semua pesanan di sistem beserta nama pembeli dan admin penangan — untuk monitoring Admin & CS | — |

Selain `/api/*`, server juga menyajikan file frontend statis dari folder `1-Frontend/assets` (halaman `Frame 1`–`Frame 26`), sehingga seluruh aplikasi berjalan dari satu server yang sama.

## Kontribusi

| Nama Anggota | NPM | Peran | Kontribusi (Branch) |
| ------------ | --- | ----- | ------------------- |
| Rakhyan Harun Nugraha | 4525210079 | Frontend | `rakhyan-frontend-css-js` |
| Syabita Putri Safina | 4525210072 | Frontend | `safina-frontend-css-js` |
| Theofani Natanya Anari Hutabarat | 4525210074 | Frontend | `theofani-frontend-css-js` |
| Muhammad Nadzril Ilham Kusuma | 4525210084 | Backend | `nadzril-backend-controllers` |
| Wahyu Maulana Fadilah | 4525210091 | Backend | `wahyu-backend-model-ALL` |
| Mahendro Hamonangan Putra Manihuruk | 4525210093 | Backend | `mahendro-backend-config-main` |
