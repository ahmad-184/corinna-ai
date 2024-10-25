import { validateUser } from "@/actions/auth";
import { db } from "@/lib/db";
import DomainSettingsForm from "./domain-settings-form";
import { redirect } from "next/navigation";
import BotTrainingForm from "./bot-training-form";
import CodeSnippet from "./code-snippet";
import ChatbotSettings from "./chatbot-settings";
import Products from "./products";

type Props = { domain: string };

const DomainSettings = async ({ domain }: Props) => {
  const user = await validateUser();

  const data = await db.domain.findFirst({
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
          helpdesk: true,
          avatar: true,
          company_name: true,
          watermark: true,
          name: true,
        },
      },
      helpdesk: {
        select: {
          answer: true,
          id: true,
          question: true,
        },
      },
    },
  });

  if (!data || !data.chatBot) return redirect("/dashboard");

  return (
    <div className="flex w-full flex-col gap-10">
      <CodeSnippet id={data.chatBot.id} />
      <DomainSettingsForm domain={data} subscription={user.subscription} />
      <ChatbotSettings
        chatbot={data.chatBot}
        helpdesk={data.helpdesk}
        subscription={user.subscription}
      />
      <BotTrainingForm domain_id={data.id} />
      <Products domain_id={data.id} />
    </div>
  );
};

export default DomainSettings;
