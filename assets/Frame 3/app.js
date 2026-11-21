function pindahHalaman(url) { window.location.href = url; }

document.getElementById("vectorIcon2").addEventListener("click", function () { pindahHalaman("../Frame%202/index.html"); });
document.querySelector(".home").addEventListener("click", function () { pindahHalaman("../Frame%202/index.html"); });
document.querySelector(".vector-icon2").addEventListener("click", function () { pindahHalaman("../Frame%204/index.html"); });
document.querySelector(".category").addEventListener("click", function () { pindahHalaman("../Frame%204/index.html"); });
document.querySelector(".imageslove-removebg-preview-1-icon").addEventListener("click", function () { pindahHalaman("../Frame%206/index.html"); });
document.querySelector(".wishlist").addEventListener("click", function () { pindahHalaman("../Frame%206/index.html"); });
document.querySelector(".cart-icon").addEventListener("click", function () { pindahHalaman("../Frame%207/index.html"); });
document.querySelector(".cart").addEventListener("click", function () { pindahHalaman("../Frame%207/index.html"); });
document.querySelector(".group-icon").addEventListener("click", function () { pindahHalaman("../Frame%2011/index.html"); });
document.querySelector(".profile").addEventListener("click", function () { pindahHalaman("../Frame%2011/index.html"); });

var kataKunci = paramUrl("q") || "";
var kategori  = paramUrl("kategori") || "";

if (kataKunci) {
  document.getElementById("kataKunci").textContent = kataKunci;
  document.getElementById("hasilPencarian").textContent =
    'Hasil pencarian untuk, "' + kataKunci + '"';
} else if (kategori) {
  document.getElementById("kataKunci").textContent = kategori;
  document.getElementById("hasilPencarian").textContent =
    'Menampilkan produk kategori "' + kategori + '"';
}

var KARTU = [
  { wadah: ".rectangle-group",     nama: ".samsung-s24-ultra",      harga: ".rp21999000",   gambar: "#samsungHpIcon" },
  { wadah: ".rectangle-container", nama: ".nvidia-geforce-rtx",     harga: ".rp-173999000", gambar: ".rtx-icon" },
  { wadah: ".rectangle-parent2",   nama: ".sneakers-classic-black", harga: ".rp-4899000",   gambar: ".sneakers-icon" },
  { wadah: ".rectangle-parent4",   nama: ".headset-openear-2",      harga: ".rp-550000",    gambar: ".openear-icon" }
];

function keDetail(id) {
  return function () { window.location.href = "../Frame%205/index.html?id=" + id; };
}

function tambahKeranjang(idProduk) {
  var user = sesi.baca();
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk memakai keranjang.");
    return;
  }
  API.post("/api/keranjang", { id_pembeli: user.id, id_produk: idProduk, jumlah: 1 })
    .then(function (h) { alert(h.pesan); })
    .catch(tampilkanError);
}

function tambahWishlist(idProduk) {
  var user = sesi.baca();
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk memakai wishlist.");
    return;
  }
  API.post("/api/wishlist", { id_pembeli: user.id, id_produk: idProduk })
    .then(function (h) { alert(h.pesan); })
    .catch(tampilkanError);
}

function isiKartu(kartu, produk) {
  var wadah = document.querySelector(kartu.wadah);
  if (!wadah) return;
  if (!produk) { wadah.style.display = "none"; return; }

  var elNama   = wadah.querySelector(kartu.nama);
  var elHarga  = wadah.querySelector(kartu.harga);
  var elGambar = wadah.querySelector(kartu.gambar);

  if (elNama) {
    elNama.textContent = produk.nama_produk;
    elNama.style.cursor = "pointer";
    elNama.onclick = keDetail(produk.id);
  }
  if (elHarga) elHarga.textContent = formatRupiah(produk.harga);
  if (elGambar) {
    if (produk.foto_produk) elGambar.src = produk.foto_produk;
    elGambar.style.cursor = "pointer";
    elGambar.onclick = keDetail(produk.id);
  }

  var tombolKeranjang = wadah.querySelector(".cart-icon2");
  if (tombolKeranjang) {
    tombolKeranjang.style.cursor = "pointer";
    tombolKeranjang.onclick = function (e) {
      e.stopPropagation();
      tambahKeranjang(produk.id);
    };
  }

  var tombolWishlist = wadah.querySelector(".wishlistt-icon, .vector-icon4, .vector-icon6, .vector-icon8");
  if (tombolWishlist) {
    tombolWishlist.style.cursor = "pointer";
    tombolWishlist.onclick = function (e) {
      e.stopPropagation();
      tambahWishlist(produk.id);
    };
  }
}

var url = "/api/produk";
var query = [];
if (kataKunci) query.push("search=" + encodeURIComponent(kataKunci));
if (kategori)  query.push("kategori=" + encodeURIComponent(kategori));
if (query.length) url += "?" + query.join("&");

API.get(url)
  .then(function (daftar) {
    document.querySelector(".produk-ditemukan").textContent =
      daftar.length + " Produk ditemukan";
    KARTU.forEach(function (kartu, i) { isiKartu(kartu, daftar[i]); });
  })
  .catch(function (err) {
    document.querySelector(".produk-ditemukan").textContent =
      "Server tidak terhubung: " + err.message;
  });
