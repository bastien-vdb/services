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

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  throw new Error("stripe PK missing");
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const SelectBooking = ({
  userId,
  daySelected,
}: {
  userId: string;
  daySelected: Date | undefined;
}) => {
  const { toast } = useToast();

  const [isOpened, setIsOpened] = useState(false);

  const { availabilities, getAvailabilities, loadingAvailability } =
    useAvailabilityStore();

  const { serviceSelected } = useServiceStore();
  const { setLoading } = useLoad();
  const [clientSecret, setClientSecret] = useState("");
  const [bookingSelectedPaypal, setBookingSelectedPaypal] = useState<Booking>();

  const [slots, setSlots] = useState<Booking[]>([]);

  useEffect(() => {
    daySelected && getAvailabilities(userId, daySelected);
  }, [daySelected]);

  useEffect(() => {
    if (daySelected) setIsOpened(true);
    if (clientSecret) setClientSecret("");
  }, [daySelected]);

  const handleCreateBook = async (booking: Booking) => {
    setLoading(true);
    setIsOpened(false);
    setBookingSelectedPaypal(booking);
    console.log("selectId from handleCreateBook:", serviceSelected?.id);
    try {
      const paymentPage = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/checkout_sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stripePriceId: serviceSelected?.stripePriceId,
            startTime: booking.startTime,
            endTime: booking.endTime,
            userId,
            serviceId: serviceSelected?.id,
          }),
        }
      );
      const paymentPageJson = await paymentPage.json();
      setClientSecret(paymentPageJson.clientSecret);
    } catch (error) {
      console.error("error: ", error);
      toast({
        variant: "destructive",
        title: "Le rendez-vous est déjà en cours de réservation",
        description:
          "Il serait préférable de sélectionner un autre créneau disponible",
      });
    }
    setLoading(false);
    if (!daySelected) throw new Error("No day selected");
  };

  useEffect(() => {
    if (!serviceSelected) return;
    const cuttedBookings = availabilities.flatMap((booking) =>
      splitBookingIntoServiceDuration(booking, serviceSelected)
    );
    setSlots(cuttedBookings); // Directement un tableau simple
  }, [availabilities]);

  return (
    <>
      {clientSecret && bookingSelectedPaypal && (
        <>
          <EmbeddedCheckoutComp
            stripePromise={stripePromise}
            clientSecret={clientSecret}
          />
          <PayPalButton bookingSelectedPaypal={bookingSelectedPaypal} />
        </>
      )}

      <Drawer
        open={isOpened}
        onClose={() => setIsOpened(false)}
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
              <ul className="h-96 flex gap-4 justify-center flex-wrap items-top">
                {slots.length > 0 ? (
                  slots
                    ?.sort(
                      (a, b) => a.startTime.getTime() - b.startTime.getTime()
                    )
                    ?.map((booking, key) => (
                      <li key={key}>
                        <Button onClick={() => handleCreateBook(booking)}>
                          {moment(booking.startTime).format("HH:mm").toString()}
                          -{moment(booking.endTime).format("HH:mm").toString()}
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
    </>
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
      });
    }

    currentTime = nextTime;
  }

  return slots;
}
