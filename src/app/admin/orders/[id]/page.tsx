import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import OrderDetailsClient from './OrderDetailsClient';
import { connection } from 'next/server';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return <OrderDetailsClient order={order} />;
}
