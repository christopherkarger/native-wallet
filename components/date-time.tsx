import React, { useContext } from "react";
import { View } from "react-native";
import { DeviceLanguage } from "~/models/context";
import { dateIsToday } from "~/services/helper";
import { Texts } from "~/texts";
import AppText from "./text";

export const DateTime = (props) => {
  const deviceLanguage = useContext(DeviceLanguage);
  const formatDate = (date: number) => {
    const d = new Date(date);
    const todayText = "Heute";
    const formatedDate = `${d.getDate()}.${
      d.getMonth() + 1
    }.${d.getFullYear()}`;

    const isToday = dateIsToday(d);

    if (props.hourView) {
      return `${d.getHours()} ${Texts.clock[deviceLanguage]} - ${
        isToday ? todayText : formatedDate
      }`;
    }

    return isToday ? todayText : formatedDate;
  };
  return (
    <View>
      <AppText>{formatDate(props.date)}</AppText>
    </View>
  );
};
