import { memo, useState } from "react";
import { Calendar } from "@/src/components/ui/calendar";
import SelectBooking from "../SelectBooking/SelectBooking";

const ServiceCalendar = memo(({ userId }: { userId: string }) => {
  const daySelectedManager = useState<Date | undefined>(undefined);
  const [daySelected, setDaySelected] = daySelectedManager;
  return (
    <>
      {!daySelected && (
        <Calendar
          fromDate={new Date()}
          mode="single"
          selected={undefined}
          onSelect={setDaySelected}
          className="p-10"
        />
      )}
      <SelectBooking userId={userId} daySelectedManager={daySelectedManager} />
    </>
  );
});

export default ServiceCalendar;
