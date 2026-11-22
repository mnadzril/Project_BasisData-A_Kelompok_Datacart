package com.ecommerce.controllers;

import com.ecommerce.config.DatabaseConfig;
import com.ecommerce.http.HttpUtil;
import com.google.gson.JsonArray;
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
import java.util.Set;

public class OrderController {

    private static final Set<String> STATUS_VALID = Set.of(
            "Menunggu Pembayaran", "Diproses", "Dikemas",
            "Dalam Perjalanan", "Diterima", "Dibatalkan");

    public Map<String, Object> checkout(JsonObject data) throws SQLException {
        int idPembeli = HttpUtil.angka(data, "id_pembeli", 0);
        if (idPembeli <= 0) {
            throw new IllegalArgumentException("id_pembeli wajib diisi");
        }

        JsonArray itemsJson = data.has("items") && data.get("items").isJsonArray()
                ? data.getAsJsonArray("items") : new JsonArray();
        if (itemsJson.size() == 0) {
            throw new IllegalArgumentException("Keranjang kosong, tidak ada yang di-checkout");
        }

        double ongkir = HttpUtil.desimal(data, "ongkir", 0);
        double biayaLayanan = HttpUtil.desimal(data, "biaya_layanan", 0);

        double diskon = HttpUtil.desimal(data, "diskon", 0);
        if (diskon < 0) diskon = 0;

        List<Integer> idProdukList = new ArrayList<>();
        List<Integer> jumlahList = new ArrayList<>();
        for (int i = 0; i < itemsJson.size(); i++) {
            JsonObject item = itemsJson.get(i).getAsJsonObject();
            int idProduk = HttpUtil.angka(item, "id_produk", 0);
            int jumlah = HttpUtil.angka(item, "jumlah", 0);
            if (idProduk <= 0 || jumlah <= 0) {
                throw new IllegalArgumentException("Setiap item wajib punya id_produk dan jumlah > 0");
            }
            idProdukList.add(idProduk);
            jumlahList.add(jumlah);
        }

        double subtotal = 0;

        Connection conn = null;
        try {
            conn = DatabaseConfig.getConnection();
            conn.setAutoCommit(false);

            double[] hargaList = new double[idProdukList.size()];
            for (int i = 0; i < idProdukList.size(); i++) {
                try (PreparedStatement stmt = conn.prepareStatement(
                        "SELECT nama_produk, harga, stok FROM produk WHERE id = ?")) {
                    stmt.setInt(1, idProdukList.get(i));
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (!rs.next()) {
                            throw new IllegalArgumentException("Produk id " + idProdukList.get(i) + " tidak ditemukan");
                        }
                        if (rs.getInt("stok") < jumlahList.get(i)) {
                            throw new IllegalArgumentException(
                                    "Stok \"" + rs.getString("nama_produk") + "\" tidak mencukupi (sisa " + rs.getInt("stok") + ")");
                        }
                        hargaList[i] = rs.getDouble("harga");
                        subtotal += hargaList[i] * jumlahList.get(i);
                    }
                }
            }
            double batas = subtotal + ongkir + biayaLayanan;
            if (diskon > batas) diskon = batas;
            double total = batas - diskon;

            int idPesanan;
            String sqlPesanan = "INSERT INTO pesanan "
                    + "(id_pembeli, status, subtotal, ongkir, biaya_layanan, total_harga, tgl_pesanan) "
                    + "VALUES (?, 'Menunggu Pembayaran', ?, ?, ?, ?, NOW())";
            try (PreparedStatement stmt = conn.prepareStatement(sqlPesanan, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setInt(1, idPembeli);
                stmt.setDouble(2, subtotal);
                stmt.setDouble(3, ongkir);
                stmt.setDouble(4, biayaLayanan);
                stmt.setDouble(5, total);
                stmt.executeUpdate();
                try (ResultSet kunci = stmt.getGeneratedKeys()) {
                    if (kunci.next()) idPesanan = kunci.getInt(1);
                    else throw new SQLException("Gagal membuat id pesanan");
                }
            }

            String sqlDetail = "INSERT INTO detail_pesanan (id_pesanan, id_produk, jumlah, harga_saat_beli) VALUES (?, ?, ?, ?)";
            String sqlStok = "UPDATE produk SET stok = stok - ? WHERE id = ? AND stok >= ?";
            for (int i = 0; i < idProdukList.size(); i++) {
                try (PreparedStatement stmtDetail = conn.prepareStatement(sqlDetail)) {
                    stmtDetail.setInt(1, idPesanan);
                    stmtDetail.setInt(2, idProdukList.get(i));
                    stmtDetail.setInt(3, jumlahList.get(i));
                    stmtDetail.setDouble(4, hargaList[i]);
                    stmtDetail.executeUpdate();
                }
                try (PreparedStatement stmtStok = conn.prepareStatement(sqlStok)) {
                    stmtStok.setInt(1, jumlahList.get(i));
                    stmtStok.setInt(2, idProdukList.get(i));
                    stmtStok.setInt(3, jumlahList.get(i));
                    if (stmtStok.executeUpdate() == 0) {
                        throw new IllegalArgumentException("Stok produk berubah, transaksi dibatalkan. Coba lagi.");
                    }
                }
            }

            String sqlKosongkan = "DELETE FROM keranjang WHERE id_pembeli = ? AND id_produk = ?";
            for (int i = 0; i < idProdukList.size(); i++) {
                try (PreparedStatement stmtKosong = conn.prepareStatement(sqlKosongkan)) {
                    stmtKosong.setInt(1, idPembeli);
                    stmtKosong.setInt(2, idProdukList.get(i));
                    stmtKosong.executeUpdate();
                }
            }

            conn.commit();

            Map<String, Object> hasil = new LinkedHashMap<>();
            hasil.put("pesan", "Checkout berhasil");
            hasil.put("id_pesanan", idPesanan);
            hasil.put("subtotal", subtotal);
            hasil.put("ongkir", ongkir);
            hasil.put("biaya_layanan", biayaLayanan);
            hasil.put("diskon", diskon);
            hasil.put("total", total);
            return hasil;

        } catch (Exception e) {
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException diabaikan) { }
            }
            if (e instanceof SQLException) throw (SQLException) e;
            if (e instanceof IllegalArgumentException) throw (IllegalArgumentException) e;
            throw new SQLException("Checkout gagal: " + e.getMessage(), e);
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException diabaikan) { }
            }
        }
    }

    public List<Map<String, Object>> riwayatPembeli(int idPembeli) throws SQLException {
        String sql = "SELECT ps.*, pb.nama AS nama_pembeli "
                   + "FROM pesanan ps JOIN pembeli pb ON pb.id = ps.id_pembeli "
                   + "WHERE ps.id_pembeli = ? ORDER BY ps.id DESC";
        return ambilDaftarPesanan(sql, idPembeli);
    }

    public List<Map<String, Object>> pesananPenjual(int idPenjual) throws SQLException {
        String sql = "SELECT DISTINCT ps.*, pb.nama AS nama_pembeli "
                   + "FROM pesanan ps "
                   + "JOIN pembeli pb ON pb.id = ps.id_pembeli "
                   + "JOIN detail_pesanan dp ON dp.id_pesanan = ps.id "
                   + "JOIN produk pk ON pk.id = dp.id_produk "
                   + "WHERE pk.id_penjual = ? ORDER BY ps.id DESC";
        return ambilDaftarPesanan(sql, idPenjual);
    }

    public Map<String, Object> detail(int id) throws SQLException {
        Map<String, Object> pesanan = null;
        String sql = "SELECT ps.*, pb.nama AS nama_pembeli "
                   + "FROM pesanan ps JOIN pembeli pb ON pb.id = ps.id_pembeli "
                   + "WHERE ps.id = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    pesanan = petakanPesanan(rs);
                }
            }
        }
        if (pesanan == null) {
            throw new IllegalArgumentException("Pesanan dengan id " + id + " tidak ditemukan");
        }

        List<Map<String, Object>> items = new ArrayList<>();
        String sqlItem = "SELECT dp.id_produk, dp.jumlah, dp.harga_saat_beli, "
                       + "(dp.jumlah * dp.harga_saat_beli) AS subtotal, "
                       + "pk.nama_produk, pk.foto_produk "
                       + "FROM detail_pesanan dp JOIN produk pk ON pk.id = dp.id_produk "
                       + "WHERE dp.id_pesanan = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlItem)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id_produk", rs.getInt("id_produk"));
                    item.put("nama_produk", rs.getString("nama_produk"));
                    item.put("foto_produk", rs.getString("foto_produk"));
                    item.put("jumlah", rs.getInt("jumlah"));
                    item.put("harga_saat_beli", rs.getDouble("harga_saat_beli"));
                    item.put("subtotal", rs.getDouble("subtotal"));
                    items.add(item);
                }
            }
        }
        pesanan.put("items", items);

        String sqlBayar = "SELECT * FROM pembayaran WHERE id_pesanan = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sqlBayar)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Map<String, Object> bayar = new LinkedHashMap<>();
                    bayar.put("metode_bayar", rs.getString("metode_bayar"));
                    bayar.put("tgl_bayar", HttpUtil.tanggal(rs.getTimestamp("tgl_bayar")));
                    bayar.put("jumlah_bayar", rs.getDouble("jumlah_bayar"));
                    pesanan.put("pembayaran", bayar);
                }
            }
        }
        return pesanan;
    }

    public Map<String, Object> ubahStatus(int id, JsonObject data) throws SQLException {
        String status = HttpUtil.str(data, "status", "").trim();
        if (!STATUS_VALID.contains(status)) {
            throw new IllegalArgumentException("Status tidak valid. Pilihan: " + STATUS_VALID);
        }
        Integer idAdmin = data.has("id_admin") && !data.get("id_admin").isJsonNull()
                ? data.get("id_admin").getAsInt() : null;

        String sql = (idAdmin != null)
                ? "UPDATE pesanan SET status = ?, id_admin = ? WHERE id = ?"
                : "UPDATE pesanan SET status = ? WHERE id = ?";
        int baris;
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            if (idAdmin != null) {
                stmt.setInt(2, idAdmin);
                stmt.setInt(3, id);
            } else {
                stmt.setInt(2, id);
            }
            baris = stmt.executeUpdate();
        }
        if (baris == 0) {
            throw new IllegalArgumentException("Pesanan dengan id " + id + " tidak ditemukan");
        }
        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Status pesanan menjadi \"" + status + "\"");
        return hasil;
    }

    public Map<String, Object> verifikasiAdmin(int id, JsonObject data) throws SQLException {
        int idAdmin = HttpUtil.angka(data, "id_admin", 0);
        if (idAdmin <= 0) {
            throw new IllegalArgumentException("id_admin wajib diisi");
        }
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT nama_admin FROM admin WHERE id = ?")) {
            stmt.setInt(1, idAdmin);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    throw new IllegalArgumentException("Admin dengan id " + idAdmin + " tidak ditemukan");
                }
            }
        }

        String sql = "UPDATE pesanan SET id_admin = ?, status = 'Diproses' WHERE id = ?";
        int baris;
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idAdmin);
            stmt.setInt(2, id);
            baris = stmt.executeUpdate();
        }
        if (baris == 0) {
            throw new IllegalArgumentException("Pesanan dengan id " + id + " tidak ditemukan");
        }
        Map<String, Object> hasil = new LinkedHashMap<>();
        hasil.put("pesan", "Pesanan diverifikasi admin dan kini berstatus Diproses");
        return hasil;
    }

    private List<Map<String, Object>> ambilDaftarPesanan(String sql, int parameter) throws SQLException {
        List<Map<String, Object>> daftar = new ArrayList<>();
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, parameter);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    daftar.add(petakanPesanan(rs));
                }
            }
        }
        return daftar;
    }

    private Map<String, Object> petakanPesanan(ResultSet rs) throws SQLException {
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("id_pesanan", rs.getInt("id"));
        p.put("tgl_pesanan", HttpUtil.tanggal(rs.getTimestamp("tgl_pesanan")));
        p.put("status", rs.getString("status"));
        p.put("subtotal", rs.getDouble("subtotal"));
        p.put("ongkir", rs.getDouble("ongkir"));
        p.put("biaya_layanan", rs.getDouble("biaya_layanan"));
        p.put("total_harga", rs.getDouble("total_harga"));
        p.put("id_pembeli", rs.getInt("id_pembeli"));
        p.put("nama_pembeli", rs.getString("nama_pembeli"));
        int idAdmin = rs.getInt("id_admin");
        p.put("id_admin", rs.wasNull() ? null : idAdmin);
        return p;
    }
}
