import React from "react";
import { MarketData } from "./market-data";

export enum SupportedLanguages {
  EN = "en",
  DE = "de",
}

export enum SupportedCurrencies {
  USD = "usd",
  EUR = "eur",
}

export const DefaultLanguage = SupportedLanguages.EN;
export const DefaultCurrency = SupportedCurrencies.USD;

export const ActiveLanguageContext = React.createContext<
  [SupportedLanguages, React.Dispatch<React.SetStateAction<SupportedLanguages>>]
>([DefaultLanguage, () => {}]);

export const MarketDataContext = React.createContext<MarketData>(
  new MarketData([])
);

export const USDPriceContext = React.createContext<number>(0);

export const ActiveCurrencyContext = React.createContext<
  [
    SupportedCurrencies,
    React.Dispatch<React.SetStateAction<SupportedCurrencies>>
  ]
>([DefaultCurrency, () => {}]);
