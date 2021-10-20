import React from "react";
import { View } from "react-native";
import { dateIsToday } from "~/services/helper";
import AppText from "./text";

export const DateTime = (props) => {
  const formatDate = (date: number) => {
    const d = new Date(date);
    const todayText = "Heute";
    const formatedDate = `${d.getDate()}.${
      d.getMonth() + 1
    }.${d.getFullYear()}`;

    const isToday = dateIsToday(d);

    if (props.hourView) {
      return `${d.getHours()} Uhr - ${isToday ? todayText : formatedDate}`;
    }

    return isToday ? todayText : formatedDate;
  };
  return (
    <View>
      <AppText>{formatDate(props.date)}</AppText>
    </View>
  );
};
