import CustomDialog from "@/components/custom/custom-dialog";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, ArrowRightIcon, CloudIcon } from "lucide-react";
import Image from "next/image";
import IntegrationModalBody from "./integration-modal-body";

type Props = {
  connections: { stripe: boolean };
  title: string;
  description: string;
  logo: string;
  name: "stripe";
};

const IntegrationModal = ({
  connections,
  description,
  logo,
  name,
  title,
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="px-3 py-2 h-fit cursor-pointer flex gap-2 hover:bg-muted">
          <CloudIcon />
          {!!connections[name] ? "connected" : "connect"}
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <div className="flex justify-center gap-3">
          <Image
            src={`http://localhost:3000/favicon.png`}
            alt="corinna logo"
            className="w-12 h-12 rounded-md"
            width={50}
            height={50}
          />
          <div className="text-zinc-400 h-full flex flex-col justify-center">
            <ArrowLeftIcon size={20} />
            <ArrowRightIcon size={20} />
          </div>
          <div className="">
            <Image
              src={`http://localhost:3000/logos/${logo}`}
              alt={`${name} logo`}
              className="w-12 h-12 rounded-md"
              width={50}
              height={50}
            />
          </div>
        </div>
        <DialogHeader className="flex items-center">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            <p className="max-w-sm">{description}</p>
          </DialogDescription>
        </DialogHeader>
        <Separator orientation="horizontal" />
        <IntegrationModalBody connections={connections} type={name} />
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationModal;
