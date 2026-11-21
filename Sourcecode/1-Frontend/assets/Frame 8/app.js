var user = sesi.wajibPembeli();

var EKSPEDISI = [
  { kartu: ".rectangle-parent",   ongkir: 15000, nama: "JNE Express" },
  { kartu: ".rectangle-group",    ongkir: 25000, nama: "SiLambat" },
  { kartu: ".rectangle-container", ongkir: 45000, nama: "Deliverinn" }
];
var ongkirPilih = 15000;
var BIAYA_LAYANAN = 2000;

document.querySelector(".vector-parent .wahyu-kusuma").textContent = user.nama;
document.querySelector(".vector-parent .div").textContent = user.no_telepon || "-";
document.querySelector(".vector-parent .jl-barat-landak").textContent =
  user.alamat || "Belum ada alamat - atur di Pengaturan Akun";

document.querySelector(".vector-group").style.display = "none";

function gambarRadio(kartu) {
  return kartu.querySelector(".akar-iconsradio-fill, .akar-iconsradio");
}

function pilihEkspedisi(indeks) {
  ongkirPilih = EKSPEDISI[indeks].ongkir;
  EKSPEDISI.forEach(function (e, i) {
    var kartu = document.querySelector(e.kartu);
    var radio = gambarRadio(kartu);
    if (!radio) return;
    radio.src = (i === indeks) ? "icons/BuletDalam.svg" : "icons/BuletKosong.svg";
    kartu.style.cursor = "pointer";
  });
  hitungRincian();
}

EKSPEDISI.forEach(function (e, i) {
  var kartu = document.querySelector(e.kartu);
  if (kartu) kartu.addEventListener("click", function () { pilihEkspedisi(i); });
});
pilihEkspedisi(0);

var subtotalPesanan = 0;
var itemsKeranjang = [];

API.get("/api/keranjang/" + user.id)
  .then(function (hasil) {
    if (!hasil.items.length) {
      alert("Keranjang kosong. Pilih produk dulu.");
      window.location.href = "../Frame%203/index.html";
      return;
    }
    itemsKeranjang = hasil.items;
    subtotalPesanan = hasil.total;
    hitungRincian();
  })
  .catch(tampilkanError);

function hitungRincian() {
  document.querySelector(".rp-21999000").textContent = formatRupiah(subtotalPesanan);
  document.querySelector(".rp-150002").textContent  = formatRupiah(ongkirPilih);
  document.querySelector(".rp-20000").textContent   = formatRupiah(BIAYA_LAYANAN);
  document.querySelector(".rp-12000").textContent   = "-Rp 0";
  document.querySelector(".rp-22022000").textContent =
    formatRupiah(subtotalPesanan + ongkirPilih + BIAYA_LAYANAN);
}

function lanjutPembayaran() {
  var items = itemsKeranjang.map(function (it) {
    return { id_produk: it.id_produk, jumlah: it.jumlah };
  });

  API.post("/api/pesanan/checkout", {
    id_pembeli: user.id,
    items: items,
    ongkir: ongkirPilih,
    biaya_layanan: BIAYA_LAYANAN
  })
  .then(function (hasil) {
    localStorage.setItem("pesanan_terakhir", hasil.id_pesanan);
    alert("Checkout berhasil! No. Pesanan: " + hasil.id_pesanan);
    window.location.href = "../Frame%209/index.html?pesanan=" + hasil.id_pesanan;
  })
  .catch(tampilkanError);
}

document.getElementById("kotakBayar").addEventListener("click", lanjutPembayaran);
document.querySelector(".lanjut-ke-pembayaran").addEventListener("click", lanjutPembayaran);

document.getElementById("arrowLeftIcon").addEventListener("click", function () {
  window.history.back();
});
