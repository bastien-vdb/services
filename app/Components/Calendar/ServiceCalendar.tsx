import { memo, useState } from "react";
import { Calendar } from "@/src/components/ui/calendar";
import SelectBooking from "../SelectBooking/SelectBooking";

const ServiceCalendar = memo(({ userId }: { userId: string }) => {
  const [daySelected, setDaySelected] = useState<Date | undefined>(undefined);
  return (
    <>
      <Calendar
        fromDate={new Date()}
        mode="single"
        selected={undefined}
        onSelect={setDaySelected}
        className="p-10"
      />
      <SelectBooking userId={userId} daySelected={daySelected} />
    </>
  );
});

export default ServiceCalendar;
