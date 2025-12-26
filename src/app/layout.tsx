import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vineyard',
  description: 'Developer-first idea management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gitlab-gray-50 flex flex-col`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
