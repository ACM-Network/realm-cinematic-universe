import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Realm Cinematic Universe (RCU) | LIMITLESS STUDIOS",
  description: "Explore the official connected movie universe of LIMITLESS STUDIOS. Discover characters, branching timelines, Nexus events, and premium cinematic releases.",
  keywords: "Realm Cinematic Universe, RCU, Limitless Studios, Surya Gokul, Shadow Knight, Strings of You, Neelo Nenu, Multiverse, Cinematic Universe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020406] text-[#f1f5f9]">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
