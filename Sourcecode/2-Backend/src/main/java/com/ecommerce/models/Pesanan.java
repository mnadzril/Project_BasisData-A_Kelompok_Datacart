package com.ecommerce.models;

import java.util.ArrayList;
import java.util.List;

public class Pesanan {
    private int idPesanan;
    private int idPembeli;
    private List<DetailPesanan> daftarItem = new ArrayList<>();
    private double subtotal;
    private double ongkir;
    private double biayaLayanan;
    private double totalHarga;
    private String tanggalPesanan;
    private String statusPesanan;
    private Integer idAdmin;

    public Pesanan() {}

    public int getIdPesanan() { return idPesanan; }
    public void setIdPesanan(int idPesanan) { this.idPesanan = idPesanan; }

    public int getIdPembeli() { return idPembeli; }
    public void setIdPembeli(int idPembeli) { this.idPembeli = idPembeli; }

    public List<DetailPesanan> getDaftarItem() { return daftarItem; }
    public void setDaftarItem(List<DetailPesanan> daftarItem) { this.daftarItem = daftarItem; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getOngkir() { return ongkir; }
    public void setOngkir(double ongkir) { this.ongkir = ongkir; }

    public double getBiayaLayanan() { return biayaLayanan; }
    public void setBiayaLayanan(double biayaLayanan) { this.biayaLayanan = biayaLayanan; }

    public double getTotalHarga() { return totalHarga; }
    public void setTotalHarga(double totalHarga) { this.totalHarga = totalHarga; }

    public String getTanggalPesanan() { return tanggalPesanan; }
    public void setTanggalPesanan(String tanggalPesanan) { this.tanggalPesanan = tanggalPesanan; }

    public String getStatusPesanan() { return statusPesanan; }
    public void setStatusPesanan(String statusPesanan) { this.statusPesanan = statusPesanan; }

    public Integer getIdAdmin() { return idAdmin; }
    public void setIdAdmin(Integer idAdmin) { this.idAdmin = idAdmin; }
}
