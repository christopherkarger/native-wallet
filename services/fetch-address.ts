import { SupportedUrls } from "~/config";
import { SupportedCryptos } from "~/models/config";
import { fetchAvalanche } from "./fetch-avalanche";
import { fetchERC20 } from "./fetch-erc20";
import { fetchSolana } from "./fetch-solana";

const CARDANO_UNIT = 1000000;
const RIPPLE_UNIT = 1000000;
const ETHEREUM_UNIT = 1000000000000000000;
const DEFAULT_UNIT = 100000000;

export const fetchAddress = (address: string, name: string) => {
  if (name === SupportedCryptos.Avalanche) {
    return fetchAvalanche(address, name);
  }

  if (name === SupportedCryptos.Solana) {
    return fetchSolana(address, name);
  }

  if (
    name === SupportedCryptos["SHIBA INU"] ||
    name === SupportedCryptos.Polygon
  ) {
    return fetchERC20(address, name);
  }

  const lowerCaseName = name.toLowerCase();

  let url = SupportedUrls.main;
  const configUrls = SupportedUrls as { [key: string]: string };
  if (configUrls[lowerCaseName]) {
    url = configUrls[lowerCaseName] as string;
  } else {
    url = url.replace("${name}", lowerCaseName);
  }

  url = url.replace("${address}", address);

  return fetch(url).then((response) =>
    response.json().then((res) => {
      if (!res?.data) {
        throw new Error("response data missing");
      }

      let balance: number;

      const walletAddress =
        res.data[address] || res.data[address.toLowerCase()];

      if (!walletAddress) {
        throw new Error("address not found");
      }

      switch (lowerCaseName) {
        case "cardano":
          balance = getCardanoBalance(walletAddress);
          break;
        case "ripple":
          balance = getRippleBalance(walletAddress);
          break;
        case "ethereum":
          balance = getEthereumBalance(walletAddress);
          break;
        default:
          balance = getDefaultBalance(walletAddress);
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
const getCardanoBalance = (walletAddress: any) => {
  if (
    !walletAddress.address?.caBalance?.getCoin &&
    walletAddress.address.caBalance.getCoin !== 0
  ) {
    throw new Error("cardano wallet invalid");
  }

  return +walletAddress.address.caBalance.getCoin / CARDANO_UNIT;
};

/**
 * Gets Ripple Balance
 */
const getRippleBalance = (walletAddress: any) => {
  if (
    !walletAddress.account?.account_data?.Balance &&
    walletAddress.account.account_data.Balance !== 0
  ) {
    throw new Error("ripple wallet invalid");
  }

  return +walletAddress.account.account_data.Balance / RIPPLE_UNIT;
};

/**
 * Gets Ethereum Balance
 */
const getEthereumBalance = (walletAddress: any) => {
  if (!walletAddress.address?.balance && walletAddress.address.balance !== 0) {
    throw new Error("ethereum balance not set");
  }
  // Balance returned in Wei
  return +walletAddress.address.balance / ETHEREUM_UNIT;
};

/**
 * Gets Default Balance
 */
const getDefaultBalance = (walletAddress: any) => {
  if (!walletAddress.address?.balance && walletAddress.address.balance !== 0) {
    throw new Error("default balance not set");
  }

  // Balance returned in satoshis
  return +walletAddress.address.balance / DEFAULT_UNIT;
};
