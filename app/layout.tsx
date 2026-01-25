import type { Metadata, Viewport } from 'next';
import './globals.css';
import { InstallPrompt } from '@/components/InstallPrompt';

export const metadata: Metadata = {
  title: 'GUTS - The Card Game',
  description: 'Play GUTS - the ultimate high-stakes card game. Hold or drop, beat the ghost!',
  manifest: '/manifest.json',
  applicationName: 'GUTS',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GUTS',
    startupImage: '/icon.svg',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'GUTS - The Card Game',
    description: 'Play GUTS - the ultimate high-stakes card game. Hold or drop, beat the ghost!',
    url: 'https://gutsthegame.com',
    siteName: 'GUTS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GUTS - The Card Game',
    description: 'Play GUTS - the ultimate high-stakes card game',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
    shortcut: '/favicon.svg',
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
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased min-h-screen">
        {children}
        <InstallPrompt />
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
