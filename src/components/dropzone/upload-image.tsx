"use client";

import useUpload from "@/hooks/use-upload";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { EditIcon, Trash } from "lucide-react";
import { Spinner } from "../spinner";

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
    if (!value) return;
    setPreview(value);
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
      toast.success("File uploaded");
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
    <div className="w-full flex items-center gap-5">
      <div className="flex-1 flex items-center gap-2 rounded-lg">
        <div
          style={{ width: "100%" }}
          {...getRootProps({ className: "dropzone" })}
        >
          <input {...getInputProps()} />
          <Label
            htmlFor="upload-button"
            className="flex rounded-lg bg-cream dark:bg-zinc-800 dark:text-zinc-300 pr-3 w-full gap-2 flex-1 p-3 text-gray-600 cursor-pointer font-semibold items-center text-sm"
          >
            <EditIcon size={24} />
            {!isUploading && files[0]?.name ? (
              files[0].name
            ) : isUploading ? (
              <div className="flex items-center gap-2">
                <Spinner size="w-5 h-5" noPadding={true} />
                Uploading...
              </div>
            ) : (
              "Edit image"
            )}
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "border overflow-hidden relative rounded-full dark:bg-gray-800 bg-gray-100",
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
                className="object-cover w-full"
                fill
              />
            </div>
          )}
        </div>
        {/* <div className="flex flex-col gap-2">For more stuff</div> */}
      </div>
    </div>
  );
};

export default UploadImage;
