import type { Metadata } from 'next';
import { Epilogue, Manrope } from 'next/font/google';
import './globals.css';

const epilogue = Epilogue({
  variable: '--font-epilogue',
  subsets: ['latin', 'latin-ext'],
  weight: ['700', '800', '900'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Głodny Niedźwiedź – Catering',
  description: 'Zamów pyszne jedzenie z dostawą do biura. Tygodniowe menu, dostawa 8:00–10:00.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${epilogue.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
