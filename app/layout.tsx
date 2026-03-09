import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Global application metadata used for document title and description.
 */
export const metadata: Metadata = {
  title: "Ticketing System",
  description: "Mini task and ticket management frontend",
};

/**
 * Root layout that provides fonts, Redux store context, and shared page shell.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {children}
            <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
              TaskFlow System
            </footer>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
