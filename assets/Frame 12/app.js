var user = sesi.wajibPembeli();

document.querySelector(".Wahyu-Kusuma").textContent = user.nama;
var elNama  = document.querySelector(".raka-pratama-putra");
var elNama2 = document.querySelector(".raka-pratama-p");
var elUser  = document.querySelector(".div");
var elEmail = document.querySelector(".rakapratamaputra1gmailcom");
var elTelp  = document.querySelector(".div2");

elNama.textContent  = user.nama;
elNama2.textContent = user.nama;
elUser.textContent  = (user.email || "").split("@")[0];
elEmail.textContent = user.email;
elTelp.textContent  = user.no_telepon || "-";

document.querySelector(".admin").textContent =
  user.role.charAt(0).toUpperCase() + user.role.slice(1);

[elNama, elNama2, elTelp].forEach(function (el) {
  el.contentEditable = "true";
  el.style.cssText += "outline:1px dashed #9db8e8;cursor:text;padding:2px 4px;";
});

var tombol = document.querySelector(".simpan-perubahan-wrapper");
tombol.style.cursor = "pointer";

if (user.role === "admin") {
  document.querySelector(".simpan-perubahan").textContent = "Admin dan CS";
} else {
  document.querySelector(".simpan-perubahan").textContent = "Simpan Perubahan";
}

tombol.addEventListener("click", function () {
  var namaBaru   = elNama.textContent.trim();
  var teleponBaru = elTelp.textContent.trim();

  if (!namaBaru) { alert("Nama tidak boleh kosong"); return; }

  API.put("/api/auth/profil", {
    id: user.id,
    nama: namaBaru,
    no_telepon: teleponBaru,
    alamat: user.alamat || ""
  })
  .then(function (hasil) {
    sesi.perbarui({ nama: hasil.nama, no_telepon: hasil.no_telepon, alamat: hasil.alamat });
    alert("Profil tersimpan!");
    if (user.role === "admin") {
      window.location.href = "../Frame%2013/index.html";
    } else {
      window.location.href = "../Frame%2011/index.html";
    }
  })
  .catch(tampilkanError);
});

document.getElementById("panahIcon").addEventListener("click", function () {
  window.history.back();
});
