package com.ecommerce.controllers;

import com.ecommerce.models.Produk;
import java.util.ArrayList;
import java.util.List;

public class ProductController {
    private List<Produk> tabelProduk = new ArrayList<>();

    // Logika Penjual menambah produk baru
    public void tambahProduk(int id, String nama, double harga, int stok, String deskripsi, String foto, int idPenjual) {
        // Menggunakan model Produk
        Produk produkBaru = new Produk(id, nama, harga, stok, deskripsi, foto, idPenjual);
        tabelProduk.add(produkBaru);
        System.out.println("Produk " + nama + " berhasil ditambahkan!");
    }

    // Logika menampilkan semua produk ke Frontend
    public List<Produk> lihatSemuaProduk() {
        return tabelProduk;
    }
}