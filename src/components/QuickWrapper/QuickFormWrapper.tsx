"use client";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import TextRevealButton from "../syntax-ui/TextRevealButton";

type QuickFormWrapperProps<T> = {
  children: React.ReactNode;
  FormSchema: z.ZodObject<any>;
  defaultValues: { [key: string]: string | number | undefined | boolean };
  onSubmit: SubmitHandler<{ [x: string]: any }>;
  watchLive?: (fields: { [x: string]: any }) => void;
  onBackAction?: () => void;
  backButton?: boolean;
};
const QuickFormWrapper = <T,>({
  children,
  FormSchema,
  defaultValues,
  onSubmit,
  watchLive,
  onBackAction,
  backButton = true,
}: QuickFormWrapperProps<T>) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const watchFields = form.watch(); // you can also target specific fields by their names

  useEffect(() => {
    watchLive && watchLive(watchFields);
  }, [watchFields]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-start flex-col gap-10"
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            //TODO: attention à cette erreur de typage non maîtrisée
            //@ts-expect-error
            return React.cloneElement(child, { form });
          }
          return child;
        })}
        <div className="flex justify-between w-full">
          <TextRevealButton
            disabled={!backButton}
            onClick={onBackAction}
            arrowPosition="left"
          >
            Retour
          </TextRevealButton>

          <TextRevealButton bg={"bg-black"} type="submit" arrowPosition="right">
            Suivant
          </TextRevealButton>
        </div>{" "}
      </form>
    </Form>
  );
};

export default QuickFormWrapper;
