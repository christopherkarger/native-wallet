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
    info: "X-Chain",
  },
  {
    currency: "AVAX",
    name: "Avalanche",
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
];

export const SupportedCoins = [
  ...SupportedWallets,
  {
    currency: "SAND",
    name: "The Sandbox",
  },
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
    currency: "MATIC",
    name: "Polygon",
  },
  {
    currency: "VET",
    name: "VeChain",
  },
];

export const SupportedUrls = {
  main: "https://api.blockchair.com/${name}/dashboards/address/${address}",
  cardano: "https://api.blockchair.com/cardano/raw/address/${address}",
  ripple: "https://api.blockchair.com/ripple/raw/account/${address}",
  avalancheX: "https://api.avax.network/ext/bc/X",
  solana: "https://api.mainnet-beta.solana.com",
};
