import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HelpDesk from "./Help-desk";
import FilterQuestion from "./filter-question";

type Props = {
  domain_id: string;
};

const BotTrainingForm = ({ domain_id }: Props) => {
  return (
    <div className="w-full flex  flex-col gap-5 items-start">
      <div className="w-full flex flex-col gap-2">
        <h2 className="font-bold text-2xl">Bot Training</h2>
        <p className="text-sm font-light">
          Set FAQ questions, creae questions for capturing lead information and
          train your bot to act the way you want it to.
        </p>
      </div>
      <Tabs defaultValue="help_desk" className="w-full">
        <TabsList className="w-fit flex gap-3 justify-start h-fit">
          <TabsTrigger value="help_desk" className="p-2 px-4">
            Help desk
          </TabsTrigger>
          <TabsTrigger value="questions" className="p-2 px-4">
            Questions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="help_desk">
          <HelpDesk domain_id={domain_id} />
        </TabsContent>
        <TabsContent value="questions">
          <FilterQuestion domain_id={domain_id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BotTrainingForm;
