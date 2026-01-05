import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'password123'; // Default password
  const hashedPassword = await bcrypt.hash(password, 10);

  const officer = await prisma.officer.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: hashedPassword,
      name: 'School Officer',
    },
  });

  console.log({ officer });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
