package com.ecommerce.controllers;

import com.ecommerce.config.DatabaseConfig;
import com.ecommerce.http.HttpUtil;
import com.google.gson.JsonObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;

public class PaymentController {

    public Map<String, Object> bayar(JsonObject data) throws SQLException {
        int idPesanan = HttpUtil.angka(data, "id_pesanan", 0);
        String metode = HttpUtil.str(data, "metode_bayar", "").trim();
        double jumlahBayar = HttpUtil.desimal(data, "jumlah_bayar", 0);

        if (idPesanan <= 0) {
            throw new IllegalArgumentException("id_pesanan wajib diisi");
        }
        if (metode.isEmpty()) {
            throw new IllegalArgumentException("metode_bayar wajib diisi (mis. QRIS, Transfer Bank, COD)");
        }
        if (jumlahBayar <= 0) {
            throw new IllegalArgumentException("jumlah_bayar harus lebih dari 0");
        }

        Connection conn = null;
        try {
            conn = DatabaseConfig.getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement stmt = conn.prepareStatement(
                    "SELECT total_harga FROM pesanan WHERE id = ?")) {
                stmt.setInt(1, idPesanan);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (!rs.next()) {
                        throw new IllegalArgumentException("Pesanan dengan id " + idPesanan + " tidak ditemukan");
                    }
                }
            }
            try (PreparedStatement stmt = conn.prepareStatement(
                    "SELECT id FROM pembayaran WHERE id_pesanan = ?")) {
                stmt.setInt(1, idPesanan);
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        throw new IllegalArgumentException("Pesanan ini sudah dibayar sebelumnya");
                    }
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(
                    "INSERT INTO pembayaran (id_pesanan, metode_bayar, tgl_bayar, jumlah_bayar) "
                    + "VALUES (?, ?, NOW(), ?)")) {
                stmt.setInt(1, idPesanan);
                stmt.setString(2, metode);
                stmt.setDouble(3, jumlahBayar);
                stmt.executeUpdate();
            }

            try (PreparedStatement stmt = conn.prepareStatement(
                    "UPDATE pesanan SET status = 'Diproses' WHERE id = ?")) {
                stmt.setInt(1, idPesanan);
                stmt.executeUpdate();
            }

            conn.commit();

            Map<String, Object> hasil = new LinkedHashMap<>();
            hasil.put("pesan", "Pembayaran berhasil. Pesanan kini berstatus Diproses.");
            return hasil;

        } catch (Exception e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException diabaikan) { }
            }
            if (e instanceof SQLException) throw (SQLException) e;
            if (e instanceof IllegalArgumentException) throw (IllegalArgumentException) e;
            throw new SQLException("Pembayaran gagal: " + e.getMessage(), e);
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException diabaikan) { }
            }
        }
    }

    public Map<String, Object> lihatPembayaran(int idPesanan) throws SQLException {
        String sql = "SELECT * FROM pembayaran WHERE id_pesanan = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idPesanan);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Map<String, Object> hasil = new LinkedHashMap<>();
                    hasil.put("id_pembayaran", rs.getInt("id"));
                    hasil.put("id_pesanan", rs.getInt("id_pesanan"));
                    hasil.put("metode_bayar", rs.getString("metode_bayar"));
                    hasil.put("tgl_bayar", HttpUtil.tanggal(rs.getTimestamp("tgl_bayar")));
                    hasil.put("jumlah_bayar", rs.getDouble("jumlah_bayar"));
                    return hasil;
                }
            }
        }
        throw new IllegalArgumentException("Belum ada pembayaran untuk pesanan ini");
    }
}
