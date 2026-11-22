var user = sesi.baca();

if (!user || user.role !== "penjual") {
  alert("Silakan login sebagai penjual terlebih dahulu.");
  pindahHalaman("../Frame%2019/index.html");
}

if (user) {
  document.getElementById("namaToko").textContent = user.nama_toko || user.nama;
  document.getElementById("inputNamaToko").value = user.nama_toko || "";
  document.getElementById("inputNamaPenjual").value = user.nama || "";
  document.getElementById("inputEmail").value = user.email || "";
}

pasangKlik(".back-arrow", function () {
  pindahHalaman("../Frame%2020/index.html");
});

document.getElementById("tombolSimpan").addEventListener("click", function () {
  var namaToko = document.getElementById("inputNamaToko").value.trim();
  var namaPenjual = document.getElementById("inputNamaPenjual").value.trim();
  var email = document.getElementById("inputEmail").value.trim();
  var alamat = document.getElementById("inputAlamat").value.trim();

  if (!namaToko || !namaPenjual || !email) {
    alert("Nama Toko, Nama Penjual, dan Email wajib diisi!");
    return;
  }

  sesi.perbarui({ nama: namaPenjual, email: email, nama_toko: namaToko });
  alert("Pengaturan akun tersimpan.");
  pindahHalaman("../Frame%2020/index.html");
});

pasangKlik(".tombol-ke-pembeli", function () {
  var yakin = confirm("Keluar dari akun penjual dan kembali ke akun pembeli?");
  if (yakin) {
    sesi.hapus();
    pindahHalaman("../Frame%201/index.html");
  }
});
