// components/Header.tsx
'use client'; // Tandai sebagai Client Component

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LinkNode } from "../utils/Link"; // Import interface LinkNode

// Definisikan props untuk komponen Header
interface HeaderProps {
  // Menerima array link dari field_link dari LinkNode
  mainMenuLinks: LinkNode['field_link'];
}

export default function Header({ mainMenuLinks }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fungsi untuk toggle status menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 md:px-8 lg:px-12 w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Situs di Kiri */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            {/* Menggunakan placeholder image jika public/tokosendiri.svg tidak ada */}
            <Image
              src="/tokosendiri.svg" // Pastikan path ini benar di folder public/ Anda
              alt="Logo Toko Sendiri"
              width={150} // Sesuaikan lebar
              height={40} // Sesuaikan tinggi
              priority // Prioritaskan pemuatan logo
              onError={(e) => {
                // Fallback jika gambar tidak ditemukan
                e.currentTarget.src = "https://placehold.co/150x40/cccccc/000000?text=Logo";
              }}
            />
          </Link>
        </div>

        {/* Tombol Hamburger Menu untuk Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-800 focus:outline-none">
            {isMobileMenuOpen ? (
              // Ikon 'X' saat menu terbuka (inline SVG)
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            ) : (
              // Ikon Hamburger saat menu tertutup (inline SVG)
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Daftar Menu untuk Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {mainMenuLinks?.map((linkItem, index) => (
            <Link key={index} href={linkItem.uri} className="text-gray-700 hover:text-blue-600 font-medium transition duration-200">
              {linkItem.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Menu Mobile (Conditional Rendering) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-6 animate-fade-in-down">
          <button onClick={toggleMobileMenu} className="absolute top-6 right-6 text-gray-800 focus:outline-none">
            {/* Ikon 'X' untuk menutup menu mobile */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
          <nav className="flex flex-col space-y-4">
            {mainMenuLinks?.map((linkItem, index) => (
              <Link key={index} href={linkItem.uri} onClick={toggleMobileMenu} className="text-gray-800 text-2xl font-semibold hover:text-blue-600 transition duration-200">
                {linkItem.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
