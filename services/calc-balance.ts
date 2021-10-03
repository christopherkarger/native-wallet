import { WalletWrapper } from "../models/wallet-wrapper";
import { IMarketData } from "./fetch-marketdata";

export const calcTotalBalance = (
  marketData: IMarketData,
  walletWrapper: WalletWrapper[]
): number => {
  let balance = 0;
  walletWrapper.forEach((wrapper) => {
    wrapper.wallets.forEach((wallet) => {
      const data = marketData[wallet.name];
      if (data) {
        balance += data.price * wallet.balance;
      }
    });
  });
  return balance;
};
