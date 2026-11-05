import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, createdAt, updatedAt, ...cleanData } = data;
    const existingProfile = await prisma.profile.findFirst();
    
    if (existingProfile) {
      const updatedProfile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: cleanData
      });
      return NextResponse.json(updatedProfile);
    } else {
      const newProfile = await prisma.profile.create({ data: cleanData });
      return NextResponse.json(newProfile);
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
