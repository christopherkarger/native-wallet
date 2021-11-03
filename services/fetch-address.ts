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

      let balance: number;
      switch (lowerCaseName) {
        case "cardano":
          balance = getCardanoBalance(res, address);
          break;
        case "ripple":
          balance = getRippleBalance(res, address);
          break;
        default:
          balance = getDefaultBalance(res, address, lowerCaseName);
      }

      return {
        balance,
      };
    })
  );
};

/**
 * Gets Cardano Balance
 */
const getCardanoBalance = (res: any, address: string) => {
  const walletAddress = res.data[address] || res.data[address.toLowerCase()];
  if (!walletAddress || !walletAddress.address) {
    throw new Error("address not found or has no address property");
  }

  if (
    !walletAddress.address.caBalance ||
    (!walletAddress.address.caBalance.getCoin &&
      walletAddress.address.caBalance.getCoin !== 0)
  ) {
    throw new Error("cardano wallet invalid");
  }

  return +walletAddress.address.caBalance.getCoin;
};

/**
 * Gets Ripple Balance
 */
const getRippleBalance = (res: any, address: string) => {
  const walletAddress = res.data[address] || res.data[address.toLowerCase()];
  if (!walletAddress) {
    throw new Error("address not found");
  }

  if (
    !walletAddress.account?.account_data?.Balance &&
    walletAddress.account.account_data.Balance !== 0
  ) {
    throw new Error("ripple wallet invalid");
  }

  return +walletAddress.account.account_data.Balance / 1000000;
};

/**
 * Gets Default Balance
 */
const getDefaultBalance = (
  res: any,
  address: string,
  lowerCaseName: string
) => {
  const walletAddress = res.data[address] || res.data[address.toLowerCase()];

  if (!walletAddress) {
    throw new Error("address not found");
  }

  if (!walletAddress.address?.type) {
    throw new Error("type not set");
  }

  if (!walletAddress.address.balance && walletAddress.address.balance !== 0) {
    throw new Error("balance not set");
  }

  switch (lowerCaseName) {
    case "ethereum":
      // Balance returned in Wei
      return +walletAddress.address.balance / 1000000000000000000;
    default:
      // Balance returned in satoshis
      return +walletAddress.address.balance / 100000000;
  }
};
