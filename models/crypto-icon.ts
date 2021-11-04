import { ImageSourcePropType } from "react-native";
import { SupportedCryptos } from "./config";

export class CryptoIcon {
  constructor(readonly cryptoName: string) {}

  get path(): ImageSourcePropType {
    switch (this.cryptoName) {
      case SupportedCryptos.Bitcoin:
        return require("~/node_modules/cryptocurrency-icons/128/color/btc.png");
      case SupportedCryptos.Ethereum:
        return require("~/node_modules/cryptocurrency-icons/128/color/eth.png");
      case SupportedCryptos.Cardano:
        return require("~/node_modules/cryptocurrency-icons/128/color/ada.png");
      case SupportedCryptos.Dogecoin:
        return require("~/node_modules/cryptocurrency-icons/128/color/doge.png");
      case SupportedCryptos.Litecoin:
        return require("~/node_modules/cryptocurrency-icons/128/color/ltc.png");
      case SupportedCryptos.Dash:
        return require("~/node_modules/cryptocurrency-icons/128/color/dash.png");
      case "Tether":
        return require("~/node_modules/cryptocurrency-icons/128/color/usdt.png");
      case SupportedCryptos.Ripple:
        return require("~/node_modules/cryptocurrency-icons/128/color/xrp.png");

      default:
        return require("~/node_modules/cryptocurrency-icons/128/color/generic.png");
    }
  }
}
