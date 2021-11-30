import { SupportedUrls } from "~/config";

export const fetchAvalanche = (address: string, name: string) => {
  const XChainPrefix = "X-";
  const AVAX_UNIT = 1000000000;

  let avaxAddress = address;
  if (avaxAddress.substr(0, 2) !== XChainPrefix) {
    avaxAddress = XChainPrefix + address;
  }

  return fetch(SupportedUrls.avalancheX, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "avm.getAllBalances",
      params: {
        address: avaxAddress,
      },
    }),
  }).then((response) =>
    response.json().then((res) => {
      if (res?.result?.balances === undefined) {
        throw new Error("balances not found");
      }

      let amount = 0;
      const balances = res.result.balances;
      for (const a of balances) {
        amount += a.balance;
      }

      return {
        balance: amount / AVAX_UNIT,
      };
    })
  );
};
