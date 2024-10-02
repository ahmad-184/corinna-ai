import { getUserDomains } from "@/actions/domain";
import SidebarWrapper from "./sidebar-wrapper";
import SidebarContent from "./sidebar-content";

const Sidebar = async () => {
  const { data: domains } = await getUserDomains({});

  return (
    <SidebarWrapper>
      <SidebarContent domains={domains} />
    </SidebarWrapper>
  );
};

export default Sidebar;
