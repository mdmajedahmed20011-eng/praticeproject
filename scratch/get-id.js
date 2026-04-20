const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst();
  if (product) {
    console.log('PRODUCT_ID=' + product.id);
  } else {
    console.log('NO_PRODUCT_FOUND');
  }
  await prisma.$disconnect();
}

main();
