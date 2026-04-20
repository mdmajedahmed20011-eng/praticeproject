import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProductClient from './ProductClient';

interface ProductPageProps {
  params: { id: string };
}

// ── Dynamic Metadata API ──
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // We try to fetch from DB, fallback to mock logic if needed for safety
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { collection: true }
    });

    if (!product) {
      return {
        title: 'Product Not Found | LuxeAura',
        description: 'The requested luxury item is currently unavailable.'
      };
    }

    return {
      title: `${product.title} - ${product.collection?.name || 'LuxeAura Premium'}`,
      description: product.description.substring(0, 160).replace(/<[^>]*>/g, ''),
      openGraph: {
        title: product.title,
        description: product.description.substring(0, 160).replace(/<[^>]*>/g, ''),
        images: [JSON.parse(product.images)[0]],
        type: 'article',
      },
    };
  } catch (error) {
    // Fallback for safety during Windows file-lock issues
    return {
      title: 'Premium Product | LuxeAura Luxury',
      description: 'Discover the latest in premium fashion and lifestyle at LuxeAura.'
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: any = null;

  try {
    product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { collection: true }
    });

    if (product) {
      // Format image URLs from stringified JSON if stored that way
      product = {
        ...product,
        images: JSON.parse(product.images),
        sizes: product.sizes ? JSON.parse(product.sizes) : ['S', 'M', 'L', 'XL'],
        colors: product.colors ? JSON.parse(product.colors) : ['#000000', '#FFFFFF']
      };
    }
  } catch (e) {
    console.error('[PRODUCT_FETCH_ERROR]', e);
  }

  // If no product found, show error instead of fake mock data
  if (!product) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#fff', height: '60vh' }}>
        <h1 style={{ fontFamily: 'Inter', fontSize: '2rem', marginBottom: '1rem' }}>Product Not Found</h1>
        <p style={{ color: '#666' }}>The luxury item you are looking for is currently unavailable or has been removed.</p>
        <a href="/" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 25px', backgroundColor: '#000', color: '#fff', textDecoration: 'none' }}>Back to Home</a>
      </div>
    );
  }

  return <ProductClient product={product} />;
}
