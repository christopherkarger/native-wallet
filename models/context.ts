import React from "react";
import { IConfig } from "../models/config";
import { MarketData } from "./market-data";

export enum SupportedLanguages {
  EN = "en",
  DE = "de",
}

export const defaultConfig: IConfig = {
  supported: [],
  urls: {},
};

export const DefaultLanguage = SupportedLanguages.EN;

export const AppConfig = React.createContext<IConfig>(defaultConfig);

export const DeviceLanguage =
  React.createContext<SupportedLanguages>(DefaultLanguage);

export const MarketDataContext = React.createContext<MarketData>(
  new MarketData([])
);

export const USDPriceContext = React.createContext(0);
