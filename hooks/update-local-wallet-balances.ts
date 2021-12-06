import { useEffect } from "react";
import { DeviceEventEmitter } from "react-native";
import { UPDATE_WALLETS_EVENT } from "~/constants";
import {
  getAddressUpdate,
  saveAddressUpdate,
  selectLocalDBTableWallets,
  updateItemBalanceToLocalDBTableWallets,
} from "~/db";
import { fetchAddress } from "../services/fetch-address";
import { datesAreEqual, waitTime } from "../services/helper";

export enum UPDATE_WALLETS_EVENT_TYPE {
  Update,
  Add,
  Delete,
}

const MAX_FETCHING_ADDRESSES = 500;

export const useUpdateLocalWalletBalances = async () => {
  const update = async () => {
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
        const addressUpdate = await localAddressUpdate();
        if (
          addressUpdate.count < MAX_FETCHING_ADDRESSES &&
          wallet.address &&
          !wallet.isDemoAddress
        ) {
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

          await saveAddressUpdate(addressUpdate.date, addressUpdate.count + 1);
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

  const localAddressUpdate = async () => {
    try {
      const addressUpdate = await getAddressUpdate();

      if (addressUpdate) {
        const now = new Date();
        const lastUpdated = new Date(addressUpdate.date);
        const sameDay = datesAreEqual(lastUpdated, now);

        return {
          count: sameDay ? addressUpdate.count : 0,
          date: sameDay ? lastUpdated.getTime() : now.getTime(),
        };
      }
    } catch (err) {
      console.error(err);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      count: 0,
      date: today.getTime(),
    };
  };

  useEffect(() => {
    (async () => {
      if (!__DEV__) {
        await update();
        setInterval(() => {
          update();
        }, 4 * 1000 * 60);
      }
    })();
  }, []);
};
