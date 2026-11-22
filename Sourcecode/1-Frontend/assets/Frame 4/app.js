
var URUTAN_DIINGINKAN = ["Elektronik", "Fashion", "Kosmetik", "Olahraga", "Rumah Tangga", "Makanan & Minuman"];

var IKON_FILE = {
  "Elektronik": "icons/Komputerr.svg",
  "Fashion": "icons/Bajuuu.svg",
  "Kosmetik": "icons/Beautyy.svg",
  "Olahraga": "icons/Sepatuu.svg",
  "Rumah Tangga": "icons/RumahIJO.svg",
  "Makanan & Minuman": "icons/Burger.svg"
};

var POPUP_ID = {
  "Elektronik": "popupElektronik",
  "Fashion": "popupFashion",
  "Kosmetik": "popupBeauty",
  "Olahraga": "popupSport",
  "Rumah Tangga": "popupHome",
  "Makanan & Minuman": "popupFood"
};

var SLOT = [
  { label: ".elektronik",     ikon: ".komputerr-icon", panah: ".polygon-icon",         garis: ".frame-4-done-item" },
  { label: ".fashion",        ikon: ".bajuuu-icon",    panah: ".frame-4-done-child4", garis: ".frame-4-done-inner" },
  { label: ".beauty",         ikon: ".beautyy-icon",   panah: ".frame-4-done-child5", garis: ".line-div" },
  { label: ".sport",          ikon: ".sepatuu-icon",   panah: ".frame-4-done-child6", garis: ".frame-4-done-child2" },
  { label: ".home2",          ikon: ".rumahijo-icon",  panah: ".frame-4-done-child7", garis: ".frame-4-done-child3" },
  { label: ".food-and-drink", ikon: ".burger-icon",    panah: ".frame-4-done-child8", garis: null }
];

function samakanDenganBawaan(nama) {
  return String(nama || "").replace(/\bkomputer\b/i, "Kosmetik");
}

function isiKategori(daftarDariServer) {
  var daftar = (daftarDariServer || []).map(samakanDenganBawaan);

  var hasil = [];
  URUTAN_DIINGINKAN.forEach(function (nama) {
    if (daftar.indexOf(nama) !== -1) hasil.push(nama);
  });
  daftar.forEach(function (nama) {
    if (nama && hasil.indexOf(nama) === -1) hasil.push(nama);
  });
  URUTAN_DIINGINKAN.forEach(function (nama) {
    if (hasil.length >= 6) return;
    if (hasil.indexOf(nama) === -1) hasil.push(nama);
  });

  SLOT.forEach(function (slot, i) {
    var elLabel = document.querySelector(slot.label);
    var elIkon = document.querySelector(slot.ikon);
    var elPanah = document.querySelector(slot.panah);
    var elGaris = document.querySelector(slot.garis);
    if (!elLabel) return;

    var nama = hasil[i];
    if (!nama) {
      [elLabel, elIkon, elPanah, elGaris].forEach(function (el) {
        if (el) el.style.display = "none";
      });
      return;
    }

    [elLabel, elIkon, elPanah, elGaris].forEach(function (el) {
      if (el) el.style.display = "";
    });

    elLabel.textContent = nama;

    if (elIkon && IKON_FILE[nama]) elIkon.setAttribute("src", IKON_FILE[nama]);

    var idPopup = POPUP_ID[nama];
    var bukaPopup = idPopup
      ? function () { document.getElementById(idPopup).classList.add("active"); }
      : function () {
          window.location.href = "../Frame%203/index.html?kategori=" + encodeURIComponent(nama);
        };

    [elLabel, elIkon, elPanah].forEach(function (el) {
      if (!el) return;
      el.style.cursor = "pointer";
      el.onclick = bukaPopup;
    });
  });
}

API.get("/api/kategori")
  .then(isiKategori)
  .catch(function () {
    isiKategori([]);
  });

var kotakCari = document.querySelector(".kotak-cari-kategori");
var ikonCariKategori = document.querySelector(".vector-icon");

function cariDariKategori() {
  var kata = kotakCari ? kotakCari.value : "";
  if (kata && kata.trim()) {
    window.location.href = "../Frame%203/index.html?q=" + encodeURIComponent(kata.trim());
  } else {
    alert("Ketik dulu nama barang yang dicari.");
  }
}

if (ikonCariKategori) {
  ikonCariKategori.style.cursor = "pointer";
  ikonCariKategori.onclick = cariDariKategori;
}

if (kotakCari) {
  kotakCari.addEventListener("keydown", function (e) {
    if (e.key === "Enter") cariDariKategori();
  });
}

function isiPopupKategori(namaKategori, idPopup) {
  var popup = document.getElementById(idPopup);
  if (!popup || !namaKategori) return;

  API.get("/api/produk?kategori=" + encodeURIComponent(namaKategori))
    .then(function (daftar) {
      var kartu = popup.querySelectorAll(".popup-card");
      kartu.forEach(function (kartuEl, i) {
        var produk = (daftar || [])[i];

        if (!produk) {
          kartuEl.style.display = "none";
          return;
        }
        kartuEl.style.display = "";

        var elNama = kartuEl.querySelector(
          ".popup-nama-xiaomi, .popup-nama-oven, .popup-nama-amd");
        var elTerjual = kartuEl.querySelector(".popup-terjual");
        var elHarga = kartuEl.querySelector(
          ".popup-harga-xiaomi, .popup-harga-oven, .popup-harga-amd");
        var elGambar = kartuEl.querySelector("img");

        if (elNama) elNama.textContent = produk.nama_produk;
        if (elTerjual) {
          elTerjual.textContent = (produk.terjual || 0) + " Terjual";
        }
        if (elHarga) elHarga.textContent = formatRupiah(produk.harga);
        if (elGambar && produk.foto_produk) {
          elGambar.src = produk.foto_produk;
          elGambar.style.objectFit = "cover";
        }

        kartuEl.style.cursor = "pointer";
        kartuEl.title = "Lihat " + produk.nama_produk;
        kartuEl.onclick = function (e) {
          if (e.target.closest && e.target.closest(".popup-close")) return;
          pindahHalaman("../Frame%205/index.html?id=" + produk.id);
        };
      });
    })
    .catch(function (err) {
      var kartu = popup.querySelectorAll(".popup-card");
      kartu.forEach(function (kartuEl) {
        kartuEl.style.cursor = "pointer";
        var elNama = kartuEl.querySelector(
          ".popup-nama-xiaomi, .popup-nama-oven, .popup-nama-amd");
        var namaStatis = elNama ? elNama.textContent.trim() : "";
        kartuEl.onclick = function (e) {
          if (e.target.closest && e.target.closest(".popup-close")) return;
          if (!namaStatis) return;
          pindahHalaman("../Frame%203/index.html?q=" + encodeURIComponent(namaStatis));
        };
      });
      console.error("Popup kategori memakai contoh statis:", err.message);
    });
}

Object.keys(POPUP_ID).forEach(function (nama) {
  isiPopupKategori(nama, POPUP_ID[nama]);
});
