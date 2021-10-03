import { WalletWrapper } from "../models/wallet-wrapper";
import { IMarketData } from "./fetch-marketdata";
import { formatNumber } from "./helper";

export const calcTotalBalance = (
  marketData: IMarketData,
  walletWrapper: WalletWrapper[]
): string => {
  let balance = 0;
  walletWrapper.forEach((wrapper) => {
    wrapper.wallets.forEach((wallet) => {
      const data = marketData[wallet.name];
      if (data) {
        balance += data.price * wallet.balance;
      }
    });
  });
  return formatNumber(10000.343);
};
