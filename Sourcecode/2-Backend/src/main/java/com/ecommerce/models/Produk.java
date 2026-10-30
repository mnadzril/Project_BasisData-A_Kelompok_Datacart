package com.ecommerce.models;

public class Produk {
    private int id;
    private String namaProduk;
    private double harga;
    private int stok;
    private String deskripsi;
    private String fotoProduk;
    private int idPenjual;

    public Produk() {}

    public Produk(int id, String namaProduk, double harga, int stok, String deskripsi, String fotoProduk,  int idPenjual) {
        this.id = id;
        this.namaProduk = namaProduk;
        this.harga = harga;
        this.stok = stok;
        this.deskripsi = deskripsi;
        this.fotoProduk = fotoProduk;
        this.idPenjual = idPenjual;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNamaProduk() { return namaProduk; }
    public void setNamaProduk(String namaProduk) { this.namaProduk = namaProduk; }

    public double getHarga() { return harga; }
    public void setHarga(double harga) { this.harga = harga; }

    public int getStok() { return stok; }
    public void setStok(int stok) { this.stok = stok; }

    public String getDeskripsi() { return deskripsi; }
    public void setDeskripsi(String deskripsi) { this.deskripsi = deskripsi; }

    public String getFotoProduk() { return fotoProduk; }
    public void setFotoProduk(String fotoProduk) { this.fotoProduk = fotoProduk; }

    public int getIdPenjual() { return idPenjual; }
    public void setIdPenjual(int idPenjual) { this.idPenjual = idPenjual; }
}