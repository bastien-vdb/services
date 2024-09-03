"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { UseFormReturn } from "react-hook-form";

type QuickSelectWrapperProps<T extends { id: string }> = {
  name: string;
  label: string;
  values: T[];
  placeHolder: string;
  className?: string;
  renderFn: (d: T) => React.ReactElement;
};

const QuickSelectWrapper = <T extends { id: string }>({
  form,
  name,
  label,
  values,
  placeHolder,
  className,
  renderFn,
}: QuickSelectWrapperProps<T> & {
  form?: UseFormReturn<any, any, undefined>;
}) => {
  if (!form) throw new Error("The component must be used in form context");
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className={className}>
                <SelectValue placeholder={placeHolder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {values?.map((v, i) => (
                  <SelectItem
                    value={v.id}
                    className="w-auto cursor-pointer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {renderFn(v)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default QuickSelectWrapper;
