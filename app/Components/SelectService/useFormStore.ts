import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { z } from "zod";

// Définition du schéma du formulaire
const FormSchema = z.object({
  q1: z.optional(z.string()),
  q2: z.optional(z.string()),
  q3: z.optional(z.string()),
  q4: z.optional(z.string()),
  q5: z.optional(z.string()),
  q6: z.optional(z.string()),
  q7: z.optional(z.string()),
  employee: z.optional(z.string()),
});

type FormData = z.infer<typeof FormSchema>;

type FormStoreType = {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
};

const useFormStore = create<FormStoreType>()(
  devtools((set) => ({
    formData: {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      employee: "",
    },
    setFormData: (data) =>
      set((state) => ({ formData: { ...state.formData, ...data } })),
    resetFormData: () =>
      set({
        formData: {
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          q5: "",
          q6: "",
          q7: "",
          employee: "",
        },
      }),
  }))
);

export default useFormStore;
