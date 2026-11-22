pasangNavigasiDasar();
pasangKembali();

var user = sesi.baca();

var EKSPEDISI = [
  { kartu: ".rectangle-parent", ongkir: 15000, nama: "JNE Express", eta: "Garansi tiba (2-3 Hari)" },
  { kartu: ".rectangle-group", ongkir: 25000, nama: "SiLambat", eta: "Garansi tiba (1-2 Hari)" },
  { kartu: ".rectangle-container", ongkir: 45000, nama: "Deliverinn", eta: "Garansi tiba (1 Hari)" }
];
var ongkirPilih = 15000;
var BIAYA_LAYANAN = 2000;

var EKSPEDISI_LAIN = [
  { nama: "J&T Express",   ongkir: 18000, eta: "Garansi tiba (2-3 Hari)" },
  { nama: "SiCepat",       ongkir: 17000, eta: "Garansi tiba (2-3 Hari)" },
  { nama: "AnterAja",      ongkir: 16000, eta: "Garansi tiba (2-4 Hari)" },
  { nama: "Pos Indonesia", ongkir: 13000, eta: "Garansi tiba (3-5 Hari)" },
  { nama: "GoSend",        ongkir: 25000, eta: "Garansi tiba (1 Hari)" }
];

function EKSPEDISISIAP() {
  var tiga = EKSPEDISI.map(function (e) {
    return { nama: e.nama, ongkir: e.ongkir, eta: e.eta, indeksKartu: EKSPEDISI.indexOf(e) };
  });
  return tiga.concat(EKSPEDISI_LAIN);
}

function terapkanEkspedisi(pilihan) {
  if (pilihan.indeksKartu !== undefined) {
    pilihEkspedisi(pilihan.indeksKartu);
    return;
  }
  var kartu = document.querySelector(".rectangle-parent");
  if (kartu) {
    var elNama = kartu.querySelector(".jnexpress, .jnexpress *");
    if (elNama) elNama.textContent = pilihan.nama;
    var elHarga = kartu.querySelector(".rp-15000");
    if (elHarga) elHarga.textContent = formatRupiah(pilihan.ongkir);
    var elEta = kartu.querySelector(".garansi-tiba-2-3");
    if (elEta) elEta.textContent = pilihan.eta;
  }
  EKSPEDISI[0] = { kartu: ".rectangle-parent", ongkir: pilihan.ongkir, nama: pilihan.nama, eta: pilihan.eta };
  pilihEkspedisi(0);
}

function bukaPopupEkspedisi() {
  var modal = document.createElement("div");
  modal.className = "modal-alamat";
  modal.innerHTML =
    '<div class="kotak-modal kotak-ekspedisi">' +
      '<h3 class="judul-modal">Semua Ekspedisi Pengiriman</h3>' +
      '<div class="daftar-ekspedisi" id="daftarEkspedisi"></div>' +
      '<div class="baris-tombol"><button class="tombol-batal" type="button">Tutup</button></div>' +
    "</div>";
  document.body.appendChild(modal);

  var wadah = modal.querySelector("#daftarEkspedisi");
  var daftar = EKSPEDISISIAP();
  wadah.innerHTML = daftar.map(function (e, i) {
    return (
      '<div class="baris-ekspedisi" data-indeks="' + i + '" title="Pilih ' + e.nama + '">' +
        '<div class="bulet-ekspedisi"></div>' +
        '<div class="info-ekspedisi">' +
          '<div class="nama-ekspedisi">' + e.nama + "</div>" +
          '<div class="eta-ekspedisi">' + e.eta + "</div>" +
        "</div>" +
        '<div class="harga-ekspedisi">' + formatRupiah(e.ongkir) + "</div>" +
      "</div>"
    );
  }).join("");

  wadah.querySelectorAll(".baris-ekspedisi").forEach(function (baris) {
    baris.addEventListener("click", function () {
      var pilihan = daftar[parseInt(baris.getAttribute("data-indeks"), 10)];
      terapkanEkspedisi(pilihan);
      modal.remove();
    });
  });

  modal.querySelector(".tombol-batal").addEventListener("click", function () {
    modal.remove();
  });
  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.remove();
  });
}

pasangKlik(".lihat-semua-parent", bukaPopupEkspedisi);

var KUNCI_ALAMAT = "alamat_daftar";
var KUNCI_ALAMAT_DIPILIH = "alamat_dipilih";

function bacaAlamat() {
  try {
    var daftar = JSON.parse(localStorage.getItem(KUNCI_ALAMAT));
    if (daftar && daftar.length) return daftar;
  } catch (e) {}
  var awal = {
    nama: user ? (user.nama || "Pembeli") : "Wahyu Kusuma",
    telepon: user ? (user.no_telepon || "-") : "0857-5609-1269",
    alamat: user && user.alamat
      ? user.alamat
      : "Jl. Barat Landak No, 23. Kalimaling, Cilandak, Jakarta Pusat, DKI Jakarta 12454"
  };
  return [awal];
}

function simpanAlamat(daftar, dipilih) {
  if (daftar) localStorage.setItem(KUNCI_ALAMAT, JSON.stringify(daftar));
  if (dipilih !== undefined) localStorage.setItem(KUNCI_ALAMAT_DIPILIH, String(dipilih));
}

function indeksDipilih(daftar) {
  var i = parseInt(localStorage.getItem(KUNCI_ALAMAT_DIPILIH) || "0", 10);
  return isNaN(i) || i < 0 || i >= daftar.length ? 0 : i;
}

var wadahAlamat = document.getElementById("daftarAlamat");

function kartuAlamatHTML(data, i, dipilih) {
  return (
    '<div class="kartu-alamat' + (i === dipilih ? " dipilih" : "") + '" data-indeks="' + i + '">' +
      '<img class="kartu-bg" src="icons/Rectangle6.svg" alt="">' +
      '<img class="radio-alamat" src="icons/' + (i === dipilih ? "BuletBiru" : "BuletPutih") + '.svg" alt="">' +
      '<div class="nama-alamat">' + data.nama + "</div>" +
      '<img class="ikon-telepon" src="icons/Telfon.svg" alt="">' +
      '<div class="telepon-alamat">' + data.telepon + "</div>" +
      '<div class="teks-alamat">' + data.alamat + "</div>" +
      '<img class="garis-alamat" src="icons/GarisBatas.svg" alt="">' +
      '<div class="tombol-ubah" data-indeks="' + i + '">Ubah</div>' +
    "</div>"
  );
}

function gambarAlamat() {
  if (!wadahAlamat) return;
  var daftar = bacaAlamat();
  var dipilih = indeksDipilih(daftar);
  wadahAlamat.innerHTML = daftar
    .map(function (data, i) { return kartuAlamatHTML(data, i, dipilih); })
    .join("");

  wadahAlamat.querySelectorAll(".kartu-alamat").forEach(function (kartu) {
    kartu.addEventListener("click", function (e) {
      if (e.target.classList.contains("tombol-ubah")) return;
      simpanAlamat(null, parseInt(kartu.getAttribute("data-indeks"), 10));
      gambarAlamat();
    });
  });

  wadahAlamat.querySelectorAll(".tombol-ubah").forEach(function (tombol) {
    tombol.addEventListener("click", function (e) {
      e.stopPropagation();
      bukaFormAlamat(parseInt(tombol.getAttribute("data-indeks"), 10));
    });
  });
}

function bukaFormAlamat(indeksEdit) {
  var daftar = bacaAlamat();
  var data = indeksEdit >= 0 ? daftar[indeksEdit] : { nama: "", telepon: "", alamat: "" };

  var modal = document.createElement("div");
  modal.className = "modal-alamat";
  modal.innerHTML =
    '<div class="kotak-modal">' +
      '<h3 class="judul-modal">' + (indeksEdit >= 0 ? "Ubah Alamat" : "Tambah Alamat") + "</h3>" +
      '<label class="label-form">Nama Penerima</label>' +
      '<input class="input-form" id="formNama" value="' + String(data.nama || "").replace(/"/g, "&quot;") + '">' +
      '<label class="label-form">No. Telepon</label>' +
      '<input class="input-form" id="formTelepon" value="' + String(data.telepon || "").replace(/"/g, "&quot;") + '">' +
      '<label class="label-form">Alamat Lengkap</label>' +
      '<textarea class="input-form" id="formAlamatTeks" rows="3" style="resize:none">' +
        String(data.alamat || "").replace(/</g, "&lt;") + "</textarea>" +
      '<div class="baris-tombol">' +
        '<button class="tombol-batal">Batal</button>' +
        '<button class="tombol-simpan">Simpan</button>' +
      "</div>" +
    "</div>";

  document.body.appendChild(modal);

  function tutup() { modal.remove(); }

  modal.querySelector(".tombol-batal").addEventListener("click", tutup);
  modal.addEventListener("click", function (e) { if (e.target === modal) tutup(); });

  modal.querySelector(".tombol-simpan").addEventListener("click", function () {
    var nama = modal.querySelector("#formNama").value.trim();
    var telepon = modal.querySelector("#formTelepon").value.trim();
    var alamat = modal.querySelector("#formAlamatTeks").value.trim();

    if (!nama || !telepon || !alamat) {
      alert("Nama, no. telepon, dan alamat wajib diisi.");
      return;
    }

    if (indeksEdit >= 0) {
      daftar[indeksEdit] = { nama: nama, telepon: telepon, alamat: alamat };
    } else {
      daftar.push({ nama: nama, telepon: telepon, alamat: alamat });
    }
    simpanAlamat(daftar, indeksEdit >= 0 ? indeksEdit : daftar.length - 1);
    tutup();
    gambarAlamat();
  });
}

pasangKlik(".tambah-alamat-parent, .tambah-alamat, .vector-icon", function () {
  bukaFormAlamat(-1);
});

gambarAlamat();

function gambarRadio(kartu) {
  return kartu.querySelector(".akar-iconsradio-fill, .akar-iconsradio");
}

function gambarLatar(kartu) {
  return kartu.querySelector(".rectangle-icon");
}

function pilihEkspedisi(indeks) {
  ongkirPilih = EKSPEDISI[indeks].ongkir;
  EKSPEDISI.forEach(function (e, i) {
    var kartu = document.querySelector(e.kartu);
    if (!kartu) return;
    var radio = gambarRadio(kartu);
    if (radio) {
      radio.src = (i === indeks) ? "icons/BuletDalam.svg" : "icons/BuletKosong.svg";
    }
    var latar = gambarLatar(kartu);
    if (latar) {
      latar.src = (i === indeks) ? "icons/KotakBiru.svg" : "icons/KotakPutih.svg";
    }
    kartu.style.cursor = "pointer";
  });
  hitungRincian();
}

EKSPEDISI.forEach(function (e, i) {
  var kartu = document.querySelector(e.kartu);
  if (kartu) kartu.addEventListener("click", function () { pilihEkspedisi(i); });
});
pilihEkspedisi(0);

var subtotalPesanan = 0;
var itemsKeranjang = [];

var KUNCI_VOUCHER = "voucher_dipakai";

function bacaVoucher() {
  try { return JSON.parse(localStorage.getItem(KUNCI_VOUCHER)); }
  catch (e) { return null; }
}

function diskonVoucherSekarang() {
  var v = bacaVoucher();
  if (!v) return 0;
  if (v.jenis === "potongan") {
    return Math.min(v.nilai, subtotalPesanan);
  }
  if (v.jenis === "ongkir") {
    return Math.min(v.nilai, ongkirPilih);
  }
  return 0;
}

function hitungRincian() {
  var elSubtotal = document.querySelector(".rp-21999000, .rp-21999000");
  var elOngkir = document.querySelector(".rp-150002");
  var elTotal = document.querySelector(".rp-22022000, .rp-22022000, .total");
  var elDiskon = document.querySelector(".rp-12000");
  var elLabelDiskon = document.querySelector(".total-diskon-pengiriman");
  var elBiaya = document.querySelector(".rp-20000");

  var diskon = diskonVoucherSekarang();

  if (elSubtotal) elSubtotal.textContent = formatRupiah(subtotalPesanan);
  if (elOngkir) elOngkir.textContent = formatRupiah(ongkirPilih);
  if (elBiaya) elBiaya.textContent = formatRupiah(BIAYA_LAYANAN);

  if (elDiskon) {
    elDiskon.textContent = diskon > 0 ? "-" + formatRupiah(diskon) : "-Rp 0";
  }
  if (elLabelDiskon) {
    var v = bacaVoucher();
    elLabelDiskon.textContent = v && diskon > 0
      ? "Diskon Voucher (" + v.kode + ")"
      : "Total Diskon Pengiriman";
  }
  if (elTotal) {
    var bayar = subtotalPesanan + ongkirPilih + BIAYA_LAYANAN - diskon;
    if (bayar < 0) bayar = 0;
    elTotal.textContent = formatRupiah(bayar);
  }
}

function muatKeranjang() {
  if (!user || user.role !== "pembeli") {
    alert("Login dulu sebagai pembeli untuk checkout.");
    keLogin();
    return;
  }
  API.get("/api/keranjang/" + user.id)
    .then(function (hasil) {
      if (!hasil.items.length) {
        alert("Keranjang kosong. Pilih produk dulu.");
        pindahHalaman("../Frame%203/index.html");
        return;
      }
      itemsKeranjang = hasil.items;
      subtotalPesanan = hasil.total;
      hitungRincian();
    })
    .catch(tampilkanError);
}

muatKeranjang();

function lanjutPembayaran() {
  if (!itemsKeranjang.length) {
    alert("Menyiapkan data keranjang, coba lagi sebentar.");
    muatKeranjang();
    return;
  }
  var items = itemsKeranjang.map(function (it) {
    return { id_produk: it.id_produk, jumlah: it.jumlah };
  });
  API.post("/api/pesanan/checkout", {
    id_pembeli: user.id,
    items: items,
    ongkir: ongkirPilih,
    biaya_layanan: BIAYA_LAYANAN,
    diskon: diskonVoucherSekarang()
  })
    .then(function (hasil) {
      localStorage.setItem("pesanan_terakhir", String(hasil.id_pesanan));
      localStorage.removeItem("voucher_dipakai");
      pindahHalaman("../Frame%209/index.html?pesanan=" + hasil.id_pesanan);
    })
    .catch(tampilkanError);
}

pasangKlik(".rectangle1, .rectangle-1, .lanjut-ke-pembayaran, .kotakbayar-icon", lanjutPembayaran);
pasangKlik(".panah-icon, .panahkiri-icon, .arrow-left-icon", function () {
  window.history.back();
});
