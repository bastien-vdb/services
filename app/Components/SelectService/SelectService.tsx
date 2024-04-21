"use client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import { Button } from "@/src/components/ui/button";
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
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  service: z.string({
    required_error: "Merci de sélectionner une prestation.",
  }),
});

export const HeaderWithIcon = (Icon: JSX.Element, text: string) => {
  return (
    <div className="flex items-center gap-4">
      <span>{text}</span> {Icon}
    </div>
  );
};

function SelectService({ services }: { services?: Service[] }) {
  const { changeServiceSelected } = useServiceStore();

  const handleSelectService = (service: Service) => {
    changeServiceSelected(service);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const serviceSelected = services?.find(
      (service) => service.id === data.service
    );
    handleSelectService(serviceSelected as Service);
    toast({
      title: "Vous avez sélectionné",
      description: serviceSelected?.name,
    });
  }

  return (
    <div className="m-auto mt-40">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choisir sa prestation</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="sm:w-[450px]">
                      <SelectValue placeholder="Que souhaitez vous faire ?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Prestations</SelectLabel>
                      {services?.map((service) => {
                        return (
                          <SelectItem
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
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription>Plus qu'une étape ! </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Valider</Button>
        </form>
      </Form>
    </div>
  );
}

export default SelectService;
