// utils/HeroSection.ts

import { drupal } from "../lib/drupal"; // Pastikan path ke drupal.ts benar
import { DrupalNode } from "next-drupal";

/**
 * Interface untuk mendefinisikan struktur data Hero Section.
 * Sesuaikan dengan field yang ada di tipe konten 'Hero Section' Drupal Anda.
 */
export interface HeroSectionNode extends DrupalNode {
  title: string;
  field_subtitle?: string; // Diperbarui: dari field_tagline menjadi field_subtitle
  field_cta_link?: { // Diperbarui: dari field_button_link menjadi field_cta_link
    uri: string;
    url: string; // next-drupal sering menambahkan properti 'url' ini
    title: string; // <-- DITAMBAHKAN: Ini adalah label tombol CTA
  };
  field_hero_image?: { // Diperbarui: dari field_background_image menjadi field_hero_image
    url?: string; // Menjadi opsional karena mungkin tidak selalu ada langsung dari next-drupal
    alt: string;
    width: number;
    height: number;
    uri?: { // <-- DITAMBAHKAN PROPERTI URI INI
      value: string;
      url: string;
    };
  };
  // Tambahkan field lain yang Anda butuhkan dari Hero Section di sini
  // Misalnya, jika ada field_nama_web, Anda bisa menambahkannya di sini.
  // field_nama_web?: any;
}

/**
 * Mengambil satu atau lebih node Hero Section dari Drupal.
 * Anda mungkin perlu menyesuaikan logika ini jika Anda hanya ingin mengambil satu Hero Section terntentu (misalnya, yang dipromosikan).
 */
export async function getHeroSections(): Promise<HeroSectionNode[]> {
  try {
    // Mengambil semua node tipe 'hero_section' yang dipublikasikan.
    // Sesuaikan parameter 'include' dan 'fields' sesuai dengan field actual di Hero Section Anda.
    const heroSections = await drupal.getResourceCollection<HeroSectionNode>("node--hero_section", {
      params: {
        "filter[status]": 1, // Hanya ambil konten yang dipublikasikan
        // Sertakan field relasi jika ada (misalnya, gambar latar belakang)
        include: "field_hero_image", // Diperbarui: dari field_background_image menjadi field_hero_image
        // Tentukan field yang ingin diambil dari node hero_section
        "fields[node--hero_section]": "title,field_subtitle,field_cta_link,field_hero_image", // field_cta_label dihapus dari sini
        // Tentukan field yang ingin diambil dari entitas file (untuk gambar latar belakang)
        "fields[file--file]": "uri,url,filename,resourceId",
        sort: "-created", // Urutkan berdasarkan tanggal dibuat terbaru (opsional)
        "page[limit]": 1, // Batasi hanya mengambil 1 hero section terbaru (opsional, jika hanya ada satu)
      },
    });

    // next-drupal dapat mengembalikan objek tunggal jika limit 1, pastikan selalu array
    return Array.isArray(heroSections) ? heroSections : [heroSections];
  } catch (error) {
    console.error("Gagal mengambil Hero Sections:", error);
    // Dalam produksi, Anda mungkin ingin melakukan penanganan error yang lebih baik
    // seperti melemparkan error atau mengembalikan array kosong.
    return [];
  }
}

/**
 * Mengambil satu node Hero Section spesifik berdasarkan ID atau filter lainnya.
 * Anda bisa mengubah ini untuk mengambil hero section berdasarkan kriteria unik,
 * misalnya hero section yang ditandai sebagai 'default'.
 */
export async function getHeroSectionById(id: string): Promise<HeroSectionNode | null> {
  try {
    // Ambil satu node hero_section berdasarkan ID
    const heroSection = await drupal.getResource<HeroSectionNode>("node--hero_section", id, {
      params: {
        "filter[status]": 1,
        include: "field_hero_image", // Diperbarui: dari field_background_image menjadi field_hero_image
        "fields[node--hero_section]": "title,field_subtitle,field_cta_link,field_hero_image", // field_cta_label dihapus dari sini
        "fields[file--file]": "uri,url,filename,resourceId",
      },
    });

    // Ini adalah baris yang menyebabkan error sebelumnya.
    // Menambahkan penegasan tipe eksplisit untuk memastikan TypeScript mengerti.
    return heroSection as HeroSectionNode | null;
  } catch (error) {
    console.error(`Gagal mengambil Hero Section dengan ID ${id}:`, error);
    return null;
  }
}
