import { IConfig } from "~/models/config";

interface IFetchHeader {
  headers?: {
    [key: string]: string;
  };
}

export const fetchAddress = (
  cryptoAddress: string,
  cryptoCurrency: string,
  appConfig: IConfig
) => {
  const currency = cryptoCurrency.toLowerCase();
  let url = appConfig.urls.main;
  let addressType = "main";
  const fetchHeaders: IFetchHeader = {};

  if (appConfig.urls[currency]) {
    url = appConfig.urls[currency];
    addressType = currency;
  } else {
    url = url.replace("${currency}", currency);
  }

  url = url.replace("${address}", cryptoAddress);

  if (addressType === "ada") {
    fetchHeaders.headers = {
      project_id: "xCDic1xoxPW4T2ehiZzW0vPO4QB78SCm",
    };
  }

  return fetch(url, fetchHeaders)
    .then((response) =>
      response.json().then((res) => {
        switch (addressType) {
          case "ada":
            if (res.amount !== undefined) {
              let amount = 0;
              for (let a of res.amount) {
                amount += +a.quantity;
              }
              return amount / 1000000;
            }
          default:
            if (res.final_balance !== undefined) {
              let balance: number;
              switch (addressType) {
                default:
                  balance = +res.final_balance;
              }

              switch (currency) {
                case "eth":
                  // Balance returned in Wei
                  return balance / 1000000000000000000;
                default:
                  // Balance returned in satoshis
                  return balance / 100000000;
              }
            }
        }

        throw new Error("wallet not found");
      })
    )
    .catch((err) => {
      console.log(err);
      throw new Error("fetching failed");
    });
};
