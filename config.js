export const Config = {
  // starting budged fraction (0.5 means 50% of current money)
  ALLOCATED_FUND_FRACTION:       1,

  // sell stocks if forecast is below this value
  SELL_AT_FORECAST:         0.5,

  // buy stocks if forecast is above this value
  // regardless of volatility
  BUY_REGARDLESS_FORECAST: 0.65,

  // ## volatility thresholds
  // buy stocks if forecast is above these values
  // and volatility is below the corresponding threshold
  LOW_VOLATILITY_FORECAST:  0.51,
  LOW_VOLATILITY:           0.01,
  
  MID_VOLATILITY_FORECAST:  0.54,
  MID_VOLATILITY:           0.02,
  
  HIGH_VOLATILITY_FORECAST: 0.57, 
  HIGH_VOLATILITY:          0.04, // all stocks with higher volatility than this will not be bought (unless BUY_REGARDLESS_FORECAST is reached)

  // CONSTANTS (dont change these)
  TRANSACTION_FEE: 1e5
};
