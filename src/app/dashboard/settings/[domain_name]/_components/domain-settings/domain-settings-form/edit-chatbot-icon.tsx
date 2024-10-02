import UploadButton from "@/components/dropzone/upload-button";
import Section from "@/components/section";
import { Button } from "@/components/ui/button";
import { BotIcon } from "@/icons/bot-icon";
import { TrashIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  getValue: (url: string, file?: File[]) => void;
  icon: string | null | undefined;
};

const EditChatbotIcon = ({ icon, getValue }: Props) => {
  return (
    <div className="w-full flex flex-col gap-3">
      <Section label="Chatbot icon" message="Change the icon for the chatbot" />
      <div className="mb-2 max-w-sm">
        <div className="w-full max-w-sm">
          <UploadButton
            getValue={getValue}
            maxSize={1}
            max_file={1}
            value={icon}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-1">
          * Recommended size is 300*300, Size less than 1mb
        </p>
      </div>
      <div className="flex items-center gap-4">
        {!icon ? (
          <div className="bg-orange w-fit h-fit rounded-full p-3 flex">
            <BotIcon />
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <Image
              src={icon}
              alt="chatbot icon"
              width={80}
              height={80}
              className="w-[60px] h-[60px] object-cover rounded-full"
            />
            <Button
              type="button"
              size={"icon"}
              variant={"secondary"}
              onClick={() => getValue("")}
            >
              <TrashIcon size={22} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditChatbotIcon;
