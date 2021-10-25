import { IConfig } from "~/models/config";

interface IFetchHeader {
  headers?: {
    [key: string]: string;
  };
}

export const fetchAddress = (
  address: string,
  name: string,
  appConfig: IConfig
) => {
  let url = appConfig.urls.main;
  const fetchHeaders: IFetchHeader = {};
  const lowerCaseName = name.toLowerCase();

  if (appConfig.urls[lowerCaseName]) {
    url = appConfig.urls[lowerCaseName];
  } else {
    url = url.replace("${name}", lowerCaseName);
  }

  url = url.replace("${address}", address);
  return fetch(url, fetchHeaders).then((response) =>
    response.json().then((res) => {
      if (!res.data) {
        throw new Error("response data missing");
      }

      const walletAddress =
        res.data[address] || res.data[address.toLowerCase()];

      if (!walletAddress || !walletAddress.address) {
        throw new Error("address not found or has no address property");
      }

      let balance: number;
      switch (lowerCaseName) {
        case "cardano":
          if (
            !walletAddress.address.caBalance ||
            (!walletAddress.address.caBalance.getCoin &&
              walletAddress.address.caBalance.getCoin !== 0)
          ) {
            throw new Error("cardano wallet invalid");
          }
          balance = +walletAddress.address.caBalance.getCoin;
          break;
        default:
          switch (lowerCaseName) {
            default:
              if (!walletAddress.address.type) {
                throw new Error("main wallet type not set");
              }
              if (
                !walletAddress.address.balance &&
                walletAddress.address.balance !== 0
              ) {
                throw new Error("main wallet invalid");
              }
              balance = +walletAddress.address.balance;
          }
      }

      switch (lowerCaseName) {
        case "cardano":
          // Do nothing cardano balance is already correct
          break;
        case "ethereum":
          // Balance returned in Wei
          balance = balance / 1000000000000000000;
          break;
        default:
          // Balance returned in satoshis
          balance = balance / 100000000;
      }

      return {
        balance,
      };
    })
  );
};
