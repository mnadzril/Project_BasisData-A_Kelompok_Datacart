package com.ecommerce.models;

public class Penjual extends Pengguna {
    private String namaToko;
    private String alamatToko;

    public Penjual() {
        super();
    }

    public Penjual(int id, String nama, String email, String password, String noTelepon, String namaToko, String alamatToko) {
        super(id, nama, email, password, noTelepon);
        this.namaToko = namaToko;
        this.alamatToko = alamatToko;
    }

    public String getNamaToko() { return namaToko; }
    public void setNamaToko(String namaToko) { this.namaToko = namaToko; }

    public String getAlamatToko() { return alamatToko; }
    public void setAlamatToko(String alamatToko) { this.alamatToko = alamatToko; }
}