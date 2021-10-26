import numeral from "numeral";
import { SupportedLanguages } from "~/models/context";

export interface IFormatNumber {
  number: number;
  language: SupportedLanguages;
  decimal?: string;
}

export const registerNumeralFormat = (language: string) => {
  if (language === SupportedLanguages.DE) {
    try {
      numeral.register("locale", SupportedLanguages.DE, {
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
      numeral.locale(SupportedLanguages.DE);
    } catch (err) {
      console.error("not able to register locale");
    }
  }
};

export const formatNumber = (x: IFormatNumber): string => {
  const num = parseFloat(x.number.toString());
  if (num < 1) {
    return numeral(num).format("0,00.[0000]");
  }

  const formatedNum = numeral(num).format("0,00.[00]");

  // If number is for example 10,2 add ending 0 -> 10,20
  if (
    formatedNum.split(x.language === SupportedLanguages.DE ? "," : ".")[1]
      ?.length === 1
  ) {
    return numeral(num).format("0,00.00");
  }
  return formatedNum;
};
