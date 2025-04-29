export const extractTicker = (coin) => {
  const parts = coin.split("::");

  return parts.length >= 3 ? parts[2] : "Unknown";
};

export const formatUsd = (amount) => {
  if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(2)}K`;
  return `$${amount}`;
};

export const determineTradeAction = (trade, isInStable, isOutStable) => {
  if (isInStable) {
    return {
      action: "bought",
      coin: trade.coinOut,
      amount: trade.amountOut,
    };
  } else if (isOutStable) {
    return {
      action: "sold",
      coin: trade.coinIn,
      amount: trade.amountIn,
    };
  } else {
    return {
      action: "none",
      coin: null,
      amount: null,
    };
  }
};

export const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const formatWalletStats = (stats) => {
  const winRate = (stats.winRate * 100).toFixed(2);
  const totalTrades = stats.totalTrades;
  const pnlStatus = stats.pnl >= 0 ? "Positive" : "Negative";
  const volume = formatUsd(stats.volume.toFixed(2));
  const avgTrade = formatUsd((stats.volume / stats.totalTrades).toFixed(2));

  return { winRate, totalTrades, pnlStatus, volume, avgTrade };
};

export const calculateTradeStats = (trades, lookBackMs) => {
  const now = Date.now();

  // Filter trades within the lookback window
  const filteredTrades = trades.filter(
    (trade) => now - trade.timestampMs <= lookBackMs
  );

  let winCount = 0;
  let totalPnl = 0;
  let totalVolume = 0;
  let totalTrades = filteredTrades.length;

  for (const trade of filteredTrades) {
    if (trade.pnl > 0) winCount++;
    totalPnl += trade.pnl;
    totalVolume += trade.volume;
  }

  return {
    totalTrades,
    winRate: totalTrades > 0 ? (winCount / totalTrades) * 100 : 0,
    pnl: totalPnl >= 0 ? "Positive" : "Negative",
    volume: totalVolume,
    avgTrade: totalTrades > 0 ? totalVolume / totalTrades : 0,
  };
};
