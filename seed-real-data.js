const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Data Seeding...');

  // 1. CLEAR EXISTING DATA (Optional, but helps keep tests clean)
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.collection.deleteMany({});

  // 2. CREATE COLLECTIONS
  console.log('📦 Creating Collections...');
  const collections = await Promise.all([
    prisma.collection.create({
      data: {
        name: 'Heritage Luxe',
        slug: 'heritage-luxe',
        description: 'Timeless traditional wear and ethnic classics, handcrafted by master artisans.',
        coverImage: 'https://images.unsplash.com/photo-1583391733958-69213190fc53?w=800',
        isActive: true,
      }
    }),
    prisma.collection.create({
      data: {
        name: 'Silk Elegance',
        slug: 'silk-elegance',
        description: 'Premium silk collections for special occasions and royal celebrations.',
        coverImage: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=800',
        isActive: true,
      }
    }),
    prisma.collection.create({
      data: {
        name: 'Regal Home Decor',
        slug: 'regal-home',
        description: 'Elegant lifestyle products and artisan-made decor for your sanctuary.',
        coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
        isActive: true,
      }
    })
  ]);

  // 3. CREATE PRODUCTS
  console.log('💎 Creating Products...');
  const productsData = [
    {
      title: 'Maharaja Silk Panjabi',
      slug: 'maharaja-silk-panjabi',
      description: '<p>Experience royal elegance with our Maharaja Silk Panjabi. Featuring hand-embroidered necklines and premium mulberry silk fabric.</p>',
      price: 8500,
      compareAtPrice: 12000,
      sku: 'MH-PJ-001',
      images: JSON.stringify(['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800']),
      colors: JSON.stringify(['#F5DEB3', '#800000']),
      sizes: JSON.stringify(['M', 'L', 'XL']),
      collectionId: collections[0].id,
      isFeatured: true,
      metaTitle: 'Maharaja Silk Panjabi - Traditional Luxury | LuxeAura',
      metaDescription: 'Shop the exquisite Maharaja Silk Panjabi. Hand-embroidered and crafted for the modern individual who values heritage.'
    },
    {
      title: 'Banarasi Gold Katan Saree',
      slug: 'banarasi-gold-katan',
      description: '<p>A masterpiece of weaving. This Banarasi Gold Katan saree features intricate zari work and a rich pallu for the grandest celebrations.</p>',
      price: 25000,
      compareAtPrice: 35000,
      sku: 'BN-SR-99',
      images: JSON.stringify(['https://images.unsplash.com/photo-1583391733958-69213190fc53?w=800']),
      colors: JSON.stringify(['#FFD700', '#B22222']),
      sizes: JSON.stringify(['Free Size']),
      collectionId: collections[1].id,
      isFeatured: true,
      metaTitle: 'Banarasi Gold Katan Saree - Royal Wedding Collection',
      metaDescription: 'Discover the elegance of Banarasi silk. Authentic Katan silk with real gold zari work.'
    },
    {
      title: 'Midnight Velvet Sherwani',
      slug: 'midnight-velvet-sherwani',
      description: '<p>Make a statement in high-fashion luxury with our Midnight Velvet Sherwani. Tailored to perfection with zardosi highlights.</p>',
      price: 45000,
      sku: 'SH-VN-10',
      images: JSON.stringify(['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800']),
      colors: JSON.stringify(['#191970', '#000000']),
      sizes: JSON.stringify(['L', 'XL', 'XXL']),
      collectionId: collections[0].id,
      isFeatured: false,
    },
    {
      title: 'Antique Brass Vase Set',
      slug: 'antique-brass-vase',
      description: '<p>Elevate your home sanctuary with this three-piece antique brass vase set. Hand-beaten by rural artisans using traditional techniques.</p>',
      price: 12500,
      compareAtPrice: 15000,
      sku: 'HO-BV-01',
      images: JSON.stringify(['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800']),
      colors: JSON.stringify(['#B87333']),
      sizes: JSON.stringify(['Standard']),
      collectionId: collections[2].id,
      isFeatured: false,
    },
    {
      title: 'Kashmiri Pashmina Shawl',
      slug: 'kashmiri-pashmina-shawl',
      description: '<p>The softest touch of luxury. 100% authentic Kashmiri Pashmina, hand-woven and naturally dyed for ultimate warmth and style.</p>',
      price: 18000,
      compareAtPrice: 22000,
      sku: 'AC-PS-05',
      images: JSON.stringify(['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800']),
      colors: JSON.stringify(['#F5F5DC', '#D2B48C']),
      sizes: JSON.stringify(['Large']),
      collectionId: collections[1].id,
      isFeatured: true,
    }
  ];

  const products = [];
  for (const pData of productsData) {
    const product = await prisma.product.create({ data: pData });
    products.push(product);
    
    // Create Variants
    const colors = JSON.parse(pData.colors || '[]');
    const sizes = JSON.parse(pData.sizes || '[]');
    
    for (const size of sizes) {
      for (const color of colors) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size,
            color,
            stock: 20,
            price: product.price,
            sku: `${pData.sku}-${size}-${color}`.replace('#', '')
          }
        });
      }
    }
  }

  // 4. CREATE CUSTOMERS & ORDERS
  console.log('🛍️ Creating Orders...');
  const customers = await Promise.all([
    prisma.customer.create({ data: { name: 'Majed Ahmed', email: 'majed@example.com', phone: '01711111111', totalSpent: 8500 } }),
    prisma.customer.create({ data: { name: 'Sara Rahman', email: 'sara@example.com', phone: '01722222222', totalSpent: 25000 } })
  ]);

  const ordersData = [
    { 
      customerId: customers[0].id, 
      shippingAddress: 'Gulshan 2, Dhaka', 
      subtotal: 8500, totalAmount: 8500, status: 'DELIVERED', 
      items: [{ productId: products[0].id, quantity: 1, price: 8500, size: 'L', color: '#F5DEB3' }] 
    },
    { 
      guestName: 'Zubair Khan', guestEmail: 'zubair@test.com', shippingAddress: 'Banani, Dhaka', 
      subtotal: 45000, totalAmount: 45000, status: 'SHIPPED', 
      items: [{ productId: products[2].id, quantity: 1, price: 45000, size: 'XL', color: '#191970' }] 
    },
    { 
      customerId: customers[1].id, shippingAddress: 'Dhanmondi, Dhaka', 
      subtotal: 25000, totalAmount: 25000, status: 'PROCESSING', 
      items: [{ productId: products[1].id, quantity: 1, price: 25000, size: 'Free Size', color: '#FFD700' }] 
    },
    { 
      guestName: 'Anika Roy', guestEmail: 'anika@hello.com', shippingAddress: 'Uttara, Dhaka', 
      subtotal: 12500, totalAmount: 12500, status: 'PENDING', 
      items: [{ productId: products[3].id, quantity: 1, price: 12500, size: 'Standard', color: '#B87333' }] 
    },
    { 
      customerId: customers[0].id, shippingAddress: 'Sylhet, BD', 
      subtotal: 18000, totalAmount: 18000, status: 'PENDING', 
      items: [{ productId: products[4].id, quantity: 1, price: 18000, size: 'Large', color: '#F5F5DC' }] 
    }
  ];

  for (const oData of ordersData) {
    const { items, ...orderInfo } = oData;
    const order = await prisma.order.create({ data: orderInfo });
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          ...item
        }
      });
    }
  }

  console.log('✅ Seeding Complete! Enjoy your premium store data.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
