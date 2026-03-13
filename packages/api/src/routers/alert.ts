import { z } from "zod";
import { protectedProcedure, router } from "../index";
import prisma from "@zenspend/db";

export const alertRouter = router({
  // Get all alerts for user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.alert.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),

  // Create new alert
  create: protectedProcedure
    .input(z.object({
      type: z.enum(['WARNING', 'INFO', 'SUCCESS']),
      title: z.string(),
      message: z.string(),
      action: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.alert.create({
        data: {
          type: input.type,
          title: input.title,
          message: input.message,
          action: input.action,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Mark alert as read
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.alert.update({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: { isRead: true },
      });
    }),

  // Delete alert
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.alert.delete({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Generate budget alerts based on current spending
  generateBudgetAlerts: protectedProcedure.mutation(async ({ ctx }) => {
    const budgets = await prisma.budget.findMany({
      where: { userId: ctx.session.user.id },
      include: { category: true },
    });

    const alerts = [];

    for (const budget of budgets) {
      // Calculate current month spending
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const spent = await prisma.transaction.aggregate({
        where: {
          userId: ctx.session.user.id,
          categoryId: budget.categoryId,
          amount: { lt: 0 }, // Only expenses
          date: { gte: startOfMonth },
        },
        _sum: { amount: true },
      });

      const totalSpent = Math.abs(spent._sum.amount || 0);
      const percentage = (totalSpent / budget.limit) * 100;

      // Generate alerts based on spending percentage
      if (percentage >= 100) {
        alerts.push({
          type: 'WARNING' as const,
          title: 'Budget Exceeded',
          message: `You've exceeded your ${budget.category.name} budget by Birr ${(totalSpent - budget.limit).toLocaleString()}`,
          action: 'Adjust Budget',
        });
      } else if (percentage >= 80) {
        alerts.push({
          type: 'WARNING' as const,
          title: 'Budget Alert',
          message: `You've used ${percentage.toFixed(0)}% of your ${budget.category.name} budget`,
          action: 'View Details',
        });
      } else if (percentage >= 50) {
        alerts.push({
          type: 'INFO' as const,
          title: 'Budget Update',
          message: `You've used ${percentage.toFixed(0)}% of your ${budget.category.name} budget`,
          action: 'View Progress',
        });
      }
    }

    // Create alerts in database
    for (const alert of alerts) {
      // Check if similar alert already exists
      const existingAlert = await prisma.alert.findFirst({
        where: {
          userId: ctx.session.user.id,
          title: alert.title,
          message: alert.message,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      if (!existingAlert) {
        await prisma.alert.create({
          data: {
            ...alert,
            userId: ctx.session.user.id,
          },
        });
      }
    }

    return { alertsGenerated: alerts.length };
  }),
});