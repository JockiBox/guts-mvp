import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GUTS MVP - High-Stakes 2-Card Poker',
  description: 'A fast-paced 2-card poker game with dramatic reveals and escalating stakes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
