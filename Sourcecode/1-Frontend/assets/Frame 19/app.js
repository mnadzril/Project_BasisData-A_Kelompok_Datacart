var kotakUser = document.querySelector(".username input");
var kotakPass = document.querySelector(".password input");

function loginPenjual() {
  var email = kotakUser.value.trim();
  var password = kotakPass.value;

  if (!email || !password) {
    alert("Username (email) dan Password harus diisi!");
    return;
  }

  API.post("/api/auth/login", { email: email, password: password })
    .then(function (user) {
      if (user.role !== "penjual") {
        alert("Akun ini bukan akun penjual. Silakan login lewat halaman pembeli.");
        return;
      }
      sesi.simpan(user);
      pindahHalaman("../Frame%2020/index.html");
    })
    .catch(function (err) { alert(err.message); });
}

var tombolLogin = document.querySelector(".login");
if (tombolLogin) pasangKlik(tombolLogin, loginPenjual);

if (kotakPass) kotakPass.addEventListener("keydown", function (e) {
  if (e.key === "Enter") loginPenjual();
});

var popupLupa = document.getElementById("popupLupaPassword");

function bukaPopupLupa() {
  if (!popupLupa) return;
  var kolomEmail = document.getElementById("inputEmailLupa");
  if (kotakUser && kolomEmail && !kolomEmail.value) {
    kolomEmail.value = kotakUser.value.trim();
  }
  var pesan = document.getElementById("pesanLupa");
  if (pesan) pesan.textContent = "";
  popupLupa.classList.add("aktif");
}

function tutupPopupLupa() {
  if (popupLupa) popupLupa.classList.remove("aktif");
}

pasangKlik("#lupaPasswordText, .lupa-password", bukaPopupLupa);

if (document.getElementById("tutupPopupLupa")) {
  document.getElementById("tutupPopupLupa").addEventListener("click", tutupPopupLupa);
}
if (popupLupa) {
  popupLupa.addEventListener("click", function (e) {
    if (e.target === popupLupa) tutupPopupLupa();
  });
}

function aturUlangPassword() {
  var email = document.getElementById("inputEmailLupa").value.trim();
  var baru = document.getElementById("passwordBaruLupa").value;
  var ulang = document.getElementById("passwordBaruLupa2").value;
  var pesan = document.getElementById("pesanLupa");

  if (!email || !baru) {
    if (pesan) pesan.textContent = "Email dan password baru harus diisi.";
    return;
  }
  if (baru.length < 6) {
    if (pesan) pesan.textContent = "Password baru minimal 6 karakter.";
    return;
  }
  if (baru !== ulang) {
    if (pesan) pesan.textContent = "Ulangi password belum sama.";
    return;
  }

  API.post("/api/auth/lupa-password", { email: email, password_baru: baru })
    .then(function (hasil) {
      alert(hasil.pesan);
      tutupPopupLupa();
      if (kotakUser) kotakUser.value = email;
      if (kotakPass) kotakPass.value = baru;
    })
    .catch(function (err) {
      if (pesan) pesan.textContent = err.message;
    });
}

if (document.getElementById("aturUlangPassword")) {
  document.getElementById("aturUlangPassword").addEventListener("click", aturUlangPassword);
}
["inputEmailLupa", "passwordBaruLupa", "passwordBaruLupa2"].forEach(function (idKotak) {
  var kotak = document.getElementById(idKotak);
  if (kotak) kotak.addEventListener("keydown", function (e) {
    if (e.key === "Enter") aturUlangPassword();
  });
});

pasangKlik("#loginAdmin, .login-admin", function () {
  pindahHalaman("../Frame%2026/index.html");
});

pasangKlik("#kembaliKePembeli, .kembali-pembeli", function () {
  pindahHalaman("../Frame%201/index.html");
});
