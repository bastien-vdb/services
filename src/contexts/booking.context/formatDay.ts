export const formatDay = (date: Date = new Date()) => {
  return new Date(date.setHours(0, 0, 0, 0));
};