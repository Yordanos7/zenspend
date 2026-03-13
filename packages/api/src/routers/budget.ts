import { z } from "zod";
import { protectedProcedure, router } from "../index";
import prisma from "@zenspend/db";

export const budgetRouter = router({
  // Get all budgets for user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const budgets = await prisma.budget.findMany({
      where: { userId: ctx.session.user.id },
      include: { category: true },
    });

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            userId: ctx.session.user.id,
            categoryId: budget.categoryId,
            amount: { lt: 0 }, // Only expenses
            date: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Current month
            },
          },
          _sum: { amount: true },
        });

        return {
          ...budget,
          spent: Math.abs(spent._sum.amount || 0),
          percentage: Math.round((Math.abs(spent._sum.amount || 0) / budget.limit) * 100),
        };
      })
    );

    return budgetsWithSpent;
  }),

  // Create new budget
  create: protectedProcedure
    .input(z.object({
      limit: z.number().positive(),
      categoryId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.budget.create({
        data: {
          limit: input.limit,
          userId: ctx.session.user.id,
          categoryId: input.categoryId,
        },
        include: { category: true },
      });
    }),

  // Update budget
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      limit: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.budget.update({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: { limit: input.limit },
        include: { category: true },
      });
    }),

  // Delete budget
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.budget.delete({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
});