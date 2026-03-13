import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../prisma/generated/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../apps/server/.env' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function addTestTransactions() {
  try {
    // Get categories
    const categories = await prisma.category.findMany();
    
    if (categories.length === 0) {
      console.log('No categories found. Please run seed first.');
      return;
    }

    // Get a test user (you'll need to register first)
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      console.log('No users found. Please register a user first.');
      return;
    }

    const user = users[0];
    const foodCategory = categories.find(c => c.name === 'food');
    const transportCategory = categories.find(c => c.name === 'transport');
    const shoppingCategory = categories.find(c => c.name === 'shopping');

    // Add test transactions
    const testTransactions = [
      {
        description: 'Grocery Shopping',
        amount: -85.50,
        userId: user.id,
        categoryId: foodCategory?.id || categories[0].id,
        date: new Date('2024-01-15'),
      },
      {
        description: 'Uber Ride',
        amount: -25.00,
        userId: user.id,
        categoryId: transportCategory?.id || categories[1].id,
        date: new Date('2024-01-14'),
      },
      {
        description: 'Amazon Purchase',
        amount: -120.00,
        userId: user.id,
        categoryId: shoppingCategory?.id || categories[2].id,
        date: new Date('2024-01-13'),
      },
      {
        description: 'Salary Deposit',
        amount: 3500.00,
        userId: user.id,
        categoryId: categories.find(c => c.name === 'income')?.id || categories[0].id,
        date: new Date('2024-01-01'),
      },
    ];

    for (const tx of testTransactions) {
      await prisma.transaction.create({
        data: tx,
      });
    }

    console.log('Test transactions added successfully!');
  } catch (error) {
    console.error('Error adding test transactions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestTransactions();