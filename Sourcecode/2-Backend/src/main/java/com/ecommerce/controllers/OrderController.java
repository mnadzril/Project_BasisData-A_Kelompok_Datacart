package com.ecommerce.controllers;

import com.ecommerce.models.Pesanan;
import com.ecommerce.models.Produk;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class OrderController {
    private List<Pesanan> tabelPesanan = new ArrayList<>();

    // Logika memproses Checkout produk
    public boolean buatPesanan(int idPesanan, int idPembeli, Produk produkYangDibeli, int jumlahBeli) {
        // Cek apakah stok cukup
        if (produkYangDibeli.getStok() < jumlahBeli) {
            System.out.println("Maaf, stok tidak mencukupi!");
            return false;
        }

        // Kurangi stok produk
        produkYangDibeli.setStok(produkYangDibeli.getStok() - jumlahBeli);

        // Hitung total harga
        double total = produkYangDibeli.getHarga() * jumlahBeli;

        // Simpan ke catatan pesanan (Memakai model Pesanan)
        Pesanan pesananBaru = new Pesanan(idPesanan, idPembeli, produkYangDibeli, jumlahBeli, total, new Date(), "Lunas");
        tabelPesanan.add(pesananBaru);
        
        System.out.println("Pesanan berhasil dibuat dengan total: Rp" + total);
        return true;
    }
}