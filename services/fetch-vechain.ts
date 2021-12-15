import { SupportedUrls } from "~/config";

export const fetchVechain = (address: string, name: string) => {
  const VECHAIN_UNIT = 1000000000000000000;

  return fetch(SupportedUrls.vechain.replace("${address}", address))
    .then((res) => res.json())
    .then((res) => {
      if (!res?.balance) {
        throw new Error("response is missing");
      }
      // balance is returned in hex
      let balance = parseInt(res.balance, 16);

      if (isNaN(balance)) {
        throw new Error("response balance corrupt");
      }

      if (balance > 0) {
        balance = balance / VECHAIN_UNIT;
      }
      return {
        balance,
      };
    });
};
