import React, { useContext } from "react";
import { ActiveLanguageContext } from "~/models/context";
import { dateIsToday } from "~/services/helper";
import { Texts } from "~/texts";
import AppText from "./text";

export const DateTime = (props) => {
  const [activeLanguage] = useContext(ActiveLanguageContext);
  let d = new Date(props.date);
  const todayText = Texts.today[activeLanguage];
  const Empty = <AppText style={props.style}>-</AppText>;

  if (!props.date) {
    return Empty;
  }

  if (!d.getTime()) {
    d = new Date(+props.date);
    if (!d.getTime()) {
      d = new Date(props.date.split(" ")[0]);
      if (!d.getTime()) {
        return Empty;
      }
    }
  }

  const formatedDate = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  const formatedTime = `${d.getHours() < 10 ? "0" : ""}${d.getHours()}:${
    d.getMinutes() < 10 ? "0" : ""
  }${d.getMinutes()}`;
  const isToday = dateIsToday(d);

  return (
    <AppText style={props.style}>
      {props.hourView &&
        `${d.getHours()}:00 - ${isToday ? todayText : formatedDate}`}
      {!props.hourView && (isToday ? todayText : formatedDate)}
      {props.withTime && ` - ${formatedTime}`}
    </AppText>
  );
};
