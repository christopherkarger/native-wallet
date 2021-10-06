import React from "react";
import { apiVersion } from "~/constants";
import { IMarketData } from "~/services/fetch-marketdata";
import { IConfig } from "../models/config";

export const defaultConfig: IConfig = {
  apiVersion: apiVersion,
  supported: [],
  urls: {},
};
export const AppConfig = React.createContext<IConfig>(defaultConfig);

export const MarketData = React.createContext<IMarketData>({});
