"use client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import { Button } from "@/src/components/ui/button";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const HeaderWithIcon = (Icon: JSX.Element, text: string) => {
  return (
    <div className="flex items-center gap-4">
      <span>{text}</span> {Icon}
    </div>
  );
};

function SelectService({ services }: { services?: Service[] }) {
  const { changeServiceSelected, serviceSelected } = useServiceStore();
  const { changeOptionSelected } = useServiceStore();
  const { orientation, scrollNext } = useCarousel();

  useEffect(() => {
    console.log("orientation", orientation);
  }, [orientation]);

  const FormSchema = z.object({
    service: z.string({
      required_error: "Merci de sélectionner une prestation.",
    }),
    option: z.string({
      required_error: "Champ obligatoire.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      service: serviceSelected?.id || undefined,
      option: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const serviceSelected = services?.find(
      (service) => service.id === data.service
    );

    serviceSelected && changeServiceSelected(serviceSelected);

    if (data.service === "option-depose") {
      changeOptionSelected({
        name: data.service,
        price: 2000,
      });
    } else changeOptionSelected(undefined);

    scrollNext();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choisir sa prestation</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="sm:w-[800px]">
                    <SelectValue placeholder="Que souhaitez vous faire ?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Prestations</SelectLabel>
                    {services?.map((service) => (
                      <SelectItem
                        key={service.id} // Added key here
                        value={service.id}
                        className="w-auto cursor-pointer"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {service.name}
                        <span className="ml-2 text-green-600">
                          - {service.price / 100} €
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="option"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Option: Dépose</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // form.handleSubmit(onSubmit)(); // Trigger the form submission
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="sm:w-[800px]">
                    <SelectValue placeholder="Avec dépose ?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      value={"option-sans-depose"}
                      className="w-auto cursor-pointer"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Sans dépose{" "}
                      <span className="ml-2 text-green-600">+ 0 € </span>
                    </SelectItem>
                    <SelectItem
                      value={"option-avec-depose"}
                      className="w-auto cursor-pointer"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Oui <span className="ml-2 text-green-600">+ 20 € </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 m-2">
          <Button
            className="sm:w-[250px]"
            disabled
            size="sm"
            variant="secondary"
          >
            Retour
          </Button>
          <Button
            className="bg-[#CCB3AE] text-black sm:w-[250px]"
            size="sm"
            type="submit"
          >
            Suivant
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SelectService;
