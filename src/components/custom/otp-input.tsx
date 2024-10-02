import { FieldValues } from "react-hook-form";
import { InputOTP, InputOTPSlot } from "../ui/input-otp";

const OTPInput = ({
  isLoading,
  maxLength,
  field,
}: {
  isLoading?: boolean;
  maxLength?: number;
  field: FieldValues;
}) => {
  return (
    <InputOTP
      disabled={isLoading || false}
      maxLength={maxLength || 6}
      {...field}
    >
      <div className="flex gap-3 justify-center w-full py-5">
        <div>
          <InputOTPSlot index={0} />
        </div>
        <div>
          <InputOTPSlot index={1} />
        </div>
        <div>
          <InputOTPSlot index={2} />
        </div>
        <div>
          <InputOTPSlot index={3} />
        </div>
        <div>
          <InputOTPSlot index={4} />
        </div>
        <div>
          <InputOTPSlot index={5} />
        </div>
      </div>
    </InputOTP>
  );
};

export default OTPInput;
