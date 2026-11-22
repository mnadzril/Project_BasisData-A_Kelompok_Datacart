var nomorPulsa = document.getElementById("nomorPulsa");
var pilihan = document.querySelectorAll("#kisiNominal .pilihan");
var tombolBayar = document.getElementById("tombolBayar");
var nominalTerpilih = 0;
var BIAYA_ADMIN = 1500;

function formatRp(n) {
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function perbaruiRingkasan() {
  var elNominal = document.getElementById("ringkasanNominal");
  var elAdmin = document.getElementById("ringkasanAdmin");
  var elTotal = document.getElementById("ringkasanTotal");
  if (nominalTerpilih > 0) {
    elNominal.textContent = formatRp(nominalTerpilih);
    elAdmin.textContent = formatRp(BIAYA_ADMIN);
    elTotal.textContent = formatRp(nominalTerpilih + BIAYA_ADMIN);
  } else {
    elNominal.textContent = "-";
    elAdmin.textContent = "-";
    elTotal.textContent = "-";
  }
  tombolBayar.disabled = !(nominalTerpilih > 0 && nomorPulsa.value.trim().length >= 9);
}

pilihan.forEach(function (item) {
  item.addEventListener("click", function () {
    pilihan.forEach(function (x) { x.classList.remove("dipilih"); });
    item.classList.add("dipilih");
    nominalTerpilih = parseInt(item.getAttribute("data-harga"), 10);
    perbaruiRingkasan();
  });
});

nomorPulsa.addEventListener("input", perbaruiRingkasan);

tombolBayar.addEventListener("click", function () {
  var nomor = nomorPulsa.value.trim();
  if (nomor.length < 9) {
    alert("Nomor telepon belum lengkap (minimal 9 angka).");
    return;
  }
  if (!nominalTerpilih) {
    alert("Pilih nominal pulsa dulu.");
    return;
  }
  var lanjut = confirm(
    "Isi pulsa " + formatRp(nominalTerpilih) + " ke nomor " + nomor +
    ".\nTotal bayar " + formatRp(nominalTerpilih + BIAYA_ADMIN) + ". Lanjutkan?"
  );
  if (lanjut) {
    alert("Pembayaran berhasil! Pulsa " + formatRp(nominalTerpilih) +
      " segera masuk ke nomor " + nomor + ".");
    nomorPulsa.value = "";
    nominalTerpilih = 0;
    pilihan.forEach(function (x) { x.classList.remove("dipilih"); });
    perbaruiRingkasan();
  }
});

document.getElementById("tombolKembali").addEventListener("click", function () {
  window.history.back();
});

document.querySelectorAll(".navbar-bawah .menu-nav").forEach(function (menu) {
  menu.addEventListener("click", function () {
    window.location.href = menu.getAttribute("data-tujuan");
  });
});
