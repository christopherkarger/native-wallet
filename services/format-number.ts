import numeral from "numeral";

export interface IFormatNumber {
  number: number;
  decimal?: string;
}

export const formatNumber = (x: IFormatNumber): string => {
  if (x.decimal) {
    return numeral(x.number).format(`0,00.${x.decimal}`);
  }
  if (x.number < 1) {
    return numeral(x.number).format("0,00.0000");
  }
  return numeral(x.number).format("0,00.00");
};
