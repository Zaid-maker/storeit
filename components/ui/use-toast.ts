// Mock implementation of use-toast
export function useToast() {
  return {
    toast: () => {},
    dismiss: (toastId?: string) => {},
  };
}
