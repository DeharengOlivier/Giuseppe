import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import { ThemeProvider } from "./components/ThemeProvider";
import { PagesProvider } from "./components/PagesProvider";
import { PublicLayout } from "./components/PublicLayout";
import { AOSInit } from "./components/AOSInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Professionnel",
  description: "Site portfolio professionnel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AOSInit />
        <ThemeProvider>
          <PagesProvider>
            <AnalyticsTracker />
            <PublicLayout>
              {children}
            </PublicLayout>
          </PagesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
