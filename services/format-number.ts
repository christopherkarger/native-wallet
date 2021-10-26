import numeral from "numeral";

export interface IFormatNumber {
  number: number;
  decimal?: string;
}

export const registerNumeralFormat = () => {
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
  numeral.locale("de");
};

export const formatNumber = (x: IFormatNumber): string => {
  const num = parseFloat(x.number.toString());

  if (num < 1) {
    return numeral(num).format("0,00.[0000]");
  }

  return numeral(num).format("0,00.[00]");
};
