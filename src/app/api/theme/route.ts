import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.themeSettings.findFirst();
    if (!settings) {
      settings = await prisma.themeSettings.create({
        data: {
          primaryColor: "#3b82f6",
          secondaryColor: "#8b5cf6",
          accentColor: "#10b981",
          backgroundColor: "#050505",
          fontFamily: "Inter",
          backgroundAnimation: "mesh",
          enableParallax: true,
          cardStyle: "glassmorphism",
          borderRadius: "8px",
          buttonStyle: "filled",
          navbarStyle: "floating",
          cursorStyle: "default",
          layoutWidth: "max-w-7xl",
          glowIntensity: "medium",
          textReveal: "fade",
          sectionSpacing: "normal",
          shadowStyle: "soft",
          borderWidth: "1px",
          backdropBlur: "md",
          pageTransition: "fade",
          imageStyle: "rounded",
          activeMasterTheme: "glass"
        }
      });
    }
    // Fetch faviconUrl directly from DB because Prisma Client is out of sync until restart
    const rawResult: any = await prisma.$queryRawUnsafe("SELECT faviconUrl FROM ThemeSettings WHERE id = ?", settings.id);
    if (rawResult && rawResult[0] && rawResult[0].faviconUrl !== undefined) {
      (settings as any).faviconUrl = rawResult[0].faviconUrl;
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching theme settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const settings = await prisma.themeSettings.findFirst();
    
    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    // Remove immutable fields and mismatched frontend state fields from payload
    const { id, updatedAt, createdAt, scrollSpeedPhysics, faviconUrl, ...updateData } = data;

    const updated = await prisma.themeSettings.update({
      where: { id: settings.id },
      data: updateData
    });

    if (faviconUrl !== undefined) {
      await prisma.$executeRawUnsafe("UPDATE ThemeSettings SET faviconUrl = ? WHERE id = ?", faviconUrl, settings.id);
      (updated as any).faviconUrl = faviconUrl;
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating theme settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
