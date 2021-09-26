import { updateItemToLocalDB } from "~/db";
import { IConfig } from "~/models/config";
import { WalletWrapper } from "~/models/wallet-wrapper";
import { fetchAddress } from "./fetch-address";
import { waitTime } from "./helper";

export const updateWalletBalance = async (
  walletsData: WalletWrapper[],
  appConfig: IConfig
) => {
  for (const data of walletsData) {
    for (const wallet of data.wallets) {
      try {
        await waitTime(2000);
        const balance = await fetchAddress(
          wallet.address,
          wallet.currency,
          appConfig
        );
        updateItemToLocalDB(wallet.id, balance);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
