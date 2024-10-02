import useChat from "@/hooks/use-chat";
import { usePathname } from "next/navigation";
import { Loader } from "../loader";
import { Switch } from "../ui/switch";

const BreadCrumb = () => {
  const pathname = usePathname();
  const { loading, chatRoom, onActivateRealtime, realtime } = useChat();

  return (
    <div className="flex flex-col">
      <div className="flex gap-5 items-center">
        <h2 className="text-3xl font-bold capitalize">
          {pathname.split("/")[3]
            ? pathname.split("/")[3]
            : pathname.split("/")[2]
            ? pathname.split("/")[2]
            : pathname.split("/")[1]}
        </h2>
        {pathname.split("/")[2] === "conversation" && chatRoom ? (
          <>
            <Loader loading={loading}>
              <Switch
                defaultChecked={realtime}
                onCheckedChange={(e) => onActivateRealtime(e)}
                className="data-[state=checked]:bg-orange data-[state=unchecked]:bg-peach"
              />
            </Loader>
          </>
        ) : null}
      </div>
      <p className="text-muted-foreground text-sm max-w-[600px]">
        {!!pathname.split("/")[1]?.startsWith("dashboard") &&
          !pathname.split("/")[2] &&
          "A detailed overview of your metrics, usage, customers and more."}
        {!!pathname.split("/")[2]?.startsWith("settings") &&
          !pathname.split("/")[3] &&
          "Manage your account settings, preferences and integrations."}
        {!!pathname.split("/")[2]?.startsWith("settings") &&
        pathname.split("/")[3]?.length
          ? "Modify domain settings, change chatbot options, enter sales questions and train your bot to do what you want it to."
          : ""}
        {!!pathname.split("/")[2]?.startsWith("appointments") &&
          "View and edit all your appointments."}
        {!!pathname.split("/")[2]?.startsWith("email-marketing") &&
          "Send bulk emails to your customers."}
        {!!pathname.split("/")[2]?.startsWith("integration") &&
          "Connect third-party applications into Corinna-AI."}
      </p>
    </div>
  );
};
export default BreadCrumb;
