pasangNavigasiDasar();
pasangKembali();

var idPesanan = parseInt(
  paramUrl("pesanan") || localStorage.getItem("pesanan_terakhir") || "0", 10);

var TAHAP_STATUS = {
  "Menunggu Pembayaran": 0,
  "Dibatalkan": 0,
  "Diproses": 1,
  "Dikemas": 2,
  "Dalam Perjalanan": 4,
  "Diterima": 5
};

API.get("/api/pesanan/" + idPesanan)
  .then(function (p) {
    var tahun = new Date().getFullYear();
    var elInv = document.querySelector(".inv250500123, .inv");
    if (elInv) elInv.textContent = "INV/" + tahun + "/" + String(p.id_pesanan).padStart(5, "0");
    var elResi = document.querySelector(".jne1234567890, .resi");
    if (elResi) elResi.textContent = "JNE" + String(p.id_pesanan).padStart(10, "0");

    var tgl = (p.tgl_pesanan || "").split(" ")[0];
    var elTgl = document.querySelector(".rabu-20-mei, .tanggal");
    if (elTgl) elTgl.textContent = tgl;

    if (p.items && p.items.length) {
      var it = p.items[0];
      var elNama = document.querySelector(".samsung-s24-ultra");
      if (elNama) elNama.textContent = it.nama_produk;
      var elJumlah = document.querySelector(".x-1");
      if (elJumlah) elJumlah.textContent = "x " + it.jumlah;
      var elFoto = document.querySelector(".samsung-icon");
      if (elFoto && it.foto_produk) elFoto.src = it.foto_produk;
    }
    var elTotal = document.querySelector(".rp-22022000, .total");
    if (elTotal) elTotal.textContent = formatRupiah(p.total_harga);

    var tahap = TAHAP_STATUS[p.status] || 0;

    var IKON_BELUM = { 1: "icons/jamabu.svg", 2: "icons/kotakabu.svg" };

    for (var i = 1; i <= 5; i++) {
      var langkah = document.querySelector(".status-" + i);
      if (!langkah) continue;
      var ikonLangkah = langkah.querySelector(".status-circle img");
      if (i <= tahap) {
        langkah.classList.add("status-selesai");
        if (ikonLangkah && IKON_BELUM[i]) ikonLangkah.src = "icons/check.svg";
        var tanggal = langkah.querySelector(".status-date");
        if (!tanggal) {
          tanggal = document.createElement("div");
          tanggal.className = "status-date";
          tanggal.style.cssText = "font-size:13px;color:#666;";
          langkah.querySelector(".status-info").appendChild(tanggal);
        }
        tanggal.textContent = tgl;
      } else {
        langkah.classList.remove("status-selesai");
        if (ikonLangkah && IKON_BELUM[i]) ikonLangkah.src = IKON_BELUM[i];
      }
    }

    if (p.pembayaran) {
      var info = document.querySelector(".informasi-pengiriman");
      if (info) info.textContent =
        "Informasi Pengiriman - Dibayar via " + p.pembayaran.metode_bayar;
    }
  })
  .catch(function (err) {
    alert(err.message);
    pindahHalaman("../Frame%202/index.html");
  });

function toastKecil(teks) {
  var toast = document.createElement("div");
  toast.textContent = teks;
  toast.style.cssText =
    "position:fixed;left:50%;bottom:26px;transform:translateX(-50%);" +
    "background:#0b3ea8;color:#fff;padding:10px 18px;border-radius:20px;" +
    "font:600 13.5px Inter,Arial,sans-serif;z-index:99999;" +
    "box-shadow:0 4px 14px rgba(0,0,0,.25);";
  document.body.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 2200);
}

function salinKePapanKlip(teks, pesan) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(teks).then(
      function () { toastKecil(pesan); },
      function () { salinCadangan(teks, pesan); }
    );
    return;
  }
  salinCadangan(teks, pesan);
}

function salinCadangan(teks, pesan) {
  var bantu = document.createElement("textarea");
  bantu.value = teks;
  bantu.style.cssText = "position:fixed;opacity:0;pointer-events:none;";
  document.body.appendChild(bantu);
  bantu.select();
  try { document.execCommand("copy"); toastKecil(pesan); }
  catch (e) { toastKecil("Gagal menyalin: " + teks); }
  bantu.remove();
}

var elLacak = document.querySelector(".lacak");
var elKartuStatus = document.querySelector(".frame-10-done-inner");

if (elLacak && elKartuStatus) {
  elLacak.addEventListener("click", function () {
    elKartuStatus.scrollIntoView({ behavior: "smooth", block: "center" });
    elKartuStatus.style.transition = "box-shadow .25s ease";
    elKartuStatus.style.boxShadow = "0 0 0 3px #18a999";
    setTimeout(function () {
      elKartuStatus.style.boxShadow = "";
    }, 2000);
  });
}

pasangKlik(".uilcopy-icon", function () {
  var elInv = document.querySelector(".inv250500123");
  if (elInv) salinKePapanKlip(elInv.textContent.trim(), "No. Pesanan tersalin.");
});

pasangKlik(".uilcopy-icon2", function () {
  var elResi = document.querySelector(".jne1234567890");
  if (elResi) salinKePapanKlip(elResi.textContent.trim(), "No. Resi tersalin.");
});
