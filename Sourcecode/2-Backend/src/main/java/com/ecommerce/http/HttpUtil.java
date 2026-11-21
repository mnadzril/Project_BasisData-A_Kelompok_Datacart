package com.ecommerce.http;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializer;
import com.sun.net.httpserver.HttpExchange;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.LinkedHashMap;
import java.util.Map;

public class HttpUtil {

    public static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .registerTypeAdapter(Double.class,
                    (JsonSerializer<Double>) (nilai, tipe, konteks) -> {
                        if (nilai != null && nilai == Math.rint(nilai)) {
                            return new JsonPrimitive(nilai.longValue());
                        }
                        return new JsonPrimitive(nilai);
                    })
            .create();

    public static String tanggal(Timestamp t) {
        if (t == null) return null;
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(t);
    }

    public static void kirimJson(HttpExchange ex, int kodeHttp, Object data) throws IOException {
        String json = GSON.toJson(data);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);

        ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        ex.sendResponseHeaders(kodeHttp, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }

    public static void sukses(HttpExchange ex, Object data) throws IOException {
        Map<String, Object> isi = new LinkedHashMap<>();
        isi.put("sukses", true);
        isi.put("data", data);
        kirimJson(ex, 200, isi);
    }

    public static void gagal(HttpExchange ex, int kodeHttp, String pesan) throws IOException {
        Map<String, Object> isi = new LinkedHashMap<>();
        isi.put("sukses", false);
        isi.put("pesan", pesan);
        kirimJson(ex, kodeHttp, isi);
    }

    public static JsonObject bacaBodyJson(HttpExchange ex) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (InputStream is = ex.getRequestBody()) {
            BufferedReader pembaca = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
            String baris;
            while ((baris = pembaca.readLine()) != null) {
                sb.append(baris);
            }
        }
        String isi = sb.toString().trim();
        if (isi.isEmpty()) {
            return new JsonObject();
        }
        return GSON.fromJson(isi, JsonObject.class);
    }

    public static Map<String, String> bacaQuery(HttpExchange ex) {
        Map<String, String> hasil = new LinkedHashMap<>();
        String query = ex.getRequestURI().getRawQuery();
        if (query == null || query.isEmpty()) {
            return hasil;
        }
        for (String pasangan : query.split("&")) {
            if (pasangan.isEmpty()) continue;
            int posisi = pasangan.indexOf('=');
            try {
                if (posisi < 0) {
                    hasil.put(URLDecoder.decode(pasangan, StandardCharsets.UTF_8.name()), "");
                } else {
                    String kunci = URLDecoder.decode(pasangan.substring(0, posisi), StandardCharsets.UTF_8.name());
                    String nilai = URLDecoder.decode(pasangan.substring(posisi + 1), StandardCharsets.UTF_8.name());
                    hasil.put(kunci, nilai);
                }
            } catch (UnsupportedEncodingException e) {
            }
        }
        return hasil;
    }

    public static String str(JsonObject o, String kunci, String cadangan) {
        return (o != null && o.has(kunci) && !o.get(kunci).isJsonNull())
                ? o.get(kunci).getAsString() : cadangan;
    }

    public static int angka(JsonObject o, String kunci, int cadangan) {
        return (o != null && o.has(kunci) && !o.get(kunci).isJsonNull())
                ? o.get(kunci).getAsInt() : cadangan;
    }

    public static double desimal(JsonObject o, String kunci, double cadangan) {
        return (o != null && o.has(kunci) && !o.get(kunci).isJsonNull())
                ? o.get(kunci).getAsDouble() : cadangan;
    }
}
