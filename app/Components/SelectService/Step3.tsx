import useFormStore from "@/app/Components/SelectService/useFormStore";
import QuickFormWrapper from "@/src/components/QuickWrapper/QuickFormWrapper";
import QuickRadioYesNoWrapper from "@/src/components/QuickWrapper/QuickRadioYesNoWrapper";
import { Card, CardContent } from "@/src/components/ui/card";
import { CarouselApi, useCarousel } from "@/src/components/ui/carousel";
import { questions } from "@/src/lib/Config/questions";
import { memo } from "react";
import { z } from "zod";

const RadioButtonRuleForm = (
  obligatoire = false,
  acceptationRequired = false
) => {
  if (!obligatoire) {
    return z.string().optional();
  }
  if (acceptationRequired) {
    return z.string().refine((val) => val === "true", {
      message: "*",
    });
  }
  return z.string().refine((val) => val.length > 0, {
    message: "*",
  });
};

// Définition du schéma du formulaire
const FormSchema = z.object({
  q1: RadioButtonRuleForm(true),
  q2: RadioButtonRuleForm(true),
  q3: RadioButtonRuleForm(true),
  q4: RadioButtonRuleForm(true),
  q5: RadioButtonRuleForm(true),
  q6: RadioButtonRuleForm(true),
  q7: RadioButtonRuleForm(true, true),
});

const Step3 = memo(({ api }: { api: CarouselApi }) => {
  const { formData, setFormData } = useFormStore(); // Use Zustand store
  const { scrollNext, scrollPrev } = useCarousel();

  function onSubmit({
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7,
  }: z.infer<typeof FormSchema>) {
    window.scrollTo(0, 0);
    setFormData({ q1, q2, q3, q4, q5, q6, q7 }); // Update store with form data
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
                (question, i) =>
                  i < questions.length - 1 && (
                    <QuickRadioYesNoWrapper
                      name={question.id}
                      label={question.label}
                    />
                  )
              )}
            </QuickFormWrapper>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

export default Step3;
