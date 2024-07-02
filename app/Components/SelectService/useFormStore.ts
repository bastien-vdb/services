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
  q8: z.boolean({
    required_error: "Veuillez accepter le règlement",
  }),
  employee: z.optional(z.string()),
});

type FormData = z.infer<typeof FormSchema>;

type FormStoreType = {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
  submitFormData: () => Promise<void>;
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
      q8: false,
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
          q8: false,
          employee: "",
        },
      }),
    submitFormData: async () => {
      const { formData } = useFormStore.getState();
      // Envoyer les données du formulaire à la base de données
      try {
        await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        console.log("Formulaire soumis avec succès");
      } catch (error) {
        console.error("Erreur lors de la soumission du formulaire", error);
      }
    },
  }))
);

export default useFormStore;
