# HoldSight

Track portfolio allocations, document Plans, and journal trade decisions.

## Overview

- Consolidates EVM wallets, Hyperliquid, Lighter, Kraken, Plaid, and Schwab through a shared adapter registry
- Groups assets into Plans with targets, entry and adding rules, risk and profit rules, and invalidation
- Uses a durable, resumable sync pipeline with lease-based concurrency to ingest more than 2,100 transactions
- Exposes portfolio data to AI agents through a remote MCP server with self-hosted OAuth 2.1

### Plans

Define a Thesis, compare target and current allocations, and record Invalidation, Risk, Profit, Entry, and Adding.

![Investment Plan tracking in Holdsight](public/screenshots/theses.png)

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Neon Postgres
- Drizzle ORM
- Better Auth
