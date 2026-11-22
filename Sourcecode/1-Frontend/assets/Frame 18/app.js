document.querySelectorAll(".layanan").forEach(function (item) {
  item.addEventListener("click", function () {
    var tujuan = item.getAttribute("data-tujuan");
    var layanan = item.getAttribute("data-layanan");
    if (tujuan) {
      window.location.href = tujuan;
      return;
    }
    alert("Layanan " + layanan + " akan segera hadir.");
  });
});

var tombolVoucherGame = document.getElementById("tombolVoucherGame");
if (tombolVoucherGame) {
  tombolVoucherGame.addEventListener("click", function () {
    window.location.href = "../Frame%2017/index.html";
  });
}

var tombolVoucherOngkir = document.getElementById("tombolVoucherOngkir");
if (tombolVoucherOngkir) {
  tombolVoucherOngkir.addEventListener("click", function () {
    alert("Voucher Gratis Ongkir berhasil diklaim! Berlaku 30 hari.");
  });
}

document.getElementById("tombolKembali").addEventListener("click", function () {
  window.history.back();
});

document.querySelectorAll(".navbar-bawah .menu-nav").forEach(function (menu) {
  menu.addEventListener("click", function () {
    window.location.href = menu.getAttribute("data-tujuan");
  });
});
