package com.ecommerce;

import com.ecommerce.config.DatabaseConfig;
import com.ecommerce.controllers.AdminController;
import com.ecommerce.controllers.AuthController;
import com.ecommerce.controllers.CartController;
import com.ecommerce.controllers.OrderController;
import com.ecommerce.controllers.PaymentController;
import com.ecommerce.controllers.ProductController;
import com.ecommerce.controllers.WishlistController;
import com.ecommerce.http.HttpUtil;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

public class ApiServer {

    private static final AuthController auth = new AuthController();
    private static final ProductController produk = new ProductController();
    private static final CartController keranjang = new CartController();
    private static final OrderController pesanan = new OrderController();
    private static final PaymentController pembayaran = new PaymentController();
    private static final AdminController admin = new AdminController();
    private static final WishlistController wishlist = new WishlistController();

    private static Path folderStatis;

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        folderStatis = tentukanFolderStatis();

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api", ApiServer::tanganiApi);
        server.createContext("/", ApiServer::tanganiStatis);
        server.setExecutor(Executors.newFixedThreadPool(10));
        server.start();

        System.out.println("==========================================================");
        System.out.println("  SERVER E-COMMERCE DATACART SUDAH BERJALAN");
        System.out.println("  Halaman web : http://localhost:" + port + "/Frame%201/index.html");
        System.out.println("  Contoh API  : http://localhost:" + port + "/api/produk");
        System.out.println("  Folder web  : " + folderStatis);
        System.out.println("==========================================================");
        if (DatabaseConfig.getInstance().testKoneksi()) {
            System.out.println("Database MySQL terhubung.");
        } else {
            System.out.println("PERINGATAN: database belum terhubung!");
            System.out.println("Pastikan MySQL di XAMPP menyala dan db_ecommerce sudah di-import.");
        }
    }

    private static void tanganiApi(HttpExchange ex) throws IOException {
        try {
            if ("OPTIONS".equals(ex.getRequestMethod())) {
                ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
                ex.sendResponseHeaders(204, -1);
                return;
            }

            String path = ex.getRequestURI().getPath();
            String[] seg = path.split("/");
            String metode = ex.getRequestMethod();
            String sumber = seg.length > 2 ? seg[2] : "";

            switch (sumber) {
                case "auth"      -> tanganiAuth(ex, metode, seg);
                case "produk"    -> tanganiProduk(ex, metode, seg);
                case "kategori"  -> {
                    if (!"GET".equals(metode)) {
                        HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
                    } else {
                        HttpUtil.sukses(ex, produk.daftarKategori());
                    }
                }
                case "toko"      -> {
                    if (!"GET".equals(metode)) {
                        HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
                    } else {
                        Map<String, String> q = HttpUtil.bacaQuery(ex);
                        HttpUtil.sukses(ex, produk.daftarToko(q.get("search")));
                    }
                }
                case "keranjang" -> tanganiKeranjang(ex, metode, seg);
                case "pesanan"   -> tanganiPesanan(ex, metode, seg);
                case "pembayaran"-> tanganiPembayaran(ex, metode, seg);
                case "wishlist"  -> tanganiWishlist(ex, metode, seg);
                case "admin"     -> tanganiAdmin(ex, metode, seg);
                default -> HttpUtil.gagal(ex, 404, "Endpoint tidak ditemukan: " + path);
            }

        } catch (IllegalArgumentException e) {
            HttpUtil.gagal(ex, 400, e.getMessage());
        } catch (java.sql.SQLIntegrityConstraintViolationException e) {
            HttpUtil.gagal(ex, 400,
                    "Data tidak valid (duplikat atau referensi tidak ditemukan): " + e.getMessage());
        } catch (java.sql.SQLException e) {
            HttpUtil.gagal(ex, 500, "Kesalahan database: " + e.getMessage());
        } catch (Exception e) {
            HttpUtil.gagal(ex, 500, "Kesalahan server: " + e.getMessage());
        }
    }

    private static void tanganiAuth(HttpExchange ex, String metode, String[] seg) throws Exception {
        String aksi = seg.length > 3 ? seg[3] : "";
        if ("profil".equals(aksi) && "PUT".equals(metode)) {
            HttpUtil.sukses(ex, auth.ubahProfil(HttpUtil.bacaBodyJson(ex)));
            return;
        }
        if (!"POST".equals(metode)) {
            HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
            return;
        }
        JsonObject body = HttpUtil.bacaBodyJson(ex);
        if ("register".equals(aksi)) {
            HttpUtil.sukses(ex, auth.register(body));
        } else if ("login".equals(aksi)) {
            HttpUtil.sukses(ex, auth.login(body));
        } else if ("lupa-password".equals(aksi)) {
            HttpUtil.sukses(ex, auth.lupaPassword(body));
        } else {
            HttpUtil.gagal(ex, 404, "Endpoint tidak ditemukan: /api/auth/" + aksi);
        }
    }

    private static void tanganiProduk(HttpExchange ex, String metode, String[] seg) throws Exception {
        if (seg.length <= 3) {
            switch (metode) {
                case "GET" -> {
                    Map<String, String> q = HttpUtil.bacaQuery(ex);
                    int idToko = 0;
                    String paramToko = q.get("id_toko");
                    if (paramToko != null && !paramToko.isBlank()) {
                        try { idToko = Integer.parseInt(paramToko.trim()); }
                        catch (NumberFormatException e) {
                            throw new IllegalArgumentException("id_toko harus berupa angka");
                        }
                    }
                    HttpUtil.sukses(ex, produk.daftarProduk(q.get("search"), q.get("kategori"), idToko));
                }
                case "POST" -> HttpUtil.sukses(ex, produk.tambahProduk(HttpUtil.bacaBodyJson(ex)));
                default -> HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
            }
            return;
        }
        int id = Integer.parseInt(seg[3]);
        switch (metode) {
            case "GET"    -> HttpUtil.sukses(ex, produk.cariProduk(id));
            case "PUT"    -> HttpUtil.sukses(ex, produk.ubahProduk(id, HttpUtil.bacaBodyJson(ex)));
            case "DELETE" -> HttpUtil.sukses(ex, produk.hapusProduk(id));
            default -> HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
        }
    }

    private static void tanganiKeranjang(HttpExchange ex, String metode, String[] seg) throws Exception {
        if ("POST".equals(metode) && seg.length == 3) {
            HttpUtil.sukses(ex, keranjang.tambah(HttpUtil.bacaBodyJson(ex)));
            return;
        }
        if (seg.length <= 3) {
            HttpUtil.gagal(ex, 404, "Endpoint keranjang tidak ditemukan");
            return;
        }
        int idPembeli = Integer.parseInt(seg[3]);

        if (seg.length == 4) {
            switch (metode) {
                case "GET"    -> HttpUtil.sukses(ex, keranjang.lihat(idPembeli));
                case "DELETE" -> HttpUtil.sukses(ex, keranjang.kosongkan(idPembeli));
                default -> HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
            }
            return;
        }
        int idProduk = Integer.parseInt(seg[4]);
        switch (metode) {
            case "PUT"    -> HttpUtil.sukses(ex, keranjang.ubahJumlah(idPembeli, idProduk, HttpUtil.bacaBodyJson(ex)));
            case "DELETE" -> HttpUtil.sukses(ex, keranjang.hapusItem(idPembeli, idProduk));
            default -> HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
        }
    }

    private static void tanganiPesanan(HttpExchange ex, String metode, String[] seg) throws Exception {
        String aksi = seg.length > 3 ? seg[3] : "";

        if ("checkout".equals(aksi) && "POST".equals(metode)) {
            HttpUtil.sukses(ex, pesanan.checkout(HttpUtil.bacaBodyJson(ex)));
            return;
        }
        if ("pembeli".equals(aksi) && "GET".equals(metode) && seg.length > 4) {
            HttpUtil.sukses(ex, pesanan.riwayatPembeli(Integer.parseInt(seg[4])));
            return;
        }
        if ("penjual".equals(aksi) && "GET".equals(metode) && seg.length > 4) {
            HttpUtil.sukses(ex, pesanan.pesananPenjual(Integer.parseInt(seg[4])));
            return;
        }
        if (seg.length >= 5) {
            int id = Integer.parseInt(seg[3]);
            if ("status".equals(seg[4]) && "PUT".equals(metode)) {
                HttpUtil.sukses(ex, pesanan.ubahStatus(id, HttpUtil.bacaBodyJson(ex)));
                return;
            }
            if ("verifikasi".equals(seg[4]) && "PUT".equals(metode)) {
                HttpUtil.sukses(ex, pesanan.verifikasiAdmin(id, HttpUtil.bacaBodyJson(ex)));
                return;
            }
        }
        if (seg.length == 4 && "GET".equals(metode)) {
            HttpUtil.sukses(ex, pesanan.detail(Integer.parseInt(seg[3])));
            return;
        }
        HttpUtil.gagal(ex, 404, "Endpoint pesanan tidak ditemukan");
    }

    private static void tanganiPembayaran(HttpExchange ex, String metode, String[] seg) throws Exception {
        if ("POST".equals(metode) && seg.length == 3) {
            HttpUtil.sukses(ex, pembayaran.bayar(HttpUtil.bacaBodyJson(ex)));
            return;
        }
        if ("GET".equals(metode) && seg.length > 4 && "pesanan".equals(seg[3])) {
            HttpUtil.sukses(ex, pembayaran.lihatPembayaran(Integer.parseInt(seg[4])));
            return;
        }
        HttpUtil.gagal(ex, 404, "Endpoint pembayaran tidak ditemukan");
    }

    private static void tanganiWishlist(HttpExchange ex, String metode, String[] seg) throws Exception {
        if ("POST".equals(metode) && seg.length == 3) {
            HttpUtil.sukses(ex, wishlist.tambah(HttpUtil.bacaBodyJson(ex)));
            return;
        }
        if (seg.length <= 3) {
            HttpUtil.gagal(ex, 404, "Endpoint wishlist tidak ditemukan");
            return;
        }
        int idPembeli = Integer.parseInt(seg[3]);
        if (seg.length == 4) {
            if (!"GET".equals(metode)) {
                HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
                return;
            }
            HttpUtil.sukses(ex, wishlist.lihat(idPembeli));
            return;
        }
        if ("DELETE".equals(metode)) {
            HttpUtil.sukses(ex, wishlist.hapus(idPembeli, Integer.parseInt(seg[4])));
            return;
        }
        HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
    }

    private static void tanganiAdmin(HttpExchange ex, String metode, String[] seg) throws Exception {
        if (!"GET".equals(metode)) {
            HttpUtil.gagal(ex, 405, "Metode " + metode + " tidak didukung");
            return;
        }
        if (seg.length == 3) {
            HttpUtil.sukses(ex, admin.daftarAdmin());
        } else if (seg.length > 3 && "pesanan".equals(seg[3])) {
            HttpUtil.sukses(ex, admin.semuaPesanan());
        } else {
            HttpUtil.gagal(ex, 404, "Endpoint admin tidak ditemukan");
        }
    }

    private static void tanganiStatis(HttpExchange ex) throws IOException {
        if ("OPTIONS".equals(ex.getRequestMethod())) {
            ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            ex.sendResponseHeaders(204, -1);
            return;
        }
        String pathRelatif = ex.getRequestURI().getPath();

        if ("/".equals(pathRelatif)) {
            ex.getResponseHeaders().set("Location", "/Frame%201/index.html");
            ex.sendResponseHeaders(302, -1);
            return;
        }

        Path file = kePathAman(pathRelatif);
        if (file == null) {
            HttpUtil.gagal(ex, 403, "Akses ditolak");
            return;
        }
        if (Files.isDirectory(file)) {
            file = file.resolve("index.html");
        }
        if (!Files.isRegularFile(file)) {
            HttpUtil.gagal(ex, 404, "File tidak ditemukan: " + pathRelatif);
            return;
        }

        byte[] isi = Files.readAllBytes(file);
        ex.getResponseHeaders().set("Content-Type", tipeKonten(file.getFileName().toString()));
        ex.getResponseHeaders().set("Cache-Control", "no-cache");
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        ex.sendResponseHeaders(200, isi.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(isi);
        }
    }

    private static Path kePathAman(String pathRelatif) {
        String bersih = pathRelatif.startsWith("/") ? pathRelatif.substring(1) : pathRelatif;
        if (bersih.isBlank()) {
            bersih = "Frame 1/sign.html";
        }
        Path calon = folderStatis.resolve(bersih).normalize();
        if (!calon.startsWith(folderStatis)) {
            return null;
        }
        return calon;
    }

    private static String tipeKonten(String namaFile) {
        String nama = namaFile.toLowerCase();
        int titik = nama.lastIndexOf('.');
        String ekstensi = (titik < 0) ? "" : nama.substring(titik + 1);
        switch (ekstensi) {
            case "html": case "htm": return "text/html; charset=utf-8";
            case "css":  return "text/css; charset=utf-8";
            case "js":   return "application/javascript; charset=utf-8";
            case "json": return "application/json; charset=utf-8";
            case "svg":  return "image/svg+xml";
            case "png":  return "image/png";
            case "jpg": case "jpeg": return "image/jpeg";
            case "gif":  return "image/gif";
            case "webp": return "image/webp";
            case "ico":  return "image/x-icon";
            case "woff": return "font/woff";
            case "woff2":return "font/woff2";
            case "ttf":  return "font/ttf";
            case "pdf":  return "application/pdf";
            case "txt":  return "text/plain; charset=utf-8";
            default:     return "application/octet-stream";
        }
    }

    private static Path tentukanFolderStatis() {
        List<Path> kandidat = new ArrayList<>();
        String dariEnv = System.getenv("STATIC_ROOT");
        if (dariEnv != null && !dariEnv.isBlank()) {
            kandidat.add(Paths.get(dariEnv));
        }
        kandidat.add(Paths.get("..", "1-Frontend", "assets"));
        kandidat.add(Paths.get("assets"));
        kandidat.add(Paths.get("..", "assets"));

        for (Path k : kandidat) {
            if (Files.isDirectory(k)) {
                return k.toAbsolutePath().normalize();
            }
        }
        Path bawaan = Paths.get("..", "1-Frontend", "assets").toAbsolutePath().normalize();
        System.out.println("PERINGATAN: folder frontend tidak ditemukan. "
                + "Jalankan server dari dalam folder 2-Backend, atau set STATIC_ROOT.");
        return bawaan;
    }
}
