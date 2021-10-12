export interface IFormatNumber {
  number: number;
  decimal?: number;
  beautifulDecimal?: boolean;
}

export const formatNumber = (x: IFormatNumber): string => {
  const separator = ".";
  const comma = ",";
  let hasDecimal = !Number.isInteger(x.number);
  let number = x.number.toString();

  if (x.decimal) {
    number = hasDecimal ? x.number.toFixed(x.decimal) : x.number.toString();
  } else if (x.beautifulDecimal) {
    number = getMinDecimalNumber(x.number).toString();
    hasDecimal = !Number.isInteger(+number);
  }

  if (x.number >= 1000 && x.number < 1000000000000) {
    let pos = [1];

    if (x.number >= 10000 && x.number < 100000) {
      pos = [2];
    }

    if (x.number >= 100000) {
      pos = [3];
    }

    if (x.number >= 1000000) {
      pos = [1, 5];
    }

    if (x.number >= 10000000) {
      pos = [2, 6];
    }

    if (x.number >= 100000000) {
      pos = [3, 7];
    }

    if (x.number >= 1000000000) {
      pos = [1, 5, 9];
    }

    if (x.number >= 10000000000) {
      pos = [2, 6, 10];
    }

    if (x.number >= 100000000000) {
      pos = [3, 7, 11];
    }

    const m = number.split("");

    pos.forEach((p) => {
      m.splice(p, 0, separator);
    });

    number = m.join("");
  }

  // If inuput number has decimal
  if (hasDecimal) {
    number = number
      .split("")
      .reverse()
      .join("")
      .replace(".", comma)
      .split("")
      .reverse()
      .join("");
  }

  return number;
};

const getMinDecimalNumber = (num: number): number => {
  // If number has no decimals
  if (Number.isInteger(num)) {
    return num;
  }

  // If number is bigger than 1
  if (num > 1) {
    return +num.toFixed(2);
  }

  const decArr: string[] = [];
  let counter = 0;
  const decimals = num.toString().split(".")[1].split("");
  let foundPosDec = false;
  decimals.forEach((d) => {
    if (+d > 0) {
      foundPosDec = true;
    }
    if (foundPosDec) {
      counter += 1;
    }
    if (counter <= 4) {
      decArr.push(d);
    }
  });
  return Math.floor(num) + +`0.${decArr.join("")}`;
};
