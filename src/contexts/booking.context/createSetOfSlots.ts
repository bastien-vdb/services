import moment from "moment";
import { SlotListCalendarConfig } from "@/src/lib/Config/calendar.config";

export const createSetOfSLots = (start: Date, end:Date) => {
  const INTERVAL_IN_MINUTES = SlotListCalendarConfig.interval;
  // const daySelectedMomentFormat = moment(daySelected).subtract(INTERVAL_IN_MINUTES, "minutes");

  const startDate = moment(start).subtract(INTERVAL_IN_MINUTES, "minutes");
  const endDate = moment(end).subtract(INTERVAL_IN_MINUTES, "minutes");

  let ListOfSlot = [] as { from: Date; to: Date }[];

  while (startDate.isBefore(endDate)) {
    // startDate.add(INTERVAL_IN_MINUTES, "minutes").toDate();
    ListOfSlot.push({
      from: startDate.toDate(),
      to: startDate.add(INTERVAL_IN_MINUTES, "minutes").toDate(),
    });
  }

  console.log("ListOfSlot", ListOfSlot);

  return ListOfSlot;
};
