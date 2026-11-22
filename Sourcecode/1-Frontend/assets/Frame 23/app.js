var user = sesi.baca();

if (!user || user.role !== "penjual") {
  alert("Silakan login sebagai penjual terlebih dahulu.");
  pindahHalaman("../Frame%2019/index.html");
}

var idProduk = parseInt(paramUrl("id") || "0", 10);
var modeEdit = idProduk > 0;

if (!modeEdit) {
  document.getElementById("judulHalaman").textContent = "Tambah Produk";
}

pasangKlik(".back-arrow", function () {
  pindahHalaman("../Frame%2022/index.html");
});

function perbaruiFoto() {
  var url = document.getElementById("inputFoto").value.trim();
  var img = document.getElementById("fotoProduk");
  var hint = document.getElementById("hintFoto");
  if (url) {
    img.src = url;
    hint.textContent = url;
  } else {
    img.src = "icons/kotak.svg";
    hint.textContent = "URL Foto Produk";
  }
}

if (modeEdit) {
  API.get("/api/produk/" + idProduk)
    .then(function (p) {
      document.getElementById("inputNama").value = p.nama_produk;
      document.getElementById("inputHarga").value = String(p.harga);
      document.getElementById("inputStok").value = String(p.stok);
      document.getElementById("inputKategori").value = p.kategori || "";
      document.getElementById("inputFoto").value = p.foto_produk || "";
      document.getElementById("inputDeskripsi").value = p.deskripsi || "";
      perbaruiFoto();
    })
    .catch(function (err) {
      alert(err.message);
      pindahHalaman("../Frame%2022/index.html");
    });
}

document.getElementById("inputFoto").addEventListener("input", perbaruiFoto);

document.getElementById("tombolKurang").addEventListener("click", function () {
  var stok = parseInt(document.getElementById("inputStok").value || "0", 10);
  if (stok > 0) document.getElementById("inputStok").value = String(stok - 1);
});

document.getElementById("tombolTambah").addEventListener("click", function () {
  var stok = parseInt(document.getElementById("inputStok").value || "0", 10);
  document.getElementById("inputStok").value = String(stok + 1);
});

document.getElementById("tombolSimpan").addEventListener("click", function () {
  var nama = document.getElementById("inputNama").value.trim();
  var harga = parseFloat(document.getElementById("inputHarga").value.replace(/[^0-9.]/g, ""));
  var stok = parseInt(document.getElementById("inputStok").value || "0", 10);
  var kategori = document.getElementById("inputKategori").value.trim();
  var foto = document.getElementById("inputFoto").value.trim();
  var deskripsi = document.getElementById("inputDeskripsi").value.trim();

  if (!nama) { alert("Nama produk wajib diisi!"); return; }
  if (!harga || harga <= 0) { alert("Harga harus lebih dari 0!"); return; }
  if (stok < 0) { alert("Stok tidak boleh minus!"); return; }

  var data = {
    nama_produk: nama,
    harga: harga,
    stok: stok,
    kategori: kategori,
    deskripsi: deskripsi,
    foto_produk: foto
  };

  if (modeEdit) {
    API.put("/api/produk/" + idProduk, data)
      .then(function (h) {
        alert(h.pesan);
        pindahHalaman("../Frame%2022/index.html");
      })
      .catch(tampilkanError);
  } else {
    data.id_penjual = user.id;
    API.post("/api/produk", data)
      .then(function (h) {
        alert(h.pesan);
        pindahHalaman("../Frame%2022/index.html");
      })
      .catch(tampilkanError);
  }
});

pasangKlik(".tombol-ke-pembeli", function () {
  var yakin = confirm("Keluar dari akun penjual dan kembali ke akun pembeli?");
  if (yakin) {
    sesi.hapus();
    pindahHalaman("../Frame%201/index.html");
  }
});
