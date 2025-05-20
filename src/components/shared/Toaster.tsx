// src\components\shared\Toaster.tsx
"use client";
import ReactToaster, {
  useState as useStateToaster,
  useEffect as useEffectToaster,
  useCallback as useCallbackToaster,
} from "react";

interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastIdInternal = 0;
const listenersInternal: Array<(toast: Omit<ToastMessage, "id">) => void> = [];
export const toast = {
  show: (message: string, type: ToastMessage["type"] = "info") => {
    listenersInternal.forEach((listener) => listener({ message, type }));
  },
  success: (message: string) => toast.show(message, "success"),
  error: (message: string) => toast.show(message, "error"),
  info: (message: string) => toast.show(message, "info"),
};
export function Toaster() {
  const [toasts, setToasts] = useStateToaster<ToastMessage[]>([]);

  const addToast = useCallbackToaster((toastOpts: Omit<ToastMessage, "id">) => {
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: toastIdInternal++, ...toastOpts },
    ]);
  }, []);

  useEffectToaster(() => {
    listenersInternal.push(addToast);
    return () => {
      const index = listenersInternal.indexOf(addToast);
      if (index > -1) {
        listenersInternal.splice(index, 1);
      }
    };
  }, [addToast]);

  useEffectToaster(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((currentToasts) => currentToasts.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-2">
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={`px-4 py-3 rounded-md shadow-lg text-sm font-medium
            ${toastItem.type === "success" ? "bg-green-500 text-white" : ""}
            ${toastItem.type === "error" ? "bg-red-500 text-white" : ""}
            ${toastItem.type === "info" ? "bg-blue-500 text-white" : ""}
            animate-pulse-once`}
          role="alert"
        >
          {toastItem.message}
        </div>
      ))}
    </div>
  );
}
