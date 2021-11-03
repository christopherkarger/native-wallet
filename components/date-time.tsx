import React, { useContext } from "react";
import { View } from "react-native";
import { ActiveLanguageContext } from "~/models/context";
import { dateIsToday } from "~/services/helper";
import { Texts } from "~/texts";
import AppText from "./text";

export const DateTime = (props) => {
  const [activeLanguage] = useContext(ActiveLanguageContext);

  const formatDate = (date: number) => {
    const d = new Date(date);
    const todayText = Texts.today[activeLanguage];
    const formatedDate = `${d.getDate()}.${
      d.getMonth() + 1
    }.${d.getFullYear()}`;

    const isToday = dateIsToday(d);

    if (props.hourView) {
      return `${d.getHours()}:00 - ${isToday ? todayText : formatedDate}`;
    }

    return isToday ? todayText : formatedDate;
  };
  return (
    <View>
      <AppText>{formatDate(props.date)}</AppText>
    </View>
  );
};
