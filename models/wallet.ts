import { CryptoIcon } from "./crypto-icon";

export class Wallet {
  readonly icon: CryptoIcon;
  readonly percentage?: number;

  constructor(
    readonly cryptoName: string,
    readonly cryptoCurrency: string,
    readonly cryptoAddress: string,
    readonly cryptoBalance: number
  ) {
    this.icon = new CryptoIcon(cryptoName);
  }

  get walletAmount(): string | undefined {
    const maxChars = 7;
    if (this.cryptoBalance.toString().split("").length > maxChars) {
      const toFixedDecimal = this.cryptoBalance.toFixed(2);

      if (toFixedDecimal.length > maxChars) {
        return `${toFixedDecimal
          .split("")
          .slice(0, maxChars)
          .join("")
          .toString()}...`;
      }

      return toFixedDecimal;
    }
    return this.cryptoBalance.toString();
  }
}
