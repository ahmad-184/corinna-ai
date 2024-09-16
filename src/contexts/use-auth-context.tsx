"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ContextType = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
};

const Context = createContext<ContextType>({
  currentStep: 0,
  setCurrentStep: () => {},
});

export const useAuthContext = () => useContext(Context);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (window)
      window.localStorage.setItem("auth_step", currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    if (window) {
      const step = window.localStorage.getItem("auth_step") as string;
      setCurrentStep(parseFloat(step) || 1);
    }
  }, []);

  return (
    <Context.Provider
      value={{
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AuthProvider;
