var namaHalaman = location.pathname.split("/").pop() || "index.html";

(function pasangKursorJari() {
  var gaya = document.createElement("style");
  gaya.textContent = [
    ".home, .category, .cart, .wishlist, .profile, .wishlist2,",
    ".home-icon, .category-icon, .love-icon, .cart-icon, .group-profile-icon,",
    ".group-icon, .imageslove-removebg-preview-1-icon, .vector-icon2, .vector-icon3,",
    ".material-symbolshome-outline-icon, .categoryijo-icon, .rumah-icon, .rumahhitam-icon,",
    ".rumahijo-icon, .rumahitem-icon, .orang-icon, .wishlist-icon, .keranjang-icon,",
    ".kategori-icon, .lovetrans-icon, .loveijo-icon, .panah-icon, .arrow-left-icon,",
    ".ikon-nav, .menu-profil, .lonceng, .gerigi {",
    "  cursor: pointer;",
    "}",
    ".menu-profil:hover { background: #f2f7f5; }"
  ].join("\n");
  document.head.appendChild(gaya);
})();

function pindahHalaman(url) {
  window.location.href = url;
}

function keLogin() {
  pindahHalaman("../Frame%201/index.html");
}

function keBeranda() {
  pindahHalaman("../Frame%202/index.html");
}

function keKategori() {
  pindahHalaman("../Frame%204/index.html");
}

function keKeranjang() {
  pindahHalaman("../Frame%207/index.html");
}

function keWishlist() {
  pindahHalaman("../Frame%206/index.html");
}

function keProfil() {
  pindahHalaman("../Frame%2011/index.html");
}

function keDetail(idProduk) {
  pindahHalaman("../Frame%205/index.html?id=" + idProduk);
}

function pasangKlik(selector, aksi) {
  var daftar = typeof selector === "string" ? document.querySelectorAll(selector) : selector;
  if (!daftar) return;
  var list = daftar.length !== undefined ? Array.prototype.slice.call(daftar) : [daftar];
  list.forEach(function (el) {
    if (!el) return;
    el.style.cursor = "pointer";
    el.addEventListener("click", aksi);
  });
}

function pasangNavigasiDasar() {
  pasangKlik(".home", keBeranda);
  pasangKlik(".category", keKategori);
  pasangKlik(".cart", keKeranjang);
  pasangKlik(".wishlist", keWishlist);
  pasangKlik(".profile", keProfil);

  pasangKlik(".cart-icon, .keranjang-icon", keKeranjang);

  pasangKlik(
    ".wishlist-icon, .imageslove-removebg-preview-1-icon, .love-icon, .lovetrans-icon, .loveijo-icon",
    keWishlist
  );

  pasangKlik(".profile, .group-profile-icon, .group-icon, .orang-icon", keProfil);

  pasangKlik(
    ".rumah-icon, .rumahhitam-icon, .rumahijo-icon, .rumahitem-icon, " +
      ".material-symbolshome-outline-icon, .home-icon, .vector-icon3",
    keBeranda
  );

  pasangKlik(".category-icon, .categoryijo-icon, .kategori-icon", keKategori);
}

function pasangKembali() {
  pasangKlik(".panah-icon, .panah-icon2, .back-arrow, .panahkiri-icon, .arrow-left-icon", function () {
    window.history.back();
  });
}
