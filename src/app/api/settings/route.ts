import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: "global" }
    });

    if (!settings) {
      // Create defaults fallback
      settings = await prisma.siteSetting.create({
        data: { id: "global" }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('[SETTINGS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'SUPERADMIN') {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const settings = await prisma.siteSetting.upsert({
      where: { id: "global" },
      update: body,
      create: {
        id: "global",
        ...body
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('[SETTINGS_PUT]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
