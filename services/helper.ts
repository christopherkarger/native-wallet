import { SupportedLanguages } from "~/models/context";
import { Texts } from "~/texts";

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

export const formatDate = (d: number, activeLanguage: SupportedLanguages) => {
  const date = new Date(d);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const time = `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
  const fullDate = `${date.getDate()}.${date.getMonth() + 1}`;
  const formatedDate = `${
    dateIsToday(date) ? Texts.today[activeLanguage] : fullDate
  } - ${time}`;
  return formatedDate;
};

export const dateIsToday = (date: Date) => {
  const now = new Date();

  return (
    now.getDay() === date.getDay() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  );
};
