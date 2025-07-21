import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./../components/Header"; // Import komponen Header
import { getLinks } from "./../utils/Link"; // Import fungsi untuk mengambil data Link

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toko Sendiri - Landing Page", // Perbarui judul default
  description: "Landing page toko online yang terhubung dengan Drupal CMS.", // Perbarui deskripsi default
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let mainMenuLinksData = undefined; // Variabel untuk menyimpan data link menu

  try {
    // Memanggil helper untuk mengambil data Link menu
    const linkNodes = await getLinks();
    if (linkNodes.length > 0 && linkNodes[0].field_link) {
      mainMenuLinksData = linkNodes[0].field_link;
    } else {
      console.warn("Tidak ada data link menu yang ditemukan dari Drupal.");
    }
  } catch (err: any) {
    console.error("Gagal mengambil data link navigasi di layout:", err);
    // Anda mungkin ingin menangani error ini lebih baik di produksi,
    // misalnya dengan menampilkan menu fallback atau pesan error di UI.
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Render HeaderComponent di sini. Ini adalah satu-satunya tempat Header dirender. */}
        <Header mainMenuLinks={mainMenuLinksData} />
        
        {/* Children akan menjadi konten halaman yang spesifik (misalnya app/page.tsx) */}
        {children}
      </body>
    </html>
  );
}
