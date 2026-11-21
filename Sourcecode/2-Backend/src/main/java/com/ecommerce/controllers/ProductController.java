package com.ecommerce.controllers;

import com.ecommerce.config.DatabaseConfig;
import com.ecommerce.http.HttpUtil;
import com.ecommerce.models.Produk;
import com.google.gson.JsonObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class ProductController {

    public List<Produk> daftarProduk(String cari, String kategori) throws SQLException {
        StringBuilder sql = new StringBuilder("SELECT * FROM produk WHERE 1 = 1");
        List<String> params = new ArrayList<>();

        if (cari != null && !cari.trim().isEmpty()) {
            sql.append(" AND (nama_produk LIKE ? OR deskripsi LIKE ? OR kategori LIKE ?)");
            String kata = "%" + cari.trim() + "%";
            params.add(kata);
            params.add(kata);
            params.add(kata);
        }
        if (kategori != null && !kategori.trim().isEmpty()) {
            sql.append(" AND kategori = ?");
            params.add(kategori.trim());
        }
        sql.append(" ORDER BY id DESC");

        List<Produk> daftar = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                stmt.setString(i + 1, params.get(i));
            }
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    daftar.add(petakanBaris(rs));
                }
            }
        }
        return daftar;
    }

    public Produk cariProduk(int id) throws SQLException {
        String sql = "SELECT * FROM produk WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return petakanBaris(rs);
                }
            }
        }
        throw new IllegalArgumentException("Produk dengan id " + id + " tidak ditemukan");
    }

    public List<String> daftarKategori() throws SQLException {
        List<String> daftar = new ArrayList<>();
        String sql = "SELECT DISTINCT kategori FROM produk "
                   + "WHERE kategori IS NOT NULL AND kategori <> '' ORDER BY kategori";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                daftar.add(rs.getString("kategori"));
            }
        }
        return daftar;
    }

    public Map<String, Object> tambahProduk(JsonObject data) throws SQLException {
        String nama = HttpUtil.str(data, "nama_produk", "").trim();
        if (nama.isEmpty()) {
            throw new IllegalArgumentException("nama_produk wajib diisi");
        }
        int idPenjual = HttpUtil.angka(data, "id_penjual", 0);
        if (idPenjual <= 0) {
            throw new IllegalArgumentException("id_penjual wajib diisi");
        }

        String sql = "INSERT INTO produk (nama_produk, harga, stok, kategori, deskripsi, foto_produk, id_penjual) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            isiParameterProduk(stmt, data, nama);
            stmt.executeUpdate();

            int idBaru = 0;
            try (ResultSet kunci = stmt.getGeneratedKeys()) {
                if (kunci.next()) idBaru = kunci.getInt(1);
            }
            Map<String, Object> hasil = new LinkedHashMap<>();
            hasil.put("pesan", "Produk berhasil ditambahkan");
            hasil.put("id_produk", idBaru);
            return hasil;
        }
    }

    public Map<String, Object> ubahProduk(int id, JsonObject data) throws SQLException {
        cariProduk(id);

        StringBuilder sql = new StringBuilder("UPDATE produk SET ");
        List<String> kolom = new ArrayList<>();
        List<String> nilai = new ArrayList<>();

        if (data.has("nama_produk")) { kolom.add("nama_produk = ?"); nilai.add(data.get("nama_produk").getAsString()); }
        if (data.has("harga"))       { kolom.add("harga = ?");       nilai.add(String.valueOf(data.get("harga").getAsDouble())); }
        if (data.has("stok"))        { kolom.add("stok = ?");        nilai.add(String.valueOf(data.get("stok").getAsInt())); }
        if (data.has("kategori"))    { kolom.add("kategori = ?");    nilai.add(data.get("kategori").getAsString()); }
        if (data.has("deskripsi"))   { kolom.add("deskripsi = ?");   nilai.add(data.get("deskripsi").getAsString()); }
        if (data.has("foto_produk")) { kolom.add("foto_produk = ?"); nilai.add(data.get("foto_produk").getAsString()); }
        if (data.has("id_penjual"))  { kolom.add("id_penjual = ?");  nilai.add(String.valueOf(data.get("id_penjual").getAsInt())); }

        if (kolom.isEmpty()) {
            throw new IllegalArgumentException("Tidak ada kolom yang diubah");
        }

        sql.append(String.join(", ", kolom)).append(" WHERE id = ?");

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < nilai.size(); i++) {
                stmt.setString(i + 1, nilai.get(i));
            }
            stmt.setInt(nilai.size() + 1, id);
            stmt.executeUpdate();
        }

        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Produk berhasil diubah");
        return hasil;
    }

    public Map<String, Object> hapusProduk(int id) throws SQLException {
        String sql = "DELETE FROM produk WHERE id = ?";
        int baris;
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            baris = stmt.executeUpdate();
        }
        if (baris == 0) {
            throw new IllegalArgumentException("Produk dengan id " + id + " tidak ditemukan");
        }
        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Produk berhasil dihapus");
        return hasil;
    }

    private void isiParameterProduk(PreparedStatement stmt, JsonObject data, String nama) throws SQLException {
        stmt.setString(1, nama);
        stmt.setDouble(2, HttpUtil.desimal(data, "harga", 0));
        stmt.setInt(3, HttpUtil.angka(data, "stok", 0));
        stmt.setString(4, HttpUtil.str(data, "kategori", ""));
        stmt.setString(5, HttpUtil.str(data, "deskripsi", ""));
        stmt.setString(6, HttpUtil.str(data, "foto_produk", ""));
        stmt.setInt(7, HttpUtil.angka(data, "id_penjual", 0));
    }

    private Produk petakanBaris(ResultSet rs) throws SQLException {
        return new Produk(
                rs.getInt("id"),
                rs.getString("nama_produk"),
                rs.getDouble("harga"),
                rs.getInt("stok"),
                rs.getString("kategori"),
                rs.getString("deskripsi"),
                rs.getString("foto_produk"),
                rs.getInt("id_penjual")
        );
    }
}
