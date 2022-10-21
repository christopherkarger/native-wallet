import React, { useContext } from "react";
import { ActiveLanguageContext, SupportedLanguages } from "~/models/context";
import { IStyle } from "~/models/models";
import { datesAreEqual } from "~/services/helper";
import { Texts } from "~/texts";
import AppText from "./text";

export const DateTime = (props: {
  date: string | number;
  style?: IStyle;
  hourView?: boolean;
  withTime?: boolean;
}) => {
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
      if (typeof props.date === "string") {
        d = new Date(props.date.split(" ")[0]);
        const time = props.date.split(" ")[1];

        if (time) {
          const timeArr = time.split(":");
          if (timeArr[0] && timeArr[1]) {
            d.setUTCHours(+timeArr[0]);
            d.setUTCMinutes(+timeArr[1]);
          }
        }
      }

      if (!d.getTime()) {
        return Empty;
      }
    }
  }

  let formatedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

  if (activeLanguage === SupportedLanguages.DE) {
    formatedDate = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  }

  const formatedTime = `${d.getHours() < 10 ? "0" : ""}${d.getHours()}:${
    d.getMinutes() < 10 ? "0" : ""
  }${d.getMinutes()}`;

  const isToday = datesAreEqual(d, new Date());
  return (
    <AppText style={props.style}>
      {props.hourView &&
        `${d.getHours() < 10 ? "0" : ""}${d.getHours()}:00 - ${
          isToday ? todayText : formatedDate
        }`}
      {!props.hourView && (isToday ? todayText : formatedDate)}
      {!props.hourView && props.withTime && ` - ${formatedTime}`}
    </AppText>
  );
};
