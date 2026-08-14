import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.education.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newData = await prisma.education.create({ data });
    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}
