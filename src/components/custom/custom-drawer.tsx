import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  title: string;
  description: string;
};
const CustomDrawer = ({ children, content, title, description }: Props) => {
  return (
    <Drawer>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="container flex flex-col items-center gap-2 pb-10 mt-4">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
export default CustomDrawer;
