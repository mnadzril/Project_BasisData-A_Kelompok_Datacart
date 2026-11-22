package com.ecommerce.models;

import com.google.gson.annotations.SerializedName;

public class Produk {
    private int id;
    @SerializedName("nama_produk")
    private String namaProduk;
    private double harga;
    private int stok;
    private String kategori;
    private String deskripsi;
    @SerializedName("foto_produk")
    private String fotoProduk;
    @SerializedName("id_penjual")
    private int idPenjual;

    private int terjual;

    public Produk() {}

    public Produk(int id, String namaProduk, double harga, int stok,
                  String kategori, String deskripsi, String fotoProduk, int idPenjual) {
        this(id, namaProduk, harga, stok, kategori, deskripsi, fotoProduk, idPenjual, 0);
    }

    public Produk(int id, String namaProduk, double harga, int stok,
                  String kategori, String deskripsi, String fotoProduk, int idPenjual,
                  int terjual) {
        this.id = id;
        this.namaProduk = namaProduk;
        this.harga = harga;
        this.stok = stok;
        this.kategori = kategori;
        this.deskripsi = deskripsi;
        this.fotoProduk = fotoProduk;
        this.idPenjual = idPenjual;
        this.terjual = terjual;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNamaProduk() { return namaProduk; }
    public void setNamaProduk(String namaProduk) { this.namaProduk = namaProduk; }

    public double getHarga() { return harga; }
    public void setHarga(double harga) { this.harga = harga; }

    public int getStok() { return stok; }
    public void setStok(int stok) { this.stok = stok; }

    public String getKategori() { return kategori; }
    public void setKategori(String kategori) { this.kategori = kategori; }

    public String getDeskripsi() { return deskripsi; }
    public void setDeskripsi(String deskripsi) { this.deskripsi = deskripsi; }

    public String getFotoProduk() { return fotoProduk; }
    public void setFotoProduk(String fotoProduk) { this.fotoProduk = fotoProduk; }

    public int getIdPenjual() { return idPenjual; }
    public void setIdPenjual(int idPenjual) { this.idPenjual = idPenjual; }

    public int getTerjual() { return terjual; }
    public void setTerjual(int terjual) { this.terjual = terjual; }
}
