import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/frontend/components/layout/Navbar";
import ConditionalFooter from "@/frontend/components/layout/ConditionalFooter";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logic2Code AI — Language-Aware Coding Tutor",
  description: "Accelerate logic learning with language-specific roadmaps, Monaco editor, and live memory visualizer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plusJakartaSans.variable} ${geistMono.variable} min-h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-200 pt-12" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <div className="flex-grow flex flex-col w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
            {children}
          </div>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}

