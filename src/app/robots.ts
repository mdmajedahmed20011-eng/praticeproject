import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
        '/checkout/success', // Prevent indexing success pages
        '/_next/',
      ],
    },
    sitemap: 'https://luxeaura.com/sitemap.xml',
  };
}
