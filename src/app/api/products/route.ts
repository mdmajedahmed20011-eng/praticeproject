import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    // Build query conditions
    const whereCondition = category ? { category } : {};
    
    const products = await prisma.product.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' }
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
    const { title, description, price, compareAtPrice, images, colors, sizes, stock, category, isFeatured } = body;

    // Basic validation
    if (!title || !price || !images || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Since we are using SQLite, we stringify the object arrays manually
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        compareAtPrice,
        images: JSON.stringify(images),
        colors: JSON.stringify(colors || []),
        sizes: JSON.stringify(sizes || []),
        stock: stock || 10,
        category,
        isFeatured: isFeatured || false,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
