"use client";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type QuickFormWrapperProps<T> = {
  children: (React.ReactElement<any> | React.ReactNode)[];
  // form: UseFormReturn<any, any, undefined>;
  FormSchema: z.ZodObject<any>;
  defaultValues: { [key: string]: string | number | undefined };
  onSubmit: SubmitHandler<{ [x: string]: any }>;
  watchLive: (fields: { [x: string]: any }) => void;
};
const QuickFormWrapper = <T,>({
  children,
  FormSchema,
  defaultValues,
  onSubmit,
  watchLive,
}: QuickFormWrapperProps<T>) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const watchFields = form.watch(); // you can also target specific fields by their names

  useEffect(() => {
    watchLive(watchFields);
  }, [watchFields]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center flex-col gap-10"
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            //TODO: attention à cette erreur de typage non maîtrisée
            //@ts-expect-error
            return React.cloneElement(child, { form });
          }
          return child;
        })}
      </form>
    </Form>
  );
};

export default QuickFormWrapper;
