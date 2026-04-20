import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProductClient from './ProductClient';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// ── Dynamic Metadata API ──
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  // We try to fetch from DB, fallback to mock logic if needed for safety
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { collection: true }
    });

    if (!product) {
      return {
        title: 'Product Not Found | LuxeAura',
        description: 'The requested luxury item is currently unavailable.'
      };
    }

    const images = product.images ? JSON.parse(product.images) : [];

    return {
      title: `${product.title} - ${product.collection?.name || 'LuxeAura Premium'}`,
      description: product.description.substring(0, 160).replace(/<[^>]*>/g, ''),
      openGraph: {
        title: product.title,
        description: product.description.substring(0, 160).replace(/<[^>]*>/g, ''),
        images: images.length > 0 ? [images[0]] : [],
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
  const { id } = await params;
  let product: any = null;

  try {
    product = await prisma.product.findUnique({
      where: { id },
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

  // If no product found, show luxury error instead of fake mock data
  if (!product) {
    return (
      <div className="luxury-error-state" style={{ 
        padding: '120px 20px', 
        textAlign: 'center', 
        backgroundColor: '#fff', 
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          fontFamily: 'var(--font-playfair)', 
          fontSize: '3rem', 
          fontWeight: 300,
          marginBottom: '1.5rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          Vanished into <br/> Elegance
        </h1>
        <p style={{ 
          color: '#888', 
          maxWidth: '400px', 
          lineHeight: '1.8',
          fontSize: '1rem',
          letterSpacing: '0.01em',
          marginBottom: '2.5rem'
        }}>
          The luxury item you seek is no longer in our current curation. 
          Discover our latest acquisitions instead.
        </p>
        <a href="/collections" style={{ 
          display: 'inline-block', 
          padding: '15px 40px', 
          backgroundColor: '#000', 
          color: '#fff', 
          textDecoration: 'none',
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          Explore Collections
        </a>
      </div>
    );
  }

  return <ProductClient product={product} />;
}
