import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ThemeProvider from "@/components/ThemeProvider";

const outfit = Outfit({ subsets: ["latin"], weight: ['300', '400', '500', '600', '700', '800', '900'] });

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profile = await prisma.profile.findFirst();
    if (profile) {
      return {
        title: `${profile.name} | ${profile.primaryTitle}`,
        description: profile.aboutSummary || profile.introduction,
      };
    }
  } catch (error) {
    console.error(error);
  }
  return {
    title: "Portfolio",
    description: "Professional Portfolio",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        <ThemeProvider>
          <CustomCursor />
          <PublicNavbar />
          {children}
          <Footer />
          <ToastContainer position="bottom-right" theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
