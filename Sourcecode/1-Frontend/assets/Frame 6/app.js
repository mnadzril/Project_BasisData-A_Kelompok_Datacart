pasangNavigasiDasar();
pasangKembali();

var user = sesi.baca();

var KARTU = [
  { wadah: ".rectangle-parent", gambar: ".powerbank-icon" },
  { wadah: ".rectangle-group", gambar: ".headset-icon" },
  { wadah: ".rectangle-container", gambar: ".sepatu-icon" },
  { wadah: ".group-div", gambar: ".music-icon" }
];

function muatWishlist() {
  if (!user || user.role !== "pembeli") {
    if (document.querySelector(".rectangle-parent")) {
      document.querySelector(".rectangle-parent").style.display = "none";
    }
    return;
  }
  API.get("/api/wishlist/" + user.id)
    .then(function (hasil) {
      var daftar = hasil.items;
      KARTU.forEach(function (kartu, i) {
        var wadah = document.querySelector(kartu.wadah);
        if (!wadah) return;
        var produk = daftar[i];
        if (!produk) { wadah.style.display = "none"; return; }

        var elNama = wadah.querySelector(".vention-power-bank, .rp-345344");
        var elHarga = wadah.querySelectorAll(".rp-345344, [class^=rp]");
        var elGambar = kartu.gambar ? wadah.querySelector(kartu.gambar) : null;

        if (elNama) {
          elNama.textContent = produk.nama_produk;
          elNama.style.cursor = "pointer";
          elNama.onclick = function () { keDetail(produk.id_produk); };
        }
        if (elHarga) {
          elHarga.forEach(function (el) { el.textContent = formatRupiah(produk.harga); });
        }
        if (elGambar) {
          if (produk.foto_produk) elGambar.src = produk.foto_produk;
          elGambar.style.cursor = "pointer";
          elGambar.onclick = function () { keDetail(produk.id_produk); };
        }

        var love = wadah.querySelector(".lovemerah1-icon, .lovemerah2-icon, .lovemerah3-icon");
        if (love) {
          love.style.cursor = "pointer";
          love.onclick = function (e) {
            e.stopPropagation();
            API.del("/api/wishlist/" + user.id + "/" + produk.id_produk)
              .then(function (h) { alert(h.pesan); muatWishlist(); })
              .catch(tampilkanError);
          };
        }

        wadah.style.cursor = "pointer";
        wadah.onclick = function () { keDetail(produk.id_produk); };
      });
    })
    .catch(function (err) {
      console.error(err.message);
    });
}

if (user) muatWishlist();

pasangKlik(".keranjang-icon, .keranjang-icon1", keKeranjang);
pasangKlik(".tombolkeranjang", keKeranjang);
