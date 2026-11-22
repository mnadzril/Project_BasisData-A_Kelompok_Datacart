function shiftSekarang() {
  var jam = new Date().getHours();
  if (jam >= 8 && jam < 16) return "Pagi";
  if (jam >= 12 && jam < 20) return "Siang";
  return "Malam";
}

var BARIS = [
  { nama: ".budi-santoso-admin",  foto: ".profile1-icon",                  status: ".aktif",    kotak: ".frame-inner" },
  { nama: ".siti-nurhaliza-cs",   foto: ".iconamoonprofile-circle-fill",   status: ".aktif2",   kotak: ".rectangle-div" },
  { nama: ".andi-pratama-admin",  foto: ".iconamoonprofile-circle-fill2",  status: ".aktif3",   kotak: ".frame-child2" },
  { nama: ".dewi-lestari-cs",     foto: ".iconamoonprofile-circle-fill3",  status: ".nonaktif", kotak: ".frame-child3" },
  { nama: ".nita-jeni-cs",        foto: ".iconamoonprofile-circle-fill4",  status: ".aktif4",   kotak: ".frame-child4" },
  { nama: ".keyla-lila-cs",       foto: ".iconamoonprofile-circle-fill5",  status: ".aktif5",   kotak: ".frame-child5" }
];

var dataAdmin = [];

function muatAdmin() {
  API.get("/api/admin")
    .then(function (daftar) {
      dataAdmin = daftar;
      tampilkan(daftar);
    })
    .catch(tampilkanError);
}

function tampilkan(daftar) {
  var adaHasil = daftar && daftar.length > 0;
  var jumlahTampil = 0;

  BARIS.forEach(function (baris, i) {
    var elNama = document.querySelector(baris.nama);
    var elFoto = document.querySelector(baris.foto);
    var elStatus = document.querySelector(baris.status);
    var elKotak = document.querySelector(baris.kotak);
    if (!elNama) return;

    var orang = daftar[i];
    if (!orang) {
      [elNama, elFoto, elStatus, elKotak].forEach(function (el) {
        if (el) el.style.display = "none";
      });
      return;
    }
    jumlahTampil++;

    var peran = /cs/i.test(orang.email || "") || /cs/i.test(orang.nama_admin || "") ? "CS" : "Admin";
    elNama.innerHTML = orang.nama_admin + "<br>" + peran;
    elNama.style.display = "";
    if (elFoto) elFoto.style.display = "";

    var teksStatus = (orang.shift === shiftSekarang()) ? "Aktif" : "Nonaktif";
    if (elKotak) {
      elKotak.style.display = "";
      elKotak.style.borderColor = teksStatus === "Aktif" ? "#18a999" : "#c9c9c9";
    }
    if (elStatus) {
      elStatus.style.display = "";
      elStatus.textContent = teksStatus;
    }
  });

  var TINGGI_PER_JUMLAH = [0, 117, 210, 303, 402, 488, 578];
  var kotakInduk = document.querySelector(".uilcopy-parent");
  if (kotakInduk) {
    if (jumlahTampil === 0) {
      kotakInduk.style.display = "none";
    } else {
      kotakInduk.style.display = "";
      kotakInduk.style.height =
        (TINGGI_PER_JUMLAH[Math.min(jumlahTampil, 6)]) + "px";
    }
  }

  tampilkanInfoKosong(!adaHasil);
}

var infoKosong = null;
function tampilkanInfoKosong(kosong) {
  if (!infoKosong) {
    infoKosong = document.createElement("div");
    infoKosong.textContent = "Tidak ada Admin / CS dengan nama itu.";
    infoKosong.style.cssText =
      "position:absolute;top:150px;left:98px;width:260px;" +
      "font-family:Poppins;font-size:14px;color:#888;";
    var induk = document.querySelector(".uilcopy-parent");
    if (induk) induk.appendChild(infoKosong);
  }
  infoKosong.style.display = kosong ? "block" : "none";
}

var kotakCari = document.querySelector(".cari-nama");
if (kotakCari) {
  kotakCari.contentEditable = "true";
  kotakCari.style.cssText += "cursor:text;outline:none;";
  kotakCari.addEventListener("input", function () {
    var kata = kotakCari.textContent.trim().toLowerCase();
    var hasil = kata
      ? dataAdmin.filter(function (a) {
          return (a.nama_admin || "").toLowerCase().includes(kata);
        })
      : dataAdmin;
    tampilkan(hasil);
  });
}

muatAdmin();

pasangKembali();
pasangKlik(".home, .home-icon", keBeranda);
