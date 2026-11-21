function isiKartuPromo(gambarKelas, hargaKelas, produk) {
  var img   = document.querySelector(gambarKelas);
  var harga = document.querySelector(hargaKelas);
  if (!produk) return;

  if (img) {
    if (produk.foto_produk) img.src = produk.foto_produk;
    img.style.cursor = "pointer";
    img.onclick = function () {
      window.location.href = "../Frame%205/index.html?id=" + produk.id;
    };
  }
  if (harga) harga.textContent = formatRupiah(produk.harga);
}

API.get("/api/produk")
  .then(function (daftar) {
    var iphone = null, jam = null;
    daftar.forEach(function (p) {
      if (!iphone && /iphone/i.test(p.nama_produk)) iphone = p;
      if (!jam   && /jam/i.test(p.nama_produk))     jam = p;
    });
    if (!iphone && daftar.length > 0) iphone = daftar[0];
    if (!jam   && daftar.length > 1) jam = daftar[1];

    isiKartuPromo(".iphone-16-icon", ".rp15269000", iphone);
    isiKartuPromo(".jamtangan-icon", ".rp12789000", jam);
  })
  .catch(function (err) {
    console.error("Gagal memuat produk:", err.message);
  });

var tombolBelanja = document.querySelector(".belanja-sekarang");
if (tombolBelanja) {
  tombolBelanja.style.cursor = "pointer";
  tombolBelanja.addEventListener("click", function () {
    window.location.href = "../Frame%203/index.html";
  });
}
