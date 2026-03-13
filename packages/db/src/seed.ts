import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../apps/server/.env' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create categories
  const categories = [
    { name: 'food', color: 'var(--chart-2)', icon: 'Utensils' },
    { name: 'transport', color: 'var(--chart-3)', icon: 'Car' },
    { name: 'shopping', color: 'var(--chart-1)', icon: 'ShoppingBag' },
    { name: 'housing', color: 'var(--chart-4)', icon: 'Home' },
    { name: 'health', color: 'var(--chart-5)', icon: 'Activity' },
    { name: 'utilities', color: '#8884d8', icon: 'Zap' },
    { name: 'entertainment', color: '#82ca9d', icon: 'Coffee' },
    { name: 'electronics', color: '#ffc658', icon: 'Smartphone' },
    { name: 'income', color: 'var(--success)', icon: 'TrendingUp' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Categories seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });