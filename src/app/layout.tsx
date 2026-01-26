import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TourProvider } from '@/components/tour';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Design Hub House',
    default: 'Design Hub House',
  },
  description:
    'An interactive learning hub for design systems, tools, and code. Explore demos, playgrounds, and AI-powered guidance.',
  keywords: ['design systems', 'learning', 'code playground', 'tutorials', 'demos'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {/* Atmospheric gradient background with animated glow pools */}
        <div className="atmosphere-bg" aria-hidden="true">
          <div className="glow-pool glow-pool-cyan" />
        </div>

        {/* Noise/grain texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        <TourProvider>
          {children}
        </TourProvider>
      </body>
    </html>
  );
}
