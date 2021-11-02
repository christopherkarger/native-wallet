import numeral from "numeral";
import { SupportedLanguages } from "~/models/context";

export interface IFormatNumber {
  number: number;
  language: SupportedLanguages;
  decimal?: string;
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
    console.error("not able to register locale");
  }

  switchNumeralLocal(language);
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
