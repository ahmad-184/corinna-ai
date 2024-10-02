"use client";

import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import FormGeneration from "@/components/form-generation";
import Section from "@/components/section";
import { Form } from "@/components/ui/form";
import { RESET_PASSWORD_FORM } from "@/constants/forms";
import useResetPassword from "@/hooks/auth/use-reset-password";
import { UserType } from "@/types";

type Props = { user: UserType };

const ChangePasswordSetting = ({ user }: Props) => {
  const { isLoading, resetPassword, reset_password_form_methods } =
    useResetPassword();
  const { control, handleSubmit, setValue } = reset_password_form_methods;
  setValue("userId", user.id);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-5 lg:gap-10 gap-6">
      <div className="lg:col-span-1">
        <Section
          label="Change password"
          message="You can change your password here."
        />
      </div>
      <div className="lg:col-span-3 flex flex-col md:!flex-row gap-5 items-start">
        <Form {...reset_password_form_methods}>
          <form
            onSubmit={handleSubmit(resetPassword)}
            className="w-full flex flex-col gap-1 max-w-md"
          >
            {RESET_PASSWORD_FORM.map((e) => (
              <FormGeneration
                key={e.id + e.name}
                name={e.name}
                placeholder={e.placeholder}
                inputType="input"
                control={control}
                id={e.id}
                label={e.label}
                disabled={isLoading}
                type="password"
              />
            ))}
            <ButtonWithLoaderAndProgress
              loading={isLoading}
              disabled={isLoading}
              className="lg:w-[150px] mt-2"
            >
              Reset
            </ButtonWithLoaderAndProgress>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordSetting;
