import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.skill.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const updatedSkill = await prisma.skill.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        level: data.level,
        categoryId: data.categoryId,
        technologies: data.technologies,
        icon: data.icon,
      },
    });
    return NextResponse.json(updatedSkill, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}
