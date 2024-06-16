import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { useCarousel } from "@/src/components/ui/carousel";
import { memo, useState } from "react";
import SelectBooking from "../SelectBooking/SelectBooking";

const Step5 = memo(({ userId }: { userId: string }) => {
  const daySelectedManager = useState<Date | undefined>(undefined);
  const [, setDaySelected] = daySelectedManager;
  const { orientation, scrollPrev } = useCarousel();

  return (
    <>
      <div className="flex justify-center flex-col justify-center items-center">
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

        <div className="flex gap-2 m-2">
          <Button
            className="sm:w-[250px]"
            disabled={false}
            onClick={scrollPrev}
            size="sm"
            variant="secondary"
          >
            Retour
          </Button>
        </div>
      </div>
      <SelectBooking userId={userId} daySelectedManager={daySelectedManager} />
    </>
  );
});

export default Step5;
