"use client";

import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useEnvVars } from "@/providers/client-environment-vars";
import { z } from "zod";

// upload files using cloudinary storage
("---------------------------------------------------");

interface Props {
  ref?: React.MutableRefObject<HTMLInputElement | null>;
  max_size?: number;
}

type uploadedFileTypes = {
  asset_id: string;
  bytes: number;
  created_at: string;
  etag: string;
  existing: boolean;
  folder: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  url: string;
  signature: string;
  type: string;
  version: number;
  version_id: string;
  width: number;
  tags: string[];
};

export const ACCEPTED_FILE_TYPE = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/svg",
];

const validateFile = (file: File, MAX_UPLOAD_SIZE: number) => {
  const { success, error } = z
    .any()
    .refine((file) => file?.type.startsWith("image/"), {
      message: `Incorrect file type`,
    })
    .refine((file) => file?.size <= MAX_UPLOAD_SIZE, {
      message: `Your file size must be less than ${`${MAX_UPLOAD_SIZE}`[0]}`,
    })
    .refine((file) => ACCEPTED_FILE_TYPE.includes(file?.type), {
      message: "Only JPG, JPEG, SVG & PNG are accepted file formats",
    })
    .safeParse(file);

  if (!success) return { error: error?.errors[0].message };

  return {};
};

export const useUpload = ({ ref, max_size = 3 }: Props) => {
  const [files, setFiles] = useState<File[] | []>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const removeFiles = () => {
    setFiles([]);
    if (ref?.current) {
      ref.current.value = "";
    }
  };

  const {
    cloudinary_api_key,
    cloudinary_cloud_name,
    cloudinary_preset,
    cloudinary_upload_folder,
  } = useEnvVars();

  useEffect(() => {
    function handleGetFiles(e: any) {
      if (e.target.files?.length) {
        const filesArr = e.target.files as File[];
        let isValid = true;
        for (let f of filesArr) {
          const { error } = validateFile(f, 1024000 * max_size);
          if (error) {
            toast.error(error);
            isValid = false;
          }
        }
        if (isValid) setFiles(filesArr);
        else setFiles([]);
      }
    }

    if (ref?.current) {
      ref.current.addEventListener("change", handleGetFiles);
    }
    return () => {
      ref?.current?.removeEventListener("change", handleGetFiles);
    };
  }, [ref, ref?.current]);

  const startUpload = async () => {
    try {
      if (!files.length) return;

      let uploadedFiles = [];
      setIsUploading(true);
      for (let file of files) {
        const formData = new FormData();
        const fileType = file.type;
        const isImage = Boolean(fileType.startsWith("image"));

        const { error } = validateFile(file, 1024000 * max_size);
        if (error) {
          toast.error(error);
          return;
        }

        formData.append("file", file);
        formData.append("upload_preset", cloudinary_preset);
        formData.append("api_key", cloudinary_api_key);
        formData.append("cloud_name", cloudinary_cloud_name);
        formData.append("folder", cloudinary_upload_folder);
        formData.append("public_id", `${file.name}-${uuid()}`);

        try {
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/${
              isImage ? "image" : "raw"
            }/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent: any) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                if (percent < 100) {
                  setProgress(percent);
                }
              },
            }
          );

          setProgress(0);
          uploadedFiles.push({
            file: res.data as uploadedFileTypes,
            type: fileType,
          });
        } catch (err) {
          toast.error("Something went wrong, please try again");
          console.log(err);
        }
      }
      return uploadedFiles;
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, please try again");
    } finally {
      setIsUploading(false);
      setFiles([]);
      if (ref?.current) {
        ref.current.value = "";
      }
    }
  };

  return {
    files,
    startUpload,
    isUploading,
    progress,
    setFiles,
    removeFiles,
  };
};

export default useUpload;
