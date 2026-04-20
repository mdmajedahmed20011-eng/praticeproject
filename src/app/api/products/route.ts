import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get('collectionId');
    const search = searchParams.get('q');
    const status = searchParams.get('status'); // 'active' | 'draft'
    const stock = searchParams.get('stock'); // 'low' | 'out' | 'in'
    
    // Build query conditions
    const whereCondition: any = {};
    
    if (collectionId && collectionId !== 'all') {
      whereCondition.collectionId = collectionId;
    }

    if (search) {
      whereCondition.OR = [
        { title: { contains: search } },
        { sku: { contains: search } },
        { tags: { contains: search } }
      ];
    }

    if (status === 'draft') whereCondition.isDraft = true;
    if (status === 'active') whereCondition.isDraft = false;

    if (stock === 'out') whereCondition.stock = 0;
    if (stock === 'low') whereCondition.stock = { gt: 0, lt: 5 };
    if (stock === 'in') whereCondition.stock = { gte: 5 };
    
    const products = await prisma.product.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: { 
        collection: true,
        variants: true
      }
    });
    
    // Parse JSON strings back into arrays safely
    const formattedProducts = products.map((product) => {
      let images = [];
      let colors = [];
      let sizes = [];

      try { images = JSON.parse(product.images || '[]'); } catch (e) { images = []; }
      try { colors = JSON.parse(product.colors || '[]'); } catch (e) { colors = []; }
      try { sizes = JSON.parse(product.sizes || '[]'); } catch (e) { sizes = []; }

      return {
        ...product,
        images,
        colors,
        sizes
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      title, description, price, compareAtPrice, images, 
      colors, sizes, stock, collectionId, isFeatured, isDraft,
      sku, metaTitle, metaDescription, tags, weight, dimensions,
      displayOrder, variants
    } = body;

    if (!title || !price || !images) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = `${baseSlug}-${Date.now()}`;

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title,
          slug,
          sku: sku || null,
          description,
          price,
          compareAtPrice,
          images: JSON.stringify(images),
          colors: JSON.stringify(colors || []),
          sizes: JSON.stringify(sizes || []),
          stock: Number(stock || 0),
          collectionId: collectionId || null,
          isFeatured: isFeatured || false,
          isDraft: isDraft || false,
          metaTitle,
          metaDescription,
          tags,
          weight: weight ? Number(weight) : null,
          dimensions,
          displayOrder: Number(displayOrder || 0),
        }
      });

      // Handle Variants if provided
      if (variants && Array.isArray(variants) && variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: product.id,
            size: v.size,
            color: v.color,
            sku: v.sku || null,
            price: v.price ? Number(v.price) : null,
            stock: Number(v.stock || 0)
          }))
        });
      }

      return product;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[PRODUCTS_POST]', error);
    if (error.code === 'P2002') {
      return new NextResponse("SKU or Slug already exists", { status: 400 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}

