import { lastDayOfMonth, set } from "date-fns";

const getLastDayOfTheMonth = (date: Date): Date => {
  const lastdayOfMonth = lastDayOfMonth(date);
  const lastDateOfMonthLocal = set(lastdayOfMonth, { hours: 2, minutes: 0, seconds: 0 });

  return lastDateOfMonthLocal;
};

export default getLastDayOfTheMonth;
