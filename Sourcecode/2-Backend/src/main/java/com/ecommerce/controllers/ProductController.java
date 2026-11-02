package com.ecommerce.controllers;

import com.ecommerce.models.Produk;
import com.ecommerce.config.DatabaseConfig;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProductController {

    // Menambah produk ke database
    public boolean tambahProduk(String nama, double harga, int stok, String deskripsi, String foto, int idPenjual) {
        String sql = "INSERT INTO produk (nama_produk, harga, stok, deskripsi, foto_produk, id_penjual) VALUES (?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, nama);
            stmt.setDouble(2, harga);
            stmt.setInt(3, stok);
            stmt.setString(4, deskripsi);
            stmt.setString(5, foto);
            stmt.setInt(6, idPenjual);
            
            stmt.executeUpdate();
            System.out.println("Berhasil: Produk " + nama + " masuk ke database!");
            return true;
        } catch (SQLException e) {
            System.out.println("Gagal Tambah Produk: " + e.getMessage());
            return false;
        }
    }

    // Mengambil semua produk dari database untuk ditampilkan ke web
    public List<Produk> lihatSemuaProduk() {
        List<Produk> daftarProduk = new ArrayList<>();
        String sql = "SELECT * FROM produk";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                Produk p = new Produk(
                    rs.getInt("id"),
                    rs.getString("nama_produk"),
                    rs.getDouble("harga"),
                    rs.getInt("stok"),
                    rs.getString("deskripsi"),
                    rs.getString("foto_produk"),
                    rs.getInt("id_penjual")
                );
                daftarProduk.add(p);
            }
        } catch (SQLException e) {
            System.out.println("Gagal Mengambil Produk: " + e.getMessage());
        }
        return daftarProduk;
    }
}