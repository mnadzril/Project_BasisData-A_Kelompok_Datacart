package com.ecommerce.config;
 
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
 
public class DatabaseConfig {
 
    private static final String DEFAULT_URL =
            "jdbc:mysql://localhost:3306/db_ecommerce?useSSL=false&serverTimezone=Asia/Jakarta";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASSWORD = "";
 
    private final String url;
    private final String user;
    private final String password;

    private static DatabaseConfig instance;

    private DatabaseConfig() {
        this.url = ambilKonfigurasi("DB_URL", DEFAULT_URL);
        this.user = ambilKonfigurasi("DB_USER", DEFAULT_USER);
        this.password = ambilKonfigurasi("DB_PASSWORD", DEFAULT_PASSWORD);
    }
 
    public static synchronized DatabaseConfig getInstance() {
        if (instance == null) {
            instance = new DatabaseConfig();
        }
        return instance;
    }
 
    private static String ambilKonfigurasi(String namaVariabel, String nilaiDefault) {
        String nilai = System.getenv(namaVariabel);
        return (nilai == null || nilai.isEmpty()) ? nilaiDefault : nilai;
    }
 
    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }
 
    public boolean testKoneksi() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.out.println("Koneksi database gagal: " + e.getMessage());
            return false;
        }
    }
 
    public String getUrl() { return url; }
    public String getUser() { return user; }
}
 