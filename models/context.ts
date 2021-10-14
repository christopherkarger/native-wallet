import React from "react";
import { IConfig } from "../models/config";
import { MarketData } from "./market-data";

export const defaultConfig: IConfig = {
  supported: [],
  urls: {},
};
export const AppConfig = React.createContext<IConfig>(defaultConfig);

export const MarketDataContext = React.createContext<MarketData>(
  new MarketData([])
);
