var user = sesi.wajibPembeli();

var KARTU = [
  { wadah: ".rectangle-parent",    nama: null, gambar: ".powerbank-icon" },
  { wadah: ".rectangle-group",     nama: null, gambar: ".headset-icon" },
  { wadah: ".rectangle-container", nama: null, gambar: null },
  { wadah: ".group-div",           nama: null, gambar: ".music-icon" }
];

function muatWishlist() {
  API.get("/api/wishlist/" + user.id)
    .then(function (hasil) {
      var daftar = hasil.items;
      KARTU.forEach(function (kartu, i) {
        var wadah = document.querySelector(kartu.wadah);
        if (!wadah) return;
        var produk = daftar[i];
        if (!produk) { wadah.style.display = "none"; return; }

        var elNama  = wadah.querySelector(".vention-power-bank");
        var elHarga = wadah.querySelector(".rp-345344");
        var elGambar = kartu.gambar ? wadah.querySelector(kartu.gambar) : null;

        if (elNama) {
          elNama.textContent = produk.nama_produk;
          elNama.style.cursor = "pointer";
          elNama.onclick = function () {
            window.location.href = "../Frame%205/index.html?id=" + produk.id_produk;
          };
        }
        if (elHarga) elHarga.textContent = formatRupiah(produk.harga);
        if (elGambar) {
          if (produk.foto_produk) elGambar.src = produk.foto_produk;
          elGambar.style.cursor = "pointer";
          elGambar.onclick = elNama.onclick;
        }

        var love = wadah.querySelector(".lovemerah1-icon");
        if (love) {
          love.style.cursor = "pointer";
          love.onclick = function () {
            API.del("/api/wishlist/" + user.id + "/" + produk.id_produk)
              .then(function (h) { alert(h.pesan); muatWishlist(); })
              .catch(tampilkanError);
          };
        }
      });
    })
    .catch(tampilkanError);
}

if (user) muatWishlist();
