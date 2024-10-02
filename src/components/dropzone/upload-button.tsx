"use client";

import useUpload from "@/hooks/use-upload";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { EditIcon } from "lucide-react";
import { Spinner } from "../spinner";

const UploadButton = ({
  max_file = 1,
  maxSize = 1,
  getValue,
  value,
  className,
  getPreview,
}: {
  max_file?: number;
  maxSize?: number;
  getValue: (url: string, file?: File[]) => void;
  value?: string | null | undefined;
  className?: string;
  getPreview?: (url: string) => void;
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
    <div
      style={{ width: "100%", height: "100%" }}
      {...getRootProps({ className: "dropzone" })}
    >
      <Label
        htmlFor="upload-button"
        className={cn(
          "flex rounded-lg bg-cream dark:bg-zinc-800 dark:text-zinc-300 pr-3 w-full gap-2 flex-1 p-3 text-gray-600 cursor-pointer font-semibold items-center text-sm",
          className
        )}
      >
        <input {...getInputProps()} />
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
  );
};

export default UploadButton;
