import { Platform } from "react-native";

export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

export const UPDATE_WALLETS_EVENT = "event.updateWallets";
export const USD_CRYPTO = "Tether";

export const PathNames = {
  homeTab: "homeTab",
  addAssetTab: "add-assetTab",

  home: "home",
  addWallet: "add-wallet",
  addAsset: "add-asset",
  singleWallet: "single-wallet",
  scanCode: "scan-code",
  marketDataItem: "market-data-item",
  settings: "settings",
  transactions: "transactions",
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
  },
};
