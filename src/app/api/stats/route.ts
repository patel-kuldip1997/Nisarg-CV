import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [projects, experience, skills, unreadMessages] = await Promise.all([
      prisma.project.count(),
      prisma.experience.count(),
      prisma.skill.count(),
      prisma.message.count({ where: { read: false } })
    ]);

    return NextResponse.json({
      projects,
      experience,
      skills,
      unreadMessages
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
