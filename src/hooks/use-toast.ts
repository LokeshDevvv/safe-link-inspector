
// Simple toast hook implementation
import { useState } from "react";

export type ToastVariant = "default" | "destructive";

export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: React.ReactNode;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const toast = ({ title, description, variant = "default", ...props }: Toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    console.log(`TOAST: ${variant} - ${title} - ${description}`);
    
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, title, description, variant, ...props },
    ]);
    
    // In a real implementation, we would also auto-dismiss after a delay
    // For simplicity, we'll just add it to the array
  };

  return { toast, toasts };
};

export const toast = ({ title, description, variant = "default" }: Toast) => {
  console.log(`TOAST: ${variant} - ${title} - ${description}`);
};
