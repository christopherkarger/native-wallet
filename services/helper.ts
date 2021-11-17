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
  return Math.random().toString(36).substr(2, 5) + index.toString();
};

export const dateIsToday = (date: Date) => {
  const now = new Date();

  return (
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  );
};
