import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../index";
import { n8nService } from "../services/n8n-integration";

export const automationRouter = router({
  // Health check for n8n connection
  healthCheck: publicProcedure.query(async () => {
    const health = await n8nService.healthCheck();
    return {
      n8nConnected: health.success,
      status: health.success ? 'connected' : 'disconnected',
      error: health.error || null,
    };
  }),

  // Trigger automatic transaction categorization
  categorizeTransaction: protectedProcedure
    .input(z.object({
      transactionId: z.string(),
      description: z.string(),
      amount: z.number(),
      currentCategory: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await n8nService.categorizeTransaction({
        id: input.transactionId,
        description: input.description,
        amount: input.amount,
        category: input.currentCategory,
      });

      return {
        success: result.success,
        suggestedCategory: result.suggestedCategory,
        confidence: result.confidence,
        error: result.error,
      };
    }),

  // Process receipt with OCR
  processReceipt: protectedProcedure
    .input(z.object({
      imageData: z.string(), // Base64 encoded image
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const result = await n8nService.processReceipt(input.imageData, input.userId);

      return {
        success: result.success,
        transaction: result.transaction,
        confidence: result.confidence,
        processingTime: result.processingTime,
        error: result.error,
      };
    }),

  // Trigger budget monitoring
  triggerBudgetMonitoring: protectedProcedure
    .mutation(async () => {
      const result = await n8nService.triggerBudgetMonitoring();

      return {
        success: result.success,
        executionId: result.executionId,
        message: result.success 
          ? 'Budget monitoring workflow triggered successfully' 
          : 'Failed to trigger budget monitoring',
        error: result.error,
      };
    }),

  // Auto-categorize all uncategorized transactions
  autoCategorizeBatch: protectedProcedure
    .input(z.object({
      transactionIds: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const results = [];
      
      for (const transactionId of input.transactionIds) {
        // This would typically fetch transaction details first
        // For now, we'll simulate the process
        const result = await n8nService.categorizeTransaction({
          id: transactionId,
          description: 'Sample transaction',
          amount: 50,
        });
        
        results.push({
          transactionId,
          ...result,
        });
      }

      const successCount = results.filter(r => r.success).length;
      
      return {
        success: successCount > 0,
        processed: results.length,
        successful: successCount,
        failed: results.length - successCount,
        results,
      };
    }),

  // Get automation statistics
  getStats: protectedProcedure.query(async () => {
    // This would typically fetch from database
    // For now, return mock statistics
    return {
      totalAutomations: 3,
      activeWorkflows: 3,
      transactionsProcessed: 156,
      receiptsProcessed: 23,
      budgetAlertsGenerated: 8,
      averageProcessingTime: 2.3, // seconds
      automationSavings: 45, // minutes saved
      lastProcessed: new Date().toISOString(),
    };
  }),

  // Configure automation settings
  updateSettings: protectedProcedure
    .input(z.object({
      autoCategorization: z.boolean().optional(),
      budgetMonitoring: z.boolean().optional(),
      receiptProcessing: z.boolean().optional(),
      notificationPreferences: z.object({
        email: z.boolean(),
        push: z.boolean(),
        sms: z.boolean(),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // This would typically save to database
      // For now, return success
      return {
        success: true,
        message: 'Automation settings updated successfully',
        settings: input,
      };
    }),

  // Get automation settings
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    // This would typically fetch from database
    // For now, return default settings
    return {
      autoCategorization: true,
      budgetMonitoring: true,
      receiptProcessing: true,
      notificationPreferences: {
        email: true,
        push: true,
        sms: false,
      },
      lastUpdated: new Date().toISOString(),
    };
  }),
});