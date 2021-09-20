import { CryptoIcon } from "./crypto-icon";

export class Wallet {
  readonly icon: CryptoIcon;
  readonly amount?: number;
  readonly percentage?: number;

  constructor(
    readonly cryptoName: string,
    readonly cryptoCurrency: string,
    readonly cryptoAddress: string
  ) {
    this.icon = new CryptoIcon(cryptoName);
  }

  get walletAmount(): string | undefined {
    if (!this.amount) {
      return;
    }
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
