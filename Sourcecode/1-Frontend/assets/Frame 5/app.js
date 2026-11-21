var idProduk = parseInt(paramUrl("id") || "0", 10);
var produkAktif = null;
var jumlahPilih = 1;

function perbaruiTampilan() {
  if (!produkAktif) return;
  document.querySelector(".samsung-s24-ultra").textContent  = produkAktif.nama_produk;
  document.querySelector(".samsung-s24-ultra2").textContent = produkAktif.nama_produk;
  document.querySelector(".rp21999000").textContent   = formatRupiah(produkAktif.harga);
  document.querySelector(".garansi-resmi-1").textContent = produkAktif.deskripsi || "Garansi Resmi 1 Tahun";
  document.querySelector(".stok-150").textContent  = "Stok : " + produkAktif.stok;
  document.querySelector(".stok-1502").textContent = "Stok : " + produkAktif.stok;
  if (produkAktif.foto_produk) {
    document.querySelector(".hp-icon").src = produkAktif.foto_produk;
    document.querySelector(".samsung-icon").src = produkAktif.foto_produk;
  }
  perbaruiHargaPopup();
}

function perbaruiHargaPopup() {
  document.querySelector(".b2").textContent = jumlahPilih;
  document.querySelector(".rp219990002").textContent =
    formatRupiah(produkAktif.harga * jumlahPilih);
}

API.get("/api/produk/" + idProduk)
  .then(function (p) {
    produkAktif = p;
    perbaruiTampilan();
  })
  .catch(function (err) {
    alert(err.message);
    window.location.href = "../Frame%203/index.html";
  });

var popup = document.getElementById("frameContainer");

function bukaPopup() { popup.style.display = "flex"; jumlahPilih = 1; perbaruiHargaPopup(); }
function tutupPopup() { popup.style.display = "none"; }

document.getElementById("rectangle2").addEventListener("click", bukaPopup);
document.querySelector(".beli-sekarang").addEventListener("click", bukaPopup);
document.querySelector(".akar-iconscross").addEventListener("click", tutupPopup);
popup.addEventListener("click", function (e) { if (e.target === popup) tutupPopup(); });

document.querySelector(".rectangle-group .b").addEventListener("click", function () {
  if (jumlahPilih > 1) { jumlahPilih--; perbaruiHargaPopup(); }
});
document.querySelector(".rectangle-group .b3").addEventListener("click", function () {
  if (produkAktif && jumlahPilih < produkAktif.stok) { jumlahPilih++; perbaruiHargaPopup(); }
  else alert("Jumlah melebihi stok");
});

function tambahKeKeranjang(jumlah, laluPindah) {
  var user = sesi.baca();
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk berbelanja.");
    window.location.href = "../Frame%201/index.html";
    return;
  }
  API.post("/api/keranjang", {
    id_pembeli: user.id,
    id_produk:  produkAktif.id,
    jumlah:     jumlah
  })
  .then(function (h) {
    alert(h.pesan);
    if (laluPindah) window.location.href = "../Frame%207/index.html";
  })
  .catch(tampilkanError);
}

document.querySelector(".tombolkeranjang").addEventListener("click", function () {
  if (produkAktif) tambahKeKeranjang(1, false);
});

document.querySelector(".beli-sekarang2").addEventListener("click", function () {
  if (produkAktif) tambahKeKeranjang(jumlahPilih, true);
});

document.getElementById("loveIcon").style.cursor = "pointer";
document.getElementById("loveIcon").addEventListener("click", function () {
  var user = sesi.baca();
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk memakai wishlist.");
    return;
  }
  API.post("/api/wishlist", { id_pembeli: user.id, id_produk: produkAktif.id })
    .then(function (h) { alert(h.pesan); })
    .catch(tampilkanError);
});

document.getElementById("panahIcon").addEventListener("click", function () {
  window.history.back();
});
