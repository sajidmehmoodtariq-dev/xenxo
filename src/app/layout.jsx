import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from '@/components/AuthProvider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "XenXO",
  description: "AI powered tick tack toe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased min-h-screen bg-gray-900 text-white flex`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-teal-900/20 pointer-events-none"></div>
        <AuthProvider>
          <div className="fixed top-0 z-50">
            <Navbar />
          </div>
          <div className="ml-20 overflow-x-hidden">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
