import { ILocalWallet } from "~/db/wallets";
import { Wallet } from "~/models/wallet";
import { WalletWrapper } from "~/models/wallet-wrapper";

export const getWalletWrapper = (localWalletsArr: ILocalWallet[]) => {
  const connectedWallets = localWalletsArr
    .filter((e) => e.connectedToId)
    .map((w) => {
      return new Wallet(
        w.id,
        w.name,
        w.currency,
        w.address,
        w.balance,
        w.lastFetched,
        JSON.parse(w.transactions),
        w.connectedToId,
        w.demoAddress
      );
    });

  return localWalletsArr
    .filter((e) => !e.connectedToId)
    .map((w) => {
      return new WalletWrapper([
        new Wallet(
          w.id,
          w.name,
          w.currency,
          w.address,
          w.balance,
          w.lastFetched,
          JSON.parse(w.transactions),
          w.connectedToId,
          w.demoAddress
        ),
        ...connectedWallets.filter((e) => e.connectedToId === w.id),
      ]);
    });
};
