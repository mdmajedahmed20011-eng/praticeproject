import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      },
      include: {
        _count: {
          select: { orders: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Customer API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
      }
    });
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: 'Duplicate or Invalid Data' }, { status: 400 });
  }
}
