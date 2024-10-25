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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

type Props = UserRegistrationProps & {
  control: Control<any>;
  form?: string;
  disabled: boolean;
  rows?: number;
  description?: string;
  min?: number;
  max?: number;
  input_classname?: string;
  label_classname?: string;
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
  description,
  min,
  max,
  input_classname,
  label_classname,
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
              <FormLabel
                className={cn(label_classname)}
                htmlFor={`${id}-${name}`}
              >
                {label}
              </FormLabel>
              <FormControl>
                <Input
                  {...(form && { form: form })}
                  {...(min && { min })}
                  {...(max && { max })}
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  className={cn("!mt-1", input_classname)}
                  id={`${id}-${name}`}
                />
              </FormControl>
              {!!description?.length && (
                <FormDescription>{description}</FormDescription>
              )}
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
              <FormLabel className={cn(label_classname)}>{label}</FormLabel>
              <FormControl>
                <Textarea
                  {...(form && { form: form })}
                  placeholder={placeholder}
                  {...field}
                  className={cn("!mt-1", input_classname)}
                  min-rows={2}
                  {...(rows && { rows })}
                  id={id}
                />
              </FormControl>
              {!!description?.length && (
                <FormDescription>{description}</FormDescription>
              )}
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
              <FormLabel className={cn(label_classname)}>{label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    {...(form && { form: form })}
                    id={id}
                    className={cn(input_classname)}
                  >
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
              {!!description?.length && (
                <FormDescription>{description}</FormDescription>
              )}
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      );
    default:
      return null;
  }
};

export default FormGeneration;
