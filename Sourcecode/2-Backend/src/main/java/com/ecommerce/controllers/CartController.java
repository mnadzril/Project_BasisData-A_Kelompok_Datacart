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

public class CartController {

    public Map<String, Object> tambah(JsonObject data) throws SQLException {
        int idPembeli = HttpUtil.angka(data, "id_pembeli", 0);
        int idProduk  = HttpUtil.angka(data, "id_produk", 0);
        int jumlah    = HttpUtil.angka(data, "jumlah", 1);

        if (idPembeli <= 0 || idProduk <= 0) {
            throw new IllegalArgumentException("id_pembeli dan id_produk wajib diisi");
        }
        if (jumlah <= 0) {
            jumlah = 1;
        }

        int stokTersedia;
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT stok FROM produk WHERE id = ?")) {
            stmt.setInt(1, idProduk);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new IllegalArgumentException("Produk tidak ditemukan");
                }
                stokTersedia = rs.getInt("stok");
            }
        }
        if (stokTersedia <= 0) {
            throw new IllegalArgumentException("Stok produk habis");
        }

        String sqlCek = "SELECT jumlah FROM keranjang WHERE id_pembeli = ? AND id_produk = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmtCek = conn.prepareStatement(sqlCek)) {
            stmtCek.setInt(1, idPembeli);
            stmtCek.setInt(2, idProduk);
            try (ResultSet rs = stmtCek.executeQuery()) {
                if (rs.next()) {
                    int jumlahBaru = Math.min(rs.getInt("jumlah") + jumlah, stokTersedia);
                    try (PreparedStatement stmtUbah = conn.prepareStatement(
                            "UPDATE keranjang SET jumlah = ? WHERE id_pembeli = ? AND id_produk = ?")) {
                        stmtUbah.setInt(1, jumlahBaru);
                        stmtUbah.setInt(2, idPembeli);
                        stmtUbah.setInt(3, idProduk);
                        stmtUbah.executeUpdate();
                    }
                } else {
                    try (PreparedStatement stmtTambah = conn.prepareStatement(
                            "INSERT INTO keranjang (id_pembeli, id_produk, jumlah) VALUES (?, ?, ?)")) {
                        stmtTambah.setInt(1, idPembeli);
                        stmtTambah.setInt(2, idProduk);
                        stmtTambah.setInt(3, Math.min(jumlah, stokTersedia));
                        stmtTambah.executeUpdate();
                    }
                }
            }
        }

        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Produk berhasil ditambahkan ke keranjang");
        return hasil;
    }

    public Map<String, Object> lihat(int idPembeli) throws SQLException {
        String sql = "SELECT k.id_produk, p.nama_produk, p.harga, p.foto_produk, p.stok, k.jumlah, "
                   + "(p.harga * k.jumlah) AS subtotal "
                   + "FROM keranjang k JOIN produk p ON p.id = k.id_produk "
                   + "WHERE k.id_pembeli = ? ORDER BY k.id_produk";

        List<Map<String, Object>> items = new ArrayList<>();
        double total = 0;
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
                    item.put("jumlah", rs.getInt("jumlah"));
                    item.put("subtotal", rs.getDouble("subtotal"));
                    items.add(item);
                    total += rs.getDouble("subtotal");
                }
            }
        }

        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("items", items);
        hasil.put("total", total);
        return hasil;
    }

    public Map<String, Object> ubahJumlah(int idPembeli, int idProduk, JsonObject data) throws SQLException {
        int jumlah = HttpUtil.angka(data, "jumlah", -1);
        if (jumlah < 0) {
            throw new IllegalArgumentException("jumlah wajib diisi");
        }
        if (jumlah == 0) {
            return hapusItem(idPembeli, idProduk);
        }
        String sql = "UPDATE keranjang SET jumlah = ? WHERE id_pembeli = ? AND id_produk = ?";
        int baris;
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, jumlah);
            stmt.setInt(2, idPembeli);
            stmt.setInt(3, idProduk);
            baris = stmt.executeUpdate();
        }
        if (baris == 0) {
            throw new IllegalArgumentException("Item tidak ada di keranjang");
        }
        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Jumlah berhasil diperbarui");
        return hasil;
    }

    public Map<String, Object> hapusItem(int idPembeli, int idProduk) throws SQLException {
        String sql = "DELETE FROM keranjang WHERE id_pembeli = ? AND id_produk = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idPembeli);
            stmt.setInt(2, idProduk);
            stmt.executeUpdate();
        }
        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Item dihapus dari keranjang");
        return hasil;
    }

    public Map<String, Object> kosongkan(int idPembeli) throws SQLException {
        String sql = "DELETE FROM keranjang WHERE id_pembeli = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idPembeli);
            stmt.executeUpdate();
        }
        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Keranjang dikosongkan");
        return hasil;
    }
}
