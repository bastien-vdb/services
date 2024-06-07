"use client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import { useStepper } from "@/src/components/stepper";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useCarousel } from "@/src/components/ui/carousel";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "@/src/components/ui/use-toast";
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
  const { nextStep, prevStep } = useStepper();
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  useEffect(() => {
    console.log("orientation", orientation);
  }, [orientation]);

  const FormSchema = z.object({
    service: z.string({
      required_error: "Merci de sélectionner une prestation.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      service: serviceSelected?.id || undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const serviceSelected = services?.find(
      (service) => service.id === data.service
    );

    serviceSelected && changeServiceSelected(serviceSelected);
    scrollNext();
    // nextStep();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center flex-col"
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
                        <span className="ml-2 text-[#1246d6]">
                          - {service.price / 100} €
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>Plus qu'une étape ! </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 m-2">
          <Button className="bg-[#CCB3AE] text-black" size="sm" type="submit">
            Suivant
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SelectService;
