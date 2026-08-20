import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sections = await prisma.customSection.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch custom sections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Remove id if present so Prisma generates it
    const { id, ...createData } = data;
    
    const newSection = await prisma.customSection.create({
      data: createData
    });
    return NextResponse.json(newSection);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const updatedSection = await prisma.customSection.update({
      where: { id },
      data: updateData
    });
    return NextResponse.json(updatedSection);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}
