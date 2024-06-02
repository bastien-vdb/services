"use client";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import { useStepper } from "@/src/components/stepper";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
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
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "@/src/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
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

function Step2() {
  const { changeOptionSelected, optionSelected } = useServiceStore();
  const { nextStep, prevStep } = useStepper();
  const { orientation, scrollNext, scrollPrev } = useCarousel();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      service: optionSelected ? "option-depose" : undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.service === "option-depose") {
      changeOptionSelected({
        name: data.service,
        price: 2000,
      });
    } else changeOptionSelected(undefined);

    // nextStep();
    scrollNext();
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
              <FormLabel>Option</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // form.handleSubmit(onSubmit)(); // Trigger the form submission
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="sm:w-[300px]">
                    <SelectValue placeholder="Avec dépose ?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      value={"no"}
                      className="w-auto cursor-pointer"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Non
                    </SelectItem>
                    <SelectItem
                      value={"option-depose"}
                      className="w-auto cursor-pointer"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Oui (<span className="ml-2 text-[#1246d6]">+ 20 € </span>)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <div className="flex justify-center gap-2 m-2">
        <Button
          onClick={scrollPrev}
          disabled={false}
          size="sm"
          variant="secondary"
        >
          Prev
        </Button>
        <Button size="sm" onClick={form.handleSubmit(onSubmit)}>
          Suivant
        </Button>
      </div>
    </Form>
  );
}

export default Step2;
