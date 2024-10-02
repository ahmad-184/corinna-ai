import CalIcon from "@/icons/cal-icon";
import ChatIcon from "@/icons/chat-icon";
import DashboardIcon from "@/icons/dashboard-icon";
import EmailIcon from "@/icons/email-icon";
import IntegrationsIcon from "@/icons/integrations-icon";
import SettingsIcon from "@/icons/settings-icon";

export const SIDE_BAR_MENU = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    label: "Conversations",
    icon: <ChatIcon />,
    path: "/dashboard/conversation",
  },
  {
    label: "Integrations",
    icon: <IntegrationsIcon />,
    path: "/dashboard/integration",
  },
  {
    label: "Settings",
    icon: <SettingsIcon />,
    path: "/dashboard/settings",
  },
  {
    label: "Appointments",
    icon: <CalIcon />,
    path: "/dashboard/appointment",
  },
  {
    label: "Email Marketing",
    icon: <EmailIcon />,
    path: "/dashboard/email-marketing",
  },
];
