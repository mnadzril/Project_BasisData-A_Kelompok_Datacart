var user = sesi.wajibPembeli();

document.querySelector(".wahyu-kusuma").textContent  = user.nama;
document.querySelector(".wahyugmailcom").textContent = user.email;
document.querySelector(".profile-parent .b").textContent = user.no_telepon || "-";

document.querySelector(".edit-profil").style.cursor = "pointer";
document.querySelector(".edit-profil").addEventListener("click", function () {
  window.location.href = "../Frame%2012/index.html";
});

document.querySelector(".bag-parent").style.cursor = "pointer";
document.querySelector(".bag-parent").addEventListener("click", function () {
  API.get("/api/pesanan/pembeli/" + user.id)
    .then(function (daftar) {
      if (!daftar.length) {
        alert("Belum ada pesanan. Yuk belanja!");
        return;
      }
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
          window.location.href = "../Frame%2010/index.html?pesanan=" + p.id_pesanan;
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
});

var tombolLogout = document.querySelector(".logout-parent");
if (tombolLogout) {
  tombolLogout.style.cursor = "pointer";
  tombolLogout.addEventListener("click", function () {
    if (confirm("Yakin ingin keluar?")) {
      sesi.hapus();
      window.location.href = "../Frame%201/index.html";
    }
  });
}
