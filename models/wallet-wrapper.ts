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
      case SupportedCryptos.Ripple:
        return Colors.cryptos.ripple;
      default:
        return Colors.transparent;
    }
  }

  get isCoinWallet() {
    return this.wallets.some((w) => w.isCoinWallet);
  }
}
