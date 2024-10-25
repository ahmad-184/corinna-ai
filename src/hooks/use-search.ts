import { Value } from "@radix-ui/react-select";
import debounce from "lodash.debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Props = {
  duration: number;
  query: string;
};

const useSearch = ({ duration = 500, query }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = searchParams.get(query);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const debouncedSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`${pathname}?${createQueryString(query, e.target.value)}`);
  }, duration);

  return {
    onChangeValue: debouncedSearch,
    value,
  };
};

export default useSearch;
