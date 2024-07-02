import useFormStore from "@/app/Components/SelectService/useFormStore";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import TextRevealButton from "@/src/components/syntax-ui/TextRevealButton";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { CarouselApi, useCarousel } from "@/src/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const OPTIONAL_SERVICE = "Fox eyes";

const RadioButtonRuleForm = (obligatoire = true) => {
  if (!obligatoire) {
    return z.string().optional();
  }
  return z.string().refine((val) => val.length > 0, {
    message: "*",
  });
};

const Step3 = memo(({ userId, api }: { userId: string; api: CarouselApi }) => {
  const { serviceSelected } = useServiceStore();
  const { formData, setFormData } = useFormStore(); // Use Zustand store
  const { scrollNext, scrollPrev } = useCarousel();

  console.log("api", api?.selectedScrollSnap());

  // Définition du schéma du formulaire
  const FormSchema = z.object({
    q1: RadioButtonRuleForm(false),
    q2: RadioButtonRuleForm(false),
    q3: RadioButtonRuleForm(false),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData, // Use data from the store
  });

  function onSubmit({ q1, q2, q3 }: z.infer<typeof FormSchema>) {
    setFormData({ q1, q2, q3 }); // Update store with form data
    // nextStep();

    scrollNext();
  }

  const renderRadioGroup = (
    field: any,
    label: string,
    idYes: string,
    idNo: string
  ) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <RadioGroup
          className="flex gap-8"
          value={field.value}
          onValueChange={field.onChange}
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="yes" id={idYes} />
            <Label htmlFor={idYes}>Oui</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="no" id={idNo} />
            <Label htmlFor={idNo}>Non</Label>
          </div>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  return (
    <div className="flex justify-center">
      {api?.selectedScrollSnap() === 1 && ( //TODO: very important to make it reusable PLEASE ! because we can change the order of the steps
        //it's not chatGPT code :)
        //Moreover, i'm using this to avoid mount a big form that allow to scroll down even on the other steps because of this form that is long
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex justify-center items-center gap-12 flex-col"
              >
                <div className="flex flex-col gap-8">
                  <FormField
                    control={form.control}
                    name="q1"
                    render={({ field }) =>
                      renderRadioGroup(
                        field,
                        "Avez-vous déjà porté des extensions de cil ?",
                        "option-yes-1",
                        "option-no-1"
                      )
                    }
                  />
                  <FormField
                    control={form.control}
                    name="q2"
                    render={({ field }) =>
                      renderRadioGroup(
                        field,
                        "Avez-vous déjà eu une réaction allergique due à des extensions de cils ?",
                        "option-yes-2",
                        "option-no-2"
                      )
                    }
                  />
                  <FormField
                    control={form.control}
                    name="q3"
                    render={({ field }) =>
                      renderRadioGroup(
                        field,
                        "Êtes-vous enceinte?",
                        "option-yes-3",
                        "option-no-3"
                      )
                    }
                  />
                </div>
                <div className="flex justify-between w-full">
                  <TextRevealButton
                    onClick={() => scrollPrev()}
                    arrowPosition="left"
                  >
                    Retour
                  </TextRevealButton>
                  <TextRevealButton
                    bg={"bg-black"}
                    type="submit"
                    arrowPosition="right"
                  >
                    Suivant
                  </TextRevealButton>
                </div>{" "}
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default Step3;
