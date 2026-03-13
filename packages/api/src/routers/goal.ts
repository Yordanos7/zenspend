import { z } from "zod";
import { protectedProcedure, router } from "../index";
import prisma from "@zenspend/db";

export const goalRouter = router({
  // Get all goals for user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.goal.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),

  // Create new goal
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      target: z.number().positive(),
      current: z.number().default(0),
      deadline: z.string().optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.goal.create({
        data: {
          name: input.name,
          target: input.target,
          current: input.current,
          deadline: input.deadline ? new Date(input.deadline) : null,
          color: input.color,
          icon: input.icon,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Update goal progress
  updateProgress: protectedProcedure
    .input(z.object({
      id: z.string(),
      amount: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.goal.update({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          current: { increment: input.amount },
        },
      });
    }),

  // Update goal details
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      target: z.number().positive().optional(),
      deadline: z.string().optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.goal.update({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          ...(input.name && { name: input.name }),
          ...(input.target && { target: input.target }),
          ...(input.deadline && { deadline: new Date(input.deadline) }),
          ...(input.color && { color: input.color }),
          ...(input.icon && { icon: input.icon }),
        },
      });
    }),

  // Delete goal
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.goal.delete({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),
});