import React from "react";
import { IMarketData } from "~/services/fetch-marketdata";
import { IConfig } from "../models/config";

export const defaultConfig: IConfig = {
  supported: [],
  urls: {},
};
export const AppConfig = React.createContext<IConfig>(defaultConfig);

export const MarketData = React.createContext<IMarketData>({});
