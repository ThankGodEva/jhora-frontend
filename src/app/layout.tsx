import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JHORA - Shop & Sell',
  description: 'Discover and sell amazing products on JHORA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Your global content (header, nav, etc.) can stay here */}

        {children}

        {/* Toaster works fine here – it's client-side but doesn't require 'use client' on layout */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
            success: {
              style: { background: '#10B981', color: 'white' },
            },
            error: {
              style: { background: '#EF4444', color: 'white' },
            },
          }}
        />
      </body>
    </html>
  );
}