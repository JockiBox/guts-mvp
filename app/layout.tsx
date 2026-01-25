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
        {/* iOS Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-128x128.png" />

        {/* iOS PWA Config */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GUTS" />

        {/* iOS Splash Screens - generated from icon */}
        {/* iPhone 15 Pro Max, 14 Pro Max */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" />
        {/* iPhone 15 Pro, 14 Pro */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" />
        {/* iPhone 14 Plus, 13 Pro Max, 12 Pro Max */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" />
        {/* iPhone 14, 13 Pro, 13, 12 Pro, 12 */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        {/* iPhone 13 mini, 12 mini */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        {/* iPhone 11 Pro Max, XS Max */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        {/* iPhone 11, XR */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />
        {/* iPhone 11 Pro, X, XS */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        {/* iPhone 8 Plus, 7 Plus, 6s Plus */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" />
        {/* iPhone 8, 7, 6s, 6, SE 2nd gen */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        {/* iPhone SE 1st gen */}
        <link rel="apple-touch-startup-image" href="/icons/icon-384x384.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        {/* iPad Pro 12.9" */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
        {/* iPad Pro 11" */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" />
        {/* iPad Pro 10.5", Air 3rd gen */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" />
        {/* iPad 9.7" */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />

        {/* Android Chrome */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Misc */}
        <link rel="canonical" href="https://www.gutsthegame.com" />
        <meta name="msapplication-TileColor" content="#14b8a6" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
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
