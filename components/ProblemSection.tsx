// components/ProblemSection.tsx
'use client'; // Tandai sebagai Client Component

import Image from "next/image";
import { ProblemSectionNode } from "../utils/ProblemSection"; // Import interface ProblemSectionNode
import { NEXT_PUBLIC_DRUPAL_BASE_URL } from "../lib/drupal"; // Import URL publik untuk gambar

// Definisikan props untuk komponen ProblemSection
interface ProblemSectionProps {
  problemSection: ProblemSectionNode | null; // Izinkan problemSection bisa null
}

export default function ProblemSection({ problemSection }: ProblemSectionProps) {
  // Guard clause: Jika problemSection null atau undefined, jangan render apa pun
  if (!problemSection) {
    console.warn("ProblemSection component received a null or undefined problemSection prop. Not rendering.");
    return null;
  }

  // Debugging log: Pastikan data yang diterima komponen sudah benar
  console.log("DEBUG: ProblemSection component received data:", problemSection);

  // Ambil data gambar dekorasi
  const heroImageUrl = problemSection.field_hero_image?.url || (
    problemSection.field_hero_image?.uri?.url
      ? `${NEXT_PUBLIC_DRUPAL_BASE_URL}${problemSection.field_hero_image.uri.url}`
      : undefined
  );
  const heroImageAlt = problemSection.field_hero_image?.alt || problemSection.title;
  const heroImageWidth = problemSection.field_hero_image?.width || 600;
  const heroImageHeight = problemSection.field_hero_image?.height || 400;

  return (
    <section className="py-16 px-4 mb-10"> {/* Padding dan margin untuk bagian ini, tanpa background */}
      <div className="container mx-auto max-w-6xl">
        {/* Tata Letak Dua Kolom: Gambar Kiri, Teks Kanan */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Kolom Kiri: Gambar Dekorasi */}
          {heroImageUrl && (
            <div className="md:w-1/2 flex justify-center order-1 md:order-1"> {/* Gambar di kiri */}
              <Image
                src={heroImageUrl}
                alt={heroImageAlt}
                width={heroImageWidth}
                height={heroImageHeight}
                layout="responsive" // Membuat gambar responsif
                className="w-full h-auto object-contain rounded-lg shadow-lg max-w-sm md:max-w-md lg:max-w-lg" // Styling gambar
                priority // Prioritaskan pemuatan gambar ini
                onError={(e) => console.error("Error loading Problem Section hero image:", e.currentTarget.src, e)}
              />
            </div>
          )}

          {/* Kolom Kanan: Judul, Subjudul, dan List Problem */}
          <div className="md:w-1/2 text-center md:text-left order-2 md:order-2"> {/* Teks di kanan */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-gray-800">
              {problemSection.title}
            </h2>
            {problemSection.field_subtitle && (
              <p className="text-xl md:text-2xl mb-8 text-gray-700">
                {problemSection.field_subtitle}
              </p>
            )}

            {/* List Problem dari Paragraphs */}
            {problemSection.field_list_any && problemSection.field_list_any.length > 0 && (
              <ul className="space-y-4 text-lg text-gray-800">
                {problemSection.field_list_any.map((item, index) => {
                  // Debugging log untuk item list
                  console.log(`DEBUG: List item ${index}:`, item);
                  console.log(`DEBUG: List item ${index} text:`, item.field_daftar_problem_or_any); // <-- PERUBAHAN DI SINI

                  const iconImageUrl = item.field_gambar_bullet?.url || (
                    item.field_gambar_bullet?.uri?.url
                      ? `${NEXT_PUBLIC_DRUPAL_BASE_URL}${item.field_gambar_bullet.uri.url}`
                      : undefined
                  );
                  const iconImageAlt = item.field_gambar_bullet?.alt || `Icon ${index}`;

                  return (
                    <li key={item.id || index} className="flex items-start gap-3">
                      {iconImageUrl && (
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src={iconImageUrl}
                            alt={iconImageAlt}
                            width={24} // Ukuran ikon kecil
                            height={24} // Ukuran ikon kecil
                            className="object-contain"
                            onError={(e) => console.error("Error loading list icon image:", e.currentTarget.src, e)}
                          />
                        </div>
                      )}
                      <p className="flex-grow">{item.field_daftar_problem_or_any}</p> {/* <-- PERUBAHAN DI SINI */}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
