import numeral from "numeral";
import { SupportedCurrencies, SupportedLanguages } from "~/models/context";

export interface IFormatNumber {
  decimal?: string;
  number: number;
  language: SupportedLanguages;
  maxChar?: number;
}

export interface IFormatCurrency extends IFormatNumber {
  currency: SupportedCurrencies;
  euroPrice: number;
}

export const switchNumeralLocal = (language: string) => {
  if (language === SupportedLanguages.DE) {
    numeral.locale("de");
  } else {
    numeral.locale("en");
  }
};

export const registerNumeralFormat = (language: string) => {
  try {
    numeral.register("locale", "de", {
      delimiters: {
        thousands: ".",
        decimal: ",",
      },
      abbreviations: {
        thousand: "tsd.",
        million: "mil.",
        billion: "mrd.",
        trillion: "trill.",
      },
      ordinal: function (number) {
        return number.toString();
      },
      currency: {
        symbol: "€",
      },
    });
  } catch (err) {
    console.error(err);
    console.error("not able to register locale");
  }

  switchNumeralLocal(language);
};

export const formatNumberWithCurrency = (x: IFormatCurrency) => {
  return formatNumber({
    ...x,
    number:
      x.currency === SupportedCurrencies.EUR
        ? x.number * (x.number / (x.number * x.euroPrice))
        : x.number,
  });
};

export const formatNumber = (x: IFormatNumber): string => {
  if (isNaN(x.number) || x.number === null) {
    return " ";
  }

  const num = parseFloat(x.number.toString());
  let formatedNumber = numeral(num).format("0,00.[00]");

  if (x.decimal) {
    formatedNumber = numeral(num).format(`0,00.[${x.decimal}]`);
  } else if (num < 1) {
    formatedNumber = numeral(num).format("0,00.[0000000]");
  } else if (
    formatedNumber.split(x.language === SupportedLanguages.DE ? "," : ".")[1]
      ?.length === 1
  ) {
    // If number is 10,2 add ending 0 -> 10,20
    formatedNumber = numeral(num).format("0,00.00");
  }

  if (x.maxChar && formatedNumber.length > x.maxChar) {
    formatedNumber = `${formatedNumber.substring(0, x.maxChar)}...`;
  }

  return formatedNumber;
};
