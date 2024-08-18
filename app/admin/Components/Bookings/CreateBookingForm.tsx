"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import QuickFormWrapper from "@/src/components/QuickWrapper/QuickFormWrapper";
import { Card, CardContent } from "@/src/components/ui/card";
import QuickInputWrapper from "@/src/components/QuickWrapper/QuickInputWrapper";
import useServiceStore from "../Services/useServicesStore";
import QuickSelectWrapper from "@/src/components/QuickWrapper/QuickSelectWrapper";
import useUsersStore from "../Users/useUsersStore";
import actionCreateBooking from "./action-createBooking";

// Définition du schéma de validation avec zod
const BookingFormSchema = z.object({
  name: z
    .string({
      required_error: "*",
    })
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  firstname: z
    .string({
      required_error: "*",
    })
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z
    .string({
      required_error: "*",
    })
    .min(2, "L'email doit contenir au moins 2 caractères"),
  phone: z
    .string({
      required_error: "*",
    })
    .min(2, "Le téléphone doit contenir au moins 8 chiffres"),
  service: z.string({
    required_error: "*",
  }),
  prix: z.string({
    required_error: "*",
  }),
});

const CreateBookingForm = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => {
  const [serviceIdSelectedLive, setServiceIdSelectedLive] = useState<string>();
  const { userSelected, findUser, connectedSessionUserFull } = useUsersStore();
  const {
    users,
    getUsersByOwnerId,
    changeUserSelectedFront,
    userSelectedFront,
  } = useUsersStore();
  const { changeOptionSelected, getServices, services } = useServiceStore();

  const [defaultValues, setDefaultValues] = useState({
    name: "",
    firstname: "",
    email: "",
    phone: "",
  });

  const onSubmit = async ({
    name,
    firstname,
    email,
    phone,
    service,
    prix,
  }: z.infer<typeof BookingFormSchema>) => {
    console.log("onSubmit", {
      name,
      firstname,
      email,
      phone,
      service,
      prix,
    });

    if (!userSelected) throw new Error("No user selected");
    if (!serviceIdSelectedLive) throw new Error("No service selected");
    await actionCreateBooking({
      manual: true,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      userId: userSelected?.id,
      serviceId: serviceIdSelectedLive,
      amountPayed: Number(prix),
      form: "{}",
      customerInfo: {
        name,
        firstname,
        email,
        phone,
      },
    });

    console.log("Booking created");
  };

  console.log("userSelected", userSelected);
  useEffect(() => {
    userSelected && getServices(userSelected.id);
  }, [userSelected]);

  return (
    <div className="flex justify-center">
      <Card>
        <CardContent>
          <QuickFormWrapper
            FormSchema={BookingFormSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            watchLive={({ service: serviceId }) => {
              setServiceIdSelectedLive(serviceId);
            }}
            // backButton={true} // Option pour ajouter un bouton retour
          >
            <QuickInputWrapper name="name" label="" placeHolder="Nom" />
            <QuickInputWrapper
              name="firstname"
              label="Prénom"
              placeHolder="Prénom"
            />
            <QuickInputWrapper
              name="email"
              label=""
              placeHolder="Email"
              type="email"
            />
            <QuickInputWrapper
              name="phone"
              label=""
              placeHolder="Téléphone"
              type="tel"
            />
            <QuickSelectWrapper
              placeHolder={"Prestation"}
              name="service"
              label=""
              className="w-[250px]"
              values={services?.filter((s) => s.userId === userSelected?.id)}
              renderFn={(s) => (
                <>
                  {s.name}
                  <span className="ml-2 text-green-600">
                    + {s.price / 100} €
                  </span>
                </>
              )}
            />
            <QuickInputWrapper
              name="prix"
              label=""
              placeHolder="Montant payé"
              type="number"
            />
          </QuickFormWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBookingForm;
