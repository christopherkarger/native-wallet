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
      const time = props.date.split(" ")[1];
      if (time) {
        const timeArr = time.split(":");
        if (timeArr[0] && timeArr[1]) {
          d.setUTCHours(timeArr[0]);
          d.setUTCMinutes(timeArr[1]);
        }
      }

      if (!d.getTime()) {
        return Empty;
      }
    }
  }

  if (props.utcDate && !props.hourView) {
    // Set to UTC Date, market data gets fetched at utc time zone
    d = new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
  }

  const formatedDate = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  const formatedTime = `${d.getHours() < 10 ? "0" : ""}${d.getHours()}:${
    d.getMinutes() < 10 ? "0" : ""
  }${d.getMinutes()}`;

  const isToday = dateIsToday(d);

  return (
    <AppText style={props.style}>
      {props.hourView &&
        `${d.getHours() < 10 ? "0" : ""}${d.getHours()}:00 - ${
          isToday ? todayText : formatedDate
        }`}
      {!props.hourView && (isToday ? todayText : formatedDate)}
      {props.withTime && ` - ${formatedTime}`}
    </AppText>
  );
};
