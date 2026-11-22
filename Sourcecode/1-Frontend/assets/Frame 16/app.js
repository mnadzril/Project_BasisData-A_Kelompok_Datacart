var PESANAN_MAKANAN = "pesanan_makanan";

document.querySelectorAll(".tombol-kecil").forEach(function (tombol) {
  tombol.addEventListener("click", function () {
    var nama = tombol.getAttribute("data-nama");
    var harga = parseInt(tombol.getAttribute("data-harga"), 10);

    var daftar = [];
    try { daftar = JSON.parse(localStorage.getItem(PESANAN_MAKANAN)) || []; }
    catch (e) { daftar = []; }

    var sudahAda = daftar.some(function (m) { return m.nama === nama; });
    if (sudahAda) {
      alert(nama + " sudah ada di keranjang makanan.");
      return;
    }

    daftar.push({ nama: nama, harga: harga, jumlah: 1 });
    localStorage.setItem(PESANAN_MAKANAN, JSON.stringify(daftar));
    tombol.textContent = "Ditambahkan";
    setTimeout(function () { tombol.textContent = "+ Keranjang"; }, 1200);
  });
});

document.getElementById("tombolLihatKeranjang").addEventListener("click", function () {
  window.location.href = "../Frame%207/index.html";
});

document.getElementById("tombolKembali").addEventListener("click", function () {
  window.history.back();
});

document.querySelectorAll(".navbar-bawah .menu-nav").forEach(function (menu) {
  menu.addEventListener("click", function () {
    window.location.href = menu.getAttribute("data-tujuan");
  });
});
