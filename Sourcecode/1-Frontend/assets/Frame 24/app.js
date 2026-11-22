var user = sesi.baca();

if (!user || user.role !== "penjual") {
  alert("Silakan login sebagai penjual terlebih dahulu.");
  pindahHalaman("../Frame%2019/index.html");
}

pasangKlik(".back-arrow", function () {
  pindahHalaman("../Frame%2020/index.html");
});

var TAB_PETA = {
  Semua: null,
  Diproses: ["Diproses"],
  Dikemas: ["Dikemas", "Dalam Perjalanan"],
  Selesai: ["Diterima"]
};

var KELAS_BADGE = {
  "Diproses": "badge-diproses",
  "Dikemas": "badge-dikirim",
  "Dalam Perjalanan": "badge-dikirim",
  "Diterima": "badge-selesai",
  "Menunggu Pembayaran": "badge-menunggu",
  "Dibatalkan": "badge-batal"
};

var tabAktif = "Semua";
var semuaPesanan = [];

document.querySelectorAll(".tab").forEach(function (tombolTab) {
  tombolTab.addEventListener("click", function () {
    tabAktif = tombolTab.getAttribute("data-tab");
    document.querySelectorAll(".tab").forEach(function (t) {
      t.classList.toggle("tab-aktif", t === tombolTab);
    });
    tampilkanPesanan();
  });
});

function tampilkanPesanan() {
  var wadah = document.getElementById("daftarPesanan");
  wadah.innerHTML = "";

  var daftar = semuaPesanan.filter(function (p) {
    var filter = TAB_PETA[tabAktif];
    return !filter || filter.indexOf(p.status) >= 0;
  });

  if (!daftar.length) {
    var kosong = document.createElement("div");
    kosong.className = "kosong";
    kosong.textContent = "Tidak ada pesanan pada tab ini.";
    wadah.appendChild(kosong);
    return;
  }

  daftar.forEach(function (p) {
    var kartu = document.createElement("div");
    kartu.className = "kartu-pesanan";
    kartu.onclick = function () {
      pindahHalaman("../Frame%2025/index.html?id=" + p.id_pesanan);
    };

    var atas = document.createElement("div");
    atas.className = "baris-atas";
    var no = document.createElement("div");
    no.className = "no-pesanan";
    no.textContent = "#NX" + String(p.id_pesanan).padStart(5, "0");
    atas.appendChild(no);
    var eksp = document.createElement("div");
    eksp.className = "ekspedisi";
    eksp.innerHTML = "<img src='icons/truck.svg' style='width:14px;height:14px'> JNE";
    atas.appendChild(eksp);
    kartu.appendChild(atas);

    var tengah = document.createElement("div");
    tengah.className = "baris-tengah";
    var pembeli = document.createElement("div");
    pembeli.className = "nama-pembeli";
    pembeli.textContent = p.nama_pembeli || "Pembeli";
    tengah.appendChild(pembeli);
    var badge = document.createElement("div");
    badge.className = "badge-status " + (KELAS_BADGE[p.status] || "badge-menunggu");
    badge.textContent = p.status === "Diterima" ? "Selesai" : p.status;
    tengah.appendChild(badge);
    kartu.appendChild(tengah);

    var bawah = document.createElement("div");
    bawah.className = "baris-bawah";
    var tgl = document.createElement("div");
    tgl.textContent = (p.tgl_pesanan || "").split(" ")[0] + " - Resi: JNE" + String(p.id_pesanan).padStart(10, "0");
    bawah.appendChild(tgl);
    var total = document.createElement("div");
    total.className = "total-pesanan";
    total.textContent = formatRupiah(p.total_harga);
    bawah.appendChild(total);
    kartu.appendChild(bawah);

    wadah.appendChild(kartu);
  });
}

function muatPesanan() {
  API.get("/api/pesanan/penjual/" + user.id)
    .then(function (daftar) {
      semuaPesanan = daftar;
      tampilkanPesanan();
    })
    .catch(function (err) {
      semuaPesanan = [];
      tampilkanPesanan();
      var wadah = document.getElementById("daftarPesanan");
      wadah.innerHTML = "";
      var pesan = document.createElement("div");
      pesan.className = "kosong";
      pesan.textContent = "Server tidak terhubung: " + err.message;
      wadah.appendChild(pesan);
    });
}

muatPesanan();

pasangKlik(".tombol-ke-pembeli", function () {
  var yakin = confirm("Keluar dari akun penjual dan kembali ke akun pembeli?");
  if (yakin) {
    sesi.hapus();
    pindahHalaman("../Frame%201/index.html");
  }
});
