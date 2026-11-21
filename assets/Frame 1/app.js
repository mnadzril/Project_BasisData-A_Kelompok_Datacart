var popupDaftar = document.getElementById("kotakSignContainer");

document.getElementById("signUpText").addEventListener("click", function () {
  popupDaftar.style.display = "flex";
});

popupDaftar.addEventListener("click", function (e) {
  if (e.target === popupDaftar) popupDaftar.style.display = "none";
});

function loginUtama() {
  var email    = document.getElementById("username").value.trim();
  var password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email dan Password harus diisi!");
    return;
  }

  API.post("/api/auth/login", { email: email, password: password })
    .then(function (user) {
      sesi.simpan(user);
      if (user.role === "admin") {
        window.location.href = "../Frame%2013/index.html";
      } else {
        window.location.href = "../Frame%202/index.html";
      }
    })
    .catch(function (err) {
      alert(err.message);
    });
}

document.getElementById("login").addEventListener("click", loginUtama);
document.querySelector(".login2").addEventListener("click", loginUtama);
document.getElementById("password").addEventListener("keydown", function (e) {
  if (e.key === "Enter") loginUtama();
});

function daftarAkun() {
  var nama     = document.getElementById("usernamePopup").value.trim();
  var email    = document.getElementById("emailPopup").value.trim();
  var password = document.getElementById("passwordPopup").value;

  if (!nama || !email || !password) {
    alert("Username, Email, dan Password harus diisi!");
    return;
  }

  API.post("/api/auth/register", {
    nama: nama,
    email: email,
    password: password
  })
  .then(function (hasil) {
    alert(hasil.pesan);
    popupDaftar.style.display = "none";
    document.getElementById("username").value = email;
    document.getElementById("password").focus();
  })
  .catch(function (err) {
    alert(err.message);
  });
}

document.getElementById("loginPopup").addEventListener("click", daftarAkun);
document.querySelector(".login4").addEventListener("click", daftarAkun);
