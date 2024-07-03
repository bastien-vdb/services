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
import { useForm } from "react-hook-form";
import { z } from "zod";
import useFormStore from "./useFormStore";

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
  const { formData, setFormData } = useFormStore(); // Use Zustand store
  const { orientation, scrollNext } = useCarousel();

  const FormSchema = z.object({
    service: z.string({
      required_error: "Champ obligatoire.",
    }),
    option: z.string({
      required_error: "Champ obligatoire.",
    }),
    employee: z.string({
      required_error: "Champ obligatoire.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      service: serviceSelected?.id || undefined,
      option: undefined,
      employee: undefined,
    },
  });

  function onSubmit({ service, employee, option }: z.infer<typeof FormSchema>) {
    const serviceSelected = services?.find((s) => s.id === service);

    setFormData({ employee: employee }); // Update store with form data

    serviceSelected && changeServiceSelected(serviceSelected);

    if (option === "option-avec-depose") {
      changeOptionSelected({
        name: service,
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
          name="employee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choisir son artiste</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-[250px] sm:w-[800px]">
                    <SelectValue placeholder="Par qui ?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      disabled
                      value={"Natacha"}
                      className="w-auto cursor-pointer"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Natacha <span className="text-red-600"> - complet</span>
                    </SelectItem>
                    <SelectItem
                      value={"Louise"}
                      className="w-auto cursor-pointer"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Louise
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  <SelectTrigger className="w-[250px] sm:w-[800px]">
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
                          + {service.price / 100} €
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
                  <SelectTrigger className="w-[250px] sm:w-[800px]">
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
