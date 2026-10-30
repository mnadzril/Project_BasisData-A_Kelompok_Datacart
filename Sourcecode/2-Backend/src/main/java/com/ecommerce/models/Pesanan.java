package com.ecommerce.models;

import java.util.Date;

public class Pesanan {
    private int idPesanan;
    private int idPembeli;
    private Produk produk;
    private int jumlahBeli;
    private double totalHarga; 
    private Date tanggalPesanan;
    private String statusPesanan; 

    public Pesanan() {}

    public Pesanan(int idPesanan, int idPembeli, Produk produk, int jumlahBeli, double totalHarga, Date tanggalPesanan, String statusPesanan) {
        this.idPesanan = idPesanan;
        this.idPembeli = idPembeli;
        this.produk = produk;
        this.jumlahBeli = jumlahBeli;
        this.totalHarga = totalHarga;
        this.tanggalPesanan = tanggalPesanan;
        this.statusPesanan = statusPesanan;
    }

    public int getIdPesanan() { return idPesanan; }
    public void setIdPesanan(int idPesanan) { this.idPesanan = idPesanan; }

    public int getIdPembeli() { return idPembeli; }
    public void setIdPembeli(int idPembeli) { this.idPembeli = idPembeli; }

    public Produk getProduk() { return produk; }
    public void setProduk(Produk produk) { this.produk = produk; }

    public int getJumlahBeli() { return jumlahBeli; }
    public void setJumlahBeli(int jumlahBeli) { this.jumlahBeli = jumlahBeli; }

    public double getTotalHarga() { return totalHarga; }
    public void setTotalHarga(double totalHarga) { this.totalHarga = totalHarga; }

    public Date getTanggalPesanan() { return tanggalPesanan; }
    public void setTanggalPesanan(Date tanggalPesanan) { this.tanggalPesanan = tanggalPesanan; }

    public String getStatusPesanan() { return statusPesanan; }
    public void setStatusPesanan(String statusPesanan) { this.statusPesanan = statusPesanan; }
}