import { useContext, useEffect } from "react";
import { DeviceEventEmitter } from "react-native";
import { UPDATE_WALLETS_EVENT } from "~/constants";
import {
  selectLocalDBTableWallets,
  updateItemBalanceToLocalDBTableWallets,
} from "~/db";
import { AppConfig } from "~/models/context";
import { getWalletWrapper } from "~/services/getWalletWrapper";
import { fetchAddress } from "../services/fetch-address";
import { waitTime } from "../services/helper";
import useAppStatus, { AppStaus } from "./handle-app-state";

export const useUpdateLocalWalletBalances = async () => {
  const appConfig = useContext(AppConfig);
  const appStatus = useAppStatus();

  const update = async () => {
    let isDemoMode = false;
    const localWallets = await selectLocalDBTableWallets().catch(() => {});
    if (localWallets && localWallets.rows.length) {
      const walletsData = getWalletWrapper(localWallets.rows._array);
      for (const data of walletsData) {
        for (const wallet of data.wallets) {
          try {
            if (!wallet.demoAddress) {
              await waitTime(1000);
              const balance = await fetchAddress(
                wallet.address,
                wallet.name,
                appConfig
              );
              updateItemBalanceToLocalDBTableWallets(wallet.id, balance);
            } else {
              isDemoMode = true;
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    }

    if (!isDemoMode) {
      DeviceEventEmitter.emit(UPDATE_WALLETS_EVENT, true);
    }
  };

  useEffect(() => {
    if (appStatus === AppStaus.Active) {
      update();
    }
  }, [appStatus]);
};
