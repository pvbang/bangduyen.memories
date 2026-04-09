import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization config
  images: {
    unoptimized: false,
  },

  // Redirects từ old HTML URLs sang Next.js routes
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/memories.html', destination: '/memories', permanent: true },
      { source: '/gallery.html', destination: '/gallery', permanent: true },
      { source: '/timeline.html', destination: '/timeline', permanent: true },
      { source: '/starmap.html', destination: '/starmap', permanent: true },
      { source: '/100days.html', destination: '/100days', permanent: true },
      { source: '/300days.html', destination: '/300days', permanent: true },
      { source: '/1year.html', destination: '/1year', permanent: true },
      { source: '/birthday.html', destination: '/birthday', permanent: true },
      { source: '/sorry.html', destination: '/sorry', permanent: true },
      { source: '/march8.html', destination: '/march8', permanent: true },
      { source: '/trung-thu.html', destination: '/trung-thu', permanent: true },
      { source: '/admin.html', destination: '/admin', permanent: true },
      {
        source: '/cong-chua-iuuu-cua-a/giang_sinh_an_lanh.html',
        destination: '/giang-sinh',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
