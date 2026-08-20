import type { Metadata } from "next";

import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import ThemeProvider from "@/components/ThemeProvider";



import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profile = await prisma.profile.findFirst();
    const theme = await prisma.themeSettings.findFirst();
    
    const baseTitle = theme?.siteTitle || "Portfolio";
    
    const rawResult: any = theme ? await prisma.$queryRawUnsafe("SELECT faviconUrl FROM ThemeSettings WHERE id = ?", theme.id) : null;
    const faviconUrl = rawResult && rawResult[0] ? rawResult[0].faviconUrl : null;
    const icons = faviconUrl ? { icon: faviconUrl } : undefined;
    
    if (profile) {
      return {
        title: baseTitle + " | " + profile.primaryTitle,
        description: profile.aboutSummary || profile.introduction,
        icons
      };
    }
    return {
      title: baseTitle,
      description: "Professional Portfolio",
      icons
    };
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
      <body className="font-sans transition-all duration-300" suppressHydrationWarning>
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
