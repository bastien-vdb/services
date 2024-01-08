import moment from "moment";

export const minFromMidnightFormatter = (date: moment.Moment) => {
  return Math.floor(date.hour() * 60) + Math.floor(date.minute());
};

export const createSetOfSLots = (start: Date, end: Date, duree: number) => {
  const startDate = moment.utc(start);
  const endDate = moment.utc(end);

  const minToday = minFromMidnightFormatter(startDate);
  const maxToday = minFromMidnightFormatter(endDate);

  const ListOfSlot = [];

  while (startDate.isBefore(endDate)) {
    const min = minFromMidnightFormatter(startDate);
    const max = minFromMidnightFormatter(startDate) + duree;
    if (min >= minToday && max <= maxToday) {
      ListOfSlot.push({
        from: startDate.toDate(),
        to: startDate.clone().add(duree, "minutes").toDate(),
      });
    }
    startDate.add(duree, "minutes");
  }

  return ListOfSlot;
};
