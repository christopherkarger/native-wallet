export const Config = {
  supported: [
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
  ],

  urls: {
    main: "https://api.blockchair.com/${name}/dashboards/address/${address}?transaction_details=true",
    cardano: "https://api.blockchair.com/cardano/raw/address/${address}",
    ripple: "https://api.blockchair.com/ripple/raw/account/${address}",
  },
};
