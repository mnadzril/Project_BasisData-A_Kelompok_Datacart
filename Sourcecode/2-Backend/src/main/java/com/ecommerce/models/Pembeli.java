package com.ecommerce.models;

public class Pembeli extends Pengguna {
    private String alamatPengiriman;

    public Pembeli() {
        super();
    }

    public Pembeli(int id, String nama, String email, String password, String noTelepon, String alamatPengiriman) {
        super(id, nama, email, password, noTelepon);
        this.alamatPengiriman = alamatPengiriman;
    }

    public String getAlamatPengiriman() { return alamatPengiriman; }
    public void setAlamatPengiriman(String alamatPengiriman) { this.alamatPengiriman = alamatPengiriman; }
}