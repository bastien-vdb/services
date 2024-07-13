import useFormStore from "@/app/Components/SelectService/useFormStore";
import useServiceStore from "@/app/admin/Components/Services/useServicesStore";
import QuickCheckboxWrapper from "@/src/components/QuickWrapper/QuickCheckboxWrapper";
import QuickFormWrapper from "@/src/components/QuickWrapper/QuickFormWrapper";
import QuickRadioYesNoWrapper from "@/src/components/QuickWrapper/QuickRadioYesNoWrapper";
import { Card, CardContent } from "@/src/components/ui/card";
import { CarouselApi, useCarousel } from "@/src/components/ui/carousel";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    q4: RadioButtonRuleForm(false),
    q5: RadioButtonRuleForm(false),
    q6: z.boolean().refine((val) => val === true, {
      message: "*",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData, // Use data from the store
  });

  function onSubmit({ q4, q5, q6 }: z.infer<typeof FormSchema>) {
    setFormData({ q4, q5, q6 }); // Update store with form data
    // nextStep();

    scrollNext();
  }

  return (
    <div className="flex justify-center">
      {api?.selectedScrollSnap() === 3 && ( //TODO: very important to make it reusable PLEASE ! because we can change the order of the steps
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
              <QuickRadioYesNoWrapper
                name={"q4"}
                label={
                  "Portez-vous des lentilles? (si oui, il est nécessaire de les enlever le temps de la prestation)"
                }
                idYes={"option-yes-4"}
                idNo={"option-no-4"}
              />

              <QuickRadioYesNoWrapper
                name={"q5"}
                label={
                  "Accepteriez-vous d'être prise en photo et/ou publiée sur les réseaux sociaux du Finest Beauty Studio ?"
                }
                idYes={"option-yes-5"}
                idNo={"option-no-5"}
              />

              <QuickCheckboxWrapper
                name={"q6"}
                label={"Acceptez-vous de suivre le règlement intérieur ?"}
              />
            </QuickFormWrapper>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default Step4;
