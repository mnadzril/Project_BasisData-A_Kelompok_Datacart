pasangNavigasiDasar();
pasangKembali();

var kotakCari = document.getElementById("inputPencarian");
if (kotakCari) {
  kotakCari.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && kotakCari.value.trim()) {
      pindahHalaman("../Frame%203/index.html?q=" + encodeURIComponent(kotakCari.value.trim()));
    }
  });
}

pasangKlik(".search-icon, .search, .ikon-pencarian", function () {
  pindahHalaman("../Frame%203/index.html");
});

pasangKlik(".category-icon", keKategori);
pasangKlik(".kotakbelanja-icon, .kotak-belanja-icon", keKategori);

pasangKlik(".logo-pulsa-icon, .pulsa", function () {
  pindahHalaman("../Frame%2015/index.html");
});
pasangKlik(".logo-makanan-icon, .makanan", function () {
  pindahHalaman("../Frame%2016/index.html");
});
pasangKlik(".logo-game-icon, .games", function () {
  pindahHalaman("../Frame%2017/index.html");
});
pasangKlik(".lainnya-icon, .lainnya", function () {
  pindahHalaman("../Frame%2018/index.html");
});

pasangKlik(".belanja-sekarang", function () {
  pindahHalaman("../Frame%203/index.html?fokus=1");
});

function isiKartuPromo(gambarKelas, hargaKelas, produk) {
  var img = document.querySelector(gambarKelas);
  var harga = document.querySelector(hargaKelas);
  if (!produk) return;

  if (img) {
    if (produk.foto_produk) img.src = produk.foto_produk;
    img.style.cursor = "pointer";
    img.onclick = function () { keDetail(produk.id); };
  }
  if (harga) harga.textContent = formatRupiah(produk.harga);
}

API.get("/api/produk")
  .then(function (daftar) {
    var iphone = null, jam = null;
    daftar.forEach(function (p) {
      if (!iphone && /iphone/i.test(p.nama_produk)) iphone = p;
      if (!jam && /jam/i.test(p.nama_produk)) jam = p;
    });
    if (!iphone && daftar.length > 0) iphone = daftar[0];
    if (!jam && daftar.length > 1) jam = daftar[1];

    isiKartuPromo(".iphone-16-icon", ".rp15269000", iphone);
    isiKartuPromo(".jamtangan-icon", ".rp12789000", jam);
  })
  .catch(function (err) {
    console.error("Gagal memuat produk:", err.message);
  });
