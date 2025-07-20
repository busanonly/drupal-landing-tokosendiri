/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // Tambahkan domain Drupal Anda di sini
      'cms.tokosendiri.com',
      // Jika Anda memiliki domain lain yang perlu diizinkan untuk gambar, tambahkan di sini juga
    ],
  },
};

module.exports = nextConfig;