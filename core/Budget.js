/** Budgedclass for managing the budget available for stock transactions in Bitburner. 
 * @class Budget
 * @property {NS} ns The Bitburner NS object for accessing game functions
 * @property {Object} config The configuration object containing constants like TRANSACTION_FEE
 * @property {number} total The total budget available for stock transactions
 * 
 */
export class Budget {
  /** Represents the budget available for stock transactions.
   * @param {NS} ns The Bitburner NS object for accessing game functions
   * @param {Object} config The configuration object containing constants like TRANSACTION_FEE
   */
  constructor(ns, config) {
    this.ns = ns;
    this.config = config;
    this.total = ns.getServerMoneyAvailable("home") * config.ALLOCATED_FUND_FRACTION; // startmoney 
  }

  /** Returns the total budget available for stock transactions.
   * @returns {number} The total budget available for stock transactions
   */
  available() {
    return this.total;
  }

  /** Allocates a portion of the budget for a transaction, deducting the transaction fee.
   * @param {number} amount The amount to allocate for the transaction
   */
  allocate(amount) {
    this.total -= amount + this.config.TRANSACTION_FEE;
  }

  /** Releases the budget after a transaction, adding back the total amount minus the transaction fee.
   * @param {number} amount The amount to release back to the budget 
   */
  release(amount) {
    this.total += amount - this.config.TRANSACTION_FEE;
  }

  /** Returns true if the budget is sufficient to buy at least one share of the stock,
   * @param {string} symbol The stock symbol to check affordability for 
   * @returns 
   */
  canAfford(symbol) {
    const price = this.ns.stock.getPrice(symbol);
    return this.available() >= price + this.config.TRANSACTION_FEE;
  }

  /**
   * Calculate the number of shares that can be bought with the available budget.  
   * Takes into account the transaction fee and the maximum shares allowed for the stock.  
   * @param {string} symbol The stock symbol to calculate shares for 
   * @returns {number} Number of shares that can be bought with the available budget
   */
  sharesToBuy(symbol, budgetFraction = 1) {
    const budget = budgetFraction * this.available() - this.config.TRANSACTION_FEE;
    const price = this.ns.stock.getPrice(symbol);

    const affordableShares = Math.floor(budget / price);
    const maxShares = this.ns.stock.getMaxShares(symbol);

    return Math.min(affordableShares, maxShares);
  }
}
