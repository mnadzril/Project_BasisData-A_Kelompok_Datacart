var user = sesi.baca();

if (!user || user.role !== "penjual") {
  alert("Silakan login sebagai penjual terlebih dahulu.");
  pindahHalaman("../Frame%2019/index.html");
}

pasangKlik(".back-arrow", function () {
  pindahHalaman("../Frame%2020/index.html");
});

pasangKlik("#tombolTambah", function () {
  pindahHalaman("../Frame%2023/index.html");
});

function buatBaris(p) {
  var item = document.createElement("div");
  item.className = "item-produk";

  var foto = document.createElement("img");
  foto.className = "item-foto";
  foto.src = p.foto_produk || "icons/kotak.svg";
  foto.onerror = function () { foto.src = "icons/kotak.svg"; };
  item.appendChild(foto);

  var info = document.createElement("div");
  info.className = "item-info";

  var nama = document.createElement("div");
  nama.className = "item-nama";
  nama.textContent = p.nama_produk;
  info.appendChild(nama);

  var harga = document.createElement("div");
  harga.className = "item-harga";
  harga.textContent = formatRupiah(p.harga) + " - Stok " + p.stok;
  info.appendChild(harga);

  var aksi = document.createElement("div");
  aksi.className = "item-aksi";

  var edit = document.createElement("button");
  edit.className = "chip-edit";
  edit.textContent = "Edit";
  edit.onclick = function () {
    pindahHalaman("../Frame%2023/index.html?id=" + p.id);
  };
  aksi.appendChild(edit);

  var hapus = document.createElement("button");
  hapus.className = "chip-hapus";
  hapus.textContent = "Hapus";
  hapus.onclick = function () {
    if (!confirm("Hapus produk \"" + p.nama_produk + "\"?")) return;
    API.del("/api/produk/" + p.id)
      .then(function (h) { alert(h.pesan); muatProduk(); })
      .catch(tampilkanError);
  };
  aksi.appendChild(hapus);

  info.appendChild(aksi);
  item.appendChild(info);
  return item;
}

function muatProduk() {
  var wadah = document.getElementById("daftarProduk");
  wadah.innerHTML = "";

  API.get("/api/produk")
    .then(function (daftar) {
      var milik = daftar.filter(function (p) { return p.id_penjual === user.id; });
      if (!milik.length) {
        var kosong = document.createElement("div");
        kosong.className = "kosong";
        kosong.textContent = "Belum ada produk. Tekan + Tambah Produk.";
        wadah.appendChild(kosong);
        return;
      }
      milik.forEach(function (p) {
        wadah.appendChild(buatBaris(p));
      });
    })
    .catch(function (err) {
      var pesan = document.createElement("div");
      pesan.className = "kosong";
      pesan.textContent = "Server tidak terhubung: " + err.message;
      wadah.appendChild(pesan);
    });
}

muatProduk();

pasangKlik(".tombol-ke-pembeli", function () {
  var yakin = confirm("Keluar dari akun penjual dan kembali ke akun pembeli?");
  if (yakin) {
    sesi.hapus();
    pindahHalaman("../Frame%201/index.html");
  }
});
