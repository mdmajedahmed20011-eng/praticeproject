import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { 
        collection: true,
        variants: true
      }
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const formattedProduct = {
      ...product,
      images: JSON.parse(product.images),
      colors: product.colors ? JSON.parse(product.colors) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : []
    };
    
    return NextResponse.json(formattedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    
    const { 
      title, slug, sku, description, price, compareAtPrice, 
      images, colors, sizes, stock, isFeatured, isDraft, collectionId,
      metaTitle, metaDescription, tags, weight, dimensions, 
      displayOrder, variants 
    } = data;

    // Use transaction to update product and its variants
    const result = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
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
          stock,
          isFeatured,
          isDraft,
          collectionId,
          metaTitle,
          metaDescription,
          tags,
          weight: weight ? Number(weight) : null,
          dimensions,
          displayOrder: Number(displayOrder || 0),
        },
      });

      // Handle Variants if provided
      if (variants && Array.isArray(variants)) {
        // Delete old variants and recreat (simpler for this version, or update existing)
        await tx.productVariant.deleteMany({ where: { productId: id } });
        
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((v: any) => ({
              productId: id,
              size: v.size,
              color: v.color,
              sku: v.sku || null,
              price: v.price ? Number(v.price) : null,
              stock: Number(v.stock || 0)
            }))
          });
        }
      }

      return updatedProduct;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === 'P2002') {
      const target = error.meta?.target || '';
      if (target.includes('slug')) return NextResponse.json({ error: 'Product slug already exists' }, { status: 400 });
      if (target.includes('sku')) return NextResponse.json({ error: 'SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

