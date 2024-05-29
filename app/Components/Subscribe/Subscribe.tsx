"use client";
import { Button } from "@/src/components/ui/button";
import useSubscribe from "./useSubscribe";
import { useState } from "react";
import { LoadingSpinner } from "@/src/components/ui/loader";

function Subscribe({
  userId,
  stripeAccount,
}: {
  userId: string;
  stripeAccount: string | null;
}) {
  const [loading, setLoading] = useState(false);

  const getAlink = async () => {
    setLoading(true);
    const link = await useSubscribe({ userId });
    window.location.assign(link);
    setLoading(false);
  };

  const clickOnLink = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_OAUTH_LINK)
      throw new Error("stripe link OAUTH missing");
    window.location.assign(
      `${process.env.NEXT_PUBLIC_STRIPE_OAUTH_LINK}&state=${userId}`
    );
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <span className="flex justify-center md:text-3xl md:my-20">
        Ou alors utiliser votre compte Stripe pour recevoir vos paiements
      </span>
      <Button onClick={clickOnLink}>Connexion</Button>

      {!stripeAccount ? (
        <span className="md:text-3xl md:my-20">
          Il est l'heure de créer un compte express gratuitement afin de
          recevoir vos paiements !
        </span>
      ) : (
        <span className="md:text-3xl md:my-20">
          Reprendre la création de compte express gratuit pour recevoir vos
          paiements
        </span>
      )}

      <Button onClick={getAlink}>
        {stripeAccount ? "Reprendre" : "Souscrire"}
      </Button>
      {loading && <LoadingSpinner className="w-20 h-20 animate-spin" />}
    </div>
  );
}

export default Subscribe;
