var user = sesi.wajibPembeli();
var idPesanan = parseInt(paramUrl("pesanan") || localStorage.getItem("pesanan_terakhir") || "0", 10);
var metodePilih = "QRIS";
var totalBayar = 0;

var METODE = [
  { kartu: ".rectangle-parent",  metode: "QRIS",           radio: ".akar-iconsradio-fill" },
  { kartu: ".rectangle-group",   metode: "E-Wallet",       radio: ".akar-iconsradio" },
  { kartu: ".rectangle-container", metode: "Transfer Bank", radio: ".akar-iconsradio2" },
  { kartu: ".group-div",         metode: "COD",            radio: ".akar-iconsradio3" },
  { kartu: ".rectangle-parent2", metode: "Bayar Tunai",    radio: ".akar-iconsradio4" }
];

API.get("/api/pesanan/" + idPesanan)
  .then(function (p) {
    totalBayar = p.total_harga;
    var teksQr = document.querySelector(".bayar-dengan-qr");
    if (teksQr) teksQr.textContent = "Total: " + formatRupiah(totalBayar);
  })
  .catch(function (err) {
    alert(err.message);
    window.location.href = "../Frame%207/index.html";
  });

function pilihMetode(indeks) {
  metodePilih = METODE[indeks].metode;
  METODE.forEach(function (m, i) {
    var kartu = document.querySelector(m.kartu);
    var radio = kartu ? kartu.querySelector("img[class*='akar-iconsradio']") : null;
    if (!radio) return;
    radio.src = (i === indeks) ? "icons/buletbiru.svg" : "icons/bulet.svg";
    kartu.style.cursor = "pointer";
  });
}

METODE.forEach(function (m, i) {
  var kartu = document.querySelector(m.kartu);
  if (kartu) kartu.addEventListener("click", function () { pilihMetode(i); });
});
pilihMetode(0);

function bayarSekarang() {
  API.post("/api/pembayaran", {
    id_pesanan: idPesanan,
    metode_bayar: metodePilih,
    jumlah_bayar: totalBayar
  })
  .then(function (h) {
    alert(h.pesan);
    window.location.href = "../Frame%2010/index.html?pesanan=" + idPesanan;
  })
  .catch(function (err) {
    if (confirm(err.message + "\nBuka halaman lacak pesanan?")) {
      window.location.href = "../Frame%2010/index.html?pesanan=" + idPesanan;
    }
  });
}

document.getElementById("rectangle1").addEventListener("click", bayarSekarang);
document.querySelector(".lanjut-ke-ringkasan").addEventListener("click", bayarSekarang);

document.getElementById("panahIcon").addEventListener("click", function () {
  window.history.back();
});
