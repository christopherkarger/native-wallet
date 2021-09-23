import { Wallet } from "./wallet";

export class WalletWrapper {
  constructor(readonly wallets: Wallet[]) {}

  /**
   * get the total balance of all addresses in a wallets
   */
  get totalBalance(): number {
    let amount = 0;
    this.wallets.forEach((w: Wallet) => {
      amount += w.balance;
    });
    return amount;
  }

  niceBalance(balance: number): string {
    const maxChars = 7;
    if (balance.toString().split("").length > maxChars) {
      const toFixedDecimal = `≈ ${balance.toFixed(2)}`;

      if (toFixedDecimal.length > maxChars) {
        return `${toFixedDecimal
          .split("")
          .slice(0, maxChars)
          .join("")
          .toString()}...`;
      }

      return toFixedDecimal;
    }
    return balance.toString();
  }
}
