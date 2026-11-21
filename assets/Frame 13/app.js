function shiftSekarang() {
  var jam = new Date().getHours();
  if (jam >= 8 && jam < 16) return "Pagi";
  if (jam >= 12 && jam < 20) return "Siang";
  return "Malam";
}

var NAMA_SLOT  = [".budi-santoso-admin", ".andi-pratama-admin", ".siti-nurhaliza-cs",
                  ".dewi-lestari-cs", ".nita-jeni-cs", ".keyla-lila-cs"];
var STATUS_SLOT = [".aktif", ".aktif2", ".aktif3", ".aktif4", ".aktif5", ".nonaktif"];

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
  NAMA_SLOT.forEach(function (slot, i) {
    var elNama = document.querySelector(slot);
    var elStatus = document.querySelector(STATUS_SLOT[i]);
    if (!elNama) return;

    var orang = daftar[i];
    if (!orang) {
      elNama.style.visibility = "hidden";
      if (elStatus) elStatus.style.visibility = "hidden";
      return;
    }

    var peran = /cs/i.test(orang.email) || /cs/i.test(orang.nama_admin) ? "CS" : "Admin";
    elNama.innerHTML = orang.nama_admin + "<br>" + peran;
    elNama.style.visibility = "visible";

    if (elStatus) {
      elStatus.style.visibility = "visible";
      elStatus.textContent = (orang.shift === shiftSekarang()) ? "Aktif" : "Nonaktif";
    }
  });
}

var kotakCari = document.querySelector(".cari-nama");
kotakCari.contentEditable = "true";
kotakCari.style.cssText += "cursor:text;outline:none;";
kotakCari.addEventListener("input", function () {
  var kata = kotakCari.textContent.trim().toLowerCase();
  var hasil = dataAdmin.filter(function (a) {
    return a.nama_admin.toLowerCase().includes(kata);
  });
  tampilkan(hasil);
});

muatAdmin();
