"use client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import useUsersStore from "@/app/admin/Components/Users/useUsersStore";
import AlertDialogControlled from "@/src/components/Modal/AlertDialogControlled";
import QuickFormWrapper from "@/src/components/QuickWrapper/QuickFormWrapper";
import QuickSelectWrapper from "@/src/components/QuickWrapper/QuickSelectWrapper";
import { Card, CardContent } from "@/src/components/ui/card";
import { useCarousel } from "@/src/components/ui/carousel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import useFormStore from "./useFormStore";

function SelectService() {
  const [employeeSelectedLive, setEmployeeSelectedLive] = useState();
  const [serviceIdSelectedLive, setServiceIdSelectedLive] = useState<string>();
  const { changeServiceSelected, serviceSelected } = useServiceStore();
  const { changeOptionSelected, getServices, services } = useServiceStore();
  const { users, getUsers, changeUserSelectedFront, userSelectedFront } =
    useUsersStore();
  const { setFormData } = useFormStore(); // Use Zustand store
  const { scrollNext } = useCarousel();
  const openCtr = useState(false);
  const [, setModalVisible] = openCtr;
  const { userId: userParamId } = useParams() as { userId: string };

  const FormSchema = z.object({
    service: z.string({
      required_error: "*",
    }),
    option: z.string({
      required_error: "*",
    }),
    employeeId: z.string({
      required_error: "*",
    }),
  });

  const defaultValues = {
    service: serviceSelected?.id || undefined,
    option: undefined,
    employeeId: undefined,
  };

  function onSubmit({
    service,
    employeeId,
    option,
  }: z.infer<typeof FormSchema>) {
    const serviceSelected = services?.find((s) => s.id === service);

    const employeeName = users.find((u) => u.id === employeeId)?.name;
    setFormData({
      employee: employeeName !== null ? employeeName : undefined,
    }); // Update store with form data

    serviceSelected && changeServiceSelected(serviceSelected);
    const employeeSelectedFull = users.find(
      (e) => e.id === employeeSelectedLive
    );
    employeeSelectedFull && changeUserSelectedFront(employeeSelectedFull);

    if (option === "option-avec-depose") {
      changeOptionSelected({
        name: service,
        price: 2000,
      });
    } else changeOptionSelected(undefined);

    scrollNext();
  }

  useEffect(() => {
    getUsers(userParamId);
  }, []);

  useEffect(() => {
    employeeSelectedLive && getServices(employeeSelectedLive);

    const employeeSelectedFull = users.find(
      (e) => e.id === employeeSelectedLive
    );
    employeeSelectedFull && changeUserSelectedFront(employeeSelectedFull);
  }, [employeeSelectedLive]);

  useEffect(() => {
    const serviceSelectedFull = services.find(
      (s) => s.id === serviceIdSelectedLive
    );
    if (serviceSelectedFull && serviceSelectedFull.name.includes("Fox eyes"))
      setModalVisible(true);
  }, [serviceIdSelectedLive]);

  return (
    <>
      <AlertDialogControlled openCtr={openCtr} />;
      <Card>
        <CardContent className="flex justify-center items-center flex-col">
          <QuickFormWrapper
            FormSchema={FormSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            watchLive={({ employeeId, service: serviceId }) => {
              setEmployeeSelectedLive(employeeId);
              setServiceIdSelectedLive(serviceId);
            }}
            backButton={false}
          >
            <QuickSelectWrapper
              placeHolder={"Par qui ?"}
              disabledValues={[0]}
              name="employeeId"
              label="Choisir son artiste"
              className="w-[250px] sm:w-[800px]"
              values={users.reverse()}
              renderFn={(e) => <>{e.name} </>}
            />
            <QuickSelectWrapper
              placeHolder={"Que souhaitez vous faire ?"}
              name="service"
              label="Choisir sa prestation"
              className="w-[250px] sm:w-[800px]"
              values={services?.filter(
                (s) => s.userId === employeeSelectedLive
              )}
              renderFn={(s) => (
                <>
                  {s.name}
                  <span className="ml-2 text-green-600">
                    + {s.price / 100} €
                  </span>
                </>
              )}
            />
            <QuickSelectWrapper
              placeHolder={"Avec dépose ?"}
              name="option"
              label="Option: Dépose"
              className="w-[250px] sm:w-[800px]"
              values={[
                { id: "option-sans-depose", name: "Sans dépose", price: 0 },
                { id: "option-avec-depose", name: "Avec dépose", price: 2000 },
              ]}
              renderFn={(s) => (
                <>
                  {s.name}
                  <span className="ml-2 text-green-600">
                    + {s.price / 100} €
                  </span>
                </>
              )}
            />
          </QuickFormWrapper>
        </CardContent>
      </Card>
    </>
  );
}

export default SelectService;
