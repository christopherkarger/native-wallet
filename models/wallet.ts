import { CryptoIcon } from "./crypto-icon";

export class Wallet {
  readonly icon: CryptoIcon;
  readonly percentage?: number;

  constructor(
    readonly id: number,
    readonly name: string,
    readonly currency: string,
    readonly address: string,
    readonly balance: number,
    readonly fetchedDate: number
  ) {
    this.icon = new CryptoIcon(name);
  }

  get walletAmount(): string | undefined {
    const maxChars = 7;
    if (this.balance.toString().split("").length > maxChars) {
      const toFixedDecimal = this.balance.toFixed(2);

      if (toFixedDecimal.length > maxChars) {
        return `${toFixedDecimal
          .split("")
          .slice(0, maxChars)
          .join("")
          .toString()}...`;
      }

      return toFixedDecimal;
    }
    return this.balance.toString();
  }
}
