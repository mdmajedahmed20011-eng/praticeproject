import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://luxeaura.com'; // In production, this would be your domain

  // 1. Core Pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/collections',
    '/wishlist',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Products
  let productEntries: any[] = [];
  try {
     const products = await prisma.product.findMany({
       select: { id: true, updatedAt: true },
       where: { isDraft: false }
     });
     productEntries = products.map((p) => ({
       url: `${baseUrl}/product/${p.id}`,
       lastModified: p.updatedAt,
       changeFrequency: 'daily' as const,
       priority: 0.7,
     }));
  } catch (e) {
     console.error('Sitemap product fetch failed');
  }

  // 3. Dynamic Collections
  let collectionEntries: any[] = [];
  try {
     const collections = await prisma.collection.findMany({
       select: { slug: true, updatedAt: true },
       where: { isActive: true }
     });
     collectionEntries = collections.map((c) => ({
       url: `${baseUrl}/collections/${c.slug}`,
       lastModified: c.updatedAt,
       changeFrequency: 'weekly' as const,
       priority: 0.9,
     }));
  } catch (e) {
     console.error('Sitemap collection fetch failed');
  }

  return [...staticPages, ...productEntries, ...collectionEntries];
}
