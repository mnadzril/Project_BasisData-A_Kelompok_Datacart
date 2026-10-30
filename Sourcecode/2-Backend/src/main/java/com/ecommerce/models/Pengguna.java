package com.ecommerce.models;

public class Pengguna {
    private int id;
    private String nama;
    private String email;
    private String password;
    private String noTelepon;

    public Pengguna() {}

    public Pengguna(int id, String nama, String email, String password, String noTelepon) {
        this.id = id;
        this.nama = nama;
        this.email = email;
        this.password = password;
        this.noTelepon = noTelepon;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNama() { return nama; }
    public void setNama(String nama) { this.nama = nama; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNoTelepon() { return noTelepon; }
    public void setNoTelepon(String noTelepon) { this.noTelepon = noTelepon; }
}