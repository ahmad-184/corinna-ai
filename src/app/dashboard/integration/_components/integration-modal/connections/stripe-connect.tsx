"use client";

import ButtonWithLoaderAndProgress from "@/components/button-with-loader-and-progress-bar";
import useStripe from "@/hooks/stripe/use-stripe";
import { BadgeCheckIcon } from "lucide-react";

type Props = {
  connected: boolean;
};
const StripeConnect = ({ connected }: Props) => {
  const { onStripeConnectLoading, onStripeConnect } = useStripe();

  return (
    <>
      <ButtonWithLoaderAndProgress
        loading={onStripeConnectLoading}
        onClick={() => {
          !connected && onStripeConnect();
        }}
      >
        {!connected ? (
          "Connect"
        ) : (
          <div className="w-full flex items-center">
            <BadgeCheckIcon />
          </div>
        )}
      </ButtonWithLoaderAndProgress>
    </>
  );
};
export default StripeConnect;
