import React from "react";
import { View } from "react-native";
import AppText from "./text";

export const DateTime = (props) => {
  const formatDate = (date: number) => {
    const d = new Date(date);
    const now = new Date();
    const formatedDate = `${d.getDate()}.${
      d.getMonth() + 1
    }.${d.getFullYear()}`;

    if (props.hourView) {
      return `${d.getHours()} Uhr - ${
        now.getDay() === d.getDay() &&
        now.getMonth() === d.getMonth() &&
        now.getFullYear() === d.getFullYear()
          ? "Heute"
          : formatedDate
      }`;
    }
    return formatedDate;
  };
  return (
    <View>
      <AppText>{formatDate(props.date)}</AppText>
    </View>
  );
};
