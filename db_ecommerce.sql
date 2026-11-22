CREATE DATABASE IF NOT EXISTS db_ecommerce
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE db_ecommerce;

CREATE TABLE pembeli (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  nama               VARCHAR(100) NOT NULL,
  email              VARCHAR(100) NOT NULL UNIQUE,
  password           CHAR(64)     NOT NULL,
  no_telepon         VARCHAR(20),
  alamat_pengiriman  TEXT
) ENGINE=InnoDB;

CREATE TABLE penjual (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nama        VARCHAR(100) NOT NULL,
  nama_toko   VARCHAR(100) NOT NULL,
  alamat_toko TEXT,
  no_telepon  VARCHAR(20),
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    CHAR(64)     NOT NULL
) ENGINE=InnoDB;

CREATE TABLE admin (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nama_admin VARCHAR(100) NOT NULL,
  shift      VARCHAR(20),
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   CHAR(64)     NOT NULL
) ENGINE=InnoDB;

CREATE TABLE produk (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nama_produk  VARCHAR(150) NOT NULL,
  harga        DECIMAL(12,2) NOT NULL,
  stok         INT NOT NULL DEFAULT 0,
  kategori     VARCHAR(50),
  deskripsi    TEXT,
  foto_produk  VARCHAR(255),
  id_penjual   INT NOT NULL,
  CONSTRAINT fk_produk_penjual FOREIGN KEY (id_penjual)
    REFERENCES penjual (id)
) ENGINE=InnoDB;

CREATE TABLE pesanan (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  tgl_pesanan   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_pembeli    INT NOT NULL,
  status        VARCHAR(30) NOT NULL DEFAULT 'Menunggu Pembayaran',
  subtotal      DECIMAL(12,2) NOT NULL DEFAULT 0,
  ongkir        DECIMAL(12,2) NOT NULL DEFAULT 0,
  biaya_layanan DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_harga   DECIMAL(12,2) NOT NULL DEFAULT 0,
  id_admin      INT NULL,
  CONSTRAINT fk_pesanan_pembeli FOREIGN KEY (id_pembeli)
    REFERENCES pembeli (id),
  CONSTRAINT fk_pesanan_admin FOREIGN KEY (id_admin)
    REFERENCES admin (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE detail_pesanan (
  id_pesanan      INT NOT NULL,
  id_produk       INT NOT NULL,
  jumlah          INT NOT NULL,
  harga_saat_beli DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id_pesanan, id_produk),
  CONSTRAINT fk_detail_pesanan FOREIGN KEY (id_pesanan)
    REFERENCES pesanan (id) ON DELETE CASCADE,
  CONSTRAINT fk_detail_produk FOREIGN KEY (id_produk)
    REFERENCES produk (id)
) ENGINE=InnoDB;

CREATE TABLE pembayaran (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  id_pesanan   INT NOT NULL UNIQUE,
  metode_bayar VARCHAR(50) NOT NULL,
  tgl_bayar    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  jumlah_bayar DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_pembayaran_pesanan FOREIGN KEY (id_pesanan)
    REFERENCES pesanan (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE keranjang (
  id_pembeli INT NOT NULL,
  id_produk  INT NOT NULL,
  jumlah     INT NOT NULL DEFAULT 1,
  PRIMARY KEY (id_pembeli, id_produk),
  CONSTRAINT fk_keranjang_pembeli FOREIGN KEY (id_pembeli)
    REFERENCES pembeli (id) ON DELETE CASCADE,
  CONSTRAINT fk_keranjang_produk FOREIGN KEY (id_produk)
    REFERENCES produk (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE wishlist (
  id_pembeli          INT NOT NULL,
  id_produk           INT NOT NULL,
  tanggal_ditambahkan DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pembeli, id_produk),
  CONSTRAINT fk_wishlist_pembeli FOREIGN KEY (id_pembeli)
    REFERENCES pembeli (id) ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_produk FOREIGN KEY (id_produk)
    REFERENCES produk (id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO penjual (nama, nama_toko, alamat_toko, no_telepon, email, password) VALUES
('Budi Santoso', 'Budi Digital Store', 'Jl. Margonda No. 12, Depok', '081234567801', 'budi@nexora.id', 'e213432b80faf29af4f0d4eeb923dd2005e1ab535a8d2495d36353cc844a406d'),
('Sari Wulandari', 'Sari Fashion Store', 'Jl. Asia Afrika No. 88, Bandung', '081234567802', 'sari@nexora.id', 'e213432b80faf29af4f0d4eeb923dd2005e1ab535a8d2495d36353cc844a406d'),
('Joko Prasetyo', 'Toko Sepatu Jaya', 'Jl. Mangga Dua No. 7, Jakarta', '081234567803', 'joko@nexora.id', 'e213432b80faf29af4f0d4eeb923dd2005e1ab535a8d2495d36353cc844a406d');

INSERT INTO admin (nama_admin, shift, email, password) VALUES
('Wahyu Kusuma', 'Pagi', 'admin@nexora.id', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'),
('Dewi Lestari', 'Malam', 'cs@nexora.id',  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');

INSERT INTO pembeli (nama, email, password, no_telepon, alamat_pengiriman) VALUES
('Pembeli Demo', 'demo@nexora.id', 'd3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791', '081200001122', 'Jl. Kenanga No. 5, Jakarta Selatan');

INSERT INTO produk (nama_produk, harga, stok, kategori, deskripsi, foto_produk, id_penjual) VALUES
('Samsung Galaxy S24 Ultra', 19999000.00, 10, 'Elektronik', 'Layar 6.8 inci, RAM 12GB, garansi resmi 1 tahun.', '/Frame 3/icons/SamsungHP.svg', 1),
('iPhone 16 Pro Max',        24999000.00, 8,  'Elektronik', 'Chip A18 Pro, kapasitas 256GB, warna Titanium.', '/Frame 2/icons/Iphone16.png', 1),
('Headphone Bluetooth',       349000.00, 25, 'Elektronik', 'Headphone TWS masa aktif 30 jam, garansi toko.', '/Frame 6/icons/headset.svg', 1),
('PowerBank 20.000 mAh',      199000.00, 40, 'Elektronik', 'Power bank fast charging 22.5W, 2 port USB.', '/Frame 6/icons/powerBank.svg', 1),
('Keyboard Mekanikal RGB',    450000.00, 15, 'Elektronik', 'Switch biru, keycaps PBT, mode kabel & bluetooth.', '/Frame 3/icons/RTX.svg', 1),
('Mouse Wireless 2.4GHz',     150000.00, 30, 'Elektronik', 'Sensor 16000 DPI, baterai tahan 6 bulan.', '/Frame 6/icons/music.svg', 1),
('Sneakers Classic',          499000.00, 20, 'Fashion',    'Sepatu kasual unisex, ukuran 38-44.', '/Frame 3/icons/Sneakers.svg', 2),
('Jam Tangan Digital',        259000.00, 18, 'Fashion',    'Jam tangan pria anti air 3ATM, strap karet.', '/Frame 2/icons/JamTangan.png', 2),
('Earbud Open-Ear',           279000.00, 12, 'Elektronik', 'Desain open-ear ringan, IPX5 sweatproof.', '/Frame 3/icons/OpenEAR.svg', 2),

('G2G Niacinamide Serum Facial Wash', 115000.00, 30, 'Kosmetik', 'Serum pencerah dengan niacinamide, isi 30ml.', '/Frame 4/icons/serumpink.png', 1),
('Skin401 Eye Serum',          161000.00, 20, 'Kosmetik', 'Serum area mata mengurangi mata panda, isi 20ml.', '/Frame 4/icons/skinserum.png', 1),
('HNI Day Cream',               85000.00, 25, 'Kosmetik', 'Krim siang SPF 30 untuk kulit wajar.', '/Frame 4/icons/cream.png', 1),
('Dumbbell Set 20 Kg',        589000.00, 10, 'Olahraga', 'Sepasang dumbbell besi 10kg dengan connector jadi barbel.', '/Frame 4/icons/dumbell.png', 2),
('Sepatu Lari AZA RUN 1',     521000.00, 15, 'Olahraga', 'Sepatu lari ringan, cushioning empuk, ukuran 39-44.', '/Frame 4/icons/SepatuMerah.png', 2),
('Treadmill 9 in 1',         1481000.00,  5, 'Olahraga', 'Treadmill lipat multifungsi dengan monitor LCD.', '/Frame 4/icons/treadmill.png', 2),
('Tangga Serbaguna',          620000.00, 12, 'Rumah Tangga', 'Tangga lipat aluminium 4 step, muat 150kg.', '/Frame 4/icons/tangga.png', 1),
('Toolkit VX300 Blacktiger',  340000.00, 18, 'Rumah Tangga', 'Toolkit 55 pcs dengan koper bonus.', '/Frame 4/icons/toolkit.png', 1),
('Kompor Gas Tanam 2 Stove', 5124000.00,  6, 'Rumah Tangga', 'Kompor tanam 2 tungku dengan pemantik otomatis.', '/Frame 4/icons/kompor.png', 1),
('Indomie Goreng 85g',        129000.00, 50, 'Makanan & Minuman', 'Karton isi 40 pcs, rasa goreng klasik.', '/Frame 4/icons/indomie.png', 2),
('Yakult Pack 5',             13000.00, 40, 'Makanan & Minuman', 'Pack isi 5 botol, dikirim dingin.', '/Frame 4/icons/yakult.png', 2),
('Tulip Cocoa Powder',        195000.00, 20, 'Makanan & Minuman', 'Bubuk kakao 250gram untuk kue dan minuman.', '/Frame 4/icons/kopi.png', 2),
('Sepatu Basket Pro Dunk',   799000.00, 12, 'Olahraga', 'Sepatu basket high-cut, sol empuk, ukuran 40-45.', '/Frame 3/icons/Sneakers.svg', 3),
('Sepatu Futsal Sprint',     429000.00, 16, 'Olahraga', 'Sepatu futsal outsole karet anti selip, ukuran 38-44.', '/Frame 4/icons/SepatuMerah.png', 3);
