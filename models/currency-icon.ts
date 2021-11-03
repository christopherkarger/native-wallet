import { SupportedCurrencies } from "./context";

export class CurrencyIcon {
  static icon(currency: SupportedCurrencies): string {
    switch (currency) {
      case SupportedCurrencies.EUR:
        return "€";
      default:
        return "$";
    }
  }
}
