import React from "react";
import { apiVersion } from "~/constants";
import { IConfig } from "../models/config";
import { MarketData } from "./market-data";

export const defaultConfig: IConfig = {
  apiVersion: apiVersion,
  supported: [],
  urls: {},
};
export const AppConfig = React.createContext<IConfig>(defaultConfig);

export const MarketDataContext = React.createContext<MarketData>(
  new MarketData([])
);
