import "dotenv/config";

export const LOOK_BACK_PERIOD_MS = process.env.LOOK_BACK_PERIOD_MS;
export const INSIDEX_API_DELAY = process.env.INSIDEX_API_DELAY;
export const MIN_TRADE_VOLUME = Number(process.env.MIN_TRADE_VOLUME);
export const WALLET_STATS_LOOK_BACK_MS = Number(process.env.WALLET_STATS_LOOK_BACK_MS);

export const QUALITY_SCORE_INCREMENT = process.env.QUALITY_SCORE_INCREMENT;
export const QUALITY_SCORE_DECREMENT = process.env.QUALITY_SCORE_DECREMENT;
export const MIN_QUALITY_SCORE = process.env.MIN_QUALITY_SCORE;

export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_KEY = process.env.SUPABASE_KEY;

export const INSIDEX_API_URL = process.env.INSIDEX_API_URL;
export const INSIDEX_API_KEY = process.env.INSIDEX_API_KEY;

export const TWITTER_API_URL = process.env.TWITTER_API_URL;
export const TWITTER_API_KEY = process.env.TWITTER_API_KEY;

export const STABLE_COINS = process.env.STABLE_COINS.split(",");
export const COINS_TO_IGNORE = process.env.COINS_TO_IGNORE.split(",");
