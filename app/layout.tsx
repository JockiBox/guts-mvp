import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GUTS - The Card Game',
  description: 'Play GUTS - the ultimate high-stakes card game. Hold or drop, beat the ghost!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GUTS',
  },
  openGraph: {
    title: 'GUTS - The Card Game',
    description: 'Play GUTS - the ultimate high-stakes card game. Hold or drop, beat the ghost!',
    url: 'https://guts-game.vercel.app',
    siteName: 'GUTS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GUTS - The Card Game',
    description: 'Play GUTS - the ultimate high-stakes card game',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased min-h-screen">
        {children}
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
