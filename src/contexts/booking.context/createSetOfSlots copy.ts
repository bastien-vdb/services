import moment from "moment";
import { SlotListCalendarConfig } from "@/src/lib/Config/calendar.config";

export const createSetOfSLots = (daySelected: Date) => {
  const INTERVAL_IN_MINUTES = SlotListCalendarConfig.interval;
  const daySelectedMomentFormat = moment(daySelected).subtract(INTERVAL_IN_MINUTES, "minutes");

  let ListOfSlot = [] as { from: Date; to: Date }[];
  daySelectedMomentFormat.add(INTERVAL_IN_MINUTES, "minutes").toDate();
  for (let i = 0; i < 24; i++) {
    ListOfSlot.push({
      from: daySelectedMomentFormat.toDate(),
      to: daySelectedMomentFormat.add(INTERVAL_IN_MINUTES, "minutes").toDate(),
    });
  }

  console.log("ListOfSlot", ListOfSlot);

  return ListOfSlot;
};
