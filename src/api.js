import axios from "axios";

import {
  INSIDEX_API_KEY,
  INSIDEX_API_URL,
  MIN_QUALITY_SCORE,
  TWITTER_API_KEY,
  TWITTER_API_URL,
} from "./constants.js";

export const getWhales = async (supabase) => {
  const { data } = await supabase
    .from("token_holders")
    .select("*")
    // .gt("quality_score", MIN_QUALITY_SCORE);

  return data;
};

export const increaseQualityScore = async (supabase, holder, amount) => {
  const { error } = await supabase.rpc("increment_quality_score", {
    holder_address: holder,
    amount,
  });
  if (error) {
    console.log(error);
    return null;
  }
  return true;
};

export const decreaseQualityScore = async (supabase, holder, amount) => {
  const { error } = await supabase.rpc("decrement_quality_score", {
    holder_address: holder,
    amount,
  });
  if (error) {
    console.log(error);
    return null;
  }
  return true;
};

export const getPastTradesInTimerange = async (address, startTime, endTime) => {
  try {
    const response = await axios.get(
      `https://${INSIDEX_API_URL}/spot-portfolio/${address}/past-trades-in-timerange`,
      {
        params: { startTime, endTime },
        headers: { "x-api-key": INSIDEX_API_KEY },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPastTrades = async (address, limit, skip) => {
  try {
    const response = await axios.get(
      `https://${INSIDEX_API_URL}/spot-portfolio/${address}/past-trades`,
      {
        params: { limit, skip },
        headers: { "x-api-key": INSIDEX_API_KEY },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getMarketDataOfCoin = async (coin) => {
  try {
    const response = await axios.get(
      `https://${INSIDEX_API_URL}/coins/${coin}/market-data`,
      {
        headers: { "x-api-key": INSIDEX_API_KEY },
      }
    );
    return response.data[0];
  } catch (error) {
    console.log(error);
  }
};

export const getWalletTradeStats = async (address) => {
  try {
    const response = await axios.get(
      `https://${INSIDEX_API_URL}/spot-portfolio/${address}/spot-trade-stats`,
      { headers: { "x-api-key": INSIDEX_API_KEY } }
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const postTweet = async (text) => {
  try {
    await axios.post(
      TWITTER_API_URL,
      { text },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": TWITTER_API_KEY,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
