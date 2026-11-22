pasangNavigasiDasar();
pasangKembali();

var user = sesi.baca();

var BARIS = [
  { wadah: ".rectangle-group", nama: ".samsung-s24-ultra", harga: ".rp-21999000", gambar: ".samsung-icon" },
  { wadah: ".group-div", nama: ".laptop-rass-x56", harga: ".rp-5699000", gambar: ".laptop-icon" },
  { wadah: ".rectangle-parent3", nama: ".vention-power-bank", harga: ".rp-345344", gambar: ".power-icon" }
];

function muatKeranjang() {
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk melihat keranjang.");
    keLogin();
    return;
  }
  API.get("/api/keranjang/" + user.id)
    .then(function (hasil) {
      var items = hasil.items;

      BARIS.forEach(function (baris, i) {
        var wadah = document.querySelector(baris.wadah);
        if (!wadah) return;
        if (!items[i]) { wadah.style.display = "none"; return; }
        wadah.style.display = "";

        var item = items[i];
        var elNama = wadah.querySelector(baris.nama);
        var elHarga = wadah.querySelector(baris.harga);
        var elGambar = wadah.querySelector(baris.gambar);
        var kotakJumlah = wadah.querySelector(".rectangle-container, .rectangle-parent4");

        if (elNama) {
          elNama.textContent = item.nama_produk;

          elNama.style.whiteSpace = "nowrap";
          elNama.style.overflow = "hidden";
          elNama.style.textOverflow = "ellipsis";
          elNama.style.display = "inline-block";
          elNama.style.width = "auto";
          elNama.style.height = "auto";
          elNama.style.maxWidth = "268px";
          elNama.style.lineHeight = "1.15";
          var panjangNama = String(item.nama_produk || "").length;
          if (panjangNama > 32) elNama.style.fontSize = "14px";
          else if (panjangNama > 24) elNama.style.fontSize = "16px";
        }
        if (elHarga) {
          elHarga.textContent = formatRupiah(item.subtotal);
          elHarga.style.whiteSpace = "nowrap";
        }
        if (elGambar && item.foto_produk) elGambar.src = item.foto_produk;

        if (kotakJumlah) {
          var tampil = kotakJumlah.querySelector(".b3");
          if (tampil) tampil.textContent = item.jumlah;

          var tombolTambah = kotakJumlah.querySelector(".b");
          var tombolKurang = kotakJumlah.querySelector(".b2");

          if (tombolTambah) tombolTambah.onclick = function () {
            ubahJumlah(item.id_produk, item.jumlah + 1, item.stok);
          };
          if (tombolKurang) tombolKurang.onclick = function () {
            ubahJumlah(item.id_produk, item.jumlah - 1, item.stok);
          };
        }

        var tombolSampah = wadah.querySelector(".tempatsampah-icon, .trash-5-icon2");
        if (tombolSampah) {
          tombolSampah.style.cursor = "pointer";
          tombolSampah.onclick = function () {
            if (!confirm("Hapus " + item.nama_produk + " dari keranjang?")) return;
            API.del("/api/keranjang/" + user.id + "/" + item.id_produk)
              .then(muatKeranjang)
              .catch(tampilkanError);
          };
        }
      });

      totalKeranjang = hasil.total;
      perbaruiTotalVoucher();
      var totalBarang = 0;
      items.forEach(function (it) { totalBarang += it.jumlah; });
      var elCheckout = document.querySelector(".checkout-1");
      if (elCheckout) elCheckout.textContent = "Checkout (" + totalBarang + ")";
    })
    .catch(tampilkanError);
}

function ubahJumlah(idProduk, jumlahBaru, stok) {
  if (jumlahBaru < 0) return;
  if (jumlahBaru > stok) { alert("Stok hanya " + stok); return; }
  API.put("/api/keranjang/" + user.id + "/" + idProduk, { jumlah: jumlahBaru })
    .then(muatKeranjang)
    .catch(tampilkanError);
}

if (user) muatKeranjang();

function checkoutSekarang() {
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk checkout.");
    keLogin();
    return;
  }
  API.get("/api/keranjang/" + user.id)
    .then(function (hasil) {
      if (!hasil.items.length) {
        alert("Keranjang masih kosong.");
        return;
      }
      pindahHalaman("../Frame%208/index.html");
    })
    .catch(tampilkanError);
}

pasangKlik(".rectangle-checkout, .kotakcheckout-icon, .kotak-checkout-icon, .checkout", checkoutSekarang);
pasangKlik(".checkout-1, .checkout-2", checkoutSekarang);

var IKON_CENTANG = "icons/KotakCentang.svg";
var IKON_KOSONG = "icons/KotakCentangKosong.svg";

var ikonPilihSemua = document.getElementById("ikonPilihSemua");
var ikonBarang = document.querySelectorAll(".iconoircheck-square-solid");

function setCentang(img, centang) {
  if (!img) return;
  img.src = centang ? IKON_CENTANG : IKON_KOSONG;
}

function semuaTercentang() {
  var tampil = Array.prototype.filter.call(ikonBarang, function (img) {
    var wadah = img.closest(".rectangle-group, .group-div, .rectangle-parent3");
    return wadah && wadah.style.display !== "none";
  });
  return tampil.length > 0 && tampil.every(function (img) {
    return img.src.indexOf("KotakCentang.svg") !== -1;
  });
}

function perbaruiPilihSemua() {
  if (ikonPilihSemua) setCentang(ikonPilihSemua, semuaTercentang());
}

ikonBarang.forEach(function (img) {
  img.addEventListener("click", function (e) {
    e.stopPropagation();
    var centang = img.src.indexOf("KotakCentang.svg") === -1;
    setCentang(img, centang);
    perbaruiPilihSemua();
  });
});

if (ikonPilihSemua) {
  ikonPilihSemua.addEventListener("click", function () {
    var centang = !semuaTercentang();
    ikonBarang.forEach(function (img) {
      var wadah = img.closest(".rectangle-group, .group-div, .rectangle-parent3");
      if (wadah && wadah.style.display !== "none") setCentang(img, centang);
    });
    setCentang(ikonPilihSemua, centang);
  });
}

var teksPilihSemua = document.getElementById("teksPilihSemua");
if (teksPilihSemua) {
  teksPilihSemua.addEventListener("click", function () {
    if (ikonPilihSemua) ikonPilihSemua.click();
  });
}

var KUNCI_VOUCHER = "voucher_dipakai";
var totalKeranjang = 0;

var VOUCHER_ADA = [
  { kode: "HEMAT12K",   jenis: "potongan", nilai: 12000, min: 50000,  keterangan: "Potongan Rp 12.000, min. belanja Rp 50.000" },
  { kode: "DISKON50K",  jenis: "potongan", nilai: 50000, min: 500000, keterangan: "Potongan Rp 50.000, min. belanja Rp 500.000" },
  { kode: "GRATISONGKIR", jenis: "ongkir", nilai: 25000, min: 0,     keterangan: "Gratis ongkir sampai Rp 25.000 saat pengiriman" }
];

function bacaVoucher() {
  try { return JSON.parse(localStorage.getItem(KUNCI_VOUCHER)); }
  catch (e) { return null; }
}

function simpanVoucher(v) {
  if (v) localStorage.setItem(KUNCI_VOUCHER, JSON.stringify(v));
  else localStorage.removeItem(KUNCI_VOUCHER);
}

function cariVoucher(kode) {
  var cari = String(kode || "").trim().toUpperCase();
  if (!cari) return null;
  for (var i = 0; i < VOUCHER_ADA.length; i++) {
    if (VOUCHER_ADA[i].kode === cari) return VOUCHER_ADA[i];
  }
  return null;
}

function potonganVoucher(v) {
  if (!v) return 0;
  if (v.jenis === "ongkir") return 0; 
  return Math.min(v.nilai, totalKeranjang);
}

function perbaruiBarisVoucher() {
  var el = document.getElementById("teksVoucher");
  if (!el) return;
  var v = bacaVoucher();
  if (v) {
    var teks = v.kode;
    if (v.jenis === "potongan") {
      teks += "  \u2022  hemat " + formatRupiah(potonganVoucher(v));
    } else {
      teks += "  \u2022  gratis ongkir";
    }
    el.textContent = teks;
    el.style.color = "#0b655e";
    el.style.fontWeight = "700";
  } else {
    el.textContent = "Pilih atau masukkan kode";
    el.style.color = "";
    el.style.fontWeight = "";
  }
}

function perbaruiTotalVoucher() {
  var el = document.querySelector(".rp21999000");
  if (!el) return;
  var v = bacaVoucher();
  var bayar = totalKeranjang - (v ? potonganVoucher(v) : 0);
  if (bayar < 0) bayar = 0;
  el.textContent = formatRupiah(bayar);
}

var popupVoucher = document.getElementById("popupVoucher");
var inputVoucher = document.getElementById("inputVoucher");
var pesanVoucher = document.getElementById("pesanVoucher");
var voucherTerpilih = null;

function bukaPopupVoucher() {
  if (!popupVoucher) return;
  voucherTerpilih = null;
  if (inputVoucher) inputVoucher.value = "";
  if (pesanVoucher) pesanVoucher.textContent = "";
  gambarDaftarVoucher();
  popupVoucher.classList.add("active");
}

function tutupPopupVoucher() {
  if (popupVoucher) popupVoucher.classList.remove("active");
}

function gambarDaftarVoucher() {
  var wadah = document.getElementById("daftarVoucher");
  if (!wadah) return;
  var dipakai = bacaVoucher();
  wadah.innerHTML = VOUCHER_ADA.map(function (v, i) {
    return (
      '<div class="kartu-voucher' + (dipakai && dipakai.kode === v.kode ? " dipilih" : "") + '" data-indeks="' + i + '">' +
        '<div class="kode-voucher">' + v.kode + "</div>" +
        '<div class="keterangan-voucher">' + v.keterangan + "</div>" +
      "</div>"
    );
  }).join("");

  wadah.querySelectorAll(".kartu-voucher").forEach(function (kartu) {
    kartu.addEventListener("click", function () {
      voucherTerpilih = VOUCHER_ADA[parseInt(kartu.getAttribute("data-indeks"), 10)];
      wadah.querySelectorAll(".kartu-voucher").forEach(function (k) { k.classList.remove("dipilih"); });
      kartu.classList.add("dipilih");
      if (inputVoucher) inputVoucher.value = voucherTerpilih.kode;
      if (pesanVoucher) pesanVoucher.textContent = "";
    });
  });
}

function pasangVoucher(v) {
  if (v.min > totalKeranjang) {
    if (pesanVoucher) pesanVoucher.textContent =
      "Voucher " + v.kode + " butuh belanja minimal " + formatRupiah(v.min) +
      " (sekarang " + formatRupiah(totalKeranjang) + ").";
    return;
  }
  simpanVoucher({ kode: v.kode, jenis: v.jenis, nilai: v.nilai, min: v.min });
  perbaruiBarisVoucher();
  perbaruiTotalVoucher();
  tutupPopupVoucher();
}

pasangKlik("#barisVoucher, #barisVoucher .pilih-atau-masukkan, #barisVoucher .panahkanan-icon", bukaPopupVoucher);

if (document.getElementById("tutupPopupVoucher")) {
  document.getElementById("tutupPopupVoucher").addEventListener("click", tutupPopupVoucher);
}
if (popupVoucher) {
  popupVoucher.addEventListener("click", function (e) {
    if (e.target === popupVoucher) tutupPopupVoucher();
  });
}
if (inputVoucher) {
  inputVoucher.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (document.getElementById("gunakanVoucher")) document.getElementById("gunakanVoucher").click();
    }
  });
}
if (document.getElementById("gunakanVoucher")) {
  document.getElementById("gunakanVoucher").addEventListener("click", function () {
    var kode = inputVoucher ? inputVoucher.value : "";
    var v = cariVoucher(kode);
    if (!v) {
      if (pesanVoucher) pesanVoucher.textContent =
        'Kode "' + (kode ? kode.toUpperCase() : "") + '" tidak dikenali. Coba HEMAT12K, DISKON50K, atau GRATISONGKIR.';
      return;
    }
    pasangVoucher(v);
  });
}
if (document.getElementById("hapusVoucher")) {
  document.getElementById("hapusVoucher").addEventListener("click", function () {
    simpanVoucher(null);
    voucherTerpilih = null;
    perbaruiBarisVoucher();
    perbaruiTotalVoucher();
    gambarDaftarVoucher();
    if (pesanVoucher) pesanVoucher.textContent = "Voucher dilepas.";
  });
}

perbaruiBarisVoucher();
