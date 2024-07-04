import { Calendar } from "@/src/components/ui/calendar";
import { useCarousel } from "@/src/components/ui/carousel";
import { memo, useEffect, useState } from "react";
import SelectBooking from "../SelectBooking/SelectBooking";
import TextRevealButton from "@/src/components/syntax-ui/TextRevealButton";
import useServerData from "@/src/hooks/useServerData";
import { Availability } from "@prisma/client";
import useEmployeeStore from "@/app/admin/Components/Employee/useEmpoyeesStore";

const Step5 = memo(({ userId }: { userId: string }) => {
  const daySelectedManager = useState<Date | undefined>(undefined);
  const [, setDaySelected] = daySelectedManager;
  const [allAvailabilities, setAllAvailabilities] = useState<Availability[]>();
  const { orientation, scrollPrev } = useCarousel();
  const { employeeSelected } = useEmployeeStore();

  useEffect(() => {
    const result = getAllAvailabilities(userId).then(setAllAvailabilities);
  }, []);

  const getAllAvailabilities = async (userId: string) =>
    await useServerData("availability", {
      userId,
    });

  return (
    <>
      <div className="flex justify-center flex-col justify-center items-center">
        <Calendar
          modifiers={{
            available: allAvailabilities
              ? allAvailabilities
                  .filter((a) => a.employeeId === employeeSelected?.id)
                  .map((availability) => availability.startTime)
              : [],
          }}
          fromDate={new Date()}
          mode="single"
          selected={undefined}
          onSelect={(d) => {
            setDaySelected(d);
            window.scrollTo(0, 0);
          }}
          className="p-10"
        />

        <div className="flex gap-10 m-2">
          <TextRevealButton onClick={() => scrollPrev()} arrowPosition="left">
            Retour
          </TextRevealButton>
        </div>
      </div>
      <SelectBooking userId={userId} daySelectedManager={daySelectedManager} />
    </>
  );
});

export default Step5;
