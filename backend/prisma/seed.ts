import 'dotenv/config';
import { Role } from '@prisma/client';
import { createPrismaClient } from '../src/prisma/create-prisma-client';

const prisma = createPrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@aampere.com',
        passwordHash: 'password123',
        role: Role.ADMIN,
        name: 'Aampere Admin',
      },
      {
        email: 'dealer1@example.com',
        passwordHash: 'password123',
        role: Role.DEALER,
        name: 'Dealer One',
      },
      {
        email: 'dealer2@example.com',
        passwordHash: 'password123',
        role: Role.DEALER,
        name: 'Dealer Two',
      },
    ],
  });

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
