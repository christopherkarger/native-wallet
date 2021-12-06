import { Platform } from "react-native";

export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

export const UPDATE_WALLETS_EVENT = "event.updateWallets";

export const EURO_STABLECOIN = "Tether EURt";

export const PathNames = {
  homeTab: "homeTab",
  addAssetTab: "add-assetTab",

  home: "home",
  addWallet: "add-wallet",
  addCoin: "add-coin",
  addAsset: "add-asset",
  singleWallet: "single-wallet",
  singleCoin: "single-coin",
  scanCode: "scan-code",
  marketDataItem: "market-data-item",
  settings: "settings",
  portfolioOverview: "portfolio-overview",
};

export const Fonts = {
  light: "karla-light",
  regular: "karla-regular",
  semibold: "karla-semibold",
  bold: "karla-bold",
};

export const Colors = {
  transparent: "transparent",
  bgDark: "#273244",
  darkBlue: "#1c2637",
  fadeLight: "rgba(255,255,255, 0.8)",
  white: "#ffffff",
  lightWhite: "rgba(255,255,255, 0.2)",
  grey: "#a7a5a5",
  green: "#2BCD70",
  lightGreen: "#67ea9d",
  red: "#E8503A",
  btcRGB: "247,147,25",
  text: "#333333",
  purple: "#a96af7",
  lightBlue: "#38aae2",
  greyBlue: "#35445c",
  ripple: "#587199",
  lightGreyBlue: "#415370",
  cryptos: {
    bitcoin: "#F79319",
    ethereum: "#627EEA",
    cardano: "#0E1E30",
    dogecoin: "#C3A634",
    litecoin: "#BFBBBB",
    dash: "#008CE7",
    ripple: "#23282F",
    theSandbox: "#08ACEF",
    decentraland: "#FE4A56",
    binanceCoin: "#F3BA2F",
    solana: "#000000",
    polkadot: "#E6177A",
    avalanche: "#E94042",
    chainlink: "#2A5ADA",
    algorand: "#000000",
    polygon: "#6F41D8",
    veChain: "#18BDFF",
    shibaInu: "#e63017",
    terra: "#0a1c73",
    mina: "#8470F0",
  },
};
