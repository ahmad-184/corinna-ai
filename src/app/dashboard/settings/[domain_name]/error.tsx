"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-full flex flex-col gap-6 rounded-lg bg-red-500 p-2 md:p-6">
      <h2 className="text-5xl mt-6 font-bold">Error</h2>
      <p className="font-medium">
        Sadly something wrong happend, please try reset. If error keep happening
        contact our support team.
      </p>
      <Button onClick={() => reset()} className="w-[250px]">
        Try Reset
      </Button>
    </div>
  );
}
