import { useTheme } from "next-themes";

const useThemeMode = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  return {
    theme,
    systemTheme,
    setTheme,
  };
};

export default useThemeMode;
