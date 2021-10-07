export const waitTime = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const formatNumber = (num: number, decimal?: number): string => {
  let number;
  const separator = ".";
  const comma = ",";
  const hasDecimal = !Number.isInteger(num);

  if (decimal) {
    number = hasDecimal ? num.toFixed(decimal) : num.toString();
  } else {
    number = num < 1 ? num.toFixed(4) : num.toFixed(2);
  }

  if (num >= 1000 && num < 1000000000000) {
    let pos = [1];

    if (num >= 10000 && num < 100000) {
      pos = [2];
    }

    if (num >= 100000) {
      pos = [3];
    }

    if (num >= 1000000) {
      pos = [1, 5];
    }

    if (num >= 10000000) {
      pos = [2, 6];
    }

    if (num >= 100000000) {
      pos = [3, 7];
    }

    if (num >= 1000000000) {
      pos = [1, 5, 9];
    }

    if (num >= 10000000000) {
      pos = [2, 6, 10];
    }

    if (num >= 100000000000) {
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
