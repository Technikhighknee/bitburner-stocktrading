export class Portfolio {
  /** @param {NS} ns */
  constructor(ns) {
    this.ns = ns;
    this._map = new Map();
    this.init();
  }

  init() {
    this.ns.stock.getSymbols().forEach(symbol => {
      const [shares] = this.ns.stock.getPosition(symbol);
      if (shares > 0) {
        const price = this.ns.stock.getPrice(symbol);
        this.add(symbol, shares, price);
      }
    });
  }

  add(symbol, shares, price) {
    this._map.set(symbol, { shares, price });
  }

  remove(symbol) {
    this._map.delete(symbol);
  }

  symbols() {
    return [...this._map.keys()];
  }

  data() {
    return this._map;
  }

  getShares(symbol) {
    const entry = this._map.get(symbol);
    if (entry) {
      return entry.shares;
    }
    return 0;
  }

  totalValue() {
    let total = 0;
    for (const [symbol, { shares }] of this._map.entries()) {
      const price = this.ns.stock.getPrice(symbol);
      total += shares * price;
    }
    return total;
  }

  has(symbol) {
    return this._map.has(symbol);
  }
}