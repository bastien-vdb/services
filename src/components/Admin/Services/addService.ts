import { serviceActionType } from "@/src/reducers/serviceReducer";
import { SetStateAction } from "react";
import { z } from "zod";

export const addService = ({ e, serviceName, servicePrice, serviceDispatch, setLoading }: { e: React.FormEvent<HTMLFormElement>; serviceName: string; servicePrice: number; serviceDispatch: React.Dispatch<serviceActionType>; setLoading: React.Dispatch<SetStateAction<boolean>> }) => {
  e.preventDefault();

  const newServiceSchema = z.object({
    name: z.string(),
    price: z.number(),
  });

  const newService = {
    name: serviceName,
    price: servicePrice,
    stripeId: "",
    stripePriceId: "",
  };
  try {
    newServiceSchema.parse(newService);

    //Optimistic update
    serviceDispatch({
      type: "ADD_SERVICE",
      payload: {
        newService: {
          name: serviceName,
          price: servicePrice,
          stripeId: "",
          stripePriceId: "",
        },
      },
    });

    fetch("/api/services/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: serviceName,
        price: servicePrice,
      }),
    })
      .then(async (newListOfServicesJson) => await newListOfServicesJson.json())
      .then((newListOfServices) => {
        serviceDispatch({
          type: "SET_SERVICES",
          payload: { services: newListOfServices },
        });
      })
      .finally(() => setLoading(false));
  } catch (error) {
    console.log("erreur capturée par zod: ", error);
  }
};
