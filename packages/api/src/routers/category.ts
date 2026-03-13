import { protectedProcedure, publicProcedure, router } from "../index";
import prisma from "@zenspend/db";

export const categoryRouter = router({
  // Get all categories (public - no auth needed)
  getAll: publicProcedure.query(async () => {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }),
});