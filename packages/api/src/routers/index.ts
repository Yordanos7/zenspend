import { protectedProcedure, publicProcedure, router } from "../index";
import { transactionRouter } from "./transaction";
import { budgetRouter } from "./budget";
import { categoryRouter } from "./category";
import { goalRouter } from "./goal";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  
  // Feature routers
  transaction: transactionRouter,
  budget: budgetRouter,
  category: categoryRouter,
  goal: goalRouter,
});
export type AppRouter = typeof appRouter;
