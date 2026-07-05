import React from 'react';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { I18nProvider } from '@/src/i18n/context';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Spark IoT Agent',
  description: 'An advanced industrial IoT monitor dashboard with AI-powered diagnostic anomaly reasoning and telematic analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-[#0B0E14] text-[#e0e2ec] antialiased overflow-hidden selection:bg-[#00cfbf]/30 selection:text-[#00cfbf]">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
