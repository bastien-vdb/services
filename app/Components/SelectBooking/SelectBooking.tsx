import useBookingsStore from "@/app/admin/Components/Bookings/useBookingsStore";
import useAvailabilityStore from "@/app/admin/Components/Calendar/useAvailabilityStore";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import useUsersStore from "@/app/admin/Components/Users/useUsersStore";
import { Button } from "@/src/components/ui/button";
import { useCarousel } from "@/src/components/ui/carousel";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/src/components/ui/drawer";
import { LoadingSpinner } from "@/src/components/ui/loader";
import { Availability, Booking, Service, User } from "@prisma/client";
import { addMinutes, isAfter } from "date-fns";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const SelectBooking = ({
  daySelectedManager,
}: {
  daySelectedManager: [Date | undefined, (date: Date | undefined) => void];
}) => {
  const [daySelected, setDaySelected] = daySelectedManager;

  const [isOpened, setIsOpened] = useState(false);

  const { availabilities, getAvailabilities, loadingAvailability } =
    useAvailabilityStore();
  const { serviceSelected } = useServiceStore();
  const { setBookingSelected } = useBookingsStore();
  const { userSelectedFront } = useUsersStore();

  const { orientation, scrollNext, canScrollNext } = useCarousel();

  const [slots, setSlots] = useState<Booking[]>([]);

  useEffect(() => {
    daySelected &&
      userSelectedFront &&
      getAvailabilities(userSelectedFront.id, daySelected);
    if (daySelected) setIsOpened(true);
  }, [daySelected]);

  useEffect(() => {
    if (!serviceSelected || !userSelectedFront) return;
    const cuttedBookings = availabilities
      .filter((e) => e.userId === userSelectedFront.id)
      .flatMap((avaibility) =>
        splitBookingIntoServiceDuration({
          avaibility,
          serviceSelected,
          employeeSelected: userSelectedFront,
        })
      );
    setSlots(cuttedBookings); // Directement un tableau simple
  }, [availabilities]);

  return (
    <Drawer
      open={isOpened}
      onClose={() => {
        setIsOpened(false);
        setDaySelected(undefined);
      }}
      onOpenChange={(state) => !state && setIsOpened(false)}
    >
      <DrawerContent className="flex justify-center items-center">
        {loadingAvailability ? (
          <LoadingSpinner className="w-20 h-20 animate-spin" />
        ) : (
          <>
            <DrawerHeader>
              <DrawerTitle>Rendez-vous</DrawerTitle>
              <DrawerDescription>
                Selectionner un rendez-vous.
              </DrawerDescription>
            </DrawerHeader>
            <ul className="sm:p-10 flex gap-4 justify-center flex-wrap">
              {slots.length > 0 ? (
                slots
                  ?.sort(
                    (a, b) => a.startTime.getTime() - b.startTime.getTime()
                  )
                  .filter((booking) => booking.startTime > new Date())
                  ?.map((booking, key) => (
                    <li key={key}>
                      <Button
                        className="bg-[#CCB3AE] p-2 sm:p-4 text-black text-xs sm:text-sm"
                        onClick={() => {
                          setBookingSelected(booking);
                          setIsOpened(false);
                          scrollNext();
                        }}
                      >
                        {moment(booking.startTime).format("HH:mm").toString()}-
                        {moment(booking.endTime).format("HH:mm").toString()}
                      </Button>
                    </li>
                  ))
              ) : (
                <Button variant="ghost">Pas de créneau disponible</Button>
              )}
            </ul>
          </>
        )}
        <DrawerFooter>
          <DrawerClose onClick={() => setIsOpened(false)}>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectBooking;

function splitBookingIntoServiceDuration({
  avaibility,
  serviceSelected,
  employeeSelected,
}: {
  avaibility: Availability;
  serviceSelected: Service;
  employeeSelected: User;
}) {
  const slots: Booking[] = [];
  let currentTime = new Date(avaibility.startTime);
  const endTime = new Date(avaibility.endTime);

  while (isAfter(endTime, currentTime)) {
    const nextTime = addMinutes(currentTime, serviceSelected.duration);

    // Empêche de dépasser l'heure de fin
    if (endTime >= nextTime) {
      slots.push({
        id: uuidv4(), // ID temporaire
        startTime: currentTime,
        endTime: nextTime,
        serviceId: serviceSelected?.id,
        userId: avaibility.userId,
        status: "PENDING",
        payedBy: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        customerId: "",
        amountPayed: 0,
        form: "",
      });
    }

    currentTime = nextTime;
  }

  return slots;
}
