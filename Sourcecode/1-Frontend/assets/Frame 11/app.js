pasangNavigasiDasar();
pasangKembali();

var user = sesi.wajibPembeli();

if (user) {
  var elNama = document.querySelector(".wahyu-kusuma");
  var elEmail = document.querySelector(".wahyugmailcom");
  var elTelp = document.querySelector(".profile-parent .b");
  if (elNama) elNama.textContent = user.nama;
  if (elEmail) elEmail.textContent = user.email;
  if (elTelp) elTelp.textContent = user.no_telepon || "-";
}

pasangKlik(".vector-icon", keKategori);
pasangKlik(".wishlist2", keWishlist);

pasangKlik("#ikonGerigi, .pengaturan-icon", function () {
  pindahHalaman("../Frame%2012/index.html");
});

var panelNotifikasi = document.getElementById("panelNotifikasi");
var titikNotifikasi = document.getElementById("titikNotifikasi");
var ikonLonceng = document.getElementById("ikonLonceng");

function tutupPanelNotifikasi() {
  if (panelNotifikasi) panelNotifikasi.classList.remove("aktif");
}

if (ikonLonceng) {
  ikonLonceng.addEventListener("click", function (e) {
    e.stopPropagation();
    if (panelNotifikasi) panelNotifikasi.classList.toggle("aktif");
  });
}

if (panelNotifikasi) {
  panelNotifikasi.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  var tombolTutup = document.getElementById("tutupNotifikasi");
  if (tombolTutup) {
    tombolTutup.addEventListener("click", function () {
      panelNotifikasi.classList.remove("aktif");
      if (titikNotifikasi) titikNotifikasi.style.display = "none";
    });
  }

  document.addEventListener("click", function (e) {
    if (!panelNotifikasi.contains(e.target) && e.target !== ikonLonceng) {
      tutupPanelNotifikasi();
    }
  });
}

var TUJUAN_MENU = {
  pesanan: "modal",
  wishlist: "../Frame%206/index.html",
  keranjang: "../Frame%207/index.html",
  admin: "../Frame%2013/index.html",
  blog: "../Frame%2020/index.html",
  pengaturan: "../Frame%2012/index.html"
};

document.querySelectorAll(".menu-profil").forEach(function (baris) {
  var tujuan = TUJUAN_MENU[baris.getAttribute("data-tujuan")];
  if (!tujuan) return;

  if (tujuan === "modal") {
    pasangKlik(baris, tampilkanPesanan);
  } else {
    pasangKlik(baris, function () {
      pindahHalaman(tujuan);
    });
  }
});

pasangKlik(".edit-profil, .edit-akun", function () {
  pindahHalaman("../Frame%2012/index.html");
});

function tampilkanPesanan() {
  if (!user) return;
  API.get("/api/pesanan/pembeli/" + user.id)
    .then(function (daftar) {
      if (!daftar.length) {
        alert("Belum ada pesanan. Yuk belanja!");
        return;
      }
      tutupPanelNotifikasi();
      var panel = document.createElement("div");
      panel.style.cssText =
        "position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;" +
        "display:flex;align-items:center;justify-content:center;";
      var kotak = document.createElement("div");
      kotak.style.cssText =
        "background:#fff;border-radius:14px;padding:22px 26px;width:360px;" +
        "max-height:70vh;overflow:auto;font-family:Poppins,Arial,sans-serif;";
      var judul = document.createElement("h3");
      judul.textContent = "Pesanan Saya";
      judul.style.cssText = "margin:0 0 12px;color:#0b3ea8;";
      kotak.appendChild(judul);

      daftar.forEach(function (p) {
        var baris = document.createElement("div");
        baris.style.cssText =
          "border:1px solid #e3e8f0;border-radius:10px;padding:10px 12px;" +
          "margin-bottom:8px;cursor:pointer;";
        baris.innerHTML =
          "<b>No. " + p.id_pesanan + "</b> — " + p.status +
          "<br><span style='color:#555'>" + (p.tgl_pesanan || "") + "</span>" +
          "<br><b style='color:#0b3ea8'>" + formatRupiah(p.total_harga) + "</b>";
        baris.onclick = function () {
          pindahHalaman("../Frame%2010/index.html?pesanan=" + p.id_pesanan);
        };
        kotak.appendChild(baris);
      });

      var tutup = document.createElement("button");
      tutup.textContent = "Tutup";
      tutup.style.cssText =
        "margin-top:8px;width:100%;padding:9px;border:none;border-radius:8px;" +
        "background:#0b3ea8;color:#fff;cursor:pointer;";
      tutup.onclick = function () { panel.remove(); };
      kotak.appendChild(tutup);

      panel.appendChild(kotak);
      panel.onclick = function (e) { if (e.target === panel) panel.remove(); };
      document.body.appendChild(panel);
    })
    .catch(tampilkanError);
}

var tombolLogout = document.querySelector(".logout-parent, .logout-icon, .logout");
if (tombolLogout) {
  pasangKlik(tombolLogout, function () {
    if (confirm("Yakin ingin keluar?")) {
      sesi.hapus();
      keLogin();
    }
  });
}
