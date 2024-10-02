export type UserRegistrationProps = {
  id: string;
  type?: "email" | "text" | "password" | "color";
  inputType: "select" | "input" | "checkbox" | "radio" | "textarea";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  name: string;
};

export const USER_REGISTRATION_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Full name",
    name: "fullname",
    type: "text",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: "4",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
  {
    id: "5",
    inputType: "input",
    placeholder: "Confrim Password",
    name: "passwordConfirmation",
    type: "password",
  },
];

export const USER_LOGIN_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Enter your email",
    name: "email",
    type: "email",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
];

export const RESET_PASSWORD_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "New password",
    label: "New password",
    name: "password",
    type: "password",
  },
  {
    id: "2",
    inputType: "input",
    label: "Repeat password",
    placeholder: "Repeat password",
    name: "passwordConfirmation",
    type: "password",
  },
];

export const CHECK_USER_EMAIL_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Your email",
    name: "email",
    type: "email",
  },
];
