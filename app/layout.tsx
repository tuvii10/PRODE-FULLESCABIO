import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prode Fullescabio Mundial 2026',
  description: 'Pronosticá, sumá puntos y competí por el premio mayor.',
  openGraph: {
    title: 'Prode Fullescabio Mundial 2026',
    description: 'Pronosticá, sumá puntos y competí por el premio mayor.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07070f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
