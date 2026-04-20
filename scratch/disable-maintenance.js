const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.siteSetting.update({
    where: { id: 'global' },
    data: { maintenanceMode: false }
  });
  console.log('Maintenance mode disabled');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
