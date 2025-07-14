import { Config } from './config.js';
import { StockManager } from './core/StockManager.js';
import { Logger } from './ui/Logger.js';
import { ToastManager } from './ui/ToastManager.js';
import { TailTitle } from './ui/TailTitle.js';

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
