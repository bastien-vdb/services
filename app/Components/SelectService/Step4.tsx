import useFormStore from "@/app/Components/SelectService/useFormStore";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex justify-center items-center gap-12 flex-col"
              >
                <div className="flex flex-col gap-8">
                  <FormField
                    control={form.control}
                    name="q5"
                    render={({ field }) =>
                      renderRadioGroup(
                        field,
                        "Portez-vous des lentilles? (si oui, il est nécessaire de les enlever le temps de la prestation)",
                        "option-yes-5",
                        "option-no-5"
                      )
                    }
                  />
                  <FormField
                    control={form.control}
                    name="q6"
                    render={({ field }) =>
                      renderRadioGroup(
                        field,
                        "Accepteriez-vous d'être prise en photo et/ou publiée sur les réseaux sociaux du Finest Beauty Studio ?",
                        "option-yes-6",
                        "option-no-6"
                      )
                    }
                  />

                  {serviceSelected?.name === OPTIONAL_SERVICE && (
                    <FormField
                      control={form.control}
                      name="q7"
                      render={({ field }) =>
                        renderRadioGroup(
                          field,
                          "Vous venez de sélectionner la pose Fox eyes, pour précision : Ce set va à la perfection à celles ayant des yeux en amande, avec une base ciliaire assez fournie et régulière. Pour celles ayant les yeux plus ronds / les yeux tombants / les yeux avec paupières tombantes, il est important de préciser que l'effet ne sera pas du tout le même ! Cela aura tendance à alourdir le regard au lieu de le relever, donc tout l'inverse. Etes-vous sûr(e) de convenir à la description et sélectionner cette pose ? Note : En cas de doute, vous pouvez directement contacter votre Finest Lash Artist via DM sur instagram, par mail à contact@finestlashstudio.fr ou par SMS / Whatsapp au 07 83 63 97 38 si vous voulez être conseillée au mieux avant de réserver votre créneau.",
                          "option-yes-7",
                          "option-no-7"
                        )
                      }
                    />
                  )}

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
                </div>
                <div className="flex w-full justify-between gap-10 m-2">
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
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default Step4;
