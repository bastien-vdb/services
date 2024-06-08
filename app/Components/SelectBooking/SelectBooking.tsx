import moment from "moment";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { Availability, Booking, Service } from "@prisma/client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
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
import { useToast } from "@/src/components/ui/use-toast";
import useLoad from "@/src/hooks/useLoad";
import { loadStripe } from "@stripe/stripe-js";
import EmbeddedCheckoutComp from "../EmbeddedCheckoutComp/EmbeddedCheckoutComp";
import PayPalButton from "../Paypal/PaypalButton";
import { addMinutes, isAfter } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import useAvailabilityStore from "@/app/admin/Components/Calendar/useAvailabilityStore";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { da } from "date-fns/locale";
import useBookingsStore from "@/app/admin/Components/Bookings/useBookingsStore";
import next from "next";
import { useStepper } from "@/src/components/stepper";
import { useCarousel } from "@/src/components/ui/carousel";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  throw new Error("stripe PK missing");
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const SelectBooking = ({
  userId,
  daySelectedManager,
}: {
  userId: string;
  daySelectedManager: [Date | undefined, (date: Date | undefined) => void];
}) => {
  const [daySelected, setDaySelected] = daySelectedManager;

  const [isOpened, setIsOpened] = useState(false);

  const { availabilities, getAvailabilities, loadingAvailability } =
    useAvailabilityStore();
  const { serviceSelected } = useServiceStore();
  const { setBookingSelected } = useBookingsStore();

  const { orientation, scrollNext, canScrollNext } = useCarousel();

  const { setLoading } = useLoad();
  const [clientSecret, setClientSecret] = useState("");
  const [bookingSelectedPaypal, setBookingSelectedPaypal] = useState<Booking>();
  const [fullOrDepotDisplayed, setFullOrDepotDisplayed] = useState(false);
  const [slots, setSlots] = useState<Booking[]>([]);

  useEffect(() => {
    daySelected && getAvailabilities(userId, daySelected);
    if (daySelected) setIsOpened(true);
    if (clientSecret) setClientSecret("");
  }, [daySelected]);

  useEffect(() => {
    if (!serviceSelected) return;
    const cuttedBookings = availabilities.flatMap((booking) =>
      splitBookingIntoServiceDuration(booking, serviceSelected)
    );
    setSlots(cuttedBookings); // Directement un tableau simple
  }, [availabilities]);

  return (
    <Drawer
      direction="top"
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
            <ul className="p-10 flex gap-4 justify-center flex-wrap">
              {slots.length > 0 ? (
                slots
                  ?.sort(
                    (a, b) => a.startTime.getTime() - b.startTime.getTime()
                  )
                  ?.map((booking, key) => (
                    <li key={key}>
                      <Button
                        className="bg-[#CCB3AE] text-black"
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
            <Button className="mb-10" variant="outline">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectBooking;

function splitBookingIntoServiceDuration(
  avaibility: Availability,
  serviceSelected: Service
) {
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
