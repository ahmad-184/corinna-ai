export type UserRegistrationProps = {
  id?: string;
  type?: "email" | "text" | "password" | "color" | "number";
  inputType: "select" | "input" | "checkbox" | "radio" | "textarea";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder?: string;
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

export const APPOINTMENT_TIME_SLOT = [
  {
    slot: "3:30pm",
  },
  {
    slot: "4:00pm",
  },
  {
    slot: "4:30pm",
  },
  {
    slot: "5:00pm",
  },
  {
    slot: "5:30pm",
  },
  {
    slot: "6:00pm",
  },
];

export const ADD_CREDIT_FORM = [
  {
    id: "1",
    value: "100",
    title: "100 Credits",
    description: "$0.10 per credit",
    price: "10",
  },
  {
    id: "2",
    value: "500",
    title: "500 Credits",
    description: "$0.09 per credit",
    price: "45",
  },
  {
    id: "3",
    value: "1000",
    title: "1000 Credits",
    description: "$0.08 per credit",
    price: "80",
  },
];
