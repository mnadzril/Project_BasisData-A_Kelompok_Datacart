package com.ecommerce.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class PasswordUtil {

    public static String hash(String passwordAsli) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hasil = md.digest(passwordAsli.getBytes(StandardCharsets.UTF_8));

            StringBuilder teks = new StringBuilder();
            for (byte b : hasil) {
                teks.append(String.format("%02x", b));
            }
            return teks.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Algoritma SHA-256 tidak tersedia", e);
        }
    }
}
