import { IConfig } from "~/models/config";

export const fetchAddress = (
  cryptoAddress: string,
  cryptoCurrency: string,
  appConfig: IConfig
) => {
  const currency = cryptoCurrency.toLowerCase();
  let url = appConfig.urls.main;
  let addressType = "main";

  if (appConfig.urls[currency]) {
    url = appConfig.urls[currency];
    addressType = currency;
  } else {
    url = url.replace("${currency}", currency);
  }

  url = url.replace("${address}", cryptoAddress);

  return fetch(url)
    .then((response) =>
      response.json().then((res) => {
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
        } else {
          throw new Error("wallet not found");
        }
      })
    )
    .catch((err) => {
      console.log(err);
      throw new Error("fetching failed");
    });
};
