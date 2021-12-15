export const SupportedWallets = [
  {
    currency: "BTC",
    name: "Bitcoin",
  },
  {
    currency: "ETH",
    name: "Ethereum",
  },
  {
    currency: "ADA",
    name: "Cardano",
  },
  {
    currency: "SOL",
    name: "Solana",
  },
  {
    currency: "AVAX",
    name: "Avalanche",
    info: "X-Chain",
  },
  {
    currency: "DOGE",
    name: "Dogecoin",
  },
  {
    currency: "LTC",
    name: "Litecoin",
  },
  {
    currency: "DASH",
    name: "Dash",
  },
  {
    currency: "XRP",
    name: "Ripple",
  },
  {
    currency: "SHIB",
    name: "SHIBA INU",
  },
  {
    currency: "MATIC",
    name: "Polygon",
  },
  {
    currency: "VET",
    name: "VeChain",
  },
];

export const SupportedCoins = [
  ...SupportedWallets,

  {
    currency: "MANA",
    name: "Decentraland",
  },
  {
    currency: "DOT",
    name: "Polkadot",
  },
  {
    currency: "LINK",
    name: "Chainlink",
  },
  {
    currency: "ALGO",
    name: "Algorand",
  },

  {
    currency: "LUNA",
    name: "Terra",
  },
  {
    currency: "SAND",
    name: "The Sandbox",
  },
  {
    currency: "MINA",
    name: "Mina",
  },
];

export const SupportedUrls = {
  main: "https://api.blockchair.com/${name}/dashboards/address/${address}",
  erc20:
    "https://api.blockchair.com/ethereum/erc-20/${tokenAddress}/dashboards/address/${address}  ",
  cardano: "https://api.blockchair.com/cardano/raw/address/${address}",
  ripple: "https://api.blockchair.com/ripple/raw/account/${address}",
  avalancheX: "https://api.avax.network/ext/bc/X",
  solana: "https://api.mainnet-beta.solana.com",
  vechain: "https://sync-mainnet.vechain.org/accounts/${address}",
};
