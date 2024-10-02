"use client";

import Section from "@/components/section";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = { id: string };

const CodeSnippet = ({ id }: Props) => {
  const [open, setOpen] = useState(false);

  let snippet = `
    const iframe = document.createElement("iframe");

    const iframeStyles = (styleString) => {
      const style = document.createElement("style");
      style.textContent = styleString;
      document.head.append(style);
    };

    iframeStyles(
      ".chat-frame {position: fixed;bottom: 30px;right: 30px;border: none;border-radius: 50%;box-shadow: 0 20px 25px -5px rgb(0 0 0 / 14%), 0 8px 10px -6px rgb(0 0 0 / 11%);}"
    );

    iframe.src = "http://localhost:3000/chatbot";
    iframe.classList.add("chat-frame");
    iframe.hidden = true;

    document.body.appendChild(iframe);

    window.addEventListener("message", (e) => {
      if (e.origin !== "http://localhost:3000") return null;
      let dimensions = JSON.parse(e.data);
      if (dimensions.show) {
        iframe.hidden = false;
      }
      iframe.width = dimensions.width;
      iframe.height = dimensions.height;
      if (dimensions.open === true) {
        iframeStyles(
          ".chat-frame {border-radius: 15px;transition: width 0.2s, height 0.2s, border-radius 0.1s;}"
        );
      } else {
        iframeStyles(
          ".chat-frame {border-radius: 50%;transition: width 0.0s, height 0.0s, border-radius 0.2s;}"
        );
      }
      iframe.contentWindow.postMessage(
        "${id}",
        "http://localhost:3000/"
      );
    });

    document.addEventListener("click", (e) => {
      iframe.contentWindow.postMessage(
        JSON.stringify({ open: false }),
        "http://localhost:3000/"
      );
      iframe.width = 60;
      iframe.height = 60;
    });
        `;

  return (
    <div className="w-full flex flex-col gap-3">
      <Section
        label="Code snippet"
        message="Copy and paste this code snippet into the header tag of your website"
      />
      <div
        className={cn(
          "bg-zinc-100 dark:bg-zinc-800 rounded-lg inline-block relative overflow-y-hidden",
          {
            "max-h-[400px]": !open,
          }
        )}
      >
        <div className="absolute top-5 right-5 text-muted-foreground cursor-pointer">
          <CopyIcon
            onClick={() => {
              window.navigator.clipboard.writeText(snippet);
              toast.success("Copied to clipboard", {
                description: "You can now paste the code inside your website",
              });
            }}
          />
        </div>
        <pre className="w-full overflow-x-auto max-w-full pr-10">
          <code className="text-muted-foreground">{snippet}</code>
        </pre>
        {!open && (
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="absolute bg-gradient-to-t from-black/10 dark:from-black/20 to-transparent flex items-center py-2 cursor-pointer justify-center bottom-0 left-0 right-0"
          >
            {!open && (
              <ChevronDownIcon className="text-zinc-600 dark:text-zinc-400 z-10" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeSnippet;
