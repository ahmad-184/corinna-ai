import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { INTEGRATION_LIST_ITEMS } from "@/constants/integrations";
import Image from "next/image";
import IntegrationModal from "./integration-modal";

type Props = {
  connections: {
    stripe: boolean;
  };
};

const IntegrationList = ({ connections }: Props) => {
  return (
    <div className="flex-1 grid grid-cols-1 content-start lg:grid-cols-3 gap-3">
      {INTEGRATION_LIST_ITEMS.map((e, i) => (
        <Card key={i}>
          <CardContent className="flex flex-col p-5 gap-2">
            <div className="flex justify-between ">
              <div className="flex w-full flex-col gap-1 justify-between items-start">
                <div>
                  <Image
                    src={`http://localhost:3000/logos/${e.logo}`}
                    alt="stripe logo"
                    className="w-10 h-10 rounded-md"
                    width={40}
                    height={40}
                  />
                </div>
                <h2 className="font-bold capitalize">{e.name}</h2>
              </div>
              <IntegrationModal
                connections={connections}
                title={e.title}
                description={e.modalDescription}
                logo={e.logo}
                name={e.name}
              />
            </div>
            <CardDescription>{e.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IntegrationList;
