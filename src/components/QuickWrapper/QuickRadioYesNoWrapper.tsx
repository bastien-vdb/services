import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

type QuickRadioYesNoWrapperProps = {
  name: string;
  label: string;
};

const QuickRadioYesNoWrapper = ({
  form,
  name,
  label,
}: QuickRadioYesNoWrapperProps & {
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
            <RadioGroup
              className="flex gap-8"
              value={field.value}
              onValueChange={field.onChange}
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="true" id={`${name}-true`} />
                <Label htmlFor={`${name}-true`}>Oui</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="false" id={`${name}-false`} />
                <Label htmlFor={`${name}-false`}>Non</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default QuickRadioYesNoWrapper;
