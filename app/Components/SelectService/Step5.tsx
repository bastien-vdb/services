import { memo, useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import useBookingsStore from "@/app/admin/Components/Bookings/useBookingsStore";
import { LoadingSpinner } from "@/src/components/ui/loader";
import { Booking } from "@prisma/client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import { toast } from "@/src/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import EmbeddedCheckoutComp from "../EmbeddedCheckoutComp/EmbeddedCheckoutComp";
import PayPalButton from "../Paypal/PaypalButton";
import { loadStripe } from "@stripe/stripe-js";
import { useStepper } from "@/src/components/stepper";
import { Button } from "@/src/components/ui/button";
import useFormStore from "./useFormStore";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  throw new Error("stripe PK missing");
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const prixFixDeposit = "price_1PERuILYOIXZwhPrff0n8CbE"; //TODO mettre dans un fichier settings

const Step5 = memo(({ userId }: { userId: string }) => {
  const { optionSelected } = useServiceStore();
  const { formData } = useFormStore(); // Use Zustand store
  const { nextStep, prevStep, resetSteps, hasCompletedAllSteps } = useStepper();

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  const [clientSecret, setClientSecret] = useState("");
  const [bookingSelectedPaypal, setBookingSelectedPaypal] = useState<Booking>();
  const [fullOrDepotDisplayed, setFullOrDepotDisplayed] = useState(false);

  const { bookingSelected } = useBookingsStore();
  const { serviceSelected } = useServiceStore();

  if (!bookingSelected)
    return <LoadingSpinner className="w-20 h-20 animate-spin" />;

  const handleCreatePayment = async (
    booking: Booking,
    deposit: boolean = false
  ) => {
    if (!fullOrDepotDisplayed) setFullOrDepotDisplayed(true);
    setBookingSelectedPaypal(bookingSelected);

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
            addedOption: optionSelected,
            formData,
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
  };

  useEffect(() => {
    handleCreatePayment(bookingSelected);
  }, []);

  return (
    <>
      <div className="flex justify-center items-center flex-wrap gap-2">
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

            {clientSecret && bookingSelectedPaypal && (
              <PayPalButton bookingSelectedPaypal={bookingSelectedPaypal} />
            )}
          </RadioGroup>
        )}

        {clientSecret && bookingSelectedPaypal ? (
          <>
            <EmbeddedCheckoutComp
              stripePromise={stripePromise}
              clientSecret={clientSecret}
            />
          </>
        ) : (
          <LoadingSpinner className="w-20 h-20 animate-spin" />
        )}
      </div>
      <div className="flex justify-center gap-2 m-2 gap-10">
        <Button
          disabled={false}
          onClick={prevStep}
          size="sm"
          variant="secondary"
        >
          Prev
        </Button>
      </div>
    </>
  );
});

export default Step5;
