import { ILocalWallet } from "~/db/wallets";
import { Wallet } from "~/models/wallet";
import { WalletWrapper } from "~/models/wallet-wrapper";

export const getWalletWrapper = (localWalletsArr: ILocalWallet[]) => {
  const connectedWallets = localWalletsArr
    .filter((e) => e.connectedToId)
    .map((w) => {
      return new Wallet({
        id: w.id,
        name: w.name,
        currency: w.currency,
        balance: w.balance,
        isCoinWallet: w.isCoinWallet === 1,
        isDemoAddress: w.isDemoAddress === 1,
        addedAt: w.addedAt,
        coinPrice: w.coinPrice,
        address: w.address,
        lastFetched: w.lastFetched,
        transactions: w.transactions ? JSON.parse(w.transactions) : undefined,
        connectedToId: w.connectedToId,
      });
    });

  return localWalletsArr
    .filter((e) => !e.connectedToId)
    .map((w) => {
      return new WalletWrapper([
        new Wallet({
          id: w.id,
          name: w.name,
          currency: w.currency,
          balance: w.balance,
          isCoinWallet: w.isCoinWallet === 1,
          isDemoAddress: w.isDemoAddress === 1,
          addedAt: w.addedAt,
          coinPrice: w.coinPrice,
          address: w.address,
          lastFetched: w.lastFetched,
          transactions: w.transactions ? JSON.parse(w.transactions) : undefined,
          connectedToId: w.connectedToId,
        }),
        ...connectedWallets.filter((e) => e.connectedToId === w.id),
      ]);
    });
};
