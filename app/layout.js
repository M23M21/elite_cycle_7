import '../styles/globals.css';
import { Inter } from "next/font/google";
import React from 'react';
import { CartProvider } from '@/components/Cart/CartProvider';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='flex flex-col min-h-screen'>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}