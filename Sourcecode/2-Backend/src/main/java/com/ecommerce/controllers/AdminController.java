package com.ecommerce.controllers;

import com.ecommerce.config.DatabaseConfig;
import com.ecommerce.http.HttpUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class AdminController {

    public List<Map<String, Object>> daftarAdmin() throws SQLException {
        List<Map<String, Object>> daftar = new ArrayList<>();
        String sql = "SELECT id, nama_admin, shift, email FROM admin ORDER BY id";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> admin = new LinkedHashMap<>();
                admin.put("id", rs.getInt("id"));
                admin.put("nama_admin", rs.getString("nama_admin"));
                admin.put("shift", rs.getString("shift"));
                admin.put("email", rs.getString("email"));
                daftar.add(admin);
            }
        }
        return daftar;
    }

    public List<Map<String, Object>> semuaPesanan() throws SQLException {
        List<Map<String, Object>> daftar = new ArrayList<>();
        String sql = "SELECT ps.id, ps.tgl_pesanan, ps.status, ps.total_harga, "
                   + "pb.nama AS nama_pembeli, ad.nama_admin "
                   + "FROM pesanan ps "
                   + "JOIN pembeli pb ON pb.id = ps.id_pembeli "
                   + "LEFT JOIN admin ad ON ad.id = ps.id_admin "
                   + "ORDER BY ps.id DESC";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> p = new LinkedHashMap<>();
                p.put("id_pesanan", rs.getInt("id"));
                p.put("tgl_pesanan", HttpUtil.tanggal(rs.getTimestamp("tgl_pesanan")));
                p.put("status", rs.getString("status"));
                p.put("total_harga", rs.getDouble("total_harga"));
                p.put("nama_pembeli", rs.getString("nama_pembeli"));
                p.put("nama_admin", rs.getString("nama_admin"));
                daftar.add(p);
            }
        }
        return daftar;
    }
}
