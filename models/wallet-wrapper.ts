import { Colors } from "~/constants";
import { SupportedCryptos } from "./config";
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

  /**
   * get main Color of wrapper
   */
  get mainColor(): string {
    switch (this.wallets[0]?.name) {
      case SupportedCryptos.Bitcoin:
        return Colors.cryptos.bitcoin;
      case SupportedCryptos.Ethereum:
        return Colors.cryptos.ethereum;
      case SupportedCryptos.Cardano:
        return Colors.cryptos.cardano;
      case SupportedCryptos.Dogecoin:
        return Colors.cryptos.dogecoin;
      case SupportedCryptos.Litecoin:
        return Colors.cryptos.litecoin;
      case SupportedCryptos.Dash:
        return Colors.cryptos.dash;
    }

    return Colors.transparent;
  }

  /**
   * Calc nice balance
   * @param balance
   * @returns
   */
  niceBalance(balance: number): string {
    const maxChars = 8;
    if (balance.toString().split("").length > maxChars) {
      const toFixedDecimal = this.cutDecimal(balance, 4);

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
  /**
   * Cuts deciaml if number has decimal
   * @param num
   * @param decimal
   * @returns
   */
  cutDecimal(num: number, decimal: number): string {
    const hasDecimal = !Number.isInteger(num);
    if (!hasDecimal) {
      return num.toString();
    }
    const balanceArr = num.toString().split("");
    const m = balanceArr.slice(0, balanceArr.indexOf(".") + 5);
    return m.join("");
  }
}
