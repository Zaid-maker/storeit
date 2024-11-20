import React from "react";

interface ToastRootProps {
  type?: "default" | "destructive" | "success";
  duration?: number;
}

export interface ToastAction {
  altText: string;
  onClick: () => void;
}

// Mock implementation of use-toast
export function useToast() {
  return {
    toast: () => {},
    dismiss: () => {},
  };
}

type ToastActionElement = React.ReactElement<ToastAction>

export type ToastProps = Partial<
  Pick<
    ToastRootProps,
    "type" | "duration"
  >
> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}
