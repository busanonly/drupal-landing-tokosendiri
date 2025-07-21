// components/HeroSection.tsx
'use client'; // Tandai sebagai Client Component

import Image from "next/image";
import Link from "next/link";
import { HeroSectionNode } from "../utils/HeroSection"; // Import interface HeroSectionNode
import { NEXT_PUBLIC_DRUPAL_BASE_URL } from "../lib/drupal"; // Import URL publik untuk gambar

// Definisikan props untuk komponen HeroSection
interface HeroSectionProps {
  heroSection: HeroSectionNode | null; // Izinkan heroSection bisa null
}

export default function HeroSection({ heroSection }: HeroSectionProps) {
  // Guard clause: Jika heroSection null atau undefined, jangan render apa pun
  if (!heroSection) {
    console.warn("HeroSection component received a null or undefined heroSection prop. Not rendering.");
    return null;
  }

  // Debugging log: Pastikan data yang diterima komponen sudah benar
  console.log("DEBUG: HeroSection component received data:", heroSection);
  console.log("DEBUG: HeroSection image data:", heroSection.field_hero_image);

  // Pastikan URL gambar memiliki base URL jika diperlukan.
  // next-drupal seharusnya menyediakan URL lengkap langsung di 'url'.
  // Jika 'url' tidak ada, coba bangun dari 'uri.url' dan NEXT_PUBLIC_DRUPAL_BASE_URL
  const imageUrl = heroSection.field_hero_image?.url || (
    heroSection.field_hero_image?.uri?.url
      ? `${NEXT_PUBLIC_DRUPAL_BASE_URL}${heroSection.field_hero_image.uri.url}`
      : undefined
  );

  // Dapatkan lebar dan tinggi gambar, gunakan fallback jika tidak ada
  const imageWidth = heroSection.field_hero_image?.width || 1080; // Fallback ke nilai default
  const imageHeight = heroSection.field_hero_image?.height || 720; // Fallback ke nilai default

  // DEBUGGING LOG UNTUK imageUrl, width, dan height
  console.log("DEBUG: Final imageUrl constructed:", imageUrl);
  console.log("DEBUG: Image Width:", imageWidth);
  console.log("DEBUG: Image Height:", imageHeight);

  // Pastikan alt text untuk gambar, fallback ke title jika tidak ada
  const imageAlt = heroSection.field_hero_image?.alt || heroSection.title;

  // DEBUGGING LOG UNTUK CTA Link
  console.log("DEBUG: CTA Link URI:", heroSection.field_cta_link?.uri); // Log URI
  console.log("DEBUG: CTA Label (from field_cta_link.title):", heroSection.field_cta_link?.title);


  return (
    <section
      className="relative bg-white text-black py-16 px-6 mb-10 rounded-xl shadow-xl overflow-hidden" // Mengubah bg-gray-50 menjadi bg-white, shadow-lg menjadi shadow-xl, py-20 menjadi py-16, rounded-lg menjadi rounded-xl
    >
      {/* Konten Hero Section - Menggunakan Flexbox untuk tata letak dua kolom */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"> {/* max-w-5xl menjadi max-w-6xl, gap-8 menjadi gap-12, justify-center menjadi justify-between */}
        {/* Kolom Kiri: Teks Konten */}
        <div className="text-center md:text-left md:w-1/2 order-2 md:order-1"> {/* Order untuk mobile vs desktop */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">{heroSection.title}</h1> {/* text-5xl md:text-6xl, leading-tight */}
          {heroSection.field_subtitle && (
            <p className="text-xl md:text-2xl mb-8 text-gray-700">{heroSection.field_subtitle}</p>
            // text-xl md:text-2xl, mb-6 menjadi mb-8, text-gray-700
          )}
          {/* Tombol Aksi (CTA) */}
          {heroSection.field_cta_link?.uri && heroSection.field_cta_link?.title && (
            // px-6 menjadi px-8, transform hover:scale-105
            <Link
              href={heroSection.field_cta_link.uri}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 inline-block transform hover:scale-105"
            >
              {heroSection.field_cta_link.title}
            </Link>
          )}
        </div>

        {/* Kolom Kanan: Ilustrasi Mockup Perangkat */}
        {imageUrl && (
          <div className="md:w-1/2 mb-8 md:mb-0 rounded-xl overflow-hidden shadow-2xl order-1 md:order-2"> {/* rounded-lg menjadi rounded-xl, shadow-2xl */}
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              layout="responsive"
              className="w-full h-auto object-contain"
              priority
              onError={(e) => console.error("Error loading Hero Section image:", e.currentTarget.src, e)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
