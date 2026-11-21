var idPesanan = parseInt(
  paramUrl("pesanan") || localStorage.getItem("pesanan_terakhir") || "0", 10);

var TAHAP_STATUS = {
  "Menunggu Pembayaran": 0,
  "Dibatalkan":         0,
  "Diproses":           1,
  "Dikemas":            2,
  "Dalam Perjalanan":   4,
  "Diterima":           5
};

API.get("/api/pesanan/" + idPesanan)
  .then(function (p) {
    var tahun = new Date().getFullYear();
    document.querySelector(".inv250500123").textContent =
      "INV/" + tahun + "/" + String(p.id_pesanan).padStart(5, "0");
    document.querySelector(".jne1234567890").textContent =
      "JNE" + String(p.id_pesanan).padStart(10, "0");

    var tgl = (p.tgl_pesanan || "").split(" ")[0];
    document.querySelector(".rabu-20-mei").textContent = tgl;

    if (p.items.length) {
      var it = p.items[0];
      document.querySelector(".samsung-s24-ultra").textContent = it.nama_produk;
      document.querySelector(".x-1").textContent = "x " + it.jumlah;
      if (it.foto_produk) document.querySelector(".samsung-icon").src = it.foto_produk;
    }
    document.querySelector(".rp-22022000").textContent = formatRupiah(p.total_harga);

    var tahap = TAHAP_STATUS[p.status] || 0;
    for (var i = 1; i <= 5; i++) {
      var langkah = document.querySelector(".status-" + i);
      if (!langkah) continue;
      if (i <= tahap) {
        langkah.classList.add("status-selesai");
        var tanggal = langkah.querySelector(".status-date");
        if (!tanggal) {
          tanggal = document.createElement("div");
          tanggal.className = "status-date";
          tanggal.style.cssText = "font-size:13px;color:#666;";
          langkah.querySelector(".status-info").appendChild(tanggal);
        }
        tanggal.textContent = tgl;
      } else {
        langkah.classList.remove("status-selesai");
      }
    }

    if (p.pembayaran) {
      var info = document.querySelector(".informasi-pengiriman");
      if (info) info.textContent =
        "Informasi Pengiriman - Dibayar via " + p.pembayaran.metode_bayar;
    }
  })
  .catch(function (err) {
    alert(err.message);
    window.location.href = "../Frame%202/index.html";
  });
