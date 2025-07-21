// components/StackCard.tsx
'use client'; // Tandai sebagai Client Component

import Image from "next/image";
import { NEXT_PUBLIC_DRUPAL_BASE_URL } from "../lib/drupal"; // Import URL publik untuk gambar
import { StackNode } from "../utils/StackCard"; // Import interface StackNode

// Definisikan props untuk komponen StackCard
interface StackCardProps {
  // Menerima array gambar logo dari field_teknologi_stack
  stackLogos: StackNode['field_teknologi_stack'] | undefined;
}

export default function StackCard({ stackLogos }: StackCardProps) {
  // Guard clause: Jika tidak ada logo, jangan render apa pun
  if (!stackLogos || stackLogos.length === 0) {
    console.warn("StackCard component received no stackLogos or an empty array. Not rendering.");
    return null;
  }

  // Debugging log: Pastikan data yang diterima komponen sudah benar
  console.log("DEBUG: StackCard component received stackLogos:", stackLogos);

  return (
    <section className="py-12 px-4 mb-10"> {/* Padding dan margin untuk bagian ini */}
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Teknologi yang Digunakan</h2>
        
        {/* Menggunakan Grid untuk tata letak kolom responsif */}
        {/* Mobile (default): 4 kolom, Tablet (sm): 5 kolom, Desktop (md): 7 kolom, Layar Besar (lg): 14 kolom */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-14 gap-4 sm:gap-4 md:gap-4 lg:gap-4 xl:gap-6 justify-items-center items-center">
          {stackLogos.map((logo, index) => {
            // Pastikan URL gambar memiliki base URL jika diperlukan
            const imageUrl = logo.url || (
              logo.uri?.url
                ? `${NEXT_PUBLIC_DRUPAL_BASE_URL}${logo.uri.url}`
                : undefined
            );

            // Dapatkan lebar dan tinggi gambar, gunakan fallback
            const imageWidth = logo.width || 120;
            const imageHeight = logo.height || 80;

            if (!imageUrl) {
              console.warn(`Skipping logo at index ${index} due to missing URL.`);
              return null; // Jangan render jika URL gambar tidak ada
            }

            return (
              <div 
                key={index} 
                className="flex items-center justify-center p-2" // Padding untuk setiap item grid
              >
                <Image
                  src={imageUrl}
                  alt={logo.alt || `Logo ${index}`}
                  width={imageWidth}
                  height={imageHeight}
                  // Menyesuaikan tinggi gambar: h-10 untuk mobile, h-12 untuk sm, h-14 untuk md, h-16 untuk lg, h-20 untuk xl
                  // Hanya mempertahankan grayscale tanpa efek hover
                  className="w-auto h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 object-contain filter grayscale" 
                  priority={index < 3} // Prioritaskan 3 gambar pertama untuk performa
                  onError={(e) => console.error("Error loading stack logo image:", e.currentTarget.src, e)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
