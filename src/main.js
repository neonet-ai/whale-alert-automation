import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import {
  postTweet,
  getWhales,
  getPastTradesInTimerange,
  getMarketDataOfCoin,
  getWalletTradeStats,
  increaseQualityScore,
  decreaseQualityScore,
} from "./api.js";
import {
  extractTicker,
  determineTradeAction,
  formatUsd,
  sleep,
  formatWalletStats,
} from "./utils.js";
import {
  INSIDEX_API_DELAY,
  LOOK_BACK_PERIOD_MS,
  MIN_TRADE_VOLUME,
  STABLE_COINS,
  SUPABASE_KEY,
  SUPABASE_URL,
  QUALITY_SCORE_INCREMENT,
  QUALITY_SCORE_DECREMENT,
  COINS_TO_IGNORE,
} from "./constants.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function () {
  const whales = await getWhales(supabase);

  console.log(`Found ${whales.length} whales in the database`);

  for (let i = 0; i < whales.length; i++) {
    const whale = whales[i];

    try {
      console.log(
        `Processing whale ${i + 1}/${whales.length}: ${whale.holder_address} (${
          whale.coin_type
        })`
      );

      const endTime = Date.now();
      const startTime = endTime - LOOK_BACK_PERIOD_MS;

      const trades = await getPastTradesInTimerange(
        whale.holder_address,
        startTime,
        endTime
      );

      await sleep(INSIDEX_API_DELAY);

      if (!trades || trades.length === 0) {
        await decreaseQualityScore(
          supabase,
          whale.holder_address,
          QUALITY_SCORE_DECREMENT
        );
        continue;
      }

      await increaseQualityScore(
        supabase,
        whale.holder_address,
        QUALITY_SCORE_INCREMENT
      );

      console.log(
        `Found ${trades.length} recent trades for whale: ${whale.holder_address}`
      );

      const walletStats = await getWalletTradeStats(whale.holder_address);

      const { winRate, totalTrades, pnlStatus, avgTrade, volume } =
        formatWalletStats(walletStats);

      await sleep(INSIDEX_API_DELAY);

      for (const trade of trades) {
        try {
          const isInStable = STABLE_COINS.includes(trade.coinIn);
          const isOutStable = STABLE_COINS.includes(trade.coinOut);

          if (isInStable && isOutStable) continue;

          const { action, coin, amount } = determineTradeAction(
            trade,
            isInStable,
            isOutStable
          );

          if (action === "none") continue;

          const coinTicker = extractTicker(coin);
          const whaleTicker = extractTicker(whale.coin_type);

          const marketData = await getMarketDataOfCoin(coin);

          await sleep(INSIDEX_API_DELAY);

          const formattedAmount =
            amount / 10 ** marketData.coinMetadata.decimals;

          const amountInUsd = Number(
            (marketData.coinPrice * formattedAmount).toFixed(2)
          );

          if (
            action === "bought" &&
            amountInUsd >= MIN_TRADE_VOLUME &&
            !COINS_TO_IGNORE.includes(coin) &&
            coin !== whale.coin_type
          ) {
            const fdv = formatUsd(Number(marketData.marketCap).toFixed(2));

            const tweet = `A $${whaleTicker} whale just ${action} ${formatUsd(
              amountInUsd
            )} worth of $${coinTicker} at ${fdv} FDV 🐳\n
          
 Insights on this whale:
 🔹 Win Rate: ${winRate}%
 🔹 Total Trades: ${totalTrades}
 🔹 PnL: ${pnlStatus}
 🔹 Average Trade: ${avgTrade}
 🔹 Total Volume: ${volume}
          `;

            await postTweet(tweet);
            console.log("Tweet posted\n", tweet);
            break;
          }
        } catch (tradeError) {
          console.error(
            `Error processing trade for whale ${whale.holder_address}:`,
            tradeError
          );
        }
      }
    } catch (whaleError) {
      console.error(
        `Error processing whale ${whale.holder_address}:`,
        whaleError
      );
    }
  }
}
