import moment from "moment";

export const createSetOfSLots = (start: Date, end: Date, duree: number) => {
  const startDate = moment.utc(start);
  const endDate = moment.utc(end);

  let ListOfSlot = [] as { from: Date; to: Date }[];

  while (startDate.isBefore(endDate)) {
    ListOfSlot.push({
      from: startDate.toDate(),
      to: startDate.clone().add(duree, "minutes").toDate(),
    });
    startDate.add(duree, "minutes");
  }

  return ListOfSlot;
};
