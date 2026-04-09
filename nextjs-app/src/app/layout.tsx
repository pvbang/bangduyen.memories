import type { Metadata } from 'next';
import { Poppins, Dancing_Script, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

// ==========================================
// FONT CONFIGURATION
// ==========================================

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-dancing',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: {
    template: '%s | Bằng & Duyên Memories',
    default: 'Bằng & Duyên Memories',
  },
  description: 'Nơi lưu giữ những kỷ niệm đẹp của Bằng & Duyên ✨',
  icons: {
    icon: '/favicon.ico',
  },
};

// ==========================================
// ROOT LAYOUT
// ==========================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${poppins.variable} ${dancingScript.variable} ${playfairDisplay.variable}`}
    >
      <head>
        {/* Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
