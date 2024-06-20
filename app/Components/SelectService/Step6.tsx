import useBookingsStore from "@/app/admin/Components/Bookings/useBookingsStore";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import { useCarousel } from "@/src/components/ui/carousel";
import { Label } from "@/src/components/ui/label";
import { LoadingSpinner } from "@/src/components/ui/loader";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { toast } from "@/src/components/ui/use-toast";
import { Booking } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import { memo, useEffect, useState } from "react";
import EmbeddedCheckoutComp from "../EmbeddedCheckoutComp/EmbeddedCheckoutComp";
import PayPalButton from "../Paypal/PaypalButton";
import useFormStore from "./useFormStore";
import TextRevealButton from "@/src/components/syntax-ui/TextRevealButton";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  throw new Error("stripe PK missing");
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const prixFixDeposit = {
  stripePriceId: "price_1PERuILYOIXZwhPrff0n8CbE",
  price: 2000,
}; //TODO mettre dans un fichier settings

const Step6 = memo(({ userId }: { userId: string }) => {
  const { optionSelected } = useServiceStore();
  const { formData } = useFormStore();

  const [clientSecret, setClientSecret] = useState("");
  const [fullOrDepotDisplayed, setFullOrDepotDisplayed] = useState(false);

  //TODO useState pour paypal uniquement mais refactoriser le code asap
  const [bookingSelectedPaypal, setBookingSelectedPaypal] = useState<Booking>();
  const [deposit, setDeposit] = useState(false);

  const { bookingSelected } = useBookingsStore();
  const { serviceSelected } = useServiceStore();

  const { scrollPrev } = useCarousel();

  const handleCreatePayment = async (
    booking: Booking,
    deposit: boolean = false
  ) => {
    if (!fullOrDepotDisplayed) setFullOrDepotDisplayed(true);
    setBookingSelectedPaypal(booking);
    setDeposit(deposit);

    try {
      const paymentPage = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stripePriceId: deposit
              ? prixFixDeposit.stripePriceId
              : serviceSelected?.stripePriceId,
            amount: deposit ? prixFixDeposit.price : serviceSelected?.price,
            deposit,
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
    bookingSelected && handleCreatePayment(bookingSelected);
  }, [bookingSelected, serviceSelected, optionSelected]);

  return (
    <>
      <div className="flex justify-center items-center flex-col gap-2">
        {fullOrDepotDisplayed && (
          <RadioGroup className="flex" defaultValue="option-one">
            <div className="flex flex-col gap-2">
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
                <Label htmlFor="option-one">Paiement en 1 fois</Label>
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
                <Label htmlFor="option-two">Dépot: 20€</Label>
              </div>
            </div>
            {clientSecret && bookingSelectedPaypal && (
              <PayPalButton
                bookingSelectedPaypal={bookingSelectedPaypal}
                deposit={deposit}
                prixFixDeposit={prixFixDeposit}
              />
            )}
          </RadioGroup>
        )}

        {clientSecret && bookingSelectedPaypal ? (
          <EmbeddedCheckoutComp
            stripePromise={stripePromise}
            clientSecret={clientSecret}
          />
        ) : (
          <LoadingSpinner className="w-12 h-12 animate-spin" />
        )}
      </div>
      <div className="flex justify-center gap-2 m-2 gap-10">
        <div className="flex gap-2 m-2">
          <TextRevealButton
            onClick={() => {
              scrollPrev();
              window.scrollTo(0, 0);
            }}
            arrowPosition="left"
          >
            Retour
          </TextRevealButton>
        </div>
      </div>
    </>
  );
});

export default Step6;
