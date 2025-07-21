// utils/Link.ts

import { drupal } from "../lib/drupal"; // Pastikan path ke drupal.ts benar
import { DrupalNode } from "next-drupal";

/**
 * Interface untuk mendefinisikan struktur data Link.
 * Sesuaikan dengan field yang ada di tipe konten 'Link' Drupal Anda.
 */
export interface LinkNode extends DrupalNode {
  title: string; // Judul node link (misalnya "Main Navigation Links")
  field_link?: Array<{ // Field yang berisi array objek link
    uri: string;
    title: string;
    options: any; // Sesuaikan jika ada opsi spesifik
  }>;
  // Tambahkan field lain yang Anda butuhkan dari tipe konten Link di sini
}

/**
 * Mengambil satu atau lebih node Link dari Drupal.
 * Biasanya, Anda mungkin hanya memiliki satu node Link untuk navigasi utama.
 */
export async function getLinks(): Promise<LinkNode[]> {
  try {
    // Mengambil semua node tipe 'link' yang dipublikasikan.
    // Sesuaikan parameter 'include' dan 'fields' sesuai dengan field actual di Link Anda.
    const links = await drupal.getResourceCollection<LinkNode>("node--link", {
      params: {
        "filter[status]": 1, // Hanya ambil konten yang dipublikasikan
        // Tentukan field yang ingin diambil dari node link
        "fields[node--link]": "title,field_link", // Meminta field title dan field_link
        sort: "-created", // Urutkan berdasarkan tanggal dibuat terbaru (opsional)
        "page[limit]": 1, // Batasi hanya mengambil 1 node link terbaru (opsional)
      },
    });

    // next-drupal akan mengembalikan array, pastikan selalu array
    return Array.isArray(links) ? links : [links];
  } catch (error) {
    console.error("Gagal mengambil Link Nodes:", error);
    // Dalam produksi, Anda mungkin ingin melakukan penanganan error yang lebih baik
    return [];
  }
}

/**
 * Mengambil satu node Link spesifik berdasarkan ID.
 * Berguna jika Anda tahu ID node link yang ingin Anda ambil.
 */
export async function getLinkById(id: string): Promise<LinkNode | null> {
  try {
    const linkNode = await drupal.getResource<LinkNode>("node--link", id, {
      params: {
        "filter[status]": 1,
        "fields[node--link]": "title,field_link",
      },
    });
    return linkNode as LinkNode | null;
  } catch (error) {
    console.error(`Gagal mengambil Link Node dengan ID ${id}:`, error);
    return null;
  }
}
