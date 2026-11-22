pasangKembali();

var idProduk = parseInt(paramUrl("id") || "0", 10);
var produkAktif = null;
var jumlahPilih = 1;

var NAMA_HALAMAN_PRODUK = {
  "Frame51.html": "Samsung",
  "Frame52.html": "RTX",
  "Frame53.html": "Sneakers",
  "Frame54.html": "Headset"
};

function perbaruiTampilan() {
  if (!produkAktif) return;

  var peta = [
    [".samsung-s24-ultra", produkAktif.nama_produk],
    [".samsung-s24-ultra2", produkAktif.nama_produk],
    [".nvidia-geforce-rtx", produkAktif.nama_produk],
    [".sneakers-classic-black", produkAktif.nama_produk],
    [".headset-openear-2", produkAktif.nama_produk],
    [".rp21999000, .rp-173999000, .rp-4899000, .rp-550000", formatRupiah(produkAktif.harga)],
    [".garansi-resmi-1, .garansi-resmi-5, .garansi-resmi-2, .garansi-resmi-3, .garansi-resmi", produkAktif.deskripsi || "Garansi Resmi 1 Tahun"],
    [".stok-150, .stok-40, .stok-123, .stok-110, .stok-1502, .stok", "Stok : " + produkAktif.stok]
  ];

  peta.forEach(function (baris) {
    document.querySelectorAll(baris[0]).forEach(function (el) {
      if (el) el.textContent = baris[1];
    });
  });

  var foto = produkAktif.foto_produk;
  if (foto) {
    [".hp-icon", ".samsung-icon", ".rtx-icon", ".sneakers-icon", ".openear-icon"].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el) el.src = foto;
      });
    });
  }
  perbaruiHargaPopup();
}

function perbaruiHargaPopup() {
  if (!produkAktif) return;
  document.querySelectorAll(".b2").forEach(function (el) { el.textContent = jumlahPilih; });
  document.querySelectorAll(".rp219990002, .rp219990003, .rp5500002").forEach(function (el) {
    el.textContent = formatRupiah(produkAktif.harga * jumlahPilih);
  });
}

function muatProduk() {
  var sumber;
  if (idProduk > 0) {
    sumber = API.get("/api/produk/" + idProduk);
  } else if (NAMA_HALAMAN_PRODUK[namaHalaman]) {
    sumber = API.get("/api/produk?search=" + encodeURIComponent(NAMA_HALAMAN_PRODUK[namaHalaman])).then(function (daftar) {
      return daftar && daftar.length ? daftar[0] : null;
    });
  } else {
    sumber = API.get("/api/produk").then(function (daftar) {
      return daftar && daftar.length ? daftar[0] : null;
    });
  }

  sumber
    .then(function (p) {
      if (!p) {
        alert("Produk tidak ditemukan.");
        pindahHalaman("../Frame%203/index.html");
        return;
      }
      produkAktif = p;
      idProduk = p.id;
      perbaruiTampilan();
      muatStatusLove();
    })
    .catch(function (err) {
      alert(err.message);
    });
}

var popupDetail = document.getElementById("frameContainer") || document.querySelector(".popup-overlay, .popup-frame");

function bukaPopupDetail() {
  if (!popupDetail) return;
  popupDetail.style.display = "flex";
  jumlahPilih = 1;
  perbaruiHargaPopup();
}

function tutupPopupDetail() {
  if (!popupDetail) return;
  popupDetail.style.display = "none";
}

pasangKlik("#rectangle2, .beli-sekarang", bukaPopupDetail);
pasangKlik(".akar-iconscross, .silang-icon, .silang", tutupPopupDetail);
if (popupDetail) {
  popupDetail.addEventListener("click", function (e) {
    if (e.target === popupDetail) tutupPopupDetail();
  });
}

document.querySelectorAll(".rectangle-group .b, .rectangle-parent .b").forEach(function (el) {
  el.style.cursor = "pointer";
  el.addEventListener("click", function () {
    if (jumlahPilih > 1) { jumlahPilih--; perbaruiHargaPopup(); }
  });
});

document.querySelectorAll(".rectangle-group .b3, .rectangle-parent .b3").forEach(function (el) {
  el.style.cursor = "pointer";
  el.addEventListener("click", function () {
    if (produkAktif && jumlahPilih < produkAktif.stok) { jumlahPilih++; perbaruiHargaPopup(); }
    else alert("Jumlah melebihi stok");
  });
});

function tambahKeKeranjang(jumlah, laluPindah) {
  var user = sesi.baca();
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk berbelanja.");
    keLogin();
    return;
  }
  API.post("/api/keranjang", {
    id_pembeli: user.id,
    id_produk: produkAktif.id,
    jumlah: jumlah
  })
    .then(function (h) {
      if (laluPindah) {
        pindahHalaman("../Frame%207/index.html");
      } else {
        alert(h.pesan);
      }
    })
    .catch(tampilkanError);
}

pasangKlik(".tombolkeranjang, .tambah-ke-keranjang", function () {
  if (produkAktif) tambahKeKeranjang(1, false);
});

pasangKlik(".beli-sekarang2, .beli-sekarang3", function () {
  if (produkAktif) tambahKeKeranjang(jumlahPilih, true);
});

var IKON_LOVE = "icons/love.svg";
var IKON_LOVE_ISI = "icons/loveisi.svg";
var loveIconEl = document.getElementById("loveIcon") || document.querySelector(".love-icon");

function tampilLove(terisi) {
  if (loveIconEl) loveIconEl.src = terisi ? IKON_LOVE_ISI : IKON_LOVE;
}

function muatStatusLove() {
  var u = sesi.baca();
  if (!u || u.role !== "pembeli" || !produkAktif || !loveIconEl) return;
  API.get("/api/wishlist/" + u.id)
    .then(function (hasil) {
      var daftar = Array.isArray(hasil) ? hasil : (hasil && hasil.items) || [];
      tampilLove(daftar.some(function (w) {
        return parseInt(w.id_produk, 10) === produkAktif.id;
      }));
    })
    .catch(function () {  });
}

pasangKlik("#loveIcon", function () {
  var u = sesi.baca();
  if (!u || u.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk memakai wishlist.");
    keLogin();
    return;
  }
  if (!produkAktif || !loveIconEl) return;
  var sudah = loveIconEl.src.indexOf("loveisi.svg") !== -1;
  if (sudah) {
    API.del("/api/wishlist/" + u.id + "/" + produkAktif.id)
      .then(function (h) {
        tampilLove(false);
        alert(h.pesan || "Produk dihapus dari wishlist.");
      })
      .catch(tampilkanError);
  } else {
    API.post("/api/wishlist", { id_pembeli: u.id, id_produk: produkAktif.id })
      .then(function (h) {
        tampilLove(true);
        alert(h.pesan);
      })
      .catch(tampilkanError);
  }
});

function toastKecil(teks) {
  var toast = document.createElement("div");
  toast.textContent = teks;
  toast.style.cssText =
    "position:fixed;left:50%;bottom:26px;transform:translateX(-50%);" +
    "background:#0b3ea8;color:#fff;padding:10px 18px;border-radius:20px;" +
    "font:600 13.5px Inter,Arial,sans-serif;z-index:99999;box-shadow:0 4px 14px rgba(0,0,0,.25);";
  document.body.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 2200);
}

pasangKlik(".share-icon", function () {
  var url = window.location.href;
  var judul = produkAktif ? produkAktif.nama_produk : "Produk shop.id";
  if (navigator.share) {
    navigator.share({ title: judul, url: url }).catch(function () {});
    return;
  }
  var salin = function () { toastKecil("Tautan produk disalin."); };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(salin, function () { toastKecil(url); });
  } else {
    var bantu = document.createElement("textarea");
    bantu.value = url;
    bantu.style.cssText = "position:fixed;opacity:0;";
    document.body.appendChild(bantu);
    bantu.select();
    try { document.execCommand("copy"); salin(); } catch (e) { toastKecil(url); }
    bantu.remove();
  }
});

pasangKlik("#panahIcon, .panah-icon", function () {
  window.history.back();
});

pasangKlik(".keranjang-icon", keKeranjang);

var VARIAN_WARNA = [
  { nama: "Abu-abu", filter: "grayscale(0.55) brightness(1.06)" },
  { nama: "Hitam",   filter: "grayscale(1) brightness(0.55)" },
  { nama: "Ungu",    filter: "hue-rotate(215deg) saturate(1.55)" },
  { nama: "Kuning",  filter: "hue-rotate(45deg) saturate(1.75) brightness(1.05)" }
];
var WARNA_CHIP = ["#b9bcc2", "#26262b", "#9a7bd4", "#e0bb4e"];
var indeksVarian = 0;

var gambarProdukEl = document.querySelector(".hp-icon");
var slideStatisEl = document.querySelector(".slide-icon");
var titikBarisEl = null;
var labelWarnaEl = null;
var BARIS_POPUP_WARNA = [
  { el: document.querySelector(".titanium-gray"),   indeks: 0 },
  { el: document.querySelector(".titanium-black"),  indeks: 1 },
  { el: document.querySelector(".titanium-violet"), indeks: 2 },
  { el: document.querySelector(".titanium-yellow"), indeks: 3 }
];

function gambarVarian() {
  if (gambarProdukEl) {
    gambarProdukEl.style.filter = VARIAN_WARNA[indeksVarian].filter;
  }
  if (titikBarisEl) {
    titikBarisEl.querySelectorAll(".titik").forEach(function (t, i) {
      t.classList.toggle("aktif", i === indeksVarian);
    });
  }
  document.querySelectorAll(".pilihan-warna-chip").forEach(function (c, i) {
    c.classList.toggle("dipilih", i === indeksVarian);
  });
  BARIS_POPUP_WARNA.forEach(function (baris) {
    if (baris.el) baris.el.classList.toggle("warna-dipilih", baris.indeks === indeksVarian);
  });
  if (labelWarnaEl) {
    labelWarnaEl.textContent = "Warna: " + VARIAN_WARNA[indeksVarian].nama;
  }
}

function setVarian(indeks) {
  var n = VARIAN_WARNA.length;
  indeksVarian = ((indeks % n) + n) % n;
  gambarVarian();
}

function geserVarian(arah) {
  setVarian(indeksVarian + arah);
}

function buatKarousel() {
  if (slideStatisEl) {
    slideStatisEl.style.display = "none";
    titikBarisEl = document.createElement("div");
    titikBarisEl.className = "titik-karousel";
    titikBarisEl.innerHTML = VARIAN_WARNA.map(function (v, i) {
      return '<div class="titik" data-indeks="' + i + '" title="' + v.nama + '"></div>';
    }).join("");
    slideStatisEl.parentNode.insertBefore(titikBarisEl, slideStatisEl);
    titikBarisEl.querySelectorAll(".titik").forEach(function (t) {
      t.addEventListener("click", function () {
        setVarian(parseInt(t.getAttribute("data-indeks"), 10));
      });
    });
  }

  var paletStatis = document.querySelector(".warna-icon");
  if (paletStatis && paletStatis.parentNode) {
    paletStatis.style.display = "none";
    var wadah = paletStatis.parentNode;
    VARIAN_WARNA.forEach(function (v, i) {
      var chip = document.createElement("div");
      chip.className = "pilihan-warna-chip" + (i === 0 ? " dipilih" : "");
      chip.style.left = (28 + i * 34) + "px";
      chip.style.background = WARNA_CHIP[i];
      chip.title = "Pilih warna " + v.nama;
      chip.setAttribute("data-indeks", String(i));
      chip.addEventListener("click", function () { setVarian(i); });
      wadah.appendChild(chip);
    });
  }

  var wadahChip = document.querySelector(".rectangle-parent");
  if (wadahChip) {
    labelWarnaEl = document.createElement("div");
    labelWarnaEl.className = "label-warna-dipilih";
    labelWarnaEl.textContent = "Warna: " + VARIAN_WARNA[0].nama;
    wadahChip.appendChild(labelWarnaEl);
  }

  if (gambarProdukEl) {
    gambarProdukEl.style.cursor = "grab";
    gambarProdukEl.setAttribute("draggable", "false");
    gambarProdukEl.style.userSelect = "none";
    gambarProdukEl.style.webkitUserDrag = "none";
    var xTekan = null;
    gambarProdukEl.addEventListener("mousedown", function (e) {
      xTekan = e.clientX;
    });
    gambarProdukEl.addEventListener("click", function (e) {
      if (xTekan === null) xTekan = e.clientX;
      var geser = e.clientX - xTekan;
      xTekan = null;
      if (Math.abs(geser) > 35) {
        geserVarian(geser < 0 ? 1 : -1);
        return;
      }
      var kotak = gambarProdukEl.getBoundingClientRect();
      geserVarian((e.clientX - kotak.left) > kotak.width / 2 ? 1 : -1);
    });
    var xMulai = null;
    gambarProdukEl.addEventListener("touchstart", function (e) {
      xMulai = e.touches[0].clientX;
    }, { passive: true });
    gambarProdukEl.addEventListener("touchend", function (e) {
      if (xMulai === null) return;
      var geser = e.changedTouches[0].clientX - xMulai;
      if (Math.abs(geser) > 35) geserVarian(geser < 0 ? 1 : -1);
      xMulai = null;
    }, { passive: true });
  }

  BARIS_POPUP_WARNA.forEach(function (baris) {
    if (!baris.el) return;
    baris.el.style.cursor = "pointer";
    baris.el.title = "Pilih warna ini";
    baris.el.addEventListener("click", function () { setVarian(baris.indeks); });
  });

  gambarVarian();
}
buatKarousel();

muatProduk();
