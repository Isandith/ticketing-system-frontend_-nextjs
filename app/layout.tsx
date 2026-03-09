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

export const metadata: Metadata = {
  title: "Ticketing System",
  description: "Mini task and ticket management frontend",
};

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
              TaskFlow Ticketing System
            </footer>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
