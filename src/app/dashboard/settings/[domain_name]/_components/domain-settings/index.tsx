import { validateUser } from "@/actions/auth";
import { db } from "@/lib/db";
import DomainSettingsForm from "./domain-settings-form";
import { redirect } from "next/navigation";
import BotTrainingForm from "./bot-training-form";

type Props = { domain: string };

const DomainSettings = async ({ domain }: Props) => {
  const user = await validateUser();

  const data = await db.user.findUnique({
    where: { id: user.id },
    select: {
      subscription: {
        select: { plan: true },
      },
      domains: {
        where: {
          name: { contains: domain },
        },
        select: {
          id: true,
          name: true,
          icon: true,
          chatBot: {
            select: {
              id: true,
              welcomeMessage: true,
              icon: true,
            },
          },
        },
      },
    },
  });

  if (!data?.domains || !data?.domains[0] || !data?.domains[0].chatBot)
    return redirect("/dashboard");

  return (
    <div className="flex w-full flex-col gap-10">
      <DomainSettingsForm data={data} />
      <BotTrainingForm domain_id={data.domains[0].id} />
    </div>
  );
};

export default DomainSettings;
