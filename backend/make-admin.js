import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function makeAdmin() {
  const users = await prisma.user.updateMany({
    data: { role: 'admin' }
  });
  console.log(`Updated ${users.count} users to admin role.`);
}

makeAdmin().catch(console.error).finally(() => prisma.$disconnect());
