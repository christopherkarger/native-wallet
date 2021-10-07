import { MarketData } from "~/models/market-data";
import { WalletWrapper } from "../models/wallet-wrapper";

export const calcTotalBalance = (
  marketData: MarketData,
  walletWrapper: WalletWrapper[]
): number => {
  let balance = 0;
  walletWrapper.forEach((wrapper) => {
    wrapper.wallets.forEach((wallet) => {
      const item = marketData.findItemByName(wallet.name);
      if (item) {
        balance += item.data.price * wallet.balance;
      }
    });
  });
  return balance;
};
