var user = sesi.wajibPembeli();

var BARIS = [
  { wadah: ".rectangle-group",   nama: ".samsung-s24-ultra",     harga: ".rp-21999000", gambar: ".samsung-icon" },
  { wadah: ".group-div",         nama: ".laptop-rass-x56",       harga: ".rp-5699000",  gambar: ".laptop-icon" },
  { wadah: ".rectangle-parent3", nama: ".vention-power-bank",    harga: ".rp-345344",   gambar: ".power-icon" }
];

function muatKeranjang() {
  API.get("/api/keranjang/" + user.id)
    .then(function (hasil) {
      var items = hasil.items;

      BARIS.forEach(function (baris, i) {
        var wadah = document.querySelector(baris.wadah);
        if (!wadah) return;
        if (!items[i]) { wadah.style.display = "none"; return; }
        wadah.style.display = "";

        var item = items[i];
        var elNama   = wadah.querySelector(baris.nama);
        var elHarga  = wadah.querySelector(baris.harga);
        var elGambar = wadah.querySelector(baris.gambar);
        var kotakJumlah = wadah.querySelector(".rectangle-container, .rectangle-parent4");

        if (elNama)   elNama.textContent  = item.nama_produk;
        if (elHarga)  elHarga.textContent = formatRupiah(item.subtotal);
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

      document.querySelector(".rp21999000").textContent = formatRupiah(hasil.total);
      var totalBarang = 0;
      items.forEach(function (it) { totalBarang += it.jumlah; });
      document.querySelector(".checkout-1").textContent = "Checkout (" + totalBarang + ")";
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
