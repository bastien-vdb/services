import { memo, useEffect } from "react";
import { Calendar } from "@/src/components/ui/calendar";
import moment from "moment";
import useMainBookingsStore from "@/app/Components/Calendar/useMainBookingsStore";

const ServiceCalendar = memo(({ userId }: { userId: string }) => {
  const { selectDay } = useMainBookingsStore();

  const { reloadBookings } = useMainBookingsStore();

  const handleSelectDate = (date: Date) => {
    selectDay(date);
    reloadBookings(userId, date);
  };

  //Pour nettoyer le daySelected lorsque le composant est démonté
  useEffect(() => {
    return () => selectDay(undefined);
  }, []);

  return (
    <Calendar
      fromDate={new Date()}
      mode="single"
      selected={undefined}
      onSelect={(date) => handleSelectDate(date!)}
      className="p-10"
    />
  );
});

export default ServiceCalendar;
