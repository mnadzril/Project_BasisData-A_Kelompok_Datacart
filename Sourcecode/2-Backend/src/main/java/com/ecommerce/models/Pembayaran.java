package com.ecommerce.models;

public class Pembayaran {
    private int id;
    private int idPesanan;
    private String metodeBayar;
    private String tanggalBayar;
    private double jumlahBayar;

    public Pembayaran() {}

    public Pembayaran(int id, int idPesanan, String metodeBayar,
                      String tanggalBayar, double jumlahBayar) {
        this.id = id;
        this.idPesanan = idPesanan;
        this.metodeBayar = metodeBayar;
        this.tanggalBayar = tanggalBayar;
        this.jumlahBayar = jumlahBayar;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getIdPesanan() { return idPesanan; }
    public void setIdPesanan(int idPesanan) { this.idPesanan = idPesanan; }

    public String getMetodeBayar() { return metodeBayar; }
    public void setMetodeBayar(String metodeBayar) { this.metodeBayar = metodeBayar; }

    public String getTanggalBayar() { return tanggalBayar; }
    public void setTanggalBayar(String tanggalBayar) { this.tanggalBayar = tanggalBayar; }

    public double getJumlahBayar() { return jumlahBayar; }
    public void setJumlahBayar(double jumlahBayar) { this.jumlahBayar = jumlahBayar; }
}
