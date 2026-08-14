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
          buttonStyle: "filled"
        }
      });
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

    const updated = await prisma.themeSettings.update({
      where: { id: settings.id },
      data: {
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        backgroundColor: data.backgroundColor,
        fontFamily: data.fontFamily,
        backgroundAnimation: data.backgroundAnimation,
        enableParallax: data.enableParallax,
        cardStyle: data.cardStyle,
        borderRadius: data.borderRadius,
        buttonStyle: data.buttonStyle
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating theme settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
