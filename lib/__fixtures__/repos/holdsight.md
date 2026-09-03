# HoldSight

<img width="1174" height="442" alt="image" src="https://github.com/user-attachments/assets/a6b5ce5a-781f-4297-8a2b-49e957c6af2f" />


Track portfolio allocations, document Plans, and journal trade decisions.

## Overview

- Consolidates EVM wallets, Hyperliquid, Lighter, Kraken, Plaid, and Schwab through a shared adapter registry
- Groups assets into Plans with targets, entry and adding rules, risk and profit rules, and invalidation
- Uses a durable, resumable sync pipeline with lease-based concurrency to ingest more than 2,100 transactions
- Exposes portfolio data to AI agents through a remote MCP server with self-hosted OAuth 2.1

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Neon Postgres
- Drizzle ORM
- Better Auth
