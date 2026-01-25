import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { InstallPrompt } from '@/components/InstallPrompt';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gutsthegame.com'),
  title: 'GUTS - The Card Game',
  description: 'Play GUTS - the ultimate high-stakes card game. Hold or drop, beat the ghost!',
  manifest: '/manifest.json',
  applicationName: 'GUTS',
  keywords: ['card game', 'poker', 'casino', 'guts', 'gambling', 'free games', 'online game'],
  authors: [{ name: 'GUTS Game' }],
  creator: 'GUTS Game',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GUTS',
    startupImage: '/icons/icon-512x512.png',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'GUTS - The Card Game',
    description: 'Play GUTS - the ultimate high-stakes card game. Hold or drop, beat the ghost!',
    url: 'https://www.gutsthegame.com',
    siteName: 'GUTS',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GUTS - The Ultimate Card Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GUTS - The Card Game',
    description: 'Play GUTS - the ultimate high-stakes card game. Hold or drop, beat the ghost!',
    images: ['/twitter-image.png'],
    creator: '@gutsthegame',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#14b8a6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-128x128.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GUTS" />
        <link rel="canonical" href="https://www.gutsthegame.com" />
      </head>
      <body className="antialiased min-h-screen">
        {children}
        <InstallPrompt />
        <Analytics />
        <SpeedInsights />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
