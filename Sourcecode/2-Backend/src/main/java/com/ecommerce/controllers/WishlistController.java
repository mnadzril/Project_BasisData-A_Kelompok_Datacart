package com.ecommerce.controllers;

import com.ecommerce.config.DatabaseConfig;
import com.ecommerce.http.HttpUtil;
import com.google.gson.JsonObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class WishlistController {

    public Map<String, Object> lihat(int idPembeli) throws SQLException {
        String sql = "SELECT w.id_produk, p.nama_produk, p.harga, p.foto_produk, p.stok, "
                   + "w.tanggal_ditambahkan "
                   + "FROM wishlist w JOIN produk p ON p.id = w.id_produk "
                   + "WHERE w.id_pembeli = ? ORDER BY w.tanggal_ditambahkan DESC";
        List<Map<String, Object>> items = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idPembeli);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id_produk", rs.getInt("id_produk"));
                    item.put("nama_produk", rs.getString("nama_produk"));
                    item.put("harga", rs.getDouble("harga"));
                    item.put("foto_produk", rs.getString("foto_produk"));
                    item.put("stok", rs.getInt("stok"));
                    item.put("tanggal_ditambahkan", HttpUtil.tanggal(rs.getTimestamp("tanggal_ditambahkan")));
                    items.add(item);
                }
            }
        }
        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("items", items);
        hasil.put("jumlah", items.size());
        return hasil;
    }

    public Map<String, Object> tambah(JsonObject data) throws SQLException {
        int idPembeli = HttpUtil.angka(data, "id_pembeli", 0);
        int idProduk  = HttpUtil.angka(data, "id_produk", 0);
        if (idPembeli <= 0 || idProduk <= 0) {
            throw new IllegalArgumentException("id_pembeli dan id_produk wajib diisi");
        }

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT id FROM produk WHERE id = ?")) {
            stmt.setInt(1, idProduk);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new IllegalArgumentException("Produk tidak ditemukan");
                }
            }
        }

        String sql = "INSERT IGNORE INTO wishlist (id_pembeli, id_produk) VALUES (?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idPembeli);
            stmt.setInt(2, idProduk);
            stmt.executeUpdate();
        }
        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Produk ditambahkan ke wishlist");
        return hasil;
    }

    public Map<String, Object> hapus(int idPembeli, int idProduk) throws SQLException {
        String sql = "DELETE FROM wishlist WHERE id_pembeli = ? AND id_produk = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idPembeli);
            stmt.setInt(2, idProduk);
            stmt.executeUpdate();
        }
        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Produk dihapus dari wishlist");
        return hasil;
    }
}
