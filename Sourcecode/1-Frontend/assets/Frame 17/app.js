var pilihanGame = document.querySelectorAll("#kisiGame .pilihan");
var pilihanNominal = document.querySelectorAll("#kisiNominal .pilihan");
var idGame = document.getElementById("idGame");
var tombolBayar = document.getElementById("tombolBayar");

var gameTerpilih = "Mobile Legends";
var nominalTerpilih = null;
var hargaTerpilih = 0;

function formatRp(n) {
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function perbaruiRingkasan() {
  var elVoucher = document.getElementById("ringkasanVoucher");
  var elHarga = document.getElementById("ringkasanHarga");
  if (nominalTerpilih) {
    elVoucher.textContent = nominalTerpilih;
    elHarga.textContent = formatRp(hargaTerpilih);
  } else {
    elVoucher.textContent = "-";
    elHarga.textContent = "-";
  }
  tombolBayar.disabled = !(nominalTerpilih && idGame.value.trim().length >= 4);
}

pilihanGame.forEach(function (item) {
  item.addEventListener("click", function () {
    pilihanGame.forEach(function (x) { x.classList.remove("dipilih"); });
    item.classList.add("dipilih");
    gameTerpilih = item.getAttribute("data-game");
  });
});

pilihanNominal.forEach(function (item) {
  item.addEventListener("click", function () {
    pilihanNominal.forEach(function (x) { x.classList.remove("dipilih"); });
    item.classList.add("dipilih");
    nominalTerpilih = item.getAttribute("data-label");
    hargaTerpilih = parseInt(item.getAttribute("data-harga"), 10);
    perbaruiRingkasan();
  });
});

idGame.addEventListener("input", perbaruiRingkasan);

tombolBayar.addEventListener("click", function () {
  var id = idGame.value.trim();
  if (id.length < 4) {
    alert("Isi ID / nickname akun game terlebih dahulu.");
    return;
  }
  var lanjut = confirm(
    "Top up " + nominalTerpilih + " untuk " + gameTerpilih +
    ".\nID akun: " + id + "\nTotal bayar: " + formatRp(hargaTerpilih) + ". Lanjutkan?"
  );
  if (lanjut) {
    alert("Top up berhasil! " + nominalTerpilih + " " + gameTerpilih +
      " segera masuk ke akun " + id + ".");
    idGame.value = "";
    nominalTerpilih = null;
    hargaTerpilih = 0;
    pilihanNominal.forEach(function (x) { x.classList.remove("dipilih"); });
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
