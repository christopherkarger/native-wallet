import React from "react";
import { IConfig } from "../models/config";

export const defaultConfig: IConfig = {
  supported: [],
  urls: {
    ada: "",
    main: "",
  },
};
export const AppConfig = React.createContext<IConfig>(defaultConfig);
