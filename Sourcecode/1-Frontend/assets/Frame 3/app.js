pasangNavigasiDasar();

var kataCari = paramUrl("q") || "";
var kategori = paramUrl("kategori") || "";
var tabAktif = "semua"; 

var kotakCari = document.getElementById("inputPencarian");

function jalankanPencarian() {
  if (!kotakCari || !kotakCari.value.trim()) {
    alert("Ketik dulu kata kunci pencariannya.");
    return;
  }
  pindahHalaman("index.html?q=" + encodeURIComponent(kotakCari.value.trim()));
}

if (kotakCari) {
  if (kataCari) kotakCari.value = kataCari;
  else if (kategori) kotakCari.value = kategori;

  kotakCari.addEventListener("keydown", function (e) {
    if (e.key === "Enter") jalankanPencarian();
  });
}

var ikonCari = document.getElementById("ikonCari");
if (ikonCari) ikonCari.addEventListener("click", jalankanPencarian);

if (paramUrl("fokus") === "1" && kotakCari) {
  setTimeout(function () { kotakCari.focus(); }, 150);
}

var TAB_ID = { semua: "tabSemua", produk: "tabProduk", toko: "tabToko" };

var GARIS_TAB = { semua: ".line-div", produk: ".frame-3-done-child2", toko: ".frame-3-done-child3" };
var WARNA_GARIS_AKTIF = "#029d29";
var WARNA_GARIS_NONAKTIF = "#25d77e";

function pindahkanGarisTab(tab) {
  Object.keys(GARIS_TAB).forEach(function (nama) {
    var garis = document.querySelector(GARIS_TAB[nama]);
    if (!garis) return;
    garis.style.borderTop = "3px solid " + (nama === tab ? WARNA_GARIS_AKTIF : WARNA_GARIS_NONAKTIF);
  });
}

function tampilkanTab(tab) {
  tabAktif = tab;
  Object.keys(TAB_ID).forEach(function (nama) {
    var el = document.getElementById(TAB_ID[nama]);
    if (el) el.classList.toggle("dipilih", nama === tab);
  });
  pindahkanGarisTab(tab);

  var tampilProduk = tab !== "toko";
  KARTU.forEach(function (kartu) {
    var wadah = document.querySelector(kartu.wadah);
    if (wadah && wadah.dataset.punyaProduk !== "0") {
      wadah.style.display = (tampilProduk && !produkDinamisAktif) ? "" : "none";
    }
  });

  var elProduk = document.getElementById("daftarProduk");
  if (elProduk) elProduk.style.display = tampilProduk ? "block" : "none";

  var elToko = document.getElementById("daftarToko");
  if (elToko) elToko.style.display = tab === "toko" ? "block" : "none";

  perbaruiJumlahHasil();
}

Object.keys(TAB_ID).forEach(function (nama) {
  var el = document.getElementById(TAB_ID[nama]);
  if (el) el.addEventListener("click", function () { tampilkanTab(nama); });
});

var popupFilter = document.getElementById("popupFilter");
var urutanPilih = "terbaru";
var filterHargaMin = null;
var filterHargaMax = null;

function bukaPopupFilter() {
  if (!popupFilter) return;
  var elMin = document.getElementById("hargaMin");
  var elMax = document.getElementById("hargaMax");
  if (elMin) elMin.value = filterHargaMin === null ? "" : filterHargaMin;
  if (elMax) elMax.value = filterHargaMax === null ? "" : filterHargaMax;
  var elPesan = document.getElementById("pesanFilter");
  if (elPesan) elPesan.textContent = "";
  popupFilter.classList.add("active");
}

function tutupPopupFilter() {
  if (popupFilter) popupFilter.classList.remove("active");
}

pasangKlik("#tombolFilter, #ikonFilter", bukaPopupFilter);

if (document.getElementById("tutupPopupFilter")) {
  document.getElementById("tutupPopupFilter").addEventListener("click", tutupPopupFilter);
}
if (popupFilter) {
  popupFilter.addEventListener("click", function (e) {
    if (e.target === popupFilter) tutupPopupFilter();
  });
}

(function pasangPilihanUrutan() {
  var daftar = document.getElementById("daftarUrutan");
  if (!daftar) return;
  daftar.querySelectorAll(".pilihan-urutan").forEach(function (el) {
    el.addEventListener("click", function () {
      urutanPilih = el.getAttribute("data-urutan") || "terbaru";
      daftar.querySelectorAll(".pilihan-urutan").forEach(function (k) { k.classList.remove("dipilih"); });
      el.classList.add("dipilih");
    });
  });
})();

function terapkanFilterPopup() {
  var elMin = document.getElementById("hargaMin");
  var elMax = document.getElementById("hargaMax");
  var elPesan = document.getElementById("pesanFilter");
  var min = elMin && elMin.value !== "" ? parseFloat(elMin.value) : null;
  var max = elMax && elMax.value !== "" ? parseFloat(elMax.value) : null;

  if (elPesan) elPesan.textContent = "";
  if (min !== null && isNaN(min) || max !== null && isNaN(max)) {
    if (elPesan) elPesan.textContent = "Harga harus berupa angka.";
    return;
  }
  if (min !== null && min < 0) { min = 0; }
  if (max !== null && max < 0) { max = 0; }
  if (min !== null && max !== null && min > max) {
    if (elPesan) elPesan.textContent = "Harga minimum tidak boleh lebih besar dari maksimum.";
    return;
  }

  filterHargaMin = min;
  filterHargaMax = max;
  gambarProduk(hitungHasilFilter());
  tutupPopupFilter();
}

if (document.getElementById("terapkanFilter")) {
  document.getElementById("terapkanFilter").addEventListener("click", terapkanFilterPopup);
}
if (document.getElementById("resetFilter")) {
  document.getElementById("resetFilter").addEventListener("click", function () {
    filterHargaMin = null;
    filterHargaMax = null;
    urutanPilih = "terbaru";
    var daftar = document.getElementById("daftarUrutan");
    if (daftar) daftar.querySelectorAll(".pilihan-urutan").forEach(function (k) {
      k.classList.toggle("dipilih", k.getAttribute("data-urutan") === "terbaru");
    });
    var elMin = document.getElementById("hargaMin");
    var elMax = document.getElementById("hargaMax");
    if (elMin) elMin.value = "";
    if (elMax) elMax.value = "";
    gambarProduk(hitungHasilFilter());
    tutupPopupFilter();
  });
}

function hitungHasilFilter() {
  var hasil = (daftarProdukSekarang || []).filter(function (p) {
    if (filterHargaMin !== null && p.harga < filterHargaMin) return false;
    if (filterHargaMax !== null && p.harga > filterHargaMax) return false;
    return true;
  });

  if (urutanPilih === "murah") {
    hasil = hasil.slice().sort(function (a, b) { return a.harga - b.harga; });
  } else if (urutanPilih === "mahal") {
    hasil = hasil.slice().sort(function (a, b) { return b.harga - a.harga; });
  }
  return hasil;
}

var daftarProdukSekarang = [];
var daftarTokoSekarang = [];
var produkDinamisAktif = false;

var hasilTampilProduk = [];
var hasilTampilToko = [];

function perbaruiJumlahHasil() {
  var elJumlah = document.getElementById("jumlahHasil");
  if (!elJumlah) return;
  if (tabAktif === "toko") {
    elJumlah.textContent = hasilTampilToko.length + " Toko ditemukan";
  } else {
    elJumlah.textContent = hasilTampilProduk.length + " Produk ditemukan";
  }
}

if (kataCari) {
  if (document.getElementById("hasilPencarian")) {
    document.getElementById("hasilPencarian").textContent =
      'Hasil pencarian untuk, "' + kataCari + '"';
  }
} else if (kategori) {
  if (document.getElementById("hasilPencarian")) {
    document.getElementById("hasilPencarian").textContent =
      'Menampilkan produk kategori "' + kategori + '"';
  }
}

var wadahProduk = document.getElementById("daftarProduk");

function kartuProdukHTML(produk) {
  var rating = [4.8, 4.6, 4.7, 4.5][produk.id % 4];
  var ulasan = [50, 68, 290, 120][produk.id % 4];
  var foto = produk.foto_produk && produk.foto_produk !== ""
    ? produk.foto_produk
    : "icons/SamsungHP.svg";
  var namaAman = String(produk.nama_produk || "Produk").replace(/</g, "&lt;");
  return (
    '<div class="kartu-produk" data-id="' + produk.id + '">' +
      '<img class="foto-produk" src="' + foto + '" alt="' + namaAman + '" data-id="' + produk.id + '">' +
      '<div class="isi-produk">' +
        '<span class="tersedia-label">Tersedia</span>' +
        '<img class="ikon-wishlist" src="icons/Wishlistt.svg" alt="Wishlist" data-id="' + produk.id + '">' +
        '<div class="nama-produk" data-id="' + produk.id + '">' + namaAman + "</div>" +
        '<div class="baris-rating">' +
          '<img class="ikon-bintang" src="icons/Bintang.svg" alt="">' +
          '<span class="angka-rating">' + rating + "</span>" +
          '<span class="garis-rating"></span>' +
          '<span class="teks-ulasan">' + ulasan + " Ulasan</span>" +
        "</div>" +
        '<div class="harga-produk">' + formatRupiah(produk.harga) + "</div>" +
      "</div>" +
      '<div class="tombol-keranjang" data-id="' + produk.id + '">' +
        '<div class="kotak-keranjang"></div>' +
        '<img class="ikon-keranjang" src="icons/KeranjanggBiruuh.svg" alt="Keranjang">' +
      "</div>" +
    "</div>"
  );
}

function gambarProduk(daftar) {
  hasilTampilProduk = daftar || [];
  perbaruiJumlahHasil();
  if (!wadahProduk) return;
  if (!daftar || !daftar.length) {
    wadahProduk.innerHTML =
      '<div style="text-align:center;color:#888;font-family:Poppins;font-size:13px;padding:24px 0;">' +
      "Tidak ada produk yang cocok." + "</div>";
    wadahProduk.style.display = tabAktif === "toko" ? "none" : "block";
    produkDinamisAktif = true;
    return;
  }
  wadahProduk.innerHTML = daftar.map(kartuProdukHTML).join("");
  wadahProduk.style.display = tabAktif === "toko" ? "none" : "block";
  produkDinamisAktif = true;

  KARTU.forEach(function (kartu) {
    var wadah = document.querySelector(kartu.wadah);
    if (wadah) wadah.style.display = "none";
  });

  wadahProduk.querySelectorAll(".foto-produk, .nama-produk").forEach(function (el) {
    el.style.cursor = "pointer";
    el.addEventListener("click", function () {
      keDetail(el.getAttribute("data-id"));
    });
  });

  wadahProduk.querySelectorAll(".ikon-wishlist").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      tambahWishlist(el.getAttribute("data-id"));
    });
  });

  wadahProduk.querySelectorAll(".tombol-keranjang").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      tambahKeranjang(el.getAttribute("data-id"));
    });
  });
}

var KARTU = [
  { wadah: ".rectangle-group", nama: ".samsung-s24-ultra", harga: ".rp21999000", gambar: "#samsungHpIcon" },
  { wadah: ".rectangle-container", nama: ".nvidia-geforce-rtx", harga: ".rp-173999000", gambar: ".rtx-icon" },
  { wadah: ".rectangle-parent2", nama: ".sneakers-classic-black", harga: ".rp-4899000", gambar: ".sneakers-icon" },
  { wadah: ".rectangle-parent4", nama: ".headset-openear-2", harga: ".rp-550000", gambar: ".openear-icon" }
];

function tambahKeranjang(idProduk) {
  var user = sesi.baca();
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk memakai keranjang.");
    keLogin();
    return;
  }
  API.post("/api/keranjang", { id_pembeli: user.id, id_produk: idProduk, jumlah: 1 })
    .then(function (h) { alert(h.pesan); })
    .catch(tampilkanError);
}

function tambahWishlist(idProduk) {
  var user = sesi.baca();
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk memakai wishlist.");
    keLogin();
    return;
  }
  API.post("/api/wishlist", { id_pembeli: user.id, id_produk: idProduk })
    .then(function (h) { alert(h.pesan); })
    .catch(tampilkanError);
}

function isiKartu(kartu, produk) {
  var wadah = document.querySelector(kartu.wadah);
  if (!wadah) return;
  if (!produk) {
    wadah.style.display = "none";
    wadah.dataset.punyaProduk = "0";
    return;
  }
  wadah.dataset.punyaProduk = "1";

  var elNama = wadah.querySelector(kartu.nama);
  var elHarga = wadah.querySelector(kartu.harga);
  var elGambar = wadah.querySelector(kartu.gambar);

  if (elNama) {
    elNama.textContent = produk.nama_produk;
    elNama.style.cursor = "pointer";
    elNama.onclick = function () { keDetail(produk.id); };
  }
  if (elHarga) elHarga.textContent = formatRupiah(produk.harga);
  if (elGambar) {
    if (produk.foto_produk) elGambar.src = produk.foto_produk;
    elGambar.style.cursor = "pointer";
    elGambar.onclick = function () { keDetail(produk.id); };
  }

  var tombolKeranjang = wadah.querySelector(".cart-icon2");
  if (tombolKeranjang) {
    tombolKeranjang.style.cursor = "pointer";
    tombolKeranjang.onclick = function (e) {
      e.stopPropagation();
      tambahKeranjang(produk.id);
    };
  }

  var tombolWishlist = wadah.querySelector(".wishlistt-icon, .vector-icon4, .vector-icon6, .vector-icon8");
  if (tombolWishlist) {
    tombolWishlist.style.cursor = "pointer";
    tombolWishlist.onclick = function (e) {
      e.stopPropagation();
      tambahWishlist(produk.id);
    };
  }

  var tombolSampah = wadah.querySelector(".tempatsampah-icon");
  if (tombolSampah) tombolSampah.style.display = "none";
}

var TOKO_BANTUAN = [
  {
    id: 1,
    nama_toko: "Budi Digital Store",
    nama: "Budi Santoso",
    alamat_toko: "Jl. Margonda No. 12, Depok",
    jumlah_produk: 6,
    produk: ["Samsung Galaxy S24 Ultra", "iPhone 16 Pro Max", "Headphone Bluetooth", "PowerBank 20.000 mAh", "Keyboard Mekanikal RGB", "Mouse Wireless"]
  },
  {
    id: 2,
    nama_toko: "Sari Fashion Store",
    nama: "Sari Wulandari",
    alamat_toko: "Jl. Asia Afrika No. 88, Bandung",
    jumlah_produk: 4,
    produk: ["Sneakers Classic", "Sepatu Lari AZA RUN 1", "Jam Tangan Digital", "Earbud Open-Ear"]
  },
  {
    id: 3,
    nama_toko: "Toko Sepatu Jaya",
    nama: "Joko Prasetyo",
    alamat_toko: "Jl. Mangga Dua No. 7, Jakarta",
    jumlah_produk: 2,
    produk: ["Sepatu Basket Pro Dunk", "Sepatu Futsal Sprint"]
  }
];

function kartuTokoHTML(toko) {
  var inisial = (toko.nama_toko || "?").split(" ").map(function (k) { return k.charAt(0); }).slice(0, 2).join("");
  return (
    '<div class="kartu-toko">' +
      '<div class="logo-toko">' + inisial + "</div>" +
      '<div class="info-toko">' +
        '<div class="nama-toko">' + toko.nama_toko + "</div>" +
        '<div class="meta-toko">Pemilik: ' + (toko.nama || "-") + " &bull; " + (toko.alamat_toko || "-") + "</div>" +
        '<div class="produk-toko">' + (toko.jumlah_produk || 0) + " produk dijual</div>" +
      "</div>" +
      '<button class="kunjungi-toko" data-id="' + (toko.id || "") + '" data-nama="' + (toko.nama_toko || "") + '">Kunjungi</button>' +
    "</div>"
  );
}

function muatToko() {
  var urlToko = "/api/toko";
  if (kataCari) urlToko += "?search=" + encodeURIComponent(kataCari);
  API.get(urlToko)
    .then(function (daftar) {
      daftarTokoSekarang = daftar || [];
      gambarToko();
    })
    .catch(function () {
      daftarTokoSekarang = TOKO_BANTUAN;
      gambarToko();
    });
}

function gambarToko() {
  var wadah = document.getElementById("daftarToko");
  if (!wadah) return;

  var kata = (kataCari || "").toLowerCase();
  var hasil = daftarTokoSekarang.filter(function (t) {
    if (!kata) return true;
    var teks = ((t.nama_toko || "") + " " + (t.nama || "") + " " + (t.alamat_toko || "")).toLowerCase();
    if (teks.includes(kata)) return true;
    if ((t.produk_cocok || 0) > 0) return true;
    var jualan = Array.isArray(t.produk) ? t.produk.join(" ").toLowerCase() : "";
    return jualan.includes(kata);
  });

  hasilTampilToko = hasil;
  perbaruiJumlahHasil();

  wadah.innerHTML = hasil.length
    ? hasil.map(kartuTokoHTML).join("")
    : '<div style="text-align:center;color:#888;font-family:Poppins;font-size:13px;padding:24px 0;">' +
      "Tidak ada toko yang cocok dengan \"" + kataCari + "\".<br>" +
      "Coba kata lain, atau buka daftar toko lewat tab Toko tanpa kata kunci." +
      "</div>";

  wadah.querySelectorAll(".kunjungi-toko").forEach(function (tombol) {
    tombol.style.cursor = "pointer";
    tombol.addEventListener("click", function () {
      var id = tombol.getAttribute("data-id");
      var nama = tombol.getAttribute("data-nama");
      if (!id) {
        alert("Data toko tidak lengkap, tidak bisa dibuka.");
        return;
      }
      pindahHalaman("index.html?toko=" + encodeURIComponent(id) +
        "&nama_toko=" + encodeURIComponent(nama || ""));
    });
  });
}

var tokoCari = paramUrl("toko") || "";
var namaTokoCari = paramUrl("nama_toko") || "";

var url = "/api/produk";
var query = [];
if (kataCari) query.push("search=" + encodeURIComponent(kataCari));
if (kategori) query.push("kategori=" + encodeURIComponent(kategori));
if (tokoCari) query.push("id_toko=" + encodeURIComponent(tokoCari));
if (query.length) url += "?" + query.join("&");

if (tokoCari) {
  var elHasil = document.getElementById("hasilPencarian");
  if (elHasil) elHasil.textContent = 'Produk dari toko, "' + (namaTokoCari || tokoCari) + '"';
  var kotakToko = document.getElementById("inputPencarian");
  if (kotakToko) kotakToko.value = namaTokoCari || tokoCari;
}

API.get(url)
  .then(function (daftar) {
    daftarProdukSekarang = daftar || [];
    gambarProduk(hitungHasilFilter());
    KARTU.forEach(function (kartu, i) { isiKartu(kartu, daftar[i]); });
    perbaruiJumlahHasil();
  })
  .catch(function (err) {
    var elJumlah = document.getElementById("jumlahHasil");
    if (elJumlah) elJumlah.textContent = "Server tidak terhubung: " + err.message;
  });

muatToko();
tampilkanTab("semua");
