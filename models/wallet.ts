import { CryptoIcon } from "./crypto-icon";

export class Wallet {
  readonly icon: CryptoIcon;

  constructor(
    readonly cryptoName: string,
    readonly shortName: string,
    readonly amount: number,
    readonly percentage: number
  ) {
    this.icon = new CryptoIcon(cryptoName);
  }

  get walletAmount(): string {
    const maxChars = 7;
    if (this.amount.toString().split("").length > maxChars) {
      const toFixedDecimal = this.amount.toFixed(2);

      if (toFixedDecimal.length > maxChars) {
        return `${toFixedDecimal
          .split("")
          .slice(0, maxChars)
          .join("")
          .toString()}...`;
      }

      return toFixedDecimal;
    }
    return this.amount.toString();
  }
}
