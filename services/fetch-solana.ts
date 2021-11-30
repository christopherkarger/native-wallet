import { SupportedUrls } from "~/config";

export const fetchSolana = (address: string, name: string) => {
  const SOLANA_UNIT = 1000000000;

  return fetch(SupportedUrls.solana, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [address],
    }),
  }).then((response) =>
    response.json().then((res) => {
      if (res?.result?.value === undefined) {
        throw new Error("value not found");
      }
      return {
        balance: res.result.value / SOLANA_UNIT,
      };
    })
  );
};
