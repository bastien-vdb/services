"use client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import TextRevealButton from "@/src/components/syntax-ui/TextRevealButton";
import { useCarousel } from "@/src/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Service } from "@prisma/client";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import useFormStore from "./useFormStore";
import useEmployeeStore from "@/app/admin/Components/Employee/useEmpoyeesStore";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import QuickSelectWrapper from "@/src/components/QuickWrapper/QuickSelectWrapper";

export const HeaderWithIcon = (Icon: JSX.Element, text: string) => {
  return (
    <div className="flex items-center gap-4">
      <span>{text}</span> {Icon}
    </div>
  );
};

function SelectService({ services }: { services: Service[] }) {
  const { employees, getEmployees, changeEmployeeSelected } =
    useEmployeeStore();
  const { changeServiceSelected, serviceSelected } = useServiceStore();
  const { changeOptionSelected } = useServiceStore();
  const { formData, setFormData } = useFormStore(); // Use Zustand store
  const { orientation, scrollNext } = useCarousel();
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      service: serviceSelected?.id || undefined,
      option: undefined,
      employeeId: undefined,
    },
  });

  const employeeSelected = form.watch("employeeId");

  useEffect(() => {
    const employeeSelectedFull = employees.find(
      (e) => e.id === employeeSelected
    );
    employeeSelectedFull && changeEmployeeSelected(employeeSelectedFull);
  }, [employeeSelected]);

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center flex-col gap-10"
      >
        <QuickSelectWrapper
          placeHolder={"Par qui ?"}
          disabledValues={[0]}
          name="employeeId"
          label="Choisir son artiste"
          form={form}
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
          form={form}
          className="w-[250px] sm:w-[800px]"
          values={services?.filter((s) => s.employeeId === employeeSelected)}
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
          form={form}
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
      </form>
    </Form>
  );
}

export default SelectService;
