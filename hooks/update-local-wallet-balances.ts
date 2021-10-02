import { useContext, useEffect } from "react";
import { selectLocalDBTable, updateItemBalanceToLocalDB } from "~/db";
import { AppConfig } from "~/models/context";
import { getWalletWrapper } from "~/services/getWalletWrapper";
import { fetchAddress } from "../services/fetch-address";
import { waitTime } from "../services/helper";
import useAppStatus from "./handle-app-state";

export const useUpdateLocalWalletBalances = async () => {
  const appConfig = useContext(AppConfig);
  const appStatus = useAppStatus();

  const update = async () => {
    const localWallets = await selectLocalDBTable().catch(() => {});
    if (localWallets && localWallets.rows.length) {
      const walletsData = getWalletWrapper(localWallets.rows._array);
      for (const data of walletsData) {
        for (const wallet of data.wallets) {
          try {
            await waitTime(1000);
            const balance = await fetchAddress(
              wallet.address,
              wallet.name,
              appConfig
            );
            updateItemBalanceToLocalDB(wallet.id, balance);
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (appStatus === "active") {
      update();
    }
  }, [appStatus]);
};
