import ClientEnvironmentVars, {
  ClientEnvironmentVarsType,
} from "./client-environment-vars";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryClientProvider from "./query-client-provider";
import { ThemeProvider } from "./theme-provider";

export const Providers = ({
  children,
  cloudinary_api_key,
  cloudinary_cloud_name,
  cloudinary_preset,
  cloudinary_upload_folder,
}: { children: React.ReactNode } & ClientEnvironmentVarsType) => {
  return (
    <QueryClientProvider>
      <ClientEnvironmentVars
        cloudinary_api_key={cloudinary_api_key}
        cloudinary_cloud_name={cloudinary_cloud_name}
        cloudinary_preset={cloudinary_preset}
        cloudinary_upload_folder={cloudinary_upload_folder}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </ClientEnvironmentVars>
    </QueryClientProvider>
  );
};
