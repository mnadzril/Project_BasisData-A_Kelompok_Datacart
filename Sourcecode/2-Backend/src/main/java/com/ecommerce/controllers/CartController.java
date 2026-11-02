package com.ecommerce.controllers;

import com.ecommerce.config.DatabaseConfig;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class CartController {

    public boolean tambahKeKeranjang(int idPembeli, int idProduk, int jumlah) {
        String sql = "INSERT INTO keranjang (id_pembeli, id_produk, jumlah) VALUES (?, ?, ?)";
        
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, idPembeli);
            stmt.setInt(2, idProduk);
            stmt.setInt(3, jumlah);
            
            stmt.executeUpdate();
            System.out.println("Produk berhasil ditambahkan ke keranjang!");
            return true;
        } catch (SQLException e) {
            System.out.println("Gagal memasukkan ke keranjang: " + e.getMessage());
            return false;
        }
    }
}