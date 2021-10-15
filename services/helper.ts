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
