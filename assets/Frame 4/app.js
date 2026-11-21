API.get("/api/kategori")
  .then(function (daftar) {
    var SLOT = [
      { label: ".elektronik",      gambar: ".komputerr-icon" },
      { label: ".fashion",         gambar: ".bajuuu-icon" },
      { label: ".beauty",          gambar: ".beautyy-icon" },
      { label: ".sport",           gambar: ".rumahijo-icon" },
      { label: ".home2",           gambar: ".sepatuu-icon" },
      { label: ".food-and-drink",  gambar: ".burger-icon" }
    ];

    SLOT.forEach(function (slot, i) {
      var elLabel  = document.querySelector(slot.label);
      var elGambar = document.querySelector(slot.gambar);
      var nama = daftar[i];

      if (!elLabel) return;

      if (!nama) {
        elLabel.style.visibility = "hidden";
        if (elGambar) elGambar.style.visibility = "hidden";
        return;
      }

      elLabel.textContent = nama;
      var buka = function () {
        window.location.href = "../Frame%203/index.html?kategori=" + encodeURIComponent(nama);
      };
      elLabel.style.cursor = "pointer";
      elLabel.addEventListener("click", buka);
      if (elGambar) {
        elGambar.style.cursor = "pointer";
        elGambar.addEventListener("click", buka);
      }
    });
  })
  .catch(function (err) {
    console.error("Gagal memuat kategori:", err.message);
  });
