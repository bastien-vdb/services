"use client";
import useEmployeeStore from "@/app/admin/Components/Employee/useEmpoyeesStore";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import QuickSelectWrapper from "@/src/components/QuickWrapper/QuickSelectWrapper";
import TextRevealButton from "@/src/components/syntax-ui/TextRevealButton";
import { useCarousel } from "@/src/components/ui/carousel";
import { Service } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import useFormStore from "./useFormStore";
import QuickFormWrapper from "@/src/components/QuickWrapper/QuickFormWrapper";

export const HeaderWithIcon = (Icon: JSX.Element, text: string) => {
  return (
    <div className="flex items-center gap-4">
      <span>{text}</span> {Icon}
    </div>
  );
};

function SelectService({ services }: { services: Service[] }) {
  const [employeeSelectedLive, setEmployeeSelectedLive] = useState();
  const { employees, getEmployees, changeEmployeeSelected } =
    useEmployeeStore();
  const { changeServiceSelected, serviceSelected } = useServiceStore();
  const { changeOptionSelected } = useServiceStore();
  const { setFormData } = useFormStore(); // Use Zustand store
  const { scrollNext } = useCarousel();
  const session = useSession();

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
    const employeeSelected = employees?.find((e) => e.id === employeeId);

    setFormData({ employee: employeeSelected?.email }); // Update store with form data

    serviceSelected && changeServiceSelected(serviceSelected);
    employeeSelected && changeEmployeeSelected(employeeSelected);

    if (option === "option-avec-depose") {
      changeOptionSelected({
        name: service,
        price: 2000,
      });
    } else changeOptionSelected(undefined);

    scrollNext();
  }

  useEffect(() => {
    getEmployees(session.data?.user.id!);
  }, []);

  useEffect(() => {
    const employeeSelectedFull = employees.find(
      (e) => e.id === employeeSelectedLive
    );
    employeeSelectedFull && changeEmployeeSelected(employeeSelectedFull);
  }, [employeeSelectedLive]);

  return (
    <QuickFormWrapper
      FormSchema={FormSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      watchLive={({ employeeId }) => setEmployeeSelectedLive(employeeId)}
    >
      <QuickSelectWrapper
        placeHolder={"Par qui ?"}
        disabledValues={[0]}
        name="employeeId"
        label="Choisir son artiste"
        className="w-[250px] sm:w-[800px]"
        values={employees}
        renderFn={(e) => (
          <>
            {e.name}{" "}
            {e.name === "Natacha" && (
              <span className="text-red-600">- complet</span>
            )}
          </>
        )}
      />
      <QuickSelectWrapper
        placeHolder={"Que souhaitez vous faire ?"}
        name="service"
        label="Choisir sa prestation"
        className="w-[250px] sm:w-[800px]"
        values={services?.filter((s) => s.employeeId === employeeSelectedLive)}
        renderFn={(s) => (
          <>
            {s.name}
            <span className="ml-2 text-green-600">+ {s.price / 100} €</span>
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
            <span className="ml-2 text-green-600">+ {s.price / 100} €</span>
          </>
        )}
      />
      <div className="flex m-2">
        <TextRevealButton bg={"bg-black"} type="submit" arrowPosition="right">
          Suivant
        </TextRevealButton>
      </div>
    </QuickFormWrapper>
  );
}

export default SelectService;
