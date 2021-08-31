export class CryptoIcon {
  constructor(readonly cryptoName: string) {}

  get path(): NodeRequire {
    switch (this.cryptoName) {
      case "Bitcoin":
        return require("~/node_modules/cryptocurrency-icons/128/color/btc.png");
      case "Ethereum":
        return require("~/node_modules/cryptocurrency-icons/128/color/eth.png");
      case "Cardano":
        return require("~/node_modules/cryptocurrency-icons/128/color/ada.png");
      case "Dogecoin":
        return require("~/node_modules/cryptocurrency-icons/128/color/doge.png");
      case "Litecoin":
        return require("~/node_modules/cryptocurrency-icons/128/color/ltc.png");
      case "Dash":
        return require("~/node_modules/cryptocurrency-icons/128/color/dash.png");

      default:
        return require("~/node_modules/cryptocurrency-icons/128/color/generic.png");
    }
  }
}
