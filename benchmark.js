const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const start = performance.now();
  // Simulate the request

  const end = performance.now();
  console.log(`Execution time: ${end - start} ms`);
}

run();
