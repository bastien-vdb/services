import { memo } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useStepper } from "@/src/components/stepper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/src/components/ui/use-toast";
import { z } from "zod";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Button } from "@/src/components/ui/button";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import { Checkbox } from "@/src/components/ui/checkbox";

const FormSchema = z.object({
  q1: z.optional(z.string()),
  q2: z.optional(z.string()),
  q3: z.optional(z.string()),
  q4: z.optional(z.string()),
  q5: z.optional(z.string()),
  q6: z.optional(z.string()),
  q7: z.optional(z.string()),
  q8: z.boolean({
    required_error: "Veuillez accepter le règlement",
  }),
});

const Step3 = memo(({ userId }: { userId: string }) => {
  const { serviceSelected } = useServiceStore();
  const { nextStep, prevStep } = useStepper();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "On passe à l'étape suivante !",
      description: "",
    });
    nextStep();
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
        <RadioGroup defaultValue="option-no" {...field}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-yes" id={idYes} />
            <Label htmlFor={idYes}>Oui</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-no" id={idNo} />
            <Label htmlFor={idNo}>Non</Label>
          </div>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  return (
    <div className="flex justify-center">
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
                <FormField
                  control={form.control}
                  name="q4"
                  render={({ field }) =>
                    renderRadioGroup(
                      field,
                      "Êtes-vous majeure? (si non, une autorisation écrite du ou des parent(s) / tuteur(s) légal/légaux, datée et signée avec la photocopie de sa/leur pièce d'identité est requise)",
                      "option-yes-4",
                      "option-no-4"
                    )
                  }
                />
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

                {serviceSelected?.name === "Fox eyes" && (
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
              <div className="flex gap-2 m-2">
                <Button
                  disabled={false}
                  onClick={prevStep}
                  size="sm"
                  variant="secondary"
                >
                  Prev
                </Button>
                <Button size="sm" type="submit">
                  Suivant
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
});

export default Step3;
