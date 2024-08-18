import { de } from "date-fns/locale";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";
import { HTMLInputTypeAttribute } from "react";

type QuickInputWrapperProps = {
  name: string;
  label: string;
  placeHolder: string;
  type?: HTMLInputTypeAttribute;
  description?: string;
};

const QuickInputWrapper = ({
  name,
  label,
  placeHolder,
  form,
  type = "text",
  description,
}: QuickInputWrapperProps & {
  form?: UseFormReturn<any, any, undefined>;
}) => {
  if (!form)
    throw new Error("The component must be used within a form context");
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeHolder} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default QuickInputWrapper;
