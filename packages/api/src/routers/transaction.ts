import { z } from "zod";
import { protectedProcedure, router } from "../index";
import prisma from "@zenspend/db";

export const transactionRouter = router({
  // Get all transactions for user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.transaction.findMany({
      where: { userId: ctx.session.user.id },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }),

  // Create new transaction
  create: protectedProcedure
    .input(z.object({
      description: z.string(),
      amount: z.number(),
      date: z.string().optional(),
      categoryId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.transaction.create({
        data: {
          description: input.description,
          amount: input.amount,
          date: input.date ? new Date(input.date) : new Date(),
          userId: ctx.session.user.id,
          categoryId: input.categoryId,
        },
        include: { category: true },
      });
    }),

  // Update transaction
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      description: z.string().optional(),
      amount: z.number().optional(),
      date: z.string().optional(),
      categoryId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.transaction.update({
        where: { 
          id: input.id,
          userId: ctx.session.user.id, // Ensure user owns transaction
        },
        data: {
          ...(input.description && { description: input.description }),
          ...(input.amount && { amount: input.amount }),
          ...(input.date && { date: new Date(input.date) }),
          ...(input.categoryId && { categoryId: input.categoryId }),
        },
        include: { category: true },
      });
    }),

  // Delete transaction
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.transaction.delete({
        where: { 
          id: input.id,
          userId: ctx.session.user.id, // Ensure user owns transaction
        },
      });
    }),

  // Get spending by category
  getSpendingByCategory: protectedProcedure.query(async ({ ctx }) => {
    const result = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { 
        userId: ctx.session.user.id,
        amount: { lt: 0 }, // Only expenses
      },
      _sum: { amount: true },
      _count: true,
    });

    // Get category details
    const categories = await prisma.category.findMany();
    
    return result.map(item => {
      const category = categories.find(c => c.id === item.categoryId);
      return {
        category: category?.name || 'unknown',
        amount: Math.abs(item._sum.amount || 0),
        count: item._count,
        color: category?.color,
      };
    });
  }),
});