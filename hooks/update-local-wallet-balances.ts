import { useContext, useEffect } from "react";
import { DeviceEventEmitter } from "react-native";
import { MAX_FETCHING_ADDRESSES, UPDATE_WALLETS_EVENT } from "~/constants";
import {
  saveLocalDBTableAddressUpdate,
  selectLocalDBTableAddressUpdate,
  selectLocalDBTableWallets,
  updateItemBalanceToLocalDBTableWallets,
} from "~/db";
import { AppConfigContext } from "~/models/context";
import { fetchAddress } from "../services/fetch-address";
import { waitTime } from "../services/helper";

export enum UPDATE_WALLETS_EVENT_TYPE {
  Update,
  Add,
  Delete,
}

export const useUpdateLocalWalletBalances = async () => {
  const appConfig = useContext(AppConfigContext);

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
              wallet.name,
              appConfig
            );
            updateItemBalanceToLocalDBTableWallets(
              wallet.id,
              fetchedAddress.balance,
              new Date().getTime(),
              fetchedAddress.transactions
            );
          } catch (err) {
            console.error(err);
          }

          await updateLocalAdressUpdateTable(addressUpdate);
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
      const addressUpdate = await selectLocalDBTableAddressUpdate();
      if (addressUpdate && addressUpdate.rows.length) {
        return {
          count: addressUpdate.rows._array[0].count,
          date: addressUpdate.rows._array[0].date,
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

  const updateLocalAdressUpdateTable = async (localAddressUpdate: {
    count: number;
    date: number;
  }) => {
    const today = new Date();
    const lastUpdated = new Date(localAddressUpdate.date);

    today.setHours(0, 0, 0, 0);
    lastUpdated.setHours(0, 0, 0, 0);

    const isSameDay = today.getTime() === lastUpdated.getTime();
    try {
      const date = isSameDay ? lastUpdated.getTime() : today.getTime();
      const count = isSameDay ? localAddressUpdate.count + 1 : 1;
      await saveLocalDBTableAddressUpdate(date, count);
    } catch (err) {
      console.error(err);
    }
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
