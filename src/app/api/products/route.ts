import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get('collectionId');
    type ProductWithCollection = Prisma.ProductGetPayload<{ include: { collection: true } }>;
    
    // Build query conditions
    const whereCondition = collectionId ? { collectionId } : {};
    
    const products: ProductWithCollection[] = await prisma.product.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: { collection: true }
    });
    
    // Parse the JSON strings back into arrays before sending to frontend
    const formattedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images),
      colors: product.colors ? JSON.parse(product.colors) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : []
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, compareAtPrice, images, colors, sizes, stock, collectionId, isFeatured } = body;

    // Basic validation
    if (!title || !price || !images) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    // Since we are using SQLite, we stringify the object arrays manually
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        compareAtPrice,
        images: JSON.stringify(images),
        colors: JSON.stringify(colors || []),
        sizes: JSON.stringify(sizes || []),
        stock: stock || 10,
        collectionId: collectionId || null,
        isFeatured: isFeatured || false,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
