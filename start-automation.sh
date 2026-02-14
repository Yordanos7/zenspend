#!/bin/bash

# Navigate to the automation infra directory
cd "$(dirname "$0")/infra/automation"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker first."
  exit 1
fi

echo "Starting n8n Automation System on Port 5679..."
docker compose up -d

echo "--------------------------------------------------------"
echo "✅ n8n is running!"
echo "➡️  Open your browser: http://localhost:5679"
echo "--------------------------------------------------------"
echo "To expose to the internet (for webhooks):"
echo "1. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation"
echo "2. Run: cloudflared tunnel --url http://localhost:5679"
echo "--------------------------------------------------------"
