import { Plans } from "@prisma/client";
import ProgressBar from "./progress-bar";

type Props = {
  plan: Plans;
  credits: number;
  spent_credits: number;
  domains: number;
  clients: number;
};

const PlanUsage = ({
  clients,
  credits,
  plan,
  spent_credits,
  domains,
}: Props) => {
  return (
    <div className="flex flex-col gap-5 py-5">
      <ProgressBar
        end={credits}
        label="Email Credits"
        credits={credits - spent_credits}
      />
      <ProgressBar
        end={
          plan === "STANDARD"
            ? 1
            : plan === "PRO"
            ? 2
            : plan === "ULTIMATE"
            ? 5
            : 1
        }
        label="Domains"
        credits={domains}
      />
      <ProgressBar
        end={
          plan === "STANDARD"
            ? 10
            : plan === "PRO"
            ? 50
            : plan === "ULTIMATE"
            ? 500
            : 1
        }
        label="Contacts"
        credits={clients}
      />
    </div>
  );
};

export default PlanUsage;
