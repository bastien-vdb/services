import useFormStore from "@/app/Components/SelectService/useFormStore";
import QuickFormWrapper from "@/src/components/QuickWrapper/QuickFormWrapper";
import QuickRadioYesNoWrapper from "@/src/components/QuickWrapper/QuickRadioYesNoWrapper";
import { Card, CardContent } from "@/src/components/ui/card";
import { CarouselApi, useCarousel } from "@/src/components/ui/carousel";
import { memo } from "react";
import { z } from "zod";
import { questions } from "@/src/lib/Config/questions";

const RadioButtonRuleForm = (obligatoire = true) => {
  if (!obligatoire) {
    return z.string().optional();
  }
  return z.string().refine((val) => val.length > 0, {
    message: "*",
  });
};

const Step3 = memo(({ api }: { userId: string; api: CarouselApi }) => {
  const { formData, setFormData } = useFormStore(); // Use Zustand store
  const { scrollNext, scrollPrev } = useCarousel();

  // Définition du schéma du formulaire
  const FormSchema = z.object({
    q1: RadioButtonRuleForm(false),
    q2: RadioButtonRuleForm(false),
    q3: RadioButtonRuleForm(false),
  });

  function onSubmit({ q1, q2, q3 }: z.infer<typeof FormSchema>) {
    setFormData({ q1, q2, q3 }); // Update store with form data
    scrollNext();
  }

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
              {questions.map(
                (question, i) => (
                  // i < 3 && (
                  <QuickRadioYesNoWrapper
                    name={question.id}
                    label={question.label}
                  />
                )
                // )
              )}
            </QuickFormWrapper>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default Step3;
