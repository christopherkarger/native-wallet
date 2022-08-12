import { DeviceEventEmitter } from "react-native";
import { UPDATE_WALLETS_EVENT } from "~/constants";
import {
  selectLocalDBTableWallets,
  updateItemBalanceToLocalDBTableWallets,
} from "~/db";
import { fetchAddress } from "../services/fetch-address";
import { waitTime } from "../services/helper";

export enum UPDATE_WALLETS_EVENT_TYPE {
  Update,
  Add,
  Delete,
}

export const updateLocalWalletBalances = async () => {
  const localWallets = await selectLocalDBTableWallets().catch(() => {});

  if (localWallets && localWallets.rows.length) {
    const allWallets = localWallets.rows._array
      .map((w) => ({
        id: w.id,
        address: w.address,
        name: w.name,
        lastFetched: w.lastFetched,
        isDemoAddress: w.isDemoAddress,
      }))
      .sort((a, b) =>
        a.lastFetched !== undefined && b.lastFetched !== undefined
          ? a.lastFetched - b.lastFetched
          : 0
      );

    for (const wallet of allWallets) {
      if (wallet.address && !wallet.isDemoAddress) {
        try {
          await waitTime(1000);
          const fetchedAddress = await fetchAddress(
            wallet.address,
            wallet.name
          );
          updateItemBalanceToLocalDBTableWallets(
            wallet.id,
            fetchedAddress.balance,
            new Date().getTime()
          );
        } catch (err) {
          console.error(err);
        }
      }
    }

    if (!allWallets.some((w) => !!w.isDemoAddress)) {
      DeviceEventEmitter.emit(
        UPDATE_WALLETS_EVENT,
        UPDATE_WALLETS_EVENT_TYPE.Update
      );
    }
  }
};
