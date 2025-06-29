import { Config } from 'stocks/config.js';
import { StockManager } from 'stocks/core/StockManager.js';
import { Logger } from 'stocks/ui/Logger.js';
import { ToastManager } from 'stocks/ui/ToastManager.js';
import { TailTitle } from 'stocks/ui/TailTitle.js';

/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("ALL");
  ns.clearLog();

  const logger = new Logger(ns);
  const tailTitle = new TailTitle(ns);
  const manager = new StockManager(ns, Config);
  const toastManager = new ToastManager(ns, Config);

  if (!manager.canStart()) {
    ns.tprint('Not enough funds.');
    return;
  }

  let cycle = 0;
  ns.ui.openTail();

  while (++cycle) {
    manager.runCycle();
    logger.render(cycle, manager);
    tailTitle.update(cycle, manager);
    toastManager.toast(manager);
    
    await ns.stock.nextUpdate();
  }
}
