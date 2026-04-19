const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');
  
  // Clean up existing data to prevent duplicates on multiple runs
  await prisma.product.deleteMany();

  const products = [
    {
      title: 'White/Green Printed Cotton Shirt',
      description: 'A premium printed cotton shirt perfect for ethnic or casual wear.',
      price: 854.55,
      compareAtPrice: 1200.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80'
      ]),
      colors: JSON.stringify(['#4ade80', '#ffffff']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      stock: 45,
      category: "Men's Ethnic",
      isFeatured: true
    },
    {
      title: 'Light Cyan Printed Cotton Shirt',
      description: 'Elegant light cyan styling.',
      price: 1109.09,
      compareAtPrice: 1450.00,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=500&q=80'
      ]),
      colors: JSON.stringify(['#67e8f9']),
      sizes: JSON.stringify(['M', 'L']),
      stock: 3,
      category: "Men's Casual",
      isFeatured: false
    },
    {
      title: 'Multicolour Printed Cotton Fitted Shirt',
      description: 'Vibrant multicolor shirt for standing out.',
      price: 1004.55,
      compareAtPrice: null,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=500&q=80'
      ]),
      colors: JSON.stringify(['#f87171', '#fbbf24', '#34d399']),
      sizes: JSON.stringify(['M', 'L', 'XL']),
      stock: 12,
      category: "Men's Casual",
      isFeatured: false
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
