import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import FormGeneration from "@/components/form-generation";
import { Form } from "@/components/ui/form";
import { RESET_PASSWORD_FORM } from "@/constants/forms";
import useResetPassword from "@/hooks/auth/use-reset-password";

const ResetPasswordForm = () => {
  const { isLoading, reset_password_form_methods, resetPassword } =
    useResetPassword();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = reset_password_form_methods;
  setValue("userId", (window.localStorage.getItem("user_id") as string) || "");

  return (
    <Form {...reset_password_form_methods}>
      <form onSubmit={handleSubmit(resetPassword)}>
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-gravel md:text-4xl md:mb-1 font-bold text-lg">
            Reset pasword
          </h2>
          <p className=" text-iridium text-sm font-medium">
            Change your password.
          </p>
          <div className="flex w-full flex-col gap-1">
            {RESET_PASSWORD_FORM.map((e) => (
              <FormGeneration
                key={e.id}
                control={control}
                disabled={isLoading}
                {...e}
              />
            ))}
          </div>
          {!!errors.userId?.message && (
            <p className="text-destructive text-sm">{errors.userId.message}</p>
          )}
          <ButtonWithLoaderAndProgress disabled={isLoading} loading={isLoading}>
            Reset
          </ButtonWithLoaderAndProgress>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
