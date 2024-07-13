import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/src/components/ui/checkbox";

type QuickCheckboxWrapperProps = {
  name: string;
  label: string;
};

const QuickCheckboxWrapper = ({
  form,
  name,
  label,
}: QuickCheckboxWrapperProps & {
  form?: UseFormReturn<any, any, undefined>;
}) => {
  if (!form) throw new Error("The component must be use into form context");
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Checkbox
              className="ml-8 w-6 h-6"
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default QuickCheckboxWrapper;
