package com.ecommerce.models;

public class Admin extends Pengguna {
    private String shift;

    public Admin() {
        super();
    }

    public Admin(int id, String nama, String email, String password, String noTelepon, String shift) {
        super(id, nama, email, password, noTelepon);
        this.shift = shift;
    }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }
}
