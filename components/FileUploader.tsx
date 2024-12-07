"use client";

import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
// import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
// import { useToast } from "@/hooks/use-toast";
// import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  return <div>FileUploader</div>;
};

export default FileUploader;
