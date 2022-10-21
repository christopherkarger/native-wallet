export const waitTime = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const calcPercentage = (prev: number, current: number): number => {
  return ((current - prev) / prev) * 100;
};

export const randomString = (index = 0) => {
  return Math.random().toString(36).substring(2, 5) + index.toString();
};

export const datesAreEqual = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
