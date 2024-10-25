import { APPOINTMENT_TIME_SLOT } from "@/constants/forms";
import { Calendar } from "../ui/calender";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import ButtonWithLoaderAndProgress from "../button-with-loader-and-progress-bar";
import { isBooked } from "@/lib/use-cases";
import { portalFormSchemaType } from "@/types";
import { portalFormSchema } from "@/zod/portal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createNewAppointmentAction } from "@/actions/appointment";
import { toast } from "sonner";

type Props = {
  onPrevStep: () => void;
  onNextStep: () => void;
  bookings?: { date: Date; slot: string }[] | null | undefined;
  isQuestions?: boolean;
  customer_id: string;
  domain_id: string;
  email: string;
};

const BookAppointmentForm = ({
  bookings,
  onPrevStep,
  onNextStep,
  isQuestions,
  customer_id,
  domain_id,
  email,
}: Props) => {
  const form = useForm<portalFormSchemaType>({
    defaultValues: {
      date: new Date(Date.now()),
      slot: "",
    },
    resolver: zodResolver(portalFormSchema),
  });
  const { handleSubmit, setValue, watch, register } = form;
  const date = watch().date;
  const slot = watch().slot;

  const onSelectTimeSlot = (slot: string) => setValue("slot", slot);
  const onSelectDate = (date: Date) => setValue("date", date);

  const {
    mutate: createNewAppointment,
    isPending: createNewAppointmentLoading,
  } = useMutation({
    mutationFn: createNewAppointmentAction,
    onSuccess: (e) => {
      if (e.error) toast.error("Error", { description: e.error });
      if (e.data) {
        toast.success("Greate! booking appointment was successful, See you😉");
        onNextStep();
      }
    },
  });

  const onBookAppointment = handleSubmit((values) => {
    if (!domain_id || !email || !customer_id) return;
    if (isBooked(bookings, date, slot))
      return toast.warning("This date already reserved.");
    else
      createNewAppointment({
        customer_id,
        date: values.date,
        domain_id,
        email,
        slot: values.slot,
      });
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-7"
        id="appointment-form"
        onSubmit={onBookAppointment}
      >
        <div className="pb-4">
          <h1 className="font-bold text-4xl text-center">Book a meeting</h1>
        </div>
        <div className="w-full flex flex-col gap-4 sm:flex-row sm:gap-3 justify-center max-w-3xl">
          <div>
            <h3 className="font-medium mb-1">Discovery Call</h3>
            <p className="text-muted-foreground font-light text-sm">
              During this call, we aim to explore potential avenues for
              partnership, promotional opportunities, or any other means through
              which we can contribute to the success of your company.
            </p>
          </div>
          <div className="w-fit">
            <Calendar
              mode="single"
              disabled={[
                { before: new Date(Date.now()) },
                { dayOfWeek: [4, 5] },
              ]}
              selected={date}
              onSelect={(e) => onSelectDate(e || new Date(Date.now()))}
              className="rounded-md border h-full p-3"
            />
          </div>
          <div className="flex flex-col gap-4">
            {APPOINTMENT_TIME_SLOT.map((e, i) => (
              <Label htmlFor={`slot-${i}`} key={e.slot}>
                <Card
                  className={cn(
                    "px-10 py-4 rounded-md text-black relative text-center",
                    {
                      "bg-peach": slot !== e.slot,
                      "bg-grandis": slot === e.slot,
                      "!bg-gray-300": isBooked(bookings, date, e.slot),
                      "cursor-pointer border-orange transition duration-150 ease-in-out":
                        !isBooked(bookings, date, e.slot),
                    }
                  )}
                >
                  {!isBooked(bookings, date, e.slot) && slot === e.slot && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-black" />
                  )}
                  <Input
                    className="hidden"
                    value={e.slot}
                    {...register("slot")}
                    type="radio"
                    id={`slot-${i}`}
                    disabled={isBooked(bookings, date, e.slot)}
                  />
                  <div
                    className={cn({
                      "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:translate-x-[-50%] before:w-[60%] opacity-50 before:h-[1px] before:bg-black":
                        isBooked(bookings, date, e.slot),
                    })}
                  >
                    {e.slot}
                  </div>
                </Card>
              </Label>
            ))}
          </div>
        </div>
        <div className="w-full flex gap-5 justify-center">
          {!!isQuestions && (
            <Button variant={"outline"} onClick={onPrevStep}>
              Edit Questions?
            </Button>
          )}
          <ButtonWithLoaderAndProgress
            type="submit"
            form="appointment-form"
            loading={createNewAppointmentLoading}
            disabled={createNewAppointmentLoading}
          >
            Book Now
          </ButtonWithLoaderAndProgress>
        </div>
      </form>
    </Form>
  );
};

export default BookAppointmentForm;
