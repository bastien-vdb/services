import useUsersStore from "@/app/admin/Components/Users/useUsersStore";
import TextRevealButton from "@/src/components/syntax-ui/TextRevealButton";
import { Calendar } from "@/src/components/ui/calendar";
import { useCarousel } from "@/src/components/ui/carousel";
import useServerData from "@/src/hooks/useServerData";
import { Availability } from "@prisma/client";
import { memo, useEffect, useState } from "react";
import SelectBooking from "../SelectBooking/SelectBooking";

const Step2 = memo(() => {
  const daySelectedManager = useState<Date | undefined>(undefined);
  const [, setDaySelected] = daySelectedManager;
  const [allAvailabilities, setAllAvailabilities] = useState<Availability[]>();
  const { scrollPrev } = useCarousel();
  const { userSelectedFront } = useUsersStore();

  const getAllAvailabilities = async (userId: string) =>
    await useServerData("availability", {
      userId,
    });

  useEffect(() => {
    userSelectedFront &&
      getAllAvailabilities(userSelectedFront.id).then(setAllAvailabilities);
  }, [userSelectedFront]);

  return (
    <>
      <div className="flex justify-center flex-col justify-center items-center">
        <Calendar
          modifiers={{
            available: allAvailabilities
              ? allAvailabilities
                  .filter((a) => a.userId === userSelectedFront?.id)
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
      <SelectBooking daySelectedManager={daySelectedManager} />
    </>
  );
});

export default Step2;
