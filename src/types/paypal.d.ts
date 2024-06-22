//types créé par bastien vdb et non par paypal directement
export type paypalCustomIdType = {
  startTime: Date;
  endTime: Date;
  userId: string;
};

export type paypalDescriptionTransactionType = {
  serviceId: string;
  addedOption:
    | {
        name: string;
        price: number;
      }
    | undefined;
  formData: {
    q8: boolean;
    q1?: string | undefined;
    q2?: string | undefined;
    q3?: string | undefined;
    q4?: string | undefined;
    q5?: string | undefined;
    q6?: string | undefined;
    q7?: string | undefined;
  };
};
