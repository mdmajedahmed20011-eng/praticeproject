import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const discounts = await prisma.discount.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(discounts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { code, type, value, minOrderVal, maxUses, expiresAt, isActive } = data;

    if (!code || !type || !value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const discount = await prisma.discount.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: Number(value),
        minOrderVal: minOrderVal ? Number(minOrderVal) : null,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive ?? true
      }
    });

    return NextResponse.json(discount, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Discount code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}
