import { PrismaClient } from '@prisma/client';

const mockPrisma = {
  category: {
    findUnique: async () => {
      await new Promise(r => setTimeout(r, 50));
      return { id: 1, slug: 'test' };
    }
  },
  article: {
    findMany: async () => {
      await new Promise(r => setTimeout(r, 100));
      return [];
    },
    count: async () => {
      await new Promise(r => setTimeout(r, 30));
      return 0;
    }
  }
} as unknown as PrismaClient;

async function runBaseline() {
  const start = performance.now();

  const category = await mockPrisma.category.findUnique({
    where: { slug: 'test' }
  });
  if (!category) return;

  const [articles, total] = await Promise.all([
    mockPrisma.article.findMany({
      where: { categoryId: category.id, status: 'PUBLISHED' }
    }),
    mockPrisma.article.count({ where: { categoryId: category.id, status: 'PUBLISHED' } })
  ]);

  const end = performance.now();
  return end - start;
}

async function runOptimized() {
  const start = performance.now();

  const slug = 'test';
  const [category, articles, total] = await Promise.all([
    mockPrisma.category.findUnique({
      where: { slug }
    }),
    mockPrisma.article.findMany({
      where: { category: { slug }, status: 'PUBLISHED' }
    }),
    mockPrisma.article.count({ where: { category: { slug }, status: 'PUBLISHED' } })
  ]);

  if (!category) return;

  const end = performance.now();
  return end - start;
}

async function run() {
  // warm up
  await runBaseline();
  await runOptimized();

  let baseTime = 0;
  let optTime = 0;

  for(let i=0; i<5; i++) {
    baseTime += await runBaseline() ?? 0;
    optTime += await runOptimized() ?? 0;
  }

  console.log(`Baseline average: ${baseTime / 5} ms`);
  console.log(`Optimized average: ${optTime / 5} ms`);
}

run();
