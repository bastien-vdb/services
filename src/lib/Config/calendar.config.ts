import moment from "moment";

export const SlotListCalendarConfig = {
  begining: 9,
  end: 22,
  interval: 60,
};

export const CalendarConfig = {
  minDate: moment().toDate(),
  maxDate: moment().endOf("month").toDate(),
};
