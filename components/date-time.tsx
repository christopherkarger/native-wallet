import React from "react";
import { View } from "react-native";
import AppText from "./text";

export const DateTime = (props) => {
  const formatDate = (date: number) => {
    const d = new Date(date);
    const now = new Date();
    if (props.hourView) {
      return `${d.getHours()} Uhr - ${
        now.getDay() === d.getDay() ? "Heute" : "Gestern"
      }`;
    }
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };
  return (
    <View>
      <AppText>{formatDate(props.date)}</AppText>
    </View>
  );
};
