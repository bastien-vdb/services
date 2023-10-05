import moment from "moment";
import { SlotListCalendarConfig } from "@/src/lib/Config/calendar.config";

export const createSetOfSLots = (start: Date, end:Date) => {
  const INTERVAL_IN_MINUTES = SlotListCalendarConfig.interval;

  const startDate = moment.utc(start);  // Utilisez moment.utc pour travailler en UTC
  const endDate = moment.utc(end);

  let ListOfSlot = [] as { from: Date; to: Date }[];

  while (startDate.isBefore(endDate)) {
      ListOfSlot.push({
          from: startDate.toDate(),
          to: startDate.clone().add(INTERVAL_IN_MINUTES, "minutes").toDate(),
      });
      startDate.add(INTERVAL_IN_MINUTES, "minutes");
  }

  return ListOfSlot;
};

