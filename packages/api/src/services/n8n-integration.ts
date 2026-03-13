// n8n Integration Service for ZenSpend
export class N8nIntegrationService {
  private baseUrl: string;
  private webhookUrl: string;

  constructor() {
    this.baseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
    this.webhookUrl = `${this.baseUrl}/webhook`;
  }

  /**
   * Trigger automatic transaction categorization
   */
  async categorizeTransaction(transaction: {
    id: string;
    description: string;
    amount: number;
    category?: string;
  }) {
    try {
      const response = await fetch(`${this.webhookUrl}/categorize-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        suggestedCategory: result.category,
        confidence: result.confidence,
      };
    } catch (error) {
      console.error('Error categorizing transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Process receipt image with OCR
   */
  async processReceipt(imageData: string, userId: string) {
    try {
      const response = await fetch(`${this.webhookUrl}/process-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.success,
        transaction: result.transaction,
        confidence: result.transaction?.confidence || 0,
        processingTime: result.processingTime,
      };
    } catch (error) {
      console.error('Error processing receipt:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Trigger budget monitoring workflow manually
   */
  async triggerBudgetMonitoring() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows/budget-monitor/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from('admin:zenspend123').toString('base64')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        executionId: result.data?.id,
      };
    } catch (error) {
      console.error('Error triggering budget monitoring:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Health check for n8n connection
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`);
      return {
        success: response.ok,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }
}

// Export singleton instance
export const n8nService = new N8nIntegrationService();