package com.ecommerce.controllers;

import com.ecommerce.models.*;
import java.util.ArrayList;
import java.util.List;

public class AuthController {
    // Simulasi tabel database Pengguna menggunakan List
    private List<Pengguna> tabelPengguna = new ArrayList<>();

    // Logika untuk Mendaftar (Register) Pembeli
    public boolean registerPembeli(int id, String nama, String email, String password, String noTelepon, String alamat) {
        // Mengecek apakah email sudah dipakai
        for (Pengguna p : tabelPengguna) {
            if (p.getEmail().equals(email)) {
                System.out.println("Email sudah terdaftar!");
                return false; // Gagal mendaftar
            }
        }
        
        // Memakai model Pembeli
        Pembeli pembeliBaru = new Pembeli(id, nama, email, password, noTelepon, alamat);
        tabelPengguna.add(pembeliBaru);
        System.out.println("Registrasi Pembeli Berhasil!");
        return true;
    }

    // Logika untuk Login
    public Pengguna login(String email, String password) {
        for (Pengguna p : tabelPengguna) {
            // Jika email dan password cocok
            if (p.getEmail().equals(email) && p.getPassword().equals(password)) {
                System.out.println("Login Berhasil! Selamat datang, " + p.getNama());
                return p; // Mengembalikan data pengguna yang berhasil login
            }
        }
        System.out.println("Email atau Password salah!");
        return null; // Gagal login
    }
}