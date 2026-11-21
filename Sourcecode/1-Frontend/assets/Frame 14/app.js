API.get("/api/admin")
  .then(function (daftar) {
    var hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                 "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var kini = new Date();
    document.querySelector(".senin-25-oktober").textContent =
      hari[kini.getDay()] + ", " + kini.getDate() + " " + bulan[kini.getMonth()] +
      " " + kini.getFullYear();

    function ambilPetugas(shift) {
      var cocok = daftar.filter(function (a) {
        return (a.shift || "").toLowerCase() === shift.toLowerCase();
      });
      return cocok.length ? cocok[0] : null;
    }

    function isiKartu(kartuPemilih, shift) {
      var petugas = ambilPetugas(shift);
      var kartu = document.querySelector(kartuPemilih);
      if (!kartu) return;
      var nama = kartu.querySelector(".budi-santoso, .siang-siti-nurhaliza") ||
                 kartu.querySelector(".pagi-budi-santoso-container");
      if (!nama) return;

      if (!petugas) {
        nama.innerHTML = shift + "<br>Belum ada petugas";
        return;
      }
      nama.innerHTML = shift + "<br>" + petugas.nama_admin + " ( Admin )";
    }

    isiKartu(".uilcopy-group", "Pagi");
    isiKartu(".uilcopy-container", "Siang");
    isiKartu(".frame-div", "Malam");
  })
  .catch(tampilkanError);
