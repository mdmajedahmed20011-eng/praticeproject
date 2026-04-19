import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { name, slug, description, coverImage, isActive } = data;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description,
        coverImage,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error: any) {
    console.error('Error creating collection:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Collection name or slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
