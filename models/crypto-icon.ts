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
      case SupportedCryptos.Ripple:
        return require("~/node_modules/cryptocurrency-icons/128/color/xrp.png");
      case SupportedCryptos["The Sandbox"]:
        return require("~/node_modules/cryptocurrency-icons/128/color/sand.png");
      case SupportedCryptos.Decentraland:
        return require("~/images/coins/mana.png");
      case SupportedCryptos["Binance Coin"]:
        return require("~/node_modules/cryptocurrency-icons/128/color/bnb.png");
      case SupportedCryptos.Solana:
        return require("~/images/coins/sol.png");
      case SupportedCryptos.Polkadot:
        return require("~/node_modules/cryptocurrency-icons/128/color/dot.png");
      case SupportedCryptos.Avalanche:
        return require("~/images/coins/avax.png");
      case SupportedCryptos.Chainlink:
        return require("~/node_modules/cryptocurrency-icons/128/color/link.png");
      case SupportedCryptos.Algorand:
        return require("~/node_modules/cryptocurrency-icons/128/color/algo.png");
      case SupportedCryptos.Polygon:
        return require("~/node_modules/cryptocurrency-icons/128/color/matic.png");
      case SupportedCryptos.VeChain:
        return require("~/node_modules/cryptocurrency-icons/128/color/vet.png");
      case SupportedCryptos["SHIBA INU"]:
        return require("~/images/coins/shib.png");
      case SupportedCryptos.Terra:
        return require("~/images/coins/luna.png");
      case SupportedCryptos.Mina:
        return require("~/images/coins/mina.png");

      default:
        return require("~/node_modules/cryptocurrency-icons/128/color/generic.png");
    }
  }
}
