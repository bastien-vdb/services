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

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  throw new Error("stripe PK missing");
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const prixFixDeposit = "price_1PERuILYOIXZwhPrff0n8CbE"; //TODO mettre dans un fichier settings

const SelectBooking = ({
  userId,
  daySelectedManager,
}: {
  userId: string;
  daySelectedManager: [Date | undefined, (date: Date | undefined) => void];
}) => {
  const { toast } = useToast();
  const [daySelected, setDaySelected] = daySelectedManager;

  const [isOpened, setIsOpened] = useState(false);

  const { availabilities, getAvailabilities, loadingAvailability } =
    useAvailabilityStore();

  const { serviceSelected } = useServiceStore();
  const { setLoading } = useLoad();
  const [clientSecret, setClientSecret] = useState("");
  const [bookingSelectedPaypal, setBookingSelectedPaypal] = useState<Booking>();
  const [slots, setSlots] = useState<Booking[]>([]);
  const [fullOrDepotDisplayed, setFullOrDepotDisplayed] = useState(false);

  useEffect(() => {
    daySelected && getAvailabilities(userId, daySelected);
    if (daySelected) setIsOpened(true);
    if (clientSecret) setClientSecret("");
  }, [daySelected]);

  const handleCreatePayment = async (
    booking: Booking,
    deposit: boolean = false
  ) => {
    if (!fullOrDepotDisplayed) setFullOrDepotDisplayed(true);
    setLoading(true);
    setIsOpened(false);
    setBookingSelectedPaypal(booking);

    try {
      const paymentPage = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/checkout_sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stripePriceId: deposit
              ? prixFixDeposit
              : serviceSelected?.stripePriceId,
            startTime: booking.startTime,
            endTime: booking.endTime,
            userId,
            serviceId: serviceSelected?.id,
            serviceName: serviceSelected?.name,
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
      {fullOrDepotDisplayed && (
        <RadioGroup defaultValue="option-one">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              onClick={() => {
                setClientSecret("");
                bookingSelectedPaypal &&
                  handleCreatePayment(bookingSelectedPaypal);
              }}
              value="option-one"
              id="option-one"
            />
            <Label className="text-xl" htmlFor="option-one">
              Paiement en 1 fois
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              onClick={() => {
                setClientSecret("");
                bookingSelectedPaypal &&
                  handleCreatePayment(bookingSelectedPaypal, true);
              }}
              value="option-two"
              id="option-two"
            />
            <Label htmlFor="option-two">Dépot</Label>
          </div>
        </RadioGroup>
      )}

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
              <ul className="h-96 flex gap-4 justify-center flex-wrap items-top">
                {slots.length > 0 ? (
                  slots
                    ?.sort(
                      (a, b) => a.startTime.getTime() - b.startTime.getTime()
                    )
                    ?.map((booking, key) => (
                      <li key={key}>
                        <Button
                          onClick={() => {
                            handleCreatePayment(booking);
                            setDaySelected(undefined);
                          }}
                        >
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
        customerId: "",
        amountPayed: 0,
        form: "",
      });
    }

    currentTime = nextTime;
  }

  return slots;
}
