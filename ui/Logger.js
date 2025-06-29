import { coloredString } from "libs/color-utils.js";

const colors = {
  profit: (string) => {
    return coloredString(string, {
      text: 'ffffff',
      background: '00a000',
    });
  },

  loss: (string) => {
    return coloredString(string, {
      text: 'fff',
      background: 'a00000',
    });
  }
}


export class Logger {
  /** @param {NS} ns */  
  constructor(ns) {
    this.ns = ns;
    this.lastTime = Date.now();
    this.overallProfit = 0;
  }

  render(cycle, manager) {
    const budget = manager.getBudget();;
    const value = manager.getValue();
    const portfolio = manager.getPortfolio();
    const actions = manager.getActions();
    let color;

    for (const action of actions) {
      if (action.type === "buy") {
        this.overallProfit -= (action.shares * action.price);
      } else if (action.type === "sell") {
        this.overallProfit += (action.shares * action.price);
      }
    }


    color = this.overallProfit >= 0 ? colors.profit : colors.loss;

    let output = `--- CYCLE ${cycle} ---\n`;
    output += `Budget\t$${this.ns.formatNumber(budget)}\n`;
    output += `Assets\t$${this.ns.formatNumber(value)}\n`;
    output += `Profit\t${color(`$${this.ns.formatNumber(this.overallProfit)}`)}\n`;
    output += `Delta\t${this.ns.tFormat(Date.now() - this.lastTime)}\n\n`;

    if (portfolio.size === 0) output += "No stocks.\n";
    else {
      output += '--- Holdings ---\n';
      const sortedByProfit = [...portfolio.entries()]
        .map(([symbol, { shares, price }]) => ({
          symbol,
          shares,
          price,
          totalProfit: (this.ns.stock.getPrice(symbol) - price) * shares
        }))
        .sort((a, b) => b.totalProfit - a.totalProfit);

      for (const { symbol, shares, price } of sortedByProfit) {
        const profit = (this.ns.stock.getPrice(symbol) - price) * shares;
        color = profit >= 0 ? colors.profit : colors.loss;
        output += `|${symbol}\t${this.ns.formatNumber(shares)}\t  $${this.ns.formatNumber(price)}\t| ${this.ns.stock.getForecast(symbol).toFixed(2)} |  ${color(`$${profit > 0 ? '+' : ''}${this.ns.formatNumber(profit)}`)}\t|\n`;
      }
    }

    this.ns.clearLog();
    this.ns.print(output);
    this.lastTime = Date.now();
  }
}