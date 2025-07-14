export class Strategy {
  constructor(ns, config) {
    this.ns = ns;
    this.config = config;
  }

  shouldSell(symbol) {
    return this.ns.stock.getForecast(symbol) <= this.config.SELL_AT_FORECAST;
  }

  shouldBuy(symbol, portfolio) {
    if (portfolio.has(symbol)) return false; // already in portfolio
    const f = this.ns.stock.getForecast(symbol);
    const v = this.ns.stock.getVolatility(symbol);

    if (v < this.config.LOW_VOLATILITY) return f >= this.config.LOW_VOLATILITY_FORECAST;
    if (v < this.config.MID_VOLATILITY) return f >= this.config.MID_VOLATILITY_FORECAST;
    if (v < this.config.HIGH_VOLATILITY) return f >= this.config.HIGH_VOLATILITY_FORECAST;
    if (f >= this.config.BUY_REGARDLESS_FORECAST) return true;
    return false; // too volatile
  }

  sortBuyOrder(a, b) {
    const priceB = this.ns.stock.getPrice(b);
    const priceA = this.ns.stock.getPrice(a);
    return priceB - priceA; // sort by price descending
  }
}