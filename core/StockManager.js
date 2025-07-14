import { Portfolio } from './Portfolio.js';
import { Budget } from './Budget.js';
import { Strategy } from '../logic/Strategy.js';

export class StockManager {
  /** @param {NS} ns */
  constructor(ns, config) {
    this.ns = ns;
    this.config = config;
    this.symbols = ns.stock.getSymbols();
    this.budget = new Budget(ns, config);
    this.portfolio = new Portfolio(ns);
    this.strategy = new Strategy(ns, config);
    this.actions = [];
  }

  canStart() {
    return this.budget.available() >= this.config.TRANSACTION_FEE;
  }

  runCycle() {
    this.actions = [];
    this.sell(); this.buy();
  }

  buy() {
    const symbols = this.symbols.filter(s => this.strategy.shouldBuy(s, this.portfolio));
    symbols.sort((a, b) => this.strategy.sortBuyOrder(a, b));

    for (const symbol of symbols) {
      if (!this.budget.canAfford(symbol)) continue;
      const shares = this.budget.sharesToBuy(symbol);
      if (shares <= 0) continue;
      const price = this.ns.stock.getPrice(symbol);
      const actualPrice = this.ns.stock.buyStock(symbol, shares);
      if (!actualPrice) return; // 0 if no shares were bought
      this.budget.allocate(shares * price);
      this.portfolio.add(symbol, shares, price);
      this.actions.push({ type: "buy", symbol, shares, price });
    }
  }

  sell() {
    const toSell = this.portfolio.symbols().filter(s => this.strategy.shouldSell(s));
    for (const symbol of toSell) {
      const shares = this.portfolio.getShares(symbol);
      const price = this.ns.stock.getPrice(symbol);
      this.ns.stock.sellStock(symbol, shares);
      this.budget.release(shares * price);
      this.portfolio.remove(symbol);
      this.actions.push({ type: "sell", symbol, shares, price });
    }
  }

  getBudget() { return this.budget.available(); }
  getValue() { return this.portfolio.totalValue(); }
  getActions() { return this.actions; }
  getPortfolio() { return this.portfolio.data(); }
}