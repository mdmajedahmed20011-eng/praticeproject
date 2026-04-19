const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@luxeaura.com';
  const password = 'password123';

  console.log('Checking database...');
  
  try {
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log('Admin already exists! You can log in with:');
      console.log('Email:', email);
      // We can't show password if it's already there, but we can update it to be sure
      const hashed = await bcrypt.hash(password, 10);
      await prisma.adminUser.update({
        where: { email },
        data: { password: hashed }
      });
      console.log('Password has been reset to:', password);
    } else {
      const hashed = await bcrypt.hash(password, 10);
      await prisma.adminUser.create({
        data: {
          email,
          password: hashed,
          name: 'Super Admin',
          role: 'SUPERADMIN'
        }
      });
      console.log('Admin user created successfully.');
      console.log('Email:', email);
      console.log('Password:', password);
    }
  } catch (error) {
    if (error.code === 'P2021') {
      console.error('The table does not exist. You need to run `npx prisma db push` first.');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
