import { useContext, useEffect } from "react";
import { selectLocalDBTable, updateItemToLocalDB } from "~/db";
import { AppConfig } from "~/models/context";
import { getWalletWrapper } from "~/services/getWalletWrapper";
import { fetchAddress } from "../services/fetch-address";
import { waitTime } from "../services/helper";

export const useUpdateLocalWalletBalances = async () => {
  const appConfig = useContext(AppConfig);

  useEffect(() => {
    (async () => {
      const localWallets = await selectLocalDBTable().catch(() => {});
      if (localWallets && localWallets.rows.length) {
        const walletsData = getWalletWrapper(localWallets.rows._array);
        for (const data of walletsData) {
          for (const wallet of data.wallets) {
            try {
              await waitTime(1000);
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
      }
    })();
  }, []);
};
