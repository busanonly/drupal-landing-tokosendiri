// utils/ProblemSection.ts

import { drupal } from "../lib/drupal"; // Pastikan path ke drupal.ts benar
import { DrupalNode } from "next-drupal";

/**
 * Interface untuk mendefinisikan struktur data Problem Section.
 * Sesuaikan dengan field yang ada di tipe konten 'Problem Section' Drupal Anda.
 */
export interface ProblemSectionNode extends DrupalNode {
  title: string; // Judul utama
  field_subtitle?: string; // Subjudul penjelas
  field_hero_image?: { // Gambar dekorasi
    url?: string;
    alt: string;
    width: number;
    height: number;
    uri?: {
      value: string;
      url: string;
    };
  };
  field_list_any?: Array<{ // Field Paragraphs untuk daftar masalah
    id: string; // ID Paragraph
    field_daftar_problem_or_any: string; // <-- PERUBAHAN DI SINI: field_text menjadi field_daftar_problem_or_any
    field_gambar_bullet?: { // Gambar ikon untuk bullet
      url?: string;
      alt: string;
      width: number;
      height: number;
      uri?: {
        value: string;
        url: string;
      };
    };
    // Tambahkan field lain dari paragraph--list_bullet jika ada
  }>;
  // Tambahkan field lain yang Anda butuhkan dari Problem Section di sini
}

/**
 * Mengambil satu atau lebih node Problem Section dari Drupal.
 * Fungsi ini difilter untuk hanya mengambil node dengan drupal_internal__nid = 5.
 */
export async function getProblemSections(): Promise<ProblemSectionNode[]> {
  try {
    // Mengambil semua node tipe 'problem_any_section' yang dipublikasikan.
    // Sertakan field relasi untuk gambar hero dan paragraph list, serta gambar ikon di dalam paragraph.
    const problemSections = await drupal.getResourceCollection<ProblemSectionNode>("node--problem_any_section", {
      params: {
        "filter[status]": 1, // Hanya ambil konten yang dipublikasikan
        "filter[drupal_internal__nid]": 5, // Filter Node ID 5
        include: "field_hero_image,field_list_any.field_gambar_bullet",
        "fields[node--problem_any_section]": "title,field_subtitle,field_hero_image,field_list_any",
        "fields[file--file]": "uri,url,filename,resourceId", // Field untuk entitas file (gambar)
        // PERUBAHAN DI SINI: Pastikan field_daftar_problem_or_any juga diminta dari paragraph--list_bullet
        "fields[paragraph--list_bullet]": "field_daftar_problem_or_any,field_gambar_bullet", 
        sort: "-created", // Urutkan berdasarkan tanggal dibuat terbaru (opsional)
        "page[limit]": 1, // Batasi hanya mengambil 1 problem section terbaru (opsional)
      },
    });

    return Array.isArray(problemSections) ? problemSections : [problemSections];
  } catch (error) {
    console.error("Gagal mengambil Problem Sections:", error);
    return [];
  }
}

/**
 * Mengambil satu node Problem Section spesifik berdasarkan ID.
 */
export async function getProblemSectionById(id: string): Promise<ProblemSectionNode | null> {
  try {
    const problemSection = await drupal.getResource<ProblemSectionNode>("node--problem_any_section", id, {
      params: {
        "filter[status]": 1,
        include: "field_hero_image,field_list_any.field_gambar_bullet",
        "fields[node--problem_any_section]": "title,field_subtitle,field_hero_image,field_list_any",
        "fields[file--file]": "uri,url,filename,resourceId",
        "fields[paragraph--list_bullet]": "field_daftar_problem_or_any,field_gambar_bullet", // <-- PERUBAHAN DI SINI
      },
    });
    return problemSection as ProblemSectionNode | null;
  } catch (error) {
    console.error(`Gagal mengambil Problem Section dengan ID ${id}:`, error);
    return null;
  }
}
