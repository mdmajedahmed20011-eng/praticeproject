import { connection } from 'next/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Metadata } from 'next';
import styles from './page.module.css';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.q || '';
  return {
    title: query ? `Search: ${query} | LuxeAura` : 'Search Luxury Products | LuxeAura',
    description: query 
      ? `Explore search results for "${query}" at LuxeAura. Discover premium fashion and lifestyle products.` 
      : 'Search our curated collection of premium luxury fashion, ethnic wear, and home decor.',
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await connection();
  const params = await searchParams;
  const query = params?.q || '';

  let products: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: string;
  }> = [];

  if (query) {
    try {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
          isDraft: false,
        },
        select: { id: true, title: true, slug: true, price: true, compareAtPrice: true, images: true },
        take: 20,
      });
    } catch (error) {
      console.error('[SEARCH_ERROR]', error);
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <span className={styles.label}>SEARCH RESULTS</span>
        <h1 className={styles.title}>
          {query ? `Results for "${query}"` : 'Search Products'}
        </h1>
        {query && <p className={styles.subtitle}>{products.length} products found</p>}
      </section>

      <div className={styles.container}>
        {!query ? (
          <div className={styles.emptyState}>
            <p>Use the search bar above to find products.</p>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No products found</h2>
            <p>Try a different search term or browse our collections.</p>
            <Link href="/collections" className={styles.shopBtn}>Browse Collections</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => {
              const images = JSON.parse(product.images || '[]');
              const img = images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=400';
              return (
                <Link href={`/product/${product.id}`} key={product.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={product.title} className={styles.image} />
                  </div>
                  <div className={styles.info}>
                    <h3>{product.title}</h3>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>৳ {product.price.toLocaleString()}</span>
                      {product.compareAtPrice && (
                        <span className={styles.comparePrice}>৳ {product.compareAtPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
