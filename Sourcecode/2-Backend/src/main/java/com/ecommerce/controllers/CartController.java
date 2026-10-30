package com.ecommerce.controllers;

import com.ecommerce.models.Produk;
import java.util.ArrayList;
import java.util.List;

public class CartController {
    // Simulasi keranjang belanja (hanya menyimpan produk yang dipilih)
    private List<Produk> isiKeranjang = new ArrayList<>();

    public void tambahKeKeranjang(Produk produk) {
        isiKeranjang.add(produk);
        System.out.println(produk.getNamaProduk() + " masuk ke keranjang!");
    }

    public void lihatIsiKeranjang() {
        System.out.println("--- Isi Keranjang ---");
        double totalSemua = 0;
        for (Produk p : isiKeranjang) {
            System.out.println("- " + p.getNamaProduk() + " | Harga: " + p.getHarga());
            totalSemua += p.getHarga();
        }
        System.out.println("Total Belanjaan: Rp" + totalSemua);
    }
}