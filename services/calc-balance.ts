import { Wallet } from "../models/wallet";
import { WalletWrapper } from "../models/wallet-wrapper";
import { IMarketData } from "./fetch-marketdata";

export const calcBalance = (
  marketData: IMarketData,
  wallet: WalletWrapper | Wallet
): number => {
  return 1;
};

export const calcTotalBalance = (
  marketData: IMarketData,
  walletWrapper: WalletWrapper[]
): number => {
  return 1;
};
