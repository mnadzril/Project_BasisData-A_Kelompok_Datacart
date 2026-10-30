package com.ecommerce.models;

public class Admin extends Pengguna {
    private String levelAkses;

    public Admin() {
        super();
    }

    public Admin(int id, String nama, String email, String password, String noTelepon, String levelAkses) {
        super(id, nama, email, password, noTelepon);
        this.levelAkses = levelAkses;
    }

    public String getLevelAkses() { return levelAkses; }
    public void setLevelAkses(String levelAkses) { this.levelAkses = levelAkses; }
}