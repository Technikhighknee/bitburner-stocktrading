export class ToastManager {
  /** @param {NS} ns */
  constructor(ns, config) {
    this.ns = ns;
    this.config = config;
  }

  toast(manager) {
    if (manager.actions.length === 0) {
      return;
    }

    let totalSpent = 0, totalEarned = 0;
    let totalBought = 0, totalSold = 0;
    for (const { type, shares, price } of manager.actions) {
      switch (type) {
        case "buy": totalSpent += (shares * price); totalBought += shares; break;
        case "sell": totalEarned += (shares * price); totalSold += shares; break;
      }
    }

    if (totalBought !== 0) {
      // TODO: Make configurable duration
      this.ns.toast(`Bought ${this.ns.formatNumber(totalBought)} shares for $${this.ns.formatNumber(totalSpent)}`, "info", 7500);
    }
    if (totalSold !== 0) {
      this.ns.toast(`Sold ${this.ns.formatNumber(totalSold)} shares for $${this.ns.formatNumber(totalEarned)}`, "info", 7500);
    }
  }
}