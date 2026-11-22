var user = sesi.baca();

if (!user || user.role !== "penjual") {
  alert("Silakan login sebagai penjual terlebih dahulu.");
  pindahHalaman("../Frame%2019/index.html");
}

if (user) {
  var elToko = document.querySelector(".store-name");
  if (elToko) elToko.textContent = user.nama_toko || user.nama;
}

pasangKlik(".back-arrow", function () {
  pindahHalaman("../Frame%2019/index.html");
});

pasangKlik(".manage-card, .product-card", function () {
  pindahHalaman("../Frame%2022/index.html");
});

pasangKlik(".orders-menu-card", function () {
  pindahHalaman("../Frame%2024/index.html");
});

pasangKlik(".shipping-card", function () {
  pindahHalaman("../Frame%2024/index.html");
});

pasangKlik(".settings-card", function () {
  pindahHalaman("../Frame%2021/index.html");
});

pasangKlik(".tombol-ke-pembeli", function () {
  var yakin = confirm("Keluar dari akun penjual dan kembali ke akun pembeli?");
  if (yakin) {
    sesi.hapus();
    pindahHalaman("../Frame%201/index.html");
  }
});

if (user) {
  API.get("/api/produk")
    .then(function (daftar) {
      var milikSaya = daftar.filter(function (p) { return p.id_penjual === user.id; });
      var elProduk = document.querySelector(".product-card .card-number");
      if (elProduk) elProduk.textContent = milikSaya.length;
    })
    .catch(function (err) { console.error(err.message); });

  API.get("/api/pesanan/penjual/" + user.id)
    .then(function (daftar) {
      var elPesanan = document.querySelector(".order-card .card-number");
      if (elPesanan) elPesanan.textContent = daftar.length;
      var dikirim = daftar.filter(function (p) { return p.status === "Dalam Perjalanan"; }).length;
      var elKirim = document.querySelector(".delivery-card .card-number");
      if (elKirim) elKirim.textContent = dikirim;
    })
    .catch(function (err) { console.error(err.message); });
}
