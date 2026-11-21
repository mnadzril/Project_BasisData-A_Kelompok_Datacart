function pastikanLewatServer() {
  if (window.location.protocol === "file:") {
    return Promise.reject(new Error(
      "Halaman ini dibuka lewat file:// (klik dua kali file HTML). " +
      "Data tidak bisa diambil karena server tidak dihubungi.\n\n" +
      "CARA BENAR:\n" +
      "1. Nyalakan MySQL di XAMPP\n" +
      "2. Jalankan jalankan-windows.bat (atau jalankan-linux-mac.sh)\n" +
      "3. Buka http://localhost:8080 di browser"
    ));
  }
  return null;
}

if (window.location.protocol === "file:" && document.body) {
  var peringatan = document.createElement("div");
  peringatan.textContent =
    "PERINGATAN: halaman ini dibuka lewat file:// sehingga tidak bisa " +
    "mengambil data dari database. Jalankan dulu server " +
    "(jalankan-windows.bat), lalu buka http://localhost:8080 di browser.";
  peringatan.style.cssText =
    "position:fixed;top:0;left:0;right:0;z-index:99999;" +
    "background:#c0392b;color:#fff;padding:12px 16px;" +
    "font-family:sans-serif;font-size:14px;text-align:center;";
  document.body.appendChild(peringatan);
}

var API = {
  get: function (path) {
    var jaga = pastikanLewatServer();
    if (jaga) return jaga;
    return fetch(path)
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!json.sukses) throw new Error(json.pesan || "Terjadi kesalahan");
        return json.data;
      });
  },

  post: function (path, body) {
    var jaga = pastikanLewatServer();
    if (jaga) return jaga;
    return fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!json.sukses) throw new Error(json.pesan || "Terjadi kesalahan");
        return json.data;
      });
  },

  put: function (path, body) {
    var jaga = pastikanLewatServer();
    if (jaga) return jaga;
    return fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!json.sukses) throw new Error(json.pesan || "Terjadi kesalahan");
        return json.data;
      });
  },

  del: function (path) {
    var jaga = pastikanLewatServer();
    if (jaga) return jaga;
    return fetch(path, { method: "DELETE" })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!json.sukses) throw new Error(json.pesan || "Terjadi kesalahan");
        return json.data;
      });
  }
};

var sesi = {
  baca: function () {
    try { return JSON.parse(localStorage.getItem("pengguna")); }
    catch (e) { return null; }
  },
  simpan: function (user) {
    localStorage.setItem("pengguna", JSON.stringify(user));
  },
  perbarui: function (perubahan) {
    var u = sesi.baca();
    if (u) {
      for (var k in perubahan) u[k] = perubahan[k];
      sesi.simpan(u);
    }
  },
  hapus: function () {
    localStorage.removeItem("pengguna");
  },

  wajibPembeli: function () {
    var u = sesi.baca();
    if (!u || u.role !== "pembeli") {
      alert("Silakan login terlebih dahulu sebagai pembeli.");
      window.location.href = "../Frame%201/index.html";
      return null;
    }
    return u;
  }
};

function formatRupiah(angka) {
  var n = Number(angka || 0);
  var bulat = (Math.abs(n - Math.round(n)) < 0.005) ? Math.round(n) : n;
  var teks = bulat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "Rp " + teks;
}

function paramUrl(nama) {
  return new URLSearchParams(window.location.search).get(nama);
}

function tampilkanError(err) {
  alert(err && err.message ? err.message : "Server tidak merespons. Pastikan server Java berjalan.");
}
