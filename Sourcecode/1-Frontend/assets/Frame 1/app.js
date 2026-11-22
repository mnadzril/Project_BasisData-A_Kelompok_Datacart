if (namaHalaman === "sign.html") {
  setTimeout(function () {
    pindahHalaman("index.html");
  }, 2500);
  document.body.addEventListener("click", function () {
    pindahHalaman("index.html");
  });
}

if (namaHalaman === "index.html") {
  if (document.getElementById("signUpText")) {
    pasangKlik("#signUpText", function () {
      pindahHalaman("KotakSign.html");
    });
  }

  function arahkanRole(user) {
    sesi.simpan(user);
    if (user.role === "admin") {
      pindahHalaman("../Frame%2013/index.html");
    } else if (user.role === "penjual") {
      pindahHalaman("../Frame%2020/index.html");
    } else {
      pindahHalaman("../Frame%202/index.html");
    }
  }

  function loginUtama() {
    var email = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Email dan Password harus diisi!");
      return;
    }

    API.post("/api/auth/login", { email: email, password: password })
      .then(arahkanRole)
      .catch(function (err) { alert(err.message); });
  }

  if (document.getElementById("login")) pasangKlik("#login", loginUtama);
  if (document.querySelector(".login2")) pasangKlik(".login2", loginUtama);
  if (document.getElementById("password")) {
    document.getElementById("password").addEventListener("keydown", function (e) {
      if (e.key === "Enter") loginUtama();
    });
  }
  if (document.getElementById("username")) {
    document.getElementById("username").addEventListener("keydown", function (e) {
      if (e.key === "Enter") document.getElementById("password").focus();
    });
  }

  var popupLupa = document.getElementById("popupLupaPassword");

  function bukaPopupLupa() {
    if (!popupLupa) return;
    var emailLogin = document.getElementById("username");
    var kolomEmail = document.getElementById("inputEmailLupa");
    if (emailLogin && kolomEmail && !kolomEmail.value) {
      kolomEmail.value = emailLogin.value.trim();
    }
    var pesan = document.getElementById("pesanLupa");
    if (pesan) pesan.textContent = "";
    popupLupa.classList.add("aktif");
  }

  function tutupPopupLupa() {
    if (popupLupa) popupLupa.classList.remove("aktif");
  }

  pasangKlik("#lupaPasswordText", bukaPopupLupa);

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
        var kolomEmailLogin = document.getElementById("username");
        if (kolomEmailLogin) kolomEmailLogin.value = email;
        var kolomPasswordLogin = document.getElementById("password");
        if (kolomPasswordLogin) kolomPasswordLogin.value = baru;
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
}

if (namaHalaman === "KotakSign.html") {
  function daftarAkun() {
    var nama = document.getElementById("inputUsername").value.trim();
    var email = document.getElementById("inputEmail").value.trim();
    var password = document.getElementById("inputPassword").value;

    if (!nama || !email || !password) {
      alert("Username, Email, dan Password harus diisi!");
      return;
    }

    API.post("/api/auth/register", { nama: nama, email: email, password: password })
      .then(function (hasil) {
        alert(hasil.pesan);
        pindahHalaman("index.html");
      })
      .catch(function (err) { alert(err.message); });
  }

  pasangKlik("#tombolLogin", daftarAkun);

  pasangKlik("#linkLogin", function () {
    pindahHalaman("index.html");
  });

  ["inputPassword", "inputEmail"].forEach(function (idKotak) {
    var kotak = document.getElementById(idKotak);
    if (kotak) kotak.addEventListener("keydown", function (e) {
      if (e.key === "Enter") daftarAkun();
    });
  });
}
