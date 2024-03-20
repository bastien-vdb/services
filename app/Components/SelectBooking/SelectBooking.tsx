import moment from "moment";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { Booking } from "@prisma/client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import useMainBookingStore from "@/app/Components/Calendar/useMainBookingsStore";
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

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  throw new Error("stripe PK missing");
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const SelectBooking = ({
  bookings,
  userId,
}: {
  bookings: Booking[];
  userId: string;
}) => {
  const { toast } = useToast();

  const [isOpened, setIsOpened] = useState(false);
  const {
    bookings: bookingsFromStore,
    initialiseBookings,
    daySelected,
    loadingBookings,
  } = useMainBookingStore();
  const { serviceSelected } = useServiceStore();
  const { setLoading } = useLoad();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    initialiseBookings(bookings);
  }, []);

  useEffect(() => {
    if (daySelected) setIsOpened(true);
    if (clientSecret) setClientSecret("");
  }, [daySelected]);

  const handleCreateBook = async (booking: Booking) => {
    setLoading(true);
    setIsOpened(false);
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
            bookingId: booking.id,
            startTime: booking.startTime,
            userId,
            serviceId: serviceSelected?.id,
            idemPotentKey: booking.idemPotentKey,
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

  return (
    <>
      {clientSecret && (
        <>
          <EmbeddedCheckoutComp
            stripePromise={stripePromise}
            clientSecret={clientSecret}
          />
          <PayPalButton />
        </>
      )}

      <Drawer
        open={isOpened}
        onClose={() => setIsOpened(false)}
        onOpenChange={(state) => !state && setIsOpened(false)}
      >
        <DrawerContent className="flex justify-center items-center">
          {loadingBookings ? (
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
                {bookingsFromStore.length > 0 ? (
                  bookingsFromStore?.map((booking, key) => (
                    <li key={key}>
                      <Button onClick={() => handleCreateBook(booking)}>
                        {moment(booking.startTime)
                          .format("HH:mm:ss")
                          .toString()}
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
