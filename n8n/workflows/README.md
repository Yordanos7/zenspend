# n8n Workflows Directory

This directory contains the automation workflows for ZenSpend:

- `budget-monitoring.json` - Budget alerts and spending limits
- `transaction-categorization.json` - AI-powered expense categorization  
- `receipt-processing.json` - OCR and data extraction
- `notification-system.json` - Multi-channel notifications

## Setup

1. Start n8n with Docker Compose:
```bash
docker-compose -f docker-compose.n8n.yml up -d
```

2. Access n8n at http://localhost:5678
3. Import workflows from this directory
4. Configure webhook endpoints to connect with ZenSpend API