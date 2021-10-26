import numeral from "numeral";

export interface IFormatNumber {
  number: number;
  decimal?: string;
}

export const registerNumeralFormat = () => {
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
    numeral.locale("de");
  } catch (err) {
    console.error("numeral local already registered");
  }
};

export const formatNumber = (x: IFormatNumber): string => {
  const num = parseFloat(x.number.toString());
  if (num < 1) {
    return numeral(num).format("0,00.[0000]");
  }

  const formatedNum = numeral(num).format("0,00.[00]");

  // If number is for example 10,2 add ending 0 -> 10,20
  if (formatedNum.split(",")[1]?.length === 1) {
    return numeral(num).format("0,00.00");
  }
  return formatedNum;
};
