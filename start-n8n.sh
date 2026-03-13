#!/bin/bash

echo "🚀 Starting ZenSpend n8n Automation..."

# Start n8n with Docker
docker-compose -f docker-compose.n8n.yml up -d

echo "⏳ Waiting for n8n to start..."
sleep 10

echo "✅ n8n is running at http://localhost:5678"
echo "📧 Login: admin / zenspend123"
echo ""
echo "🔧 Next steps:"
echo "1. Access n8n at http://localhost:5678"
echo "2. Import workflows from n8n/workflows/"
echo "3. Configure webhook endpoints"
echo ""
echo "📋 Required Webhooks:"
echo "- /webhook/categorize-transaction"
echo "- /webhook/process-receipt" 
echo "- /webhook/budget-check"