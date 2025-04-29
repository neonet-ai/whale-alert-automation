# Whale Alert Automation

A Node.js automation that monitors whale wallets for significant trading activity and posts real-time alerts to Twitter, including trade details and whale trading insights.

## Features
- Monitors whale wallets for large trades
- Posts formatted alerts to Twitter
- Shows whale stats: win rate, total trades, PnL, and more
- Rate-limiting friendly and robust error handling
- Includes a quality score to help filter and prioritize the most active whale addresses

## Getting Started
1. Clone this repository.
2. Copy `.env.example` to `.env` and fill in all required API keys and configuration values.
3. Install dependencies:
   ```
   npm install
   ```
4. Run the automation:
   ```
   node index.js
   ```

## Configuration
- All environment variables are documented in `.env.example`.
- Requires Supabase, InsideX, and Twitter API credentials.

## License
MIT

