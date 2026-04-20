import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = 'https://luxeaura.com';
  
  const products = await prisma.product.findMany({
    where: { isDraft: false },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      createdAt: true
    }
  });

  const rssItems = products.map(product => `
    <item>
      <title><![CDATA[${product.title}]]></title>
      <link>${baseUrl}/product/${product.id}</link>
      <guid>${baseUrl}/product/${product.id}</guid>
      <pubDate>${product.createdAt.toUTCString()}</pubDate>
      <description><![CDATA[${product.description.substring(0, 500)}...]]></description>
      <price>৳ ${product.price}</price>
    </item>
  `).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>LuxeAura | Premium Luxury Collection</title>
        <link>${baseUrl}</link>
        <description>The latest luxury arrivals in fashion, ethnic wear, and home decor.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
      </channel>
    </rss>
  `;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  });
}
