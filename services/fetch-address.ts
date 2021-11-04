import { ITransactions } from "~/db";
import { IConfig } from "~/models/config";

interface IFetchHeader {
  headers?: {
    [key: string]: string;
  };
}

const MAX_TRANSACTIONS = 20;

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
      if (!res?.data) {
        throw new Error("response data missing");
      }

      let balance: number;
      let transactions: ITransactions[] = [];

      const walletAddress =
        res.data[address] || res.data[address.toLowerCase()];

      if (!walletAddress) {
        throw new Error("address not found");
      }

      switch (lowerCaseName) {
        case "cardano":
          transactions = getCardanoTransactions(walletAddress, address);
          balance = getCardanoBalance(walletAddress);
          break;
        case "ripple":
          transactions = getRippleTransactions(walletAddress, address);
          balance = getRippleBalance(walletAddress);
          break;
        case "ethereum":
          transactions = getEthereumTransactions(walletAddress);
          balance = getEthereumBalance(walletAddress);
          break;
        default:
          transactions = getDefaultTransactions(walletAddress);
          balance = getDefaultBalance(walletAddress);
      }

      return {
        balance,
        transactions,
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

  return +walletAddress.address.caBalance.getCoin / 1000000;
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

  return +walletAddress.account.account_data.Balance / 1000000;
};

/**
 * Gets Ethereum Balance
 */
const getEthereumBalance = (walletAddress: any) => {
  if (!walletAddress.address?.type) {
    throw new Error("ethereum type not set");
  }

  if (!walletAddress.address.balance && walletAddress.address.balance !== 0) {
    throw new Error("ethereum balance not set");
  }
  // Balance returned in Wei
  return +walletAddress.address.balance / 1000000000000000000;
};

/**
 * Gets Default Balance
 */
const getDefaultBalance = (walletAddress: any) => {
  if (!walletAddress.address?.type) {
    throw new Error("default type not set");
  }

  if (!walletAddress.address.balance && walletAddress.address.balance !== 0) {
    throw new Error("default balance not set");
  }

  // Balance returned in satoshis
  return +walletAddress.address.balance / 100000000;
};

/**
 * Get Ethreum Transactions
 */
const getEthereumTransactions = (walletAddress: any) => {
  const transactions = walletAddress.calls || [];
  return transactions.slice(0, MAX_TRANSACTIONS).map((c) => ({
    balance_change: c.value,
    hash: c.transaction_hash,
    time: c.time,
  }));
};

/**
 * Gets cardano transactions
 */
const getCardanoTransactions = (
  walletAddress: any,
  address: string
): ITransactions[] => {
  const tx = walletAddress.address?.caTxList || [];
  return tx.slice(0, MAX_TRANSACTIONS).map((t) => {
    let outputs = 0;
    let inputs = 0;
    t.ctbInputs.forEach((i) => {
      if (i.ctaAddress === address) {
        inputs += +i.ctaAmount.getCoin;
      }
    });

    t.ctbOutputs.forEach((o) => {
      if (o.ctaAddress === address) {
        outputs += +o.ctaAmount.getCoin;
      }
    });

    return {
      balance_change: (outputs - inputs) / 1000000,
      time: `${t.ctbTimeIssued * 1000}`,
      hash: t.ctbId,
    };
  });
};

/**
 * Gets ripple transactions
 */
const getRippleTransactions = (
  walletAddress: any,
  address: string
): ITransactions[] => {
  const transactions = walletAddress.transactions?.transactions || [];
  return transactions
    .slice(0, MAX_TRANSACTIONS)
    .filter((t) => !!t.tx)
    .map((t) => ({
      balance_change:
        t.tx.Destination === address ? t.tx.Amount : t.tx.Amount * -1,
      hash: t.tx.hash,
      time: `${t.tx.date * 1000}`,
    }));
};

/**
 * Get default transactions
 */
const getDefaultTransactions = (walletAddress: any): ITransactions[] => {
  const transactions = walletAddress.transactions || [];
  return transactions.slice(0, MAX_TRANSACTIONS).map((t) => ({
    balance_change: t.balance_change,
    hash: t.hash,
    time: t.time,
  }));
};
