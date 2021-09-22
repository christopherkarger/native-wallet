import React from "react";
import { IConfig } from "../models/config";

export const defaultConfig: IConfig = {
  supported: [],
  urls: {},
};
export const AppConfig = React.createContext<IConfig>(defaultConfig);
