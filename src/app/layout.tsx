import type { Metadata } from 'next';
import { Nunito, Fredoka } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
});

const fredokaOne = Fredoka({
  variable: '--font-fredoka',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Głodny Niedźwiedź – Catering',
  description: 'Zamów pyszne jedzenie z dostawą do biura. Tygodniowe menu, dostawa 12:00–14:00.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${nunito.variable} ${fredokaOne.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
