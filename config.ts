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
];

export const SupportedUrls = {
  main: "https://api.blockchair.com/${name}/dashboards/address/${address}?transaction_details=true",
  cardano: "https://api.blockchair.com/cardano/raw/address/${address}",
  ripple:
    "https://api.blockchair.com/ripple/raw/account/${address}?transactions=true",
};
