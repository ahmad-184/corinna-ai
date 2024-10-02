import { UserRegistrationProps } from "@/constants/forms";
import type { Control } from "react-hook-form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

type Props = UserRegistrationProps & {
  control: Control<any>;
  form?: string;
  disabled: boolean;
  rows?: number;
};

const FormGeneration = ({
  type,
  control,
  inputType,
  name,
  placeholder,
  form,
  label,
  options,
  disabled,
  id,
  rows,
}: Props) => {
  switch (inputType) {
    case "input":
      return (
        <FormField
          disabled={disabled}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  {...(form && { form: form })}
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  className="!mt-1 placeholder:text-xs"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      );

    case "textarea":
      return (
        <FormField
          disabled={disabled}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea
                  {...(form && { form: form })}
                  placeholder={placeholder}
                  {...field}
                  className="!mt-1 placeholder:text-xs"
                  min-rows={2}
                  {...(rows && { rows })}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      );

    case "select":
      return (
        <FormField
          control={control}
          name={name}
          disabled={disabled}
          render={({ field }) => (
            <FormItem className="mt-0">
              <FormLabel>{label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger {...(form && { form: form })}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!!options?.length &&
                    options.map((e) => (
                      <SelectItem value={e.value}>{e.label}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      );
    default:
      return <></>;
  }
};

export default FormGeneration;
