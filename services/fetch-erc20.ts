import { SupportedUrls } from "~/config";
import { SupportedCryptos } from "~/models/config";

export const fetchERC20 = async (address: string, name: string) => {
  let url = SupportedUrls.erc20.replace("${address}", address);
  const tokenPlaceholder = "${tokenAddress}";
  const ETHEREUM_UNIT = 1000000000000000000;

  if (name === SupportedCryptos["Shiba Inu"]) {
    url = url.replace(
      tokenPlaceholder,
      "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
    );
  }

  if (name === SupportedCryptos.Polygon) {
    url = url.replace(
      tokenPlaceholder,
      "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
    );
  }

  return fetch(url).then((response) =>
    response.json().then((res) => {
      const walletAddress =
        res.data[address] || res.data[address.toLowerCase()];

      if (!walletAddress) {
        throw new Error("address not found");
      }

      if (
        !walletAddress.address.balance &&
        walletAddress.address.balance !== 0
      ) {
        throw new Error("balance not set");
      }

      return {
        balance: +walletAddress.address.balance / ETHEREUM_UNIT,
      };
    })
  );
};
