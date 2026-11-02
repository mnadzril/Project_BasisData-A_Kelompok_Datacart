package com.ecommerce.controllers;

import com.ecommerce.models.Pembeli;
import com.ecommerce.models.Pengguna;
import com.ecommerce.config.DatabaseConfig;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AuthController {

    // Fungsi Register Pembeli ke Database
    public boolean registerPembeli(String nama, String email, String password, String noTelepon, String alamat) {
        String sql = "INSERT INTO pembeli (nama, email, password, no_telepon, alamat_pengiriman) VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, nama);
            stmt.setString(2, email);
            stmt.setString(3, password);
            stmt.setString(4, noTelepon);
            stmt.setString(5, alamat);
            
            int barisBerubah = stmt.executeUpdate();
            if (barisBerubah > 0) {
                System.out.println("Berhasil: Akun pembeli baru telah disimpan ke database!");
                return true;
            }
        } catch (SQLException e) {
            System.out.println("Gagal Register: " + e.getMessage());
        }
        return false;
    }

    // Fungsi Login dari Database
    public Pengguna login(String email, String password) {
        String sql = "SELECT * FROM pembeli WHERE email = ? AND password = ?";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, email);
            stmt.setString(2, password);
            
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                // Jika data ditemukan, buat objek Pembeli dan kembalikan
                Pembeli user = new Pembeli(
                    rs.getInt("id"),
                    rs.getString("nama"),
                    rs.getString("email"),
                    rs.getString("password"),
                    rs.getString("no_telepon"),
                    rs.getString("alamat_pengiriman")
                );
                System.out.println("Berhasil Login! Selamat datang, " + user.getNama());
                return user;
            } else {
                System.out.println("Email atau Password salah!");
            }
        } catch (SQLException e) {
            System.out.println("Gagal Login (Error Database): " + e.getMessage());
        }
        return null;
    }
}