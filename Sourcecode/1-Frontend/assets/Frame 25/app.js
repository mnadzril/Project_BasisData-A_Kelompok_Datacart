var user = sesi.baca();

if (!user || user.role !== "penjual") {
  alert("Silakan login sebagai penjual terlebih dahulu.");
  pindahHalaman("../Frame%2019/index.html");
}

var idPesanan = parseInt(paramUrl("id") || localStorage.getItem("pesanan_terakhir") || "0", 10);
var pesananAktif = null;

pasangKlik(".back-arrow", function () {
  pindahHalaman("../Frame%2024/index.html");
});

function tampilkan(p) {
  pesananAktif = p;

  document.getElementById("namaPembeli").textContent = p.nama_pembeli || "Pembeli";
  document.getElementById("teleponPembeli").textContent = "-";

  var badge = document.getElementById("badgeStatus");
  var teksStatus = p.status === "Diterima" ? "Selesai" : p.status;
  badge.textContent = teksStatus;
  document.getElementById("teksStatus").textContent = teksStatus;

  document.getElementById("teksResi").textContent = "JNE" + String(p.id_pesanan).padStart(10, "0");
  document.getElementById("teksTotal").textContent = formatRupiah(p.total_harga);

  var tombolSelesai = document.getElementById("tombolSelesai");
  if (p.status === "Diterima") {
    tombolSelesai.textContent = "Sudah Selesai";
    tombolSelesai.disabled = true;
    tombolSelesai.style.opacity = "0.55";
    tombolSelesai.style.cursor = "default";
  }

  var wadah = document.getElementById("daftarItem");
  wadah.innerHTML = "";
  (p.items || []).forEach(function (it) {
    var baris = document.createElement("div");
    baris.className = "baris-item";

    var nama = document.createElement("div");
    nama.textContent = it.nama_produk + " ";
    var jumlah = document.createElement("span");
    jumlah.className = "item-jumlah";
    jumlah.textContent = "x " + it.jumlah;
    nama.appendChild(jumlah);

    var harga = document.createElement("div");
    harga.textContent = formatRupiah(it.harga_saat_beli || it.subtotal);

    baris.appendChild(nama);
    baris.appendChild(harga);
    wadah.appendChild(baris);
  });
}

API.get("/api/pesanan/" + idPesanan)
  .then(function (p) {
    tampilkan(p);
  })
  .catch(function (err) {
    alert(err.message);
    if (/tidak ditemukan/.test(err.message)) {
      pindahHalaman("../Frame%2024/index.html");
    }
  });

document.getElementById("tombolSelesai").addEventListener("click", function () {
  if (!pesananAktif) return;
  if (pesananAktif.status === "Diterima") return;
  if (!confirm("Tandai pesanan #" + pesananAktif.id_pesanan + " sebagai selesai?")) return;

  API.put("/api/pesanan/" + idPesanan + "/status", { status: "Diterima" })
    .then(function (h) {
      alert(h.pesan);
      pindahHalaman("../Frame%2024/index.html");
    })
    .catch(tampilkanError);
});

pasangKlik(".tombol-ke-pembeli", function () {
  var yakin = confirm("Keluar dari akun penjual dan kembali ke akun pembeli?");
  if (yakin) {
    sesi.hapus();
    pindahHalaman("../Frame%201/index.html");
  }
});
