"use client";

import Section from "@/components/section";
import { DarkMode } from "@/components/themes-placeholder/darkmode";
import { LightMode } from "@/components/themes-placeholder/lightmode";
import { SystemMode } from "@/components/themes-placeholder/systemmode";
import useThemeMode from "@/hooks/use-theme-mode";
import { cn } from "@/lib/utils";

const ThemeModeSetting = () => {
  const { setTheme, theme } = useThemeMode();

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-5 lg:gap-10 gap-6">
      <div className="lg:col-span-1">
        <Section
          label="Interface theme"
          message="Select or customize your UI theme."
        />
      </div>
      <div className="lg:col-span-4 flex flex-col md:!flex-row gap-5 items-start">
        <div
          className={cn(
            "rounded-3xl overflow-hidden cursor-pointer border-2 border-transparent",
            {
              "border-orange": theme == "system",
            }
          )}
          onClick={() => setTheme("system")}
        >
          <SystemMode />
        </div>
        <div
          className={cn(
            "rounded-3xl overflow-hidden cursor-pointer border-2 border-transparent",
            {
              "border-orange": theme == "light",
            }
          )}
          onClick={() => setTheme("light")}
        >
          <LightMode />
        </div>
        <div
          className={cn(
            "rounded-3xl overflow-hidden cursor-pointer border-2 border-transparent",
            {
              "border-orange": theme == "dark",
            }
          )}
          onClick={() => setTheme("dark")}
        >
          <DarkMode />
        </div>
      </div>
    </div>
  );
};

export default ThemeModeSetting;
