export class Wallet {
  constructor(
    readonly cryptoName: string,
    readonly shortName: string,
    readonly amount: number,
    readonly percentage: number
  ) {}

  get icon(): NodeRequire {
    switch (this.cryptoName) {
      case "Bitcoin":
        return require("../node_modules/cryptocurrency-icons/128/color/btc.png");
      case "Ethereum":
        return require("../node_modules/cryptocurrency-icons/128/color/eth.png");
      case "Cardano":
        return require("../node_modules/cryptocurrency-icons/128/color/ada.png");
      case "DogeCoin":
        return require("../node_modules/cryptocurrency-icons/128/color/doge.png");
      case "Litecoin":
        return require("../node_modules/cryptocurrency-icons/128/color/ltc.png");
      case "Dash":
        return require("../node_modules/cryptocurrency-icons/128/color/dash.png");

      default:
        return require("../node_modules/cryptocurrency-icons/128/color/generic.png");
    }
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
