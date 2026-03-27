import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  const slug = 'test';
  const a = await prisma.article.findMany({
    where: { category: { slug }, status: 'PUBLISHED' }
  });
}
