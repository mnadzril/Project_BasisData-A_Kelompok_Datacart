package com.ecommerce.controllers;

import com.ecommerce.models.Pesanan;
import com.ecommerce.models.Produk;
import com.ecommerce.config.DatabaseConfig;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class OrderController {

    public boolean buatPesanan(int idPembeli, Produk produk, int jumlahBeli) {
        // Cek stok (asumsi stok dicek dulu sebelum memanggil fungsi ini)
        if (produk.getStok() < jumlahBeli) {
            System.out.println("Stok tidak mencukupi!");
            return false;
        }

        double totalHarga = produk.getHarga() * jumlahBeli;
        String sqlInsertPesanan = "INSERT INTO pesanan (id_pembeli, id_produk, jumlah_beli, total_harga, status_pesanan) VALUES (?, ?, ?, ?, 'Menunggu Pembayaran')";
        String sqlUpdateStok = "UPDATE produk SET stok = stok - ? WHERE id = ?";

        try (Connection conn = DatabaseConfig.getConnection()) {
            // Kita matikan auto-commit agar transaksi aman (kalau satu gagal, semua batal)
            conn.setAutoCommit(false); 

            try (PreparedStatement stmtPesanan = conn.prepareStatement(sqlInsertPesanan);
                 PreparedStatement stmtStok = conn.prepareStatement(sqlUpdateStok)) {
                
                // 1. Simpan Pesanan
                stmtPesanan.setInt(1, idPembeli);
                stmtPesanan.setInt(2, produk.getId());
                stmtPesanan.setInt(3, jumlahBeli);
                stmtPesanan.setDouble(4, totalHarga);
                stmtPesanan.executeUpdate();

                // 2. Kurangi Stok Produk
                stmtStok.setInt(1, jumlahBeli);
                stmtStok.setInt(2, produk.getId());
                stmtStok.executeUpdate();

                // 3. Simpan perubahan ke database
                conn.commit();
                System.out.println("Transaksi Berhasil! Total yang harus dibayar: Rp" + totalHarga);
                return true;
                
            } catch (SQLException ex) {
                conn.rollback(); // Batalkan jika ada error
                System.out.println("Transaksi Gagal, mengembalikan data... " + ex.getMessage());
                return false;
            }
        } catch (SQLException e) {
            System.out.println("Error Koneksi: " + e.getMessage());
            return false;
        }
    }
}