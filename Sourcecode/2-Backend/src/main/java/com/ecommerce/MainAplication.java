package com.ecommerce;
 
import com.ecommerce.config.DatabaseConfig;
import com.ecommerce.controllers.AuthController;
import com.ecommerce.controllers.CartController;
import com.ecommerce.controllers.OrderController;
import com.ecommerce.controllers.ProductController;
import com.ecommerce.models.Pembeli;
import com.ecommerce.models.Pengguna;
import com.ecommerce.models.Produk;
 
import java.util.List;
import java.util.Scanner;
 
public class MainAplication {
 
    private static final Scanner input = new Scanner(System.in);
 
    private static final AuthController authController = new AuthController();
    private static final ProductController productController = new ProductController();
    private static final CartController cartController = new CartController();
    private static final OrderController orderController = new OrderController();
 
    private static int idPenggunaBerikutnya = 1;
    private static int idPesananBerikutnya = 1;
    private static int idProdukBerikutnya = 1;
 
    private static Pengguna penggunaAktif = null;
 
    public static void main(String[] args) {
        System.out.println("=====================================");
        System.out.println("      APLIKASI E-COMMERCE (CLI)      ");
        System.out.println("=====================================");
 
        if (DatabaseConfig.getInstance().testKoneksi()) {
            System.out.println("Database terhubung.");
        } else {
            System.out.println("Berjalan dalam mode simulasi (data disimpan di memori).");
        }
 
        isiDataAwal();
        menuUtama();
 
        System.out.println("Terima kasih telah menggunakan aplikasi ini!");
    }
 
    private static void isiDataAwal() {
        int idPenjualContoh = 1000;
        productController.tambahProduk(idProdukBerikutnya++, "Keyboard Mekanikal", 450000, 10,
                "Keyboard mekanikal switch biru", "keyboard.jpg", idPenjualContoh);
        productController.tambahProduk(idProdukBerikutnya++, "Mouse Wireless", 150000, 25,
                "Mouse wireless 2.4GHz", "mouse.jpg", idPenjualContoh);
        productController.tambahProduk(idProdukBerikutnya++, "Headset Gaming", 300000, 5,
                "Headset dengan mikrofon", "headset.jpg", idPenjualContoh);
        System.out.println();
    }
 
    private static void menuUtama() {
        boolean berjalan = true;
        while (berjalan) {
            System.out.println("\n--- MENU UTAMA ---");
            System.out.println("1. Daftar (Pembeli)");
            System.out.println("2. Login");
            System.out.println("0. Keluar");
            int pilihan = bacaInt("Pilih menu: ");
 
            switch (pilihan) {
                case 1:
                    daftarPembeli();
                    break;
                case 2:
                    login();
                    break;
                case 0:
                    berjalan = false;
                    break;
                default:
                    System.out.println("Pilihan tidak valid!");
            }
        }
    }
 
    private static void daftarPembeli() {
        System.out.println("\n--- DAFTAR PEMBELI ---");
        String nama = bacaString("Nama          : ");
        String email = bacaString("Email         : ");
        String password = bacaString("Password      : ");
        String noTelepon = bacaString("No. Telepon   : ");
        String alamat = bacaString("Alamat        : ");
 
        boolean berhasil = authController.registerPembeli(
                idPenggunaBerikutnya, nama, email, password, noTelepon, alamat);
 
        if (berhasil) {
            idPenggunaBerikutnya++;
        }
    }
 
    private static void login() {
        System.out.println("\n--- LOGIN ---");
        String email = bacaString("Email    : ");
        String password = bacaString("Password : ");
 
        Pengguna hasil = authController.login(email, password);
        if (hasil == null) {
            return;
        }
 
        penggunaAktif = hasil;
        if (penggunaAktif instanceof Pembeli) {
            menuPembeli();
        } else {
            System.out.println("Menu untuk peran ini belum tersedia.");
            penggunaAktif = null;
        }
    }
 
    private static void menuPembeli() {
        boolean login = true;
        while (login) {
            System.out.println("\n--- MENU PEMBELI (" + penggunaAktif.getNama() + ") ---");
            System.out.println("1. Lihat Semua Produk");
            System.out.println("2. Tambah Produk ke Keranjang");
            System.out.println("3. Lihat Isi Keranjang");
            System.out.println("4. Beli Produk (Checkout)");
            System.out.println("0. Logout");
            int pilihan = bacaInt("Pilih menu: ");
 
            switch (pilihan) {
                case 1:
                    tampilkanSemuaProduk();
                    break;
                case 2:
                    tambahKeKeranjang();
                    break;
                case 3:
                    cartController.lihatIsiKeranjang();
                    break;
                case 4:
                    checkout();
                    break;
                case 0:
                    System.out.println("Logout berhasil.");
                    penggunaAktif = null;
                    login = false;
                    break;
                default:
                    System.out.println("Pilihan tidak valid!");
            }
        }
    }
 
    private static void tampilkanSemuaProduk() {
        List<Produk> daftar = productController.lihatSemuaProduk();
        System.out.println("\n--- DAFTAR PRODUK ---");
        if (daftar.isEmpty()) {
            System.out.println("Belum ada produk.");
            return;
        }
        for (Produk p : daftar) {
            System.out.println("[" + p.getId() + "] " + p.getNamaProduk()
                    + " | Rp" + String.format("%.0f", p.getHarga())
                    + " | Stok: " + p.getStok());
            System.out.println("     " + p.getDeskripsi());
        }
    }
 
    private static void tambahKeKeranjang() {
        tampilkanSemuaProduk();
        int idProduk = bacaInt("Masukkan ID produk: ");
        Produk produk = cariProdukById(idProduk);
 
        if (produk == null) {
            System.out.println("Produk tidak ditemukan!");
        } else if (produk.getStok() <= 0) {
            System.out.println("Maaf, stok produk habis!");
        } else {
            cartController.tambahKeKeranjang(produk);
        }
    }
 
    private static void checkout() {
        tampilkanSemuaProduk();
        int idProduk = bacaInt("Masukkan ID produk yang dibeli: ");
        Produk produk = cariProdukById(idProduk);
 
        if (produk == null) {
            System.out.println("Produk tidak ditemukan!");
            return;
        }
 
        int jumlah = bacaInt("Jumlah beli: ");
        if (jumlah <= 0) {
            System.out.println("Jumlah harus lebih dari 0!");
            return;
        }
 
        boolean berhasil = orderController.buatPesanan(
                idPesananBerikutnya, penggunaAktif.getId(), produk, jumlah);
        if (berhasil) {
            idPesananBerikutnya++;
        }
    }
 
    private static Produk cariProdukById(int id) {
        for (Produk p : productController.lihatSemuaProduk()) {
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }
 
    private static String bacaString(String pesan) {
        System.out.print(pesan);
        return input.nextLine().trim();
    }
 
    private static int bacaInt(String pesan) {
        while (true) {
            System.out.print(pesan);
            try {
                return Integer.parseInt(input.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("Input harus berupa angka!");
            }
        }
    }
}
 
