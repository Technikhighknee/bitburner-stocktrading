import { coloredString } from "../libs/color-utils.js";

export class TailTitle {
  /** @param {NS} ns */
  constructor(ns) {
    this.ns = ns;
  }

  update(cycle, manager) {
    const budget = manager.getBudget();
    const value = manager.getValue();
    const portfolio = manager.getPortfolio()
    let profit = 0;

    for (const [symbol, { shares, price }] of portfolio.entries()) {
      const currentPrice = this.ns.stock.getPrice(symbol);
      profit += (currentPrice - price) * shares;
    }

    const color = profit >= 0 
    ? (text) => {coloredString(text, { text: 'ffffff', background: '00e600' })}
    : (text) => {coloredString(text, { text: 'ffffff', background: 'e60000' })};

    this.ns.ui.setTailTitle(`StockBot|#${cycle}|$${this.ns.formatNumber(budget + value)}|${profit >= 0  ? '+' : ''}${this.ns.formatNumber(profit)}|`);
  }
}
