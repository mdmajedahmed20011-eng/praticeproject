import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductForm from '../ProductForm';
import { connection } from 'next/server';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      collection: true
    }
  });

  if (!product) {
    notFound();
  }

  // Parse JSON strings for the client form
  const initialData = {
    ...product,
    images: JSON.parse(product.images),
    colors: product.colors ? JSON.parse(product.colors) : [],
    sizes: product.sizes ? JSON.parse(product.sizes) : []
  };

  return <ProductForm initialData={initialData} isEditing={true} />;
}
