/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // Tambahkan domain Drupal Anda di sini
      'cms.tokosendiri.com',
      // Jika Anda memiliki domain lain yang perlu diizinkan untuk gambar, tambahkan di sini juga
      'www.tokosendiri.com', // Tambahkan domain kustom Anda di sini
      'tokosendiri.com', // Tambahkan domain kustom Anda di sini
      'drupal-landing-tokosendiri.pages.dev', // Tambahkan domain Pages.dev Anda di sini
    ],
  },
  
  // Tambahkan fungsi redirects di sini
  async redirects() {
    return [
      // Redirect dari non-www ke www
      {
        source: '/:path*', // Mencocokkan semua path
        has: [
          {
            type: 'host',
            value: 'tokosendiri.com', // Jika host adalah tokosendiri.com (tanpa www)
          },
        ],
        destination: 'https://www.tokosendiri.com/:path*', // Redirect ke www
        permanent: true, // Redirect permanen (301)
      },

      // Redirect dari domain Cloudflare Pages
      {
        source: '/:path*', // Mencocokkan semua path
        has: [
          {
            type: 'host',
            value: 'drupal-landing-tokosendiri.pages.dev', // Jika host adalah domain Pages.dev
          },
        ],
        destination: 'https://www.tokosendiri.com/:path*', // Redirect ke www.tokosendiri.com
        permanent: true, // Redirect permanen (301)
      },
    ];
  },
};

export default nextConfig; // Menggunakan export default alih-alih module.exports
