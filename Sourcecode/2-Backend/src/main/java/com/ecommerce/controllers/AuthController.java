package com.ecommerce.controllers;

import com.ecommerce.config.DatabaseConfig;
import com.ecommerce.http.HttpUtil;
import com.ecommerce.util.PasswordUtil;
import com.google.gson.JsonObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;

public class AuthController {

    public Map<String, Object> register(JsonObject data) throws SQLException {
        String nama     = HttpUtil.str(data, "nama", "").trim();
        String email    = HttpUtil.str(data, "email", "").trim().toLowerCase();
        String password = HttpUtil.str(data, "password", "").trim();
        String noTelp   = HttpUtil.str(data, "no_telepon", "").trim();
        String alamat   = HttpUtil.str(data, "alamat", "").trim();

        if (nama.isEmpty() || email.isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("Nama, email, dan password wajib diisi");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Format email tidak valid");
        }
        if (password.length() < 6) {
            throw new IllegalArgumentException("Password minimal 6 karakter");
        }

        String sql = "INSERT INTO pembeli (nama, email, password, no_telepon, alamat_pengiriman) "
                   + "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, nama);
            stmt.setString(2, email);
            stmt.setString(3, PasswordUtil.hash(password));
            stmt.setString(4, noTelp);
            stmt.setString(5, alamat);
            stmt.executeUpdate();
        }

        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Registrasi berhasil. Silakan login.");
        return hasil;
    }

    public Map<String, Object> ubahProfil(JsonObject data) throws SQLException {
        int id = HttpUtil.angka(data, "id", 0);
        if (id <= 0) {
            throw new IllegalArgumentException("id wajib diisi");
        }

        Map<String, Object> lama = new LinkedHashMap<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "SELECT * FROM pembeli WHERE id = ?")) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new IllegalArgumentException("Pembeli dengan id " + id + " tidak ditemukan");
                }
                lama.put("nama", rs.getString("nama"));
                lama.put("no_telepon", rs.getString("no_telepon"));
                lama.put("alamat", rs.getString("alamat_pengiriman"));
            }
        }

        String nama    = HttpUtil.str(data, "nama", (String) lama.get("nama")).trim();
        String noTelp = HttpUtil.str(data, "no_telepon", (String) lama.get("no_telepon")).trim();
        String alamat  = HttpUtil.str(data, "alamat", (String) lama.get("alamat")).trim();
        if (nama.isEmpty()) {
            throw new IllegalArgumentException("Nama tidak boleh kosong");
        }

        String sql = "UPDATE pembeli SET nama = ?, no_telepon = ?, alamat_pengiriman = ? WHERE id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, nama);
            stmt.setString(2, noTelp);
            stmt.setString(3, alamat);
            stmt.setInt(4, id);
            stmt.executeUpdate();
        }

        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Profil berhasil diperbarui");
        hasil.put("nama", nama);
        hasil.put("no_telepon", noTelp);
        hasil.put("alamat", alamat);
        return hasil;
    }

    public Map<String, Object> lupaPassword(JsonObject data) throws SQLException {
        String email    = HttpUtil.str(data, "email", "").trim().toLowerCase();
        String password = HttpUtil.str(data, "password_baru", "").trim();

        if (email.isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("Email dan password baru wajib diisi");
        }
        if (password.length() < 6) {
            throw new IllegalArgumentException("Password baru minimal 6 karakter");
        }

        String hash = PasswordUtil.hash(password);

        for (String tabel : new String[] { "pembeli", "penjual", "admin" }) {
            String sql = "UPDATE " + tabel + " SET password = ? WHERE email = ?";
            try (Connection conn = DatabaseConfig.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, hash);
                stmt.setString(2, email);
                if (stmt.executeUpdate() > 0) {
                    Map<String, Object> hasil = new LinkedHashMap<>();
                    hasil.put("pesan",
                            "Password akun " + email + " berhasil diatur ulang. Silakan login kembali.");
                    return hasil;
                }
            }
        }

        throw new IllegalArgumentException("Email " + email + " tidak terdaftar");
    }

    public Map<String, Object> login(JsonObject data) throws SQLException {
        String email    = HttpUtil.str(data, "email", "").trim().toLowerCase();
        String password = HttpUtil.str(data, "password", "").trim();

        if (email.isEmpty() || password.isEmpty()) {
            throw new IllegalArgumentException("Email dan password wajib diisi");
        }

        String hash = PasswordUtil.hash(password);

        String sqlPembeli = "SELECT * FROM pembeli WHERE email = ? AND password = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlPembeli)) {
            stmt.setString(1, email);
            stmt.setString(2, hash);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Map<String, Object> user = new LinkedHashMap<>();
                    user.put("id", rs.getInt("id"));
                    user.put("nama", rs.getString("nama"));
                    user.put("email", rs.getString("email"));
                    user.put("no_telepon", rs.getString("no_telepon"));
                    user.put("alamat", rs.getString("alamat_pengiriman"));
                    user.put("role", "pembeli");
                    return user;
                }
            }
        }

        String sqlPenjual = "SELECT * FROM penjual WHERE email = ? AND password = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlPenjual)) {
            stmt.setString(1, email);
            stmt.setString(2, hash);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Map<String, Object> user = new LinkedHashMap<>();
                    user.put("id", rs.getInt("id"));
                    user.put("nama", rs.getString("nama"));
                    user.put("email", rs.getString("email"));
                    user.put("nama_toko", rs.getString("nama_toko"));
                    user.put("role", "penjual");
                    return user;
                }
            }
        }

        String sqlAdmin = "SELECT * FROM admin WHERE email = ? AND password = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlAdmin)) {
            stmt.setString(1, email);
            stmt.setString(2, hash);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Map<String, Object> user = new LinkedHashMap<>();
                    user.put("id", rs.getInt("id"));
                    user.put("nama", rs.getString("nama_admin"));
                    user.put("email", rs.getString("email"));
                    user.put("shift", rs.getString("shift"));
                    user.put("role", "admin");
                    return user;
                }
            }
        }

        throw new IllegalArgumentException("Email atau password salah");
    }
}
