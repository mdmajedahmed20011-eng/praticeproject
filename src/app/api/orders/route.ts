import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('q');

    const whereCondition: any = {};
    if (status && status !== 'all') {
      whereCondition.status = status;
    }

    if (search) {
      whereCondition.OR = [
        { id: { contains: search } },
        { guestName: { contains: search } },
        { guestEmail: { contains: search } },
        { customer: { name: { contains: search } } }
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereCondition,
      include: {
        items: true,
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ORDERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, totalAmount, items } = body;

    if (!items || !items.length) {
      return new NextResponse("No order items", { status: 400 });
    }
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const discountAmount = Number(body.discountAmount) || 0;
    const finalTotal = Number(totalAmount) || Math.max(0, subtotal - discountAmount); // Simplified. Shipping isn't handled here precisely but backend accepts totalAmount from body or calcs it.

    const order = await prisma.order.create({
      data: {
        guestName: body.customerName || "Guest",
        guestEmail: body.customerEmail || "guest@example.com",
        guestPhone: body.customerPhone || "",
        shippingAddress: body.shippingAddress || "",
        subtotal: subtotal,
        discountAmount: discountAmount,
        totalAmount: finalTotal,
        status: "PENDING",
        paymentMethod: body.paymentMethod || "COD",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            size: item.selectedSize || null,
            color: item.selectedColor || null
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDERS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
