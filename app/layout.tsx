import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNavbar } from "./_components/site-navbar";
import { SiteFooter } from "./_components/site-footer";
import { SmoothScrollProvider } from "./_components/smooth-scroll-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "UnTraceMe — All-in-One AI Trace & Metadata Remover",
  description: "Bypass AI detection, humanize AI-generated text, and strip image synthetic metadata completely free without privacy compromises.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-indigo-500 selection:text-white" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScrollProvider>
            <SiteNavbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <SiteFooter />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
