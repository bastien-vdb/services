import { memo, useEffect, useState } from "react";
import { Calendar } from "@/src/components/ui/calendar";
import SelectBooking from "../SelectBooking/SelectBooking";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useStepper } from "@/src/components/stepper";
import { useCarousel } from "@/src/components/ui/carousel";

const Step5 = memo(({ userId }: { userId: string }) => {
  const daySelectedManager = useState<Date | undefined>(undefined);
  const [, setDaySelected] = daySelectedManager;
  const { orientation, scrollNext, scrollPrev } = useCarousel();

  return (
    <>
      <div className="flex justify-center">
        <Calendar
          fromDate={new Date()}
          mode="single"
          selected={undefined}
          onSelect={(d) => {
            setDaySelected(d);
            window.scrollTo(0, 0);
          }}
          className="p-10"
        />
      </div>

      <div className="flex gap-2 m-2 justify-center">
        <Button
          disabled={false}
          onClick={scrollPrev}
          size="sm"
          variant="secondary"
        >
          Prev
        </Button>
      </div>
      <SelectBooking userId={userId} daySelectedManager={daySelectedManager} />
    </>
  );
});

export default Step5;
