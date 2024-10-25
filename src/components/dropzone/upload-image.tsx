"use client";

import useUpload from "@/hooks/use-upload";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader } from "../loader";

const UploadImage = ({
  max_file = 1,
  maxSize = 1,
  getValue,
  value,
  className,
  getPreview,
  with_preview = true,
}: {
  max_file?: number;
  maxSize?: number;
  getValue: (url: string, file?: File[]) => void;
  value?: string | null | undefined;
  className?: string;
  getPreview?: (url: string) => void;
  with_preview?: boolean;
}) => {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  useEffect(() => {
    if (!preview) return;
    if (getPreview) getPreview(preview);
  }, [preview]);

  const { files, isUploading, startUpload, setFiles } = useUpload({
    max_size: maxSize,
    ref: { current: null },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
      "image/svg": [".svg"],
    },
    maxFiles: max_file,
    maxSize: maxSize ? maxSize * 1024000 : 1024000,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length) {
        setPreview(() => URL.createObjectURL(acceptedFiles[0]));
        setFiles(acceptedFiles);
      }
    },
    onDropRejected: (error) => {
      error.map((e) => {
        e.errors.map((r) => {
          if (r.code === "file-too-large") {
            toast.error(`File size too large`);
          }
        });
      });
    },
  });

  const upload = async () => {
    try {
      if (!files.length) return toast.warning("There's no file to upload");
      const res = await startUpload();
      if (!res) return toast.error("Could not upload file");
      getValue(res[0].file.secure_url, files);
      setFiles([]);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, please try again");
      setFiles([]);
      setPreview("");
    }
  };

  useEffect(() => {
    if (files.length) {
      upload();
    }
  }, [files]);

  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-4">
        <div
          style={{ width: "100%" }}
          {...getRootProps({ className: "dropzone" })}
        >
          <div
            className={cn(
              "border overflow-hidden cursor-pointer relative rounded-lg dark:bg-zinc-800 bg-zinc-100",
              className,
              {
                hidden: !with_preview,
              }
            )}
          >
            {!!preview.length && (
              <div className="relative w-full h-full" key={preview}>
                <Image
                  src={preview}
                  alt="uploaded image"
                  className="object-cover rounded-full w-full h-full"
                  fill
                />
              </div>
            )}
            {isUploading ? (
              <div className="z-50 bg-muted/40 absolute inset-0 w-full h-full backdrop-blur-lg flex items-center justify-center">
                <Loader loading={true}>
                  <></>
                </Loader>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
