import { Platform } from "react-native";

export const apiVersion = 1;

export const isAndroid = Platform.OS === "android";

export const PathNames = {
  home: "home",
  addWallet: "add-wallet",
  singleWallet: "single-wallet",
  scanCode: "scan-code",
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
  fadeLight: "rgba(255,255,255, 0.8)",
  white: "#ffffff",
  lightWhite: "rgba(255,255,255, 0.5)",
  green: "#2BCD70",
  lightGreen: "#67ea9d",
  red: "#E8503A",
  btcRGB: "247,147,25",
  text: "#333333",
  purple: "#a96af7",
  lightBlue: "#38aae2",
  cryptos: {
    bitcoin: "#F79319",
    ethereum: "#627EEA",
    cardano: "#05202E",
    dogecoin: "#BA9F33",
    litecoin: "#345D9D",
    dash: "#008CE7",
  },
};
