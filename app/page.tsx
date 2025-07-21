// app/page.tsx

import { getHeroSections } from "../utils/HeroSection";
import HeroSection from "../components/HeroSection";
// Hapus import getLinks dan Header dari sini
// import { getLinks } from "../utils/Link";
// import Header from "../components/Header";
import { getStackCards, StackNode } from "../utils/StackCard";
import StackCard from "../components/StackCard";

export default async function Home() {
  let heroSectionData = null;
  // Hapus variabel mainMenuLinksData dari sini
  // let mainMenuLinksData = undefined;
  let stackLogosData: StackNode['field_teknologi_stack'] | undefined = undefined;
  let error: string | null = null;

  try {
    // Memanggil helper untuk mengambil data Hero Section
    const heroSections = await getHeroSections();
    if (heroSections.length > 0) {
      heroSectionData = heroSections[0];
    } else {
      error = "Tidak ada Hero Section yang ditemukan dari Drupal.";
    }

    // Hapus logika pengambilan data Link menu dari sini
    // const linkNodes = await getLinks();
    // if (linkNodes.length > 0 && linkNodes[0].field_link) {
    //   mainMenuLinksData = linkNodes[0].field_link;
    // } else {
    //   console.warn("Tidak ada data link menu yang ditemukan dari Drupal.");
    // }

    // Memanggil helper untuk mengambil data Stack Cards (logo teknologi)
    const stackNodes = await getStackCards();
    if (stackNodes.length > 0 && stackNodes[0].field_teknologi_stack) {
      stackLogosData = stackNodes[0].field_teknologi_stack;
    } else {
      console.warn("Tidak ada data stack teknologi yang ditemukan dari Drupal (Node ID 4).");
    }

  } catch (err: any) {
    console.error("Gagal mengambil data:", err);
    error = "Gagal mengambil data dari Drupal. Pastikan Drupal berjalan dan CORS dikonfigurasi dengan benar.";
    if (err.response?.status === 401) {
      error += " (Autentikasi gagal. Pastikan DRUPAL_API_USERNAME dan DRUPAL_API_PASSWORD benar)";
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hapus komponen Header dari sini. Ini menyebabkan duplikasi. */}
      {/* <Header mainMenuLinks={mainMenuLinksData} /> */}

      <main className="flex-grow">
        <div className="container mx-auto p-4">
          {/* Menampilkan pesan error jika ada */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {/* Menampilkan komponen HeroSection jika data tersedia */}
          {heroSectionData ? (
            <HeroSection heroSection={heroSectionData} />
          ) : (
            !error && <p>Memuat Hero Section...</p>
          )}

          {/* Menampilkan komponen StackCard persis di bawah HeroSection */}
          {stackLogosData && <StackCard stackLogos={stackLogosData} />}

          {/* Anda bisa menambahkan bagian lain dari halaman di sini nanti */}
          {/* <h2 className="text-2xl font-bold mt-10 text-center">Selamat Datang!</h2>
          <p className="text-center text-gray-700 mt-2">Ini adalah landing page Anda yang terhubung dengan Drupal.</p> */}
        </div>
      </main>
    </div>
  );
}
