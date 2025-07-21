// utils/StackCard.ts

import { drupal } from "../lib/drupal"; // Pastikan path ke drupal.ts benar
import { DrupalNode } from "next-drupal";

/**
 * Interface untuk mendefinisikan struktur data Teknologi Stack.
 * Sesuaikan dengan field yang ada di tipe konten 'Teknologi Stack' Drupal Anda.
 */
export interface StackNode extends DrupalNode {
  title: string; // Judul node (misalnya "Logo Stack")
  field_teknologi_stack?: Array<{ // Field yang berisi array referensi media (gambar logo)
    url: string;
    alt: string;
    width: number;
    height: number;
    uri?: { // Properti URI jika diperlukan untuk membangun URL
      value: string;
      url: string;
    };
  }>;
  // Tambahkan field lain yang Anda butuhkan dari tipe konten Teknologi Stack di sini
}

/**
 * Mengambil satu atau lebih node Teknologi Stack dari Drupal.
 * Fungsi ini difilter untuk hanya mengambil node dengan drupal_internal__nid = 4.
 */
export async function getStackCards(): Promise<StackNode[]> {
  try {
    // Mengambil node tipe 'teknologi_stack' yang dipublikasikan dan memiliki drupal_internal__nid = 4.
    const stackCards = await drupal.getResourceCollection<StackNode>("node--teknologi_stack", {
      params: {
        "filter[status]": 1, // Hanya ambil konten yang dipublikasikan
        "filter[drupal_internal__nid]": 4, // <-- Filter berdasarkan Node ID internal 4
        include: "field_teknologi_stack", // Sertakan field referensi media
        "fields[node--teknologi_stack]": "title,field_teknologi_stack", // Field yang ingin diambil dari node
        "fields[file--file]": "uri,url,filename,resourceId", // Field yang ingin diambil dari entitas file
        "page[limit]": 1, // Batasi hanya mengambil 1 node (jika ID unik)
      },
    });

    // next-drupal akan mengembalikan array, pastikan selalu array
    return Array.isArray(stackCards) ? stackCards : [stackCards];
  } catch (error) {
    console.error("Gagal mengambil Stack Cards:", error);
    // Dalam produksi, Anda mungkin ingin melakukan penanganan error yang lebih baik
    return [];
  }
}

/**
 * Mengambil satu node Teknologi Stack spesifik berdasarkan ID unik Drupal.
 * Ini berbeda dengan drupal_internal__nid.
 */
export async function getStackCardById(id: string): Promise<StackNode | null> {
  try {
    const stackCard = await drupal.getResource<StackNode>("node--teknologi_stack", id, {
      params: {
        "filter[status]": 1,
        include: "field_teknologi_stack",
        "fields[node--teknologi_stack]": "title,field_teknologi_stack",
        "fields[file--file]": "uri,url,filename,resourceId",
      },
    });
    return stackCard as StackNode | null;
  } catch (error) {
    console.error(`Gagal mengambil Stack Card dengan ID ${id}:`, error);
    return null;
  }
}
