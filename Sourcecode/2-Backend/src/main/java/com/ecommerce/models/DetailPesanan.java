package com.ecommerce.models;

public class DetailPesanan {
    private int idPesanan;
    private int idProduk;
    private int jumlah;
    private double hargaSaatBeli;
    private double subtotal;

    private String namaProduk;
    private String fotoProduk;

    public DetailPesanan() {}

    public DetailPesanan(int idPesanan, int idProduk, int jumlah,
                         double hargaSaatBeli, double subtotal,
                         String namaProduk, String fotoProduk) {
        this.idPesanan = idPesanan;
        this.idProduk = idProduk;
        this.jumlah = jumlah;
        this.hargaSaatBeli = hargaSaatBeli;
        this.subtotal = subtotal;
        this.namaProduk = namaProduk;
        this.fotoProduk = fotoProduk;
    }

    public int getIdPesanan() { return idPesanan; }
    public void setIdPesanan(int idPesanan) { this.idPesanan = idPesanan; }

    public int getIdProduk() { return idProduk; }
    public void setIdProduk(int idProduk) { this.idProduk = idProduk; }

    public int getJumlah() { return jumlah; }
    public void setJumlah(int jumlah) { this.jumlah = jumlah; }

    public double getHargaSaatBeli() { return hargaSaatBeli; }
    public void setHargaSaatBeli(double hargaSaatBeli) { this.hargaSaatBeli = hargaSaatBeli; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public String getNamaProduk() { return namaProduk; }
    public void setNamaProduk(String namaProduk) { this.namaProduk = namaProduk; }

    public String getFotoProduk() { return fotoProduk; }
    public void setFotoProduk(String fotoProduk) { this.fotoProduk = fotoProduk; }
}
