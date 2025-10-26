import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/Provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientUIWrapper } from "@/components/providers/ClientUIWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus - Modern Content Platform for Creators",
  description: "Transform your ideas into compelling stories with our AI-powered blogging platform. Built for creators who demand excellence.",
  keywords: ["blogging", "content", "creator", "writing", "publishing"],
  authors: [{ name: "Nexus Team" }],
  openGraph: {
    title: "Nexus - Modern Content Platform",
    description: "Transform your ideas into compelling stories",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TRPCProvider>
          <ClientUIWrapper>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ClientUIWrapper>
        </TRPCProvider>
      </body>
    </html>
  );
}