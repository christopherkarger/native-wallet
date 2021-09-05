import { Platform } from "react-native";

export const isAndroid = Platform.OS === "android";

export const PathNames = {
  home: "home",
  addWallet: "add-wallet",
};

export const Fonts = {
  light: "karla-light",
  regular: "karla-regular",
  semibold: "karla-semibold",
  bold: "karla-bold",
};

export const Colors = {
  transparent: "transparent",
  bgDark: "#070628",
  fadeLight: "rgba(255,255,255, 0.15)",
  white: "#ffffff",
  lightWhite: "rgba(255,255,255, 0.5)",
  green: "#01B670",
  red: "#E8503A",
  btcRGB: "247,147,25",
  text: "#333333",
};
