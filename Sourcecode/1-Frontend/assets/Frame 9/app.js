pasangNavigasiDasar();
pasangKembali();

var user = sesi.baca();
var idPesanan = parseInt(paramUrl("pesanan") || localStorage.getItem("pesanan_terakhir") || "0", 10);
var metodePilih = "QRIS";
var totalBayar = 0;

var METODE = [
  { kartu: ".rectangle-parent", metode: "QRIS", radio: ".akar-iconsradio-fill" },
  { kartu: ".rectangle-group", metode: "E-Wallet", radio: ".akar-iconsradio" },
  { kartu: ".rectangle-container", metode: "Transfer Bank", radio: ".akar-iconsradio2" },
  { kartu: ".group-div", metode: "COD", radio: ".akar-iconsradio3" },
  { kartu: ".rectangle-parent2", metode: "Bayar Tunai", radio: ".akar-iconsradio4" }
];

API.get("/api/pesanan/" + idPesanan)
  .then(function (p) {
    totalBayar = p.total_harga;
    var teksQr = document.querySelector(".bayar-dengan-qr, .ringkasan");
    if (teksQr) teksQr.textContent = "Total: " + formatRupiah(totalBayar);
  })
  .catch(function (err) {
    alert(err.message);
    pindahHalaman("../Frame%207/index.html");
  });

function pilihMetode(indeks) {
  metodePilih = METODE[indeks].metode;
  METODE.forEach(function (m, i) {
    var kartu = document.querySelector(m.kartu);
    if (!kartu) return;
    var radio = kartu.querySelector("img[class*='akar-iconsradio']");
    if (radio) {
      radio.src = (i === indeks) ? "icons/buletbiru.svg" : "icons/bulet.svg";
    }
    kartu.style.cursor = "pointer";

    var latar = kartu.querySelector(".group-child, .group-inner");
    if (latar) {
      latar.style.boxSizing = "border-box";
      if (i === indeks) {
        latar.style.backgroundColor = "#7cebe2";
        latar.style.border = "1px solid #7cebe2";
      } else {
        latar.style.backgroundColor = "#fff";
        latar.style.border = "1px solid #ddd";
      }
    }
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
      pindahHalaman("../Frame%2010/index.html?pesanan=" + idPesanan);
    })
    .catch(function (err) {
      if (confirm(err.message + "\nBuka halaman lacak pesanan?")) {
        pindahHalaman("../Frame%2010/index.html?pesanan=" + idPesanan);
      }
    });
}

pasangKlik("#rectangle1, .rectangle1", bayarSekarang);
pasangKlik(".lanjut-ke-ringkasan, .kotakbayar-icon, .kotak-bayar-icon", bayarSekarang);

pasangKlik("#panahIcon, .panah-icon, .panahkiri-icon", function () {
  window.history.back();
});

pasangKlik(".lihat-semua-parent", function () {
  var kartuCod = document.querySelector(".group-div, .rectangle-parent2");
  if (kartuCod && kartuCod.scrollIntoView) {
    kartuCod.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
