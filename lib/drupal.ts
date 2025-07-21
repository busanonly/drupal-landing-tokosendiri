// lib/drupal.ts

import { DrupalClient } from "next-drupal"

// Menggunakan NEXT_PUBLIC_DRUPAL_BASE_URL untuk inisialisasi DrupalClient
// karena Client Components juga akan mengimpor file ini.
const DRUPAL_BASE_URL_FOR_CLIENT = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

// Kredensial API (hanya untuk sisi server)
const DRUPAL_API_USERNAME = process.env.DRUPAL_API_USERNAME;
const DRUPAL_API_PASSWORD = process.env.DRUPAL_API_PASSWORD;

// --- VALIDASI TAMBAHAN UNTUK DRUPAL_BASE_URL ---
if (!DRUPAL_BASE_URL_FOR_CLIENT) {
  throw new Error("NEXT_PUBLIC_DRUPAL_BASE_URL environment variable is not set.");
}
// --- AKHIR VALIDASI ---

// Membuat instance baru dari DrupalClient.
// Klien ini akan digunakan untuk berinteraksi dengan Drupal API Anda.
export const drupal = new DrupalClient(
  DRUPAL_BASE_URL_FOR_CLIENT, // Gunakan URL yang tersedia di klien
  {
    // Opsi fetcher kustom.
    fetcher: (url: string, options?: RequestInit) => {
      const headers = new Headers(options?.headers);

      // Hanya tambahkan header otentikasi jika kita berada di lingkungan server
      // (yaitu, jika kredensial API tersedia).
      // next-drupal secara otomatis menangani permintaan dari Client Components
      // yang diarahkan ke API Route di Next.js yang kemudian memanggil Drupal.
      if (typeof window === 'undefined' && DRUPAL_API_USERNAME && DRUPAL_API_PASSWORD) {
        headers.append(
          "Authorization",
          "Basic " +
            Buffer.from(
              `${DRUPAL_API_USERNAME}:${DRUPAL_API_PASSWORD}`
            ).toString("base64")
        );
      }

      return fetch(url, {
        ...options,
        headers,
      });
    },
    debug: process.env.NODE_ENV === "development",
  }
);

// Mengekspor URL publik untuk penggunaan di sisi klien (misalnya untuk gambar)
export const NEXT_PUBLIC_DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

// Tambahan validasi untuk NEXT_PUBLIC_DRUPAL_BASE_URL jika Anda ingin ketat
if (!NEXT_PUBLIC_DRUPAL_BASE_URL) {
  console.warn("NEXT_PUBLIC_DRUPAL_BASE_URL is not set. Images from Drupal might not load correctly in client-side components.");
}
