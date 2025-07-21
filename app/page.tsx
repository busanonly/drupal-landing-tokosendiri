// app/page.tsx

import { getHeroSections } from "../utils/HeroSection";
import HeroSection from "../components/HeroSection";
// Hapus import getLinks dan Header dari sini
// import { getLinks } from "../utils/Link";
// import Header from "../components/Header";
import { getStackCards, StackNode } from "../utils/StackCard";
import StackCard from "../components/StackCard";
import { getProblemSections, ProblemSectionNode } from "../utils/ProblemSection"; // Import helper dan interface ProblemSection
import ProblemSectionComponent from "../components/ProblemSection"; // Import komponen ProblemSection

export default async function Home() {
  let heroSectionData = null;
  let stackLogosData: StackNode['field_teknologi_stack'] | undefined = undefined;
  let problemSectionData = null; // Variabel untuk menyimpan data Problem Section
  let error: string | null = null;

  try {
    // Memanggil helper untuk mengambil data Hero Section
    const heroSections = await getHeroSections();
    if (heroSections.length > 0) {
      heroSectionData = heroSections[0]; 
    } else {
      error = "Tidak ada Hero Section yang ditemukan dari Drupal.";
      console.warn("DEBUG: Tidak ada Hero Section yang ditemukan.");
    }

    // Memanggil helper untuk mengambil data Stack Cards (logo teknologi)
    const stackNodes = await getStackCards();
    if (stackNodes.length > 0 && stackNodes[0].field_teknologi_stack) {
      stackLogosData = stackNodes[0].field_teknologi_stack;
    } else {
      console.warn("DEBUG: Tidak ada data stack teknologi yang ditemukan dari Drupal (Node ID 4).");
    }

    // Memanggil helper untuk mengambil data Problem Section
    const problemSections = await getProblemSections();
    if (problemSections.length > 0) {
      problemSectionData = problemSections[0];
    } else {
      console.warn("DEBUG: Tidak ada Problem Section yang ditemukan.");
    }

  } catch (err: unknown) {
    console.error("DEBUG: Gagal mengambil data di Home component:", err);
    error = "Gagal mengambil data dari Drupal. Pastikan Drupal berjalan dan CORS dikonfigurasi dengan benar.";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof err === 'object' && err !== null && 'response' in err && (err as any).response?.status === 401) { 
      error += " (Autentikasi gagal. Pastikan DRUPAL_API_USERNAME dan DRUPAL_API_PASSWORD benar)";
    }
  }

  // --- DEBUGGING LOGS (HAPUS SETELAH SELESAI) ---
  console.log("DEBUG: Final heroSectionData di Home:", heroSectionData ? "Ada" : "Tidak Ada");
  console.log("DEBUG: Final stackLogosData di Home:", stackLogosData ? "Ada" : "Tidak Ada");
  console.log("DEBUG: Final problemSectionData di Home:", problemSectionData ? "Ada" : "Tidak Ada");
  console.log("DEBUG: Error status di Home:", error);
  // --- AKHIR DEBUGGING LOGS ---

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header dirender di layout.tsx */}
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
            !error && <p className="text-center text-gray-600">Memuat Hero Section...</p>
          )}

          {/* Menampilkan komponen StackCard persis di bawah HeroSection */}
          {stackLogosData ? (
            <StackCard stackLogos={stackLogosData} />
          ) : (
            !error && <p className="text-center text-gray-600 mt-8">Memuat Teknologi Stack...</p>
          )}

          {/* Menampilkan komponen ProblemSection persis di bawah StackCard */}
          {problemSectionData ? (
            <ProblemSectionComponent problemSection={problemSectionData} />
          ) : (
            !error && <p className="text-center text-gray-600 mt-8">Memuat Problem Section...</p>
          )}

          {/* Anda bisa menambahkan bagian lain dari halaman di sini nanti */}
          {/* <h2 className="text-2xl font-bold mt-10 text-center">Selamat Datang!</h2>
          <p className="text-center text-gray-700 mt-2">Ini adalah landing page Anda yang terhubung dengan Drupal.</p> */}
        </div>
      </main>
    </div>
  );
}
