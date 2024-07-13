import useFormStore from "@/app/Components/SelectService/useFormStore";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import QuickCheckboxWrapper from "@/src/components/QuickWrapper/QuickCheckboxWrapper";
import QuickFormWrapper from "@/src/components/QuickWrapper/QuickFormWrapper";
import TextRevealButton from "@/src/components/syntax-ui/TextRevealButton";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { CarouselApi, useCarousel } from "@/src/components/ui/carousel";
import { Checkbox } from "@/src/components/ui/checkbox";
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
import { memo, useEffect } from "react";
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

const Step4 = memo(({ userId, api }: { userId: string; api: CarouselApi }) => {
  const { serviceSelected } = useServiceStore();
  const { formData, setFormData } = useFormStore(); // Use Zustand store
  const { scrollNext, scrollPrev } = useCarousel();

  // Définition du schéma du formulaire
  const FormSchema = z.object({
    q5: RadioButtonRuleForm(false),
    q6: RadioButtonRuleForm(false),
    q7: RadioButtonRuleForm(serviceSelected?.name === OPTIONAL_SERVICE),
    q8: z.boolean().refine((val) => val === true, {
      message: "Veuillez accepter le règlement",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData, // Use data from the store
  });

  function onSubmit({ q5, q6, q7, q8 }: z.infer<typeof FormSchema>) {
    setFormData({ q5, q6, q7, q8 }); // Update store with form data
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
      {api?.selectedScrollSnap() === 2 && ( //TODO: very important to make it reusable PLEASE ! because we can change the order of the steps
        //it's not chatGPT code :)
        //Moreover, i'm using this to avoid mount a big form that allow to scroll down even on the other steps because of this form that is long
        <Card>
          <CardContent>
            <QuickFormWrapper
              FormSchema={FormSchema}
              onSubmit={onSubmit}
              defaultValues={formData}
              backButton={true}
              onBackAction={scrollPrev}
            >
              <QuickCheckboxWrapper
                name={"q5"}
                label={
                  "Portez-vous des lentilles? (si oui, il est nécessaire de les enlever le temps de la prestation)"
                }
                idYes={"option-yes-5"}
                idNo={"option-no-5"}
              />

              <QuickCheckboxWrapper
                name={"q6"}
                label={
                  "Accepteriez-vous d'être prise en photo et/ou publiée sur les réseaux sociaux du Finest Beauty Studio ?"
                }
                idYes={"option-yes-6"}
                idNo={"option-no-6"}
              />

              {/* <QuickCheckboxWrapper
                name={"q2"}
                label={
                  "Acceptez-vous de suivre le règlement intérieur ?"
                }
                idYes={"option-yes-2"}
                idNo={"option-no-2"}
              /> */}

              <FormField
                control={form.control}
                name="q8"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Acceptez-vous de suivre le règlement intérieur ?
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        className="ml-8 w-6 h-6"
                        id="acceptRules"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </QuickFormWrapper>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default Step4;
